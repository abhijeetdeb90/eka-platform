-- ============================================================================
-- EKA Creator Economy & Payout Engine v1
-- Tri-Partite Model: Attention + Knowledge + Trust
-- Migration: 20260927010000_creator_economy_and_payout_engine.sql
-- ============================================================================

-- 1. Multi-Contributor Knowledge Attributions
CREATE TABLE IF NOT EXISTS public.content_attributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL,
  contributor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contributor_role text NOT NULL CHECK (
    contributor_role IN ('creator', 'source', 'verifier', 'community_steward', 'translator', 'platform')
  ),
  attribution_percentage numeric NOT NULL CHECK (attribution_percentage >= 0 AND attribution_percentage <= 100),
  verified boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  verifier_id uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_attributions_content ON public.content_attributions(content_id);
CREATE INDEX IF NOT EXISTS idx_content_attributions_contributor ON public.content_attributions(contributor_id);

ALTER TABLE public.content_attributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attributions_select_all"
  ON public.content_attributions FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "attributions_modify_admin"
  ON public.content_attributions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- 2. Qualified Engagement Events (Immutable Bot-Filtered Log)
CREATE TABLE IF NOT EXISTS public.qualified_engagement_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text,
  event_type text NOT NULL CHECK (
    event_type IN ('read', 'save', 'share', 'comment', 'journey_step', 'cite', 'correct', 'reaction')
  ),
  dwell_time_seconds integer NOT NULL DEFAULT 0,
  scroll_depth_percent integer NOT NULL DEFAULT 0,
  is_qualified boolean NOT NULL DEFAULT false,
  qualification_reason text,
  fraud_score numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qee_content ON public.qualified_engagement_events(content_id);
CREATE INDEX IF NOT EXISTS idx_qee_user ON public.qualified_engagement_events(user_id);
CREATE INDEX IF NOT EXISTS idx_qee_qualified ON public.qualified_engagement_events(is_qualified, created_at);

ALTER TABLE public.qualified_engagement_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "qee_select_own_or_admin"
  ON public.qualified_engagement_events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "qee_insert_auth"
  ON public.qualified_engagement_events FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- 3. Creator Contribution Scores (QCS Aggregates)
CREATE TABLE IF NOT EXISTS public.creator_contribution_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_id text NOT NULL,
  consumption_points numeric NOT NULL DEFAULT 0,
  curation_points numeric NOT NULL DEFAULT 0,
  discussion_points numeric NOT NULL DEFAULT 0,
  provenance_points numeric NOT NULL DEFAULT 0,
  verification_points numeric NOT NULL DEFAULT 0,
  repeat_learning_points numeric NOT NULL DEFAULT 0,
  reaction_points numeric NOT NULL DEFAULT 0,
  total_qcs numeric NOT NULL DEFAULT 0,
  dispute_deductions numeric NOT NULL DEFAULT 0,
  final_score numeric NOT NULL DEFAULT 0,
  trust_tier integer NOT NULL DEFAULT 0 CHECK (trust_tier BETWEEN 0 AND 4),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_creator_period UNIQUE (creator_id, period_id)
);

CREATE INDEX IF NOT EXISTS idx_ccs_creator_period ON public.creator_contribution_scores(creator_id, period_id);

ALTER TABLE public.creator_contribution_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ccs_select_own_or_admin"
  ON public.creator_contribution_scores FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- 4. Creator Tax & Payout Profiles
CREATE TABLE IF NOT EXISTS public.creator_tax_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  pan_number text,
  pan_verified boolean NOT NULL DEFAULT false,
  tds_rate numeric NOT NULL DEFAULT 10.0,
  payout_method text NOT NULL DEFAULT 'upi' CHECK (payout_method IN ('upi', 'bank_transfer', 'international')),
  payout_vpa text,
  bank_account_number text,
  bank_ifsc text,
  penny_drop_verified boolean NOT NULL DEFAULT false,
  kyc_status text NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.creator_tax_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tax_profile_own_or_admin"
  ON public.creator_tax_profiles FOR ALL
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- 5. Creator Fraud & Risk Logs
CREATE TABLE IF NOT EXISTS public.creator_fraud_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  flag_type text NOT NULL CHECK (
    flag_type IN ('reaction_velocity', 'device_cluster', 'circular_ring', 'bot_session', 'suspicious_fan_support')
  ),
  severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_fraud_flags_creator ON public.creator_fraud_flags(creator_id);
CREATE INDEX IF NOT EXISTS idx_fraud_flags_status ON public.creator_fraud_flags(status);

ALTER TABLE public.creator_fraud_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fraud_flags_admin_only"
  ON public.creator_fraud_flags FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
