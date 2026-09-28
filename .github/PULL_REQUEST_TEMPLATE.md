## EKA Pull Request

### 1. Summary of Changes

<!-- Provide a concise description of what this PR introduces, fixes, or refactors. -->

### 2. Architectural Pillars Touched

- [ ] Frontend UI / Motion / Styling
- [ ] Epistemic Knowledge Model & Taxonomy (5-tier standard)
- [ ] Supabase / Postgres Database & RLS
- [ ] Redis Caching / Rate Limiting
- [ ] Queues & Asynchronous Background Workers
- [ ] Search / Vector Infrastructure
- [ ] Observability (Sentry / PostHog)
- [ ] Mobile Client (Expo / React Native)
- [ ] Legal & DPDP Compliance

### 3. Launch Gate & Quality Checklist

- [ ] **Typecheck & Build:** Code compiles cleanly with zero TypeScript errors (`npx tsc --noEmit`).
- [ ] **DPDP Act & Privacy:** No unnecessary sensitive data collected (religion/caste is voluntary). All telemetry respects cookie consent (`hasAnalyticsConsent()`).
- [ ] **Epistemic Integrity:** Content claims cite primary sources and adhere to the 5-Tier standard. Zero guaranteed healing or financial claims.
- [ ] **Accessibility (WCAG 2.2 AA):** All interactive elements are keyboard-accessible, focus rings are visible, and images have meaningful alt text.
- [ ] **Secrets & Security:** No API keys, passwords, or production secrets committed.
- [ ] **Tests & Migrations:** Any database schema changes have corresponding migration files in `drizzle/` or `supabase/`.
