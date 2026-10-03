import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Menu,
  X,
  Search,
  User,
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  Shield,
  LogOut,
  LogIn,
  Bookmark,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { EkaLogo } from "@/components/brand/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/hooks/useProfile";
import { useIsAdmin } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";

// Clean EKA-native primary consumer navigation
const navLinks = [
  { to: "/discover", label: "Discover" },
  { to: "/stories", label: "Stories" },
  { to: "/learn", label: "Learn" },
  { to: "/create", label: "Create" },
] as const;

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: profile } = useProfile();
  const { data: isAdmin } = useIsAdmin();
  const navigate = useNavigate();

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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/70 bg-background/90 shadow-calm backdrop-blur-md"
          : "border-b border-border/40 bg-background/70 backdrop-blur-sm"
      }`}
    >
      <div className="container-eka flex h-16 items-center justify-between gap-4">
        {/* Logo and Desktop Nav */}
        <div className="flex min-w-0 items-center gap-8 lg:gap-10">
          <Link to="/" className="min-w-0 transition-opacity hover:opacity-90">
            <EkaLogo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{ className: "text-foreground font-medium bg-accent/60" }}
                className="relative rounded-lg px-3.5 py-1.5 text-sm text-muted-foreground transition-all duration-200 hover:bg-accent/40 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Actions: Search (🔍) + Profile/Account (◯) */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Search Trigger */}
          <Link
            to="/search"
            className="flex items-center justify-center size-9 rounded-full text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
            aria-label="Search EKA"
            title="Search EKA"
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
                      {profile.display_name || profile.username || "Member"}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono truncate">
                      @{profile.username || "sanctuary"}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to="/app/me" className="flex items-center gap-2 cursor-pointer text-xs">
                      <User className="size-3.5 text-muted-foreground" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/app/saved" className="flex items-center gap-2 cursor-pointer text-xs">
                      <Bookmark className="size-3.5 text-muted-foreground" />
                      <span>Saved Reflections</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* Contextual Brand Workspace entry */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/brands"
                      className="flex items-center gap-2 cursor-pointer text-xs text-emerald-600 dark:text-emerald-400 font-medium"
                    >
                      <Building2 className="size-3.5" />
                      <span>Switch to Brand Workspace</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* Role-protected Admin console (only visible if admin) */}
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 cursor-pointer text-xs text-amber-600 dark:text-amber-400 font-medium"
                      >
                        <Shield className="size-3.5" />
                        <span>Admin Console</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2 cursor-pointer text-xs text-destructive focus:text-destructive"
                  >
                    <LogOut className="size-3.5" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/auth" className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                      <LogIn className="size-3.5 text-muted-foreground" />
                      <span>Sign in to EKA</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/join" className="flex items-center gap-2 cursor-pointer text-xs text-terracotta font-medium">
                      <Sparkles className="size-3.5" />
                      <span>Join EKA Sanctuary</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/brands"
                      className="flex items-center gap-2 cursor-pointer text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      <Building2 className="size-3.5" />
                      <span>Brand Workspace</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {!profile && (
            <Button asChild size="sm" className="rounded-xl shadow-calm hover:shadow-lift ml-1">
              <Link to="/join">
                <span>Join EKA</span>
                <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Actions: Search + Hamburger */}
        <div className="flex items-center gap-1.5 md:hidden">
          <Link
            to="/search"
            className="flex items-center justify-center size-10 rounded-xl text-muted-foreground hover:text-foreground"
            aria-label="Search EKA"
          >
            <Search className="size-5" />
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="size-11 min-h-[44px] min-w-[44px] rounded-xl"
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
              <p className="px-3 pb-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                EKA
              </p>
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 + 0.05 }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setMobileMenuOpen(false)}
                    activeProps={{ className: "bg-accent/80 text-foreground font-medium" }}
                    className="flex min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2.5 text-base text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                  >
                    <span>{l.label}</span>
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
                        <span>My Account ({profile.display_name || profile.username})</span>
                        <User className="size-4" />
                      </Link>
                    </Button>
                    <Link
                      to="/brands"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs text-muted-foreground text-center py-2 hover:text-foreground"
                    >
                      Switch to Brand Workspace
                    </Link>
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
                        <span>Join EKA</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-xl py-5"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to="/auth">Sign in</Link>
                    </Button>
                    <Link
                      to="/brands"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[11px] text-muted-foreground text-center pt-1 hover:text-foreground"
                    >
                      Brand Workspace Access
                    </Link>
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
