-- ============================================================ campaign engine
CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  promise text NOT NULL DEFAULT '',
  day_count integer NOT NULL DEFAULT 7,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.campaigns TO anon, authenticated;
GRANT ALL ON public.campaigns TO service_role;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaigns readable" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "campaigns admin write" ON public.campaigns FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER campaigns_updated_at BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.campaign_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  title text NOT NULL,
  promise text NOT NULL DEFAULT '',
  action text NOT NULL DEFAULT '',
  route text NOT NULL DEFAULT '/app',
  cta text NOT NULL DEFAULT 'Open',
  minutes integer NOT NULL DEFAULT 5,
  tokens integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, day_number)
);
GRANT SELECT ON public.campaign_days TO anon, authenticated;
GRANT ALL ON public.campaign_days TO service_role;
ALTER TABLE public.campaign_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaign days readable" ON public.campaign_days FOR SELECT USING (true);
CREATE POLICY "campaign days admin write" ON public.campaign_days FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.campaign_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  completed_on date NOT NULL DEFAULT current_date,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, campaign_id, day_number)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_progress TO authenticated;
GRANT ALL ON public.campaign_progress TO service_role;
ALTER TABLE public.campaign_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaign progress own" ON public.campaign_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER campaign_progress_updated_at BEFORE UPDATE ON public.campaign_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.campaigns (slug, title, tagline, promise, day_count, active, sort_order) VALUES
  ('7-days-one-path', '7 Days. One Path.', 'One week to find out whether this is yours.',
   'Value in the first session, and understanding before you are ever charged.', 7, true, 0);

INSERT INTO public.campaign_days (campaign_id, day_number, title, promise, action, route, cta, minutes, tokens)
SELECT c.id, d.day_number, d.title, d.promise, d.action, d.route, d.cta, d.minutes, d.tokens
FROM public.campaigns c, (VALUES
  (0, 'Discover yourself', 'Name what you''re seeking, and we shape EKA around it.', 'Answer a few quiet questions about what you''re seeking, how much time you have and how you like to practise.', '/app/onboarding', 'Begin', 4, 0),
  (1, 'Your first practice', 'One short practice, done today. Not read about — done.', 'Open EKA Daily and complete today''s practice from your journey.', '/app/daily', 'Open EKA Daily', 8, 10),
  (2, 'Your first reflection', 'A single honest sentence is enough to start a record.', 'Write your first journal reflection. The companion can help you find the first line.', '/app/journal', 'Write a reflection', 5, 10),
  (3, 'Your first circle', 'Fewer people, held better. No follower counts here.', 'Join a circle and say one true thing in its shared ritual or story thread.', '/app/sanghas', 'Find my circle', 6, 10),
  (4, 'A meaningful action', 'Practice that leaves the screen.', 'Take on an act of service in your circle, or do the day''s act of kindness.', '/app/daily', 'Take the action', 10, 10),
  (5, 'Your first milestone', 'Proof that something is accumulating.', 'Look at My EKA — days with EKA, practices, reflections and where your journey stands.', '/app/dashboard', 'See my progress', 3, 0),
  (6, 'A shared experience', 'Doing the same thing at the same hour as other people changes it.', 'Join a shared ritual in your circle and mark yourself as taking part.', '/app/sanghas', 'Join a shared ritual', 12, 10),
  (7, 'What changed', 'You should be able to answer this before you''re ever charged.', 'Read your week back with the reflection companion''s summary, and choose the journey you''ll actually run.', '/app/journeys', 'Choose my journey', 6, 25)
) AS d(day_number, title, promise, action, route, cta, minutes, tokens)
WHERE c.slug = '7-days-one-path';

-- ==================================================== path token hardening
ALTER TABLE public.path_events ADD COLUMN IF NOT EXISTS dedupe_key text;
CREATE UNIQUE INDEX IF NOT EXISTS path_events_dedupe_uidx
  ON public.path_events (user_id, dedupe_key) WHERE dedupe_key IS NOT NULL;

ALTER TABLE public.path_milestones ADD COLUMN IF NOT EXISTS tokens integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.has_completion_evidence(_uid uuid, _kind text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE _today date := current_date;
BEGIN
  IF _kind = 'journal' THEN
    RETURN EXISTS (
      SELECT 1 FROM public.journal_entries j
      WHERE j.user_id = _uid AND j.updated_at::date = _today
        AND length(btrim(j.content)) >= 60
    );
  ELSIF _kind = 'observe' THEN
    RETURN EXISTS (
      SELECT 1 FROM public.observation_logs o
      WHERE o.user_id = _uid AND o.noticed_on = _today
    );
  ELSIF _kind = 'practice' THEN
    RETURN EXISTS (SELECT 1 FROM public.practice_completions p WHERE p.user_id = _uid AND p.completed_on = _today)
        OR EXISTS (SELECT 1 FROM public.rhythm_completions r WHERE r.user_id = _uid AND r.done_on = _today)
        OR EXISTS (SELECT 1 FROM public.journey_day_logs l WHERE l.user_id = _uid AND l.completed_on = _today);
  ELSIF _kind = 'journey' THEN
    RETURN EXISTS (SELECT 1 FROM public.journey_day_logs l WHERE l.user_id = _uid AND l.completed_on = _today);
  ELSIF _kind = 'daily' THEN
    -- the day is only "complete" when at least two different pillars were touched
    RETURN (
      SELECT count(DISTINCT e.kind) FROM public.path_events e
      WHERE e.user_id = _uid AND e.created_at >= date_trunc('day', now())
        AND e.kind IN ('practice','journal','observe','journey')
    ) >= 2;
  ELSIF _kind = 'weekly' THEN
    RETURN (
      SELECT count(DISTINCT e.created_at::date) FROM public.path_events e
      WHERE e.user_id = _uid AND e.created_at >= now() - interval '7 days'
        AND e.kind IN ('practice','journal','observe','journey')
    ) >= 4;
  ELSIF _kind = 'community' THEN
    RETURN EXISTS (
      SELECT 1 FROM public.circle_activity_joins j WHERE j.user_id = _uid AND j.created_at >= now() - interval '1 day'
    ) OR EXISTS (
      SELECT 1 FROM public.posts p WHERE p.author_id = _uid AND p.created_at >= now() - interval '1 day'
    ) OR EXISTS (
      SELECT 1 FROM public.post_comments c WHERE c.author_id = _uid AND c.created_at >= now() - interval '1 day'
    );
  END IF;
  RETURN false;
END; $$;
REVOKE EXECUTE ON FUNCTION public.has_completion_evidence(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_completion_evidence(uuid, text) TO authenticated;

-- server-owned token values; the client no longer decides what an action is worth
CREATE OR REPLACE FUNCTION public.path_token_value(_kind text)
RETURNS integer LANGUAGE sql IMMUTABLE SET search_path TO 'public' AS $$
  SELECT CASE _kind
    WHEN 'journey' THEN 25
    WHEN 'practice' THEN 10
    WHEN 'journal' THEN 10
    WHEN 'observe' THEN 5
    WHEN 'daily' THEN 10
    WHEN 'weekly' THEN 75
    WHEN 'community' THEN 10
    ELSE 0 END;
$$;

DROP FUNCTION IF EXISTS public.award_path_tokens(text, integer, text, text);
CREATE OR REPLACE FUNCTION public.award_path_tokens(
  _kind text,
  _base integer DEFAULT NULL,
  _ref text DEFAULT NULL,
  _note text DEFAULT NULL,
  _dedupe text DEFAULT NULL
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _uid uuid := auth.uid();
  _today integer;
  _awarded integer;
  _value integer;
  _day_total integer;
  _last timestamptz;
  _key text;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  IF _kind NOT IN ('journey','practice','journal','observe','daily','weekly','community') THEN
    RAISE EXCEPTION 'Unknown path action';
  END IF;

  _key := COALESCE(_dedupe, _kind || ':' || COALESCE(_ref, '') || ':' || current_date::text);

  -- idempotent: the same completion never pays twice
  IF EXISTS (SELECT 1 FROM public.path_events WHERE user_id = _uid AND dedupe_key = _key) THEN
    RETURN 0;
  END IF;

  -- the action must actually exist in the database
  IF NOT public.has_completion_evidence(_uid, _kind) THEN
    RETURN 0;
  END IF;

  -- a short pause between rewards of the same kind: taps in a row are not practice
  SELECT max(created_at) INTO _last FROM public.path_events WHERE user_id = _uid AND kind = _kind;
  IF _last IS NOT NULL AND _last > now() - interval '60 seconds' THEN
    RETURN 0;
  END IF;

  _value := least(COALESCE(_base, public.path_token_value(_kind)), public.path_token_value(_kind));

  SELECT count(*) INTO _today
  FROM public.path_events
  WHERE user_id = _uid AND kind = _kind AND created_at >= date_trunc('day', now());

  _awarded := CASE
    WHEN _today = 0 THEN _value
    WHEN _today = 1 THEN (_value / 2)
    WHEN _today = 2 THEN (_value / 4)
    ELSE 0
  END;

  -- a ceiling on what any single day can produce
  SELECT COALESCE(sum(tokens), 0) INTO _day_total
  FROM public.path_events
  WHERE user_id = _uid AND created_at >= date_trunc('day', now());
  _awarded := greatest(least(_awarded, greatest(120 - _day_total, 0)), 0);

  INSERT INTO public.path_events (user_id, kind, ref, tokens, note, dedupe_key)
  VALUES (_uid, _kind, _ref, _awarded, _note, _key);

  RETURN _awarded;
END; $$;
REVOKE EXECUTE ON FUNCTION public.award_path_tokens(text, integer, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.award_path_tokens(text, integer, text, text, text) TO authenticated;

-- =================================================== reflection milestones
CREATE OR REPLACE FUNCTION public.claim_reflection_milestone(_code text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _uid uuid := auth.uid();
  _count integer;
  _need integer;
  _tokens integer;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  SELECT CASE _code WHEN 'first-reflection' THEN 7 WHEN 'month-of-reflection' THEN 30 WHEN 'the-witness' THEN 100 END INTO _need;
  IF _need IS NULL THEN RAISE EXCEPTION 'Unknown milestone'; END IF;
  _tokens := CASE _code WHEN 'first-reflection' THEN 25 WHEN 'month-of-reflection' THEN 75 ELSE 150 END;

  SELECT count(*) INTO _count FROM public.journal_entries
  WHERE user_id = _uid AND length(btrim(content)) >= 60;
  IF _count < _need THEN RETURN 0; END IF;

  IF EXISTS (SELECT 1 FROM public.path_milestones WHERE user_id = _uid AND code = _code) THEN
    RETURN 0;
  END IF;

  INSERT INTO public.path_milestones (user_id, code, tokens) VALUES (_uid, _code, _tokens);
  INSERT INTO public.path_events (user_id, kind, ref, tokens, note, dedupe_key)
  VALUES (_uid, 'journal', _code, _tokens, 'Reflection milestone', 'milestone:' || _code)
  ON CONFLICT DO NOTHING;
  RETURN _tokens;
END; $$;
REVOKE EXECUTE ON FUNCTION public.claim_reflection_milestone(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_reflection_milestone(text) TO authenticated;

-- ==================================================== north-star analytics
CREATE OR REPLACE FUNCTION public.meaningful_spiritual_days(_days integer DEFAULT 30)
RETURNS TABLE (day date, members integer, actions integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT d::date AS day,
         COALESCE((
           SELECT count(*)::int FROM (
             SELECT e.user_id FROM public.path_events e
             WHERE e.created_at::date = d::date
               AND e.kind IN ('practice','journal','observe','journey')
             GROUP BY e.user_id HAVING count(DISTINCT e.kind) >= 2
           ) q
         ), 0) AS members,
         COALESCE((
           SELECT count(*)::int FROM public.path_events e
           WHERE e.created_at::date = d::date
             AND e.kind IN ('practice','journal','observe','journey')
         ), 0) AS actions
  FROM generate_series(current_date - (GREATEST(_days,1) - 1), current_date, interval '1 day') d
  WHERE public.has_role(auth.uid(), 'admin')
  ORDER BY 1;
$$;
REVOKE EXECUTE ON FUNCTION public.meaningful_spiritual_days(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.meaningful_spiritual_days(integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.retention_cohorts(_weeks integer DEFAULT 8)
RETURNS TABLE (cohort date, signups integer, d7 integer, d30 integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  WITH c AS (
    SELECT p.id, date_trunc('week', p.created_at)::date AS cohort, p.created_at
    FROM public.profiles p
    WHERE p.created_at >= current_date - (GREATEST(_weeks,1) * 7)
  )
  SELECT c.cohort,
         count(*)::int AS signups,
         count(*) FILTER (WHERE EXISTS (
           SELECT 1 FROM public.path_events e WHERE e.user_id = c.id
             AND e.created_at BETWEEN c.created_at + interval '6 days' AND c.created_at + interval '8 days'
         ))::int AS d7,
         count(*) FILTER (WHERE EXISTS (
           SELECT 1 FROM public.path_events e WHERE e.user_id = c.id
             AND e.created_at BETWEEN c.created_at + interval '28 days' AND c.created_at + interval '32 days'
         ))::int AS d30
  FROM c
  WHERE public.has_role(auth.uid(), 'admin')
  GROUP BY c.cohort ORDER BY c.cohort;
$$;
REVOKE EXECUTE ON FUNCTION public.retention_cohorts(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.retention_cohorts(integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.journey_completion_stats()
RETURNS TABLE (journey text, duration_days integer, enrolled integer, completed integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT j.title, j.duration_days,
         count(e.id)::int,
         count(e.id) FILTER (WHERE e.completed_at IS NOT NULL)::int
  FROM public.journeys j
  LEFT JOIN public.journey_enrollments e ON e.journey_id = j.id
  WHERE public.has_role(auth.uid(), 'admin')
  GROUP BY j.title, j.duration_days, j.sort_order
  ORDER BY j.sort_order;
$$;
REVOKE EXECUTE ON FUNCTION public.journey_completion_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.journey_completion_stats() TO authenticated;

-- ============================================ creator pool funding summary
CREATE OR REPLACE FUNCTION public.pool_funding_summary(_from date, _to date)
RETURNS TABLE (fee_cents bigint, gross_cents bigint, transactions integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT COALESCE(sum(t.fee_cents), 0)::bigint,
         COALESCE(sum(abs(t.amount_cents)), 0)::bigint,
         count(*)::int
  FROM public.wallet_transactions t
  WHERE t.created_at >= _from AND t.created_at < (_to + 1)
    AND t.fee_cents > 0
    AND auth.uid() IS NOT NULL;
$$;
REVOKE EXECUTE ON FUNCTION public.pool_funding_summary(date, date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.pool_funding_summary(date, date) TO authenticated;

INSERT INTO public.platform_config (key, value, label, description) VALUES
  ('pool_funding_percent_of_fee', '15'::jsonb, 'Creator Pool share of platform fee',
   'The share of EKA''s own platform fee set aside each cycle for the Creator Pool bonus.')
ON CONFLICT (key) DO NOTHING;