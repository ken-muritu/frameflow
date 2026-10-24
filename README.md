# FrameFlow — Video Intelligence & Frame Extraction Platform

> Capture the Moments That Matter — Automatically.

Built by **Kennedy Muritu** · [muritu.top](https://www.muritu.top) · April 2026

---

## Overview

FrameFlow is an AI-powered video frame extraction platform. Paste any video URL (YouTube, Instagram, TikTok, X, Facebook, and more) and FrameFlow's AI instantly extracts your most shareable frames — captioned, branded, and formatted for every platform.

**Status:** deployed at [frameflow.vercel.app](https://frameflow.vercel.app), which opens on its sign-in page. Without the Python worker the Next.js app runs in mock mode and returns placeholder frames.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) · TypeScript · Tailwind CSS · Shadcn/UI |
| Animation | Framer Motion |
| State | Zustand · TanStack Query |
| Auth | Supabase Auth (SSR-safe) |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage |
| Payments | Stripe (subscriptions + usage-based billing) |
| AI Workers | Python · FastAPI · yt-dlp · OpenCV · Whisper · CLIP (transformers) |
| Infra | Vercel (frontend) · Railway (Python workers) · Cloudflare CDN |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│   Next.js 14 App · Tailwind CSS · Shadcn/UI · Framer Motion │
└──────────────────────────┬──────────────────────────────────┘
                           │  HTTPS
┌──────────────────────────▼──────────────────────────────────┐
│                    VERCEL (Frontend Host)                     │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Next.js App Router                                    │  │
│  │  ├── /                   Landing page                  │  │
│  │  ├── /pricing            Pricing page                  │  │
│  │  ├── /docs/api           API documentation             │  │
│  │  ├── /(auth)/login       Supabase Auth login           │  │
│  │  ├── /(auth)/signup      Supabase Auth signup          │  │
│  │  ├── /(app)/dashboard    User dashboard                │  │
│  │  ├── /(app)/extract      URL → frame extraction        │  │
│  │  ├── /(app)/gallery      Saved frames gallery          │  │
│  │  ├── /(app)/brand-kit    Brand customization           │  │
│  │  └── /(app)/settings     Account & billing             │  │
│  │                                                        │  │
│  │  Next.js API Routes                                    │  │
│  │  ├── POST /api/extract   Start extraction job          │  │
│  │  ├── GET  /api/jobs      Poll job status               │  │
│  │  └── GET  /api/frames    Retrieve completed frames     │  │
│  └────────────────────────────────────────────────────────┘  │
└──────┬──────────────────────────┬───────────────────────────┘
       │                          │
       ▼                          ▼
┌─────────────┐         ┌────────────────────┐
│  SUPABASE   │         │  RAILWAY (Worker)  │
│  ─────────  │         │  ────────────────  │
│  Auth       │         │  FastAPI (Python)  │
│  PostgreSQL │         │  ├── /health       │
│  Storage    │         │  ├── POST /extract │
└─────────────┘         │  ├── GET /jobs/:id │
                        │  └── GET /frames/:id│
       │                │                    │
       ▼                └─────────┬──────────┘
┌─────────────┐                   │
│   STRIPE    │         ┌─────────▼──────────┐
│  ─────────  │         │   AI PIPELINE      │
│  Payments   │         │  ────────────────  │
│  Webhooks   │         │  yt-dlp (download) │
│  Billing    │         │  OpenCV (frames)   │
└─────────────┘         │  CLIP (scoring)    │
                        │  Whisper (captions)│
                        └────────────────────┘
```

---

## Data Flow

```
User pastes URL
      │
      ▼
POST /api/extract (Next.js route)
      │  detects platform, generates job_id
      ▼
POST /extract (Python FastAPI worker)
      │
      ├── 1. yt-dlp downloads video  [progress: 10%]
      ├── 2. OpenCV extracts frames  [progress: 30%]
      ├── 3. CLIP scores best frames [progress: 60%]
      ├── 4. Whisper adds captions   [progress: 85%]
      └── 5. Frames stored + returned [progress: 100%]
             │
             ▼
    GET /api/frames/:job_id
             │
             ▼
    Frames displayed in gallery
    (download ZIP / brand-kit applied)
```

---

## Project Structure

```
frameflow/
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout (fonts, providers)
│   │   ├── page.tsx                 # Landing page entry
│   │   ├── globals.css              # Global Tailwind styles
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx       # Login with Supabase Auth
│   │   │   └── signup/page.tsx      # Sign up
│   │   ├── (app)/
│   │   │   ├── layout.tsx           # App shell (Sidebar + Navbar)
│   │   │   ├── dashboard/page.tsx   # Usage stats, recent extractions
│   │   │   ├── extract/page.tsx     # URL input + live extraction progress
│   │   │   ├── gallery/page.tsx     # Frame gallery with filters
│   │   │   ├── brand-kit/page.tsx   # Logo, colors, watermark settings
│   │   │   └── settings/page.tsx    # Account, billing, API keys
│   │   ├── api/
│   │   │   ├── extract/route.ts     # POST — starts extraction job via worker
│   │   │   ├── jobs/route.ts        # GET — polls job status from worker
│   │   │   └── frames/route.ts      # GET — retrieves frames for completed job
│   │   ├── pricing/page.tsx         # Public pricing page
│   │   └── docs/api/page.tsx        # API reference docs
│   ├── components/
│   │   ├── ui/                      # Shadcn/UI base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Navbar.tsx           # Top navigation bar
│   │   │   ├── Sidebar.tsx          # App sidebar (dashboard nav)
│   │   │   └── Footer.tsx           # Landing page footer
│   │   └── sections/                # Landing page sections
│   │       ├── Hero.tsx             # Hero section with URL input
│   │       ├── Features.tsx         # Feature grid
│   │       ├── HowItWorks.tsx       # Step-by-step flow
│   │       ├── Platforms.tsx        # Supported platforms grid
│   │       ├── PricingSection.tsx   # Pricing cards
│   │       ├── Stats.tsx            # Social proof stats
│   │       └── CTA.tsx              # Bottom call-to-action
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client (SSR + browser)
│   │   ├── stripe.ts                # Stripe client + helpers
│   │   └── utils.ts                 # Platform detection, cn(), helpers
│   ├── store/
│   │   └── useStore.ts              # Zustand global state
│   └── types/
│       └── index.ts                 # TypeScript interfaces & types
├── python/
│   ├── main.py                      # FastAPI app entry point
│   ├── extractor.py                 # yt-dlp download + OpenCV frame extraction
│   ├── ai_pipeline.py               # CLIP visual scoring + Whisper captioning
│   └── requirements.txt             # Python dependencies
├── vercel.json                      # Vercel deployment config
├── next.config.mjs                  # Next.js config (image domains, externals)
├── tailwind.config.ts               # Tailwind theme + custom tokens
├── components.json                  # Shadcn/UI config
└── tsconfig.json                    # TypeScript config
```

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/ken-muritu/frameflow.git
cd frameflow
npm install
```

### 2. Environment Variables

Set the variables listed under [Environment Variables](#environment-variables), for example in a local `.env.local` file (git ignores it). [docs/setup.md](docs/setup.md) walks through where each value comes from.

### 3. Run Development Server

```bash
npm run dev
# App runs at http://localhost:3000
```

### 4. Python Worker (Optional — for real extraction)

```bash
cd python
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# Worker runs at http://localhost:8000
```

> **Note:** The Next.js app works in demo/mock mode without the Python worker. It returns placeholder frames for local development.

---

## Environment Variables

The app reads these variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_MONTHLY_PRICE_ID=
STRIPE_PRO_ANNUAL_PRICE_ID=
STRIPE_BUSINESS_MONTHLY_PRICE_ID=
STRIPE_BUSINESS_ANNUAL_PRICE_ID=

# Python Worker
WORKER_API_URL=http://localhost:8000
WORKER_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=FrameFlow
```

---

## API Routes

### `POST /api/extract`
Start a new extraction job.
```json
// Request
{ "url": "https://youtube.com/watch?v=...", "mode": "ai", "options": {} }

// Response 202
{ "job_id": "job_...", "status": "queued", "platform": "youtube", "estimated_duration_seconds": 45 }
```

### `GET /api/jobs`
Poll job status by `job_id`.

### `GET /api/frames`
Retrieve extracted frames for a completed job.

---

## Python Worker — AI Pipeline

| Step | Tool | Description |
|------|------|-------------|
| Download | `yt-dlp` | Downloads video from 20+ platforms |
| Extract | `OpenCV` | Samples frames at configurable intervals |
| Score | `CLIP` (OpenAI) | Ranks frames by visual quality & relevance |
| Caption | `Whisper` | Transcribes audio, maps captions to frames |
| Cleanup | — | Deletes temp video files after processing |

**Supported platforms:** YouTube · Instagram · TikTok · X (Twitter) · Facebook · Vimeo · and more via yt-dlp.

---

## Deployment

### Frontend — Vercel

```bash
vercel deploy
```

Config is defined in `vercel.json`. Set all environment variables in the Vercel dashboard under **Project → Settings → Environment Variables**.

### Python Worker — Railway

```bash
# Deploy the /python directory as a Railway service
railway up
```

Set `WORKER_API_URL` in Vercel to point to the Railway worker URL after deploy.

---

## Pricing

| Plan | Price | Key Features |
|------|-------|-------------|
| Free | $0/mo | 10 extractions/day · 5 platforms · Basic AI |
| Pro | $12/mo | Unlimited · All platforms · Full AI · Brand kit |
| Business | $49/mo | Everything in Pro + 5 seats + API (500 calls/mo) |
| API Tier | $0.02/call | REST API · Webhooks · 99.9% SLA |

---

## Roadmap

- **v1** — Web app: URL → frames, AI ranking, brand kit, ZIP download
- **v2** — Browser extension, REST API, batch processing, LinkedIn/Spotify
- **v3** — Mobile app (React Native), one-click social posting, M-Pesa payments

---

*FrameFlow is not just a tool — it's the infrastructure for the next generation of knowledge sharing.*

**— Kennedy Muritu**

---

## Licence

Copyright © 2026 Kennedy Muritu. All rights reserved. The code is public to read, not to reuse. See [LICENSE](LICENSE).
