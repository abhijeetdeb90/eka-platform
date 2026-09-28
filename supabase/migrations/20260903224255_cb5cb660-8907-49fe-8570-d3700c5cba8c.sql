CREATE TABLE public.rhythm_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_in_app boolean NOT NULL DEFAULT true,
  channel_browser boolean NOT NULL DEFAULT false,
  channel_email boolean NOT NULL DEFAULT false,
  dnd_enabled boolean NOT NULL DEFAULT false,
  dnd_start time NOT NULL DEFAULT '22:00:00',
  dnd_end time NOT NULL DEFAULT '06:00:00',
  moments_per_day integer NOT NULL DEFAULT 4,
  auto_adjust boolean NOT NULL DEFAULT true,
  checkins_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.rhythm_settings TO authenticated;
GRANT ALL ON public.rhythm_settings TO service_role;
ALTER TABLE public.rhythm_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rhythm_settings_own" ON public.rhythm_settings FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER rhythm_settings_updated_at BEFORE UPDATE ON public.rhythm_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.rhythm_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_id uuid REFERENCES public.rhythm_reminders(id) ON DELETE CASCADE,
  done_on date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  intention_note text NOT NULL DEFAULT '',
  reflection text NOT NULL DEFAULT '',
  mood text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (reminder_id, done_on)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.rhythm_checkins TO authenticated;
GRANT ALL ON public.rhythm_checkins TO service_role;
ALTER TABLE public.rhythm_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rhythm_checkins_own" ON public.rhythm_checkins FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER rhythm_checkins_updated_at BEFORE UPDATE ON public.rhythm_checkins
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX rhythm_checkins_user_day ON public.rhythm_checkins (user_id, done_on DESC);

CREATE TABLE public.rhythm_adjustments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_id uuid NOT NULL REFERENCES public.rhythm_reminders(id) ON DELETE CASCADE,
  kind text NOT NULL,
  reason text NOT NULL,
  from_time time,
  to_time time,
  from_days integer[],
  to_days integer[],
  reverted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.rhythm_adjustments TO authenticated;
GRANT ALL ON public.rhythm_adjustments TO service_role;
ALTER TABLE public.rhythm_adjustments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rhythm_adjustments_own" ON public.rhythm_adjustments FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX rhythm_adjustments_user_created ON public.rhythm_adjustments (user_id, created_at DESC);