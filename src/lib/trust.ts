import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";

/* ------------------------------------------------------------ trust graph ---
 * EKA verifies observable facts. It does not verify spiritual authority.
 * Nothing here can be bought, and payment volume alone moves nothing.
 * -------------------------------------------------------------------------- */

export type TrustProfile = {
  id: string;
  display_name: string;
  verification_status: string;
  identity_verified: boolean;
  credentials_verified: boolean;
  experience_verified: boolean;
  standards_accepted: boolean;
  eka_recommended: boolean;
  languages: string[];
  traditions: string[];
  location: string | null;
  years_experience: number | null;
  member_since: string;
  rating: number;
  review_count: number;
  sessions_booked: number;
  sessions_completed: number;
  sessions_cancelled: number;
  repeat_participants: number;
  upheld_complaints: number;
  safety_review: string;
  reviewed_at: string | null;
};

export type ScoreDimensionKey =
  | "quality"
  | "completion"
  | "trust"
  | "reach"
  | "reliability"
  | "contribution"
  | "safety"
  | "satisfaction";

export type ScoreWeight = {
  key: ScoreDimensionKey;
  label: string;
  percent: number;
  detail: string;
};

export type ScoreBreakdown = {
  user_id: string;
  has_practitioner: boolean;
  dimensions: Record<ScoreDimensionKey, number | null>;
  weights: ScoreWeight[];
  total: number;
  evidence: {
    booked: number;
    completed: number;
    cancelled: number;
    repeat_participants: number;
    reviews: number;
    complaints: number;
    circles_hosted: number;
  };
};

/** Observable facts about a practitioner. Safe to show publicly. */
export async function fetchTrustProfile(practitionerId: string): Promise<TrustProfile | null> {
  const { data, error } = await supabase.rpc("trust_profile", { _practitioner: practitionerId });
  if (error) throw error;
  return (data as unknown as TrustProfile) ?? null;
}

/** Your own score, dimension by dimension, with the evidence behind it. */
export async function fetchMyScoreBreakdown(): Promise<ScoreBreakdown | null> {
  const uid = await currentUserId();
  if (!uid) return null;
  const { data, error } = await supabase.rpc("creator_score_breakdown", { _uid: uid });
  if (error) throw error;
  return (data as unknown as ScoreBreakdown) ?? null;
}

/** Keep a copy of today's score so a later weight change never rewrites the past. */
export async function snapshotScore(b: ScoreBreakdown) {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase.from("creator_score_snapshots").insert({
    user_id: uid,
    total: b.total,
    dimensions: b.dimensions as never,
    weights: b.weights as never,
  });
}

export async function fetchScoreHistory() {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("creator_score_snapshots")
    .select("id, total, dimensions, created_at")
    .eq("user_id", uid)
    .order("created_at", { ascending: false })
    .limit(24);
  return (data ?? []) as {
    id: string;
    total: number;
    dimensions: Record<string, number | null>;
    created_at: string;
  }[];
}

/** Plain-language next steps. Never "pay to improve". */
export function improvementSuggestions(b: ScoreBreakdown): string[] {
  const out: string[] = [];
  const d = b.dimensions;
  if (!b.evidence.reviews)
    out.push("No reviews yet — reviews only appear after a session is completed.");
  if (d.trust !== null && d.trust < 100)
    out.push("Complete verification: identity, credentials, training information.");
  if (d.completion !== null && d.completion < 90)
    out.push("Sessions started but not completed pull this down more than a lower rating does.");
  if (d.reliability !== null && d.reliability < 90)
    out.push("Cancellations are the single fastest way to lose reliability.");
  if (d.contribution !== null && d.contribution < 60)
    out.push("Hosting a circle counts as community contribution.");
  if (d.reach !== null && d.reach < 50)
    out.push("Taking part respectfully in traditions other than your own widens your reach.");
  if (b.evidence.complaints > 0)
    out.push("There are upheld moderation actions on this account. Safety weighs heavily.");
  if (!out.length)
    out.push("Nothing obvious to improve. Keep sessions completed and people returning.");
  return out;
}
