import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Wallet as WalletIcon, Sparkles, Globe, HeartHandshake } from "lucide-react";
import { toast } from "sonner";
import { usePlatformConfig } from "@/hooks/usePlatformConfig";
import { AppScreen, EmptyState } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CREATOR_POOL,
  PAYOUT_REVIEW_COPY,
  scoreBreakdown,
  TXN_LABEL,
  fetchFund,
  fetchMyScore,
  fetchTransactions,
  fetchWallet,
  formatINR,
  topUp,
} from "@/lib/pay";
import { track } from "@/lib/analytics";
import { downloadReceipts, receiptTotals, receiptsFor } from "@/lib/receipts";
import { Download } from "lucide-react";
import { PoolTransparency } from "@/components/app/PoolTransparency";

export const Route = createFileRoute("/_authenticated/app/wallet")({
  head: () => ({
    meta: [
      { title: "Your EKA wallet, earnings and the Peace & Knowledge Fund | EKA" },
      {
        name: "description",
        content:
          "Tip creators, buy conversations, see exactly what EKA takes, and follow where the Peace & Knowledge Fund goes.",
      },
    ],
  }),
  component: WalletScreen,
});

function WalletScreen() {
  const qc = useQueryClient();
  const [amount, setAmount] = useState("499");

  const { data: wallet } = useQuery({ queryKey: ["wallet"], queryFn: fetchWallet });
  const { data: txns } = useQuery({ queryKey: ["wallet-txns"], queryFn: fetchTransactions });
  const { data: score } = useQuery({ queryKey: ["creator-score"], queryFn: fetchMyScore });
  const { data: fund } = useQuery({ queryKey: ["fund"], queryFn: fetchFund });

  const receipts = receiptsFor(txns ?? []);
  const totals = receiptTotals(receipts);

  const rows = txns ?? [];
  const config = usePlatformConfig();
  const FEE_ALLOCATION = config.allocation;
  const PLATFORM_FEE_PERCENT = config.feePercent;
  const out = rows.filter((t) => t.amount_cents < 0);
  const fees = out.reduce((n, t) => n + t.fee_cents, 0);
  const impact = {
    earned: rows
      .filter((t) => t.amount_cents > 0 && t.kind !== "topup")
      .reduce((n, t) => n + t.amount_cents, 0),
    shared: out.reduce((n, t) => n + Math.abs(t.amount_cents), 0),
    toCreators: out.reduce((n, t) => n + Math.abs(t.amount_cents) - t.fee_cents, 0),
    fees,
    community: Math.round(
      (fees *
        ((FEE_ALLOCATION.find((f) => f.key === "Peace & Knowledge Fund")?.percent ?? 0) +
          (FEE_ALLOCATION.find((f) => f.key === "Community projects")?.percent ?? 0))) /
        100,
    ),
  };
  const breakdown = scoreBreakdown(score ?? null);

  const add = async () => {
    const cents = Math.round((Number(amount) || 0) * 100);
    if (cents <= 0) return;
    await topUp(cents);
    track("wallet_topup", { amount: cents });
    toast.success("Added. No card is charged yet — this is the test payment path.");
    await qc.invalidateQueries({ queryKey: ["wallet"] });
    await qc.invalidateQueries({ queryKey: ["wallet-txns"] });
  };

  return (
    <AppScreen eyebrow="EKA Pay" title="Wallet">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-calm">
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <WalletIcon className="size-4 text-primary" aria-hidden /> Balance
        </p>
        <p className="mt-2 font-display text-4xl">{formatINR(wallet?.balance_cents ?? 0)}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Input
            className="w-32"
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button size="sm" onClick={add}>
            Add funds
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          A real card charge needs an India-compatible provider connected to EKA. Until then this is
          a working ledger on the test path — every movement is recorded, nothing is charged.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card/60 p-5">
        <p className="text-sm">EKA Platform Fee — {PLATFORM_FEE_PERCENT}%</p>
        <p className="mt-1 text-xs text-muted-foreground">
          One fee, on everything: services and sessions, paid conversations, creator memberships and
          gratitude. On a {formatINR(100000)} service you pay {formatINR(110000)} —{" "}
          {formatINR(100000)} to the creator, {formatINR(10000)} to EKA. It is always on screen
          before you pay, never explained afterwards.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Payouts above {formatINR(config.payoutReviewThresholdCents)}: {PAYOUT_REVIEW_COPY}
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
        <h2 className="flex items-center gap-2 font-display text-lg">
          <HeartHandshake className="size-4 text-primary" aria-hidden /> Your Eka Impact
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Not a leaderboard. What your participation has actually moved.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ["Earned", impact.earned],
            ["Shared", impact.shared],
            ["To community work", impact.community],
            ["Reached other creators", impact.toCreators],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl border border-border p-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </p>
              <p className="mt-1 font-display text-xl">{formatINR(Number(value))}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-border pt-3">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            How EKA spent its {formatINR(impact.fees)} of fees
          </p>
          <ul className="mt-2 space-y-2">
            {FEE_ALLOCATION.map((f) => (
              <li key={f.key} className="flex items-center justify-between gap-3 text-xs">
                <span className="min-w-0 truncate">{f.key}</span>
                <span className="shrink-0 text-muted-foreground">
                  {formatINR(Math.round((impact.fees * f.percent) / 100))} · {f.percent}% of the fee
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg">Movements</h2>
        {(txns?.length ?? 0) === 0 ? (
          <EmptyState
            title="Nothing yet"
            body="Tips, purchases and earnings appear here as they happen."
          />
        ) : (
          txns?.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm">{TXN_LABEL[t.kind] ?? t.kind}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(t.created_at).toLocaleString()}
                  {t.fee_cents > 0 && ` · fee ${formatINR(t.fee_cents)}`}
                </p>
              </div>
              <span
                className={
                  t.amount_cents < 0 ? "text-sm text-muted-foreground" : "text-sm text-primary"
                }
              >
                {t.amount_cents < 0 ? "−" : "+"}
                {formatINR(Math.abs(t.amount_cents))}
              </span>
            </div>
          ))
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg">Audit trail</h2>
            <p className="text-xs text-muted-foreground">
              Every movement traced to the action that caused it. Download the receipts and
              reconcile them line by line.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={receipts.length === 0}
            onClick={() => downloadReceipts(receipts)}
          >
            <Download className="mr-1.5 size-4" aria-hidden /> Download receipts
          </Button>
        </div>

        {receipts.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Nothing to reconcile yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-xs">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="pb-2 font-normal">Action</th>
                  <th className="pb-2 font-normal">Reference</th>
                  <th className="pb-2 text-right font-normal">Gross</th>
                  <th className="pb-2 text-right font-normal">EKA fee</th>
                  <th className="pb-2 text-right font-normal">Net</th>
                  <th className="pb-2 text-right font-normal">Fund</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((r) => (
                  <tr key={r.id} className="border-t border-border align-top">
                    <td className="py-2 pr-3">
                      {r.action}
                      <span className="block text-[11px] text-muted-foreground">
                        {new Date(r.date).toLocaleString()} · {r.status}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground">{r.reference}</td>
                    <td className="py-2 text-right">{formatINR(r.gross)}</td>
                    <td className="py-2 text-right text-muted-foreground">{formatINR(r.fee)}</td>
                    <td className="py-2 text-right">{formatINR(r.net)}</td>
                    <td className="py-2 text-right text-muted-foreground">{formatINR(r.fund)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border">
                  <td className="py-2" colSpan={2}>
                    Totals
                  </td>
                  <td className="py-2 text-right">{formatINR(totals.gross)}</td>
                  <td className="py-2 text-right">{formatINR(totals.fee)}</td>
                  <td className="py-2 text-right">{formatINR(totals.net)}</td>
                  <td className="py-2 text-right">{formatINR(totals.fund)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
        <p className="mt-3 text-[11px] text-muted-foreground">
          Receipt IDs match the ledger exactly, so a downloaded row can always be traced back to its
          movement.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
        <h2 className="flex items-center gap-2 font-display text-lg">
          <Sparkles className="size-4 text-primary" aria-hidden /> Creator Score
        </h2>
        <p className="mt-1 font-display text-3xl">
          {breakdown.total}
          <span className="text-base text-muted-foreground"> / 1000</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Raw views, likes and follower counts are absent on purpose. Depth is rewarded; virality is
          not.
        </p>
        <ul className="mt-4 space-y-3">
          {breakdown.parts.map((p) => (
            <li key={p.key}>
              <p className="flex items-center justify-between gap-3 text-sm">
                <span>
                  {p.label} <span className="text-xs text-muted-foreground">· {p.percent}%</span>
                </span>
                <span className="text-muted-foreground">{p.value}</span>
              </p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted" role="presentation">
                <div className="h-full rounded-full bg-primary" style={{ width: `${p.value}%` }} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{p.detail}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-xl border border-border bg-card/60 p-4">
          <p className="text-sm">Creator Pool</p>
          <p className="mt-1 text-xs text-muted-foreground">{CREATOR_POOL.note}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Funded by: {CREATOR_POOL.fundedBy} It is a bonus on top of your earnings,{" "}
            {CREATOR_POOL.cadence} — never a substitute for being paid for your work.
          </p>
        </div>
      </section>

      <PoolTransparency />

      <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
        <h2 className="flex items-center gap-2 font-display text-lg">
          <Globe className="size-4 text-primary" aria-hidden /> Where EKA's {PLATFORM_FEE_PERCENT}%
          goes
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          These are percentages of EKA's own fee, not of a creator's earnings.
        </p>
        <ul className="mt-3 space-y-2">
          {FEE_ALLOCATION.map((f) => (
            <li key={f.key} className="border-t border-border pt-2 first:border-0 first:pt-0">
              <p className="flex items-center justify-between gap-3 text-sm">
                {f.key} <span className="text-muted-foreground">{f.percent}%</span>
              </p>
              <p className="text-xs text-muted-foreground">{f.body}</p>
            </li>
          ))}
        </ul>
        {(fund?.length ?? 0) > 0 && (
          <div className="mt-4 space-y-1 border-t border-border pt-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Recent allocations
            </p>
            {fund?.slice(0, 8).map((f) => (
              <p
                key={f.id}
                className="flex items-center justify-between gap-3 text-xs text-muted-foreground"
              >
                <span>
                  {f.period} · {f.category}
                </span>
                <span>
                  {formatINR(f.amount_cents)} · {f.status}
                </span>
              </p>
            ))}
          </div>
        )}
      </section>
    </AppScreen>
  );
}
