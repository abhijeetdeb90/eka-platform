import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";
import { formatINR } from "@/lib/billing";

/* ------------------------------------------------------------ the model ----
 * One sentence: the member pays, EKA takes 10%, everything else is the
 * creator's. EKA then allocates its own 10% internally. Nothing else is taken
 * out of a creator's money, and the fee is always shown before payment.
 *
 *   MEMBER ─ ₹1,000 service ─▶ CHECKOUT ─┬─ ₹100 EKA platform fee
 *                                        └─ ₹1,000 creator earnings
 * -------------------------------------------------------------------------- */

export const PLATFORM_FEE_PERCENT = 10;

export const GRATITUDE_TIERS = [10000, 25000, 50000] as const;
/** @deprecated Kept for older call sites; use GRATITUDE_TIERS. */
export const TIP_TIERS = GRATITUDE_TIERS;

/**
 * Two honest ways to show the same 10%:
 *  - "added"     the creator names what they receive and the fee sits on top
 *                (services, packages, paid conversations, episodes).
 *  - "inclusive" the member sees one round price and the fee comes out of it
 *                (creator memberships, gratitude).
 * Either way the arithmetic is on screen before anyone pays.
 */
export type FeeMode = "added" | "inclusive";

export const FEE_MODE = {
  service: "added",
  episode: "added",
  membership: "inclusive",
  gratitude: "inclusive",
} as const satisfies Record<string, FeeMode>;

export type Checkout = { creator: number; fee: number; total: number; mode: FeeMode };

export function checkout(listCents: number, mode: FeeMode = "added"): Checkout {
  if (mode === "added") {
    const fee = Math.round((listCents * PLATFORM_FEE_PERCENT) / 100);
    return { creator: listCents, fee, total: listCents + fee, mode };
  }
  const fee = Math.round((listCents * PLATFORM_FEE_PERCENT) / 100);
  return { creator: listCents - fee, fee, total: listCents, mode };
}

/** Fee taken out of an amount already collected (gratitude, memberships). */
export function feeFor(amountCents: number) {
  const { fee, creator } = checkout(amountCents, "inclusive");
  return { fee, creator };
}

export { formatINR };

export type Wallet = { user_id: string; balance_cents: number; currency: string };

export type WalletTxn = {
  id: string;
  kind: string;
  amount_cents: number;
  fee_cents: number;
  counterparty_id: string | null;
  reference_kind: string | null;
  reference_id: string | null;
  status: string;
  note: string | null;
  created_at: string;
  user_id: string;
};

export const TXN_LABEL: Record<string, string> = {
  topup: "Added to wallet",
  tip: "Tip to a creator",
  tip_received: "Tip received",
  purchase: "Paid session or episode",
  sale: "Earned from a session",
  donation: "Donation",
  payout: "Payout",
  fund_grant: "Peace & Knowledge Fund",
};

export async function fetchWallet(): Promise<Wallet | null> {
  const uid = await currentUserId();
  if (!uid) return null;
  const { data } = await supabase
    .from("wallets")
    .select("user_id, balance_cents, currency")
    .eq("user_id", uid)
    .maybeSingle();
  if (data) return data as Wallet;
  const { data: created } = await supabase
    .from("wallets")
    .insert({ user_id: uid })
    .select("user_id, balance_cents, currency")
    .maybeSingle();
  return (created as Wallet) ?? null;
}

export async function fetchTransactions(): Promise<WalletTxn[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("wallet_transactions")
    .select(
      "id, kind, amount_cents, fee_cents, counterparty_id, reference_kind, reference_id, status, note, created_at, user_id",
    )
    .or(`user_id.eq.${uid},counterparty_id.eq.${uid}`)
    .order("created_at", { ascending: false })
    .limit(100);
  return (data ?? []) as WalletTxn[];
}

async function adjustBalance(uid: string, deltaCents: number) {
  const { data } = await supabase
    .from("wallets")
    .select("balance_cents")
    .eq("user_id", uid)
    .maybeSingle();
  const current = data?.balance_cents ?? 0;
  await supabase
    .from("wallets")
    .upsert(
      { user_id: uid, balance_cents: current + deltaCents, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
}

/**
 * Ledger-first. Every movement is a row before any balance changes, so when a
 * real payment provider is connected only the charge call has to be swapped in.
 */
export async function topUp(amountCents: number) {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase.from("wallet_transactions").insert({
    user_id: uid,
    kind: "topup",
    amount_cents: amountCents,
    status: "settled",
    note: "Test payment path — no card charged yet.",
  });
  await adjustBalance(uid, amountCents);
}

export async function payCreator(input: {
  creatorId: string;
  amountCents: number;
  kind: "tip" | "purchase" | "donation";
  /** "added": amountCents is the creator's price and the fee sits on top. */
  mode?: FeeMode;
  referenceKind?: string;
  referenceId?: string;
  note?: string;
}) {
  const uid = await currentUserId();
  if (!uid) throw new Error("Sign in first.");
  const wallet = await fetchWallet();
  const { fee, creator, total } = checkout(input.amountCents, input.mode ?? "inclusive");
  if ((wallet?.balance_cents ?? 0) < total)
    throw new Error("Not enough in your wallet. Add funds first.");

  await supabase.from("wallet_transactions").insert([
    {
      user_id: uid,
      counterparty_id: input.creatorId,
      kind: input.kind,
      amount_cents: -total,
      fee_cents: fee,
      reference_kind: input.referenceKind ?? null,
      reference_id: input.referenceId ?? null,
      note: input.note ?? null,
    },
    {
      user_id: input.creatorId,
      counterparty_id: uid,
      kind: input.kind === "tip" ? "tip_received" : "sale",
      amount_cents: creator,
      fee_cents: fee,
      reference_kind: input.referenceKind ?? null,
      reference_id: input.referenceId ?? null,
      note: input.note ?? null,
    },
  ]);
  // The ledger of record: allocations are computed server-side from the
  // economic model in force right now, and the row can never be edited.
  await supabase.rpc("record_ledger_entry", {
    _creator_id: input.creatorId,
    _member_id: uid,
    _gross_creator_amount: creator,
    _eka_gross_fee: fee,
    _transaction_ref: input.referenceKind
      ? `${input.referenceKind}:${input.referenceId ?? ""}`
      : input.kind,
    _currency: wallet?.currency ?? "INR",
    _note: input.note ?? "",
  });

  await adjustBalance(uid, -total);
  await adjustBalance(input.creatorId, creator);
  return { fee, creator, total };
}

export async function buyEpisode(episodeId: string, creatorId: string, priceCents: number) {
  const { total } = await payCreator({
    creatorId,
    amountCents: priceCents,
    kind: "purchase",
    mode: "added",
    referenceKind: "episode",
    referenceId: episodeId,
  });
  const uid = await currentUserId();
  if (!uid) return;
  await supabase
    .from("episode_purchases")
    .insert({ episode_id: episodeId, user_id: uid, amount_cents: total });
}

export type CreatorScore = {
  user_id: string;
  score: number;
  completion: number;
  saves: number;
  reactions: number;
  cross_tradition: number;
  live_attendance: number;
  penalties: number;
};

/**
 * Creator Score, out of 1,000. Raw views, likes and follower counts are absent
 * on purpose: nobody should earn more here for learning to manufacture a viral
 * reel.
 */
export const SCORE_WEIGHTS = [
  {
    key: "quality" as const,
    label: "Quality",
    percent: 35,
    detail: "Member ratings, meaningful feedback, people who come back.",
  },
  {
    key: "completion" as const,
    label: "Completion",
    percent: 25,
    detail: "Sessions actually completed, low cancellation, reliable delivery.",
  },
  {
    key: "trust" as const,
    label: "Trust",
    percent: 20,
    detail: "Verified identity and credentials, community conduct, few upheld complaints.",
  },
  {
    key: "cross" as const,
    label: "Cross-community reach",
    percent: 20,
    detail: "Helping people meet other traditions, and contributing constructively there.",
  },
] as const;

/** @deprecated Older signal list; the four weighted components are the model. */
export const SCORE_SIGNALS = SCORE_WEIGHTS.map((w) => ({
  label: w.label,
  detail: w.detail,
  weight: `${w.percent}%`,
}));

export type ScoreBreakdown = {
  total: number;
  parts: { key: string; label: string; percent: number; value: number; detail: string }[];
};

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/**
 * Turn the raw signals EKA already records into the four published components.
 * Each is expressed out of 100 so a creator can see which part to work on.
 */
export function scoreBreakdown(row: CreatorScore | null): ScoreBreakdown {
  const s = row ?? {
    score: 0,
    completion: 0,
    saves: 0,
    reactions: 0,
    cross_tradition: 0,
    live_attendance: 0,
    penalties: 0,
    user_id: "",
  };
  const values = {
    quality: clamp((s.saves * 3 + s.reactions * 2) / 4),
    completion: clamp(s.completion),
    trust: clamp(100 - s.penalties * 10),
    cross: clamp(s.cross_tradition * 2 + s.live_attendance),
  };
  const parts = SCORE_WEIGHTS.map((w) => ({
    key: w.key,
    label: w.label,
    percent: w.percent,
    value: values[w.key],
    detail: w.detail,
  }));
  const total = Math.round(parts.reduce((n, p) => n + (p.value / 100) * p.percent * 10, 0));
  return { total, parts };
}

export async function fetchMyScore(): Promise<CreatorScore | null> {
  const uid = await currentUserId();
  if (!uid) return null;
  const { data } = await supabase
    .from("creator_scores")
    .select(
      "user_id, score, completion, saves, reactions, cross_tradition, live_attendance, penalties",
    )
    .eq("user_id", uid)
    .maybeSingle();
  return (data as CreatorScore) ?? null;
}

export type FundAllocation = {
  id: string;
  period: string;
  category: string;
  pool_cents: number;
  amount_cents: number;
  status: string;
  creator_id: string | null;
};

/**
 * How EKA spends its own 10% — not a split of the creator's money. Every line
 * here is a percentage of the fee, so ₹100 of fee on a ₹1,000 service becomes
 * ₹45 operations, ₹20 trust, ₹20 peace, ₹15 community.
 */
export const FEE_ALLOCATION = [
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
] as const;

/** @deprecated The old "55% creator revenue pool" framing. Use FEE_ALLOCATION. */
export const FUND_SPLIT = FEE_ALLOCATION;

/**
 * The Creator Pool is a bonus, never the payment mechanism. It is funded from
 * EKA's profit plus a targeted growth budget — not by holding back a slice of
 * anyone's earnings — and shared out on Creator Score.
 */
export const CREATOR_POOL = {
  fundedBy: "A share of EKA's profit, plus a growth budget set each quarter.",
  note: "A portion of EKA's platform revenue is periodically distributed to eligible creators based on Creator Score.",
  cadence: "monthly",
};

export function poolShare(myScore: number, totalScore: number, poolCents: number) {
  if (totalScore <= 0 || myScore <= 0) return { share: 0, amount: 0 };
  const share = myScore / totalScore;
  return { share, amount: Math.round(poolCents * share) };
}

export async function fetchFund(): Promise<FundAllocation[]> {
  const { data } = await supabase
    .from("fund_allocations")
    .select("id, period, category, pool_cents, amount_cents, status, creator_id")
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []) as FundAllocation[];
}

/**
 * Payout review. Not a punishment and not a judgement of the creator: larger
 * payouts get a second pair of eyes so fraud, refund abuse and account
 * takeovers do not reach the community. A crude threshold today, risk-based
 * later.
 */
export const HUMAN_REVIEW_THRESHOLD_CENTS = 500_000;

export const PAYOUT_REVIEW_COPY =
  "For security and community protection, larger payouts may receive additional review before release.";
