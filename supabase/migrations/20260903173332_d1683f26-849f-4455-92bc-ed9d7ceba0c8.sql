-- Clean up old So-Hum domain
DROP TABLE IF EXISTS public.donations CASCADE;
DROP TABLE IF EXISTS public.institution_expenses CASCADE;
DROP TABLE IF EXISTS public.institutions CASCADE;
DROP TABLE IF EXISTS public.fast_logs CASCADE;
DROP TABLE IF EXISTS public.observances CASCADE;
DROP TABLE IF EXISTS public.practice_completions CASCADE;
DROP TABLE IF EXISTS public.practices CASCADE;
DROP TABLE IF EXISTS public.reading_completions CASCADE;
DROP TABLE IF EXISTS public.scripture_readings CASCADE;
DROP TABLE IF EXISTS public.post_reports CASCADE;
DROP TABLE IF EXISTS public.post_likes CASCADE;
DROP TABLE IF EXISTS public.post_comments CASCADE;
DROP TABLE IF EXISTS public.community_posts CASCADE;
DROP SEQUENCE IF EXISTS public.receipt_seq;

-- Profiles
ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS faith,
  DROP COLUMN IF EXISTS tradition,
  DROP COLUMN IF EXISTS goals,
  DROP COLUMN IF EXISTS observances,
  ADD COLUMN IF NOT EXISTS username text UNIQUE,
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS account_type text NOT NULL DEFAULT 'personal',
  ADD COLUMN IF NOT EXISTS intentions text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS interests text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS practices text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS suspended boolean NOT NULL DEFAULT false;

DROP POLICY IF EXISTS profiles_public_read ON public.profiles;
CREATE POLICY profiles_public_read ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE base text; candidate text; n int := 0;
BEGIN
  base := lower(regexp_replace(COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)), '[^a-zA-Z0-9_]', '', 'g'));
  IF base = '' OR base IS NULL THEN base := 'seeker'; END IF;
  candidate := base;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = candidate) LOOP
    n := n + 1; candidate := base || n::text;
  END LOOP;
  INSERT INTO public.profiles (id, display_name, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)), candidate)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

UPDATE public.profiles SET username = 'seeker' || substr(id::text, 1, 8) WHERE username IS NULL;

-- Communities (Sanghas)
CREATE TABLE public.communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  cover_image text,
  category text NOT NULL DEFAULT 'Practice',
  rules text,
  featured boolean NOT NULL DEFAULT false,
  member_count integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.communities TO anon;
GRANT SELECT, INSERT, UPDATE ON public.communities TO authenticated;
GRANT ALL ON public.communities TO service_role;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY communities_read ON public.communities FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY communities_insert ON public.communities FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY communities_update ON public.communities FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
  WITH CHECK (true);

CREATE TABLE public.community_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (community_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.community_members TO authenticated;
GRANT ALL ON public.community_members TO service_role;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY cm_read ON public.community_members FOR SELECT TO authenticated USING (true);
CREATE POLICY cm_insert ON public.community_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY cm_delete ON public.community_members FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Posts
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'reflection',
  content text NOT NULL,
  media_url text,
  topic text,
  community_id uuid REFERENCES public.communities(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'visible',
  like_count integer NOT NULL DEFAULT 0,
  comment_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX posts_created_idx ON public.posts (created_at DESC);
CREATE INDEX posts_author_idx ON public.posts (author_id);
CREATE INDEX posts_community_idx ON public.posts (community_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY posts_read ON public.posts FOR SELECT TO authenticated
  USING (status = 'visible' OR auth.uid() = author_id OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY posts_insert ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY posts_update ON public.posts FOR UPDATE TO authenticated
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (true);
CREATE POLICY posts_delete ON public.posts FOR DELETE TO authenticated
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.post_likes TO authenticated;
GRANT ALL ON public.post_likes TO service_role;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY likes_read ON public.post_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY likes_insert ON public.post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY likes_delete ON public.post_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.post_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'visible',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX comments_post_idx ON public.post_comments (post_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_comments TO authenticated;
GRANT ALL ON public.post_comments TO service_role;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY comments_read ON public.post_comments FOR SELECT TO authenticated
  USING (status = 'visible' OR auth.uid() = user_id OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY comments_insert ON public.post_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY comments_update ON public.post_comments FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin')) WITH CHECK (true);
CREATE POLICY comments_delete ON public.post_comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.post_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.post_saves TO authenticated;
GRANT ALL ON public.post_saves TO service_role;
ALTER TABLE public.post_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY saves_own ON public.post_saves FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Follows
CREATE TABLE public.follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (follower_id, following_id),
  CHECK (follower_id <> following_id)
);
GRANT SELECT, INSERT, DELETE ON public.follows TO authenticated;
GRANT ALL ON public.follows TO service_role;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY follows_read ON public.follows FOR SELECT TO authenticated USING (true);
CREATE POLICY follows_insert ON public.follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);
CREATE POLICY follows_delete ON public.follows FOR DELETE TO authenticated USING (auth.uid() = follower_id);

-- Notifications
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  community_id uuid REFERENCES public.communities(id) ON DELETE CASCADE,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON public.notifications (user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY notif_read ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY notif_insert ON public.notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = actor_id);
CREATE POLICY notif_update ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY notif_delete ON public.notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Subscriptions
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'plus',
  status text NOT NULL DEFAULT 'trialing',
  price_cents integer NOT NULL DEFAULT 9900,
  currency text NOT NULL DEFAULT 'INR',
  provider text,
  provider_reference text,
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, plan)
);
GRANT SELECT, INSERT, UPDATE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY subs_read ON public.subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY subs_insert ON public.subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY subs_update ON public.subscriptions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Safety
CREATE TABLE public.content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.post_comments(id) ON DELETE CASCADE,
  reported_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'open',
  resolution text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.content_reports TO authenticated;
GRANT ALL ON public.content_reports TO service_role;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY reports_read ON public.content_reports FOR SELECT TO authenticated
  USING (auth.uid() = reporter_id OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY reports_insert ON public.content_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY reports_update ON public.content_reports FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin')) WITH CHECK (true);

CREATE TABLE public.user_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (blocker_id, blocked_id)
);
GRANT SELECT, INSERT, DELETE ON public.user_blocks TO authenticated;
GRANT ALL ON public.user_blocks TO service_role;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY blocks_own ON public.user_blocks FOR ALL TO authenticated USING (auth.uid() = blocker_id) WITH CHECK (auth.uid() = blocker_id);

-- Analytics
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event text NOT NULL,
  props jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX analytics_event_idx ON public.analytics_events (event, created_at DESC);
GRANT INSERT, SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY analytics_insert ON public.analytics_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY analytics_read_admin ON public.analytics_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Counter triggers
CREATE OR REPLACE FUNCTION public.sync_counts() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF TG_TABLE_NAME = 'post_likes' THEN
    IF TG_OP = 'INSERT' THEN UPDATE public.posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
    ELSE UPDATE public.posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.post_id; END IF;
  ELSIF TG_TABLE_NAME = 'post_comments' THEN
    IF TG_OP = 'INSERT' THEN UPDATE public.posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    ELSE UPDATE public.posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.post_id; END IF;
  ELSIF TG_TABLE_NAME = 'community_members' THEN
    IF TG_OP = 'INSERT' THEN UPDATE public.communities SET member_count = member_count + 1 WHERE id = NEW.community_id;
    ELSE UPDATE public.communities SET member_count = GREATEST(member_count - 1, 0) WHERE id = OLD.community_id; END IF;
  END IF;
  RETURN NULL;
END; $$;
CREATE TRIGGER likes_count AFTER INSERT OR DELETE ON public.post_likes FOR EACH ROW EXECUTE FUNCTION public.sync_counts();
CREATE TRIGGER comments_count AFTER INSERT OR DELETE ON public.post_comments FOR EACH ROW EXECUTE FUNCTION public.sync_counts();
CREATE TRIGGER members_count AFTER INSERT OR DELETE ON public.community_members FOR EACH ROW EXECUTE FUNCTION public.sync_counts();

-- Seed Sanghas
INSERT INTO public.communities (slug, name, description, category, featured) VALUES
('meditation','Meditation','Sitting practice, attention, stillness — from beginners to long-time practitioners.','Practice',true),
('bhagavad-gita','Bhagavad Gita','Chapter by chapter study, translations and lived interpretation.','Scripture',true),
('vedanta','Vedanta','Non-duality, the Upanishads and the enquiry "who am I?".','Philosophy',true),
('shiva','Shiva','Devotion, symbolism, chants and practice around Shiva.','Devotion',false),
('buddhism','Buddhism','Dhamma, the eightfold path, and everyday practice.','Tradition',true),
('sikh-wisdom','Sikh Wisdom','Gurbani, seva and living the Guru''s teaching.','Tradition',false),
('christianity','Christianity','Prayer, scripture and contemplative Christian practice.','Tradition',false),
('islam','Islam','Salah, dhikr, Qur''an reflection and Sufi wisdom.','Tradition',false),
('yoga','Yoga','Asana, pranayama and the eight limbs beyond the mat.','Practice',true),
('breathwork','Breathwork','Pranayama and modern breath practices for calm and clarity.','Practice',false),
('consciousness','Consciousness','Mind, awareness, science and the hard questions.','Philosophy',true),
('spirituality','Spirituality','An open room for the inner life, whatever your path.','Open',true),
('philosophy','Philosophy','Ancient and modern thought on meaning and living well.','Philosophy',false),
('parenting-and-spirituality','Parenting & Spirituality','Raising children with presence, values and patience.','Life',false),
('spiritual-growth','Spiritual Growth','Discipline, setbacks and steady progress on the path.','Growth',true);