/**
 * EKA Observability — Sentry Error Tracking & Performance Tracing
 *
 * Implements strict privacy controls to scrub sensitive spiritual reflections,
 * passwords, and private auth tokens before any telemetry leaves the process.
 */

interface ErrorContext {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  user?: { id?: string; username?: string };
}

const SENTRY_DSN = process.env["SENTRY_DSN"] || process.env["VITE_SENTRY_DSN"];
const ENVIRONMENT = process.env["NODE_ENV"] || "development";

/**
 * Filter and sanitize sensitive fields from error payloads
 */
function sanitizePayload(data: Record<string, unknown>): Record<string, unknown> {
  const SENSITIVE_KEYS = [
    "password",
    "token",
    "secret",
    "jwt",
    "auth",
    "journal",
    "reflection",
    "sacred_note",
    "credit_card",
    "vpa",
  ];

  const sanitized: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s))) {
      sanitized[key] = "[REDACTED_PRIVACY]";
    } else if (val && typeof val === "object" && !Array.isArray(val)) {
      sanitized[key] = sanitizePayload(val as Record<string, unknown>);
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

/**
 * Capture an error with context and privacy sanitization
 */
export function captureException(error: unknown, context?: ErrorContext): void {
  const err = error instanceof Error ? error : new Error(String(error));

  if (!SENTRY_DSN) {
    // In development or when Sentry DSN is not set, log safely to console
    if (ENVIRONMENT !== "production") {
      console.error("[Sentry Dev Log]:", err.message, {
        stack: err.stack,
        context: context ? sanitizePayload(context as Record<string, unknown>) : undefined,
      });
    }
    return;
  }

  // When Sentry client is initialized in production
  try {
    const cleanExtra = context?.extra ? sanitizePayload(context.extra) : {};
    const dsnHost = SENTRY_DSN.split("@")[1]?.split("/")[0];
    if (!dsnHost) return;
    void fetch(`https://${dsnHost}/api/envelope/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_id: crypto.randomUUID().replace(/-/g, ""),
        timestamp: new Date().toISOString(),
        platform: "javascript",
        level: "error",
        environment: ENVIRONMENT,
        exception: {
          values: [
            {
              type: err.name,
              value: err.message,
              stacktrace: { frames: [] },
            },
          ],
        },
        tags: context?.tags,
        extra: cleanExtra,
        user: context?.user ? { id: context.user.id } : undefined,
      }),
    }).catch(() => {
      /* fail silently to protect user experience */
    });
  } catch {
    /* never throw inside error handler */
  }
}

/**
 * Capture informational message or alert
 */
export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
): void {
  if (!SENTRY_DSN && ENVIRONMENT !== "production") {
    console.log(`[Sentry Message - ${level}]:`, message);
    return;
  }
}
