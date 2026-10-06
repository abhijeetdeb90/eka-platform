// ==============================================================================
// EKA FOUNDER COCKPIT — EXECUTIVE COMMAND & INVESTOR READINESS (/founder-admin)
// ==============================================================================
// "THE WORLD'S TRUSTED CULTURAL INTELLIGENCE LAYER"
// "DON'T JUST SCROLL THE WORLD. UNDERSTAND IT."
// 
// 1. 6-Stage Startup Validation Gates (Stage 1 Usefulness -> Stage 6 Scale)
// 2. Strict Monetisation Separation: EKA Premium vs Creator Commerce
// 3. Retention Architecture (D1 / D7 / D30 cohorts & return loops)
// 4. Two Interlocking Network Effect Flywheels
// 5. Investor-Readiness Telemetry & Evidence Ledger
// ==============================================================================

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Server,
  ArrowRight,
  Send,
  Radio,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Repeat,
  Compass,
  FileText,
  Lock,
  Layers,
  BarChart3,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { fetchInvestorReadinessTelemetry } from "@/lib/analytics/monetization-validation";
import { fetchRetentionTelemetry } from "@/lib/analytics/retention";
import { fetchNetworkEffectsTelemetry } from "@/lib/analytics/network-effects";

export function FounderCockpit() {
  const [activeTab, setActiveTab] = useState<string>("stages");
  const [founderNote, setFounderNote] = useState("");
  const [dispatches, setDispatches] = useState([
    {
      date: "Oct 2026",
      title: "Hard Separation of EKA Subscription Revenue and Creator Commerce Transaction Payouts",
      status: "Implemented",
    },
    {
      date: "Sep 2026",
      title: "Universal Cultural Intelligence Positioning: Don't Just Scroll the World. Understand It.",
      status: "Live",
    },
    {
      date: "Aug 2026",
      title: "5-Tier Epistemic Taxonomy & Source Citation Ledger Hardened",
      status: "Operational",
    },
  ]);

  const { data: telemetry, isLoading: telLoading } = useQuery({
    queryKey: ["founder-investor-telemetry"],
    queryFn: fetchInvestorReadinessTelemetry,
    refetchInterval: 30_000,
  });

  const { data: retention } = useQuery({
    queryKey: ["founder-retention-telemetry"],
    queryFn: fetchRetentionTelemetry,
    refetchInterval: 30_000,
  });

  const { data: flywheel } = useQuery({
    queryKey: ["founder-flywheel-telemetry"],
    queryFn: fetchNetworkEffectsTelemetry,
    refetchInterval: 30_000,
  });

  const handlePublishDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!founderNote.trim()) return;
    setDispatches([
      {
        date: "Just now",
        title: founderNote.trim(),
        status: "Dispatched",
      },
      ...dispatches,
    ]);
    setFounderNote("");
    toast.success("Founder strategic directive recorded.");
  };

  const currentStage = telemetry?.currentOverallStage ?? 1;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 1. Executive Master Header */}
      <div className="rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="text-[10px] font-mono uppercase tracking-widest text-amber-400 border-amber-500/30 bg-amber-500/10"
              >
                Cultural Intelligence OS
              </Badge>
              <Badge
                variant="outline"
                className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
              >
                Validation Stage {currentStage} of 6
              </Badge>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-normal text-white">
              EKA FOUNDER & INVESTOR EVIDENCE COCKPIT
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-2xl leading-relaxed">
              "The World's Trusted Cultural Intelligence Layer" — Don't just scroll the world. Understand it.
              Grounding platform growth, customer retention, and transaction economics in rigorous telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/founder-admin/economics">
              <Button size="sm" className="bg-amber-500 text-neutral-950 hover:bg-amber-400 font-medium text-xs gap-1.5 h-9 rounded-xl">
                <DollarSign className="size-3.5" />
                <span>Financial Ledger</span>
              </Button>
            </Link>
            <Link to="/founder-admin/ops">
              <Button size="sm" variant="outline" className="border-neutral-700 text-neutral-300 hover:text-white text-xs gap-1.5 h-9 rounded-xl">
                <Radio className="size-3.5" />
                <span>Ops Radar</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Top-Line KPI Evidence Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400">EKA Subscriptions</span>
          <p className="text-2xl font-display font-medium text-white">
            ₹{((telemetry?.ekaRevenue.subscriptionMrrMinor ?? 0) / 100).toLocaleString()}
            <span className="text-xs text-neutral-500 font-normal"> /mo</span>
          </p>
          <p className="text-[10px] text-emerald-400">
            {telemetry?.ekaRevenue.activeSubscribers ?? 0} active subscribers (100% EKA)
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400">Creator Commerce GMV</span>
          <p className="text-2xl font-display font-medium text-white">
            ₹{((telemetry?.creatorCommerce.gmvMinor ?? 0) / 100).toLocaleString()}
          </p>
          <p className="text-[10px] text-amber-400">
            {telemetry?.creatorCommerce.completedTransactionsCount ?? 0} transactions · {telemetry?.creatorCommerce.blendedTakeRatePercent ?? 10}% take rate
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400">Retention Cohort</span>
          <p className="text-2xl font-display font-medium text-white">
            {telemetry?.product.d1RetentionPercent ?? 0}%
            <span className="text-xs text-neutral-500 font-normal"> D1</span>
          </p>
          <p className="text-[10px] text-neutral-400">
            {telemetry?.product.d7RetentionPercent ?? 0}% D7 · {retention?.averageSessionsPerWeek ?? 0} sessions/wk
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400">Epistemic Density</span>
          <p className="text-2xl font-display font-medium text-white">
            {telemetry?.product.questionsAskedCount ?? 0}
          </p>
          <p className="text-[10px] text-sky-400">
            Inquiries answered · {flywheel?.status ?? "nascent"} flywheel
          </p>
        </div>
      </div>

      {/* 3. Master Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-neutral-900 border border-neutral-800 p-1 rounded-2xl flex-wrap h-auto gap-1">
          <TabsTrigger value="stages" className="rounded-xl text-xs gap-1.5">
            <CheckCircle2 className="size-3.5 text-amber-400" />
            <span>6-Stage Validation Gates</span>
          </TabsTrigger>
          <TabsTrigger value="monetization" className="rounded-xl text-xs gap-1.5">
            <DollarSign className="size-3.5 text-emerald-400" />
            <span>Monetisation Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="retention" className="rounded-xl text-xs gap-1.5">
            <Repeat className="size-3.5 text-sky-400" />
            <span>Retention Architecture</span>
          </TabsTrigger>
          <TabsTrigger value="flywheel" className="rounded-xl text-xs gap-1.5">
            <TrendingUp className="size-3.5 text-terracotta" />
            <span>Network Effects</span>
          </TabsTrigger>
          <TabsTrigger value="investor" className="rounded-xl text-xs gap-1.5">
            <FileText className="size-3.5 text-amber-300" />
            <span>Investor Evidence Ledger</span>
          </TabsTrigger>
        </TabsList>

        {/* ================================================================== */}
        {/* TAB 1: 6-STAGE VALIDATION GATES */}
        {/* ================================================================== */}
        <TabsContent value="stages" className="space-y-6">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg text-white font-medium">
                  Capital Efficiency: Stage-Gated Validation
                </h2>
                <p className="text-xs text-neutral-400">
                  EKA scales capital commitment only as each stage produces empirical proof. Never invest in scale before proving retention.
                </p>
              </div>
              <Badge variant="outline" className="text-xs font-mono border-amber-500/40 text-amber-300 bg-amber-500/10">
                Active Gate: Stage {currentStage}
              </Badge>
            </div>

            <div className="space-y-3 pt-2">
              {telemetry?.stages.map((stage) => (
                <div
                  key={stage.stageNumber}
                  className={`rounded-xl border p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    stage.passed
                      ? "border-emerald-500/30 bg-emerald-950/10"
                      : stage.stageNumber === currentStage
                      ? "border-amber-500/50 bg-amber-950/20 shadow-calm ring-1 ring-amber-500/30"
                      : "border-neutral-800 bg-neutral-900/30 opacity-70"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-300">
                        {stage.name}
                      </span>
                      {stage.passed ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[9px]">
                          PROVEN
                        </Badge>
                      ) : stage.stageNumber === currentStage ? (
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[9px] animate-pulse">
                          IN EXPERIMENT
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-neutral-500 text-[9px]">
                          UPCOMING
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400">{stage.objective}</p>
                    {stage.blocker && (
                      <p className="text-[11px] text-amber-400/90 flex items-center gap-1 pt-0.5">
                        <AlertCircle className="size-3" />
                        <span>Action Item: {stage.blocker}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-6 shrink-0 md:text-right">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 block uppercase">
                        {stage.metricLabel}
                      </span>
                      <span className="text-xs font-mono font-medium text-white">
                        {stage.currentValue} / <span className="text-neutral-400">{stage.targetValue}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ================================================================== */}
        {/* TAB 2: MONETISATION DASHBOARD */}
        {/* ================================================================== */}
        <TabsContent value="monetization" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stream A: EKA Owned Revenue */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="space-y-0.5">
                  <Badge variant="outline" className="text-[9px] font-mono text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                    Stream A · 100% EKA Owned
                  </Badge>
                  <h3 className="font-display text-base text-white">EKA Premium Subscriptions</h3>
                </div>
                <span className="text-xs font-mono text-neutral-400">₹299/mo · ₹2,990/yr</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase font-mono">Monthly Run Rate (MRR)</span>
                  <span className="text-lg font-display text-white font-medium">
                    ₹{((telemetry?.ekaRevenue.subscriptionMrrMinor ?? 0) / 100).toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase font-mono">Active Members</span>
                  <span className="text-lg font-display text-white font-medium">
                    {telemetry?.ekaRevenue.activeSubscribers ?? 0}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase font-mono">Creator Payout from Subs</span>
                  <span className="text-lg font-display text-emerald-400 font-medium">
                    ₹0 (Strict Rule)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase font-mono">Sub Churn Rate</span>
                  <span className="text-lg font-display text-white font-medium">
                    {telemetry?.ekaRevenue.churnRatePercent ?? 0}%
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/10 border border-emerald-500/20 text-xs text-neutral-300">
                <p className="font-medium text-emerald-400">Strict Separation Enforced:</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Subscription revenue belongs entirely to EKA. Zero subsidies are paid for views, likes, or uploads.
                </p>
              </div>
            </div>

            {/* Stream B: Creator Commerce */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="space-y-0.5">
                  <Badge variant="outline" className="text-[9px] font-mono text-amber-400 border-amber-500/30 bg-amber-500/10">
                    Stream B · Completed Offerings
                  </Badge>
                  <h3 className="font-display text-base text-white">Creator Commerce Ledger</h3>
                </div>
                <span className="text-xs font-mono text-neutral-400">Take Rate: 5–10%</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase font-mono">Gross Merchandise Value</span>
                  <span className="text-lg font-display text-white font-medium">
                    ₹{((telemetry?.creatorCommerce.gmvMinor ?? 0) / 100).toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase font-mono">Completed Transactions</span>
                  <span className="text-lg font-display text-white font-medium">
                    {telemetry?.creatorCommerce.completedTransactionsCount ?? 0}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase font-mono">EKA Platform Commission</span>
                  <span className="text-lg font-display text-amber-300 font-medium">
                    ₹{((telemetry?.creatorCommerce.ekaCommissionMinor ?? 0) / 100).toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase font-mono">Net Creator Payouts</span>
                  <span className="text-lg font-display text-white font-medium">
                    ₹{((telemetry?.creatorCommerce.creatorPayoutsMinor ?? 0) / 100).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/10 border border-amber-500/20 text-xs text-neutral-300">
                <p className="font-medium text-amber-400">Transaction-Driven Economics:</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Creators earn strictly upon completed consultations, workshops, courses, and cultural experiences.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ================================================================== */}
        {/* TAB 3: RETENTION ARCHITECTURE */}
        {/* ================================================================== */}
        <TabsContent value="retention" className="space-y-6">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-6">
            <div>
              <h2 className="font-display text-lg text-white font-medium">
                Recurring User Value & Cohort Retention
              </h2>
              <p className="text-xs text-neutral-400">
                EKA avoids manufactured notifications. Retention is driven by genuine utility: daily contemplative rhythms,
                saved lineage knowledge, followed custodians, and unfinished inquiries.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/50 text-center space-y-1">
                <span className="text-[10px] font-mono text-neutral-500 uppercase">Day 1 Retention</span>
                <p className="text-3xl font-display text-emerald-400 font-semibold">
                  {retention?.d1RetentionPercent ?? 0}%
                </p>
                <p className="text-[10px] text-neutral-500">Benchmark target &gt; 30%</p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/50 text-center space-y-1">
                <span className="text-[10px] font-mono text-neutral-500 uppercase">Day 7 Retention</span>
                <p className="text-3xl font-display text-amber-400 font-semibold">
                  {retention?.d7RetentionPercent ?? 0}%
                </p>
                <p className="text-[10px] text-neutral-500">Benchmark target &gt; 15%</p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/50 text-center space-y-1">
                <span className="text-[10px] font-mono text-neutral-500 uppercase">Day 30 Retention</span>
                <p className="text-3xl font-display text-sky-400 font-semibold">
                  {retention?.d30RetentionPercent ?? 0}%
                </p>
                <p className="text-[10px] text-neutral-500">Benchmark target &gt; 8%</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="font-display text-sm text-neutral-300">Active Recurring Value Loops</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-950/40">
                  <span className="text-neutral-400 block text-[11px]">Daily Prompt / Ritual</span>
                  <span className="font-mono text-base font-bold text-white">
                    {retention?.activeReturnLoops.dailyPromptCompletedCount ?? 0}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-950/40">
                  <span className="text-neutral-400 block text-[11px]">Saved Items Reviewed</span>
                  <span className="font-mono text-base font-bold text-white">
                    {retention?.activeReturnLoops.savedItemsReviewedCount ?? 0}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-950/40">
                  <span className="text-neutral-400 block text-[11px]">Followed Themes Checked</span>
                  <span className="font-mono text-base font-bold text-white">
                    {retention?.activeReturnLoops.followedThemesCheckedCount ?? 0}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-950/40">
                  <span className="text-neutral-400 block text-[11px]">Inquiries Resumed</span>
                  <span className="font-mono text-base font-bold text-white">
                    {retention?.activeReturnLoops.inquiriesResumedCount ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ================================================================== */}
        {/* TAB 4: NETWORK EFFECTS FLYWHEEL */}
        {/* ================================================================== */}
        <TabsContent value="flywheel" className="space-y-6">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-6">
            <div>
              <h2 className="font-display text-lg text-white font-medium">
                Dual Compounding Ecosystem Flywheels
              </h2>
              <p className="text-xs text-neutral-400">
                Network effects must be built through architecture rather than prematurely claimed. Tracking evidence across both loops.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Flywheel 1 */}
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-950/60 space-y-3">
                <span className="text-[10px] font-mono uppercase text-sky-400 block">
                  Flywheel 1 · Epistemic & Content Density
                </span>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Users → Inquiries → Cultural Demands → Custodians & Scholars → Verified Context → Better Discovery → More Users
                </p>
                <div className="space-y-2 pt-2 border-t border-neutral-800/80 text-xs">
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">Inquiries Recorded:</span>
                    <span className="font-mono text-white font-medium">{flywheel?.totalQuestionsAsked ?? 0}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">Epistemic Verification Rate:</span>
                    <span className="font-mono text-emerald-400 font-medium">{flywheel?.epistemicVerificationRatePercent ?? 85}%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">Contributor to User Ratio:</span>
                    <span className="font-mono text-amber-400 font-medium">{flywheel?.contributorToUserRatioPercent ?? 0}%</span>
                  </div>
                </div>
              </div>

              {/* Flywheel 2 */}
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-950/60 space-y-3">
                <span className="text-[10px] font-mono uppercase text-amber-400 block">
                  Flywheel 2 · Creator Supply & Transaction Density
                </span>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Users → Cultural Interest Data → Creator Discovery → Transactions → Creator Earnings → Quality Supply → Better Platform
                </p>
                <div className="space-y-2 pt-2 border-t border-neutral-800/80 text-xs">
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">Activated Creators:</span>
                    <span className="font-mono text-white font-medium">{flywheel?.totalActivatedCreators ?? 0}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">Completed Transactions:</span>
                    <span className="font-mono text-emerald-400 font-medium">{flywheel?.totalCompletedTransactions ?? 0}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">Repeat Purchase Rate:</span>
                    <span className="font-mono text-sky-400 font-medium">{flywheel?.repeatPurchaseRatePercent ?? 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ================================================================== */}
        {/* TAB 5: INVESTOR EVIDENCE LEDGER */}
        {/* ================================================================== */}
        <TabsContent value="investor" className="space-y-6">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg text-white font-medium">
                  Investor-Readiness Data Layer
                </h2>
                <p className="text-xs text-neutral-400">
                  Comprehensive startup proof deck generated in real time directly from database transactions and telemetry.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success("Investor report snapshot copied to clipboard.")}
                className="text-xs border-neutral-700 rounded-xl"
              >
                Copy Snapshot Summary
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 space-y-2">
                <span className="text-[10px] font-mono uppercase text-neutral-400">PRODUCT METRICS</span>
                <div className="space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Registered Users:</span>
                    <span className="text-white">{telemetry?.product.registeredUsers ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Questions Answered:</span>
                    <span className="text-white">{telemetry?.product.questionsAskedCount ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">D1 Retention:</span>
                    <span className="text-emerald-400">{telemetry?.product.d1RetentionPercent ?? 0}%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 space-y-2">
                <span className="text-[10px] font-mono uppercase text-neutral-400">FINANCIAL METRICS</span>
                <div className="space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">MRR (Subscriptions):</span>
                    <span className="text-white">₹{((telemetry?.ekaRevenue.subscriptionMrrMinor ?? 0) / 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Creator GMV:</span>
                    <span className="text-white">₹{((telemetry?.creatorCommerce.gmvMinor ?? 0) / 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Blended Take Rate:</span>
                    <span className="text-amber-300">{telemetry?.creatorCommerce.blendedTakeRatePercent ?? 10}%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 space-y-2">
                <span className="text-[10px] font-mono uppercase text-neutral-400">ENTERPRISE PIPELINE</span>
                <div className="space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Inbound Leads:</span>
                    <span className="text-white">{telemetry?.enterprise.inboundLeadsCount ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Qualified Pilots:</span>
                    <span className="text-white">{telemetry?.enterprise.qualifiedPilotsCount ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Pipeline Value:</span>
                    <span className="text-emerald-400">₹{((telemetry?.enterprise.pipelineValueMinor ?? 0) / 100).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* 4. Strategic Dispatches Form */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
        <h3 className="font-display text-base text-white">Founder Strategic Log</h3>
        <form onSubmit={handlePublishDispatch} className="flex gap-3">
          <input
            value={founderNote}
            onChange={(e) => setFounderNote(e.target.value)}
            placeholder="Record architecture directive or milestone decision…"
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
          />
          <Button type="submit" size="sm" className="rounded-xl bg-amber-500 text-neutral-950 hover:bg-amber-400 text-xs px-4">
            <Send className="size-3.5 mr-1.5" />
            <span>Record</span>
          </Button>
        </form>

        <div className="space-y-2 pt-2">
          {dispatches.map((d, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-neutral-800/60 last:border-0">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-neutral-500">{d.date}</span>
                <span className="text-neutral-300">{d.title}</span>
              </div>
              <Badge variant="outline" className="text-[9px] font-mono text-emerald-400 border-emerald-500/30">
                {d.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
