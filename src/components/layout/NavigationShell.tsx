/* eslint-disable react-refresh/only-export-components */
// ==============================================================================
// EKA NAVIGATION SHELL COMPONENT
// ==============================================================================
// Specification: Unified NavigationShell component wrapping the application.
// Features:
// 1. Sticky Desktop Header with 'glass-header' utility:
//    - Brand identity / Logo
//    - Primary Navigation: Home (/), Discover (/discover), Stories (/stories),
//      Ask EKA (/ask), Feed (/feed), My EKA (/my-eka)
//    - Secondary Actions: Search (Cultural Command Palette ⌘K), Profile button & menu
// 2. Fixed Bottom Mobile Navigation Bar:
//    - Icons for Home, Discover, Stories, Ask EKA, Feed, My EKA
//    - Tactile feedback, active state indicators & safe-area insets
// 3. Editorial Consistency:
//    - Uses EKA design tokens (terracotta, glass-header, calm shadows, ambient effects)
//    - Responsive container with configurable layout variants
// ==============================================================================

import React, { useState, useEffect, type ReactNode } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Home,
  Compass,
  Film,
  HelpCircle,
  Users,
  User,
  Search,
  LogIn,
  LogOut,
  Bookmark,
  Plus,
  Settings,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { EkaLogo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { useCulturalCommandPalette } from "@/components/search";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { SiteFooter } from "@/components/site/SiteFooter";

export interface NavItemConfig {
  id: string;
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  description: string;
}

export const EKA_NAV_ITEMS: NavItemConfig[] = [
  {
    id: "home",
    label: "Home",
    to: "/",
    exact: true,
    icon: Home,
    description: "Living cultural world & daily rhythms",
  },
  {
    id: "discover",
    label: "Discover",
    to: "/discover",
    icon: Compass,
    description: "Cultures, traditions, sacred places & foodways",
  },
  {
    id: "stories",
    label: "Stories",
    to: "/stories",
    icon: Film,
    description: "Reels, carousels, highlights & visual narratives",
  },
  {
    id: "ask",
    label: "Ask EKA",
    to: "/ask",
    icon: HelpCircle,
    description: "Cultural inquiry & 8-part structured wisdom",
  },
  {
    id: "feed",
    label: "Feed",
    to: "/feed",
    icon: Users,
    description: "Real-time community interactions & reflections",
  },
  {
    id: "my-eka",
    label: "My EKA",
    to: "/my-eka",
    icon: User,
    description: "Sanctuary, saved stories, intentions & roots",
  },
];

export type NavigationShellVariant = "default" | "feed" | "reading" | "canvas" | "broad" | "full";

export interface NavigationShellProps {
  children: ReactNode;
  variant?: NavigationShellVariant;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  rightRail?: ReactNode;
  showFooter?: boolean;
  hideHeader?: boolean;
  hideBottomNav?: boolean;
  className?: string;
  contentClassName?: string;
  activeNavId?: string;
}

const SHELL_VARIANT_CLASSES: Record<NavigationShellVariant, string> = {
  default: "container-eka py-6 sm:py-8",
  feed: "max-w-4xl mx-auto px-4 sm:px-6 py-6 lg:py-8",
  reading: "max-w-3xl mx-auto px-4 sm:px-6 py-6 lg:py-8",
  canvas: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6",
  broad: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6",
  full: "w-full px-0 py-0",
};

export function NavigationShell({
  children,
  variant = "default",
  eyebrow,
  title,
  subtitle,
  action,
  rightRail,
  showFooter = false,
  hideHeader = false,
  className,
  contentClassName,
  activeNavId,
}: NavigationShellProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();
  const { openPalette } = useCulturalCommandPalette();
  const { data: profile } = useProfile();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch {}
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const handleNavClick = (to: string, label: string) => {
    triggerHaptic();
    track("navigation_clicked", { to, label, surface: "navigation_shell" });
  };

  const isNavActive = (item: NavItemConfig) => {
    if (activeNavId) return activeNavId === item.id;
    if (item.exact) return currentPath === item.to;
    return currentPath === item.to || currentPath.startsWith(item.to + "/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-terracotta/20 selection:text-terracotta">
      {/* =========================================================================
          STICKY DESKTOP HEADER (WITH 'glass-header' UTILITY)
      ========================================================================== */}
      {!hideHeader && (
        <header
          className={cn(
            "sticky top-0 z-50 transition-all duration-300 w-full glass-header",
            scrolled ? "shadow-calm" : "",
          )}
        >
          <div className="container-eka flex h-16 items-center justify-between gap-2 sm:gap-4">
            {/* Left: Brand Identity Logo */}
            <div className="flex items-center gap-3 lg:gap-6 shrink-0">
              <Link
                to="/"
                onClick={() => handleNavClick("/", "Home")}
                className="flex items-center gap-2 group transition-opacity hover:opacity-90"
                aria-label="EKA Home"
              >
                <EkaLogo size="md" withBeta />
              </Link>
            </div>

            {/* Center: Desktop Navigation (Home, Discover, Stories, Ask EKA, Feed, My EKA) */}
            <nav
              className="hidden lg:flex items-center gap-1 xl:gap-1.5"
              aria-label="Primary Navigation"
            >
              {EKA_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(item);

                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    onClick={() => handleNavClick(item.to, item.label)}
                    className={cn(
                      "relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all select-none",
                      active
                        ? "text-terracotta font-semibold bg-terracotta/10 shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                    )}
                  >
                    <Icon className={cn("size-3.5", active ? "stroke-[2.2] text-terracotta" : "stroke-[1.8] opacity-75")} />
                    <span>{item.label}</span>

                    {/* Subtle micro dot under active tab */}
                    {active && (
                      <span className="absolute bottom-0.5 inset-x-0 mx-auto w-1 h-0.5 rounded-full bg-terracotta" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Secondary Action Buttons (Search & Profile) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Secondary Action 1: Search Button */}
              <button
                type="button"
                onClick={() => {
                  track("search_opened", { source: "navigation_shell" });
                  openPalette();
                }}
                className="group flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-accent/40 hover:bg-accent border border-border/60 hover:border-border text-muted-foreground hover:text-foreground transition-all cursor-pointer text-xs"
                title="Search cultures, traditions, and stories (⌘K)"
                aria-label="Search living cultures"
              >
                <Search className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="hidden md:inline font-sans font-light text-[12px] text-muted-foreground/90">
                  Search cultures...
                </span>
                <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-md bg-background/80 border border-border/60 font-mono text-[10px] text-muted-foreground/80">
                  ⌘K
                </kbd>
              </button>

              {/* Language Switcher */}
              <div className="hidden sm:block">
                <LanguageSelector variant="header" />
              </div>

              {/* Quick Contribute */}
              <Button
                asChild
                size="sm"
                className="hidden xl:inline-flex rounded-xl bg-gradient-to-r from-terracotta to-saffron text-white shadow-xs hover:shadow-calm hover:opacity-95 font-medium px-3 py-1.5 text-xs transition-all"
                onClick={() => track("create_started", { source: "navigation_shell" })}
              >
                <Link to="/create">
                  <Plus className="size-3.5 mr-1 stroke-[2.2]" />
                  <span>Contribute</span>
                </Link>
              </Button>

              {/* Secondary Action 2: Profile Button & Menu */}
              {profile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-accent transition-colors border border-transparent hover:border-border/60 cursor-pointer select-none"
                      aria-label="Open user profile menu"
                    >
                      <div className="size-7 sm:size-7.5 rounded-full overflow-hidden bg-terracotta/10 border border-terracotta/30 flex items-center justify-center text-terracotta font-semibold text-xs shrink-0">
                        {profile.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile.display_name || "Profile"}
                            className="size-full object-cover"
                          />
                        ) : (
                          (profile.display_name || "E").charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="hidden md:block text-xs font-medium text-foreground max-w-[90px] truncate">
                        {profile.display_name?.split(" ")[0] || "Sanctuary"}
                      </span>
                      <ChevronDown className="hidden md:block size-3 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-lift bg-card border-border/80">
                    <DropdownMenuLabel className="font-normal px-2 py-1.5">
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-xs font-medium text-foreground truncate flex items-center gap-1">
                          <span>{profile.display_name || "Cultural Seeker"}</span>
                          {profile.verified && <ShieldCheck className="size-3 text-forest" />}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono truncate">
                          @{profile.username || "sanctuary"}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/60" />
                    <DropdownMenuItem asChild className="rounded-xl text-xs cursor-pointer">
                      <Link to="/my-eka" className="flex items-center gap-2">
                        <User className="size-3.5 text-terracotta" />
                        <span>My Sanctuary</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl text-xs cursor-pointer">
                      <Link to={"/bookmarks" as any} className="flex items-center gap-2">
                        <Bookmark className="size-3.5 text-saffron" />
                        <span>Saved Inquiries</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl text-xs cursor-pointer">
                      <Link to="/app/settings" className="flex items-center gap-2">
                        <Settings className="size-3.5 text-muted-foreground" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/60" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="rounded-xl text-xs text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
                    >
                      <LogOut className="size-3.5" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-border/80 text-xs px-2.5 sm:px-3 h-8 hover:bg-terracotta/5 hover:text-terracotta hover:border-terracotta/40 transition-colors"
                >
                  <Link to="/auth" className="flex items-center gap-1.5">
                    <LogIn className="size-3.5 text-terracotta" />
                    <span>Sign In</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* =========================================================================
          MAIN APPLICATION CONTENT
      ========================================================================== */}
      <main id="main-content" className="flex-1 pb-20 md:pb-8">
        <div className={cn(SHELL_VARIANT_CLASSES[variant], className)}>
          {(eyebrow || title || subtitle || action) && (
            <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 pb-6 border-b border-border/40 mb-6">
              <div className="min-w-0">
                {eyebrow && (
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-terracotta font-mono">
                    {eyebrow}
                  </p>
                )}
                {title && (
                  <h1 className="mt-1.5 font-display text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight text-foreground">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-light max-w-2xl">
                    {subtitle}
                  </p>
                )}
              </div>
              {action && <div className="shrink-0">{action}</div>}
            </header>
          )}

          {rightRail ? (
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className={cn("min-w-0 space-y-6", contentClassName)}>{children}</div>
              <aside aria-label="Sidebar Rail" className="hidden xl:block">
                <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-10 pr-1">
                  {rightRail}
                </div>
              </aside>
            </div>
          ) : (
            <div className={cn("space-y-6", contentClassName)}>{children}</div>
          )}
        </div>
      </main>

      {/* OPTIONAL FOOTER */}
      {showFooter && <SiteFooter />}

    </div>
  );
}
