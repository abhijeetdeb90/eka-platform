<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

# EKA — Master Antigravity Operating Instructions

## Documentation blueprint

`docs/` is the canonical EKA blueprint (folders `01-product` through `10-templates`; see `docs/README.md`). Product, architecture, trust, economic and launch work must follow it. If a change contradicts a document, update that document in the same change and add an entry to `docs/08-governance/DECISION_LOG.md`. Mark assumptions as `ASSUMPTION` and unresolved decisions as `OPEN`. Never store secrets, keys or private user data in `docs/`.

---

## 0. PREFLIGHT SCOPE & APPROVAL GATE

This is a mandatory gate before implementation.

Do not begin substantive modifications until the preflight assessment is complete.

The purpose of this gate is to prevent scope creep, unnecessary architecture changes, accidental destruction of working functionality, unexpected costs, and premature credential requests.

### 0.1 PREFLIGHT MODE

On first execution, operate in:

**AUDIT + PLAN MODE**

Do NOT immediately implement the full requested architecture.

You may:

- inspect the repository
- inspect configuration
- inspect existing integrations
- inspect database structure
- inspect routes/components
- inspect authentication
- inspect environment variable names
- inspect package dependencies
- identify bugs
- identify security risks
- identify missing infrastructure
- identify duplicate functionality
- evaluate CRM options
- evaluate automation requirements
- prepare migrations/configuration plans

Do NOT:

- delete data
- change production configuration
- create paid services
- change billing
- create external accounts
- request unnecessary credentials
- perform destructive migrations
- replace working architecture
- perform broad refactoring

during preflight.

### 0.2 PREFLIGHT OBJECTIVE

Determine the minimum work required to make EKA testable.

Do not assume every item in the master prompt requires implementation.

For every requested component classify it as:

- `EXISTS — WORKING`
- `EXISTS — NEEDS FIX`
- `PARTIALLY IMPLEMENTED`
- `MISSING — REQUIRED`
- `MISSING — OPTIONAL`
- `NOT REQUIRED FOR CURRENT MVP`
- `BLOCKED — REQUIRES USER INPUT`

### 0.3 CURRENT-STATE INVENTORY

Before proposing changes, produce an inventory across:

- **Application:** Framework, Language, Package manager, Build system, Hosting, Repository structure, Current environment.
- **Frontend:** Routes, Main pages, Components, Forms, Authentication UI, Admin UI, Responsive implementation.
- **Backend:** API routes, Server functions, Database, Authentication, Authorization, External integrations.
- **Database:** Provider, Tables, Relationships, RLS, Migrations, Indexes, Existing production/test data.
- **Infrastructure:** Deployment, Domain, DNS, CI/CD, Environment variables, Monitoring, Analytics.
- **External Services:** CRM, email, analytics, automation, storage, authentication, payment, AI, social integrations.

Do not replace an existing service until its current role and limitations are understood.

### 0.4 SCOPE MATRIX

Create this table before implementation:

| Area | Current State | Required Change | Priority | Risk | Cost | Credential Needed | Action |
| :--- | :------------ | :-------------- | :------- | :--- | :--- | :---------------- | :----- |

Use actual findings rather than copying placeholder examples.

### 0.5 SCOPE BOUNDARY

Explicitly define:

**IN SCOPE**
Only work required for:

- EKA testing
- lead capture
- CRM
- user/account management
- product database
- essential analytics
- essential automation
- founder/admin operations
- security
- privacy readiness
- reliability
- testing

**OUT OF SCOPE**
Unless separately approved:

- major visual redesign
- complete product rewrite
- mobile app development
- enterprise architecture
- microservices
- advanced recommendation engines
- large-scale AI infrastructure
- complex payment infrastructure
- advanced social algorithms
- unnecessary third-party integrations
- custom CRM development
- non-essential animations
- speculative features

If you identify something valuable but outside scope, put it in:
**FUTURE / BACKLOG**
Do not implement it automatically.

### 0.6 CHANGE BUDGET

Before implementation, estimate:

- Files affected: `X`
- Database objects affected: `X`
- External services affected: `X`
- New dependencies: `X`
- Estimated implementation complexity: `LOW / MEDIUM / HIGH`
- Estimated recurring cost: `₹X/month`
- Potential breaking changes: `YES / NO`
- Data migration required: `YES / NO`

If the proposed scope becomes materially larger than the initial assessment, stop and update the scope before continuing.

### 0.7 RISK GATE

Identify:

- **Critical risks:** security, authentication, data loss, privacy, production availability
- **High risks:** database migration, external integration, authentication changes, domain/DNS, major dependency changes
- **Medium risks:** UI refactoring, analytics changes, automation changes
- **Low risks:** isolated UI improvements, documentation, non-functional refactoring

Any Critical or potentially destructive change requires explicit approval before execution.

### 0.8 APPROVAL CHECKPOINT

After completing preflight, STOP and provide a concise:

**PREFLIGHT REPORT**
Include:

1. What I found
2. What is already working
3. What is broken
4. What is missing
5. What I recommend changing
6. What I will NOT change
7. External services required
8. Credentials required later
9. Estimated cost
10. Risks
11. Implementation phases
12. Expected files/systems affected

Then provide:
**PROPOSED EXECUTION SCOPE**

- PHASE 1 — Security / Critical Fixes
- PHASE 2 — Database
- PHASE 3 — Authentication
- PHASE 4 — CRM
- PHASE 5 — n8n
- PHASE 6 — Analytics
- PHASE 7 — Admin
- PHASE 8 — Testing
- PHASE 9 — Handoff

Only include phases that are actually necessary based on the audit.

### 0.9 APPROVAL RULE

After presenting the preflight report:
**WAIT FOR APPROVAL before executing any material change.**

The approval should confirm the proposed scope.
If approved, proceed with implementation according to the approved plan.
If modified, update the scope, recalculate affected systems/risks/costs, and proceed only with the revised scope.

Do not treat a general instruction such as "Analyse and implement" as permission to perform destructive or materially expanded changes.

### 0.10 EXCEPTION — SAFE NON-DESTRUCTIVE FIXES

You may immediately fix an obvious, isolated, low-risk issue without waiting for additional approval when:

- it cannot delete or corrupt data
- it does not change authentication architecture
- it does not affect billing
- it does not introduce a paid service
- it does not expose data
- it does not materially alter the product architecture
- it has an obvious rollback path

Examples: broken import, obvious UI bug, missing form validation, accessibility label, console error, incorrect link, obvious responsive issue.
Document these changes in the final handoff.

### 0.11 CREDENTIAL GATE

Do NOT request credentials during preflight unless access is absolutely required to inspect something that cannot otherwise be inspected.

Before asking for access:

- Explain exactly what cannot be inspected.
- Explain why access is required.
- Identify the minimum permission required.
- Prefer OAuth or delegated access.
- Do not request passwords.

Normal sequence:

```
PREFLIGHT → AUDIT → SCOPE → APPROVAL → IMPLEMENT → TEST → IDENTIFY REQUIRED CREDENTIALS → CONNECT SERVICES → INTEGRATION TEST → HANDOFF
```

### 0.12 NO SCOPE CREEP

During implementation, if a new issue is discovered, classify it as:

- `BLOCKING`
- `IMPORTANT`
- `NON-BLOCKING`
- `FUTURE`

Only automatically implement:

- blocking issues required to complete the approved scope
- important issues that are directly coupled to the current change and low risk

Move unrelated improvements to the backlog. Do not continuously expand the project because additional improvements are discovered.

### 0.13 DECISION LOG

Maintain a concise decision log:

- DATE
- DECISION
- REASON
- ALTERNATIVES CONSIDERED
- IMPACT

Record only meaningful architectural/product decisions without creating unnecessary overhead.

### 0.14 APPROVAL DOES NOT OVERRIDE SAFETY

Even after approval, continue to follow:

- security constraints
- data-protection requirements
- credential rules
- database safety
- least privilege
- no-secret-storage rules
- no-destructive-change rules

Approval authorizes the scope, not unsafe implementation.

### 0.15 PREFLIGHT COMPLETION CONDITION

Preflight is complete only when:

- current architecture is understood
- major dependencies are identified
- current problems are documented
- required changes are identified
- unnecessary changes are excluded
- risks are classified
- costs are estimated
- credentials are identified but not prematurely requested
- implementation phases are defined
- scope is explicit
- approval is requested

Then STOP. Do not proceed to substantive implementation until the approved scope is established.

---

## 1. INSPECT BEFORE MODIFYING

Always inspect the codebase, dependencies, and configuration before editing. Read existing conventions, types, and schemas to preserve backwards compatibility.

---

## 2. REPOSITORY & CODE ARCHITECTURE INTEGRITY

Maintain strict TypeScript adherence (`tsc --noEmit`), clean ESLint rules, exact imports, and preserve existing routes and services.

---

## 3. FRONTEND & UI/UX STANDARDS

Adhere to the EKA calm, spiritual, editorial design system (ivory, sand, terracotta, charcoal). Use shadcn/ui primitives, Tailwind CSS, Motion/GSAP subtle interactions, and responsive layouts.

---

## 4. AUTHENTICATION & ACCESS CONTROL

Enforce strict server-side authentication and role-based permissions (`public.has_role()`). Never rely solely on client-side routing guards for sensitive or privileged endpoints.

---

## 5. DATABASE & RLS ENFORCEMENT

All database tables must have Row Level Security (RLS) enabled. Direct client writes into sensitive ledgers (such as `wallet_transactions` or `payout_requests`) are forbidden.

---

## 6. BACKEND & API CONTRACTS

All server functions and API routes must validate incoming payloads with Zod schemas and verify authorization before processing mutations.

---

## 7. CRM ARCHITECTURE & LEAD LIFECYCLE

Maintain structured lead models, pipeline stages, duplicate prevention, and attribution tracking.

---

## 8. n8n WORKFLOW INTEGRATIONS

Design robust, idempotent automation workflows with authenticated webhook triggers, validation, error handling, and dead-letter queue behavior.

---

## 9. EVENT TAXONOMY & ANALYTICS

Follow strict privacy-compliant telemetry gating (DPDP Act). Never transmit PII, credentials, or sensitive reflections into third-party analytics trackers.

---

## 10. SECURITY & SECRET PROTECTION

Zero committed secrets. Private API keys must be isolated to server-only environments. Never expose administrative keys to client bundles.

---

## 11. PRIVACY & DPDP COMPLIANCE CONTROLS

Comply with India's DPDP Act, 2023: enforce affirmative cookie consent, transparent data fiduciary disclosures, right to withdraw consent, and account/data deletion routes.

---

## 12. MULTI-FAITH & KNOWLEDGE SYSTEM INTEGRITY

Preserve the polyphonic 6-tradition architecture (Hindu, Buddhist, Sikh, Christian, Islamic, Jain) and the Five-Tier Epistemic Taxonomy without doctrinal bias.

---

## 13. FOUNDER & ADMIN OPERATIONAL CONTROLS

Provide essential founder visibility across member growth, creator verification, financial ledgers, and operational alerts.

---

## 14. PERFORMANCE & ASSET OPTIMIZATION

Ensure fast initial server rendering, optimized assets, smooth scrolling (Lenis), and zero main-thread blocking operations.

---

## 15. ERROR HANDLING & RESILIENCE

Implement graceful loading states, tactile empty states, informative user toasts, and robust CatchBoundaries around dynamic routes.

---

## 16. ACCESSIBILITY (WCAG 2.1 AA)

Provide skip navigation links, semantic HTML, visible keyboard focus indicators, explicit form `autoComplete` attributes, and minimum 4.5:1 color contrast.

---

## 17. TESTING & QUALITY ASSURANCE

Maintain and execute continuous compiler checks (`tsc --noEmit`), linters (`eslint`), and end-to-end browser tests (`playwright test`).

---

## 18. COMPLETION & HANDOFF CRITERIA

The task is NOT complete when the code has been changed.

The task is complete only when the implementation has been audited, implemented, tested, documented and handed off according to the criteria below.

### A. DEFINITION OF DONE

EKA may be marked COMPLETE FOR TESTING only when all applicable items below are satisfied:

1. **Architecture:** Existing architecture has been inspected. Final architecture is documented. Source of truth for each data category is defined. No unnecessary duplicate systems have been introduced. External dependencies are documented. Free/paid status of each external dependency is documented.
2. **Application:** Existing core functionality still works. New functionality has been implemented. No known Critical or High severity application bugs remain. Broken flows discovered during the audit have either been fixed or explicitly documented. Responsive behaviour has been tested. Empty, loading and error states have been handled.
3. **Authentication & Authorization:** Signup tested. Login tested. Logout tested. Password reset tested if implemented. Protected routes tested. Unauthorized access tested. Admin access tested. Role boundaries tested. No privileged functionality relies only on frontend UI restrictions.
4. **Database:** Schema reviewed. Relationships reviewed. Required indexes reviewed. RLS reviewed and tested. User/profile separation verified. Unnecessary data collection removed or flagged. Database migrations documented. No destructive migration has been performed without approval. Existing data has not been unintentionally altered or deleted.
5. **Security:** No secrets committed to source control. No private API keys exposed in frontend code. Environment variables correctly separated. Authentication boundaries tested. Authorization boundaries tested. RLS tested. API endpoints reviewed. Webhooks secured where applicable. File uploads reviewed where applicable. Sensitive information is not unnecessarily logged. Error messages do not expose secrets or internal implementation details. Any unresolved security issue must be clearly listed in the handoff.
6. **CRM:** The selected CRM must have lead structure defined, required fields defined, lead types defined, pipeline defined, duplicate handling defined, source tracking defined, and follow-up process defined. If credentials are unavailable: CRM integration should be prepared but clearly marked `WAITING FOR CREDENTIALS`. Do not falsely mark it as complete.
7. **n8n:** Every implemented workflow must have trigger defined, input defined, processing logic defined, destination defined, duplicate handling, error handling, retry behaviour where appropriate, and test result documented. Each workflow must be tested with at least: valid input, invalid input, duplicate input, and integration failure where practical.
8. **Analytics:** Verify that required events fire, event names are consistent, unnecessary personal data is not collected, basic funnel tracking works, and analytics failures do not break the application. Document the final event taxonomy.
9. **Admin / Founder Operations:** The minimum founder/admin operating capability must be available or clearly documented (users, creators, communities, content, reports, verification, leads, businesses, investors, analytics, system health). Do not build unnecessary admin functionality.
10. **Privacy & Compliance Readiness:** Verify implementation of applicable Privacy Policy, Terms & Conditions, Cookie consent, Form consent, Data minimization, Account deletion, Data deletion, Third-party tracking disclosure, Third-party embeds, Accessibility, Copyright considerations, and DPDP-related controls. Separate `IMPLEMENTED` from `REQUIRES LEGAL REVIEW`. Never claim legal compliance merely because a policy page exists.

### B. SEVERITY STANDARD

Use this classification consistently:

- **P0 — Critical:** (authentication bypass, exposed secrets, unauthorized database access, data loss, major security vulnerability, production-breaking failure). `P0 = MUST FIX BEFORE TESTING`.
- **P1 — High:** (major feature broken, serious authorization problem, CRM silently losing leads, broken signup, broken core onboarding, major mobile failure). `P1 = MUST FIX BEFORE HANDOFF unless explicitly accepted by founder`.
- **P2 — Medium:** (non-critical UX issue, inconsistent validation, minor automation issue, analytics discrepancy, moderate performance problem). `P2 = May be deferred if documented`.
- **P3 — Low:** (cosmetic issue, minor copy issue, enhancement, non-essential optimisation). `P3 = Backlog`.

### C. RELEASE GATE

Before declaring EKA ready for testing:

- `P0 = 0`
- `P1 = 0`
- `P2 = documented`
- `P3 = documented`

Any exception must be explicitly identified. Do not hide unresolved issues inside general notes.

### D. TEST EVIDENCE

Do not simply state "Testing completed." Provide evidence in a concise matrix:

- Areas: Auth, Database, CRM, n8n, Mobile, UI, Compliance.
- Status values: `PASS`, `FAIL`, `BLOCKED`, `NOT APPLICABLE`. Do not use vague terms such as "looks good."

### E. INTEGRATION HANDOFF

For every external integration provide:

- SERVICE:
- PURPOSE:
- STATUS:
- ACCOUNT:
- AUTH METHOD:
- PERMISSIONS:
- ENVIRONMENT VARIABLES:
- WEBHOOKS:
- TEST STATUS:
- REMAINING ACTION:

Never include actual secrets in the handoff.

### F. ENVIRONMENT HANDOFF

Provide required environment variables table:

- VARIABLE
- PURPOSE
- PUBLIC/SERVER-ONLY
- REQUIRED?
- STATUS

Do not output secret values.

### G. FILE / CODE HANDOFF

Provide a concise list of:

- **Created:** files, migrations, components, services, workflows, configuration.
- **Modified:** files, database objects, routes, integrations.
- **Deleted:** Only if applicable. For every deletion explain why.

### H. DATABASE HANDOFF

Provide:

- final schema summary
- tables created / modified
- migrations created
- RLS policies
- indexes added
- relationships changed
- seed/test data created
- test data that should be removed before production

Do not expose production credentials.

### I. AUTOMATION HANDOFF

Provide a table:

- Workflow | Trigger | Destination | Duplicate Protection | Error Handling | Test

### J. COST HANDOFF

Provide cost tracking:

- Service | Current Plan | Monthly Cost | Required Now? | Alternative

Clearly identify anything that could create future costs. Do not assume free-tier limits will remain sufficient indefinitely.

### K. FINAL CREDENTIAL CHECKLIST

Credentials must be requested only after all credential-independent work is complete. Provide one consolidated checklist:

- SERVICE
- ACCOUNT REQUIRED
- WHY
- AUTH METHOD
- PERMISSIONS
- FREE/PAID
- CAN USER CONNECT IT THEMSELVES?
- CAN IMPLEMENTATION CONTINUE WITHOUT IT?

Prefer "Connect your account through OAuth" over "Send me your password." Never request unnecessary credentials.

### L. FOUNDER HANDOFF CHECKLIST

At the end, provide the exact actions required from the founder (e.g., Connect Supabase, Connect CRM, Configure domain, Review Legal Policies, Approve launch). Only include actions that are genuinely required.

### M. KNOWN LIMITATIONS

Explicitly document unresolved bugs, blocked integrations, unavailable credentials, free-tier limitations, external dependencies, legal review requirements, scalability limitations, technical debt, and features intentionally deferred. Do not conceal limitations.

### N. NEXT ITERATION

Separate future work from current completion:

- **V1 — Required for Testing:** Only critical items.
- **V1.1 — After Initial User Feedback:** Useful improvements.
- **V2 — Scale:** Only items justified by actual usage.

Do not mix future ideas with the current launch requirements.

### O. FINAL STATUS

The final handoff must end with exactly one of these statuses:

- `READY FOR TESTING`: All required testing infrastructure is operational and no P0/P1 issues remain.
- `READY WITH BLOCKERS`: Core system is testable, but specific external integrations or founder actions remain.
- `NOT READY`: A P0/P1 issue prevents meaningful testing.

Never use "100% complete", "production ready", "fully secure", or "fully compliant" unless those claims can genuinely be substantiated.

### P. HANDOFF PRINCIPLE

The objective of the handoff is that another competent developer—or the founder—can understand:
**What exists → What changed → What works → What doesn't → What is blocked → What credentials are needed → What the founder must do next.**

No ambiguity. No hidden dependencies. No undocumented assumptions.

---

## 19. DO NOT DO THESE THINGS

- DO NOT rewrite published git history (`git push --force`, rebase/amend pushed commits).
- DO NOT commit secrets, private tokens, or passwords to repository files.
- DO NOT execute destructive database migrations (`DROP TABLE`, unconstrained `DELETE`) without explicit user consent.
- DO NOT deploy or sign up for paid third-party infrastructure without explicit founder authorization.
- DO NOT use frontend-only authorization checks for sensitive or financial operations.
- DO NOT claim legal compliance merely because a policy page exists.
- DO NOT hardcode mock test returns to fake passing test suites.
- DO NOT make sweeping architectural changes without passing the Section 0 Preflight Scope & Approval Gate.
