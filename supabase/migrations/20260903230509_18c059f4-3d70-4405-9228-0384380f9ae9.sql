REVOKE ALL ON FUNCTION public.log_config_change() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.available_payout_cents(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.request_payout(integer, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.review_payout(uuid, text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.review_practitioner(uuid, text, boolean, boolean, boolean, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.available_payout_cents(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.request_payout(integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.review_payout(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.review_practitioner(uuid, text, boolean, boolean, boolean, text) TO authenticated;