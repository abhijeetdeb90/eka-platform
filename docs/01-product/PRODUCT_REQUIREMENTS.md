> Canonical EKA documentation. Source of truth for product, architecture, trust and delivery decisions.
> Versioning: v0.1, v0.2, v1.0. Mark assumptions as `ASSUMPTION` and unresolved decisions as `OPEN`.
> Never store passwords, API keys, tokens, private user data or production secrets in this repository.

# User Journeys and Flows

## Discovery journey

Open EKA → Select interests → Browse feed → Open content card → Read context → View source/trust details → Explore related entity/content → Save/share/discuss.

## Learning journey

Discover topic → Read summary → Review source → Read cultural/geographic context → Compare related interpretations → Save → Follow topic/creator.

## Creator journey

Sign up → Complete profile → Select creator type → Create draft → Add source and context → Submit for review → Receive feedback → Publish → Monitor engagement and corrections.

## Community contribution journey

Open content → Add context/correction → Provide supporting source → Submit → Review by authorized moderator → Versioned update → Contributor attribution.

## Moderation journey

Flag submitted → Triage → Review evidence and policy → Take action → Notify relevant parties → Record audit event → Provide appeal route where appropriate.

## Admin journey

Sign in with privileged account → Review dashboards → Manage users/roles → Review content → Manage taxonomies → Inspect audit logs → Configure integrations without exposing secrets.

---

# Information Architecture

## Main areas

- Home
- Explore
- Search
- Topics
- Places
- Communities
- Creators
- Events
- Saved
- Notifications
- Creator Studio
- Admin Console

## Content hierarchy

Feed card → Content detail → Source/context panel → Entity page → Related content → Community discussion → Contribution history.

## Entity types

- Person
- Creator
- Community
- Tradition
- Practice
- Place
- Festival
- Event
- Food
- Business
- Brand
- Artifact
- Story
- Article
- Video
- Image
- Source
- Organization

## Navigation rule

A user should be able to move from any content item to its context, source, related entities, creator, and discussion without losing their place.

---

# Design System and Motion

## Design direction

Use a Deepstash-inspired information density and card-based learning experience, but create an original EKA visual language. Do not copy proprietary assets, exact layouts, or distinctive branded interactions.

## Components

- Content card
- Source badge
- Trust indicator
- Entity chip
- Topic chip
- Save action
- Discussion panel
- Context drawer
- Bottom sheet
- Report flow
- Review status
- Creator profile
- Related content rail

## UX principles

- Progressive disclosure
- Strong typography hierarchy
- Readable long-form content
- Mobile-first responsiveness
- Accessible contrast and keyboard navigation
- Clear distinction between facts, interpretation, and user opinion

## Motion principles

- Use motion to explain transitions and hierarchy.
- Keep interactions purposeful and fast.
- Suggested range: approximately 150–500ms depending on interaction.
- Respect reduced-motion preferences.
- Never use animation to obscure warnings, consent, or moderation actions.

---

# Content Model and Taxonomy

## Required metadata for publishable knowledge

- Title
- Summary
- Content type
- Category
- Tradition/community context where relevant
- Geographic context where relevant
- Source references
- Creator explanation
- Documented vs interpretive classification
- Related entities
- Language
- Media rights status
- Review status
- Version history

## Classification

1. Documented/source-backed
2. Community context
3. Interpretation
4. Opinion
5. Experience/story
6. Commercial/promotional
7. Disputed or under review

## Taxonomy governance

- Taxonomies must be versioned.
- Avoid forcing a single religious, cultural, or regional label where multiple labels are relevant.
- Support aliases, translations, and related terms.
- Record who changed a taxonomy and why.
