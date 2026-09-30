// ==============================================================================
// EKA PLATFORM — APPLICATION THREAT DETECTION & ANTI-HACKING ENGINE
// ==============================================================================

import { trackSecurityEvent } from "../monitoring";
import { recordSecurityAudit } from "../audit-logging";

// SQL Injection attack signatures
const SQLI_PATTERNS: RegExp[] = [
  /(\b(union(\s+all)?)\b\s+select\b)/i,
  /(\b(select|insert|update|delete|drop|alter|truncate)\b\s+.*\b(from|into|table|database)\b)/i,
  /(\bexec(\s|\+)+(s|x)p\w+)/i,
  /(--\s*$|\/\*.*\*\/|;\s*$)/m,
  /('|\b)(\s*or\s+['"\d\w]+\s*=\s*['"\d\w]+)/i,
  /(\bwaitfor\s+delay\s+'[0-9:]+')/i,
];

// NoSQL Injection attack signatures
const NOSQLI_PATTERNS: RegExp[] = [
  /(\$where|\$regex|\$ne|\$gt|\$gte|\$lt|\$lte|\$in|\$nin)/i,
];

// Cross-Site Scripting (XSS) signatures
const XSS_PATTERNS: RegExp[] = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:\s*[^\s]+/gi,
  /on(load|error|click|mouseover|focus|blur|submit)\s*=/gi,
  /<iframe\b[^>]*>/gi,
  /<object\b[^>]*>/gi,
  /<embed\b[^>]*>/gi,
];

// Path Traversal & Command Injection signatures
const PATH_TRAVERSAL_PATTERNS: RegExp[] = [
  /(\.\.[\/\\])+/g,
  /(\/etc\/(passwd|shadow|hosts))/i,
  /(c:\\windows\\system32)/i,
  /%2e%2e[\/\\]/i,
];

const COMMAND_INJECTION_PATTERNS: RegExp[] = [
  /(\||&&|;|\$\(|\`)\s*(cat|ls|dir|rm|del|whoami|id|bash|sh|powershell|cmd)\b/i,
];

/**
 * Scans an input string or query payload for standard web application attack patterns.
 */
export async function detectApplicationAttacks(params: {
  input: string;
  source: string; // e.g. 'url_param', 'body_field', 'header'
  actorId?: string;
  ipAddress?: string;
}): Promise<{ isClean: boolean; attackType?: string; matchedPattern?: string }> {
  const { input, source, actorId, ipAddress } = params;
  if (!input || typeof input !== "string") return { isClean: true };

  // 1. SQLi check
  for (const pattern of SQLI_PATTERNS) {
    if (pattern.test(input)) {
      await logThreat("sqli_attempt", "SQL Injection pattern detected", pattern.source, source, actorId, ipAddress);
      return { isClean: false, attackType: "SQL Injection", matchedPattern: pattern.source };
    }
  }

  // 2. NoSQLi check
  for (const pattern of NOSQLI_PATTERNS) {
    if (pattern.test(input)) {
      await logThreat("sqli_attempt", "NoSQL Injection operator detected", pattern.source, source, actorId, ipAddress);
      return { isClean: false, attackType: "NoSQL Injection", matchedPattern: pattern.source };
    }
  }

  // 3. XSS check
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(input)) {
      await logThreat("xss_attempt", "Cross-Site Scripting (XSS) payload detected", pattern.source, source, actorId, ipAddress);
      return { isClean: false, attackType: "Cross-Site Scripting (XSS)", matchedPattern: pattern.source };
    }
  }

  // 4. Path Traversal check
  for (const pattern of PATH_TRAVERSAL_PATTERNS) {
    if (pattern.test(input)) {
      await logThreat("path_traversal_attempt", "Path Traversal payload detected", pattern.source, source, actorId, ipAddress);
      return { isClean: false, attackType: "Path Traversal", matchedPattern: pattern.source };
    }
  }

  // 5. Command Injection check
  for (const pattern of COMMAND_INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      await logThreat("path_traversal_attempt", "Command Injection payload detected", pattern.source, source, actorId, ipAddress);
      return { isClean: false, attackType: "Command Injection", matchedPattern: pattern.source };
    }
  }

  return { isClean: true };
}

async function logThreat(
  category: any,
  eventType: string,
  pattern: string,
  source: string,
  actorId?: string,
  ipAddress?: string,
) {
  await trackSecurityEvent({
    severity: "CRITICAL",
    category,
    eventType,
    actorId,
    ipAddress,
    details: { pattern, source },
  });

  await recordSecurityAudit({
    actorId,
    action: "attack_payload_blocked",
    resourceType: source,
    result: "blocked",
    details: { eventType, pattern },
  });
}

/**
 * Server-Side Request Forgery (SSRF) Guard.
 * Validates URLs to strictly block attempts to reach private networks,
 * localhost, loopback, or cloud instance metadata endpoints (169.254.169.254).
 */
export function isSsrfSafeUrl(targetUrl: string): { isSafe: boolean; reason?: string } {
  let parsed: URL;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return { isSafe: false, reason: "Malformed URL syntax." };
  }

  const protocol = parsed.protocol.toLowerCase();
  if (protocol !== "http:" && protocol !== "https:") {
    return { isSafe: false, reason: `Forbidden protocol '${protocol}'. Only HTTP(S) is allowed.` };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Loopback / Localhost
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname.endsWith(".localhost")) {
    return { isSafe: false, reason: "Targeting localhost or loopback addresses is forbidden." };
  }

  // Cloud Instance Metadata endpoint (AWS, GCP, Azure, DigitalOcean)
  if (hostname === "169.254.169.254" || hostname === "metadata.google.internal") {
    return { isSafe: false, reason: "Access to cloud instance metadata services is strictly forbidden." };
  }

  // Private RFC 1918 subnets (IPv4)
  const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const oct1 = parseInt(ipv4Match[1]!, 10);
    const oct2 = parseInt(ipv4Match[2]!, 10);

    // 10.0.0.0/8
    if (oct1 === 10) return { isSafe: false, reason: "Targeting private subnet 10.0.0.0/8 is prohibited." };

    // 172.16.0.0/12
    if (oct1 === 172 && oct2 >= 16 && oct2 <= 31) {
      return { isSafe: false, reason: "Targeting private subnet 172.16.0.0/12 is prohibited." };
    }

    // 192.168.0.0/16
    if (oct1 === 192 && oct2 === 168) {
      return { isSafe: false, reason: "Targeting private subnet 192.168.0.0/16 is prohibited." };
    }

    // 0.0.0.0
    if (oct1 === 0) return { isSafe: false, reason: "Targeting 0.0.0.0 is prohibited." };
  }

  return { isSafe: true };
}

/**
 * Open Redirect / Safe Redirect Guard.
 * Ensures redirects remain within same-origin relative paths or verified domains.
 */
export function sanitizeRedirectUrl(rawUrl?: string | null, fallback = "/app"): string {
  if (!rawUrl || typeof rawUrl !== "string") return fallback;

  const trimmed = rawUrl.trim();

  // Safe relative paths: starts with / and not //
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.includes("\\")) {
    return trimmed;
  }

  return fallback;
}
