> Canonical EKA documentation. Source of truth for product, architecture, trust and delivery decisions.
> Version: 1.0 (Post-Audit Launch Gate Edition)
> Never store passwords, API keys, tokens, private user data or production secrets in this repository.

# EKA Comprehensive Risk Register & Launch Gate Controls

## 1. Governance & Risk Framework

The EKA platform integrates a sacred knowledge system, public community discussions, creator monetization, and AI-assisted retrieval. This creates unique multidimensional risks that span application security, epistemic integrity, constitutional speech protections, Indian DPDP Act compliance, and consumer trust.

Each risk in this register is monitored by assigned owners and evaluated against defined operational triggers.

---

## 2. Risk Matrix & Prioritization (15 Key Risks)

| ID         | Risk Title                                   | Category      | Severity     | Likelihood | Impact       | Owner                         | Status          |
| :--------- | :------------------------------------------- | :------------ | :----------- | :--------- | :----------- | :---------------------------- | :-------------- |
| **RSK-01** | Account Takeover (ATO)                       | Security      | **Critical** | Medium     | Extreme      | Lead Security Engineer        | Mitigated       |
| **RSK-02** | Admin Privilege Abuse                        | Security      | **Critical** | Low        | Catastrophic | Founder / Super Admin         | Active Controls |
| **RSK-03** | Religious Hate & Harassment                  | Moderation    | **Critical** | High       | Severe       | Head of Community & Safety    | Active Controls |
| **RSK-04** | Spiritual Misinformation & False Claims      | Knowledge     | **High**     | High       | Severe       | Chief Knowledge Curator       | Active Controls |
| **RSK-05** | Creator Payout Fraud                         | Payments      | **High**     | Medium     | Severe       | Finance & Trust Lead          | Active Controls |
| **RSK-06** | Sensitive User Profiling (Religion/Caste)    | Privacy       | **High**     | Medium     | Severe       | Data Protection Officer (DPO) | Mitigated       |
| **RSK-07** | AI Hallucinations in Sacred Epistemology     | AI / RAG      | **High**     | High       | High         | AI & Epistemic Engineer       | Active Controls |
| **RSK-08** | Copyright & Heritage Infringement            | IP & Legal    | **High**     | Medium     | High         | Legal & Grievance Counsel     | Active Controls |
| **RSK-09** | Cloud Vendor Outage & Lock-in                | Infra         | **Medium**   | Low        | High         | Lead Architect                | Monitored       |
| **RSK-10** | Deceptive UX & Dark Patterns                 | UX / Legal    | **Medium**   | Low        | Medium       | Lead Product Designer         | Mitigated       |
| **RSK-11** | Spam & Coordinated Bot Astroturfing          | Moderation    | **High**     | High       | Medium       | Trust & Safety Engineer       | Active Controls |
| **RSK-12** | Data Deletion Gaps & Zombie Records          | Privacy       | **High**     | Medium     | High         | DPO / Backend Lead            | Active Controls |
| **RSK-13** | Child Safety & DPDP Section 9 Non-compliance | Privacy       | **High**     | Medium     | Severe       | DPO & Legal Counsel           | Active Controls |
| **RSK-14** | Vendor & Processor Data Leakage              | Security      | **High**     | Low        | Severe       | SecOps / DevOps Lead          | Active Controls |
| **RSK-15** | Inaccessible Community Media (A11y Gaps)     | Accessibility | **Medium**   | Medium     | Medium       | Frontend Lead                 | Active Controls |

---

## 3. Detailed Risk Descriptions & Mitigation Plans

### RSK-01: Account Takeover (ATO)

- **Category:** Application Security
- **Severity:** Critical | **Likelihood:** Medium | **Impact:** Extreme
- **Description:** Malicious actors compromising member, creator, or admin credentials via credential stuffing, brute force, or phishing.
- **Early Signal:** Surge in failed login attempts, unusual geolocation hops, multiple password reset requests.
- **Mitigation:**
  - Supabase Auth rate limiting on `/auth` endpoints.
  - Mandatory PKCE flow for OAuth 2.0.
  - Multi-Factor Authentication (MFA) supported for all privileged accounts.
  - Session revocation and device fingerprint auditing.
- **Contingency:** Automated session killswitch; emergency password invalidation script; compromised account notification workflow.
- **Owner:** Lead Security Engineer | **Status:** Mitigated

### RSK-02: Admin Privilege Abuse & Rogue Access

- **Category:** Application Security
- **Severity:** Critical | **Likelihood:** Low | **Impact:** Catastrophic
- **Description:** Internal staff or compromised admin tokens executing unauthorized database alterations, viewing private user journals, or siphoning escrow funds.
- **Early Signal:** Direct database mutations outside migrations, unassigned elevated role grants, access to user journals.
- **Mitigation:**
  - Strict Role-Based Access Control (RBAC): Separation between Super Admin, Privacy DPO, Content Moderator, and Finance Admin.
  - Least privilege: Moderators cannot inspect private journal entries or raw billing tokens.
  - Immutable audit logging on all admin actions (`admin_audit_logs` table).
- **Contingency:** Instant credential rotation in Supabase/Cloudflare; forensic log export; board-level incident report.
- **Owner:** Founder / Super Admin | **Status:** Active Controls

### RSK-03: Religious Hate, Sectarian Hostility & Inter-faith Harassment

- **Category:** Community Moderation
- **Severity:** Critical | **Likelihood:** High | **Impact:** Severe
- **Description:** Malicious bad-faith actors inciting communal hostility, defaming traditions, or engaging in coordinated harassment across lineages.
- **Early Signal:** Sudden spikes in community reports, inflammatory comment cascades in Sangha discussions.
- **Mitigation:**
  - Standardized Community Standards ladder with clear definitions of prohibited conduct.
  - Fast-action reporting pipeline with human review SLA of < 6 hours.
  - Pre-moderation queues for newly created accounts posting to sensitive debate topics.
  - Zero-tolerance escalation protocol: temporary mute -> content quarantine -> platform ban.
- **Contingency:** Emergency thread lockdown; public incident note; legal referral under Section 295A/153A Indian Penal Code / BNS if incitement occurs.
- **Owner:** Head of Community & Safety | **Status:** Active Controls

### RSK-04: Spiritual Misinformation, Miracle Claims & Fake Reviews

- **Category:** Knowledge & Epistemic Trust
- **Severity:** High | **Likelihood:** High | **Impact:** Severe
- **Description:** Creators or practitioners claiming guaranteed health cures, magical wealth multiplication, or fabricating reviews to drive marketplace bookings.
- **Early Signal:** Language containing "guaranteed healing", "100% cure", "divine miracle promise", or duplicate review text patterns.
- **Mitigation:**
  - Strict 5-tier Epistemic Taxonomy: Documented Tradition vs Interpretation vs Opinion vs Living Practice vs AI-Assisted.
  - Verified reviews ONLY from members who completed a paid booking session; no unverified public ratings.
  - Prohibited Claims Policy in Creator Terms with automated regex screening for fraudulent medical/financial guarantees.
- **Contingency:** Immediate suspension of offending marketplace package; mandatory refund to all affected seekers.
- **Owner:** Chief Knowledge Curator | **Status:** Active Controls

### RSK-05: Creator Payout Fraud & Financial Arbitrage

- **Category:** Payments & Financial Integrity
- **Severity:** High | **Likelihood:** Medium | **Impact:** Severe
- **Description:** Fraudulent creators staging fictitious bookings, abusing chargeback windows, or attempting money laundering through tip mechanisms.
- **Early Signal:** High cancellation-to-booking ratio, rapid repeated wallet top-ups followed by immediate withdrawal requests.
- **Mitigation:**
  - Verified KYC / PAN / UPI VPA checks prior to unlocking creator payout capabilities.
  - Configurable payout review threshold (`payoutReviewThresholdCents = ₹10,000`).
  - Mandatory 7-day dispute escrow holding period before funds become available for withdrawal.
- **Contingency:** Automated withdrawal freeze on flagged accounts; gateway dispute response protocol.
- **Owner:** Finance & Trust Lead | **Status:** Active Controls

### RSK-06: Sensitive User Profiling (Religion/Caste/Sect)

- **Category:** Privacy & DPDP Compliance
- **Severity:** High | **Likelihood:** Medium | **Impact:** Severe
- **Description:** Platform collecting or inadvertently exposing sensitive cultural, religious, or caste data that could lead to discrimination or state surveillance exposure.
- **Early Signal:** Unnecessary demographic fields added to forms; third-party trackers detecting cultural tags.
- **Mitigation:**
  - Strict Data Minimization: Religion and community background are 100% OPTIONAL in onboarding and can be skipped with "Prefer not to say".
  - Religion/caste fields are never shared with advertisers, third-party analytics, or external search scrapers.
  - Separate database schemas isolating core authentication from voluntary cultural preferences.
- **Contingency:** Self-service one-click erasure of all voluntary demographic selections in user settings.
- **Owner:** Data Protection Officer (DPO) | **Status:** Mitigated

### RSK-07: AI Hallucinations in Sacred Epistemology

- **Category:** Artificial Intelligence / RAG
- **Severity:** High | **Likelihood:** High | **Impact:** High
- **Description:** Generative AI fabricating non-existent Sanskrit shlokas, attributing false quotes to revered figures, or conflating distinct sectarian philosophies.
- **Early Signal:** User reports questioning canonical citations; hallucinated scripture references.
- **Mitigation:**
  - Strict Retrieval-Augmented Generation (RAG) bounded exclusively to indexed canonical sources (`EKA Knowledge Graph`).
  - Mandatory Provenance Badge on every synthetic summary: must display primary source reference, verse ID, and translator.
  - AI responses explicitly labeled as "AI-Assisted Synthesis" requiring human corroboration before promotion.
- **Contingency:** Immediate removal of hallucinated node; automated provenance re-indexing.
- **Owner:** AI & Epistemic Engineer | **Status:** Active Controls

### RSK-08: Copyright Infringement & Sacred Heritage Misappropriation

- **Category:** Intellectual Property & Legal
- **Severity:** High | **Likelihood:** Medium | **Impact:** High
- **Description:** Creators uploading copyrighted translations, proprietary temple photographs, or commercializing ancient oral sacred heritage without community consent.
- **Early Signal:** DMCA or Copyright notices received at `copyright@eka.earth`.
- **Mitigation:**
  - Published Copyright & Sacred Heritage Policy (`/copyright`).
  - Statutory 36-hour Notice-and-Takedown SLA compliant with IT Rules 2021.
  - Fair Dealing guidelines for scholarly commentary and research under Section 52 of Indian Copyright Act 1957.
  - Repeat infringer 3-strike account termination policy.
- **Contingency:** Automated content quarantine upon receiving prima facie valid infringement documentation.
- **Owner:** Legal & Grievance Counsel | **Status:** Active Controls

### RSK-09: Cloud Infrastructure Vendor Outage & Lock-in

- **Category:** Infrastructure & DevOps
- **Severity:** Medium | **Likelihood:** Low | **Impact:** High
- **Description:** Outage in Supabase, Cloudflare, or Vercel disabling platform access or locking data in proprietary formats.
- **Early Signal:** Elevated API latency, third-party status page incident notices.
- **Mitigation:**
  - Nightly automated PostgreSQL logical dumps (`pg_dump`) to encrypted offsite object storage.
  - Standard PostgreSQL schemas managed via Drizzle ORM — portable to standard self-hosted Postgres on AWS/GCP.
  - Headless architecture with static fallback screens.
- **Contingency:** Disaster recovery runbook capable of restoring core database within 4 hours to secondary cloud host.
- **Owner:** Lead Architect | **Status:** Monitored

### RSK-10: Deceptive UX & Dark Patterns

- **Category:** UX & Consumer Protection
- **Severity:** Medium | **Likelihood:** Low | **Impact:** Medium
- **Description:** Subscription cancellation friction, hidden check-boxes, forced continuity, or artificial countdown timers violating consumer guidelines.
- **Early Signal:** Complaints in onboarding feedback, low cancellation completion ratios.
- **Mitigation:**
  - Zero dark pattern audit: One-click subscription cancellation in `/app/billing` without retention traps.
  - Transparent pricing: ₹499/month with no hidden activation or processing surcharges.
  - Unbundled consent in cookie banners and signup forms (no single forced agreement bundle).
- **Contingency:** UX design sign-off required for any change touching checkout or account deletion.
- **Owner:** Lead Product Designer | **Status:** Mitigated

### RSK-11: Spam, Astroturfing & Coordinated Bot Networks

- **Category:** Trust & Community Moderation
- **Severity:** High | **Likelihood:** High | **Impact:** Medium
- **Description:** Automated bots creating spam accounts, posting commercial advertisements, or manipulating reaction counts.
- **Early Signal:** High volume of accounts created with disposable emails; repetitive post content.
- **Mitigation:**
  - Rate limiting on post creation, commenting, and follow actions.
  - Supabase Captcha / Cloudflare Turnstile verification during registration.
  - Verified email requirement before public publishing rights are unlocked.
- **Contingency:** Automated quarantine of suspected bot IP ranges; bulk spam cleanup scripts.
- **Owner:** Trust & Safety Engineer | **Status:** Active Controls

### RSK-12: Data Deletion Gaps & Zombie Records

- **Category:** Privacy & DPDP Compliance
- **Severity:** High | **Likelihood:** Medium | **Impact:** High
- **Description:** User requests account deletion under DPDP Act Section 12, but orphaned records remain in analytics tables, backups, or storage buckets.
- **Early Signal:** User reports receiving notifications after account closure; orphaned foreign keys.
- **Mitigation:**
  - Cascade deletion triggers across `profiles`, `posts`, `comments`, and `sadhana_logs`.
  - Storage bucket cleanup job deleting avatar media upon user account erasure.
  - Anonymization of analytics records (purging `user_id` and replacing with null/pseudonym).
- **Contingency:** Automated quarterly database audit scanning for orphaned user records.
- **Owner:** DPO / Backend Lead | **Status:** Active Controls

### RSK-13: Child Safety & DPDP Section 9 Non-compliance

- **Category:** Privacy & Statutory Compliance
- **Severity:** High | **Likelihood:** Medium | **Impact:** Severe
- **Description:** Minors under 18 creating accounts and sharing personal data without parental consent, triggering penalties under DPDP Act Section 9.
- **Early Signal:** Self-reported age brackets indicating underage signups.
- **Mitigation:**
  - Explicit age confirmation checkbox during onboarding flow: user must affirm being 18+ or possessing verifiable parental consent.
  - Absolute prohibition of targeted behavioral advertising, behavioral tracking, or profiling directed at minors.
  - Child safety reporting category in community moderation tools.
- **Contingency:** Instant account freeze for confirmed underage accounts lacking parental verification.
- **Owner:** DPO & Legal Counsel | **Status:** Active Controls

### RSK-14: Vendor & Processor Data Exposure

- **Category:** Security & Vendor Governance
- **Severity:** High | **Likelihood:** Low | **Impact:** Severe
- **Description:** Third-party subprocessors (Supabase, Sentry, Stripe, Resend) experiencing breaches or misconfigured access exposing user identifiers.
- **Early Signal:** Subprocessor security advisories, anomalous outbound API payload sizes.
- **Mitigation:**
  - Annual Data Processing Agreement (DPA) reviews with all vendors.
  - Strict payload sanitization: no plaintext passwords or sensitive health/ritual notes passed to error monitors.
  - Principle of least vendor footprint: only essential service providers used.
- **Contingency:** Subprocessor breach protocol with 72-hour notification schedule to Indian CERT-In / Data Protection Board.
- **Owner:** SecOps / DevOps Lead | **Status:** Active Controls

### RSK-15: Inaccessible Community Content (WCAG AA Gaps)

- **Category:** Frontend & Accessibility
- **Severity:** Medium | **Likelihood:** Medium | **Impact:** Medium
- **Description:** Visually or motor-impaired practitioners excluded from using daily rituals, reading scriptures, or participating in Sanghas.
- **Early Signal:** Keyboard focus traps, missing image alt text, automated Lighthouse contrast warnings.
- **Mitigation:**
  - Keyboard-accessible tab navigation and visible focus rings on all interactive elements.
  - Skip to Content link in root layout.
  - Automated linting for `<img>` alt text and ARIA landmark compliance.
  - Support for `prefers-reduced-motion` disabling non-essential transitions.
- **Contingency:** Bi-monthly accessibility audits; prioritized a11y bug ticket queue.
- **Owner:** Frontend Lead | **Status:** Active Controls

---

## 4. Launch Gate Checklist

Before approving public onboarding and scaling traffic, each gate must be signed off by the assigned owner:

- [x] **Gate 1: Legal Suite Published** — Privacy Policy, Terms & Conditions, Refund Policy, Copyright Policy, and Cookie Preferences published and accessible via footer.
- [x] **Gate 2: DPDP Act Compliance** — Unbundled consent in onboarding, affirmative cookie consent gate, data minimization validated, DPO contact published.
- [x] **Gate 3: Commercial Protection** — Transparent ₹499/mo membership, zero exit traps, 48-hour cooling off, 10% platform fee transparency, session refund rules.
- [x] **Gate 4: Content Trust & Provenance** — 5-tier knowledge authenticity standard enforced, zero miracle/cure promises, fake review removal, verified session reviews only.
- [x] **Gate 5: Accessibility & UX** — Skip to main content link, WCAG AA contrast, keyboard-navigable forms, descriptive alt text, clear button labels.
- [x] **Gate 6: Technical Security** — Rate-limited auth, RBAC role boundaries, encrypted session tokens, sanitized analytics tracking.
