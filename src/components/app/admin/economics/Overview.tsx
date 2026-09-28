import { formatCompact, formatMoney, ratio } from "@/lib/money";
import { alertsFor, derive, summarySentence, thresholds, type Economics } from "@/lib/economics";
import {
  Delta,
  Empty,
  Money,
  Panel,
  PercentText,
  Progress,
  Row,
  Scroller,
  Section,
  Stat,
} from "./Primitives";

/* The first screen a founder sees: what happened, what it cost, what is left,
 * and what needs attention. Every figure comes from the server calculation. */

const money = (n: number) => formatMoney(n, "INR");

export function ExecutiveSummary({ e }: { e: Economics }) {
  return (
    <Panel className="border-primary/30 bg-primary/5">
      <p className="text-sm leading-relaxed">{summarySentence(e, (n) => formatCompact(n))}</p>
    </Panel>
  );
}

export function Snapshot({ e, prev }: { e: Economics; prev?: Economics }) {
  const d = derive(e);
  const noCosts = e.operating_expenses === 0 && e.mission_spend === 0;
  return (
    <Section
      title="Executive snapshot"
      hint="Settled activity for the selected period. Test payments are excluded."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Operating profit"
          emphasis
          tone={e.operating_profit < 0 ? "negative" : "default"}
          value={noCosts ? "—" : money(e.operating_profit)}
          sub={
            noCosts ? (
              "Record actual operating expenses to calculate this metric."
            ) : (
              <PercentText value={d.operatingMargin} />
            )
          }
        />
        <Stat
          label="Net EKA revenue"
          emphasis
          value={money(e.net_revenue)}
          sub={
            prev ? (
              <Delta current={e.net_revenue} previous={prev.net_revenue} />
            ) : (
              "Gross fees less refunds and chargebacks"
            )
          }
        />
        <Stat
          label="GMV"
          emphasis
          value={money(e.gmv)}
          sub={
            prev ? (
              <Delta current={e.gmv} previous={prev.gmv} />
            ) : (
              "Creator transaction value — not EKA revenue"
            )
          }
        />
        <Stat
          label="Creator payout liability"
          emphasis
          value={money(e.creator_liability)}
          sub="Creator earnings generated, less amounts already paid out"
        />
        <Stat
          label="EKA gross revenue"
          value={money(e.gross_revenue)}
          sub="Platform fees on settled transactions"
        />
        <Stat
          label="Operating expenses"
          value={e.operating_expenses ? money(e.operating_expenses) : "—"}
          sub={e.operating_expenses ? "Recorded costs, not allocations" : "No costs recorded yet"}
        />
        <Stat
          label="Mission & community spending"
          value={e.mission_spend ? money(e.mission_spend) : "—"}
          sub={
            e.mission_committed
              ? `${money(e.mission_committed)} committed, not yet paid`
              : "Paid mission and community work"
          }
        />
        <Stat
          label="Available cash"
          value={e.cash_connected ? money(e.cash_balance) : "—"}
          sub={e.cash_connected ? "Recorded cash balance" : "Cash reconciliation isn't connected."}
        />
      </div>
    </Section>
  );
}

export function ProfitCard({ e }: { e: Economics }) {
  const noCosts = e.operating_expenses === 0 && e.mission_spend === 0;
  return (
    <Section
      title="From revenue to retained earnings"
      hint="Operating profit and retained earnings are different figures. Neither is cash."
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Operating profit</p>
          <div className="mt-2">
            <Row label="EKA revenue (net)" value={<Money minor={e.net_revenue} />} />
            <Row
              label="− Operating expenses"
              value={<Money minor={-e.operating_expenses} />}
              negative={e.operating_expenses > 0}
            />
            <Row
              label="− Mission & community spending"
              value={<Money minor={-e.mission_spend} />}
              negative={e.mission_spend > 0}
            />
            <Row
              strong
              label="= Operating profit"
              value={noCosts ? "—" : <Money minor={e.operating_profit} />}
              negative={e.operating_profit < 0}
            />
          </div>
        </Panel>
        <Panel>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Retained earnings</p>
          <div className="mt-2">
            <Row label="Operating profit" value={<Money minor={e.operating_profit} />} />
            <Row
              label="− Creator Pool"
              value={<Money minor={-e.creator_pool} />}
              negative={e.creator_pool > 0}
            />
            <Row
              label="− Founder compensation"
              value={<Money minor={-e.founder_compensation} />}
              negative={e.founder_compensation > 0}
            />
            <Row
              label="− Owner distributions"
              value={<Money minor={-e.owner_distributions} />}
              negative={e.owner_distributions > 0}
            />
            <Row
              strong
              label="= Retained earnings"
              value={<Money minor={e.retained_earnings} />}
              negative={e.retained_earnings < 0}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Retained earnings stay with EKA. They are an accounting figure, not a bank balance.
          </p>
        </Panel>
      </div>
    </Section>
  );
}

export function Waterfall({ e }: { e: Economics }) {
  const steps: { label: string; value: number; kind: "base" | "down" | "total" }[] = [
    { label: "GMV (creator earnings)", value: e.gmv, kind: "base" },
    { label: "EKA platform revenue", value: e.gross_revenue, kind: "base" },
    { label: "Refunds & chargebacks", value: -(e.refunds + e.chargebacks), kind: "down" },
    { label: "Net EKA revenue", value: e.net_revenue, kind: "total" },
    { label: "Operating expenses", value: -e.operating_expenses, kind: "down" },
    { label: "Mission spending", value: -e.mission_spend, kind: "down" },
    { label: "Operating profit", value: e.operating_profit, kind: "total" },
    { label: "Creator Pool", value: -e.creator_pool, kind: "down" },
    { label: "Founder compensation", value: -e.founder_compensation, kind: "down" },
    { label: "Owner distributions", value: -e.owner_distributions, kind: "down" },
    { label: "Retained earnings", value: e.retained_earnings, kind: "total" },
  ];
  const scale = Math.max(...steps.map((s) => Math.abs(s.value)), 1);

  return (
    <Section
      title="The economic engine"
      hint="Member payment splits into creator earnings and EKA's platform fee. Everything below is EKA's own money."
    >
      <Panel className="space-y-2">
        {steps.map((s) => (
          <div
            key={s.label}
            className="grid grid-cols-[minmax(9rem,1fr)_2fr_auto] items-center gap-3 text-sm"
          >
            <span className={s.kind === "total" ? "font-medium" : "text-muted-foreground"}>
              {s.label}
            </span>
            <span className="h-2.5 rounded-full bg-muted">
              <span
                className={
                  s.kind === "down"
                    ? "block h-full rounded-full bg-destructive/60"
                    : s.kind === "total"
                      ? "block h-full rounded-full bg-primary"
                      : "block h-full rounded-full bg-primary/50"
                }
                style={{ width: `${(Math.abs(s.value) / scale) * 100}%` }}
              />
            </span>
            <span className="tabular-nums">{formatMoney(s.value, "INR")}</span>
          </div>
        ))}
      </Panel>
    </Section>
  );
}

export function RevenueAndGmv({ e }: { e: Economics }) {
  const d = derive(e);
  return (
    <Section
      title="Revenue & GMV"
      hint="GMV is what creators earned. EKA revenue is the separate platform fee."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="EKA take rate"
          emphasis
          value={d.takeRate === null ? "—" : `${d.takeRate.toFixed(1)}%`}
          sub="Gross fees ÷ GMV"
        />
        <Stat label="Transactions" value={String(e.transactions)} />
        <Stat label="Paying members" value={String(e.paying_members)} />
        <Stat label="Active creators" value={String(e.active_creators)} />
        <Stat
          label="Average transaction"
          value={d.averageTransaction === null ? "—" : money(Math.round(d.averageTransaction))}
        />
        <Stat
          label="EKA revenue per transaction"
          value={
            d.revenuePerTransaction === null ? "—" : money(Math.round(d.revenuePerTransaction))
          }
        />
        <Stat label="Refunds" value={money(e.refunds)} sub={<PercentText value={d.refundRate} />} />
        <Stat
          label="Chargebacks"
          value={money(e.chargebacks)}
          sub={<PercentText value={d.chargebackRate} />}
        />
      </div>
    </Section>
  );
}

export function RevenueByCategory({
  e,
  onPick,
}: {
  e: Economics;
  onPick?: (category: string) => void;
}) {
  const rows = e.by_category ?? [];
  if (!rows.length) return null;
  const totalFees = rows.reduce((n, r) => n + r.fees, 0);
  return (
    <Section title="Revenue by transaction type" hint="Click a type to filter the ledger below.">
      <Scroller>
        <table className="w-full min-w-[42rem] text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="py-2">Type</th>
              <th>GMV</th>
              <th>EKA fees</th>
              <th>Transactions</th>
              <th>Average</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.category} className="border-t border-border/60">
                <td className="py-2">
                  <button
                    className="underline-offset-2 hover:underline"
                    onClick={() => onPick?.(r.category)}
                  >
                    {r.category}
                  </button>
                </td>
                <td className="tabular-nums">{money(r.gmv)}</td>
                <td className="tabular-nums">{money(r.fees)}</td>
                <td className="tabular-nums">{r.transactions}</td>
                <td className="tabular-nums">
                  {r.transactions ? money(Math.round(r.gmv / r.transactions)) : "—"}
                </td>
                <td className="tabular-nums">
                  <PercentText value={ratio(r.fees, totalFees)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Scroller>
    </Section>
  );
}

export function HealthPanel({ e, prev }: { e: Economics; prev?: Economics }) {
  const d = derive(e);
  const growth =
    prev && prev.net_revenue ? ((e.net_revenue - prev.net_revenue) / prev.net_revenue) * 100 : null;
  const items: { label: string; value: string }[] = [
    { label: "Revenue growth", value: growth === null ? "—" : `${growth.toFixed(1)}%` },
    {
      label: "Operating margin",
      value: d.operatingMargin === null ? "—" : `${d.operatingMargin.toFixed(1)}%`,
    },
    {
      label: "Contribution margin",
      value: d.contributionMargin === null ? "—" : `${d.contributionMargin.toFixed(1)}%`,
    },
    {
      label: "Creator payout ratio",
      value: d.payoutRatio === null ? "—" : `${d.payoutRatio.toFixed(1)}%`,
    },
    {
      label: "Revenue per creator",
      value: d.revenuePerCreator === null ? "—" : money(Math.round(d.revenuePerCreator)),
    },
    {
      label: "Top-10 revenue concentration",
      value: d.concentration === null ? "—" : `${d.concentration.toFixed(0)}%`,
    },
    { label: "Refund rate", value: d.refundRate === null ? "—" : `${d.refundRate.toFixed(2)}%` },
    {
      label: "Chargeback rate",
      value: d.chargebackRate === null ? "—" : `${d.chargebackRate.toFixed(2)}%`,
    },
  ];
  return (
    <Section
      title="Financial health"
      hint="Ratios only appear once the underlying activity exists."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((i) => (
          <Stat key={i.label} label={i.label} value={i.value} />
        ))}
      </div>
    </Section>
  );
}

export function Alerts({ e, prev }: { e: Economics; prev?: Economics }) {
  const list = alertsFor(e, prev);
  return (
    <Section
      title="Attention required"
      hint="Thresholds are configurable in the economic model settings."
    >
      {list.length === 0 ? (
        <Empty
          title="Nothing needs attention"
          body="No configured threshold has been crossed for this period."
        />
      ) : (
        <ul className="space-y-2">
          {list.map((a) => (
            <li
              key={a.text}
              className={
                a.tone === "warn"
                  ? "rounded-2xl border border-destructive/40 bg-destructive/5 p-3 text-sm"
                  : "rounded-2xl border border-primary/40 bg-primary/5 p-3 text-sm"
              }
            >
              {a.tone === "warn" ? "⚠ " : "✓ "}
              {a.text}
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

export function Targets({ e }: { e: Economics }) {
  const t = thresholds(e.config ?? {});
  return (
    <Section title="Founder targets" hint="Set these in the economic model settings.">
      <Panel className="space-y-4">
        <Progress label="GMV" value={e.gmv} target={t.targetGmv} format={(n) => formatCompact(n)} />
        <Progress
          label="Net revenue"
          value={e.net_revenue}
          target={t.targetRevenue}
          format={(n) => formatCompact(n)}
        />
        <Progress
          label="Operating profit"
          value={Math.max(0, e.operating_profit)}
          target={t.targetProfit}
          format={(n) => formatCompact(n)}
        />
      </Panel>
    </Section>
  );
}

export function EconomicModelCard({ e, onEdit }: { e: Economics; onEdit: () => void }) {
  const t = thresholds(e.config ?? {});
  const allocation =
    (e.config?.["fee_allocation"] as { key: string; percent: number }[] | undefined) ?? [];
  return (
    <Section
      title="Current EKA economic model"
      action={
        <button className="text-sm underline underline-offset-4" onClick={onEdit}>
          Edit economic model
        </button>
      }
    >
      <Panel>
        <Row label="Member-facing platform fee" value={`${t.feePercent}%`} />
        {allocation.map((b) => (
          <Row key={b.key} label={b.key} value={`${b.percent}%`} />
        ))}
        <Row
          label="Creator Pool"
          value={`${t.poolPercentOfProfit}% of eligible operating profit`}
        />
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          These percentages are planning allocations. Actual profitability is determined by recorded
          costs and settled financial activity.
        </p>
      </Panel>
    </Section>
  );
}

export function Decisions({ e }: { e: Economics }) {
  const t = thresholds(e.config ?? {});
  const d = derive(e);
  const reserve = t.reserveMonths * e.operating_expenses;
  const reserveOk = !e.cash_connected ? null : e.cash_balance >= reserve;
  const canPool = e.operating_profit > 0 && reserveOk !== false;
  const aboveBreakEven = e.operating_expenses > 0 ? e.operating_profit > 0 : null;

  const line = (q: string, answer: string, reason: string) => (
    <Panel key={q}>
      <p className="text-sm font-medium">{q}</p>
      <p className="mt-1 font-display text-xl">{answer}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{reason}</p>
    </Panel>
  );

  return (
    <Section
      title="Founder decisions"
      hint="Decision support, not authorisation. Nothing here moves money."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {line(
          "Can EKA afford a Creator Pool distribution?",
          e.operating_expenses === 0 ? "Unknown" : canPool ? "Yes" : "No",
          e.operating_expenses === 0
            ? "Record actual operating expenses first."
            : canPool
              ? "Operating profit is positive and the configured reserve is maintained."
              : e.operating_profit <= 0
                ? "Operating profit is not positive for this period."
                : "Available cash is below your configured reserve target.",
        )}
        {line(
          "Can EKA increase founder compensation?",
          e.operating_expenses === 0
            ? "Unknown"
            : e.retained_earnings > 0 && reserveOk !== false
              ? "Consider"
              : "Not yet",
          "Founder income is determined by approved compensation and distributions, according to EKA's ownership and legal structure.",
        )}
        {line(
          "Is EKA above break-even?",
          aboveBreakEven === null ? "Unknown" : aboveBreakEven ? "Yes" : "No",
          aboveBreakEven === null
            ? "Break-even unavailable — record operating costs and variable costs."
            : `Contribution margin is ${d.contributionMargin === null ? "—" : `${d.contributionMargin.toFixed(1)}%`}.`,
        )}
        {line(
          "Is EKA becoming more profitable?",
          d.operatingMargin === null
            ? "Unknown"
            : d.operatingMargin >= t.targetMargin
              ? "At target"
              : "Below target",
          `Operating margin target is ${t.targetMargin}%.`,
        )}
      </div>
      {reserveOk === false && (
        <p className="text-xs text-destructive">
          Reserve below target. Distributions need an explicit override.
        </p>
      )}
    </Section>
  );
}
