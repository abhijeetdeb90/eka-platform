-- Bring older EKA environments up to the current security baseline.
-- Additive, data-preserving hardening: tighten existing policies, remove direct client
-- grants from internal tables, and hide exposed SECURITY DEFINER implementations.
-- Keep this migration idempotent so it is safe after the equivalent production fixes.

-- 1. Make UPDATE checks match the intended row-ownership checks.
ALTER POLICY communities_update ON public.communities
  WITH CHECK (
    auth.uid() = created_by
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
    OR public.has_role(auth.uid(), 'moderator'::public.app_role)
  );

ALTER POLICY reports_update ON public.content_reports
  WITH CHECK (
    public.has_role(auth.uid(), 'moderator'::public.app_role)
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  );

ALTER POLICY comments_update ON public.post_comments
  WITH CHECK (
    public.has_role(auth.uid(), 'moderator'::public.app_role)
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  );

ALTER POLICY posts_update ON public.posts
  WITH CHECK (
    auth.uid() = author_id
    OR public.has_role(auth.uid(), 'moderator'::public.app_role)
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  );

ALTER POLICY "Admins can manage translations" ON public.cultural_translations
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY qee_insert_auth ON public.qualified_engagement_events
  WITH CHECK (
    (user_id IS NULL OR user_id = auth.uid())
    AND dwell_time_seconds BETWEEN 0 AND 86400
    AND scroll_depth_percent BETWEEN 0 AND 100
    AND fraud_score BETWEEN 0 AND 1
  );

-- Public object URLs continue to work for a public bucket without a public object-list policy.
DROP POLICY IF EXISTS post_media_public_read ON storage.objects;
DROP POLICY IF EXISTS post_media_read ON storage.objects;

-- 2. Pin search_path for helper functions.
ALTER FUNCTION public.appreciation_weight(text) SET search_path = '';
ALTER FUNCTION public.is_admin_or_founder() SET search_path = '';
ALTER FUNCTION public.is_studio_editor() SET search_path = '';
ALTER FUNCTION public.is_community_moderator(uuid, uuid) SET search_path = '';

-- Trigger functions execute through their triggers; client RPC execute is not needed.
REVOKE EXECUTE ON FUNCTION public.log_incident_created() FROM PUBLIC, anon, authenticated;
DO $optional_trigger$
BEGIN
  IF to_regprocedure('public.rls_auto_enable()') IS NOT NULL THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated';
  END IF;
END
$optional_trigger$;

-- Restrict helper RPCs that reveal internal authorization state or private activity.
REVOKE EXECUTE ON FUNCTION public.is_admin_or_founder() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin_or_founder() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.is_studio_editor() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_studio_editor() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.is_community_moderator(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_community_moderator(uuid, uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.has_step_up() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_step_up() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.creator_score_breakdown(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.creator_score_breakdown(uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.review_trust_incident(uuid, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_trust_incident(uuid, text, text, text) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.my_wisdom_passport() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_wisdom_passport() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.block_closed_period() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.wisdom_passport_for(uuid) FROM PUBLIC, anon, authenticated;

-- 3. Internal tables must not be directly exposed through the Supabase Data API.
-- The false policy is retained as a second line of defense if RLS is enabled later.
DO $deny_client_tables$
DECLARE
  t text;
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
    EXECUTE format('DROP POLICY IF EXISTS security_audit_deny_client_access ON public.%I', t);
    EXECUTE format(
      'CREATE POLICY security_audit_deny_client_access ON public.%I AS PERMISSIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false)',
      t
    );
  END LOOP;
END
$deny_client_tables$;

-- 4. Move exposed SECURITY DEFINER implementations out of the API schema while
-- keeping SECURITY INVOKER wrappers at the original signatures for compatibility.
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

DO $secure_definers$
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
           p.prokind
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
$secure_definers$;
