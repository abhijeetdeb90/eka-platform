// ==============================================================================
// EKA STUDIO — DASHBOARD MODULE
// ==============================================================================

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Network,
  BookOpen,
  FolderKanban,
  FileCheck,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Layers,
  Users,
  Building2,
  HardDrive,
  Activity,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEED_KNOWLEDGE_OBJECTS } from "@/lib/studio/knowledge-service";
import { SEED_RELATIONSHIPS } from "@/lib/studio/graph-service";
import { SEED_CONTENT_ITEMS } from "@/lib/studio/content-service";
import { SEED_HOMEPAGE_SECTIONS } from "@/lib/studio/homepage-service";
import type { StudioRole } from "@/lib/studio/types";

interface StudioDashboardProps {
  currentRole: StudioRole;
  onNavigate: (tab: string) => void;
}

export function StudioDashboard({ currentRole, onNavigate }: StudioDashboardProps) {
  const [objects] = useState(SEED_KNOWLEDGE_OBJECTS);
  const [relationships] = useState(SEED_RELATIONSHIPS);
  const [content] = useState(SEED_CONTENT_ITEMS);
  const [sections] = useState(SEED_HOMEPAGE_SECTIONS);

  const pendingVerification = objects.filter(
    (o) => o.verification_status === "Under Review" || o.verification_status === "Draft",
  );
  const expertVerifiedCount = objects.filter(
    (o) => o.verification_status === "Expert Verified" || o.verification_status === "Published",
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-accent/20 p-6 sm:p-8 shadow-calm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Sparkles className="size-3" /> Control Plane Active
              </span>
              <span className="text-xs text-muted-foreground">Operating as: <strong>{currentRole}</strong></span>
            </div>
            <h1 className="font-display text-2xl font-normal sm:text-3xl tracking-tight">
              EKA Studio Operations Console
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Canonical control plane for cultural memory, first-class knowledge relationships, 
              5-tier epistemic provenance, visual homepage orchestration, and platform governance.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => onNavigate("knowledge-create")}>
              <BookOpen className="mr-1.5 size-4" /> New Knowledge Object
            </Button>
            <Button size="sm" variant="outline" onClick={() => onNavigate("homepage")}>
              <Layers className="mr-1.5 size-4" /> Edit Homepage
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link to="/app">
                Consumer Platform <ArrowUpRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <div
          onClick={() => onNavigate("knowledge")}
          className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-calm"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Knowledge Objects</span>
            <BookOpen className="size-4 text-primary" />
          </div>
          <p className="mt-2 font-display text-2xl font-medium">{objects.length}</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {expertVerifiedCount} Verified Canon
          </span>
        </div>

        <div
          onClick={() => onNavigate("graph")}
          className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-calm"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Semantic Edges</span>
            <Network className="size-4 text-purple-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-medium">{relationships.length}</p>
          <span className="text-[11px] text-muted-foreground">First-Class Rel.</span>
        </div>

        <div
          onClick={() => onNavigate("content")}
          className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-calm"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Articles & Pages</span>
            <FolderKanban className="size-4 text-blue-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-medium">{content.length}</p>
          <span className="text-[11px] text-muted-foreground">Published</span>
        </div>

        <div
          onClick={() => onNavigate("homepage")}
          className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-calm"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Home Sections</span>
            <Layers className="size-4 text-orange-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-medium">{sections.length}</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Dynamic Active
          </span>
        </div>

        <div
          onClick={() => onNavigate("trust")}
          className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-calm"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Review Queue</span>
            <FileCheck className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-medium">{pendingVerification.length}</p>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Pending Verifier
          </span>
        </div>

        <div
          onClick={() => onNavigate("system")}
          className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-calm"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">System State</span>
            <Activity className="size-4 text-emerald-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-medium text-emerald-600 dark:text-emerald-400">
            Healthy
          </p>
          <span className="text-[11px] text-muted-foreground">Zero Desync</span>
        </div>
      </div>

      {/* Operational Queues and Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Verification & Knowledge Status */}
        <div className="space-y-6 lg:col-span-2">
          {/* Verification Queue Preview */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-medium">Epistemic Verification Queue</h3>
                <p className="text-xs text-muted-foreground">
                  Knowledge items requiring academic endorsement, citation audit, or community corroboration.
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onNavigate("trust")}>
                View All
              </Button>
            </div>

            <div className="mt-4 divide-y divide-border/60">
              {objects.slice(0, 3).map((ko) => (
                <div key={ko.id} className="flex flex-col justify-between gap-3 py-3 sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {ko.type}
                      </span>
                      <span className="text-xs text-muted-foreground">· {ko.tradition}</span>
                      <span className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-[10px] text-primary">
                        {ko.verification_status}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium">{ko.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{ko.summary}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => onNavigate(`knowledge-detail-${ko.id}`)}>
                      Inspect Citations
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Control Matrix */}
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div
              onClick={() => onNavigate("taxonomy")}
              className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-2 font-medium text-sm">
                <Layers className="size-4 text-primary" /> Hierarchical Taxonomy
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Manage Culture, Traditions, Geography & Living Heritage branches.
              </p>
            </div>

            <div
              onClick={() => onNavigate("media")}
              className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-2 font-medium text-sm">
                <HardDrive className="size-4 text-primary" /> Media & Licensing
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Audit copyright, creative commons attribution, and rights clearances.
              </p>
            </div>

            <div
              onClick={() => onNavigate("ai")}
              className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-2 font-medium text-sm">
                <Sparkles className="size-4 text-primary" /> AI Agents & Policies
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Govern retrieval policies, citations enforcement, and prompt models.
              </p>
            </div>
          </section>
        </div>

        {/* Right 1 Col: Append-Only Audit Stream & System Guardrails */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-medium">Recent Audit Events</h3>
              <History className="size-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Append-only administrative trail.</p>

            <div className="mt-4 space-y-3">
              {[
                { action: "verify", target: "Evening Sandhya", role: "Verifier", time: "12m ago" },
                { action: "publish", target: "Living Traditions Hero", role: "Content Admin", time: "45m ago" },
                { action: "create", target: "Bodh Gaya Vajrasana Edge", role: "Knowledge Editor", time: "2h ago" },
                { action: "login", target: "Control Plane Bootstrap", role: "Founder", time: "4h ago" },
              ].map((ev, i) => (
                <div key={i} className="rounded-xl border border-border/70 bg-accent/30 p-2.5 text-xs">
                  <div className="flex items-center justify-between font-medium">
                    <span className="capitalize text-foreground font-semibold">{ev.action}</span>
                    <span className="text-[10px] text-muted-foreground">{ev.time}</span>
                  </div>
                  <p className="mt-1 truncate text-muted-foreground">{ev.target}</p>
                  <p className="mt-0.5 text-[10px] text-primary">{ev.role}</p>
                </div>
              ))}
            </div>

            <Button
              size="sm"
              variant="outline"
              className="mt-4 w-full text-xs"
              onClick={() => onNavigate("system")}
            >
              Open Full Audit Logs
            </Button>
          </section>

          <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-center gap-2 text-primary font-medium text-sm">
              <ShieldCheck className="size-4" /> Architectural Boundary
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Consumer clients communicate through the public API layer with strict RLS filtering.
              Administrative endpoints are isolated to verified Studio roles with complete audit recording.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
