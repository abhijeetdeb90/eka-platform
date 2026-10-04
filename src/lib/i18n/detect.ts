// ==============================================================================
// EKA 3-LAYER LOCALIZATION ENGINE — LAYER 1: DETECT
// ==============================================================================
// Strict Priority:
// 1. Explicit user choice (localStorage / cookie 'eka_locale')
// 2. Saved user language preference in Supabase profile (preferred_language)
// 3. Browser language (navigator.languages / navigator.language)
// 4. Device language where available
// 5. Regional inference (without blindly trusting IP addresses)
// 6. English fallback ('en')
// ==============================================================================

import {
  type SupportedLocale,
  type RegionalContext,
  SUPPORTED_LOCALES,
} from "./types";

const COOKIE_NAME = "eka_locale";
const STORAGE_KEY = "eka_locale";
const REGION_STORAGE_KEY = "eka_region";

/**
 * Normalizes an arbitrary language tag (e.g. 'as-IN', 'as', 'bn-BD', 'hi') to SupportedLocale.
 */
export function normalizeLanguageTag(tag: string | null | undefined): SupportedLocale | null {
  if (!tag) return null;
  const clean = tag.trim().toLowerCase();

  // Exact 2-letter match
  if (clean in SUPPORTED_LOCALES) {
    return clean as SupportedLocale;
  }

  // Prefix match (e.g. "as-in" -> "as", "ta-in" -> "ta", "hi-in" -> "hi")
  const prefix = clean.split("-")[0];
  if (prefix && prefix in SUPPORTED_LOCALES) {
    return prefix as SupportedLocale;
  }

  return null;
}

/**
 * 1. Explicit User Choice (localStorage or cookie)
 */
export function getExplicitUserLocale(): SupportedLocale | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const normalized = normalizeLanguageTag(stored);
    if (normalized) return normalized;
  } catch {}

  try {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    for (const c of cookies) {
      if (c.startsWith(`${COOKIE_NAME}=`)) {
        const val = decodeURIComponent(c.substring(COOKIE_NAME.length + 1));
        const normalized = normalizeLanguageTag(val);
        if (normalized) return normalized;
      }
    }
  } catch {}

  return null;
}

/**
 * 2. Saved Profile Preference in Supabase
 */
export function getProfileLocale(profile: { preferred_language?: string | null; language?: string | null } | null | undefined): SupportedLocale | null {
  if (!profile) return null;
  return (
    normalizeLanguageTag(profile.preferred_language) ||
    normalizeLanguageTag(profile.language)
  );
}

/**
 * 3 & 4. Browser & Device Language
 */
export function getBrowserLocale(): SupportedLocale | null {
  if (typeof window === "undefined" || !window.navigator) return null;

  // Check full list of browser preferred languages
  const navLanguages = window.navigator.languages;
  if (Array.isArray(navLanguages)) {
    for (const lang of navLanguages) {
      const match = normalizeLanguageTag(lang);
      if (match) return match;
    }
  }

  // Check single navigator.language
  if (window.navigator.language) {
    const match = normalizeLanguageTag(window.navigator.language);
    if (match) return match;
  }

  return null;
}

/**
 * 5. Regional Inference
 * Maps detected locale to regional cultural focus
 */
export function inferRegionalContext(
  locale: SupportedLocale,
  explicitRegion?: string | null
): RegionalContext {
  if (explicitRegion) {
    const clean = explicitRegion.toLowerCase().trim();
    if (clean.includes("assam")) return "assam";
    if (clean.includes("tamil")) return "tamil_nadu";
    if (clean.includes("bengal") || clean.includes("bangla")) return "bengal";
    if (clean.includes("maharashtra")) return "maharashtra";
    if (clean.includes("gujarat")) return "gujarat";
    if (clean.includes("kerala")) return "kerala";
    if (clean.includes("karnataka")) return "karnataka";
    if (clean.includes("punjab")) return "punjab";
    if (clean.includes("hindi") || clean.includes("delhi") || clean.includes("up")) return "hindi_belt";
  }

  // Check if explicit region is saved in localStorage
  if (typeof window !== "undefined") {
    try {
      const storedRegion = window.localStorage.getItem(REGION_STORAGE_KEY) as RegionalContext | null;
      if (storedRegion) return storedRegion;
    } catch {}
  }

  // Fallback to default region associated with locale
  const info = SUPPORTED_LOCALES[locale];
  return info ? info.defaultRegion : "global";
}

/**
 * Primary Detection Orchestrator
 * Strictly adheres to:
 * Explicit choice > Supabase preference > Browser language > Device language > Regional inference > English fallback
 */
export function detectUserLocale(
  profile?: { preferred_language?: string | null; language?: string | null } | null
): SupportedLocale {
  // 1. Explicit user choice
  const explicit = getExplicitUserLocale();
  if (explicit) return explicit;

  // 2. Saved user profile
  const profilePref = getProfileLocale(profile);
  if (profilePref) return profilePref;

  // 3 & 4. Browser / Device language
  const browser = getBrowserLocale();
  if (browser) return browser;

  // 6. English fallback
  return "en";
}

/**
 * Persists user choice to localStorage and cookie
 */
export function persistUserLocale(locale: SupportedLocale, region?: RegionalContext): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
    if (region) {
      window.localStorage.setItem(REGION_STORAGE_KEY, region);
    }
  } catch {}

  try {
    // 365 days expiration
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(locale)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch {}

  // Update HTML tag lang and dir
  try {
    const info = SUPPORTED_LOCALES[locale];
    if (info) {
      document.documentElement.lang = info.code;
      document.documentElement.dir = info.dir;
    }
  } catch {}
}
