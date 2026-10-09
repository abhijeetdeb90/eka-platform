// ==============================================================================
// CONSUMER APPLICATION — SITE HEADER (CANONICAL UNIFIED IA)
// ==============================================================================
// 1. Unified 8 Primary Destinations:
//    Home | Discover | Stories | Learn | Ask EKA | Community | Messages | My EKA
// 2. High-visibility Create action (contribute to living archive)
// 3. Global controls: Search | Language | Messages | Account Menu
// 4. Responsive desktop navigation with clean mobile drawer
// ==============================================================================

import { useState, useEffect } from "react";
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
import { CulturalSearchBar } from "@/components/search";

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

  const handleNavClick = (to: string, label: string) => {
    track("navigation_clicked", { to, label });
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/70 bg-background/90 shadow-calm backdrop-blur-md"
          : "border-b border-border/40 bg-background/70 backdrop-blur-sm"
      }`}
    >
      <div className="container-eka flex h-16 items-center justify-between gap-2 sm:gap-4">
        {/* Logo and Desktop Nav */}
        <div className="flex min-w-0 items-center gap-3 lg:gap-6 xl:gap-8">
          <Link
            to="/"
            onClick={() => handleNavClick("/", "Home")}
            className="min-w-0 transition-opacity hover:opacity-90 flex items-center shrink-0"
            aria-label="EKA Home"
          >
            <EkaLogo size="md" withBeta />
          </Link>

          {/* Desktop Navigation: 8 Primary Pillars */}
          <nav
            className="hidden items-center gap-0.5 lg:gap-1 lg:flex"
            aria-label="Main Navigation"
          >
            {PRIMARY_NAV_ITEMS.map((l) => {
              const Icon = l.icon;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  activeOptions={{ exact: l.exact }}
                  onClick={() => handleNavClick(l.to, l.label)}
                  activeProps={{ className: "text-foreground font-semibold bg-accent/70" }}
                  className="relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-all duration-200 hover:bg-accent/40 hover:text-foreground"
                >
                  <Icon className="size-3.5 stroke-[1.8] opacity-75" />
                  <span>{l.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop Global Controls & Create Button */}
        <div className="hidden items-center gap-2 sm:gap-2.5 md:flex shrink-0">
          {/* Prominent Desktop Create Action Button */}
          <Button
            asChild
            size="sm"
            className="rounded-xl bg-gradient-to-r from-terracotta to-saffron text-white shadow-calm hover:shadow-lift hover:opacity-95 font-medium px-3.5 py-1.5 text-xs transition-all mr-1"
            onClick={() => track("create_started", { source: "header" })}
          >
            <Link to={CREATE_ACTION_ITEM.to}>
              <Plus className="size-3.5 mr-1 stroke-[2.5]" />
              <span>{CREATE_ACTION_ITEM.label}</span>
            </Link>
          </Button>

          {/* Instant Visible Language Selector */}
          <LanguageSelector variant="header" />

          {/* Cultural Command Palette & Search Trigger */}
          <CulturalSearchBar variant="header" className="hidden lg:flex" />
          <CulturalSearchBar variant="compact" className="lg:hidden" />

          {/* Direct Messages Quick Action */}
          <Link
            to="/messages"
            onClick={() => track("navigation_clicked", { to: "/messages", label: "Messages" })}
            className="flex items-center justify-center size-8.5 rounded-full text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground border border-transparent hover:border-border/60"
            aria-label="Direct Messages"
            title="Messages"
          >
            <MessageSquare className="size-4" />
          </Link>

          {/* Profile / My EKA Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center justify-center size-8.5 rounded-full border border-border/80 bg-accent/30 text-foreground transition-all hover:bg-accent hover:border-border hover:shadow-xs focus:outline-hidden"
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
                      <span>My EKA Sanctuary</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/app/saved"
                      className="flex items-center gap-2 cursor-pointer text-xs"
                    >
                      <Bookmark className="size-3.5 text-muted-foreground" />
                      <span>{t("nav.saved")}</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/messages" className="flex items-center gap-2 cursor-pointer text-xs">
                      <MessageSquare className="size-3.5 text-muted-foreground" />
                      <span>Messages & Connections</span>
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
                    <Link
                      to="/my-eka"
                      className="flex items-center gap-2 cursor-pointer text-xs font-medium"
                    >
                      <User className="size-3.5 text-muted-foreground" />
                      <span>My EKA Sanctuary</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/auth"
                      className="flex items-center gap-2 cursor-pointer text-xs font-medium"
                    >
                      <LogIn className="size-3.5 text-muted-foreground" />
                      <span>{t("auth.signIn")}</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/join"
                      className="flex items-center gap-2 cursor-pointer text-xs text-terracotta font-medium"
                    >
                      <Sparkles className="size-3.5" />
                      <span>Join Living Archive</span>
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

        {/* Mobile Header Actions */}
        <div className="flex items-center gap-1.5 md:hidden">
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

          <LanguageSelector variant="compact" />

          <CulturalSearchBar variant="compact" />

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

      {/* Mobile Drawer Navigation */}
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

              {/* 8 Primary Navigation Pillars in Drawer */}
              <div className="grid grid-cols-1 gap-1 py-1">
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
                        className="flex min-h-[42px] items-center justify-between rounded-xl px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="size-4 opacity-75" />
                          <span>{l.label}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground/70 font-mono">
                          {l.description.split("—")[0]?.trim()}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Create CTA Button in Drawer */}
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
                    <span>Contribute to Living Archive</span>
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
                        <span>My EKA (@{profile.username || "sanctuary"})</span>
                        <User className="size-4" />
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
