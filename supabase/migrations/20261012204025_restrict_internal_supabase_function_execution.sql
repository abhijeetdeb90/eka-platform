-- Close two additional unnecessary client RPC execution grants.
REVOKE EXECUTE ON FUNCTION public.my_wisdom_passport() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_wisdom_passport() TO authenticated;

-- Trigger functions execute through their triggers; clients do not need EXECUTE grants.
REVOKE EXECUTE ON FUNCTION public.block_closed_period() FROM PUBLIC, anon, authenticated;
