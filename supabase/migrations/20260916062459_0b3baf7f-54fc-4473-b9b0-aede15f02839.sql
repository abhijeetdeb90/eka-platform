
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS tradition text,
  ADD COLUMN IF NOT EXISTS source_kind text,
  ADD COLUMN IF NOT EXISTS source_name text,
  ADD COLUMN IF NOT EXISTS source_url text;

CREATE TABLE IF NOT EXISTS public.post_knowledge_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  node_id uuid NOT NULL REFERENCES public.wisdom_nodes(id) ON DELETE CASCADE,
  note text,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, node_id)
);

GRANT SELECT, INSERT, DELETE ON public.post_knowledge_links TO authenticated;
GRANT SELECT ON public.post_knowledge_links TO anon;
GRANT ALL ON public.post_knowledge_links TO service_role;

ALTER TABLE public.post_knowledge_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Knowledge links are readable"
  ON public.post_knowledge_links FOR SELECT USING (true);

CREATE POLICY "Authors link their own content"
  ON public.post_knowledge_links FOR INSERT TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    AND EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.author_id = auth.uid())
  );

CREATE POLICY "Authors unlink their own content"
  ON public.post_knowledge_links FOR DELETE TO authenticated
  USING (created_by = auth.uid());

CREATE INDEX IF NOT EXISTS post_knowledge_links_node_idx ON public.post_knowledge_links (node_id);
CREATE INDEX IF NOT EXISTS posts_tradition_idx ON public.posts (tradition);

-- Who governs a community
CREATE OR REPLACE FUNCTION public.is_community_moderator(_user_id uuid, _community_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.community_members m
    WHERE m.community_id = _community_id
      AND m.user_id = _user_id
      AND m.role IN ('owner', 'admin', 'moderator')
  ) OR EXISTS (
    SELECT 1 FROM public.communities c
    WHERE c.id = _community_id AND c.created_by = _user_id
  );
$$;

CREATE POLICY "Community moderators see reports in their community"
  ON public.content_reports FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = content_reports.post_id
        AND p.community_id IS NOT NULL
        AND public.is_community_moderator(auth.uid(), p.community_id)
    )
  );

CREATE POLICY "Community moderators moderate posts in their community"
  ON public.posts FOR UPDATE TO authenticated
  USING (community_id IS NOT NULL AND public.is_community_moderator(auth.uid(), community_id))
  WITH CHECK (community_id IS NOT NULL AND public.is_community_moderator(auth.uid(), community_id));

-- Appreciation: weighted, respect-first, never a raw like count
CREATE OR REPLACE FUNCTION public.appreciation_weight(_reaction text)
RETURNS integer LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE _reaction
    WHEN 'appreciate' THEN 1
    WHEN 'respect' THEN 2
    WHEN 'inspiring' THEN 2
    WHEN 'learned' THEN 3
    WHEN 'discovery' THEN 4
    ELSE 1 END;
$$;

CREATE OR REPLACE FUNCTION public.creator_appreciation(_user_id uuid)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH mine AS (
    SELECT id::text AS target_id, 'post' AS kind, tradition FROM public.posts
      WHERE author_id = _user_id AND status = 'published'
    UNION ALL
    SELECT id::text, 'reel', tradition FROM public.reels
      WHERE creator_id = _user_id AND status = 'published'
  ),
  r AS (
    SELECT cr.reaction,
           cr.user_id AS reactor,
           public.appreciation_weight(cr.reaction) AS w,
           m.tradition AS content_tradition,
           p.religion AS reactor_tradition
    FROM public.content_reactions cr
    JOIN mine m ON m.target_id = cr.target_id::text AND m.kind = cr.target_kind
    LEFT JOIN public.profiles p ON p.id = cr.user_id
  )
  SELECT jsonb_build_object(
    'points', COALESCE((SELECT sum(w) FROM r), 0),
    'people', COALESCE((SELECT count(DISTINCT reactor) FROM r), 0),
    'by_reaction', COALESCE((SELECT jsonb_object_agg(reaction, n) FROM (
        SELECT reaction, count(*) AS n FROM r GROUP BY reaction) x), '{}'::jsonb),
    'cross_tradition', COALESCE((SELECT count(*) FROM r
        WHERE reactor_tradition IS NOT NULL AND content_tradition IS NOT NULL
          AND reactor_tradition <> content_tradition), 0),
    'contributions', COALESCE((SELECT count(*) FROM mine), 0),
    'knowledge_links', COALESCE((SELECT count(*) FROM public.post_knowledge_links l
        JOIN public.posts p2 ON p2.id = l.post_id WHERE p2.author_id = _user_id), 0)
  );
$$;

CREATE OR REPLACE FUNCTION public.appreciation_standings()
RETURNS TABLE(creator_id uuid, display_name text, username text, points bigint, people bigint, cross_tradition bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH content AS (
    SELECT author_id AS creator, id::text AS target_id, 'post' AS kind, tradition FROM public.posts WHERE status = 'published'
    UNION ALL
    SELECT creator_id, id::text, 'reel', tradition FROM public.reels WHERE status = 'published'
  ),
  r AS (
    SELECT c.creator,
           cr.user_id AS reactor,
           public.appreciation_weight(cr.reaction) AS w,
           (p.religion IS NOT NULL AND c.tradition IS NOT NULL AND p.religion <> c.tradition) AS crossed
    FROM public.content_reactions cr
    JOIN content c ON c.target_id = cr.target_id::text AND c.kind = cr.target_kind
    LEFT JOIN public.profiles p ON p.id = cr.user_id
  )
  SELECT r.creator,
         pr.display_name,
         pr.username,
         sum(r.w)::bigint,
         count(DISTINCT r.reactor)::bigint,
         count(*) FILTER (WHERE r.crossed)::bigint
  FROM r LEFT JOIN public.profiles pr ON pr.id = r.creator
  GROUP BY r.creator, pr.display_name, pr.username
  ORDER BY 4 DESC;
$$;

CREATE OR REPLACE FUNCTION public.creator_value_simulation(_pool_cents bigint)
RETURNS TABLE(creator_id uuid, display_name text, username text, points bigint, share numeric, amount_cents bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH s AS (SELECT * FROM public.appreciation_standings()),
       t AS (SELECT GREATEST(sum(points), 1) AS total FROM s)
  SELECT s.creator_id, s.display_name, s.username, s.points,
         round(s.points::numeric / t.total, 6),
         floor(_pool_cents * s.points::numeric / t.total)::bigint
  FROM s CROSS JOIN t ORDER BY s.points DESC;
$$;

REVOKE ALL ON FUNCTION public.creator_value_simulation(bigint) FROM anon;
REVOKE ALL ON FUNCTION public.appreciation_standings() FROM anon;
REVOKE ALL ON FUNCTION public.creator_appreciation(uuid) FROM anon;
