import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";

export const TRADITIONS = ["Hindu", "Buddhist", "Sikh", "Christian", "Islamic", "Jain"] as const;

export type Practice = {
  id: string;
  slug: string;
  title: string;
  tradition: string;
  category: string;
  duration_min: number;
  summary: string;
  steps: string[];
};

export type Reading = {
  id: string;
  tradition: string;
  title: string;
  source: string;
  body: string;
};

export type Observance = {
  id: string;
  name: string;
  tradition: string;
  observed_on: string;
  description: string;
  fasting: boolean;
};

export type FastingLog = {
  id: string;
  observance_id: string | null;
  label: string;
  started_at: string;
  ended_at: string | null;
};

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export async function fetchPractices(): Promise<Practice[]> {
  const { data, error } = await supabase
    .from("practices")
    .select("id, slug, title, tradition, category, duration_min, summary, steps")
    .order("tradition")
    .order("title");
  if (error) throw error;
  return (data ?? []) as Practice[];
}

export async function fetchReadings(): Promise<Reading[]> {
  const { data, error } = await supabase
    .from("readings")
    .select("id, tradition, title, source, body");
  if (error) throw error;
  return (data ?? []) as Reading[];
}

export async function fetchObservances(): Promise<Observance[]> {
  const { data, error } = await supabase
    .from("observances")
    .select("id, name, tradition, observed_on, description, fasting")
    .order("observed_on");
  if (error) throw error;
  return (data ?? []) as Observance[];
}

export type CompletionState = {
  todayIds: Set<string>;
  totals: Map<string, number>;
  streak: number;
  totalDays: number;
};

/** Consecutive days of practice, counting back from today (or yesterday). */
export function streakFromDates(dates: string[]): number {
  const set = new Set(dates);
  const cursor = new Date();
  if (!set.has(cursor.toISOString().slice(0, 10))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (set.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export async function fetchCompletions(): Promise<CompletionState> {
  const uid = await currentUserId();
  const empty: CompletionState = {
    todayIds: new Set(),
    totals: new Map(),
    streak: 0,
    totalDays: 0,
  };
  if (!uid) return empty;
  const { data } = await supabase
    .from("practice_completions")
    .select("practice_id, completed_on")
    .eq("user_id", uid)
    .order("completed_on", { ascending: false })
    .limit(500);
  const rows = (data ?? []) as { practice_id: string; completed_on: string }[];
  const today = todayISO();
  const totals = new Map<string, number>();
  for (const r of rows) totals.set(r.practice_id, (totals.get(r.practice_id) ?? 0) + 1);
  const days = [...new Set(rows.map((r) => r.completed_on))];
  return {
    todayIds: new Set(rows.filter((r) => r.completed_on === today).map((r) => r.practice_id)),
    totals,
    streak: streakFromDates(days),
    totalDays: days.length,
  };
}

export async function toggleCompletion(practiceId: string, done: boolean, durationMin?: number) {
  const uid = await currentUserId();
  if (!uid) return;
  if (done) {
    await supabase
      .from("practice_completions")
      .delete()
      .eq("user_id", uid)
      .eq("practice_id", practiceId)
      .eq("completed_on", todayISO());
  } else {
    await supabase
      .from("practice_completions")
      .insert({ user_id: uid, practice_id: practiceId, completed_on: todayISO() });
    // A completed sitting earns Path Tokens; repeats the same day taper away.
    const { award, TOKEN_VALUE } = await import("@/lib/path");
    const deep = (durationMin ?? 0) >= 20;
    return award("practice", deep ? TOKEN_VALUE.deepPractice : TOKEN_VALUE.practice, practiceId);
  }
  return 0;
}

export async function fetchFastingLogs(): Promise<FastingLog[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("fasting_logs")
    .select("id, observance_id, label, started_at, ended_at")
    .eq("user_id", uid)
    .order("started_at", { ascending: false })
    .limit(50);
  return (data ?? []) as FastingLog[];
}

export async function startFast(label: string, observanceId: string | null) {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase.from("fasting_logs").insert({ user_id: uid, label, observance_id: observanceId });
}

export async function endFast(id: string) {
  await supabase.from("fasting_logs").update({ ended_at: new Date().toISOString() }).eq("id", id);
}
