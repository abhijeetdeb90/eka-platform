// ==============================================================================
// EKA STUDIO — LEAST-PRIVILEGE ROLE-BASED ACCESS CONTROL (11 ROLES)
// ==============================================================================

import type { StudioPermission, StudioRole } from "./types";

export const STUDIO_ROLES: StudioRole[] = [
  "Founder",
  "Super Admin",
  "Content Admin",
  "Knowledge Editor",
  "Verifier",
  "Community Moderator",
  "Creator Manager",
  "Support",
  "Enterprise Admin",
  "Analyst",
  "Read Only",
];

export const ROLE_DESCRIPTIONS: Record<StudioRole, string> = {
  Founder: "Full platform ownership, legal provenance, treasury controls, and governance overrides.",
  "Super Admin": "Full operational management, system configurations, feature flags, and security audits.",
  "Content Admin": "Authoring, editing, publishing, and scheduling articles, collections, pages, and media.",
  "Knowledge Editor": "Curating canonical Knowledge Objects, relationship edges, and taxonomy branches.",
  Verifier: "Auditing multi-source provenance, academic peer endorsements, and dispute adjudication.",
  "Community Moderator": "Enforcing community standards, resolving member disputes, and managing report queues.",
  "Creator Manager": "Managing creator KYC, authentications, score milestones, and payout authorizations.",
  Support: "Triaging member issues, viewing verification histories, and non-destructive assistance.",
  "Enterprise Admin": "Configuring corporate workspaces, API keys, usage quotas, and institutional integrations.",
  Analyst: "Platform telemetry, engagement metrics, knowledge depth trends, and economic reports.",
  "Read Only": "Audit inspection and review mode without mutation privileges.",
};

const ALL_PERMISSIONS: StudioPermission[] = [
  "content:create",
  "content:edit",
  "content:publish",
  "content:archive",
  "content:delete",
  "knowledge:create",
  "knowledge:edit",
  "knowledge:verify",
  "knowledge:restore",
  "knowledge:archive",
  "graph:edit",
  "taxonomy:edit",
  "homepage:edit",
  "navigation:edit",
  "media:upload",
  "media:delete",
  "users:moderate",
  "users:manage_roles",
  "enterprise:manage",
  "api_keys:manage",
  "monetization:manage",
  "config:edit",
  "flags:edit",
  "audit:view",
  "system:diagnostics",
  "backups:manage",
];

export const ROLE_PERMISSIONS: Record<StudioRole, StudioPermission[]> = {
  Founder: ALL_PERMISSIONS,
  "Super Admin": ALL_PERMISSIONS,
  "Content Admin": [
    "content:create",
    "content:edit",
    "content:publish",
    "content:archive",
    "content:delete",
    "homepage:edit",
    "navigation:edit",
    "media:upload",
    "media:delete",
    "audit:view",
  ],
  "Knowledge Editor": [
    "knowledge:create",
    "knowledge:edit",
    "knowledge:restore",
    "knowledge:archive",
    "graph:edit",
    "taxonomy:edit",
    "media:upload",
    "audit:view",
  ],
  Verifier: [
    "knowledge:edit",
    "knowledge:verify",
    "audit:view",
  ],
  "Community Moderator": [
    "users:moderate",
    "audit:view",
  ],
  "Creator Manager": [
    "users:moderate",
    "monetization:manage",
    "audit:view",
  ],
  Support: [
    "audit:view",
  ],
  "Enterprise Admin": [
    "enterprise:manage",
    "api_keys:manage",
    "audit:view",
  ],
  Analyst: [
    "audit:view",
    "system:diagnostics",
  ],
  "Read Only": [
    "audit:view",
  ],
};

export function canUser(role: StudioRole, permission: StudioPermission): boolean {
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(permission);
}

export function getRoleBadgeClass(role: StudioRole): string {
  switch (role) {
    case "Founder":
      return "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold";
    case "Super Admin":
      return "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400 font-semibold";
    case "Content Admin":
      return "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "Knowledge Editor":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "Verifier":
      return "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium";
    case "Creator Manager":
      return "border-orange-500/40 bg-orange-500/10 text-orange-600 dark:text-orange-400";
    case "Enterprise Admin":
      return "border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400";
    case "Analyst":
      return "border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400";
    default:
      return "border-border bg-muted/50 text-muted-foreground";
  }
}
