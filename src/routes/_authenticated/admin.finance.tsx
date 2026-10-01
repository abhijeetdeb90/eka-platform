import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Users,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { AppScreen } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMoney } from "@/lib/money";
import { financeService } from "@/lib/payments/finance.service";
import { financialLedgerService } from "@/lib/payments/ledger.service";
import { reconciliationService } from "@/lib/payments/reconciliation.service";
import { auditService } from "@/lib/payments/audit.service";

export const Route = createFileRoute("/_authenticated/admin/finance")({
  head: () => ({
    meta: [
      { title: "EKA Finance & Settlements — Admin Cockpit" },
      { name: "description", content: "Platform financial telemetry, ledger, creator settlements, and reconciliation." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminFinancePage,
});

function AdminFinancePage() {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("overview");

  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["admin-finance-summary"],
    queryFn: () => financeService.getAdminFinanceSummary(),
  });

  const { data: ledgerEntries } = useQuery({
    queryKey: ["admin-ledger-entries"],
    queryFn: () => financialLedgerService.queryEntries({ limit: 50 }),
  });

  const { data: latestReconciliation } = useQuery({
    queryKey: ["admin-reconciliation"],
    queryFn: () => reconciliationService.getLatestReport(),
  });

  const { data: auditLogs } = useQuery({
    queryKey: ["admin-audit-logs"],
    queryFn: () => auditService.queryLogs({ limit: 30 }),
  });

  const reconcileMutation = useMutation({
    mutationFn: async () => {
      return reconciliationService.reconcilePeriod(
        new Date(Date.now() - 30 * 86400 * 1000),
        new Date(),
        [],
      );
    },
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: ["admin-reconciliation"] });
      queryClient.invalidateQueries({ queryKey: ["admin-finance-summary"] });
      if (report.status === "MATCHED") {
        toast.success("Reconciliation complete: Gateway & EKA Ledger are in 100% parity.");
      } else {
        toast.error(`Reconciliation discrepancy detected: ${report.details.discrepancy_count} item(s) mismatched.`);
      }
    },
  });

  const s = summary ?? {
    gmv_minor: 0,
    subscription_revenue_minor: 0,
    platform_revenue_minor: 0,
    creator_payable_minor: 0,
    total_payouts_minor: 0,
    total_refunds_minor: 0,
    failed_payments_count: 0,
    pending_settlements_minor: 0,
    reconciliation_status: "MATCHED",
    currency: "INR",
    generated_at: new Date().toISOString(),
  };

  return (
    <AppScreen eyebrow="Operations & Economics" title="Financial Ledger & Settlements">
      {/* Top Header Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Immutable Double-Entry Ledger · Razorpay Gateway Integration · Zero Floating-Point Arithmetic
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => reconcileMutation.mutate()}
            disabled={reconcileMutation.isPending}
            className="gap-2"
          >
            <RefreshCw className={`size-4 ${reconcileMutation.isPending ? "animate-spin" : ""}`} />
            Run Gateway Reconciliation
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs uppercase font-medium tracking-wider">Gross Merchandise Value</span>
            <DollarSign className="size-4 text-primary" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold">{formatMoney(s.gmv_minor, s.currency)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Total platform transaction volume</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs uppercase font-medium tracking-wider">Subscription Revenue</span>
            <CreditCard className="size-4 text-emerald-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatMoney(s.subscription_revenue_minor, s.currency)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Recurring patron & creator memberships</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs uppercase font-medium tracking-wider">EKA Platform Fees</span>
            <TrendingUp className="size-4 text-indigo-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {formatMoney(s.platform_revenue_minor, s.currency)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Earned marketplace commissions</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs uppercase font-medium tracking-wider">Creator Payable</span>
            <Users className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-amber-600 dark:text-amber-400">
            {formatMoney(s.creator_payable_minor, s.currency)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Net eligible pending payouts</p>
        </div>
      </div>

      {/* Secondary Metrics & Health Bar */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-xs text-muted-foreground uppercase">Settled Payouts</span>
          <p className="mt-1 font-display text-lg font-semibold">{formatMoney(s.total_payouts_minor, s.currency)}</p>
          <span className="text-xs text-muted-foreground">Route & RazorpayX</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-xs text-muted-foreground uppercase">Refunds Processed</span>
          <p className="mt-1 font-display text-lg font-semibold">{formatMoney(s.total_refunds_minor, s.currency)}</p>
          <span className="text-xs text-muted-foreground">Reversed in ledger</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-xs text-muted-foreground uppercase">Reconciliation Status</span>
          <div className="mt-1 flex items-center gap-2">
            {s.reconciliation_status === "MATCHED" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" /> Matched (100% Parity)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                <AlertTriangle className="size-3.5" /> Discrepancy Found
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">Zero silent mutations</span>
        </div>
      </div>

      {/* Tabbed In-Depth Explorer */}
      <div className="mt-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">EKA Financial Architecture</TabsTrigger>
            <TabsTrigger value="ledger">Immutable Ledger</TabsTrigger>
            <TabsTrigger value="reconciliation">Reconciliation Engine</TabsTrigger>
            <TabsTrigger value="audit">Audit Log Trail</TabsTrigger>
          </TabsList>

          {/* Architecture Tab */}
          <TabsContent value="overview">
            <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-calm">
              <h3 className="font-display text-lg font-semibold">Decoupled Payment & Settlement Topology</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                EKA treats payments as a decoupled pipeline. The Razorpay gateway captures inbound funds and executes
                outbound Route/RazorpayX settlements, but <strong>EKA's immutable double-entry ledger is the sole source of truth</strong>.
              </p>

              <div className="my-4 rounded-xl border border-border bg-muted/40 p-4 font-mono text-xs">
                Razorpay Inbound ──▶ Provider Adapter ──▶ EKA Transaction Layer ──▶ Immutable Ledger ──▶ Earnings Engine ──▶ Payout State Machine ──▶ Razorpay Route / RazorpayX
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="rounded-xl border border-border p-4">
                  <h4 className="font-semibold text-sm">Consumer Subscription Model</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Plans structured across Monthly (₹299), Quarterly (₹799), and Annual (₹2,990).
                    Entitlements derive strictly from database billing records on each request, ensuring late or duplicate webhooks cannot corrupt access states.
                  </p>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <h4 className="font-semibold text-sm">Creator Settlement Ledger</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Balances are not stored in generic consumer wallets. Every rupee is tracked via deliverable
                    contracts, platform commission (5–10%), TDS withholding (Section 194J/194O), and verified payout states.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Ledger Tab */}
          <TabsContent value="ledger">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-calm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-lg font-semibold">Double-Entry Financial Transactions</h3>
                  <p className="text-xs text-muted-foreground">Every monetary movement records both Debit and Credit legs.</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {ledgerEntries?.length ?? 0} entries loaded
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="pb-3 font-medium">Txn ID</th>
                      <th className="pb-3 font-medium">Entity</th>
                      <th className="pb-3 font-medium">Source</th>
                      <th className="pb-3 font-medium">Direction</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {ledgerEntries && ledgerEntries.length > 0 ? (
                      ledgerEntries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-muted/30">
                          <td className="py-2.5 font-mono text-[11px] text-primary">{entry.transaction_id}</td>
                          <td className="py-2.5">
                            <span className="capitalize font-medium">{entry.entity_type}</span>{" "}
                            <span className="text-[11px] text-muted-foreground">({entry.entity_id.substring(0, 8)}...)</span>
                          </td>
                          <td className="py-2.5 font-mono capitalize">{entry.source.replace("_", " ")}</td>
                          <td className="py-2.5">
                            {entry.direction === "CREDIT" ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                                <ArrowDownLeft className="size-3" /> CREDIT
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                                <ArrowUpRight className="size-3" /> DEBIT
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 font-mono font-medium">{formatMoney(entry.amount, entry.currency)}</td>
                          <td className="py-2.5">
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold">
                              {entry.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-muted-foreground">
                            {new Date(entry.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-muted-foreground">
                          No ledger entries recorded in this session. Transactions will appear here upon payments or payouts.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Reconciliation Tab */}
          <TabsContent value="reconciliation">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-calm">
              <h3 className="font-display text-lg font-semibold">Razorpay Gateway vs Internal Ledger Parity</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Automated reconciliation scans external webhook/capture collections and cross-checks every paisa against
                the EKA Double-Entry Ledger.
              </p>

              <div className="mt-6 rounded-xl border border-border p-4 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Run Result</span>
                  <span className="text-xs text-muted-foreground">
                    {latestReconciliation ? new Date(latestReconciliation.reconciled_at).toLocaleString() : "Never"}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Provider Total</span>
                    <p className="font-mono text-base font-semibold mt-0.5">
                      {formatMoney(latestReconciliation?.total_provider_collected_minor ?? 0)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ledger Total</span>
                    <p className="font-mono text-base font-semibold mt-0.5">
                      {formatMoney(latestReconciliation?.total_ledger_collected_minor ?? 0)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Parity Discrepancy</span>
                    <p className="font-mono text-base font-semibold mt-0.5 text-emerald-600 dark:text-emerald-400">
                      {formatMoney(latestReconciliation?.discrepancy_amount_minor ?? 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-calm">
              <h3 className="font-display text-lg font-semibold">Financial & Security Audit Trail</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Immutable, append-only logs for administrative changes, payouts, refunds, and webhook events.
              </p>

              <div className="mt-4 space-y-2">
                {auditLogs && auditLogs.length > 0 ? (
                  auditLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-xs">
                      <div>
                        <span className="font-mono text-primary font-medium">{log.audit_id}</span>
                        <span className="mx-2 text-muted-foreground">·</span>
                        <span className="font-semibold capitalize">{log.action}</span>
                        <span className="mx-2 text-muted-foreground">·</span>
                        <span className="text-muted-foreground">Actor: {log.actor_type} ({log.actor_id})</span>
                      </div>
                      <span className="text-muted-foreground">{new Date(log.created_at).toLocaleTimeString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center text-xs text-muted-foreground">No recent audit log entries.</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppScreen>
  );
}
