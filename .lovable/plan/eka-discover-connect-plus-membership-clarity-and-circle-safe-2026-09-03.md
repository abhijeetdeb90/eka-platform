# EKA — Discover & Connect, plus membership clarity and circle safety

Five workstreams, built in order. Everything reuses the existing app shell, Circles, membership and AI companion rather than starting new surfaces.

## 1. Membership clarity everywhere (small)

- A compact entitlement strip rendered at the top of EKA Daily, Journeys list and every Journey detail page: current state (trial, active, ending, paused, past due, none), renewal or end date, and one "next resume step" — the exact next thing to do (finish today's prompt, log Day N of a journey, or start a journey if none is active).
- Locked content shows why it's locked and links to Membership rather than failing silently.

## 2. Reflection tone + grounded AI

- New profile setting: reflection tone — gentle, devotional, or practical. Stored on the profile and shown in Settings with a one-line description of each.
- The companion's system voice adapts to the chosen tone, and its grounding rules tighten: it may only use the member's own journal entries, journey reflections and the EKA prompt text. It never invents events, never quotes scripture the member didn't write, and says plainly when there isn't enough of the member's own material yet.

## 3. Circle Activity moderation and capacity

- Activity creators can set a capacity and require join approval. Requests sit in a pending list the host approves or declines; full activities show "full" instead of a join button.
- Report button on every activity and every activity comment, feeding the existing moderation queue.
- Milestone participants are managed by the host: add, remove, and mark who took part.

## 4. Discover & Connect (the main build)

Four new surfaces under a shared Discover section, positioned as Discover → Understand → Discuss → Respect → Connect.

**Reels** — short cultural/religious clips, 30–90s. Both upload (to backend storage) and external link embeds. Vertical player, one clip at a time, with title, tradition tag, creator, and a required short context line. Discovery ranking favours completion, saves and cross-tradition reach — not comment volume or controversy.

**Reactions** — replaces plain likes on Discover content: Appreciate, Respect, Learned something, Cross-cultural discovery, Inspiring. These feed both ranking and the creator quality score.

**Explore pages** — structured discovery for religions, cultures and traditions: overview, history, how it is observed, regional differences, and linked reels, episodes and circles. Same template for every tradition, no ranking between them.

**Episodes (podcast-first)** — published audio/video episodes with description, host, chapters and a discussion thread. Live sessions appear as scheduled announcements with RSVP that convert into an episode afterwards.

**Respect-first design** — visible community norms on every Discover surface, context required before publishing anything on a sensitive topic, a report flow on all content types, and moderation tooling for hate, incitement and harassment.

## 5. Creator economy and EKA Pay

- **Wallet**: balance, top-ups, transaction history for every member.
- **Monetization**: creator tips, paid episodes and paid live sessions, creator memberships, and donations to verified organisations — with a transparent platform fee shown before every payment.
- **Creator quality score**: computed from observable signals (watch completion, saves, meaningful shares, cross-community reach, live attendance, repeat viewers) minus enforcement signals (reports upheld, spam, manipulated engagement). Methodology page visible to creators.
- **Peace & Knowledge Fund**: a revenue allocation view showing pool size, eligibility rules and distribution per period, with human review required above a payout threshold.
- **Payments status**: your business is registered in India. Lovable's built-in payment providers do not cover India-based sellers for this model, so wallet top-ups, tips and payouts will run on a real ledger with a clearly-labelled test payment path. When you connect a provider (Razorpay is the natural fit for India), only the charge and payout calls swap in — the ledger, fees, entitlements and history stay as built.

## Technical notes

- New tables: `reels`, `reel_views`, `content_reactions`, `explore_topics`, `explore_sections`, `episodes`, `episode_sessions`, `episode_rsvps`, `content_reports` (extending existing reports), `wallets`, `wallet_transactions`, `creator_payouts`, `creator_scores`, `fund_allocations`, plus `circle_activity_requests` and capacity/approval columns on `circle_activities`. Every table gets RLS and explicit grants.
- Reels media uses a new storage bucket with size and MIME limits; embeds are stored as validated URLs.
- Ranking, quality score and fund distribution run as server functions, not client code, so weights are not gameable.
- Reflection tone is a profile column read by the AI server function; grounding is enforced in the system prompt and by only passing the member's own rows as context.
- The 12-month theme calendar, existing journeys and Circles stay unchanged; Discover links into them rather than duplicating.

## Order of delivery

1. Entitlement strip + reflection tone + circle moderation (fast, completes prior work)
2. Discover schema, Reels, reactions, reporting
3. Explore topic pages and episodes
4. Wallet, tips, paid episodes, quality score, fund
