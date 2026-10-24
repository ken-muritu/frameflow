"""
FrameFlow Frame Extractor
Handles video download (yt-dlp) and frame extraction (FFmpeg + OpenCV).
"""

import os
import asyncio
import tempfile
import subprocess
from pathlib import Path
from typing import List, Dict, Any


class FrameExtractor:
    def __init__(self):
        self.temp_dir = tempfile.mkdtemp(prefix="frameflow_")

    async def download(self, url: str, platform: str) -> str:
        """Download video using yt-dlp. Returns path to downloaded file."""
        output_path = os.path.join(self.temp_dir, f"{hash(url)}.mp4")
        
        if os.path.exists(output_path):
            return output_path
        
        cmd = [
            "yt-dlp",
            "--format", "bestvideo[height<=1080]+bestaudio/best[height<=1080]",
            "--merge-output-format", "mp4",
            "--output", output_path,
            "--no-playlist",
            "--socket-timeout", "30",
            url,
        ]
        
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        _, stderr = await proc.communicate()
        
        if proc.returncode != 0:
            raise RuntimeError(f"yt-dlp failed: {stderr.decode()}")
        
        return output_path

    async def extract_frames(
        self,
        video_path: str,
        mode: str,
        options: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        """Extract frames from video based on mode."""
        import cv2
        
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = total_frames / fps if fps > 0 else 0
        
        frames = []
        
        if mode == "interval":
            interval = options.get("interval_seconds", 30)
            timestamps = [i * interval for i in range(int(duration / interval) + 1)]
        elif mode == "timestamps":
            timestamps = options.get("timestamps", [])
        else:
            timestamps = [i for i in range(0, int(duration), max(1, int(fps)))]
        
        max_frames = options.get("max_frames", 50)
        
        for ts in timestamps[:max_frames]:
            cap.set(cv2.CAP_PROP_POS_MSEC, ts * 1000)
            ret, frame = cap.read()
            
            if not ret:
                continue
            
            frame_path = os.path.join(self.temp_dir, f"frame_{int(ts * 1000)}.jpg")
            cv2.imwrite(frame_path, frame, [cv2.IMWRITE_JPEG_QUALITY, 95])
            
            frames.append({
                "timestamp": ts,
                "path": frame_path,
                "width": int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
                "height": int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)),
            })
        
        cap.release()
        return frames

    async def cleanup(self, video_path: str):
        """Remove downloaded video to save disk space."""
        try:
            if os.path.exists(video_path):
                os.remove(video_path)
        except Exception:
            pass
