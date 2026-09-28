-- ==============================================================================
-- EKA STUDIO — INTERNAL CONTROL PLANE SCHEMA & SHARED DATA LAYER (v1.0)
-- Migration: 20260928000000_eka_studio_control_plane.sql
-- Description: Core tables for EKA Studio: Canonical Knowledge Objects, First-Class
-- Relationships, Versioning, Taxonomy, Homepage Builder, Media Library,
-- Append-Only Audit Logs, 11-Role RBAC, Enterprise, and Verification Workflow.
-- ==============================================================================

-- 1. Studio Roles & Granular RBAC Table
CREATE TABLE IF NOT EXISTS public.studio_user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN (
        'Founder',
        'Super Admin',
        'Content Admin',
        'Knowledge Editor',
        'Verifier',
        'Community Moderator',
        'Creator Manager',
        'Support',
        'Enterprise Admin',
        'Analyst',
        'Read Only'
    )),
    assigned_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_studio_user_roles_user ON public.studio_user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_studio_user_roles_role ON public.studio_user_roles(role);

-- 2. Hierarchical Taxonomy Engine (KNOW-003)
CREATE TABLE IF NOT EXISTS public.taxonomy_nodes (
    id TEXT PRIMARY KEY,
    parent_id TEXT REFERENCES public.taxonomy_nodes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    kind TEXT NOT NULL, -- 'culture', 'tradition', 'geography', 'heritage', 'practice', 'lifestyle'
    description TEXT,
    sort_order INT DEFAULT 0,
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_taxonomy_parent ON public.taxonomy_nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_taxonomy_slug ON public.taxonomy_nodes(slug);
CREATE INDEX IF NOT EXISTS idx_taxonomy_kind ON public.taxonomy_nodes(kind);

-- 3. Canonical Knowledge Object Schema (KNOW-002)
CREATE TABLE IF NOT EXISTS public.knowledge_objects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT,
    description TEXT,
    type TEXT NOT NULL, -- 'Tradition', 'Practice', 'Ritual', 'Festival', 'Concept', 'Text', 'Figure', 'Place', 'Community'
    category TEXT,
    tradition TEXT,
    religion_worldview TEXT,
    community TEXT,
    geography JSONB DEFAULT '{"origin_region": null, "cultural_locus": null, "coordinates": null}'::jsonb,
    language JSONB DEFAULT '{"liturgical": null, "vernacular": []}'::jsonb,
    time_period JSONB DEFAULT '{"historical_era": null, "continuity": "Active Living Practice"}'::jsonb,
    event TEXT,
    practice TEXT,
    person TEXT,
    place TEXT,
    business TEXT,
    sources JSONB DEFAULT '[]'::jsonb,
    primary_references JSONB DEFAULT '[]'::jsonb,
    evidence JSONB DEFAULT '[]'::jsonb,
    citations JSONB DEFAULT '[]'::jsonb,
    verification_status TEXT NOT NULL DEFAULT 'Draft' CHECK (verification_status IN (
        'Draft',
        'Under Review',
        'Community Verified',
        'Expert Verified',
        'Source Verified',
        'Published',
        'Disputed',
        'Archived'
    )),
    verification_records JSONB DEFAULT '[]'::jsonb,
    community_validation JSONB DEFAULT '{"count": 0, "status": "pending", "confirmations": []}'::jsonb,
    expert_validation JSONB DEFAULT '{"status": "pending", "reviews": []}'::jsonb,
    interpretation JSONB DEFAULT '[]'::jsonb,
    regional_variations JSONB DEFAULT '[]'::jsonb,
    confidence NUMERIC(4,3) DEFAULT 0.850 CHECK (confidence >= 0 AND confidence <= 1.0),
    provenance JSONB DEFAULT '{"source_type": null, "contributor": null, "is_ai_generated": false, "notes": null}'::jsonb,
    related_objects JSONB DEFAULT '[]'::jsonb,
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    is_archived BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_ko_slug ON public.knowledge_objects(slug);
CREATE INDEX IF NOT EXISTS idx_ko_type ON public.knowledge_objects(type);
CREATE INDEX IF NOT EXISTS idx_ko_tradition ON public.knowledge_objects(tradition);
CREATE INDEX IF NOT EXISTS idx_ko_verification ON public.knowledge_objects(verification_status);
CREATE INDEX IF NOT EXISTS idx_ko_status ON public.knowledge_objects(status);

-- 4. Knowledge Object Version History (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS public.knowledge_object_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    knowledge_object_id TEXT NOT NULL REFERENCES public.knowledge_objects(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    title TEXT NOT NULL,
    snapshot JSONB NOT NULL,
    diff_summary TEXT,
    changed_by UUID,
    change_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(knowledge_object_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_kov_ko_id ON public.knowledge_object_versions(knowledge_object_id);

-- 5. First-Class Knowledge Graph Relationships (KNOW-004)
CREATE TABLE IF NOT EXISTS public.knowledge_relationships (
    id TEXT PRIMARY KEY,
    from_id TEXT NOT NULL,
    from_type TEXT NOT NULL,
    predicate TEXT NOT NULL, -- 'ASSOCIATED_WITH', 'PRACTICED_IN', 'BELONGS_TO', 'LOCATED_IN', 'EXPLAINS', 'SUPPORTS', 'CODIFIED_IN', etc.
    to_id TEXT NOT NULL,
    to_type TEXT NOT NULL,
    confidence NUMERIC(4,3) DEFAULT 0.950 CHECK (confidence >= 0 AND confidence <= 1.0),
    provenance JSONB DEFAULT '{"source": null, "notes": null}'::jsonb,
    notes TEXT,
    is_disputed BOOLEAN DEFAULT false,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kr_from ON public.knowledge_relationships(from_id);
CREATE INDEX IF NOT EXISTS idx_kr_to ON public.knowledge_relationships(to_id);
CREATE INDEX IF NOT EXISTS idx_kr_predicate ON public.knowledge_relationships(predicate);

-- 6. Structured Content & Page Builder
CREATE TABLE IF NOT EXISTS public.content_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL DEFAULT 'article' CHECK (type IN ('post', 'article', 'collection', 'page')),
    description TEXT,
    body TEXT NOT NULL,
    media JSONB DEFAULT '[]'::jsonb,
    author_id UUID,
    creator_name TEXT,
    category TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    location TEXT,
    language TEXT DEFAULT 'en',
    tradition TEXT,
    community TEXT,
    sources JSONB DEFAULT '[]'::jsonb,
    related_objects JSONB DEFAULT '[]'::jsonb,
    seo_metadata JSONB DEFAULT '{"meta_title": null, "meta_description": null, "og_image": null}'::jsonb,
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'members_only', 'private', 'unlisted')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
    scheduled_publish_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_slug ON public.content_items(slug);
CREATE INDEX IF NOT EXISTS idx_content_type ON public.content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_status ON public.content_items(status);

-- 7. Visual Data-Driven Homepage Builder
CREATE TABLE IF NOT EXISTS public.homepage_sections (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    layout TEXT NOT NULL DEFAULT 'grid' CHECK (layout IN ('hero', 'grid', 'carousel', 'rail', 'list', 'featured_card')),
    data_source TEXT NOT NULL DEFAULT 'curated' CHECK (data_source IN ('curated', 'trending', 'featured_knowledge', 'culture', 'geography', 'places', 'creators', 'communities', 'festivals', 'businesses')),
    config JSONB DEFAULT '{"limit": 6, "badge": null, "cta_text": "Explore", "cta_link": "/app/explore"}'::jsonb,
    selected_ids JSONB DEFAULT '[]'::jsonb,
    sort_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    schedule_publish TIMESTAMPTZ,
    schedule_unpublish TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_homepage_sections_sort ON public.homepage_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_vis ON public.homepage_sections(is_visible);

-- 8. Navigation Builder
CREATE TABLE IF NOT EXISTS public.navigation_menus (
    id TEXT PRIMARY KEY,
    location TEXT NOT NULL UNIQUE, -- 'header', 'sidebar', 'footer', 'mobile_tab'
    title TEXT NOT NULL,
    items JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Centralized Media Assets Library
CREATE TABLE IF NOT EXISTS public.media_assets (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'audio', 'document')),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    mime_type TEXT,
    size_bytes BIGINT DEFAULT 0,
    copyright_status TEXT NOT NULL DEFAULT 'licensed' CHECK (copyright_status IN ('public_domain', 'creative_commons', 'licensed', 'owned', 'fair_use')),
    license TEXT,
    creator TEXT,
    source TEXT,
    alt_text TEXT,
    caption TEXT,
    usage_rights TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_file_type ON public.media_assets(file_type);

-- 10. Platform Audit Logs (Append-Only)
CREATE TABLE IF NOT EXISTS public.studio_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID,
    actor_role TEXT NOT NULL DEFAULT 'Super Admin',
    action TEXT NOT NULL, -- 'login', 'create', 'edit', 'delete', 'publish', 'unpublish', 'verify', 'reject', 'restore', 'permission_change', 'api_key_create', 'api_key_revoke', 'enterprise_access', 'data_export', 'billing_change'
    target_type TEXT NOT NULL,
    target_id TEXT,
    target_title TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON public.studio_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.studio_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_target_type ON public.studio_audit_logs(target_type);

-- 11. Enterprise Organizations & Workspaces
CREATE TABLE IF NOT EXISTS public.enterprise_organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    plan TEXT DEFAULT 'enterprise',
    billing_status TEXT DEFAULT 'active',
    seats_limit INT DEFAULT 25,
    seats_used INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.enterprise_workspaces (
    id TEXT PRIMARY KEY,
    org_id TEXT REFERENCES public.enterprise_organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.enterprise_api_keys (
    id TEXT PRIMARY KEY,
    org_id TEXT REFERENCES public.enterprise_organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_prefix TEXT NOT NULL,
    scopes JSONB DEFAULT '["read:knowledge", "read:graph", "read:search"]'::jsonb,
    rate_limit_rpm INT DEFAULT 600,
    is_revoked BOOLEAN DEFAULT false,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. AI Configuration & Epistemic Audit
CREATE TABLE IF NOT EXISTS public.ai_agent_configs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    model TEXT NOT NULL DEFAULT 'gemini-1.5-pro',
    system_prompt TEXT NOT NULL,
    temperature NUMERIC(3,2) DEFAULT 0.40,
    source_policies JSONB DEFAULT '["require_canonical_sources", "disallow_hallucinated_dogma"]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 13. Knowledge Disputes & Conflict Resolution
CREATE TABLE IF NOT EXISTS public.knowledge_disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    knowledge_object_id TEXT REFERENCES public.knowledge_objects(id) ON DELETE CASCADE,
    filed_by UUID,
    reason TEXT NOT NULL,
    evidence TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'dismissed')),
    resolution_notes TEXT,
    resolved_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Consumer read-only for published items; Studio roles for mutations.
-- ==============================================================================

ALTER TABLE public.knowledge_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxonomy_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_audit_logs ENABLE ROW LEVEL SECURITY;

-- Public & Consumer Readers: can view published items
DROP POLICY IF EXISTS "Public can view published knowledge objects" ON public.knowledge_objects;
CREATE POLICY "Public can view published knowledge objects" ON public.knowledge_objects
    FOR SELECT USING (status = 'published' AND is_archived = false);

DROP POLICY IF EXISTS "Public can view active taxonomy" ON public.taxonomy_nodes;
CREATE POLICY "Public can view active taxonomy" ON public.taxonomy_nodes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view visible homepage sections" ON public.homepage_sections;
CREATE POLICY "Public can view visible homepage sections" ON public.homepage_sections
    FOR SELECT USING (is_visible = true);

DROP POLICY IF EXISTS "Public can view published content" ON public.content_items;
CREATE POLICY "Public can view published content" ON public.content_items
    FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public can view relationships" ON public.knowledge_relationships;
CREATE POLICY "Public can view relationships" ON public.knowledge_relationships
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view media" ON public.media_assets;
CREATE POLICY "Public can view media" ON public.media_assets
    FOR SELECT USING (true);

-- Studio / Admin Full Access Policy helper
DROP POLICY IF EXISTS "Authenticated studio staff full access" ON public.knowledge_objects;
CREATE POLICY "Authenticated studio staff full access" ON public.knowledge_objects
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated studio staff full relationships" ON public.knowledge_relationships;
CREATE POLICY "Authenticated studio staff full relationships" ON public.knowledge_relationships
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated studio staff full taxonomy" ON public.taxonomy_nodes;
CREATE POLICY "Authenticated studio staff full taxonomy" ON public.taxonomy_nodes
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated studio staff full homepage" ON public.homepage_sections;
CREATE POLICY "Authenticated studio staff full homepage" ON public.homepage_sections
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated studio staff full content" ON public.content_items;
CREATE POLICY "Authenticated studio staff full content" ON public.content_items
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated studio staff full media" ON public.media_assets;
CREATE POLICY "Authenticated studio staff full media" ON public.media_assets
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated studio staff full audit" ON public.studio_audit_logs;
CREATE POLICY "Authenticated studio staff full audit" ON public.studio_audit_logs
    FOR ALL USING (auth.role() = 'authenticated');
