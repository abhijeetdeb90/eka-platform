/**
 * ==============================================================================
 * EKA RETENTION ARCHITECTURE & RECURRING ENGAGEMENT ENGINE
 * ==============================================================================
 * 
 * Recurring User Value Loops:
 * 1. Personalised discovery based on heritage roots
 * 2. Saved knowledge & Wisdom Passport
 * 3. Followed themes & regional traditions
 * 4. Followed creators & custodians
 * 5. Followed communities (Sanghas)
 * 6. EKA Daily contemplative rhythm
 * 7. Questions / Inquiries asked
 * 8. Resuming unfinished exploration
 * 9. Relevant cultural events & sacred calendar
 * 10. Personal collections
 * 
 * Computes:
 * - D1 Retention (Target > 30%)
 * - D7 Retention (Target > 15%)
 * - D30 Retention (Target > 8%)
 * - Average sessions / user / week
 * ==============================================================================
 */

import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";

export interface RetentionMetrics {
  totalUsersSampled: number;
  d1RetentionPercent: number;
  d7RetentionPercent: number;
  d30RetentionPercent: number;
  averageSessionsPerWeek: number;
  activeReturnLoops: {
    dailyPromptCompletedCount: number;
    savedItemsReviewedCount: number;
    followedThemesCheckedCount: number;
    inquiriesResumedCount: number;
  };
}

const SESSION_STORAGE_KEY = "eka_last_active_timestamp_v1";

/**
 * Tracks the start of an active user session and detects day milestone returns.
 */
export function recordSessionReturn(userId?: string | null): void {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const rawLast = localStorage.getItem(SESSION_STORAGE_KEY);
  localStorage.setItem(SESSION_STORAGE_KEY, String(now));

  track("retention_session_start", { timestamp: now });

  if (rawLast) {
    const lastTime = Number(rawLast);
    const diffHours = (now - lastTime) / (1000 * 60 * 60);

    // If returned within 20 to 36 hours (Day 1 return window)
    if (diffHours >= 20 && diffHours <= 36) {
      track("retention_day_1_active", { hoursSinceLast: Math.round(diffHours) });
    }
    // If returned between 6 and 8 days (Day 7 return window)
    else if (diffHours >= 144 && diffHours <= 192) {
      track("retention_day_7_active", { daysSinceLast: Math.round(diffHours / 24) });
    }
    // If returned between 28 and 35 days (Day 30 return window)
    else if (diffHours >= 672 && diffHours <= 840) {
      track("retention_day_30_active", { daysSinceLast: Math.round(diffHours / 24) });
    }
  }
}

/**
 * Fetches real retention metrics from Supabase database telemetry.
 */
export async function fetchRetentionTelemetry(): Promise<RetentionMetrics> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Query analytics events from the past 30 days
    const { data: events, error } = await supabase
      .from("analytics_events")
      .select("event, user_id, created_at")
      .gte("created_at", thirtyDaysAgo)
      .limit(1000);

    if (error || !events || events.length === 0) {
      return {
        totalUsersSampled: 0,
        d1RetentionPercent: 0,
        d7RetentionPercent: 0,
        d30RetentionPercent: 0,
        averageSessionsPerWeek: 0,
        activeReturnLoops: {
          dailyPromptCompletedCount: 0,
          savedItemsReviewedCount: 0,
          followedThemesCheckedCount: 0,
          inquiriesResumedCount: 0,
        },
      };
    }

    const uniqueUsers = new Set(events.filter((e) => e.user_id).map((e) => e.user_id));
    const totalUsers = uniqueUsers.size || 1;

    let d1Count = 0;
    let d7Count = 0;
    let d30Count = 0;
    let sessionStarts = 0;
    let dailyPrompts = 0;
    let savedReviewed = 0;
    let themesChecked = 0;
    let inquiriesResumed = 0;

    for (const ev of events) {
      if (ev.event === "retention_session_start" || ev.event === "login") sessionStarts++;
      if (ev.event === "retention_day_1_active") d1Count++;
      if (ev.event === "retention_day_7_active") d7Count++;
      if (ev.event === "retention_day_30_active") d30Count++;
      if (ev.event === "daily_prompt_completed") dailyPrompts++;
      if (ev.event === "saved_tradition_reviewed" || ev.event === "wisdom_passport_accessed") savedReviewed++;
      if (ev.event === "followed_theme_viewed" || ev.event === "theme_open") themesChecked++;
      if (ev.event === "unfinished_exploration_resumed" || ev.event === "ask_eka_query") inquiriesResumed++;
    }

    const d1Percent = Math.min(100, Math.round((d1Count / totalUsers) * 1000) / 10);
    const d7Percent = Math.min(100, Math.round((d7Count / totalUsers) * 1000) / 10);
    const d30Percent = Math.min(100, Math.round((d30Count / totalUsers) * 1000) / 10);
    const avgSessionsPerWeek = Math.round((sessionStarts / totalUsers / 4) * 10) / 10;

    return {
      totalUsersSampled: totalUsers,
      d1RetentionPercent: d1Percent,
      d7RetentionPercent: d7Percent,
      d30RetentionPercent: d30Percent,
      averageSessionsPerWeek: avgSessionsPerWeek,
      activeReturnLoops: {
        dailyPromptCompletedCount: dailyPrompts,
        savedItemsReviewedCount: savedReviewed,
        followedThemesCheckedCount: themesChecked,
        inquiriesResumedCount: inquiriesResumed,
      },
    };
  } catch {
    return {
      totalUsersSampled: 0,
      d1RetentionPercent: 0,
      d7RetentionPercent: 0,
      d30RetentionPercent: 0,
      averageSessionsPerWeek: 0,
      activeReturnLoops: {
        dailyPromptCompletedCount: 0,
        savedItemsReviewedCount: 0,
        followedThemesCheckedCount: 0,
        inquiriesResumedCount: 0,
      },
    };
  }
}
