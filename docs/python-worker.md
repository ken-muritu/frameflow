# FrameFlow — Python Worker

The Python worker is a standalone FastAPI service responsible for all heavy video processing. The Next.js app communicates with it over HTTP.

---

## Stack

| Library | Version | Purpose |
|---------|---------|---------|
| `fastapi` | 0.111.0 | HTTP API framework |
| `uvicorn` | 0.30.1 | ASGI server |
| `yt-dlp` | 2024.5.27 | Video download (20+ platforms) |
| `opencv-python-headless` | 4.10.0 | Frame extraction |
| `Pillow` | 10.3.0 | Image processing |
| `openai-whisper` | 20231117 | Audio transcription → captions |
| `torch` | 2.3.0 | PyTorch (CLIP + Whisper backbone) |
| `torchvision` | 0.18.0 | Image transforms for CLIP |
| `transformers` | 4.41.2 | CLIP model (OpenAI via HuggingFace) |
| `celery` | 5.4.0 | Async task queue (optional, for scale) |
| `redis` | 5.0.6 | Celery broker (optional) |
| `supabase` | 2.4.3 | Frame upload to Supabase Storage |
| `boto3` | 1.34.131 | AWS S3 (optional alternative storage) |
| `httpx` | 0.27.0 | Async HTTP client |
| `python-dotenv` | 1.0.1 | `.env` loading |
| `pydantic` | 2.7.3 | Request/response validation |
| `numpy` | 1.26.4 | Frame array operations |

---

## File Structure

```
python/
├── main.py          # FastAPI app, routes, job state
├── extractor.py     # yt-dlp download + OpenCV frame extraction
├── ai_pipeline.py   # CLIP scoring + Whisper captioning
└── requirements.txt
```

---

## Running Locally

```bash
cd python

# Create a virtual environment (recommended)
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Verify it's running:
```bash
curl http://localhost:8000/health
# {"status":"ok","service":"frameflow-worker","version":"1.0.0"}
```

---

## AI Pipeline — Step by Step

### Step 1 — Download (`yt-dlp`)

`extractor.py` uses `yt-dlp` to download the video to a temp file:

```python
ydl_opts = {
    'format': 'bestvideo[height<=1080]+bestaudio/best',
    'outtmpl': '/tmp/frameflow_%(id)s.%(ext)s',
}
```

Supports YouTube, Instagram, TikTok, X, Facebook, Vimeo, and 1000+ sites.

### Step 2 — Frame extraction (`OpenCV`)

Samples frames from the downloaded video at configurable intervals:

```python
cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)
# Sample every N seconds based on mode
```

Returns a list of raw `numpy` image arrays with timestamps.

### Step 3 — AI scoring (`CLIP`)

Each frame is scored using OpenAI's CLIP model via HuggingFace `transformers`:

- Frames are embedded with the CLIP vision encoder
- A quality prompt (`"a high quality, shareable social media frame"`) is embedded with the text encoder
- Cosine similarity gives each frame a score from 0.0 to 1.0
- Top N frames are kept, sorted by score descending

### Step 4 — Captioning (`Whisper`)

Audio is transcribed using OpenAI Whisper:

- Full audio → word-level timestamps
- Each frame's timestamp is matched to the nearest Whisper segment
- That segment text becomes the frame's caption

### Step 5 — Cleanup

Temp video files are deleted after processing to avoid disk bloat.

---

## Job State

Jobs are stored in an in-memory dict (`jobs: dict`) in `main.py`. This works for single-instance deploys. For multi-instance/production scale:

1. Replace with **Redis** as the job store
2. Use **Celery** workers (already in `requirements.txt`) for async processing
3. Persist final frames to **Supabase Storage** (wired in `ai_pipeline.py`)

---

## Routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/extract` | Start extraction job (background task) |
| `GET` | `/jobs/{job_id}` | Poll job status (no frames data) |
| `GET` | `/frames/{job_id}` | Get completed frames |

All routes (except `/health`) require the `X-API-Key` header matching `WORKER_API_KEY`.

---

## Environment Variables

```env
WORKER_API_KEY=your-shared-secret
```

The worker reads this from `.env` (via `python-dotenv`). Must match the `WORKER_API_KEY` set in the Next.js app.

---

## Hardware Requirements

| Task | Minimum | Recommended |
|------|---------|-------------|
| yt-dlp download | Any CPU | Any CPU |
| OpenCV extraction | Any CPU | Any CPU |
| CLIP scoring | CPU (slow) | GPU (NVIDIA) |
| Whisper captioning | CPU (slow) | GPU (NVIDIA) |

For production, Railway GPU instances or a separate GPU machine is recommended for CLIP + Whisper. On CPU, expect ~60–120s per video.
