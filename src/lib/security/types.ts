// ==============================================================================
// EKA PLATFORM — ENTERPRISE-GRADE SECURITY & TRUST LAYER: UNIFIED TYPES
// ==============================================================================

export type SecuritySeverity = "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type SecurityEventCategory =
  | "auth_failure"
  | "suspicious_login"
  | "impossible_travel"
  | "password_change"
  | "mfa_challenge"
  | "mfa_change"
  | "permission_change"
  | "rbac_denial"
  | "tenant_violation"
  | "api_abuse"
  | "rate_limit_breach"
  | "unusual_download"
  | "bulk_export"
  | "data_exfiltration_alert"
  | "prompt_injection_attempt"
  | "ai_agent_unauthorized_action"
  | "ai_output_leak_prevented"
  | "phishing_detected"
  | "malicious_url_blocked"
  | "malware_upload_blocked"
  | "ssrf_attempt"
  | "sqli_attempt"
  | "xss_attempt"
  | "path_traversal_attempt"
  | "account_takeover_signal"
  | "account_quarantined"
  | "session_revoked"
  | "admin_action"
  | "privacy_data_request"
  | "privacy_account_deletion";

export interface SecurityEvent {
  id: string;
  timestamp: string;
  severity: SecuritySeverity;
  category: SecurityEventCategory;
  eventType: string;
  actorId?: string | null;
  actorRole?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  resource?: string | null;
  tenantId?: string | null;
  status: "detected" | "blocked" | "quarantined" | "mitigated" | "investigating" | "resolved";
  details: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface SecurityAuditRecord {
  id: string;
  timestamp: string;
  actorId?: string | null;
  actorRole?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  tenantId?: string | null;
  result: "success" | "failure" | "denied" | "blocked";
  hash: string;
  prevHash: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  requestId?: string | null;
  details: Record<string, unknown>;
}

export type PhishingRiskLevel = "LOW RISK" | "SUSPICIOUS" | "HIGH RISK" | "CRITICAL";

export interface PhishingAnalysisResult {
  url: string;
  domain: string;
  riskLevel: PhishingRiskLevel;
  score: number; // 0 to 100
  reasons: string[];
  flags: {
    isPunycodeOrHomoglyph: boolean;
    isTyposquatting: boolean;
    isIpLiteral: boolean;
    hasDeceptiveSubdomains: boolean;
    hasObfuscation: boolean;
    isKnownMalicious: boolean;
    hasBrandImpersonation: boolean;
    hasMisleadingCredentials: boolean;
  };
  recommendation: "allow" | "warn" | "require_override" | "block";
  explanation: {
    whatHappened: string;
    whyFlagged: string;
    safeNextStep: string;
  };
}

export interface UserSession {
  id: string;
  userId: string;
  deviceFingerprint: string;
  deviceType: "desktop" | "mobile" | "tablet" | "unknown";
  browser: string;
  os: string;
  ipAddress: string;
  location?: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  isCurrent?: boolean;
  isRevoked: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0 (weak) - 4 (very strong)
  feedback: string[];
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecialChar: boolean;
  isCommonPassword: boolean;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  retryAfterSeconds?: number;
  burstExceeded?: boolean;
}

export interface FileValidationResult {
  isValid: boolean;
  sanitizedFilename: string;
  mimeType: string;
  detectedMimeType: string;
  sizeBytes: number;
  error?: string;
  riskLevel: "safe" | "quarantined" | "rejected";
}

export interface MfaVerificationResult {
  success: boolean;
  method?: "totp" | "backup_code";
  error?: string;
}

export interface IncidentState {
  id: string;
  title: string;
  severity: SecuritySeverity;
  category: SecurityEventCategory;
  phase: "DETECT" | "CLASSIFY" | "CONTAIN" | "INVESTIGATE" | "REMEDIATE" | "RECOVER" | "AUDIT";
  status: "open" | "contained" | "resolved";
  targetUser?: string;
  targetIp?: string;
  timeline: Array<{
    timestamp: string;
    phase: string;
    actionTaken: string;
    actor: string;
    notes?: string;
  }>;
  automatedActionsTaken: string[];
  createdAt: string;
  updatedAt: string;
}
