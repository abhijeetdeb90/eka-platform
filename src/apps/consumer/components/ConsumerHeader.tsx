// ==============================================================================
// CONSUMER APPLICATION — SITE HEADER (CANONICAL UNIFIED IA)
// ==============================================================================
// Desktop layout:
//   LEFT:  [EKA BETA logo]  Home | Discover | Stories | Learn | Community
//   RIGHT: [Ask EKA search pill] [Create button] [Profile dropdown]
//
// Mobile layout:
//   Header bar: [Logo] [Search] [Create] [Hamburger]
//   Drawer: 5 primary nav + Account section
// ==============================================================================

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Menu,
  X,
  Search,
  User,
  Sparkles,
  LogOut,
  LogIn,
  Bookmark,
  Plus,
  MessageSquare,
  ArrowRight,
  Settings,
  Bell,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { EkaLogo } from "@/components/brand/Logo";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { useLocalization } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { PRIMARY_NAV_ITEMS, CREATE_ACTION_ITEM } from "@/config/navigation";
import { track } from "@/lib/analytics";

export function ConsumerHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const { t } = useLocalization();
  const [hasTrendingAlert, setHasTrendingAlert] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
      // Cmd/Ctrl+K opens search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const handleNavClick = (to: string, label: string) => {
    track("navigation_clicked", { to, label });
    setMobileMenuOpen(false);
  };

  const handleAskSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = (fd.get("q") as string)?.trim();
    track("search_submitted", { source: "header_ask", q });
    if (q) {
      navigate({ to: "/ask", search: { q } as any });
    } else {
      navigate({ to: "/ask" });
    }
    setSearchOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/70 bg-background/90 shadow-calm backdrop-blur-md"
          : "border-b border-border/40 bg-background/70 backdrop-blur-sm"
      }`}
    >
      <div className="container-eka flex h-16 items-center justify-between gap-2 sm:gap-3">
        {/* ─── LEFT: Logo + 5 Primary Nav ─────────────────────────── */}
        <div className="flex min-w-0 items-center gap-4 lg:gap-6 xl:gap-8">
          <Link
            to="/"
            onClick={() => handleNavClick("/", "Home")}
            className="min-w-0 transition-opacity hover:opacity-90 flex items-center shrink-0"
            aria-label="EKA Home"
          >
            <EkaLogo size="md" withBeta />
          </Link>

          {/* Desktop 5-pillar navigation */}
          <nav
            className="hidden items-center lg:flex"
            aria-label="Main Navigation"
          >
            <div className="flex items-center gap-0.5">
              {PRIMARY_NAV_ITEMS.map((l) => {
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    activeOptions={{ exact: l.exact }}
                    onClick={() => handleNavClick(l.to, l.label)}
                    activeProps={{ className: "text-foreground font-semibold bg-accent/70" }}
                    className="relative flex items-center rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-all duration-200 hover:bg-accent/40 hover:text-foreground"
                  >
                    <span>{l.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* ─── RIGHT: Ask EKA pill + Create + Profile ──────────────── */}
        <div className="hidden items-center gap-2 md:flex shrink-0">

          {/* Ask EKA — persistent search/AI entry */}
          <button
            onClick={() => {
              setSearchOpen(true);
              setTimeout(() => searchInputRef.current?.focus(), 50);
              track("ask_eka_opened", { source: "header" });
            }}
            className="flex items-center gap-2 h-9 rounded-full border border-border/80 bg-accent/20 px-3.5 text-[12px] text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:border-border transition-all group"
            aria-label="Ask EKA — search or ask anything"
          >
            <Search className="size-3.5 shrink-0" />
            <span className="hidden xl:inline">Ask EKA anything...</span>
            <span className="xl:hidden">Search</span>
            <kbd className="hidden xl:inline ml-2 rounded border border-border/60 bg-background/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/70">
              ⌘K
            </kbd>
          </button>

          {/* Notification Bell */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="relative flex items-center justify-center size-9 rounded-full border border-transparent hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all"
                aria-label="Notifications"
                onClick={() => setHasTrendingAlert(false)}
              >
                <Bell className="size-4" />
                {hasTrendingAlert && (
                  <span className="absolute top-2 right-2 size-2 rounded-full bg-terracotta border border-background shadow-xs animate-pulse" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-2 shadow-lg rounded-xl">
              <div className="px-2 py-1.5 mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Notifications</span>
                <span className="text-[10px] text-muted-foreground cursor-pointer hover:underline">Mark all read</span>
              </div>
              <DropdownMenuItem asChild>
                <Link to="/community" className="flex items-start gap-3 p-2 rounded-lg cursor-pointer">
                  <div className="size-8 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="size-4 text-saffron" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-foreground">Trending in Sacred Geography</span>
                    <span className="text-[10px] text-muted-foreground line-clamp-2">The topic "Why do ancient temples align with seasonal solstices?" is trending now.</span>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language selector */}
          <LanguageSelector variant="header" />

          {/* Create action */}
          <Button
            asChild
            size="sm"
            className="rounded-xl bg-gradient-to-r from-terracotta to-saffron text-white shadow-calm hover:shadow-lift hover:opacity-95 font-medium px-3.5 py-1.5 text-xs transition-all"
            onClick={() => track("create_started", { source: "header" })}
          >
            <Link to={CREATE_ACTION_ITEM.to}>
              <Plus className="size-3.5 mr-1 stroke-[2.5]" />
              <span>Create</span>
            </Link>
          </Button>

          {/* Profile dropdown — contains My EKA + Messages + Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center justify-center size-9 rounded-full border border-border/80 bg-accent/30 text-foreground transition-all hover:bg-accent hover:border-border hover:shadow-xs focus:outline-hidden"
                aria-label="Account Menu"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name || "Account"}
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  <User className="size-4 text-muted-foreground hover:text-foreground" />
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-lg rounded-xl">
              {profile ? (
                <>
                  <DropdownMenuLabel className="px-2.5 py-1.5">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {profile.display_name || profile.username || t("auth.member")}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono truncate">
                      @{profile.username || "sanctuary"}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link
                      to="/my-eka"
                      onClick={() => track("my_eka_opened", { source: "header_dropdown" })}
                      className="flex items-center gap-2 cursor-pointer text-xs"
                    >
                      <User className="size-3.5 text-muted-foreground" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/messages" className="flex items-center gap-2 cursor-pointer text-xs">
                      <MessageSquare className="size-3.5 text-muted-foreground" />
                      <span>Messages</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/app/saved" className="flex items-center gap-2 cursor-pointer text-xs">
                      <Bookmark className="size-3.5 text-muted-foreground" />
                      <span>{t("nav.saved")}</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2 cursor-pointer text-xs text-destructive focus:text-destructive"
                  >
                    <LogOut className="size-3.5" />
                    <span>{t("auth.signOut")}</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/auth" className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                      <LogIn className="size-3.5 text-muted-foreground" />
                      <span>{t("auth.signIn")}</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/join" className="flex items-center gap-2 cursor-pointer text-xs text-terracotta font-medium">
                      <Sparkles className="size-3.5" />
                      <span>Join EKA</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {!profile && (
            <Button asChild size="sm" variant="outline" className="rounded-xl text-xs h-8 ml-0.5">
              <Link to="/join">
                <span>Join</span>
                <ArrowRight className="ml-1 size-3" />
              </Link>
            </Button>
          )}
        </div>

        {/* ─── MOBILE Header Actions ───────────────────────────────── */}
        <div className="flex items-center gap-1.5 md:hidden">
          <Link
            to="/search"
            className="flex items-center justify-center size-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/60"
            aria-label="Search"
          >
            <Search className="size-4" />
          </Link>

          <Button
            asChild
            size="sm"
            className="rounded-xl bg-gradient-to-r from-terracotta to-saffron text-white shadow-xs font-medium px-2.5 py-1 text-xs"
            onClick={() => track("create_started", { source: "mobile_header" })}
          >
            <Link to="/create">
              <Plus className="size-3.5 mr-0.5 stroke-[2.5]" />
              <span>Create</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="size-9 rounded-xl"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* ─── Ask EKA Search Overlay ───────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-md flex items-start justify-center pt-[15vh] px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-xl bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleAskSearch} className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
                <Search className="size-4.5 text-muted-foreground shrink-0" />
                <input
                  ref={searchInputRef}
                  name="q"
                  placeholder="Understand something... Why do people light diyas?"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
                  autoComplete="off"
                />
                <button type="submit" className="shrink-0 rounded-lg bg-terracotta px-3 py-1.5 text-xs font-medium text-white hover:bg-terracotta/90 transition-colors">
                  Ask
                </button>
              </form>

              {/* Quick prompts */}
              <div className="px-4 py-3 space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70 mb-2">
                  Try asking
                </p>
                {[
                  "Why do people light diyas?",
                  "Why is Varanasi sacred?",
                  "What is Bhoota Kola?",
                  "Diwali vs. Lunar New Year",
                  "Why do Japanese bow?",
                ].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      track("ask_eka_chip_clicked", { q });
                      navigate({ to: "/ask", search: { q } as any });
                      setSearchOpen(false);
                    }}
                    className="w-full text-left rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-colors"
                  >
                    → {q}
                  </button>
                ))}
              </div>

              <div className="px-4 py-2.5 border-t border-border/40 flex items-center justify-between">
                <Link
                  to="/discover"
                  onClick={() => setSearchOpen(false)}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Explore the map →
                </Link>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-[11px] text-muted-foreground hover:text-foreground"
                >
                  ESC to close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Mobile Drawer Navigation ─────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-border/80 bg-background/98 backdrop-blur-xl md:hidden shadow-xl"
          >
            <div className="container-eka flex flex-col gap-1.5 py-5 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="flex items-center justify-between px-3 pb-3 border-b border-border/40">
                <EkaLogo size="sm" withBeta />
                <LanguageSelector variant="pill" />
              </div>

              {/* 5 Primary Nav items */}
              <div className="grid grid-cols-1 gap-0.5 py-1">
                {PRIMARY_NAV_ITEMS.map((l, i) => {
                  const Icon = l.icon;
                  return (
                    <motion.div
                      key={l.to}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 + 0.04 }}
                    >
                      <Link
                        to={l.to}
                        activeOptions={{ exact: l.exact }}
                        onClick={() => handleNavClick(l.to, l.label)}
                        activeProps={{ className: "bg-accent/80 text-foreground font-semibold" }}
                        className="flex min-h-[44px] items-center gap-3 rounded-xl px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                      >
                        <Icon className="size-4 opacity-70 shrink-0" />
                        <span>{l.label}</span>
                        <span className="ml-auto text-[11px] text-muted-foreground/60">
                          {l.description}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Ask EKA in drawer */}
              <div className="px-1">
                <Link
                  to="/ask"
                  onClick={() => handleNavClick("/ask", "Ask EKA")}
                  className="flex items-center gap-3 min-h-[44px] rounded-xl px-3.5 py-2 text-sm border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                >
                  <Search className="size-4 shrink-0" />
                  <span className="font-medium">Ask EKA</span>
                  <span className="ml-auto text-[11px] text-muted-foreground/60">Understand something</span>
                </Link>
              </div>

              {/* Create CTA */}
              <div className="my-2 px-1">
                <Button
                  asChild
                  className="w-full rounded-xl py-5 bg-gradient-to-r from-terracotta to-saffron text-white font-medium shadow-calm"
                  onClick={() => {
                    track("create_started", { source: "drawer" });
                    setMobileMenuOpen(false);
                  }}
                >
                  <Link to="/create">
                    <Plus className="mr-1.5 size-4 stroke-[2.5]" />
                    <span>Contribute a Story</span>
                  </Link>
                </Button>
              </div>

              {/* Account & Profile */}
              <div className="flex flex-col gap-2 border-t border-border/60 pt-3">
                {profile ? (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-xl py-4.5 justify-between"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to="/my-eka">
                        <span>My Profile (@{profile.username || "sanctuary"})</span>
                        <User className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full rounded-xl py-4 justify-start text-xs text-muted-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to="/messages">
                        <MessageSquare className="mr-2 size-3.5" />
                        Messages
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-xs text-destructive hover:text-destructive justify-start"
                    >
                      <LogOut className="mr-1.5 size-3.5" />
                      <span>{t("auth.signOut")}</span>
                    </Button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-xl py-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to="/auth">{t("auth.signIn")}</Link>
                    </Button>
                    <Button
                      asChild
                      className="rounded-xl py-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to="/join">
                        <Sparkles className="mr-1 size-3.5 text-saffron" />
                        <span>{t("auth.join")}</span>
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
