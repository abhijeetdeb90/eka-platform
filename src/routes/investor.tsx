import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowRight,
  Compass,
  Building2,
  Smartphone,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { EkaLogo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductStatus } from "@/components/investor/ProductStatus";
import {
  PRODUCT_STATUS_REGISTRY,
  ROADMAP_REGISTRY,
  getFeatureCounts,
} from "@/config/investor-registry";
import { startInvestorDemoSession, type InvestorDemoRole } from "@/lib/auth/demo-session";

export const Route = createFileRoute("/investor")({
  head: () => ({
    meta: [
      { title: "EKA Platform — Investor & Product Presentation Gateway" },
      {
        name: "description",
        content:
          "EKA Master Product Status Registry, operational topology, and investor demo access for accredited partners.",
      },
      { property: "og:title", content: "EKA Platform — Investor Gateway" },
    ],
  }),
  component: InvestorGatewayPage,
});

function InvestorGatewayPage() {
  const navigate = useNavigate();
  const counts = getFeatureCounts();
  const [selectedRole, setSelectedRole] = useState<InvestorDemoRole>("consumer");

  const handleLaunchDemo = (role: InvestorDemoRole) => {
    startInvestorDemoSession(role);
    toast.success(`Investor Demo Mode active (${role.toUpperCase()})`);
    if (role === "admin") {
      navigate({ to: "/founder-admin" });
    } else if (role === "enterprise") {
      navigate({ to: "/brands-enterprise" });
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-terracotta/20">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container-eka flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <EkaLogo size="md" withTagline={false} />
            <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-widest border-amber-500/40 text-amber-600 dark:text-amber-400">
              Investor Gateway
            </Badge>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-xs font-mono"
            >
              <Link to="/">Live Platform</Link>
            </Button>
            <Button
              size="sm"
              onClick={() => handleLaunchDemo("admin")}
              className="bg-terracotta hover:bg-terracotta/90 text-white text-xs font-mono tracking-wider uppercase"
            >
              Demo Admin OS
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 py-12 lg:py-16">
        <div className="container-eka space-y-12">
          {/* Header Copy */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-mono font-medium">
              <Sparkles className="size-3.5" />
              <span>THE WORLD'S TRUSTED CULTURAL INTELLIGENCE LAYER</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
              EKA Product Status & Master Architecture
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
              Real-time operational topology, maturity ratings, and authenticated sandboxes for accredited partners.
            </p>
          </div>

          {/* Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl border border-border/80 bg-card/60 shadow-xs">
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest block mb-1">
                Total Products
              </span>
              <span className="font-serif text-3xl font-bold text-foreground">{counts.total}</span>
            </div>
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 shadow-xs">
              <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-widest block mb-1">
                Live Systems
              </span>
              <span className="font-serif text-3xl font-bold text-emerald-600 dark:text-emerald-400">{counts.live}</span>
            </div>
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 shadow-xs">
              <span className="font-mono text-xs text-amber-700 dark:text-amber-400 uppercase tracking-widest block mb-1">
                Functional Beta
              </span>
              <span className="font-serif text-3xl font-bold text-amber-600 dark:text-amber-400">{counts.beta}</span>
            </div>
            <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/5 shadow-xs">
              <span className="font-mono text-xs text-purple-700 dark:text-purple-400 uppercase tracking-widest block mb-1">
                Roadmap Tracks
              </span>
              <span className="font-serif text-3xl font-bold text-purple-600 dark:text-purple-400">{counts.roadmap}</span>
            </div>
          </div>

          {/* Interactive Demo Sandbox Launcher */}
          <div className="p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-sand/20 to-transparent space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Lock className="size-4 text-amber-600 dark:text-amber-400" />
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                  Secure Investor Demo Access
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Activate an investor sandbox session with 1 click. Safe, read-only evaluation environment.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div
                onClick={() => setSelectedRole("consumer")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedRole === "consumer"
                    ? "border-amber-500 bg-card shadow-md ring-2 ring-amber-500/20"
                    : "border-border/80 bg-card/60 hover:bg-card"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Compass className="size-5 text-terracotta" />
                  <Badge variant="outline" className="text-[10px]">Consumer</Badge>
                </div>
                <h3 className="font-semibold text-sm text-foreground">Living Cultural Sanctuary</h3>
                <p className="text-xs text-muted-foreground mt-1">Reels, living atlas, knowledge codex & community circles.</p>
              </div>

              <div
                onClick={() => setSelectedRole("admin")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedRole === "admin"
                    ? "border-amber-500 bg-card shadow-md ring-2 ring-amber-500/20"
                    : "border-border/80 bg-card/60 hover:bg-card"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Layers className="size-5 text-saffron" />
                  <Badge variant="outline" className="text-[10px]">Founder OS</Badge>
                </div>
                <h3 className="font-semibold text-sm text-foreground">Admin & Operations OS</h3>
                <p className="text-xs text-muted-foreground mt-1">12-subsystem radar, MAU telemetry & platform ledger.</p>
              </div>

              <div
                onClick={() => setSelectedRole("enterprise")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedRole === "enterprise"
                    ? "border-amber-500 bg-card shadow-md ring-2 ring-amber-500/20"
                    : "border-border/80 bg-card/60 hover:bg-card"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="size-5 text-emerald-600" />
                  <Badge variant="outline" className="text-[10px]">Enterprise</Badge>
                </div>
                <h3 className="font-semibold text-sm text-foreground">Brand Growth OS</h3>
                <p className="text-xs text-muted-foreground mt-1">Cultural trend radar, Brand Brain AI & closed-loop attribution.</p>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Button
                onClick={() => handleLaunchDemo(selectedRole)}
                className="bg-terracotta hover:bg-terracotta/90 text-white font-mono text-xs uppercase tracking-wider gap-2 px-6"
              >
                <span>Launch {selectedRole.toUpperCase()} Environment</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Master Product Cards */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Master Product Inventory
            </h2>

            <div className="space-y-4">
              {PRODUCT_STATUS_REGISTRY.map((prod) => (
                <div
                  key={prod.id}
                  className="p-6 rounded-2xl border border-border/80 bg-card shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-serif text-lg font-bold text-foreground">{prod.name}</h3>
                        <ProductStatus status={prod.status} />
                        <span className="text-xs font-mono text-muted-foreground">{prod.version}</span>
                      </div>
                      <p className="text-xs text-muted-foreground italic font-mono">{prod.headline}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {prod.url.startsWith("/") ? (
                        <Button size="sm" variant="outline" asChild className="text-xs gap-1.5">
                          <Link to={prod.url as any}>
                            <span>Open {prod.platform}</span>
                            <ArrowRight className="size-3" />
                          </Link>
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" asChild className="text-xs gap-1.5">
                          <a href={prod.url} target="_blank" rel="noopener noreferrer">
                            <span>Inspect</span>
                            <ExternalLink className="size-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{prod.description}</p>

                  {/* Feature Badges */}
                  <div className="pt-2 border-t border-border/50">
                    <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block mb-2">
                      Verified Capabilities ({prod.features.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {prod.features.map((feat) => (
                        <div
                          key={feat.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/60 bg-muted/30 text-xs"
                          title={feat.description}
                        >
                          <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                          <span className="font-medium text-foreground">{feat.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">({feat.status})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Roadmap */}
          <div className="space-y-6 pt-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Strategic Roadmap (2026–2027)
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ROADMAP_REGISTRY.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] font-mono">{item.category}</Badge>
                      <span className="text-xs font-mono font-bold text-terracotta">{item.target}</span>
                    </div>
                    <h3 className="font-serif text-base font-semibold text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                  <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                    <strong className="text-foreground">Impact:</strong> {item.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-sand/20 py-8 text-center text-xs text-muted-foreground">
        <div className="container-eka space-y-2">
          <p className="font-mono text-[11px] tracking-wider uppercase text-foreground">
            EKA Platform — One Within. One With All.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Digital Personal Data Protection (DPDP) Act, 2023 Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
