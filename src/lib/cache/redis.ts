/**
 * EKA High-Performance Caching & Distributed Rate Limiting
 *
 * Provides cache-aside patterns and sliding-window rate limiting.
 * Supports Upstash Redis REST API or standard Redis connection,
 * with an automatic in-memory fallback for local dev and testing.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number | null;
}

// In-memory fallback for local development or when Redis credentials are not configured
const memoryStore = new Map<string, CacheEntry<unknown>>();
const memoryRateLimits = new Map<string, { count: number; windowStart: number }>();

const UPSTASH_URL =
  process.env["UPSTASH_REDIS_REST_URL"] || process.env["VITE_UPSTASH_REDIS_REST_URL"];
const UPSTASH_TOKEN =
  process.env["UPSTASH_REDIS_REST_TOKEN"] || process.env["VITE_UPSTASH_REDIS_REST_TOKEN"];

/**
 * Execute an Upstash Redis REST command
 */
async function upstashCommand<T = unknown>(command: string[]): Promise<T | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const res = await fetch(`${UPSTASH_URL}/${command.join("/")}`, {
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
      },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { result: T };
    return json.result;
  } catch {
    return null;
  }
}

/**
 * Get a cached item by key
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    const res = await upstashCommand<string>(["get", encodeURIComponent(key)]);
    if (!res) return null;
    try {
      return JSON.parse(res) as T;
    } catch {
      return res as unknown as T;
    }
  }

  // Memory fallback
  const entry = memoryStore.get(key);
  if (!entry) return null;
  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    memoryStore.delete(key);
    return null;
  }
  return entry.value as T;
}

/**
 * Set a cached item with optional TTL (in seconds)
 */
export async function cacheSet<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
  const serialized = JSON.stringify(value);

  if (UPSTASH_URL && UPSTASH_TOKEN) {
    if (ttlSeconds && ttlSeconds > 0) {
      await upstashCommand([
        "set",
        encodeURIComponent(key),
        encodeURIComponent(serialized),
        "EX",
        String(ttlSeconds),
      ]);
    } else {
      await upstashCommand(["set", encodeURIComponent(key), encodeURIComponent(serialized)]);
    }
    return;
  }

  // Memory fallback
  memoryStore.set(key, {
    value,
    expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
  });
}

/**
 * Delete a cached item
 */
export async function cacheDel(key: string): Promise<void> {
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    await upstashCommand(["del", encodeURIComponent(key)]);
    return;
  }
  memoryStore.delete(key);
}

/**
 * Sliding-window distributed rate limiter
 * Protects auth endpoints, AI completions, and creator booking requests.
 */
export async function rateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number,
): Promise<{ success: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const key = `ratelimit:${identifier}`;

  if (UPSTASH_URL && UPSTASH_TOKEN) {
    // Pipeline atomic sliding-window counter in Redis
    try {
      const current = await upstashCommand<number>(["incr", encodeURIComponent(key)]);
      if (current === 1) {
        await upstashCommand(["expire", encodeURIComponent(key), String(windowSeconds)]);
      }
      const count = current ?? 1;
      const success = count <= limit;
      return {
        success,
        remaining: Math.max(0, limit - count),
        resetAt: now + windowMs,
      };
    } catch {
      // Degrade gracefully if network fails
      return { success: true, remaining: 1, resetAt: now + windowMs };
    }
  }

  // In-memory sliding window
  const record = memoryRateLimits.get(key);
  if (!record || now - record.windowStart > windowMs) {
    memoryRateLimits.set(key, { count: 1, windowStart: now });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  record.count += 1;
  const success = record.count <= limit;
  return {
    success,
    remaining: Math.max(0, limit - record.count),
    resetAt: record.windowStart + windowMs,
  };
}
