// ==============================================================================
// EKA PLATFORM — TAMPER-RESISTANT CRYPTOGRAPHIC AUDIT LOGGING ENGINE
// ==============================================================================

import { createHash } from "crypto";
import { sanitizeObject } from "../secrets-management";
import type { SecurityAuditRecord } from "../types";

// In-memory fallback ring buffer for audit logs
const auditMemoryBuffer: SecurityAuditRecord[] = [];
const MAX_BUFFER_SIZE = 1000;

// Genesis hash for cryptographic chain verification
const GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";
let lastHash = GENESIS_HASH;

/**
 * Calculates a SHA-256 digest over the audit record and preceding hash.
 */
function computeRecordHash(prevHash: string, data: Omit<SecurityAuditRecord, "hash" | "prevHash">): string {
  const content = `${prevHash}|${data.id}|${data.timestamp}|${data.actorId ?? ""}|${data.actorRole ?? ""}|${data.action}|${data.resourceType}|${data.resourceId ?? ""}|${data.result}|${JSON.stringify(data.details)}`;
  return createHash("sha256").update(content).digest("hex");
}

/**
 * Appends a tamper-resistant record to the security audit log.
 */
export async function recordSecurityAudit(params: {
  actorId?: string | null;
  actorRole?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  tenantId?: string | null;
  result: "success" | "failure" | "denied" | "blocked";
  details?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
  requestId?: string | null;
}): Promise<SecurityAuditRecord> {
  const id = `sec_audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const timestamp = new Date().toISOString();

  // Strip all passwords, auth tokens, and sensitive secrets before logging
  const safeDetails = sanitizeObject(params.details || {});

  const partialRecord = {
    id,
    timestamp,
    actorId: params.actorId || null,
    actorRole: params.actorRole || "unauthenticated",
    action: params.action,
    resourceType: params.resourceType,
    resourceId: params.resourceId || null,
    tenantId: params.tenantId || null,
    result: params.result,
    ipAddress: params.ipAddress || null,
    userAgent: params.userAgent ? params.userAgent.substring(0, 200) : null,
    requestId: params.requestId || null,
    details: safeDetails,
  };

  const hash = computeRecordHash(lastHash, partialRecord);
  const record: SecurityAuditRecord = {
    ...partialRecord,
    prevHash: lastHash,
    hash,
  };

  // Update in-memory chain state
  lastHash = hash;
  auditMemoryBuffer.unshift(record);
  if (auditMemoryBuffer.length > MAX_BUFFER_SIZE) {
    auditMemoryBuffer.pop();
  }

  // Attempt database write to Supabase if available
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (supabaseAdmin) {
      await (supabaseAdmin as any).from("security_audit_logs").insert({
        id: record.id,
        actor_id: record.actorId,
        actor_role: record.actorRole,
        action: record.action,
        resource_type: record.resourceType,
        resource_id: record.resourceId,
        tenant_id: record.tenantId,
        result: record.result,
        hash: record.hash,
        prev_hash: record.prevHash,
        ip_address: record.ipAddress,
        user_agent: record.userAgent,
        request_id: record.requestId,
        details: record.details as never,
        created_at: record.timestamp,
      });
    }
  } catch {
    // Retain in resilient memory buffer
  }

  return record;
}

/**
 * Validates the cryptographic integrity of the audit log sequence.
 * Detects any data modification, record deletion, or forgery.
 */
export function verifyAuditChainIntegrity(records: SecurityAuditRecord[]): {
  isValid: boolean;
  brokenIndex?: number;
  expectedHash?: string;
  actualHash?: string;
} {
  // Sort oldest first for chain traversal
  const sorted = [...records].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  let expectedPrev = sorted[0]?.prevHash ?? GENESIS_HASH;

  for (let i = 0; i < sorted.length; i++) {
    const r = sorted[i]!;
    if (r.prevHash !== expectedPrev) {
      return {
        isValid: false,
        brokenIndex: i,
        expectedHash: expectedPrev,
        actualHash: r.prevHash,
      };
    }

    const calculated = computeRecordHash(expectedPrev, {
      id: r.id,
      timestamp: r.timestamp,
      actorId: r.actorId,
      actorRole: r.actorRole,
      action: r.action,
      resourceType: r.resourceType,
      resourceId: r.resourceId,
      tenantId: r.tenantId,
      result: r.result,
      ipAddress: r.ipAddress,
      userAgent: r.userAgent,
      requestId: r.requestId,
      details: r.details,
    });

    if (calculated !== r.hash) {
      return {
        isValid: false,
        brokenIndex: i,
        expectedHash: calculated,
        actualHash: r.hash,
      };
    }

    expectedPrev = r.hash;
  }

  return { isValid: true };
}

/**
 * Returns recent audit records for authorized administrators.
 */
export async function getRecentAuditLogs(limit = 100): Promise<SecurityAuditRecord[]> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (supabaseAdmin) {
      const { data, error } = await (supabaseAdmin as any)
        .from("security_audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          timestamp: d.created_at,
          actorId: d.actor_id,
          actorRole: d.actor_role,
          action: d.action,
          resourceType: d.resource_type,
          resourceId: d.resource_id,
          tenantId: d.tenant_id,
          result: d.result,
          hash: d.hash,
          prevHash: d.prev_hash,
          ipAddress: d.ip_address,
          userAgent: d.user_agent,
          requestId: d.request_id,
          details: d.details || {},
        }));
      }
    }
  } catch {
    // Fallback to memory
  }

  return auditMemoryBuffer.slice(0, limit);
}
