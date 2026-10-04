// ==============================================================================
// CONSUMER APPLICATION — SITE HEADER
// ==============================================================================
// Public consumer-only header shell.
// Prominent EKA logo branding + Instant Language Selector (অসমীয়া ▾).
// Completely localized interface.
// ==============================================================================

import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Menu,
  X,
  Search,
  User,
  ArrowRight,
  Sparkles,
  LogOut,
  LogIn,
  Bookmark,
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
import { CONSUMER_PRIMARY_NAV } from "../config/navigation";

export function ConsumerHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const { t } = useLocalization();

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
      if (e.key === "Escape") setMobileMenuOpen(false);
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

  const getNavLabel = (to: string, defaultLabel: string) => {
    if (to === "/discover") return t("nav.discover", defaultLabel);
    if (to === "/stories") return t("nav.stories", defaultLabel);
    if (to === "/learn") return t("nav.learn", defaultLabel);
    if (to === "/create") return t("nav.create", defaultLabel);
    if (to === "/knowledge") return t("nav.knowledge", defaultLabel);
    return defaultLabel;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/70 bg-background/90 shadow-calm backdrop-blur-md"
          : "border-b border-border/40 bg-background/70 backdrop-blur-sm"
      }`}
    >
      <div className="container-eka flex h-16 items-center justify-between gap-3 sm:gap-4">
        {/* Logo and Desktop Nav */}
        <div className="flex min-w-0 items-center gap-6 lg:gap-10">
          <Link
            to="/"
            className="min-w-0 transition-opacity hover:opacity-90 flex items-center"
            aria-label="EKA Home"
          >
            <EkaLogo size="md" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
            {CONSUMER_PRIMARY_NAV.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{ className: "text-foreground font-semibold bg-accent/60" }}
                className="relative rounded-lg px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent/40 hover:text-foreground"
              >
                {getNavLabel(l.to, l.label)}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Actions: Language Selector + Search (🔍) + Profile/Account (◯) */}
        <div className="hidden items-center gap-2.5 sm:gap-3 md:flex">
          {/* Instant Visible Language Selector */}
          <LanguageSelector variant="header" />

          {/* Search Trigger */}
          <Link
            to="/search"
            className="flex items-center justify-center size-9 rounded-full text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground border border-transparent hover:border-border/60"
            aria-label={t("action.search")}
            title={t("action.search")}
          >
            <Search className="size-4" />
          </Link>

          {/* Profile / Account Dropdown (◯) */}
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
                    <Link to="/app/me" className="flex items-center gap-2 cursor-pointer text-xs">
                      <User className="size-3.5 text-muted-foreground" />
                      <span>{t("nav.profile")}</span>
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
                      <span>{t("auth.joinSanctuary")}</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {!profile && (
            <Button asChild size="sm" className="rounded-xl shadow-calm hover:shadow-lift ml-1">
              <Link to="/join">
                <span>{t("auth.join")}</span>
                <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Actions: Language + Search + Hamburger */}
        <div className="flex items-center gap-1.5 md:hidden">
          <LanguageSelector variant="compact" />

          <Link
            to="/search"
            className="flex items-center justify-center size-9 rounded-xl text-muted-foreground hover:text-foreground"
            aria-label={t("action.search")}
          >
            <Search className="size-4.5" />
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="size-10 min-h-[40px] min-w-[40px] rounded-xl"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-border/80 bg-background/98 backdrop-blur-xl md:hidden"
          >
            <div className="container-eka flex flex-col gap-2 py-6">
              <div className="flex items-center justify-between px-3 pb-2 border-b border-border/40">
                <EkaLogo size="sm" />
                <LanguageSelector variant="pill" />
              </div>

              {CONSUMER_PRIMARY_NAV.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 + 0.05 }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setMobileMenuOpen(false)}
                    activeProps={{ className: "bg-accent/80 text-foreground font-semibold" }}
                    className="flex min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2.5 text-base text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                  >
                    <span>{getNavLabel(l.to, l.label)}</span>
                    <ArrowRight className="size-4 opacity-50" />
                  </Link>
                </motion.div>
              ))}

              <div className="mt-3 flex flex-col gap-2.5 border-t border-border/60 pt-4">
                {profile ? (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-xl py-5 justify-between"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to="/app/me">
                        <span>{t("nav.profile")} ({profile.display_name || profile.username})</span>
                        <User className="size-4" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      className="w-full rounded-xl py-5"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to="/join">
                        <Sparkles className="mr-1.5 size-4 text-saffron" />
                        <span>{t("auth.join")}</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-xl py-5"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to="/auth">{t("auth.signIn")}</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
