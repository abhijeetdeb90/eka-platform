// ==============================================================================
// EKA PLATFORM — ENTERPRISE-GRADE SECURITY & TRUST LAYER: SECURITY CORE
// ==============================================================================
// Independent, platform-wide security architecture for EKA covering:
// 1. Zero-Trust Identity & Access
// 2. Account & Login Protection (MFA, Sessions, Throttling)
// 3. Application Security & Threat Detection (SQLi, XSS, SSRF, Path Traversal)
// 4. Anti-Phishing & Lookalike Domain Defense
// 5. Anti-Spam & Bot Detection
// 6. Data Loss Prevention & Anomaly Exfiltration Defense
// 7. Malware & File Upload Security (Magic Bytes, SVG Sanitization)
// 8. API Security, Rate Limiting & Replay Protection
// 9. AI Agent Security & Epistemic Prompt Injection Shield
// 10. Secrets & Credential Management
// 11. Tamper-Resistant Cryptographic Audit Logging
// 12. Security Monitoring & Threat Aggregator
// 13. Incident Response Lifecycle & Automated Containment
// 14. Data Privacy & DPDP Act (2023) Compliance
// ==============================================================================

export * from "./types";
export * from "./secrets-management";
export * from "./audit-logging";
export * from "./monitoring";
export * from "./identity-access";
export * from "./anti-phishing";
export * from "./anti-spam";
export * from "./data-loss-prevention";
export * from "./file-security";
export * from "./ai-agent-security";
export * from "./threat-detection";
export * from "./api-security";
export * from "./incident-response";
export * from "./privacy-controls";

import { authorizeZeroTrust, checkLoginThrottle, recordFailedLogin, validatePasswordStrength } from "./identity-access";
import { analyzeUrlForPhishing } from "./anti-phishing";
import { checkRateLimit, evaluateBotSignals, evaluateSpamContent } from "./anti-spam";
import { detectApplicationAttacks, isSsrfSafeUrl, sanitizeRedirectUrl } from "./threat-detection";
import { evaluateExfiltrationRisk, redactPii, minimizeApiResponse } from "./data-loss-prevention";
import { validateUploadedFile, sanitizeSvgXml } from "./file-security";
import { inspectPromptForInjection, isolateUntrustedContent, validateAndSanitizeAgentOutput, authorizeAgentToolCall } from "./ai-agent-security";
import { getStandardSecurityHeaders, resolveRequestId, formatSafeApiError, validateReplayNonce } from "./api-security";
import { redactSecrets, sanitizeObject, validateEnvironmentSecurity } from "./secrets-management";
import { recordSecurityAudit, verifyAuditChainIntegrity, getRecentAuditLogs } from "./audit-logging";
import { trackSecurityEvent, getSecurityMonitoringMetrics, isEntityQuarantined } from "./monitoring";
import { createIncident, executeAutomatedContainment, advanceIncidentPhase, getActiveIncidents } from "./incident-response";
import { updateUserConsent, generateUserDataExport, executeAccountErasure } from "./privacy-controls";

/**
 * Unified EKA Security Core Facade.
 * All EKA subsystems consume these capabilities without implementing separate security logic.
 */
export const EkaSecurityCore = {
  // Identity & Zero-Trust
  authorizeZeroTrust,
  checkLoginThrottle,
  recordFailedLogin,
  validatePasswordStrength,

  // Phishing & Safe Navigation
  analyzeUrlForPhishing,

  // Spam & Bots
  checkRateLimit,
  evaluateBotSignals,
  evaluateSpamContent,

  // Threat & Attack Detection
  detectApplicationAttacks,
  isSsrfSafeUrl,
  sanitizeRedirectUrl,

  // Data Loss Prevention
  evaluateExfiltrationRisk,
  redactPii,
  minimizeApiResponse,

  // File Security
  validateUploadedFile,
  sanitizeSvgXml,

  // AI Agent Boundaries
  inspectPromptForInjection,
  isolateUntrustedContent,
  validateAndSanitizeAgentOutput,
  authorizeAgentToolCall,

  // API & Headers
  getStandardSecurityHeaders,
  resolveRequestId,
  formatSafeApiError,
  validateReplayNonce,

  // Secrets & Sanitization
  redactSecrets,
  sanitizeObject,
  validateEnvironmentSecurity,

  // Audit Logs
  recordSecurityAudit,
  verifyAuditChainIntegrity,
  getRecentAuditLogs,

  // Monitoring
  trackSecurityEvent,
  getSecurityMonitoringMetrics,
  isEntityQuarantined,

  // Incident Response
  createIncident,
  executeAutomatedContainment,
  advanceIncidentPhase,
  getActiveIncidents,

  // Privacy & DPDP
  updateUserConsent,
  generateUserDataExport,
  executeAccountErasure,
};
