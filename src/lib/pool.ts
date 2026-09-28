import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";
import type { PlatformConfig } from "@/lib/config";

/* ---------------------------------------------------------- creator pool ---
 * A bonus, not a payment mechanism. Creators are paid directly by members;
 * the pool is a share of EKA's own revenue, distributed periodically by
 * Creator Score. Raw views count for nothing.
 * -------------------------------------------------------------------------- */

export const POOL_EXPLAINER =
  "A portion of EKA's platform revenue is periodically distributed to eligible creators based on Creator Score. It is a bonus on top of what members pay you — never a substitute for it.";

export type PoolPeriod = {
  id: string;
  period: string;
  pool_cents: number;
  currency: string;
  funding_source: string;
  status: "draft" | "preview" | "published";
  published_at: string | null;
  created_at: string;
};

export type PoolAllocation = {
  id: string;
  period_id: string;
  creator_id: string;
  score: number;
  share: number;
  amount_cents: number;
  status: "preview" | "published" | "paid";
};

export type ScoreEvent = {
  id: string;
  user_id: string;
  component: "quality" | "completion" | "trust" | "cross";
  delta: number;
  reason: string;
  created_at: string;
};

export async function fetchPoolPeriods(): Promise<PoolPeriod[]> {
  const { data } = await supabase
    .from("creator_pool_periods")
    .select("*")
    .order("period", { ascending: false })
    .limit(24);
  return (data ?? []) as PoolPeriod[];
}

export async function fetchAllocations(periodId: string): Promise<PoolAllocation[]> {
  const { data } = await supabase
    .from("pool_allocations")
    .select("*")
    .eq("period_id", periodId)
    .order("amount_cents", { ascending: false });
  return (data ?? []) as PoolAllocation[];
}

export async function fetchMyAllocations(): Promise<PoolAllocation[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("pool_allocations")
    .select("*")
    .eq("creator_id", uid)
    .neq("status", "preview")
    .order("created_at", { ascending: false });
  return (data ?? []) as PoolAllocation[];
}

export async function fetchMyScoreEvents(): Promise<ScoreEvent[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("creator_score_events")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false })
    .limit(12);
  return (data ?? []) as ScoreEvent[];
}

export async function createPeriod(period: string, poolCents: number, fundingSource: string) {
  const uid = await currentUserId();
  const { error } = await supabase.from("creator_pool_periods").insert({
    period,
    pool_cents: poolCents,
    funding_source: fundingSource,
    created_by: uid,
  });
  return { error };
}

type ScoreRow = {
  user_id: string;
  score: number;
  completion: number;
  saves: number;
  reactions: number;
  cross_tradition: number;
  live_attendance: number;
  penalties: number;
};

/** Weighted score out of 1000, using whatever weights the admin has configured. */
export function weightedScore(row: ScoreRow, config: PlatformConfig) {
  const components: Record<string, number> = {
    quality: Math.min(100, row.reactions + row.saves),
    completion: Math.min(100, row.completion),
    trust: Math.max(0, 100 - row.penalties),
    cross: Math.min(100, row.cross_tradition),
  };
  const total = config.weights.reduce((n, w) => n + (components[w.key] ?? 0) * w.percent, 0);
  return Math.round(total / 10);
}

/** Preview a distribution: every eligible creator's share by Creator Score. */
export async function previewDistribution(periodId: string, config: PlatformConfig) {
  const period = (
    await supabase.from("creator_pool_periods").select("*").eq("id", periodId).maybeSingle()
  ).data as PoolPeriod | null;
  if (!period) return { error: new Error("No such period") };

  const { data: scores } = await supabase.from("creator_scores").select("*");
  const rows = (scores ?? []) as ScoreRow[];
  const scored = rows
    .map((r) => ({ creator_id: r.user_id, score: weightedScore(r, config) }))
    .filter((r) => r.score > 0);
  const totalScore = scored.reduce((n, r) => n + r.score, 0);
  if (!totalScore) return { error: new Error("No eligible creators for this period yet.") };

  await supabase.from("pool_allocations").delete().eq("period_id", periodId);
  const { error } = await supabase.from("pool_allocations").insert(
    scored.map((r) => ({
      period_id: periodId,
      creator_id: r.creator_id,
      score: r.score,
      share: Number((r.score / totalScore).toFixed(6)),
      amount_cents: Math.round((period.pool_cents * r.score) / totalScore),
      status: "preview" as const,
    })),
  );
  if (!error)
    await supabase.from("creator_pool_periods").update({ status: "preview" }).eq("id", periodId);
  return { error };
}

export async function publishDistribution(periodId: string) {
  const { error } = await supabase
    .from("pool_allocations")
    .update({ status: "published" })
    .eq("period_id", periodId);
  if (error) return { error };
  const { error: e2 } = await supabase
    .from("creator_pool_periods")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", periodId);
  return { error: e2 };
}
