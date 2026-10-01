// ==============================================================================
// EKA PLATFORM — ZERO-TRUST IDENTITY & ACCESS SECURITY ENGINE
// ==============================================================================

import { createHmac, randomBytes } from "crypto";
import { canUser } from "@/lib/studio/rbac";
import type { StudioPermission, StudioRole } from "@/lib/studio/types";
import { trackSecurityEvent } from "../monitoring";
import { recordSecurityAudit } from "../audit-logging";
import type { PasswordValidationResult, UserSession, MfaVerificationResult } from "../types";

// Common breached passwords blacklist (sample of top breached credentials)
const COMMON_PASSWORDS_BLACKLIST = new Set([
  "password", "123456", "12345678", "123456789", "qwerty", "password123",
  "admin123", "welcome", "welcome123", "letmein", "monkey", "dragon",
  "football", "master", "iloveyou", "trustno1", "eka12345", "sanctuary"
]);

// Brute-force & credential stuffing progressive throttle tracking
interface LoginAttemptTracker {
  attempts: number;
  lastAttemptAt: number;
  lockoutUntil: number;
}
const loginAttempts = new Map<string, LoginAttemptTracker>();

// In-memory active user sessions
const activeSessions = new Map<string, UserSession[]>();

// In-memory MFA secrets
interface MfaRecord {
  secret: string;
  backupCodesHash: string[];
  enabled: boolean;
  lastVerifiedAt?: string;
}
const userMfaStore = new Map<string, MfaRecord>();

/**
 * Validates password strength adhering to modern NIST SP 800-63B guidelines.
 */
export function validatePasswordStrength(password: string): PasswordValidationResult {
  const feedback: string[] = [];

  const hasMinLength = password.length >= 10;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const isCommonPassword = COMMON_PASSWORDS_BLACKLIST.has(password.toLowerCase().trim());

  if (!hasMinLength) feedback.push("Password must be at least 10 characters long.");
  if (!hasUppercase) feedback.push("Password must include at least one uppercase letter.");
  if (!hasLowercase) feedback.push("Password must include at least one lowercase letter.");
  if (!hasNumbers) feedback.push("Password must include at least one number.");
  if (!hasSpecialChar) feedback.push("Password must include at least one special character.");
  if (isCommonPassword) feedback.push("This password is known to be breached and is unsafe.");

  let score = 0;
  if (password.length >= 10) score++;
  if (password.length >= 14) score++;
  if (hasUppercase && hasLowercase && hasNumbers) score++;
  if (hasSpecialChar && !isCommonPassword) score++;

  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumbers && !isCommonPassword;

  return {
    isValid,
    score,
    feedback,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSpecialChar,
    isCommonPassword,
  };
}

/**
 * Checks and updates progressive login throttling for an identifier (email or IP).
 * Returns delay in ms or lockout duration.
 */
export function checkLoginThrottle(identifier: string): {
  allowed: boolean;
  lockoutRemainingMs?: number;
  currentAttempts: number;
} {
  const now = Date.now();
  let tracker = loginAttempts.get(identifier);

  if (!tracker) {
    tracker = { attempts: 0, lastAttemptAt: now, lockoutUntil: 0 };
    loginAttempts.set(identifier, tracker);
  }

  // Check active lockout
  if (tracker.lockoutUntil > now) {
    return {
      allowed: false,
      lockoutRemainingMs: tracker.lockoutUntil - now,
      currentAttempts: tracker.attempts,
    };
  }

  // Reset counter after 15 minutes of calm
  if (now - tracker.lastAttemptAt > 15 * 60 * 1000) {
    tracker.attempts = 0;
  }

  return {
    allowed: true,
    currentAttempts: tracker.attempts,
  };
}

/**
 * Records a failed login attempt, applying progressive exponential backoff or lockout.
 */
export async function recordFailedLogin(params: {
  identifier: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<{ lockedOut: boolean; lockoutSeconds: number }> {
  const now = Date.now();
  let tracker = loginAttempts.get(params.identifier);
  if (!tracker) {
    tracker = { attempts: 0, lastAttemptAt: now, lockoutUntil: 0 };
    loginAttempts.set(params.identifier, tracker);
  }

  tracker.attempts += 1;
  tracker.lastAttemptAt = now;

  let lockoutSeconds = 0;
  let lockedOut = false;

  // Progressive lockout ladder:
  // 5 attempts -> 2 min lockout
  // 8 attempts -> 15 min lockout
  // 10+ attempts -> 1 hour lockout
  if (tracker.attempts >= 10) {
    lockoutSeconds = 3600;
    tracker.lockoutUntil = now + lockoutSeconds * 1000;
    lockedOut = true;
  } else if (tracker.attempts >= 8) {
    lockoutSeconds = 900;
    tracker.lockoutUntil = now + lockoutSeconds * 1000;
    lockedOut = true;
  } else if (tracker.attempts >= 5) {
    lockoutSeconds = 120;
    tracker.lockoutUntil = now + lockoutSeconds * 1000;
    lockedOut = true;
  }

  await trackSecurityEvent({
    severity: lockedOut ? "HIGH" : "MEDIUM",
    category: "auth_failure",
    eventType: lockedOut ? "account_lockout_triggered" : "login_failed",
    actorId: params.identifier,
    ipAddress: params.ipAddress || null,
    userAgent: params.userAgent || null,
    details: {
      attempts: tracker.attempts,
      lockedOut,
      lockoutSeconds,
    },
  });

  return { lockedOut, lockoutSeconds };
}

/**
 * Resets the login throttle tracker upon successful authentication.
 */
export function resetLoginThrottle(identifier: string): void {
  loginAttempts.delete(identifier);
}

/**
 * Detects impossible travel anomalies (two logins within a timeframe that would require
 * physically impossible velocity > 900 km/h).
 */
export function detectImpossibleTravel(params: {
  userId: string;
  newIp: string;
  newCoordinates?: { lat: number; lng: number };
  lastLoginCoordinates?: { lat: number; lng: number };
  lastLoginTimestamp?: number;
}): { isImpossibleTravel: boolean; calculatedSpeedKmh?: number } {
  if (!params.newCoordinates || !params.lastLoginCoordinates || !params.lastLoginTimestamp) {
    return { isImpossibleTravel: false };
  }

  const hoursDiff = (Date.now() - params.lastLoginTimestamp) / (1000 * 60 * 60);
  if (hoursDiff <= 0 || hoursDiff > 24) return { isImpossibleTravel: false };

  // Haversine formula for great-circle distance
  const R = 6371; // Earth radius in km
  const dLat = ((params.newCoordinates.lat - params.lastLoginCoordinates.lat) * Math.PI) / 180;
  const dLng = ((params.newCoordinates.lng - params.lastLoginCoordinates.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((params.lastLoginCoordinates.lat * Math.PI) / 180) *
      Math.cos((params.newCoordinates.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  const speedKmh = distanceKm / hoursDiff;
  const isImpossible = speedKmh > 900; // faster than commercial jetliner

  return {
    isImpossibleTravel: isImpossible,
    calculatedSpeedKmh: Math.round(speedKmh),
  };
}

/**
 * Manages active user sessions.
 */
export function registerUserSession(session: UserSession): void {
  const userList = activeSessions.get(session.userId) || [];
  // Keep up to 10 active sessions per user
  const updated = [session, ...userList.filter((s) => s.id !== session.id)].slice(0, 10);
  activeSessions.set(session.userId, updated);
}

export function getUserSessions(userId: string): UserSession[] {
  return activeSessions.get(userId) || [];
}

export async function revokeSession(userId: string, sessionId: string): Promise<boolean> {
  const list = activeSessions.get(userId) || [];
  const found = list.find((s) => s.id === sessionId);
  if (!found) return false;

  found.isRevoked = true;
  activeSessions.set(
    userId,
    list.filter((s) => s.id !== sessionId),
  );

  await recordSecurityAudit({
    actorId: userId,
    action: "session_revoked",
    resourceType: "user_session",
    resourceId: sessionId,
    result: "success",
  });

  return true;
}

export async function revokeAllUserSessions(userId: string, reason = "security_reset"): Promise<number> {
  const count = (activeSessions.get(userId) || []).length;
  activeSessions.delete(userId);

  await trackSecurityEvent({
    severity: "HIGH",
    category: "session_revoked",
    eventType: "all_sessions_revoked",
    actorId: userId,
    details: { reason, revokedCount: count },
  });

  return count;
}

/**
 * MFA / TOTP Mock & Backup Code Security Utilities
 */
export function generateBackupCodes(): { plainCodes: string[]; hashedCodes: string[] } {
  const plainCodes: string[] = [];
  const hashedCodes: string[] = [];

  for (let i = 0; i < 8; i++) {
    const code = randomBytes(4).toString("hex").toUpperCase();
    const formatted = `${code.slice(0, 4)}-${code.slice(4)}`;
    plainCodes.push(formatted);
    hashedCodes.push(createHmac("sha256", "eka_backup_salt").update(formatted).digest("hex"));
  }

  return { plainCodes, hashedCodes };
}

export function verifyBackupCode(userId: string, code: string): boolean {
  const mfa = userMfaStore.get(userId);
  if (!mfa || !mfa.enabled) return false;

  const targetHash = createHmac("sha256", "eka_backup_salt").update(code.trim().toUpperCase()).digest("hex");
  const idx = mfa.backupCodesHash.indexOf(targetHash);
  if (idx !== -1) {
    // Consume backup code (single-use)
    mfa.backupCodesHash.splice(idx, 1);
    return true;
  }
  return false;
}

/**
 * Zero-Trust Authorization & Tenant Isolation Guard
 */
export function authorizeZeroTrust(params: {
  userId?: string | null;
  role: StudioRole;
  requiredPermission?: StudioPermission;
  tenantId?: string | null;
  targetResourceTenantId?: string | null;
}): { authorized: boolean; reason?: string } {
  if (!params.userId) {
    return { authorized: false, reason: "Zero-Trust: Unauthenticated request rejected." };
  }

  // Tenant Boundary Check: An organization or brand can NEVER access another organization's records
  if (
    params.tenantId &&
    params.targetResourceTenantId &&
    params.tenantId !== params.targetResourceTenantId &&
    params.role !== "Founder" &&
    params.role !== "Super Admin"
  ) {
    return {
      authorized: false,
      reason: `Zero-Trust Tenant Isolation: Tenant '${params.tenantId}' cannot access '${params.targetResourceTenantId}'.`,
    };
  }

  // RBAC Permission Check
  if (params.requiredPermission && !canUser(params.role, params.requiredPermission)) {
    return {
      authorized: false,
      reason: `Zero-Trust RBAC: Role '${params.role}' lacks permission '${params.requiredPermission}'.`,
    };
  }

  return { authorized: true };
}
