
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  faith TEXT,
  tradition TEXT,
  goals TEXT[] NOT NULL DEFAULT '{}',
  observances TEXT[] NOT NULL DEFAULT '{}',
  onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  faith TEXT NOT NULL,
  tradition TEXT,
  category TEXT NOT NULL,
  duration_minutes INT NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,
  source_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.practices TO anon, authenticated;
GRANT ALL ON public.practices TO service_role;
ALTER TABLE public.practices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "practices_public_read" ON public.practices FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.scripture_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faith TEXT NOT NULL,
  tradition TEXT,
  source TEXT NOT NULL,
  book TEXT,
  chapter TEXT,
  passage TEXT NOT NULL,
  explanation TEXT,
  day_index INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.scripture_readings TO anon, authenticated;
GRANT ALL ON public.scripture_readings TO service_role;
ALTER TABLE public.scripture_readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "readings_public_read" ON public.scripture_readings FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.observances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faith TEXT NOT NULL,
  tradition TEXT,
  name TEXT NOT NULL,
  calendar_type TEXT NOT NULL DEFAULT 'gregorian',
  observance_date DATE NOT NULL,
  end_date DATE,
  is_fast BOOLEAN NOT NULL DEFAULT false,
  fast_type TEXT,
  location_dependent BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  source_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.observances TO anon, authenticated;
GRANT ALL ON public.observances TO service_role;
ALTER TABLE public.observances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "observances_public_read" ON public.observances FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.practice_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  practice_id UUID REFERENCES public.practices ON DELETE SET NULL,
  completed_on DATE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.practice_completions TO authenticated;
GRANT ALL ON public.practice_completions TO service_role;
ALTER TABLE public.practice_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "practice_completions_own" ON public.practice_completions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.reading_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  reading_id UUID REFERENCES public.scripture_readings ON DELETE SET NULL,
  completed_on DATE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_completions TO authenticated;
GRANT ALL ON public.reading_completions TO service_role;
ALTER TABLE public.reading_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reading_completions_own" ON public.reading_completions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.fast_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  observance_id UUID REFERENCES public.observances ON DELETE SET NULL,
  label TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  reflection TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fast_logs TO authenticated;
GRANT ALL ON public.fast_logs TO service_role;
ALTER TABLE public.fast_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fast_logs_own" ON public.fast_logs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  content TEXT NOT NULL,
  mood TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journal_entries TO authenticated;
GRANT ALL ON public.journal_entries TO service_role;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "journal_own" ON public.journal_entries FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER journal_updated_at BEFORE UPDATE ON public.journal_entries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.practices (title, faith, tradition, category, duration_minutes, description, instructions, source_reference) VALUES
('Morning Stillness', 'Other', NULL, 'Meditation', 5, 'A short seated stillness to begin the day with attention.', 'Sit comfortably. Let the breath settle. Rest attention on the breath for five minutes, returning gently whenever the mind wanders.', 'General contemplative practice'),
('Breath and Gratitude', 'Other', NULL, 'Gratitude', 3, 'Name three things you are grateful for, one per breath.', 'Breathe in slowly. On each out-breath, name one thing you are grateful for. Repeat three times, then sit quietly.', 'General contemplative practice'),
('Evening Reflection', 'Other', NULL, 'Reflection', 11, 'Review the day with honesty and kindness.', 'Recall the day from waking to now. Notice where you felt close to your values, and where you drifted. Close with one intention for tomorrow.', 'General contemplative practice'),
('Dhikr of Remembrance', 'Islam', NULL, 'Mantra / Dhikr / Chant', 5, 'A quiet repetition of remembrance phrases.', 'Sit facing a calm space. Repeat SubhanAllah, Alhamdulillah and Allahu Akbar slowly, 33 times each, at a pace that stays unhurried.', 'Traditional tasbih after prayer'),
('Preparing for Salah', 'Islam', NULL, 'Prayer', 5, 'Settle the heart before the obligatory prayer.', 'Complete wudu without hurry. Sit for a minute before standing. Bring to mind the meaning of the opening words before you begin.', 'Traditional preparation'),
('Lectio Divina', 'Christianity', NULL, 'Scripture', 21, 'Slow, prayerful reading of a short passage.', 'Read the passage aloud slowly. Read it again in silence. Notice one word that stays with you. Rest with that word, then respond in your own words.', 'Benedictine tradition'),
('The Examen', 'Christianity', 'Catholic', 'Reflection', 11, 'A daily review of consolation and desolation.', 'Give thanks for the day. Ask for light. Review the hours. Notice what drew you closer and what pulled you away. Look toward tomorrow.', 'Ignatian tradition'),
('Japa with the Breath', 'Hinduism', NULL, 'Mantra / Dhikr / Chant', 11, 'Repetition of a chosen mantra with a mala or breath.', 'Choose a mantra from your own tradition or teacher. Repeat it silently with each breath for eleven minutes. End with a moment of stillness.', 'Traditional japa practice'),
('Evening Diya Reflection', 'Hinduism', NULL, 'Guided rituals', 5, 'A short lamp-lighting reflection at dusk.', 'Light a lamp or candle at dusk. Sit before it. Offer a moment of gratitude for the day and a wish for the wellbeing of others.', 'Household practice; consult your own tradition'),
('Modeh Ani Morning Practice', 'Judaism', NULL, 'Prayer', 3, 'Begin the day with gratitude for waking.', 'Before rising, pause. Offer thanks for the return of breath and awareness. Sit for a moment before beginning the day.', 'Traditional morning practice'),
('Shabbat Preparation', 'Judaism', NULL, 'Reflection', 11, 'Set down the week before rest begins.', 'Before candle-lighting, write or name what you are setting down from the week. Prepare the table without rushing.', 'Traditional preparation'),
('Simran in Stillness', 'Sikhism', NULL, 'Mantra / Dhikr / Chant', 11, 'Quiet remembrance in the early hours.', 'Sit upright in a quiet space. Let the remembrance settle with the breath. Keep the pace slow and steady for eleven minutes.', 'Traditional simran'),
('Anapanasati', 'Buddhism', NULL, 'Meditation', 21, 'Mindfulness of breathing.', 'Sit with a straight, relaxed spine. Know the breath as long or short. Follow the whole length of each breath. When the mind wanders, begin again.', 'Anapanasati Sutta (traditional)'),
('Metta for the Day', 'Buddhism', NULL, 'Meditation', 11, 'Loving-kindness for self and others.', 'Offer kind phrases to yourself, then to someone you love, then to someone neutral, then to all beings. Keep the phrases simple and repeat slowly.', 'Traditional metta practice'),
('Thirty Minutes of Silence', 'Other', NULL, 'Meditation', 30, 'An extended sit without technique or agenda.', 'Sit without a task. Let thoughts come and go. Nothing to fix, nothing to reach. End slowly.', 'General contemplative practice');

INSERT INTO public.scripture_readings (faith, source, book, chapter, passage, explanation, day_index) VALUES
('Christianity', 'Bible', 'Psalms', '46', 'Be still, and know that I am God.', 'A short verse often used as an anchor for contemplative prayer. Read it slowly and let it settle before moving on.', 1),
('Christianity', 'Bible', 'Matthew', '6', 'Consider the lilies of the field, how they grow.', 'A teaching on trust and provision. Sit with the image before reading commentary.', 2),
('Islam', 'Qur''an', 'Surah Ash-Sharh', '94', 'Indeed, with hardship comes ease.', 'A widely recited verse of reassurance. Consult your own teacher or a reviewed tafsir for interpretation.', 1),
('Hinduism', 'Bhagavad Gita', 'Chapter 2', '2.47', 'You have a right to your actions, but never to the fruits of your actions.', 'A central teaching on non-attachment to outcomes. Commentaries differ across traditions.', 1),
('Judaism', 'Tanakh', 'Micah', '6', 'To do justice, to love kindness, and to walk humbly.', 'A summary verse often used for reflection on daily conduct.', 1),
('Sikhism', 'Guru Granth Sahib', 'Japji Sahib', 'Mool Mantar', 'There is one reality, whose name is truth.', 'The opening statement of the Guru Granth Sahib. Read within the guidance of your own tradition.', 1),
('Buddhism', 'Dhammapada', 'Chapter 1', '1', 'All that we are is the result of what we have thought.', 'An opening verse on the shaping power of mind and intention.', 1),
('Other', 'Reflection', NULL, NULL, 'Today, notice one moment you would otherwise have passed by.', 'A non-scriptural reflection prompt for members who have not selected a tradition.', 1);

INSERT INTO public.observances (faith, name, calendar_type, observance_date, end_date, is_fast, fast_type, location_dependent, description, source_reference) VALUES
('Islam', 'Ramadan (begins)', 'lunar', '2026-02-17', '2026-03-19', true, 'Dawn to sunset fast', true, 'The month of fasting. Local start dates depend on moon sighting.', 'Local moon sighting; confirm with your community'),
('Islam', 'Eid al-Fitr', 'lunar', '2026-03-20', NULL, false, NULL, true, 'The festival marking the end of Ramadan.', 'Local moon sighting'),
('Islam', 'Day of Arafah', 'lunar', '2026-05-26', NULL, true, 'Optional day fast', true, 'A day of fasting and supplication for those not on Hajj.', 'Traditional practice'),
('Christianity', 'Ash Wednesday', 'gregorian', '2026-02-18', NULL, true, 'Fast and abstinence', false, 'The beginning of Lent in Western churches.', 'Western liturgical calendar'),
('Christianity', 'Good Friday', 'gregorian', '2026-04-03', NULL, true, 'Fast and abstinence', false, 'Commemoration of the crucifixion.', 'Western liturgical calendar'),
('Christianity', 'Easter Sunday', 'gregorian', '2026-04-05', NULL, false, NULL, false, 'The central feast of the Christian year.', 'Western liturgical calendar'),
('Christianity', 'Christmas Day', 'gregorian', '2026-12-25', NULL, false, NULL, false, 'The feast of the Nativity.', 'Western liturgical calendar'),
('Hinduism', 'Maha Shivaratri', 'lunar', '2026-02-15', NULL, true, 'Day and night fast (varies)', true, 'A night of vigil and fasting. Observance varies by region and tradition.', 'Regional panchang'),
('Hinduism', 'Holi', 'lunar', '2026-03-04', NULL, false, NULL, true, 'The festival of colours.', 'Regional panchang'),
('Hinduism', 'Diwali', 'lunar', '2026-11-08', NULL, false, NULL, true, 'The festival of lights. Dates vary by region.', 'Regional panchang'),
('Judaism', 'Passover (begins)', 'lunar', '2026-04-01', '2026-04-09', false, NULL, true, 'The festival of freedom, beginning at sundown.', 'Hebrew calendar'),
('Judaism', 'Rosh Hashanah', 'lunar', '2026-09-12', '2026-09-14', false, NULL, true, 'The Jewish new year, beginning at sundown.', 'Hebrew calendar'),
('Judaism', 'Yom Kippur', 'lunar', '2026-09-21', NULL, true, 'Full day fast', true, 'The Day of Atonement.', 'Hebrew calendar'),
('Sikhism', 'Vaisakhi', 'lunar', '2026-04-14', NULL, false, NULL, false, 'Commemoration of the founding of the Khalsa.', 'Nanakshahi calendar'),
('Sikhism', 'Guru Nanak Gurpurab', 'lunar', '2026-11-24', NULL, false, NULL, false, 'The birth anniversary of Guru Nanak.', 'Nanakshahi calendar'),
('Buddhism', 'Vesak', 'lunar', '2026-05-31', NULL, false, NULL, true, 'Commemoration of the birth, awakening and passing of the Buddha. Dates vary by country.', 'Regional Buddhist calendars'),
('Buddhism', 'Uposatha (full moon)', 'lunar', '2026-09-26', NULL, true, 'Eight precepts observance', true, 'A traditional observance day kept on lunar quarter days.', 'Traditional monastic calendar');
