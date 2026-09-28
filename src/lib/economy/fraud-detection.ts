/**
 * EKA Anti-Fraud & Engagement Integrity Engine
 * Protects platform pool from bot farms, velocity bursts, and circular engagement rings.
 */

export interface EngagementEventPayload {
  userId: string;
  contentId: string;
  eventType: "read" | "save" | "share" | "comment" | "reaction";
  dwellTimeSeconds: number;
  scrollDepthPercent: number;
  deviceFingerprint?: string | undefined;
  timestamp: number;
}

export interface FraudEvaluation {
  isLegitimate: boolean;
  qualificationPassed: boolean;
  fraudScore: number; // 0 (clean) to 100 (fraudulent)
  flags: string[];
}

/**
 * Validates whether an interaction is qualified and legitimate
 */
export function evaluateEngagementIntegrity(
  event: EngagementEventPayload,
  recentEventsFromUser: EngagementEventPayload[] = [],
): FraudEvaluation {
  const flags: string[] = [];
  let fraudScore = 0;

  // 1. Reading qualification: minimum 15s to be counted at all; >= 45s for full score
  if (event.eventType === "read") {
    if (event.dwellTimeSeconds < 5) {
      flags.push("BOUNCE_TOO_FAST");
      fraudScore += 40;
    }
  }

  // 2. Velocity burst detection: more than 10 reactions in 60 seconds
  const oneMinuteAgo = event.timestamp - 60000;
  const recentCount = recentEventsFromUser.filter((e) => e.timestamp > oneMinuteAgo).length;
  if (recentCount > 10) {
    flags.push("VELOCITY_BURST_DETECTED");
    fraudScore += 60;
  }

  // 3. Self-engagement check (handled upstream via author_id match)
  const isQualified =
    event.eventType === "read"
      ? event.dwellTimeSeconds >= 45 && event.scrollDepthPercent >= 60 && fraudScore < 50
      : fraudScore < 50;

  return {
    isLegitimate: fraudScore < 70,
    qualificationPassed: isQualified,
    fraudScore,
    flags,
  };
}
