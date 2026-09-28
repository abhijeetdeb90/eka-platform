import { supabase } from "@/integrations/supabase/client";

/* --------------------------------------------------------- the north star ---
 * EKA does not measure time-on-app. It measures Meaningful Spiritual Days:
 * a day on which a member touched at least two of the four pillars. Retention
 * and Journey completion sit beside it as the only other numbers that matter.
 * -------------------------------------------------------------------------- */

export type MsdDay = { day: string; members: number; actions: number };
export type Cohort = { cohort: string; signups: number; d7: number; d30: number };
export type JourneyStat = {
  journey: string;
  duration_days: number;
  enrolled: number;
  completed: number;
};

export async function fetchMeaningfulDays(days = 30): Promise<MsdDay[]> {
  const { data, error } = await supabase.rpc("meaningful_spiritual_days", { _days: days });
  if (error) return [];
  return (data ?? []) as MsdDay[];
}

export async function fetchRetention(weeks = 8): Promise<Cohort[]> {
  const { data, error } = await supabase.rpc("retention_cohorts", { _weeks: weeks });
  if (error) return [];
  return (data ?? []) as Cohort[];
}

export async function fetchJourneyCompletion(): Promise<JourneyStat[]> {
  const { data, error } = await supabase.rpc("journey_completion_stats");
  if (error) return [];
  return (data ?? []) as JourneyStat[];
}

export function percent(part: number, whole: number) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

/** A 7-day trailing average smooths weekday rhythm out of the north star. */
export function trailingAverage(rows: MsdDay[], window = 7) {
  const recent = rows.slice(-window);
  if (recent.length === 0) return 0;
  return Math.round(recent.reduce((n, r) => n + r.members, 0) / recent.length);
}
