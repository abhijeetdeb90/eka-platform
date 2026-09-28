
-- ============ granular passport share links ============
CREATE TABLE public.passport_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  slug text NOT NULL UNIQUE,
  label text NOT NULL DEFAULT 'Shared passport',
  sections jsonb NOT NULL DEFAULT '{}'::jsonb,
  revoked_at timestamptz,
  expires_at timestamptz,
  view_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.passport_shares TO authenticated;
GRANT ALL ON public.passport_shares TO service_role;
ALTER TABLE public.passport_shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage their share links" ON public.passport_shares
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER passport_shares_updated_at BEFORE UPDATE ON public.passport_shares
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX passport_shares_user_idx ON public.passport_shares (user_id);

CREATE OR REPLACE FUNCTION public.passport_by_token(_slug text)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE s record; snap jsonb; res jsonb;
BEGIN
  SELECT * INTO s FROM public.passport_shares
   WHERE slug = _slug AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at > now());
  IF s IS NULL THEN RETURN NULL; END IF;
  snap := public.wisdom_passport_for(s.user_id);
  res := jsonb_build_object(
    'label', s.label,
    'display_name', (SELECT display_name FROM public.profiles WHERE id = s.user_id),
    'username', (SELECT username FROM public.profiles WHERE id = s.user_id),
    'since', snap -> 'since',
    'sections', s.sections);
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
GRANT EXECUTE ON FUNCTION public.passport_by_token(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.trust_profile(uuid) TO anon, authenticated;

-- ============ trust incidents ============
CREATE TABLE public.trust_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL,
  subject_user_id uuid,
  practitioner_id uuid REFERENCES public.practitioners(id) ON DELETE SET NULL,
  booking_id uuid REFERENCES public.marketplace_bookings(id) ON DELETE SET NULL,
  category text NOT NULL,
  summary text NOT NULL,
  severity text NOT NULL DEFAULT 'standard',
  status text NOT NULL DEFAULT 'open',
  resolution text,
  outcome text,
  resolved_by uuid,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.trust_incidents TO authenticated;
GRANT ALL ON public.trust_incidents TO service_role;
ALTER TABLE public.trust_incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties and moderators can read incidents" ON public.trust_incidents
  FOR SELECT TO authenticated USING (
    auth.uid() = reporter_id OR auth.uid() = subject_user_id
    OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Members can raise an incident" ON public.trust_incidents
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Moderators can update incidents" ON public.trust_incidents
  FOR UPDATE TO authenticated USING (
    public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trust_incidents_updated_at BEFORE UPDATE ON public.trust_incidents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.trust_incident_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid NOT NULL REFERENCES public.trust_incidents(id) ON DELETE CASCADE,
  created_by uuid NOT NULL,
  kind text NOT NULL DEFAULT 'note',
  content text,
  url text,
  storage_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.trust_incident_evidence TO authenticated;
GRANT ALL ON public.trust_incident_evidence TO service_role;
ALTER TABLE public.trust_incident_evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties and moderators can read evidence" ON public.trust_incident_evidence
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.trust_incidents i WHERE i.id = incident_id AND (
      auth.uid() = i.reporter_id OR auth.uid() = i.subject_user_id
      OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Parties and moderators can add evidence" ON public.trust_incident_evidence
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by AND EXISTS (
    SELECT 1 FROM public.trust_incidents i WHERE i.id = incident_id AND (
      auth.uid() = i.reporter_id OR auth.uid() = i.subject_user_id
      OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'))));

CREATE TABLE public.trust_incident_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid NOT NULL REFERENCES public.trust_incidents(id) ON DELETE CASCADE,
  actor_id uuid,
  action text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.trust_incident_events TO authenticated;
GRANT ALL ON public.trust_incident_events TO service_role;
ALTER TABLE public.trust_incident_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties and moderators can read history" ON public.trust_incident_events
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.trust_incidents i WHERE i.id = incident_id AND (
      auth.uid() = i.reporter_id OR auth.uid() = i.subject_user_id
      OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'))));

CREATE OR REPLACE FUNCTION public.log_incident_created()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.trust_incident_events (incident_id, actor_id, action, note)
  VALUES (NEW.id, NEW.reporter_id, 'raised', NEW.category);
  RETURN NEW;
END; $$;
CREATE TRIGGER trust_incidents_log_created AFTER INSERT ON public.trust_incidents
  FOR EACH ROW EXECUTE FUNCTION public.log_incident_created();

CREATE OR REPLACE FUNCTION public.review_trust_incident(_id uuid, _status text, _note text DEFAULT NULL, _outcome text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF NOT (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin')) THEN
    RAISE EXCEPTION 'Moderators only';
  END IF;
  IF _status NOT IN ('open','in_review','awaiting_response','resolved','dismissed') THEN
    RAISE EXCEPTION 'Unknown incident state';
  END IF;
  UPDATE public.trust_incidents
     SET status = _status,
         resolution = COALESCE(_note, resolution),
         outcome = COALESCE(_outcome, outcome),
         resolved_by = CASE WHEN _status IN ('resolved','dismissed') THEN auth.uid() ELSE resolved_by END,
         resolved_at = CASE WHEN _status IN ('resolved','dismissed') THEN now() ELSE resolved_at END
   WHERE id = _id;
  INSERT INTO public.trust_incident_events (incident_id, actor_id, action, note)
  VALUES (_id, auth.uid(), _status, _note);
END; $$;

-- ============ wisdom graph ============
CREATE TABLE public.wisdom_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text,
  tradition text,
  source_name text,
  source_url text,
  license text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wisdom_nodes TO anon, authenticated;
GRANT ALL ON public.wisdom_nodes TO service_role;
ALTER TABLE public.wisdom_nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read wisdom nodes" ON public.wisdom_nodes FOR SELECT USING (true);
CREATE POLICY "Admins manage wisdom nodes" ON public.wisdom_nodes
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER wisdom_nodes_updated_at BEFORE UPDATE ON public.wisdom_nodes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.wisdom_edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_node uuid NOT NULL REFERENCES public.wisdom_nodes(id) ON DELETE CASCADE,
  to_node uuid NOT NULL REFERENCES public.wisdom_nodes(id) ON DELETE CASCADE,
  relation text NOT NULL,
  note text,
  source_name text,
  source_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wisdom_edges TO anon, authenticated;
GRANT ALL ON public.wisdom_edges TO service_role;
ALTER TABLE public.wisdom_edges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read wisdom edges" ON public.wisdom_edges FOR SELECT USING (true);
CREATE POLICY "Admins manage wisdom edges" ON public.wisdom_edges
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX wisdom_edges_from_idx ON public.wisdom_edges (from_node);
CREATE INDEX wisdom_edges_to_idx ON public.wisdom_edges (to_node);
