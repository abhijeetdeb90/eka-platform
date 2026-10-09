> Canonical EKA documentation. Source of truth for product, architecture, trust and delivery decisions.
> Versioning: v0.1, v0.2, v1.0. Mark assumptions as `ASSUMPTION` and unresolved decisions as `OPEN`.
> Never store passwords, API keys, tokens, private user data or production secrets in this repository.

# Integrations Register

## Integration categories

- Authentication
- Database and storage
- Hosting/deployment
- Email
- Notifications
- Analytics
- Search
- AI providers
- Payments
- Maps/geolocation
- Social publishing
- Customer support
- Error monitoring

## Required record per integration

- Business purpose
- Owner
- Data shared
- Data received
- Authentication method
- Environment variables
- Webhook requirements
- Failure behavior
- Cost and usage limits
- Vendor lock-in risk
- Exit/export plan
- Security and privacy review

## Rule

No integration is production-ready until credentials, permissions, webhooks, retry logic, monitoring, and failure states are documented.

---

## Active & Planned Google Integrations

### 1. Google Gemini API (AI Reasoning & Epistemic Synthesis)

- **Business Purpose:** Powers "Ask EKA", cultural context explanation, primary scripture citation analysis, and reflective companion.
- **Owner:** Principal AI Architect
- **Data Shared:** Ephemeral member queries, requested tradition texts, scripture excerpts. Zero PII, zero credentials.
- **Data Received:** Structured explanations, linguistic transliterations, cross-cultural analogies, citation verification checks.
- **Authentication Method:** API Key (`GEMINI_API_KEY`) via Google AI Studio / Vertex AI with Lovable Gateway fallback (`LOVABLE_API_KEY`).
- **Environment Variables:** `GEMINI_API_KEY`, `LOVABLE_API_KEY`
- **Failure Behavior:** Graceful fallback to static cached answers and friendly notice ("The companion is resting. Please try again shortly.").
- **Cost & Limits:** Free tier / pay-as-you-go; token budget throttled via EKA Control Plane.
- **Vendor Lock-in Risk:** Low. EKA uses provider-agnostic abstractions and strict Zod output schemas.

### 2. Google Maps Platform (Sacred Geography & Places)

- **Business Purpose:** Interactive maps, sacred place verification, pilgrimage routes, regional festival exploration, and temple customs discovery.
- **Owner:** Lead Frontend Engineer
- **Data Shared:** Place names, geographic latitude/longitude coordinates, zoom bounds.
- **Data Received:** Map tiles, place details, geocoded addresses.
- **Authentication Method:** Browser API Key (`VITE_GOOGLE_MAPS_API_KEY` / `VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY`).
- **Environment Variables:** `VITE_GOOGLE_MAPS_API_KEY`, `VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY`
- **Failure Behavior:** Fallbacks to static place photography and editorial descriptions if map tiles fail to load.
- **Cost & Limits:** $200 monthly free credit from Google Cloud; usage limits set in Google Cloud Console.

### 3. Google Analytics 4 (Behavioral Telemetry & Product Intelligence)

- **Business Purpose:** Aggregate usage analytics, feature retention, and search topic demand to guide knowledge graph curation.
- **Owner:** Growth & Analytics Lead
- **Data Shared:** Anonymized pageviews and custom cultural events. Strictly DPDP-compliant; zero personal reflections, journal entries, or sensitive PII.
- **Data Received:** Aggregated dashboards and funnel conversion reports.
- **Authentication Method:** Measurement ID (`VITE_GA4_MEASUREMENT_ID`).
- **Environment Variables:** `VITE_GA4_MEASUREMENT_ID`
- **Failure Behavior:** Silent no-op. Failure to initialize GA4 never impacts application usability.

---

## Production Core Services (Option A Foundation)

### 4. Cloudflare (Edge, DNS, CDN & WAF)

- **Business Purpose:** Global traffic management, TLS termination, CDN asset caching, rate limiting, and DDoS/bot protection.
- **Owner:** Systems Architect
- **Data Shared:** Ingress HTTP/S request headers and IP metadata.
- **Data Received:** Clean, verified edge traffic forwarded to Vercel and R2.
- **Authentication Method:** Cloudflare API Token (`CLOUDFLARE_API_TOKEN`) and Account ID (`CLOUDFLARE_ACCOUNT_ID`).
- **Environment Variables:** `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`
- **Failure Behavior:** Cloudflare Always Online serves cached edge versions of public editorial content.
- **Cost & Limits:** Cloudflare Free/Pro tier ($0 - $20/month); zero egress fees.
- **Vendor Lock-in Risk:** Low. Standard DNS, CNAME flattening, and RFC-compliant HTTP proxy.

### 5. Cloudflare R2 (Media Storage)

- **Business Purpose:** Zero-egress object storage for user avatars, community photography, creator reels, visual stories, and archival manuscripts.
- **Owner:** Systems Architect / Platform Engineer
- **Data Shared:** Media binary files uploaded via short-lived signed URLs.
- **Data Received:** S3 PutObject / GetObject confirmations, presigned upload URLs.
- **Authentication Method:** S3 API Access Key ID (`R2_ACCESS_KEY_ID`) and Secret Access Key (`R2_SECRET_ACCESS_KEY`).
- **Environment Variables:** `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_DOMAIN`
- **Failure Behavior:** Fallback to storage lake staged cache or Google Drive archive.
- **Cost & Limits:** 10 GB free storage/month, zero egress fees, $0.015/GB beyond free tier.
- **Vendor Lock-in Risk:** Zero. Standard S3 API specification; compatible with AWS S3, MinIO, Wasabi, or Google Cloud Storage.

### 6. Resend (Transactional Email)

- **Business Purpose:** Transactional communications including welcome emails, email verification magic links, creator subscription receipts, and security alerts.
- **Owner:** Product Engineering Lead
- **Data Shared:** Recipient email, user display name, transactional invoice amounts, and session security timestamps. Zero sensitive faith reflections.
- **Data Received:** Message IDs, delivery confirmations, bounce events, and spam complaints via webhook.
- **Authentication Method:** API Key (`RESEND_API_KEY`) and Webhook Secret (`RESEND_WEBHOOK_SECRET`).
- **Environment Variables:** `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_WEBHOOK_SECRET`
- **Failure Behavior:** Non-blocking async queue. Unsent emails logged to audit records for retry.
- **Cost & Limits:** Free tier includes 3,000 emails/month (100/day); $20/month for 50,000 emails.
- **Vendor Lock-in Risk:** Low. Modular email client abstraction easily swappable to Amazon SES, Postmark, or SendGrid.

