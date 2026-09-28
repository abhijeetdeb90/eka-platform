import { useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCompact, formatMoney, parseAmountToMinor } from "@/lib/money";
import {
  DEFAULT_SCENARIO,
  compareScenarios,
  derive,
  requiredGmv,
  runScenario,
  sweep,
  thresholds,
  type Economics,
  type Scenario,
  type ScenarioResult,
  type SweepKey,
} from "@/lib/economics";
import { Empty, Money, Panel, PercentText, Row, Scroller, Section, Stat } from "./Primitives";

const money = (n: number) => formatMoney(n, "INR");

export function UnitEconomics({ e }: { e: Economics }) {
  const d = derive(e);
  const t = thresholds(e.config ?? {});
  const enough = e.transactions > 0;
  const per1000 = 1000_00;
  const fee = Math.round((per1000 * t.feePercent) / 100);
  const processingShare =
    enough && e.gross_revenue ? Math.round((e.processing_costs / e.gross_revenue) * fee) : null;
  const variableShare =
    enough && e.transactions
      ? Math.round(((t.variableCostPerTxn * e.transactions) / Math.max(e.gross_revenue, 1)) * fee)
      : null;
  const contribution =
    processingShare === null ? null : fee - processingShare - (variableShare ?? 0);

  return (
    <div className="space-y-8">
      <Section title="Unit economics" hint="For every ₹1,000 of creator GMV.">
        <div className="grid gap-3 lg:grid-cols-2">
          <Panel>
            <Row label="Creator receives" value={<Money minor={per1000} />} />
            <Row label="Member pays" value={<Money minor={per1000 + fee} />} />
            <Row label="EKA gross revenue" value={<Money minor={fee} />} />
            <Row
              label="Payment costs"
              value={
                processingShare === null ? (
                  "Not enough data yet"
                ) : (
                  <Money minor={processingShare} decimals />
                )
              }
            />
            <Row
              label="Other variable costs"
              value={
                variableShare === null ? (
                  "Not enough data yet"
                ) : (
                  <Money minor={variableShare} decimals />
                )
              }
            />
            <Row
              strong
              label="Contribution profit"
              value={
                contribution === null ? (
                  "Not enough data yet"
                ) : (
                  <Money minor={contribution} decimals />
                )
              }
            />
            <Row
              label="Contribution margin"
              value={
                <PercentText value={contribution === null ? null : (contribution / fee) * 100} />
              }
            />
          </Panel>
          <div className="grid gap-3 sm:grid-cols-2">
            <Stat
              label="Contribution margin"
              value={d.contributionMargin === null ? "—" : `${d.contributionMargin.toFixed(1)}%`}
              sub="Net revenue less variable costs"
            />
            <Stat
              label="Operating margin"
              value={d.operatingMargin === null ? "—" : `${d.operatingMargin.toFixed(1)}%`}
              sub="After fixed and mission costs"
            />
            <Stat
              label="Variable costs"
              value={money(d.variableCosts)}
              sub="Payment processing plus per-transaction costs"
            />
            <Stat label="Contribution profit" value={money(d.contributionProfit)} />
          </div>
        </div>
      </Section>

      <Section
        title="Break-even"
        hint="Fixed monthly operating costs recovered by contribution profit per transaction."
      >
        {d.breakEvenTransactions === null ? (
          <Empty
            title="Break-even unavailable"
            body="Record operating costs and variable costs to calculate break-even."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Fixed monthly costs" value={money(e.operating_expenses)} />
            <Stat
              label="Contribution profit per transaction"
              value={money(Math.round(d.contributionProfit / Math.max(e.transactions, 1)))}
            />
            <Stat
              label="Break-even transactions"
              value={d.breakEvenTransactions.toLocaleString("en-IN")}
            />
            <Stat
              label="Break-even GMV"
              value={d.breakEvenGmv === null ? "—" : money(d.breakEvenGmv)}
              emphasis
            />
          </div>
        )}
      </Section>

      <GrowthCalculator e={e} />
      <FounderSimulator />
    </div>
  );
}

function GrowthCalculator({ e }: { e: Economics }) {
  const [kind, setKind] = useState<"revenue" | "profit" | "founder">("revenue");
  const [amount, setAmount] = useState("1000000");
  const result = requiredGmv({ kind, amountCents: parseAmountToMinor(amount) }, e);
  const d = derive(e);

  return (
    <Section
      title="What GMV do we need?"
      hint="An estimate based on the current take rate and operating margin."
    >
      <Panel className="space-y-3">
        <div className="flex flex-wrap items-end gap-2">
          <select
            value={kind}
            onChange={(ev) => setKind(ev.target.value as typeof kind)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="revenue">Desired monthly EKA revenue</option>
            <option value="profit">Desired monthly operating profit</option>
            <option value="founder">Desired monthly founder compensation</option>
          </select>
          <Input
            value={amount}
            inputMode="decimal"
            onChange={(ev) => setAmount(ev.target.value)}
            className="max-w-[180px]"
          />
        </div>
        {result === null ? (
          <p className="text-sm text-muted-foreground">
            Not enough data yet — a positive operating margin and take rate are needed for this
            estimate.
          </p>
        ) : (
          <div>
            <Row
              label="Current take rate"
              value={d.takeRate === null ? "—" : `${d.takeRate.toFixed(1)}%`}
            />
            {kind !== "revenue" && (
              <Row
                label="Current operating margin"
                value={d.operatingMargin === null ? "—" : `${d.operatingMargin.toFixed(1)}%`}
              />
            )}
            <Row label="Required EKA revenue" value={<Money minor={result.revenue} />} />
            <Row strong label="Required GMV" value={<Money minor={result.gmv} />} />
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Estimate based on current assumptions — not actual financial data.
        </p>
      </Panel>
    </Section>
  );
}

/* ------------------------------------------------------- founder simulator */

type Column = { label: string; scenario: Scenario };

const VARIANT_PRESETS: Column[] = [
  {
    label: "Conservative",
    scenario: {
      ...DEFAULT_SCENARIO,
      gmvCents: 50_00_000_00,
      reserveTargetMonths: 6,
      poolPercent: 5,
      ownerMode: "fixed",
      ownerAmountCents: 0,
    },
  },
  {
    label: "Aggressive",
    scenario: {
      ...DEFAULT_SCENARIO,
      gmvCents: 5_00_00_000_00,
      reserveTargetMonths: 1,
      poolPercent: 15,
      ownerMode: "percent",
      ownerPercent: 40,
    },
  },
];

/** "If EKA reaches ₹1Cr monthly GMV, what does the company make?" */
export function FounderSimulator() {
  const [columns, setColumns] = useState<Column[]>([
    { label: "Base", scenario: DEFAULT_SCENARIO },
    ...VARIANT_PRESETS,
  ]);
  const [editing, setEditing] = useState(0);
  const [sweepKey, setSweepKey] = useState<SweepKey>("gmvCents");

  const s = columns[editing]!.scenario;
  const setS = (next: Scenario) =>
    setColumns((cols) => cols.map((c, i) => (i === editing ? { ...c, scenario: next } : c)));

  const rows = compareScenarios(columns[0]!, columns.slice(1));
  const sweepRows = sweep(s, sweepKey);
  const presets = [1_00_00_000_00, 5_00_00_000_00, 10_00_00_000_00];

  const numField = (label: string, key: keyof Scenario, suffix?: string) => (
    <div key={String(key)}>
      <label className="text-xs text-muted-foreground">
        {label}
        {suffix ? ` (${suffix})` : ""}
      </label>
      <Input
        value={String(String(key).endsWith("Cents") ? (s[key] as number) / 100 : s[key])}
        inputMode="decimal"
        onChange={(ev) => {
          const raw = Number(ev.target.value.replace(/[^\d.]/g, "") || 0);
          setS({ ...s, [key]: String(key).endsWith("Cents") ? Math.round(raw * 100) : raw });
        }}
      />
    </div>
  );

  const modeField = (label: string, key: "founderMode" | "ownerMode") => (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <select
        value={s[key]}
        onChange={(ev) => setS({ ...s, [key]: ev.target.value as "fixed" | "percent" })}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="fixed">Fixed amount</option>
        <option value="percent">Percentage of profit</option>
      </select>
    </div>
  );

  const cmp = (
    fmt: (r: ScenarioResult) => ReactNode,
    pick: (r: ScenarioResult) => number,
    label: string,
    strong?: boolean,
  ) => (
    <tr className={strong ? "border-t border-border font-medium" : ""}>
      <th
        scope="row"
        className={`py-1.5 pr-4 text-left font-normal ${strong ? "font-medium" : "text-muted-foreground"}`}
      >
        {label}
      </th>
      {rows.map((r) => (
        <td key={r.label} className="py-1.5 pr-4 text-right tabular-nums">
          <span className={pick(r.result) < 0 ? "text-destructive" : undefined}>
            {fmt(r.result)}
          </span>
          {r.delta && (
            <span className="ml-2 text-xs text-muted-foreground">
              {pick(r.result) - pick(rows[0]!.result) >= 0 ? "+" : "−"}
              {money(Math.abs(pick(r.result) - pick(rows[0]!.result)))}
            </span>
          )}
        </td>
      ))}
    </tr>
  );

  return (
    <Section
      title="Founder simulator"
      hint="Scenario — not actual financial data. Nothing here touches the ledger."
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {columns.map((c, i) => (
              <Button
                key={c.label}
                size="sm"
                variant={i === editing ? "default" : "outline"}
                onClick={() => setEditing(i)}
              >
                {c.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <Button key={p} size="sm" variant="ghost" onClick={() => setS({ ...s, gmvCents: p })}>
                {formatCompact(p)} GMV
              </Button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {numField("Monthly GMV", "gmvCents", "₹")}
            {numField("Platform fee", "feePercent", "%")}
            {numField("Average transaction", "averageTransactionCents", "₹")}
            {numField("Payment processing", "processingPercent", "% of revenue")}
            {numField("Variable cost per transaction", "variableCostPerTxnCents", "₹")}
            {numField("Monthly fixed costs", "fixedCostsCents", "₹")}
            {numField("Mission allocation", "missionPercent", "% of revenue")}
            {numField("Reserve target", "reserveTargetMonths", "months of cost")}
            {numField("Reserve floor", "reserveFloorCents", "₹")}
            {numField("Creator Pool", "poolPercent", "% of profit")}
            {numField("Creator Pool cap", "poolCapCents", "₹, 0 = none")}
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={s.poolOnlyWhenProfitable}
                  onChange={(ev) => setS({ ...s, poolOnlyWhenProfitable: ev.target.checked })}
                />
                Fund pool only when profitable
              </label>
            </div>
            {modeField("Founder compensation basis", "founderMode")}
            {s.founderMode === "fixed"
              ? numField("Founder compensation", "founderCompCents", "₹")
              : numField("Founder compensation", "founderPercent", "% of profit")}
            {modeField("Owner distribution basis", "ownerMode")}
            {s.ownerMode === "fixed"
              ? numField("Owner distribution", "ownerAmountCents", "₹")
              : numField("Owner distribution", "ownerPercent", "% of remainder")}
          </div>
        </Panel>

        <Panel>
          <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
            {columns[editing]!.label} waterfall
          </p>
          {(() => {
            const out = runScenario(s);
            return (
              <>
                <Row label="EKA revenue" value={<Money minor={out.revenue} />} />
                <Row label="Transactions" value={out.transactions.toLocaleString("en-IN")} />
                <Row label="− Variable costs" value={<Money minor={-out.variable} />} />
                <Row label="− Fixed costs" value={<Money minor={-out.fixedCosts} />} />
                <Row label="− Mission spending" value={<Money minor={-out.mission} />} />
                <Row
                  strong
                  label="= Operating profit"
                  value={<Money minor={out.operatingProfit} />}
                  negative={out.operatingProfit < 0}
                />
                <Row label="Operating margin" value={<PercentText value={out.operatingMargin} />} />
                <Row label="− Reserve funding" value={<Money minor={-out.reserveFunded} />} />
                <Row label="− Creator Pool" value={<Money minor={-out.pool} />} />
                <Row label="− Founder compensation" value={<Money minor={-out.founder} />} />
                <Row label="− Owner distribution" value={<Money minor={-out.owner} />} />
                <Row
                  strong
                  label="= Retained earnings"
                  value={<Money minor={out.retained} />}
                  negative={out.retained < 0}
                />
                <Row
                  label="Reserve covers"
                  value={out.runwayMonths === null ? "—" : `${out.runwayMonths.toFixed(1)} months`}
                />
                {out.reserveShortfall > 0 && (
                  <p className="mt-2 text-xs leading-relaxed text-destructive">
                    Reserve policy not met — {money(out.reserveShortfall)} short of the{" "}
                    {money(out.reserveTarget)} target.
                  </p>
                )}
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Founder cash is the compensation figure above. Retained earnings belong to EKA,
                  not to the founder.
                </p>
              </>
            );
          })()}
        </Panel>
      </div>

      <Scroller>
        <table className="mt-4 w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-1.5 pr-4 text-left font-normal">Sensitivity</th>
              {rows.map((r) => (
                <th key={r.label} className="py-1.5 pr-4 text-right font-normal">
                  {r.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cmp(
              (r) => (
                <Money minor={r.revenue} />
              ),
              (r) => r.revenue,
              "EKA revenue",
            )}
            {cmp(
              (r) => (
                <Money minor={r.operatingProfit} />
              ),
              (r) => r.operatingProfit,
              "Operating profit",
            )}
            <tr>
              <th scope="row" className="py-1.5 pr-4 text-left font-normal text-muted-foreground">
                Operating margin
              </th>
              {rows.map((r) => (
                <td key={r.label} className="py-1.5 pr-4 text-right tabular-nums">
                  <PercentText value={r.result.operatingMargin} />
                </td>
              ))}
            </tr>
            {cmp(
              (r) => (
                <Money minor={r.reserveFunded} />
              ),
              (r) => r.reserveFunded,
              "Reserve funded",
            )}
            {cmp(
              (r) => (
                <Money minor={r.pool} />
              ),
              (r) => r.pool,
              "Creator Pool",
            )}
            {cmp(
              (r) => (
                <Money minor={r.founder} />
              ),
              (r) => r.founder,
              "Founder compensation",
            )}
            {cmp(
              (r) => (
                <Money minor={r.owner} />
              ),
              (r) => r.owner,
              "Owner distribution",
            )}
            {cmp(
              (r) => (
                <Money minor={r.retained} />
              ),
              (r) => r.retained,
              "Retained earnings",
              true,
            )}
            <tr>
              <th scope="row" className="py-1.5 pr-4 text-left font-normal text-muted-foreground">
                Reserve covers
              </th>
              {rows.map((r) => (
                <td key={r.label} className="py-1.5 pr-4 text-right tabular-nums">
                  {r.result.runwayMonths === null ? "—" : `${r.result.runwayMonths.toFixed(1)} mo`}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </Scroller>

      <Panel className="mt-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm">
            Sweep one variable in <strong>{columns[editing]!.label}</strong>:
          </span>
          <select
            value={sweepKey}
            onChange={(ev) => setSweepKey(ev.target.value as SweepKey)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="gmvCents">Monthly GMV</option>
            <option value="feePercent">Platform fee</option>
            <option value="poolPercent">Creator Pool %</option>
            <option value="fixedCostsCents">Monthly fixed costs</option>
          </select>
        </div>
        <Scroller>
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-1.5 pr-4 text-left font-normal">Value</th>
                <th className="py-1.5 pr-4 text-right font-normal">Operating profit</th>
                <th className="py-1.5 pr-4 text-right font-normal">Creator Pool</th>
                <th className="py-1.5 pr-4 text-right font-normal">Founder</th>
                <th className="py-1.5 pr-4 text-right font-normal">Retained</th>
              </tr>
            </thead>
            <tbody>
              {sweepRows.map((r) => (
                <tr key={r.value} className={r.negative ? "text-destructive" : ""}>
                  <td className="py-1.5 pr-4 tabular-nums">
                    {sweepKey.endsWith("Cents") ? money(r.value) : `${r.value}%`}
                  </td>
                  <td className="py-1.5 pr-4 text-right tabular-nums">
                    <Money minor={r.result.operatingProfit} />
                  </td>
                  <td className="py-1.5 pr-4 text-right tabular-nums">
                    <Money minor={r.result.pool} />
                  </td>
                  <td className="py-1.5 pr-4 text-right tabular-nums">
                    <Money minor={r.result.founder} />
                  </td>
                  <td className="py-1.5 pr-4 text-right tabular-nums">
                    <Money minor={r.result.retained} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Scroller>
        <p className="text-xs text-muted-foreground">
          Rows in red show where operating profit or retained earnings turn negative.
        </p>
      </Panel>
    </Section>
  );
}
