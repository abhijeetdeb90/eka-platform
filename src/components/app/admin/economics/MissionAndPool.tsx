import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney, parseAmountToMinor, ratio } from "@/lib/money";
import {
  EXPENSE_BUCKETS,
  addExpense,
  download,
  fetchExpenses,
  setExpenseStatus,
  thresholds,
  toCsv,
  type Economics,
  type ExpenseBucket,
  type ExpenseStatus,
} from "@/lib/economics";
import {
  fetchAllocations,
  fetchPoolPeriods,
  previewDistribution,
  publishDistribution,
} from "@/lib/pool";
import { usePlatformConfig } from "@/hooks/usePlatformConfig";
import { Empty, Money, Panel, PercentText, Row, Scroller, Section, Stat } from "./Primitives";

const money = (n: number) => formatMoney(n, "INR");
const STATUSES: ExpenseStatus[] = ["committed", "approved", "paid", "cancelled"];

/* ------------------------------------------------------ cost structure --- */

export function CostStructure({ e, from, to }: { e: Economics; from: string; to: string }) {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["finance-expenses", from, to],
    queryFn: () => fetchExpenses(from, to),
  });
  const [bucket, setBucket] = useState<ExpenseBucket>("operations");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<ExpenseStatus>("paid");

  const budget: Record<ExpenseBucket, number> = {
    operations: e.budget.operations,
    trust_safety: e.budget.trust_safety,
    mission: e.budget.peace_knowledge,
    community: e.budget.community,
  };
  const actual: Record<ExpenseBucket, number> = {
    operations: e.actual_costs.operations,
    trust_safety: e.actual_costs.trust_safety,
    mission: e.actual_costs.peace_knowledge,
    community: e.actual_costs.community,
  };

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["finance-expenses"] });
    void qc.invalidateQueries({ queryKey: ["eka-economics"] });
    void qc.invalidateQueries({ queryKey: ["eka-months"] });
  };

  return (
    <div className="space-y-8">
      <Section
        title="Budget vs actual"
        hint="An allocation is a plan. Only recorded, paid costs count as spending."
      >
        <Scroller>
          <table className="w-full min-w-[40rem] text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="py-2">Category</th>
                <th>Budget</th>
                <th>Actual</th>
                <th>Variance</th>
                <th>Variance %</th>
              </tr>
            </thead>
            <tbody>
              {EXPENSE_BUCKETS.map((b) => {
                const variance = budget[b.key] - actual[b.key];
                return (
                  <tr key={b.key} className="border-t border-border/60">
                    <td className="py-2">
                      {b.label}
                      <span className="block text-xs text-muted-foreground">{b.hint}</span>
                    </td>
                    <td className="tabular-nums">{money(budget[b.key])}</td>
                    <td className="tabular-nums">{money(actual[b.key])}</td>
                    <td className={variance < 0 ? "tabular-nums text-destructive" : "tabular-nums"}>
                      {money(Math.abs(variance))} {variance < 0 ? "over" : "favourable"}
                    </td>
                    <td className="tabular-nums">
                      <PercentText value={ratio(variance, budget[b.key] || 0)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Scroller>
      </Section>

      <Section
        title="Record a cost"
        hint="Committed and approved costs are tracked but not counted as spending until paid."
      >
        <Panel className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-4">
            <select
              value={bucket}
              onChange={(ev) => setBucket(ev.target.value as ExpenseBucket)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {EXPENSE_BUCKETS.map((b) => (
                <option key={b.key} value={b.key}>
                  {b.label}
                </option>
              ))}
            </select>
            <Input
              placeholder="Category (e.g. Hosting)"
              value={category}
              onChange={(ev) => setCategory(ev.target.value)}
            />
            <Input
              placeholder="Amount (₹)"
              value={amount}
              inputMode="decimal"
              onChange={(ev) => setAmount(ev.target.value)}
            />
            <select
              value={status}
              onChange={(ev) => setStatus(ev.target.value as ExpenseStatus)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <Button
            size="sm"
            disabled={!amount || !category}
            onClick={async () => {
              const { error } = await addExpense({
                period: from,
                bucket,
                category,
                amount_cents: parseAmountToMinor(amount),
                status,
              });
              if (error) {
                toast.error(error.message);
                return;
              }
              setAmount("");
              setCategory("");
              refresh();
              toast.success("Cost recorded.");
            }}
          >
            Record cost
          </Button>
        </Panel>
      </Section>

      <Section
        title="Recorded costs"
        action={
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              download(
                "eka-expenses.csv",
                toCsv(
                  ["Period", "Bucket", "Category", "Amount", "Status"],
                  rows.map((r) => [r.period, r.bucket, r.category, r.amount_cents / 100, r.status]),
                ),
              )
            }
          >
            Export expenses
          </Button>
        }
      >
        {rows.length === 0 ? (
          <Empty
            title="No costs recorded for this period."
            body="Operating margin and break-even stay unavailable until real costs exist."
          />
        ) : (
          <Scroller>
            <table className="w-full min-w-[40rem] text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="py-2">Period</th>
                  <th>Bucket</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border/60">
                    <td className="py-2">{r.period}</td>
                    <td>{r.bucket}</td>
                    <td>{r.category}</td>
                    <td className="tabular-nums">{money(r.amount_cents)}</td>
                    <td>{r.status}</td>
                    <td>
                      <select
                        value={r.status}
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                        onChange={async (ev) => {
                          const { error } = await setExpenseStatus(
                            r.id,
                            ev.target.value as ExpenseStatus,
                          );
                          if (error) {
                            toast.error(error.message);
                            return;
                          }
                          refresh();
                        }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Scroller>
        )}
      </Section>
    </div>
  );
}

/* --------------------------------------------------------- mission money -- */

export function MissionFunding({ e }: { e: Economics }) {
  return (
    <Section
      title="Where EKA's mission money went"
      hint="A planned grant is not spending until it is paid."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat
          label="Trust & Safety"
          value={money(e.actual_costs.trust_safety)}
          sub={`Allocation ${money(e.budget.trust_safety)}`}
        />
        <Stat
          label="Peace & Knowledge Fund"
          value={money(e.actual_costs.peace_knowledge)}
          sub={`Allocation ${money(e.budget.peace_knowledge)}`}
        />
        <Stat
          label="Community projects"
          value={money(e.actual_costs.community)}
          sub={`Allocation ${money(e.budget.community)}`}
        />
      </div>
      <Panel className="max-w-md">
        <Row label="Committed but not yet paid" value={<Money minor={e.mission_committed} />} />
        <Row
          strong
          label="Paid mission & community spending"
          value={<Money minor={e.mission_spend} />}
        />
      </Panel>
    </Section>
  );
}

/* ------------------------------------------------------------ creator pool */

export function CreatorPoolSection({ e }: { e: Economics }) {
  const qc = useQueryClient();
  const config = usePlatformConfig();
  const t = thresholds(e.config ?? {});
  const { data: periods = [] } = useQuery({
    queryKey: ["pool-periods"],
    queryFn: fetchPoolPeriods,
  });
  const current = periods[0];
  const { data: allocations = [] } = useQuery({
    queryKey: ["pool-allocations", current?.id],
    enabled: Boolean(current?.id),
    queryFn: () => fetchAllocations(current!.id),
  });
  const [confirming, setConfirming] = useState(false);

  const available =
    t.poolEnabled && e.operating_profit > 0
      ? Math.round((e.operating_profit * t.poolPercentOfProfit) / 100)
      : 0;
  const distributed = allocations
    .filter((a) => a.status !== "preview")
    .reduce((n, a) => n + a.amount_cents, 0);
  const top = allocations.reduce((n, a) => Math.max(n, a.amount_cents), 0);

  return (
    <div className="space-y-8">
      <Section
        title="Creator Pool"
        hint="Funded from EKA's operating surplus. Never deducted from creator earnings."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Operating profit" value={money(e.operating_profit)} />
          <Stat
            label="Pool percentage"
            value={`${t.poolPercentOfProfit}%`}
            sub={t.poolEnabled ? "Pool is enabled" : "Pool is switched off"}
          />
          <Stat label="Pool available" emphasis value={money(available)} />
          <Stat label="Distributed" value={money(distributed)} />
          <Stat label="Remaining pool" value={money(Math.max(0, available - distributed))} />
          <Stat
            label="Recipients"
            value={String(allocations.filter((a) => a.status !== "preview").length)}
          />
          <Stat
            label="Average payout"
            value={
              allocations.length
                ? money(Math.round(distributed / Math.max(1, allocations.length)))
                : "—"
            }
          />
          <Stat label="Top payout" value={top ? money(top) : "—"} />
        </div>
      </Section>

      <Section
        title="Run a distribution"
        hint="Preview first. Every allocation is recorded and exportable."
      >
        {!current ? (
          <Empty
            title="No pool period yet."
            body="Create a pool period in the admin Creator Pool tools before distributing."
          />
        ) : (
          <Panel className="space-y-3">
            <Row label="Period" value={current.period} />
            <Row label="Pool for this period" value={<Money minor={current.pool_cents} />} />
            <Row label="Eligible creators (preview)" value={String(allocations.length)} />
            <Row
              label="Distribution formula"
              value={config.weights.map((w) => `${w.label} ${w.percent}%`).join(" · ")}
            />
            <Row
              label="Remaining retained earnings after distribution"
              value={<Money minor={e.retained_earnings - available} />}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  const { error } = await previewDistribution(current.id, config);
                  if (error) {
                    toast.error(error.message);
                    return;
                  }
                  void qc.invalidateQueries({ queryKey: ["pool-allocations"] });
                  toast.success("Preview ready.");
                }}
              >
                Preview distribution
              </Button>
              {!confirming ? (
                <Button
                  size="sm"
                  disabled={!allocations.length || e.operating_profit <= 0}
                  onClick={() => setConfirming(true)}
                >
                  Run distribution
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    onClick={async () => {
                      const { error } = await publishDistribution(current.id);
                      setConfirming(false);
                      if (error) {
                        toast.error(error.message);
                        return;
                      }
                      void qc.invalidateQueries({ queryKey: ["pool-allocations"] });
                      void qc.invalidateQueries({ queryKey: ["pool-periods"] });
                      toast.success("Distribution published.");
                    }}
                  >
                    Confirm {money(allocations.reduce((n, a) => n + a.amount_cents, 0))} to{" "}
                    {allocations.length} creators
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
                    Cancel
                  </Button>
                </>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  download(
                    "eka-creator-pool.csv",
                    toCsv(
                      ["Period", "Creator", "Score", "Weight", "Amount", "Status"],
                      allocations.map((a) => [
                        current.period,
                        a.creator_id,
                        a.score,
                        a.share,
                        a.amount_cents / 100,
                        a.status,
                      ]),
                    ),
                  )
                }
              >
                Export pool
              </Button>
            </div>
            {e.operating_profit <= 0 && (
              <p className="text-xs text-destructive">
                Operating profit is not positive — a distribution would come out of reserves.
              </p>
            )}
          </Panel>
        )}
      </Section>
    </div>
  );
}
