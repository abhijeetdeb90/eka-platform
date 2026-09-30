-- ==============================================================================
-- EKA PLATFORM — ENTERPRISE-GRADE SECURITY & TRUST LAYER MIGRATION (v1.0)
-- Migration: 20260929000000_eka_enterprise_security_layer.sql
-- Description: Zero-Trust Security Infrastructure, Append-Only Cryptographic Audit Logs,
-- Security Events, MFA Credentials, Session Management, Quarantine, and Hardened RLS.
-- ==============================================================================

-- 1. Helper function: Check if authenticated user is Founder or Super Admin
CREATE OR REPLACE FUNCTION public.is_admin_or_founder()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.studio_user_roles
    WHERE user_id = auth.uid()
      AND role IN ('Founder', 'Super Admin')
  );
$$;

-- 2. Helper function: Check if authenticated user has editing privileges
CREATE OR REPLACE FUNCTION public.is_studio_editor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.studio_user_roles
    WHERE user_id = auth.uid()
      AND role IN ('Founder', 'Super Admin', 'Content Admin', 'Knowledge Editor', 'Verifier')
  );
$$;

-- 3. Security Events Table (Centralized Threat Event System)
CREATE TABLE IF NOT EXISTS public.security_events (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT now(),
    severity TEXT NOT NULL CHECK (severity IN ('INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    category TEXT NOT NULL,
    event_type TEXT NOT NULL,
    actor_id TEXT,
    actor_role TEXT,
    ip_address TEXT,
    user_agent TEXT,
    resource TEXT,
    tenant_id TEXT,
    status TEXT NOT NULL DEFAULT 'detected' CHECK (status IN ('detected', 'blocked', 'quarantined', 'mitigated', 'investigating', 'resolved')),
    details JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sec_events_severity ON public.security_events(severity);
CREATE INDEX IF NOT EXISTS idx_sec_events_category ON public.security_events(category);
CREATE INDEX IF NOT EXISTS idx_sec_events_actor ON public.security_events(actor_id);
CREATE INDEX IF NOT EXISTS idx_sec_events_created ON public.security_events(created_at DESC);

-- 4. Cryptographic Tamper-Resistant Security Audit Logs Table
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id TEXT PRIMARY KEY,
    actor_id TEXT,
    actor_role TEXT DEFAULT 'unauthenticated',
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    tenant_id TEXT,
    result TEXT NOT NULL CHECK (result IN ('success', 'failure', 'denied', 'blocked')),
    hash TEXT NOT NULL,
    prev_hash TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    request_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sec_audit_created ON public.security_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sec_audit_action ON public.security_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_sec_audit_actor ON public.security_audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_sec_audit_resource ON public.security_audit_logs(resource_type, resource_id);

-- 5. Active User Sessions & Device Fingerprints Table
CREATE TABLE IF NOT EXISTS public.active_user_sessions (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL,
    device_fingerprint TEXT NOT NULL,
    device_type TEXT DEFAULT 'unknown',
    browser TEXT,
    os TEXT,
    ip_address TEXT,
    location TEXT,
    last_active_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    is_revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON public.active_user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.active_user_sessions(user_id, is_revoked);

-- 6. User MFA Credentials Table (TOTP & Hashed Backup Codes)
CREATE TABLE IF NOT EXISTS public.user_mfa_credentials (
    user_id UUID PRIMARY KEY,
    secret_encrypted TEXT NOT NULL,
    backup_codes_hashes JSONB DEFAULT '[]'::jsonb,
    is_enabled BOOLEAN DEFAULT false,
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Security Quarantine Table (Isolates compromised accounts, malicious IPs & banned domains)
CREATE TABLE IF NOT EXISTS public.security_quarantine (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_type TEXT NOT NULL CHECK (target_type IN ('user', 'ip', 'domain', 'api_key')),
    target_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'HIGH',
    expires_at TIMESTAMPTZ,
    created_by TEXT DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(target_type, target_id)
);

CREATE INDEX IF NOT EXISTS idx_quarantine_lookup ON public.security_quarantine(target_type, target_id);

-- 8. Phishing Domain Reputation Cache Table
CREATE TABLE IF NOT EXISTS public.phishing_domain_reputation (
    domain TEXT PRIMARY KEY,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW RISK', 'SUSPICIOUS', 'HIGH RISK', 'CRITICAL')),
    reasons JSONB DEFAULT '[]'::jsonb,
    report_count INT DEFAULT 1,
    is_blocked BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. DPDP Act (2023) Statutory Data Export Requests Table
CREATE TABLE IF NOT EXISTS public.data_export_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'expired')),
    download_url TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_export_requests_user ON public.data_export_requests(user_id);

-- ==============================================================================
-- HARDENED ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all new security tables
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mfa_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_quarantine ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phishing_domain_reputation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_export_requests ENABLE ROW LEVEL SECURITY;

-- Security Events: Only Admin/Founder or service_role can view or modify
CREATE POLICY "Admin and service_role can view security events" ON public.security_events
    FOR SELECT USING (public.is_admin_or_founder() OR auth.role() = 'service_role');

CREATE POLICY "Service role can insert security events" ON public.security_events
    FOR INSERT WITH CHECK (auth.role() = 'service_role' OR public.is_admin_or_founder());

-- Security Audit Logs: STRICTLY APPEND-ONLY, readable only by Admin/Founder or service_role
CREATE POLICY "Admin and service_role can view audit logs" ON public.security_audit_logs
    FOR SELECT USING (public.is_admin_or_founder() OR auth.role() = 'service_role');

CREATE POLICY "Service role can append audit logs" ON public.security_audit_logs
    FOR INSERT WITH CHECK (auth.role() = 'service_role' OR public.is_admin_or_founder());

-- Active User Sessions: Users can only see and revoke their own sessions
CREATE POLICY "Users manage own sessions" ON public.active_user_sessions
    FOR ALL USING (auth.uid() = user_id OR public.is_admin_or_founder() OR auth.role() = 'service_role');

-- User MFA Credentials: Users can view/manage own MFA; secrets cannot be exposed to others
CREATE POLICY "Users manage own mfa" ON public.user_mfa_credentials
    FOR ALL USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Security Quarantine: Only Admins or service_role can manage quarantine
CREATE POLICY "Admin manage quarantine" ON public.security_quarantine
    FOR ALL USING (public.is_admin_or_founder() OR auth.role() = 'service_role');

-- Phishing Reputation: Public read for safe URL evaluation; Admin/service_role write
CREATE POLICY "Public read phishing reputation" ON public.phishing_domain_reputation
    FOR SELECT USING (true);

CREATE POLICY "Admin manage phishing reputation" ON public.phishing_domain_reputation
    FOR ALL USING (public.is_admin_or_founder() OR auth.role() = 'service_role');

-- Data Export Requests: Users view/request own export; Admins manage
CREATE POLICY "Users view own export requests" ON public.data_export_requests
    FOR ALL USING (auth.uid() = user_id OR public.is_admin_or_founder() OR auth.role() = 'service_role');

-- ==============================================================================
-- HARDENING EXISTING OVERLY PERMISSIVE POLICIES FROM PREVIOUS MIGRATIONS
-- ==============================================================================

-- 1. Fix public.studio_audit_logs (previous migration allowed ANY authenticated user full read/write!)
DROP POLICY IF EXISTS "Authenticated studio staff full audit" ON public.studio_audit_logs;
CREATE POLICY "Strict admin and service access on studio audit" ON public.studio_audit_logs
    FOR ALL USING (public.is_admin_or_founder() OR auth.role() = 'service_role');

-- 2. Fix public.knowledge_objects (previous migration allowed ANY authenticated user full write access!)
DROP POLICY IF EXISTS "Authenticated studio staff full access" ON public.knowledge_objects;
CREATE POLICY "Authorized editors can mutate knowledge objects" ON public.knowledge_objects
    FOR ALL USING (public.is_studio_editor() OR auth.role() = 'service_role');

-- 3. Fix public.knowledge_relationships
DROP POLICY IF EXISTS "Authenticated studio staff full relationships" ON public.knowledge_relationships;
CREATE POLICY "Authorized editors can mutate relationships" ON public.knowledge_relationships
    FOR ALL USING (public.is_studio_editor() OR auth.role() = 'service_role');

-- 4. Fix public.taxonomy_nodes
DROP POLICY IF EXISTS "Authenticated studio staff full taxonomy" ON public.taxonomy_nodes;
CREATE POLICY "Authorized editors can mutate taxonomy" ON public.taxonomy_nodes
    FOR ALL USING (public.is_studio_editor() OR auth.role() = 'service_role');

-- 5. Fix public.homepage_sections
DROP POLICY IF EXISTS "Authenticated studio staff full homepage" ON public.homepage_sections;
CREATE POLICY "Authorized editors can mutate homepage" ON public.homepage_sections
    FOR ALL USING (public.is_studio_editor() OR auth.role() = 'service_role');

-- 6. Fix public.content_items
DROP POLICY IF EXISTS "Authenticated studio staff full content" ON public.content_items;
CREATE POLICY "Authorized editors can mutate content" ON public.content_items
    FOR ALL USING (public.is_studio_editor() OR auth.role() = 'service_role');

-- 7. Fix public.media_assets
DROP POLICY IF EXISTS "Authenticated studio staff full media" ON public.media_assets;
CREATE POLICY "Authorized editors can mutate media" ON public.media_assets
    FOR ALL USING (public.is_studio_editor() OR auth.role() = 'service_role');
