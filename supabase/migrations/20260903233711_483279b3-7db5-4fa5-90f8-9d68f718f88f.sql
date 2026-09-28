ALTER TABLE public.finance_expenses
  ADD COLUMN IF NOT EXISTS bucket text NOT NULL DEFAULT 'operations',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'paid',
  ADD COLUMN IF NOT EXISTS payment_date date,
  ADD COLUMN IF NOT EXISTS reference text;

ALTER TABLE public.finance_distributions
  ADD COLUMN IF NOT EXISTS recipient_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS recipient_name text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS payment_date date,
  ADD COLUMN IF NOT EXISTS reference text,
  ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz;

ALTER TABLE public.ledger_entries
  ADD COLUMN IF NOT EXISTS chargeback_amount bigint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_test_transaction boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'service';

ALTER TABLE public.pool_allocations
  ADD COLUMN IF NOT EXISTS pool_percentage numeric(6,3),
  ADD COLUMN IF NOT EXISTS source_profit_period date,
  ADD COLUMN IF NOT EXISTS distributed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS distributed_at timestamptz;

INSERT INTO public.platform_config (key, value, label, description) VALUES
  ('target_monthly_gmv_cents', '10000000000'::jsonb, 'Monthly GMV target', 'Founder target for creator transaction value each month.'),
  ('target_monthly_revenue_cents', '1000000000'::jsonb, 'Monthly revenue target', 'Founder target for EKA platform revenue each month.'),
  ('target_operating_margin_percent', '25'::jsonb, 'Operating margin target', 'Target operating profit as a share of net EKA revenue.'),
  ('target_monthly_profit_cents', '250000000'::jsonb, 'Monthly operating profit target', 'Founder target for operating profit each month.'),
  ('reserve_months_of_costs', '3'::jsonb, 'Cash reserve target (months)', 'Months of average operating costs EKA aims to keep in reserve.'),
  ('alert_min_operating_margin', '15'::jsonb, 'Alert — minimum operating margin %', 'Raise an alert when operating margin falls below this.'),
  ('alert_min_contribution_margin', '70'::jsonb, 'Alert — minimum contribution margin %', 'Raise an alert when contribution margin falls below this.'),
  ('alert_max_refund_rate', '5'::jsonb, 'Alert — maximum refund rate %', 'Raise an alert when refunds exceed this share of GMV.'),
  ('alert_max_chargeback_rate', '1'::jsonb, 'Alert — maximum chargeback rate %', 'Raise an alert when chargebacks exceed this share of GMV.'),
  ('alert_max_revenue_concentration', '40'::jsonb, 'Alert — maximum revenue concentration %', 'Raise an alert when the top 10 creators exceed this share of revenue.'),
  ('variable_cost_per_transaction_cents', '0'::jsonb, 'Variable cost per transaction', 'Estimated variable support/moderation cost carried by each transaction.')
ON CONFLICT (key) DO NOTHING;

-- one authoritative calculation for the whole dashboard
CREATE OR REPLACE FUNCTION public.eka_economics(_from date, _to date)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  r jsonb;
  _hi timestamptz := (_to + 1)::timestamptz;
  _lo timestamptz := _from::timestamptz;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admins only';
  END IF;

  WITH led AS (
    SELECT * FROM public.ledger_entries
    WHERE created_at >= _lo AND created_at < _hi AND NOT is_test_transaction
  ),
  totals AS (
    SELECT
      COALESCE(sum(gross_creator_amount) FILTER (WHERE entry_kind = 'sale'), 0)::bigint AS gmv,
      COALESCE(sum(eka_gross_fee) FILTER (WHERE entry_kind = 'sale'), 0)::bigint AS gross_revenue,
      COALESCE(sum(refund_amount), 0)::bigint AS refunds,
      COALESCE(sum(chargeback_amount), 0)::bigint AS chargebacks,
      COALESCE(sum(payment_processing_cost), 0)::bigint AS processing,
      COALESCE(sum(operations_allocation), 0)::bigint AS b_ops,
      COALESCE(sum(trust_safety_allocation), 0)::bigint AS b_trust,
      COALESCE(sum(peace_knowledge_allocation), 0)::bigint AS b_peace,
      COALESCE(sum(community_allocation), 0)::bigint AS b_community,
      COALESCE(sum(retained_earnings_allocation), 0)::bigint AS b_retained,
      count(*) FILTER (WHERE entry_kind = 'sale')::int AS transactions,
      count(DISTINCT creator_id) FILTER (WHERE entry_kind = 'sale')::int AS creators,
      count(DISTINCT member_id) FILTER (WHERE entry_kind = 'sale')::int AS members
    FROM led
  ),
  by_category AS (
    SELECT jsonb_agg(x ORDER BY x->>'category') AS rows FROM (
      SELECT jsonb_build_object(
        'category', category,
        'gmv', COALESCE(sum(gross_creator_amount), 0),
        'fees', COALESCE(sum(eka_gross_fee), 0),
        'transactions', count(*)
      ) AS x
      FROM led WHERE entry_kind = 'sale' GROUP BY category
    ) q
  ),
  top_creators AS (
    SELECT COALESCE(sum(fees), 0)::bigint AS top10_fees FROM (
      SELECT sum(eka_gross_fee) AS fees FROM led WHERE entry_kind = 'sale' AND creator_id IS NOT NULL
      GROUP BY creator_id ORDER BY 1 DESC LIMIT 10
    ) t
  ),
  costs AS (
    SELECT
      COALESCE(sum(amount_cents) FILTER (WHERE bucket IN ('operations','trust_safety') AND status = 'paid'), 0)::bigint AS opex_paid,
      COALESCE(sum(amount_cents) FILTER (WHERE bucket IN ('mission','community') AND status = 'paid'), 0)::bigint AS mission_paid,
      COALESCE(sum(amount_cents) FILTER (WHERE bucket IN ('mission','community') AND status IN ('committed','approved')), 0)::bigint AS mission_committed,
      COALESCE(sum(amount_cents) FILTER (WHERE bucket = 'operations' AND status = 'paid'), 0)::bigint AS c_ops,
      COALESCE(sum(amount_cents) FILTER (WHERE bucket = 'trust_safety' AND status = 'paid'), 0)::bigint AS c_trust,
      COALESCE(sum(amount_cents) FILTER (WHERE bucket = 'mission' AND status = 'paid'), 0)::bigint AS c_peace,
      COALESCE(sum(amount_cents) FILTER (WHERE bucket = 'community' AND status = 'paid'), 0)::bigint AS c_community
    FROM public.finance_expenses
    WHERE period >= _from AND period <= _to AND status <> 'cancelled'
  ),
  dist AS (
    SELECT
      COALESCE(sum(amount_cents) FILTER (WHERE kind = 'creator_pool' AND status IN ('approved','paid')), 0)::bigint AS pool,
      COALESCE(sum(amount_cents) FILTER (WHERE kind = 'founder_compensation' AND status IN ('approved','paid')), 0)::bigint AS founder,
      COALESCE(sum(amount_cents) FILTER (WHERE kind = 'founder_compensation' AND status = 'paid'), 0)::bigint AS founder_paid,
      COALESCE(sum(amount_cents) FILTER (WHERE kind = 'owner_distribution' AND status IN ('approved','paid')), 0)::bigint AS owner,
      COALESCE(sum(amount_cents) FILTER (WHERE kind = 'owner_distribution' AND status = 'paid'), 0)::bigint AS owner_paid,
      COALESCE(sum(amount_cents) FILTER (WHERE kind = 'reinvestment' AND status IN ('approved','paid')), 0)::bigint AS reinvestment
    FROM public.finance_distributions
    WHERE period >= _from AND period <= _to AND status <> 'cancelled'
  ),
  liability AS (
    SELECT
      COALESCE((SELECT sum(gross_creator_amount) FROM public.ledger_entries WHERE NOT is_test_transaction), 0)::bigint AS earned_all_time,
      COALESCE((SELECT sum(amount_cents) FROM public.payout_requests WHERE status = 'paid'), 0)::bigint AS paid_out,
      COALESCE((SELECT sum(amount_cents) FROM public.payout_requests WHERE status IN ('pending','approved')), 0)::bigint AS pending_payouts
  ),
  cash AS (
    SELECT COALESCE((SELECT cash_balance_cents FROM public.finance_periods
                     WHERE period <= date_trunc('month', _to)::date ORDER BY period DESC LIMIT 1), 0)::bigint AS balance,
           EXISTS (SELECT 1 FROM public.finance_periods WHERE cash_balance_cents <> 0) AS connected
  ),
  cfg AS (
    SELECT jsonb_object_agg(key, value) AS map FROM public.platform_config
  )
  SELECT jsonb_build_object(
    'from', _from, 'to', _to,
    'gmv', t.gmv,
    'gross_revenue', t.gross_revenue,
    'refunds', t.refunds,
    'chargebacks', t.chargebacks,
    'processing_costs', t.processing,
    'net_revenue', t.gross_revenue - t.refunds - t.chargebacks,
    'transactions', t.transactions,
    'active_creators', t.creators,
    'paying_members', t.members,
    'budget', jsonb_build_object('operations', t.b_ops, 'trust_safety', t.b_trust,
      'peace_knowledge', t.b_peace, 'community', t.b_community, 'retained', t.b_retained),
    'actual_costs', jsonb_build_object('operations', c.c_ops, 'trust_safety', c.c_trust,
      'peace_knowledge', c.c_peace, 'community', c.c_community),
    'operating_expenses', c.opex_paid,
    'mission_spend', c.mission_paid,
    'mission_committed', c.mission_committed,
    'operating_profit', (t.gross_revenue - t.refunds - t.chargebacks) - c.opex_paid - c.mission_paid,
    'creator_pool', d.pool,
    'founder_compensation', d.founder,
    'founder_compensation_paid', d.founder_paid,
    'owner_distributions', d.owner,
    'owner_distributions_paid', d.owner_paid,
    'reinvestment', d.reinvestment,
    'retained_earnings', (t.gross_revenue - t.refunds - t.chargebacks) - c.opex_paid - c.mission_paid - d.pool - d.founder - d.owner,
    'creator_earned', l.earned_all_time,
    'creator_paid', l.paid_out,
    'creator_pending_payouts', l.pending_payouts,
    'creator_liability', l.earned_all_time - l.paid_out,
    'cash_balance', ca.balance,
    'cash_connected', ca.connected,
    'top10_creator_fees', tc.top10_fees,
    'by_category', COALESCE(bc.rows, '[]'::jsonb),
    'config', cfg.map
  ) INTO r
  FROM totals t, costs c, dist d, liability l, cash ca, top_creators tc, by_category bc, cfg;

  RETURN r;
END; $$;

-- monthly series for trends and the P&L table
CREATE OR REPLACE FUNCTION public.eka_economics_months(_months integer DEFAULT 12)
RETURNS TABLE(period date, data jsonb)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE m date;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Admins only'; END IF;
  FOR m IN
    SELECT date_trunc('month', d)::date
    FROM generate_series(date_trunc('month', current_date) - ((GREATEST(_months,1) - 1) || ' months')::interval,
                         date_trunc('month', current_date), interval '1 month') d
  LOOP
    period := m;
    data := public.eka_economics(m, (m + interval '1 month - 1 day')::date);
    RETURN NEXT;
  END LOOP;
END; $$;