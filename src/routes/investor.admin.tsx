// ==============================================================================
// EKA INVESTOR PRESENTATION — DEDICATED ADMIN PRESENTATION ENTRY (/investor/admin)
// ==============================================================================
// Dedicated, investor-safe Admin presentation environment demonstrating:
// - Founder Cockpit & executive command telemetry
// - 12-subsystem operational topology & Ops Radar
// - Oral history moderation & epistemic verification
// - Platform economics & double-entry P&L ledger
// - Trust & Safety, creator risk ops, and platform controls
// All actions run in a sandboxed, least-privilege demo profile without exposing
// production credentials, private user data, or service keys.
// ==============================================================================

import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { startInvestorDemoSession, DEMO_CREDENTIALS } from "@/lib/auth/demo-session";
import { FounderAdminShell } from "@/apps/founder-admin/components/FounderAdminShell";
import { FounderCockpit } from "@/apps/founder-admin/components/FounderCockpit";
import { ProductStatus } from "@/components/investor/ProductStatus";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, Building2, Globe, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/investor/admin")({
  beforeLoad: () => {
    // Ensure demo session is prepared
    if (typeof window !== "undefined") {
      startInvestorDemoSession("admin");
    }
  },
  head: () => ({
    meta: [
      { title: "EKA Admin OS — Investor Presentation Environment" },
      {
        name: "description",
        content:
          "Investor presentation environment for EKA Admin & Operations OS. Explore platform governance, oral history verification, platform economics, and telemetry.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: InvestorAdminPresentationPage,
});

function InvestorAdminPresentationPage() {
  useEffect(() => {
    startInvestorDemoSession("admin");
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500/20 selection:text-amber-200">
      {/* Investor Presentation Control Ribbon */}
      <section
        aria-label="Investor Presentation Environment Safeguard"
        className="border-b border-amber-500/40 bg-neutral-900/95 px-4 sm:px-6 py-2.5 sticky top-0 z-50 backdrop-blur-md shadow-md"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Link
              to="/investor"
              className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white font-medium transition-colors group"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Investor Gateway</span>
            </Link>

            <span className="text-neutral-600">/</span>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-white tracking-wide">
                Admin OS Presentation
              </span>
              <ProductStatus status="LIVE" size="xs" />
              <Badge
                variant="outline"
                className="font-mono text-[9px] uppercase border-amber-500/30 text-amber-400 bg-amber-500/10 px-1.5 py-0"
              >
                Investor Safe Sandbox
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-neutral-400 font-mono text-[11px]">
              <ShieldCheck className="size-3.5 text-emerald-400" />
              <span>Role: {DEMO_CREDENTIALS.admin.email}</span>
              <span className="text-neutral-600">•</span>
              <span className="text-emerald-400">Production Protected</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-7 text-[11px] rounded-lg border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white"
              >
                <Link to="/investor/enterprise">
                  <Building2 className="size-3 mr-1 text-blue-400" />
                  <span>Enterprise Demo</span>
                </Link>
              </Button>

              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-7 text-[11px] rounded-lg border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white"
              >
                <Link to="/">
                  <Globe className="size-3 mr-1 text-emerald-400" />
                  <span>Consumer Web</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Operational Admin Cockpit Shell */}
      <main className="flex-1">
        <FounderAdminShell />
      </main>
    </div>
  );
}
