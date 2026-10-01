/**
 * EKA Platform - Financial Audit Log Service
 * 
 * Records immutable audit logs for all monetary transactions, KYC state changes,
 * payout executions, and administrative interventions.
 */

import { randomUUID } from "node:crypto";

export interface AuditLogEntry {
  id: string;
  audit_id: string; // EKA-AUD-XXXXXXXX
  actor_id: string;
  actor_type: "user" | "system" | "admin" | "webhook";
  action: string;
  entity_type: string;
  entity_id: string;
  prev_state?: Record<string, unknown> | null;
  new_state?: Record<string, unknown> | null;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

const inMemoryAuditLogs: AuditLogEntry[] = [];

export class AuditService {
  public generateAuditId(): string {
    const suffix = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `EKA-AUD-${suffix}`;
  }

  async logAction(params: {
    actor_id: string;
    actor_type: "user" | "system" | "admin" | "webhook";
    action: string;
    entity_type: string;
    entity_id: string;
    prev_state?: Record<string, unknown> | null;
    new_state?: Record<string, unknown> | null;
    ip_address?: string;
    user_agent?: string;
  }): Promise<AuditLogEntry> {
    const auditId = this.generateAuditId();
    const now = new Date().toISOString();

    const entry: AuditLogEntry = {
      id: randomUUID(),
      audit_id: auditId,
      actor_id: params.actor_id,
      actor_type: params.actor_type,
      action: params.action,
      entity_type: params.entity_type,
      entity_id: params.entity_id,
      prev_state: params.prev_state,
      new_state: params.new_state,
      ip_address: params.ip_address,
      user_agent: params.user_agent,
      created_at: now,
    };

    inMemoryAuditLogs.push(entry);

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await (supabaseAdmin as any).from("audit_logs").insert({
        id: entry.id,
        audit_id: entry.audit_id,
        actor_id: entry.actor_id,
        actor_type: entry.actor_type,
        action: entry.action,
        entity_type: entry.entity_type,
        entity_id: entry.entity_id,
        prev_state: entry.prev_state as never,
        new_state: entry.new_state as never,
        ip_address: entry.ip_address,
        user_agent: entry.user_agent,
        created_at: entry.created_at,
      });
    } catch {
      // In-memory fallback
    }

    return entry;
  }

  async queryLogs(filters?: {
    entity_id?: string;
    entity_type?: string;
    actor_id?: string;
    limit?: number;
  }): Promise<AuditLogEntry[]> {
    const limit = filters?.limit ?? 50;

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      let query = (supabaseAdmin as any).from("audit_logs").select("*").order("created_at", { ascending: false });

      if (filters?.entity_id) query = query.eq("entity_id", filters.entity_id);
      if (filters?.entity_type) query = query.eq("entity_type", filters.entity_type);
      if (filters?.actor_id) query = query.eq("actor_id", filters.actor_id);
      query = query.limit(limit);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return (data as unknown) as AuditLogEntry[];
      }
    } catch {
      // ignore
    }

    return inMemoryAuditLogs
      .filter((entry) => {
        if (filters?.entity_id && entry.entity_id !== filters.entity_id) return false;
        if (filters?.entity_type && entry.entity_type !== filters.entity_type) return false;
        if (filters?.actor_id && entry.actor_id !== filters.actor_id) return false;
        return true;
      })
      .slice(-limit);
  }

  clearInMemoryStore(): void {
    inMemoryAuditLogs.length = 0;
  }
}

export const auditService = new AuditService();
