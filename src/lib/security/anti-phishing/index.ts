// ==============================================================================
// EKA PLATFORM — ANTI-PHISHING & DECEPTIVE URL PROTECTION ENGINE
// ==============================================================================

import type { PhishingAnalysisResult, PhishingRiskLevel } from "../types";

// Legitimate official domains of the EKA ecosystem and trusted partners
const TRUSTED_DOMAINS = [
  "eka.earth",
  "localhost",
  "lovable.dev",
  "supabase.co",
  "google.com",
  "googleapis.com",
  "stripe.com",
  "vercel.app",
  "wikimedia.org",
  "wikipedia.org",
  "unesco.org",
  "europeana.eu",
];

// High-risk TLDs commonly abused for mass disposable phishing
const SUSPICIOUS_TLDS = new Set([
  "zip", "mov", "top", "work", "loan", "cam", "gq", "cf", "ml", "tk", "click", "country", "stream"
]);

// Phishing keywords often combined with brand names to trick users
const PHISHING_KEYWORDS = [
  "login", "verify", "secure", "account", "update", "banking", "billing",
  "recovery", "wallet", "auth", "signin", "support", "kyc", "portal", "confirm"
];

// Known blocklisted malicious domains
const BLOCKLISTED_DOMAINS = new Set([
  "eka-login-verify.com",
  "eka-earth-security.net",
  "secure-eka-auth.info",
  "my-eka-recover.xyz",
  "phishing-test-domain.org",
]);

/**
 * Computes Levenshtein edit distance between two strings to detect typosquatting.
 */
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i]![0] = i;
  for (let j = 0; j <= n; j++) dp[0]![j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + 1, // deletion
        dp[i]![j - 1]! + 1, // insertion
        dp[i - 1]![j - 1]! + cost, // substitution
      );
    }
  }
  return dp[m]![n]!;
}

/**
 * Analyzes a URL for phishing, impersonation, typosquatting, and deception.
 */
export function analyzeUrlForPhishing(rawUrl: string): PhishingAnalysisResult {
  const reasons: string[] = [];
  const flags = {
    isPunycodeOrHomoglyph: false,
    isTyposquatting: false,
    isIpLiteral: false,
    hasDeceptiveSubdomains: false,
    hasObfuscation: false,
    isKnownMalicious: false,
    hasBrandImpersonation: false,
    hasMisleadingCredentials: false,
  };

  let score = 0;

  let parsed: URL;
  try {
    // Check for relative paths (safe by definition on same origin)
    if (rawUrl.startsWith("/") && !rawUrl.startsWith("//")) {
      return {
        url: rawUrl,
        domain: "same-origin",
        riskLevel: "LOW RISK",
        score: 0,
        reasons: [],
        flags,
        recommendation: "allow",
        explanation: {
          whatHappened: "Internal relative navigation.",
          whyFlagged: "Safe internal path.",
          safeNextStep: "Proceed smoothly.",
        },
      };
    }

    parsed = new URL(rawUrl);
  } catch {
    return {
      url: rawUrl,
      domain: "malformed",
      riskLevel: "CRITICAL",
      score: 100,
      reasons: ["URL format is malformed or invalid."],
      flags: { ...flags, hasObfuscation: true },
      recommendation: "block",
      explanation: {
        whatHappened: "The link has an invalid or corrupted structure.",
        whyFlagged: "Malformed URLs are often used to trigger parser bugs or evasion filters.",
        safeNextStep: "Do not navigate to this destination.",
      },
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.toLowerCase();

  // 1. Protocol check
  if (protocol !== "https:" && protocol !== "http:") {
    flags.hasObfuscation = true;
    score += 80;
    reasons.push(`Dangerous or non-standard protocol detected: '${protocol}'.`);
  }

  // 2. Embedded userinfo in URL: http://user:pass@host
  if (parsed.username || parsed.password) {
    flags.hasMisleadingCredentials = true;
    score += 60;
    reasons.push("URL contains embedded credentials/userinfo intended to spoof the true destination.");
  }

  // 3. Known blocklist check
  if (BLOCKLISTED_DOMAINS.has(hostname)) {
    flags.isKnownMalicious = true;
    score += 100;
    reasons.push(`Domain '${hostname}' is on the verified phishing blocklist.`);
  }

  // 4. IP literal check (e.g. http://192.168.1.1 or http://0x7f.0.0.1)
  const isIpv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  const isHexOrOctalIp = /^0x[0-9a-f]+$|^\d{8,11}$/i.test(hostname);
  if (isIpv4 || isHexOrOctalIp) {
    flags.isIpLiteral = true;
    score += 50;
    reasons.push("URL targets a direct numeric/IP address rather than a verified domain name.");
  }

  // 5. Punycode & Homoglyph check
  if (hostname.includes("xn--")) {
    flags.isPunycodeOrHomoglyph = true;
    score += 45;
    reasons.push("Domain uses internationalized punycode ('xn--'), often used in homoglyph lookalike attacks.");
  }

  // 6. Suspicious TLD check
  const parts = hostname.split(".");
  const tld = parts[parts.length - 1];
  if (tld && SUSPICIOUS_TLDS.has(tld)) {
    score += 25;
    reasons.push(`Domain uses high-abuse disposable top-level domain ('.${tld}').`);
  }

  // 7. Excessive Subdomains (e.g., eka.earth.verify.account-update.badsite.com)
  if (parts.length >= 4) {
    flags.hasDeceptiveSubdomains = true;
    score += 20;
    reasons.push("Excessive subdomain depth commonly used to conceal the genuine root domain.");
  }

  // 8. Typosquatting and Lookalike Domain Analysis against trusted domains
  const cleanHost = hostname.replace(/^www\./, "");
  const isWhitelisted = TRUSTED_DOMAINS.some(
    (td) => cleanHost === td || cleanHost.endsWith(`.${td}`),
  );

  if (!isWhitelisted) {
    for (const trusted of TRUSTED_DOMAINS) {
      const trustedName = trusted.split(".")[0]!;
      const hostMain = cleanHost.split(".")[0]!;

      // Levenshtein check on domain label
      const dist = levenshteinDistance(hostMain, trustedName);
      if (dist > 0 && dist <= 2 && trustedName.length >= 3) {
        flags.isTyposquatting = true;
        score += 65;
        reasons.push(`Domain resembles official '${trusted}' (edit distance ${dist}), suggesting typosquatting.`);
        break;
      }
    }

    // Brand Impersonation check: check if brand keywords appear in untrusted hostname
    const hasBrandWord = cleanHost.includes("eka") || cleanHost.includes("sanctuary");
    const hasPhishWord = PHISHING_KEYWORDS.some((kw) => cleanHost.includes(kw));

    if (hasBrandWord && hasPhishWord) {
      flags.hasBrandImpersonation = true;
      score += 70;
      reasons.push("Domain combines EKA brand terms with security/authentication keywords.");
    }
  }

  // 9. URL Obfuscation checks (%2e%2e, double slash, @)
  if (rawUrl.includes("%25") || rawUrl.includes("%2e") || rawUrl.includes("%2E")) {
    flags.hasObfuscation = true;
    score += 30;
    reasons.push("URL uses multiple layers of hex/URL encoding to obscure characters.");
  }

  // Classify Risk Level
  let riskLevel: PhishingRiskLevel = "LOW RISK";
  let recommendation: PhishingAnalysisResult["recommendation"] = "allow";

  if (score >= 80 || flags.isKnownMalicious) {
    riskLevel = "CRITICAL";
    recommendation = "block";
  } else if (score >= 50 || flags.isTyposquatting || flags.hasBrandImpersonation) {
    riskLevel = "HIGH RISK";
    recommendation = "require_override";
  } else if (score >= 25 || flags.isPunycodeOrHomoglyph || flags.isIpLiteral) {
    riskLevel = "SUSPICIOUS";
    recommendation = "warn";
  } else {
    riskLevel = "LOW RISK";
    recommendation = "allow";
  }

  return {
    url: rawUrl,
    domain: hostname,
    riskLevel,
    score: Math.min(score, 100),
    reasons,
    flags,
    recommendation,
    explanation: {
      whatHappened:
        riskLevel === "LOW RISK"
          ? "The external link destination appears standard and verified."
          : `EKA Security Shield analyzed '${hostname}' and flagged suspicious indicators.`,
      whyFlagged:
        reasons.length > 0 ? reasons.join(" ") : "Passed heuristic security checks.",
      safeNextStep:
        riskLevel === "CRITICAL"
          ? "This link is completely blocked to safeguard your credentials and device."
          : riskLevel === "HIGH RISK"
          ? "We strongly advise against opening this link. If you trust the creator, proceed only after verification."
          : riskLevel === "SUSPICIOUS"
          ? "Check the address bar closely to ensure it is the genuine website before entering any information."
          : "Continue peacefully.",
    },
  };
}

/**
 * Report a new malicious or phishing domain to the local reputation database.
 */
export function reportPhishingDomain(domain: string, reason: string): void {
  const clean = domain.toLowerCase().trim().replace(/^https?:\/\//, "").split("/")[0]!;
  BLOCKLISTED_DOMAINS.add(clean);
}
