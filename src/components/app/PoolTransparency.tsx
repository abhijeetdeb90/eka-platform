import { useQuery } from "@tanstack/react-query";
import { usePlatformConfig } from "@/hooks/usePlatformConfig";
import { supabase } from "@/integrations/supabase/client";
import { POOL_EXPLAINER } from "@/lib/pool";
import { formatINR } from "@/lib/billing";

/* --------------------------------------------------- creator pool funding ---
 * Creators are paid by members. The pool is a bonus funded out of EKA's own
 * 10% platform fee. This panel shows the arithmetic for the current cycle
 * with the actual amounts, not a promise.
 * -------------------------------------------------------------------------- */

type Summary = { fee_cents: number; gross_cents: number; transactions: number };

function cycleBounds(date = new Date()) {
  const from = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  const to = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}

async function fetchSummary(): Promise<Summary> {
  const { from, to } = cycleBounds();
  const { data, error } = await supabase.rpc("pool_funding_summary", { _from: from, _to: to });
  const row = Array.isArray(data) ? (data[0] as Summary | undefined) : undefined;
  if (error || !row) return { fee_cents: 0, gross_cents: 0, transactions: 0 };
  return {
    fee_cents: Number(row.fee_cents),
    gross_cents: Number(row.gross_cents),
    transactions: row.transactions,
  };
}

export function PoolTransparency() {
  const config = usePlatformConfig();
  const { data: summary } = useQuery({ queryKey: ["pool-funding-summary"], queryFn: fetchSummary });

  const share = config.poolFundingPercent;
  const fee = summary?.fee_cents ?? 0;
  const gross = summary?.gross_cents ?? 0;
  const poolCents = Math.round((fee * share) / 100);
  const cycle = new Date().toLocaleString(undefined, { month: "long", year: "numeric" });

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
      <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
        How the Creator Pool is funded
      </p>
      <h2 className="mt-2 font-display text-xl">{cycle}</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{POOL_EXPLAINER}</p>

      <dl className="mt-4 space-y-2 text-sm">
        <Row
          label={`Payments through EKA this cycle`}
          value={formatINR(gross)}
          note={`${summary?.transactions ?? 0} transactions`}
        />
        <Row
          label={`EKA platform fee — ${config.feePercent}%`}
          value={formatINR(fee)}
          note="Shown to every member before they pay."
        />
        <Row
          label={`Creator Pool — ${share}% of that fee`}
          value={formatINR(poolCents)}
          note="Set aside this cycle, distributed by Creator Score."
          strong
        />
      </dl>

      <div className="mt-5 rounded-xl border border-border/70 bg-parchment/40 p-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Where the rest of the fee goes
        </p>
        <ul className="mt-2 space-y-1.5">
          {config.allocation.map((b) => (
            <li key={b.key} className="flex items-baseline justify-between gap-3 text-xs">
              <span className="text-muted-foreground">{b.key}</span>
              <span className="shrink-0 tabular-nums">
                {b.percent}% · {formatINR(Math.round((fee * b.percent) / 100))}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          The pool is drawn from EKA's own share above, after costs. It is never taken out of what a
          member pays you.
        </p>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  note,
  strong,
}: {
  label: string;
  value: string;
  note?: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/50 pb-2 last:border-0">
      <dt className="min-w-0">
        <span className={strong ? "text-foreground" : "text-muted-foreground"}>{label}</span>
        {note && <span className="block text-xs text-muted-foreground">{note}</span>}
      </dt>
      <dd className={`shrink-0 tabular-nums ${strong ? "font-display text-lg" : ""}`}>{value}</dd>
    </div>
  );
}
