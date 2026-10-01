// ==============================================================================
// EKA PLATFORM — DATA LOSS PREVENTION (DLP) & ANTI-EXFILTRATION ENGINE
// ==============================================================================

import { trackSecurityEvent } from "../monitoring";
import { recordSecurityAudit } from "../audit-logging";

// Volume baseline tracking per user
interface AccessBaseline {
  dailyCount: number;
  lastResetDay: number;
  historicalDailyAverage: number;
}
const userBaselines = new Map<string, AccessBaseline>();

/**
 * Monitors data access volume per user to detect sudden exfiltration spikes.
 * Example: User normally accesses 10 records/day -> suddenly requests 5,000+ records.
 */
export async function evaluateExfiltrationRisk(params: {
  userId: string;
  requestedRecordCount: number;
  resourceType: string;
  ipAddress?: string;
}): Promise<{
  allowed: boolean;
  anomalyDetected: boolean;
  reason?: string;
  baseline: { average: number; currentDayTotal: number };
}> {
  const now = new Date();
  const startOfYear = Date.UTC(now.getUTCFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const today = now.getUTCFullYear() * 1000 + dayOfYear;

  let baseline = userBaselines.get(params.userId);
  if (!baseline) {
    baseline = {
      dailyCount: 0,
      lastResetDay: today,
      historicalDailyAverage: 20, // default assumed baseline for normal user
    };
    userBaselines.set(params.userId, baseline);
  }

  // Reset daily counter on new UTC day
  if (baseline.lastResetDay !== today) {
    // Update moving average
    baseline.historicalDailyAverage = Math.round(
      (baseline.historicalDailyAverage * 6 + baseline.dailyCount) / 7,
    );
    baseline.dailyCount = 0;
    baseline.lastResetDay = today;
  }

  const projectedTotal = baseline.dailyCount + params.requestedRecordCount;

  // Anomaly criteria:
  // 1. Single query requesting > 500 records for non-admin
  // 2. Daily volume > 10x historical average and > 1,000 records
  const isSuddenSpike =
    params.requestedRecordCount > 500 ||
    (projectedTotal > 1000 && projectedTotal > baseline.historicalDailyAverage * 10);

  if (isSuddenSpike) {
    await trackSecurityEvent({
      severity: params.requestedRecordCount > 2000 ? "CRITICAL" : "HIGH",
      category: "data_exfiltration_alert",
      eventType: "abnormal_record_volume_detected",
      actorId: params.userId,
      ipAddress: params.ipAddress || null,
      resource: params.resourceType,
      details: {
        requestedCount: params.requestedRecordCount,
        dailyCount: baseline.dailyCount,
        historicalAverage: baseline.historicalDailyAverage,
        projectedTotal,
      },
    });

    await recordSecurityAudit({
      actorId: params.userId,
      action: "data_exfiltration_blocked",
      resourceType: params.resourceType,
      result: "blocked",
      details: { requestedCount: params.requestedRecordCount },
    });

    return {
      allowed: false,
      anomalyDetected: true,
      reason: `Bulk data request of ${params.requestedRecordCount} records exceeds your authorized access volume baseline.`,
      baseline: {
        average: baseline.historicalDailyAverage,
        currentDayTotal: baseline.dailyCount,
      },
    };
  }

  baseline.dailyCount += params.requestedRecordCount;

  return {
    allowed: true,
    anomalyDetected: false,
    baseline: {
      average: baseline.historicalDailyAverage,
      currentDayTotal: baseline.dailyCount,
    },
  };
}

/**
 * PII Masking and Minimization
 * Masks emails, phone numbers, and government IDs (Aadhaar/PAN format) in text or records.
 */
export function redactPii(text: string): string {
  if (!text || typeof text !== "string") return "";

  let result = text;

  // Mask Email addresses: j***@example.com
  result = result.replace(/([a-zA-Z0-9_\-\.])[a-zA-Z0-9_\-\.]+@([a-zA-Z0-9_\-\.]+\.[a-zA-Z]{2,})/g, "$1***@$2");

  // Mask Phone numbers: +91 98****3210
  result = result.replace(/(\+?\d{1,3}[-.\s]?)?(\d{2})\d{4,6}(\d{4})/g, "$1$2******$3");

  // Mask Indian PAN format: ABCDE****F
  result = result.replace(/[A-Z]{5}[0-9]{4}[A-Z]{1}/g, (match) => `${match.slice(0, 5)}****${match.slice(9)}`);

  // Mask 12-digit Aadhaar / Credit card format: ****-****-1234
  result = result.replace(/\b\d{4}[-\s]?\d{4}[-\s]?(\d{4})\b/g, "****-****-$1");

  return result;
}

/**
 * Minimizes API response payloads by stripping database internal fields and private keys.
 */
export function minimizeApiResponse<T extends Record<string, unknown>>(
  record: T,
  allowedFields?: Array<keyof T>,
): Partial<T> {
  const STRIP_KEYS = new Set([
    "password_hash",
    "encrypted_password",
    "secret",
    "service_role",
    "internal_ip",
    "private_key",
    "raw_user_meta_data",
  ]);

  const output: Partial<T> = {};

  for (const [key, val] of Object.entries(record)) {
    if (STRIP_KEYS.has(key)) continue;
    if (allowedFields && !allowedFields.includes(key as keyof T)) continue;
    output[key as keyof T] = val as T[keyof T];
  }

  return output;
}
