# EKA — Wisdom Infrastructure, Phase 1 Foundation

This brief describes a multi-year platform. Attempting all five phases in one pass would destabilise the working product (marketplace, memberships, rhythm/path, ledger, economics dashboard, moderation). This plan implements **Phase 1 only**, behind feature flags, reusing existing tables wherever they already carry the concept. Later phases get their own plans.

## What already exists (verified in the codebase)

- Marketplace with practitioners, packages, slots, bookings, reviews, 10% fee model.
- Creator Score (`creator_scores`, `creator_score_events`) and Creator Pool (`creator_pool_periods`, `pool_allocations`).
- Journeys (`journeys`, `journey_days`, `journey_enrollments`, `journey_day_logs`), Path tokens, Rhythm, Journal, Observe.
- Circles as `communities` + `circle_activities` + `circle_activity_joins`, with moderation, reporting, appeals, restrictions.
- Full append-only financial ledger (`ledger_entries`), finance expenses/distributions/periods, `/admin/economics` founder dashboard, `platform_config` with change history.
- Verification flow for practitioners (identity / credentials / experience, EKA Recommended).

So Phase 1's "financial architecture", "Economics Dashboard", "Journey data model" and "Circles foundation" are largely done. The genuine gaps are: Trust Profile, Creator Score 2.0, Wisdom Passport, problem-first discovery, and feature flags.

## What Phase 1 adds

**1. Feature flags**
Reuse `platform_config` (already admin-editable and audit-logged) for a `feature_flags` object: `wisdom_passport_enabled`, `trust_profile_enabled`, `discovery_v2_enabled`, plus off-by-default placeholders for the later systems. A `useFeatureFlag()` hook gates every new surface. Nothing new ships enabled to all users without an admin switch.

**2. EKA Trust Profile** (extends `practitioners`, no new identity table)
A public trust panel on the practitioner page and a private "Your trust profile" view for creators, showing only observable facts: verification level, languages, traditions, years of practice, response rate, completion rate, cancellation rate, review summary, safety review status, source attribution. New derived columns/aggregates are computed from existing bookings, reviews, reports and moderation actions — no self-reported trust. Copy explicitly avoids any claim of spiritual authority.

**3. Creator Score 2.0**
Keep the table; add dimension breakdown (quality, completion, trust, reach, reliability, contribution, safety, satisfaction) with admin-configurable weights stored in `platform_config`. Creators get a "Why this score?" explanation, history, and concrete improvement suggestions. Payment volume alone never moves the score, and the score is never purchasable.

**4. Wisdom Passport (foundation)**
A new user-owned aggregate with per-section visibility (private by default, selective share, export, delete). Version 1 derives from data already recorded — practices, traditions explored, teachers learned from, journeys completed, sessions attended, circles joined, reflections count — plus a `wisdom_passport_settings` table for visibility choices and a shareable read-only view. Religion/reflection content is never exposed without explicit opt-in.

**5. Discovery v2 (problem-first)**
A new `/app/explore` mode asking "What are you exploring?" over ~16 themes (purpose, peace, grief, meaning, compassion, culture…), each resolving to five lanes: Explore, Practice, Connect, Experience, Deepen. Themes map to existing content via a lightweight `themes` + `theme_links` pair — the seed of the Wisdom Graph, without building the full graph yet. Purchasing is one lane of five.

**6. Analytics events**
Consistent events on the existing `analytics_events` table for journey start/completion, theme exploration, passport views, trust-profile views, and creator-score changes.

## Deliberately deferred

Wisdom Graph proper, Wisdom Compare, AI Wisdom Navigator + governance, Cultural Memory Network, institutional profiles, multilingual knowledge, Break-Even and $1T strategy engines, Wisdom API, public transparency pages. Each is a later plan; the Phase 1 data shapes are chosen so they slot in without rewrites.

## Technical notes

- All migrations are additive: new tables plus nullable columns. No renames, no drops, no changes to `ledger_entries` semantics.
- Every new public table gets explicit GRANTs and RLS scoped to `auth.uid()`; passport and trust tables default to owner-only reads, with a narrow policy for explicitly shared passports.
- Derived metrics (trust signals, score dimensions, passport totals) are computed by security-definer SQL functions over existing rows so there is no second source of truth.
- No seeded users, transactions, reviews or knowledge. Empty surfaces say "not enough data yet".

## Risks

- Trust signals are only as good as current booking/review volume; early profiles will look sparse. Mitigated by honest empty states rather than filler.
- Passport visibility is the highest-sensitivity surface in the product; it ships private-by-default with per-section opt-in.
- Score weight changes are retroactive on display; historical snapshots are kept so a weight change never silently rewrites a creator's past.

## Needs founder approval

- Default feature-flag state for each Phase 1 system (proposed: all off except Trust Profile).
- Whether Wisdom Passport sharing may include tradition/religion signals at all, or only practice counts.
