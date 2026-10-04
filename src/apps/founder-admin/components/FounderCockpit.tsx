// ==============================================================================
// EKA FOUNDER COCKPIT — EXECUTIVE OVERVIEW (/founder-admin)
// ==============================================================================
// Mission: 1 Billion Stories · One Living Cultural Archive
// Subsystems: People → Stories → Traditions → Communities → Places → Languages → Rituals → Knowledge
// ==============================================================================

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Compass,
  Sparkles,
  Layers,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Server,
  ArrowRight,
  Send,
  Radio,
  ExternalLink,
  Bot,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function FounderCockpit() {
  const [founderNote, setFounderNote] = useState("");
  const [dispatches, setDispatches] = useState([
    {
      date: "Oct 2026",
      title: "Hard Separation of Consumer, Founder/Admin & Enterprise Workspaces",
      status: "Implemented",
    },
    {
      date: "Sep 2026",
      title: "5-Tier Epistemic Taxonomy & Source Passports Deployment",
      status: "Live",
    },
    {
      date: "Aug 2026",
      title: "LangGraph Multi-Agent Provenance Pipeline Integration",
      status: "Operational",
    },
  ]);

  const handlePublishDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!founderNote.trim()) return;
    setDispatches([
      {
        date: "Just now",
        title: founderNote.trim(),
        status: "Dispatched",
      },
      ...dispatches,
    ]);
    setFounderNote("");
    toast.success("Founder strategic directive recorded.");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Executive Header Banner */}
      <div className="rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge
              variant="outline"
              className="text-[10px] font-mono uppercase tracking-widest text-amber-400 border-amber-500/30 bg-amber-500/10"
            >
              Executive Command & Strategy
            </Badge>
            <h1 className="font-display text-2xl sm:text-3xl font-normal text-white">
              EKA FOUNDER COCKPIT
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-2xl leading-relaxed">
              1 Billion Stories · One Living Cultural Archive. Orchestrating the civilizational
              intelligence layer connecting authentic people, traditions, and sacred lore.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/founder-admin/ops">
              <Button size="sm" className="bg-amber-500 text-neutral-950 hover:bg-amber-400 font-medium text-xs gap-1.5 h-9 rounded-xl">
                <Radio className="size-3.5" />
                <span>Live Ops Radar</span>
              </Button>
            </Link>
            <Link to="/founder-admin/studio">
              <Button size="sm" variant="outline" className="border-neutral-700 text-neutral-300 hover:text-white text-xs gap-1.5 h-9 rounded-xl">
                <Server className="size-3.5" />
                <span>Studio Control</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Pillars Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-mono uppercase text-[10px] tracking-wider">Archive Scale</span>
            <Sparkles className="size-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-display font-medium text-white">1,000,000,000</p>
          <p className="text-[11px] text-neutral-400">Target oral epics, rituals & living traditions</p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-mono uppercase text-[10px] tracking-wider">Provenance Tiers</span>
            <ShieldCheck className="size-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-display font-medium text-white">5 Tiers</p>
          <p className="text-[11px] text-neutral-400">Canonical texts to living folk practice</p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-mono uppercase text-[10px] tracking-wider">Platform Economics</span>
            <DollarSign className="size-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-display font-medium text-white">₹26.8L / mo</p>
          <p className="text-[11px] text-neutral-400">Sustainable reserve pool & creator dividend</p>
        </div>
      </div>

      {/* Subsystem Map & Quick Jump Launcher */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-white">Platform Subsystems</h2>
            <p className="text-xs text-neutral-400">Core operational domains within the private cockpit</p>
          </div>
          <Link to="/founder-admin/system" className="text-xs text-amber-400 hover:underline font-mono">
            Full System Map →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            { title: "Operations Radar", to: "/founder-admin/ops", desc: "Telemetry & queue management" },
            { title: "Studio Control Plane", to: "/founder-admin/studio", desc: "Knowledge graph & taxonomies" },
            { title: "Economics & P&L", to: "/founder-admin/economics", desc: "Double-entry financial ledger" },
            { title: "Creator Risk & Fraud", to: "/founder-admin/risk", desc: "KYC audits & dispute reserves" },
            { title: "Epistemic Ops", to: "/founder-admin/knowledge", desc: "5-tier provenance & licenses" },
            { title: "System Topology", to: "/founder-admin/system", desc: "12-subsystem health inspector" },
            { title: "Staff CRM", to: "/founder-admin/crm", desc: "Member lifecycle nudges" },
            { title: "Settlements & Finance", to: "/founder-admin/finance", desc: "Reconciliation & payouts" },
          ].map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800/80 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-white group-hover:text-amber-300">{item.title}</span>
                <ArrowRight className="size-3.5 text-neutral-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[11px] text-neutral-400 mt-1 font-light">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Founder Dispatches & Directives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Broadcast directive (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">Record Founder Directive</h3>
            <p className="text-xs text-neutral-400">Broadcast strategic direction to internal operators</p>
          </div>

          <form onSubmit={handlePublishDispatch} className="space-y-3">
            <Textarea
              rows={4}
              value={founderNote}
              onChange={(e) => setFounderNote(e.target.value)}
              placeholder="e.g. Focus on Phase 1 Consumer polish; preserve Brand Workspace in private container until Phase 3 roadmap milestone."
              className="rounded-xl bg-neutral-950 border-neutral-800 text-xs text-white"
            />
            <Button
              type="submit"
              disabled={!founderNote.trim()}
              className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold rounded-xl h-9 gap-1.5"
            >
              <Send className="size-3.5" />
              <span>Record Directive</span>
            </Button>
          </form>
        </div>

        {/* Right: Past Dispatches (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">Platform Governance Log</h3>
          <div className="space-y-3">
            {dispatches.map((d, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-neutral-800 bg-neutral-950/60 flex items-start justify-between gap-4"
              >
                <div>
                  <p className="text-xs text-white font-medium">{d.title}</p>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{d.date}</p>
                </div>
                <Badge
                  variant="outline"
                  className="text-[9px] font-mono border-amber-500/30 text-amber-400 bg-amber-500/5"
                >
                  {d.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
