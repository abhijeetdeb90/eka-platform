// ==============================================================================
// EKA CRM — CONTEMPLATIVE CUSTOMER RELATIONSHIP MANAGEMENT (/crm)
// ==============================================================================
// Dedicated cockpit for member lifecycle, lead capture, automated engagement triggers,
// retention journeys, and community onboarding operations.
// ==============================================================================

import { createFileRoute, Link } from "@tanstack/react-router";
import { StudioEngagementCCRM } from "@/components/studio/StudioEngagementCCRM";
import { HeartHandshake, ArrowLeft, Server, Building2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EkaLogo } from "@/components/brand/Logo";

export const Route = createFileRoute("/crm")({
  head: () => ({
    meta: [
      { title: "EKA CRM — Member Lifecycle & Contemplative Engagement" },
      { name: "description", content: "Dedicated relationship management, lead capture, and retention triggers." },
    ],
  }),
  component: CRMPage,
});

function CRMPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top CRM Header */}
      <header className="border-b border-border bg-card/90 backdrop-blur-md px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/studio">
              <EkaLogo />
            </Link>
            <div className="h-5 w-px bg-border/70" />
            <div className="flex items-center gap-2">
              <HeartHandshake className="size-4 text-terracotta" />
              <h1 className="font-display font-medium text-base tracking-tight">EKA ENGAGEMENT CRM</h1>
              <Badge variant="outline" className="text-[9px] uppercase font-mono text-terracotta border-terracotta/30 bg-terracotta/5">
                Staff Only
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/studio">
              <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5 font-mono">
                <Server className="size-3.5" />
                <span>EKA Studio</span>
              </Button>
            </Link>
            <Link to="/system">
              <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5 font-mono">
                <Shield className="size-3.5" />
                <span>System Map</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main CRM Cockpit */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10 space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground font-semibold">
            Member Lifecycle & Community Nudges
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-normal">Engagement Engine</h2>
          <p className="text-xs text-muted-foreground font-light max-w-2xl">
            Monitor member onboarding progress, retention offers, daily rhythm check-ins, and automated email/push notifications.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-calm">
          <StudioEngagementCCRM />
        </div>
      </main>
    </div>
  );
}
