# EKA — audit findings and implementation brief

## What already exists (verified in the codebase)

- **Your Path**: Journey / Practice / Journal / Observe / Rhythm all built, with Path Tokens awarded through a database function that already halves repeat awards within a day.
- **Rhythm**: Sacred Moments, consistency ring, week strip, check-ins, smart adjustments, weekly reflection, settings — with gentle recovery language, no streak shaming.
- **Marketplace**: practitioner profiles, packages, availability, booking, reviews, verification flags, practitioner dashboard.
- **Money**: wallet ledger, 10% platform fee shown before payment, fee allocation buckets, Creator Score, audit trail and receipts.
- **Trust & Safety**: reports, auto-escalation, restrictions, appeals, moderation log, admin queue.
- **First week**: a 7-day arc exists, but as a hardcoded list in code.

## Real gaps against the brief

1. Economics are constants in code — fee %, allocation buckets, Creator Score weights and the review threshold cannot be changed by an admin.
2. No payout lifecycle. Creators cannot request a payout; admins have no review queue.
3. No admin surface for practitioner verification, journeys, practices, prompts or observations.
4. Creator Pool has no periods, no distribution, no "why your score changed".
5. The launch campaign is hardcoded, not a reusable engine.
6. India-only assumptions: rupees everywhere, server-day boundaries, no timezone, locale, country or currency on a member or practitioner.
7. No north-star measurement of Meaningful Spiritual Days, and no funnel analytics.

---

## Track A — Trust, money and admin

**Configurable economics.** A `platform_config` table holding fee percent, allocation buckets, Creator Score weights, payout review threshold and pool funding rate, read through a single cached accessor. Every screen that shows a percentage reads it from there. Admin editor with change history.

**Payouts.** A `payout_requests` table with pending / approved / rejected / paid / refunded, plus a `risk_flags` array so risk-based review can grow beyond a single amount threshold. Creators request payouts from their dashboard against an available balance (earned, minus pending, minus a holdback window). Admin review queue showing creator, amount, source transactions, reason, risk flags, verification status and previous payouts, with approve / reject / mark-paid.

**Verification.** Admin queue over practitioner applications: identity, credentials, experience reviewed independently, then EKA Verified and Top Rated as derived states. Manual approve/reject with a recorded reviewer and note. Nothing auto-granted.

**Creator dashboard.** Earnings split by source — conversations, memberships, gratitude, marketplace, Creator Pool — plus pending payout, available payout, EKA fees generated and impact generated. Creator Score shows each component with a plain-language reason for its last change, recorded in a `creator_score_events` table.

**Creator Pool.** `creator_pool_periods` (pool amount, funding source, status) and per-creator allocations computed from configured weights, with a preview-then-publish step for admins. Never a substitute for direct earnings, and stated as such in the UI.

**Impact.** The impact dashboard reads only from real transactions and real allocations. Buckets and percentages come from config; nothing hardcoded.

---

## Track B — Member experience

**Subscription gate (middle path, as chosen).** The first 7 days and the first 100 tokens are fully open. After that, Path progression, token earning, Rhythm and Journal/Observe history require an active membership. Already-written journal entries are never locked away — a member can always read and export their own words. Upgrade states explain what continues and why, with no countdown pressure or dark patterns.

**Token integrity.** Tokens stay non-purchasable. Add a daily cap per action type, a minimum meaningful-completion condition (dwell time for a practice, non-trivial text for a reflection) and a single ledger path so no client can award itself tokens.

**Journey map.** A visual progression across Beginning → Discipline → Awareness → Wisdom → Integration, each lock stating the exact token threshold and how far away it is. Spiritual verbs only: Begin, Continue, Return, Deepen, Unlock.

**Journal milestones.** First Reflection (7), A Month of Reflection (30), The Witness (100), with a quiet history view. No psychological or medical claims.

**Campaign engine.** `campaigns`, `campaign_days` and `campaign_progress` tables replacing the hardcoded week. "7 Days. One Path." becomes seeded data — Begin, Practice, Observe, Reflect, Serve, Connect, Continue — awarding tokens per day and the Path Initiate milestone plus the next Journey on completion. Future campaigns are rows, not code.

**Analytics and north star.** Meaningful Spiritual Days derived from real completions: a day counts when a subscriber completes a practice, observation, journal reflection or journey day. Admin analytics showing meaningful days per subscriber, share with 3+ meaningful days a week, 7- and 30-day retention, journey completion, subscription conversion, marketplace conversion and GMV, take rate and creator earnings. Event coverage extended across practice, observe, journal, journey, tokens, unlocks, bookings, payouts and pool distributions. Nothing optimises for views, dwell time or notification opens.

---

## Track C — Globalization

**Data model.** Currency, country, timezone and locale on members and practitioners; currency stored alongside every money amount; a `country_rules` table for market-specific marketplace and payout rules; payout regions on practitioners. No India-only defaults anywhere.

**Money and time.** A single `formatMoney(amount, currency, locale)` replaces rupee-only formatting across wallet, marketplace, checkout, creator dashboard and receipts. Day boundaries for rhythm, tokens and meaningful days computed in the member's own timezone, so a 9:30 PM journal counts on the right day everywhere.

**Localization.** An i18n layer with every UI string extracted to message catalogues, language switching, persisted preference, and right-to-left layout support. Shipped languages: English, Hindi and Arabic. Spiritual and tradition-specific terms are kept in their own language rather than translated into a generic vocabulary — traditions stay distinct, mechanics stay universal. Machine-assisted translations will be marked as needing a native review before launch in each market.

**Payments.** The wallet stays a test ledger. Real charges need a payment provider connected to EKA; I will flag when that decision is due rather than fake it.

---

## Sequencing

Track A, then Track B, then Track C — each shipped and verified before the next starts. Within each track, database and configuration first, then the surfaces that read them.

## Technical notes

- New tables: `platform_config`, `payout_requests`, `creator_score_events`, `creator_pool_periods`, `pool_allocations`, `campaigns`, `campaign_days`, `campaign_progress`, `country_rules`. All with row-level security and explicit grants; admin-only writes go through role-checked policies using the existing `has_role` function.
- Token awards, payout state transitions and pool distribution run as security-definer database functions so the client can never mint value.
- Existing constants in `pay.ts`, `unlocks.ts` and `firstweek.ts` become thin readers over configuration and seeded data; current behaviour is preserved as the seeded defaults so nothing regresses.
- The four critical journeys — member, creator, marketplace, admin — are walked end to end in the browser before each track is called done.
