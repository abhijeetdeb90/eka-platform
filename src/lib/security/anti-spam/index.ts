// ==============================================================================
// EKA PLATFORM — ANTI-SPAM, BOT DETECTION & ADAPTIVE THROTTLING ENGINE
// ==============================================================================

import type { RateLimitCheckResult } from "../types";

// Token bucket rate limiter configuration
interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
  capacity: number;
  refillRatePerSecond: number;
}

const rateLimitBuckets = new Map<string, RateLimitBucket>();

// Default rate limit presets (requests per minute)
export const RATE_LIMIT_PROFILES = {
  auth: { capacity: 10, refillRatePerSecond: 10 / 60 },
  api_standard: { capacity: 60, refillRatePerSecond: 60 / 60 },
  comments: { capacity: 15, refillRatePerSecond: 15 / 60 },
  post_creation: { capacity: 8, refillRatePerSecond: 8 / 60 },
  public_search: { capacity: 40, refillRatePerSecond: 40 / 60 },
  file_upload: { capacity: 12, refillRatePerSecond: 12 / 60 },
};

/**
 * Checks and consumes tokens in a token-bucket rate limiter.
 */
export function checkRateLimit(
  key: string,
  profile: keyof typeof RATE_LIMIT_PROFILES = "api_standard",
  cost = 1,
): RateLimitCheckResult {
  const config = RATE_LIMIT_PROFILES[profile] || RATE_LIMIT_PROFILES.api_standard;
  const now = Date.now();

  let bucket = rateLimitBuckets.get(key);
  if (!bucket) {
    bucket = {
      tokens: config.capacity,
      lastRefill: now,
      capacity: config.capacity,
      refillRatePerSecond: config.refillRatePerSecond,
    };
    rateLimitBuckets.set(key, bucket);
  }

  // Refill tokens based on elapsed time
  const elapsedSeconds = (now - bucket.lastRefill) / 1000;
  bucket.tokens = Math.min(bucket.capacity, bucket.tokens + elapsedSeconds * bucket.refillRatePerSecond);
  bucket.lastRefill = now;

  if (bucket.tokens >= cost) {
    bucket.tokens -= cost;
    return {
      allowed: true,
      limit: config.capacity,
      remaining: Math.floor(bucket.tokens),
      resetSeconds: Math.ceil((config.capacity - bucket.tokens) / config.refillRatePerSecond),
    };
  }

  const waitSeconds = Math.ceil((cost - bucket.tokens) / bucket.refillRatePerSecond);
  return {
    allowed: false,
    limit: config.capacity,
    remaining: 0,
    resetSeconds: waitSeconds,
    retryAfterSeconds: waitSeconds,
    burstExceeded: true,
  };
}

// Known bot / scraper user-agents
const AUTOMATION_UA_PATTERNS = [
  /headlesschrome/i,
  /phantomjs/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
  /curl\//i,
  /python-requests/i,
  /go-http-client/i,
  /scrapy/i,
  /wget\//i,
  /httpclient/i,
];

/**
 * Evaluates bot indicators from HTTP request context and behavioral cues.
 */
export function evaluateBotSignals(params: {
  userAgent?: string | null;
  formFillTimeMs?: number;
  honeypotFilled?: boolean;
  hasWebdriver?: boolean;
}): { isBot: boolean; confidence: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  // 1. Honeypot check: hidden field intended only for automated form fillers
  if (params.honeypotFilled) {
    score += 90;
    reasons.push("Honeypot trap field was completed.");
  }

  // 2. Form submission speed: humans take > 800ms to read and submit
  if (params.formFillTimeMs !== undefined && params.formFillTimeMs < 600) {
    score += 65;
    reasons.push(`Instantaneous form submission (${params.formFillTimeMs}ms) violates human timing.`);
  }

  // 3. User-agent automation string matching
  if (params.userAgent) {
    for (const pattern of AUTOMATION_UA_PATTERNS) {
      if (pattern.test(params.userAgent)) {
        score += 80;
        reasons.push(`Automated bot/scraper user-agent detected (${params.userAgent}).`);
        break;
      }
    }
  }

  // 4. Client-side navigator.webdriver flag
  if (params.hasWebdriver) {
    score += 85;
    reasons.push("navigator.webdriver automation flag is true.");
  }

  return {
    isBot: score >= 60,
    confidence: Math.min(score, 100),
    reasons,
  };
}

// Banned promotional spam phrases
const SPAM_PHRASES = [
  /t\.me\//i,
  /whatsapp:\s*\+?[0-9]/i,
  /crypto\s+doubler/i,
  /guaranteed\s+profit/i,
  /make\s+money\s+fast/i,
  /casino\s+bonus/i,
  /free\s+followers/i,
  /click\s+here\s+now\s+for/i,
];

/**
 * Evaluates text content for spam, promotional abuse, and repetition.
 */
export function evaluateSpamContent(text: string): {
  isSpam: boolean;
  score: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 0;

  if (!text || text.trim().length === 0) {
    return { isSpam: false, score: 0, reasons: [] };
  }

  // 1. Check for known spam phrases
  for (const regex of SPAM_PHRASES) {
    if (regex.test(text)) {
      score += 50;
      reasons.push(`Contains known promotional spam phrase: ${regex.source}`);
    }
  }

  // 2. Link density: excessive URLs in a short text
  const urlMatches = text.match(/https?:\/\/[^\s]+/g) || [];
  if (urlMatches.length >= 4) {
    score += 45;
    reasons.push(`High link density (${urlMatches.length} links) detected.`);
  }

  // 3. Excessive uppercase shouting
  const letters = text.replace(/[^A-Za-z]/g, "");
  if (letters.length > 20) {
    const uppercaseCount = (text.match(/[A-Z]/g) || []).length;
    const upperRatio = uppercaseCount / letters.length;
    if (upperRatio > 0.7) {
      score += 25;
      reasons.push("Excessive uppercase content detected.");
    }
  }

  // 4. Repeated character flood (e.g. 'aaaaaaa!!!!!')
  if (/(.)\1{8,}/.test(text)) {
    score += 30;
    reasons.push("Repetitive character flooding detected.");
  }

  return {
    isSpam: score >= 50,
    score: Math.min(score, 100),
    reasons,
  };
}
