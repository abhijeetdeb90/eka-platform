-- EKA security audit hardening:
-- 1) Hide privileged SECURITY DEFINER implementations in a non-API schema.
-- 2) Keep public RPC signatures as SECURITY INVOKER wrappers so existing callers remain compatible.
-- 3) Explicitly deny client access to protected RLS tables that intentionally have no user-facing policies.

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

DO $audit$
DECLARE
  f record;
  arg_call text;
  body_sql text;
  old_anon boolean;
  old_auth boolean;
  wrapper_args text;
  wrapper_result text;
BEGIN
  FOR f IN
    SELECT p.oid,
           n.nspname,
           p.proname,
           pg_get_function_identity_arguments(p.oid) AS identity_args,
           pg_get_function_arguments(p.oid) AS full_args,
           pg_get_function_result(p.oid) AS result_type,
           p.pronargs,
           p.proretset,
           p.prokind,
           p.prosecdef
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prokind = 'f'
      AND p.prosecdef
      AND (
        has_function_privilege('anon', p.oid, 'EXECUTE')
        OR has_function_privilege('authenticated', p.oid, 'EXECUTE')
      )
    ORDER BY p.proname, p.oid
  LOOP
    old_anon := has_function_privilege('anon', f.oid, 'EXECUTE');
    old_auth := has_function_privilege('authenticated', f.oid, 'EXECUTE');

    EXECUTE format(
      'ALTER FUNCTION %I.%I(%s) SET SCHEMA private',
      f.nspname, f.proname, f.identity_args
    );

    EXECUTE format(
      'REVOKE ALL ON FUNCTION private.%I(%s) FROM PUBLIC, anon, authenticated',
      f.proname, f.identity_args
    );
    IF old_anon THEN
      EXECUTE format('GRANT EXECUTE ON FUNCTION private.%I(%s) TO anon', f.proname, f.identity_args);
    END IF;
    IF old_auth THEN
      EXECUTE format('GRANT EXECUTE ON FUNCTION private.%I(%s) TO authenticated', f.proname, f.identity_args);
    END IF;
    EXECUTE format('GRANT EXECUTE ON FUNCTION private.%I(%s) TO service_role', f.proname, f.identity_args);

    wrapper_args := f.full_args;
    wrapper_result := f.result_type;

    IF f.pronargs = 0 THEN
      arg_call := '';
    ELSE
      SELECT string_agg('$' || g.i::text, ', ' ORDER BY g.i)
      INTO arg_call
      FROM generate_series(1, f.pronargs) AS g(i);
    END IF;

    IF f.proretset THEN
      body_sql := format('SELECT * FROM private.%I(%s)', f.proname, arg_call);
    ELSE
      body_sql := format('SELECT private.%I(%s)', f.proname, arg_call);
    END IF;

    EXECUTE format(
      'CREATE FUNCTION public.%I(%s) RETURNS %s LANGUAGE sql SECURITY INVOKER SET search_path = '''' AS %L',
      f.proname, wrapper_args, wrapper_result, body_sql
    );

    EXECUTE format('REVOKE ALL ON FUNCTION public.%I(%s) FROM PUBLIC, anon, authenticated', f.proname, f.identity_args);
    IF old_anon THEN
      EXECUTE format('GRANT EXECUTE ON FUNCTION public.%I(%s) TO anon', f.proname, f.identity_args);
    END IF;
    IF old_auth THEN
      EXECUTE format('GRANT EXECUTE ON FUNCTION public.%I(%s) TO authenticated', f.proname, f.identity_args);
    END IF;
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%I(%s) TO service_role', f.proname, f.identity_args);
  END LOOP;
END
$audit$;

DO $deny$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'ai_agent_configs',
    'billing_events',
    'enterprise_api_keys',
    'enterprise_organizations',
    'enterprise_workspaces',
    'knowledge_disputes',
    'knowledge_object_versions',
    'navigation_menus',
    'studio_user_roles'
  ]
  LOOP
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM PUBLIC, anon, authenticated', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I AS PERMISSIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false)',
      'security_audit_deny_client_access', t
    );
  END LOOP;
END
$deny$;
