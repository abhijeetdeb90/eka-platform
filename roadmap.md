# EKA roadmap

Canonical blueprint: see `docs/` (`docs/README.md`). This file is the live task list.

## Current design direction

- [ ] Redesign the shared discovery system and Home experience with Deepstash-inspired progressive exploration
- [ ] Retain EKA's current ivory, charcoal, warm-bronze palette and calm editorial visual identity
- [ ] Build reusable content-card, connection, and context-panel patterns before expanding more screens

## Done

- P0 rebrand, auth, profiles, feed, posts, likes, comments, follow, Sanghas, Explore, notifications, search
- P1 saves, share, onboarding, moderation, EKA Plus, analytics
- Membership V2, journeys, daily prompts, cancellation/retention, Circles, AI companion
- Discover: Reels, Conversations/Episodes, wallet, fund, appeals, offline shell
- Pre-login questionnaire (/join), Community Standards (/standards), settings context editing

## Done (cont.)

- Home page editorial redesign
  - Three-column desktop shell (compact nav / feed / discovery rail)
  - Grouped sidebar nav: EKA, YOUR PATH, COMMUNITY, YOU
  - Editorial composer ("What are you sitting with today?")
  - Daily ritual hero above the feed
  - Richer feed cards with media, tags, reactions
  - Right rail: EKA Today, Today's Practice, People & Ideas, Upcoming Circles, Continue Your Journey
  - Warm ivory/terracotta/saffron/forest palette tokens + photography

## Not building (P2)

- Physical products, e-commerce, inventory, shipping

## Marketplace (in progress)

- [x] Practitioner/package/slot/booking/review schema + seed
- [x] Marketplace home, filters, sort, curated rails
- [x] Practitioner profile with authenticity checks + booking
- [ ] Booking confirmation + verified review
- [ ] Practitioner dashboard (packages, slots, earnings with 10% fee)
- [ ] Nav entry for Marketplace

## Your Path — devotional progression (next)

- [ ] Path Tokens ledger (journey/practice/journal/observe/daily/weekly), no purchase path
- [ ] Diminishing returns so repetition without sincerity earns less
- [ ] Stage map: Begin -> Discipline -> Awareness -> Wisdom -> Integration with token gates
- [ ] Daily quest triad (practice/reflect/observe) + completion bonus
- [ ] Observe: daily observation prompts, "I observed it"
- [ ] Journal reflection milestones + reflection insights (patterns)
- [ ] Consistency (no punishing streaks) + Milestones instead of badges
- [ ] Tradition layer (Hindu/Buddhist/Christian/Islamic/Sikh/Jain) over universal mechanics
- [ ] Weekly challenge
- [ ] Spiritual profile summary (no leaderboards)
- [ ] Marketplace tie-in at later journey stages

## Founder economics (in progress)

- [x] Append-only ledger, private finance records, monthly close
- [x] /admin/economics founder dashboard (snapshot, waterfall, P&L, unit economics, cash, pool, mission, founder, ledger, settings)
- [x] Founder simulator + growth target calculator + alerts + decision panel
- [ ] Wire real payments into the ledger when a provider is connected

## Home banner

- [x] Replace hero with the enclosed EKA circle image (CDN asset, /)

## Agent integrations (MCP)

- [x] Expose EKA as an MCP server (@lovable.dev/mcp-js) at /mcp
- [x] Supabase OAuth 2.1 resource server + consent route, tools act as the signed-in user
- [x] Read-only user tools: profile, dashboard summary, recent reflections
- Note: clients can connect only after the app is published
