# EKA Platform — Payments & Creator Settlement Architecture

## 1. Architectural Philosophy & Separation of Concerns

The most common failure mode in creator platforms is conflating gateway transaction status with internal financial accounting: money is received, nobody knows why, and a creator asks where their ₹3,742 went.

EKA prevents this by enforcing an explicit separation of concerns:
**Razorpay is an execution gateway; EKA's immutable double-entry ledger is the sole source of financial truth.**

```
┌────────────────────────────────────────────────────────────────────────┐
│                              EKA PLATFORM                              │
│         Consumers              Brands                Creators          │
└─────────────┬────────────────────┬───────────────────────┬─────────────┘
              │                    │                       │
              ▼                    ▼                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        PAYMENT PROVIDER ADAPTER                        │
│                 (PaymentProvider Abstraction Interface)                │
│             RazorpayProvider              FutureProvider / Sandbox     │
└─────────────┬────────────────────────────────────────────┬─────────────┘
              │ Inbound Collections                        │ Outbound Payouts
              ▼                                            ▲
┌──────────────────────────────────────┐  ┌────────────────┴─────────────┐
│        EKA TRANSACTION LAYER         │  │     CREATOR PAYOUT ENGINE    │
│  - Cryptographic Verification        │  │  - 9-Point Eligibility Check │
│  - Webhook Ingestion & Idempotency   │  │  - Concurrency Lock          │
│  - Order & Subscription Invoices     │  │  - Route / RazorpayX Payouts │
└─────────────────┬────────────────────┘  └────────────────▲─────────────┘
                  │                                        │
                  ▼                                        │
┌──────────────────────────────────────────────────────────┴─────────────┐
│                      EKA IMMUTABLE FINANCIAL LEDGER                    │
│      - Double-entry accounting (Debit = Credit)                        │
│      - Integer minor units (Paise in INR, never floating-point)        │
│      - Non-destructive adjustment & reversal journals                  │
└─────────────────┬────────────────────────────────────────┬─────────────┘
                  │                                        │
                  ▼                                        │
┌──────────────────────────────────────┐                   │
│       CREATOR EARNINGS ENGINE        ├───────────────────┘
│  - Gross campaign value              │
│  - Platform commission (5–10%)       │
│  - Configurable TDS withholding      │
│  - Net payable to creator            │
└──────────────────────────────────────┘
```

### Regulatory Compliance: "Ledger", Not "Consumer Wallet"
Unless an entity possesses a formal Prepaid Payment Instrument (PPI) or Payment Aggregator (PA) license from the Reserve Bank of India, maintaining arbitrary stored-value balances for consumers creates serious regulatory exposure. 
EKA explicitly designates creator balances as **Creator Earnings / Payable Ledgers**. Funds represent accounts payable against delivered creative deliverables and verified contracts—never generic consumer store credit.

---

## 2. Core Invariants & Rules

1. **Integer Minor Units (Paise)**: All monetary figures are stored and processed in minor integer units (INR 999 = `99900` paise). Floating-point arithmetic is strictly prohibited in business logic.
2. **Double-Entry Equilibrium**: Every financial movement generates at least one Debit and one Credit entry of identical magnitude.
3. **Immutability**: Completed ledger rows are never mutated or deleted. Corrections must take the form of reversing double-entries (`source: 'adjustment'`) referencing the original `transaction_id`.
4. **Server-Side Trust**: Client browser redirects (e.g. `/success` or query parameters) are strictly cosmetic. Payment confirmation, entitlement provisioning, and ledger posting occur exclusively upon cryptographic signature verification and server-to-server webhook ingestion.

---

## 3. End-to-End Payment Flows

### A. Consumer / Brand Inbound Payment Flow
```
Consumer/Brand ──▶ EKA Backend (Order/Subscription Init)
                         │
                         ▼
                   Razorpay API (Order / Subscription created)
                         │
                         ▼
                   Customer Checkout (Card/UPI/NetBanking)
                         │
                         ▼
                   Razorpay Webhook (payment.captured / subscription.charged)
                         │
                         ├── Verify HMAC-SHA256 signature
                         ├── Validate idempotency (event_id check)
                         ├── Update internal Order / Subscription status
                         ├── Post Double-Entry to EKA Financial Ledger
                         └── Activate user entitlement
```

### B. Creator Campaign Monetisation & Settlement Flow
```
Brand deposits campaign payment (₹100,000)
       │
       ▼
EKA Transaction Layer
       │
       ▼
Creator Earnings Engine
       ├── Gross Earning: ₹100,000
       ├── Platform Commission (e.g. 10%): -₹10,000
       ├── TDS Withholding (e.g. 10% u/s 194J): -₹9,000
       └── Net Creator Payable: ₹81,000
       │
       ▼
EKA Double-Entry Ledger Posting
       ├── Debit: Brand Escrow (₹100,000)
       ├── Credit: Creator Payable (₹81,000)
       ├── Credit: Platform Fee Revenue (₹10,000)
       └── Credit: Tax Authority Escrow (₹9,000)
       │
       ▼
Payout Eligibility Evaluation (KYC, dispute window, minimum threshold)
       │
       ▼
Razorpay Route / RazorpayX Payout Execution
       │
       ▼
Settlement Confirmation Webhook ──▶ Ledger Reconciliation
```

---

## 4. Database Schema Structure

| Table | Purpose |
| :--- | :--- |
| `creators` | Creator financial profile, KYC status, PAN verification, bank/UPI details, and linked account IDs. |
| `brands` | Brand corporate details, billing information, GSTIN, and invoicing contacts. |
| `customers` | Consumer billing profiles and invoice records. |
| `payment_customers` | Cross-reference table mapping internal EKA users to gateway customer IDs (`cust_xxx`). |
| `subscription_plans` | Canonical catalog of membership plans (Monthly, Quarterly, Annual, Creator Pro, Brand Growth). |
| `subscriptions` | Active recurring subscriptions, billing cycles, renewals, and lifecycle status. |
| `orders` | Gateway checkout orders with unique receipts (`EKA-ORD-XXXXXXXX`). |
| `payments` | Captured transactions, gateway fees, taxes, and authorization details (`EKA-PAY-XXXXXXXX`). |
| `refunds` | Processed full/partial refunds and corresponding ledger reversal references (`EKA-REFUND-XXXXXXXX`). |
| `creator_earnings` | Independent line-item earnings per deliverable with commission and tax breakdowns (`EKA-EARN-XXXXXXXX`). |
| `creator_payouts` | State machine tracking creator disbursements (`EKA-PAYOUT-XXXXXXXX`). |
| `ledger_entries` | Immutable double-entry bookkeeping journal entries (`EKA-TXN-XXXXXXXX`). |
| `platform_fees` | Platform revenue attribution and commission records (`EKA-FEE-XXXXXXXX`). |
| `tax_records` | TDS Section 194J/194O and GST compliance ledgers (`EKA-TAX-XXXXXXXX`). |
| `reconciliation_records` | Parity inspection reports between gateway collections and ledger journals (`EKA-REC-XXXXXXXX`). |
| `webhook_events` | Idempotent log of raw incoming gateway webhook payloads. |
| `audit_logs` | Immutable audit log of operational, security, and administrative actions (`EKA-AUD-XXXXXXXX`). |
