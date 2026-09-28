CREATE TABLE public.rhythm_reminders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  glyph text NOT NULL DEFAULT '🌅',
  label text NOT NULL,
  guidance text NOT NULL DEFAULT '',
  time_of_day time NOT NULL,
  days_of_week integer[] NOT NULL DEFAULT ARRAY[0,1,2,3,4,5,6],
  pillar text NOT NULL DEFAULT 'practice',
  intention text,
  active boolean NOT NULL DEFAULT true,
  notify boolean NOT NULL DEFAULT true,
  shift_suggestion_dismissed_at timestamptz,
  window_suggestion_dismissed_at timestamptz,
  intention_shown_at timestamptz,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT rhythm_pillar_ck CHECK (pillar IN ('practice','observe','journal','journey'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.rhythm_reminders TO authenticated;
GRANT ALL ON public.rhythm_reminders TO service_role;
ALTER TABLE public.rhythm_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rhythm_reminders_own" ON public.rhythm_reminders
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER rhythm_reminders_updated_at BEFORE UPDATE ON public.rhythm_reminders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.rhythm_completions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_id uuid REFERENCES public.rhythm_reminders(id) ON DELETE CASCADE,
  done_on date NOT NULL DEFAULT CURRENT_DATE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  minute_of_day integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (reminder_id, done_on)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.rhythm_completions TO authenticated;
GRANT ALL ON public.rhythm_completions TO service_role;
ALTER TABLE public.rhythm_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rhythm_completions_own" ON public.rhythm_completions
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX rhythm_completions_user_day ON public.rhythm_completions (user_id, done_on DESC);