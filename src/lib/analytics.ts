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
  | "ask_eka_save_passport"
  | "navigation_clicked"
  | "discover_opened"
  | "map_pin_opened"
  | "story_started"
  | "story_completed"
  | "story_location_opened"
  | "story_topic_opened"
  | "learn_opened"
  | "ask_query_submitted"
  | "ask_result_opened"
  | "community_opened"
  | "message_started"
  | "create_started"
  | "search_submitted"
  | "my_eka_opened"
  | "footer_section_clicked"
  | "app_store_badge_clicked"
  | "discovery_category_clicked"
  | "location_selected"
  | "near_me_used"
  | "cultural_entity_opened"
  | "question_started"
  | "creator_opened"
  | "business_opened"
  // Retention Loops
  | "retention_session_start"
  | "retention_day_1_active"
  | "retention_day_7_active"
  | "retention_day_30_active"
  | "daily_prompt_completed"
  | "unfinished_exploration_resumed"
  | "saved_tradition_reviewed"
  | "followed_theme_viewed"
  | "followed_creator_viewed"
  | "wisdom_passport_accessed"
  // Monetisation Validation
  | "premium_viewed"
  | "premium_trial_started"
  | "premium_subscribed"
  | "premium_renewed"
  | "premium_churned"
  | "creator_offering_viewed"
  | "creator_offering_purchased"
  | "creator_booking_confirmed"
  | "creator_booking_completed"
  | "creator_payout_requested"
  | "creator_payout_settled"
  | "enterprise_lead_submitted"
  | "enterprise_demo_scheduled"
  // Network Effects Flywheels
  | "flywheel_question_asked"
  | "flywheel_knowledge_verified"
  | "flywheel_contributor_activated"
  | "flywheel_seeker_to_contributor"
  | "flywheel_creator_first_sale"
  | "flywheel_repeat_purchase";

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
