// ==============================================================================
// BRANDS / ENTERPRISE APPLICATION — APP SHELL
// ==============================================================================
// Dedicated UI Shell for private B2B & Enterprise partners.
// ==============================================================================

import { useState } from "react";
import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  Shield,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EkaMark } from "@/components/brand/Logo";
import { supabase } from "@/integrations/supabase/client";
import { BRANDS_ENTERPRISE_NAV } from "../config/navigation";

export function BrandsEnterpriseShell() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-sand/15 text-foreground flex flex-col font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Top Brand OS Header Bar */}
      <header className="border-b border-border/80 bg-background/95 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-muted-foreground hover:text-foreground size-8"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>

          <Link to="/brands-enterprise" className="flex items-center gap-2.5 group">
            <EkaMark size="sm" className="ring-1 ring-emerald-500/40" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-sm tracking-tight text-foreground">
                  EKA FOR BRANDS & ENTERPRISE
                </span>
                <Badge
                  variant="outline"
                  className="text-[9px] uppercase font-mono tracking-widest text-emerald-700 dark:text-emerald-300 border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0"
                >
                  B2B Product
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono hidden sm:block">
                business.eka.world · Enterprise Growth Engine
              </p>
            </div>
          </Link>
        </div>

        {/* Brand Actions & Sign Out */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-lg transition-colors font-mono"
          >
            <span>Consumer EKA</span>
            <ExternalLink className="size-3" />
          </Link>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleSignOut}
            className="text-xs text-muted-foreground hover:text-destructive h-8 gap-1.5"
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </header>

      {/* Main Layout: Sidebar + Main Content */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar Rail */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border/80 bg-background/60 p-4 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground font-semibold">
            Brand Workspace
          </p>
          <nav className="space-y-1" aria-label="Brands Navigation">
            {BRANDS_ENTERPRISE_NAV.map((item) => {
              const isActive =
                item.to === "/brands-enterprise"
                  ? currentPath === "/brands-enterprise" || currentPath === "/brands-enterprise/"
                  : currentPath.startsWith(item.to);
              const Icon = item.icon;

              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-semibold shadow-xs"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`size-4 shrink-0 transition-colors ${
                        isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge
                      variant="outline"
                      className="text-[9px] font-mono px-1 py-0 border-border text-muted-foreground"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-border/80 px-2 space-y-2">
            <div className="text-[10px] font-mono text-muted-foreground">
              <p>Phase 3: Separate Product</p>
              <p>Isolated from Consumer UX</p>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden flex"
            onClick={() => setMobileOpen(false)}
          >
            <div
              className="w-72 bg-background border-r border-border p-4 space-y-2 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="px-3 pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Brand Workspace
              </p>
              {BRANDS_ENTERPRISE_NAV.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs text-foreground hover:bg-accent"
                >
                  <item.icon className="size-4 text-emerald-600" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Viewport for Sub-routes */}
        <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
