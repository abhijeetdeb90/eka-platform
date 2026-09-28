-- ============ Your Path: token economy, observations, milestones ============

CREATE TABLE public.path_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('journey','practice','journal','observe','daily','weekly','community')),
  ref text,
  tokens integer NOT NULL DEFAULT 0,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX path_events_user_created ON public.path_events (user_id, created_at DESC);
GRANT SELECT, INSERT ON public.path_events TO authenticated;
GRANT ALL ON public.path_events TO service_role;
ALTER TABLE public.path_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY path_events_read_own ON public.path_events FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY path_events_insert_own ON public.path_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.user_path (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tradition text NOT NULL DEFAULT 'universal',
  stage text NOT NULL DEFAULT 'begin',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.user_path TO authenticated;
GRANT ALL ON public.user_path TO service_role;
ALTER TABLE public.user_path ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_path_read_own ON public.user_path FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY user_path_write_own ON public.user_path FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_path_update_own ON public.user_path FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.observation_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  body text NOT NULL,
  invitation text NOT NULL,
  tradition text NOT NULL DEFAULT 'universal',
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.observation_prompts TO authenticated, anon;
GRANT ALL ON public.observation_prompts TO service_role;
ALTER TABLE public.observation_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY observation_prompts_read ON public.observation_prompts FOR SELECT USING (true);

CREATE TABLE public.observation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id uuid REFERENCES public.observation_prompts(id) ON DELETE SET NULL,
  noticed_on date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, noticed_on)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.observation_logs TO authenticated;
GRANT ALL ON public.observation_logs TO service_role;
ALTER TABLE public.observation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY observation_logs_own ON public.observation_logs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.path_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, code)
);
GRANT SELECT, INSERT ON public.path_milestones TO authenticated;
GRANT ALL ON public.path_milestones TO service_role;
ALTER TABLE public.path_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY path_milestones_read_own ON public.path_milestones FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY path_milestones_insert_own ON public.path_milestones FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Tokens are earned, never bought. Diminishing returns keep repetition honest:
-- the first sincere action of a kind each day earns in full, the next half,
-- the third a quarter, and beyond that the action still counts but earns nothing.
CREATE OR REPLACE FUNCTION public.award_path_tokens(_kind text, _base integer, _ref text DEFAULT NULL, _note text DEFAULT NULL)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _today integer;
  _awarded integer;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not signed in';
  END IF;
  IF _kind NOT IN ('journey','practice','journal','observe','daily','weekly','community') THEN
    RAISE EXCEPTION 'Unknown path action';
  END IF;

  SELECT count(*) INTO _today
  FROM public.path_events
  WHERE user_id = _uid AND kind = _kind
    AND created_at >= date_trunc('day', now());

  _awarded := CASE
    WHEN _today = 0 THEN least(_base, 200)
    WHEN _today = 1 THEN (least(_base, 200) / 2)
    WHEN _today = 2 THEN (least(_base, 200) / 4)
    ELSE 0
  END;

  INSERT INTO public.path_events (user_id, kind, ref, tokens, note)
  VALUES (_uid, _kind, _ref, _awarded, _note);

  RETURN _awarded;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.award_path_tokens(text, integer, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.award_path_tokens(text, integer, text, text) TO authenticated;

INSERT INTO public.observation_prompts (body, invitation, tradition, sort_order) VALUES
('Notice the first thought that appears when you wake up.', 'Do not change it. Just observe.', 'universal', 1),
('Notice one moment today when you reacted before thinking.', 'No blame. Only see it.', 'universal', 2),
('Observe something beautiful without photographing it.', 'Let it pass through you and be gone.', 'universal', 3),
('Notice where your attention goes when you are bored.', 'Follow it once, then let it settle.', 'universal', 4),
('Notice one recurring thought that visits you today.', 'Name it quietly when it arrives.', 'universal', 5),
('Observe your breath at one ordinary moment — a queue, a lift, a red light.', 'Three breaths is enough.', 'universal', 6),
('Notice a kindness you received and did not acknowledge.', 'Hold it for a moment before moving on.', 'universal', 7),
('Notice the moment you decide to pick up your phone.', 'Watch the impulse rather than obeying it.', 'universal', 8),
('Observe one sound you usually filter out.', 'Let it be as it is.', 'universal', 9),
('Notice how you speak to yourself when you make a small mistake.', 'Simply listen to the tone.', 'universal', 10),
('Notice the pause between two thoughts.', 'That gap is the practice.', 'buddhist', 11),
('Observe one thing today that has already begun to change.', 'Impermanence, seen directly.', 'buddhist', 12),
('Notice where the mantra continues without effort.', 'Ajapa — the unrepeated repetition.', 'hindu', 13),
('Observe one act you performed today without wanting anything back.', 'That is seva.', 'hindu', 14),
('Notice one moment today that felt like grace.', 'Receive it without explaining it.', 'christian', 15),
('Observe where you were asked to serve and hesitated.', 'Only notice. Tomorrow is available.', 'christian', 16),
('Notice how often you say a word of gratitude without meaning it.', 'Then say one and mean it.', 'islamic', 17),
('Observe your character in one small transaction today.', 'Akhlaq is built in the ordinary.', 'islamic', 18),
('Notice one moment when remembrance arose by itself.', 'Simran continues underneath the day.', 'sikh', 19),
('Observe one moment when you could have caused harm and did not.', 'Ahimsa in the small scale.', 'jain', 20);