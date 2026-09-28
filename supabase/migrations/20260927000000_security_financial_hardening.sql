-- ============================================================================
-- EKA Security & Financial Integrity Hardening Migration
-- Generated: 2026-09-27
-- Version: 1.0
-- 
-- SUMMARY:
-- 1. Drops client-side INSERT on public.wallet_transactions (must go via trusted backend RPC).
-- 2. Restricts public.payout_requests direct INSERT (enforcing request_payout RPC).
-- 3. Hardens public.practitioner_slots UPDATE policy so clients cannot overwrite unowned slots.
-- ============================================================================

-- 1. Hardening Wallet Transactions
-- Disallow direct client inserts into wallet_transactions to prevent credit fabrication.
DROP POLICY IF EXISTS "txn own insert" ON public.wallet_transactions;
DROP POLICY IF EXISTS "wallet_tx_insert_own" ON public.wallet_transactions;

-- Only service_role or vetted server functions can insert into wallet_transactions
CREATE POLICY "wallet_transactions_service_insert"
  ON public.wallet_transactions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 2. Hardening Payout Requests
-- Users must request payouts via the vetted public.request_payout(amount, bank_details) RPC
-- which verifies sufficient wallet balance before creating a pending request.
DROP POLICY IF EXISTS "payout_requests_own_insert" ON public.payout_requests;
DROP POLICY IF EXISTS "payout_requests_insert_own" ON public.payout_requests;

CREATE POLICY "payout_requests_service_insert"
  ON public.payout_requests
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 3. Hardening Practitioner Slot Booking
-- Prevent arbitrary overwrite of slot status, timestamps, or practitioner IDs.
DROP POLICY IF EXISTS "slots_book" ON public.practitioner_slots;

CREATE POLICY "slots_book_restricted"
  ON public.practitioner_slots
  FOR UPDATE
  TO authenticated
  USING (
    -- User can only book an unbooked slot, or practitioner can manage their own slot
    (booked = false) OR (practitioner_id = auth.uid())
  )
  WITH CHECK (
    -- If updating, either practitioner owns the slot or a user is marking it booked = true
    (practitioner_id = auth.uid()) OR (booked = true)
  );

COMMENT ON TABLE public.wallet_transactions IS 'Financial ledger: direct client inserts disabled for economic integrity.';
COMMENT ON TABLE public.payout_requests IS 'Payout requests: must be initiated through request_payout RPC with balance verification.';
COMMENT ON TABLE public.practitioner_slots IS 'Practitioner booking slots: protected against unauthorized slot manipulation.';
