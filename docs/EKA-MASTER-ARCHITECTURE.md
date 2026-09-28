# EKA MASTER ARCHITECTURE SPECIFICATION
**Version:** 1.0.0 (Unified Release Blueprint)  
**Status:** CANONICAL REFERENCE DOCUMENT  
**Last Updated:** September 2026  

---

## 1. System Overview & Vision

**EKA** is the trusted cultural, spiritual, and community intelligence operating system. It bridges unbroken living heritage, sacred geography, community wisdom, and the creator economy through an epistemic, verification-first platform.

This document integrates all 10 foundational EKA workstreams:
1. **EKA Google Integration Architecture** (Maps Platform, GA4 Telemetry, Gemini Native AI, Google OAuth)
2. **EKA App Strategy And Vision** (5-Tier Epistemic Model, Pluralism, Contemplative UI)
3. **EKA AI Agent Architecture** (Gemini 2.5 Native Client, LangGraph Pipeline, MCP Server at `/mcp`)
4. **EKA Enterprise** (Workspaces, API Keys, Rate Limits, RBAC)
5. **EKA Ads & Analytics** (Founder Ad Architecture, Platform Analytics, GA4)
6. **EKA Product Architecture** (Unified App Shell, Progressive Disclosure, Ritual Rhythm)
7. **EKA Studio Backend** (Master Control Plane, 17 Subsystems, Append-Only Audit Log)
8. **EKA Platform Architecture And Design** (Editorial Aesthetic, Ivory/Bronze Palette, React 19, TanStack Start)
9. **EKA CRM Architecture** (Member Lifecycle, Event Automations, Community Circles)
10. **EKA Frontend** (40+ Integrated Routes, Motion Primitives, Radix UI Primitives)

---

## 2. The 10-Layer Unified Architecture

```
EKA UNIFIED ARCHITECTURE
│
├── 1. Experience Layer
│   ├── Responsive Web App (Desktop / Tablet / Mobile)
│   ├── Mobile-First Navigation (Mobile Bottom Bar / Desktop Editorial Sidebar)
│   ├── Design System (Ivory / Charcoal / Warm Bronze / Terracotta / Saffron)
│   ├── Motion Primitives (TactileWrapper, FadeIn, StaggerGroup, HoverLiftCard)
│   └── Canonical Routes (/home, /junction, /create, /community, /my-eka, /system)
│
├── 2. Identity & Access Layer
│   ├── Native Supabase Authentication (OAuth 2.0 with PKCE, Magic Links, Passwords)
│   ├── Google Sign-In with Automatic Account Linking
│   ├── User Profiles (`public.profiles`) & Context Initialization
│   ├── 11-Tier Studio RBAC (`public.studio_user_roles`)
│   │   └── Founder, Super Admin, Content Admin, Knowledge Editor, Verifier, Community Moderator,
│   │       Creator Manager, Support, Enterprise Admin, Analyst, Read Only
│   └── Session Persistence & Auth State Subscribers
│
├── 3. Knowledge & Epistemic Layer
│   ├── 10 Cultural Dimensions (Entity, Lineage, Geography, Seasonality, Practice, Metallurgy, Language, Literature, Aesthetics, Ethics)
│   ├── 5-Tier Epistemic Taxonomy (Canonical Text, Historical Commentary, Living Practice, Personal Devotion, Speculative)
│   ├── Canonical Knowledge Objects (`public.knowledge_objects`) & Relations (`public.knowledge_relations`)
│   ├── Hierarchical Taxonomy Engine (`public.taxonomy_nodes`)
│   ├── Source Provenance & Passports (`public.sources`, `public.my_wisdom_passport`)
│   └── External Connectors (UNESCO, Europeana, Wikidata, Wikipedia, Wikimedia Commons)
│
├── 4. Community & Social Layer
│   ├── Feed & Discourses (`public.posts`, `public.post_comments`, `public.post_likes`, `public.post_saves`)
│   ├── Circles & Sanghas (`public.communities`, `public.community_members`)
│   ├── Audio Discourses & Episodes (`public.episodes`, `public.episode_chapters`)
│   └── Community Standards & Code of Reverence (`/standards`, `/join`)
│
├── 5. AI & Agentic Layer
│   ├── Google Gemini 2.5 Native Client (`gemini-2.5-flash`, `gemini-2.5-pro`)
│   ├── LangGraph Epistemic Pipeline (Scripture Parser, Provenance Checker, Epistemic Tier Assigner)
│   ├── Model Context Protocol (MCP) Server (`/mcp` endpoint with OAuth 2.1 authentication)
│   ├── AI Cultural Intelligence Companion ("Ask EKA AI" with zero hallucination enforcement)
│   └── AI Governance & Safe Retrieval Controls
│
├── 6. Experience & Discovery Layer
│   ├── The Junction (`/junction`, `/app/junction`)
│   ├── Google Maps Platform (Dynamic map script loading, custom tradition markers, clustering)
│   ├── Sacred Geography (Haversine pilgrimage distance calculator, 12 foundational places seed)
│   ├── Interactive Cultural Layers (Architecture, Crafts, GI Tagged Heritage, Rituals)
│   └── Regional Tradition Exploration (Hindu, Buddhist, Sikh, Jain, Islamic, Christian, Ecumenical)
│
├── 7. Creator Economy & Marketplace
│   ├── Practitioner Directory & Authentic Profiles (`public.practitioners`)
│   ├── Session Packages & Time Slots (`public.practitioner_packages`, `public.practitioner_slots`)
│   ├── Marketplace Bookings & Verified Reviews (`public.marketplace_bookings`, `public.marketplace_reviews`)
│   ├── Creator Value Scoring & Appreciation Standings (`public.creator_scores`)
│   └── Creator Payout Engine & 10% Platform Commission Pool (`public.payout_requests`)
│
├── 8. Business, CRM & Enterprise Layer
│   ├── EKA Engagement CCRM (`StudioEngagementCCRM`)
│   │   └── Member lifecycle tracking, Lead capture, Onboarding progression, Automated trigger workflows
│   ├── Enterprise Workspaces (`public.enterprise_workspaces`)
│   ├── Enterprise API Key Provisioning & Rate Limiting (`public.enterprise_api_keys`)
│   ├── Advertising & Monetization (`/founder/ad`, pricing models, sponsorship governance)
│   └── Platform Economics (Double-entry ledger `public.ledger_entries`, monthly financial closing, reserve policies)
│
├── 9. Governance, Trust & Privacy Layer
│   ├── Source Registry & Verification Dispute Workflow (`public.verification_disputes`)
│   ├── Content Moderation & Appeals (`public.content_reports`, `public.content_appeals`)
│   ├── Append-Only Studio Audit Logging (`public.studio_audit_log`)
│   └── DPDP Compliance (Explicit consent, cookie banners, statutory terms, privacy disclosures)
│
└── 10. Data & Infrastructure Layer
    ├── Database: Supabase PostgreSQL 14.5 (37 Migrations with full Row Level Security)
    ├── Storage: Supabase Storage Buckets & Cloudflare R2 Media Integration
    ├── Realtime: Supabase WebSocket Channels for notifications and live feed events
    ├── Server Runtime: Nitro v3-beta SSR with TanStack Start
    ├── Deployment: Vercel Prebuilt Deployment with strict security headers & cron definitions
    └── System Health & Diagnostics: Master System Map at `/system`
```

---

## 3. Workstream Convergence Matrix

| Workstream | Key Interfaces | Database Entities | Client Routes |
| :--- | :--- | :--- | :--- |
| **1. Google Integrations** | Maps Platform, GA4, Gemini AI, OAuth | `places`, `place_map_points` | `/junction`, `/app/junction` |
| **2. App Strategy & Vision** | Epistemic Taxonomy, Reverent Design | `knowledge_objects`, `sources` | `/`, `/knowledge`, `/standards` |
| **3. AI Agent Architecture** | MCP Handler, LangGraph State Machine | `ai_insights`, `mcp` tools | `/mcp`, `AskEkaAISection` |
| **4. EKA Enterprise** | Workspace Isolation, Rate Limits | `enterprise_workspaces`, `enterprise_api_keys`| `/studio` (Enterprise tab) |
| **5. Ads & Analytics** | GA4 Telemetry, P&L Waterfall | `analytics_events`, `eka_economics` | `/founder/ad`, `/admin/economics` |
| **6. Product Architecture** | 3-Column Shell, Rhythm, Journeys | `journeys`, `practices`, `daily_prompts` | `/app`, `/app/path`, `/app/rhythm` |
| **7. EKA Studio Backend** | 17 Subsystems, Append-Only Log | `studio_user_roles`, `studio_audit_log` | `/studio` |
| **8. Platform & Design** | Tailwind v4, Serif Typography | Stylesheet tokens (`styles.css`) | All routes |
| **9. EKA CRM Architecture** | Lifecycle Engine, Trigger Bus | `profiles`, `rhythm_reminders` | `/studio` (Engagement tab) |
| **10. EKA Frontend** | TanStack Start, React 19, Radix | `routeTree.gen.ts` | 40+ routes |

---

## 4. Canonical Routing Architecture

The unified application exposes clean, consumer-facing and operational routes:

### Consumer & Discovery Routes
- `/` — EKA Public Discovery Landing & Sacred Knowledge Explorer
- `/home` — In-App Editorial Feed & Daily Rituals (aliases to `/app`)
- `/junction` — The Cultural Junction: Sacred Geography & Maps (aliases to `/app/junction`)
- `/create` — Discourse, Reflection & Content Composer (aliases to `/app/create`)
- `/community` — Circles, Sanghas & Conversations (aliases to `/app/sanghas`)
- `/my-eka` — Personal Wisdom Passport & Dashboard (aliases to `/app/dashboard`)
- `/search` — Universal Discovery & Semantic Search (aliases to `/app/search`)
- `/practice` — Multi-faith spiritual practice directory
- `/observe` — Multi-faith sacred calendar & observances

### Professional & Control Plane Routes
- `/studio` — EKA Studio Control Plane (17 internal operational modules)
- `/admin` — High-level administration & moderation hub
- `/admin/economics` — Founder economic dashboard, ledger, and reserve pool simulator
- `/admin/creator-risk` — Creator trust monitoring and safety alerts
- `/enterprise` — Enterprise workspace management and API key provisioning
- `/system` — **Master Internal System Map & Diagnostics Dashboard**

---

## 5. Security & Authentication Model

### Direct Supabase OAuth 2.0 PKCE Flow
1. **Initiation:** The user clicks "Continue with Google" on `/auth`.
2. **Challenge Generation:** Supabase Auth SDK generates a high-entropy PKCE code verifier and code challenge.
3. **Redirect to Google:** Client redirects to `accounts.google.com` requesting scopes `openid email profile`.
4. **Callback Exchange:** Google redirects back to `https://<project-ref>.supabase.co/auth/v1/callback` with authorization code.
5. **Session Issuance:** Supabase verifies PKCE, mints JWT access and refresh tokens, and stores the session in browser `localStorage`.
6. **Trigger Execution:** PostgreSQL trigger `on_auth_user_created` creates or updates `public.profiles`, links the social avatar, and assigns the default `member` role.
7. **Redirect:** The client is seamlessly transitioned to `/app` or `/system`.

---

## 6. Observability & System Health

1. **System Health Console (`/system`):** Exposes live health metrics for Database connectivity, Supabase Auth, Google Maps loader, Gemini AI client, GA4 readiness, Realtime channels, and storage endpoints.
2. **Error Boundary & SSR Protection:** `src/server.ts` intercepts catastrophic SSR errors and normalizes h3 swallowed exceptions.
3. **Audit Trails:** Every mutation performed in EKA Studio writes an immutable record to `public.studio_audit_log` capturing actor role, action, target entity, and timestamp.
