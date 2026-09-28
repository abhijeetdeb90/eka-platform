/**
 * EKA × Google Analytics 4 (GA4) DPDP-Compliant Telemetry Adapter
 *
 * Implements privacy-first tracking for Google Analytics 4 adhering strictly
 * to India's Digital Personal Data Protection (DPDP) Act, 2023.
 *
 * Rules:
 * 1. Zero Tracking Without Affirmative Consent: Checks `hasAnalyticsConsent()`.
 * 2. Strict PII Sanitization: Strips names, emails, phone numbers, and spiritual reflections.
 * 3. Graceful No-Op: Never blocks or degrades user experience if GA4 fails to load.
 */

import { hasAnalyticsConsent } from "@/lib/analytics";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let ga4Initialized = false;

/**
 * Returns the effective GA4 Measurement ID from environment.
 */
export function getGA4MeasurementId(): string | null {
  if (typeof process !== "undefined" && process.env) {
    if (process.env["VITE_GA4_MEASUREMENT_ID"]) return process.env["VITE_GA4_MEASUREMENT_ID"];
    if (process.env["GA4_MEASUREMENT_ID"]) return process.env["GA4_MEASUREMENT_ID"];
  }

  if (typeof import.meta !== "undefined") {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
    if (metaEnv?.["VITE_GA4_MEASUREMENT_ID"]) return metaEnv["VITE_GA4_MEASUREMENT_ID"];
  }

  return null;
}

/**
 * Strips potential PII keys and values before sending data to third-party endpoints.
 */
function sanitizeEventProps(props: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  const forbiddenKeys = [
    "email",
    "name",
    "full_name",
    "phone",
    "password",
    "secret",
    "token",
    "reflection",
    "sadhana_notes",
    "journal_text",
  ];

  for (const [key, value] of Object.entries(props)) {
    const lowerKey = key.toLowerCase();
    if (forbiddenKeys.some((k) => lowerKey.includes(k))) {
      continue; // Drop PII key entirely
    }

    if (typeof value === "string") {
      // Drop if value matches email pattern
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        continue;
      }
      // Truncate long strings
      clean[key] = value.slice(0, 100);
    } else if (typeof value === "number" || typeof value === "boolean") {
      clean[key] = value;
    }
  }

  return clean;
}

/**
 * Dynamically initialize Google Analytics 4 script tag if consent is given.
 */
export function initGA4(): boolean {
  if (typeof window === "undefined") return false;
  if (!hasAnalyticsConsent()) return false;
  if (ga4Initialized) return true;

  const measurementId = getGA4MeasurementId();
  if (!measurementId) return false;

  try {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      anonymize_ip: true,
      send_page_view: false, // We control pageviews explicitly for SPA
    });

    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    ga4Initialized = true;
    return true;
  } catch (err) {
    console.warn("[EKA GA4] Failed to initialize Google Analytics 4:", err);
    return false;
  }
}

/**
 * Track an individual page view in GA4 (SPA route change).
 */
export function trackGA4PageView(path: string, title?: string): void {
  if (!hasAnalyticsConsent() || !window.gtag) return;
  const measurementId = getGA4MeasurementId();
  if (!measurementId) return;

  try {
    window.gtag("event", "page_view", {
      page_path: path,
      page_title: title || document.title,
      send_to: measurementId,
    });
  } catch {
    /* never block UI */
  }
}

/**
 * Track a custom cultural event in GA4.
 */
export function trackGA4Event(eventName: string, props: Record<string, unknown> = {}): void {
  if (!hasAnalyticsConsent() || !window.gtag) return;

  try {
    const sanitized = sanitizeEventProps(props);
    window.gtag("event", eventName, sanitized);
  } catch {
    /* never block UI */
  }
}

/**
 * High-level typed helpers for EKA cultural intelligence telemetry
 */
export function trackTraditionExplored(traditionName: string, category: string): void {
  trackGA4Event("tradition_explored", {
    tradition_name: traditionName,
    category,
  });
}

export function trackSacredPlaceVisited(placeId: string, tradition: string): void {
  trackGA4Event("sacred_place_explored", {
    place_id: placeId,
    tradition,
  });
}

export function trackCitationVerified(canonicalWork: string, verificationLevel: number): void {
  trackGA4Event("citation_verified", {
    canonical_work: canonicalWork,
    verification_level: verificationLevel,
  });
}
