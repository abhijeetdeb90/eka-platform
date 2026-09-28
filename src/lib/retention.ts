import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";

export const CANCEL_REASONS = [
  { id: "too_expensive", label: "It costs more than it gives me right now" },
  { id: "no_time", label: "I don't have time to practise" },
  { id: "lost_habit", label: "I fell out of the habit" },
  { id: "not_useful", label: "The journeys weren't what I needed" },
  { id: "community", label: "I never found my circle" },
  { id: "finished", label: "I got what I came for" },
  { id: "other", label: "Something else" },
] as const;

export type CancelReasonId = (typeof CANCEL_REASONS)[number]["id"];

export type RetentionOffer = {
  kind: "pause" | "discount" | "gentler_path" | "circle_match";
  headline: string;
  body: string;
  cta: string;
  discountPercent?: number;
  pauseDays?: number;
};

/** The offer answers the actual reason, rather than throwing a discount at everything. */
export function offerFor(reason: CancelReasonId): RetentionOffer {
  switch (reason) {
    case "no_time":
    case "lost_habit":
      return {
        kind: "gentler_path",
        headline: "Continue my journey — three minutes a day",
        body: "Keep your streak and progress, and we'll shorten EKA Daily to a single three-minute practice until the habit returns. Nothing is lost while you rebuild.",
        cta: "Continue my journey",
      };
    case "too_expensive":
      return {
        kind: "discount",
        headline: "Stay for three months at half price",
        body: "Same membership, same journeys, half the price for the next three months. No lock-in — leave whenever it stops being worth it.",
        cta: "Continue at 50% off",
        discountPercent: 50,
      };
    case "community":
      return {
        kind: "circle_match",
        headline: "Let us place you in a circle first",
        body: "Most members who stay say the circle is why. We'll match you to a small circle running a shared ritual this week before you decide.",
        cta: "Match me to a circle",
      };
    case "not_useful":
    case "finished":
      return {
        kind: "gentler_path",
        headline: "Try one journey that actually fits",
        body: "Your reflections point somewhere specific. Start a different journey today — if it isn't right within a week, cancelling still takes one tap.",
        cta: "Continue my journey",
      };
    default:
      return {
        kind: "pause",
        headline: "Pause for 60 days instead",
        body: "Your journeys, streak, reflections and circle stay exactly as they are. Nothing is charged while you're paused.",
        cta: "Pause instead",
        pauseDays: 60,
      };
  }
}

export type ProgressSnapshot = {
  daysWithEka: number;
  journeyDays: number;
  reflections: number;
  practices: number;
  circles: number;
  activeJourneys: number;
};

/** What the member would be walking away from, shown before anything is cancelled. */
export async function fetchProgressSnapshot(): Promise<ProgressSnapshot> {
  const uid = await currentUserId();
  const empty: ProgressSnapshot = {
    daysWithEka: 0,
    journeyDays: 0,
    reflections: 0,
    practices: 0,
    circles: 0,
    activeJourneys: 0,
  };
  if (!uid) return empty;

  const [profile, dayLogs, journal, practices, circles, enrollments] = await Promise.all([
    supabase.from("profiles").select("created_at").eq("id", uid).maybeSingle(),
    supabase
      .from("journey_day_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", uid),
    supabase
      .from("journal_entries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", uid),
    supabase
      .from("practice_completions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", uid),
    supabase
      .from("community_members")
      .select("id", { count: "exact", head: true })
      .eq("user_id", uid),
    supabase
      .from("journey_enrollments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", uid)
      .is("completed_at", null),
  ]);

  const created = profile.data?.created_at
    ? new Date(profile.data.created_at).getTime()
    : Date.now();
  return {
    daysWithEka: Math.max(1, Math.ceil((Date.now() - created) / 86_400_000)),
    journeyDays: dayLogs.count ?? 0,
    reflections: journal.count ?? 0,
    practices: practices.count ?? 0,
    circles: circles.count ?? 0,
    activeJourneys: enrollments.count ?? 0,
  };
}

export async function recordCancellationSurvey(reason: string, details: string) {
  const uid = await currentUserId();
  if (!uid) return null;
  const { data } = await supabase
    .from("cancellation_surveys")
    .insert({ user_id: uid, reason, details: details || null })
    .select("id")
    .maybeSingle();
  return data?.id ?? null;
}

export async function closeSurvey(
  surveyId: string | null,
  outcome: "stayed" | "canceled" | "paused",
) {
  if (!surveyId) return;
  await supabase.from("cancellation_surveys").update({ outcome }).eq("id", surveyId);
}

export async function recordOffer(
  offer: RetentionOffer,
  status: "offered" | "accepted" | "declined",
) {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase.from("retention_offers").insert({
    user_id: uid,
    kind: offer.kind,
    discount_percent: offer.discountPercent ?? 0,
    pause_days: offer.pauseDays ?? 0,
    status,
    accepted_at: status === "accepted" ? new Date().toISOString() : null,
  });
}
