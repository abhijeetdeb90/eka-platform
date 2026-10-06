-- ==============================================================================
-- EKA PLATFORM — COMPETITIVE INTELLIGENCE UPGRADES SCHEMA
-- Adds Community Contributions, Practitioner Profiles (Keepers), 
-- Pairwise Cultural Comparisons, and Visual Stories with Provenance Rigor.
-- ==============================================================================

-- 1. Community Contributions (Living Oral History & Folk Traditions)
CREATE TABLE IF NOT EXISTS public.community_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    contribution_type TEXT NOT NULL CHECK (
        contribution_type IN (
            'oral_history',
            'family_tradition',
            'traditional_recipe',
            'local_festival',
            'craft_technique',
            'sacred_song'
        )
    ),
    contributor_name TEXT NOT NULL,
    contributor_role TEXT NOT NULL DEFAULT 'community_member' CHECK (
        contributor_role IN (
            'practitioner',
            'elder',
            'descendant',
            'researcher',
            'community_member'
        )
    ),
    community TEXT,
    country TEXT NOT NULL DEFAULT 'India',
    state_region TEXT,
    city_village TEXT,
    narrative TEXT NOT NULL,
    cultural_significance TEXT,
    evidence_links TEXT,
    verification_status TEXT NOT NULL DEFAULT 'pending_review' CHECK (
        verification_status IN (
            'pending_review',
            'under_corroboration',
            'verified_community',
            'verified_scholarly',
            'quarantined',
            'archived'
        )
    ),
    reviewer_notes TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_contrib_status ON public.community_contributions(verification_status);
CREATE INDEX IF NOT EXISTS idx_community_contrib_created ON public.community_contributions(created_at DESC);

-- 2. Practitioner Profiles ("Meet the Keeper")
CREATE TABLE IF NOT EXISTS public.practitioner_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    community TEXT NOT NULL,
    location TEXT NOT NULL,
    practice TEXT NOT NULL,
    story TEXT NOT NULL,
    expertise TEXT NOT NULL,
    image_url TEXT,
    contributions_count INT NOT NULL DEFAULT 1,
    verification_level TEXT NOT NULL DEFAULT 'COMMUNITY_VERIFIED' CHECK (
        verification_level IN (
            'PRIMARY_SOURCE',
            'INSTITUTIONAL',
            'SCHOLARLY',
            'COMMUNITY_VERIFIED',
            'EKA_RESEARCHED',
            'EKA_INTERPRETATION',
            'AI_SYNTHESIS'
        )
    ),
    sources JSONB NOT NULL DEFAULT '[]'::jsonb,
    related_traditions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Pairwise Cultural Comparisons ("Compare Cultures")
CREATE TABLE IF NOT EXISTS public.cultural_comparisons (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    human_question TEXT NOT NULL,
    entity_a JSONB NOT NULL,
    entity_b JSONB NOT NULL,
    similarities JSONB NOT NULL DEFAULT '[]'::jsonb,
    differences JSONB NOT NULL DEFAULT '[]'::jsonb,
    historical_relationship_type TEXT NOT NULL CHECK (
        historical_relationship_type IN (
            'DOCUMENTED_HISTORICAL_TRANSMISSION',
            'PARALLEL_HUMAN_QUESTION',
            'INDIRECT_SYNCRETISM',
            'DISPUTED_OR_UNKNOWN'
        )
    ),
    historical_relationship_badge TEXT NOT NULL,
    historical_relationship_detail TEXT NOT NULL,
    epistemic_warning TEXT NOT NULL,
    regional_variations JSONB NOT NULL DEFAULT '{}'::jsonb,
    sources JSONB NOT NULL DEFAULT '[]'::jsonb,
    ask_eka_prompt TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Visual Stories ("Inside a Tradition", "60 Seconds", etc.)
CREATE TABLE IF NOT EXISTS public.visual_stories (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    template TEXT NOT NULL CHECK (
        template IN (
            'INSIDE_TRADITION',
            'A_PLACE_A_STORY',
            'BEHIND_THE_TRADITION',
            '60_SECONDS_TO_UNDERSTAND',
            'MEET_THE_KEEPER',
            'THEN_NOW',
            'CULTURE_X_CULTURE',
            'WHY'
        )
    ),
    tradition_slug TEXT NOT NULL,
    location TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    provenance JSONB NOT NULL DEFAULT '{}'::jsonb,
    steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Row-Level Security (RLS)
ALTER TABLE public.community_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practitioner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visual_stories ENABLE ROW LEVEL SECURITY;

-- Public can read verified practitioner profiles, comparisons, and visual stories
CREATE POLICY "Public can view practitioner profiles" 
    ON public.practitioner_profiles FOR SELECT USING (true);

CREATE POLICY "Public can view cultural comparisons" 
    ON public.cultural_comparisons FOR SELECT USING (true);

CREATE POLICY "Public can view visual stories" 
    ON public.visual_stories FOR SELECT USING (true);

-- Anyone can submit a community contribution
CREATE POLICY "Anyone can submit community contributions" 
    ON public.community_contributions FOR INSERT WITH CHECK (true);

-- Users can read their own submissions
CREATE POLICY "Users can view their own contributions" 
    ON public.community_contributions FOR SELECT 
    USING (auth.uid() = user_id OR verification_status = 'verified_community');

-- Founders/Admins have full access
CREATE POLICY "Admins have full access to community contributions"
    ON public.community_contributions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'founder' OR role = 'admin')
        )
    );
