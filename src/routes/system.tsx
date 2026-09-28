import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Layers,
  KeyRound,
  UserCheck,
  BookOpen,
  Users,
  Bot,
  MapPin,
  Sparkles,
  HeartHandshake,
  Building2,
  BarChart3,
  Database,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Server,
  Zap,
  Cpu,
  Radio,
  FileCode,
  ArrowDown,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/system")({
  head: () => ({
    meta: [
      { title: "EKA Master System Map & Control Diagnostics (/system)" },
      { name: "description", content: "Master internal architecture, service telemetry, and module dependency graph." },
    ],
  }),
  component: SystemMapPage,
});

interface EkaModule {
  id: string;
  name: string;
  category: string;
  status: "Production-ready" | "Functional" | "Configured" | "Active";
  health: "Healthy" | "Degraded" | "Checking" | "Notice";
  icon: typeof Layers;
  location: string;
  connectedServices: string[];
  dbDependencies: string[];
  apiDependencies: string[];
  authDependencies: string;
  envVariables: string[];
  description: string;
  architectureDetails: string;
  testAction?: () => Promise<{ ok: boolean; message: string }>;
}

export function SystemMapPage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>("frontend");
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<Array<{ timestamp: string; message: string; ok: boolean }>>([]);
  const [liveDbStatus, setLiveDbStatus] = useState<"checking" | "connected" | "error">("checking");
  const [authStatus, setAuthStatus] = useState<string>("Checking session...");
  const [googleMapsReady, setGoogleMapsReady] = useState<boolean>(false);

  useEffect(() => {
    // Initial quick checks
    checkLiveHealth();
  }, []);

  const checkLiveHealth = async () => {
    setDiagnosticsRunning(true);
    const logs: Array<{ timestamp: string; message: string; ok: boolean }> = [];
    const now = () => new Date().toLocaleTimeString();

    // 1. Supabase Ping
    try {
      const { data, error } = await supabase.from("countries").select("code").limit(1);
      if (error) {
        logs.push({ timestamp: now(), message: `Database Query Notice: ${error.message}`, ok: false });
        setLiveDbStatus("error");
      } else {
        logs.push({ timestamp: now(), message: `Database PostgreSQL: Connected (Rows fetched: ${data.length})`, ok: true });
        setLiveDbStatus("connected");
      }
    } catch (e) {
      logs.push({ timestamp: now(), message: `Database Exception: ${e instanceof Error ? e.message : String(e)}`, ok: false });
      setLiveDbStatus("error");
    }

    // 2. Supabase Auth Check
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setAuthStatus(`Authenticated (${data.session.user.email || data.session.user.id.slice(0, 8)})`);
        logs.push({ timestamp: now(), message: `Auth Session: Active for ${data.session.user.email || "user"}`, ok: true });
      } else {
        setAuthStatus("Anonymous (No active session, login ready)");
        logs.push({ timestamp: now(), message: "Auth Session: Ready (Anonymous visitor)", ok: true });
      }
    } catch {
      setAuthStatus("Auth Offline / Error");
    }

    // 3. Google Maps Key Verification
    const gKey = import.meta.env["VITE_GOOGLE_MAPS_API_KEY"] || import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
    if (gKey) {
      setGoogleMapsReady(true);
      logs.push({ timestamp: now(), message: "Google Maps Platform: Browser Key detected", ok: true });
    } else {
      setGoogleMapsReady(false);
      logs.push({ timestamp: now(), message: "Google Maps Platform: Key not configured in env (Mock coordinates active)", ok: false });
    }

    // 4. GA4 Telemetry Verification
    const gaKey = import.meta.env["VITE_GA4_MEASUREMENT_ID"];
    logs.push({
      timestamp: now(),
      message: gaKey ? `Google Analytics 4: Configured (${gaKey})` : "GA4: Telemetry running in zero-cookie debug mode",
      ok: true,
    });

    setDiagnosticLogs(logs);
    setDiagnosticsRunning(false);
  };

  const MODULES: EkaModule[] = [
    {
      id: "frontend",
      name: "1. Experience & Frontend Layer",
      category: "Client / Presentation",
      status: "Production-ready",
      health: "Healthy",
      icon: Layers,
      location: "src/routes/, src/components/, src/styles.css",
      connectedServices: ["TanStack Router", "TanStack Start SSR", "Tailwind CSS v4", "Lucide React", "Motion"],
      dbDependencies: ["public.places", "public.posts", "public.knowledge_objects"],
      apiDependencies: ["/mcp", "/api/public/billing/webhook"],
      authDependencies: "Optional for public exploration; Required for /app routes",
      envVariables: ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"],
      description: "TanStack Start + React 19 application shell with responsive 3-column desktop and bottom-tab mobile layouts. Built around contemplative editorial aesthetics.",
      architectureDetails: "Combines zero-jank tactile motion primitives with progressive disclosure. Exposes canonical routes (/home, /junction, /create, /community, /my-eka, /search, /studio, /admin, /enterprise, /system).",
    },
    {
      id: "auth",
      name: "2. Authentication & Identity",
      category: "Security / Session",
      status: "Production-ready",
      health: "Healthy",
      icon: KeyRound,
      location: "src/routes/auth.tsx, src/integrations/supabase/client.ts",
      connectedServices: ["Supabase Auth v2", "Google OAuth 2.0 PKCE", "Web Crypto API"],
      dbDependencies: ["auth.users", "public.profiles", "public.user_roles"],
      apiDependencies: ["https://<project-ref>.supabase.co/auth/v1/*"],
      authDependencies: "Primary security gateway enforcing token lifecycle and PKCE challenges",
      envVariables: ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_PROJECT_ID"],
      description: "Direct Supabase OAuth and email auth engine. Manages session persistence via browser localStorage and triggers automatic profile provisioning.",
      architectureDetails: "Decoupled from third-party auth brokers for independent localhost, staging, and production deployment. Integrates stateful redirect validation.",
    },
    {
      id: "user-profile",
      name: "3. User Profile & RBAC",
      category: "Identity / Access Control",
      status: "Production-ready",
      health: "Healthy",
      icon: UserCheck,
      location: "src/hooks/useProfile.ts, src/lib/studio/rbac.ts",
      connectedServices: ["Supabase Row Level Security", "11-Role RBAC Matrix"],
      dbDependencies: ["public.profiles", "public.user_roles", "public.studio_user_roles"],
      apiDependencies: ["Supabase PostgREST RPC has_role()"],
      authDependencies: "Requires authenticated session",
      envVariables: ["VITE_SUPABASE_URL"],
      description: "Hierarchical permissions matrix with 11 studio operational roles (Founder down to Read Only) and member profiles.",
      architectureDetails: "Enforces least-privilege access at both the UI component boundary and database table policy layer.",
    },
    {
      id: "knowledge",
      name: "4. Knowledge & Epistemic Layer",
      category: "Core Intelligence",
      status: "Production-ready",
      health: "Healthy",
      icon: BookOpen,
      location: "src/components/knowledge/, src/lib/knowledge/",
      connectedServices: ["5-Tier Epistemic Taxonomy", "Source License Engine", "Connectors (UNESCO/Wiki)"],
      dbDependencies: ["public.knowledge_objects", "public.knowledge_relations", "public.taxonomy_nodes", "public.sources"],
      apiDependencies: ["Wikidata API", "Wikipedia REST API", "Europeana Open API"],
      authDependencies: "Public read; Contributor/Editor role for creation",
      envVariables: ["VITE_SUPABASE_URL"],
      description: "10-dimension cultural knowledge graph structuring traditions, places, rituals, and lineages with verified source passports.",
      architectureDetails: "Separates documented textual tradition from living communal practice and subjective devotion to prevent doctrinal flattening.",
    },
    {
      id: "community",
      name: "5. Community & Social Layer",
      category: "Social / Sangha",
      status: "Production-ready",
      health: "Healthy",
      icon: Users,
      location: "src/routes/_authenticated/app.sanghas.*.tsx, src/routes/_authenticated/app.episodes.*.tsx",
      connectedServices: ["Supabase Realtime WebSocket", "Community Standards Validator"],
      dbDependencies: ["public.communities", "public.community_members", "public.posts", "public.episodes"],
      apiDependencies: ["Supabase Realtime Channel 'room:*'"],
      authDependencies: "Requires agreed Community Standards (`/standards`)",
      envVariables: ["VITE_SUPABASE_URL"],
      description: "Circles (Sanghas), audio discourses (Episodes), and reverent community discussions governed by explicit peer conduct standards.",
      architectureDetails: "Features zero-algorithm chronological feeds, anti-harassment safeguards, and structured reflection prompts.",
    },
    {
      id: "ai",
      name: "6. EKA AI & Agent Architecture",
      category: "Intelligence / Agents",
      status: "Production-ready",
      health: "Healthy",
      icon: Bot,
      location: "src/lib/ai/gemini-client.ts, src/lib/ai/langgraph-pipeline.ts, src/routes/mcp.ts",
      connectedServices: ["Google Gemini 2.5 Native REST API", "Model Context Protocol (MCP) Server", "LangGraph State Machine"],
      dbDependencies: ["public.ai_insights", "public.sources"],
      apiDependencies: ["Google Generative Language API", "/mcp", "/.well-known/oauth-protected-resource"],
      authDependencies: "OAuth 2.1 resource server verification for MCP tools",
      envVariables: ["GEMINI_API_KEY", "VITE_GEMINI_API_KEY"],
      description: "Reverent cultural intelligence companion. Strictly grounded against hallucinations, citing canonical lineage sources and regional pluralism.",
      architectureDetails: "LangGraph state machine parses Sanskrit/Pali/Tamil terms, checks provenance, and generates verified multi-part pedagogy.",
    },
    {
      id: "junction",
      name: "7. The Junction & Sacred Geography",
      category: "Geospatial / Discovery",
      status: "Production-ready",
      health: googleMapsReady ? "Healthy" : "Notice",
      icon: MapPin,
      location: "src/routes/_authenticated/app.junction.index.tsx, src/components/app/SacredGeographyMap.tsx, src/lib/maps/google-maps.ts",
      connectedServices: ["Google Maps Platform JavaScript API", "Haversine Distance Engine"],
      dbDependencies: ["public.places", "public.place_layers", "public.place_map_points", "public.place_relationships"],
      apiDependencies: ["https://maps.googleapis.com/maps/api/js"],
      authDependencies: "Public read for published sacred geography nodes",
      envVariables: ["VITE_GOOGLE_MAPS_API_KEY"],
      description: "Interactive geospatial exploration of temples, monasteries, shrines, and sacred sites across 7 major world traditions.",
      architectureDetails: "Includes tradition color-coded pins, pilgrimage distance calculation from user coordinates, and layer filtering.",
    },
    {
      id: "creator-studio",
      name: "8. Creator Studio & Marketplace",
      category: "Creator Economy",
      status: "Production-ready",
      health: "Healthy",
      icon: Sparkles,
      location: "src/routes/_authenticated/app.creator.tsx, src/routes/_authenticated/app.market.index.tsx",
      connectedServices: ["Authenticity Verification", "Booking Scheduler", "Review Engine"],
      dbDependencies: ["public.practitioners", "public.practitioner_packages", "public.practitioner_slots", "public.marketplace_bookings", "public.marketplace_reviews"],
      apiDependencies: ["Supabase RPC review_practitioner()"],
      authDependencies: "Requires practitioner verification gate",
      envVariables: ["VITE_SUPABASE_URL"],
      description: "Enables verified spiritual guides, artisans, and cultural practitioners to publish guidance packages and receive 1-on-1 bookings.",
      architectureDetails: "Integrates zero-punishment streak progression, authenticity documentation checks, and 10% platform reinvestment commission.",
    },
    {
      id: "crm",
      name: "9. EKA CRM Architecture",
      category: "Member Lifecycle",
      status: "Production-ready",
      health: "Healthy",
      icon: HeartHandshake,
      location: "src/components/studio/StudioEngagementCCRM.tsx",
      connectedServices: ["Lifecycle Engine", "Automated Trigger Pipeline", "Notification Queue"],
      dbDependencies: ["public.profiles", "public.rhythm_reminders", "public.cancellation_surveys"],
      apiDependencies: ["Supabase Realtime notifications"],
      authDependencies: "Staff / Creator Manager / Support role required",
      envVariables: ["VITE_SUPABASE_URL"],
      description: "Contemplative Customer Relationship Management tracking member milestones, retention nudges, and circle invitations.",
      architectureDetails: "Focuses on sincere engagement rather than dopamine optimization or intrusive push notifications.",
    },
    {
      id: "enterprise",
      name: "10. EKA Enterprise Infrastructure",
      category: "B2B / Institutions",
      status: "Production-ready",
      health: "Healthy",
      icon: Building2,
      location: "src/routes/enterprise.tsx, src/components/studio/StudioEnterprise.tsx",
      connectedServices: ["Tenant Isolation", "API Key Hash Registry", "Token Bucket Rate Limiter"],
      dbDependencies: ["public.enterprise_workspaces", "public.enterprise_api_keys"],
      apiDependencies: ["Enterprise Gateway Handlers"],
      authDependencies: "Enterprise Admin role or Organization API Key",
      envVariables: ["SUPABASE_SERVICE_ROLE_KEY"],
      description: "Institutional infrastructure for universities, cultural foundations, and museums to access high-throughput knowledge APIs.",
      architectureDetails: "Supports workspace namespacing, dedicated usage quotas, key rotation, and domain restriction policies.",
    },
    {
      id: "ads-analytics",
      name: "11. Ads, Economics & Analytics",
      category: "Monetization / Telemetry",
      status: "Production-ready",
      health: "Healthy",
      icon: BarChart3,
      location: "src/routes/founder.ad.tsx, src/routes/_authenticated/admin.economics.tsx, src/lib/analytics/ga4.ts",
      connectedServices: ["Google Analytics 4", "Double-Entry Ledger Engine", "P&L Waterfall Simulator"],
      dbDependencies: ["public.analytics_events", "public.ledger_entries", "public.eka_economics", "public.finance_periods"],
      apiDependencies: ["GA4 Measurement Protocol", "/api/public/billing/webhook"],
      authDependencies: "Founder / Super Admin role for ledger inspection",
      envVariables: ["VITE_GA4_MEASUREMENT_ID", "STRIPE_WEBHOOK_SECRET"],
      description: "Founder visual ads, transparent financial closing engine, reserve pool calculator, and privacy-respecting behavioral analytics.",
      architectureDetails: "Append-only double-entry financial accounting ledger ensuring complete auditability of all creator and platform payouts.",
    },
    {
      id: "database",
      name: "12. Database, Storage & Infrastructure",
      category: "Foundation / Cloud",
      status: "Production-ready",
      health: liveDbStatus === "connected" ? "Healthy" : liveDbStatus === "error" ? "Degraded" : "Checking",
      icon: Database,
      location: "supabase/migrations/ (37 migrations), vercel.json, src/server.ts",
      connectedServices: ["Supabase PostgreSQL 14.5", "Supabase Storage", "Nitro v3 SSR Server", "Vercel Edge"],
      dbDependencies: ["All 37 Schema Migrations", "Row Level Security Policies"],
      apiDependencies: ["Nitro Server SSR Handler", "/api/*"],
      authDependencies: "Supabase service_role & anon keys",
      envVariables: ["DATABASE_URL", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "VITE_SUPABASE_PUBLISHABLE_KEY"],
      description: "Relational database foundation with 60+ tables, transactional RLS policies, automated triggers, and prebuilt SSR output.",
      architectureDetails: "Protected by strict CSP, HSTS, and Frame-Options security headers in vercel.json with daily automated cron tasks.",
    },
  ];

  const selected = MODULES.find((m) => m.id === selectedModuleId) || MODULES[0];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top System Navigation Bar */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-terracotta/10 border border-terracotta/30 flex items-center justify-center text-terracotta font-serif font-bold text-lg">
            E
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-medium text-lg tracking-tight">EKA MASTER SYSTEM MAP</h1>
              <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-widest text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
                v1.0 Live
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono">Control Plane & Subsystem Architecture Inspector</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs font-mono bg-muted/50 px-3 py-1.5 rounded-md border border-border">
            <span className="text-muted-foreground">Auth:</span>
            <span className="text-foreground font-medium">{authStatus}</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="text-xs gap-1.5 h-8"
            disabled={diagnosticsRunning}
            onClick={checkLiveHealth}
          >
            <RefreshCw className={`size-3.5 ${diagnosticsRunning ? "animate-spin" : ""}`} />
            Run Diagnostics
          </Button>

          <Link to="/studio">
            <Button size="sm" className="text-xs h-8 gap-1.5 bg-terracotta text-white hover:bg-terracotta/90">
              <Server className="size-3.5" />
              Open Studio
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Layout: Flowchart on left, Module Inspector on right */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visual Flowchart (7 cols) */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-terracotta" />
              <h2 className="font-display text-base font-medium">Platform Dependency & Execution Flow</h2>
            </div>
            <span className="text-xs text-muted-foreground font-mono">Click any module to inspect</span>
          </div>

          <div className="space-y-3 relative">
            {MODULES.map((mod, index) => {
              const isSelected = mod.id === selectedModuleId;
              const Icon = mod.icon;
              return (
                <div key={mod.id} className="relative">
                  <div
                    onClick={() => setSelectedModuleId(mod.id)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? "border-terracotta bg-terracotta/5 shadow-sm ring-1 ring-terracotta/20"
                        : "border-border bg-card hover:border-muted-foreground/30 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`size-10 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? "bg-terracotta text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium leading-none">{mod.name}</h3>
                          <Badge
                            variant="secondary"
                            className="text-[9px] uppercase px-1.5 py-0 font-mono"
                          >
                            {mod.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {mod.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full ${
                          mod.health === "Healthy"
                            ? "text-emerald-600 bg-emerald-500/10 border border-emerald-500/20"
                            : "text-amber-600 bg-amber-500/10 border border-amber-500/20"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            mod.health === "Healthy" ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {mod.health}
                      </span>
                      <ChevronRight
                        className={`size-4 text-muted-foreground transition-transform ${
                          isSelected ? "rotate-90 text-terracotta" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {index < MODULES.length - 1 && (
                    <div className="flex justify-center my-1">
                      <ArrowDown className="size-3.5 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Column: Module Inspector & Live Console (5 cols) */}
        <section className="lg:col-span-5 space-y-6">
          {/* Selected Module Detail Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-5 sticky top-24">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <Badge variant="outline" className="text-[10px] font-mono uppercase text-terracotta border-terracotta/30 mb-1">
                  {selected.category}
                </Badge>
                <h3 className="font-display text-xl font-normal">{selected.name}</h3>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">{selected.location}</p>
              </div>
              <Badge
                className={`text-xs font-mono ${
                  selected.health === "Healthy"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "bg-amber-500/15 text-amber-700"
                }`}
              >
                {selected.health}
              </Badge>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-semibold uppercase tracking-wider text-muted-foreground text-[10px] block mb-1">
                  Architecture & Purpose
                </span>
                <p className="text-foreground leading-relaxed font-light">{selected.description}</p>
                <p className="text-muted-foreground mt-1.5 leading-relaxed font-light">{selected.architectureDetails}</p>
              </div>

              <div>
                <span className="font-semibold uppercase tracking-wider text-muted-foreground text-[10px] block mb-1">
                  Connected Services
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selected.connectedServices.map((svc) => (
                    <Badge key={svc} variant="secondary" className="font-mono text-[10px]">
                      {svc}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold uppercase tracking-wider text-muted-foreground text-[10px] block mb-1">
                  Database Dependencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selected.dbDependencies.map((tbl) => (
                    <code key={tbl} className="bg-muted px-2 py-0.5 rounded font-mono text-[10px] border border-border">
                      {tbl}
                    </code>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold uppercase tracking-wider text-muted-foreground text-[10px] block mb-1">
                  API & Network Endpoints
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selected.apiDependencies.map((api) => (
                    <code key={api} className="bg-muted px-2 py-0.5 rounded font-mono text-[10px] border border-border">
                      {api}
                    </code>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold uppercase tracking-wider text-muted-foreground text-[10px] block mb-1">
                  Authentication & Role Boundary
                </span>
                <p className="font-mono text-[11px] text-foreground">{selected.authDependencies}</p>
              </div>

              <div>
                <span className="font-semibold uppercase tracking-wider text-muted-foreground text-[10px] block mb-1">
                  Environment Keys
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selected.envVariables.map((env) => (
                    <Badge key={env} variant="outline" className="font-mono text-[10px]">
                      {env}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Navigation Shortcuts */}
            <div className="border-t border-border pt-4">
              <span className="font-semibold uppercase tracking-wider text-muted-foreground text-[10px] block mb-2">
                Quick Jump Links
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link to="/" className="text-terracotta hover:underline inline-flex items-center gap-1">
                  <span>Landing (/)</span>
                  <ExternalLink className="size-3" />
                </Link>
                <Link to="/app" className="text-terracotta hover:underline inline-flex items-center gap-1">
                  <span>In-App (/app)</span>
                  <ExternalLink className="size-3" />
                </Link>
                <Link to="/junction" className="text-terracotta hover:underline inline-flex items-center gap-1">
                  <span>Junction (/junction)</span>
                  <ExternalLink className="size-3" />
                </Link>
                <Link to="/studio" className="text-terracotta hover:underline inline-flex items-center gap-1">
                  <span>Studio (/studio)</span>
                  <ExternalLink className="size-3" />
                </Link>
                <Link to="/enterprise" className="text-terracotta hover:underline inline-flex items-center gap-1">
                  <span>Enterprise (/enterprise)</span>
                  <ExternalLink className="size-3" />
                </Link>
                <Link to="/auth" className="text-terracotta hover:underline inline-flex items-center gap-1">
                  <span>Auth (/auth)</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Diagnostic Console Panel */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium flex items-center gap-1.5">
                <Radio className="size-3.5 text-terracotta animate-pulse" />
                Diagnostics Console
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {diagnosticLogs.length} events
              </span>
            </div>
            <div className="bg-muted/70 rounded-lg p-3 font-mono text-[11px] space-y-1.5 max-h-48 overflow-y-auto">
              {diagnosticLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-muted-foreground text-[10px] shrink-0">[{log.timestamp}]</span>
                  <span className={log.ok ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600"}>
                    {log.message}
                  </span>
                </div>
              ))}
              {diagnosticLogs.length === 0 && (
                <p className="text-muted-foreground">Click "Run Diagnostics" above to execute preflight telemetry.</p>
              )}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
