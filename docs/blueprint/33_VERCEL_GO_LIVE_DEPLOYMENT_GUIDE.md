# EKA — Vercel Production Go-Live Deployment Guide

**Document ID:** BLU-033  
**Version:** 1.0  
**Project:** EKA — Trusted Civilizational Knowledge System with a Social Layer  
**Target Environment:** Vercel (Build Output API v3) + Supabase + Cloudflare DNS  
**Status:** APPROVED & READY FOR DEPLOYMENT

---

## 1. Executive Summary

EKA's frontend is architected on **TanStack Start (React 19)**, **Vite 8**, and **Nitro 3**, delivering instantaneous Server-Side Rendering (SSR), streaming responses, and pre-rendered client hydration.

To achieve world-class global latency, automated CDN caching, and serverless compute scaling without DevOps overhead, EKA is integrated with **Vercel's Build Output API v3** specification (`.vercel/output`).

When compiled via `npm run build`, Nitro generates:

1. `.vercel/output/config.json`: Vercel routing rules, asset caching directives, and serverless function fallbacks.
2. `.vercel/output/static/`: Static client bundles, compiled CSS, and visual assets served directly by Vercel’s Global Edge CDN with immutable cache headers.
3. `.vercel/output/functions/__server.func/`: A high-performance Node.js 24 serverless function (`index.mjs`) configured with `supportsResponseStreaming: true` for low Time-To-First-Byte (TTFB).

---

## 2. Architecture & File Manifest

### 2.1 File Configuration Summary

| File              | Purpose                                                                               | Location                  |
| ----------------- | ------------------------------------------------------------------------------------- | ------------------------- |
| `vercel.json`     | Vercel deployment directives, security headers, immutable caching, and cron schedules | Root (`/vercel.json`)     |
| `vite.config.ts`  | Configures Nitro with `preset: "vercel"` while preserving Lovable sandbox fallback    | Root (`/vite.config.ts`)  |
| `package.json`    | Contains `"build"`, `"build:vercel"`, and `"deploy:vercel"` scripts                   | Root (`/package.json`)    |
| `.gitignore`      | Ensures `.vercel` build artifacts and CLI metadata remain untracked                   | Root (`/.gitignore`)      |
| `.vercel/output/` | The complete, prebuilt production output ready to deploy                              | Root (`/.vercel/output/`) |

### 2.2 Output Bundle Structure

```
.vercel/output/
├── config.json                     # Vercel Build Output API v3 specification
├── nitro.json                      # Nitro runtime manifest
├── static/                         # Edge CDN Static Directory
│   ├── assets/                     # Hashed JS, CSS, and media bundles
│   │   ├── styles-*.css
│   │   ├── client-*.js
│   │   └── ...
│   └── favicon.ico, images, etc.
└── functions/
    └── __server.func/              # Node.js 24 Serverless Function
        ├── .vc-config.json         # Runtime config (nodejs24.x, response streaming enabled)
        ├── index.mjs               # Serverless entry point
        ├── package.json            # Function runtime manifest
        ├── _libs/                  # Bundled server dependencies
        └── _ssr/                   # SSR route modules & TanStack Router manifest
```

---

## 3. Go-Live Deployment Methods

You can deploy EKA to Vercel using either the **Vercel CLI** (Option A) or **GitHub Git Integration** (Option B).

### Option A: Instant CLI Deployment (Recommended for First Deploy)

From the project root (`c:\Users\abhij\OneDrive\Documents\EKA\EKA`):

```powershell
# 1. Login to your Vercel account
npx vercel login

# 2. Link project to your Vercel account / team
npx vercel link

# 3. Pull production environment variables
npx vercel env pull .env.production.local

# 4. Build the production output bundle
npm run build

# 5. Deploy the prebuilt output directly to Production
npx vercel deploy --prebuilt --prod
```

### Option B: Automatic CI/CD via GitHub Integration

1. Initialize git and push the repository to GitHub:
   ```powershell
   git init
   git add .
   git commit -m "feat(deploy): production ready EKA on Vercel"
   git branch -M main
   git remote add origin https://github.com/<your-username>/eka.git
   git push -u origin main
   ```
2. In the [Vercel Dashboard](https://vercel.com/dashboard):
   - Click **"Add New..."** → **"Project"**.
   - Select your `eka` GitHub repository.
   - **Framework Preset:** Select `Other` (or leave default; `vercel.json` dictates the build settings).
   - **Root Directory:** `./` (or `EKA` if repository has a parent folder).
   - **Build Command:** `npm run build`
   - **Output Directory:** `.vercel/output`
   - Add your **Environment Variables** (see Section 4).
   - Click **Deploy**.

---

## 4. Environment Variables Checklist

Add the following environment variables in the **Vercel Project Settings → Environment Variables**:

| Variable                    | Description                               | Example / Note                                           |
| --------------------------- | ----------------------------------------- | -------------------------------------------------------- |
| `VITE_SUPABASE_URL`         | Supabase Project URL                      | `https://xyzcompany.supabase.co`                         |
| `VITE_SUPABASE_ANON_KEY`    | Public Supabase Anon Key                  | `eyJhbGciOiJIUzI1NiIsIn...`                              |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase Service Key          | `eyJhbGciOiJIUzI1NiIsIn...` (Private)                    |
| `UPSTASH_REDIS_REST_URL`    | Upstash Redis REST URL                    | `https://striking-whale-12345.upstash.io`                |
| `UPSTASH_REDIS_REST_TOKEN`  | Upstash Redis REST Token                  | `AXc...` (Private)                                       |
| `GEMINI_API_KEY`            | Google Gemini API Key for AI verification | `AIzaSy...` (Private)                                    |
| `VITE_SENTRY_DSN`           | Sentry Error Reporting DSN                | `https://...@o000.ingest.sentry.io/...`                  |
| `VITE_POSTHOG_KEY`          | PostHog Product Telemetry Key             | `phc_...`                                                |
| `VITE_POSTHOG_HOST`         | PostHog Ingest Host                       | `https://eu.i.posthog.com` or `https://us.i.posthog.com` |
| `N8N_WEBHOOK_URL`           | n8n Workflow Automation Webhook           | `https://automation.eka.earth/webhook/...`               |
| `N8N_WEBHOOK_SECRET`        | n8n Secret for HMAC verification          | `n8n_sec_...` (Private)                                  |
| `VITE_APP_URL`              | Production Canonical URL                  | `https://eka.earth`                                      |
| `NITRO_PRESET`              | Nitro preset (optional fallback)          | `vercel`                                                 |

---

## 5. Custom Domain & DNS Setup (`eka.earth`)

To attach your production domain `eka.earth` to Vercel:

1. In the Vercel Dashboard, go to **Settings → Domains**.
2. Enter `eka.earth` and `www.eka.earth`.
3. In your DNS provider (e.g. Cloudflare / Namecheap / GoDaddy), configure:
   - **Apex domain (`eka.earth`):**
     - Type: `A`
     - Name: `@`
     - Value: `76.76.21.21` (Vercel IP)
   - **Subdomain (`www.eka.earth`):**
     - Type: `CNAME`
     - Name: `www`
     - Value: `cname.vercel-dns.com`
4. Set SSL/TLS to **Full (Strict)** if using Cloudflare proxy, or DNS-only (Grey Cloud) during initial certificate issuance.

---

## 6. Production Security & Header Verification

The deployed `vercel.json` applies the following headers automatically:

1. **HSTS (`Strict-Transport-Security`):** `max-age=63072000; includeSubDomains; preload` (enforces HTTPS for 2 years).
2. **X-Content-Type-Options:** `nosniff` (prevents MIME type sniffing).
3. **X-Frame-Options:** `DENY` (prevents clickjacking attacks).
4. **Referrer-Policy:** `strict-origin-when-cross-origin` (protects privacy on external link navigation).
5. **Permissions-Policy:** `camera=(), microphone=(), geolocation=(self)` (restricts hardware access).
6. **Immutable Asset Caching:** All files under `/assets/` are cached for 1 year (`max-age=31536000, immutable`).

---

## 7. Scheduled Cron Jobs

Vercel Crons configured in `vercel.json`:

| Path                          | Schedule                    | Description                                                      |
| ----------------------------- | --------------------------- | ---------------------------------------------------------------- |
| `/api/cron/daily-reflection`  | `0 0 * * *` (Midnight UTC)  | Calculates daily reflections, sadhana streaks, and fresh prompts |
| `/api/cron/payout-calculator` | `0 0 * * 0` (Weekly Sunday) | Aggregates verified creator views and queues automated payouts   |

---

## 8. Post-Deploy Verification Checklist

- [ ] **Home Page Load:** `https://eka.earth` returns 200 OK with fully hydrated layout.
- [ ] **SSR & Streaming:** TTFB is under 200ms globally on Vercel Edge.
- [ ] **DPDP Cookie Consent:** Cookie banner renders on first visit; analytics are paused until consent is granted.
- [ ] **1,000 Stories Campaign:** `https://eka.earth/stories` displays milestone tracker.
- [ ] **Knowledge Object & Linage:** Polyphonic variations modal ("Add Your Version") and WhatsApp share card modal trigger smoothly.
- [ ] **Legal Pages Active:** Privacy, Terms, Cookies, Refund, Copyright, and Standards pages return valid content with proper business identity.
