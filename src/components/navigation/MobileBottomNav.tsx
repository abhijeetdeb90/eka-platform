import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, Film, House, PlusCircle, Radio, UserRound, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type NavItem = {
  label: string;
  to: "/" | "/app" | "/discover" | "/stories" | "/feed" | "/create" | "/ask" | "/my-eka" | "/auth";
  icon: typeof Compass;
  exact?: boolean;
};

export function MobileBottomNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active) setIsAuthenticated(Boolean(data.session));
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });
    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (
    currentPath.startsWith("/founder-admin") ||
    currentPath.startsWith("/brands-enterprise") ||
    currentPath.startsWith("/enterprise") ||
    currentPath.startsWith("/ops") ||
    currentPath.startsWith("/admin")
  ) return null;

  const publicItems: NavItem[] = [
    { label: "Home", to: "/", icon: House, exact: true },
    { label: "Discover", to: "/discover", icon: Compass },
    { label: "Stories", to: "/stories", icon: Film },
    { label: "Ask EKA", to: "/ask", icon: Radio },
    { label: "Sign in", to: "/auth", icon: UserRound },
  ];
  const memberItems: NavItem[] = [
    { label: "Discover", to: "/discover", icon: Compass },
    { label: "Feed", to: "/app", icon: Users, exact: true },
    { label: "Create", to: "/create", icon: PlusCircle },
    { label: "Ask EKA", to: "/ask", icon: Radio },
    { label: "My EKA", to: "/my-eka", icon: UserRound },
  ];
  const items = isAuthenticated ? memberItems : publicItems;
  const isActive = (item: NavItem) =>
    item.exact
      ? currentPath === item.to
      : currentPath === item.to || currentPath.startsWith(item.to + "/");

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-[#E9E2DA] bg-white/95 shadow-[0_-4px_16px_rgba(38,24,20,0.04)] backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex w-full max-w-lg items-stretch justify-around px-1 pt-1.5 pb-1">
        {items.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[10px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B2D2D] ${active ? "text-[#6B2D2D]" : "text-[#6E6966] hover:text-[#2B2422]"}`}
            >
              <Icon aria-hidden="true" className={`size-5 shrink-0 ${active ? "stroke-[2.25]" : "stroke-[1.8]"}`} />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
