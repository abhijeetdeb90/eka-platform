import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";

/* ------------------------------------------- journal prompts & milestones ---
 * A reflection prompt in EKA is never a writing exercise. It comes from the
 * Journey the member is actually walking, on the day they are actually on.
 * -------------------------------------------------------------------------- */

export type JourneyPrompt = {
  journeyTitle: string;
  journeySlug: string;
  dayNumber: number;
  dayTitle: string;
  prompt: string;
  practice: string;
};

const DAY = 86_400_000;

/** The reflection line from today's step of the member's current Journey. */
export async function fetchJourneyPrompt(): Promise<JourneyPrompt | null> {
  const uid = await currentUserId();
  if (!uid) return null;

  const { data: enrollments } = await supabase
    .from("journey_enrollments")
    .select("journey_id, started_on, completed_at")
    .eq("user_id", uid)
    .is("completed_at", null)
    .order("started_on", { ascending: false })
    .limit(1);
  const enrollment = enrollments?.[0];
  if (!enrollment) return null;

  const { data: journey } = await supabase
    .from("journeys")
    .select("title, slug, duration_days")
    .eq("id", enrollment.journey_id)
    .maybeSingle();
  if (!journey) return null;

  const elapsed = Math.floor((Date.now() - Date.parse(`${enrollment.started_on}T00:00:00Z`)) / DAY);
  const dayNumber = Math.min(Math.max(elapsed + 1, 1), journey.duration_days);

  const { data: step } = await supabase
    .from("journey_days")
    .select("arc_day, title, practice, reflection")
    .eq("journey_id", enrollment.journey_id)
    .eq("arc_day", dayNumber)
    .maybeSingle();
  if (!step) return null;

  return {
    journeyTitle: journey.title,
    journeySlug: journey.slug,
    dayNumber,
    dayTitle: step.title,
    prompt: step.reflection,
    practice: step.practice,
  };
}

/* -------------------------------------------------- reflection milestones */

export type ReflectionMilestone = {
  code: "first-reflection" | "month-of-reflection" | "the-witness";
  glyph: string;
  name: string;
  need: number;
  tokens: number;
  line: string;
};

export const REFLECTION_MILESTONES: ReflectionMilestone[] = [
  {
    code: "first-reflection",
    glyph: "🪷",
    name: "First Reflection",
    need: 7,
    tokens: 25,
    line: "Seven times you stopped to look inward.",
  },
  {
    code: "month-of-reflection",
    glyph: "🔥",
    name: "A Month of Reflection",
    need: 30,
    tokens: 75,
    line: "Thirty reflections. A habit has become a practice.",
  },
  {
    code: "the-witness",
    glyph: "✨",
    name: "The Witness",
    need: 100,
    tokens: 150,
    line: "A hundred moments of watching without judging.",
  },
];

export type EarnedMilestone = { code: string; earned_at: string; tokens: number };

export async function fetchEarnedMilestones(): Promise<EarnedMilestone[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("path_milestones")
    .select("code, earned_at, tokens")
    .eq("user_id", uid);
  return (data ?? []) as EarnedMilestone[];
}

/**
 * The database re-counts the reflections itself and grants the tokens once.
 * Calling this repeatedly is harmless — it is idempotent by design.
 */
export async function claimReflectionMilestone(code: ReflectionMilestone["code"]): Promise<number> {
  const { data, error } = await supabase.rpc("claim_reflection_milestone", { _code: code });
  if (error) return 0;
  return (data as number) ?? 0;
}

/** Claim everything the member has genuinely reached; returns tokens granted. */
export async function claimDueMilestones(
  reflectionCount: number,
  earned: EarnedMilestone[],
): Promise<number> {
  const has = new Set(earned.map((e) => e.code));
  let total = 0;
  for (const m of REFLECTION_MILESTONES) {
    if (reflectionCount >= m.need && !has.has(m.code)) {
      total += await claimReflectionMilestone(m.code);
    }
  }
  return total;
}

export function nextReflectionMilestone(count: number) {
  return REFLECTION_MILESTONES.find((m) => count < m.need) ?? null;
}
