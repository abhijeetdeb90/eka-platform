import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, FileText, ArrowUpRight, CheckCircle2, Receipt } from "lucide-react";
import { AppScreen } from "@/components/app/AppScreen";
import { formatMoney } from "@/lib/money";
import { financeService } from "@/lib/payments/finance.service";
import { currentUserId } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/app/brand/finance")({
  head: () => ({
    meta: [
      { title: "Brand Campaign Billing & Finance | EKA Growth OS" },
      { name: "description", content: "Review campaign spend, invoices, creator escrow payments, and tax receipts." },
    ],
  }),
  component: BrandFinancePage,
});

function BrandFinancePage() {
  const { data: userId } = useQuery({
    queryKey: ["current-user-id"],
    queryFn: () => currentUserId(),
  });

  const brandId = userId ?? "demo_brand";

  const { data: summary } = useQuery({
    queryKey: ["brand-finance-summary", brandId],
    queryFn: () => financeService.getBrandSpendSummary(brandId),
  });

  const s = summary ?? {
    brand_id: brandId,
    total_campaign_spend_minor: 0,
    payments_settled_minor: 0,
    creator_payments_minor: 0,
    refunds_minor: 0,
    outstanding_amounts_minor: 0,
    currency: "INR" as const,
    invoices: [],
  };

  return (
    <AppScreen eyebrow="Brand Growth OS" title="Campaign Billing & Invoices">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Track campaign budgets, escrow deposits, disbursements to creators, and GST-compliant invoices.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <span className="text-xs uppercase font-medium text-muted-foreground">Total Campaign Spend</span>
          <p className="mt-2 font-display text-2xl font-bold">{formatMoney(s.total_campaign_spend_minor, s.currency)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Gross campaign allocations</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <span className="text-xs uppercase font-medium text-muted-foreground">Settled Payments</span>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatMoney(s.payments_settled_minor, s.currency)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Captured via Razorpay</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <span className="text-xs uppercase font-medium text-muted-foreground">Creator Disbursed</span>
          <p className="mt-2 font-display text-2xl font-bold text-primary">
            {formatMoney(s.creator_payments_minor, s.currency)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Direct artisan/creator compensations</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <span className="text-xs uppercase font-medium text-muted-foreground">Outstanding / Escrow</span>
          <p className="mt-2 font-display text-2xl font-bold">{formatMoney(s.outstanding_amounts_minor, s.currency)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Pending deliverable sign-offs</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-calm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-base font-semibold">Invoices & Statements</h3>
          <span className="text-xs text-muted-foreground">GST-compliant Tax Invoices</span>
        </div>

        <div className="rounded-xl border border-border/80 divide-y divide-border/60">
          <div className="flex items-center justify-between p-4 text-xs">
            <div className="flex items-center gap-3">
              <Receipt className="size-5 text-primary" />
              <div>
                <p className="font-medium">Monthly Platform & Campaign Statement</p>
                <p className="text-muted-foreground text-[11px]">Includes 18% GST breakdown & input tax credit details</p>
              </div>
            </div>
            <span className="rounded bg-muted px-2 py-1 font-mono text-[11px]">Ready</span>
          </div>
        </div>
      </div>
    </AppScreen>
  );
}
