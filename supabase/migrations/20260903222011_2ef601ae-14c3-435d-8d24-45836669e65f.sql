CREATE TABLE public.practitioners (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  display_name text NOT NULL,
  headline text NOT NULL DEFAULT '',
  about text NOT NULL DEFAULT '',
  avatar_url text,
  categories text[] NOT NULL DEFAULT '{}',
  traditions text[] NOT NULL DEFAULT '{}',
  expertise text[] NOT NULL DEFAULT '{}',
  languages text[] NOT NULL DEFAULT '{}',
  mode text NOT NULL DEFAULT 'online',
  location text,
  years_experience integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  identity_verified boolean NOT NULL DEFAULT false,
  credentials_verified boolean NOT NULL DEFAULT false,
  experience_verified boolean NOT NULL DEFAULT false,
  standards_accepted boolean NOT NULL DEFAULT false,
  eka_recommended boolean NOT NULL DEFAULT false,
  rating numeric(2,1) NOT NULL DEFAULT 0,
  review_count integer NOT NULL DEFAULT 0,
  session_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.practitioners TO authenticated;
GRANT ALL ON public.practitioners TO service_role;
ALTER TABLE public.practitioners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "practitioners_read_active" ON public.practitioners FOR SELECT TO authenticated USING (status = 'active' OR user_id = auth.uid());
CREATE POLICY "practitioners_insert_own" ON public.practitioners FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "practitioners_update_own" ON public.practitioners FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "practitioners_delete_own" ON public.practitioners FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE TRIGGER practitioners_updated_at BEFORE UPDATE ON public.practitioners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.practitioner_packages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  practitioner_id uuid NOT NULL REFERENCES public.practitioners(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  duration_minutes integer NOT NULL DEFAULT 60,
  sessions_count integer NOT NULL DEFAULT 1,
  payout_cents integer NOT NULL,
  price_cents integer NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.practitioner_packages TO authenticated;
GRANT ALL ON public.practitioner_packages TO service_role;
ALTER TABLE public.practitioner_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "packages_read" ON public.practitioner_packages FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.practitioners p WHERE p.id = practitioner_id AND (p.status = 'active' OR p.user_id = auth.uid()))
);
CREATE POLICY "packages_write_own" ON public.practitioner_packages FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.practitioners p WHERE p.id = practitioner_id AND p.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.practitioners p WHERE p.id = practitioner_id AND p.user_id = auth.uid()));

CREATE TABLE public.practitioner_slots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  practitioner_id uuid NOT NULL REFERENCES public.practitioners(id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  booked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.practitioner_slots TO authenticated;
GRANT ALL ON public.practitioner_slots TO service_role;
ALTER TABLE public.practitioner_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "slots_read" ON public.practitioner_slots FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.practitioners p WHERE p.id = practitioner_id AND (p.status = 'active' OR p.user_id = auth.uid()))
);
CREATE POLICY "slots_write_own" ON public.practitioner_slots FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.practitioners p WHERE p.id = practitioner_id AND p.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.practitioners p WHERE p.id = practitioner_id AND p.user_id = auth.uid()));
CREATE POLICY "slots_book" ON public.practitioner_slots FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.marketplace_bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seeker_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practitioner_id uuid NOT NULL REFERENCES public.practitioners(id) ON DELETE CASCADE,
  package_id uuid REFERENCES public.practitioner_packages(id) ON DELETE SET NULL,
  slot_id uuid REFERENCES public.practitioner_slots(id) ON DELETE SET NULL,
  package_title text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  starts_at timestamptz,
  price_cents integer NOT NULL,
  fee_cents integer NOT NULL,
  payout_cents integer NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  join_url text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.marketplace_bookings TO authenticated;
GRANT ALL ON public.marketplace_bookings TO service_role;
ALTER TABLE public.marketplace_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings_read_own" ON public.marketplace_bookings FOR SELECT TO authenticated USING (
  seeker_id = auth.uid() OR EXISTS (SELECT 1 FROM public.practitioners p WHERE p.id = practitioner_id AND p.user_id = auth.uid())
);
CREATE POLICY "bookings_insert_own" ON public.marketplace_bookings FOR INSERT TO authenticated WITH CHECK (seeker_id = auth.uid());
CREATE POLICY "bookings_update_party" ON public.marketplace_bookings FOR UPDATE TO authenticated USING (
  seeker_id = auth.uid() OR EXISTS (SELECT 1 FROM public.practitioners p WHERE p.id = practitioner_id AND p.user_id = auth.uid())
) WITH CHECK (
  seeker_id = auth.uid() OR EXISTS (SELECT 1 FROM public.practitioners p WHERE p.id = practitioner_id AND p.user_id = auth.uid())
);
CREATE TRIGGER marketplace_bookings_updated_at BEFORE UPDATE ON public.marketplace_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.marketplace_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id uuid NOT NULL UNIQUE REFERENCES public.marketplace_bookings(id) ON DELETE CASCADE,
  practitioner_id uuid NOT NULL REFERENCES public.practitioners(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL,
  body text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.marketplace_reviews TO authenticated;
GRANT ALL ON public.marketplace_reviews TO service_role;
ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_read" ON public.marketplace_reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "reviews_insert_completed" ON public.marketplace_reviews FOR INSERT TO authenticated WITH CHECK (
  reviewer_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.marketplace_bookings b
    WHERE b.id = booking_id AND b.seeker_id = auth.uid() AND b.status = 'completed'
  )
);
CREATE POLICY "reviews_update_own" ON public.marketplace_reviews FOR UPDATE TO authenticated USING (reviewer_id = auth.uid()) WITH CHECK (reviewer_id = auth.uid());

CREATE OR REPLACE FUNCTION public.sync_practitioner_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.practitioners p
  SET rating = COALESCE((SELECT ROUND(AVG(r.rating)::numeric, 1) FROM public.marketplace_reviews r WHERE r.practitioner_id = p.id), 0),
      review_count = (SELECT COUNT(*) FROM public.marketplace_reviews r WHERE r.practitioner_id = p.id)
  WHERE p.id = COALESCE(NEW.practitioner_id, OLD.practitioner_id);
  RETURN NULL;
END;
$$;
CREATE TRIGGER marketplace_reviews_sync AFTER INSERT OR UPDATE OR DELETE ON public.marketplace_reviews
FOR EACH ROW EXECUTE FUNCTION public.sync_practitioner_rating();

INSERT INTO public.practitioners (slug, display_name, headline, about, categories, traditions, expertise, languages, mode, location, years_experience, status, identity_verified, credentials_verified, experience_verified, standards_accepted, eka_recommended, rating, review_count, session_count) VALUES
('acharya-ananda', 'Acharya Ananda', 'Vedanta, meditation and self-inquiry', 'Teacher of Vedanta and meditation with experience conducting individual consultations, group sessions and retreats.', ARRAY['spiritual-guidance','gurus','meditation'], ARRAY['Vedanta'], ARRAY['Vedanta','Meditation','Self-inquiry','Spiritual counselling','Sanskrit texts'], ARRAY['English','Hindi','Sanskrit'], 'online', 'Rishikesh', 15, 'active', true, true, true, true, true, 4.9, 126, 340),
('maitri-rao', 'Maitri Rao', 'Therapeutic yoga and breath work', 'Yoga therapist working with posture, breath and long-term programmes for people returning to practice after injury or burnout.', ARRAY['yoga','wellness'], ARRAY['Hatha'], ARRAY['Therapeutic yoga','Pranayama','Restorative practice','4-week programmes'], ARRAY['English','Kannada'], 'both', 'Bengaluru', 9, 'active', true, true, true, true, false, 4.8, 74, 210),
('pandit-vishal-sharma', 'Pandit Vishal Sharma', 'Puja, ceremonies and ritual guidance', 'Performs household and festival ceremonies, and helps families understand the meaning behind each step of a ritual.', ARRAY['religious-services','rituals'], ARRAY['Hindu'], ARRAY['Puja','Griha pravesh','Festival services','Ritual guidance'], ARRAY['Hindi','Sanskrit','English'], 'both', 'Varanasi', 22, 'active', true, true, true, true, false, 4.9, 188, 520),
('jyotishi-meera-nair', 'Meera Nair', 'Vedic astrology, read as a traditional practice', 'Birth chart study in the Parashari tradition. Sessions are offered as reflective guidance rooted in tradition, not as guaranteed prediction.', ARRAY['astrology'], ARRAY['Vedic'], ARRAY['Birth chart','Relationship reading','Career consultation','Muhurta','Annual forecast'], ARRAY['English','Malayalam','Tamil'], 'online', 'Kochi', 12, 'active', true, false, true, true, false, 4.7, 96, 260),
('bhante-sujato', 'Bhante Sujato', 'Insight meditation and satsang', 'Monastic teacher offering guided insight practice, evening talks and long-term mentorship for lay practitioners.', ARRAY['meditation','talks','gurus'], ARRAY['Theravada'], ARRAY['Vipassana','Metta','Dhamma talks','Mentorship'], ARRAY['English'], 'online', 'Colombo', 18, 'active', true, true, true, true, true, 5.0, 58, 140),
('leela-fernandes', 'Leela Fernandes', 'Sound, breath and grief companionship', 'Wellness practitioner working with sound, breath and quiet accompaniment for people moving through grief and change.', ARRAY['wellness','spiritual-guidance'], ARRAY['Interfaith'], ARRAY['Sound practice','Breath work','Grief companionship'], ARRAY['English','Konkani'], 'both', 'Goa', 6, 'active', true, false, false, true, false, 4.6, 21, 60);

INSERT INTO public.practitioner_packages (practitioner_id, title, description, duration_minutes, sessions_count, payout_cents, price_cents, sort_order)
SELECT p.id, v.title, v.description, v.duration, v.sessions, v.payout, ROUND(v.payout / 0.9)::int, v.ord
FROM public.practitioners p
JOIN (VALUES
  ('acharya-ananda','Introductory Session','A first conversation about where your practice is now.',30,1,62900,1),
  ('acharya-ananda','Personal Guidance','One-to-one guidance on meditation and self-inquiry.',60,1,134900,2),
  ('acharya-ananda','Deep-Dive Consultation','An extended sitting on a question you keep returning to.',90,1,224900,3),
  ('acharya-ananda','4-Session Journey','Four sessions over a month, with practice between them.',60,4,494900,4),
  ('maitri-rao','Personal Yoga Session','A practice built around your body today.',60,1,89900,1),
  ('maitri-rao','Therapeutic Yoga','Focused work with injury, pain or fatigue.',60,1,124900,2),
  ('maitri-rao','4-Week Programme','Four weekly sessions with a home practice.',60,4,449900,3),
  ('pandit-vishal-sharma','Ritual Guidance Call','Understand what a ceremony asks of you before it happens.',30,1,49900,1),
  ('pandit-vishal-sharma','Online Puja','A ceremony performed with you present online.',90,1,159900,2),
  ('pandit-vishal-sharma','Festival Service','Ceremony for a festival day, at home or online.',120,1,249900,3),
  ('jyotishi-meera-nair','Birth Chart Consultation','A first reading of your chart in the Parashari tradition.',60,1,149900,1),
  ('jyotishi-meera-nair','Relationship Reading','Two charts read side by side.',60,1,179900,2),
  ('jyotishi-meera-nair','Annual Forecast','The coming year, read as a set of seasons.',90,1,229900,3),
  ('bhante-sujato','Meditation Initiation','Begin a practice, with instruction you can return to.',45,1,69900,1),
  ('bhante-sujato','Philosophy Session','A single text or teaching, read slowly together.',60,1,99900,2),
  ('bhante-sujato','Long-term Mentorship','Six sessions across three months.',60,6,549900,3),
  ('leela-fernandes','Sound & Breath Session','A quiet hour of sound and breath.',60,1,79900,1),
  ('leela-fernandes','Grief Companionship','Unhurried accompaniment, no advice given.',60,1,99900,2)
) AS v(slug,title,description,duration,sessions,payout,ord) ON v.slug = p.slug;

INSERT INTO public.practitioner_slots (practitioner_id, starts_at)
SELECT p.id, date_trunc('hour', now()) + (d || ' days')::interval + (h || ' hours')::interval
FROM public.practitioners p
CROSS JOIN generate_series(1, 6) AS d
CROSS JOIN (VALUES (8), (12), (19)) AS t(h);