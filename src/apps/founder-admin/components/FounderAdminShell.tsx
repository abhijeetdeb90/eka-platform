// ==============================================================================
// EKA FOUNDER / ADMIN OPERATING SYSTEM — APP SHELL
// ==============================================================================
// Dedicated UI Shell for private founder & administrative operations.
// ==============================================================================

import { useState, useEffect } from "react";
import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Shield,
  Activity,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  Database,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EkaMark } from "@/components/brand/Logo";
import { supabase } from "@/integrations/supabase/client";
import { FOUNDER_ADMIN_NAV } from "../config/navigation";

export function FounderAdminShell() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "error">("checking");
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    // Quick DB telemetry ping
    const checkDb = async () => {
      const start = performance.now();
      try {
        const { error } = await supabase.from("countries").select("code").limit(1);
        const end = performance.now();
        setLatency(Math.round(end - start));
        if (error) setDbStatus("error");
        else setDbStatus("connected");
      } catch {
        setDbStatus("error");
      }
    };
    checkDb();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans antialiased selection:bg-amber-500/20 selection:text-amber-200">
      {/* Top OS Header Bar */}
      <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-neutral-400 hover:text-white size-8"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>

          <Link to="/founder-admin" className="flex items-center gap-2.5 group">
            <EkaMark size="sm" className="ring-1 ring-amber-500/40" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-sm tracking-tight text-white">
                  EKA FOUNDER COCKPIT
                </span>
                <Badge
                  variant="outline"
                  className="text-[9px] uppercase font-mono tracking-widest text-amber-400 border-amber-500/30 bg-amber-500/10 px-1.5 py-0"
                >
                  Internal OS
                </Badge>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono hidden sm:block">
                admin.eka.world · Private Control Plane
              </p>
            </div>
          </Link>
        </div>

        {/* System Telemetry & Quick Exit */}
        <div className="flex items-center gap-3">
          {/* DB Live Status */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono bg-neutral-800/80 px-2.5 py-1 rounded-md border border-neutral-700/60">
            <Radio
              className={`size-3 ${
                dbStatus === "connected"
                  ? "text-emerald-400 animate-pulse"
                  : dbStatus === "checking"
                  ? "text-amber-400"
                  : "text-red-400"
              }`}
            />
            <span className="text-neutral-400">DB:</span>
            <span
              className={
                dbStatus === "connected"
                  ? "text-emerald-300"
                  : dbStatus === "checking"
                  ? "text-amber-300"
                  : "text-red-300"
              }
            >
              {dbStatus === "connected" ? `${latency}ms OK` : dbStatus}
            </span>
          </div>

          {/* Consumer App Link */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-600 bg-neutral-800/60 px-3 py-1.5 rounded-lg transition-colors font-mono"
          >
            <span>Consumer EKA</span>
            <ExternalLink className="size-3 text-neutral-400" />
          </Link>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleSignOut}
            className="text-xs text-neutral-400 hover:text-red-300 hover:bg-neutral-800/60 h-8 gap-1.5"
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </header>

      {/* Main OS Body: Sidebar + Main Content */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar Rail */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-neutral-800 bg-neutral-900/50 p-4 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 font-semibold">
            Subsystems & Radar
          </p>
          <nav className="space-y-1" aria-label="Founder Admin Navigation">
            {FOUNDER_ADMIN_NAV.map((item) => {
              const isActive =
                item.to === "/founder-admin"
                  ? currentPath === "/founder-admin" || currentPath === "/founder-admin/"
                  : currentPath.startsWith(item.to);
              const Icon = item.icon;

              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold shadow-xs"
                      : "text-neutral-400 hover:bg-neutral-800/70 hover:text-neutral-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`size-4 shrink-0 transition-colors ${
                        isActive ? "text-amber-400" : "text-neutral-500 group-hover:text-neutral-300"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge
                      variant="outline"
                      className="text-[9px] font-mono px-1 py-0 border-neutral-700 text-neutral-400"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-neutral-800/80 px-2 space-y-2">
            <div className="text-[10px] font-mono text-neutral-500">
              <p>Security Perimeter: Enforced</p>
              <p>Zero Consumer Leakage Active</p>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/80 lg:hidden flex"
            onClick={() => setMobileOpen(false)}
          >
            <div
              className="w-72 bg-neutral-900 border-r border-neutral-800 p-4 space-y-2 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="px-3 pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 font-semibold">
                Founder / Admin Cockpit
              </p>
              {FOUNDER_ADMIN_NAV.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs text-neutral-300 hover:bg-neutral-800"
                >
                  <item.icon className="size-4 text-amber-400" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Viewport for Sub-routes */}
        <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-neutral-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
