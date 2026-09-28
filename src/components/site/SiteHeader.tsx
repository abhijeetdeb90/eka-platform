import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { EkaLogo } from "@/components/brand/Logo";
import { TactileWrapper } from "@/components/motion/MotionPrimitives";

const navLinks = [
  { to: "/junction", label: "The Junction" },
  { to: "/stories", label: "1,000 Stories" },
  { to: "/membership", label: "Membership" },
  { to: "/founder/ad", label: "Founder" },
  { to: "/practice", label: "Practice" },
  { to: "/observe", label: "Observe" },
  { to: "/studio", label: "Studio" },
  { to: "/system", label: "System Map" },
] as const;

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
                className="relative rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-all duration-200 hover:bg-accent/40 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/auth"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <TactileWrapper>
            <Button asChild size="sm" className="rounded-xl shadow-calm hover:shadow-lift">
              <Link to="/join">
                <span>Join EKA</span>
                <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          </TactileWrapper>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
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
                Navigation
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

              <div className="mt-4 flex flex-col gap-2.5 border-t border-border/60 pt-4">
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
                  <Link to="/auth">Sign in to your account</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
