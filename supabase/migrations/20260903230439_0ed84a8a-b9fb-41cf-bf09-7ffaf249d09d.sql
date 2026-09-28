-- ============================================================ platform config
CREATE TABLE public.platform_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  label text NOT NULL,
  description text NOT NULL DEFAULT '',
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.platform_config TO anon, authenticated;
GRANT INSERT, UPDATE ON public.platform_config TO authenticated;
GRANT ALL ON public.platform_config TO service_role;
ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY platform_config_read ON public.platform_config FOR SELECT USING (true);
CREATE POLICY platform_config_write ON public.platform_config FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY platform_config_insert ON public.platform_config FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER platform_config_updated_at BEFORE UPDATE ON public.platform_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.platform_config_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  old_value jsonb,
  new_value jsonb NOT NULL,
  changed_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.platform_config_changes TO authenticated;
GRANT ALL ON public.platform_config_changes TO service_role;
ALTER TABLE public.platform_config_changes ENABLE ROW LEVEL SECURITY;
CREATE POLICY platform_config_changes_admin ON public.platform_config_changes FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.log_config_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.platform_config_changes (key, old_value, new_value, changed_by)
  VALUES (NEW.key, OLD.value, NEW.value, auth.uid());
  NEW.updated_by := auth.uid();
  RETURN NEW;
END; $$;
CREATE TRIGGER platform_config_history BEFORE UPDATE ON public.platform_config
  FOR EACH ROW WHEN (OLD.value IS DISTINCT FROM NEW.value) EXECUTE FUNCTION public.log_config_change();

INSERT INTO public.platform_config (key, value, label, description) VALUES
  ('platform_fee_percent', '10'::jsonb, 'EKA platform fee',
   'Percent taken on services, paid conversations, creator memberships and gratitude. Always shown before payment.'),
  ('fee_allocation', '[{"key":"Platform operations","percent":45,"body":"Hosting, delivery, payments and the people who keep EKA running."},{"key":"Trust & Safety","percent":20,"body":"Human review, appeals and the moderation queue."},{"key":"Peace & Knowledge Fund","percent":20,"body":"Interfaith education, cultural preservation, minority-language work."},{"key":"Community projects","percent":15,"body":"Grants to circles doing real-world work."}]'::jsonb,
   'How EKA spends its own fee', 'Percentages of EKA''s fee, never of a creator''s earnings. Must total 100.'),
  ('score_weights', '[{"key":"quality","label":"Quality","percent":35,"detail":"Member ratings, meaningful feedback, people who come back."},{"key":"completion","label":"Completion","percent":25,"detail":"Sessions actually completed, low cancellation, reliable delivery."},{"key":"trust","label":"Trust","percent":20,"detail":"Verified identity and credentials, community conduct, few upheld complaints."},{"key":"cross","label":"Cross-community reach","percent":20,"detail":"Helping people meet other traditions, and contributing constructively there."}]'::jsonb,
   'Creator Score weighting', 'How the four components combine into a score out of 1000. Must total 100.'),
  ('payout_review_threshold_cents', '500000'::jsonb, 'Payout review threshold',
   'Payouts at or above this amount are flagged for a person to review before release.'),
  ('payout_holdback_days', '7'::jsonb, 'Payout holdback window',
   'Earnings younger than this many days are not yet available to withdraw.'),
  ('pool_funding_percent_of_profit', '0'::jsonb, 'Creator Pool funding',
   'Share of EKA profit set aside for the Creator Pool each period. Zero until the business adopts a figure.');

-- ============================================================ payout requests
CREATE TABLE public.payout_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_cents integer NOT NULL CHECK (amount_cents > 0),
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected','paid','refunded')),
  risk_flags text[] NOT NULL DEFAULT '{}',
  note text,
  review_note text,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.payout_requests TO authenticated;
GRANT UPDATE ON public.payout_requests TO authenticated;
GRANT ALL ON public.payout_requests TO service_role;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY payout_requests_own_read ON public.payout_requests FOR SELECT TO authenticated
  USING (creator_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY payout_requests_own_insert ON public.payout_requests FOR INSERT TO authenticated
  WITH CHECK (creator_id = auth.uid());
CREATE POLICY payout_requests_admin_update ON public.payout_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER payout_requests_updated_at BEFORE UPDATE ON public.payout_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ======================================================= creator score events
CREATE TABLE public.creator_score_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  component text NOT NULL CHECK (component IN ('quality','completion','trust','cross')),
  delta integer NOT NULL DEFAULT 0,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.creator_score_events TO authenticated;
GRANT ALL ON public.creator_score_events TO service_role;
ALTER TABLE public.creator_score_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY creator_score_events_own ON public.creator_score_events FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- ============================================================== creator pool
CREATE TABLE public.creator_pool_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period text NOT NULL UNIQUE,
  pool_cents integer NOT NULL DEFAULT 0 CHECK (pool_cents >= 0),
  currency text NOT NULL DEFAULT 'INR',
  funding_source text NOT NULL DEFAULT 'A share of EKA profit, plus a growth budget.',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','preview','published')),
  published_at timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.creator_pool_periods TO authenticated;
GRANT INSERT, UPDATE ON public.creator_pool_periods TO authenticated;
GRANT ALL ON public.creator_pool_periods TO service_role;
ALTER TABLE public.creator_pool_periods ENABLE ROW LEVEL SECURITY;
CREATE POLICY pool_periods_read ON public.creator_pool_periods FOR SELECT TO authenticated
  USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY pool_periods_admin_insert ON public.creator_pool_periods FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY pool_periods_admin_update ON public.creator_pool_periods FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER pool_periods_updated_at BEFORE UPDATE ON public.creator_pool_periods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.pool_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id uuid NOT NULL REFERENCES public.creator_pool_periods(id) ON DELETE CASCADE,
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  share numeric NOT NULL DEFAULT 0,
  amount_cents integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'preview' CHECK (status IN ('preview','published','paid')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (period_id, creator_id)
);
GRANT SELECT ON public.pool_allocations TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.pool_allocations TO authenticated;
GRANT ALL ON public.pool_allocations TO service_role;
ALTER TABLE public.pool_allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY pool_allocations_read ON public.pool_allocations FOR SELECT TO authenticated
  USING ((creator_id = auth.uid() AND status <> 'preview') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY pool_allocations_admin_write ON public.pool_allocations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================== practitioner verification --
ALTER TABLE public.practitioners
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'unsubmitted'
    CHECK (verification_status IN ('unsubmitted','submitted','in_review','approved','rejected')),
  ADD COLUMN IF NOT EXISTS verification_note text,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS top_rated boolean NOT NULL DEFAULT false;

DROP POLICY IF EXISTS practitioners_admin_update ON public.practitioners;
CREATE POLICY practitioners_admin_update ON public.practitioners FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================== functions --
CREATE OR REPLACE FUNCTION public.available_payout_cents(_uid uuid)
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT GREATEST(
    COALESCE((
      SELECT sum(t.amount_cents - t.fee_cents)
      FROM public.wallet_transactions t
      WHERE t.user_id = _uid
        AND t.amount_cents > 0
        AND t.kind <> 'topup'
        AND t.created_at < now() - (
          COALESCE((SELECT (value #>> '{}')::int FROM public.platform_config WHERE key = 'payout_holdback_days'), 7)
          || ' days')::interval
    ), 0)
    - COALESCE((
      SELECT sum(p.amount_cents) FROM public.payout_requests p
      WHERE p.creator_id = _uid AND p.status IN ('pending','approved','paid')
    ), 0), 0)::integer;
$$;

CREATE OR REPLACE FUNCTION public.request_payout(_amount_cents integer, _note text DEFAULT NULL)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  _uid uuid := auth.uid();
  _available integer;
  _threshold integer;
  _flags text[] := '{}';
  _id uuid;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  IF _amount_cents IS NULL OR _amount_cents <= 0 THEN RAISE EXCEPTION 'Enter an amount above zero.'; END IF;

  _available := public.available_payout_cents(_uid);
  IF _amount_cents > _available THEN
    RAISE EXCEPTION 'That is more than your available balance.';
  END IF;

  SELECT COALESCE((value #>> '{}')::int, 500000) INTO _threshold
  FROM public.platform_config WHERE key = 'payout_review_threshold_cents';

  IF _amount_cents >= _threshold THEN _flags := array_append(_flags, 'large_amount'); END IF;
  IF NOT EXISTS (SELECT 1 FROM public.practitioners WHERE user_id = _uid AND identity_verified) THEN
    _flags := array_append(_flags, 'identity_unverified');
  END IF;
  IF EXISTS (SELECT 1 FROM public.user_restrictions WHERE user_id = _uid AND lifted_at IS NULL) THEN
    _flags := array_append(_flags, 'active_restriction');
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.payout_requests
    WHERE creator_id = _uid AND created_at > now() - interval '24 hours'
  ) THEN
    _flags := array_append(_flags, 'repeat_request_24h');
  END IF;

  INSERT INTO public.payout_requests (creator_id, amount_cents, note, risk_flags)
  VALUES (_uid, _amount_cents, _note, _flags)
  RETURNING id INTO _id;
  RETURN _id;
END; $$;

CREATE OR REPLACE FUNCTION public.review_payout(_id uuid, _status text, _note text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _current text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Admins only'; END IF;
  IF _status NOT IN ('approved','rejected','paid','refunded') THEN RAISE EXCEPTION 'Unknown payout state'; END IF;

  SELECT status INTO _current FROM public.payout_requests WHERE id = _id;
  IF _current IS NULL THEN RAISE EXCEPTION 'No such payout request'; END IF;
  IF _current IN ('rejected','refunded') THEN RAISE EXCEPTION 'That request is already closed.'; END IF;
  IF _status = 'paid' AND _current <> 'approved' THEN RAISE EXCEPTION 'Approve the payout before marking it paid.'; END IF;

  UPDATE public.payout_requests
  SET status = _status,
      review_note = COALESCE(_note, review_note),
      reviewed_by = auth.uid(),
      reviewed_at = now(),
      paid_at = CASE WHEN _status = 'paid' THEN now() ELSE paid_at END
  WHERE id = _id;

  IF _status = 'paid' THEN
    INSERT INTO public.wallet_transactions (user_id, kind, amount_cents, fee_cents, status, reference_kind, reference_id, note)
    SELECT creator_id, 'payout', -amount_cents, 0, 'complete', 'payout', id, 'Payout released'
    FROM public.payout_requests WHERE id = _id;
    UPDATE public.wallets w SET balance_cents = w.balance_cents - p.amount_cents, updated_at = now()
    FROM public.payout_requests p WHERE p.id = _id AND w.user_id = p.creator_id;
  END IF;
END; $$;

CREATE OR REPLACE FUNCTION public.review_practitioner(
  _id uuid, _status text, _identity boolean, _credentials boolean, _experience boolean, _note text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Admins only'; END IF;
  IF _status NOT IN ('submitted','in_review','approved','rejected') THEN RAISE EXCEPTION 'Unknown review state'; END IF;

  UPDATE public.practitioners
  SET verification_status = _status,
      identity_verified = _identity,
      credentials_verified = _credentials,
      experience_verified = _experience,
      eka_recommended = (_status = 'approved' AND _identity AND _credentials AND _experience),
      top_rated = (rating >= 4.8 AND review_count >= 10),
      status = CASE WHEN _status = 'approved' THEN 'active' WHEN _status = 'rejected' THEN 'rejected' ELSE status END,
      verification_note = _note,
      reviewed_by = auth.uid(),
      reviewed_at = now()
  WHERE id = _id;
END; $$;