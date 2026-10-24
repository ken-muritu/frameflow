# FrameFlow — Environment Setup Guide

Complete step-by-step guide to filling in every environment variable and getting the full stack running.

---

## Order of Operations

| # | Step | Time |
|---|------|------|
| 1 | Create Supabase project, copy 3 keys | ~5 min |
| 2 | Create Stripe account, copy 2 API keys | ~5 min |
| 3 | Create 4 Stripe products, copy 4 price IDs | ~10 min |
| 4 | Run Stripe CLI locally for webhook secret | ~2 min |
| 5 | Start Python worker locally | ~5 min |
| 6 | Fill `.env.local` and restart `npm run dev` | ~1 min |

---

## 1. Supabase (Auth + Database + Storage)

**Go to:** [supabase.com](https://supabase.com) → **New Project**

### Steps

1. Create a new project — pick any name, region, and strong DB password
2. Wait ~2 min for provisioning
3. Go to **Project Settings → API**
4. Copy the three values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...   # "anon public" key
SUPABASE_SERVICE_ROLE_KEY=eyJ...       # "service_role" key — never commit this!
```

5. Go to **Storage** → create a bucket named `frames` → set it to **Public**
6. Go to **Authentication → Providers** → ensure **Email** is enabled

---

## 2. Stripe — API Keys

**Go to:** [dashboard.stripe.com](https://dashboard.stripe.com) → Sign up / Log in

1. Go to **Developers → API Keys**
2. Use **Test mode** keys while building — flip to Live when ready to launch
3. Copy both keys:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

## 3. Stripe — Products & Price IDs

1. Go to **Product Catalog → Add Product**
2. Create **4 products** with the following prices:

| Product Name | Price | Billing |
|-------------|-------|---------|
| Pro Monthly | $12.00 | Monthly recurring |
| Pro Annual | $99.00 | Yearly recurring |
| Business Monthly | $49.00 | Monthly recurring |
| Business Annual | $390.00 | Yearly recurring |

3. After saving each product, copy the `price_...` ID shown under each price object:

```env
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_ANNUAL_PRICE_ID=price_...
STRIPE_BUSINESS_MONTHLY_PRICE_ID=price_...
STRIPE_BUSINESS_ANNUAL_PRICE_ID=price_...
```

---

## 4. Stripe — Webhook Secret

### Local development

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Login:
   ```bash
   stripe login
   ```
3. Forward events to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copy the `whsec_...` it prints to the terminal:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Production

1. Go to **Developers → Webhooks → Add endpoint**
2. URL: `https://yourdomain.com/api/webhooks/stripe`
3. Events to enable:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the **Signing secret** from the webhook page

---

## 5. Python Worker

### Local development

```bash
cd python
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Then set:

```env
WORKER_API_URL=http://localhost:8000
WORKER_API_KEY=any-random-secret-you-choose
```

> `WORKER_API_KEY` is a shared secret you create yourself. Generate one with:
> ```bash
> openssl rand -hex 32
> ```

### Production (Railway)

See [deployment.md](./deployment.md) for full Railway deploy steps.

---

## 6. App URLs

```env
# Local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=FrameFlow

# Production — update after Vercel deploy
NEXT_PUBLIC_APP_URL=https://frameflow.vercel.app
```

---

## Complete `.env.local` Template

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_ANNUAL_PRICE_ID=price_...
STRIPE_BUSINESS_MONTHLY_PRICE_ID=price_...
STRIPE_BUSINESS_ANNUAL_PRICE_ID=price_...

# Worker
WORKER_API_URL=http://localhost:8000
WORKER_API_KEY=your-chosen-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=FrameFlow
```

After filling this in, restart the dev server:

```bash
npm run dev
```
