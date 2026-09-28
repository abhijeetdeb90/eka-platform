-- Structured Q&A for conversations/episodes
CREATE TABLE public.episode_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id uuid NOT NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  vote_count integer NOT NULL DEFAULT 0,
  answered boolean NOT NULL DEFAULT false,
  pinned boolean NOT NULL DEFAULT false,
  hidden boolean NOT NULL DEFAULT false,
  answer_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.episode_questions TO authenticated;
GRANT ALL ON public.episode_questions TO service_role;
ALTER TABLE public.episode_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "questions readable" ON public.episode_questions
FOR SELECT TO authenticated USING (hidden = false OR user_id = auth.uid() OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "ask a question" ON public.episode_questions
FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "author host or moderator edits" ON public.episode_questions
FOR UPDATE TO authenticated USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.episodes e WHERE e.id = episode_id AND e.creator_id = auth.uid())
  OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "author or moderator deletes" ON public.episode_questions
FOR DELETE TO authenticated USING (
  user_id = auth.uid() OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin')
);

CREATE TRIGGER episode_questions_updated_at BEFORE UPDATE ON public.episode_questions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.episode_question_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.episode_questions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (question_id, user_id)
);

GRANT SELECT, INSERT, DELETE ON public.episode_question_votes TO authenticated;
GRANT ALL ON public.episode_question_votes TO service_role;
ALTER TABLE public.episode_question_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "votes readable" ON public.episode_question_votes FOR SELECT TO authenticated USING (true);
CREATE POLICY "vote as self" ON public.episode_question_votes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "remove own vote" ON public.episode_question_votes FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.sync_question_votes()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.episode_questions SET vote_count = vote_count + 1 WHERE id = NEW.question_id;
  ELSE
    UPDATE public.episode_questions SET vote_count = GREATEST(vote_count - 1, 0) WHERE id = OLD.question_id;
  END IF;
  RETURN NULL;
END; $$;

CREATE TRIGGER question_votes_count AFTER INSERT OR DELETE ON public.episode_question_votes
FOR EACH ROW EXECUTE FUNCTION public.sync_question_votes();

-- Moderation escalation ladder
ALTER TABLE public.content_reports
  ADD COLUMN IF NOT EXISTS severity text NOT NULL DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS auto_hidden boolean NOT NULL DEFAULT false;

CREATE TABLE public.user_restrictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level text NOT NULL DEFAULT 'posting_paused',
  reason text NOT NULL,
  issued_by uuid REFERENCES auth.users(id),
  expires_at timestamptz,
  lifted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.user_restrictions TO authenticated;
GRANT ALL ON public.user_restrictions TO service_role;
ALTER TABLE public.user_restrictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "see own or moderate" ON public.user_restrictions
FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "moderators restrict" ON public.user_restrictions
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "moderators lift" ON public.user_restrictions
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.moderation_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_kind text NOT NULL,
  target_id uuid,
  subject_user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  rung text NOT NULL DEFAULT 'auto_hide',
  notes text,
  actor_id uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.moderation_actions TO authenticated;
GRANT ALL ON public.moderation_actions TO service_role;
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "moderators read actions" ON public.moderation_actions
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "moderators log actions" ON public.moderation_actions
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

-- Severe reports auto-hide the reported item and escalate to the review queue
CREATE OR REPLACE FUNCTION public.escalate_report()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE severe boolean; open_count integer; kind text; tid uuid;
BEGIN
  severe := NEW.reason IN ('Hatred or dehumanisation', 'Incitement or glorified violence', 'Harassment of a person');
  kind := COALESCE(NEW.target_kind, CASE WHEN NEW.post_id IS NOT NULL THEN 'post' WHEN NEW.comment_id IS NOT NULL THEN 'comment' ELSE 'other' END);
  tid := COALESCE(NEW.target_id, NEW.post_id, NEW.comment_id);

  SELECT count(*) INTO open_count FROM public.content_reports
   WHERE status = 'open' AND COALESCE(target_id, post_id, comment_id) = tid;

  IF severe THEN NEW.severity := 'severe'; END IF;

  IF (severe OR open_count >= 3) AND tid IS NOT NULL THEN
    NEW.auto_hidden := true;
    NEW.status := 'escalated';
    IF kind = 'post' THEN
      UPDATE public.posts SET status = 'hidden' WHERE id = tid;
    ELSIF kind = 'comment' THEN
      UPDATE public.post_comments SET status = 'hidden' WHERE id = tid;
    ELSIF kind = 'reel' THEN
      UPDATE public.reels SET status = 'hidden' WHERE id = tid;
    ELSIF kind = 'question' THEN
      UPDATE public.episode_questions SET hidden = true WHERE id = tid;
    END IF;
    INSERT INTO public.moderation_actions (target_kind, target_id, subject_user_id, action, rung, notes)
    VALUES (kind, tid, NEW.reported_user_id, 'auto_hide', 'auto_hide', NEW.reason);
  END IF;

  RETURN NEW;
END; $$;

CREATE TRIGGER content_reports_escalate BEFORE INSERT ON public.content_reports
FOR EACH ROW EXECUTE FUNCTION public.escalate_report();