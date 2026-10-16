-- Defense in depth for server-owned tables whose client grants were revoked
-- by 20261016120000_security_parity_and_client_access_lockdown.sql.
-- No user policies are created intentionally: browser roles must not access these tables.
ALTER TABLE public.ai_agent_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_object_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_user_roles ENABLE ROW LEVEL SECURITY;

-- Storage ID generation should not resolve objects through a caller-controlled search_path.
DO $pin_storage_function$
BEGIN
  IF to_regprocedure('public.generate_eka_storage_id(text)') IS NOT NULL THEN
    EXECUTE 'ALTER FUNCTION public.generate_eka_storage_id(text) SET search_path = ''''';
  END IF;
END
$pin_storage_function$;
