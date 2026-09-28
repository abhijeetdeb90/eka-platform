import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";

/* -------------------------------------------------------------- payouts ----
 * A creator asks for money they have already earned. Nothing is minted here:
 * the available balance and every state change are computed in the database,
 * so the client can only ask, never decide.
 * -------------------------------------------------------------------------- */

export type PayoutStatus = "pending" | "approved" | "rejected" | "paid" | "refunded";

export type PayoutRequest = {
  id: string;
  creator_id: string;
  amount_cents: number;
  currency: string;
  status: PayoutStatus;
  risk_flags: string[];
  note: string | null;
  review_note: string | null;
  reviewed_at: string | null;
  paid_at: string | null;
  created_at: string;
};

export const PAYOUT_REVIEW_COPY =
  "For security and community protection, larger payouts may receive additional review before release.";

export const STATUS_COPY: Record<PayoutStatus, string> = {
  pending: "Waiting to be reviewed",
  approved: "Approved — being released",
  rejected: "Not approved",
  paid: "Released",
  refunded: "Returned to your balance",
};

export const RISK_COPY: Record<string, string> = {
  large_amount: "Above the review threshold",
  identity_unverified: "Identity not yet verified",
  active_restriction: "Account has an active restriction",
  repeat_request_24h: "Another request in the last 24 hours",
};

export async function fetchAvailableCents(): Promise<number> {
  const uid = await currentUserId();
  if (!uid) return 0;
  const { data } = await supabase.rpc("available_payout_cents", { _uid: uid });
  return typeof data === "number" ? data : 0;
}

export async function fetchMyPayouts(): Promise<PayoutRequest[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("payout_requests")
    .select("*")
    .eq("creator_id", uid)
    .order("created_at", { ascending: false });
  return (data ?? []) as PayoutRequest[];
}

export async function fetchAllPayouts(): Promise<PayoutRequest[]> {
  const { data } = await supabase
    .from("payout_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  return (data ?? []) as PayoutRequest[];
}

export async function requestPayout(amountCents: number, note?: string) {
  const { error } = await supabase.rpc("request_payout", {
    _amount_cents: amountCents,
    ...(note ? { _note: note } : {}),
  });
  return { error };
}

export async function reviewPayout(
  id: string,
  status: Exclude<PayoutStatus, "pending">,
  note?: string,
) {
  const { error } = await supabase.rpc("review_payout", {
    _id: id,
    _status: status,
    ...(note ? { _note: note } : {}),
  });
  return { error };
}

/* ------------------------------------------------------ earnings by source */

export type EarningsSource = { key: string; label: string; cents: number };

const SOURCE_LABEL: Record<string, string> = {
  booking: "Sessions & packages",
  episode: "Episodes & webinars",
  membership: "Creator memberships",
  gratitude: "Gratitude offered",
  tip: "Gratitude offered",
  pool: "Creator Pool",
};

export async function fetchEarningsBySource(): Promise<{
  sources: EarningsSource[];
  earnedCents: number;
  feesCents: number;
}> {
  const uid = await currentUserId();
  if (!uid) return { sources: [], earnedCents: 0, feesCents: 0 };
  const { data } = await supabase
    .from("wallet_transactions")
    .select("kind, amount_cents, fee_cents, reference_kind")
    .eq("user_id", uid)
    .gt("amount_cents", 0);

  const rows = data ?? [];
  const totals = new Map<string, number>();
  let earnedCents = 0;
  let feesCents = 0;

  for (const r of rows) {
    if (r.kind === "topup") continue;
    const key = (r.reference_kind ?? r.kind ?? "other") as string;
    const net = (r.amount_cents ?? 0) - (r.fee_cents ?? 0);
    totals.set(key, (totals.get(key) ?? 0) + net);
    earnedCents += net;
    feesCents += r.fee_cents ?? 0;
  }

  const sources = [...totals.entries()]
    .map(([key, cents]) => ({ key, label: SOURCE_LABEL[key] ?? "Other earnings", cents }))
    .sort((a, b) => b.cents - a.cents);

  return { sources, earnedCents, feesCents };
}
