-- =================================================================================
-- EKA CULTURAL MODELS ENHANCEMENT
-- =================================================================================
-- This migration expands EKA's backend data models to deeply represent 
-- complex cultural constructs, enabling the "Cultural Intelligence Layer".
-- =================================================================================

-- 1. CULTURAL HERITAGE SITES
-- Stores sacred places, architectural monuments, and natural heritage sites
CREATE TABLE IF NOT EXISTS public.cultural_heritage_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    alternate_names TEXT[], -- aliases in other languages
    description TEXT,
    significance_tier TEXT CHECK (significance_tier IN ('global_unesco', 'national_monument', 'regional_sacred', 'local_shrine')),
    location_point geometry(POINT, 4326), -- PostGIS spatial coordinates
    region TEXT,
    country TEXT,
    tradition_id UUID REFERENCES public.knowledge_objects(id), -- Link to a specific culture/tradition
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CULTURAL EVENTS & FESTIVALS
-- Represents temporal events (annual festivals, rites of passage, solstices)
CREATE TABLE IF NOT EXISTS public.cultural_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    local_name TEXT,
    description TEXT,
    tradition_id UUID REFERENCES public.knowledge_objects(id),
    -- Calendar tracking (Gregorian vs Lunar/Solar)
    calendar_type TEXT CHECK (calendar_type IN ('gregorian', 'lunar', 'lunisolar', 'solar', 'other')),
    typical_month TEXT, -- e.g., 'October/November' for Diwali
    duration_days INTEGER,
    -- Associations
    associated_deity_or_figure TEXT,
    primary_location_id UUID REFERENCES public.cultural_heritage_sites(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CUSTODIAN LINEAGES
-- Represents verified lineage holders, master artisans, or indigenous elders
CREATE TABLE IF NOT EXISTS public.custodian_lineages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    lineage_name TEXT NOT NULL,
    expertise_domain TEXT NOT NULL, -- e.g., 'Handloom Weaving', 'Vedic Chanting'
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verification_evidence TEXT, -- Link to IPFS or storage bucket doc
    generation_number INTEGER, -- e.g., "7th Generation Weaver"
    community_id UUID, -- If linked to a specific community/sangha
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. KNOWLEDGE GRAPH EDGES
-- Enables traversing "What is related to what"
CREATE TABLE IF NOT EXISTS public.knowledge_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_entity_id UUID NOT NULL, -- Could be a post, a heritage site, an event, or a knowledge_object
    source_entity_type TEXT NOT NULL,
    target_entity_id UUID NOT NULL,
    target_entity_type TEXT NOT NULL,
    relationship_type TEXT NOT NULL, -- 'celebrated_at', 'practiced_by', 'is_variant_of', 'originates_from'
    confidence_score FLOAT CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =================================================================================
-- RLS POLICIES & INDEXES
-- =================================================================================

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_heritage_location ON public.cultural_heritage_sites USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_knowledge_edges_source ON public.knowledge_edges (source_entity_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_edges_target ON public.knowledge_edges (target_entity_id);

-- Enable RLS
ALTER TABLE public.cultural_heritage_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custodian_lineages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_edges ENABLE ROW LEVEL SECURITY;

-- Public Read Access Policies
CREATE POLICY "Public Read: Heritage Sites" ON public.cultural_heritage_sites FOR SELECT USING (true);
CREATE POLICY "Public Read: Cultural Events" ON public.cultural_events FOR SELECT USING (true);
CREATE POLICY "Public Read: Custodian Lineages" ON public.custodian_lineages FOR SELECT USING (verification_status = 'verified');
CREATE POLICY "Public Read: Knowledge Edges" ON public.knowledge_edges FOR SELECT USING (true);

-- End Migration
