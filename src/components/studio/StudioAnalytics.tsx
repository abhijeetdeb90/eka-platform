// ==============================================================================
// EKA STUDIO — PLATFORM, CONTENT & KNOWLEDGE ANALYTICS MODULE
// ==============================================================================

import { useState } from "react";
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
import { BarChart3, TrendingUp, BookOpen, Users, Building, ShieldCheck } from "lucide-react";
import type { StudioRole } from "@/lib/studio/types";

interface StudioAnalyticsProps {
  currentRole: StudioRole;
}

const WAU_DATA = [
  { day: "Mon", users: 1240, reflections: 840 },
  { day: "Tue", users: 1420, reflections: 960 },
  { day: "Wed", users: 1580, reflections: 1100 },
  { day: "Thu", users: 1890, reflections: 1350 },
  { day: "Fri", users: 2100, reflections: 1620 },
  { day: "Sat", users: 2450, reflections: 1980 },
  { day: "Sun", users: 2800, reflections: 2300 },
];

const KNOWLEDGE_DEPTH_DATA = [
  { tier: "Published", count: 42 },
  { tier: "Expert Verified", count: 28 },
  { tier: "Community Verified", count: 64 },
  { tier: "Source Verified", count: 35 },
  { tier: "Under Review", count: 18 },
  { tier: "Disputed", count: 3 },
];

export function StudioAnalytics({ currentRole }: StudioAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("7d");

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-normal tracking-tight">Platform Telemetry & Analytics</h2>
          <p className="text-xs text-muted-foreground">
            Monitor seeker engagement, epistemic knowledge verification depth, and institutional API queries.
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-xs"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last Quarter</option>
        </select>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <span className="text-xs uppercase text-muted-foreground font-medium">Weekly Active Seekers</span>
          <p className="mt-1 font-display text-2xl font-semibold">12,840</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">+18.4% vs last week</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <span className="text-xs uppercase text-muted-foreground font-medium">Avg Dwell Time</span>
          <p className="mt-1 font-display text-2xl font-semibold">18m 42s</p>
          <span className="text-[11px] text-muted-foreground">Calm, non-dopaminergic reading</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <span className="text-xs uppercase text-muted-foreground font-medium">Verified Knowledge Nodes</span>
          <p className="mt-1 font-display text-2xl font-semibold">190</p>
          <span className="text-[11px] text-primary font-medium">Multi-source grounded</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <span className="text-xs uppercase text-muted-foreground font-medium">Enterprise API Queries</span>
          <p className="mt-1 font-display text-2xl font-semibold">184,200</p>
          <span className="text-[11px] text-muted-foreground">99.98% SLA Uptime</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* WAU Growth Chart */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-medium">Seeker Growth & Devotional Reflections</h3>
            <TrendingUp className="size-4 text-primary" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WAU_DATA}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="var(--primary)" fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Knowledge Verification Breakdown */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-medium">Knowledge Objects by Verification Tier</h3>
            <ShieldCheck className="size-4 text-emerald-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={KNOWLEDGE_DEPTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="tier" fontSize={10} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--terracotta, #c2410c)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
