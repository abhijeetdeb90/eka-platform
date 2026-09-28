-- Episode follows
CREATE TABLE public.episode_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id uuid NOT NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notify_questions boolean NOT NULL DEFAULT true,
  notify_schedule boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (episode_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.episode_follows TO authenticated;
GRANT ALL ON public.episode_follows TO service_role;
ALTER TABLE public.episode_follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own follows read" ON public.episode_follows FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own follows write" ON public.episode_follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own follows update" ON public.episode_follows FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own follows delete" ON public.episode_follows FOR DELETE TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS episode_id uuid REFERENCES public.episodes(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS question_id uuid REFERENCES public.episode_questions(id) ON DELETE CASCADE;

-- Notify the asker when a host pins, answers, or the room lifts their question
CREATE OR REPLACE FUNCTION public.notify_question_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE host uuid;
BEGIN
  SELECT creator_id INTO host FROM public.episodes WHERE id = NEW.episode_id;

  IF NEW.pinned AND NOT OLD.pinned THEN
    INSERT INTO public.notifications (user_id, actor_id, type, episode_id, question_id)
    VALUES (NEW.user_id, host, 'question_pinned', NEW.episode_id, NEW.id);
  END IF;

  IF NEW.answered AND NOT OLD.answered THEN
    INSERT INTO public.notifications (user_id, actor_id, type, episode_id, question_id)
    VALUES (NEW.user_id, host, 'question_answered', NEW.episode_id, NEW.id);
  END IF;

  IF NEW.vote_count >= 5 AND OLD.vote_count < 5 THEN
    INSERT INTO public.notifications (user_id, actor_id, type, episode_id, question_id)
    VALUES (NEW.user_id, NULL, 'question_rising', NEW.episode_id, NEW.id);
  END IF;

  RETURN NEW;
END; $$;

CREATE TRIGGER question_change_notify
AFTER UPDATE ON public.episode_questions
FOR EACH ROW EXECUTE FUNCTION public.notify_question_change();

-- Notify followers when an episode is scheduled or published
CREATE OR REPLACE FUNCTION public.notify_episode_followers()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (NEW.published AND NOT OLD.published)
     OR (NEW.scheduled_at IS DISTINCT FROM OLD.scheduled_at AND NEW.scheduled_at IS NOT NULL) THEN
    INSERT INTO public.notifications (user_id, actor_id, type, episode_id)
    SELECT f.user_id, NEW.creator_id,
           CASE WHEN NEW.published AND NOT OLD.published THEN 'episode_published' ELSE 'episode_scheduled' END,
           NEW.id
    FROM public.episode_follows f
    WHERE f.episode_id = NEW.id AND f.notify_schedule AND f.user_id <> NEW.creator_id;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER episode_followers_notify
AFTER UPDATE ON public.episodes
FOR EACH ROW EXECUTE FUNCTION public.notify_episode_followers();

REVOKE EXECUTE ON FUNCTION public.notify_question_change() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_episode_followers() FROM anon, authenticated;

-- Appeals
CREATE TABLE public.content_appeals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_kind text NOT NULL,
  subject_id uuid,
  report_id uuid REFERENCES public.content_reports(id) ON DELETE SET NULL,
  restriction_id uuid REFERENCES public.user_restrictions(id) ON DELETE SET NULL,
  reason_code text NOT NULL,
  statement text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  outcome text,
  outcome_note text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.content_appeals TO authenticated;
GRANT ALL ON public.content_appeals TO service_role;
ALTER TABLE public.content_appeals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own appeals read" ON public.content_appeals FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "own appeals create" ON public.content_appeals FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "moderators decide appeals" ON public.content_appeals FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER content_appeals_updated_at
BEFORE UPDATE ON public.content_appeals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE UNIQUE INDEX content_appeals_one_open ON public.content_appeals (user_id, subject_kind, subject_id)
WHERE status = 'open' AND subject_id IS NOT NULL;