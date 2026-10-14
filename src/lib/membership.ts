import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";
import { todayISO } from "@/lib/sadhana";

/** ₹499 benchmark (+ taxes), accessible unified price for cultural intelligence & creator ecosystem. */
export const MEMBERSHIP = {
  name: "EKA+ Membership",
  price: "₹499",
  cadence: "month",
  priceCents: 49900,
  currency: "INR",
  taxesNote: "+ applicable taxes",
  promise:
    "A more accessible entry price designed to reduce adoption friction while increasing the number of users who can participate in EKA's knowledge and creator ecosystem.",
  benefits: [
    "Access to EKA's structured cultural, spiritual and local-knowledge library",
    "AI-powered interactive exploration of EKA knowledge",
    "Personalized recommendations based on interests and learning behaviour",
    "Ask questions and receive contextual answers with relevant sources and traditions",
    "Explore connections between cultures, communities, places, rituals, customs and local practices",
    "Save and organize knowledge for future reference",
    "Participate in community discussions",
    "Discover creators, experts, communities, places and authentic local experiences",
    "Early access to selected EKA features and knowledge experiences",
  ],
  pillars: [
    {
      key: "Knowledge & Intelligence",
      body: "Structured library, AI-powered interactive exploration, and deep contextual connections.",
      items: [
        "Structured cultural, spiritual & local knowledge library",
        "AI interactive exploration (Ask EKA) with primary sources",
        "Cross-cultural connections: Tradition → Region → Community → Ritual → Place",
        "Personalized recommendations based on interests & learning behaviour",
        "Save and organize knowledge for future reference in your passport",
      ],
    },
    {
      key: "Community & Creators",
      body: "Meaningful circles, community discussions, authentic local guides, and creator discoveries.",
      items: [
        "Participate in authentic community discussions",
        "Discover verified creators, experts, and local experiences",
        "EKA Daily practices and 7 to 90-day journeys",
        "Live gatherings, shared rituals, and acts of service",
        "Early access to selected EKA features and knowledge experiences",
      ],
    },
  ],
} as const;

export const MONTHLY_THEMES = [
  { month: 1, name: "BEGIN", line: "Start where you actually are." },
  { month: 2, name: "LOVE", line: "The practice of staying close." },
  { month: 3, name: "STILLNESS", line: "Quiet that survives noise." },
  { month: 4, name: "GRATITUDE", line: "Specific, not sentimental." },
  { month: 5, name: "COURAGE", line: "The sentence you have avoided." },
  { month: 6, name: "LETTING GO", line: "Put down what is not yours." },
  { month: 7, name: "CONNECTION", line: "Fewer people, held better." },
  { month: 8, name: "PURPOSE", line: "What your hours actually serve." },
  { month: 9, name: "DEVOTION", line: "Returning, even on the bad days." },
  { month: 10, name: "TRANSFORMATION", line: "Something is ending. Let it." },
  { month: 11, name: "SERVICE", line: "An hour that helps no one you know." },
  { month: 12, name: "REFLECTION", line: "What did the year make of you?" },
] as const;

export function currentTheme(date = new Date()) {
  return MONTHLY_THEMES[date.getMonth()]!;
}

export type Journey = {
  id: string;
  slug: string;
  title: string;
  duration_days: number;
  pillar: string;
  theme: string;
  promise: string;
  summary: string;
};

export type JourneyDay = {
  id: string;
  journey_id: string;
  arc_day: number;
  title: string;
  practice: string;
  reflection: string;
  minutes: number;
};

export type DailyPrompt = {
  id: string;
  kind: string;
  theme: string;
  title: string;
  body: string;
  action: string;
  minutes: number;
};

export type Enrollment = {
  id: string;
  journey_id: string;
  started_on: string;
  completed_at: string | null;
};

export type DayLog = { journey_id: string; day_number: number; completed_on: string };

export async function fetchJourneys(): Promise<Journey[]> {
  const { data, error } = await supabase
    .from("journeys")
    .select("id, slug, title, duration_days, pillar, theme, promise, summary")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as Journey[];
}

export async function fetchJourneyDays(journeyId: string): Promise<JourneyDay[]> {
  const { data, error } = await supabase
    .from("journey_days")
    .select("id, journey_id, arc_day, title, practice, reflection, minutes")
    .eq("journey_id", journeyId)
    .order("arc_day");
  if (error) throw error;
  return (data ?? []) as JourneyDay[];
}

export async function fetchEnrollments(): Promise<Enrollment[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("journey_enrollments")
    .select("id, journey_id, started_on, completed_at")
    .eq("user_id", uid);
  return (data ?? []) as Enrollment[];
}

export async function fetchDayLogs(): Promise<DayLog[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("journey_day_logs")
    .select("journey_id, day_number, completed_on")
    .eq("user_id", uid)
    .order("completed_on", { ascending: false })
    .limit(1000);
  return (data ?? []) as DayLog[];
}

export async function enroll(journeyId: string) {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase
    .from("journey_enrollments")
    .upsert({ user_id: uid, journey_id: journeyId }, { onConflict: "user_id,journey_id" });
}

export async function leaveJourney(journeyId: string) {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase
    .from("journey_enrollments")
    .delete()
    .eq("user_id", uid)
    .eq("journey_id", journeyId);
}

export async function logJourneyDay(journeyId: string, dayNumber: number, reflection: string) {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase.from("journey_day_logs").upsert(
    {
      user_id: uid,
      journey_id: journeyId,
      day_number: dayNumber,
      reflection,
      completed_on: todayISO(),
    },
    { onConflict: "user_id,journey_id,day_number" },
  );
  // A journey step carries the most weight on the path.
  const { award, TOKEN_VALUE } = await import("@/lib/path");
  return award("journey", TOKEN_VALUE.journey, `${journeyId}:${dayNumber}`);
}

export async function fetchDailyPrompts(): Promise<DailyPrompt[]> {
  const { data, error } = await supabase
    .from("daily_prompts")
    .select("id, kind, theme, title, body, action, minutes");
  if (error) throw error;
  return (data ?? []) as DailyPrompt[];
}

/** Days elapsed since the enrollment started, 1-indexed and capped at the journey length. */
export function dayNumberFor(enrollment: Enrollment, duration: number) {
  const start = new Date(`${enrollment.started_on}T00:00:00`);
  const now = new Date(`${todayISO()}T00:00:00`);
  const elapsed = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return Math.min(duration, Math.max(1, elapsed + 1));
}

/** Long journeys repeat a seven-day arc, deepening week by week. */
export function arcDayFor(dayNumber: number) {
  return ((dayNumber - 1) % 7) + 1;
}

export function weekFor(dayNumber: number) {
  return Math.floor((dayNumber - 1) / 7) + 1;
}

/** A stable prompt for the day, preferring the current monthly theme. */
export function promptForToday(prompts: DailyPrompt[], date = new Date()) {
  if (prompts.length === 0) return null;
  const theme = currentTheme(date).name;
  const pool = prompts.filter((p) => p.theme === theme);
  const list = pool.length > 0 ? pool : prompts;
  const seed = Math.floor(date.getTime() / 86_400_000);
  return list[seed % list.length]!;
}

export const PROMPT_KIND_LABEL: Record<string, string> = {
  practice: "Practice",
  reflection: "Reflection",
  question: "Question",
  ritual: "Ritual",
  insight: "Cultural insight",
  kindness: "Act of kindness",
};
