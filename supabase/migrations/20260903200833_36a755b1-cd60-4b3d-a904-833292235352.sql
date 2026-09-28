CREATE TABLE public.journeys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  duration_days integer NOT NULL,
  pillar text NOT NULL DEFAULT 'one_within',
  theme text NOT NULL DEFAULT '',
  promise text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.journeys TO authenticated;
GRANT ALL ON public.journeys TO service_role;
ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;
CREATE POLICY journeys_read ON public.journeys FOR SELECT TO authenticated USING (true);

CREATE TABLE public.journey_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id uuid NOT NULL REFERENCES public.journeys(id) ON DELETE CASCADE,
  arc_day integer NOT NULL,
  title text NOT NULL,
  practice text NOT NULL,
  reflection text NOT NULL,
  minutes integer NOT NULL DEFAULT 7,
  UNIQUE (journey_id, arc_day)
);
GRANT SELECT ON public.journey_days TO authenticated;
GRANT ALL ON public.journey_days TO service_role;
ALTER TABLE public.journey_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY journey_days_read ON public.journey_days FOR SELECT TO authenticated USING (true);

CREATE TABLE public.daily_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'practice',
  theme text NOT NULL DEFAULT '',
  title text NOT NULL,
  body text NOT NULL,
  action text NOT NULL DEFAULT '',
  minutes integer NOT NULL DEFAULT 5,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.daily_prompts TO authenticated;
GRANT ALL ON public.daily_prompts TO service_role;
ALTER TABLE public.daily_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY daily_prompts_read ON public.daily_prompts FOR SELECT TO authenticated USING (true);

CREATE TABLE public.journey_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  journey_id uuid NOT NULL REFERENCES public.journeys(id) ON DELETE CASCADE,
  started_on date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, journey_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journey_enrollments TO authenticated;
GRANT ALL ON public.journey_enrollments TO service_role;
ALTER TABLE public.journey_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY enrollments_own ON public.journey_enrollments FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.journey_day_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  journey_id uuid NOT NULL REFERENCES public.journeys(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  reflection text NOT NULL DEFAULT '',
  completed_on date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, journey_id, day_number)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journey_day_logs TO authenticated;
GRANT ALL ON public.journey_day_logs TO service_role;
ALTER TABLE public.journey_day_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY day_logs_own ON public.journey_day_logs FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

INSERT INTO public.journeys (slug, title, duration_days, pillar, theme, promise, summary, sort_order) VALUES
('return-to-self',7,7,'one_within','BEGIN','You will end the week knowing what you actually need.','Seven days to put down the noise and hear yourself again. Short practices, one honest question a day.',1),
('cultivate-stillness',21,21,'one_within','STILLNESS','Stillness stops being a thing you schedule and becomes a thing you carry.','Three weeks of sitting practice that builds from three minutes to twenty, without ever forcing it.',2),
('gratitude',21,21,'one_within','GRATITUDE','Your attention starts finding what is already good, without being asked.','Twenty-one days of specific, unsentimental gratitude — practised, written and spoken aloud to real people.',3),
('letting-go',40,40,'one_within','LETTING GO','You will release one thing you have carried far too long.','Forty days is the traditional length for a reason. This one moves slowly and asks for honesty.',4),
('purpose',40,40,'one_within','PURPOSE','A clear sentence about what your life is for, written in your own hand.','Forty days of examining what you give your hours to, and what you would give them to instead.',5),
('deepen-your-practice',90,90,'one_within','DEVOTION','A practice that survives a bad month.','Ninety days for people who already sit, pray or move — and want it to become structural.',6),
('connection',90,90,'one_with_all','CONNECTION','Fewer, deeper relationships — and a circle that knows you.','Ninety days of small, deliberate acts that rebuild closeness with people and with your community.',7);

INSERT INTO public.journey_days (journey_id, arc_day, title, practice, reflection, minutes)
SELECT j.id, d.arc_day, d.title, d.practice, d.reflection, d.minutes FROM public.journeys j
JOIN (VALUES
('return-to-self',1,'Arrive','Sit for three minutes and name, out loud, the first thing you notice in your body.','What did your body know before your mind did?',3),
('return-to-self',2,'Subtract','Remove one input for the day — news, a feed, a podcast. Notice the gap.','What rushed in to fill the silence?',5),
('return-to-self',3,'The honest hour','Write for ten minutes without stopping, starting with: what I am avoiding is…','What did you write that you would not say aloud?',10),
('return-to-self',4,'Body first','Walk twenty minutes with no audio. Let the pace slow on its own.','Where did your mind go when it had nowhere to be?',20),
('return-to-self',5,'Need, not want','List five wants. Cross out the four that are not needs.','What survived the crossing out?',7),
('return-to-self',6,'Ask someone','Ask one person who knows you: what do I seem to be carrying right now?','What did their answer confirm or unsettle?',10),
('return-to-self',7,'The sentence','Write one sentence: what I actually need right now is…','Say it aloud. Does it hold?',5),
('cultivate-stillness',1,'Three minutes','Sit. Feel the breath at the nostrils. Three minutes, timer on.','Was it long or short? Why?',3),
('cultivate-stillness',2,'Counting','Count breaths one to ten, then start again. Lose count, begin again.','How did you treat yourself when you lost count?',7),
('cultivate-stillness',3,'The body scan','Move attention slowly from crown to feet, without fixing anything.','What was holding on without your permission?',12),
('cultivate-stillness',4,'Sound','Sit outdoors or by an open window. Listen without naming what you hear.','What changed when you stopped labelling?',10),
('cultivate-stillness',5,'Longer sit','Extend the sit by five minutes past comfort. Stay.','What happened after the urge to stop?',18),
('cultivate-stillness',6,'Stillness in motion','Do one ordinary task at half speed — washing, walking, eating.','Where did the hurry live?',10),
('cultivate-stillness',7,'Open sitting','Sit with no technique. Let the breath do what it does.','What is still, even when you are not?',20),
('gratitude',1,'Three specifics','Name three things from today. No categories — only specifics.','Why those three?',5),
('gratitude',2,'The difficult gift','Name one hard thing that gave you something.','What did it cost, and what did it give?',7),
('gratitude',3,'Say it','Tell one person, in plain words, what they did for you.','How did it feel to be specific?',5),
('gratitude',4,'The overlooked','Thank something that has no idea — a room, a road, a tool.','What have you been using without seeing?',5),
('gratitude',5,'The body','List three things your body did for you today without being asked.','What do you usually only notice when it hurts?',5),
('gratitude',6,'The lineage','Name someone who made your life possible before you were born.','What did they never get thanked for?',7),
('gratitude',7,'Write it down','Write a short letter of thanks. Send it or keep it.','What do you want them to know?',12),
('letting-go',1,'Name it','Write down the one thing this journey is about. One line.','Why now?',5),
('letting-go',2,'The cost','List what carrying it has cost you — hours, sleep, relationships.','Is the price still worth paying?',10),
('letting-go',3,'The grip','Sit and breathe into the physical place where you feel it.','Where does it live in your body?',10),
('letting-go',4,'The story','Write the version of the story where you are not the injured party.','What is true in that version?',12),
('letting-go',5,'Forgive something small','Release one small grievance completely today.','What was easy about it? What was not?',7),
('letting-go',6,'Give it away','Give away one object connected to what you are holding.','What did the object represent?',10),
('letting-go',7,'The open hand','Sit with palms open. Say once: I set this down for today.','What returned the moment you set it down?',7),
('purpose',1,'The audit','Write where your last seven days actually went, hour by hour.','What does that ledger say you value?',15),
('purpose',2,'What you give freely','Name what you do for others without being asked or paid.','What does that reveal?',10),
('purpose',3,'The younger one','Write a paragraph to yourself at fifteen about what you do now.','Would they recognise you?',12),
('purpose',4,'The room','Imagine the room where your work matters most. Describe it.','Who is in it?',10),
('purpose',5,'Subtract a role','Name one role you carry that is not yours to carry.','What would putting it down make possible?',10),
('purpose',6,'Ask three people','Ask three people what they come to you for.','What did all three say?',15),
('purpose',7,'One sentence','Write: my life is for ____. Rewrite until it is true.','Does it survive a bad day?',12),
('deepen-your-practice',1,'Same seat','Practise in the same place, at the same time. Note both.','What does the room do to the practice?',20),
('deepen-your-practice',2,'The hard day','Practise on the worst day of the week, briefly, without excuse.','What did five minutes prove?',5),
('deepen-your-practice',3,'Study','Read one paragraph of a text from your tradition. Slowly, twice.','What did the second reading give?',10),
('deepen-your-practice',4,'Longer form','Extend today''s sit to double your usual length.','Where did the second half differ?',40),
('deepen-your-practice',5,'With others','Practise alongside one other person, in person or on a call.','What changed with a witness?',20),
('deepen-your-practice',6,'Service','Do one unglamorous act of service before your practice.','How did the practice land afterwards?',20),
('deepen-your-practice',7,'Review','Read back this week''s reflections. Note one pattern.','What is the practice slowly changing?',15),
('connection',1,'The overdue message','Send the message you have owed someone for months.','Why did it take this long?',5),
('connection',2,'Deep question','Ask one person a question you have never asked them.','What did you learn?',15),
('connection',3,'Show up','Be physically present somewhere with other people for an hour.','What did presence cost and give?',60),
('connection',4,'Listen only','Have one conversation where you offer no advice at all.','What did they say once you stopped fixing?',20),
('connection',5,'Repair','Take one small step toward a relationship that has gone quiet.','What is the first honest sentence?',10),
('connection',6,'Serve your circle','Do one thing for your EKA Circle or local community.','Who benefited that you will never meet?',30),
('connection',7,'Name your people','List the people you want in your life in five years. Act on one.','What does keeping them require of you?',10)
) AS d(slug, arc_day, title, practice, reflection, minutes) ON d.slug = j.slug;

INSERT INTO public.daily_prompts (kind, theme, title, body, action, minutes) VALUES
('practice','BEGIN','Three breaths before the phone','Before the first screen of the day, take three slow breaths with your feet on the floor.','Do it tomorrow morning before anything else.',3),
('reflection','BEGIN','What is beginning','Something in your life is at day one right now. Name it before it names itself.','Write one line about it.',5),
('ritual','LOVE','A cup for someone else','Make a hot drink and give it away before you make your own.','Hand it over without explaining why.',5),
('question','LOVE','Who loves you badly?','Some love arrives in the wrong shape. Recognising it is not the same as excusing it.','Sit with the question for four minutes.',4),
('practice','STILLNESS','The doorway pause','Each time you cross a doorway today, stop for one breath.','Count how many times you remembered.',2),
('insight','STILLNESS','Hesychia','The desert monastics used one word for inner stillness: hesychia. Not silence — the quiet that remains under noise.','Find one minute of it today.',3),
('gratitude','GRATITUDE','Specific, not general','Gratitude fails when it is vague. Name the exact thing, at the exact hour.','Name three with times attached.',5),
('kindness','GRATITUDE','Thank the invisible','Someone maintains something you use daily and never meet.','Leave a note, a tip or a message.',5),
('practice','COURAGE','The sentence you avoid','There is one sentence you have not said. Say it today, to the right person.','Say it plainly, without preamble.',10),
('question','COURAGE','What would you do at eighty?','Ask the version of you at eighty what today calls for.','Write their answer, not yours.',6),
('ritual','LETTING GO','Water and release','Hold cool water in your hands, name one thing, let it fall.','Do it once, slowly.',4),
('reflection','LETTING GO','The weight audit','List what you are carrying. Mark what is not yours.','Set one down for the day.',8),
('kindness','CONNECTION','A message with no ask','Send one message that asks for nothing at all.','Send it now, not later.',3),
('practice','CONNECTION','Eye contact','Hold eye contact one beat longer in every exchange today.','Notice what shifts.',5),
('question','PURPOSE','What did today serve?','At the end of the day, ask what your hours actually served.','Answer in one honest line.',5),
('insight','PURPOSE','Ikigai, unromanticised','The Okinawan idea is not a career diagram. It is a reason to get up — often small, often domestic.','Name yours for tomorrow.',5),
('ritual','DEVOTION','Light something','Light a candle, a lamp or an incense stick and stay until it settles.','Say nothing while it catches.',5),
('practice','DEVOTION','One repeated word','Choose one word and return to it for five minutes.','Let it wear smooth.',5),
('reflection','TRANSFORMATION','A year ago','Recall who you were twelve months ago on this date.','Write one thing that is genuinely different.',7),
('question','TRANSFORMATION','What is dying?','Something in you is ending. Endings are not failures.','Name it without rushing to replace it.',6),
('kindness','SERVICE','An hour that helps no one you know','Give one hour to something with no return to you.','Book the hour today.',60),
('practice','SERVICE','Do the unseen task','Do the chore nobody thanks anyone for.','Do it without mentioning it.',15),
('reflection','REFLECTION','The year in three','Name three moments that actually changed the year.','Write why each one counted.',12),
('insight','REFLECTION','Reflection is not review','Review asks what happened. Reflection asks what it made of you.','Ask the second question.',6);