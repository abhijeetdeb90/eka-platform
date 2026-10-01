# EKA Platform — Payment & Financial Security

## 1. Zero-Trust Security Architecture

Financial infrastructure requires defense-in-depth:
1. **Never Trust Frontend State**: Client requests stating "payment succeeded" are treated as unverified hints. State changes occur exclusively via cryptographic server-to-server signature validation.
2. **Zero Plaintext Payment Credentials**: EKA never stores credit/debit card PANs, CVVs, or bank net-banking passwords. All payment credential entry is handled by Razorpay's PCI-DSS Level 1 compliant iframes and SDKs.
3. **Immutable Double-Entry**: Financial mutations cannot happen via direct client `INSERT` or `UPDATE` queries. All mutations occur through server-side authenticated services and Postgres RLS policies.

---

## 2. Cryptographic Integrity & Anti-Tampering

### Timing-Safe Signature Validation
Standard string equality (`===`) is vulnerable to timing side-channel attacks where an attacker discovers a secret byte-by-byte based on CPU response latency.

EKA uses `crypto.timingSafeEqual` for all HMAC-SHA256 signature verifications:
```typescript
const a = Buffer.from(signature, "utf-8");
const b = Buffer.from(expectedSignature, "utf-8");

if (a.length !== b.length) return false;
return crypto.timingSafeEqual(a, b);
```

---

## 3. Idempotency & Replay Protection

### Webhook Deduplication
Every incoming webhook is verified and checked against the `webhook_events` database log:
1. Webhooks compute a SHA-256 `payload_hash` over the raw request body.
2. If `event_id` or `payload_hash` has already been recorded, EKA immediately returns `HTTP 200 OK` with `{ status: "ok (duplicate)" }`.
3. The underlying transaction logic is never executed twice, preventing duplicate credits or multiple subscription activations.

### Payout Concurrency Locks
When initiating creator payouts, an atomic mutex locks the `creator_id`. Concurrent requests attempting to trigger double payouts are rejected with an HTTP 409 Conflict.

---

## 4. Role-Based Access Control (RBAC) & Row-Level Security (RLS)

All 17 financial database tables enforce Postgres Row-Level Security:
- **Creators**: Can only SELECT their own earnings and payouts (`creator_id = auth.uid()`). Direct client INSERT/UPDATE on ledger entries is blocked.
- **Consumers / Brands**: Can only inspect their own orders and invoices (`user_id = auth.uid()`).
- **Financial Services**: Execute with `service_role` credentials restricted to backend server functions.
- **Admin Cockpit**: Protected via `has_role(auth.uid(), 'admin')` checks.

---

## 5. Audit Logging & Telemetry Redaction

- Every payout request, manual review, refund, and reconciliation run generates an immutable record in `audit_logs` (`EKA-AUD-XXXXXXXX`).
- Loggers automatically redact sensitive tokens:
  - Bank account numbers are masked (`XXXX-XXXX-1234`).
  - PAN numbers are masked (`ABCDE****F`).
  - Webhook signatures and secrets are never printed in application logs.
