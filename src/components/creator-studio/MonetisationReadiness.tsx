import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Wallet,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  Info,
  CheckCircle2,
  FileSpreadsheet,
  Building,
  TrendingUp,
  BookOpen,
  Award,
  Share2,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PLATFORM_COMMISSION } from "@/lib/billing";

interface MonetisationReadinessProps {
  grossEarningsPaise?: number;
  netPayablePaise?: number;
  payoutStatus?: string;
}

export function MonetisationReadiness({
  grossEarningsPaise = 0,
  netPayablePaise = 0,
  payoutStatus = "unconfigured",
}: MonetisationReadinessProps) {
  const hasLiveTransactions = grossEarningsPaise > 0;
  const isGatewayConfigured = Boolean(
    import.meta.env.VITE_RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
      {/* 1. Header & Crucial Disclosure */}
      <div className="border-b border-border/60 pb-5 space-y-2">
        <Badge variant="outline" className="text-[10px] font-mono uppercase border-amber-500/40 text-amber-600">
          <Info className="size-3 mr-1 inline" />
          Commerce & Monetisation Status
        </Badge>
        <h2 className="font-serif text-xl font-semibold text-foreground">
          Platform Economics & Monetisation Readiness
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Transparent double-entry ledger accounting. EKA never simulates fake earnings or promises guaranteed creator income.
        </p>

        {/* Required Disclosure */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-foreground/90 space-y-1">
          <p className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
            <AlertCircle className="size-4 text-amber-600 shrink-0" />
            Important Monetisation Notice
          </p>
          <p className="text-muted-foreground leading-relaxed">
            An <strong>EKA+ subscription</strong> grants access to Creator Studio workspace, deep audience analytics,
            and Ask EKA AI research tools. <strong>EKA+ itself does not guarantee creator revenue or earnings.</strong>
            Creator income arises solely when seekers purchase your paid workshops, ticketed gatherings, cultural consultations,
            or verified artisan offerings.
          </p>
        </div>
      </div>

      {/* 2. Tri-Partite Creator Economy Streams */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-semibold text-foreground">
              Tri-Partite Creator Economy Model
            </h3>
            <p className="text-xs text-muted-foreground">
              Three interconnected economic streams rewarding reach, cultural depth, and verifiability.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[10px] border-primary/40 text-primary">
              Trust Tier: Custodian
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="rounded-2xl border-border/80 bg-card p-4 space-y-2 shadow-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <h4 className="font-serif font-semibold text-sm">Attention Economy</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Earn from genuine audience engagement, verified video watch time, and community reach.
            </p>
            <div className="pt-1 border-t border-border/60 text-[11px] font-mono text-muted-foreground">
              Direct Seeker Attention
            </div>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-card p-4 space-y-2 shadow-xs">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-saffron" />
              <h4 className="font-serif font-semibold text-sm">Knowledge Economy</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Share in 85% subscription pools when your documented traditions and stories are cited or researched.
            </p>
            <div className="pt-1 border-t border-border/60 text-[11px] font-mono text-muted-foreground">
              85% Knowledge Pool Share
            </div>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-card p-4 space-y-2 shadow-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-forest" />
              <h4 className="font-serif font-semibold text-sm">Trust Economy</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Multipliers powered by your verifiability, peer citations, community consensus, and stewardship.
            </p>
            <div className="pt-1 border-t border-border/60 text-[11px] font-mono text-muted-foreground">
              Verified Lineage & QCS
            </div>
          </Card>
        </div>

        {/* Qualified Contribution Score Card */}
        <div className="rounded-2xl border border-border/80 bg-sand/20 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Epistemic Verification Metric
            </span>
            <p className="font-serif font-semibold text-sm text-foreground">
              Qualified Contribution Score (QCS)
            </p>
            <p className="text-xs text-muted-foreground">
              Transparent multi-signal score tracking research rigor, peer validations, and genuine community utility.
            </p>
          </div>
          <div className="text-right shrink-0">
            <Badge className="bg-primary text-primary-foreground font-mono text-xs">
              QCS: Active
            </Badge>
          </div>
        </div>
      </div>

      {/* 3. Polyphonic Multi-Contributor Attribution Card */}
      <Card className="border-border/80 bg-sand/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Info className="size-4 text-terracotta" />
            <CardTitle className="text-base font-serif">Polyphonic Knowledge Attribution in Action</CardTitle>
          </div>
          <CardDescription className="text-xs">
            On EKA, cultural knowledge artifacts share economic rewards transparently across the entire lineage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border/80 bg-card p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/60 pb-3 gap-2">
              <div>
                <p className="font-medium text-sm">
                  Example: "Assamese Satriya Monastic Dance & Rituals"
                </p>
                <p className="text-xs text-muted-foreground">
                  Illustrative breakdown from Knowledge Pool distribution cycle
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono shrink-0">Multi-Party Split</Badge>
            </div>

            <div className="mt-3 grid gap-2.5 sm:grid-cols-5 text-xs">
              <div className="rounded-lg bg-sand/40 p-2.5">
                <p className="font-semibold text-foreground">Creator (You)</p>
                <p className="text-muted-foreground text-[10px] mt-0.5">Filmed & Explained</p>
                <p className="mt-1.5 text-xs font-bold text-primary">50%</p>
              </div>
              <div className="rounded-lg bg-sand/40 p-2.5">
                <p className="font-semibold text-foreground">Primary Source</p>
                <p className="text-muted-foreground text-[10px] mt-0.5">Satra Manuscript</p>
                <p className="mt-1.5 text-xs font-bold text-foreground/80">15%</p>
              </div>
              <div className="rounded-lg bg-sand/40 p-2.5">
                <p className="font-semibold text-foreground">Scholar Verifier</p>
                <p className="text-muted-foreground text-[10px] mt-0.5">Lineage Validated</p>
                <p className="mt-1.5 text-xs font-bold text-foreground/80">15%</p>
              </div>
              <div className="rounded-lg bg-sand/40 p-2.5">
                <p className="font-semibold text-foreground">Community Steward</p>
                <p className="text-muted-foreground text-[10px] mt-0.5">Context Guardian</p>
                <p className="mt-1.5 text-xs font-bold text-foreground/80">10%</p>
              </div>
              <div className="rounded-lg bg-sand/40 p-2.5">
                <p className="font-semibold text-foreground">Translator</p>
                <p className="text-muted-foreground text-[10px] mt-0.5">Regional Dialect</p>
                <p className="mt-1.5 text-xs font-bold text-foreground/80">10%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Platform Commission Structure */}
      <div className="space-y-3">
        <h3 className="font-serif text-base font-semibold text-foreground">
          Platform Commission Rates
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="rounded-2xl border-border/80 bg-card p-5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-serif font-semibold text-sm">Cultural Services & Guidance</span>
              <Badge variant="secondary" className="font-mono text-xs">
                {PLATFORM_COMMISSION.servicesRatePercent}% Commission
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              5% platform fee on consultations, lineage mentorship, guided workshops, and 1-on-1 teachings.
              The creator retains 95% of transaction proceeds.
            </p>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-card p-5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-serif font-semibold text-sm">Artisan Crafts & Marketplace</span>
              <Badge variant="secondary" className="font-mono text-xs">
                {PLATFORM_COMMISSION.marketplaceRatePercent}% Commission
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              10% platform fee on physical craft items, traditional textiles, and ritual documentation.
              The creator retains 90% of transaction proceeds.
            </p>
          </Card>
        </div>
      </div>

      {/* 5. Verified Ledger Balances (Real Data) */}
      <div className="space-y-4">
        <h3 className="font-serif text-base font-semibold text-foreground flex items-center gap-2">
          <Wallet className="size-4 text-primary" />
          <span>Recorded Financial Ledger Status</span>
        </h3>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
            <span className="text-[11px] font-mono text-muted-foreground uppercase">Gross Bookings</span>
            <p className="text-2xl font-bold font-display text-foreground">
              ₹{(grossEarningsPaise / 100).toFixed(2)}
            </p>
            <p className="text-[10px] text-muted-foreground">From verified completed transactions</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
            <span className="text-[11px] font-mono text-muted-foreground uppercase">Net Available Balance</span>
            <p className="text-2xl font-bold font-display text-emerald-600">
              ₹{(netPayablePaise / 100).toFixed(2)}
            </p>
            <p className="text-[10px] text-muted-foreground">After platform fees & TDS withholding</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
            <span className="text-[11px] font-mono text-muted-foreground uppercase">Payment Gateway</span>
            <p className="text-sm font-semibold text-foreground mt-2">
              {isGatewayConfigured ? "Connected (Razorpay)" : "Pending Configuration"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {isGatewayConfigured ? "Live payment capture enabled" : "Missing server keys"}
            </p>
          </div>
        </div>

        {!hasLiveTransactions && (
          <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-6 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              No commercial transactions have been recorded on this creator account yet.
            </p>
            <p className="text-[11px] text-muted-foreground/80 max-w-md mx-auto">
              When a seeker books your cultural offering or purchases an artisan item, the transaction will be
              automatically entered into the EKA double-entry ledger with transparent commission deductions.
            </p>
          </div>
        )}
      </div>

      {/* 6. Payout Prerequisites Checklist */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
        <h4 className="font-serif text-sm font-semibold text-foreground">
          What is needed to activate live creator payouts?
        </h4>

        <div className="space-y-2.5 text-xs text-muted-foreground">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>EKA+ Creator Studio:</strong> Active subscription verified.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock className="size-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>Bank Details & PAN:</strong> Required prior to initiating first payout to ensure 194O / TDS tax compliance.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock className="size-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>Payment Gateway Webhooks:</strong> Real settlements require deployed server webhook handlers.
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
          <Button asChild variant="outline" size="sm" className="rounded-full text-xs">
            <Link to="/app/creator/earnings">View Detailed Settlement Ledger</Link>
          </Button>
          <span className="text-[11px] text-muted-foreground">
            Questions? Contact support@eka-platform.org
          </span>
        </div>
      </div>
    </div>
  );
}
