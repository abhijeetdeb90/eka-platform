// ==============================================================================
// EKA PLATFORM — API SECURITY, HEADERS & REPLAY PROTECTION ENGINE
// ==============================================================================

import { randomUUID } from "crypto";
import { redactSecrets } from "../secrets-management";
import { trackSecurityEvent } from "../monitoring";

// Replay protection nonce tracking
const seenNonces = new Map<string, number>();
const NONCE_TTL_MS = 5 * 60 * 1000; // 5 minutes window

/**
 * Standard enterprise HTTP security headers.
 */
export function getStandardSecurityHeaders(): Record<string, string> {
  const isProd = process.env["NODE_ENV"] === "production";

  // Carefully tuned CSP ensuring Google Maps, Supabase, Google Fonts, and Gemini work smoothly
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://*.google.com https://*.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https: http:",
    "media-src 'self' data: blob: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://generativelanguage.googleapis.com https://maps.googleapis.com https://api.stripe.com https://*.posthog.com https://*.sentry.io",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  const headers: Record<string, string> = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(self)",
    "Content-Security-Policy": cspDirectives.join("; "),
  };

  if (isProd) {
    headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload";
  }

  return headers;
}

/**
 * Validates request size against maximum payload threshold to protect against DoS.
 */
export function validatePayloadSize(sizeBytes: number, maxBytes = 5 * 1024 * 1024): boolean {
  return sizeBytes <= maxBytes;
}

/**
 * Replay Attack Protection.
 * Validates that an idempotency key or nonce hasn't been submitted within the replay window.
 */
export function validateReplayNonce(nonce?: string | null): { isValid: boolean; error?: string } {
  if (!nonce) return { isValid: true }; // Optional for read queries, mandatory for financial/state mutations

  const now = Date.now();

  // Cleanup expired nonces
  for (const [key, timestamp] of seenNonces.entries()) {
    if (now - timestamp > NONCE_TTL_MS) {
      seenNonces.delete(key);
    }
  }

  if (seenNonces.has(nonce)) {
    return {
      isValid: false,
      error: "Replay attack detected: This idempotency nonce has already been processed.",
    };
  }

  seenNonces.set(nonce, now);
  return { isValid: true };
}

/**
 * Generates or normalizes an incoming request ID for cross-tier log correlation.
 */
export function resolveRequestId(requestHeaders?: Headers | null): string {
  const incoming = requestHeaders?.get("x-request-id") || requestHeaders?.get("x-correlation-id");
  if (incoming && /^[a-zA-Z0-9_\-]{8,64}$/.test(incoming)) {
    return incoming;
  }
  return `req_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

/**
 * Sanitizes server exceptions into safe, production-grade JSON error responses.
 * Never leaks stack traces, database schema, or secrets.
 */
export function formatSafeApiError(
  error: unknown,
  requestId: string,
  statusCode = 500,
): Response {
  const rawMessage = error instanceof Error ? error.message : String(error);

  // Redact secrets and database connection details
  const cleanMessage = redactSecrets(rawMessage);

  // Log internal trace safely on server
  console.error(`[API Error][${requestId}]`, error);

  // In production, mask generic 500s to avoid leaking internals
  const isProduction = process.env["NODE_ENV"] === "production";
  const userSafeMessage =
    statusCode >= 500 && isProduction
      ? "An unexpected internal error occurred. Our operations team has been notified."
      : cleanMessage;

  const payload = {
    error: {
      message: userSafeMessage,
      code: statusCode >= 500 ? "INTERNAL_SERVER_ERROR" : "REQUEST_ERROR",
      requestId,
      timestamp: new Date().toISOString(),
    },
  };

  const headers = new Headers(getStandardSecurityHeaders());
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("x-request-id", requestId);

  return new Response(JSON.stringify(payload), {
    status: statusCode,
    headers,
  });
}
