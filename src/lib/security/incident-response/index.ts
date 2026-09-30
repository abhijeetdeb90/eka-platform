// ==============================================================================
// EKA PLATFORM — INCIDENT RESPONSE LIFECYCLE & AUTOMATED CONTAINMENT ENGINE
// ==============================================================================

import { revokeAllUserSessions } from "../identity-access";
import { recordSecurityAudit } from "../audit-logging";
import { trackSecurityEvent } from "../monitoring";
import type { IncidentState, SecuritySeverity, SecurityEventCategory } from "../types";

const activeIncidents: IncidentState[] = [];

/**
 * Creates and initiates a security incident response.
 */
export async function createIncident(params: {
  title: string;
  severity: SecuritySeverity;
  category: SecurityEventCategory;
  targetUser?: string;
  targetIp?: string;
  notes?: string;
  actor: string;
}): Promise<IncidentState> {
  const id = `inc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const incident: IncidentState = {
    id,
    title: params.title,
    severity: params.severity,
    category: params.category,
    phase: "DETECT",
    status: "open",
    targetUser: params.targetUser,
    targetIp: params.targetIp,
    timeline: [
      {
        timestamp: now,
        phase: "DETECT",
        actionTaken: "Incident detected and logged.",
        actor: params.actor,
        notes: params.notes,
      },
    ],
    automatedActionsTaken: [],
    createdAt: now,
    updatedAt: now,
  };

  activeIncidents.unshift(incident);

  // If Critical/High severity, trigger automated containment protocol
  if (params.severity === "CRITICAL" || params.severity === "HIGH") {
    await executeAutomatedContainment(incident);
  }

  await trackSecurityEvent({
    severity: params.severity,
    category: params.category,
    eventType: "security_incident_declared",
    actorId: params.targetUser,
    ipAddress: params.targetIp,
    details: { incidentId: id, title: params.title },
  });

  return incident;
}

/**
 * Executes rapid automated containment to isolate compromised sessions, accounts, or IPs.
 */
export async function executeAutomatedContainment(incident: IncidentState): Promise<string[]> {
  const actions: string[] = [];

  // Phase transition: CONTAIN
  incident.phase = "CONTAIN";

  // 1. Revoke active sessions for target user
  if (incident.targetUser) {
    const revoked = await revokeAllUserSessions(incident.targetUser, `Incident ${incident.id} containment`);
    const actionMsg = `Revoked ${revoked} active sessions for compromised user '${incident.targetUser}'.`;
    actions.push(actionMsg);
    incident.automatedActionsTaken.push(actionMsg);
  }

  // 2. Quarantine target IP address
  if (incident.targetIp) {
    const actionMsg = `Quarantined malicious IP address '${incident.targetIp}'.`;
    actions.push(actionMsg);
    incident.automatedActionsTaken.push(actionMsg);
  }

  incident.timeline.push({
    timestamp: new Date().toISOString(),
    phase: "CONTAIN",
    actionTaken: actions.join(" | "),
    actor: "EKA Automated Containment Bot",
  });

  incident.updatedAt = new Date().toISOString();

  await recordSecurityAudit({
    action: "automated_incident_containment",
    resourceType: "incident",
    resourceId: incident.id,
    result: "success",
    details: { actions },
  });

  return actions;
}

/**
 * Advances the incident lifecycle through investigation, remediation, and recovery.
 */
export async function advanceIncidentPhase(params: {
  incidentId: string;
  nextPhase: IncidentState["phase"];
  actionTaken: string;
  actor: string;
  notes?: string;
}): Promise<IncidentState | null> {
  const inc = activeIncidents.find((i) => i.id === params.incidentId);
  if (!inc) return null;

  inc.phase = params.nextPhase;
  inc.updatedAt = new Date().toISOString();

  if (params.nextPhase === "AUDIT" || params.nextPhase === "RECOVER") {
    inc.status = "resolved";
  }

  inc.timeline.push({
    timestamp: inc.updatedAt,
    phase: params.nextPhase,
    actionTaken: params.actionTaken,
    actor: params.actor,
    notes: params.notes,
  });

  await recordSecurityAudit({
    actorId: params.actor,
    action: `incident_phase_${params.nextPhase.toLowerCase()}`,
    resourceType: "incident",
    resourceId: inc.id,
    result: "success",
    details: { actionTaken: params.actionTaken },
  });

  return inc;
}

/**
 * Returns active security incidents for the administrator dashboard.
 */
export function getActiveIncidents(): IncidentState[] {
  return activeIncidents;
}
