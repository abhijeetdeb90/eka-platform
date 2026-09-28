// ==============================================================================
// EKA FOR BRANDS & ENTERPRISE — DEDICATED BRAND PLATFORM (/brands)
// ==============================================================================
// A dedicated environment for brand partners, cultural institutions, agencies,
// and enterprise clients seeking authentic cultural intelligence, non-appropriative
// storytelling, artisan collaborations, and high-throughput knowledge APIs.
// ==============================================================================

import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight,
  CheckCircle2,
  Send,
  Calendar,
  Layers,
  Bot,
  Flame,
  Globe,
  Users,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EkaLogo } from "@/components/brand/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: [
      { title: "EKA for Brands — Cultural Intelligence, Practice & Enterprise Heritage" },
      {
        name: "description",
        content:
          "Help your brand navigate sacred traditions, regional diversity, and artisanal collaborations with verified cultural intelligence and non-appropriative practice.",
      },
    ],
  }),
  component: BrandsPlatformPage,
});

export function BrandsPlatformPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "practice" | "insights" | "collaborations" | "enterprise" | "contact">("overview");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    brandName: "",
    contactEmail: "",
    industry: "Luxury & Lifestyle",
    needs: "Authentic Campaign Storytelling",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    toast.success("Enquiry received. Our Cultural Intelligence team will reach out within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-sand/20 text-foreground flex flex-col selection:bg-terracotta/20">
      {/* Brands Dedicated Header */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:opacity-90 transition-opacity">
              <EkaLogo />
            </Link>
            <div className="h-5 w-px bg-border/70" />
            <div className="flex items-center gap-2">
              <span className="font-display font-medium text-base text-foreground tracking-tight">
                FOR BRANDS
              </span>
              <Badge variant="outline" className="text-[9px] uppercase font-mono text-terracotta border-terracotta/30 bg-terracotta/5">
                Enterprise
              </Badge>
            </div>
          </div>

          {/* Brands Internal Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {(
              [
                { id: "overview", label: "Overview" },
                { id: "practice", label: "Practice" },
                { id: "insights", label: "Insights" },
                { id: "collaborations", label: "Collaborations" },
                { id: "enterprise", label: "Enterprise" },
                { id: "contact", label: "Contact" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-mono transition-colors ${
                  activeTab === tab.id
                    ? "bg-terracotta text-white font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Action Links */}
          <div className="flex items-center gap-3">
            <Link
              to="/agent"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-medium text-terracotta hover:underline"
            >
              <Bot className="size-3.5" />
              <span>Branding Agent</span>
            </Link>

            <Link
              to="/"
              className="text-xs font-mono text-muted-foreground hover:text-foreground border border-border px-2.5 py-1 rounded-md"
            >
              ← Consumer EKA
            </Link>
          </div>
        </div>
      </header>

      {/* Main Brand Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 space-y-16">
        
        {/* Hero Section */}
        <section className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-terracotta/30 bg-terracotta/5 text-terracotta text-xs font-mono">
            <ShieldCheck className="size-3.5" />
            Cultural Reverence · Provenance Verification · Non-Appropriative Storytelling
          </div>
          <h1 className="font-display font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.1] text-foreground">
            Ground your brand in unbroken living heritage.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground font-light leading-relaxed">
            In an era of cultural flattening and tokenistic representation, EKA provides modern brands,
            institutions, and creative leaders with the verified cultural intelligence required to honor
            traditions authentically.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              onClick={() => setActiveTab("contact")}
              className="bg-terracotta hover:bg-terracotta/90 text-white rounded-xl px-6 py-5 text-sm font-medium shadow-calm"
            >
              <span>Initiate Brand Enquiry</span>
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Link to="/agent">
              <Button variant="outline" className="rounded-xl px-6 py-5 text-sm font-medium">
                <Bot className="mr-2 size-4 text-terracotta" />
                <span>Launch Branding Agent</span>
              </Button>
            </Link>
          </div>
        </section>

        {/* Tab 1: Overview & Value Pillars */}
        {(activeTab === "overview" || activeTab === "practice") && (
          <section className="space-y-8 border-t border-border/60 pt-12">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-muted-foreground block mb-1">
                Capability 01 · Institutional Grounding
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-normal">
                Cultural Practice for Modern Brands
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl font-light">
                How modern lifestyle, hospitality, and consumer brands engage living traditions with
                epistemic rigor rather than superficial aesthetics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-3">
                <div className="size-10 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center">
                  <Flame className="size-5" />
                </div>
                <h3 className="font-display text-lg font-medium">Authenticity & Ritual Auditing</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Pre-campaign audits of festive narratives, sacred symbols, and regional rituals to prevent
                  tone-deaf marketing and protect community lineage.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-3">
                <div className="size-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
                  <Compass className="size-5" />
                </div>
                <h3 className="font-display text-lg font-medium">Sacred Calendar Alignment</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Synchronize product launches, seasonal collections, and hospitality experiences with the
                  exact astronomical and cultural rhythm of 6 world traditions.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-3">
                <div className="size-10 rounded-xl bg-saffron/10 text-saffron flex items-center justify-center">
                  <Globe className="size-5" />
                </div>
                <h3 className="font-display text-lg font-medium">Artisan Provenance Protocols</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Direct lineage verification for GI-tagged crafts, temple metallurgy, handlooms, and indigenous
                  botanicals with transparent source passports.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Tab 2: Insights */}
        {(activeTab === "overview" || activeTab === "insights") && (
          <section className="space-y-8 border-t border-border/60 pt-12">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-muted-foreground block mb-1">
                Capability 02 · Behavioral Telemetry
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-normal">
                Brand Intelligence & Observance Telemetry
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl font-light">
                Real-time regional sentiment and cultural trend mapping across unbroken heritage clusters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-terracotta shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Pan-Regional Pluralism Tracking</h4>
                    <p className="text-xs text-muted-foreground font-light mt-1">
                      Understand how festivals like Diwali, Bihu, and Pongal manifest differently across 18
                      linguistic and community micro-geographies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-terracotta shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">DPDP-Compliant Behavioral Signals</h4>
                    <p className="text-xs text-muted-foreground font-light mt-1">
                      Non-invasive, privacy-first demographic sentiment analytics grounded in community consensus
                      rather than surveillance cookies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-terracotta shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Epistemic Risk Rating</h4>
                    <p className="text-xs text-muted-foreground font-light mt-1">
                      Real-time sensitivity scores indicating whether copy or creative direction triggers cultural
                      misappropriation disputes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                  <span className="text-xs font-mono font-medium">Seasonal Cultural Pulse (Q3-Q4)</span>
                  <Badge variant="secondary" className="text-[10px] font-mono">Live Sample</Badge>
                </div>
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Navratri / Durga Puja Micro-rituals</span>
                    <span className="text-emerald-600 font-semibold">+84% interest</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full w-4/5" />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-muted-foreground">Aranmula Mirror GI Artisanship</span>
                    <span className="text-terracotta font-semibold">High Scarcity</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="bg-terracotta h-1.5 rounded-full w-3/5" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 3: Collaborations */}
        {(activeTab === "overview" || activeTab === "collaborations") && (
          <section className="space-y-8 border-t border-border/60 pt-12">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-muted-foreground block mb-1">
                Capability 03 · Direct Lineage Connection
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-normal">
                Artisan & Practitioner Collaborations
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl font-light">
                Direct partnerships with verified master creators, oral chanters, and GI guildholders, ensuring
                fair compensation and ethical provenance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Aranmula Metal Metallurgy Guild",
                  place: "Kerala, India",
                  tag: "GI Heritage #9",
                  desc: "Authentic alloy mirrors cast from unbroken copper-tin formulas. Co-branded limited edition sanctum pieces.",
                },
                {
                  title: "Majuli Mask & Sattriya Monasteries",
                  place: "Assam, India",
                  tag: "Bhakti Drama",
                  desc: "Bamboo and river clay theatrical masks documented in the Sangeet Natak Akademi archives.",
                },
                {
                  title: "Bishnoi Ecological Fellowship",
                  place: "Rajasthan, India",
                  tag: "Living Conservation",
                  desc: "Sustainable desert textile dyeing using natural indigo and babool gum following the 29 sacred tenets.",
                },
              ].map((c) => (
                <div key={c.title} className="p-6 rounded-2xl border border-border bg-card space-y-3">
                  <Badge variant="outline" className="text-[10px] font-mono uppercase text-terracotta border-terracotta/30">
                    {c.tag}
                  </Badge>
                  <h4 className="font-display text-lg font-medium">{c.title}</h4>
                  <p className="text-xs text-muted-foreground font-mono">{c.place}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed font-light">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab 4: Enterprise Services & APIs */}
        {(activeTab === "overview" || activeTab === "enterprise") && (
          <section className="space-y-6 border-t border-border/60 pt-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-muted-foreground block mb-1">
                  Capability 04 · Enterprise Infrastructure
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-normal">
                  High-Throughput Knowledge APIs
                </h2>
                <p className="mt-1 text-sm text-muted-foreground font-light">
                  Institutional workspaces, dedicated API keys, rate limiters, and automated source registries.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link to="/enterprise">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <span>Manage Workspaces</span>
                    <ExternalLink className="size-3" />
                  </Button>
                </Link>
                <Link to="/agent">
                  <Button size="sm" className="bg-terracotta text-white hover:bg-terracotta/90 gap-1.5 text-xs">
                    <Bot className="size-3.5" />
                    <span>Branding Agent</span>
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Tab 5: Contact & Inbound Enquiry */}
        <section id="contact-form" className="border-t border-border/60 pt-12 pb-16">
          <div className="max-w-2xl mx-auto rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-calm space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-terracotta font-semibold">
                Brand Partnership Inquiry
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-normal">
                Consult with our Cultural Stewards
              </h2>
              <p className="text-xs text-muted-foreground font-light max-w-md mx-auto">
                Reach our enterprise desk for cultural audits, campaign consulting, artisan collaborations,
                or dedicated Knowledge Graph licensing.
              </p>
            </div>

            {formSubmitted ? (
              <div className="text-center py-10 space-y-3 bg-muted/30 rounded-2xl border border-emerald-500/20">
                <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
                <h3 className="font-display text-xl font-medium text-foreground">Enquiry Dispatched</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto font-light">
                  Thank you for reaching out with reverence. Our brand intelligence directors will respond
                  with tailored credentials and a preliminary audit within 24 hours.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFormSubmitted(false)}
                  className="mt-2 text-xs"
                >
                  Send another inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Brand or Organization Name</label>
                    <Input
                      required
                      placeholder="e.g. Fabindia, Taj Hotels, Apple"
                      value={formData.brandName}
                      onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Corporate Email</label>
                    <Input
                      type="email"
                      required
                      placeholder="executive@yourbrand.com"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Industry Sector</label>
                    <select
                      className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    >
                      <option>Luxury & Fashion</option>
                      <option>Hospitality & Travel</option>
                      <option>Food & Sacred Botanicals</option>
                      <option>Media & Publishing</option>
                      <option>Academic & Cultural Institution</option>
                      <option>Consumer Tech</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Primary Capability Needed</label>
                    <select
                      className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs"
                      value={formData.needs}
                      onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                    >
                      <option>Authentic Campaign Storytelling</option>
                      <option>Artisan Provenance & Collaborations</option>
                      <option>Sacred Calendar & Timing Alignment</option>
                      <option>High-Throughput Knowledge API</option>
                      <option>Pre-Release Sensitivity Audit</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Project Scope & Timeline</label>
                  <Textarea
                    rows={4}
                    required
                    placeholder="Briefly describe your brand initiative, intended tradition or geography, and desired launch window."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl py-5 bg-terracotta hover:bg-terracotta/90 text-white font-medium"
                >
                  <Send className="mr-2 size-4" />
                  <span>Submit Enterprise Enquiry</span>
                </Button>
              </form>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
