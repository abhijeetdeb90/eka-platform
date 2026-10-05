import { useEffect } from "react";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  Home,
  Compass,
  Users,
  PlusSquare,
  User,
  Bell,
  Bookmark,
  Search,
  HelpCircle,
  LayoutDashboard,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeNotifications } from "@/hooks/useRealtime";
import { EkaLogo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { fetchMyRestriction } from "@/lib/moderation";
import { registerOfflineShell } from "@/lib/offline-shell";
import { applyJoinAnswers } from "@/lib/join";
import { TactileWrapper } from "@/components/motion/MotionPrimitives";

export const Route = createFileRoute("/_authenticated/app")({
  component: AppLayout,
});

const mobileTabs = [
  { to: "/app", label: "Home", icon: Home, exact: true },
  { to: "/app/explore", label: "Discover", icon: Compass, exact: false },
  { to: "/app/ask", label: "Ask", icon: HelpCircle, exact: false },
  { to: "/app/sanghas", label: "Community", icon: Users, exact: false },
  { to: "/app/dashboard", label: "My EKA", icon: LayoutDashboard, exact: false },
] as const;

const primaryNavItems = [
  { to: "/app", label: "Home", icon: Home, exact: true },
  { to: "/app/explore", label: "Discover", icon: Compass, exact: false },
  { to: "/app/ask", label: "Ask", icon: HelpCircle, exact: false },
  { to: "/app/sanghas", label: "Community", icon: Users, exact: false },
  { to: "/app/dashboard", label: "My EKA", icon: LayoutDashboard, exact: false },
] as const;

const utilityNavItems = [
  { to: "/app/search", label: "Search", icon: Search, exact: false },
  { to: "/app/saved", label: "Saved", icon: Bookmark, exact: false },
  { to: "/app/notifications", label: "Notifications", icon: Bell, exact: false },
] as const;

const navItemClass =
  "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-muted-foreground transition-all duration-200 hover:bg-accent/60 hover:text-foreground";

function AppLayout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: profile } = useProfile();

  useRealtimeNotifications();

  const { data: restriction } = useQuery({
    queryKey: ["my-restriction"],
    queryFn: fetchMyRestriction,
  });

  // Warm the offline shell once the member is signed in.
  useEffect(() => {
    registerOfflineShell();
  }, []);

  // Carry questionnaire answers onto the profile the first time we see an account.
  useEffect(() => {
    void applyJoinAnswers().then((applied) => {
      if (applied) void queryClient.invalidateQueries({ queryKey: ["profile"] });
    });
  }, [queryClient]);

  const { data: unread } = useQuery({
    queryKey: ["unread-notifications"],
    refetchInterval: 60_000,
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return 0;
      const { count } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", auth.user.id)
        .eq("read", false);
      return count ?? 0;
    },
  });

  return (
    <div className="min-h-dvh bg-background text-foreground selection:bg-primary-soft selection:text-foreground">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {restriction && (
        <div className="border-b border-destructive/30 bg-destructive/10 px-5 py-3 text-center text-xs font-medium text-foreground">
          Posting is paused
          {restriction.expires_at
            ? ` until ${new Date(restriction.expires_at).toLocaleString()}`
            : ""}{" "}
          · {restriction.reason}{" "}
          <Link to="/app/appeal" className="underline underline-offset-2">
            Appeal this
          </Link>
        </div>
      )}

      {/* --- Mobile Top Header (Frosted Glass) ------------------------- */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md lg:hidden">
        <div className="mx-auto grid max-w-2xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3">
          <Link to="/app" className="min-w-0 transition-opacity hover:opacity-90">
            <EkaLogo />
          </Link>
          <div className="flex shrink-0 items-center gap-1.5">
            <Button asChild variant="ghost" size="icon" className="rounded-xl">
              <Link to="/app/create" aria-label="Create something new">
                <PlusSquare aria-hidden="true" className="size-5 text-primary" strokeWidth={1.8} />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="rounded-xl">
              <Link to="/app/search" search={{ q: "" }} aria-label="Search EKA">
                <Search aria-hidden="true" className="size-5" strokeWidth={1.6} />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="relative rounded-xl">
              <Link
                to="/app/notifications"
                aria-label={`Notifications${(unread ?? 0) > 0 ? `, ${unread} unread` : ""}`}
              >
                <Bell aria-hidden="true" className="size-5" strokeWidth={1.6} />
                {(unread ?? 0) > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary ring-2 ring-background animate-pulse"
                  />
                )}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* --- App Shell Container ---------------------------------------- */}
      <div className="mx-auto flex w-full max-w-[92rem] gap-6 px-0 lg:px-6 xl:gap-10">
        {/* Desktop Sidebar Rail */}
        <aside
          aria-label="Primary"
          className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col overflow-y-auto border-r border-border/50 py-6 pr-4 lg:flex"
        >
          <Link to="/app" className="mb-7 px-3 transition-opacity hover:opacity-90">
            <EkaLogo withTagline />
          </Link>

          {/* 5 Primary Intent Actions */}
          <nav aria-label="Main Navigation" className="space-y-1">
            {primaryNavItems.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.exact }}
                activeProps={{
                  className: "bg-accent/80 font-medium text-foreground shadow-xs",
                  "aria-current": "page",
                }}
                className={navItemClass}
              >
                <l.icon
                  aria-hidden="true"
                  className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
                  strokeWidth={1.6}
                />
                <span className="truncate">{l.label}</span>
              </Link>
            ))}
          </nav>

          {/* Primary Persistent Action */}
          <div className="my-5 px-1">
            <TactileWrapper className="w-full">
              <Button
                className="w-full rounded-xl py-5 shadow-calm transition-all hover:shadow-lift"
                onClick={() => navigate({ to: "/app/create" })}
              >
                <PlusSquare className="mr-1.5 size-4" />
                <span>Create</span>
              </Button>
            </TactileWrapper>
          </div>

          {/* Secondary Utilities */}
          <div className="space-y-1 border-t border-border/50 pt-4">
            {utilityNavItems.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{
                  className: "bg-accent/80 font-medium text-foreground shadow-xs",
                  "aria-current": "page",
                }}
                className={navItemClass}
              >
                <l.icon
                  aria-hidden="true"
                  className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
                  strokeWidth={1.6}
                />
                <span className="truncate">{l.label}</span>
                {l.label === "Notifications" && (unread ?? 0) > 0 && (
                  <span className="ml-auto rounded-full bg-primary px-1.5 py-0.2 text-[10px] font-semibold text-primary-foreground">
                    <span className="sr-only">Unread notifications: </span>
                    {unread}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Profile Pill & Footnote */}
          <div className="mt-auto space-y-2 pt-6">
            {profile && (
              <div className="border-t border-border/50 pt-3">
                <Link
                  to="/app/me"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                >
                  <span className="size-2 rounded-full bg-forest" />
                  <span className="truncate font-medium text-foreground">@{profile.username}</span>
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Main Routed Content Area */}
        <main
          id="main-content"
          tabIndex={-1}
          className="min-w-0 flex-1 pb-28 outline-none lg:pb-12"
        >
          <Outlet />
        </main>
      </div>

      {/* --- Mobile Bottom Navigation (Glass Dock) ---------------------- */}
      <nav
        aria-label="Primary mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/90 backdrop-blur-lg lg:hidden"
      >
        <div className="mx-auto flex max-w-lg items-stretch">
          {mobileTabs.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              activeOptions={{ exact: tab.exact }}
              activeProps={{ className: "text-primary font-medium", "aria-current": "page" }}
              className="group relative flex min-h-[3.5rem] flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <motion.div whileTap={{ scale: 0.88 }} transition={{ duration: 0.15 }}>
                <tab.icon
                  aria-hidden="true"
                  className="size-5 transition-transform group-hover:scale-105"
                  strokeWidth={1.6}
                />
              </motion.div>
              <span>{tab.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
