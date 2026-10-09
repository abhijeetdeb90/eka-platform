# EKA — Cloudflare Edge, DNS & Security Architecture (Option A)

> Canonical documentation for EKA Edge, CDN, DNS, WAF, Media Storage, and Transactional Communications.
> Version: v1.0
> Date: 2026-10-09
> Author: Lead Systems Architect / Core Team

---

## 1. Executive Summary & Topology

Under approved **Option A**, EKA maintains a lean, unified production stack with crystal-clear boundaries:

```
[ End Users & Crawlers ]
            │
            ▼
┌────────────────────────────────────────────────────────┐
│ Cloudflare Edge (DNS, Full SSL Strict, CDN, WAF, DDoS)  │
│ - Rate Limiting (120 req/min API, 20 req/min Auth/Ask)  │
│ - Bot Fight Mode & Country Inspection (DPDP Act)       │
└────────────────────────────────┬───────────────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         │ (Web & API Traffic)                           │ (Media CDN Traffic)
         ▼                                               ▼
┌────────────────────────────────┐              ┌────────────────────────────────┐
│ Vercel Hosting (Production)    │              │ Cloudflare R2 Media Bucket     │
│ - TanStack Start SSR & APIs    │              │ - Images, reels, video assets  │
│ - Edge Middleware & Headers    │              │ - Zero egress fees             │
└────────┬──────────────┬────────┘              │ - Short-lived signed URLs      │
         │              │                       └────────────────────────────────┘
         │              ▼
         │      ┌────────────────────────────────┐
         │      │ Resend Transactional Email     │
         │      │ - Welcome & Verification       │
         │      │ - Creator Subscription Receipt │
         │      │ - Delivery Webhook Audit       │
         │      └────────────────────────────────┘
         ▼
┌────────────────────────────────────────────────────────┐
│ Supabase (PostgreSQL & Identity/Auth Engine)           │
│ - Single source of truth (zero DB duplication)         │
│ - 50+ Migrations, RLS policies, audit logs             │
│ - Server-side RBAC validation (assertServerRole)       │
└────────────────────────────────────────────────────────┘
```

---

## 2. Cloudflare DNS & Domain Topology

| Hostname | Type | Target | Proxy Status | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `eka.earth` | CNAME / ALIAS | `cname.vercel-dns.com` | Proxied (Orange Cloud) | Apex web application & APIs |
| `www.eka.earth` | CNAME | `cname.vercel-dns.com` | Proxied (Orange Cloud) | WWW canonical redirect |
| `media.eka.earth` | CNAME | `eka-media-production.r2.cloudflarestorage.com` | Proxied (Orange Cloud) | Public media & visual reel CDN |
| `mail.eka.earth` | MX / TXT | Resend DNS Records | DNS Only (Grey Cloud) | Transactional email DKIM / SPF |

---

## 3. SSL/TLS & Edge Security Rules

1. **Encryption Mode**: **Full (Strict)** with TLS 1.3 enforced.
2. **HSTS (HTTP Strict Transport Security)**:
   - Max-Age: `63072000` (2 years)
   - Include subdomains: `true`
   - Preload: `true`
3. **Minimum TLS Version**: TLS 1.2 (TLS 1.0 and 1.1 strictly blocked).
4. **Automatic HTTPS Rewrites**: Enabled.
5. **Always Use HTTPS**: Enabled.

---

## 4. Cloudflare Web Application Firewall (WAF) & Rate Limiting

### 4.1 Edge Rate Limiting Rules

| Rule Name | Scope | Threshold | Action |
| :--- | :--- | :--- | :--- |
| **API General Protection** | `http.request.uri.path starts_with "/api/"` | 120 req / 1 min per IP | HTTP 429 Too Many Requests |
| **Auth & Email Protection** | `http.request.uri.path in {"/api/email/send", "/auth"}` | 20 req / 1 min per IP | Managed Challenge |
| **Ask EKA Token Saver** | `http.request.uri.path starts_with "/api/ask"` | 30 req / 1 min per IP | HTTP 429 with retry header |
| **Media Presigned URLs** | `http.request.uri.path eq "/api/storage/upload-url"` | 25 req / 1 min per User | Managed Challenge |

### 4.2 Security & Threat Mitigation

- **Bot Fight Mode**: Active on all public endpoints.
- **WAF Managed Rules**: Cloudflare Managed Ruleset enabled with sensitivity set to Medium/High.
- **Geo-awareness & DPDP Compliance**: Cloudflare `cf-ipcountry` header is parsed on server to enforce Indian DPDP Act affirmative consent and data fiduciary constraints.
- **Header Masking**: Strip server platform banners (`x-powered-by`, `server`).

---

## 5. Cloudflare R2 Media Storage Configuration

- **Bucket Name**: `eka-media-production`
- **Region**: Auto (closest to India / Asia-South edge)
- **Upload Flow**:
  1. Client calls authenticated `/api/storage/upload-url` with fileName, mimeType, and fileSizeBytes.
  2. Server validates against MIME whitelist and file size limits (Images: 15MB, Videos: 150MB, Audio: 50MB, Docs: 30MB).
  3. Server generates short-lived presigned S3 `PutObjectCommand` URL valid for 15 minutes.
  4. Client PUTs binary payload directly to R2 (bypassing Vercel serverless function payload limits).
  5. Client calls `/api/storage/confirm` to record asset key and metadata in audit logs.
- **Delivery**:
  - Public assets served via `https://media.eka.earth/{fileKey}` with Cloudflare Tiered Cache.
  - Private verification documents accessed only via temporary signed URLs (`GetObjectCommand`).

---

## 6. Resend Transactional Email Architecture

- **Domain**: `eka.earth` (DKIM, SPF, and DMARC verified via Resend).
- **From Address**: `EKA Cultural Commons <no-reply@eka.earth>`.
- **Templates**:
  - `sendWelcomeEmail`: Welcome to cultural archive and community.
  - `sendVerificationEmail`: Cryptographic magic link confirmation.
  - `sendSubscriptionReceiptEmail`: Creator patronage invoice with 85% creator breakdown.
  - `sendSecurityAlertEmail`: Suspicious session/login notification.
- **Webhooks**: Received at `/api/webhooks/resend` to capture delivery, bounce, and complaint telemetry into immutable audit logs.
