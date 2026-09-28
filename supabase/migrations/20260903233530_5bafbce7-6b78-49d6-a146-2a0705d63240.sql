-- 1. new allocation model + pool settings
UPDATE public.platform_config SET value = '[
  {"key":"Platform operations","percent":30,"body":"Hosting, delivery, payments and the people who keep EKA running."},
  {"key":"Trust & Safety","percent":15,"body":"Human review, appeals and the moderation queue."},
  {"key":"Peace & Knowledge Fund","percent":10,"body":"Interfaith education, cultural preservation, minority-language work."},
  {"key":"Community projects","percent":10,"body":"Grants to circles doing real-world work."},
  {"key":"EKA retained earnings","percent":35,"body":"Kept by EKA to fund growth, reserves, future investment, and approved owner compensation or distributions."}
]'::jsonb,
label = 'How EKA''s platform fee is used',
description = 'Budget lines for every ₹100 of EKA platform revenue. These are allocations, not recorded expenses. Must total exactly 100%.'
WHERE key = 'fee_allocation';

INSERT INTO public.platform_config (key, value, label, description) VALUES
  ('creator_pool_enabled', 'true'::jsonb, 'Creator Pool', 'Whether the Creator Pool is currently funded and distributed.'),
  ('creator_pool_percent_of_operating_profit', '10'::jsonb, 'Creator Pool share of operating profit', 'Share of EKA''s operating profit set aside for the Creator Pool. Never taken from creator earnings.'),
  ('pool_min_creator_score', '200'::jsonb, 'Creator Pool — minimum score', 'Lowest Creator Score that qualifies for a Creator Pool share.'),
  ('pool_min_completed_sessions', '3'::jsonb, 'Creator Pool — minimum completed sessions', 'Completed sessions required before a creator qualifies.'),
  ('pool_min_account_age_days', '30'::jsonb, 'Creator Pool — minimum account age (days)', 'How long an account must exist before it qualifies.'),
  ('pool_require_trust_status', 'true'::jsonb, 'Creator Pool — verification required', 'Whether a creator must be verified and free of active restrictions to qualify.')
ON CONFLICT (key) DO NOTHING;

-- 2. append-only transaction ledger
CREATE TABLE public.ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_kind text NOT NULL DEFAULT 'sale',
  reverses_id uuid REFERENCES public.ledger_entries(id) ON DELETE SET NULL,
  transaction_ref text,
  creator_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  member_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  gross_creator_amount bigint NOT NULL DEFAULT 0,
  platform_fee_percentage numeric(6,3) NOT NULL DEFAULT 0,
  eka_gross_fee bigint NOT NULL DEFAULT 0,
  payment_processing_cost bigint NOT NULL DEFAULT 0,
  refund_amount bigint NOT NULL DEFAULT 0,
  creator_net_amount bigint NOT NULL DEFAULT 0,
  operations_allocation bigint NOT NULL DEFAULT 0,
  trust_safety_allocation bigint NOT NULL DEFAULT 0,
  peace_knowledge_allocation bigint NOT NULL DEFAULT 0,
  community_allocation bigint NOT NULL DEFAULT 0,
  retained_earnings_allocation bigint NOT NULL DEFAULT 0,
  creator_pool_allocation bigint NOT NULL DEFAULT 0,
  config_snapshot jsonb,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'settled',
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  settled_at timestamptz
);
CREATE INDEX ledger_entries_creator_idx ON public.ledger_entries (creator_id, created_at DESC);
CREATE INDEX ledger_entries_member_idx ON public.ledger_entries (member_id, created_at DESC);
CREATE INDEX ledger_entries_settled_idx ON public.ledger_entries (settled_at);

GRANT SELECT ON public.ledger_entries TO authenticated;
GRANT ALL ON public.ledger_entries TO service_role;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ledger own side" ON public.ledger_entries FOR SELECT TO authenticated
  USING (creator_id = auth.uid() OR member_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- 3. private finance records
CREATE TABLE public.finance_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period date NOT NULL,
  category text NOT NULL,
  amount_cents bigint NOT NULL,
  note text,
  recorded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.finance_expenses TO authenticated;
GRANT ALL ON public.finance_expenses TO service_role;
ALTER TABLE public.finance_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "finance expenses admin" ON public.finance_expenses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER finance_expenses_updated_at BEFORE UPDATE ON public.finance_expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.finance_distributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period date NOT NULL,
  kind text NOT NULL,
  amount_cents bigint NOT NULL,
  note text,
  recorded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.finance_distributions TO authenticated;
GRANT ALL ON public.finance_distributions TO service_role;
ALTER TABLE public.finance_distributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "finance distributions admin" ON public.finance_distributions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER finance_distributions_updated_at BEFORE UPDATE ON public.finance_distributions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.finance_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period date NOT NULL UNIQUE,
  cash_balance_cents bigint NOT NULL DEFAULT 0,
  closed boolean NOT NULL DEFAULT false,
  closed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  closed_at timestamptz,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.finance_periods TO authenticated;
GRANT ALL ON public.finance_periods TO service_role;
ALTER TABLE public.finance_periods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "finance periods admin" ON public.finance_periods FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER finance_periods_updated_at BEFORE UPDATE ON public.finance_periods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- closed months are immutable: corrections become adjustment rows
CREATE OR REPLACE FUNCTION public.block_closed_period()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.finance_periods p
             WHERE p.period = date_trunc('month', COALESCE(NEW.period, OLD.period))::date AND p.closed) THEN
    RAISE EXCEPTION 'That month is closed. Record an adjustment in an open month instead.';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER finance_expenses_closed BEFORE INSERT OR UPDATE OR DELETE ON public.finance_expenses
  FOR EACH ROW EXECUTE FUNCTION public.block_closed_period();
CREATE TRIGGER finance_distributions_closed BEFORE INSERT OR UPDATE OR DELETE ON public.finance_distributions
  FOR EACH ROW EXECUTE FUNCTION public.block_closed_period();

-- 4. deterministic ledger writer: allocations computed server-side from live config
CREATE OR REPLACE FUNCTION public.record_ledger_entry(
  _creator_id uuid,
  _member_id uuid,
  _gross_creator_amount bigint,
  _eka_gross_fee bigint,
  _transaction_ref text DEFAULT NULL,
  _currency text DEFAULT 'INR',
  _note text DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _alloc jsonb;
  _fee_percent numeric;
  _id uuid;
  _pct numeric;
  _amounts bigint[] := '{}';
  _keys text[] := '{}';
  _running bigint := 0;
  _i int;
  _n int;
  _item jsonb;
  _val bigint;
  _get bigint;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  IF _gross_creator_amount < 0 OR _eka_gross_fee < 0 THEN RAISE EXCEPTION 'Amounts cannot be negative'; END IF;

  SELECT value INTO _alloc FROM public.platform_config WHERE key = 'fee_allocation';
  SELECT (value #>> '{}')::numeric INTO _fee_percent FROM public.platform_config WHERE key = 'platform_fee_percent';

  _n := jsonb_array_length(COALESCE(_alloc, '[]'::jsonb));
  -- largest-remainder-free running split: last bucket absorbs the rounding
  FOR _i IN 0.._n - 1 LOOP
    _item := _alloc -> _i;
    _pct := (_item ->> 'percent')::numeric;
    IF _i = _n - 1 THEN
      _val := _eka_gross_fee - _running;
    ELSE
      _val := floor(_eka_gross_fee * _pct / 100)::bigint;
      _running := _running + _val;
    END IF;
    _keys := array_append(_keys, _item ->> 'key');
    _amounts := array_append(_amounts, _val);
  END LOOP;

  INSERT INTO public.ledger_entries (
    entry_kind, transaction_ref, creator_id, member_id,
    gross_creator_amount, platform_fee_percentage, eka_gross_fee, creator_net_amount,
    operations_allocation, trust_safety_allocation, peace_knowledge_allocation,
    community_allocation, retained_earnings_allocation,
    config_snapshot, currency, status, note, settled_at
  )
  SELECT 'sale', _transaction_ref, _creator_id, _member_id,
    _gross_creator_amount, COALESCE(_fee_percent, 0), _eka_gross_fee, _gross_creator_amount,
    COALESCE((SELECT _amounts[i] FROM generate_subscripts(_keys, 1) i WHERE _keys[i] = 'Platform operations'), 0),
    COALESCE((SELECT _amounts[i] FROM generate_subscripts(_keys, 1) i WHERE _keys[i] = 'Trust & Safety'), 0),
    COALESCE((SELECT _amounts[i] FROM generate_subscripts(_keys, 1) i WHERE _keys[i] = 'Peace & Knowledge Fund'), 0),
    COALESCE((SELECT _amounts[i] FROM generate_subscripts(_keys, 1) i WHERE _keys[i] = 'Community projects'), 0),
    COALESCE((SELECT _amounts[i] FROM generate_subscripts(_keys, 1) i WHERE _keys[i] = 'EKA retained earnings'), 0),
    jsonb_build_object('fee_percent', _fee_percent, 'allocation', _alloc),
    _currency, 'settled', _note, now()
  RETURNING id INTO _id;

  RETURN _id;
END; $$;

-- refunds never mutate history
CREATE OR REPLACE FUNCTION public.reverse_ledger_entry(_id uuid, _note text DEFAULT NULL)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _new uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Admins only'; END IF;
  INSERT INTO public.ledger_entries (
    entry_kind, reverses_id, transaction_ref, creator_id, member_id,
    gross_creator_amount, platform_fee_percentage, eka_gross_fee, payment_processing_cost,
    refund_amount, creator_net_amount,
    operations_allocation, trust_safety_allocation, peace_knowledge_allocation,
    community_allocation, retained_earnings_allocation, creator_pool_allocation,
    config_snapshot, currency, status, note, settled_at
  )
  SELECT 'reversal', e.id, e.transaction_ref, e.creator_id, e.member_id,
    -e.gross_creator_amount, e.platform_fee_percentage, -e.eka_gross_fee, -e.payment_processing_cost,
    e.gross_creator_amount + e.eka_gross_fee, -e.creator_net_amount,
    -e.operations_allocation, -e.trust_safety_allocation, -e.peace_knowledge_allocation,
    -e.community_allocation, -e.retained_earnings_allocation, -e.creator_pool_allocation,
    e.config_snapshot, e.currency, 'reversed', COALESCE(_note, 'Refund / reversal'), now()
  FROM public.ledger_entries e WHERE e.id = _id
  RETURNING id INTO _new;
  IF _new IS NULL THEN RAISE EXCEPTION 'No such ledger entry'; END IF;
  RETURN _new;
END; $$;

-- 5. monthly finance summary (admin only)
CREATE OR REPLACE FUNCTION public.finance_period_summary(_from date, _to date)
RETURNS TABLE(
  period date,
  gmv_cents bigint,
  transactions integer,
  creators_paid integer,
  gross_revenue_cents bigint,
  refunds_cents bigint,
  processing_cents bigint,
  net_revenue_cents bigint,
  operations_budget_cents bigint,
  trust_budget_cents bigint,
  peace_budget_cents bigint,
  community_budget_cents bigint,
  retained_budget_cents bigint,
  actual_expenses_cents bigint,
  mission_spend_cents bigint,
  creator_pool_cents bigint,
  founder_comp_cents bigint,
  owner_distributions_cents bigint,
  cash_balance_cents bigint,
  closed boolean
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH months AS (
    SELECT date_trunc('month', d)::date AS period
    FROM generate_series(date_trunc('month', _from), date_trunc('month', _to), interval '1 month') d
  )
  SELECT m.period,
    COALESCE((SELECT sum(e.gross_creator_amount) FROM public.ledger_entries e WHERE date_trunc('month', e.created_at)::date = m.period), 0)::bigint,
    COALESCE((SELECT count(*) FROM public.ledger_entries e WHERE date_trunc('month', e.created_at)::date = m.period AND e.entry_kind = 'sale'), 0)::int,
    COALESCE((SELECT count(DISTINCT e.creator_id) FROM public.ledger_entries e WHERE date_trunc('month', e.created_at)::date = m.period AND e.entry_kind = 'sale'), 0)::int,
    COALESCE((SELECT sum(e.eka_gross_fee) FROM public.ledger_entries e WHERE date_trunc('month', e.created_at)::date = m.period AND e.entry_kind = 'sale'), 0)::bigint,
    COALESCE((SELECT sum(e.refund_amount) FROM public.ledger_entries e WHERE date_trunc('month', e.created_at)::date = m.period), 0)::bigint,
    COALESCE((SELECT sum(e.payment_processing_cost) FROM public.ledger_entries e WHERE date_trunc('month', e.created_at)::date = m.period), 0)::bigint,
    COALESCE((SELECT sum(e.eka_gross_fee - e.payment_processing_cost) FROM public.ledger_entries e WHERE date_trunc('month', e.created_at)::date = m.period), 0)::bigint,
    COALESCE((SELECT sum(e.operations_allocation) FROM public.ledger_entries e WHERE date_trunc('month', e.created_at)::date = m.period), 0)::bigint,
    COALESCE((SELECT sum(e.trust_safety_allocation) FROM public.ledger_entries e WHERE date_trunc('month', e.created_at)::date = m.period), 0)::bigint,
    COALESCE((SELECT sum(e.peace_knowledge_allocation) FROM public.ledger_entries e WHERE date_trunc('month', e.created_at)::date = m.period), 0)::bigint,
    COALESCE((SELECT sum(e.community_allocation) FROM public.ledger_entries e WHERE date_trunc('month', e.created_at)::date = m.period), 0)::bigint,
    COALESCE((SELECT sum(e.retained_earnings_allocation) FROM public.ledger_entries e WHERE date_trunc('month', e.created_at)::date = m.period), 0)::bigint,
    COALESCE((SELECT sum(x.amount_cents) FROM public.finance_expenses x WHERE date_trunc('month', x.period)::date = m.period AND x.category <> 'mission'), 0)::bigint,
    COALESCE((SELECT sum(x.amount_cents) FROM public.finance_expenses x WHERE date_trunc('month', x.period)::date = m.period AND x.category = 'mission'), 0)::bigint,
    COALESCE((SELECT sum(x.amount_cents) FROM public.finance_distributions x WHERE date_trunc('month', x.period)::date = m.period AND x.kind = 'creator_pool'), 0)::bigint,
    COALESCE((SELECT sum(x.amount_cents) FROM public.finance_distributions x WHERE date_trunc('month', x.period)::date = m.period AND x.kind = 'founder_compensation'), 0)::bigint,
    COALESCE((SELECT sum(x.amount_cents) FROM public.finance_distributions x WHERE date_trunc('month', x.period)::date = m.period AND x.kind = 'owner_distribution'), 0)::bigint,
    COALESCE((SELECT p.cash_balance_cents FROM public.finance_periods p WHERE p.period = m.period), 0)::bigint,
    COALESCE((SELECT p.closed FROM public.finance_periods p WHERE p.period = m.period), false)
  FROM months m
  WHERE public.has_role(auth.uid(), 'admin')
  ORDER BY m.period DESC;
$$;

CREATE OR REPLACE FUNCTION public.close_finance_period(_period date, _cash_balance_cents bigint DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Admins only'; END IF;
  INSERT INTO public.finance_periods (period, cash_balance_cents, closed, closed_by, closed_at)
  VALUES (date_trunc('month', _period)::date, COALESCE(_cash_balance_cents, 0), true, auth.uid(), now())
  ON CONFLICT (period) DO UPDATE
    SET closed = true, closed_by = auth.uid(), closed_at = now(),
        cash_balance_cents = COALESCE(_cash_balance_cents, public.finance_periods.cash_balance_cents);
END; $$;