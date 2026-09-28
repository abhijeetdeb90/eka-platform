CREATE TABLE public.practices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  tradition text NOT NULL,
  category text NOT NULL DEFAULT 'Meditation',
  duration_min integer NOT NULL DEFAULT 10,
  summary text NOT NULL DEFAULT '',
  steps text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.practices TO authenticated;
GRANT ALL ON public.practices TO service_role;
ALTER TABLE public.practices ENABLE ROW LEVEL SECURITY;
CREATE POLICY practices_read ON public.practices FOR SELECT TO authenticated USING (true);

CREATE TABLE public.readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tradition text NOT NULL,
  title text NOT NULL,
  source text NOT NULL DEFAULT '',
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.readings TO authenticated;
GRANT ALL ON public.readings TO service_role;
ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY readings_read ON public.readings FOR SELECT TO authenticated USING (true);

CREATE TABLE public.observances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tradition text NOT NULL,
  observed_on date NOT NULL,
  description text NOT NULL DEFAULT '',
  fasting boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.observances TO authenticated;
GRANT ALL ON public.observances TO service_role;
ALTER TABLE public.observances ENABLE ROW LEVEL SECURITY;
CREATE POLICY observances_read ON public.observances FOR SELECT TO authenticated USING (true);

CREATE TABLE public.practice_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_id uuid NOT NULL REFERENCES public.practices(id) ON DELETE CASCADE,
  completed_on date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, practice_id, completed_on)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.practice_completions TO authenticated;
GRANT ALL ON public.practice_completions TO service_role;
ALTER TABLE public.practice_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY completions_own ON public.practice_completions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.fasting_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  observance_id uuid REFERENCES public.observances(id) ON DELETE SET NULL,
  label text NOT NULL DEFAULT 'Fast',
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fasting_logs TO authenticated;
GRANT ALL ON public.fasting_logs TO service_role;
ALTER TABLE public.fasting_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY fasting_own ON public.fasting_logs FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

INSERT INTO public.practices (slug, title, tradition, category, duration_min, summary, steps) VALUES
('so-hum-breath','So-Hum Breath','Hindu','Breathwork',10,'Ride the natural sound of the breath: So on the inhale, Hum on the exhale.',ARRAY['Sit upright and soften the shoulders.','Inhale slowly, hearing "So".','Exhale slowly, hearing "Hum".','Let the mantra fade until only breath remains.']),
('surya-namaskar','Surya Namaskar','Hindu','Movement',15,'Twelve flowing postures offered to the sun to awaken body and mind.',ARRAY['Stand tall, palms at the heart.','Move with the breath through the twelve postures.','Complete three to six rounds.','Rest and feel the warmth settle.']),
('anapanasati','Anapanasati','Buddhist','Meditation',20,'Mindfulness of breathing, the foundational practice taught by the Buddha.',ARRAY['Settle into a stable, comfortable posture.','Notice the breath at the nostrils.','Know a long breath as long, a short breath as short.','Return gently whenever the mind wanders.']),
('metta','Metta — Loving Kindness','Buddhist','Meditation',15,'Extend goodwill outward, from yourself to all beings.',ARRAY['Begin with yourself: may I be well.','Offer the same to someone you love.','Extend to a stranger, then someone difficult.','Finally, offer it to all beings everywhere.']),
('simran','Naam Simran','Sikh','Mantra',15,'Remembrance of the divine name in stillness.',ARRAY['Sit quietly before dawn if you can.','Repeat Waheguru with the breath.','Let attention rest in the sound.','Close with a moment of gratitude.']),
('sewa-reflection','Sewa Reflection','Sikh','Reflection',5,'A short reflection on selfless service offered today.',ARRAY['Recall one act of service you offered.','Notice the intention behind it.','Ask where service is needed tomorrow.','Offer that intention silently.']),
('lectio-divina','Lectio Divina','Christian','Scripture',20,'A slow, prayerful reading of scripture in four movements.',ARRAY['Read a short passage slowly.','Meditate on the word that stands out.','Pray honestly in response.','Rest in silence.']),
('examen','The Daily Examen','Christian','Reflection',10,'An Ignatian review of the day in gratitude and honesty.',ARRAY['Become aware of presence.','Review the day with gratitude.','Notice where you felt closest and furthest.','Ask for grace for tomorrow.']),
('dhikr','Dhikr','Islamic','Mantra',10,'Rhythmic remembrance of God through repeated phrases.',ARRAY['Sit facing a quiet direction.','Repeat SubhanAllah, Alhamdulillah, Allahu Akbar.','Let the tongue slow and the heart follow.','Finish with a silent pause.']),
('tahajjud-reflection','Night Reflection','Islamic','Reflection',10,'A quiet night-time turning of the heart.',ARRAY['Rise in the last third of the night if you can.','Sit in stillness before words.','Speak what is heaviest.','Listen for what remains.']),
('samayika','Samayika','Jain','Meditation',48,'Forty-eight minutes of equanimity, free from harm in thought and deed.',ARRAY['Choose a fixed, undisturbed place.','Vow non-harm for this period.','Sit with the breath and the mind at rest.','Close by dedicating the calm outward.']),
('pratikraman','Pratikraman Reflection','Jain','Reflection',15,'A review of the day, seeking forgiveness for harm caused.',ARRAY['Recall the day honestly.','Notice harm caused in thought, word or deed.','Ask forgiveness inwardly.','Set an intention of care.']);

INSERT INTO public.readings (tradition, title, source, body) VALUES
('Hindu','You Are That','Chandogya Upanishad 6.8.7','That which is the subtle essence — in it all that exists has its self. That is the truth. That is the self. Tat tvam asi.'),
('Buddhist','All That We Are','Dhammapada 1','All that we are is the result of what we have thought. It is founded on our thoughts, it is made up of our thoughts.'),
('Sikh','One Reality','Japji Sahib','There is one reality, the eternal truth, the creator, without fear, without hatred, timeless in form, unborn, self-existent.'),
('Christian','Be Still','Psalm 46:10','Be still, and know that I am God.'),
('Islamic','Hearts Find Rest','Qur''an 13:28','Verily, in the remembrance of God do hearts find rest.'),
('Jain','Souls Serve One Another','Tattvartha Sutra 5.21','Souls render service to one another.');

INSERT INTO public.observances (name, tradition, observed_on, description, fasting) VALUES
('Makar Sankranti','Hindu','2026-01-14','The sun turns north — a festival of light, harvest and new movement.',false),
('Maha Shivaratri','Hindu','2026-02-15','A night of vigil, mantra and fasting in honour of Shiva.',true),
('Holi','Hindu','2026-03-03','The festival of colour and joyful renewal.',false),
('Ram Navami','Hindu','2026-03-26','The birth of Rama, marked with reading and fasting.',true),
('Janmashtami','Hindu','2026-09-04','The birth of Krishna, observed with night vigil and fasting.',true),
('Diwali','Hindu','2026-11-08','The festival of lights and inner illumination.',false),
('Magha Puja','Buddhist','2026-03-03','A day of assembly, precepts and moral purification.',false),
('Vesak','Buddhist','2026-05-01','The birth, awakening and passing of the Buddha.',false),
('Asalha Puja','Buddhist','2026-07-29','The Buddha''s first teaching at Sarnath.',false),
('Vassa Begins','Buddhist','2026-07-30','The rains retreat: three months of deepened practice.',false),
('Guru Gobind Singh Jayanti','Sikh','2026-01-05','The birth of the tenth Guru.',false),
('Vaisakhi','Sikh','2026-04-14','The founding of the Khalsa.',false),
('Martyrdom of Guru Arjan Dev','Sikh','2026-06-16','A day of remembrance and service.',false),
('Guru Nanak Jayanti','Sikh','2026-11-24','The birth of Guru Nanak, founder of the Sikh path.',false),
('Ash Wednesday','Christian','2026-02-18','The beginning of Lent, marked by fasting and repentance.',true),
('Good Friday','Christian','2026-04-03','The crucifixion, observed with fasting and silence.',true),
('Easter Sunday','Christian','2026-04-05','The resurrection and the heart of the Christian year.',false),
('Christmas','Christian','2026-12-25','The birth of Christ.',false),
('Ramadan Begins','Islamic','2026-02-17','The month of fasting, prayer and reflection begins.',true),
('Laylat al-Qadr','Islamic','2026-03-15','The Night of Decree, sought in the last ten nights.',true),
('Eid al-Fitr','Islamic','2026-03-19','The celebration marking the end of Ramadan.',false),
('Eid al-Adha','Islamic','2026-05-26','The festival of sacrifice.',false),
('Mahavir Janma Kalyanak','Jain','2026-03-31','The birth of Mahavira, the twenty-fourth Tirthankara.',false),
('Paryushana Begins','Jain','2026-09-08','Eight days of fasting, reflection and forgiveness.',true),
('Samvatsari','Jain','2026-09-15','The day of universal forgiveness.',true),
('Diwali — Mahavira Nirvana','Jain','2026-11-08','The liberation of Mahavira.',false);