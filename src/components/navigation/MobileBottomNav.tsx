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
import { track } from "@/lib/analytics";

// Split the 4 tabs (2 left, 2 right) — center is always Ask EKA
const LEFT_TABS = MOBILE_PRIMARY_TABS.slice(0, 2);   // Home, Discover
const RIGHT_TABS = MOBILE_PRIMARY_TABS.slice(2, 4);  // Stories, Community

export function MobileBottomNav() {
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

  const isActive = (item: { to: string; exact?: boolean }) =>
    item.exact
      ? currentPath === item.to
      : currentPath.startsWith(item.to) && item.to !== "/";

  const isAskActive = currentPath.startsWith("/ask") || currentPath.startsWith("/search");
  const isProfileActive = currentPath.startsWith("/my-eka") || currentPath.startsWith("/messages") || currentPath.startsWith("/app/saved");

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border/70 shadow-[0_-8px_30px_rgba(0,0,0,0.10)]"
    >
      <div
        className="flex items-end justify-around max-w-md mx-auto px-2"
        style={{ paddingBottom: "max(0.65rem, env(safe-area-inset-bottom))" }}
      >
        {/* ── Left tabs: Home, Discover ────────────────────────── */}
        {LEFT_TABS.map((item) => {
          const active = item.exact
            ? currentPath === item.to
            : currentPath.startsWith(item.to);
          const Icon = item.icon;
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
                  layoutId="active-mobile-pill"
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
                  layoutId="active-dot"
                  className="absolute -bottom-px size-1 rounded-full bg-terracotta"
                  transition={easings.spring}
                />
              )}
            </Link>
          );
        })}

        {/* ── Center: Ask EKA Floating Button ─────────────────── */}
        <div className="flex flex-col items-center -mt-5 pb-1">
          <Link
            to="/ask"
            onClick={() => {
              triggerHaptic();
              track("ask_eka_opened", { source: "mobile_fab" });
            }}
            className={cn(
              "flex flex-col items-center justify-center size-14 rounded-full shadow-lift transition-all",
              isAskActive
                ? "bg-terracotta text-white"
                : "bg-gradient-to-br from-terracotta to-saffron text-white hover:shadow-xl active:scale-95"
            )}
            aria-label="Ask EKA"
          >
            <Search className="size-5 stroke-[2]" />
          </Link>
          <span className={cn(
            "mt-0.5 text-[10px] font-mono tracking-tight",
            isAskActive ? "text-terracotta font-semibold" : "text-muted-foreground"
          )}>
            Ask EKA
          </span>
        </div>

        {/* ── Right tabs: Stories, Community ───────────────────── */}
        {RIGHT_TABS.map((item) => {
          const active = currentPath.startsWith(item.to);
          const Icon = item.icon;
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
                  layoutId="active-mobile-pill-r"
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
                  layoutId="active-dot-r"
                  className="absolute -bottom-px size-1 rounded-full bg-terracotta"
                  transition={easings.spring}
                />
              )}
            </Link>
          );
        })}

        {/* ── Profile tab ───────────────────────────────────────── */}
        <Link
          to="/my-eka"
          onClick={() => handleTabClick("/my-eka", "Profile")}
          className={cn(
            "relative flex flex-col items-center justify-center pt-2 pb-1 px-3 rounded-xl transition-colors select-none min-w-[48px]",
            isProfileActive ? "text-terracotta font-medium" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {isProfileActive && (
            <motion.div
              layoutId="active-mobile-pill-profile"
              className="absolute inset-0 bg-terracotta/10 rounded-xl"
              transition={easings.spring}
            />
          )}
          <div className="relative z-10 flex flex-col items-center gap-0.5">
            {/* Intentionally use the User icon — Profile sub-items (Messages, Saved) all live here */}
            {(() => {
              const ProfileIcon = MOBILE_PRIMARY_TABS[4]!.icon;
              return <ProfileIcon className={cn("size-5", isProfileActive ? "stroke-[2.2]" : "stroke-[1.7]")} />;
            })()}
            <span className="text-[10px] font-mono tracking-tight">Profile</span>
          </div>
          {isProfileActive && (
            <motion.div
              layoutId="active-dot-profile"
              className="absolute -bottom-px size-1 rounded-full bg-terracotta"
              transition={easings.spring}
            />
          )}
        </Link>
      </div>
    </nav>
  );
}
