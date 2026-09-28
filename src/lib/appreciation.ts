import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";

/* ------------------------------------------------------------ appreciation ---
 * Value on EKA is earned, never bought. Weights live in the database so no
 * client can mint appreciation, and the reward split is always a share of a
 * pool rather than a per-view payout.
 * -------------------------------------------------------------------------- */

export type Appreciation = {
  points: number;
  people: number;
  by_reaction: Record<string, number>;
  cross_tradition: number;
  contributions: number;
  knowledge_links: number;
};

const EMPTY: Appreciation = {
  points: 0,
  people: 0,
  by_reaction: {},
  cross_tradition: 0,
  contributions: 0,
  knowledge_links: 0,
};

export async function fetchAppreciation(userId?: string): Promise<Appreciation> {
  const uid = userId ?? (await currentUserId());
  if (!uid) return EMPTY;
  const { data, error } = await supabase.rpc("creator_appreciation", { _user_id: uid });
  if (error) throw error;
  return { ...EMPTY, ...((data ?? {}) as Partial<Appreciation>) };
}

export type Standing = {
  creator_id: string;
  display_name: string | null;
  username: string | null;
  points: number;
  people: number;
  cross_tradition: number;
};

export async function fetchStandings(): Promise<Standing[]> {
  const { data, error } = await supabase.rpc("appreciation_standings");
  if (error) throw error;
  return (data ?? []) as Standing[];
}

export type SimulatedShare = {
  creator_id: string;
  display_name: string | null;
  username: string | null;
  points: number;
  share: number;
  amount_cents: number;
};

/** What a creator would receive if this pool were distributed by appreciation today. */
export async function simulateCreatorValue(poolCents: number): Promise<SimulatedShare[]> {
  const { data, error } = await supabase.rpc("creator_value_simulation", {
    _pool_cents: poolCents,
  });
  if (error) throw error;
  return (data ?? []) as SimulatedShare[];
}
