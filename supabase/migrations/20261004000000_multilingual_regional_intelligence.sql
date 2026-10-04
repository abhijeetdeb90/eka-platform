-- ==============================================================================
-- EKA MULTILINGUAL & REGIONAL CULTURAL INTELLIGENCE SCHEMA
-- ==============================================================================
-- Migration: 20261004000000_multilingual_regional_intelligence.sql
-- Purpose:
--   1. Add preferred_language, region, country, and locale to profiles table
--   2. Create cultural_translations table for canonical entity representations
--   3. Establish verification and translation QA status tracking
--   4. Enable RLS and public read policies
-- ==============================================================================

-- 1. Extend profiles table safely (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'preferred_language'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN preferred_language VARCHAR(10) DEFAULT 'en';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'preferred_region'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN preferred_region VARCHAR(100) DEFAULT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'country'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN country VARCHAR(10) DEFAULT 'IN';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'locale'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN locale VARCHAR(20) DEFAULT 'en-IN';
  END IF;
END $$;

-- 2. Create cultural_translations table
CREATE TABLE IF NOT EXISTS public.cultural_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_id TEXT NOT NULL,
  language_code VARCHAR(10) NOT NULL,
  localized_name TEXT NOT NULL,
  localized_title TEXT NOT NULL,
  localized_one_liner TEXT,
  localized_description TEXT,
  localized_body TEXT,
  translation_status VARCHAR(30) NOT NULL DEFAULT 'published' 
    CHECK (translation_status IN ('draft', 'ai_translated', 'human_reviewed', 'verified', 'published')),
  verification_status VARCHAR(30) NOT NULL DEFAULT 'verified'
    CHECK (verification_status IN ('verified', 'review_needed', 'community_dispute')),
  reviewed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_canonical_language UNIQUE (canonical_id, language_code)
);

-- 3. Indexes for fast lookup by canonical ID and language
CREATE INDEX IF NOT EXISTS idx_cultural_translations_lookup 
  ON public.cultural_translations (canonical_id, language_code);

CREATE INDEX IF NOT EXISTS idx_cultural_translations_lang 
  ON public.cultural_translations (language_code);

-- 4. Enable RLS
ALTER TABLE public.cultural_translations ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies: Public can read published translations; authenticated users can manage
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cultural_translations' AND policyname = 'Public can view published translations'
  ) THEN
    CREATE POLICY "Public can view published translations"
      ON public.cultural_translations
      FOR SELECT
      USING (translation_status = 'published');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cultural_translations' AND policyname = 'Admins can manage translations'
  ) THEN
    CREATE POLICY "Admins can manage translations"
      ON public.cultural_translations
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
