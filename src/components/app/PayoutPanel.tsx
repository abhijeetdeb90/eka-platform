import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatINR } from "@/lib/billing";
import { fetchConfig } from "@/lib/config";
import {
  PAYOUT_REVIEW_COPY,
  RISK_COPY,
  STATUS_COPY,
  fetchAvailableCents,
  fetchEarningsBySource,
  fetchMyPayouts,
  requestPayout,
} from "@/lib/payouts";
import { POOL_EXPLAINER, fetchMyAllocations, fetchMyScoreEvents } from "@/lib/pool";

/** Where a creator's money comes from, what is available, and how to ask for it. */
export function PayoutPanel() {
  const qc = useQueryClient();
  const { data: config } = useQuery({ queryKey: ["platform-config"], queryFn: fetchConfig });
  const { data: earnings } = useQuery({
    queryKey: ["creator-earnings"],
    queryFn: fetchEarningsBySource,
  });
  const { data: available = 0 } = useQuery({
    queryKey: ["payout-available"],
    queryFn: fetchAvailableCents,
  });
  const { data: payouts = [] } = useQuery({ queryKey: ["my-payouts"], queryFn: fetchMyPayouts });
  const { data: allocations = [] } = useQuery({
    queryKey: ["my-pool-allocations"],
    queryFn: fetchMyAllocations,
  });
  const { data: scoreEvents = [] } = useQuery({
    queryKey: ["my-score-events"],
    queryFn: fetchMyScoreEvents,
  });

  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  const pending = payouts
    .filter((p) => p.status === "pending" || p.status === "approved")
    .reduce((n, p) => n + p.amount_cents, 0);
  const threshold = config?.payoutReviewThresholdCents ?? 500_000;
  const holdback = config?.payoutHoldbackDays ?? 7;

  return (
    <section className="mt-8 space-y-6">
      <div>
        <h2 className="font-display text-xl">Where your earnings come from</h2>
        <ul className="mt-3 space-y-2">
          {(earnings?.sources ?? []).map((s) => (
            <li
              key={s.key}
              className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 text-sm"
            >
              <span>{s.label}</span>
              <span className="tabular-nums">{formatINR(s.cents)}</span>
            </li>
          ))}
          {(earnings?.sources ?? []).length === 0 && (
            <li className="rounded-xl border border-dashed border-border/70 px-4 py-3 text-sm text-muted-foreground">
              Nothing yet. Your first session, episode or offering of gratitude will appear here.
            </li>
          )}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          EKA's {config?.feePercent ?? 10}% fee is shown to the member before they pay and is never
          taken out of the amount you named. Fees you have generated for EKA so far:{" "}
          {formatINR(earnings?.feesCents ?? 0)}.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-xl">Payouts</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Available now", value: formatINR(available) },
            { label: "Awaiting release", value: formatINR(pending) },
            { label: "Earned in total", value: formatINR(earnings?.earnedCents ?? 0) },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border/70 bg-parchment/40 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-1 font-display text-lg tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-end gap-3">
          <div className="grow sm:max-w-[220px]">
            <Label htmlFor="payout-amount">Amount to withdraw (₹)</Label>
            <Input
              id="payout-amount"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="0"
              className="mt-1.5"
            />
          </div>
          <Button
            disabled={busy || !amount || available <= 0}
            onClick={async () => {
              const cents = Number(amount) * 100;
              setBusy(true);
              const { error } = await requestPayout(cents);
              setBusy(false);
              if (error) {
                toast.error(error.message);
                return;
              }
              setAmount("");
              await Promise.all([
                qc.invalidateQueries({ queryKey: ["my-payouts"] }),
                qc.invalidateQueries({ queryKey: ["payout-available"] }),
              ]);
              toast.success("Payout requested.");
            }}
          >
            {busy ? "Requesting…" : "Request payout"}
          </Button>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Earnings become available {holdback} days after a session settles. {PAYOUT_REVIEW_COPY}{" "}
          Today that review begins at {formatINR(threshold)}.
        </p>

        {payouts.length > 0 && (
          <ul className="mt-5 space-y-2">
            {payouts.map((p) => (
              <li key={p.id} className="rounded-xl border border-border/70 px-4 py-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="tabular-nums">{formatINR(p.amount_cents)}</span>
                  <span className="text-xs text-muted-foreground">{STATUS_COPY[p.status]}</span>
                </div>
                {p.risk_flags.length > 0 && (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    In review: {p.risk_flags.map((f) => RISK_COPY[f] ?? f).join(" · ")}
                  </p>
                )}
                {p.review_note && (
                  <p className="mt-1 text-[11px] text-muted-foreground">{p.review_note}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-border/70 bg-parchment/40 p-5">
        <h2 className="font-display text-xl">Creator Pool</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{POOL_EXPLAINER}</p>
        {allocations.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {allocations.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 text-sm"
              >
                <span>
                  Score {a.score} · {(a.share * 100).toFixed(1)}% of the pool
                </span>
                <span className="tabular-nums">{formatINR(a.amount_cents)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">No distribution has reached you yet.</p>
        )}

        {scoreEvents.length > 0 && (
          <div className="mt-5">
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Why your score changed
            </h3>
            <ul className="mt-2 space-y-1.5">
              {scoreEvents.map((e) => (
                <li key={e.id} className="text-xs leading-relaxed text-muted-foreground">
                  <span className="text-foreground">{e.delta > 0 ? `+${e.delta}` : e.delta}</span>{" "}
                  {e.reason}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
