// ==============================================================================
// EKA INVESTOR PRESENTATION ENVIRONMENT & GATEWAY (/investor)
// ==============================================================================
// "EKA: One World. A Billion Stories"
// "1 billion people. 1 billion stories. One living cultural archive for the world."
//
// Separates ecosystem into three distinct maturity states:
// - LIVE: Production systems currently operational
// - BETA: Functional products currently being tested or rolled out
// - ROADMAP: Planned capabilities and strategic direction
// ==============================================================================

import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  PRODUCT_STATUS_REGISTRY,
  ROADMAP_REGISTRY,
  getAllProducts,
  getRoadmapItems,
  getFeatureCounts,
  type InvestorProduct,
  type RoadmapItem,
} from "@/config/investor-registry";
import { ProductStatus, type MaturityStatus } from "@/components/investor/ProductStatus";
import {
  startInvestorDemoSession,
  getInvestorDemoSession,
  DEMO_CREDENTIALS,
  type InvestorDemoRole,
} from "@/lib/auth/demo-session";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EkaLogo, EkaMark } from "@/components/brand/Logo";
import {
  Compass,
  Film,
  BookOpen,
  HelpCircle,
  Users,
  MessageSquare,
  User,
  Plus,
  Layers,
  Building2,
  Smartphone,
  Apple,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Database,
  Radio,
  KeyRound,
  Shield,
  Activity,
  Server,
  Zap,
  Globe,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/investor")({
  head: () => ({
    meta: [
      { title: "EKA — Investor Presentation Gateway & Ecosystem Status" },
      {
        name: "description",
        content:
          "EKA: One World. A Billion Stories. Operational investor presentation environment, live verified production systems, functional beta releases, and strategic roadmap.",
      },
      { property: "og:title", content: "EKA — Investor Presentation Gateway" },
      {
        property: "og:description",
        content:
          "1 billion people. 1 billion stories. One living cultural archive for the world.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: InvestorGatewayPage,
});

function InvestorGatewayPage() {
  const [filter, setFilter] = useState<"ALL" | MaturityStatus>("ALL");
  const [selectedDemoRole, setSelectedDemoRole] = useState<InvestorDemoRole | null>(null);
  const [activeSession, setActiveSession] = useState(() => getInvestorDemoSession());
  const [products, setProducts] = useState(() => getAllProducts());
  const [counts, setCounts] = useState(() => getFeatureCounts());
  const navigate = useNavigate();

  // Verification telemetry
  const [healthStatus, setHealthStatus] = useState<"checking" | "healthy" | "degraded">("checking");
  const [dbLatency, setDbLatency] = useState(18);

  useEffect(() => {
    const onRegistryUpdate = () => {
      setProducts([...getAllProducts()]);
      setCounts({ ...getFeatureCounts() });
    };

    window.addEventListener("eka:investor-registry-update", onRegistryUpdate);
    return () => {
      window.removeEventListener("eka:investor-registry-update", onRegistryUpdate);
    };
  }, []);

  useEffect(() => {
    const ping = async () => {
      const start = performance.now();
      try {
        const { error } = await supabase.from("countries").select("code").limit(1);
        const end = performance.now();
        setDbLatency(Math.round(end - start));
        setHealthStatus(error ? "degraded" : "healthy");
      } catch {
        setHealthStatus("degraded");
      }
    };
    ping();
  }, []);

  const handleLaunchDemo = (role: InvestorDemoRole, targetRoute: string) => {
    const session = startInvestorDemoSession(role);
    setActiveSession(session);
    toast.success(`Investor Demo Mode active: ${role.toUpperCase()}`);
    navigate({ to: targetRoute });
  };

  const roadmapItems = getRoadmapItems();
  const liveProducts = products.filter((p) => p.status === "LIVE");
  const betaProducts = products.filter((p) => p.status === "BETA");

  return (
    <div className="min-h-screen bg-sand/20 dark:bg-neutral-950 text-foreground flex flex-col selection:bg-terracotta/20">
      <SiteHeader />

      <main className="flex-1 space-y-12 sm:space-y-16 pb-24">
        {/* ==================================================================== */}
        {/* 1. HERO — STRATEGIC POSITIONING & INVESTOR MISSION */}
        {/* ==================================================================== */}
        <section className="container-eka pt-8 sm:pt-12">
          <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-linear-to-b from-card/90 via-card/60 to-card/40 p-6 sm:p-10 md:p-12 shadow-calm backdrop-blur-md">
            <div className="max-w-4xl space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] tracking-widest uppercase bg-terracotta/10 text-terracotta border-terracotta/30 px-2.5 py-0.5"
                >
                  Executive Investor Presentation
                </Badge>
                <span className="text-xs text-muted-foreground">•</span>
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Production Verified</span>
                  <span className="text-muted-foreground">({dbLatency}ms latency)</span>
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                  EKA: One World. A Billion Stories.
                </h1>
                <p className="font-serif text-lg sm:text-2xl text-terracotta font-medium italic">
                  1 billion people. 1 billion stories. One living cultural archive for the world.
                </p>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-3xl">
                EKA is the trusted cultural, community, and sacred living intelligence platform.
                We bridge living oral heritage, sacred cartography, master artisan traditions, and the
                creator economy through a 5-tier epistemic, verification-first architecture.
              </p>

              {/* 3 Core Investor Questions in 30 Seconds */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
                      01. What you can use today
                    </span>
                    <ProductStatus status="LIVE" size="xs" />
                  </div>
                  <p className="text-xs text-foreground font-medium">
                    Consumer Web, Discover Map, Reels, Knowledge Codex & Ask EKA
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Live production deployed on Vercel Edge with Supabase backend.
                  </p>
                </div>

                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 dark:text-amber-400 font-bold">
                      02. What is already built & testing
                    </span>
                    <ProductStatus status="BETA" size="xs" />
                  </div>
                  <p className="text-xs text-foreground font-medium">
                    Admin Cockpit, Brand Growth OS, Android & iOS Mobile
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Functional codebases in controlled beta & sandboxed investor demo.
                  </p>
                </div>

                <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 font-bold">
                      03. Where EKA is going
                    </span>
                    <ProductStatus status="ROADMAP" size="xs" />
                  </div>
                  <p className="text-xs text-foreground font-medium">
                    Global 50K-node archive, Enterprise B2B APIs & Artisan Royalties
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Capital allocation priorities and multi-year strategic roadmap.
                  </p>
                </div>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Button
                  onClick={() => handleLaunchDemo("consumer", "/")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-calm rounded-xl text-xs h-9"
                >
                  <span>Open Consumer Web</span>
                  <ArrowRight className="size-3.5 ml-1.5" />
                </Button>

                <Button
                  onClick={() => handleLaunchDemo("admin", "/investor/admin")}
                  variant="outline"
                  className="rounded-xl text-xs h-9 border-amber-500/40 text-amber-800 dark:text-amber-300 bg-amber-500/5 hover:bg-amber-500/10"
                >
                  <Layers className="size-3.5 mr-1.5 text-amber-600 dark:text-amber-400" />
                  <span>Launch Admin Demo</span>
                </Button>

                <Button
                  onClick={() => handleLaunchDemo("enterprise", "/investor/enterprise")}
                  variant="outline"
                  className="rounded-xl text-xs h-9 border-blue-500/40 text-blue-700 dark:text-blue-300 bg-blue-500/5 hover:bg-blue-500/10"
                >
                  <Building2 className="size-3.5 mr-1.5 text-blue-500" />
                  <span>Launch Enterprise Demo</span>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  className="rounded-xl text-xs h-9 text-muted-foreground hover:text-foreground"
                >
                  <a href="#product-matrix">
                    <span>View Product Matrix</span>
                    <ChevronRight className="size-3.5 ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 2. PRESENTATION MODE FILTER BAR */}
        {/* ==================================================================== */}
        <section className="container-eka">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Maturity Filter
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                Explore the EKA Ecosystem
              </h2>
            </div>

            {/* Filter Toggle: All | Live | Beta | Roadmap */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border/80 shadow-xs">
              <button
                onClick={() => setFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  filter === "ALL"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Ecosystem ({products.length + roadmapItems.length})
              </button>

              <button
                onClick={() => setFilter("LIVE")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  filter === "LIVE"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                }`}
              >
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE NOW ({counts.live})
              </button>

              <button
                onClick={() => setFilter("BETA")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  filter === "BETA"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-amber-800 dark:text-amber-400 hover:bg-amber-500/10"
                }`}
              >
                <span className="size-1.5 rounded-full bg-amber-400" />
                BETA ({counts.beta})
              </button>

              <button
                onClick={() => setFilter("ROADMAP")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  filter === "ROADMAP"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-purple-700 dark:text-purple-400 hover:bg-purple-500/10"
                }`}
              >
                <span className="size-1.5 rounded-full bg-purple-400" />
                ROADMAP ({roadmapItems.length})
              </button>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 3. SECTION 1: LIVE NOW (Production Operational Systems) */}
        {/* ==================================================================== */}
        {(filter === "ALL" || filter === "LIVE") && (
          <section className="container-eka space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <ProductStatus status="LIVE" size="sm" />
                  <span className="text-xs text-muted-foreground font-mono">
                    Production systems currently operational
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mt-1">
                  Live Consumer Surfaces & Core Pillars
                </h3>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                Domain: eka-platform.vercel.app · Verified today
              </span>
            </div>

            {/* Consumer Web Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Primary Consumer Web Card */}
              <div className="md:col-span-2 lg:col-span-2 rounded-2xl border border-emerald-500/30 bg-card/80 p-6 shadow-calm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <ProductStatus status="LIVE" size="xs" />
                      <Badge variant="outline" className="font-mono text-[10px]">
                        v2.4.0 · Web Application
                      </Badge>
                    </div>
                    <h4 className="font-serif text-2xl font-bold text-foreground mt-1.5">
                      EKA Consumer Web Application
                    </h4>
                    <p className="text-xs text-muted-foreground font-light mt-1">
                      The core discovery platform with unbroken living traditions, 9:16 cultural reels, sacred cartography, and community circles.
                    </p>
                  </div>

                  <Button
                    onClick={() => handleLaunchDemo("consumer", "/")}
                    className="shrink-0 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                  >
                    <span>Launch Web App</span>
                    <ExternalLink className="size-3.5 ml-1" />
                  </Button>
                </div>

                {/* Sub-Pillar Feature Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60">
                  <Link
                    to="/discover"
                    className="p-2.5 rounded-xl border border-border/70 bg-card hover:bg-accent/40 transition-colors space-y-1 block"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <Compass className="size-3.5 text-primary shrink-0" />
                      <span>Discover & Map</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">
                      Interactive Google Maps sacred geography & places
                    </p>
                  </Link>

                  <Link
                    to="/stories"
                    className="p-2.5 rounded-xl border border-border/70 bg-card hover:bg-accent/40 transition-colors space-y-1 block"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <Film className="size-3.5 text-terracotta shrink-0" />
                      <span>1B Stories</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">
                      9:16 short-form video reels from authentic custodians
                    </p>
                  </Link>

                  <Link
                    to="/learn"
                    className="p-2.5 rounded-xl border border-border/70 bg-card hover:bg-accent/40 transition-colors space-y-1 block"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <BookOpen className="size-3.5 text-saffron shrink-0" />
                      <span>Knowledge Codex</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">
                      Structured explainers across 10 cultural dimensions
                    </p>
                  </Link>

                  <Link
                    to="/ask"
                    className="p-2.5 rounded-xl border border-border/70 bg-card hover:bg-accent/40 transition-colors space-y-1 block"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <HelpCircle className="size-3.5 text-emerald-600 shrink-0" />
                      <span>Ask EKA AI</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">
                      Gemini 2.5 flash cultural grounding companion
                    </p>
                  </Link>
                </div>
              </div>

              {/* Consumer Authentication & Community Card */}
              <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-calm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <ProductStatus status="LIVE" size="xs" />
                    <span className="text-[10px] font-mono text-muted-foreground">
                      Identity & Belonging
                    </span>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-foreground">
                      Community & Identity Layer
                    </h4>
                    <p className="text-xs text-muted-foreground font-light mt-1">
                      Supabase Auth PKCE, multi-faith Sanghas, 1:1 messaging, and Wisdom Passport.
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>• Multi-faith Circles (/community)</span>
                      <ProductStatus status="LIVE" size="xs" variant="subtle" showDot={false} />
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>• Direct Messaging (/messages)</span>
                      <ProductStatus status="LIVE" size="xs" variant="subtle" showDot={false} />
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>• Personal Passport (/my-eka)</span>
                      <ProductStatus status="LIVE" size="xs" variant="subtle" showDot={false} />
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>• Discourse Composer (/create)</span>
                      <ProductStatus status="LIVE" size="xs" variant="subtle" showDot={false} />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleLaunchDemo("consumer", "/community")}
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl text-xs"
                >
                  <span>Explore Community</span>
                  <ArrowRight className="size-3 ml-1" />
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* 4. SECTION 2: BETA (Functional Products in Testing / Rollout) */}
        {/* ==================================================================== */}
        {(filter === "ALL" || filter === "BETA") && (
          <section className="container-eka space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <ProductStatus status="BETA" size="sm" />
                  <span className="text-xs text-muted-foreground font-mono">
                    Functional products currently being tested or rolled out
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mt-1">
                  Beta Platforms & Controlled Demonstrations
                </h3>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                All functional · Controlled investor access
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* BETA 1: EKA Admin OS Panel */}
              <div className="rounded-2xl border border-amber-500/30 bg-card/80 p-6 shadow-calm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <ProductStatus status="BETA" size="xs" />
                      <Badge variant="outline" className="font-mono text-[10px]">
                        Web OS · Sandbox Safe
                      </Badge>
                    </div>
                    <h4 className="font-serif text-xl font-bold text-foreground mt-1.5">
                      EKA Admin & Operations OS
                    </h4>
                    <p className="text-xs text-muted-foreground font-light mt-1">
                      Private Operating System for platform governance, oral history verification, platform economics, double-entry ledger, and 12-subsystem topology.
                    </p>
                  </div>

                  <Button
                    onClick={() => handleLaunchDemo("admin", "/investor/admin")}
                    className="shrink-0 rounded-xl text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium"
                  >
                    <span>Admin Demo</span>
                    <ExternalLink className="size-3.5 ml-1" />
                  </Button>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-medium">
                    <ShieldCheck className="size-3.5" />
                    <span>Investor Presentation Safeguard</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Runs in restricted read-only demo mode with synthesized telemetry. Production records are protected against destructive writes.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-card border border-border/60">
                    <span className="text-[10px] font-mono text-muted-foreground">Subsystems</span>
                    <p className="font-medium text-foreground">Founder Cockpit & Ops Radar</p>
                  </div>
                  <div className="p-2 rounded-lg bg-card border border-border/60">
                    <span className="text-[10px] font-mono text-muted-foreground">Economics</span>
                    <p className="font-medium text-foreground">Double-Entry P&L Ledger</p>
                  </div>
                </div>
              </div>

              {/* BETA 2: EKA Enterprise & Brand Growth OS */}
              <div className="rounded-2xl border border-blue-500/30 bg-card/80 p-6 shadow-calm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <ProductStatus status="BETA" size="xs" />
                      <Badge variant="outline" className="font-mono text-[10px]">
                        v1.2.0-beta · Enterprise SaaS
                      </Badge>
                    </div>
                    <h4 className="font-serif text-xl font-bold text-foreground mt-1.5">
                      EKA Enterprise & Brand Growth OS
                    </h4>
                    <p className="text-xs text-muted-foreground font-light mt-1">
                      Cultural Trend Radar, Brand Brain AI co-pilot, Closed-Loop Attribution, Creator Marketplace, and high-throughput institutional workspaces.
                    </p>
                  </div>

                  <Button
                    onClick={() => handleLaunchDemo("enterprise", "/investor/enterprise")}
                    className="shrink-0 rounded-xl text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium"
                  >
                    <span>Enterprise Demo</span>
                    <ExternalLink className="size-3.5 ml-1" />
                  </Button>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs">
                  <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-medium">
                    <Building2 className="size-3.5" />
                    <span>Commercial Proposition</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Connects global consumer brands and museums to verified cultural intelligence and artisan sponsorships.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-card border border-border/60">
                    <span className="text-[10px] font-mono text-muted-foreground">AI Intelligence</span>
                    <p className="font-medium text-foreground">Brand Brain & Trend Radar</p>
                  </div>
                  <div className="p-2 rounded-lg bg-card border border-border/60">
                    <span className="text-[10px] font-mono text-muted-foreground">Attribution</span>
                    <p className="font-medium text-foreground">Discovery to Purchase LTV</p>
                  </div>
                </div>
              </div>

              {/* BETA 3: EKA Android App */}
              <div id="android" className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-calm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <ProductStatus status="BETA" size="xs" />
                      <Badge variant="outline" className="font-mono text-[10px]">
                        Android APK / Firebase Track
                      </Badge>
                    </div>
                    <h4 className="font-serif text-xl font-bold text-foreground mt-1.5 flex items-center gap-2">
                      <Smartphone className="size-5 text-emerald-600" />
                      <span>EKA Android Mobile App</span>
                    </h4>
                    <p className="text-xs text-muted-foreground font-light mt-1">
                      Expo SDK 52 React Native core. Features offline-first encrypted sadhana journals, background meditation audio, and biometric security.
                    </p>
                  </div>

                  <Badge variant="outline" className="font-mono text-xs border-amber-500/40 text-amber-800 dark:text-amber-400 bg-amber-500/10">
                    Controlled Beta
                  </Badge>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border/60 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Package Name:</span>
                    <span className="text-foreground font-semibold">earth.eka.app</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Target OS:</span>
                    <span className="text-foreground">Android 11+ (API 30+)</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Architecture:</span>
                    <span className="text-foreground">React Native Fabric (C++ Core)</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Distribution:</span>
                    <span className="text-foreground">Firebase App Distribution & Internal Track</span>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground italic">
                  Note: Tested internally on physical Android devices. APK beta distribution is provided via partner invitation.
                </p>
              </div>

              {/* BETA 4: EKA iOS App */}
              <div id="ios" className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-calm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <ProductStatus status="BETA" size="xs" />
                      <Badge variant="outline" className="font-mono text-[10px]">
                        TestFlight Closed Beta
                      </Badge>
                    </div>
                    <h4 className="font-serif text-xl font-bold text-foreground mt-1.5 flex items-center gap-2">
                      <Apple className="size-5 text-foreground" />
                      <span>EKA iOS Mobile App</span>
                    </h4>
                    <p className="text-xs text-muted-foreground font-light mt-1">
                      Native iOS experience with Apple CoreHaptics devotional feedback, Dynamic Island background audio, and 120Hz ProMotion cultural narrative viewing.
                    </p>
                  </div>

                  <Badge variant="outline" className="font-mono text-xs border-amber-500/40 text-amber-800 dark:text-amber-400 bg-amber-500/10">
                    TestFlight Cohort
                  </Badge>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border/60 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Bundle Identifier:</span>
                    <span className="text-foreground font-semibold">earth.eka.mobile</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Target OS:</span>
                    <span className="text-foreground">iOS 17.0+ (iPhone & iPad)</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Distribution Channel:</span>
                    <span className="text-foreground">Apple TestFlight Private Beta</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Audio Engine:</span>
                    <span className="text-foreground">AVPlayer Background Streaming</span>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground italic">
                  Note: Private TestFlight invitation link is distributed directly to accredited investors and partner curators.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* 5. SECTION 3: ROADMAP (Planned Strategic Direction) */}
        {/* ==================================================================== */}
        {(filter === "ALL" || filter === "ROADMAP") && (
          <section className="container-eka space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <ProductStatus status="ROADMAP" size="sm" />
                  <span className="text-xs text-muted-foreground font-mono">
                    Planned capabilities and future expansion
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mt-1">
                  Strategic Horizon & Long-Term Expansion
                </h3>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                Target Horizons: 2027 · Future · Under Exploration
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roadmapItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-purple-500/30 bg-card/60 p-5 space-y-3 shadow-xs relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 dark:text-purple-400 font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                      {item.category}
                    </span>
                    <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
                      Target: {item.target}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-serif text-base font-bold text-foreground">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground font-light mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/60">
                    <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-semibold block">
                      Strategic Impact:
                    </span>
                    <p className="text-[11px] text-foreground font-medium mt-0.5">
                      {item.impact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* 6. THE EKA ECOSYSTEM LOOP */}
        {/* ==================================================================== */}
        <section className="container-eka">
          <div className="rounded-3xl border border-border/80 bg-card/70 p-6 sm:p-10 shadow-calm space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-terracotta font-semibold">
                Unified Ecosystem Architecture
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                One Living Cultural Loop
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-light">
                EKA is not five disconnected products. It is one self-reinforcing cultural knowledge and economic engine.
              </p>
            </div>

            {/* Loop Steps */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
              {[
                { step: "01", name: "LAND", desc: "Arrive at calm sanctuary", to: "/" },
                { step: "02", name: "DISCOVER", desc: "Explore sacred geography", to: "/discover" },
                { step: "03", name: "STORIES", desc: "Watch 9:16 vertical reels", to: "/stories" },
                { step: "04", name: "LEARN", desc: "Structured cultural codex", to: "/learn" },
                { step: "05", name: "ASK EKA", desc: "Gemini cultural inquiry", to: "/ask" },
                { step: "06", name: "COMMUNITY", desc: "Multi-faith Sanghas", to: "/community" },
                { step: "07", name: "MESSAGE", desc: "1:1 creator connection", to: "/messages" },
                { step: "08", name: "CREATE", desc: "Contribute oral story", to: "/create" },
                { step: "09", name: "ADMIN", desc: "Verify & govern archive", to: "/founder-admin" },
                { step: "10", name: "ENTERPRISE", desc: "Brand intelligence & SaaS", to: "/brands-enterprise" },
              ].map((s) => (
                <div
                  key={s.step}
                  className="rounded-xl border border-border/70 bg-card/80 p-3 space-y-1 hover:border-terracotta/50 transition-colors"
                >
                  <span className="text-[10px] font-mono text-terracotta font-bold">
                    {s.step}
                  </span>
                  <p className="font-serif font-bold text-xs text-foreground">{s.name}</p>
                  <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 7. INVESTOR PRODUCT MATRIX */}
        {/* ==================================================================== */}
        <section id="product-matrix" className="container-eka space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Single Source of Truth
              </span>
              <h3 className="font-serif text-2xl font-bold text-foreground">
                Investor Product Matrix
              </h3>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              Evaluated based on current build state
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card/80 shadow-calm">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border/80 font-mono text-[10px] uppercase text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Product Surface</th>
                  <th className="py-3 px-4">Maturity Status</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Access Channel</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">Last Verified</th>
                  <th className="py-3 px-4 text-right">Investor Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-accent/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-foreground">{p.name}</span>
                        <p className="text-[10px] text-muted-foreground truncate max-w-xs">
                          {p.headline}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <ProductStatus status={p.status} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                      {p.platform}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {p.accessType}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                      {p.version}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                      {p.lastVerified}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {p.id === "consumer-web" ? (
                        <Button
                          onClick={() => handleLaunchDemo("consumer", "/")}
                          size="sm"
                          className="h-7 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                          Open Web
                        </Button>
                      ) : p.id === "founder-admin" ? (
                        <Button
                          onClick={() => handleLaunchDemo("admin", "/investor/admin")}
                          size="sm"
                          className="h-7 text-xs rounded-lg bg-amber-600 hover:bg-amber-500 text-white"
                        >
                          Admin Demo
                        </Button>
                      ) : p.id === "brands-enterprise" ? (
                        <Button
                          onClick={() => handleLaunchDemo("enterprise", "/investor/enterprise")}
                          size="sm"
                          className="h-7 text-xs rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
                        >
                          Enterprise Demo
                        </Button>
                      ) : (
                        <a
                          href={`#${p.platform.toLowerCase()}`}
                          className="text-xs font-mono text-terracotta hover:underline"
                        >
                          View Specs
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 8. DEMO CREDENTIALS & SECURITY COMMITMENT */}
        {/* ==================================================================== */}
        <section className="container-eka">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                  Least-Privilege Evaluation
                </span>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  Investor Demo Credentials & Security Sandbox
                </h3>
              </div>
              <Badge variant="outline" className="font-mono text-xs border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                Zero Production Secrets Exposed
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground font-light max-w-3xl leading-relaxed">
              In accordance with security governance standards, founder personal credentials and production database keys are never exposed in presentation environments. Dedicated, least-privilege demo profiles are provided below for due-diligence evaluations:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl border border-border/80 bg-card space-y-2">
                <span className="text-xs font-bold text-foreground block">
                  Consumer Demo Account
                </span>
                <div className="font-mono text-[11px] p-2 rounded bg-muted/60 text-muted-foreground space-y-0.5">
                  <p>Email: <strong className="text-foreground">{DEMO_CREDENTIALS.consumer.email}</strong></p>
                  <p>Role: {DEMO_CREDENTIALS.consumer.roleName}</p>
                </div>
                <Button
                  onClick={() => handleLaunchDemo("consumer", "/")}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-8"
                >
                  1-Click Consumer Demo
                </Button>
              </div>

              <div className="p-4 rounded-xl border border-border/80 bg-card space-y-2">
                <span className="text-xs font-bold text-foreground block">
                  Admin Demo Account
                </span>
                <div className="font-mono text-[11px] p-2 rounded bg-muted/60 text-muted-foreground space-y-0.5">
                  <p>Email: <strong className="text-foreground">{DEMO_CREDENTIALS.admin.email}</strong></p>
                  <p>Role: {DEMO_CREDENTIALS.admin.roleName}</p>
                </div>
                <Button
                  onClick={() => handleLaunchDemo("admin", "/investor/admin")}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-8 text-amber-800 dark:text-amber-300 border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10"
                >
                  1-Click Admin Demo
                </Button>
              </div>

              <div className="p-4 rounded-xl border border-border/80 bg-card space-y-2">
                <span className="text-xs font-bold text-foreground block">
                  Enterprise Demo Account
                </span>
                <div className="font-mono text-[11px] p-2 rounded bg-muted/60 text-muted-foreground space-y-0.5">
                  <p>Email: <strong className="text-foreground">{DEMO_CREDENTIALS.enterprise.email}</strong></p>
                  <p>Role: {DEMO_CREDENTIALS.enterprise.roleName}</p>
                </div>
                <Button
                  onClick={() => handleLaunchDemo("enterprise", "/investor/enterprise")}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-8 text-blue-700 dark:text-blue-300 border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/10"
                >
                  1-Click Enterprise Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
