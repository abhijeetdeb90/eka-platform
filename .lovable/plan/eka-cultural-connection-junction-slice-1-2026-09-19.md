# EKA — Cultural Connection Junction (slice 1)

Evolve the existing EKA app rather than rebuild it. Nothing currently working is removed: auth, profiles, feed, Circles, Reels, Journey, Rhythm, Marketplace, moderation and economics all stay exactly as they are. This slice adds the Junction, Place pages and the cultural map, and finishes three screens whose code already exists but is unreachable.

## Part A — Finish the unreachable screens

Three pieces of working code have no screen attached:

- **Creator dashboard** — a creator sees their appreciation (Respect / Inspired / Learned / Reflect / Devotional, weighted), cross-tradition reach, knowledge contributions, and a fair-share earnings simulation against a hypothetical reward pool.
- **Community governance** — stewards see reports on content inside their own community, can hide or restore it, and see the full action history.
- **Appreciation on content** — the weighted appreciation already recorded is shown on posts and creator profiles instead of a bare count.

Each gets a menu entry so it is reachable, plus loading, empty and error states.

## Part B — The Junction

A new top-level destination: search a place, land on it, and see everything culture connects to.

- **Search** — type "Varanasi", "Kyoto", "silk", "Diwali"; results are grouped by what they are (place, tradition, festival, food, craft, language, creator, knowledge).
- **Place page** — full-width hero, short cultural introduction, map, and then the layers: faith and spiritual life, history, food, language, clothing and textiles, craft and artisans, music, family and local customs, markets and shops, festivals and calendar, local creators, things to experience, community stories, sources, related places.
- **Connection network** — an interactive map of how a place's culture connects (spiritual, culture, food, language, local life, tourism, commerce), expandable node by node on desktop and a scrollable connection map on mobile.
- **"Connected to"** on every cultural item, so no page is a dead end.
- **Go deeper** — a progressive reveal: what is it, where it came from, who practises it, what it means, how it varies, where to experience it, who keeps it alive, what to read next.

## Part C — The cultural map

Google Maps, connected through Lovable (one click, no account needed). Markers for sacred places of every tradition, heritage sites, museums, markets, food, artisan workshops, shops, festivals and experiences, with filters (faith, heritage, food, markets, craft, music, events). If someone declines location access they pick a city manually. No private person locations are ever shown.

## Part D — Seed places

Five carefully built demonstration places, India and worldwide:

- Varanasi (Indian cultural city)
- Kolkata (Indian metro, Durga Puja)
- Kyoto (international cultural destination)
- Jerusalem (strong religious diversity)
- Marrakesh (craft and food)

Every claim carries its status openly: a real public source where I can verify it and cite it, otherwise clearly marked as demonstration content. No invented citations, ever. Different traditions are kept distinct — never flattened into one generic spirituality, and no practice is attributed to a single tradition where several hold it.

## Technical notes

- New tables, extending the existing knowledge graph rather than duplicating it: `countries`, `regions`, `places`, `place_layers`, `cultural_items` (food, craft, clothing, language, music, custom), `sources`, `place_relationships`, and links from `places`/`cultural_items` into the existing `wisdom_nodes` / `wisdom_edges` and `post_knowledge_links`. Row-level security on all of them: public read for published cultural records, writes limited to the contributor, reviewers and admins. GRANTs written with each table.
- Public, indexable routes: `/place/$country/$slug`, `/tradition/$slug`, `/festival/$slug`, with per-page metadata.
- `/app/junction` for the signed-in experience; Junction added to nav on desktop and mobile.
- Graph visualisation with `@xyflow/react`; motion via the existing animation approach, honouring reduced-motion.
- Google Maps rendered with the managed browser key; any Places lookups go through an authenticated backend function, never the browser.
- Images lazy-loaded and responsive; place layers paginated; no unbounded queries.

## Deliberately not in this slice

Cultural routes and the itinerary builder, local business and product profiles, the language audio engine, family/private collections, learning paths, the full review and dispute governance ladder, and the AI cultural guide. They are the next slices once the Junction loop works end to end.
