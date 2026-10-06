// ==============================================================================
// EKA MOBILE NAVIGATION: MobileBottomNav (Tactile Unified Bottom Dock)
// ==============================================================================
// 1. Follows Section 16 Mobile IA recommendation:
//    Home | Discover | Stories | Ask | My EKA
// 2. High-visibility Create action (floating / elevated central action)
// 3. More drawer for Community, Messages, and Learn
// 4. One single source of truth from @/config/navigation
// ==============================================================================

import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Plus, MoreHorizontal, X, ArrowRight } from "lucide-react";
import { easings } from "@/lib/tokens/motion";
import { cn } from "@/lib/utils";
import {
  MOBILE_PRIMARY_TABS,
  CREATE_ACTION_ITEM,
  MOBILE_MORE_ITEMS,
} from "@/config/navigation";
import { track } from "@/lib/analytics";

export function MobileBottomNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);

  // Do not show consumer mobile nav in private workspace, admin console, or brand ops
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
      try {
        navigator.vibrate(8);
      } catch {}
    }
  };

  const handleTabClick = (to: string, label: string) => {
    triggerHaptic();
    track("navigation_clicked", { to, label, surface: "mobile_bottom" });
    setMoreDrawerOpen(false);
  };

  return (
    <>
      {/* Contextual More Drawer for Community, Messages, Learn */}
      <AnimatePresence>
        {moreDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col justify-end"
            onClick={() => setMoreDrawerOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-card border-t border-border/80 rounded-t-3xl p-5 shadow-2xl space-y-4 max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <span className="font-display font-semibold text-sm">More Cultural Pathways</span>
                <button
                  onClick={() => setMoreDrawerOpen(false)}
                  className="size-8 rounded-full flex items-center justify-center bg-accent text-muted-foreground hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {MOBILE_MORE_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      to={item.to}
                      onClick={() => handleTabClick(item.to, item.label)}
                      className="flex items-center justify-between p-3 rounded-2xl bg-accent/40 hover:bg-accent border border-border/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center">
                          <Icon className="size-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground" />
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Mobile Bottom Dock */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 px-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-1.5 bg-background/92 backdrop-blur-xl border-t border-border/70 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
      >
        <div className="flex items-center justify-around max-w-md mx-auto relative">
          {MOBILE_PRIMARY_TABS.map((item, index) => {
            const isActive =
              item.to === "/" ? currentPath === "/" : currentPath.startsWith(item.to);
            const Icon = item.icon;

            return (
              <div key={item.id} className="flex items-center">
                <Link
                  to={item.to}
                  onClick={() => handleTabClick(item.to, item.label)}
                  className={cn(
                    "relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors select-none",
                    isActive ? "text-terracotta font-medium" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {/* Active Animated Background Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="active-mobile-pill"
                      className="absolute inset-0 bg-terracotta/10 rounded-xl"
                      transition={easings.spring}
                    />
                  )}

                  <div className="relative z-10 flex flex-col items-center gap-0.5">
                    <Icon className={cn("size-4.5", isActive ? "stroke-[2.2]" : "stroke-[1.7]")} />
                    <span className="text-[10px] font-mono tracking-tight">{item.label}</span>
                  </div>

                  {/* Active Dot */}
                  {isActive && (
                    <motion.div
                      layoutId="active-dot"
                      className="absolute -bottom-1 size-1 rounded-full bg-terracotta"
                      transition={easings.spring}
                    />
                  )}
                </Link>
              </div>
            );
          })}

          {/* More Drawer Trigger */}
          <button
            onClick={() => {
              triggerHaptic();
              setMoreDrawerOpen(!moreDrawerOpen);
            }}
            className={cn(
              "relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors select-none",
              moreDrawerOpen ? "text-terracotta font-medium" : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="More pathways"
          >
            <div className="relative z-10 flex flex-col items-center gap-0.5">
              <MoreHorizontal className="size-4.5 stroke-[1.7]" />
              <span className="text-[10px] font-mono tracking-tight">More</span>
            </div>
          </button>
        </div>
      </nav>
    </>
  );
}
