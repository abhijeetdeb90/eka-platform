import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";

export type FirstWeekDay = {
  day: number;
  title: string;
  promise: string;
  action: string;
  to: string;
  cta: string;
  minutes: number;
};

/** Day 0 to Day 7 — value in the first session, understanding before the first renewal. */
export const FIRST_WEEK: FirstWeekDay[] = [
  {
    day: 0,
    title: "Discover yourself",
    promise: "Name what you're seeking, and we shape EKA around it.",
    action:
      "Answer a few quiet questions about what you're seeking, how much time you have and how you like to practise.",
    to: "/app/onboarding",
    cta: "Begin",
    minutes: 4,
  },
  {
    day: 1,
    title: "Your first practice",
    promise: "One short practice, done today. Not read about — done.",
    action: "Open EKA Daily and complete today's practice from your journey.",
    to: "/app/daily",
    cta: "Open EKA Daily",
    minutes: 8,
  },
  {
    day: 2,
    title: "Your first reflection",
    promise: "A single honest sentence is enough to start a record.",
    action: "Write your first journal reflection. The companion can help you find the first line.",
    to: "/app/journal",
    cta: "Write a reflection",
    minutes: 5,
  },
  {
    day: 3,
    title: "Your first circle",
    promise: "Fewer people, held better. No follower counts here.",
    action: "Join a circle and say one true thing in its shared ritual or story thread.",
    to: "/app/sanghas",
    cta: "Find my circle",
    minutes: 6,
  },
  {
    day: 4,
    title: "A meaningful action",
    promise: "Practice that leaves the screen.",
    action: "Take on an act of service in your circle, or do the day's act of kindness.",
    to: "/app/daily",
    cta: "Take the action",
    minutes: 10,
  },
  {
    day: 5,
    title: "Your first milestone",
    promise: "Proof that something is accumulating.",
    action: "Look at My EKA — days with EKA, practices, reflections and where your journey stands.",
    to: "/app/dashboard",
    cta: "See my progress",
    minutes: 3,
  },
  {
    day: 6,
    title: "A shared experience",
    promise: "Doing the same thing at the same hour as other people changes it.",
    action: "Join a shared ritual in your circle and mark yourself as taking part.",
    to: "/app/sanghas",
    cta: "Join a shared ritual",
    minutes: 12,
  },
  {
    day: 7,
    title: "What changed",
    promise: "You should be able to answer this before you're ever charged.",
    action:
      "Read your week back with the reflection companion's summary, and choose the journey you'll actually run.",
    to: "/app/journeys",
    cta: "Choose my journey",
    minutes: 6,
  },
];

export type OnboardingStep = { day_number: number; completed_on: string; note: string | null };

export async function fetchFirstWeek(): Promise<OnboardingStep[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("onboarding_steps")
    .select("day_number, completed_on, note")
    .eq("user_id", uid)
    .order("day_number");
  return (data ?? []) as OnboardingStep[];
}

export async function completeFirstWeekDay(day: number, note?: string) {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase
    .from("onboarding_steps")
    .upsert(
      { user_id: uid, day_number: day, note: note ?? null },
      { onConflict: "user_id,day_number" },
    );
}

/** The next unfinished day, so the member always knows where they are. */
export function nextDay(steps: OnboardingStep[]) {
  const done = new Set(steps.map((s) => s.day_number));
  return FIRST_WEEK.find((d) => !done.has(d.day)) ?? null;
}
