# EKA Platform — Creator Earnings & Payout Engine

## 1. Overview & Business Model

EKA's creator economy operates on transparent, mathematical integrity:
- When a patron or brand pays EKA for a creative campaign, cultural consultation, or workshop, funds enter the platform escrow.
- The **Creator Earnings Engine** computes the creator's gross share, deducts EKA's platform commission (typically 5–10%), applies regulatory tax withholding (TDS), and posts the remaining balance to the creator's ledger.
- Payouts are executed through an **audited state machine** to ensure no creator is double-paid, short-changed, or left guessing where their funds went.

---

## 2. Creator Onboarding Flow

```
Creator Profile
      │
      ▼
Payment & KYC Onboarding (Legal Name, PAN, GSTIN if applicable)
      │
      ▼
Bank Account / UPI VPA Details
      │
      ▼
Automated Verification (PAN format check, Penny-drop verification)
      │
      ▼
Payout-Enabled Status (`active`)
```

### Stored Attributes
- `creator_id`: Unique identifier
- `legal_name`: Entity or personal legal name matching PAN
- `pan_number` & `pan_status`: Verified / Pending / Rejected
- `bank_account_number`, `bank_ifsc`, `bank_account_status`
- `upi_id`: Optional Virtual Payment Address (e.g. `creator@okhdfcbank`)
- `razorpay_linked_account_id`: Account reference for Razorpay Route
- `payout_status`: `onboarding` | `kyc_pending` | `bank_verification_pending` | `active` | `suspended` | `on_hold`
- `minimum_payout_threshold_minor`: Minimum balance before release (default ₹1,000 / 100,000 paise)

---

## 3. Creator Earnings Engine

The earnings engine runs independently of payment collection:

```
INPUTS:
  - Campaign / Deliverable Contract
  - Campaign Value (e.g. ₹50,000 / 5,000,000 paise)
  - Platform Commission Rate (e.g. 10%)
  - Tax Withholding Profile (e.g. 10% TDS u/s 194J)

CALCULATIONS:
  1. Gross Earning            = ₹50,000  (5,000,000 paise)
  2. Platform Commission (10%)= -₹5,000   (500,000 paise)
  3. Creator Net Base         = ₹45,000  (4,500,000 paise)
  4. TDS Withholding (10%)    = -₹4,500   (450,000 paise)
  ────────────────────────────────────────────────────────
  Net Payable to Creator     = ₹40,500  (4,050,000 paise)
```

### Configurable Tax Treatment
- **TDS Section 194J**: 10% on professional services / royalties (default for creators).
- **TDS Section 194O**: 1% for e-commerce operator marketplace listings.
- **Section 206AA (Higher Rate)**: 20% applied automatically if PAN is unverified or invalid.

---

## 4. Payout State Machine

```
              ┌───────────────┐
              │    PENDING    │
              └───────┬───────┘
                      │ Meets 9-point eligibility checks
                      ▼
              ┌───────────────┐
              │   ELIGIBLE    │
              └───────┬───────┘
                      │ Payout requested & atomic lock acquired
                      ▼
              ┌───────────────┐
              │PAYOUT_PENDING │
              └───────┬───────┘
                      │ Dispatched to Razorpay Route / RazorpayX
                      ▼
              ┌───────────────┐
       ┌──────┤  PROCESSING   ├──────┐
       │      └───────┬───────┘      │
Gateway│              │Gateway       │Admin / Risk
Failed │              │Success       │Cancellation
       ▼              ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   FAILED    │ │    PAID     │ │  CANCELLED  │
└──────┬──────┘ └─────────────┘ └─────────────┘
       │ Retry
       ▼
┌─────────────┐
│RETRY_PENDING│ ──▶ PROCESSING
└─────────────┘
```

---

## 5. Multi-Point Eligibility Checks

Before any payout is authorized, the engine verifies 9 distinct conditions:
1. **Account Active**: Creator payout status must be `active`.
2. **KYC Verified**: Validated PAN is present on file.
3. **Bank Account / UPI Verified**: Destination payment route is verified.
4. **Minimum Threshold**: Available ledger balance meets or exceeds `minimum_payout_threshold_minor` (₹1,000).
5. **Campaign Completion**: Associated client deliverable has been accepted.
6. **Payment Settlement**: Inbound brand funds are confirmed by gateway webhooks.
7. **Dispute / Refund Window**: Statutory cooling-off window has elapsed.
8. **Tax Compliance**: Tax profile and withholding have been calculated.
9. **Zero Fraud Flags**: Creator has no open flags in `creator_fraud_flags`.

---

## 6. Concurrency & Double-Payout Protection

To prevent concurrent double payouts (e.g. rapid multiple clicks or parallel API requests), the engine employs **atomic status locking**:
1. When a payout is initiated, an in-memory and row-level mutex is acquired for `creator_id`.
2. The payout transition from `ELIGIBLE` to `PROCESSING` occurs atomically.
3. Any second simultaneous payout request for the same creator is immediately rejected with an HTTP 409 conflict until the prior request completes.
