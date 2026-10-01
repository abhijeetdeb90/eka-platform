/**
 * EKA Platform - Payment Provider Abstraction
 * 
 * Defines the contract that RazorpayProvider (and any future providers like Stripe/Cashfree)
 * must implement to decouple gateway semantics from EKA's financial ledger.
 */

export interface CreateCustomerParams {
  name: string;
  email: string;
  contact?: string;
  notes?: Record<string, string>;
}

export interface ProviderCustomerResult {
  id: string;
  email: string;
  contact?: string;
}

export interface CreatePlanParams {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  item: {
    name: string;
    amount: number; // in minor units (paise)
    currency: string;
    description?: string;
  };
}

export interface ProviderPlanResult {
  id: string;
  name: string;
  amount: number;
  currency: string;
  period: string;
  interval: number;
}

export interface CreateSubscriptionParams {
  plan_id: string;
  customer_id?: string;
  total_count?: number;
  quantity?: number;
  customer_notify?: 0 | 1;
  start_at?: number;
  notes?: Record<string, string>;
}

export interface ProviderSubscriptionResult {
  id: string;
  plan_id: string;
  status: string;
  short_url?: string;
  current_start?: number;
  current_end?: number;
}

export interface CreateOrderParams {
  amount: number; // in minor units (paise)
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface ProviderOrderResult {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface VerifySignatureParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface ProviderPaymentResult {
  id: string;
  order_id?: string;
  amount: number;
  currency: string;
  status: string;
  method?: string;
  fee?: number;
  tax?: number;
  error_code?: string;
  error_description?: string;
}

export interface CreateRefundParams {
  payment_id: string;
  amount?: number; // partial refund in minor units, or full if omitted
  notes?: Record<string, string>;
}

export interface ProviderRefundResult {
  id: string;
  payment_id: string;
  amount: number;
  currency: string;
  status: string;
}

export interface RouteTransferParams {
  account: string; // razorpay linked account id (acc_xxx)
  amount: number; // minor units
  currency: string;
  notes?: Record<string, string>;
}

export interface RouteTransferResult {
  id: string;
  recipient: string;
  amount: number;
  currency: string;
  status: string;
}

export interface CreatePayoutParams {
  fund_account_id?: string;
  account_number?: string;
  amount: number; // minor units
  currency: string;
  mode: 'NEFT' | 'RTGS' | 'IMPS' | 'UPI';
  purpose: 'payout' | 'refund' | 'salary';
  notes?: Record<string, string>;
}

export interface ProviderPayoutResult {
  id: string;
  amount: number;
  currency: string;
  status: string;
  utr?: string;
  mode: string;
}

export interface PaymentProvider {
  name: string;

  // Customers
  createCustomer(params: CreateCustomerParams): Promise<ProviderCustomerResult>;

  // Plans & Subscriptions
  createPlan(params: CreatePlanParams): Promise<ProviderPlanResult>;
  createSubscription(params: CreateSubscriptionParams): Promise<ProviderSubscriptionResult>;
  cancelSubscription(subscriptionId: string, cancelAtCycleEnd?: boolean): Promise<{ id: string; status: string }>;
  pauseSubscription(subscriptionId: string): Promise<{ id: string; status: string }>;
  resumeSubscription(subscriptionId: string): Promise<{ id: string; status: string }>;

  // Orders & Payments
  createOrder(params: CreateOrderParams): Promise<ProviderOrderResult>;
  verifyPaymentSignature(params: VerifySignatureParams): boolean;
  capturePayment(paymentId: string, amountMinor: number, currency?: string): Promise<ProviderPaymentResult>;
  fetchPayment(paymentId: string): Promise<ProviderPaymentResult>;

  // Refunds
  createRefund(params: CreateRefundParams): Promise<ProviderRefundResult>;

  // Route (Marketplace Splitting & Linked Account Settlements)
  transferToLinkedAccount(params: RouteTransferParams): Promise<RouteTransferResult>;

  // RazorpayX (Direct Bank & UPI Payouts)
  createPayout(params: CreatePayoutParams): Promise<ProviderPayoutResult>;

  // Webhooks
  verifyWebhookSignature(rawBody: string, signature: string, secret?: string): boolean;
}
