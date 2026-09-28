# EKA Blueprint 36: Membership & Commission Economics

**Document ID:** `BLU-037`  
**Status:** Approved & Implemented  
**Date:** 2026-09-27  
**Owner:** Founder / Product Architect & Principal Engineer

---

## 1. Executive Summary

EKA operates on a sustainable, low-friction creator and knowledge economic model that aligns member value, contributor remuneration, and platform stewardship. Rather than high barrier-to-entry pricing, EKA introduces an accessible **₹299/month (+ applicable taxes)** benchmark membership, coupled with a transparent **5–10% platform commission** on commercial services and marketplace transactions.

Crucially, **85% of monthly membership subscription pools** are allocated directly to the Tri-Partite Creator & Knowledge Pool (Attention, Knowledge, and Trust contributors), cementing EKA as an institution where high-fidelity cultural preservation and community stewardship are directly rewarded.

---

## 2. Membership Architecture & Pricing Strategy

### 2.1 The ₹299/Month Entry Psychology

- **Adoption Friction Reduction:** Lowering the barrier to entry from ₹499 to ₹299/month massively expands the top-of-funnel addressable audience across students, young practitioners, cultural researchers, and householders.
- **Network Effects & Pool Scaling:** A larger member base creates compounding knowledge pool funds ($10,000 \times ₹299 \times 0.85 = ₹25.41\text{ Lakhs/month}$), delivering predictable, meaningful livelihoods to verified lineage holders, scholars, and community stewards.
- **Transparent Annual Option:** ₹2,990/year (10 months paid, 2 months complimentary) encouraging commitment through the full 12-month thematic cycle.

### 2.2 What Members Get (9 Core Entitlements)

1. **Access to EKA's structured cultural, spiritual and local-knowledge library:** Canonical primary texts, oral histories, regional folk practices, and sacred calendar rhythms.
2. **AI-powered interactive exploration of EKA knowledge:** Natural-language exploration with grounded provenance through the "Ask EKA" intelligence interface.
3. **Personalized recommendations based on interests and learning behaviour:** Algorithmic curation respecting user privacy, avoiding addictive dopamine loops.
4. **Contextual Q&A with verified sources and traditions:** Deep contextual answers citing specific verses, historical eras, and lineage verifications.
5. **Cross-cultural connections exploration:** Real-time relationship graphs linking Tradition → Region → Community → Ritual → Place.
6. **Save and organize knowledge for future reference:** Permanent bookmarking and reflective journaling in the member's private Wisdom Passport.
7. **Participate in community discussions:** Access to authentic, moderated Sanghas and circle discussions without vanity metrics.
8. **Discover creators, experts, communities, places and authentic local experiences:** Verified local guides, practitioners, and cultural experiences.
9. **Early access to selected EKA features and knowledge experiences:** Priority booking for seasonal pilgrimages, ritual drops, and masterclasses.

---

## 3. Platform Commission Model (5–10%)

To maintain operations and platform integrity without extracting value from creators, EKA adheres to an ultra-transparent commission schedule:

| Commercial Activity                           | Platform Commission | Creator / Host Share | Deductions & Taxes               |
| :-------------------------------------------- | :------------------ | :------------------- | :------------------------------- |
| **Practitioner Services & 1:1 Consultations** | **5.0%**            | **95.0%**            | Gateway (2%) + TDS (10%)         |
| **Workshops, Masterclasses & Cohorts**        | **5.0%**            | **95.0%**            | Gateway (2%) + TDS (10%)         |
| **Sanctuary & Community Bookings**            | **5.0%**            | **95.0%**            | Gateway (2%) + TDS (10%)         |
| **Physical Ritual Kits & Sacred Crafts**      | **10.0%**           | **90.0%**            | Packaging/Logistics pass-through |
| **Curated Commercial Marketplace Items**      | **10.0%**           | **90.0%**            | Gateway (2%) + GST               |

### 3.1 Financial Calculation Engine

```ts
// src/lib/billing.ts
export const PLATFORM_COMMISSION = {
  servicesRatePercent: 5.0,
  marketplaceRatePercent: 10.0,
  calculatePayout: (amountCents: number, category: "services" | "marketplace" = "services") => {
    const rate = category === "marketplace" ? 0.1 : 0.05;
    const commissionCents = Math.round(amountCents * rate);
    const creatorCents = amountCents - commissionCents;
    return { rate, ratePercent: rate * 100, commissionCents, creatorCents };
  },
};
```

---

## 4. Statutory & Risk Protections

1. **GST Compliance (18%):** Applied strictly to the platform's retained fee (e.g. 18% on the 5–10% commission or 15% platform subscription share), not on the gross creator pass-through.
2. **Indian Income Tax TDS (Section 194J):**
   - Verified PAN: Mandatory 10% TDS deduction at source on professional knowledge payouts.
   - Unverified PAN: Mandatory 20% Section 206AA penal withholding until KYC is confirmed.
3. **5% Rolling Dispute Reserve:** 5% of monthly inflows are held for 60 days to cushion against chargebacks, refund requests, and scholarly attribution challenges.
4. **Bot & Velocity Filtration:** Payout eligibility requires Qualified Contribution Score (QCS) $\ge 25$ and clean audit status in the Admin Creator Risk Center.
