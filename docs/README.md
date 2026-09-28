# EKA Documentation

Canonical documentation for EKA — a trusted knowledge and community platform for
spiritual, religious, cultural, local-life, tourism and creator knowledge.

Every material product, architecture, trust, economic or legal decision is recorded here.
Code changes must follow these documents; when a change contradicts a document,
update the document in the same change and record it in `08-governance/DECISION_LOG.md`.

## Rules

- Versioning: `v0.1`, `v0.2`, `v1.0`.
- Mark assumptions as `ASSUMPTION`, unresolved decisions as `OPEN`.
- Never store passwords, API keys, tokens, private user data or production secrets here.
- Never invent citations. Demonstration content is labelled as such.

## Master Index

See [DOCUMENT_INDEX.md](./DOCUMENT_INDEX.md) for the canonical registry, governance rules, and dependency matrix across all 21 documentation areas.

## Structure

### 01-product

- [PRODUCT_VISION.md](./01-product/PRODUCT_VISION.md) — positioning, principles, users, jobs to be done
- [PRODUCT_REQUIREMENTS.md](./01-product/PRODUCT_REQUIREMENTS.md) — journeys, information architecture, design system, content model
- [MVP_SCOPE.md](./01-product/MVP_SCOPE.md) — must/should/later, build backlog, exit criteria
- [ROADMAP.md](./01-product/ROADMAP.md) — phase-level plan (live task list: root `roadmap.md`)

### 02-trust

- [TRUST_AND_VERIFICATION_FRAMEWORK.md](./02-trust/TRUST_AND_VERIFICATION_FRAMEWORK.md)
- [MODERATION_AND_APPEALS.md](./02-trust/MODERATION_AND_APPEALS.md)
- [AI_GOVERNANCE.md](./02-trust/AI_GOVERNANCE.md)

### 03-business

- [BUSINESS_MODEL.md](./03-business/BUSINESS_MODEL.md)
- [PRICING_AND_MONETIZATION_EXPERIMENTS.md](./03-business/PRICING_AND_MONETIZATION_EXPERIMENTS.md)
- [UNIT_ECONOMICS.md](./03-business/UNIT_ECONOMICS.md)

### 04-market

- [GTM_PLAN.md](./04-market/GTM_PLAN.md)
- [GEOGRAPHY_AND_COMMUNITY_SELECTION.md](./04-market/GEOGRAPHY_AND_COMMUNITY_SELECTION.md)

### 05-technology

- [TECHNICAL_ARCHITECTURE.md](./05-technology/TECHNICAL_ARCHITECTURE.md)
- [DATA_MODEL.md](./05-technology/DATA_MODEL.md) — domain model, schema blueprint, API contracts
- [SECURITY_AND_PRIVACY.md](./05-technology/SECURITY_AND_PRIVACY.md) — controls, roles, permissions
- [OBSERVABILITY_AND_OPERATIONS.md](./05-technology/OBSERVABILITY_AND_OPERATIONS.md) — incidents, testing, release
- [LOVABLE_TO_PRODUCTION_MIGRATION.md](./05-technology/LOVABLE_TO_PRODUCTION_MIGRATION.md)
- [INTEGRATIONS_REGISTER.md](./05-technology/INTEGRATIONS_REGISTER.md)
- [ANTIGRAVITY_OPERATING_INSTRUCTIONS.md](./05-technology/ANTIGRAVITY_OPERATING_INSTRUCTIONS.md) — Preflight Scope Gate & Completion/Handoff Criteria (Sections 0-19)

### 06-operations

- [POLICIES_INDEX.md](./06-operations/POLICIES_INDEX.md)
- [REVIEWER_OPERATIONS.md](./06-operations/REVIEWER_OPERATIONS.md)
- [TEAM_AND_ROLES.md](./06-operations/TEAM_AND_ROLES.md)

### 07-investment

- [INVESTMENT_PLAN.md](./07-investment/INVESTMENT_PLAN.md)
- [FINANCIAL_MODEL_ASSUMPTIONS.md](./07-investment/FINANCIAL_MODEL_ASSUMPTIONS.md)

### 08-governance

- [DECISION_LOG.md](./08-governance/DECISION_LOG.md)
- [RISK_REGISTER.md](./08-governance/RISK_REGISTER.md)
- [IP_AND_OWNERSHIP.md](./08-governance/IP_AND_OWNERSHIP.md)

### 09-launch

- [LAUNCH_CHECKLIST.md](./09-launch/LAUNCH_CHECKLIST.md)
- [ANALYTICS_EVENTS.md](./09-launch/ANALYTICS_EVENTS.md)

### blueprints

- [34_MULTI_AGENT_TEAMWORK_ARCHITECTURE.md](./blueprint/34_MULTI_AGENT_TEAMWORK_ARCHITECTURE.md) — Multi-Agent Teamwork Architecture & Autonomous SDLC Engine
- [35_CREATOR_ECONOMY_AND_PAYOUT_ENGINE.md](./blueprint/35_CREATOR_ECONOMY_AND_PAYOUT_ENGINE.md) — Tri-Partite Attention + Knowledge + Trust Payout Engine
- [36_MEMBERSHIP_AND_COMMISSION_ECONOMICS.md](./blueprint/36_MEMBERSHIP_AND_COMMISSION_ECONOMICS.md) — ₹299/mo Accessible Entry & 5–10% Platform Commission Schedule
- [37_AI_INTERACTIVE_INTELLIGENCE_LAYER.md](./blueprint/37_AI_INTERACTIVE_INTELLIGENCE_LAYER.md) — "Ask EKA" Interactive AI Knowledge Layer: Source → Context → Explanation → Cross-Cultural Graph

## Implementation order

1. Product scope and MVP
2. Data model and permissions
3. Trust and verification framework
4. Authentication and security
5. Creator and community workflows
6. AI-assisted operations
7. Monetization experiments
8. Analytics and scale readiness
