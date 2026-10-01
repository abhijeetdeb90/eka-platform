import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { AppScreen } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/money";
import { financeService } from "@/lib/payments/finance.service";
import { creatorPayoutsEngine } from "@/lib/payments/payouts.service";
import { currentUserId } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/app/creator/earnings")({
  head: () => ({
    meta: [
      { title: "Creator Earnings & Payout Ledger | EKA Studio" },
      { name: "description", content: "Inspect your earnings, deductions, TDS records, and request eligible payouts." },
    ],
  }),
  component: CreatorEarningsPage,
});

function CreatorEarningsPage() {
  const queryClient = useQueryClient();
  const [requesting, setRequesting] = useState(false);

  const { data: userId } = useQuery({
    queryKey: ["current-user-id"],
    queryFn: () => currentUserId(),
  });

  const creatorId = userId ?? "demo_creator";

  const { data: summary, isLoading } = useQuery({
    queryKey: ["creator-earnings-summary", creatorId],
    queryFn: () => financeService.getCreatorEarningsSummary(creatorId),
  });

  const { data: eligibility } = useQuery({
    queryKey: ["creator-payout-eligibility", creatorId],
    queryFn: () => creatorPayoutsEngine.checkEligibility(creatorId),
  });

  const payoutMutation = useMutation({
    mutationFn: async () => {
      return creatorPayoutsEngine.requestPayout({
        creator_id: creatorId,
      });
    },
    onSuccess: (payout) => {
      toast.success(`Payout request of ${formatMoney(payout.amount_minor, payout.currency)} initiated successfully.`);
      queryClient.invalidateQueries({ queryKey: ["creator-earnings-summary"] });
      queryClient.invalidateQueries({ queryKey: ["creator-payout-eligibility"] });
    },
    onError: (err) => {
      toast.error(`Payout failed: ${String(err)}`);
    },
  });

  const s = summary ?? {
    creator_id: creatorId,
    total_earnings_minor: 0,
    pending_earnings_minor: 0,
    available_balance_minor: 0,
    paid_amount_minor: 0,
    total_deductions_minor: 0,
    currency: "INR" as const,
    payout_status: "active" as const,
    recent_payouts: [],
    recent_earnings: [],
  };

  return (
    <AppScreen eyebrow="Creator Studio" title="Earnings & Settlement Ledger">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Clear, transparent accounting. Track gross campaign value, platform commission, TDS withholding, and net payable.
          </p>
        </div>
        <Button
          onClick={() => payoutMutation.mutate()}
          disabled={!eligibility?.isEligible || payoutMutation.isPending}
          className="gap-2"
        >
          <ArrowUpRight className="size-4" />
          {payoutMutation.isPending ? "Processing..." : "Request Payout"}
        </Button>
      </div>

      {/* Eligibility Callout Banner */}
      {eligibility && !eligibility.isEligible && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="font-medium">Payout Status: Ineligible for immediate release</p>
            <ul className="mt-1 list-disc list-inside text-xs space-y-0.5 opacity-90">
              {eligibility.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <span className="text-xs uppercase font-medium text-muted-foreground">Available Balance</span>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatMoney(s.available_balance_minor, s.currency)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Ready for bank / UPI transfer</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <span className="text-xs uppercase font-medium text-muted-foreground">Total Gross Earned</span>
          <p className="mt-2 font-display text-2xl font-bold">{formatMoney(s.total_earnings_minor, s.currency)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Lifetime campaigns & sessions</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <span className="text-xs uppercase font-medium text-muted-foreground">Total Deductions</span>
          <p className="mt-2 font-display text-2xl font-bold text-muted-foreground">
            {formatMoney(s.total_deductions_minor, s.currency)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Platform fees + TDS taxes</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <span className="text-xs uppercase font-medium text-muted-foreground">Paid Out to Date</span>
          <p className="mt-2 font-display text-2xl font-bold text-primary">{formatMoney(s.paid_amount_minor, s.currency)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Settled via Route / RazorpayX</p>
        </div>
      </div>

      {/* Two-Column Details */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Campaign Earnings Breakdown */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-calm">
          <h3 className="font-display text-base font-semibold">Campaign Deliverables & Royalties</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Calculated via EKA Creator Earnings Engine</p>

          <div className="mt-4 space-y-3">
            {s.recent_earnings.length > 0 ? (
              s.recent_earnings.map((earn) => (
                <div key={earn.id} className="rounded-xl border border-border p-3.5 text-xs">
                  <div className="flex items-center justify-between font-medium">
                    <span className="font-mono text-primary">{earn.earning_id}</span>
                    <span>{formatMoney(earn.net_payable_minor, earn.currency)} Net</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-muted-foreground text-[11px]">
                    <span>Gross: {formatMoney(earn.gross_earning_minor, earn.currency)}</span>
                    <span>Fee: -{formatMoney(earn.platform_fee_minor, earn.currency)}</span>
                    <span>TDS: -{formatMoney(earn.tax_deduction_minor, earn.currency)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-xs text-muted-foreground">No earnings recorded yet.</p>
            )}
          </div>
        </div>

        {/* Payout History & State Machine */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-calm">
          <h3 className="font-display text-base font-semibold">Payout History & Status</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Automated settlement tracking</p>

          <div className="mt-4 space-y-3">
            {s.recent_payouts.length > 0 ? (
              s.recent_payouts.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between rounded-xl border border-border p-3.5 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-primary">{payout.payout_id}</span>
                      <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] uppercase font-semibold">
                        {payout.status}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Method: {payout.method} · {new Date(payout.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-mono font-semibold text-sm">
                    {formatMoney(payout.amount_minor, payout.currency)}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-xs text-muted-foreground">No payouts executed yet.</p>
            )}
          </div>
        </div>
      </div>
    </AppScreen>
  );
}
