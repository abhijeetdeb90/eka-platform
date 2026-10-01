// ==============================================================================
// EKA STUDIO — SYSTEM, AI, ENTERPRISE & GOVERNANCE SERVICE
// ==============================================================================

import { supabase } from "@/integrations/supabase/client";
import { logStudioAction } from "./audit";
import type { AIAgentConfig, EnterpriseApiKey, EnterpriseOrg, StudioRole } from "./types";

export const SEED_ENTERPRISE_ORGS: EnterpriseOrg[] = [
  {
    id: "org_oxford_indology",
    name: "Oxford Centre for Hindu Studies & Sanskrit Archive",
    slug: "ochs-archive",
    plan: "Institutional Academic",
    billing_status: "active",
    seats_limit: 50,
    seats_used: 14,
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "org_kashi_trust",
    name: "Kashi Vishwanath Cultural Heritage Trust",
    slug: "kashi-trust",
    plan: "Heritage Custodian",
    billing_status: "active",
    seats_limit: 20,
    seats_used: 8,
    created_at: "2026-09-05T10:00:00Z",
  },
  {
    id: "org_nalanda_monastic",
    name: "International Nalanda Institute of Buddhist Studies",
    slug: "nalanda-institute",
    plan: "Enterprise Research",
    billing_status: "active",
    seats_limit: 35,
    seats_used: 12,
    created_at: "2026-09-10T12:00:00Z",
  },
];

export const SEED_API_KEYS: EnterpriseApiKey[] = [
  {
    id: "key_ochs_prod",
    org_id: "org_oxford_indology",
    name: "Production Graph Embeddings API",
    key_prefix: "eka_live_ochs_99a8",
    scopes: ["read:knowledge", "read:graph", "read:sources"],
    rate_limit_rpm: 1200,
    is_revoked: false,
    last_used_at: "2026-09-28T01:15:00Z",
    created_at: "2026-09-02T09:00:00Z",
  },
  {
    id: "key_kashi_sync",
    org_id: "org_kashi_trust",
    name: "Temple Inscription Sync Agent",
    key_prefix: "eka_live_kashi_44bc",
    scopes: ["read:knowledge", "read:places", "write:disputes"],
    rate_limit_rpm: 600,
    is_revoked: false,
    last_used_at: "2026-09-27T18:40:00Z",
    created_at: "2026-09-06T11:00:00Z",
  },
];

export const SEED_AI_AGENTS: AIAgentConfig[] = [
  {
    id: "ai_epistemic_verifier",
    name: "Epistemic Tier Classifier",
    role: "Validates canonical scripture citations and identifies hallucinations",
    model: "gemini-1.5-pro",
    system_prompt: `You are the EKA Epistemic Verification Engine. Strict rules:\n1. Never invent or attribute verses not present in canonical texts.\n2. Disclose differences between canonical scripture and folk living practice.\n3. Identify sectarian polemics and tag as 'interpretation' rather than objective tradition.`,
    temperature: 0.2,
    source_policies: ["require_canonical_sources", "disallow_hallucinated_dogma"],
    is_active: true,
    updated_at: "2026-09-20T12:00:00Z",
  },
  {
    id: "ai_cultural_retriever",
    name: "Cross-Tradition Hermeneutic Navigator",
    role: "Finds universal contemplative parallels across world traditions",
    model: "gemini-1.5-flash",
    system_prompt: `You are the EKA Hermeneutic Parallel Navigator. Connect ideas across traditions with deep reverence for each tradition's unique terminology.`,
    temperature: 0.5,
    source_policies: ["allow_academic_secondary", "respect_indigenous_lineages"],
    is_active: true,
    updated_at: "2026-09-22T14:00:00Z",
  },
];

let liveOrgs = [...SEED_ENTERPRISE_ORGS];
let liveApiKeys = [...SEED_API_KEYS];
let liveAIAgents = [...SEED_AI_AGENTS];

export async function fetchEnterpriseOrgs(): Promise<EnterpriseOrg[]> {
  return [...liveOrgs];
}

export async function fetchApiKeys(): Promise<EnterpriseApiKey[]> {
  return [...liveApiKeys];
}

export async function createApiKey(
  params: { org_id: string; name: string; scopes: string[] },
  actorRole: StudioRole = "Enterprise Admin",
): Promise<EnterpriseApiKey> {
  const newKey: EnterpriseApiKey = {
    id: `key_${Date.now()}`,
    org_id: params.org_id,
    name: params.name,
    key_prefix: `eka_live_${Math.random().toString(36).substring(2, 6)}_${Math.random().toString(36).substring(2, 6)}`,
    scopes: params.scopes,
    rate_limit_rpm: 600,
    is_revoked: false,
    created_at: new Date().toISOString(),
  };

  liveApiKeys.unshift(newKey);

  await logStudioAction({
    actor_role: actorRole,
    action: "api_key_create",
    target_type: "api_key",
    target_id: newKey.id,
    target_title: newKey.name,
    details: { org_id: newKey.org_id, scopes: newKey.scopes },
  });

  return newKey;
}

export async function revokeApiKey(
  id: string,
  actorRole: StudioRole = "Enterprise Admin",
): Promise<void> {
  const key = liveApiKeys.find((k) => k.id === id);
  if (!key) return;
  key.is_revoked = true;

  await logStudioAction({
    actor_role: actorRole,
    action: "api_key_revoke",
    target_type: "api_key",
    target_id: id,
    target_title: key.name,
    details: { revoked: true },
  });
}

export async function fetchAIAgents(): Promise<AIAgentConfig[]> {
  return [...liveAIAgents];
}

export async function saveAIAgent(
  agent: Partial<AIAgentConfig> & { id: string },
  actorRole: StudioRole = "Super Admin",
): Promise<AIAgentConfig> {
  const idx = liveAIAgents.findIndex((a) => a.id === agent.id);
  const existing = liveAIAgents[idx];
  if (!existing || idx < 0) throw new Error("Agent not found");

  const updated: AIAgentConfig = {
    ...existing,
    ...agent,
    id: existing.id,
    name: agent.name ?? existing.name,
    role: agent.role ?? existing.role,
    model: agent.model ?? existing.model,
    system_prompt: agent.system_prompt ?? existing.system_prompt,
    temperature: agent.temperature ?? existing.temperature,
    source_policies: agent.source_policies ?? existing.source_policies,
    is_active: agent.is_active ?? existing.is_active,
    updated_at: new Date().toISOString(),
  };
  liveAIAgents[idx] = updated;

  await logStudioAction({
    actor_role: actorRole,
    action: "edit",
    target_type: "config",
    target_id: updated.id,
    target_title: `AI Agent: ${updated.name}`,
    details: { model: updated.model, temp: updated.temperature },
  });

  return updated;
}

// Backup & Disaster Recovery Exporter
export async function generatePlatformBackupBundle(actorRole: StudioRole = "Founder") {
  const bundle = {
    system: "EKA Studio Control Plane",
    backup_timestamp: new Date().toISOString(),
    version: "1.0-canonical",
    metadata: {
      generated_by_role: actorRole,
      format: "JSON-Archive",
      compliance: "DPDP / Archival Benchmark",
    },
    tables: {
      knowledge_objects: liveOrgs, // schema representations
      enterprise_organizations: liveOrgs,
      api_keys: liveApiKeys.map((k) => ({ ...k, secret: "[REDACTED]" })),
      ai_configs: liveAIAgents,
    },
  };

  await logStudioAction({
    actor_role: actorRole,
    action: "data_export",
    target_type: "config",
    target_title: "Disaster Recovery Backup Bundle",
    details: { timestamp: bundle.backup_timestamp },
  });

  return JSON.stringify(bundle, null, 2);
}
