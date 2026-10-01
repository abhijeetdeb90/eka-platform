# EKA Platform — Razorpay Integration Guide

## 1. Credentials & Environment Configuration

All Razorpay secrets reside strictly on the server side. Never expose secrets to frontend client bundles.

```bash
# Razorpay Gateway Standard Credentials
RAZORPAY_KEY_ID="rzp_test_XXXXXXXXXXXXXXXX"
RAZORPAY_KEY_SECRET="your_razorpay_secret_key"
RAZORPAY_WEBHOOK_SECRET="your_webhook_signing_secret"

# Razorpay Route (Marketplace Payment Splitting)
RAZORPAY_ACCOUNT_ID="acc_XXXXXXXXXXXXXXXX"

# RazorpayX (Direct Bank / UPI Payouts)
RAZORPAYX_ACCOUNT_NUMBER="7878780080312345"
RAZORPAYX_CONFIG='{"channel":"IMPS","purpose":"payout"}'
```

---

## 2. Decoupled Provider Abstraction (`PaymentProvider`)

To ensure EKA can integrate alternate processors or run mock simulation tests without modifying the financial ledger, all operations adhere to `PaymentProvider`:

```typescript
export interface PaymentProvider {
  name: string;

  // Customers & Subscriptions
  createCustomer(params: CreateCustomerParams): Promise<ProviderCustomerResult>;
  createPlan(params: CreatePlanParams): Promise<ProviderPlanResult>;
  createSubscription(params: CreateSubscriptionParams): Promise<ProviderSubscriptionResult>;
  cancelSubscription(subscriptionId: string, cancelAtCycleEnd?: boolean): Promise<{ id: string; status: string }>;
  pauseSubscription(subscriptionId: string): Promise<{ id: string; status: string }>;
  resumeSubscription(subscriptionId: string): Promise<{ id: string; status: string }>;

  // Orders & Payments
  createOrder(params: CreateOrderParams): Promise<ProviderOrderResult>;
  verifyPaymentSignature(params: VerifySignatureParams): boolean;
  capturePayment(paymentId: string, amountMinor: number, currency?: string): Promise<ProviderPaymentResult>;

  // Refunds
  createRefund(params: CreateRefundParams): Promise<ProviderRefundResult>;

  // Route & RazorpayX
  transferToLinkedAccount(params: RouteTransferParams): Promise<RouteTransferResult>;
  createPayout(params: CreatePayoutParams): Promise<ProviderPayoutResult>;

  // Webhooks
  verifyWebhookSignature(rawBody: string, signature: string, secret?: string): boolean;
}
```

---

## 3. Cryptographic Signature Verification

### A. Payment Authorization Signature
When Razorpay Checkout completes on the client, the client submits:
- `razorpay_order_id`
- `razorpay_payment_id`
- `razorpay_signature`

EKA verifies authenticity using HMAC-SHA256 and constant-time string comparison:
```typescript
const payload = `${order_id}|${payment_id}`;
const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
const isAuthentic = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
```

### B. Webhook Signature
Razorpay sends an `X-Razorpay-Signature` header with each webhook request:
```typescript
const expected = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
const isValid = crypto.timingSafeEqual(Buffer.from(headerSignature), Buffer.from(expected));
```

---

## 4. Subscriptions API Integration

Subscriptions use Razorpay's **Plan → Subscription** recurring model:

1. **Plan Provisioning**:
   - `period`: `monthly`, `quarterly`, `yearly`
   - `interval`: `1` (or `3` for quarterly)
   - `amount`: `29900` paise (₹299/mo)
2. **Subscription Initialization**:
   - Call `POST /v1/subscriptions` with `plan_id` and `customer_id`.
   - Returns a `short_url` for hosted authentication or mandate authorization.
3. **Webhook Lifecycle Handling**:
   - `subscription.authenticated`: Initial mandate set up.
   - `subscription.activated`: First charge successful; entitlement provisioned.
   - `subscription.charged`: Recurring renewal processed; entitlement extended.
   - `subscription.halted`: Max retries failed; access revoked.
   - `subscription.cancelled`: Cancelled; access terminated at end of period.

---

## 5. Creator Settlement: Route vs RazorpayX

EKA supports dual settlement modes:

### Mode 1: Razorpay Route (Marketplace Splitting)
- Ideal when brand payments are split directly into linked creator merchant accounts (`acc_xxx`).
- Invokes `POST /v1/transfers` with:
  ```json
  {
    "account": "acc_XXXXXXXXXXXXXX",
    "amount": 8100000,
    "currency": "INR",
    "notes": { "earning_id": "EKA-EARN-12345" }
  }
  ```

### Mode 2: RazorpayX Payouts (Direct Bank & UPI)
- Ideal for direct disbursements to un-linked artisan bank accounts or VPAs.
- Invokes `POST /v1/payouts` with:
  ```json
  {
    "account_number": "7878780080312345",
    "fund_account_id": "fa_XXXXXXXXXXXXXX",
    "amount": 8100000,
    "currency": "INR",
    "mode": "IMPS",
    "purpose": "payout"
  }
  ```
