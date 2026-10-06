-- ==============================================================================
-- EKA STORAGE ASSETS & HYBRID DATA LAKE INFRASTRUCTURE
-- ==============================================================================
-- Schema support for EKA Pre-Funding Architecture:
-- 5 TB Google Drive Object Lake + Supabase PostgreSQL Metadata & RLS Core.
-- Permanent EKA Identifier scheme (EKA-MED-*, EKA-DOC-*, EKA-CRP-*)
-- ==============================================================================

-- 1. Storage Namespaces Table (Maps Google Drive hierarchy)
CREATE TABLE IF NOT EXISTS public.storage_namespaces (
    id TEXT PRIMARY KEY,                             -- e.g. '01_USERS', '02_CONTENT'
    name TEXT NOT NULL,
    description TEXT,
    drive_folder_id TEXT NOT NULL,                   -- Google Drive Folder ID
    parent_namespace TEXT REFERENCES public.storage_namespaces(id) ON DELETE CASCADE,
    dpdp_sensitivity_tier TEXT NOT NULL DEFAULT 'standard' CHECK (dpdp_sensitivity_tier IN ('public', 'standard', 'sensitive_personal', 'restricted')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed Canonical 10 Namespaces into storage_namespaces
INSERT INTO public.storage_namespaces (id, name, description, drive_folder_id, dpdp_sensitivity_tier)
VALUES
    ('01_USERS', 'Users & Profiles', 'Avatars and user preference archives (Zero credentials)', '1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL', 'sensitive_personal'),
    ('02_CONTENT', 'Content Media', 'User post attachments, community audio/video discourses', '1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL', 'standard'),
    ('03_CULTURAL_KNOWLEDGE', 'Cultural Knowledge Vault', 'High-res temple imagery, manuscript scans, sacred geography recordings', '1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL', 'public'),
    ('04_CREATOR_CONTENT', 'Creator Masterclasses & Portfolios', 'Verified masterclasses, workshop recordings, and practitioner audio', '1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL', 'standard'),
    ('05_AI_CORPUS', 'AI Epistemic Corpus', 'Canonical texts, transcripts, Q&A pairs, and embedding snapshots', '1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL', 'standard'),
    ('06_ANALYTICS', 'Analytics Snapshots', 'Periodic aggregated telemetry dumps and cohort metrics', '1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL', 'restricted'),
    ('07_VERIFICATION', 'Epistemic Verification Evidence', 'Lineage verification proofs, academic citations, provenance passports', '1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL', 'standard'),
    ('08_ADMIN', 'Executive & Governance Vault', 'Investor reporting, legal charters, compliance agreements', '1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL', 'restricted'),
    ('09_BACKUPS', 'Database & System Backups', 'Automated Supabase schema manifests and encrypted disaster recovery dumps', '1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL', 'restricted'),
    ('10_EXPORTS', 'Public Research Exports', 'Anonymized cultural datasets and open academic exports', '1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL', 'public')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    drive_folder_id = EXCLUDED.drive_folder_id,
    dpdp_sensitivity_tier = EXCLUDED.dpdp_sensitivity_tier,
    updated_at = now();

-- 2. Permanent Storage Assets Registry Table
CREATE TABLE IF NOT EXISTS public.storage_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eka_id TEXT UNIQUE NOT NULL,                      -- Permanent uniform ID (e.g., 'EKA-MED-009214')
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    entity_type TEXT NOT NULL,                        -- 'post', 'cultural_item', 'knowledge_object', 'creator_portfolio', 'backup', 'ai_corpus'
    entity_id TEXT,                                   -- Target entity reference
    namespace_id TEXT REFERENCES public.storage_namespaces(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    sha256_checksum TEXT,
    
    -- Storage Provider Mapping (Defaults to Google Drive pre-funding)
    storage_provider TEXT NOT NULL DEFAULT 'google_drive' CHECK (storage_provider IN ('google_drive', 'cloudflare_r2', 'supabase', 's3')),
    drive_file_id TEXT,                               -- Google Drive opaque ID (e.g., '1AbCdEf...')
    drive_folder_id TEXT,                             -- Google Drive parent folder ID
    drive_web_content_link TEXT,                      -- Direct stream link (if authenticated or public)
    
    -- Edge & CDN Acceleration
    cdn_cached_url TEXT,
    thumbnail_drive_id TEXT,
    thumbnail_url TEXT,
    
    -- Status & Sync Lifecycle
    sync_status TEXT NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('staged', 'uploading', 'synced', 'error')),
    is_public BOOLEAN NOT NULL DEFAULT true,
    allow_ai_training BOOLEAN NOT NULL DEFAULT false, -- DPDP Act affirmative consent
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexing for high-throughput reads
CREATE INDEX IF NOT EXISTS idx_storage_assets_eka_id ON public.storage_assets(eka_id);
CREATE INDEX IF NOT EXISTS idx_storage_assets_drive_file_id ON public.storage_assets(drive_file_id);
CREATE INDEX IF NOT EXISTS idx_storage_assets_entity ON public.storage_assets(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_storage_assets_owner ON public.storage_assets(owner_id);
CREATE INDEX IF NOT EXISTS idx_storage_assets_provider ON public.storage_assets(storage_provider, sync_status);

-- 3. Row Level Security Policies
ALTER TABLE public.storage_namespaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_assets ENABLE ROW LEVEL SECURITY;

-- Read policy for namespaces (all authenticated and anon can view public namespaces)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'storage_namespaces' AND policyname = 'Public can view active namespaces'
  ) THEN
    CREATE POLICY "Public can view active namespaces"
      ON public.storage_namespaces
      FOR SELECT
      USING (is_active = true);
  END IF;
END $$;

-- Assets Read Policy: Public can view public assets; owners can view their own
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'storage_assets' AND policyname = 'Public can view public assets'
  ) THEN
    CREATE POLICY "Public can view public assets"
      ON public.storage_assets
      FOR SELECT
      USING (is_public = true OR auth.uid() = owner_id);
  END IF;
END $$;

-- Assets Insert Policy: Authenticated users can insert assets owned by them
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'storage_assets' AND policyname = 'Users can register their own storage assets'
  ) THEN
    CREATE POLICY "Users can register their own storage assets"
      ON public.storage_assets
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = owner_id);
  END IF;
END $$;

-- Assets Update Policy: Owners or Studio Admins can update
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'storage_assets' AND policyname = 'Owners can update their storage assets'
  ) THEN
    CREATE POLICY "Owners can update their storage assets"
      ON public.storage_assets
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = owner_id);
  END IF;
END $$;

-- 4. Helper Function: EKA Permanent Identifier Generator
CREATE OR REPLACE FUNCTION public.generate_eka_storage_id(p_prefix TEXT DEFAULT 'EKA-MED')
RETURNS TEXT AS $$
DECLARE
  v_timestamp TEXT;
  v_random TEXT;
BEGIN
  v_timestamp := to_char(NOW(), 'YYYYMMDD');
  v_random := UPPER(SUBSTRING(md5(random()::text || clock_timestamp()::text) FROM 1 FOR 6));
  RETURN p_prefix || '-' || v_timestamp || '-' || v_random;
END;
$$ LANGUAGE plpgsql VOLATILE;
