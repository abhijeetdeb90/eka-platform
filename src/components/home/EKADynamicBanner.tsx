import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
  Compass,
  HelpCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EkaLogo } from "@/components/brand/Logo";
import type { EKABannerItem } from "./banner-types";
import { HOME_BANNERS, getRegionalBanners } from "./banner-data";
import { useLocalization } from "@/lib/i18n";

interface EKADynamicBannerProps {
  banners?: EKABannerItem[];
  autoRotateInterval?: number;
  className?: string;
  onExploreWorld?: () => void;
}

export function EKADynamicBanner({
  banners: propBanners,
  autoRotateInterval = 7000,
  className = "",
  onExploreWorld,
}: EKADynamicBannerProps) {
  const { region, locale } = useLocalization();
  const banners = propBanners || getRegionalBanners(region, locale);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  const currentBanner = banners[currentIndex] ?? banners[0]!;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto rotation timer
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    const timer = setInterval(() => {
      // Pause if tab is inactive
      if (document.hidden) return;
      goToNext();
    }, autoRotateInterval);

    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion, autoRotateInterval, goToNext]);

  // Handle CTA click: if it's an anchor on page like #living-world
  const handlePrimaryCtaClick = (e: React.MouseEvent, route: string) => {
    if (route.startsWith("#")) {
      e.preventDefault();
      if (onExploreWorld) {
        onExploreWorld();
      } else {
        const el = document.getElementById(route.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <div
      ref={bannerRef}
      role="region"
      aria-label="Editorial Cultural Highlights"
      className={`relative w-full rounded-3xl overflow-hidden bg-neutral-950 text-white border border-border/40 shadow-lift ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Background Image Canvas with Crossfade */}
      <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentBanner.image}
              alt={currentBanner.title}
              className="w-full h-full object-cover object-center brightness-[0.72] contrast-[1.05]"
              loading={currentIndex === 0 ? "eager" : "lazy"}
            />
          </motion.div>
        </AnimatePresence>

        {/* Sophisticated Editorial Vignette & Lighting */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/65 to-black/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-950/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_40%,_rgba(0,0,0,0.65)_100%)] pointer-events-none" />
      </div>

      {/* Living Atmospheric Glow Ring */}
      <div className="absolute -top-24 -left-24 size-80 rounded-full bg-saffron/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 size-80 rounded-full bg-terracotta/15 blur-3xl pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col justify-between min-h-[580px] sm:min-h-[620px] p-6 sm:p-10 lg:p-12">
        {/* Top Header Row in Banner */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <EkaLogo
                markClassName="size-7"
                className="text-white"
                textClassName="text-white"
                withTagline={false}
              />
            </Link>
            <span className="hidden sm:inline-block text-[11px] font-mono tracking-widest text-amber-200/70 uppercase">
              • One Within. One With All.
            </span>
          </div>

          {/* Location Badge */}
          {currentBanner.location && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/90">
              <MapPin className="size-3 text-saffron shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-none">{currentBanner.location}</span>
            </div>
          )}
        </div>

        {/* Central Editorial Narrative */}
        <div className="my-auto py-8 sm:py-10 max-w-2xl space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner.id}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-4"
            >
              {/* Category Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/20 border border-saffron/40 text-amber-200 text-xs font-mono tracking-widest uppercase">
                <Sparkles className="size-3 text-saffron animate-pulse" />
                <span>{currentBanner.eyebrow}</span>
                {currentBanner.festival && (
                  <>
                    <span className="opacity-40">•</span>
                    <span className="text-white/80">{currentBanner.festival}</span>
                  </>
                )}
              </div>

              {/* Main Headline */}
              <h1 className="font-display font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight text-white drop-shadow-md whitespace-pre-line">
                {currentBanner.title}
              </h1>

              {/* Supporting Line / Subtitle */}
              {currentBanner.subtitle && (
                <p className="font-display italic text-lg sm:text-xl text-amber-200/90 font-light">
                  {currentBanner.subtitle}
                </p>
              )}

              {/* Curiosity Hook: "Why should I care?" gap */}
              {currentBanner.curiosityQuestion && (
                <div className="inline-flex items-start gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white/95 max-w-xl shadow-calm">
                  <HelpCircle className="size-4 text-saffron shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-medium tracking-wide leading-snug">
                    {currentBanner.curiosityQuestion}
                  </p>
                </div>
              )}

              {/* Simple Supporting Description */}
              <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-xl">
                {currentBanner.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Action CTAs */}
          <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-4">
            {currentBanner.ctaRoute.startsWith("#") ? (
              <Button
                size="lg"
                onClick={(e) => handlePrimaryCtaClick(e, currentBanner.ctaRoute)}
                className="rounded-2xl px-6 py-5 bg-terracotta hover:bg-terracotta/90 text-white font-medium text-xs font-mono tracking-wider uppercase gap-2 shadow-calm group transition-all"
              >
                <span>{currentBanner.ctaLabel}</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Link to={currentBanner.ctaRoute}>
                <Button
                  size="lg"
                  className="rounded-2xl px-6 py-5 bg-terracotta hover:bg-terracotta/90 text-white font-medium text-xs font-mono tracking-wider uppercase gap-2 shadow-calm group transition-all"
                >
                  <span>{currentBanner.ctaLabel}</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}

            {currentBanner.secondaryCtaLabel && (
              currentBanner.secondaryCtaRoute?.startsWith("#") ? (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={(e) => handlePrimaryCtaClick(e, currentBanner.secondaryCtaRoute || "#living-world")}
                  className="rounded-2xl px-5 py-5 border-white/30 bg-black/40 backdrop-blur-md text-white hover:bg-white/20 font-medium text-xs font-mono tracking-wider uppercase"
                >
                  {currentBanner.secondaryCtaLabel}
                </Button>
              ) : (
                <Link to={currentBanner.secondaryCtaRoute || "/join"}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-2xl px-5 py-5 border-white/30 bg-black/40 backdrop-blur-md text-white hover:bg-white/20 font-medium text-xs font-mono tracking-wider uppercase"
                  >
                    {currentBanner.secondaryCtaLabel}
                  </Button>
                </Link>
              )
            )}
          </div>
        </div>

        {/* Bottom Navigation & Indicator Bar */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
          {/* Subtle Indicator Dots */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Banner slides">
            {banners.map((b, idx) => (
              <button
                key={b.id}
                role="tab"
                aria-selected={idx === currentIndex}
                aria-label={`Go to slide ${idx + 1}: ${b.eyebrow}`}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full h-2 ${
                  idx === currentIndex
                    ? "w-7 bg-saffron shadow-xs"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Previous / Next Arrow Controls */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-white/50 mr-2 hidden sm:inline">
              0{currentIndex + 1} / 0{banners.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrev}
              aria-label="Previous story"
              className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/10"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              aria-label="Next story"
              className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/10"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
