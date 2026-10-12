-- ==============================================================================
-- EKA CORE SOCIAL & KNOWLEDGE ARCHITECTURE SCHEMA MIGRATION
-- ==============================================================================
-- Aligned with the Social App Architecture Blueprint:
-- 1. UUID primary keys, UTC timestamps, foreign keys, cascade deletes
-- 2. Follows, Media Assets, Posts, Comments, Likes, Notifications, Blocks, Reports
-- 3. Atomic create_post_with_media RPC transaction
-- 4. Full RLS security policies on all tables
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. FOLLOWS
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'accepted' CHECK (status IN ('pending', 'accepted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id <> following_id)
);

CREATE INDEX IF NOT EXISTS follows_following_idx ON public.follows(following_id, follower_id);
CREATE INDEX IF NOT EXISTS follows_follower_idx ON public.follows(follower_id, following_id);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read follows" ON public.follows;
CREATE POLICY "Users can read follows"
  ON public.follows FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Users can manage their own follows" ON public.follows;
CREATE POLICY "Users can manage their own follows"
  ON public.follows FOR ALL
  TO authenticated
  USING (auth.uid() = follower_id)
  WITH CHECK (auth.uid() = follower_id);

-- 2. POSTS (Ensure core blueprint columns exist on public.posts)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'posts' AND column_name = 'visibility'
  ) THEN
    ALTER TABLE public.posts ADD COLUMN visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'followers'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS posts_author_created_idx
  ON public.posts(author_id, created_at DESC)
  WHERE status = 'visible';

-- 3. MEDIA ASSETS
CREATE TABLE IF NOT EXISTS public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  storage_path text NOT NULL UNIQUE,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  width int,
  height int,
  alt_text text DEFAULT '',
  position smallint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, position)
);

CREATE INDEX IF NOT EXISTS media_assets_post_idx ON public.media_assets(post_id);
CREATE INDEX IF NOT EXISTS media_assets_owner_idx ON public.media_assets(owner_id);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Media assets are readable by all" ON public.media_assets;
CREATE POLICY "Media assets are readable by all"
  ON public.media_assets FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Owners can manage media assets" ON public.media_assets;
CREATE POLICY "Owners can manage media assets"
  ON public.media_assets FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 4. COMMENTS
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 5000),
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'deleted', 'moderated')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS comments_post_created_idx ON public.comments(post_id, created_at);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comments are readable by all" ON public.comments;
CREATE POLICY "Comments are readable by all"
  ON public.comments FOR SELECT
  TO public
  USING (status = 'published');

DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can update or delete own comments" ON public.comments;
CREATE POLICY "Authors can update or delete own comments"
  ON public.comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

-- 5. LIKES (Idempotent composite key)
CREATE TABLE IF NOT EXISTS public.likes (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

CREATE INDEX IF NOT EXISTS likes_post_idx ON public.likes(post_id);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Likes are readable by all" ON public.likes;
CREATE POLICY "Likes are readable by all"
  ON public.likes FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Users can manage own likes" ON public.likes;
CREATE POLICY "Users can manage own likes"
  ON public.likes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  kind text NOT NULL CHECK (kind IN ('follow', 'like', 'comment')),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_inbox_idx
  ON public.notifications(recipient_id, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Recipients can view and update own notifications" ON public.notifications;
CREATE POLICY "Recipients can view and update own notifications"
  ON public.notifications FOR ALL
  TO authenticated
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- 7. BLOCKS
CREATE TABLE IF NOT EXISTS public.blocks (
  blocker_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id),
  CHECK (blocker_id <> blocked_id)
);

ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own blocks" ON public.blocks;
CREATE POLICY "Users can manage own blocks"
  ON public.blocks FOR ALL
  TO authenticated
  USING (auth.uid() = blocker_id)
  WITH CHECK (auth.uid() = blocker_id);

-- 8. REPORTS
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('profile', 'post', 'comment')),
  target_id uuid NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'resolved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reporters can insert reports" ON public.reports;
CREATE POLICY "Reporters can insert reports"
  ON public.reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Reporters can view their own reports" ON public.reports;
CREATE POLICY "Reporters can view their own reports"
  ON public.reports FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

-- 9. ATOMIC RPC FUNCTION: create_post_with_media
CREATE OR REPLACE FUNCTION public.create_post_with_media(
  p_body text,
  p_visibility text DEFAULT 'public',
  p_media jsonb DEFAULT '[]'::jsonb,
  p_topic text DEFAULT 'Cultural Heritage',
  p_tradition text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_post_id uuid;
  v_item jsonb;
  v_position integer := 0;
  v_path text;
  v_first_media_url text := NULL;
  v_type text := 'post';
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized' USING errcode = '42501';
  END IF;

  IF p_visibility NOT IN ('public', 'followers') THEN
    RAISE EXCEPTION 'Invalid visibility' USING errcode = '22023';
  END IF;

  IF jsonb_typeof(p_media) <> 'array' OR jsonb_array_length(p_media) > 4 THEN
    RAISE EXCEPTION 'Invalid media list (maximum 4 items allowed)' USING errcode = '22023';
  END IF;

  IF length(trim(coalesce(p_body, ''))) > 5000 THEN
    RAISE EXCEPTION 'Post body too long' USING errcode = '22023';
  END IF;

  IF length(trim(coalesce(p_body, ''))) = 0 AND jsonb_array_length(p_media) = 0 THEN
    RAISE EXCEPTION 'Post cannot be empty' USING errcode = '22023';
  END IF;

  -- Grab first media item for legacy media_url compatibility
  IF jsonb_array_length(p_media) > 0 THEN
    v_item := p_media -> 0;
    v_first_media_url := v_item ->> 'path';
    IF jsonb_array_length(p_media) > 1 THEN
      v_type := 'carousel';
    END IF;
  END IF;

  -- Insert into posts table
  INSERT INTO public.posts (
    author_id,
    content,
    visibility,
    status,
    topic,
    tradition,
    type,
    media_url
  )
  VALUES (
    v_user_id,
    trim(coalesce(p_body, '')),
    p_visibility,
    'visible',
    coalesce(p_topic, 'Cultural Heritage'),
    p_tradition,
    v_type,
    v_first_media_url
  )
  RETURNING id INTO v_post_id;

  -- Attach media items
  FOR v_item IN SELECT value FROM jsonb_array_elements(p_media)
  LOOP
    v_path := v_item ->> 'path';

    IF v_path IS NULL OR v_path NOT LIKE v_user_id::text || '/%' THEN
      RAISE EXCEPTION 'Invalid media path' USING errcode = '42501';
    END IF;

    IF v_item ->> 'media_type' NOT IN ('image', 'video') THEN
      RAISE EXCEPTION 'Invalid media type' USING errcode = '22023';
    END IF;

    INSERT INTO public.media_assets (
      post_id,
      owner_id,
      storage_path,
      media_type,
      alt_text,
      position
    )
    VALUES (
      v_post_id,
      v_user_id,
      v_path,
      v_item ->> 'media_type',
      coalesce(v_item ->> 'alt_text', ''),
      v_position
    );

    v_position := v_position + 1;
  END LOOP;

  RETURN v_post_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_post_with_media(text, text, jsonb, text, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.create_post_with_media(text, text, jsonb, text, text) TO authenticated;
