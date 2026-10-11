// ==============================================================================
// EKA BETA MOBILE BOTTOM NAV
// ==============================================================================
// Simple clean mobile nav: Home · Discover · Ask EKA · Join
// ==============================================================================

import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Compass, HelpCircle, UserPlus } from "lucide-react";

export function MobileBottomNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Do not show on admin or internal routes
  if (
    currentPath.startsWith("/founder-admin") ||
    currentPath.startsWith("/brands-enterprise") ||
    currentPath.startsWith("/enterprise") ||
    currentPath.startsWith("/ops") ||
    currentPath.startsWith("/admin")
  ) {
    return null;
  }

  const items = [
    { label: "Home", to: "/", exact: true, icon: Home },
    { label: "Discover", to: "/discover", icon: Compass },
    { label: "Ask EKA", to: "/ask", icon: HelpCircle },
    { label: "Join", to: "/join", icon: UserPlus },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8E2D9]"
    >
      <div
        className="flex items-center justify-around max-w-md mx-auto px-3 py-2"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        {items.map((item) => {
          const active = item.exact
            ? currentPath === item.to
            : currentPath.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 py-1 px-3 text-xs font-medium transition-colors ${
                active ? "text-[#C45C26] font-semibold" : "text-[#5C5C5C] hover:text-[#1A1A1A]"
              }`}
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
