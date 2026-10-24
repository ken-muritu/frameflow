# FrameFlow — Architecture

## System Architecture

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
POST /api/extract  (Next.js route)
      │  detects platform, generates job_id
      ▼
POST /extract  (Python FastAPI worker)
      │
      ├── 1. yt-dlp downloads video   [progress: 10%]
      ├── 2. OpenCV extracts frames   [progress: 30%]
      ├── 3. CLIP scores best frames  [progress: 60%]
      ├── 4. Whisper adds captions    [progress: 85%]
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

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) · TypeScript · Tailwind CSS · Shadcn/UI |
| Animation | Framer Motion |
| State | Zustand · TanStack Query |
| Auth | Supabase Auth (SSR-safe via `@supabase/ssr`) |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage (public `frames` bucket) |
| Payments | Stripe (subscriptions + usage-based billing) |
| AI Workers | Python · FastAPI · yt-dlp · OpenCV · Whisper · CLIP (transformers) |
| Infra | Vercel (frontend) · Railway (Python workers) · Cloudflare CDN |

---

## Project Structure

```
frameflow/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout (fonts, providers)
│   │   ├── page.tsx                  # Landing page entry
│   │   ├── globals.css               # Global Tailwind styles
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx        # Login with Supabase Auth
│   │   │   └── signup/page.tsx       # Sign up
│   │   ├── (app)/
│   │   │   ├── layout.tsx            # App shell (Sidebar + Navbar)
│   │   │   ├── dashboard/page.tsx    # Usage stats, recent extractions
│   │   │   ├── extract/page.tsx      # URL input + live extraction progress
│   │   │   ├── gallery/page.tsx      # Frame gallery with filters
│   │   │   ├── brand-kit/page.tsx    # Logo, colors, watermark settings
│   │   │   └── settings/page.tsx     # Account, billing, API keys
│   │   ├── api/
│   │   │   ├── extract/route.ts      # POST — starts extraction job via worker
│   │   │   ├── jobs/[id]/route.ts    # GET — polls job status from worker
│   │   │   └── frames/[job_id]/route.ts  # GET — retrieves frames for completed job
│   │   ├── pricing/page.tsx          # Public pricing page
│   │   └── docs/api/page.tsx         # API reference docs (in-app)
│   ├── components/
│   │   ├── ui/                       # Shadcn/UI base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Top navigation bar
│   │   │   ├── Sidebar.tsx           # App sidebar (dashboard nav)
│   │   │   └── Footer.tsx            # Landing page footer
│   │   └── sections/                 # Landing page sections
│   │       ├── Hero.tsx              # Hero with URL input
│   │       ├── Features.tsx          # Feature grid
│   │       ├── HowItWorks.tsx        # Step-by-step flow
│   │       ├── Platforms.tsx         # Supported platforms grid
│   │       ├── PricingSection.tsx    # Pricing cards
│   │       ├── Stats.tsx             # Social proof stats
│   │       └── CTA.tsx               # Bottom call-to-action
│   ├── lib/
│   │   ├── supabase.ts               # Supabase client (SSR + browser)
│   │   ├── stripe.ts                 # Stripe client + helpers
│   │   └── utils.ts                  # Platform detection, cn(), helpers
│   ├── store/
│   │   └── useStore.ts               # Zustand global state
│   └── types/
│       └── index.ts                  # TypeScript interfaces & types
├── python/
│   ├── main.py                       # FastAPI app entry point
│   ├── extractor.py                  # yt-dlp download + OpenCV frame extraction
│   ├── ai_pipeline.py                # CLIP visual scoring + Whisper captioning
│   └── requirements.txt              # Python dependencies
├── docs/                             # Project documentation
├── vercel.json                       # Vercel deployment config
├── next.config.mjs                   # Next.js config (image domains, externals)
├── tailwind.config.ts                # Tailwind theme + custom tokens
├── components.json                   # Shadcn/UI config
├── tsconfig.json                     # TypeScript config
```

---

## Auth Flow

```
User visits /(app)/* route
      │
      ▼
Supabase SSR middleware checks session cookie
      │
      ├── Session valid  → render page
      └── No session     → redirect to /login
                               │
                               ▼
                    Supabase Auth (email/password)
                               │
                               ▼
                    Session cookie set → redirect to /dashboard
```

---

## Extraction Modes

| Mode | Description |
|------|-------------|
| `ai` | CLIP scores every sampled frame, returns top N by visual quality |
| `interval` | Returns one frame every N seconds regardless of quality |
| `scene` | Returns frames at detected scene changes (OpenCV scene detection) |

---

## Supported Platforms

Powered by `yt-dlp` — supports 20+ platforms including:

- YouTube
- Instagram (Reels, Posts)
- TikTok
- X / Twitter
- Facebook
- Vimeo
- LinkedIn
- Twitch (clips)
- Reddit (video posts)
- Any direct `.mp4` URL
