# EKA — Verification & Multi-Layer Trust System (v1.0)

**Document ID:** KNOW-010 / 08_VERIFICATION_SYSTEM.md  
**Status:** APPROVED  
**Classification:** Core Trust & Safety Architecture  
**Prerequisite For:** Knowledge Badging, Moderation Queues, AI Reliability

---

## 1. The Core Verification Rule: Explainable Provenance

EKA rejects binary, opaque "blue checkmark" badges. A spiritual or cultural claim cannot be declared universally "true" or "false" by an algorithm or a platform moderator.

Instead, EKA measures and displays **Explainable Provenance**:

> _"Source-backed: 3 canonical references · 2 community confirmations · 1 accredited scholar review · 0 active disputes."_

---

## 2. The 6-Level Verification Ladder

| Level | Trust Tier                            | Criteria & Evidence                                                                                     | UI Badge / API Signal                |
| :---: | :------------------------------------ | :------------------------------------------------------------------------------------------------------ | :----------------------------------- |
| **0** | **Unverified Contribution**           | Freshly submitted reflection or claim. No citations attached.                                           | `Unverified Claim` (Awaiting review) |
| **1** | **Source-Referenced**                 | Contributor has attached at least one verifiable historical, textual, or published source.              | `Source Referenced (1)`              |
| **2** | **Community Corroborated**            | Verified members of the source community/tradition confirm the description matches living practice.     | `Community Corroborated`             |
| **3** | **Peer / Expert Endorsement**         | Accredited scholar, lineage pandit, or recognized practitioner has reviewed and signed off on accuracy. | `Expert Reviewed`                    |
| **4** | **Multi-Source Corroboration**        | Supported by $\ge 3$ independent canonical or academic sources across diverse historical chronicles.    | `Canonical Tradition`                |
| **5** | **Institutional / Archive Benchmark** | Certified by academic bodies, national archives, or recognized custodian institutions.                  | `Archival Benchmark`                 |

---

## 3. Reviewer Roles & Governance Separation

1. **Community Keepers:** Native practitioners and community elders who validate whether an oral custom or ritual matches lived reality.
2. **Academic & Tradition Scholars:** Subject-matter authorities who review historical timeline accuracy, philological translations, and canonical textual citations.
3. **Trust & Moderation Officers:** Independent reviewers who enforce safety rules (removing hate speech, defamation, fraudulent claims, and copyright violations) without arbitrating theological doctrine.

### The Sacred Red Lines

- **Guaranteed Supernatural/Medical Outcomes:** Automatically rejected from Level 1–5.
- **Denigration of Other Lineages:** Strips all verification and triggers an immediate moderation strike.
- **Separation of Consensus from Truth:** High upvote counts in community feeds do NOT promote an unverified claim to Level 3 or higher without primary sources.
