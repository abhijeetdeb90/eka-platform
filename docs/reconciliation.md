# EKA Platform — Financial Reconciliation Engine

## 1. Overview

Payment reconciliation ensures that every rupee collected, fee charged, and payout disbursed at Razorpay matches the internal entries in EKA's immutable double-entry ledger.

Reconciliation is conducted on two cadences:
1. **Real-Time Webhook Confirmation**: Instant ledger sync upon each `payment.captured` or `payout.processed` event.
2. **Periodic Batch Reconciliation**: Comprehensive end-of-day / weekly scan comparing gateway settlement batches against ledger rows.

---

## 2. Reconciliation Logic & Invariants

```
                ┌───────────────────────────────────────┐
                │          GATEWAY REPORT (A)           │
                │  - Captured Payments                  │
                │  - Platform Fees & Taxes              │
                │  - Payouts & Route Transfers          │
                └───────────────────┬───────────────────┘
                                    │
                                    ▼
                          ┌──────────────────┐
                          │  RECONCILIATION  │
                          │      ENGINE      │
                          └─────────▲────────┘
                                    │
                ┌───────────────────┴───────────────────┐
                │        EKA FINANCIAL LEDGER (B)       │
                │  - Posted Credits & Debits            │
                │  - Transaction IDs (EKA-TXN-*)        │
                │  - Reference IDs                      │
                └───────────────────────────────────────┘
```

### The Parity Equation
For any selected accounting window:
$$\text{Total Gateway Captured} - \text{Total Gateway Refunds} = \text{Total Ledger Credits (Revenue Escrow)}$$

If the difference $\Delta \ne 0$, or if any individual transaction is found in one system but absent in the other, the report is marked **`MISMATCH`**.

---

## 3. Discrepancy Classifications

| Discrepancy Type | Cause | Automated Action | Administrative Action |
| :--- | :--- | :--- | :--- |
| **Orphaned Webhook** | Webhook dropped due to gateway downtime or DNS blip. | Scanned in daily sync; missing ledger entry created. | Flagged in audit log. |
| **Amount Mismatch** | Currency conversion variance or partial capture. | Marked as `MISMATCH` with exact delta in paise. | Finance admin notified to review gateway logs. |
| **Fee Divergence** | Gateway fee changed by payment processor. | Recorded in `reconciliation_exceptions`. | Platform fee expense adjusted in ledger. |
| **Reversed Payout** | Beneficiary bank rejected transfer after 48h. | Payout status moved to `REVERSED`; creator balance re-credited. | Creator notified to check bank details. |

---

## 4. Admin Cockpit Integration

Admins can trigger on-demand reconciliation directly from `/admin/finance`:
- Invokes `POST /api/reconciliation` with the desired date interval.
- Generates an immutable `reconciliation_records` row (`EKA-REC-XXXXXXXX`).
- Renders an interactive report highlighting matched counts and any exception items.
