ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS cancel_at_period_end boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS current_period_end timestamptz,
  ADD COLUMN IF NOT EXISTS canceled_at timestamptz,
  ADD COLUMN IF NOT EXISTS paused_until timestamptz,
  ADD COLUMN IF NOT EXISTS provider_customer_id text,
  ADD COLUMN IF NOT EXISTS provider_subscription_id text,
  ADD COLUMN IF NOT EXISTS provider_price_id text,
  ADD COLUMN IF NOT EXISTS retention_offer_applied boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.cancellation_surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  details text,
  outcome text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.cancellation_surveys TO authenticated;
GRANT ALL ON public.cancellation_surveys TO service_role;
ALTER TABLE public.cancellation_surveys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own surveys" ON public.cancellation_surveys FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "insert own survey" ON public.cancellation_surveys FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own survey" ON public.cancellation_surveys FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.retention_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  discount_percent integer NOT NULL DEFAULT 0,
  pause_days integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'offered',
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.retention_offers TO authenticated;
GRANT ALL ON public.retention_offers TO service_role;
ALTER TABLE public.retention_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own offers" ON public.retention_offers FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own offer" ON public.retention_offers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own offer" ON public.retention_offers FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.billing_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL DEFAULT 'stripe',
  event_id text NOT NULL,
  type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  processed_at timestamptz,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, event_id)
);
GRANT ALL ON public.billing_events TO service_role;
ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.circle_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  starts_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.circle_activities TO authenticated;
GRANT ALL ON public.circle_activities TO service_role;
ALTER TABLE public.circle_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read activities" ON public.circle_activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "members create activities" ON public.circle_activities FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by AND EXISTS (
    SELECT 1 FROM public.community_members m
    WHERE m.community_id = circle_activities.community_id AND m.user_id = auth.uid()));
CREATE POLICY "authors update activities" ON public.circle_activities FOR UPDATE TO authenticated
  USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "authors delete activities" ON public.circle_activities FOR DELETE TO authenticated
  USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'moderator'));
CREATE TRIGGER circle_activities_updated_at BEFORE UPDATE ON public.circle_activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.circle_activity_joins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES public.circle_activities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (activity_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.circle_activity_joins TO authenticated;
GRANT ALL ON public.circle_activity_joins TO service_role;
ALTER TABLE public.circle_activity_joins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read joins" ON public.circle_activity_joins FOR SELECT TO authenticated USING (true);
CREATE POLICY "manage own join" ON public.circle_activity_joins FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own join" ON public.circle_activity_joins FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete own join" ON public.circle_activity_joins FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.onboarding_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  note text,
  completed_on date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, day_number)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.onboarding_steps TO authenticated;
GRANT ALL ON public.onboarding_steps TO service_role;
ALTER TABLE public.onboarding_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own onboarding steps" ON public.onboarding_steps FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.ai_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.ai_insights TO authenticated;
GRANT ALL ON public.ai_insights TO service_role;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own insights" ON public.ai_insights FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);