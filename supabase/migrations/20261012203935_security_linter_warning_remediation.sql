-- EKA Supabase security-warning remediation
-- Restrict UPDATE policies to the same rows/roles allowed by USING.
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

-- Translation management is admin-only.
ALTER POLICY "Admins can manage translations" ON public.cultural_translations
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Preserve anonymous engagement capture while rejecting mismatched user IDs and invalid metrics.
ALTER POLICY qee_insert_auth ON public.qualified_engagement_events
  WITH CHECK (
    (user_id IS NULL OR user_id = auth.uid())
    AND dwell_time_seconds BETWEEN 0 AND 86400
    AND scroll_depth_percent BETWEEN 0 AND 100
    AND fraud_score BETWEEN 0 AND 1
  );

-- Public buckets allow direct object reads; broad SELECT policies are unnecessary and allow listing.
DROP POLICY IF EXISTS post_media_public_read ON storage.objects;
DROP POLICY IF EXISTS post_media_read ON storage.objects;

-- Pin search_path for the functions identified by the linter.
ALTER FUNCTION public.appreciation_weight(text) SET search_path = '';
ALTER FUNCTION public.is_admin_or_founder() SET search_path = '';
ALTER FUNCTION public.is_studio_editor() SET search_path = '';
ALTER FUNCTION public.is_community_moderator(uuid, uuid) SET search_path = '';

-- Trigger/event-trigger functions are not client RPC endpoints.
REVOKE EXECUTE ON FUNCTION public.log_incident_created() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;

-- Restrict helper functions that reveal internal role or authorization state.
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

-- Internal helper returns private user activity; public-facing passport functions call it as SECURITY DEFINER.
REVOKE EXECUTE ON FUNCTION public.wisdom_passport_for(uuid) FROM PUBLIC, anon, authenticated;
