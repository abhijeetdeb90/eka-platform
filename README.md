# EKA — The Cultural Intelligence & Sacred Living Platform

**One within. One with all.**

EKA is the trusted cultural, spiritual, and community intelligence operating system. It bridges unbroken living heritage, sacred geography, community wisdom, and the creator economy through an epistemic, verification-first architecture.

---

## 1. System Architecture

EKA integrates 10 foundational domains into one unified application:

```
                              ┌────────────────────────────────────────┐
                              │            EKA USER CLIENT             │
                              │  Web App (Desktop / Tablet / Mobile)   │
                              └───────────────────┬────────────────────┘
                                                  │
                   ┌──────────────────────────────┴──────────────────────────────┐
                   │                   EXPERIENCE & ROUTING LAYER                │
                   │    TanStack Start 1.168 · React 19 · Vite 8 · Tailwind v4    │
                   └──────┬───────────────────────┬───────────────────────┬──────┘
                          │                       │                       │
           ┌──────────────┴──────────┐            │        ┌──────────────┴──────────┐
           │    CONSUMER FRONTEND    │            │        │   STUDIO & ENTERPRISE   │
           │  / · /app · /junction   │            │        │  /studio · /admin       │
           │  /practice · /observe   │            │        │  /enterprise · /system  │
           └──────────────┬──────────┘            │        └──────────────┬──────────┘
                          │                       │                       │
┌─────────────────────────┴───────────────────────┼───────────────────────┴─────────────────────────┐
│                                         IDENTITY LAYER                                            │
│            Supabase Auth (Native Google OAuth 2.0 PKCE · Sessions · Profiles · 11-Tier RBAC)      │
└─────────────────────────┬───────────────────────────────────────────────┬─────────────────────────┘
                          │                                               │
┌─────────────────────────┴───────────────────┐ ┌─────────────────────────┴─────────────────────────┐
│              KNOWLEDGE & AI LAYER           │ │             BUSINESS & OPERATIONS LAYER           │
│  • 10 Cultural Dimensions & Epistemic Taxonomy│ │  • EKA Engagement CRM (Member Lifecycle)        │
│  • Knowledge Graph & Source Passports       │ │  • Creator Economy & Double-Entry Ledger Engine   │
│  • Google Gemini 2.5 Native Client          │ │  • Enterprise Multi-Tenant Workspaces & API Keys  │
│  • LangGraph Epistemic State Machine        │ │  • P&L Waterfall, Reserve Pools & Monetization    │
│  • Model Context Protocol (MCP) Server      │ │  • DPDP Statutory Disclosures & Trust Center      │
└─────────────────────────┬───────────────────┘ └─────────────────────────┬─────────────────────────┘
                          │                                               │
┌─────────────────────────┴───────────────────────────────────────────────┴─────────────────────────┐
│                                     EXTERNAL SERVICE BUS & APIS                                   │
│    Google Maps Platform  │  Google Analytics 4  │  Stripe Webhooks  │  External Connectors        │
└─────────────────────────┬───────────────────────────────────────────────┬─────────────────────────┘
                          │                                               │
┌─────────────────────────┴───────────────────────────────────────────────┴─────────────────────────┐
│                                      DATA & INFRASTRUCTURE LAYER                                  │
│           Supabase PostgreSQL (37 Migrations · Row Level Security) · Storage Buckets · Realtime   │
│           Vercel Edge & Nitro Server Runtime (.vercel/output)                                     │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Prerequisites

- **Node.js:** `v20.x` or `v22.x` (LTS recommended)
- **Package Manager:** `npm` (v10+), `pnpm`, or `bun`
- **Database:** Supabase project (PostgreSQL 14+)
- **Google Cloud Platform:**
  - Google OAuth 2.0 Client ID (Web Application)
  - Google Maps Platform API Key (JavaScript Maps API)
  - Google Gemini API Key (`gemini-2.5-flash`)
  - Google Analytics 4 Measurement ID

---

## 3. Installation & Local Setup

### Step 1: Clone or navigate to the repository
```bash
cd EKA
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` (or `.env.local.example`) to `.env`:
```bash
cp .env.local.example .env
```
Populate your `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-ref
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 4: Run the Local Development Server
```bash
npm run dev
```
The server will start at:
```
http://localhost:5173 (or http://localhost:3000)
```

---

## 4. Canonical Navigation & Route Map

| Canonical Route | Target Destination | Description |
| :--- | :--- | :--- |
| `/` | Public Landing | The living cultural intelligence sanctuary & discovery hero |
| `/home` | In-App Feed (`/app`) | In-app feed, daily ritual, and editorial practices |
| `/junction` | The Junction (`/app/junction`)| Sacred geography, interactive Google Maps, connected heritage |
| `/create` | Discourse Composer (`/app/create`) | Contemplative authoring, reflections, and community sharing |
| `/community` | Circles (`/app/sanghas`)| Multi-faith communities, circles, and recorded discourses |
| `/my-eka` | Personal Dashboard (`/app/dashboard`) | Wisdom Passport, daily rhythm, milestones, and reflections |
| `/search` | Global Search (`/app/search`) | Universal semantic exploration across traditions and places |
| `/studio` | EKA Studio Control Plane | 17 operational modules (CRM, Knowledge Graph, Media, Roles) |
| `/admin` | Administration & Moderation | Community moderation, content appeals, and practitioner safety |
| `/admin/economics`| Founder Economic Engine | Append-only double-entry ledger, P&L waterfall, and reserve pool |
| `/enterprise` | Institutional Workspaces | Tenant isolation, API keys, and rate limiters |
| `/system` | **Internal Master System Map** | **Real-time health, dependency flow, and telemetry console** |

---

## 5. Google Authentication (OAuth 2.0 PKCE) Setup

EKA uses **native Supabase Auth with Google OAuth 2.0** over PKCE.

### 1. Google Cloud Console:
1. Go to **Google Cloud Console** $\rightarrow$ **APIs & Services** $\rightarrow$ **Credentials**.
2. Create an **OAuth 2.0 Client ID** of type **Web application**.
3. In **Authorized JavaScript Origins**, add:
   - `http://localhost:5173`
   - `http://localhost:3000`
   - `https://eka.earth`
   - `https://your-app.vercel.app`
4. In **Authorized Redirect URIs**, add:
   - `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
5. Copy your **Client ID** and **Client Secret**.

### 2. Supabase Dashboard:
1. Go to **Authentication** $\rightarrow$ **Providers** $\rightarrow$ **Google**.
2. Enable Google Provider.
3. Paste your **Client ID** and **Client Secret**.
4. In **Authentication** $\rightarrow$ **URL Configuration**, add your localhost and production redirect URLs:
   - `http://localhost:5173/**`
   - `http://localhost:3000/**`
   - `https://eka.earth/**`

---

## 6. Database Setup & Migrations

EKA contains **37 PostgreSQL migrations** under `supabase/migrations/`.

To apply all migrations to your local or remote Supabase instance:
```bash
supabase db push
# or run migrations using the Supabase CLI:
supabase migration up
```

Key database tables:
- `profiles`: User identity, avatar, display name, biographical context
- `user_roles` & `studio_user_roles`: 11-tier granular least-privilege matrix
- `knowledge_objects` & `taxonomy_nodes`: Canonical cultural entities & hierarchical tags
- `places`, `place_layers`, `place_map_points`: Sacred geography & Google Maps points
- `ledger_entries` & `eka_economics`: Double-entry accounting & creator pool payouts
- `studio_audit_log`: Immutable append-only audit trail for all control plane actions

---

## 7. Testing & Quality Assurance

### End-to-End Test Suite (Playwright)
EKA includes **46 tests across 6 suites** testing mobile responsiveness, accessibility, DPDP notices, creator economy, and knowledge ingestion:

```bash
npm run test:e2e
```
Or run individual test suites:
```bash
npx playwright test tests/e2e/founder-mobile-gate.spec.ts
npx playwright test tests/e2e/homepage-card-discovery.spec.ts
npx playwright test tests/e2e/knowledge-ingestion-system.spec.ts
```

---

## 8. Building & Production Deployment

### Production Build
```bash
npm run build
```
Generates client, SSR, and Nitro server bundles inside `.vercel/output`.

### Deploy to Vercel
```bash
npm run deploy:vercel
# or push to connected main branch in GitHub
```

---

## 9. Security & Privacy (DPDP Compliance)

- **Zero Secret Commits:** Strict `.gitignore` rules prevent accidental credential check-ins.
- **DPDP Act (2023) Compliance:** Explicit cookie consent, clear statutory terms (`/terms`), privacy policy (`/privacy`), and transparent refund policies (`/refund`).
- **Security Headers:** Configured in `vercel.json` with HSTS preloading, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and restricted permissions policies.

---

## 10. Repository Structure

```
eka-platform/
├── docs/                     # Canonical blueprint & documentation
│   ├── EKA-MASTER-ARCHITECTURE.md
│   ├── blueprint/            # Strategic blueprints (01_VISION to 41_HOOK)
│   └── 01-product to 10-templates
├── src/
│   ├── assets/               # High-resolution editorial photography
│   ├── components/
│   │   ├── app/              # Feed cards, composer, sacred geography map
│   │   ├── brand/            # EKA logo and typography primitives
│   │   ├── discovery/        # Revised progressive disclosure cards & hero
│   │   ├── founder/          # Founder profile & visual narrative feed
│   │   ├── knowledge/        # Cultural dimensions & epistemic visualizer
│   │   ├── motion/           # TactileWrapper & Framer Motion primitives
│   │   ├── site/             # Public site header & footer
│   │   ├── studio/           # 17 EKA Studio control plane subsystems
│   │   └── ui/               # Radix UI component library
│   ├── hooks/                # Realtime, Profile, Role, and Auth hooks
│   ├── integrations/         # Supabase & Lovable client instances
│   ├── lib/
│   │   ├── ai/               # Gemini native client & LangGraph pipeline
│   │   ├── analytics/        # GA4 telemetry
│   │   ├── maps/             # Google Maps Platform loader & calculations
│   │   ├── mcp/              # Model Context Protocol tools & server
│   │   └── studio/           # RBAC, audit log, content, and search services
│   ├── routes/               # TanStack Start file-based routing
│   │   ├── __root.tsx        # App root layout
│   │   ├── _authenticated/   # Protected in-app routes (/app, /studio)
│   │   ├── auth.tsx          # Google Sign-In & Email authentication
│   │   ├── system.tsx        # Internal Master System Map (/system)
│   │   └── ...canonical alias routes (/home, /junction, /create, etc.)
│   ├── server.ts             # SSR error normalizer & server fetch handler
│   └── styles.css            # Editorial color palette & typography
├── supabase/
│   └── migrations/           # 37 PostgreSQL migrations
├── tests/
│   └── e2e/                  # 46 Playwright end-to-end specifications
├── .env.example              # Canonical environment template
├── .env.local.example        # Localhost development configuration
├── .env.staging.example      # Staging configuration
├── .env.production.example   # Production configuration
├── vercel.json               # Prebuilt deployment, headers & cron jobs
├── vite.config.ts            # Vite 8 & TanStack Start build configuration
└── package.json              # Platform dependencies & scripts
```
