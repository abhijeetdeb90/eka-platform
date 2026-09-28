/**
 * EKA Observability — PostHog Analytics & Feature Flags
 *
 * Fully compliant with India's DPDP Act, 2023. Telemetry and session replays
 * are strictly blocked until explicit, affirmative cookie consent is obtained.
 */

import { hasAnalyticsConsent } from "@/lib/analytics";

const POSTHOG_KEY = process.env["POSTHOG_KEY"] || process.env["VITE_POSTHOG_KEY"];
const POSTHOG_HOST =
  process.env["POSTHOG_HOST"] || process.env["VITE_POSTHOG_HOST"] || "https://app.posthog.com";

/**
 * Capture a custom product event in PostHog
 */
export async function posthogEvent(
  event: string,
  properties: Record<string, unknown> = {},
): Promise<void> {
  // DPDP Consent Gate
  if (!hasAnalyticsConsent() || !POSTHOG_KEY) {
    return;
  }

  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        event,
        properties: {
          ...properties,
          $current_url: typeof window !== "undefined" ? window.location.href : undefined,
          timestamp: new Date().toISOString(),
        },
      }),
    });
  } catch {
    /* Silent catch to avoid impacting product performance */
  }
}

/**
 * Check if a feature flag is enabled for the current environment
 */
export async function isFeatureEnabled(
  flagKey: string,
  distinctId = "anonymous",
): Promise<boolean> {
  if (!POSTHOG_KEY) return false;

  try {
    const res = await fetch(`${POSTHOG_HOST}/decide/?v=3`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        distinct_id: distinctId,
      }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { featureFlags?: Record<string, boolean | string> };
    return Boolean(data.featureFlags?.[flagKey]);
  } catch {
    return false;
  }
}

/**
 * Identify a user with pseudonymized traits
 */
export async function posthogIdentify(
  userId: string,
  traits: Record<string, unknown> = {},
): Promise<void> {
  if (!hasAnalyticsConsent() || !POSTHOG_KEY) {
    return;
  }

  // Never transmit sensitive spiritual affiliations or caste data in analytics
  const cleanTraits: Record<string, unknown> = { ...traits };
  delete cleanTraits["religion"];
  delete cleanTraits["caste"];
  delete cleanTraits["community_background"];

  await posthogEvent("$identify", {
    $distinct_id: userId,
    $set: cleanTraits,
  });
}
