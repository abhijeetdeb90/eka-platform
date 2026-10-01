-- ============================================================================
-- EKA Platform: Unified Razorpay Payments, Financial Ledger & Creator Payouts
-- Migration: 20261001000000_eka_payments_ledger_and_payouts_core.sql
-- 
-- Architecture:
-- Razorpay -> Payment Adapter -> EKA Transaction Layer -> EKA Ledger -> Earnings Engine -> Payout Engine -> Route/RazorpayX
-- All money stored in integer minor units (paise for INR). Zero floating-point arithmetic.
-- Immutable double-entry ledger records with audit logging & idempotent webhooks.
-- ============================================================================

-- 1. CREATORS FINANCIAL & KYC PROFILE
CREATE TABLE IF NOT EXISTS public.creators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  legal_name text NOT NULL,
  display_name text NOT NULL,
  email text NOT NULL,
  phone text,
  pan_number text,
  pan_status text NOT NULL DEFAULT 'pending' CHECK (pan_status IN ('pending', 'verified', 'rejected')),
  bank_account_number text,
  bank_ifsc text,
  bank_account_status text NOT NULL DEFAULT 'pending' CHECK (bank_account_status IN ('pending', 'verified', 'rejected')),
  upi_id text,
  razorpay_linked_account_id text, -- Razorpay Route linked account (acc_xxx)
  razorpay_contact_id text,        -- RazorpayX Contact (cont_xxx)
  razorpay_fund_account_id text,   -- RazorpayX Fund Account (fa_xxx)
  payout_status text NOT NULL DEFAULT 'onboarding' CHECK (
    payout_status IN ('onboarding', 'kyc_pending', 'bank_verification_pending', 'active', 'suspended', 'on_hold')
  ),
  payout_method text NOT NULL DEFAULT 'bank_transfer' CHECK (
    payout_method IN ('bank_transfer', 'upi', 'route_linked_account')
  ),
  minimum_payout_threshold_minor bigint NOT NULL DEFAULT 100000, -- ₹1,000 threshold in paise
  tax_profile jsonb NOT NULL DEFAULT '{"tds_rate_percent": 10, "gst_registered": false, "gstin": null}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creators_user_id ON public.creators(user_id);
CREATE INDEX IF NOT EXISTS idx_creators_payout_status ON public.creators(payout_status);
CREATE INDEX IF NOT EXISTS idx_creators_rzp_linked ON public.creators(razorpay_linked_account_id);

-- 2. BRANDS
CREATE TABLE IF NOT EXISTS public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_name text NOT NULL,
  legal_entity_name text NOT NULL,
  contact_email text NOT NULL,
  phone text,
  gstin text,
  pan_number text,
  billing_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending_verification')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_brands_user_id ON public.brands(user_id);
CREATE INDEX IF NOT EXISTS idx_brands_status ON public.brands(status);

-- 3. CUSTOMERS
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  gstin text,
  billing_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);

-- 4. PAYMENT CUSTOMERS (Gateway Cross-Reference)
CREATE TABLE IF NOT EXISTS public.payment_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'razorpay',
  provider_customer_id text NOT NULL, -- cust_xxx in Razorpay
  email text NOT NULL,
  contact text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_payment_customer UNIQUE (provider, provider_customer_id)
);

CREATE INDEX IF NOT EXISTS idx_payment_customers_user ON public.payment_customers(user_id);

-- 5. SUBSCRIPTION PLANS
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id text PRIMARY KEY, -- 'monthly', 'quarterly', 'annual', 'brand_pro', 'creator_pro'
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  amount_minor bigint NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  cadence text NOT NULL CHECK (cadence IN ('monthly', 'quarterly', 'yearly', 'annual')),
  period_days integer NOT NULL,
  razorpay_plan_id text, -- plan_xxx in Razorpay
  is_active boolean NOT NULL DEFAULT true,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed Default Subscription Plans if empty
INSERT INTO public.subscription_plans (id, code, name, description, amount_minor, currency, cadence, period_days, features)
VALUES 
  ('monthly', 'EKA_PATRON_MONTHLY', 'Monthly Sanctuary Membership', 'Full access to cultural library, AI exploration, and community circles.', 29900, 'INR', 'monthly', 30, '["cultural_library", "ai_exploration", "community_circles"]'::jsonb),
  ('quarterly', 'EKA_PATRON_QUARTERLY', 'Quarterly Patron Membership', 'Seasonal rhythm alignment with seasonal workshops and heritage previews.', 79900, 'INR', 'quarterly', 90, '["cultural_library", "seasonal_workshops", "heritage_previews"]'::jsonb),
  ('annual', 'EKA_PATRON_ANNUAL', 'Annual Patron Membership', 'Twelve months for the price of ten. Full seasonal cycles and VIP invitations.', 299000, 'INR', 'annual', 365, '["full_annual_cycle", "vip_invitations", "peace_fund_patron"]'::jsonb),
  ('creator_pro', 'EKA_CREATOR_PRO', 'Creator Studio Pro', 'Master Artisan Workspace with Epistemic Tier tagging & priority settlements.', 49900, 'INR', 'monthly', 30, '["artisan_studio", "epistemic_tags", "priority_settlement"]'::jsonb),
  ('brand_growth', 'EKA_BRAND_GROWTH', 'Brand Growth OS', 'Trend Radar, Brand Brain AI, Autopilot campaigns and verified creator matching.', 999900, 'INR', 'monthly', 30, '["trend_radar", "brand_brain_ai", "creator_marketplace"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 6. SUBSCRIPTIONS (Enhancement)
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS razorpay_customer_id text;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS razorpay_subscription_id text;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS razorpay_plan_id text;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS razorpay_payment_id text;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS amount_minor bigint;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS start_date timestamptz;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS renewal_date timestamptz;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS paused_at timestamptz;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS resumed_at timestamptz;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS failure_count integer DEFAULT 0;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS latest_invoice_id text;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS short_url text;

CREATE INDEX IF NOT EXISTS idx_subs_rzp_sub_id ON public.subscriptions(razorpay_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subs_customer_id ON public.subscriptions(customer_id);

-- 7. ORDERS (One-Time and Subscription Invoices)
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL UNIQUE, -- 'EKA-ORD-XXXXXXXX'
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  amount_minor bigint NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  receipt text NOT NULL UNIQUE,
  razorpay_order_id text UNIQUE,
  status text NOT NULL DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'ATTEMPTED', 'PAID', 'EXPIRED')),
  purpose text NOT NULL DEFAULT 'one_time' CHECK (
    purpose IN ('subscription', 'one_time', 'brand_campaign', 'service', 'donation', 'gratitude')
  ),
  notes jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_order_id ON public.orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_rzp_order ON public.orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 8. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id text NOT NULL UNIQUE, -- 'EKA-PAY-XXXXXXXX'
  order_id text REFERENCES public.orders(order_id) ON DELETE SET NULL,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  amount_minor bigint NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'AUTHORIZED' CHECK (status IN ('AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED')),
  method text NOT NULL DEFAULT 'unknown' CHECK (method IN ('card', 'netbanking', 'wallet', 'emi', 'upi', 'unknown')),
  razorpay_payment_id text UNIQUE,
  razorpay_order_id text,
  razorpay_signature text,
  fee_minor bigint NOT NULL DEFAULT 0,
  tax_minor bigint NOT NULL DEFAULT 0,
  error_code text,
  error_description text,
  captured_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON public.payments(payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_rzp_payment ON public.payments(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- 9. REFUNDS
CREATE TABLE IF NOT EXISTS public.refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  refund_id text NOT NULL UNIQUE, -- 'EKA-REFUND-XXXXXXXX'
  payment_id text NOT NULL REFERENCES public.payments(payment_id) ON DELETE RESTRICT,
  razorpay_refund_id text UNIQUE,
  razorpay_payment_id text,
  amount_minor bigint NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSED', 'FAILED')),
  reversal_ledger_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_refunds_refund_id ON public.refunds(refund_id);
CREATE INDEX IF NOT EXISTS idx_refunds_payment_id ON public.refunds(payment_id);
CREATE INDEX IF NOT EXISTS idx_refunds_rzp_refund ON public.refunds(razorpay_refund_id);

-- 10. CREATOR EARNINGS ENGINE
CREATE TABLE IF NOT EXISTS public.creator_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  earning_id text NOT NULL UNIQUE, -- 'EKA-EARN-XXXXXXXX'
  campaign_id text,
  creator_id uuid NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  deliverable_id text,
  contract_id text,
  campaign_amount_minor bigint NOT NULL,
  gross_earning_minor bigint NOT NULL,
  platform_fee_minor bigint NOT NULL,
  tax_deduction_minor bigint NOT NULL,
  other_deductions_minor bigint NOT NULL DEFAULT 0,
  net_payable_minor bigint NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  payout_status text NOT NULL DEFAULT 'PENDING' CHECK (
    payout_status IN ('PENDING', 'ELIGIBLE', 'ON_HOLD', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED')
  ),
  tax_rules jsonb NOT NULL DEFAULT '{}'::jsonb,
  calculation_breakdown jsonb NOT NULL DEFAULT '{}'::jsonb,
  settled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creator_earnings_earning_id ON public.creator_earnings(earning_id);
CREATE INDEX IF NOT EXISTS idx_creator_earnings_creator ON public.creator_earnings(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_earnings_status ON public.creator_earnings(payout_status);
CREATE INDEX IF NOT EXISTS idx_creator_earnings_campaign ON public.creator_earnings(campaign_id);

-- 11. CREATOR PAYOUTS (State Machine)
CREATE TABLE IF NOT EXISTS public.creator_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_id text NOT NULL UNIQUE, -- 'EKA-PAYOUT-XXXXXXXX'
  creator_id uuid NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  earning_ids text[] NOT NULL DEFAULT '{}',
  amount_minor bigint NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'PENDING' CHECK (
    status IN ('PENDING', 'ELIGIBLE', 'ON_HOLD', 'PROCESSING', 'PAID', 'FAILED', 'RETRY_PENDING', 'CANCELLED', 'REVERSED')
  ),
  method text NOT NULL DEFAULT 'bank_transfer' CHECK (
    method IN ('route', 'razorpayx', 'upi', 'bank_transfer')
  ),
  razorpay_transfer_id text UNIQUE,
  razorpay_payout_id text UNIQUE,
  failure_reason text,
  retry_count integer NOT NULL DEFAULT 0,
  eligible_at timestamptz,
  processed_at timestamptz,
  paid_at timestamptz,
  transaction_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creator_payouts_payout_id ON public.creator_payouts(payout_id);
CREATE INDEX IF NOT EXISTS idx_creator_payouts_creator ON public.creator_payouts(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_payouts_status ON public.creator_payouts(status);

-- 12. IMMUTABLE FINANCIAL LEDGER ENTRIES
-- Ensure required double-entry columns exist on ledger_entries
ALTER TABLE public.ledger_entries ADD COLUMN IF NOT EXISTS transaction_id text;
ALTER TABLE public.ledger_entries ADD COLUMN IF NOT EXISTS entity_id text;
ALTER TABLE public.ledger_entries ADD COLUMN IF NOT EXISTS entity_type text;
ALTER TABLE public.ledger_entries ADD COLUMN IF NOT EXISTS amount bigint;
ALTER TABLE public.ledger_entries ADD COLUMN IF NOT EXISTS currency text DEFAULT 'INR';
ALTER TABLE public.ledger_entries ADD COLUMN IF NOT EXISTS direction text;
ALTER TABLE public.ledger_entries ADD COLUMN IF NOT EXISTS status text DEFAULT 'POSTED';
ALTER TABLE public.ledger_entries ADD COLUMN IF NOT EXISTS source text;
ALTER TABLE public.ledger_entries ADD COLUMN IF NOT EXISTS reference_id text;
ALTER TABLE public.ledger_entries ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.ledger_entries ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_ledger_transaction_id ON public.ledger_entries(transaction_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entity ON public.ledger_entries(entity_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_ledger_source_ref ON public.ledger_entries(source, reference_id);

-- 13. PLATFORM FEES RECORD
CREATE TABLE IF NOT EXISTS public.platform_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_id text NOT NULL UNIQUE, -- 'EKA-FEE-XXXXXXXX'
  payment_id text REFERENCES public.payments(payment_id) ON DELETE SET NULL,
  order_id text REFERENCES public.orders(order_id) ON DELETE SET NULL,
  transaction_id text NOT NULL,
  gross_amount_minor bigint NOT NULL,
  fee_amount_minor bigint NOT NULL,
  fee_rate_bps integer NOT NULL, -- basis points (e.g. 1000 = 10%)
  fee_type text NOT NULL CHECK (
    fee_type IN ('consumer_subscription', 'brand_campaign_commission', 'marketplace_take', 'service_commission')
  ),
  currency text NOT NULL DEFAULT 'INR',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_fees_fee_id ON public.platform_fees(fee_id);
CREATE INDEX IF NOT EXISTS idx_platform_fees_txn ON public.platform_fees(transaction_id);

-- 14. TAX RECORDS (TDS & GST Compliance)
CREATE TABLE IF NOT EXISTS public.tax_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_record_id text NOT NULL UNIQUE, -- 'EKA-TAX-XXXXXXXX'
  entity_id text NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('creator', 'brand', 'platform')),
  tax_type text NOT NULL CHECK (tax_type IN ('TDS_194O', 'TDS_194J', 'GST_18', 'GST_RCM')),
  base_amount_minor bigint NOT NULL,
  tax_amount_minor bigint NOT NULL,
  tax_rate_bps integer NOT NULL,
  pan_number text,
  gstin text,
  financial_year text NOT NULL,
  quarter text NOT NULL,
  status text NOT NULL DEFAULT 'ACCRUED' CHECK (
    status IN ('ACCRUED', 'DEDUCTED', 'DEPOSITED', 'CHALLAN_GENERATED')
  ),
  filing_reference text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tax_records_tax_id ON public.tax_records(tax_record_id);
CREATE INDEX IF NOT EXISTS idx_tax_records_entity ON public.tax_records(entity_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_tax_records_quarter ON public.tax_records(financial_year, quarter);

-- 15. RECONCILIATION RECORDS
CREATE TABLE IF NOT EXISTS public.reconciliation_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reconciliation_id text NOT NULL UNIQUE, -- 'EKA-REC-XXXXXXXX'
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  provider text NOT NULL DEFAULT 'razorpay',
  total_provider_collected_minor bigint NOT NULL,
  total_ledger_collected_minor bigint NOT NULL,
  discrepancy_amount_minor bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'MATCHED' CHECK (status IN ('MATCHED', 'MISMATCH', 'RESOLVED')),
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  reconciled_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reconciliation_rec_id ON public.reconciliation_records(reconciliation_id);
CREATE INDEX IF NOT EXISTS idx_reconciliation_status ON public.reconciliation_records(status);

-- 16. WEBHOOK EVENTS (Idempotent Raw Ingestion)
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL UNIQUE,
  provider text NOT NULL DEFAULT 'razorpay',
  event_type text NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  status text NOT NULL DEFAULT 'RECEIVED' CHECK (
    status IN ('RECEIVED', 'PROCESSING', 'PROCESSED', 'FAILED', 'DUPLICATE', 'IGNORED')
  ),
  retry_count integer NOT NULL DEFAULT 0,
  payload_hash text NOT NULL,
  raw_payload jsonb NOT NULL,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhook_event_id ON public.webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_status ON public.webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_webhook_hash ON public.webhook_events(payload_hash);

-- 17. FINANCIAL & OPERATIONAL AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id text NOT NULL UNIQUE, -- 'EKA-AUD-XXXXXXXX'
  actor_id text NOT NULL,
  actor_type text NOT NULL CHECK (actor_type IN ('user', 'system', 'admin', 'webhook')),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  prev_state jsonb,
  new_state jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_audit_id ON public.audit_logs(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- 18. ROW LEVEL SECURITY POLICIES
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reconciliation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Creators RLS: creator reads own profile, admin reads all
DROP POLICY IF EXISTS "creators_select_own_or_admin" ON public.creators;
CREATE POLICY "creators_select_own_or_admin" ON public.creators
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "creators_update_own" ON public.creators;
CREATE POLICY "creators_update_own" ON public.creators
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Subscription plans: public read
DROP POLICY IF EXISTS "plans_select_all" ON public.subscription_plans;
CREATE POLICY "plans_select_all" ON public.subscription_plans
  FOR SELECT TO authenticated, anon
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

-- Orders RLS: user reads own orders
DROP POLICY IF EXISTS "orders_select_own_or_admin" ON public.orders;
CREATE POLICY "orders_select_own_or_admin" ON public.orders
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Creator earnings RLS: creator reads own earnings
DROP POLICY IF EXISTS "creator_earnings_select_own" ON public.creator_earnings;
CREATE POLICY "creator_earnings_select_own" ON public.creator_earnings
  FOR SELECT TO authenticated
  USING (
    creator_id IN (SELECT id FROM public.creators WHERE user_id = auth.uid()) 
    OR public.has_role(auth.uid(), 'admin')
  );

-- Creator payouts RLS: creator reads own payouts
DROP POLICY IF EXISTS "creator_payouts_select_own" ON public.creator_payouts;
CREATE POLICY "creator_payouts_select_own" ON public.creator_payouts
  FOR SELECT TO authenticated
  USING (
    creator_id IN (SELECT id FROM public.creators WHERE user_id = auth.uid()) 
    OR public.has_role(auth.uid(), 'admin')
  );

-- Service role bypass policies for financial services
CREATE POLICY "service_role_all_creators" ON public.creators FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_brands" ON public.brands FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_customers" ON public.customers FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_payment_customers" ON public.payment_customers FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_orders" ON public.orders FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_payments" ON public.payments FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_refunds" ON public.refunds FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_creator_earnings" ON public.creator_earnings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_creator_payouts" ON public.creator_payouts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_platform_fees" ON public.platform_fees FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_tax_records" ON public.tax_records FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_reconciliation" ON public.reconciliation_records FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_webhook_events" ON public.webhook_events FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_audit_logs" ON public.audit_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
