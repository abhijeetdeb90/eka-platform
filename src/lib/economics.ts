import { supabase } from "@/integrations/supabase/client";
import { ratio } from "@/lib/money";

/* -------------------------------------------------------------- economics --
 * One source of truth. Every number on the founder dashboard comes from the
 * database function `eka_economics`, which reads the append-only ledger and
 * the private finance records and refuses to answer anyone who is not an
 * admin. Nothing below re-derives revenue, profit or retained earnings from
 * raw rows in the browser; the helpers here only present what the server said.
 * -------------------------------------------------------------------------- */

export type Economics = {
  from: string;
  to: string;
  gmv: number;
  gross_revenue: number;
  refunds: number;
  chargebacks: number;
  processing_costs: number;
  net_revenue: number;
  transactions: number;
  active_creators: number;
  paying_members: number;
  budget: {
    operations: number;
    trust_safety: number;
    peace_knowledge: number;
    community: number;
    retained: number;
  };
  actual_costs: {
    operations: number;
    trust_safety: number;
    peace_knowledge: number;
    community: number;
  };
  operating_expenses: number;
  mission_spend: number;
  mission_committed: number;
  operating_profit: number;
  creator_pool: number;
  founder_compensation: number;
  founder_compensation_paid: number;
  owner_distributions: number;
  owner_distributions_paid: number;
  reinvestment: number;
  retained_earnings: number;
  creator_earned: number;
  creator_paid: number;
  creator_pending_payouts: number;
  creator_liability: number;
  cash_balance: number;
  cash_connected: boolean;
  top10_creator_fees: number;
  by_category: { category: string; gmv: number; fees: number; transactions: number }[];
  config: Record<string, unknown>;
};

export type MonthRow = { period: string; data: Economics };

export const ISO = (d: Date) => d.toISOString().slice(0, 10);

export type RangeKey = "current" | "previous" | "3m" | "12m" | "custom";

export const RANGE_LABEL: Record<RangeKey, string> = {
  current: "Current month",
  previous: "Previous month",
  "3m": "Last 3 months",
  "12m": "Last 12 months",
  custom: "Custom range",
};

export function rangeFor(key: RangeKey, custom?: { from: string; to: string }) {
  const now = new Date();
  const startOfMonth = (offset: number) =>
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, 1));
  const endOfMonth = (offset: number) =>
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset + 1, 0));
  switch (key) {
    case "previous":
      return { from: ISO(startOfMonth(-1)), to: ISO(endOfMonth(-1)) };
    case "3m":
      return { from: ISO(startOfMonth(-2)), to: ISO(endOfMonth(0)) };
    case "12m":
      return { from: ISO(startOfMonth(-11)), to: ISO(endOfMonth(0)) };
    case "custom":
      return custom ?? { from: ISO(startOfMonth(0)), to: ISO(endOfMonth(0)) };
    default:
      return { from: ISO(startOfMonth(0)), to: ISO(endOfMonth(0)) };
  }
}

/** The same window, one period earlier — used for "vs previous period". */
export function priorRange(from: string, to: string) {
  const a = new Date(from);
  const b = new Date(to);
  const days = Math.max(1, Math.round((b.getTime() - a.getTime()) / 86_400_000) + 1);
  const prevTo = new Date(a.getTime() - 86_400_000);
  const prevFrom = new Date(prevTo.getTime() - (days - 1) * 86_400_000);
  return { from: ISO(prevFrom), to: ISO(prevTo) };
}

export async function fetchEconomics(from: string, to: string): Promise<Economics> {
  const { data, error } = await supabase.rpc("eka_economics", { _from: from, _to: to });
  if (error) throw error;
  return data as unknown as Economics;
}

export async function fetchEconomicsMonths(months = 12): Promise<MonthRow[]> {
  const { data, error } = await supabase.rpc("eka_economics_months", { _months: months });
  if (error) throw error;
  return ((data ?? []) as { period: string; data: unknown }[]).map((r) => ({
    period: r.period,
    data: r.data as Economics,
  }));
}

/* ------------------------------------------------------------- config keys */

export const num = (config: Record<string, unknown>, key: string, fallback: number) => {
  const v = config?.[key];
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
};

export function thresholds(config: Record<string, unknown>) {
  return {
    feePercent: num(config, "platform_fee_percent", 10),
    poolPercentOfProfit: num(config, "creator_pool_percent_of_operating_profit", 10),
    poolEnabled: config?.["creator_pool_enabled"] !== false,
    variableCostPerTxn: num(config, "variable_cost_per_transaction_cents", 0),
    minOperatingMargin: num(config, "alert_min_operating_margin", 15),
    minContributionMargin: num(config, "alert_min_contribution_margin", 70),
    maxRefundRate: num(config, "alert_max_refund_rate", 5),
    maxChargebackRate: num(config, "alert_max_chargeback_rate", 1),
    maxConcentration: num(config, "alert_max_revenue_concentration", 40),
    reserveMonths: num(config, "reserve_months_of_costs", 3),
    targetGmv: num(config, "target_monthly_gmv_cents", 0),
    targetRevenue: num(config, "target_monthly_revenue_cents", 0),
    targetProfit: num(config, "target_monthly_profit_cents", 0),
    targetMargin: num(config, "target_operating_margin_percent", 25),
  };
}

/* ---------------------------------------------------------- derived reads */

export type Derived = {
  takeRate: number | null;
  averageTransaction: number | null;
  revenuePerTransaction: number | null;
  operatingMargin: number | null;
  variableCosts: number;
  contributionProfit: number;
  contributionMargin: number | null;
  refundRate: number | null;
  chargebackRate: number | null;
  concentration: number | null;
  revenuePerCreator: number | null;
  payoutRatio: number | null;
  breakEvenTransactions: number | null;
  breakEvenGmv: number | null;
};

export function derive(e: Economics): Derived {
  const t = thresholds(e.config ?? {});
  const txns = e.transactions;
  const variableCosts = e.processing_costs + t.variableCostPerTxn * txns;
  const contributionProfit = e.net_revenue - variableCosts;
  const contributionPerTxn = txns ? contributionProfit / txns : 0;
  const avgTxn = txns ? e.gmv / txns : null;
  const fixedCosts = e.operating_expenses;
  const breakEvenTransactions =
    contributionPerTxn > 0 && fixedCosts > 0 ? Math.ceil(fixedCosts / contributionPerTxn) : null;
  return {
    takeRate: ratio(e.gross_revenue, e.gmv),
    averageTransaction: avgTxn,
    revenuePerTransaction: txns ? e.net_revenue / txns : null,
    operatingMargin: ratio(e.operating_profit, e.net_revenue),
    variableCosts,
    contributionProfit,
    contributionMargin: ratio(contributionProfit, e.net_revenue),
    refundRate: ratio(e.refunds, e.gmv),
    chargebackRate: ratio(e.chargebacks, e.gmv),
    concentration: ratio(e.top10_creator_fees, e.gross_revenue),
    revenuePerCreator: e.active_creators ? e.net_revenue / e.active_creators : null,
    payoutRatio: ratio(e.gmv, e.gmv + e.gross_revenue),
    breakEvenTransactions,
    breakEvenGmv:
      breakEvenTransactions && avgTxn ? Math.round(breakEvenTransactions * avgTxn) : null,
  };
}

/* ------------------------------------------------------------ alerts */

export type Alert = { tone: "warn" | "good"; text: string };

export function alertsFor(e: Economics, prev?: Economics): Alert[] {
  const t = thresholds(e.config ?? {});
  const d = derive(e);
  const out: Alert[] = [];

  if (e.transactions === 0) return out;

  if (e.operating_profit < 0)
    out.push({
      tone: "warn",
      text: "Operating profit is negative for this period. Review recorded costs before any distribution.",
    });
  if (
    d.operatingMargin !== null &&
    d.operatingMargin < t.minOperatingMargin &&
    e.operating_profit >= 0
  )
    out.push({
      tone: "warn",
      text: `Operating margin fell to ${d.operatingMargin.toFixed(1)}%, below your ${t.minOperatingMargin}% target.`,
    });
  if (d.contributionMargin !== null && d.contributionMargin < t.minContributionMargin)
    out.push({
      tone: "warn",
      text: `Contribution margin is ${d.contributionMargin.toFixed(1)}%, below your ${t.minContributionMargin}% target.`,
    });
  if (d.refundRate !== null && d.refundRate > t.maxRefundRate)
    out.push({
      tone: "warn",
      text: `Refunds are ${d.refundRate.toFixed(1)}% of GMV, above your ${t.maxRefundRate}% threshold.`,
    });
  if (d.chargebackRate !== null && d.chargebackRate > t.maxChargebackRate)
    out.push({
      tone: "warn",
      text: `Chargebacks are ${d.chargebackRate.toFixed(2)}% of GMV, above your ${t.maxChargebackRate}% threshold.`,
    });
  if (d.concentration !== null && d.concentration > t.maxConcentration)
    out.push({
      tone: "warn",
      text: `Top ten creators account for ${d.concentration.toFixed(0)}% of platform revenue.`,
    });
  if (e.creator_liability > 0 && e.cash_connected && e.creator_liability > e.cash_balance)
    out.push({
      tone: "warn",
      text: "Creator payout liability is larger than the recorded cash balance.",
    });
  if (e.mission_committed > e.budget.peace_knowledge + e.budget.community)
    out.push({
      tone: "warn",
      text: "Mission commitments exceed the mission allocation for this period.",
    });
  const budgetTotal = e.budget.operations + e.budget.trust_safety;
  if (budgetTotal > 0 && e.operating_expenses > budgetTotal)
    out.push({
      tone: "warn",
      text: "Recorded operating costs exceed the operations and Trust & Safety allocation.",
    });
  if (e.cash_connected) {
    const reserve = t.reserveMonths * e.operating_expenses;
    if (reserve > 0 && e.cash_balance < reserve)
      out.push({ tone: "warn", text: "Cash reserve is below your configured target." });
  }
  if (
    t.poolEnabled &&
    e.operating_profit > 0 &&
    e.creator_pool > (e.operating_profit * t.poolPercentOfProfit) / 100
  )
    out.push({
      tone: "warn",
      text: "Creator Pool distribution exceeds the configured share of operating profit.",
    });

  if (prev && prev.net_revenue > 0) {
    const change = ((e.net_revenue - prev.net_revenue) / prev.net_revenue) * 100;
    if (change <= -15)
      out.push({
        tone: "warn",
        text: `Net revenue fell ${Math.abs(change).toFixed(0)}% versus the previous period.`,
      });
    if (change >= 15)
      out.push({
        tone: "good",
        text: `Revenue increased ${change.toFixed(0)}% versus the previous period.`,
      });
  }
  return out;
}

/* ------------------------------------------------- executive summary line */

export function summarySentence(e: Economics, format: (n: number) => string): string {
  if (e.transactions === 0 && e.gross_revenue === 0)
    return "Not enough settled financial data to calculate profitability.";
  const base = `Revenue is ${format(e.net_revenue)} on ${format(e.gmv)} GMV.`;
  const liability = ` Creator payouts due are ${format(e.creator_liability)}.`;
  if (e.operating_expenses === 0 && e.mission_spend === 0)
    return `${base} Record actual operating costs to calculate profitability.${liability}`;
  if (e.operating_profit < 0)
    return `${base} EKA is currently operating at a ${format(Math.abs(e.operating_profit))} loss. Review operating expenses before increasing Creator Pool distributions.${liability}`;
  const margin = ratio(e.operating_profit, e.net_revenue);
  return `${base} Operating profit is ${format(e.operating_profit)}, giving EKA a ${margin === null ? "—" : margin.toFixed(1)}% operating margin.${liability}`;
}

/* --------------------------------------------------------------- scenarios */

export type Scenario = {
  gmvCents: number;
  feePercent: number;
  averageTransactionCents: number;
  processingPercent: number;
  variableCostPerTxnCents: number;
  fixedCostsCents: number;
  missionPercent: number;
  poolPercent: number;
  founderCompCents: number;
  /* reserve policy */
  reserveTargetMonths: number;
  reserveFloorCents: number;
  /* creator pool controls */
  poolCapCents: number;
  poolOnlyWhenProfitable: boolean;
  /* distribution overrides */
  founderMode: "fixed" | "percent";
  founderPercent: number;
  ownerMode: "fixed" | "percent";
  ownerAmountCents: number;
  ownerPercent: number;
};

export const DEFAULT_SCENARIO: Scenario = {
  gmvCents: 1_00_00_000_00,
  feePercent: 10,
  averageTransactionCents: 1_000_00,
  processingPercent: 2.5,
  variableCostPerTxnCents: 0,
  fixedCostsCents: 5_00_000_00,
  missionPercent: 20,
  poolPercent: 10,
  founderCompCents: 1_50_000_00,
  reserveTargetMonths: 3,
  reserveFloorCents: 0,
  poolCapCents: 0,
  poolOnlyWhenProfitable: true,
  founderMode: "fixed",
  founderPercent: 20,
  ownerMode: "fixed",
  ownerAmountCents: 0,
  ownerPercent: 0,
};

export type ScenarioResult = ReturnType<typeof runScenario>;

export function runScenario(s: Scenario) {
  const revenue = Math.round((s.gmvCents * s.feePercent) / 100);
  const transactions =
    s.averageTransactionCents > 0 ? Math.round(s.gmvCents / s.averageTransactionCents) : 0;
  const processing = Math.round((revenue * s.processingPercent) / 100);
  const variable = processing + transactions * s.variableCostPerTxnCents;
  const mission = Math.round((revenue * s.missionPercent) / 100);
  const operatingProfit = revenue - variable - s.fixedCostsCents - mission;

  // Reserve policy: hold back enough to cover N months of monthly cash burn (fixed + variable + mission),
  // never less than the reserve floor. Funded only out of positive operating profit.
  const monthlyCosts = variable + s.fixedCostsCents + mission;
  const reserveTarget = Math.max(
    Math.round(monthlyCosts * Math.max(s.reserveTargetMonths, 0)),
    Math.max(s.reserveFloorCents, 0),
  );
  const reserveFunded = Math.max(Math.min(reserveTarget, Math.max(operatingProfit, 0)), 0);
  const reserveShortfall = Math.max(reserveTarget - reserveFunded, 0);
  const afterReserve = operatingProfit - reserveFunded;

  const poolBase = s.poolOnlyWhenProfitable ? Math.max(operatingProfit, 0) : operatingProfit;
  let pool = Math.round((poolBase * s.poolPercent) / 100);
  if (s.poolCapCents > 0) pool = Math.min(pool, s.poolCapCents);
  if (pool < 0) pool = 0;

  const afterPool = afterReserve - pool;
  const founder =
    s.founderMode === "percent"
      ? Math.max(Math.round((Math.max(operatingProfit, 0) * s.founderPercent) / 100), 0)
      : Math.max(s.founderCompCents, 0);

  const afterFounder = afterPool - founder;
  const owner =
    s.ownerMode === "percent"
      ? Math.max(Math.round((Math.max(afterFounder, 0) * s.ownerPercent) / 100), 0)
      : Math.max(s.ownerAmountCents, 0);

  const retained = afterFounder - owner;
  const runwayMonths = monthlyCosts > 0 ? reserveFunded / monthlyCosts : null;

  return {
    revenue,
    transactions,
    variable,
    fixedCosts: s.fixedCostsCents,
    mission,
    operatingProfit,
    operatingMargin: ratio(operatingProfit, revenue),
    reserveTarget,
    reserveFunded,
    reserveShortfall,
    pool,
    founder,
    owner,
    retained,
    runwayMonths,
    monthlyCosts,
  };
}

export type ScenarioComparison = {
  label: string;
  scenario: Scenario;
  result: ScenarioResult;
  delta: Record<
    "revenue" | "operatingProfit" | "reserveFunded" | "pool" | "founder" | "owner" | "retained",
    number
  > | null;
};

export function compareScenarios(
  base: { label: string; scenario: Scenario },
  variants: { label: string; scenario: Scenario }[],
): ScenarioComparison[] {
  const baseResult = runScenario(base.scenario);
  const first: ScenarioComparison = {
    label: base.label,
    scenario: base.scenario,
    result: baseResult,
    delta: null,
  };
  return [
    first,
    ...variants.map((v) => {
      const result = runScenario(v.scenario);
      return {
        label: v.label,
        scenario: v.scenario,
        result,
        delta: {
          revenue: result.revenue - baseResult.revenue,
          operatingProfit: result.operatingProfit - baseResult.operatingProfit,
          reserveFunded: result.reserveFunded - baseResult.reserveFunded,
          pool: result.pool - baseResult.pool,
          founder: result.founder - baseResult.founder,
          owner: result.owner - baseResult.owner,
          retained: result.retained - baseResult.retained,
        },
      } satisfies ScenarioComparison;
    }),
  ];
}

export type SweepKey = "gmvCents" | "feePercent" | "poolPercent" | "fixedCostsCents";

/** One-variable sensitivity sweep around the scenario's current value. */
export function sweep(s: Scenario, key: SweepKey, steps = 5) {
  const current = s[key];
  const factors = [0.5, 0.75, 1, 1.5, 2].slice(0, Math.max(steps, 1));
  const base = current > 0 ? current : key === "feePercent" ? 10 : key === "poolPercent" ? 10 : 1;
  return factors.map((f) => {
    const value = key.endsWith("Cents") ? Math.round(base * f) : Number((base * f).toFixed(2));
    const result = runScenario({ ...s, [key]: value });
    return { value, result, negative: result.retained < 0 || result.operatingProfit < 0 };
  });
}

/** What GMV do we need? Estimates from the current take rate and margin. */
export function requiredGmv(
  target: { kind: "revenue" | "profit" | "founder"; amountCents: number },
  e: Economics,
) {
  const d = derive(e);
  const takeRate = d.takeRate ?? thresholds(e.config ?? {}).feePercent;
  const margin = d.operatingMargin;
  if (target.kind === "revenue") {
    if (!takeRate) return null;
    return { revenue: target.amountCents, gmv: Math.round((target.amountCents * 100) / takeRate) };
  }
  if (!margin || margin <= 0 || !takeRate) return null;
  const revenue = Math.round((target.amountCents * 100) / margin);
  return { revenue, gmv: Math.round((revenue * 100) / takeRate) };
}

/* --------------------------------------------------------- private records */

export type ExpenseBucket = "operations" | "trust_safety" | "mission" | "community";
export type ExpenseStatus = "committed" | "approved" | "paid" | "cancelled";

export const EXPENSE_BUCKETS: { key: ExpenseBucket; label: string; hint: string }[] = [
  {
    key: "operations",
    label: "Platform operations",
    hint: "Hosting, infrastructure, software, payments, engineering, support, salaries, legal, accounting, marketing.",
  },
  {
    key: "trust_safety",
    label: "Trust & Safety",
    hint: "Moderation, verification, appeals, investigations, safety operations.",
  },
  {
    key: "mission",
    label: "Peace & Knowledge Fund",
    hint: "Cultural preservation, minority-language projects, educational programmes.",
  },
  {
    key: "community",
    label: "Community projects",
    hint: "Grants, community projects, local initiatives.",
  },
];

export type Expense = {
  id: string;
  period: string;
  bucket: ExpenseBucket;
  category: string;
  amount_cents: number;
  status: ExpenseStatus;
  payment_date: string | null;
  reference: string | null;
  note: string | null;
  created_at: string;
};

export async function fetchExpenses(from: string, to: string): Promise<Expense[]> {
  const { data } = await supabase
    .from("finance_expenses")
    .select("*")
    .gte("period", from)
    .lte("period", to)
    .order("period", { ascending: false });
  return (data ?? []) as unknown as Expense[];
}

export async function addExpense(row: {
  period: string;
  bucket: ExpenseBucket;
  category: string;
  amount_cents: number;
  status: ExpenseStatus;
  note?: string;
  reference?: string;
}) {
  const { data: auth } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("finance_expenses")
    .insert({ ...row, recorded_by: auth.user?.id ?? null } as never);
  return { error };
}

export type DistributionKind =
  "founder_compensation" | "owner_distribution" | "creator_pool" | "reinvestment";
export type DistributionStatus = "draft" | "proposed" | "approved" | "paid" | "cancelled";

export const DISTRIBUTION_LABEL: Record<DistributionKind, string> = {
  founder_compensation: "Founder compensation",
  owner_distribution: "Owner distribution",
  creator_pool: "Creator Pool",
  reinvestment: "Reinvestment",
};

export type Distribution = {
  id: string;
  period: string;
  kind: DistributionKind;
  amount_cents: number;
  status: DistributionStatus;
  recipient_name: string | null;
  payment_date: string | null;
  reference: string | null;
  note: string | null;
  approved_at: string | null;
  created_at: string;
};

export async function fetchDistributions(from: string, to: string): Promise<Distribution[]> {
  const { data } = await supabase
    .from("finance_distributions")
    .select("*")
    .gte("period", from)
    .lte("period", to)
    .order("period", { ascending: false });
  return (data ?? []) as unknown as Distribution[];
}

export async function addDistribution(row: {
  period: string;
  kind: DistributionKind;
  amount_cents: number;
  status: DistributionStatus;
  recipient_name?: string;
  note?: string;
  reference?: string;
}) {
  const { data: auth } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("finance_distributions")
    .insert({ ...row, recorded_by: auth.user?.id ?? null } as never);
  return { error };
}

/** Records are never deleted: a status move keeps the history intact. */
export async function setDistributionStatus(id: string, status: DistributionStatus) {
  const patch: Record<string, unknown> = { status };
  if (status === "approved") {
    const { data: auth } = await supabase.auth.getUser();
    patch["approved_by"] = auth.user?.id ?? null;
    patch["approved_at"] = new Date().toISOString();
  }
  if (status === "paid") patch["payment_date"] = new Date().toISOString().slice(0, 10);
  const { error } = await supabase
    .from("finance_distributions")
    .update(patch as never)
    .eq("id", id);
  return { error };
}

export async function setExpenseStatus(id: string, status: ExpenseStatus) {
  const { error } = await supabase
    .from("finance_expenses")
    .update({ status } as never)
    .eq("id", id);
  return { error };
}

export type FinancePeriod = {
  id: string;
  period: string;
  cash_balance_cents: number;
  closed: boolean;
  closed_at: string | null;
};

export async function fetchPeriods(): Promise<FinancePeriod[]> {
  const { data } = await supabase
    .from("finance_periods")
    .select("*")
    .order("period", { ascending: false })
    .limit(24);
  return (data ?? []) as unknown as FinancePeriod[];
}

export async function closePeriod(period: string, cashBalanceCents: number) {
  const { error } = await supabase.rpc("close_finance_period", {
    _period: period,
    _cash_balance_cents: cashBalanceCents,
  });
  return { error };
}

export async function setCashBalance(period: string, cashBalanceCents: number) {
  const { error } = await supabase
    .from("finance_periods")
    .upsert({ period, cash_balance_cents: cashBalanceCents } as never, { onConflict: "period" });
  return { error };
}

/* ------------------------------------------------------------ the ledger */

export type LedgerEntry = {
  id: string;
  entry_kind: string;
  reverses_id: string | null;
  transaction_ref: string | null;
  creator_id: string | null;
  member_id: string | null;
  category: string;
  gross_creator_amount: number;
  platform_fee_percentage: number;
  eka_gross_fee: number;
  payment_processing_cost: number;
  refund_amount: number;
  chargeback_amount: number;
  creator_net_amount: number;
  operations_allocation: number;
  trust_safety_allocation: number;
  peace_knowledge_allocation: number;
  community_allocation: number;
  retained_earnings_allocation: number;
  creator_pool_allocation: number;
  currency: string;
  status: string;
  note: string | null;
  is_test_transaction: boolean;
  created_at: string;
  settled_at: string | null;
};

export async function fetchLedger(filters: {
  from: string;
  to: string;
  category?: string;
  status?: string;
  search?: string;
  limit?: number;
}): Promise<LedgerEntry[]> {
  let q = supabase
    .from("ledger_entries")
    .select("*")
    .gte("created_at", filters.from)
    .lte("created_at", `${filters.to}T23:59:59.999Z`)
    .order("created_at", { ascending: false })
    .limit(filters.limit ?? 200);
  if (filters.category && filters.category !== "all") q = q.eq("category", filters.category);
  if (filters.status && filters.status !== "all") q = q.eq("status", filters.status);
  if (filters.search) q = q.ilike("transaction_ref", `%${filters.search}%`);
  const { data } = await q;
  return (data ?? []) as unknown as LedgerEntry[];
}

export async function reverseEntry(id: string, note: string) {
  const { error } = await supabase.rpc("reverse_ledger_entry", { _id: id, _note: note });
  return { error };
}

/* ------------------------------------------------------------------ export */

function cell(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(header: string[], rows: (string | number)[][]) {
  return [header, ...rows].map((r) => r.map(cell).join(",")).join("\n");
}

export function download(filename: string, csv: string) {
  if (typeof window === "undefined") return;
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
