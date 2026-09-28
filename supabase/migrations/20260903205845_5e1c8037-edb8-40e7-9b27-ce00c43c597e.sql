-- 1. Reflection tone
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS reflection_tone text NOT NULL DEFAULT 'gentle';

-- 2. Circle activity capacity + approvals
ALTER TABLE public.circle_activities
  ADD COLUMN IF NOT EXISTS capacity integer,
  ADD COLUMN IF NOT EXISTS requires_approval boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS closed boolean NOT NULL DEFAULT false;
ALTER TABLE public.circle_activity_joins
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS attended boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS decided_at timestamptz;

DROP POLICY IF EXISTS "hosts manage joins" ON public.circle_activity_joins;
CREATE POLICY "hosts manage joins" ON public.circle_activity_joins FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.circle_activities a WHERE a.id = activity_id AND a.created_by = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.circle_activities a WHERE a.id = activity_id AND a.created_by = auth.uid()));

-- 3. Reports cover more content kinds
ALTER TABLE public.content_reports
  ADD COLUMN IF NOT EXISTS target_kind text NOT NULL DEFAULT 'post',
  ADD COLUMN IF NOT EXISTS target_id uuid;

-- 4. Reels
CREATE TABLE public.reels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title text NOT NULL,
  context_note text NOT NULL,
  tradition text NOT NULL DEFAULT 'universal',
  topic_slug text,
  media_kind text NOT NULL DEFAULT 'embed',
  media_url text NOT NULL,
  thumbnail_url text,
  duration_seconds integer NOT NULL DEFAULT 60,
  sensitive boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reels TO authenticated;
GRANT ALL ON public.reels TO service_role;
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reels readable" ON public.reels FOR SELECT TO authenticated USING (status = 'published' OR creator_id = auth.uid());
CREATE POLICY "reels insert own" ON public.reels FOR INSERT TO authenticated WITH CHECK (creator_id = auth.uid());
CREATE POLICY "reels update own" ON public.reels FOR UPDATE TO authenticated USING (creator_id = auth.uid()) WITH CHECK (creator_id = auth.uid());
CREATE POLICY "reels delete own" ON public.reels FOR DELETE TO authenticated USING (creator_id = auth.uid());
CREATE POLICY "reels moderators" ON public.reels FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.reel_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reel_id uuid NOT NULL REFERENCES public.reels ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  watched_seconds integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (reel_id, user_id)
);
GRANT SELECT, INSERT, UPDATE ON public.reel_views TO authenticated;
GRANT ALL ON public.reel_views TO service_role;
ALTER TABLE public.reel_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "views readable" ON public.reel_views FOR SELECT TO authenticated USING (true);
CREATE POLICY "views own write" ON public.reel_views FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "views own update" ON public.reel_views FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 5. Respect-first reactions
CREATE TABLE public.content_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  target_kind text NOT NULL,
  target_id uuid NOT NULL,
  reaction text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, target_kind, target_id, reaction)
);
GRANT SELECT, INSERT, DELETE ON public.content_reactions TO authenticated;
GRANT ALL ON public.content_reactions TO service_role;
ALTER TABLE public.content_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reactions readable" ON public.content_reactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "reactions own insert" ON public.content_reactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "reactions own delete" ON public.content_reactions FOR DELETE TO authenticated USING (user_id = auth.uid());

-- 6. Explore topics
CREATE TABLE public.explore_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  tradition text NOT NULL,
  kind text NOT NULL DEFAULT 'religion',
  summary text NOT NULL,
  origin text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.explore_topics TO authenticated, anon;
GRANT ALL ON public.explore_topics TO service_role;
ALTER TABLE public.explore_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "topics readable" ON public.explore_topics FOR SELECT USING (true);

CREATE TABLE public.explore_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.explore_topics ON DELETE CASCADE,
  heading text NOT NULL,
  body text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.explore_sections TO authenticated, anon;
GRANT ALL ON public.explore_sections TO service_role;
ALTER TABLE public.explore_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sections readable" ON public.explore_sections FOR SELECT USING (true);

-- 7. Episodes (podcast-first)
CREATE TABLE public.episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  tradition text NOT NULL DEFAULT 'universal',
  topic_slug text,
  media_kind text NOT NULL DEFAULT 'audio',
  media_url text,
  cover_url text,
  duration_minutes integer NOT NULL DEFAULT 30,
  scheduled_at timestamptz,
  price_cents integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.episodes TO authenticated;
GRANT ALL ON public.episodes TO service_role;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "episodes readable" ON public.episodes FOR SELECT TO authenticated USING (published OR creator_id = auth.uid());
CREATE POLICY "episodes own write" ON public.episodes FOR INSERT TO authenticated WITH CHECK (creator_id = auth.uid());
CREATE POLICY "episodes own update" ON public.episodes FOR UPDATE TO authenticated USING (creator_id = auth.uid()) WITH CHECK (creator_id = auth.uid());
CREATE POLICY "episodes own delete" ON public.episodes FOR DELETE TO authenticated USING (creator_id = auth.uid());

CREATE TABLE public.episode_chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id uuid NOT NULL REFERENCES public.episodes ON DELETE CASCADE,
  label text NOT NULL,
  starts_seconds integer NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.episode_chapters TO authenticated;
GRANT ALL ON public.episode_chapters TO service_role;
ALTER TABLE public.episode_chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chapters readable" ON public.episode_chapters FOR SELECT TO authenticated USING (true);
CREATE POLICY "chapters by host" ON public.episode_chapters FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.episodes e WHERE e.id = episode_id AND e.creator_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.episodes e WHERE e.id = episode_id AND e.creator_id = auth.uid()));

CREATE TABLE public.episode_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id uuid NOT NULL REFERENCES public.episodes ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (episode_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.episode_rsvps TO authenticated;
GRANT ALL ON public.episode_rsvps TO service_role;
ALTER TABLE public.episode_rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rsvps readable" ON public.episode_rsvps FOR SELECT TO authenticated USING (true);
CREATE POLICY "rsvps own" ON public.episode_rsvps FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "rsvps own delete" ON public.episode_rsvps FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.episode_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id uuid NOT NULL REFERENCES public.episodes ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.episode_comments TO authenticated;
GRANT ALL ON public.episode_comments TO service_role;
ALTER TABLE public.episode_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ep comments readable" ON public.episode_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "ep comments own" ON public.episode_comments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "ep comments own delete" ON public.episode_comments FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.episode_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id uuid NOT NULL REFERENCES public.episodes ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  amount_cents integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (episode_id, user_id)
);
GRANT SELECT, INSERT ON public.episode_purchases TO authenticated;
GRANT ALL ON public.episode_purchases TO service_role;
ALTER TABLE public.episode_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "purchases own" ON public.episode_purchases FOR SELECT TO authenticated
USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.episodes e WHERE e.id = episode_id AND e.creator_id = auth.uid()));
CREATE POLICY "purchases own insert" ON public.episode_purchases FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- 8. EKA Pay
CREATE TABLE public.wallets (
  user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  balance_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.wallets TO authenticated;
GRANT ALL ON public.wallets TO service_role;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wallet own" ON public.wallets FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "wallet own insert" ON public.wallets FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "wallet own update" ON public.wallets FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  counterparty_id uuid REFERENCES auth.users ON DELETE SET NULL,
  kind text NOT NULL,
  amount_cents integer NOT NULL,
  fee_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  reference_kind text,
  reference_id uuid,
  status text NOT NULL DEFAULT 'settled',
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.wallet_transactions TO authenticated;
GRANT ALL ON public.wallet_transactions TO service_role;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "txn own" ON public.wallet_transactions FOR SELECT TO authenticated USING (user_id = auth.uid() OR counterparty_id = auth.uid());
CREATE POLICY "txn own insert" ON public.wallet_transactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR counterparty_id = auth.uid());

CREATE TABLE public.creator_scores (
  user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  completion integer NOT NULL DEFAULT 0,
  saves integer NOT NULL DEFAULT 0,
  reactions integer NOT NULL DEFAULT 0,
  cross_tradition integer NOT NULL DEFAULT 0,
  live_attendance integer NOT NULL DEFAULT 0,
  penalties integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.creator_scores TO authenticated;
GRANT ALL ON public.creator_scores TO service_role;
ALTER TABLE public.creator_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scores readable" ON public.creator_scores FOR SELECT TO authenticated USING (true);

CREATE TABLE public.fund_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period text NOT NULL,
  creator_id uuid REFERENCES auth.users ON DELETE SET NULL,
  pool_cents integer NOT NULL DEFAULT 0,
  amount_cents integer NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'creator_pool',
  status text NOT NULL DEFAULT 'pending_review',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.fund_allocations TO authenticated;
GRANT ALL ON public.fund_allocations TO service_role;
ALTER TABLE public.fund_allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fund readable" ON public.fund_allocations FOR SELECT TO authenticated USING (true);

-- 9. Seed explore topics
INSERT INTO public.explore_topics (slug, title, tradition, kind, summary, origin, sort_order) VALUES
('diwali', 'Diwali', 'Hindu', 'festival', 'The festival of lights: a five-day observance about the return of light, cleared debts and a cleaned house.', 'Indian subcontinent', 1),
('ramadan', 'Ramadan', 'Islamic', 'observance', 'A month of fasting from dawn to sunset, night prayer and deliberate generosity.', 'Arabian peninsula, 7th century', 2),
('vesak', 'Vesak', 'Buddhist', 'festival', 'The birth, awakening and passing of the Buddha, marked on a single full-moon day.', 'South and Southeast Asia', 3),
('vaisakhi', 'Vaisakhi', 'Sikh', 'festival', 'Harvest and the founding of the Khalsa, kept with processions, langar and service.', 'Punjab, 1699', 4),
('lent', 'Lent', 'Christian', 'observance', 'Forty days of fasting, almsgiving and self-examination before Easter.', 'Early Christian Mediterranean', 5),
('paryushana', 'Paryushana', 'Jain', 'observance', 'Eight to ten days of fasting, study and the deliberate asking of forgiveness.', 'India', 6),
('shabbat', 'Shabbat', 'Jewish', 'observance', 'A weekly day of rest that begins at sunset: no work, a set table, a deliberate stop.', 'Ancient Israel', 7),
('stillness', 'Contemplative stillness', 'Universal', 'practice', 'Silence as a practice across traditions: zazen, hesychasm, muraqaba, dhyana.', 'Global', 8);

INSERT INTO public.explore_sections (topic_id, heading, body, sort_order)
SELECT t.id, s.heading, s.body, s.sort_order FROM public.explore_topics t
JOIN (VALUES
 ('diwali','History','Diwali gathers several older harvest and new-year observances. The best known story is Rama''s return to Ayodhya, but Jains mark Mahavira''s liberation on the same night, and Sikhs mark Guru Hargobind''s release from prison.',1),
 ('diwali','How it is kept','Houses are cleaned and lit with rows of lamps, accounts are settled, sweets are shared, and doorways are marked with rangoli.',2),
 ('diwali','Regional differences','In the south the emphasis falls on Naraka Chaturdashi and an oil bath before dawn; in the west it opens the business new year; in Bengal the same nights belong to Kali.',3),
 ('ramadan','History','The month commemorates the first revelation of the Qur''an. Fasting became obligatory in Medina in the second year after the migration.',1),
 ('ramadan','How it is kept','No food or drink between dawn and sunset, the fast broken with dates and water, extra night prayers, and zakat given before the month ends.',2),
 ('ramadan','Regional differences','Fasting hours differ enormously by latitude, and the food that breaks the fast is local everywhere: harira in Morocco, haleem in Hyderabad, kolak in Java.',3),
 ('vesak','History','A single day holding three events, formalised as a shared observance by the World Fellowship of Buddhists in 1950.',1),
 ('vesak','How it is kept','Temples are visited before dawn, lamps and lanterns are lit, animals are freed, and many keep the eight precepts for the day.',2),
 ('vesak','Regional differences','Theravada countries keep it on the full moon of Vesakha; East Asian traditions often mark the Buddha''s birth separately in April.',3),
 ('vaisakhi','History','A harvest festival that became the founding day of the Khalsa in 1699 at Anandpur Sahib.',1),
 ('vaisakhi','How it is kept','Nagar kirtan processions, continuous reading of the Guru Granth Sahib, langar cooked and served to anyone who comes.',2),
 ('vaisakhi','Regional differences','In Punjab it stays a harvest festival as much as a religious one; in the diaspora it is often the largest public Sikh event of the year.',3),
 ('lent','History','Forty days modelled on the wilderness fast, fixed in the fourth century as preparation for baptism at Easter.',1),
 ('lent','How it is kept','A giving-up, a taking-on, and almsgiving. Ash Wednesday opens it; Holy Week closes it.',2),
 ('lent','Regional differences','Eastern churches begin on Clean Monday and fast more strictly; Western churches keep Sundays outside the count.',3),
 ('paryushana','History','The oldest and most important Jain observance, kept at the close of the monsoon when monks are settled in one place.',1),
 ('paryushana','How it is kept','Fasting, scripture study, and on the final day Samvatsari, when forgiveness is asked of everyone: Micchami Dukkadam.',2),
 ('paryushana','Regional differences','Svetambara keep eight days; Digambara keep ten as Das Lakshana, one virtue a day.',3),
 ('shabbat','History','Rest on the seventh day is set in the creation narrative and in the commandments; the shape of the day was worked out over centuries.',1),
 ('shabbat','How it is kept','Candles lit before sunset, blessings over wine and bread, a long table, and thirty-nine categories of work set down.',2),
 ('shabbat','Regional differences','Foods and melodies differ sharply between Ashkenazi, Sephardi, Mizrahi and Ethiopian communities; the stopping does not.',3),
 ('stillness','History','Every tradition arrived at silence independently: desert monks, forest monks, Sufi orders, Quaker meetings.',1),
 ('stillness','How it is kept','Sit. Keep the body still. Let attention rest on breath, a word, or nothing. Return when it wanders.',2),
 ('stillness','Regional differences','Zazen keeps the eyes open; hesychasm repeats a prayer; muraqaba watches the heart. The posture and the object differ, not the discipline.',3)
) AS s(slug, heading, body, sort_order) ON s.slug = t.slug;