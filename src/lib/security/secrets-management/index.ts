// ==============================================================================
// EKA PLATFORM — SECRETS MANAGEMENT & REDACTION ENGINE
// ==============================================================================

/**
 * Patterns matching sensitive secrets, credentials, tokens, and keys.
 * Never permit these to leak to client bundles, logs, or error responses.
 */
const SENSITIVE_KEY_NAMES = [
  "password",
  "secret",
  "token",
  "apikey",
  "api_key",
  "access_token",
  "refresh_token",
  "private_key",
  "service_role",
  "service_role_key",
  "service_account",
  "client_secret",
  "jwt",
  "auth_header",
  "authorization",
  "session_token",
  "stripe_secret",
  "webhook_secret",
  "gemini_api_key",
  "cookie",
];

const SECRET_REGEX_PATTERNS: RegExp[] = [
  /Bearer\s+([a-zA-Z0-9_\-\.]{16,})/gi,
  /sbp_[a-zA-Z0-9_]{30,}/g, // Supabase personal token
  /sb_[a-zA-Z0-9_\-]{25,}/g, // New Supabase API key
  /AIza[0-9A-Za-z-_]{35}/g, // Google API Key
  /sk_live_[0-9a-zA-Z]{24}/g, // Stripe Live key
  /sk_test_[0-9a-zA-Z]{24}/g, // Stripe Test key
  /whsec_[0-9a-zA-Z]{32}/g, // Stripe Webhook Secret
  /postgres:\/\/[^:@]+:[^@]+@[^/]+\/[^\s]+/g, // Postgres URI with password
  /eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/g, // JWTs
];

/**
 * Redacts secrets from any string before logging or returning in errors.
 */
export function redactSecrets(text: string): string {
  if (!text || typeof text !== "string") return "";

  let sanitized = text;

  // Redact specific known tokens and bearer headers
  for (const pattern of SECRET_REGEX_PATTERNS) {
    sanitized = sanitized.replace(pattern, (match) => {
      if (match.startsWith("Bearer ")) {
        return "Bearer [REDACTED_TOKEN]";
      }
      if (match.startsWith("postgres://")) {
        return "postgres://[REDACTED_CREDENTIALS]";
      }
      return "[REDACTED_SECRET]";
    });
  }

  return sanitized;
}

/**
 * Recursively deep-scrubs an object, masking all sensitive key values.
 */
export function sanitizeObject<T>(input: T): T {
  if (input === null || input === undefined) return input;
  if (typeof input === "string") return redactSecrets(input) as unknown as T;
  if (typeof input !== "object") return input;

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeObject(item)) as unknown as T;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = SENSITIVE_KEY_NAMES.some((s) => lowerKey.includes(s));

    if (isSensitive && typeof value === "string") {
      result[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      result[key] = sanitizeObject(value);
    } else if (typeof value === "string") {
      result[key] = redactSecrets(value);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

/**
 * Validates that production critical environment variables are set and
 * do not contain placeholder/dummy values.
 */
export function validateEnvironmentSecurity(): {
  isSecure: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  const isProduction =
    process.env["NODE_ENV"] === "production" || process.env["VERCEL_ENV"] === "production";

  const checkVar = (name: string, isCritical = false) => {
    const val = process.env[name];
    if (!val) {
      if (isCritical && isProduction) {
        errors.push(`Missing critical production environment variable: ${name}`);
      } else {
        warnings.push(`Environment variable ${name} is not set.`);
      }
      return;
    }

    if (
      val.includes("your-") ||
      val.includes("placeholder") ||
      val === "your-gemini-api-key" ||
      val === "your-service-role-key"
    ) {
      errors.push(`Environment variable ${name} contains a default/dummy placeholder value.`);
    }
  };

  // Critical backend secrets
  checkVar("SUPABASE_URL", true);
  checkVar("SUPABASE_SERVICE_ROLE_KEY", true);
  checkVar("GEMINI_API_KEY", false);
  checkVar("STRIPE_WEBHOOK_SECRET", false);

  return {
    isSecure: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Invalidate or revoke a compromised token or API key.
 */
const REVOKED_TOKENS = new Set<string>();

export function revokeToken(tokenIdOrHash: string): void {
  REVOKED_TOKENS.add(tokenIdOrHash);
}

export function isTokenRevoked(tokenIdOrHash: string): boolean {
  return REVOKED_TOKENS.has(tokenIdOrHash);
}
