import { supabase } from "@/integrations/supabase/client";

/* --------------------------------------------------------- platform config --
 * Everything about EKA's economics that a person — not a deploy — should be
 * able to change: the fee, how the fee is spent, how a Creator Score is
 * weighted, when a payout gets a second pair of eyes. The code defaults below
 * are the same numbers the database is seeded with, so a missing row degrades
 * to today's behaviour rather than to zero.
 * -------------------------------------------------------------------------- */

export type Bucket = { key: string; percent: number; body: string };
export type Weight = {
  key: "quality" | "completion" | "trust" | "cross";
  label: string;
  percent: number;
  detail: string;
};

export type PlatformConfig = {
  feePercent: number;
  allocation: Bucket[];
  weights: Weight[];
  payoutReviewThresholdCents: number;
  payoutHoldbackDays: number;
  poolFundingPercent: number;
};

export const DEFAULT_CONFIG: PlatformConfig = {
  feePercent: 10,
  allocation: [
    {
      key: "Platform operations",
      percent: 45,
      body: "Hosting, delivery, payments and the people who keep EKA running.",
    },
    { key: "Trust & Safety", percent: 20, body: "Human review, appeals and the moderation queue." },
    {
      key: "Peace & Knowledge Fund",
      percent: 20,
      body: "Interfaith education, cultural preservation, minority-language work.",
    },
    { key: "Community projects", percent: 15, body: "Grants to circles doing real-world work." },
  ],
  weights: [
    {
      key: "quality",
      label: "Quality",
      percent: 35,
      detail: "Member ratings, meaningful feedback, people who come back.",
    },
    {
      key: "completion",
      label: "Completion",
      percent: 25,
      detail: "Sessions actually completed, low cancellation, reliable delivery.",
    },
    {
      key: "trust",
      label: "Trust",
      percent: 20,
      detail: "Verified identity and credentials, community conduct, few upheld complaints.",
    },
    {
      key: "cross",
      label: "Cross-community reach",
      percent: 20,
      detail: "Helping people meet other traditions, and contributing constructively there.",
    },
  ],
  payoutReviewThresholdCents: 500_000,
  payoutHoldbackDays: 7,
  poolFundingPercent: 0,
};

export type ConfigRow = {
  key: string;
  value: unknown;
  label: string;
  description: string;
  updated_at: string;
};

export const CONFIG_QUERY_KEY = ["platform-config"] as const;

export async function fetchConfigRows(): Promise<ConfigRow[]> {
  const { data } = await supabase
    .from("platform_config")
    .select("key, value, label, description, updated_at")
    .order("key");
  return (data ?? []) as ConfigRow[];
}

const num = (v: unknown, fallback: number) =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;

export function configFromRows(rows: ConfigRow[]): PlatformConfig {
  const by = new Map(rows.map((r) => [r.key, r.value]));
  const allocation = by.get("fee_allocation");
  const weights = by.get("score_weights");
  return {
    feePercent: num(by.get("platform_fee_percent"), DEFAULT_CONFIG.feePercent),
    allocation:
      Array.isArray(allocation) && allocation.length
        ? (allocation as Bucket[])
        : DEFAULT_CONFIG.allocation,
    weights:
      Array.isArray(weights) && weights.length ? (weights as Weight[]) : DEFAULT_CONFIG.weights,
    payoutReviewThresholdCents: num(
      by.get("payout_review_threshold_cents"),
      DEFAULT_CONFIG.payoutReviewThresholdCents,
    ),
    payoutHoldbackDays: num(by.get("payout_holdback_days"), DEFAULT_CONFIG.payoutHoldbackDays),
    poolFundingPercent: num(
      by.get("pool_funding_percent_of_profit"),
      DEFAULT_CONFIG.poolFundingPercent,
    ),
  };
}

export async function fetchConfig(): Promise<PlatformConfig> {
  return configFromRows(await fetchConfigRows());
}

export async function saveConfig(key: string, value: unknown) {
  const { error } = await supabase
    .from("platform_config")
    .update({ value: value as never })
    .eq("key", key);
  return { error };
}

export type ConfigChange = {
  id: string;
  key: string;
  old_value: unknown;
  new_value: unknown;
  changed_by: string | null;
  created_at: string;
};

export async function fetchConfigChanges(): Promise<ConfigChange[]> {
  const { data } = await supabase
    .from("platform_config_changes")
    .select("id, key, old_value, new_value, changed_by, created_at")
    .order("created_at", { ascending: false })
    .limit(30);
  return (data ?? []) as ConfigChange[];
}

/** Percentages that must add to 100 before they are worth saving. */
export function totalsTo100(items: { percent: number }[]) {
  return items.reduce((n, i) => n + Number(i.percent || 0), 0) === 100;
}
