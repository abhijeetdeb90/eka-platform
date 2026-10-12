-- ==============================================================================
-- EKA INVESTOR PRESENTATION ENVIRONMENT & STATUS REGISTRY MIGRATION
-- ==============================================================================
-- Grounded in EKA Investor Presentation Status Framework:
-- Distinguishes LIVE (Production operational), BETA (Functional in testing/rollout),
-- and ROADMAP (Planned strategic capabilities).
-- ==============================================================================

-- 1. Create investor_product_registry table
CREATE TABLE IF NOT EXISTS public.investor_product_registry (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  headline TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('LIVE', 'BETA', 'ROADMAP')),
  sublabel TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  platform TEXT NOT NULL,
  version TEXT NOT NULL,
  access_type TEXT NOT NULL,
  last_verified DATE NOT NULL DEFAULT CURRENT_DATE,
  investor_visible BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create investor_audit_log table
CREATE TABLE IF NOT EXISTS public.investor_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  product_id TEXT REFERENCES public.investor_product_registry(id) ON DELETE SET NULL,
  previous_status TEXT,
  new_status TEXT,
  actor_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_ipr_status ON public.investor_product_registry(status);
CREATE INDEX IF NOT EXISTS idx_ipr_visible ON public.investor_product_registry(investor_visible);
CREATE INDEX IF NOT EXISTS idx_ial_product ON public.investor_audit_log(product_id);

-- 3. Row Level Security
ALTER TABLE public.investor_product_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_audit_log ENABLE ROW LEVEL SECURITY;

-- Public read for investor evaluation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'investor_product_registry' AND policyname = 'investor_registry_public_read'
  ) THEN
    CREATE POLICY "investor_registry_public_read" ON public.investor_product_registry
      FOR SELECT TO authenticated, anon
      USING (investor_visible = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'investor_audit_log' AND policyname = 'investor_audit_admin_read'
  ) THEN
    CREATE POLICY "investor_audit_admin_read" ON public.investor_audit_log
      FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.user_roles ur
          WHERE ur.user_id = auth.uid() AND ur.role::text IN ('founder', 'admin', 'super_admin')
        )
      );
  END IF;
END $$;

-- 4. Seed Canonical Product Status Registry
INSERT INTO public.investor_product_registry (
  id, name, headline, status, sublabel, description, url, platform, version, access_type, last_verified, investor_visible
) VALUES
  (
    'consumer-web',
    'EKA Consumer Web',
    'One World. A Billion Stories.',
    'LIVE',
    'Production systems currently operational',
    'Universal living cultural discovery sanctuary. Explores living traditions, sacred cartography, 9:16 vertical reels, structured knowledge codex, and community circles.',
    '/',
    'Web',
    'v2.4.0-production',
    'Open Web',
    CURRENT_DATE,
    true
  ),
  (
    'founder-admin',
    'EKA Admin & Operations OS',
    'Mission Governance & Platform Controls',
    'LIVE',
    'Operational administrative platform with investor-safe presentation mode',
    'Executive control plane featuring Founder Cockpit, 12-subsystem topology, oral history moderation queues, platform economics, double-entry ledgers, and trust & safety.',
    '/founder-admin',
    'Web',
    'v2.4.0-admin',
    'Secure Investor Demo',
    CURRENT_DATE,
    true
  ),
  (
    'brands-enterprise',
    'EKA Enterprise & Brand Growth OS',
    'Cultural Intelligence & Brand Growth Layer',
    'BETA',
    'Functional enterprise environment undergoing controlled rollout',
    'B2B growth and institutional operating system. Features Cultural Trend Radar, Brand Brain AI co-pilot, Closed-Loop Attribution, Creator Marketplace, and Enterprise API provisioning.',
    '/brands-enterprise',
    'Web',
    'v1.2.0-beta',
    'Secure Investor Demo',
    CURRENT_DATE,
    true
  ),
  (
    'android-app',
    'EKA Android App',
    'Sacred Sadhana & Cultural Reels on Mobile',
    'BETA',
    'Functional mobile architecture under controlled testing',
    'Native mobile experience built on Expo SDK 52 (React Native). Includes offline-first encrypted sadhana journals, background meditation audio engine, and zero-tracking local panchangam scheduling.',
    '/investor#android',
    'Android',
    'v1.0.4-beta (Build 18)',
    'Controlled Distribution',
    CURRENT_DATE,
    true
  ),
  (
    'ios-app',
    'EKA iOS App',
    'Immersive Living Cultural Sanctuary for iPhone',
    'BETA',
    'Functional iOS experience currently in TestFlight beta testing',
    'Native iOS client engineered for Apple devices. Supports dynamic island audio status, tactile haptics, offline sadhana journals, and buttery-smooth 120Hz ProMotion cultural narrative viewing.',
    '/investor#ios',
    'iOS',
    'v1.0.4-beta (Build 22)',
    'TestFlight Beta',
    CURRENT_DATE,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  version = EXCLUDED.version,
  access_type = EXCLUDED.access_type,
  last_verified = CURRENT_DATE,
  updated_at = now();
