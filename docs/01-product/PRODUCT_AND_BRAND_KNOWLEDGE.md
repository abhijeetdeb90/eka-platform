> Canonical EKA documentation. Source of truth for product, architecture, trust and delivery decisions.
> Versioning: v0.1, v0.2, v1.0. Mark assumptions as `ASSUMPTION` and unresolved decisions as `OPEN`.
> Never store passwords, API keys, tokens, private user data or production secrets in this repository.

# EKA — Product & Brand Knowledge (v1.0 DRAFT)

**Suggested path:** `docs/01-product/PRODUCT_AND_BRAND_KNOWLEDGE.md`
**Status:** DECIDED 2026-10-05 on founder instruction. Items tagged `ASSUMPTION` in §14 need confirmation before dependent work ships. Logged in `DECISION_LOG.md` as v1.4 and v1.5.
**Rule of precedence:** where this file conflicts with an older blueprint, this file wins.

---

## 1. The one-page version

| | |
|:--|:--|
| **Name** | EKA |
| **Tagline** | One within. One with all. |
| **Category** | Trusted cultural & community intelligence platform |
| **One-liner** | EKA helps you understand the traditions, places and people of the world you belong to, with sources you can check and communities you can meet. |
| **Positioning** | Wikipedia explains *what* something is. EKA explains *what it means to the people who live it*, and shows you how we know. |
| **Consumer invitation** | "Come understand this." |
| **Core rule** | The intelligence is artificial. The community isn't. |
| **Wedge** | Ask your culture. Discovery and meaning, not a scroll feed. |
| **What it is not** | A spiritual social network, a tourism brochure, a chatbot, an ad-funded feed. |
| **Moat (defensible)** | Provenance, lineage endorsement, graph density, reverent brand. |
| **Launch market** | India first; English + Hindi; clusters gated by reviewer supply (§14.5). |

---

## 2. Brand

### 2.1 Mission and vision
- **Mission:** Make humanity's cultural, spiritual and local wisdom discoverable, understandable, verifiable, contextual and preservable.
- **Vision:** The trusted context layer between living human heritage and the AI era.
- **Foundational loop:** Source → Verify → Contextualize → Discover → Understand → Learn → Discuss → Create → Preserve.

### 2.2 Brand pillars

| Pillar | Means | Shows up as |
|:--|:--|:--|
| **Reverence** | Treat traditions as living, not content | Calm UI, no ads, no outrage mechanics |
| **Provenance** | Every claim shows where it comes from | Source badges, tier + level labels |
| **Plurality** | No single correct tradition or region | Multiple lineages and variations shown side by side |
| **Humanity** | Real people, labelled machines | Zero bots, badged AI |
| **Depth over speed** | One discovery completed beats a hundred scrolled | Daily capsule, quests, saves |

### 2.3 Voice and tone

**Voice:** a well-read friend who has done the fieldwork. Calm, precise, curious, never preachy.

| Do | Don't |
|:--|:--|
| Name the source and the tier ("Interpretation by the Advaita school") | Present an interpretation as universal doctrine |
| Say "documented", "reported by", "practised in" | Say "proven", "the truth is", "authentic" without a source |
| Hold disagreement openly ("Traditions differ here") | Collapse regions into one answer |
| Short sentences, concrete nouns, local names and scripts | Mystical filler, wellness clichés, hype |
| Invite contribution ("How is this practised in your village?") | Ask people to "join an app" |

**Tone by context**
- Learning surfaces: warm, explanatory.
- Sacred or grief-adjacent content: quieter, minimal copy, no gamified language.
- Trust and moderation messages: plain, specific, non-accusatory, always with an appeal route.
- Commerce: transparent, fees stated up front, no urgency tricks.
- Investor and enterprise: precise, evidence-first (see §12).

### 2.4 Vocabulary

| Term | Meaning |
|:--|:--|
| **Knowledge Object (AKO)** | Atomic, sourced unit of knowledge |
| **Epistemic type** | What kind of statement it is (§5.1) |
| **Verification level (L0–L5)** | How well it is evidenced (§5.2) |
| **Sangha / Circle** | Moderated human community space |
| **Wisdom Passport / My EKA** | A member's private-by-default record of roots, discoveries and saves |
| **Junction** | Map and geography discovery surface |
| **Keeper** | Community member who validates lived practice |
| **Ask EKA** | The labelled AI guide |
| **EKA Daily** | One 60-second discovery capsule per day |
| **Culture Quest** | Guided multi-step regional exploration |

### 2.4.1 Words and claims to avoid
"Zero-hallucination" (unprovable; say *grounded, cited, audited*), "production ready", "fully compliant", "fully secure", "guaranteed" (any outcome), "authentic" as a bare adjective, "unscrapable", and any "1 like = ₹X" framing.

### 2.5 Visual identity
- **Palette:** ivory, sand, terracotta, charcoal; accents warm bronze and saffron; forest as secondary.
- **Type:** Fraunces (serif, headings), Karla (sans, body). Both open-licence (OFL), self-hosted; Noto Indic fallbacks (§14.10).
- **Mark:** 12-petalled mandala. Calm, symmetric, never animated decoratively.
- **Imagery:** documentary, real people and places, credited. No AI-generated "sacred" imagery presented as real; AI imagery, if ever used, is labelled.
- **Layout:** card-based, information-dense, progressive disclosure. Inspired by learning-card patterns but an original EKA language. No copied proprietary layouts or assets.
- **Motion:** 150–500 ms, explains hierarchy only, respects `prefers-reduced-motion`, never obscures warnings, consent or moderation actions.
- **Accessibility floor:** WCAG 2.1 AA, 4.5:1 contrast, skip link, visible focus, keyboard navigation.

---

## 3. Product

### 3.1 Problem
1. Cultural knowledge is fragmented and context-free.
2. Authenticity is unclear; feeds reward outrage, and general AI flattens or invents.
3. Tradition holders and creators have no structured, credited, paid home.
4. Communities can't correct or contextualize what is said about them.

### 3.2 Who it serves

| Persona | Job to be done | Primary surface |
|:--|:--|:--|
| Curious seeker / learner | Understand a tradition without losing context | Ask EKA, Daily, Explore |
| Diaspora member | Reconnect with roots | My EKA, Circles |
| Tradition keeper / elder | Preserve and be credited | Contribute, Variations |
| Creator / educator | Publish sourced knowledge and earn | Creator Studio |
| Scholar / reviewer | Verify and endorse | Review queue |
| Practitioner / guide / artisan | Be found, booked, paid fairly | Directory, Marketplace |
| Moderator / admin / founder | Run it safely | Studio, Admin |
| Enterprise / AI lab (later) | Grounded cultural context | Context API |

### 3.3 Product hooks (consumer wedge)
1. **Ask Your Culture:** search-first home, not a post feed.
2. **EKA Daily:** one completed discovery per day.
3. **My EKA:** compounding personal heritage record.
4. **Culture Quests:** purposeful exploration, no streak guilt.
5. **Ask a Community:** layered answers (sources, community, expert, AI synthesis, regional variation, fact vs interpretation).
6. **Living Wikipedia:** knowledge linked to people, places, events, creators.
7. **EKA Lens:** camera overlay. `LATER`.

**Home anti-pattern:** a plain Posts → Likes → Comments feed. If Home looks like that, the product has failed its own thesis.

### 3.4 Scope by stage

| Stage | In | Out |
|:--|:--|:--|
| **MVP (testable)** | Auth, profiles, interests; feed/discovery; content cards + detail with sources; metadata and tiers; save; comments + report; creator submission; admin review queue; basic search; audit log; basic analytics; responsive web | Rev-share engine, marketplace, partner API, native apps |
| **Should-have** | Related content, community context contributions, map/list discovery, creator dashboard, trust labels, notifications, basic moderation rules, Ask EKA (grounded) | Advanced recommendations |
| **Later** | Subscriptions at scale, creator pool payouts, marketplace and bookings, pilgrimage logistics, multi-language workflows, Context API, CCP open standard, EKA Lens, native mobile | |

`NOTE`: several "Later" items already exist in code or blueprints. Anything built ahead of this table ships behind a feature flag and off by default until the exit criteria in `MVP_SCOPE.md` are met.

### 3.5 Information architecture
Home · Explore · Search · Topics · Places (Junction) · Communities (Circles) · Creators · Events · Saved · Notifications · Creator Studio · Admin Console.
**Navigation rule:** from any item, a user reaches context, source, related entities, creator and discussion without losing place.

### 3.6 Canonical routes
`/` landing · `/home` feed · `/junction` map · `/create` composer · `/community` circles · `/my-eka` passport · `/search` · `/practice` · `/observe` · `/stories` campaign · `/founder/ad` · `/standards` `/privacy` `/terms` `/cookies` `/refund` `/copyright` legal · `/studio` `/admin` `/enterprise` `/system` internal.

---

## 4. Knowledge model

- **Entities (22 types):** Tradition, Community, Culture, Place, Monument/Temple, Practice, Ritual, Festival, Text, Source, Creator, Experience, and the remaining types in `07_KNOWLEDGE_GRAPH.md`. `OPEN`: the graph doc lists 12 explicitly while claiming 22. Enumerate all 22 once.
- **Required metadata for publishable knowledge:** title, summary, content type, category, tradition/community, geography, sources, creator explanation, epistemic type, verification level, related entities, language, media-rights status, review status, version history.
- **Taxonomy rules:** versioned; aliases and translations supported; never force a single religious or regional label; log who changed what and why.
- **Provenance:** source passport (author, edition, archive URI), immutable edit history, sponsorship kept separate from attribution.

---

## 5. Epistemic canon (DECIDED, replaces five conflicting definitions)

The current docs define tiers five different ways. Fix: **two orthogonal axes plus flags**, so a claim can be "Interpretation, Level 3".

### 5.1 Axis A: Epistemic type (what kind of statement)

| # | Type | Meaning |
|:--|:--|:--|
| 1 | **Documented Tradition** | Backed by canonical texts, inscriptions, archives |
| 2 | **Interpretation** | Commentary by an identified scholar, school or lineage |
| 3 | **Living Practice** | Folkways and oral custom observed by communities |
| 4 | **Opinion & Reflection** | Personal experience or insight |
| 5 | **AI-Assisted Synthesis** | Machine-assisted summary; always labelled, human-reviewed before promotion |

*Modern adaptation* is not a type. It is a **flag** on type 3 or 4.

### 5.2 Axis B: Verification level (how well evidenced)

| Level | Name | Evidence |
|:-:|:--|:--|
| 0 | Unverified | No citations |
| 1 | Source-Referenced | ≥1 checkable source |
| 2 | Community Corroborated | Members of the source tradition confirm |
| 3 | Expert Reviewed | Accredited scholar or lineage holder signs off |
| 4 | Multi-Source | ≥3 independent sources |
| 5 | Archival Benchmark | Certified by archive or custodian institution |

### 5.3 Flags (not tiers)
`Disputed / Under Review` · `Commercial / Promotional` · `Modern Adaptation` · `Sensitive / Sacred-Restricted`.

### 5.4 Invariants
- Popularity never raises a level. Votes do not equal evidence.
- Only humans confer level 2+. AI may locate sources and propose, never confer.
- Guaranteed supernatural, medical or financial outcomes are rejected at every level.
- Disagreement is documented, not erased. Disputed claims route to human review.
- Display format: `Interpretation · Level 3 · Source-backed: 3 references · 1 scholar review · 0 active disputes`.

---

## 6. Trust architecture (5 pillars)

1. **Human Authenticity:** zero bots, zero synthetic personas, zero manufactured engagement. Bot accounts are terminated and their engagement expunged.
2. **Epistemic Verification:** §5 ladder.
3. **Source Provenance:** passports and chains of custody.
4. **Content Authenticity:** typing, anti-noise filter, no miracle claims.
5. **Community Governance:** keepers, hermeneutic dispute queue, appeals ladder.

**Anti-noise filter (content must do at least one):** teach meaningful knowledge · preserve living heritage · foster real connection · enable cultural participation · create real community or economic value.

**Never-automated red lines**
1. No AI declaration that a doctrine is true or heretical.
2. No automated erasure of oral traditions for lacking academic citations.
3. No AI substitute for lived practice, darshan or lineage.
4. No verified badge for guaranteed supernatural outcomes.
5. No confiscation of creator funds without multi-person human sign-off.

---

## 6.1 AI policy
- **Allowed (behind the scenes):** citation checking, translation (disclosed), moderation triage, semantic search, personalization, drafting help for humans, fraud and bot detection, a clearly badged "Ask EKA".
- **Prohibited:** fake personas, synthetic engagement, covert participation in Sanghas or DMs, fabricated citations, arbitrating sacred truth, unreviewed removal of disputed claims.
- **Grounding rule:** Ask EKA answers only from indexed knowledge objects, cite them, show type and level, and say "not found in EKA's verified sources" instead of guessing.
- **Model IDs live in config, never in docs or types.** `ASSUMPTION`: Gemini primary with provider-agnostic abstraction.
- **Prompt injection:** retrieved user content is untrusted.

---

## 7. Business model canon (DECIDED)

| Item | Canon | Status |
|:--|:--|:--|
| Free tier | Browse, daily capsule, limited Ask EKA, Circles read | Canon |
| **EKA Plus** | **₹299/month, ₹2,990/year**; total payable shown up front | DECIDED (§14.1) |
| Commission | 500 bps services; 1000 bps goods, brand, digital | DECIDED (§14.3) |
| Creator pool | 25% of net subscription revenue, from 1,000 paying members; 7-signal QCS; never per-view | DECIDED (§14.4) |
| Ads | None. Ethical sponsorship only, always disclosed | Canon |
| Money handling | Integer paise; commission in basis points; creator balances are *payables*, not consumer wallets | Canon |
| Sequence | Validate repeat usage first. No complex monetization before that | Canon |

**Unit-economics integrity:** the pool is cost of revenue. The old 85%+ margin claim is withdrawn; publish only a recomputed figure.

**Regulatory flags (`REQUIRES LEGAL/CA REVIEW`):** payment-aggregator exposure from escrow plus payouts; TDS sections and rates (including renumbering under the new Income-tax Act); GST on platform fee; DPDP consent, minors, and fingerprinting/behavioral scoring; BNS references replacing IPC.

---

## 8. Growth and distribution
- **Wedge message:** "Document your community's tradition before it disappears." Ask for a specific contribution, never "join an app".
- **Loop:** keeper submits → share card (WhatsApp/Instagram) → seeker reads with attribution → "Add your community's version" → new indexable page.
- **Channels:** WhatsApp micro-groups, founding-contributor outreach, college documentation fellowship, short-form knowledge hooks. Paid ads: none.
- **Target:** 1,000 registered contributors in 30 days. `ASSUMPTION`: channel splits are hypotheses.
- **North-star behavior:** repeated meaningful discovery followed by save, discussion, contribution or return. Not time-on-site.
- **Success floor for first test cohort (`OPEN`):** define for 20–100 users: D7 return, contributions per active, source-open rate.

---

## 9. Creators, contributors and attribution
- Tiers by trust, not followers: Contributor → Verified Creator → Trusted Knowledge Creator → Community Expert → Institutional Archive.
- Attribution is **polyphonic**: creator, source, verifier, community steward and translator are credited separately. Cultural attribution, creator ownership and platform ownership are never merged.
- "EKA Founding Contributor" badge is permanent for launch cohort.
- Contributor agreements and content licence must exist before paid payouts (`LEG-007`, `CRE-002`).

---

## 10. Moderation, safety, privacy (brand-facing summary)
- Written policy, reason codes, audit trail, human appeal on high-impact actions. Bot accounts: no warning ladder.
- Sensitive attributes (religion, caste, community) are optional, "prefer not to say" always available, never sent to analytics or advertisers.
- Consent is unbundled and affirmative; analytics are off until consent; PII and private reflections never reach third-party trackers.
- Deletion works end to end, including storage and analytics pseudonymization.
- Child safety: age confirmation is a *control*, not proof of compliance. `REQUIRES LEGAL REVIEW`.

---

## 11. Strategic narrative (internal vs external)

| Layer | Internal thesis | External wording (safe) |
|:--|:--|:--|
| 1 Capture | Proprietary lived knowledge | Community-contributed, credited knowledge |
| 2 Verify | Epistemic engine | Visible sources and review |
| 3 Structure | Graph + ontology | Connected places, people, practices |
| 4 Experience | App, Circles, Daily | The EKA app |
| 5 Context API / CCP | Enterprise and open standard | Later; do not sell before graph depth exists |

**Moat claims:** keep Provenance, Lineage Endorsement, Graph Density, Reverent Brand. **Retire** "cannot be scraped" (public SSR pages can be). Replace with an explicit data licence, ToS and rate limits. Reconcile "open CCP" with "paid API" by defining what is open (schema) vs licensed (verified data).

---

## 12. Claims register (investor, press, enterprise)

| Claim | Status | Rule |
|:--|:--|:--|
| TAM figures ($1.5T / $50B / $25B / $35B) | `UNSOURCED` | Cite or remove |
| "98% verification trust score" | `UNVERIFIED` | Do not use without a definition and data |
| "1,000+ daily sadhana logs" | `UNVERIFIED` | Do not use until real |
| "$50K–$2M AI-lab contracts" | `PROJECTION` | Label as target |
| "Google partnership" | `ASPIRATION` | Programs applied for are not partnerships |
| "Zero hallucination" | `PROHIBITED` | Use "grounded, cited, audited" |
| "100% compliant / production ready" | `PROHIBITED` | Per AGENTS.md §18.O |
| Demo content | Must be labelled "Demonstration content" | Never invent citations |

---

## 13. Naming and consistency rules
1. One source per fact: price, commission, tier names, model IDs, env var names live in code constants and are *referenced*, not retyped, in docs.
2. Docs use "EKA Plus"; code uses `plus`. No ad-hoc plan names.
3. Currency is INR in integer paise; USD shown only for display with a stated rate date.
4. Launch gates are checked only when linked to evidence (test ID, PR or document).
5. Status vocabulary: `NOT_STARTED · DRAFT · UNDER_REVIEW · APPROVED · IMPLEMENTED · DEPRECATED`. "APPROVED" does not mean built.

---

## 14. Decisions (resolved 2026-10-05)

**Status key:** `DECIDED` = firm. `DECIDED · ASSUMPTION` = default chosen on the founder's instruction; confirm or change before the dependent work ships. `REVIEW` = needs a CA or lawyer before public copy or billing goes live. Nothing here is legal, tax or financial advice.

| # | Decision | Resolution | Status |
|:-:|:--|:--|:--|
| 1 | Plus price | **₹299/month, ₹2,990/year.** ₹499 retired | DECIDED · `REVIEW` (tax display) |
| 2 | Epistemic canon | **§5 adopted** (type × level + flags) | DECIDED |
| 3 | Commission | **5% services, 10% goods/brand/digital.** Stored in basis points | DECIDED |
| 4 | Subscription pool | **25% of net subscription revenue, gated at 1,000 paying members.** 85% retired | DECIDED · ASSUMPTION |
| 5 | First market | **India; English + Hindi; 3 clusters gated by reviewer supply** | DECIDED · ASSUMPTION |
| 6 | Reviewer ops | SLAs, recusal, 4-step escalation below | DECIDED · ASSUMPTION |
| 7 | Hosting & ops | Vercel + Supabase + Cloudflare + Upstash; founder-owned; **Supabase CLI is the only migration source** | DECIDED |
| 8 | Retention | Table in 14.8 | DECIDED · `REVIEW` |
| 9 | Raise | **Stage-gated pre-seed; no $5–15M ask until claims register is clean** | DECIDED · ASSUMPTION |
| 10 | Fonts | **Fraunces + Karla, self-hosted (both OFL); Noto Indic fallbacks** | DECIDED |

### 14.1 Price
- ₹299/month and ₹2,990/year (10 months paid, 2 free). One constant in code; the Razorpay plan (29900 paise) already matches.
- Checkout shows the total payable before the pay click. Whether ₹299 is tax-inclusive or +GST is a `REVIEW` item, but the total is always displayed up front.
- No USD price is shown until a global-market decision exists. BLU-30's $9/month and $99/year are retired as targets.
- **Revisit:** after 200 paid conversions, via a documented pricing experiment (`EXPERIMENT_TEMPLATE.md`).

### 14.2 Epistemic canon
§5 is binding. Mapping from every legacy label:

| Legacy label (source doc) | New |
|:--|:--|
| Documented Tradition, Canonical Text, Documented/source-backed | `documented_tradition` |
| Interpretation, Historical Commentary | `interpretation` |
| Living Practice, Community Living Practice, Community context | `living_practice` |
| Opinion, Personal Devotion, Speculative, Experience/story | `opinion_reflection` |
| AI-Assisted Synthesis | `ai_assisted_synthesis` |
| Modern Adaptation | `living_practice` or `opinion_reflection` + flag `modern_adaptation` |
| Commercial/promotional | flag `commercial` |
| Disputed or under review | flags `disputed` / `under_review` |

Also: BLU-41's "L1–L6" are **answer layers** (sections of an Ask a Community response), not verification levels. Rename them to avoid collision with L0–L5. BLU-08's level-4 badge `Canonical Tradition` becomes `Multi-Source`, because it collides with the type name.

### 14.3 Commission (basis points)

| Stream | bps |
|:--|:-:|
| Consultations, workshops, bookings, fan support | 500 |
| Physical goods, curated marketplace | 1000 |
| Brand collaborations | 1000 |
| Digital courses/paths, creator-run paid circles | 1000 |
| Ads | n/a (none exist) |

- BLU-35's 20–45% splits and the 55/45 "ethical ads" stream are retired.
- Anything above 1000 bps requires a `DECISION_LOG.md` entry.
- Rounding: platform fee rounds half-up in integer paise; creator receives the remainder, so fee + creator = gross exactly.
- Gateway fees, GST and TDS are separate lines, never folded into commission. Public copy says "as per applicable law", not hardcoded TDS sections.

### 14.4 Subscription pool
- **Why not 85%:** at 85% to creators, "85%+ gross margin" (BLU-38) is impossible. They cannot both be true.
- **Rule:** pool = 25% of *net* subscription revenue (gross − gateway fees − GST − refund reserve). It does not fund until there are 1,000 paying members, because below that the pool is too small to mean anything. Review the share quarterly.
- **Scoring:** the 7-signal QCS in BLU-35 is canonical. The 35/40/25 Attention/Knowledge/Trust split is retired. Surface reactions stay capped at 5%.
- **Margin claims:** BLU-38's 85%+ is withdrawn. Model the pool as cost of revenue and publish only the recomputed figure. `OPEN` model, not a number.
- **Cron fix:** `payout-calculator` must follow the monthly pool close and qualified signals, never raw views.

### 14.5 First market
- India. UI languages at launch: **English and Hindi.** Regional-script display (Devanagari, Tamil, Bengali, Gurmukhi) is supported for names, citations and transliteration, without full UI translation.
- **Cluster rule:** a tradition cluster goes live only when it has ≥1 community keeper and ≥1 scholar committed. Reviewer supply decides coverage, not ambition.
- **Starting clusters (ASSUMPTION, swap by reviewer availability):** South Indian temple and ritual traditions, Bengal (Shakta / Kali Puja), Northeast folk traditions.
- The six-tradition schema stays complete; only *published depth* is limited at launch.
- Diaspora is an audience inside India-first content, not a separate market yet.

### 14.6 Reviewer operations
Targets, not guarantees, until staffing exists. `ASSUMPTION`: founder + 2–3 volunteer reviewers for the test phase.

| Queue | First response | Decision |
|:--|:-:|:-:|
| Safety / hate / harassment | 6 h | 24 h |
| Copyright takedown | 36 h | per policy |
| Knowledge review | 72 h | 7 days |
| Disputed claim (stays visible, flagged `disputed`) | 72 h | 14 days |
| Appeals (different reviewer than original) | 72 h | 7 days |

- **Recusal:** no reviewing your own contribution, your own institution, or anything with a paid relationship. Declare conflicts on assignment.
- **Contested claims** need ≥2 reviewers from different lineages or schools.
- **Escalation:** reviewer → senior curator → tradition council (≥3 incl. a keeper and a scholar) → founder, for *policy only, never doctrine*.
- Level 2+ is only ever conferred by a human, and logged.

### 14.7 Hosting and operations
- **Stack:** Vercel (app), Supabase (DB, Auth, Storage), Cloudflare (DNS, WAF, R2), Upstash (rate limits and cache). Owner of every account: the founder entity. On-call: founder until a hire.
- **Single schema truth:** Supabase CLI migrations. Drizzle, if kept, is generated types only. Never two migration histories.
- **Queue:** Postgres-backed (`pgmq` / `pg_cron`) plus Vercel Cron with `CRON_SECRET`. No Railway worker, no new vendor, until measured load says otherwise.
- **Environments:** dev, staging, production, with separate keys.
- **Before public launch:** nightly logical backup offsite, one tested restore, rollback runbook, incident contacts (P0–P3 already defined).

### 14.8 Retention (`REVIEW` with counsel/CA before publishing)

| Data | Retention |
|:--|:--|
| Active account and profile | While the account is active |
| Deletion request | Soft-delete 14 days, hard-delete within 30 days; backups roll off within 35 days |
| Private reflections / journals | User-controlled; deleted on request; never used for analytics or model training |
| Published contributions | Attribution can be anonymised on deletion; sourced content and provenance remain under the licence the user granted |
| Financial records (ledger, invoices, tax) | 8 years (`ASSUMPTION`, CA to confirm) |
| Auth and security logs | 12 months |
| Product analytics | 14 months raw; pseudonymised after 90 days; consent-gated |
| Moderation records | 24 months |
| Audit log | Append-only; 3 years; actor identity pseudonymised after account deletion |

### 14.9 Raise (`ASSUMPTION`; founder-only call)
- **Now:** no priced round. Use credits (Google for Startups etc.) and personal runway through the first test cohort.
- **Then:** a small pre-seed (indicatively ₹2–4 crore) tied to milestones, not to the narrative.
- **Tranche milestones:** (M1) 20–100 test users with the success floor from §8 defined and met; (M2) 1,000 contributors and ≥2 live clusters with reviewers; (M3) first paid conversions and one verified revenue stream.
- **Gate on the ask:** the BLU-38 $5–15M memo stays internal until §12 shows no `UNVERIFIED` claim. Investor reporting: monthly, one page.

### 14.10 Fonts
Fraunces and Karla are open-licence (SIL OFL), so commercial use is fine. **Self-host** via a package such as Fontsource: faster, no third-party request (cleaner for DPDP and CSP). Fallback stacks: Noto Serif/Sans Devanagari, Tamil, Bengali, Gurmukhi (also OFL). `font-display: swap`.

### 14.11 Implementation spec (unblocks schema and legal pages)

Verify column and table names against the real migrations, which I have not seen.

```sql
create type epistemic_type as enum (
  'documented_tradition','interpretation','living_practice',
  'opinion_reflection','ai_assisted_synthesis');

alter table knowledge_objects
  add column epistemic_type epistemic_type not null,
  add column verification_level smallint not null default 0
    check (verification_level between 0 and 5),
  add column flags text[] not null default '{}'
    check (flags <@ array['disputed','under_review','commercial',
                          'modern_adaptation','sacred_restricted']),
  add constraint ai_synthesis_cap
    check (not (epistemic_type = 'ai_assisted_synthesis'
                and verification_level > 1));
-- Level >= 2 requires a human reviewer row: enforce in a trigger
-- and in the server function. The AI path can never write level >= 2.
```

```ts
// src/lib/constants/economics.ts: the only place these numbers live
export const PLUS_PRICE_PAISE = 29_900;
export const PLUS_ANNUAL_PAISE = 299_000;
export const COMMISSION_BPS = {
  services: 500, goods: 1000, brand_collab: 1000, digital: 1000,
} as const;
export const POOL_SHARE_BPS = 2500;
export const POOL_MIN_PAYING_MEMBERS = 1000;
export const feePaise = (grossPaise: number, bps: number) =>
  Math.floor((grossPaise * bps + 5000) / 10000); // half-up, integer only
```

**Legal pages and copy to update**
- Pricing, Terms, Refund: ₹299 / ₹2,990; total payable shown up front.
- Creator terms: 5% / 10% by stream, no hardcoded TDS sections.
- Standards: tier names per §5; add the reviewer SLA summary.
- Privacy: retention table (after `REVIEW`), fonts self-hosted, device-signal scoring disclosed or dropped.
- RISK_REGISTER: RSK-10 and Gate 3 `₹499` → `₹299`; uncheck every gate without linked evidence.

**Knock-on doc edits:** `06` (5th tier → flag), `08` (L4 badge), `30` (price, $ figures), `35` (splits, 35/40/25), `36` (85% → 25%), `38` (85% margin), `41` (L1–L6 → answer layers), `EKA-MASTER-ARCHITECTURE` §2/3 (tier names), `payments-architecture` and `AGENTS.md` (`Cents` → paise, wallet naming), `AGENTS.md §12` (point here).

---

## 15. Decision-log entry (added to `DECISION_LOG.md` as v1.4 and v1.5)

```
## v1.4 — Product & Brand Knowledge canon
- Version: v1.4
- Date: 2026-10-05
- File: docs/01-product/PRODUCT_AND_BRAND_KNOWLEDGE.md
- Change: Introduced single canon for brand, positioning, epistemic type × verification level model, pricing/commission defaults, voice, claims register.
- Reason: Resolve contradictions across blueprints 01–43 (tiers, price, commission, margin) before schema and legal copy harden.
- Owner: Founder
- Approval/status: DECIDED (see DECISION_LOG v1.4/v1.5)
```
