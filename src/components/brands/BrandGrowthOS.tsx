// ==============================================================================
// EKA GROWTH OS & INTELLIGENCE LAYER — FULL SUITE COMPONENT
// ==============================================================================
// 1. Own the consumer intelligence layer
// 2. Cultural Trend Radar (Culture → Emerging Interest → Opportunity → Campaign)
// 3. Brand Brain (Institutional memory & strategic querying co-pilot)
// 4. Closed-Loop Attribution (Discovery → Attention → Intent → CRM → Purchase → LTV)
// 5. Creator + Brand Marketplace
// 6. Campaign Autopilot ("I want to reach 18-24 urban consumers with ₹50K...")
// 7. Proprietary EKA Scores (Audience Momentum, Cultural Relevance, Affinity, Opportunity Index)
// ==============================================================================

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  TrendingUp,
  BarChart3,
  Users,
  Target,
  Rocket,
  HeartHandshake,
  Brain,
  Bot,
  Sparkles,
  Plus,
  Play,
  Pause,
  ArrowRight,
  ChevronRight,
  Filter,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  Flame,
  Globe,
  Compass,
  ShoppingBag,
  Film,
  FileText,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Send,
  RefreshCw,
  Search,
  ExternalLink,
  Zap,
  Radio,
  Sliders,
  ShieldCheck,
  Check,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EkaLogo } from "@/components/brand/Logo";
import { toast } from "sonner";
import {
  ACTIVE_BRANDS,
  TREND_RADAR_SIGNALS,
  CREATOR_PARTNERS,
  CLOSED_LOOP_ATTRIBUTION,
  BRAND_BRAIN_KNOWLEDGE_BASE,
  MOCK_CAMPAIGNS,
  AUDIENCE_SEGMENTS,
  PROMOTABLE_CONTENT,
  BRAND_CRM_LEADS,
  type BrandProfile,
  type Campaign,
  type AudienceSegment,
  type TrendRadarSignal,
  type CreatorPartner,
} from "./brand-mock-data";

export type BrandTab =
  | "dashboard"
  | "radar"
  | "brain"
  | "autopilot"
  | "creators"
  | "attribution"
  | "campaigns"
  | "audience"
  | "promote"
  | "analytics"
  | "crm"
  | "strategy"
  | "agent";

const ANALYTICS_TIMESERIES = [
  { day: "Day 1", spend: 18200, reach: 140000, conversions: 340 },
  { day: "Day 2", spend: 24500, reach: 195000, conversions: 490 },
  { day: "Day 3", spend: 31000, reach: 245000, conversions: 620 },
  { day: "Day 4", spend: 28400, reach: 220000, conversions: 580 },
  { day: "Day 5", spend: 42000, reach: 330000, conversions: 890 },
  { day: "Day 6", spend: 49000, reach: 380000, conversions: 1040 },
  { day: "Day 7", spend: 49700, reach: 395000, conversions: 1060 },
];

const FUNNEL_DATA = [
  { stage: "Impressions", count: 1840000 },
  { stage: "Engaged Views", count: 460000 },
  { stage: "Intent Signals", count: 143420 },
  { stage: "CRM Leads", count: 88340 },
  { stage: "Conversions", count: 4820 },
];

interface BrandGrowthOSProps {
  initialTab?: BrandTab;
}

export function BrandGrowthOS({ initialTab = "dashboard" }: BrandGrowthOSProps) {
  const [activeTab, setActiveTab] = useState<BrandTab>(initialTab === "agent" ? "brain" : initialTab);
  const [selectedBrand, setSelectedBrand] = useState<BrandProfile>(ACTIVE_BRANDS[0]);
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [campaignFilter, setCampaignFilter] = useState<"all" | "active" | "scheduled" | "completed">("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAutopilotModalOpen, setIsAutopilotModalOpen] = useState(false);

  // Autopilot Execution State
  const [autopilotPrompt, setAutopilotPrompt] = useState(
    "I want to reach 18–24 urban consumers interested in Sacred Acoustics with a ₹50,000 budget."
  );
  const [autopilotStep, setAutopilotStep] = useState<number>(0);
  const [autopilotRunning, setAutopilotRunning] = useState(false);

  // Brand Brain State
  const [brainQuery, setBrainQuery] = useState("");
  const [brainResponse, setBrainResponse] = useState<string | null>(null);
  const [brainAction, setBrainAction] = useState<{ text: string; tab: string } | null>(null);
  const [brainThinking, setBrainThinking] = useState(false);

  // New Campaign Form State
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    objective: "Product Conversions" as Campaign["objective"],
    format: "short_video_reel" as Campaign["format"],
    budget: 50000,
    tgSegment: "Conscious Urban Indic (24-38)",
  });

  const handleRunBrainQuery = (queryText: string) => {
    setBrainThinking(true);
    setBrainQuery(queryText);
    setBrainResponse(null);
    setBrainAction(null);

    setTimeout(() => {
      setBrainThinking(false);
      const match = BRAND_BRAIN_KNOWLEDGE_BASE.find(
        (q) => q.query.toLowerCase() === queryText.toLowerCase()
      );
      if (match) {
        setBrainResponse(match.answer);
        setBrainAction({ text: match.suggestedAction, tab: match.actionTab });
      } else {
        setBrainResponse(
          `EKA BRAND BRAIN SYNTHESIS:\n\nBased on your historical campaign telemetry and the live Indic Graph: We recommend shifting 35% of ad spend into artisan short-form reels showcasing the 6th-generation lost-wax bronze casting process. Gen Z intent signals ('I'd consider this') are pacing 2.8× higher on raw workshop footage than studio photography.`
        );
        setBrainAction({ text: "Apply Recommendation to Live Bids", tab: "campaigns" });
      }
      toast.success("Brand Brain generated strategic recommendation.");
    }, 900);
  };

  const handleExecuteAutopilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!autopilotPrompt.trim()) return;
    setAutopilotRunning(true);
    setAutopilotStep(1);

    setTimeout(() => setAutopilotStep(2), 700);
    setTimeout(() => setAutopilotStep(3), 1400);
    setTimeout(() => setAutopilotStep(4), 2100);
    setTimeout(() => {
      setAutopilotStep(5);
      setAutopilotRunning(false);
      const created: Campaign = {
        id: `auto-${Date.now()}`,
        title: "Autopilot: Sacred Acoustics Seeker Sprint",
        format: "short_video_reel",
        objective: "TG Engagement",
        status: "active",
        thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
        videoDuration: "0:24",
        spend: 0,
        budget: 50000,
        reach: "Deploying...",
        engagementRate: "Pacing 11.4%",
        conversions: 0,
        ctr: "—",
        cpa: "—",
        tgSegment: "Gen Z Mindful Living (18-24)",
        roas: "Projected 4.8×",
      };
      setCampaigns([created, ...campaigns]);
      toast.success("EKA Autopilot successfully deployed campaign into live ad network!");
    }, 2800);
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.title.trim()) {
      toast.error("Please provide a campaign title");
      return;
    }
    const created: Campaign = {
      id: `camp-${Date.now()}`,
      title: newCampaign.title,
      format: newCampaign.format,
      objective: newCampaign.objective,
      status: "active",
      thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
      videoDuration: newCampaign.format === "short_video_reel" ? "0:30" : undefined,
      spend: 0,
      budget: newCampaign.budget,
      reach: "Launching...",
      engagementRate: "Calculating...",
      conversions: 0,
      ctr: "—",
      cpa: "—",
      tgSegment: newCampaign.tgSegment,
      roas: "—",
    };
    setCampaigns([created, ...campaigns]);
    setIsCreateModalOpen(false);
    toast.success("Campaign launched into EKA Ad Delivery Network!");
    setActiveTab("campaigns");
  };

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(
      campaigns.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === "active" ? "paused" : "active";
          toast.info(`Campaign ${c.title} is now ${nextStatus}`);
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const filteredCampaigns = campaigns.filter((c) => {
    if (campaignFilter === "all") return true;
    return c.status === campaignFilter;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* 1. TOP GROWTH OS BAR */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/95 backdrop-blur-md px-4 py-2.5 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Identity & Selector */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
              <EkaLogo />
            </Link>
            <div className="h-5 w-px bg-border/60" />
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-500 font-semibold flex items-center gap-1">
                <TrendingUp className="size-3.5" />
                Growth OS
              </span>
              <div className="hidden sm:flex items-center gap-1.5 ml-2">
                <select
                  value={selectedBrand.id}
                  onChange={(e) => {
                    const found = ACTIVE_BRANDS.find((b) => b.id === e.target.value);
                    if (found) setSelectedBrand(found);
                  }}
                  className="rounded-lg border border-border bg-accent/40 px-2.5 py-1 text-xs font-medium text-foreground cursor-pointer hover:bg-accent/60 transition-colors"
                >
                  {ACTIVE_BRANDS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-mono">
            <div>
              <span className="text-muted-foreground">Spend: </span>
              <span className="font-semibold text-foreground">₹{(selectedBrand.totalSpent / 100000).toFixed(2)}L</span>
            </div>
            <div>
              <span className="text-muted-foreground">Reach: </span>
              <span className="font-semibold text-foreground">{selectedBrand.totalReach}</span>
            </div>
            <div>
              <span className="text-muted-foreground">ROAS: </span>
              <span className="font-semibold text-emerald-500">{selectedBrand.roas}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-emerald-600 dark:text-emerald-400">
              <Sparkles className="size-3" />
              <span>Momentum: <strong>{selectedBrand.scores.audienceMomentum.score}/100</strong></span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            {/* Killer Autopilot Action Trigger */}
            <Button
              size="sm"
              onClick={() => setIsAutopilotModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs gap-1.5 shadow-sm font-semibold"
            >
              <Zap className="size-3.5 fill-current" />
              <span className="hidden sm:inline">Campaign Autopilot</span>
              <span className="sm:hidden">Autopilot</span>
            </Button>

            <Button
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs gap-1.5 shadow-sm"
            >
              <Plus className="size-3.5" />
              <span className="hidden md:inline">Manual Campaign</span>
            </Button>

            <Link to="/">
              <Button size="sm" variant="ghost" className="text-xs h-8 text-muted-foreground hover:text-foreground">
                <Globe className="size-3.5 mr-1" />
                <span className="hidden sm:inline">Consumer</span>
              </Button>
            </Link>

            <Link to="/ops">
              <Button size="sm" variant="outline" className="text-xs h-8 border-border/80 text-muted-foreground hover:text-amber-500">
                <Layers className="size-3.5 mr-1" />
                <span className="hidden sm:inline">Ops OS</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. MAIN GROWTH OS BODY: SIDEBAR + CONTENT AREA */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* NAV SIDEBAR */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border/80 bg-card/60 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible shrink-0">
          <div className="hidden md:block px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Intelligence & Growth
          </div>

          {[
            { id: "dashboard", label: "Growth Dashboard", icon: BarChart3, badge: null },
            { id: "radar", label: "Cultural Trend Radar", icon: Radio, badge: "Live Signals", highlight: true },
            { id: "brain", label: "Brand Brain AI", icon: Brain, badge: "Memory Core", glow: true },
            { id: "autopilot", label: "Campaign Autopilot", icon: Zap, badge: "1-Click" },
            { id: "creators", label: "Creator Marketplace", icon: Users, badge: "Verified" },
            { id: "attribution", label: "Closed-Loop Attribution", icon: Target, badge: "LTV Funnel" },
            { id: "campaigns", label: "Campaigns", icon: Film, badge: `${campaigns.filter((c) => c.status === "active").length} Active` },
            { id: "audience", label: "Audience (TG)", icon: Compass, badge: "4 Segments" },
            { id: "promote", label: "Promote Studio", icon: Rocket, badge: null },
            { id: "analytics", label: "Analytics (Meta/GA4)", icon: TrendingUp, badge: null },
            { id: "crm", label: "Brand CRM", icon: HeartHandshake, badge: null },
            { id: "strategy", label: "Indic Calendar Strategy", icon: Calendar, badge: null },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as BrandTab)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all text-left whitespace-nowrap md:whitespace-normal cursor-pointer ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`size-4 ${isActive ? "text-emerald-500" : item.highlight ? "text-amber-500" : "text-muted-foreground"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge
                    variant="outline"
                    className={`text-[9px] px-1.5 py-0 font-mono hidden md:inline-flex ${
                      item.glow ? "border-emerald-500 text-emerald-500 bg-emerald-500/10 animate-pulse" : ""
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}

          <div className="mt-auto hidden md:block pt-4 p-3 border-t border-border/60">
            <div className="rounded-xl bg-accent/40 p-2.5 text-[10px] text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground flex items-center gap-1">
                <Sparkles className="size-3 text-emerald-500" />
                The Proprietary Graph
              </p>
              <p className="leading-tight">
                People × Interests × Culture × Content × Brands × Intent × Outcomes
              </p>
            </div>
          </div>
        </aside>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl">
          {/* TAB 1: GROWTH DASHBOARD WITH EKA PROPRIETARY SCORES */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Top Greeting & Pitch */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
                  EKA tells you what people want, why they want it, who wants it, and what your brand should do next.
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-1 text-foreground">
                  Good morning, {selectedBrand.name}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Your brand growth, proprietary EKA intelligence scores, and real-time cultural demand signals.
                </p>
              </div>

              {/* 5 PROPRIETARY EKA SCORES CARDS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-amber-500" />
                    Proprietary EKA Intelligence Scores (Beyond Meta/Google Metrics)
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-500">Live Graph Updated</span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="rounded-2xl border border-border/80 bg-card p-3.5 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] text-muted-foreground font-mono">Audience Momentum</span>
                    <div className="my-1.5 flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold font-mono text-foreground">{selectedBrand.scores.audienceMomentum.score}</span>
                      <span className="text-xs text-emerald-500 font-mono font-semibold">{selectedBrand.scores.audienceMomentum.velocity}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">{selectedBrand.scores.audienceMomentum.description}</p>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-card p-3.5 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] text-muted-foreground font-mono">Cultural Relevance</span>
                    <div className="my-1.5 flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold font-mono text-foreground">{selectedBrand.scores.culturalRelevance.score}</span>
                      <Badge variant="outline" className="text-[9px] font-mono border-amber-500/40 text-amber-500 py-0">
                        {selectedBrand.scores.culturalRelevance.status}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">{selectedBrand.scores.culturalRelevance.description}</p>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-card p-3.5 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] text-muted-foreground font-mono">Audience Affinity</span>
                    <div className="my-1.5 flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold font-mono text-foreground">{selectedBrand.scores.audienceAffinity.score}</span>
                      <span className="text-[10px] text-muted-foreground font-mono truncate">{selectedBrand.scores.audienceAffinity.segment}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">{selectedBrand.scores.audienceAffinity.description}</p>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-card p-3.5 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] text-muted-foreground font-mono">Campaign Momentum</span>
                    <div className="my-1.5 flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold font-mono text-foreground">{selectedBrand.scores.campaignMomentum.score}</span>
                      <span className="text-xs text-emerald-500 font-mono font-semibold">{selectedBrand.scores.campaignMomentum.trend}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">{selectedBrand.scores.campaignMomentum.description}</p>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-card p-3.5 shadow-xs flex flex-col justify-between col-span-2 lg:col-span-1">
                    <span className="text-[10px] text-muted-foreground font-mono">Opportunity Index</span>
                    <div className="my-1.5 flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold font-mono text-amber-500">{selectedBrand.scores.opportunityIndex.score}/10</span>
                      <span className="text-[10px] text-muted-foreground font-mono">High Whitespace</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">{selectedBrand.scores.opportunityIndex.description}</p>
                  </div>
                </div>
              </div>

              {/* 4 Standard Growth Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
                  <span className="text-[11px] text-muted-foreground font-mono">₹ Campaign Spend</span>
                  <div className="mt-2 text-2xl font-bold font-mono text-foreground">
                    ₹{(selectedBrand.totalSpent / 100000).toFixed(2)}L
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="text-emerald-500 font-medium">82% of monthly</span> cap
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
                  <span className="text-[11px] text-muted-foreground font-mono">Verified Reach</span>
                  <div className="mt-2 text-2xl font-bold font-mono text-foreground">{selectedBrand.totalReach}</div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-500 font-medium">
                    +28.4% vs last period
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
                  <span className="text-[11px] text-muted-foreground font-mono">Avg Engagement</span>
                  <div className="mt-2 text-2xl font-bold font-mono text-foreground">{selectedBrand.avgEngagement}</div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="text-emerald-500 font-medium">2.3× industry avg</span> (reels)
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
                  <span className="text-[11px] text-muted-foreground font-mono">Total Conversions</span>
                  <div className="mt-2 text-2xl font-bold font-mono text-foreground">
                    {selectedBrand.conversions.toLocaleString()}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-500 font-medium">
                    ROAS {selectedBrand.roas}
                  </div>
                </div>
              </div>

              {/* What EKA Sees & Recommends */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 relative overflow-hidden">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase font-semibold">
                    <Eye className="size-4" />
                    What EKA Sees (Live Consumer Signal)
                  </div>
                  <h3 className="font-display text-base font-semibold mt-2 text-foreground">
                    Your Gen Z audience is responding 2.3× more to short-form video than static product content.
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Watch-time on handcrafted brassware & mulberry loom reels peaked between 8:00–10:30 PM IST. Engagement depth is highest when master artisans speak.
                  </p>
                  <div className="mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveTab("audience")}
                      className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl hover:bg-emerald-500/10"
                    >
                      Explore Audience Insights
                      <ArrowRight className="size-3 ml-1.5" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 relative overflow-hidden">
                  <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase font-semibold">
                    <Zap className="size-4 fill-current" />
                    What EKA Recommends (Autopilot Ready)
                  </div>
                  <h3 className="font-display text-base font-semibold mt-2 text-foreground">
                    Launch a 7-day creator-led campaign around Vedic Acoustic Bronze Bowls.
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Demand in the Trend Radar is up +310% MoM. Suggested budget: ₹50,000 for projected reach of +340K and 4.8× ROAS.
                  </p>
                  <div className="mt-4">
                    <Button
                      size="sm"
                      onClick={() => {
                        setIsAutopilotModalOpen(true);
                        setAutopilotPrompt("I want to launch a 7-day creator campaign for Vedic Acoustic Bronze Bowls with ₹50,000 budget.");
                      }}
                      className="bg-amber-600 hover:bg-amber-500 text-white text-xs rounded-xl shadow-xs"
                    >
                      Deploy with Campaign Autopilot
                      <ArrowRight className="size-3 ml-1.5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Campaigns Visual Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground">Active Campaigns</h2>
                    <p className="text-xs text-muted-foreground">Short video reels, story cards, and creator collaborations live on EKA</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("campaigns")}
                    className="text-xs rounded-xl"
                  >
                    View All Campaigns
                    <ChevronRight className="size-3.5 ml-1" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {campaigns.slice(0, 3).map((camp) => (
                    <div
                      key={camp.id}
                      className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs flex flex-col group hover:border-emerald-500/40 transition-colors"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-muted">
                        <img
                          src={camp.thumbnail}
                          alt={camp.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute top-2.5 left-2.5">
                          <Badge
                            className={`text-[9px] uppercase font-mono px-2 py-0.5 ${
                              camp.status === "active"
                                ? "bg-emerald-500 text-white"
                                : camp.status === "scheduled"
                                ? "bg-amber-500 text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {camp.status}
                          </Badge>
                        </div>
                        {camp.videoDuration && (
                          <div className="absolute bottom-2.5 right-2.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-mono text-white flex items-center gap-1">
                            <Film className="size-3" />
                            {camp.videoDuration}
                          </div>
                        )}
                        <div className="absolute bottom-2.5 left-2.5 right-12">
                          <p className="text-xs font-semibold text-white truncate">{camp.title}</p>
                          <p className="text-[10px] text-white/80">{camp.tgSegment}</p>
                        </div>
                      </div>

                      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="grid grid-cols-3 gap-2 text-center border-b border-border/60 pb-2.5">
                          <div>
                            <span className="text-[10px] text-muted-foreground font-mono">Spend</span>
                            <p className="text-xs font-semibold font-mono text-foreground">₹{camp.spend.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground font-mono">Reach</span>
                            <p className="text-xs font-semibold font-mono text-foreground">{camp.reach}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground font-mono">ROAS</span>
                            <p className="text-xs font-semibold font-mono text-emerald-500">{camp.roas}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-muted-foreground font-mono">
                            CTR: <strong className="text-foreground">{camp.ctr}</strong>
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleCampaignStatus(camp.id)}
                            className="text-[11px] h-7 px-2 text-muted-foreground hover:text-foreground"
                          >
                            {camp.status === "active" ? (
                              <>
                                <Pause className="size-3 mr-1" /> Pause
                              </>
                            ) : (
                              <>
                                <Play className="size-3 mr-1" /> Resume
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CULTURAL TREND RADAR */}
          {activeTab === "radar" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase font-semibold">
                    <Radio className="size-4 animate-pulse text-amber-500" />
                    Early Cultural Intelligence Engine
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mt-1">
                    EKA Cultural Trend Radar
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    CULTURE → EMERGING INTEREST → AUDIENCE SIGNAL → CATEGORY OPPORTUNITY → CAMPAIGN
                  </p>
                </div>
                <Badge variant="outline" className="font-mono text-xs border-amber-500 text-amber-500 w-fit">
                  4 Emerging Movements Tracked
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TREND_RADAR_SIGNALS.map((trend) => (
                  <div
                    key={trend.id}
                    className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-border/60 pb-3">
                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[10px] font-mono">
                          {trend.momentumVelocity}
                        </Badge>
                        <span className="text-xs font-mono text-muted-foreground">
                          Target: <strong className="text-foreground">{trend.targetDemographic}</strong>
                        </span>
                      </div>

                      <h3 className="font-display text-lg font-semibold mt-3 text-foreground">{trend.emergingInterest}</h3>
                      <p className="text-xs font-mono text-amber-600 dark:text-amber-400 mt-0.5">Shift: {trend.culturalShift}</p>

                      <div className="mt-3 rounded-xl bg-accent/40 p-3 text-xs space-y-2 border border-border/60">
                        <div>
                          <span className="font-mono text-[10px] text-muted-foreground uppercase block">Audience Signal:</span>
                          <p className="text-foreground/90 font-medium">{trend.audienceSignal}</p>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] text-muted-foreground uppercase block">Why It Resonates:</span>
                          <p className="text-muted-foreground leading-relaxed">{trend.whyItResonates}</p>
                        </div>
                      </div>

                      <div className="mt-3 text-xs space-y-1.5">
                        <div className="flex justify-between font-mono">
                          <span className="text-muted-foreground">Category Opportunity:</span>
                          <span className="font-semibold text-foreground">{trend.categoryOpportunity}</span>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span className="text-muted-foreground">Projected ROAS:</span>
                          <span className="font-semibold text-emerald-500">{trend.projectedRoas}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/60">
                      <Button
                        size="sm"
                        onClick={() => {
                          setIsAutopilotModalOpen(true);
                          setAutopilotPrompt(`Launch a ${trend.suggestedBudget} campaign for: ${trend.recommendedCampaign}`);
                        }}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs rounded-xl gap-1.5"
                      >
                        <Zap className="size-3.5 fill-current" />
                        Convert Trend into Autopilot Campaign ({trend.suggestedBudget})
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BRAND BRAIN AI */}
          {activeTab === "brain" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs uppercase font-semibold">
                  <Brain className="size-4" />
                  Institutional Memory & AI Strategic Co-Pilot
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mt-1">
                  EKA Brand Brain ({selectedBrand.name})
                </h1>
                <p className="text-xs text-muted-foreground">
                  The AI layer synthesizing your brand positioning, products, historical campaigns, competitor radar, and consumer signals.
                </p>
              </div>

              {/* Precomputed Strategic Prompts */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-muted-foreground block">
                  Ask Brand Brain Anything (Preloaded Strategic Questions):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {BRAND_BRAIN_KNOWLEDGE_BASE.map((qa) => (
                    <button
                      key={qa.query}
                      onClick={() => handleRunBrainQuery(qa.query)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        brainQuery === qa.query
                          ? "border-emerald-500 bg-emerald-500/10 text-foreground font-semibold"
                          : "border-border/80 bg-card hover:bg-accent/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase text-emerald-500 block mb-1">
                        Category: {qa.category}
                      </span>
                      <p className="text-xs font-medium">"{qa.query}"</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Query Input */}
              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={brainQuery}
                    onChange={(e) => setBrainQuery(e.target.value)}
                    placeholder="Ask Brand Brain: 'Why did our last campaign underperform?', 'Which product to push next?'..."
                    className="text-xs rounded-xl"
                  />
                  <Button
                    size="sm"
                    disabled={brainThinking || !brainQuery.trim()}
                    onClick={() => handleRunBrainQuery(brainQuery)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-xl px-4"
                  >
                    {brainThinking ? (
                      <RefreshCw className="size-3.5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="size-3.5 mr-1" /> Ask Brain
                      </>
                    )}
                  </Button>
                </div>

                {brainResponse && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs font-mono whitespace-pre-wrap leading-relaxed animate-in fade-in duration-200">
                    <div className="text-[11px] uppercase font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                      <Brain className="size-3.5" />
                      EKA Brand Brain Diagnostic Analysis
                    </div>
                    {brainResponse}
                    {brainAction && (
                      <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground font-sans">Recommended Next Step:</span>
                        <Button
                          size="sm"
                          onClick={() => {
                            setActiveTab(brainAction.tab as BrandTab);
                            toast.info(`Executing recommendation: ${brainAction.text}`);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-lg h-7"
                        >
                          {brainAction.text} →
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CAMPAIGN AUTOPILOT */}
          {activeTab === "autopilot" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase font-semibold">
                  <Zap className="size-4 fill-current" />
                  Autonomous Zero-Friction Ad Deployment
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mt-1">
                  EKA Campaign Autopilot
                </h1>
                <p className="text-xs text-muted-foreground">
                  BRAND GOAL → ANALYSE AUDIENCE → GENERATE STRATEGY → GENERATE CONTENT → LAUNCH → OPTIMISE
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 shadow-xs space-y-4">
                <h3 className="font-display text-base font-semibold text-foreground">
                  The Killer Interaction: Specify Your Goal in One Sentence
                </h3>
                <form onSubmit={handleExecuteAutopilot} className="space-y-3">
                  <div className="relative">
                    <Input
                      value={autopilotPrompt}
                      onChange={(e) => setAutopilotPrompt(e.target.value)}
                      className="text-xs py-5 rounded-xl border-amber-500/40 pr-32 bg-background"
                      placeholder="e.g. I want to reach 18-24 urban consumers interested in Sacred Acoustics with a ₹50,000 budget."
                    />
                    <Button
                      type="submit"
                      disabled={autopilotRunning}
                      className="absolute right-1.5 top-1.5 bottom-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs rounded-lg px-4 font-semibold"
                    >
                      {autopilotRunning ? (
                        <>
                          <RefreshCw className="size-3.5 animate-spin mr-1" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Zap className="size-3.5 fill-current mr-1" />
                          Launch Autopilot
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="text-muted-foreground font-mono text-[10px]">Autopilot Presets:</span>
                    {[
                      "I want to reach 18–24 urban consumers interested in Sacred Acoustics with a ₹50,000 budget.",
                      "Launch a 7-day Dhanteras brass diya sprint targeting diaspora buyers with ₹80,000.",
                      "Boost Varanasi Handloom silk to conscious urban professionals with ₹40,000.",
                    ].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setAutopilotPrompt(preset)}
                        className="rounded-lg bg-accent/60 hover:bg-accent px-2 py-0.5 text-foreground transition-colors cursor-pointer text-[10px]"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </form>

                {/* Autopilot Real-time Execution Pipeline */}
                {autopilotStep > 0 && (
                  <div className="mt-4 pt-4 border-t border-amber-500/20 space-y-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      {autopilotStep >= 1 ? <Check className="size-3.5 text-emerald-500" /> : <RefreshCw className="size-3.5 animate-spin text-amber-500" />}
                      <span className={autopilotStep >= 1 ? "text-foreground font-medium" : "text-muted-foreground"}>
                        1. Analyzing 840,000 Indic Seeker nodes & intent signals...
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {autopilotStep >= 2 ? <Check className="size-3.5 text-emerald-500" /> : <RefreshCw className="size-3.5 animate-spin text-amber-500" />}
                      <span className={autopilotStep >= 2 ? "text-foreground font-medium" : "text-muted-foreground"}>
                        2. Synthesized strategy: Peak engagement window 8:00–10:30 PM IST (Est. ROAS 4.8×).
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {autopilotStep >= 3 ? <Check className="size-3.5 text-emerald-500" /> : <RefreshCw className="size-3.5 animate-spin text-amber-500" />}
                      <span className={autopilotStep >= 3 ? "text-foreground font-medium" : "text-muted-foreground"}>
                        3. Auto-selected top 2 vertical reels & matched verified sound therapist (@vedic.acoustics).
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {autopilotStep >= 4 ? <Check className="size-3.5 text-emerald-500" /> : <RefreshCw className="size-3.5 animate-spin text-amber-500" />}
                      <span className={autopilotStep >= 4 ? "text-foreground font-medium" : "text-muted-foreground"}>
                        4. Real-time CPM bidding configured with ₹50,000 ceiling.
                      </span>
                    </div>
                    {autopilotStep >= 5 && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-between">
                        <span>✓ Campaign Live in EKA Ad Delivery Network! (Active Campaign ID: #auto-sprint)</span>
                        <Button
                          size="sm"
                          onClick={() => setActiveTab("campaigns")}
                          className="bg-emerald-600 text-white text-xs h-7 rounded-lg"
                        >
                          View in Campaigns Manager →
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CREATOR + ARTISAN MARKETPLACE */}
          {activeTab === "creators" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
                    Creator & Artisan Marketplace
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Direct collaboration with verified master weavers, Sanskrit scholars, and field filmmakers
                  </p>
                </div>
                <Badge variant="outline" className="font-mono text-xs border-emerald-500 text-emerald-500 w-fit">
                  {CREATOR_PARTNERS.length} Verified Master Creators
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CREATOR_PARTNERS.map((creator) => (
                  <div
                    key={creator.id}
                    className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start gap-3.5">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="size-12 rounded-full object-cover border border-border"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-display text-base font-semibold text-foreground truncate">{creator.name}</h3>
                            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[9px] font-mono">
                              {creator.epistemicTier}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground font-mono">{creator.handle} • {creator.location}</p>
                          <p className="text-xs text-foreground/80 font-medium mt-1">{creator.tradition}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-center font-mono text-xs border-y border-border/60 py-3">
                        <div>
                          <span className="text-[10px] text-muted-foreground block">Audience Overlap</span>
                          <strong className="text-emerald-500 text-sm">{creator.audienceOverlap}%</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground block">Engagement</span>
                          <strong className="text-foreground text-sm">{creator.engagementQuality.split(" ")[0]}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground block">Past ROAS</span>
                          <strong className="text-foreground text-sm">{creator.historicalRoas}</strong>
                        </div>
                      </div>

                      <div className="mt-3 text-xs space-y-1.5">
                        <span className="font-mono text-[10px] text-muted-foreground uppercase">Available For:</span>
                        <div className="flex flex-wrap gap-1">
                          {creator.availableFor.map((item) => (
                            <span key={item} className="bg-accent/60 text-foreground px-2 py-0.5 rounded-md text-[10px]">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        size="sm"
                        onClick={() => toast.success(`Initiated direct collaboration request with ${creator.name}`)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-xl"
                      >
                        Initiate Brand Collaboration ({creator.followersCount} Followers)
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CLOSED-LOOP ATTRIBUTION PIPELINE */}
          {activeTab === "attribution" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
                  Closed-Loop Attribution Pipeline
                </h1>
                <p className="text-xs text-muted-foreground">
                  Connecting: Discovery → Attention → Engagement → Intent → CRM → Purchase → Retention → Lifetime Value
                </p>
              </div>

              <div className="space-y-3">
                {CLOSED_LOOP_ATTRIBUTION.map((touchpoint, idx) => (
                  <div
                    key={touchpoint.stage}
                    className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-sans font-semibold text-sm text-foreground">{touchpoint.stage}</h4>
                        <p className="text-[11px] text-muted-foreground font-sans mt-0.5">{touchpoint.keyAction}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-right">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">Volume / Scale</span>
                        <strong className="text-foreground text-sm">{touchpoint.volume}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">Conversion Rate</span>
                        <strong className="text-emerald-500 text-sm">{touchpoint.conversionToNext}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CAMPAIGNS MANAGER */}
          {activeTab === "campaigns" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-semibold text-foreground">Campaigns Manager</h1>
                  <p className="text-xs text-muted-foreground">Manage active, scheduled, and completed growth campaigns</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-xl border border-border bg-card p-1">
                    {(["all", "active", "scheduled", "completed"] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setCampaignFilter(filter)}
                        className={`rounded-lg px-2.5 py-1 text-xs capitalize transition-colors cursor-pointer ${
                          campaignFilter === filter
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-xl gap-1.5"
                  >
                    <Plus className="size-3.5" /> Create Campaign
                  </Button>
                </div>
              </div>

              {/* Visual Campaign Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCampaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs flex flex-col justify-between group hover:border-emerald-500/40 transition-colors"
                  >
                    <div>
                      <div className="relative aspect-video w-full overflow-hidden bg-muted">
                        <img src={camp.thumbnail} alt={camp.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <Badge
                            className={`text-[9px] uppercase font-mono px-2 py-0.5 ${
                              camp.status === "active"
                                ? "bg-emerald-500 text-white"
                                : camp.status === "scheduled"
                                ? "bg-amber-500 text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {camp.status}
                          </Badge>
                          <Badge variant="outline" className="text-[9px] font-mono bg-black/40 text-white border-white/20">
                            {camp.format.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 right-2.5">
                          <h3 className="text-sm font-semibold text-white truncate">{camp.title}</h3>
                          <p className="text-[11px] text-white/80">{camp.objective} • {camp.tgSegment}</p>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          <div className="rounded-lg bg-accent/40 p-2">
                            <span className="text-[10px] text-muted-foreground">Spend / Budget</span>
                            <p className="font-semibold text-foreground mt-0.5">
                              ₹{camp.spend.toLocaleString()} / ₹{camp.budget.toLocaleString()}
                            </p>
                          </div>
                          <div className="rounded-lg bg-accent/40 p-2">
                            <span className="text-[10px] text-muted-foreground">Reach</span>
                            <p className="font-semibold text-foreground mt-0.5">{camp.reach}</p>
                          </div>
                          <div className="rounded-lg bg-accent/40 p-2">
                            <span className="text-[10px] text-muted-foreground">Conversions</span>
                            <p className="font-semibold text-foreground mt-0.5">{camp.conversions}</p>
                          </div>
                          <div className="rounded-lg bg-accent/40 p-2">
                            <span className="text-[10px] text-muted-foreground">ROAS / CPA</span>
                            <p className="font-semibold text-emerald-500 mt-0.5">{camp.roas} ({camp.cpa})</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-border/60">
                      <span className="text-[11px] font-mono text-muted-foreground">CTR: {camp.ctr}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleCampaignStatus(camp.id)}
                        className="text-xs h-8 rounded-lg"
                      >
                        {camp.status === "active" ? (
                          <>
                            <Pause className="size-3 mr-1" /> Pause
                          </>
                        ) : (
                          <>
                            <Play className="size-3 mr-1" /> Resume
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: AUDIENCE */}
          {activeTab === "audience" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="font-display text-2xl font-semibold text-foreground">Target Audience (TG) Intelligence</h1>
                <p className="text-xs text-muted-foreground">Discover who is watching, engaging, and buying across the Indic diaspora</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {AUDIENCE_SEGMENTS.map((seg) => (
                  <div
                    key={seg.id}
                    className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between space-y-5"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs font-mono border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
                          Size: {seg.size} • {seg.growth}
                        </Badge>
                        <div className="text-xs font-mono text-muted-foreground">
                          Affinity Index: <strong className="text-foreground">{seg.affinityScore}/100</strong>
                        </div>
                      </div>

                      <h3 className="font-display text-xl font-semibold mt-2 text-foreground">{seg.name}</h3>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{seg.demographic}</p>
                      <p className="text-xs text-foreground/80 mt-3 leading-relaxed">{seg.whoTheyAre}</p>
                    </div>

                    <div className="space-y-3 border-t border-border/60 pt-4 text-xs">
                      <div>
                        <span className="font-mono text-[10px] text-muted-foreground uppercase">What They Care About:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {seg.whatTheyCareAbout.map((item) => (
                            <span key={item} className="bg-accent/60 text-foreground px-2 py-0.5 rounded-md text-[11px]">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="font-mono text-[10px] text-muted-foreground uppercase">What They're Watching:</span>
                        <ul className="mt-1 list-disc list-inside text-[11px] text-foreground/85 space-y-0.5">
                          {seg.whatTheyWatch.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-[11px]">
                        <div className="bg-accent/30 p-2.5 rounded-xl">
                          <span className="text-[10px] text-muted-foreground block">Best Ad Format</span>
                          <strong className="text-foreground">{seg.bestFormat}</strong>
                        </div>
                        <div className="bg-accent/30 p-2.5 rounded-xl">
                          <span className="text-[10px] text-muted-foreground block">Peak Response Window</span>
                          <strong className="text-foreground">{seg.bestTime}</strong>
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => {
                        setIsCreateModalOpen(true);
                        setNewCampaign({ ...newCampaign, tgSegment: seg.name });
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-xl"
                    >
                      Target This Audience with a Campaign
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: PROMOTE */}
          {activeTab === "promote" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="font-display text-2xl font-semibold text-foreground">Promote Studio</h1>
                <p className="text-xs text-muted-foreground">Boost existing cultural stories, short video reels, products, and creator partnerships</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {PROMOTABLE_CONTENT.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-4/3 w-full bg-muted">
                        <img src={item.mediaUrl} alt={item.title} className="h-full w-full object-cover" />
                        <div className="absolute top-2 left-2">
                          <Badge className="text-[9px] uppercase font-mono bg-black/70 text-white">
                            {item.type}
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-white">
                          {item.organicViews} views
                        </div>
                      </div>

                      <div className="p-4 space-y-2.5">
                        <h4 className="text-sm font-semibold text-foreground line-clamp-1">{item.title}</h4>
                        <div className="space-y-1 font-mono text-xs">
                          <div className="flex justify-between text-muted-foreground">
                            <span>Engagement:</span>
                            <span className="text-emerald-500 font-semibold">{item.organicEngagement}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Conversion Potential:</span>
                            <span className="text-foreground">{item.conversionPotential}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Projected Reach:</span>
                            <span className="text-foreground">{item.projectedReach}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <Button
                        size="sm"
                        onClick={() => toast.success(`Allocated ${item.recommendedBudget} AI Boost to "${item.title}"`)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-xl"
                      >
                        <Rocket className="size-3.5 mr-1" /> Boost for {item.recommendedBudget}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <h1 className="font-display text-2xl font-semibold text-foreground">Performance & Attribution Analytics</h1>
                <p className="text-xs text-muted-foreground">Full-funnel campaign reach, engagement velocity, and conversion attribution</p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground">Spend vs. Reach Velocity</h3>
                    <p className="text-xs text-muted-foreground">Real-time delivery over the past 7 days</p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs text-emerald-500">
                    ROAS Pacing: 4.2×
                  </Badge>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ANALYTICS_TIMESERIES}>
                      <defs>
                        <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="reach" stroke="#10b981" fillOpacity={1} fill="url(#colorReach)" name="Reach" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
                  <h3 className="font-display text-base font-semibold text-foreground mb-1">Conversion Funnel</h3>
                  <p className="text-xs text-muted-foreground mb-4">From initial ad view to verified purchase</p>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={FUNNEL_DATA} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis type="number" tick={{ fontSize: 10 }} />
                        <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} width={90} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground mb-1">Channel Attribution</h3>
                    <p className="text-xs text-muted-foreground mb-4">Where your conversions are originating</p>
                    <div className="space-y-3 font-mono text-xs">
                      <div>
                        <div className="flex justify-between text-muted-foreground mb-1">
                          <span>Short-form Video Reels</span>
                          <span className="text-foreground font-semibold">48% (2,314 conversions)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-accent/60 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "48%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-muted-foreground mb-1">
                          <span>Editorial Story Cards</span>
                          <span className="text-foreground font-semibold">32% (1,542 conversions)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-accent/60 overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "32%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-muted-foreground mb-1">
                          <span>Creator & Sangha Collabs</span>
                          <span className="text-foreground font-semibold">20% (964 conversions)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-accent/60 overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: "20%" }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground font-mono">
                    Avg Customer Acquisition Cost (CAC): <strong className="text-emerald-500">₹50.37</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: CRM */}
          {activeTab === "crm" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-semibold text-foreground">Brand Growth CRM</h1>
                  <p className="text-xs text-muted-foreground">Customer leads, sample requests, and heritage patrons generated via EKA campaigns</p>
                </div>
                <Badge variant="outline" className="font-mono text-xs border-emerald-500/40 text-emerald-500 w-fit">
                  {BRAND_CRM_LEADS.length} Active Leads
                </Badge>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border/80 bg-accent/40 text-[10px] font-mono uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Lead / Patron</th>
                        <th className="px-4 py-3">Segment</th>
                        <th className="px-4 py-3">Stage</th>
                        <th className="px-4 py-3">Source Ad</th>
                        <th className="px-4 py-3">Est. LTV</th>
                        <th className="px-4 py-3">Interests</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 font-mono">
                      {BRAND_CRM_LEADS.map((lead) => (
                        <tr key={lead.id} className="hover:bg-accent/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-sans font-semibold text-foreground">{lead.name}</div>
                            <div className="text-[10px] text-muted-foreground">{lead.city} • Active {lead.lastActive}</div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground font-sans text-[11px]">{lead.segment}</td>
                          <td className="px-4 py-3">
                            <Badge
                              className={`text-[9px] font-mono px-2 py-0.5 ${
                                lead.stage === "Heritage Patron"
                                  ? "bg-emerald-500 text-white"
                                  : lead.stage === "Converted Customer"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-accent text-accent-foreground"
                              }`}
                            >
                              {lead.stage}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-[11px]">{lead.sourceCampaign}</td>
                          <td className="px-4 py-3 font-semibold text-foreground">{lead.ltv}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {lead.interestTags.map((t) => (
                                <span key={t} className="text-[9px] bg-accent/60 text-foreground px-1.5 py-0.5 rounded">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toast.info(`Opened nurture journey for ${lead.name}`)}
                              className="text-xs h-7 px-2"
                            >
                              Nurture →
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: STRATEGY */}
          {activeTab === "strategy" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="font-display text-2xl font-semibold text-foreground">Indic Market & Cultural Strategy</h1>
                <p className="text-xs text-muted-foreground">Anticipate ritual calendars, seasonal buying intent, and competitor whitespace</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase font-semibold">
                    <Calendar className="size-4" />
                    Upcoming Indic Windows
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground">Kartik Deepotsav & Diwali</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Peak consumer intent for pure brass diyas, handcrafted silver, and natural beeswax candles begins 18 days before Dhanteras.
                  </p>
                  <Badge variant="outline" className="text-xs font-mono text-emerald-500">
                    Recommended Launch: Oct 12
                  </Badge>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase font-semibold">
                    <Compass className="size-4" />
                    Category Whitespace
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground">Temple Sanctuary Decor</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    High search volume (+310% YoY) for architectural home mandir accents with zero chemical lacquer. Supply is currently 60% below demand.
                  </p>
                  <Badge variant="outline" className="text-xs font-mono text-primary">
                    High Opportunity Index
                  </Badge>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs uppercase font-semibold">
                    <TrendingUp className="size-4" />
                    Competitor Intelligence
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground">Artisan Voice vs Studio Models</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Competitors using agency models see 38% drop-off. Brands featuring real weavers and potters in first 3 seconds achieve 9.1% engagement.
                  </p>
                  <Badge variant="outline" className="text-xs font-mono text-emerald-500">
                    2.4× Retention Advantage
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CREATE CAMPAIGN MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">Create Growth Campaign</h3>
                <p className="text-xs text-muted-foreground">Launch into EKA short-form reels, stories, or artisan spots</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-muted-foreground block mb-1">Campaign Title</label>
                <Input
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                  placeholder="e.g. Navratri Artisan Chanderi Silk Showcase"
                  className="text-xs rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground block mb-1">Campaign Format</label>
                  <select
                    value={newCampaign.format}
                    onChange={(e) => setNewCampaign({ ...newCampaign, format: e.target.value as any })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs"
                  >
                    <option value="short_video_reel">Vertical Video Reel (Reels/Shorts)</option>
                    <option value="story_card">Editorial Story Card</option>
                    <option value="creator_collab">Creator / Sangha Collab</option>
                    <option value="collection_sponsor">Visual Collection Sponsor</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground block mb-1">Objective</label>
                  <select
                    value={newCampaign.objective}
                    onChange={(e) => setNewCampaign({ ...newCampaign, objective: e.target.value as any })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs"
                  >
                    <option value="Product Conversions">Product Conversions</option>
                    <option value="Video Views">Video Views</option>
                    <option value="TG Engagement">TG Engagement</option>
                    <option value="Reach & Awareness">Reach & Awareness</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-muted-foreground block mb-1">Target Audience Segment</label>
                <select
                  value={newCampaign.tgSegment}
                  onChange={(e) => setNewCampaign({ ...newCampaign, tgSegment: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs"
                >
                  {AUDIENCE_SEGMENTS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.demographic})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-muted-foreground block mb-1">
                  Budget: ₹{newCampaign.budget.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="5000"
                  value={newCampaign.budget}
                  onChange={(e) => setNewCampaign({ ...newCampaign, budget: Number(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-xs rounded-xl"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-xl">
                  Deploy Campaign
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUTOPILOT MODAL */}
      {isAutopilotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl border border-amber-500/40 bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                  <Zap className="size-4 fill-current" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">EKA Campaign Autopilot</h3>
                  <p className="text-xs text-muted-foreground">State your objective. EKA analyzes, creates, and launches.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAutopilotModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteAutopilot} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-muted-foreground block mb-1">
                  Goal Prompt (Natural Language):
                </label>
                <textarea
                  rows={3}
                  value={autopilotPrompt}
                  onChange={(e) => setAutopilotPrompt(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs leading-relaxed"
                  placeholder="e.g. I want to reach 18-24 urban consumers interested in Sacred Acoustics with a ₹50,000 budget."
                />
              </div>

              {autopilotStep > 0 && (
                <div className="rounded-xl bg-accent/40 p-3 space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <RefreshCw className="size-3.5 animate-spin" />
                    <span>Executing Autopilot Pipeline:</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {autopilotStep === 1 && "Step 1: Ingesting audience demand and intent graph..."}
                    {autopilotStep === 2 && "Step 2: Synthesizing pricing and optimal 8-10 PM delivery window..."}
                    {autopilotStep === 3 && "Step 3: Pairing with master creator @vedic.acoustics..."}
                    {autopilotStep === 4 && "Step 4: Locking bid ceiling and allocating budget..."}
                    {autopilotStep === 5 && "Step 5: Deployed into live ad network!"}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsAutopilotModalOpen(false)}
                  className="text-xs rounded-xl"
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  disabled={autopilotRunning}
                  className="bg-amber-600 hover:bg-amber-500 text-white text-xs rounded-xl font-semibold"
                >
                  {autopilotRunning ? "Deploying..." : "Launch Autopilot Now"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
