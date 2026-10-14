-- ============================================================================
-- EKA+ Creator Studio & Performance Telemetry
-- Migration: 20261014130000_eka_creator_studio_views.sql
-- 
-- SUMMARY:
-- 1. Creates public.post_views to record authentic post view events.
-- 2. Configures strict Row Level Security (RLS) so creators can only read views
--    for posts they authored, preventing cross-creator data leakage.
-- 3. Adds indexes for fast date-range and post-level performance aggregation.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  viewer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexing for fast queries by post and date range
CREATE INDEX IF NOT EXISTS post_views_post_id_idx ON public.post_views (post_id);
CREATE INDEX IF NOT EXISTS post_views_created_at_idx ON public.post_views (created_at DESC);
CREATE INDEX IF NOT EXISTS post_views_post_created_idx ON public.post_views (post_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

-- Allow anonymous or authenticated clients to log views (fire-and-forget ingestion)
CREATE POLICY "post_views_insert_all"
  ON public.post_views
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Creators can ONLY select views belonging to their own authored posts
-- Admins can view for moderation and platform integrity
CREATE POLICY "post_views_creator_select"
  ON public.post_views
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = post_views.post_id
        AND posts.author_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
  );

COMMENT ON TABLE public.post_views IS 'Authentic post view telemetry for EKA+ Creator Studio analytics.';
