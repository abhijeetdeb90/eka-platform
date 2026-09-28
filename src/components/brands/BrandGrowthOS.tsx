// ==============================================================================
// EKA GROWTH OS — FULL BRAND OPERATING SYSTEM COMPONENT
// ==============================================================================
// Meta Ads Manager + GA4 + CRM + AI Strategy layer for heritage & lifestyle brands.
// Mental Model: "Here is what your audience is doing, why it matters,
// what you should do next, and then let me execute it."
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
  MOCK_CAMPAIGNS,
  AUDIENCE_SEGMENTS,
  PROMOTABLE_CONTENT,
  BRAND_CRM_LEADS,
  type BrandProfile,
  type Campaign,
  type AudienceSegment,
} from "./brand-mock-data";

export type BrandTab =
  | "dashboard"
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
  { stage: "Product Clicks", count: 88400 },
  { stage: "Conversions", count: 4820 },
];

interface BrandGrowthOSProps {
  initialTab?: BrandTab;
}

export function BrandGrowthOS({ initialTab = "dashboard" }: BrandGrowthOSProps) {
  const [activeTab, setActiveTab] = useState<BrandTab>(initialTab);
  const [selectedBrand, setSelectedBrand] = useState<BrandProfile>(ACTIVE_BRANDS[0]);
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [campaignFilter, setCampaignFilter] = useState<"all" | "active" | "scheduled" | "completed">("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Campaign Form State
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    objective: "Product Conversions" as Campaign["objective"],
    format: "short_video_reel" as Campaign["format"],
    budget: 50000,
    tgSegment: "Conscious Urban Indic (24-38)",
  });

  // AI Agent Interactive State
  const [agentPrompt, setAgentPrompt] = useState(
    "Analyze our Varanasi Handloom Silk campaign and generate a 7-day festive boost strategy."
  );
  const [agentAnalyzing, setAgentAnalyzing] = useState(false);
  const [agentResult, setAgentResult] = useState<string | null>(null);

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

  const handleRunAgent = () => {
    setAgentAnalyzing(true);
    setAgentResult(null);
    setTimeout(() => {
      setAgentAnalyzing(false);
      setAgentResult(
        `EKA GROWTH AGENT AUDIT REPORT\n\n` +
        `• Cultural Alignment Index: 96/100 (Authentic Varanasi Loom Transmission)\n` +
        `• Audience Response: Gen Z engagement is pacing 2.4× higher than older demographics.\n` +
        `• Strategic Recommendation: Shift ₹25,000 from static banner ads into Creator Micro-Reels between 8–10 PM IST.\n` +
        `• Projected Lift: +140,000 reach, +380 verified product conversions, estimated ROAS 4.6×.`
      );
      toast.success("AI Strategy generated successfully!");
    }, 1200);
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

          {/* Quick Real-Time Metrics Ticker */}
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
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Ad Network Live
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs gap-1.5 shadow-sm"
            >
              <Plus className="size-3.5" />
              <span className="hidden sm:inline">Create Campaign</span>
              <span className="sm:hidden">Create</span>
            </Button>

            <Link to="/">
              <Button size="sm" variant="ghost" className="text-xs h-8 text-muted-foreground hover:text-foreground">
                <Globe className="size-3.5 mr-1" />
                <span className="hidden sm:inline">Consumer View</span>
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
        <aside className="w-full md:w-60 border-b md:border-b-0 md:border-r border-border/80 bg-card/60 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible shrink-0">
          <div className="hidden md:block px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            EKA Growth Suite
          </div>

          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3, badge: null },
            { id: "campaigns", label: "Campaigns", icon: Target, badge: `${campaigns.filter((c) => c.status === "active").length} Active` },
            { id: "audience", label: "Audience (TG)", icon: Users, badge: "4 Segments" },
            { id: "promote", label: "Promote", icon: Rocket, badge: null },
            { id: "analytics", label: "Analytics", icon: TrendingUp, badge: "Meta/GA4" },
            { id: "crm", label: "Brand CRM", icon: HeartHandshake, badge: null },
            { id: "strategy", label: "Strategy", icon: Brain, badge: null },
            { id: "agent", label: "AI Growth Agent", icon: Bot, badge: "Gemini", glow: true },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as BrandTab)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all text-left whitespace-nowrap md:whitespace-normal ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`size-4 ${isActive ? "text-emerald-500" : "text-muted-foreground"}`} />
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

          <div className="mt-auto hidden md:block pt-6 p-3 border-t border-border/60">
            <div className="rounded-xl bg-accent/40 p-3 text-[11px] text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Growth OS Loop</p>
              <p className="text-[10px] leading-relaxed">
                Audience → Insights → Strategy → Campaign → Promote → CRM → AI
              </p>
            </div>
          </div>
        </aside>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl">
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Top Greeting & Value Prop */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
                  Run your brand's growth on EKA
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-1 text-foreground">
                  Good morning, {selectedBrand.name}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Your Indic audience growth, ad performance, and real-time cultural intelligence at a glance.
                </p>
              </div>

              {/* 4 Key Performance Metrics */}
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

              {/* "What EKA Sees" & "What EKA Recommends" Banners */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 relative overflow-hidden">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase font-semibold">
                    <Eye className="size-4" />
                    What EKA Sees
                  </div>
                  <h3 className="font-display text-base font-semibold mt-2 text-foreground">
                    Your Gen Z audience is responding 2.3× more to short-form video than static product content.
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Watch-time on handcrafted brassware & mulberry loom reels peaked between 8:00–10:30 PM IST. Engagement depth is highest when artisans explain the philosophy.
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

                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 relative overflow-hidden">
                  <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase font-semibold">
                    <Sparkles className="size-4" />
                    What EKA Recommends
                  </div>
                  <h3 className="font-display text-base font-semibold mt-2 text-foreground">
                    Launch a 7-day creator-led campaign around Varanasi Handloom Silk.
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Shift ₹25,000 from static banner inventory into artisan short-form video reels. Projected reach is +340K at ₹0.42 per engagement with 4.6× ROAS.
                  </p>
                  <div className="mt-4">
                    <Button
                      size="sm"
                      onClick={() => {
                        setActiveTab("agent");
                        setAgentPrompt("Generate a 7-day creator-led campaign for Varanasi Handloom Silk with ₹25,000 budget.");
                      }}
                      className="bg-primary text-primary-foreground text-xs rounded-xl shadow-xs"
                    >
                      Generate Strategy with AI Agent
                      <ArrowRight className="size-3 ml-1.5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Your Active Campaigns Overview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground">Your Campaigns</h2>
                    <p className="text-xs text-muted-foreground">Active and scheduled campaigns running on EKA</p>
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

              {/* Audience Snapshot */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground">Target Audience (TG) Pulse</h2>
                    <p className="text-xs text-muted-foreground">Who is engaging with your brand on EKA</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("audience")}
                    className="text-xs rounded-xl"
                  >
                    Deep Audience Explorer
                    <ChevronRight className="size-3.5 ml-1" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {AUDIENCE_SEGMENTS.map((seg) => (
                    <div
                      key={seg.id}
                      className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-emerald-500 uppercase">{seg.growth}</span>
                          <Badge variant="outline" className="text-[9px] font-mono">
                            Affinity {seg.affinityScore}%
                          </Badge>
                        </div>
                        <h4 className="font-display text-sm font-semibold mt-1 text-foreground">{seg.name}</h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{seg.demographic}</p>
                        <p className="text-xs text-foreground/80 mt-2 line-clamp-2">{seg.whoTheyAre}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/60">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">Top Purchasing:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {seg.topProductsInterested.slice(0, 2).map((prod) => (
                            <span
                              key={prod}
                              className="text-[10px] bg-accent/60 text-foreground px-1.5 py-0.5 rounded-md"
                            >
                              {prod}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Feed Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground">Content Ready to Promote</h2>
                    <p className="text-xs text-muted-foreground">High-performing reels, story cards, and artisan assets</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("promote")}
                    className="text-xs rounded-xl"
                  >
                    Promote Studio
                    <ChevronRight className="size-3.5 ml-1" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {PROMOTABLE_CONTENT.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs flex flex-col">
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
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                        <h4 className="text-xs font-medium text-foreground line-clamp-1">{item.title}</h4>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                          <span>Engagement: <strong className="text-emerald-500">{item.organicEngagement}</strong></span>
                          <span>{item.conversionPotential} Potential</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setActiveTab("promote");
                            toast.info(`Configuring boost for "${item.title}"`);
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-7 rounded-lg"
                        >
                          <Rocket className="size-3 mr-1" /> Boost with AI
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CAMPAIGNS */}
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
                        className={`rounded-lg px-2.5 py-1 text-xs capitalize transition-colors ${
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

          {/* TAB 3: AUDIENCE (TG INTELLIGENCE) */}
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
                        setNewCampaign({
                          ...newCampaign,
                          tgSegment: seg.name,
                        });
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

          {/* TAB 4: PROMOTE STUDIO */}
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
                          {item.organicViews}
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
                        onClick={() => {
                          toast.success(`Allocated ${item.recommendedBudget} AI Boost to "${item.title}"`);
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-xl"
                      >
                        <Rocket className="size-3.5 mr-1" />
                        Boost for {item.recommendedBudget}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ANALYTICS (META ADS + GA4 STYLE) */}
          {activeTab === "analytics" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <h1 className="font-display text-2xl font-semibold text-foreground">Performance & Attribution Analytics</h1>
                <p className="text-xs text-muted-foreground">Full-funnel campaign reach, engagement velocity, and conversion attribution</p>
              </div>

              {/* Time Series Area Chart */}
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

              {/* Funnel & Attribution */}
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

          {/* TAB 6: BRAND CRM */}
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

          {/* TAB 7: STRATEGY & MARKET INTELLIGENCE */}
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

          {/* TAB 8: AI GROWTH AGENT */}
          {activeTab === "agent" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs uppercase font-semibold">
                  <Bot className="size-4" />
                  Gemini-Powered Autonomous Growth Co-Pilot
                </div>
                <h1 className="font-display text-2xl font-semibold text-foreground mt-1">EKA AI Growth Agent</h1>
                <p className="text-xs text-muted-foreground">
                  Analyse past campaigns, strategise upcoming launches, create authentic copy, and auto-optimise ad bids.
                </p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                <label className="text-xs font-mono uppercase text-muted-foreground block">
                  Agent Instruction & Strategic Prompt
                </label>
                <div className="relative">
                  <Input
                    value={agentPrompt}
                    onChange={(e) => setAgentPrompt(e.target.value)}
                    placeholder="Ask the Growth Agent to analyse, strategise, or optimise your campaigns..."
                    className="pr-28 text-xs py-5 rounded-xl border-border/80"
                  />
                  <Button
                    size="sm"
                    disabled={agentAnalyzing}
                    onClick={handleRunAgent}
                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-lg px-4"
                  >
                    {agentAnalyzing ? (
                      <>
                        <RefreshCw className="size-3.5 animate-spin mr-1" />
                        Auditing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-3.5 mr-1" />
                        Execute
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                  <span className="text-muted-foreground font-mono text-[10px]">Try Quick Prompts:</span>
                  {[
                    "Audit Varanasi Loom video ad retention",
                    "Suggest 3 festive reels for Dhanteras",
                    "Optimize budget across Gen Z segment",
                    "Check ad copy for sacred cultural respect",
                  ].map((p) => (
                    <button
                      key={p}
                      onClick={() => setAgentPrompt(p)}
                      className="rounded-lg bg-accent/60 hover:bg-accent px-2.5 py-1 text-foreground transition-colors cursor-pointer"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {agentResult && (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4 text-xs font-mono whitespace-pre-wrap leading-relaxed animate-in fade-in duration-300">
                    {agentResult}
                  </div>
                )}
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
                className="text-muted-foreground hover:text-foreground text-sm"
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
                  className="w-full accent-emerald-500"
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
    </div>
  );
}
