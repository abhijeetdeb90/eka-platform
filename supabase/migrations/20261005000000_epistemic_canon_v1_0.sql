-- EKA Epistemic Canon Migration (v1.0)
-- Grounded in docs/01-product/PRODUCT_AND_BRAND_KNOWLEDGE.md §5 and §14.11
-- Establishes the 2-axis truth & provenance framework: Epistemic Type × Verification Level + Epistemic Flags

-- 1. Epistemic Type Enum
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'epistemic_type') THEN
    CREATE TYPE public.epistemic_type AS ENUM (
      'documented_tradition',
      'interpretation',
      'living_practice',
      'opinion_reflection',
      'ai_assisted_synthesis'
    );
  END IF;
END $$;

-- 2. Alter knowledge_objects to support Epistemic Canon
DO $$
BEGIN
  -- Add epistemic_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'knowledge_objects' AND column_name = 'epistemic_type'
  ) THEN
    ALTER TABLE public.knowledge_objects
      ADD COLUMN epistemic_type public.epistemic_type NOT NULL DEFAULT 'documented_tradition';
  END IF;

  -- Add verification_level column (L0 to L5)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'knowledge_objects' AND column_name = 'verification_level'
  ) THEN
    ALTER TABLE public.knowledge_objects
      ADD COLUMN verification_level SMALLINT NOT NULL DEFAULT 0
      CHECK (verification_level BETWEEN 0 AND 5);
  END IF;

  -- Add epistemic flags array
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'knowledge_objects' AND column_name = 'flags'
  ) THEN
    ALTER TABLE public.knowledge_objects
      ADD COLUMN flags TEXT[] NOT NULL DEFAULT '{}'
      CHECK (flags <@ ARRAY['disputed','under_review','commercial','modern_adaptation','sacred_restricted']);
  END IF;
END $$;

-- 3. AI Synthesis Cap Constraint (AI can NEVER exceed Level 1)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'ai_synthesis_cap'
  ) THEN
    ALTER TABLE public.knowledge_objects
      ADD CONSTRAINT ai_synthesis_cap
      CHECK (NOT (epistemic_type = 'ai_assisted_synthesis' AND verification_level > 1));
  END IF;
END $$;

-- 4. Knowledge Reviews Table (Human Verification Record for L2+)
CREATE TABLE IF NOT EXISTS public.knowledge_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id TEXT NOT NULL REFERENCES public.knowledge_objects(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id),
  level_awarded SMALLINT NOT NULL CHECK (level_awarded BETWEEN 0 AND 5),
  rationale TEXT NOT NULL,
  lineage_affiliation TEXT,
  conflicts_declared BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'disputed', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexing for fast review lookups
CREATE INDEX IF NOT EXISTS idx_kr_object_id ON public.knowledge_reviews(object_id);
CREATE INDEX IF NOT EXISTS idx_kr_reviewer_id ON public.knowledge_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_ko_epistemic_type ON public.knowledge_objects(epistemic_type);
CREATE INDEX IF NOT EXISTS idx_ko_verification_level ON public.knowledge_objects(verification_level);

-- 5. Row Level Security for Reviews
ALTER TABLE public.knowledge_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_public_read" ON public.knowledge_reviews
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "reviews_reviewer_insert" ON public.knowledge_reviews
  FOR INSERT TO authenticated
  WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "reviews_service_role" ON public.knowledge_reviews
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
