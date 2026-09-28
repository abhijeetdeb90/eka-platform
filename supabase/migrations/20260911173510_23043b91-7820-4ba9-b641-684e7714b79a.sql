-- ============ step-up auth helper ============
CREATE OR REPLACE FUNCTION public.has_step_up()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT coalesce(auth.jwt() ->> 'aal', '') = 'aal2' $$;

REVOKE ALL ON FUNCTION public.has_step_up() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_step_up() TO authenticated;

-- ============ payment_orders ============
CREATE TABLE public.payment_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  creator_id uuid,
  provider text NOT NULL DEFAULT 'razorpay',
  provider_order_id text UNIQUE,
  provider_payment_id text UNIQUE,
  idempotency_key text NOT NULL UNIQUE,
  purpose text NOT NULL,
  reference_kind text,
  reference_id text,
  amount_cents bigint NOT NULL CHECK (amount_cents > 0),
  creator_cents bigint NOT NULL DEFAULT 0,
  fee_cents bigint NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'created',
  ledger_entry_id uuid,
  refunded_cents bigint NOT NULL DEFAULT 0,
  failure_reason text,
  settled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.payment_orders TO authenticated;
GRANT ALL ON public.payment_orders TO service_role;
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members read their own payment orders"
ON public.payment_orders FOR SELECT TO authenticated
USING (auth.uid() = user_id OR auth.uid() = creator_id OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER payment_orders_updated_at BEFORE UPDATE ON public.payment_orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX payment_orders_user_idx ON public.payment_orders (user_id, created_at DESC);
CREATE INDEX payment_orders_status_idx ON public.payment_orders (status, created_at DESC);

-- ============ payment_events (provider inbox) ============
CREATE TABLE public.payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL DEFAULT 'razorpay',
  event_id text NOT NULL,
  type text NOT NULL,
  payload jsonb NOT NULL,
  processed_at timestamptz,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, event_id)
);

GRANT ALL ON public.payment_events TO service_role;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read payment events"
ON public.payment_events FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.payment_events TO authenticated;

-- ============ reconciliation exceptions ============
CREATE TABLE public.reconciliation_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL DEFAULT 'razorpay',
  kind text NOT NULL,
  provider_reference text,
  ledger_entry_id uuid,
  payment_order_id uuid REFERENCES public.payment_orders(id) ON DELETE SET NULL,
  expected_cents bigint,
  actual_cents bigint,
  detail text,
  status text NOT NULL DEFAULT 'open',
  resolved_by uuid,
  resolved_at timestamptz,
  resolution_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.reconciliation_exceptions TO authenticated;
GRANT ALL ON public.reconciliation_exceptions TO service_role;
ALTER TABLE public.reconciliation_exceptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read reconciliation exceptions"
ON public.reconciliation_exceptions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins resolve reconciliation exceptions"
ON public.reconciliation_exceptions FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin') AND public.has_step_up())
WITH CHECK (public.has_role(auth.uid(), 'admin') AND public.has_step_up());

CREATE TRIGGER reconciliation_exceptions_updated_at BEFORE UPDATE ON public.reconciliation_exceptions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ payout provider confirmation (additive) ============
ALTER TABLE public.payout_requests
  ADD COLUMN IF NOT EXISTS provider text,
  ADD COLUMN IF NOT EXISTS provider_payout_id text,
  ADD COLUMN IF NOT EXISTS provider_status text,
  ADD COLUMN IF NOT EXISTS provider_failure_reason text,
  ADD COLUMN IF NOT EXISTS reconciled_at timestamptz,
  ADD COLUMN IF NOT EXISTS idempotency_key text;

CREATE UNIQUE INDEX IF NOT EXISTS payout_requests_provider_payout_idx
  ON public.payout_requests (provider_payout_id) WHERE provider_payout_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS payout_requests_idempotency_idx
  ON public.payout_requests (idempotency_key) WHERE idempotency_key IS NOT NULL;

-- ============ settlement (idempotent, server-only) ============
CREATE OR REPLACE FUNCTION public.settle_payment_order(
  _provider_order_id text,
  _provider_payment_id text
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  ord public.payment_orders%ROWTYPE;
  entry_id uuid;
BEGIN
  SELECT * INTO ord FROM public.payment_orders
   WHERE provider_order_id = _provider_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'unknown payment order %', _provider_order_id;
  END IF;

  -- Already settled: return the existing ledger row, never a second one.
  IF ord.status = 'paid' THEN
    RETURN ord.ledger_entry_id;
  END IF;

  IF ord.creator_id IS NOT NULL AND ord.creator_cents > 0 THEN
    entry_id := public.record_ledger_entry(
      ord.creator_id,
      ord.user_id,
      ord.creator_cents,
      ord.fee_cents,
      coalesce(ord.reference_kind, ord.purpose) || ':' || coalesce(ord.reference_id, ord.id::text),
      ord.currency,
      'razorpay ' || _provider_payment_id
    );

    INSERT INTO public.wallet_transactions
      (user_id, counterparty_id, kind, amount_cents, fee_cents, reference_kind, reference_id, status, note)
    VALUES
      (ord.user_id, ord.creator_id, 'purchase', -ord.amount_cents, ord.fee_cents,
       ord.reference_kind, ord.reference_id, 'settled', 'Paid by card/UPI'),
      (ord.creator_id, ord.user_id, 'sale', ord.creator_cents, ord.fee_cents,
       ord.reference_kind, ord.reference_id, 'settled', 'Earned from a member payment');

    UPDATE public.wallets SET balance_cents = balance_cents + ord.creator_cents
     WHERE user_id = ord.creator_id;
    INSERT INTO public.wallets (user_id, balance_cents)
    SELECT ord.creator_id, ord.creator_cents
     WHERE NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = ord.creator_id);
  END IF;

  UPDATE public.payment_orders
     SET status = 'paid',
         provider_payment_id = _provider_payment_id,
         ledger_entry_id = entry_id,
         settled_at = now()
   WHERE id = ord.id;

  RETURN entry_id;
END;
$$;

REVOKE ALL ON FUNCTION public.settle_payment_order(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.settle_payment_order(text, text) FROM authenticated, anon;
GRANT EXECUTE ON FUNCTION public.settle_payment_order(text, text) TO service_role;

-- ============ refunds are reversal rows, never edits ============
CREATE OR REPLACE FUNCTION public.refund_payment_order(
  _provider_payment_id text,
  _amount_cents bigint,
  _note text DEFAULT ''
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  ord public.payment_orders%ROWTYPE;
  reversal uuid;
BEGIN
  SELECT * INTO ord FROM public.payment_orders
   WHERE provider_payment_id = _provider_payment_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'unknown payment %', _provider_payment_id;
  END IF;
  IF ord.refunded_cents >= _amount_cents THEN
    RETURN NULL; -- already recorded
  END IF;

  IF ord.ledger_entry_id IS NOT NULL THEN
    reversal := public.reverse_ledger_entry(ord.ledger_entry_id, coalesce(_note, 'refund'));
  END IF;

  UPDATE public.payment_orders
     SET refunded_cents = _amount_cents,
         status = CASE WHEN _amount_cents >= ord.amount_cents THEN 'refunded' ELSE 'partially_refunded' END
   WHERE id = ord.id;

  RETURN reversal;
END;
$$;

REVOKE ALL ON FUNCTION public.refund_payment_order(text, bigint, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.refund_payment_order(text, bigint, text) FROM authenticated, anon;
GRANT EXECUTE ON FUNCTION public.refund_payment_order(text, bigint, text) TO service_role;

-- ============ mark an order failed (idempotent) ============
CREATE OR REPLACE FUNCTION public.fail_payment_order(_provider_order_id text, _reason text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  UPDATE public.payment_orders
     SET status = 'failed', failure_reason = _reason
   WHERE provider_order_id = _provider_order_id AND status = 'created';
$$;

REVOKE ALL ON FUNCTION public.fail_payment_order(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.fail_payment_order(text, text) FROM authenticated, anon;
GRANT EXECUTE ON FUNCTION public.fail_payment_order(text, text) TO service_role;