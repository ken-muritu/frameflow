# FrameFlow — API Reference

All Next.js API routes live under `/api/`. The Python worker runs as a separate service (see [python-worker.md](./python-worker.md)).

---

## Authentication

All protected API routes require the user to be authenticated via Supabase session cookie.  
Public API usage (for Business/API tier) uses a Bearer token:

```
Authorization: Bearer ff_live_...
```

---

## Next.js API Routes

### `POST /api/extract`

Start a new frame extraction job.

**Request**

```json
{
  "url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
  "mode": "ai",
  "options": {
    "max_frames": 20,
    "interval_seconds": 5
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | ✅ | Video URL from any supported platform |
| `mode` | string | — | `"ai"` (default), `"interval"`, or `"scene"` |
| `options` | object | — | Additional extraction options |
| `options.max_frames` | number | — | Max frames to return (default: 20) |
| `options.interval_seconds` | number | — | Seconds between frames for `interval` mode |

**Response `202 Accepted`**

```json
{
  "job_id": "job_1713000000000_a1b2c3d4e",
  "status": "queued",
  "platform": "youtube",
  "estimated_duration_seconds": 45,
  "created_at": "2026-04-13T11:33:00.000Z"
}
```

**Error responses**

| Status | Reason |
|--------|--------|
| `400` | Missing `url` or unsupported platform |
| `500` | Worker failed to accept the job |

---

### `GET /api/jobs/[id]`

Poll the status of a running extraction job.

**Response**

```json
{
  "job_id": "job_1713000000000_a1b2c3d4e",
  "status": "analyzing",
  "progress": 60,
  "platform": "youtube",
  "url": "https://youtube.com/watch?v=...",
  "frame_count": null,
  "error": null
}
```

**Status values**

| Status | Progress | Meaning |
|--------|----------|---------|
| `queued` | 0% | Job accepted, not started |
| `downloading` | 10% | yt-dlp downloading video |
| `extracting` | 30% | OpenCV pulling frames |
| `analyzing` | 60% | CLIP scoring frames |
| `captioning` | 85% | Whisper transcribing audio |
| `complete` | 100% | All frames ready |
| `failed` | — | Error occurred — check `error` field |

---

### `GET /api/frames/[job_id]`

Retrieve all extracted frames once a job is complete.

**Response**

```json
{
  "job_id": "job_1713000000000_a1b2c3d4e",
  "total": 12,
  "frames": [
    {
      "id": "frame_001",
      "timestamp": 4.2,
      "score": 0.94,
      "url": "https://xxxx.supabase.co/storage/v1/object/public/frames/...",
      "caption": "A developer types code on a laptop in a bright studio",
      "width": 1920,
      "height": 1080
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | float | Time in seconds where the frame was captured |
| `score` | float (0–1) | CLIP visual quality score |
| `url` | string | Public Supabase Storage URL |
| `caption` | string | Whisper-generated caption from audio at this timestamp |

**Error responses**

| Status | Reason |
|--------|--------|
| `404` | Job ID not found |
| `409` | Job not yet complete |

---

## Python Worker Routes

The Python FastAPI worker is an internal service. Next.js API routes proxy to it. Direct access requires `X-API-Key` header.

### `GET /health`

```json
{ "status": "ok", "service": "frameflow-worker", "version": "1.0.0" }
```

### `POST /extract`

Same request body as `/api/extract`. Returns `202` with `job_id`.

### `GET /jobs/{job_id}`

Returns job status without the `frames` array (lightweight poll).

### `GET /frames/{job_id}`

Returns complete frame data once job status is `complete`.

---

## Error Format

All errors return a consistent JSON body:

```json
{ "error": "Human-readable error message" }
```

---

## Rate Limits (by plan)

| Plan | Extractions/day | API calls/mo |
|------|----------------|--------------|
| Free | 10 | — |
| Pro | Unlimited | — |
| Business | Unlimited | 500 |
| API Tier | Unlimited | Pay per call ($0.02) |
