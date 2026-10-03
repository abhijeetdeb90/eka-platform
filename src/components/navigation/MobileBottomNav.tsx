// ==============================================================================
// EKA MOBILE NAVIGATION: MobileBottomNav (Tactile Bottom Bar)
// ==============================================================================
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Film, BookOpen, User, Plus } from "lucide-react";
import { Pressable } from "@/components/motion/Pressable";
import { easings } from "@/lib/tokens/motion";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  isAction?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: "discover", label: "Discover", to: "/discover", icon: Compass },
  { id: "stories", label: "Stories", to: "/stories", icon: Film },
  { id: "create", label: "Create", to: "/create", icon: Plus, isAction: true },
  { id: "learn", label: "Learn", to: "/learn", icon: BookOpen },
  { id: "profile", label: "Account", to: "/membership", icon: User },
];

export function MobileBottomNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Do not show consumer mobile nav in private brand workspace or admin console
  if (currentPath.startsWith("/brands") || currentPath.startsWith("/ops") || currentPath.startsWith("/admin")) {
    return null;
  }

  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch {}
    }
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 bg-background/90 backdrop-blur-xl border-t border-border/70 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.to === "/" ? currentPath === "/" : currentPath.startsWith(item.to);
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <div key={item.id} className="relative -top-2 flex flex-col items-center">
                <Link
                  to={item.to}
                  onClick={triggerHaptic}
                  className="size-11 rounded-full bg-gradient-to-tr from-terracotta to-saffron text-white flex items-center justify-center shadow-lift border-2 border-background hover:scale-105 active:scale-95 transition-transform"
                  aria-label={item.label}
                >
                  <Plus className="size-5 stroke-[2.5]" />
                </Link>
                <span className="text-[10px] font-mono font-medium text-foreground/80 mt-0.5">
                  {item.label}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              to={item.to}
              onClick={triggerHaptic}
              className={cn(
                "relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors select-none",
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
                <Icon className={cn("size-5", isActive ? "stroke-[2.2]" : "stroke-[1.7]")} />
                <span className="text-[10px] font-mono tracking-tight">{item.label}</span>
              </div>

              {/* Active Dot Indicator */}
              {isActive && (
                <motion.div
                  layoutId="active-dot"
                  className="absolute -bottom-1 size-1 rounded-full bg-terracotta"
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
