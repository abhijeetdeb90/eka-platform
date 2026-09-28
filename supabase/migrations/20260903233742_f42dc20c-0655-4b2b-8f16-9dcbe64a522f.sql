REVOKE EXECUTE ON FUNCTION public.eka_economics(date, date) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.eka_economics_months(integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.finance_period_summary(date, date) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.close_finance_period(date, bigint) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.record_ledger_entry(uuid, uuid, bigint, bigint, text, text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.reverse_ledger_entry(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.block_closed_period() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.eka_economics(date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.eka_economics_months(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.finance_period_summary(date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.close_finance_period(date, bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_ledger_entry(uuid, uuid, bigint, bigint, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reverse_ledger_entry(uuid, text) TO authenticated;