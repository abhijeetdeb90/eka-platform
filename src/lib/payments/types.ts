/**
 * EKA Platform - Financial, Payments & Creator Settlement Types
 * 
 * All monetary values are represented as integer minor units (paise in INR).
 * Floating-point arithmetic is strictly prohibited in financial calculations.
 */

// ----------------------------------------------------------------------
// Monetary & Identification Units
// ----------------------------------------------------------------------

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export type EntityType = 'creator' | 'brand' | 'consumer' | 'platform' | 'tax_authority';

export type LedgerDirection = 'DEBIT' | 'CREDIT';

export type LedgerStatus = 'POSTED' | 'PENDING' | 'REVERSED';

export type LedgerSource =
  | 'subscription'
  | 'one_time'
  | 'brand_campaign'
  | 'platform_fee'
  | 'payout'
  | 'refund'
  | 'tax_withholding'
  | 'adjustment';

// ----------------------------------------------------------------------
// Double-Entry Ledger
// ----------------------------------------------------------------------

export interface LedgerEntry {
  id: string;
  transaction_id: string; // e.g. EKA-TXN-XXXXXXXX
  entity_id: string;
  entity_type: EntityType;
  amount: number; // minor units (paise)
  currency: Currency;
  direction: LedgerDirection;
  status: LedgerStatus;
  source: LedgerSource;
  reference_id: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface DoubleEntryParams {
  source: LedgerSource;
  reference_id: string;
  amount_minor: number;
  currency?: Currency;
  debitEntity: { id: string; type: EntityType };
  creditEntity: { id: string; type: EntityType };
  metadata?: Record<string, unknown>;
}

// ----------------------------------------------------------------------
// Subscriptions & Plans
// ----------------------------------------------------------------------

export type PlanCadence = 'monthly' | 'quarterly' | 'yearly' | 'annual';

export interface SubscriptionPlan {
  id: string;
  code: string;
  name: string;
  description?: string;
  amount_minor: number; // paise
  currency: Currency;
  cadence: PlanCadence;
  period_days: number;
  razorpay_plan_id?: string;
  is_active: boolean;
  features: string[];
  created_at: string;
  updated_at: string;
}

export type SubscriptionStatus =
  | 'created'
  | 'authenticated'
  | 'active'
  | 'pending'
  | 'halted'
  | 'paused'
  | 'cancelled'
  | 'completed'
  | 'expired';

export interface Subscription {
  id: string;
  user_id: string;
  customer_id?: string;
  razorpay_customer_id?: string;
  subscription_id: string; // e.g. sub_xxx or EKA-SUB-xxx
  razorpay_subscription_id?: string;
  plan_id: string;
  razorpay_plan_id?: string;
  payment_id?: string;
  status: SubscriptionStatus;
  amount_minor: number;
  currency: Currency;
  start_date?: string;
  renewal_date?: string;
  cancelled_at?: string;
  paused_at?: string;
  resumed_at?: string;
  failure_count: number;
  short_url?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ----------------------------------------------------------------------
// Orders, Payments & Refunds
// ----------------------------------------------------------------------

export type OrderStatus = 'CREATED' | 'ATTEMPTED' | 'PAID' | 'EXPIRED';

export type PaymentPurpose =
  | 'subscription'
  | 'one_time'
  | 'brand_campaign'
  | 'service'
  | 'donation'
  | 'gratitude';

export interface Order {
  id: string;
  order_id: string; // EKA-ORD-XXXXXXXX
  user_id?: string;
  customer_id?: string;
  amount_minor: number;
  currency: Currency;
  receipt: string;
  razorpay_order_id?: string;
  status: OrderStatus;
  purpose: PaymentPurpose;
  notes?: Record<string, string>;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED';

export type PaymentMethod = 'card' | 'netbanking' | 'wallet' | 'emi' | 'upi' | 'unknown';

export interface Payment {
  id: string;
  payment_id: string; // EKA-PAY-XXXXXXXX
  order_id?: string;
  customer_id?: string;
  user_id?: string;
  amount_minor: number;
  currency: Currency;
  status: PaymentStatus;
  method: PaymentMethod;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  fee_minor: number;
  tax_minor: number;
  error_code?: string;
  error_description?: string;
  captured_at?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type RefundStatus = 'PENDING' | 'PROCESSED' | 'FAILED';

export interface Refund {
  id: string;
  refund_id: string; // EKA-REFUND-XXXXXXXX
  payment_id: string;
  razorpay_refund_id?: string;
  razorpay_payment_id?: string;
  amount_minor: number;
  currency: Currency;
  reason: string;
  status: RefundStatus;
  reversal_ledger_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ----------------------------------------------------------------------
// Creator Monetisation, Onboarding & Payouts
// ----------------------------------------------------------------------

export type PanStatus = 'pending' | 'verified' | 'rejected';
export type BankAccountStatus = 'pending' | 'verified' | 'rejected';
export type CreatorAccountStatus = 'onboarding' | 'kyc_pending' | 'bank_verification_pending' | 'active' | 'suspended' | 'on_hold';
export type PayoutMethod = 'bank_transfer' | 'upi' | 'route_linked_account';

export interface CreatorProfile {
  id: string;
  user_id: string;
  legal_name: string;
  display_name: string;
  email: string;
  phone?: string;
  pan_number?: string;
  pan_status: PanStatus;
  bank_account_number?: string;
  bank_ifsc?: string;
  bank_account_status: BankAccountStatus;
  upi_id?: string;
  razorpay_linked_account_id?: string;
  razorpay_contact_id?: string;
  razorpay_fund_account_id?: string;
  payout_status: CreatorAccountStatus;
  payout_method: PayoutMethod;
  minimum_payout_threshold_minor: number; // default 100,000 paise (₹1,000)
  tax_profile: {
    tds_rate_percent: number; // e.g. 10 for 194J or 1 for 194O
    gst_registered: boolean;
    gstin?: string | null;
  };
  created_at: string;
  updated_at: string;
}

export type EarningPayoutStatus =
  | 'PENDING'
  | 'ELIGIBLE'
  | 'ON_HOLD'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED';

export interface CreatorEarning {
  id: string;
  earning_id: string; // EKA-EARN-XXXXXXXX
  campaign_id?: string;
  creator_id: string;
  deliverable_id?: string;
  contract_id?: string;
  campaign_amount_minor: number;
  gross_earning_minor: number;
  platform_fee_minor: number;
  tax_deduction_minor: number;
  other_deductions_minor: number;
  net_payable_minor: number;
  currency: Currency;
  payout_status: EarningPayoutStatus;
  tax_rules: Record<string, unknown>;
  calculation_breakdown: {
    commission_rate_percent: number;
    tds_rate_percent: number;
    notes?: string;
  };
  settled_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Creator Payout State Machine
 * PENDING -> ELIGIBLE -> PAYOUT_PENDING -> PROCESSING -> PAID
 * Failure: PROCESSING -> FAILED -> RETRY_PENDING -> PROCESSING
 * Terminal/Hold: CANCELLED, ON_HOLD, REVERSED
 */
export type PayoutState =
  | 'PENDING'
  | 'ELIGIBLE'
  | 'ON_HOLD'
  | 'PAYOUT_PENDING'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'RETRY_PENDING'
  | 'CANCELLED'
  | 'REVERSED';

export interface CreatorPayout {
  id: string;
  payout_id: string; // EKA-PAYOUT-XXXXXXXX
  creator_id: string;
  earning_ids: string[];
  amount_minor: number;
  currency: Currency;
  status: PayoutState;
  method: PayoutMethod | 'route' | 'razorpayx';
  razorpay_transfer_id?: string;
  razorpay_payout_id?: string;
  failure_reason?: string;
  retry_count: number;
  eligible_at?: string;
  processed_at?: string;
  paid_at?: string;
  transaction_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PayoutEligibilityResult {
  isEligible: boolean;
  reasons: string[];
  payableAmountMinor: number;
  currency: Currency;
  unmetConditions: string[];
}

// ----------------------------------------------------------------------
// Webhooks & Reconciliation
// ----------------------------------------------------------------------

export type WebhookStatus = 'RECEIVED' | 'PROCESSING' | 'PROCESSED' | 'FAILED' | 'DUPLICATE' | 'IGNORED';

export interface WebhookEventRecord {
  id: string;
  event_id: string;
  provider: string;
  event_type: string;
  received_at: string;
  processed_at?: string;
  status: WebhookStatus;
  retry_count: number;
  payload_hash: string;
  raw_payload: Record<string, unknown>;
  error_message?: string;
  created_at: string;
}

export type ReconciliationStatus = 'MATCHED' | 'MISMATCH' | 'RESOLVED';

export interface ReconciliationReport {
  id: string;
  reconciliation_id: string; // EKA-REC-XXXXXXXX
  period_start: string;
  period_end: string;
  provider: string;
  total_provider_collected_minor: number;
  total_ledger_collected_minor: number;
  discrepancy_amount_minor: number;
  status: ReconciliationStatus;
  details: {
    discrepancy_count: number;
    mismatched_items: Array<{
      id: string;
      provider_amount_minor: number;
      ledger_amount_minor: number;
      reason: string;
    }>;
  };
  reconciled_at: string;
  created_at: string;
}

// ----------------------------------------------------------------------
// Dashboard Aggregates
// ----------------------------------------------------------------------

export interface AdminFinanceSummary {
  gmv_minor: number;
  subscription_revenue_minor: number;
  platform_revenue_minor: number;
  creator_payable_minor: number;
  total_payouts_minor: number;
  total_refunds_minor: number;
  failed_payments_count: number;
  pending_settlements_minor: number;
  reconciliation_status: ReconciliationStatus;
  currency: Currency;
  generated_at: string;
}

export interface CreatorEarningsSummary {
  creator_id: string;
  total_earnings_minor: number;
  pending_earnings_minor: number;
  available_balance_minor: number;
  paid_amount_minor: number;
  total_deductions_minor: number;
  currency: Currency;
  payout_status: CreatorAccountStatus;
  recent_payouts: CreatorPayout[];
  recent_earnings: CreatorEarning[];
}

export interface BrandSpendSummary {
  brand_id: string;
  total_campaign_spend_minor: number;
  payments_settled_minor: number;
  creator_payments_minor: number;
  refunds_minor: number;
  outstanding_amounts_minor: number;
  currency: Currency;
  invoices: Array<{
    order_id: string;
    amount_minor: number;
    status: OrderStatus;
    created_at: string;
  }>;
}
