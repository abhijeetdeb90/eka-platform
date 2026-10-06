// ==============================================================================
// EKA INVESTOR PRESENTATION — DEDICATED ENTERPRISE PRESENTATION ENTRY (/investor/enterprise)
// ==============================================================================
// Dedicated, investor-accessible Enterprise presentation environment demonstrating:
// - Cultural Trend Radar & early intent signals (LIVE)
// - Brand Brain AI co-pilot for cultural sensitivity (LIVE)
// - Closed-Loop Attribution from cultural discovery to purchase LTV (LIVE)
// - Heritage Artisan & Creator Sponsorship Marketplace (LIVE)
// - Institutional Workspaces & Namespaces (BETA)
// - High-throughput Commercial Cultural Knowledge Graph APIs (ROADMAP)
// ==============================================================================

import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { startInvestorDemoSession, DEMO_CREDENTIALS } from "@/lib/auth/demo-session";
import { BrandsEnterpriseShell } from "@/apps/brands-enterprise/components/BrandsEnterpriseShell";
import { BrandGrowthOS } from "@/components/brands/BrandGrowthOS";
import { ProductStatus } from "@/components/investor/ProductStatus";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, Layers, Globe, Building2 } from "lucide-react";

export const Route = createFileRoute("/investor/enterprise")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      startInvestorDemoSession("enterprise");
    }
  },
  head: () => ({
    meta: [
      { title: "EKA Enterprise — Investor Presentation Environment" },
      {
        name: "description",
        content:
          "Investor presentation environment for EKA Enterprise & Brand Growth OS. Explore Cultural Trend Radar, Brand Brain AI, and attribution telemetry.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: InvestorEnterprisePresentationPage,
});

function InvestorEnterprisePresentationPage() {
  useEffect(() => {
    startInvestorDemoSession("enterprise");
  }, []);

  return (
    <div className="min-h-screen bg-sand/20 dark:bg-neutral-950 text-foreground flex flex-col selection:bg-blue-500/20 selection:text-blue-300">
      {/* Investor Presentation Control Ribbon */}
      <section
        aria-label="Investor Presentation Environment Safeguard"
        className="border-b border-blue-500/30 bg-card/95 px-4 sm:px-6 py-2.5 sticky top-0 z-50 backdrop-blur-md shadow-xs"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Link
              to="/investor"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium transition-colors group"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Investor Gateway</span>
            </Link>

            <span className="text-muted-foreground/40">/</span>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground tracking-wide flex items-center gap-1.5">
                <Building2 className="size-3.5 text-blue-500" />
                <span>Enterprise Growth OS</span>
              </span>
              <ProductStatus status="BETA" size="xs" />
              <Badge
                variant="outline"
                className="font-mono text-[9px] uppercase border-blue-500/30 text-blue-700 dark:text-blue-300 bg-blue-500/10 px-1.5 py-0"
              >
                Investor Demo
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-muted-foreground font-mono text-[11px]">
              <ShieldCheck className="size-3.5 text-blue-500" />
              <span>Role: {DEMO_CREDENTIALS.enterprise.email}</span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-blue-600 dark:text-blue-400">Institutional Workspace</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-7 text-[11px] rounded-lg"
              >
                <Link to="/investor/admin">
                  <Layers className="size-3 mr-1 text-amber-500" />
                  <span>Admin Demo</span>
                </Link>
              </Button>

              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-7 text-[11px] rounded-lg"
              >
                <Link to="/">
                  <Globe className="size-3 mr-1 text-emerald-500" />
                  <span>Consumer Web</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Operational Brand Growth OS Shell */}
      <main className="flex-1">
        <BrandsEnterpriseShell />
      </main>
    </div>
  );
}
