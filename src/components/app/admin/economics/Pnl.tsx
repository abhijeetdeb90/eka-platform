import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCompact, formatMoney, parseAmountToMinor, ratio } from "@/lib/money";
import {
  closePeriod,
  derive,
  download,
  fetchEconomicsMonths,
  fetchPeriods,
  setCashBalance,
  toCsv,
  type MonthRow,
} from "@/lib/economics";
import { Empty, Panel, Scroller, Section } from "./Primitives";

const money = (n: number) => formatMoney(n, "INR");
const monthLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

export function ProfitAndLoss() {
  const qc = useQueryClient();
  const { data: months = [], isLoading } = useQuery({
    queryKey: ["eka-months", 12],
    queryFn: () => fetchEconomicsMonths(12),
  });
  const { data: periods = [] } = useQuery({ queryKey: ["finance-periods"], queryFn: fetchPeriods });
  const [cash, setCash] = useState("");

  const rows = useMemo(() => [...months].reverse(), [months]);
  const closedFor = (period: string) => periods.find((p) => p.period === period)?.closed ?? false;

  const exportPnl = () => {
    const csv = toCsv(
      [
        "Month",
        "GMV",
        "Gross EKA revenue",
        "Refunds",
        "Chargebacks",
        "Net EKA revenue",
        "Operating expenses",
        "Mission spending",
        "Operating profit",
        "Creator Pool",
        "Founder compensation",
        "Owner distributions",
        "Retained earnings",
        "Operating margin %",
      ],
      rows.map((r) => {
        const e = r.data;
        const m = ratio(e.operating_profit, e.net_revenue);
        return [
          monthLabel(r.period),
          e.gmv / 100,
          e.gross_revenue / 100,
          e.refunds / 100,
          e.chargebacks / 100,
          e.net_revenue / 100,
          e.operating_expenses / 100,
          e.mission_spend / 100,
          e.operating_profit / 100,
          e.creator_pool / 100,
          e.founder_compensation / 100,
          e.owner_distributions / 100,
          e.retained_earnings / 100,
          m === null ? "" : m.toFixed(1),
        ];
      }),
    );
    download("eka-profit-and-loss.csv", csv);
  };

  if (isLoading) return <Panel>Loading…</Panel>;
  const hasActivity = rows.some(
    (r) => r.data.gmv || r.data.gross_revenue || r.data.operating_expenses,
  );
  if (!hasActivity)
    return (
      <Empty
        title="No financial activity yet."
        body="Once settled transactions and recorded costs exist, the monthly profit and loss appears here."
      />
    );

  return (
    <div className="space-y-8">
      <Section
        title="Monthly profit & loss"
        hint="Recorded costs only. Allocations are budgets, not expenses."
        action={
          <Button size="sm" variant="outline" onClick={exportPnl}>
            Export P&amp;L
          </Button>
        }
      >
        <Scroller>
          <table className="w-full min-w-[68rem] text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="py-2">Month</th>
                <th>GMV</th>
                <th>Gross rev.</th>
                <th>Refunds</th>
                <th>Chargebacks</th>
                <th>Net rev.</th>
                <th>Opex</th>
                <th>Mission</th>
                <th>Op. profit</th>
                <th>Pool</th>
                <th>Founder</th>
                <th>Owner</th>
                <th>Retained</th>
                <th>Margin</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const e = r.data;
                const m = ratio(e.operating_profit, e.net_revenue);
                return (
                  <tr key={r.period} className="border-t border-border/60 tabular-nums">
                    <td className="py-2 whitespace-nowrap">
                      {monthLabel(r.period)}{" "}
                      {closedFor(r.period) && (
                        <span className="text-xs text-muted-foreground">· closed</span>
                      )}
                    </td>
                    <td>{money(e.gmv)}</td>
                    <td>{money(e.gross_revenue)}</td>
                    <td>{money(e.refunds)}</td>
                    <td>{money(e.chargebacks)}</td>
                    <td>{money(e.net_revenue)}</td>
                    <td>{money(e.operating_expenses)}</td>
                    <td>{money(e.mission_spend)}</td>
                    <td className={e.operating_profit < 0 ? "text-destructive" : ""}>
                      {money(e.operating_profit)}
                    </td>
                    <td>{money(e.creator_pool)}</td>
                    <td>{money(e.founder_compensation)}</td>
                    <td>{money(e.owner_distributions)}</td>
                    <td>{money(e.retained_earnings)}</td>
                    <td>{m === null ? "—" : `${m.toFixed(1)}%`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Scroller>
      </Section>

      <Trends rows={rows} />

      <Section
        title="Period closing"
        hint="A closed month can no longer be edited; corrections are recorded as adjustments in an open month."
      >
        <Panel className="space-y-3">
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>Transactions settled · refunds reconciled · creator payouts reconciled</li>
            <li>Expenses recorded · mission spending reconciled · Creator Pool reconciled</li>
            <li>Founder compensation reconciled · owner distributions reconciled</li>
          </ul>
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <label className="text-xs text-muted-foreground" htmlFor="cash">
                Closing cash balance (₹)
              </label>
              <Input
                id="cash"
                value={cash}
                onChange={(ev) => setCash(ev.target.value)}
                className="max-w-[180px]"
                inputMode="decimal"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                const period = rows[rows.length - 1]?.period;
                if (!period) return;
                const { error } = await setCashBalance(period, parseAmountToMinor(cash));
                if (error) {
                  toast.error(error.message);
                  return;
                }
                void qc.invalidateQueries({ queryKey: ["finance-periods"] });
                void qc.invalidateQueries({ queryKey: ["eka-economics"] });
                toast.success("Cash balance recorded.");
              }}
            >
              Record cash balance
            </Button>
            <Button
              size="sm"
              onClick={async () => {
                const period = rows[rows.length - 1]?.period;
                if (!period) return;
                if (
                  !confirm(`Close ${monthLabel(period)}? Entries for that month become read-only.`)
                )
                  return;
                const { error } = await closePeriod(period, parseAmountToMinor(cash));
                if (error) {
                  toast.error(error.message);
                  return;
                }
                void qc.invalidateQueries({ queryKey: ["finance-periods"] });
                toast.success("Period closed.");
              }}
            >
              Close {rows[rows.length - 1] ? monthLabel(rows[rows.length - 1]!.period) : "period"}
            </Button>
          </div>
        </Panel>
      </Section>
    </div>
  );
}

export function Trends({ rows }: { rows: MonthRow[] }) {
  const data = rows.map((r) => ({
    month: monthLabel(r.period),
    gmv: r.data.gmv / 100,
    revenue: r.data.net_revenue / 100,
    expenses: r.data.operating_expenses / 100,
    profit: r.data.operating_profit / 100,
    margin: derive(r.data).operatingMargin ?? 0,
    mission: r.data.mission_spend / 100,
    creators: r.data.active_creators,
    members: r.data.paying_members,
  }));

  const axis = { stroke: "currentColor", fontSize: 11, tickLine: false, axisLine: false } as const;

  return (
    <Section title="Financial trends" hint="Twelve months of activity.">
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel>
          <p className="text-sm font-medium">GMV & net revenue</p>
          <div className="mt-2 h-56 text-muted-foreground">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" {...axis} />
                <YAxis {...axis} tickFormatter={(v: number) => formatCompact(v * 100)} width={54} />
                <Tooltip formatter={(v: number) => formatMoney(v * 100)} />
                <Area
                  type="monotone"
                  dataKey="gmv"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.12}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--foreground))"
                  fill="hsl(var(--foreground))"
                  fillOpacity={0.08}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel>
          <p className="text-sm font-medium">Operating profit & expenses</p>
          <div className="mt-2 h-56 text-muted-foreground">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" {...axis} />
                <YAxis {...axis} tickFormatter={(v: number) => formatCompact(v * 100)} width={54} />
                <Tooltip formatter={(v: number) => formatMoney(v * 100)} />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(var(--primary))"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="hsl(var(--destructive))"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="mission"
                  stroke="hsl(var(--foreground))"
                  dot={false}
                  opacity={0.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </Section>
  );
}
