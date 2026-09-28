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

