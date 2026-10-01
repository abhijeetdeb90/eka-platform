import { supabase } from "@/integrations/supabase/client";

export type AnalyticsEvent =
  | "signup"
  | "login"
  | "onboarding_complete"
  | "post_create"
  | "like"
  | "comment"
  | "follow"
  | "community_join"
  | "search"
  | "profile_view"
  | "subscription_cta_click"
  | "subscription_purchase"
  | "plan_change"
  | "cancel_start"
  | "cancel_reason"
  | "cancel_confirm"
  | "retention_offer_accept"
  | "circle_activity_create"
  | "circle_activity_join"
  | "onboarding_day"
  | "reel_create"
  | "reel_reaction"
  | "reel_complete"
  | "topic_view"
  | "episode_rsvp"
  | "episode_purchase"
  | "tip_sent"
  | "wallet_topup"
  | "question_asked"
  | "question_vote"
  | "offline_entry_queued"
  | "join_started"
  | "join_step_completed"
  | "standards_accepted"
  | "passport_share_toggle"
  | "theme_open"
  | "trust_profile_view"
  | "score_explained"
  | "wisdom_graph_view"
  | "wisdom_node_open"
  | "navigator_recommendation"
  | "navigator_handoff"
  | "passport_share_created"
  | "passport_share_revoked"
  | "ask_eka_query"
  | "ask_eka_save_passport";

/** Returns whether the user has given affirmative consent for analytics tracking (DPDP Act compliance) */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem("eka_cookie_consent_v1");
    if (!raw) return false; // Default before consent is NO tracking
    const parsed = JSON.parse(raw);
    return Boolean(parsed.analytics);
  } catch {
    return false;
  }
}

/** Fire-and-forget product analytics. Strictly honors user cookie preferences and DPDP Act. Never blocks or throws in the UI. */
export function track(event: AnalyticsEvent, props: Record<string, unknown> = {}) {
  // Respect user privacy consent: never send telemetry if analytics consent is not explicitly granted
  if (!hasAnalyticsConsent()) {
    return;
  }

  void (async () => {
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      await supabase.from("analytics_events").insert({
        user_id: data.user.id,
        event,
        props: props as never,
      });
    } catch {
      /* analytics must never break the product */
    }
  })();
}
