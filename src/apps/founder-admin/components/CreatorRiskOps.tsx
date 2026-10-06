import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  DollarSign,
  TrendingDown,
  Lock,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsAdmin } from "@/hooks/useRole";
import { formatINR } from "@/lib/billing";
import { timeAgo } from "@/lib/eka";
import { calculateMonthlyPool } from "@/lib/economy/knowledge-pool";
import { TRUST_TIERS } from "@/lib/economy/contribution-score";

interface MockFlag {
  id: string;
  creator_id: string;
  creator_name: string;
  flag_type: "reaction_velocity" | "device_cluster" | "circular_ring" | "bot_session";
  severity: "critical" | "high" | "medium" | "low";
  details: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
  created_at: string;
}

interface MockKycProfile {
  user_id: string;
  creator_name: string;
  pan_number: string;
  pan_verified: boolean;
  tds_rate: number;
  payout_method: "upi" | "bank_transfer";
  payout_identifier: string;
  penny_drop_verified: boolean;
  kyc_status: "pending" | "verified" | "rejected";
}

const INITIAL_FLAGS: MockFlag[] = [
  {
    id: "flag-001",
    creator_id: "usr-8812",
    creator_name: "Rahul Verma (Bhakti Kirtan)",
    flag_type: "reaction_velocity",
    severity: "high",
    details:
      "48 reactions received within 42 seconds from a single IP cluster in Indore. Dwell time < 4 seconds.",
    status: "open",
    created_at: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
  },
  {
    id: "flag-002",
    creator_id: "usr-4921",
    creator_name: "Tanya Sen (Sacred Geometry)",
    flag_type: "circular_ring",
    severity: "medium",
    details:
      "Reciprocal save loop detected between 3 accounts sharing identical browser user-agent tokens.",
    status: "investigating",
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: "flag-003",
    creator_id: "usr-1102",
    creator_name: "Devendra Joshi",
    flag_type: "bot_session",
    severity: "critical",
    details:
      "Automated headless Chromium session detected repeatedly scraping and synthesizing text without human mouse movement.",
    status: "open",
    created_at: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
  },
];

const INITIAL_KYC: MockKycProfile[] = [
  {
    user_id: "usr-7731",
    creator_name: "Acharya Someshwar Shastri",
    pan_number: "ABCPS1234F",
    pan_verified: true,
    tds_rate: 10.0,
    payout_method: "upi",
    payout_identifier: "someshwar@oksbi",
    penny_drop_verified: true,
    kyc_status: "verified",
  },
  {
    user_id: "usr-8812",
    creator_name: "Rahul Verma",
    pan_number: "BLIPV9876K",
    pan_verified: false,
    tds_rate: 10.0,
    payout_method: "bank_transfer",
    payout_identifier: "HDFC0001242 · A/C ...9842",
    penny_drop_verified: false,
    kyc_status: "pending",
  },
  {
    user_id: "usr-4921",
    creator_name: "Tanya Sen",
    pan_number: "AAECS5541L",
    pan_verified: false,
    tds_rate: 10.0,
    payout_method: "upi",
    payout_identifier: "tanyasen@icici",
    penny_drop_verified: true,
    kyc_status: "pending",
  },
];

export function CreatorRiskOps() {
  const { data: isAdmin, isLoading } = useIsAdmin();
  const queryClient = useQueryClient();

  const [flags, setFlags] = useState<MockFlag[]>(INITIAL_FLAGS);
  const [kycList, setKycList] = useState<MockKycProfile[]>(INITIAL_KYC);
  const [activeTab, setActiveTab] = useState<string>("anomalies");
  const [dryRunApproved, setDryRunApproved] = useState(false);
  const [disputeReserveHeld] = useState(4825000); // ₹48,250

  // Pool simulation: 1,280 active members @ ₹299/mo
  const poolSim = calculateMonthlyPool({
    membershipsGross: 1280 * 29900, // ₹3,82,720
    fanSupportGross: 4500000, // ₹45,000
    coursesGross: 8200000, // ₹82,000
    brandMarketplaceGross: 3500000, // ₹35,000
    commerceGross: 2400000, // ₹24,000
    sponsorGross: 0,
  });

  const handleFlagAction = (flagId: string, action: "resolve" | "dismiss" | "freeze") => {
    setFlags((prev) =>
      prev.map((f) => {
        if (f.id === flagId) {
          return {
            ...f,
            status:
              action === "dismiss"
                ? "dismissed"
                : action === "freeze"
                  ? "investigating"
                  : "resolved",
          };
        }
        return f;
      }),
    );
    if (action === "freeze") {
      toast.error("Creator payouts frozen and QCS penalty points applied.");
    } else if (action === "dismiss") {
      toast.success("Flag dismissed as false positive.");
    } else {
      toast.success("Flag marked as resolved.");
    }
  };

  const handleKycAction = (userId: string, action: "verify" | "reject") => {
    setKycList((prev) =>
      prev.map((k) => {
        if (k.user_id === userId) {
          return {
            ...k,
            kyc_status: action === "verify" ? "verified" : "rejected",
            pan_verified: action === "verify",
            penny_drop_verified: action === "verify",
          };
        }
        return k;
      }),
    );
    toast.success(
      action === "verify" ? "KYC and PAN successfully verified." : "KYC request rejected.",
    );
  };

  const handleAuthorizeBatch = () => {
    setDryRunApproved(true);
    toast.success(
      "Monthly Payout Batch authorized for settlement. Bank payout files generated with TDS withholding.",
    );
  };

  const openFlagsCount = flags.filter((f) => f.status === "open").length;
  const pendingKycCount = kycList.filter((k) => k.kyc_status === "pending").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 border-b border-neutral-800 pb-3">
          <Link to="/founder-admin" className="hover:text-amber-400">
            Founder Cockpit
          </Link>
          <span>/</span>
          <span className="text-white font-medium">Creator Risk & Integrity</span>
        </div>

        {/* Top Summary Metrics */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 shadow-calm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Open Fraud Flags
              </span>
              <ShieldAlert className="size-4 text-destructive" />
            </div>
            <p className="mt-2 font-display text-3xl text-destructive">{openFlagsCount}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Bot velocity & circular engagement alerts
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-calm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Pending KYC
              </span>
              <FileCheck2 className="size-4 text-primary" />
            </div>
            <p className="mt-2 font-display text-3xl">{pendingKycCount}</p>
            <p className="mt-1 text-xs text-muted-foreground">PAN & Bank penny-drop verification</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-calm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Dispute Reserves
              </span>
              <Lock className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 font-display text-3xl">{formatINR(disputeReserveHeld)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              5% rolling dispute & refund reserve
            </p>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-calm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-primary font-medium">
                Net EKA Platform Revenue
              </span>
              <DollarSign className="size-4 text-primary" />
            </div>
            <p className="mt-2 font-display text-3xl text-primary">
              {formatINR(poolSim.ekaOwnedRevenue.totalNetEkaRevenue)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              100% of subscriptions + transaction commission net
            </p>
          </div>
        </section>

        {/* Operational Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="anomalies" className="text-xs">
              <AlertTriangle className="mr-1.5 size-3.5" />
              <span>Bot & Velocity ({openFlagsCount})</span>
            </TabsTrigger>
            <TabsTrigger value="kyc" className="text-xs">
              <FileCheck2 className="mr-1.5 size-3.5" />
              <span>KYC & PAN ({pendingKycCount})</span>
            </TabsTrigger>
            <TabsTrigger value="disputes" className="text-xs">
              <TrendingDown className="mr-1.5 size-3.5" />
              <span>Dispute Reserves</span>
            </TabsTrigger>
            <TabsTrigger value="payouts" className="text-xs">
              <DollarSign className="mr-1.5 size-3.5" />
              <span>Monthly Batch Dry Run</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Bot & Velocity Anomalies */}
          <TabsContent value="anomalies" className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-calm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
                <div>
                  <h3 className="font-display text-lg">
                    Bot Velocity & Engagement Integrity Queue
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Algorithmic anomaly flags triggered by burst reactions, rapid scroll bounces, or
                    circular rings.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success("Refreshed integrity event stream.")}
                >
                  <RefreshCw className="mr-1.5 size-3.5" />
                  Refresh
                </Button>
              </div>

              <div className="mt-4 space-y-3">
                {flags.map((f) => (
                  <div
                    key={f.id}
                    className={`rounded-xl border p-4 transition-all ${
                      f.status === "open"
                        ? f.severity === "critical"
                          ? "border-destructive/50 bg-destructive/5"
                          : "border-border bg-card"
                        : "border-border/40 bg-muted/20 opacity-75"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{f.creator_name}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                              f.severity === "critical"
                                ? "bg-destructive text-destructive-foreground"
                                : f.severity === "high"
                                  ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {f.severity}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground">
                            {f.flag_type}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-foreground/90">{f.details}</p>
                        <p className="mt-2 text-[11px] text-muted-foreground">
                          Logged: {timeAgo(f.created_at)} · Status: <strong>{f.status}</strong>
                        </p>
                      </div>

                      {f.status === "open" && (
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleFlagAction(f.id, "freeze")}
                            className="text-xs"
                          >
                            Freeze & Penalize
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFlagAction(f.id, "dismiss")}
                            className="text-xs"
                          >
                            Dismiss (False Pos)
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleFlagAction(f.id, "resolve")}
                            className="text-xs"
                          >
                            Resolve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: KYC & PAN Tax Compliance */}
          <TabsContent value="kyc" className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-calm">
              <div className="border-b border-border/70 pb-4">
                <h3 className="font-display text-lg">
                  Creator Tax (PAN) & Penny-Drop Verifications
                </h3>
                <p className="text-xs text-muted-foreground">
                  Statutory Indian Income Tax Section 194J compliance. 10% TDS deduction is applied
                  on verified PAN; unverified PAN incurs mandatory 20% Section 206AA withholding.
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {kycList.map((k) => (
                  <div
                    key={k.user_id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{k.creator_name}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            k.kyc_status === "verified"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : k.kyc_status === "rejected"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {k.kyc_status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>
                          PAN:{" "}
                          <code className="font-mono font-medium text-foreground">
                            {k.pan_number}
                          </code>
                        </span>
                        <span>Payout: {k.payout_identifier}</span>
                        <span>TDS Rate: {k.tds_rate}%</span>
                        <span>Penny Drop: {k.penny_drop_verified ? "Verified ✓" : "Pending"}</span>
                      </div>
                    </div>

                    {k.kyc_status === "pending" && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleKycAction(k.user_id, "verify")}
                          className="text-xs gap-1.5"
                        >
                          <CheckCircle2 className="size-3.5" />
                          <span>Approve KYC & PAN</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleKycAction(k.user_id, "reject")}
                          className="text-xs text-destructive hover:bg-destructive/10"
                        >
                          <XCircle className="size-3.5 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: Dispute Reserves & Penalties */}
          <TabsContent value="disputes" className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-calm">
              <h3 className="font-display text-lg">Dispute Management & Rolling Reserve</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Protects the platform from fraudulent chargebacks and scholarly misattribution
                claims. EKA maintains a 5% rolling reserve from gross platform inflows.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Total Reserve Held
                  </p>
                  <p className="mt-1 font-display text-2xl">{formatINR(disputeReserveHeld)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Released after 60 days on rolling schedule
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Active Content Disputes
                  </p>
                  <p className="mt-1 font-display text-2xl">0</p>
                  <p className="mt-1 text-xs text-emerald-600">
                    All lineage citations substantiated
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Average Resolution Time
                  </p>
                  <p className="mt-1 font-display text-2xl">&lt; 14h</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Peer-steward verification ladder
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: Monthly Batch Dry Run & Settlement */}
          <TabsContent value="payouts" className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
                <div>
                  <h3 className="font-display text-lg">
                    Monthly Knowledge Pool Dry Run Simulation
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Aggregates subscription inflows, applies statutory deductions, calculates
                    7-signal QCS scores, and computes net payouts.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handleAuthorizeBatch}
                  disabled={dryRunApproved}
                  className="gap-2"
                >
                  <Lock className="size-3.5" />
                  <span>
                    {dryRunApproved ? "Batch Authorized & Locked" : "Authorize Payout Batch"}
                  </span>
                </Button>
              </div>

              {/* Economic Waterfall Breakdown */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground block">
                    Gross Platform Inflows
                  </span>
                  <span className="font-display text-lg">{formatINR(poolSim.grossInflows)}</span>
                </div>
                <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground block">
                    Statutory Deductions (GST + Processing + Reserve)
                  </span>
                  <span className="font-display text-lg text-muted-foreground">
                    {formatINR(poolSim.statutoryDeductions.totalDeductions)}
                  </span>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5">
                  <span className="text-[11px] uppercase tracking-wider text-primary block">
                    Net EKA Platform Revenue (Subscriptions + Commission)
                  </span>
                  <span className="font-display text-lg text-primary">
                    {formatINR(poolSim.ekaOwnedRevenue.totalNetEkaRevenue)}
                  </span>
                </div>
                <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground block">
                    Direct Creator Commissions (Marketplace / Bookings)
                  </span>
                  <span className="font-display text-lg">
                    {formatINR(poolSim.directCreatorEarnings)}
                  </span>
                </div>
              </div>

              {/* Creator Payout Dry Run Table */}
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                    <tr>
                      <th className="p-3">Creator / Contributor</th>
                      <th className="p-3">Trust Tier</th>
                      <th className="p-3">QCS Score</th>
                      <th className="p-3">Gross Earnings</th>
                      <th className="p-3">10% TDS</th>
                      <th className="p-3 text-right">Net Payable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr>
                      <td className="p-3 font-medium">Acharya Someshwar Shastri</td>
                      <td className="p-3 text-emerald-600">Tier 3 (Expert 1.6x)</td>
                      <td className="p-3 font-mono">88.4 / 100</td>
                      <td className="p-3">{formatINR(4250000)}</td>
                      <td className="p-3 text-muted-foreground">{formatINR(425000)}</td>
                      <td className="p-3 text-right font-semibold text-emerald-600">
                        {formatINR(3825000)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Ananya Goswami</td>
                      <td className="p-3 text-emerald-600">Tier 2 (Trusted 1.35x)</td>
                      <td className="p-3 font-mono">74.2 / 100</td>
                      <td className="p-3">{formatINR(2840000)}</td>
                      <td className="p-3 text-muted-foreground">{formatINR(284000)}</td>
                      <td className="p-3 text-right font-semibold text-emerald-600">
                        {formatINR(2556000)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Dr. Arundhati Sundaresan</td>
                      <td className="p-3 text-emerald-600">Tier 4 (Archive 2.0x)</td>
                      <td className="p-3 font-mono">94.8 / 100</td>
                      <td className="p-3">{formatINR(6400000)}</td>
                      <td className="p-3 text-muted-foreground">{formatINR(640000)}</td>
                      <td className="p-3 text-right font-semibold text-emerald-600">
                        {formatINR(5760000)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {dryRunApproved && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="size-4 shrink-0" />
                  <span>
                    Batch authorized. Payout files encrypted and staged for gateway batch release.
                  </span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
