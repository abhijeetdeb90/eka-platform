// ==============================================================================
// EKA BETA MOBILE BOTTOM NAV
// ==============================================================================
// Simple clean mobile nav: Home · Discover · Ask EKA · Join
// ==============================================================================

import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Compass, Film, Radio, PlusCircle, User } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

export function MobileBottomNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { data: profile } = useProfile();

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
    { label: "Stories", to: "/stories", icon: Film },
    { label: "Feed", to: "/feed", icon: Radio },
    { label: "Create", to: "/create", icon: PlusCircle },
    { label: profile ? "Profile" : "Sign In", to: "/my-eka", icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8E2D9]"
    >
      <div
        className="flex items-center justify-between max-w-md mx-auto px-2 py-1.5"
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
              className={`flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] font-medium transition-colors ${
                active ? "text-[#C45C26] font-semibold" : "text-[#5C5C5C] hover:text-[#1A1A1A]"
              }`}
            >
              <Icon className="size-5" />
              <span className="truncate max-w-[50px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
