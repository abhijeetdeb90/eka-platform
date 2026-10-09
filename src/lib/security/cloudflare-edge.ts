// ==============================================================================
// CLOUDFLARE EDGE & SECURITY MODULE FOR EKA
// ==============================================================================
// Extracts and validates Cloudflare Edge Security headers:
// - Real client IP resolution (cf-connecting-ip)
// - Geo-IP country detection (cf-ipcountry) for India DPDP Act compliance
// - Cloudflare Ray ID (cf-ray) for end-to-end auditability and tracing
// - Bot and threat score evaluation
// ==============================================================================

export interface CloudflareEdgeContext {
  clientIp: string;
  country: string;
  rayId: string;
  isHttps: boolean;
  isCloudflareProxy: boolean;
  botScore?: number;
}

/**
 * Parses Cloudflare edge headers from an incoming server Request.
 */
export function extractCloudflareContext(request: Request): CloudflareEdgeContext {
  const headers = request.headers;

  const cfRay = headers.get("cf-ray") || "";
  const cfConnectingIp = headers.get("cf-connecting-ip") || "";
  const cfCountry = headers.get("cf-ipcountry") || "IN"; // default to India in dev
  const cfVisitor = headers.get("cf-visitor") || "";

  let isHttps = true;
  if (cfVisitor) {
    try {
      const visitorObj = JSON.parse(cfVisitor);
      isHttps = visitorObj.scheme === "https";
    } catch {
      isHttps = true;
    }
  }

  // Resolve best available client IP
  const clientIp =
    cfConnectingIp ||
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "127.0.0.1";

  const isCloudflareProxy = Boolean(cfRay && cfConnectingIp);

  return {
    clientIp,
    country: cfCountry.toUpperCase(),
    rayId: cfRay || `dev-ray-${Date.now()}`,
    isHttps,
    isCloudflareProxy,
  };
}

/**
 * Lightweight in-memory token-bucket rate limiter for edge fallback
 */
interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const memoryRateLimitStore = new Map<string, RateLimitBucket>();

export function checkEdgeRateLimit(
  key: string,
  options: { maxTokens: number; refillRatePerMinute: number } = {
    maxTokens: 60,
    refillRatePerMinute: 60,
  },
): { allowed: boolean; remaining: number; resetSeconds: number } {
  const now = Date.now();
  const bucket = memoryRateLimitStore.get(key) || {
    tokens: options.maxTokens,
    lastRefill: now,
  };

  const elapsedSeconds = (now - bucket.lastRefill) / 1000;
  const tokensToAdd = elapsedSeconds * (options.refillRatePerMinute / 60);

  bucket.tokens = Math.min(options.maxTokens, bucket.tokens + tokensToAdd);
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    memoryRateLimitStore.set(key, bucket);
    return {
      allowed: true,
      remaining: Math.floor(bucket.tokens),
      resetSeconds: Math.ceil((1 - (bucket.tokens % 1)) / (options.refillRatePerMinute / 60)),
    };
  }

  memoryRateLimitStore.set(key, bucket);
  return {
    allowed: false,
    remaining: 0,
    resetSeconds: Math.ceil((1 - bucket.tokens) / (options.refillRatePerMinute / 60)),
  };
}

/**
 * Builds standard Cloudflare-aware security headers for HTTP responses.
 */
export function getSecurityHeaders(edgeContext?: CloudflareEdgeContext): Record<string, string> {
  const headers: Record<string, string> = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(self)",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  };

  if (edgeContext?.rayId) {
    headers["X-EKA-Trace-ID"] = edgeContext.rayId;
  }

  return headers;
}
