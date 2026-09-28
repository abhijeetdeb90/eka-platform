> Canonical EKA documentation. Source of truth for product, architecture, trust and delivery decisions.
> Versioning: v0.1, v0.2, v1.0. Mark assumptions as `ASSUMPTION` and unresolved decisions as `OPEN`.
> Never store passwords, API keys, tokens, private user data or production secrets in this repository.

# Decision Log

Use this format for every significant decision.

## Decision template

- Date:
- Decision:
- Context:
- Options considered:
- Selected approach:
- Why:
- Risks:
- Revisit trigger:
- Owner:
- Status:

## Initial open decisions

- Final brand name and trademark strategy
- Exact MVP audience
- First launch geography/languages
- Initial content verticals
- Verification staffing model
- Monetization timing
- Payment provider
- Search approach
- Hosting and operational ownership
- Data retention periods

---

# Documentation Changelog

## v0.1 — Initial foundation

- Created product, user, architecture, trust, security, integration, and delivery documentation structure.
- Established EKA as a trusted knowledge system with a social layer.
- Defined source, context, verification, governance, and migration as first-class concerns.

## v1.0 — Master Documentation Index

- Version: v1.0
- Date: 2026-09-26
- File: `docs/DOCUMENT_INDEX.md`
- Change: Ingested canonical Master Documentation Index registry (GOV-001 through QA-008), 6 launch gates, dependency rules, and immediate document sequence.
- Reason: Establish single authoritative taxonomy, document lifecycle status, and governance prerequisites before feature implementation.
- Owner: Founder / EKA Core Team
- Approval/status: APPROVED

## v1.1 — Agentic Cultural-Intelligence Operating System (ACO-OS)

- Version: v1.1
- Date: 2026-09-28
- File: `docs/blueprint/40_EKA_AGENTIC_OPERATING_SYSTEM_AND_CAPABILITY_MATRIX.md`
- Change: Ratified the complete EKA Agentic Operating System architecture and 5-Tier Capability Execution Matrix across 12 Agent Departments, resolving the distinction between Autonomous LLM Agents, Deterministic Microservices, Orchestrated Workflows, Human-in-the-Loop gates, and Never-Automated Sacred Boundaries.
- Reason: Prevent runaway LLM cost and non-deterministic hallucination in sacred/cultural domains while formalizing the control plane for phased rollout (MVP 12 agents through Marketplace).
- Owner: Founder / Principal AI Architect
## v1.2 — EKA × Google Ecosystem & AI Stack Integration

- Version: v1.2
- Date: 2026-09-28
- File: `docs/blueprint/42_EKA_X_GOOGLE_ECOSYSTEM_AND_AI_STACK_INTEGRATION.md`, `docs/05-technology/INTEGRATIONS_REGISTER.md`
- Change: Ratified the EKA × Google ecosystem integration architecture, mapping Google's 15+ AI production tools (Gemini, Antigravity, Stitch, Flow, Maps, NotebookLM) into EKA's stack; formulated the two-track Google investment/partnership strategy (Google for Startups India Accelerator vs GV Equity vs Strategic Infrastructure Partner); established the platform comparison retaining Supabase + n8n while adopting Antigravity, Gemini, Google Maps, and GA4; added foundational native clients for Gemini, Google Maps Platform, and GA4 DPDP telemetry.
- Reason: Accelerate EKA's development velocity and positioning as the civilizational cultural intelligence layer without introducing vendor lock-in or premature migration risks.
- Owner: Founder / Chief Strategy Officer & Principal AI Architect
- Approval/status: APPROVED

## v1.3 — Sacred Geography Maps UI & Live Ask EKA Gemini Reasoning (Phases 2 & 3)

- Version: v1.3
- Date: 2026-09-28
- File: `src/components/app/SacredGeographyMap.tsx`, `src/lib/ai-knowledge.ts`, `src/components/app/AskEkaDrawer.tsx`, `src/routes/_authenticated/app.explore.tsx`, `src/routes/_authenticated/app.junction.index.tsx`
- Change: Deployed Phase 2 (Interactive Sacred Geography Map UI with Google Maps JavaScript API, custom warm editorial styling, tradition filter badges, pilgrimage distance calculations, and offline/keyless graceful fallback) across `/app/explore` and `/app/junction`; deployed Phase 3 (Connected native Google Gemini client directly into `askEkaKnowledge` in `src/lib/ai-knowledge.ts` to power live, contextually-grounded epistemic reasoning with verified canonical citations, attribution badges, and zero-miracle guardrails).
- Reason: User-approved execution of Phase 2 and Phase 3 to bridge physical sacred geographies with dynamic AI cultural reasoning.
- Owner: Founder / Principal AI Architect & Lead Frontend Engineer
- Approval/status: APPROVED & IMPLEMENTED

## Change format

- Version:
- Date:
- File:
- Change:
- Reason:
- Owner:
- Approval/status:


