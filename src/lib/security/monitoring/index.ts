// ==============================================================================
// EKA PLATFORM — CENTRALIZED SECURITY EVENT MONITORING & AGGREGATOR
// ==============================================================================

import { sanitizeObject } from "../secrets-management";
import type { SecurityEvent, SecuritySeverity, SecurityEventCategory } from "../types";

const memoryEvents: SecurityEvent[] = [];
const MAX_EVENTS_IN_MEMORY = 500;

// Threat tracking per IP and per Actor ID
interface ThreatProfile {
  failuresCount: number;
  criticalEventsCount: number;
  lastEventTimestamp: number;
  isQuarantined: boolean;
  quarantineReason?: string;
}

const ipThreatProfiles = new Map<string, ThreatProfile>();
const userThreatProfiles = new Map<string, ThreatProfile>();

/**
 * Dispatches and records a platform security event.
 */
export async function trackSecurityEvent(params: {
  severity: SecuritySeverity;
  category: SecurityEventCategory;
  eventType: string;
  actorId?: string | null;
  actorRole?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  resource?: string | null;
  tenantId?: string | null;
  status?: SecurityEvent["status"];
  details?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}): Promise<SecurityEvent> {
  const id = `ev_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const timestamp = new Date().toISOString();

  const event: SecurityEvent = {
    id,
    timestamp,
    severity: params.severity,
    category: params.category,
    eventType: params.eventType,
    actorId: params.actorId || null,
    actorRole: params.actorRole || null,
    ipAddress: params.ipAddress || null,
    userAgent: params.userAgent || null,
    resource: params.resource || null,
    tenantId: params.tenantId || null,
    status: params.status || (params.severity === "CRITICAL" || params.severity === "HIGH" ? "blocked" : "detected"),
    details: sanitizeObject(params.details || {}),
    metadata: params.metadata || {},
  };

  // Add to memory ring buffer
  memoryEvents.unshift(event);
  if (memoryEvents.length > MAX_EVENTS_IN_MEMORY) {
    memoryEvents.pop();
  }

  // Update threat profiles and trigger automated containment if necessary
  evaluateThreatThresholds(event);

  // Write to Supabase if available
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (supabaseAdmin) {
      await supabaseAdmin.from("security_events").insert({
        id: event.id,
        severity: event.severity,
        category: event.category,
        event_type: event.eventType,
        actor_id: event.actorId,
        actor_role: event.actorRole,
        ip_address: event.ipAddress,
        user_agent: event.userAgent,
        resource: event.resource,
        tenant_id: event.tenantId,
        status: event.status,
        details: event.details as never,
        metadata: event.metadata as never,
        created_at: event.timestamp,
      });
    }
  } catch {
    // Retain in memory buffer
  }

  return event;
}

/**
 * Evaluates real-time threat thresholds to detect brute force, credential stuffing,
 * and high-velocity abuse.
 */
function evaluateThreatThresholds(event: SecurityEvent): void {
  const now = Date.now();

  const updateProfile = (map: Map<string, ThreatProfile>, key: string) => {
    let profile = map.get(key);
    if (!profile) {
      profile = {
        failuresCount: 0,
        criticalEventsCount: 0,
        lastEventTimestamp: now,
        isQuarantined: false,
      };
      map.set(key, profile);
    }

    // Reset window after 15 minutes of inactivity
    if (now - profile.lastEventTimestamp > 15 * 60 * 1000) {
      profile.failuresCount = 0;
      profile.criticalEventsCount = 0;
    }

    profile.lastEventTimestamp = now;

    if (event.severity === "HIGH" || event.severity === "CRITICAL") {
      profile.criticalEventsCount += 1;
    }
    if (event.category === "auth_failure" || event.category === "rbac_denial") {
      profile.failuresCount += 1;
    }

    // Threshold check: 5 critical events or 10 failures within 15 minutes -> quarantine
    if (profile.criticalEventsCount >= 5 || profile.failuresCount >= 10) {
      profile.isQuarantined = true;
      profile.quarantineReason = `Automated containment: threshold exceeded (${profile.failuresCount} failures, ${profile.criticalEventsCount} high/critical events)`;
      event.status = "quarantined";
    }
  };

  if (event.ipAddress) {
    updateProfile(ipThreatProfiles, event.ipAddress);
  }
  if (event.actorId) {
    updateProfile(userThreatProfiles, event.actorId);
  }
}

/**
 * Checks if an IP or User is currently quarantined.
 */
export function isEntityQuarantined(params: { ipAddress?: string; userId?: string }): {
  quarantined: boolean;
  reason?: string;
} {
  if (params.ipAddress) {
    const ipProf = ipThreatProfiles.get(params.ipAddress);
    if (ipProf?.isQuarantined) {
      return { quarantined: true, reason: ipProf.quarantineReason };
    }
  }
  if (params.userId) {
    const userProf = userThreatProfiles.get(params.userId);
    if (userProf?.isQuarantined) {
      return { quarantined: true, reason: userProf.quarantineReason };
    }
  }
  return { quarantined: false };
}

/**
 * Aggregates live threat statistics for the Admin Security Dashboard.
 */
export async function getSecurityMonitoringMetrics(): Promise<{
  activeThreats: number;
  blockedRequestsCount: number;
  phishingDetectionsCount: number;
  apiAbuseCount: number;
  abnormalDataAccessCount: number;
  eventsBySeverity: Record<SecuritySeverity, number>;
  recentEvents: SecurityEvent[];
}> {
  let events = memoryEvents;

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from("security_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      if (!error && data && data.length > 0) {
        events = data.map((d: any) => ({
          id: d.id,
          timestamp: d.created_at,
          severity: d.severity,
          category: d.category,
          eventType: d.event_type,
          actorId: d.actor_id,
          actorRole: d.actor_role,
          ipAddress: d.ip_address,
          userAgent: d.user_agent,
          resource: d.resource,
          tenantId: d.tenant_id,
          status: d.status,
          details: d.details || {},
          metadata: d.metadata || {},
        }));
      }
    }
  } catch {
    // fallback to memory
  }

  const eventsBySeverity: Record<SecuritySeverity, number> = {
    INFO: 0,
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0,
  };

  let blockedRequestsCount = 0;
  let phishingDetectionsCount = 0;
  let apiAbuseCount = 0;
  let abnormalDataAccessCount = 0;

  for (const ev of events) {
    eventsBySeverity[ev.severity] = (eventsBySeverity[ev.severity] || 0) + 1;

    if (ev.status === "blocked") blockedRequestsCount++;
    if (ev.category === "phishing_detected" || ev.category === "malicious_url_blocked")
      phishingDetectionsCount++;
    if (ev.category === "api_abuse" || ev.category === "rate_limit_breach") apiAbuseCount++;
    if (ev.category === "bulk_export" || ev.category === "data_exfiltration_alert")
      abnormalDataAccessCount++;
  }

  const activeThreats = eventsBySeverity.CRITICAL + eventsBySeverity.HIGH;

  return {
    activeThreats,
    blockedRequestsCount,
    phishingDetectionsCount,
    apiAbuseCount,
    abnormalDataAccessCount,
    eventsBySeverity,
    recentEvents: events.slice(0, 50),
  };
}
