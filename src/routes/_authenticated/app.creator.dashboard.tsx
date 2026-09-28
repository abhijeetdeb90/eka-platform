import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Share2,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Info,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { calculateQCS } from "@/lib/economy/contribution-score";

export const Route = createFileRoute("/_authenticated/app/creator/dashboard")({
  component: CreatorDashboardPage,
});

export function CreatorDashboardPage() {
  const [requestingPayout, setRequestingPayout] = useState(false);

  // Sample verified signals for the active creator
  const signals = {
    qualifiedReads: 1240,
    savesAndShares: 550,
    meaningfulComments: 68,
    sourceCitations: 14,
    peerVerifications: 8,
    repeatLearningSessions: 210,
    reactions: 340,
    disputePenalties: 1,
  };

  const qcs = calculateQCS(signals);

  const earnings = {
    total: 18420,
    pending: 6200,
    available: 12220,
    sources: [
      { name: "Knowledge Reward Pool", amount: 7800, percentage: 42, icon: Award },
      { name: "Circle Memberships", amount: 3200, percentage: 24, icon: Users },
      { name: "Fan Support & Gratitude", amount: 2100, percentage: 17, icon: DollarSign },
      { name: "Brand Collaborations", amount: 900, percentage: 11, icon: TrendingUp },
      { name: "Sacred Objects & Commerce", amount: 620, percentage: 6, icon: BookOpen },
    ],
  };

  const handleRequestPayout = () => {
    setRequestingPayout(true);
    setTimeout(() => {
      setRequestingPayout(false);
      toast.success("Payout request of ₹12,220 submitted for compliance & bank review.");
    }, 900);
  };

  return (
    <div className="container-eka mx-auto max-w-6xl space-y-8 px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl tracking-tight">Creator & Contributor Studio</h1>
            <Badge
              variant="secondary"
              className="gap-1.5 border-primary/30 bg-primary/10 text-primary"
            >
              <ShieldCheck className="size-3.5" />
              <span>Trust Tier: {qcs.trustTierLabel}</span>
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Transparent attribution across Attention, Knowledge, and Trust economies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/app/wallet">
              <span>View Ledger</span>
            </Link>
          </Button>
          <Button onClick={handleRequestPayout} disabled={requestingPayout} className="gap-1.5">
            <ArrowUpRight className="size-4" />
            <span>Request Payout (₹{earnings.available.toLocaleString()})</span>
          </Button>
        </div>
      </div>

      {/* Top Level Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Earnings</CardDescription>
            <CardTitle className="font-display text-3xl">
              ₹{earnings.total.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Lifetime credited from all 5 streams
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Available for Payout</CardDescription>
            <CardTitle className="font-display text-3xl text-primary">
              ₹{earnings.available.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Clear of 30-day dispute reserve
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Knowledge Score (QCS)</CardDescription>
            <CardTitle className="font-display text-3xl text-terracotta">
              {qcs.score} / 100
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Multi-signal weighted quality tier
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Verified Contributions</CardDescription>
            <CardTitle className="font-display text-3xl">18 Works</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Citations verified in Canonical Graph
          </CardContent>
        </Card>
      </div>

      {/* Tri-Partite Creator Economy Overview */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-calm space-y-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-primary font-semibold">
            The Tri-Partite Model
          </span>
          <h2 className="font-display text-xl">Three Separate Ways to Earn on EKA</h2>
          <p className="text-xs text-muted-foreground">
            EKA rewards genuine consumption, knowledge enhancement, and community trust.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              <h3 className="font-display text-sm font-semibold">Attention Economy</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Earn from qualified reading/viewing time (≥45s), completion, saves, shares, and repeat
              consumption.
            </p>
            <span className="text-xs font-semibold text-primary block">₹6,800 credited</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-amber-500" />
              <h3 className="font-display text-sm font-semibold">Knowledge Economy</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Earn for making underlying knowledge more valuable: primary citations, translations,
              archival context, and corrections.
            </p>
            <span className="text-xs font-semibold text-primary block">₹7,200 credited</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <h3 className="font-display text-sm font-semibold">Trust Economy</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Earn for improving reliability: peer verification, source validation, lineage
              stewardship, and dispute resolution.
            </p>
            <span className="text-xs font-semibold text-primary block">₹4,420 credited</span>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown & Why I Earned This Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Revenue Sources */}
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Streams</CardTitle>
            <CardDescription>
              Earnings from community membership pools, fan support, and sacred commerce.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {earnings.sources.map((src) => {
              const Icon = src.icon;
              return (
                <div key={src.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <Icon className="size-4 text-muted-foreground" />
                      {src.name}
                    </span>
                    <span className="font-semibold">₹{src.amount.toLocaleString()}</span>
                  </div>
                  <Progress value={src.percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Right: Transparent "Why Did I Earn This?" Ledger */}
        <Card className="border-border/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Why Did I Earn This?</CardTitle>
              <Badge variant="outline" className="text-xs">
                Transparent Ledger
              </Badge>
            </div>
            <CardDescription>
              Itemized signals powering your Qualified Contribution Score (QCS) this month.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-sand/30 p-2.5">
                <span className="flex items-center gap-2 text-foreground/90">
                  <BookOpen className="size-4 text-primary" />+ 1,240 Qualified learning sessions
                  (dwell ≥ 45s)
                </span>
                <span className="font-semibold text-primary">+25 pts</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-sand/30 p-2.5">
                <span className="flex items-center gap-2 text-foreground/90">
                  <Bookmark className="size-4 text-saffron" />+ 380 Community saves & collections
                </span>
                <span className="font-semibold text-primary">+18.5 pts</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-sand/30 p-2.5">
                <span className="flex items-center gap-2 text-foreground/90">
                  <Share2 className="size-4 text-terracotta" />+ 170 External quote citations &
                  shares
                </span>
                <span className="font-semibold text-primary">+15 pts</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-sand/30 p-2.5">
                <span className="flex items-center gap-2 text-foreground/90">
                  <CheckCircle2 className="size-4 text-forest" />+ 12 Peer-verified canonical
                  scriptures cited
                </span>
                <span className="font-semibold text-primary">+14 pts</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-sand/30 p-2.5">
                <span className="flex items-center gap-2 text-foreground/90">
                  <CheckCircle2 className="size-4 text-forest" />+ 3 Community corrections resolved
                </span>
                <span className="font-semibold text-primary">+4.5 pts</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-2.5 text-destructive">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="size-4" />- 1 Disputed claim penalized
                </span>
                <span className="font-semibold">-5.0 pts</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Polyphonic Multi-Contributor Attribution Card */}
      <Card className="border-border/80 bg-sand/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="size-4 text-terracotta" />
            <CardTitle className="text-base">Polyphonic Knowledge Attribution in Action</CardTitle>
          </div>
          <CardDescription>
            On EKA, knowledge artifacts share economic rewards with the entire lineage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border/80 bg-card p-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <p className="font-medium text-sm">
                  Example: "Assamese Satriya Monastic Dance & Rituals"
                </p>
                <p className="text-xs text-muted-foreground">
                  Generated ₹4,500 from Knowledge Pool this cycle
                </p>
              </div>
              <Badge variant="outline">Multi-Party Split</Badge>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-5 text-xs">
              <div className="rounded-lg bg-sand/40 p-2.5">
                <p className="font-semibold text-foreground">Creator (You)</p>
                <p className="text-muted-foreground mt-0.5">Filmed & Explained</p>
                <p className="mt-2 text-sm font-bold text-primary">50% (₹2,250)</p>
              </div>
              <div className="rounded-lg bg-sand/40 p-2.5">
                <p className="font-semibold text-foreground">Primary Source</p>
                <p className="text-muted-foreground mt-0.5">Satra Manuscript</p>
                <p className="mt-2 text-sm font-bold text-foreground/80">15% (₹675)</p>
              </div>
              <div className="rounded-lg bg-sand/40 p-2.5">
                <p className="font-semibold text-foreground">Scholar Verifier</p>
                <p className="text-muted-foreground mt-0.5">Lineage Validated</p>
                <p className="mt-2 text-sm font-bold text-foreground/80">15% (₹675)</p>
              </div>
              <div className="rounded-lg bg-sand/40 p-2.5">
                <p className="font-semibold text-foreground">Community Steward</p>
                <p className="text-muted-foreground mt-0.5">Context Guardian</p>
                <p className="mt-2 text-sm font-bold text-foreground/80">10% (₹450)</p>
              </div>
              <div className="rounded-lg bg-sand/40 p-2.5">
                <p className="font-semibold text-foreground">Translator</p>
                <p className="text-muted-foreground mt-0.5">Assamese → English</p>
                <p className="mt-2 text-sm font-bold text-foreground/80">10% (₹450)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
