# FrameFlow — Deployment Guide

Two services to deploy:
1. **Next.js frontend** → Vercel
2. **Python AI worker** → Railway

---

## 1. Frontend — Vercel

### First deploy

1. Push code to GitHub (already done)
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import `ken-muritu/frameflow` from GitHub
4. Vercel auto-detects Next.js — leave all build settings as-is (`vercel.json` handles them)
5. Before deploying, add all environment variables under **Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRO_MONTHLY_PRICE_ID
STRIPE_PRO_ANNUAL_PRICE_ID
STRIPE_BUSINESS_MONTHLY_PRICE_ID
STRIPE_BUSINESS_ANNUAL_PRICE_ID
WORKER_API_URL           ← set to Railway URL after step 2
WORKER_API_KEY           ← your shared secret
NEXT_PUBLIC_APP_URL      ← https://your-subdomain.vercel.app
NEXT_PUBLIC_APP_NAME     ← FrameFlow
```

6. Click **Deploy**

### Redeploy after changes

```bash
git push origin main
# Vercel auto-deploys on every push to main
```

### Custom domain

1. Vercel dashboard → **Project → Domains**
2. Add your domain (e.g. `frameflow.io`)
3. Add the DNS records Vercel provides in your domain registrar
4. Update `NEXT_PUBLIC_APP_URL` in Vercel env vars to match

### `vercel.json` summary

| Setting | Value |
|---------|-------|
| Framework | `nextjs` |
| Region | `iad1` (US East) |
| Security headers | `X-Frame-Options`, `X-Content-Type-Options`, `XSS-Protection`, `Referrer-Policy` |
| API cache | `no-store` on all `/api/*` routes |

---

## 2. Python Worker — Railway

### Setup

1. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub Repo**
2. Select `ken-muritu/frameflow`
3. Set **Root Directory** to `python`
4. Add a `Procfile` inside `python/` (create it if missing):

```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Environment variables on Railway

```
WORKER_API_KEY=your-shared-secret   ← same value as in Vercel
```

### After deploy

1. Copy the Railway-generated URL (e.g. `https://frameflow-worker-production.up.railway.app`)
2. Set that as `WORKER_API_URL` in Vercel env vars
3. Trigger a Vercel redeploy for the variable to take effect

### Scaling

- Railway auto-scales on the Hobby/Pro plan
- For high throughput, add a Redis broker and switch to Celery workers (wired in `requirements.txt`)

---

## 3. Supabase — Production Checklist

- [ ] Enable **Row Level Security (RLS)** on all tables
- [ ] Create Storage bucket `frames` → set to **Public**
- [ ] Enable **Email confirmations** under Auth → Settings
- [ ] Add your Vercel domain to **Auth → URL Configuration → Redirect URLs**:
  ```
  https://your-domain.com/auth/callback
  ```
- [ ] Set **Site URL** to `https://your-domain.com`

---

## 4. Stripe — Production Checklist

- [ ] Switch from Test mode keys to **Live mode keys** in Vercel env vars
- [ ] Recreate products in **Live mode** and update all `STRIPE_*_PRICE_ID` vars
- [ ] Update webhook endpoint from `localhost` to production URL
- [ ] Enable webhook events:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

---

## 5. Production Environment Variables Checklist

| Variable | Dev value | Prod value |
|----------|-----------|------------|
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `https://frameflow.io` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | `pk_live_...` |
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Local CLI `whsec_...` | Dashboard `whsec_...` |
| `WORKER_API_URL` | `http://localhost:8000` | Railway URL |
| All Stripe price IDs | Test mode IDs | Live mode IDs |
