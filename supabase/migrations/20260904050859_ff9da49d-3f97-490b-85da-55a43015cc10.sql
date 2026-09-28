-- ---------------------------------------------------------------- settings --
INSERT INTO public.platform_config (key, value, label, description)
VALUES
  ('feature_flags',
   '{"trust_profile_enabled": true, "wisdom_passport_enabled": false, "discovery_v2_enabled": false, "creator_score_v2_enabled": true, "wisdom_graph_enabled": false, "wisdom_compare_enabled": false, "ai_navigator_enabled": false, "cultural_archive_enabled": false, "institutional_network_enabled": false, "wisdom_api_enabled": false}'::jsonb,
   'Feature flags', 'Gradual rollout switches for new EKA systems. Off means the surface is hidden.'),
  ('score_weights_v2',
   '[{"key":"quality","label":"Quality","percent":18,"detail":"Member ratings and considered written feedback."},
     {"key":"completion","label":"Completion","percent":15,"detail":"Sessions actually completed rather than started."},
     {"key":"trust","label":"Trust","percent":15,"detail":"Verified identity, credentials and training information."},
     {"key":"reach","label":"Cross-community reach","percent":10,"detail":"Meeting people from traditions other than your own."},
     {"key":"reliability","label":"Reliability","percent":14,"detail":"Low cancellation, prompt responses, sessions kept."},
     {"key":"contribution","label":"Community contribution","percent":10,"detail":"Circles hosted, questions answered, help freely given."},
     {"key":"safety","label":"Safety","percent":10,"detail":"No upheld complaints or moderation actions."},
     {"key":"satisfaction","label":"Participant satisfaction","percent":8,"detail":"People who return and recommend."}]'::jsonb,
   'Creator Score 2.0 weights', 'How the eight score dimensions are weighted. Payment volume alone never moves a score.')
ON CONFLICT (key) DO NOTHING;

-- ------------------------------------------------------- wisdom passport ---
CREATE TABLE public.wisdom_passport_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  share_enabled boolean NOT NULL DEFAULT false,
  share_slug text UNIQUE,
  sections jsonb NOT NULL DEFAULT '{"practices":false,"traditions":false,"journeys":false,"teachers":false,"circles":false,"reflections":false}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wisdom_passport_settings TO authenticated;
GRANT ALL ON public.wisdom_passport_settings TO service_role;
ALTER TABLE public.wisdom_passport_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own passport settings" ON public.wisdom_passport_settings
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER wisdom_passport_settings_updated_at BEFORE UPDATE ON public.wisdom_passport_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ------------------------------------------------------------- discovery ---
CREATE TABLE public.themes (
  slug text PRIMARY KEY,
  label text NOT NULL,
  blurb text NOT NULL DEFAULT '',
  keywords text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.themes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.themes TO authenticated;
GRANT ALL ON public.themes TO service_role;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Themes are readable" ON public.themes FOR SELECT USING (true);
CREATE POLICY "Admins edit themes" ON public.themes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER themes_updated_at BEFORE UPDATE ON public.themes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.theme_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_slug text NOT NULL REFERENCES public.themes(slug) ON DELETE CASCADE,
  lane text NOT NULL CHECK (lane IN ('explore','practice','connect','experience','deepen')),
  target_kind text NOT NULL CHECK (target_kind IN ('topic','practice','journey','community','practitioner','episode')),
  target_ref text NOT NULL,
  note text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (theme_slug, target_kind, target_ref)
);
GRANT SELECT ON public.theme_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.theme_links TO authenticated;
GRANT ALL ON public.theme_links TO service_role;
ALTER TABLE public.theme_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Theme links are readable" ON public.theme_links FOR SELECT USING (true);
CREATE POLICY "Admins edit theme links" ON public.theme_links FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.themes (slug, label, blurb, keywords, sort_order) VALUES
  ('purpose','Purpose','What am I here to do?','{purpose,meaning,vocation,dharma,calling}',1),
  ('peace','Peace','Settling an unsettled mind.','{peace,calm,stillness,anxiety,rest}',2),
  ('meditation','Meditation','Learning to sit, and to keep sitting.','{meditation,breath,mindfulness,dhyana,zazen}',3),
  ('faith','Faith','Belief, doubt, and living with both.','{faith,belief,devotion,prayer,bhakti}',4),
  ('philosophy','Philosophy','Thinking carefully about how to live.','{philosophy,stoicism,vedanta,ethics,logic}',5),
  ('relationships','Relationships','Love, family, friendship, repair.','{relationships,love,family,marriage,friendship}',6),
  ('grief','Grief','Carrying a loss without being crushed by it.','{grief,loss,death,mourning,bereavement}',7),
  ('fear','Fear','Meeting fear without pretending it is gone.','{fear,anxiety,courage,worry}',8),
  ('meaning','Meaning','When the ordinary stops making sense.','{meaning,nihilism,absurdity,hope}',9),
  ('consciousness','Consciousness','What is aware of all this?','{consciousness,awareness,self,atman,mind}',10),
  ('compassion','Compassion','Kindness that costs something.','{compassion,karuna,mercy,charity,seva,service}',11),
  ('self-knowledge','Self-knowledge','Seeing yourself plainly.','{"self-knowledge",ego,shadow,honesty,reflection}',12),
  ('culture','Culture','Traditions, festivals, languages, memory.','{culture,tradition,festival,language,heritage}',13),
  ('new-beginnings','New beginnings','Starting again, on purpose.','{beginnings,change,renewal,transition}',14),
  ('leadership','Leadership','Responsibility for other people.','{leadership,work,responsibility,integrity}',15),
  ('life-transitions','Life transitions','Thresholds: birth, illness, ageing, moving.','{transition,illness,ageing,parenthood,retirement}',16);

-- -------------------------------------------------------- score snapshots ---
CREATE TABLE public.creator_score_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total integer NOT NULL DEFAULT 0,
  dimensions jsonb NOT NULL DEFAULT '{}'::jsonb,
  weights jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX creator_score_snapshots_user_idx ON public.creator_score_snapshots (user_id, created_at DESC);
GRANT SELECT, INSERT ON public.creator_score_snapshots TO authenticated;
GRANT ALL ON public.creator_score_snapshots TO service_role;
ALTER TABLE public.creator_score_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own score history" ON public.creator_score_snapshots FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Own score snapshot insert" ON public.creator_score_snapshots FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------- functions ---
CREATE OR REPLACE FUNCTION public.wisdom_passport_for(_uid uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'practices', (SELECT count(*) FROM public.practice_completions WHERE user_id = _uid),
    'practice_breakdown', COALESCE((
      SELECT jsonb_agg(x ORDER BY (x->>'count')::int DESC) FROM (
        SELECT jsonb_build_object('label', p.title, 'tradition', p.tradition, 'count', count(*)) AS x
        FROM public.practice_completions c JOIN public.practices p ON p.id = c.practice_id
        WHERE c.user_id = _uid GROUP BY p.title, p.tradition LIMIT 12
      ) q), '[]'::jsonb),
    'traditions', COALESCE((
      SELECT jsonb_agg(DISTINCT p.tradition) FROM public.practice_completions c
      JOIN public.practices p ON p.id = c.practice_id WHERE c.user_id = _uid AND p.tradition IS NOT NULL
    ), '[]'::jsonb),
    'journeys_started', (SELECT count(*) FROM public.journey_enrollments WHERE user_id = _uid),
    'journeys_completed', (SELECT count(*) FROM public.journey_enrollments WHERE user_id = _uid AND completed_at IS NOT NULL),
    'journey_list', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('title', j.title, 'completed', e.completed_at IS NOT NULL))
      FROM public.journey_enrollments e JOIN public.journeys j ON j.id = e.journey_id WHERE e.user_id = _uid
    ), '[]'::jsonb),
    'sessions', (SELECT count(*) FROM public.marketplace_bookings WHERE seeker_id = _uid AND status = 'completed'),
    'teachers', COALESCE((
      SELECT jsonb_agg(DISTINCT pr.display_name) FROM public.marketplace_bookings b
      JOIN public.practitioners pr ON pr.id = b.practitioner_id
      WHERE b.seeker_id = _uid AND b.status = 'completed'
    ), '[]'::jsonb),
    'circles', (SELECT count(*) FROM public.community_members WHERE user_id = _uid),
    'circle_sessions', (SELECT count(*) FROM public.circle_activity_joins WHERE user_id = _uid),
    'reflections', (SELECT count(*) FROM public.journal_entries WHERE user_id = _uid),
    'observations', (SELECT count(*) FROM public.observation_logs WHERE user_id = _uid),
    'tokens', COALESCE((SELECT sum(tokens) FROM public.path_events WHERE user_id = _uid), 0),
    'since', (SELECT created_at FROM public.profiles WHERE id = _uid)
  );
$$;

CREATE OR REPLACE FUNCTION public.my_wisdom_passport()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  RETURN public.wisdom_passport_for(auth.uid());
END; $$;

CREATE OR REPLACE FUNCTION public.shared_wisdom_passport(_slug text)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE s record; snap jsonb; res jsonb;
BEGIN
  SELECT * INTO s FROM public.wisdom_passport_settings WHERE share_slug = _slug AND share_enabled;
  IF s IS NULL THEN RETURN NULL; END IF;
  snap := public.wisdom_passport_for(s.user_id);
  res := jsonb_build_object(
    'display_name', (SELECT display_name FROM public.profiles WHERE id = s.user_id),
    'username', (SELECT username FROM public.profiles WHERE id = s.user_id),
    'since', snap -> 'since');
  IF COALESCE((s.sections ->> 'practices')::boolean, false) THEN
    res := res || jsonb_build_object('practices', snap -> 'practices', 'practice_breakdown', snap -> 'practice_breakdown');
  END IF;
  IF COALESCE((s.sections ->> 'traditions')::boolean, false) THEN
    res := res || jsonb_build_object('traditions', snap -> 'traditions');
  END IF;
  IF COALESCE((s.sections ->> 'journeys')::boolean, false) THEN
    res := res || jsonb_build_object('journeys_completed', snap -> 'journeys_completed', 'journey_list', snap -> 'journey_list');
  END IF;
  IF COALESCE((s.sections ->> 'teachers')::boolean, false) THEN
    res := res || jsonb_build_object('teachers', snap -> 'teachers', 'sessions', snap -> 'sessions');
  END IF;
  IF COALESCE((s.sections ->> 'circles')::boolean, false) THEN
    res := res || jsonb_build_object('circles', snap -> 'circles', 'circle_sessions', snap -> 'circle_sessions');
  END IF;
  IF COALESCE((s.sections ->> 'reflections')::boolean, false) THEN
    res := res || jsonb_build_object('reflections', snap -> 'reflections', 'observations', snap -> 'observations');
  END IF;
  RETURN res;
END; $$;

CREATE OR REPLACE FUNCTION public.trust_profile(_practitioner uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'id', p.id,
    'display_name', p.display_name,
    'verification_status', p.verification_status,
    'identity_verified', p.identity_verified,
    'credentials_verified', p.credentials_verified,
    'experience_verified', p.experience_verified,
    'standards_accepted', p.standards_accepted,
    'eka_recommended', p.eka_recommended,
    'languages', to_jsonb(COALESCE(p.languages, '{}')),
    'traditions', to_jsonb(COALESCE(p.traditions, '{}')),
    'location', p.location,
    'years_experience', p.years_experience,
    'member_since', p.created_at,
    'rating', p.rating,
    'review_count', p.review_count,
    'sessions_booked', (SELECT count(*) FROM public.marketplace_bookings b WHERE b.practitioner_id = p.id),
    'sessions_completed', (SELECT count(*) FROM public.marketplace_bookings b WHERE b.practitioner_id = p.id AND b.status = 'completed'),
    'sessions_cancelled', (SELECT count(*) FROM public.marketplace_bookings b WHERE b.practitioner_id = p.id AND b.status = 'cancelled'),
    'repeat_participants', (SELECT count(*) FROM (
        SELECT b.seeker_id FROM public.marketplace_bookings b
        WHERE b.practitioner_id = p.id AND b.status = 'completed'
        GROUP BY b.seeker_id HAVING count(*) > 1) r),
    'upheld_complaints', (SELECT count(*) FROM public.moderation_actions m
        WHERE m.subject_user_id = p.user_id AND m.action <> 'dismissed'),
    'safety_review', CASE WHEN p.reviewed_at IS NOT NULL THEN 'completed' ELSE 'not yet reviewed' END,
    'reviewed_at', p.reviewed_at
  )
  FROM public.practitioners p WHERE p.id = _practitioner;
$$;

CREATE OR REPLACE FUNCTION public.creator_score_breakdown(_uid uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  pr record; w jsonb; dims jsonb; total numeric := 0; item jsonb; v numeric;
  completed int; booked int; cancelled int; repeats int; complaints int; circles int; cross_t int;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  IF _uid <> auth.uid() AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'You can only view your own score.';
  END IF;

  SELECT * INTO pr FROM public.practitioners WHERE user_id = _uid LIMIT 1;
  SELECT value INTO w FROM public.platform_config WHERE key = 'score_weights_v2';

  SELECT count(*) FILTER (WHERE status = 'completed'), count(*), count(*) FILTER (WHERE status = 'cancelled')
    INTO completed, booked, cancelled
  FROM public.marketplace_bookings WHERE practitioner_id = COALESCE(pr.id, '00000000-0000-0000-0000-000000000000'::uuid);

  SELECT count(*) INTO repeats FROM (
    SELECT seeker_id FROM public.marketplace_bookings
    WHERE practitioner_id = COALESCE(pr.id, '00000000-0000-0000-0000-000000000000'::uuid) AND status = 'completed'
    GROUP BY seeker_id HAVING count(*) > 1) r;

  SELECT count(*) INTO complaints FROM public.moderation_actions
   WHERE subject_user_id = _uid AND action <> 'dismissed';
  SELECT count(*) INTO circles FROM public.circle_activities WHERE created_by = _uid;
  SELECT count(DISTINCT kind) INTO cross_t FROM public.path_events WHERE user_id = _uid AND kind = 'community';

  dims := jsonb_build_object(
    'quality', CASE WHEN COALESCE(pr.review_count,0) = 0 THEN NULL ELSE round(LEAST(COALESCE(pr.rating,0) / 5 * 100, 100)) END,
    'completion', CASE WHEN COALESCE(booked,0) = 0 THEN NULL ELSE round(completed::numeric / booked * 100) END,
    'trust', (CASE WHEN COALESCE(pr.identity_verified,false) THEN 40 ELSE 0 END
            + CASE WHEN COALESCE(pr.credentials_verified,false) THEN 30 ELSE 0 END
            + CASE WHEN COALESCE(pr.experience_verified,false) THEN 20 ELSE 0 END
            + CASE WHEN COALESCE(pr.standards_accepted,false) THEN 10 ELSE 0 END),
    'reach', LEAST(COALESCE(cross_t,0) * 25, 100),
    'reliability', CASE WHEN COALESCE(booked,0) = 0 THEN NULL ELSE round(GREATEST(100 - cancelled::numeric / booked * 100, 0)) END,
    'contribution', LEAST(COALESCE(circles,0) * 20, 100),
    'safety', GREATEST(100 - COALESCE(complaints,0) * 25, 0),
    'satisfaction', CASE WHEN COALESCE(completed,0) = 0 THEN NULL ELSE round(LEAST(repeats::numeric / GREATEST(completed,1) * 200, 100)) END
  );

  FOR item IN SELECT * FROM jsonb_array_elements(COALESCE(w, '[]'::jsonb)) LOOP
    v := (dims ->> (item ->> 'key'))::numeric;
    IF v IS NOT NULL THEN total := total + v * (item ->> 'percent')::numeric / 100; END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'user_id', _uid,
    'has_practitioner', pr.id IS NOT NULL,
    'dimensions', dims,
    'weights', COALESCE(w, '[]'::jsonb),
    'total', round(total * 10),
    'evidence', jsonb_build_object('booked', COALESCE(booked,0), 'completed', COALESCE(completed,0),
      'cancelled', COALESCE(cancelled,0), 'repeat_participants', COALESCE(repeats,0),
      'reviews', COALESCE(pr.review_count,0), 'complaints', COALESCE(complaints,0),
      'circles_hosted', COALESCE(circles,0))
  );
END; $$;