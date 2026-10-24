"""
FrameFlow Python Worker — FastAPI service
Handles video download, frame extraction, AI scoring, and captioning.

Run: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""

import os
import uuid
import asyncio
from typing import Optional
from fastapi import FastAPI, HTTPException, Header, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from extractor import FrameExtractor
from ai_pipeline import AIPipeline

app = FastAPI(
    title="FrameFlow Worker",
    description="Video frame extraction and AI pipeline",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WORKER_API_KEY = os.getenv("WORKER_API_KEY", "")

jobs: dict = {}

extractor = FrameExtractor()
ai_pipeline = AIPipeline()


class ExtractionRequest(BaseModel):
    job_id: str
    url: str
    platform: str
    mode: str = "ai"
    options: dict = {}


def verify_key(x_api_key: Optional[str] = None):
    if WORKER_API_KEY and x_api_key != WORKER_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")


async def run_extraction(job_id: str, url: str, platform: str, mode: str, options: dict):
    """Background task: download → extract → AI score → caption → store"""
    try:
        jobs[job_id]["status"] = "downloading"
        jobs[job_id]["progress"] = 10
        
        video_path = await extractor.download(url, platform)
        
        jobs[job_id]["status"] = "extracting"
        jobs[job_id]["progress"] = 30
        
        raw_frames = await extractor.extract_frames(
            video_path, mode, options
        )
        
        jobs[job_id]["status"] = "analyzing"
        jobs[job_id]["progress"] = 60
        
        scored_frames = await ai_pipeline.score_frames(raw_frames)
        
        jobs[job_id]["status"] = "captioning"
        jobs[job_id]["progress"] = 85
        
        captioned_frames = await ai_pipeline.add_captions(scored_frames, video_path)
        
        jobs[job_id]["status"] = "complete"
        jobs[job_id]["progress"] = 100
        jobs[job_id]["frames"] = captioned_frames
        jobs[job_id]["frame_count"] = len(captioned_frames)
        
        await extractor.cleanup(video_path)
        
    except Exception as e:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = str(e)


@app.get("/health")
def health():
    return {"status": "ok", "service": "frameflow-worker", "version": "1.0.0"}


@app.post("/extract", status_code=202)
async def start_extraction(
    body: ExtractionRequest,
    background_tasks: BackgroundTasks,
    x_api_key: Optional[str] = Header(None),
):
    verify_key(x_api_key)
    
    job_id = body.job_id or f"job_{uuid.uuid4().hex[:12]}"
    
    jobs[job_id] = {
        "job_id": job_id,
        "url": body.url,
        "platform": body.platform,
        "status": "queued",
        "progress": 0,
        "frames": [],
        "frame_count": None,
        "error": None,
    }
    
    background_tasks.add_task(
        run_extraction,
        job_id, body.url, body.platform, body.mode, body.options
    )
    
    return {"job_id": job_id, "status": "queued"}


@app.get("/jobs/{job_id}")
def get_job(job_id: str, x_api_key: Optional[str] = Header(None)):
    verify_key(x_api_key)
    
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs[job_id].copy()
    job.pop("frames", None)
    return job


@app.get("/frames/{job_id}")
def get_frames(job_id: str, x_api_key: Optional[str] = Header(None)):
    verify_key(x_api_key)
    
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs[job_id]
    
    if job["status"] != "complete":
        raise HTTPException(status_code=409, detail=f"Job is {job['status']}, not complete")
    
    return {
        "frames": job.get("frames", []),
        "total": len(job.get("frames", [])),
        "job_id": job_id,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
