// ==============================================================================
// EKA MOBILE NAVIGATION: MobileBottomNav
// ==============================================================================
// Layout: Home · Discover · [Floating Ask EKA] · Stories · Community · Profile
// 
// The center slot is the Ask EKA floating action button — the primary
// interaction trigger on mobile. It sits elevated above the tab bar.
//
// Profile tab leads to /my-eka. Messages is accessible via Profile.
// ==============================================================================

import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { easings } from "@/lib/tokens/motion";
import { cn } from "@/lib/utils";
import { MOBILE_PRIMARY_TABS } from "@/config/navigation";
import { useProfile } from "@/hooks/useProfile";
import { track } from "@/lib/analytics";

export function MobileBottomNav() {
  const { data: profile } = useProfile();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Do not show consumer mobile nav in private workspace or admin console
  if (
    currentPath.startsWith("/founder-admin") ||
    currentPath.startsWith("/brands-enterprise") ||
    currentPath.startsWith("/enterprise") ||
    currentPath.startsWith("/ops") ||
    currentPath.startsWith("/admin") ||
    currentPath.startsWith("/brands")
  ) {
    return null;
  }

  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(8); } catch {}
    }
  };

  const handleTabClick = (to: string, label: string) => {
    triggerHaptic();
    track("navigation_clicked", { to, label, surface: "mobile_bottom" });
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border/70 shadow-[0_-8px_30px_rgba(0,0,0,0.10)]"
    >
      <div
        className="flex items-end justify-around max-w-md mx-auto px-2"
        style={{ paddingBottom: "max(0.65rem, env(safe-area-inset-bottom))" }}
      >
        {MOBILE_PRIMARY_TABS.map((item) => {
          let active = false;
          if (item.id === "ask") {
            active = currentPath.startsWith("/ask") || currentPath.startsWith("/search");
          } else {
            active = item.exact
              ? currentPath === item.to
              : currentPath.startsWith(item.to) && item.to !== "/";
          }
          
          const Icon = item.icon;
          
          // Special styling for Ask EKA
          if (item.id === "ask") {
            return (
              <div key={item.id} className="flex flex-col items-center -mt-5 pb-1">
                <Link
                  to={item.to}
                  onClick={() => {
                    triggerHaptic();
                    track("navigation_clicked", { to: item.to, label: item.label, source: "mobile_fab" });
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center size-14 rounded-full shadow-lift transition-all",
                    active
                      ? "bg-terracotta text-white"
                      : "bg-gradient-to-br from-terracotta to-saffron text-white hover:shadow-xl active:scale-95"
                  )}
                  aria-label="Ask EKA"
                >
                  <Search className="size-5 stroke-[2]" />
                </Link>
                <span className={cn(
                  "mt-0.5 text-[10px] font-mono tracking-tight",
                  active ? "text-terracotta font-semibold" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              to={item.to}
              onClick={() => handleTabClick(item.to, item.label)}
              className={cn(
                "relative flex flex-col items-center justify-center pt-2 pb-1 px-3 rounded-xl transition-colors select-none min-w-[48px]",
                active ? "text-terracotta font-medium" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {active && (
                <motion.div
                  layoutId={`active-mobile-pill-${item.id}`}
                  className="absolute inset-0 bg-terracotta/10 rounded-xl"
                  transition={easings.spring}
                />
              )}
              <div className="relative z-10 flex flex-col items-center gap-0.5">
                <Icon className={cn("size-5", active ? "stroke-[2.2]" : "stroke-[1.7]")} />
                <span className="text-[10px] font-mono tracking-tight">{item.label}</span>
              </div>
              {active && (
                <motion.div
                  layoutId={`active-dot-${item.id}`}
                  className="absolute -bottom-px size-1 rounded-full bg-terracotta"
                  transition={easings.spring}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
