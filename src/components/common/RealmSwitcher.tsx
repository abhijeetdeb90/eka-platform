import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Globe, TrendingUp, Terminal, ChevronDown, Check, Layers, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RealmSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isConsumer = !currentPath.startsWith("/brands") && !currentPath.startsWith("/ops") && !currentPath.startsWith("/system");
  const isBrands = currentPath.startsWith("/brands") || currentPath.startsWith("/campaigns") || currentPath.startsWith("/audience") || currentPath.startsWith("/promote") || currentPath.startsWith("/strategy");
  const isOps = currentPath.startsWith("/ops") || currentPath.startsWith("/system") || currentPath.startsWith("/founder");

  const currentRealm = isBrands
    ? { name: "Brands Growth OS", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/30" }
    : isOps
    ? { name: "Founder & Ops OS", icon: Terminal, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/30" }
    : { name: "Consumer Platform", icon: Globe, color: "text-terracotta", bg: "bg-terracotta/10 border-terracotta/30" };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="relative">
        {/* Expanded Drawer/Menu */}
        {isOpen && (
          <div className="absolute bottom-12 right-0 mb-2 w-72 rounded-2xl border border-border/80 bg-card/95 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2 px-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="size-3.5 text-primary" />
                EKA 3-Realm Switcher
              </span>
              <Badge variant="outline" className="text-[9px] font-mono px-1.5 py-0">v2.4</Badge>
            </div>

            <div className="space-y-1.5">
              {/* Product 1: Consumer Platform */}
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={`flex items-start gap-3 rounded-xl p-2.5 transition-all ${
                  isConsumer ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 text-foreground"
                }`}
              >
                <div className="p-1.5 rounded-lg bg-terracotta/10 text-terracotta mt-0.5">
                  <Globe className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">1. Consumer Platform</span>
                    {isConsumer && <Check className="size-3.5 text-terracotta" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">Discovery, Video Reels, Stories</p>
                  <span className="text-[9px] font-mono text-terracotta/90 mt-0.5 inline-block">/ (eka.earth)</span>
                </div>
              </Link>

              {/* Product 2: Brands Realm (EKA Growth OS) */}
              <Link
                to="/brands"
                onClick={() => setIsOpen(false)}
                className={`flex items-start gap-3 rounded-xl p-2.5 transition-all ${
                  isBrands ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 text-foreground"
                }`}
              >
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 mt-0.5">
                  <TrendingUp className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">2. Brands Growth OS</span>
                    {isBrands && <Check className="size-3.5 text-emerald-500" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">Meta Ads + GA4 + CRM + AI</p>
                  <span className="text-[9px] font-mono text-emerald-500/90 mt-0.5 inline-block">/brands</span>
                </div>
              </Link>

              {/* Product 3: Internal / Ops Platform */}
              <Link
                to="/ops"
                onClick={() => setIsOpen(false)}
                className={`flex items-start gap-3 rounded-xl p-2.5 transition-all ${
                  isOps ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 text-foreground"
                }`}
              >
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 mt-0.5">
                  <Terminal className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">3. Founder & Ops OS</span>
                    {isOps && <Check className="size-3.5 text-amber-500" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">Founder & Private Ops Only</p>
                  <span className="text-[9px] font-mono text-amber-500/90 mt-0.5 inline-block">/ops</span>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Trigger Pill Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 ${currentRealm.bg}`}
          title="Switch EKA UX Product Realm"
        >
          <currentRealm.icon className={`size-3.5 ${currentRealm.color}`} />
          <span className="text-xs font-medium text-foreground tracking-tight">
            {currentRealm.name}
          </span>
          <ChevronDown className={`size-3 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
    </div>
  );
}
