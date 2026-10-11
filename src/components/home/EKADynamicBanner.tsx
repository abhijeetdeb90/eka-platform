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
import { HOME_BANNERS } from "./banner-data";

interface EKADynamicBannerProps {
  banners?: EKABannerItem[];
  autoRotateInterval?: number;
  className?: string;
  onExploreWorld?: () => void;
}

export function EKADynamicBanner({
  banners = HOME_BANNERS,
  autoRotateInterval = 7000,
  className = "",
  onExploreWorld,
}: EKADynamicBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
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
        const targetId = route.slice(1);
        const el = document.getElementById(targetId) || document.getElementById("discover-categories");
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
      aria-label="EKA Living Editorial Gateway"
      className={`relative w-full rounded-3xl overflow-hidden bg-neutral-950 text-white border border-border/40 shadow-lift flex flex-col justify-between ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Background Image Canvas with Atmospheric Crossfade */}
      <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentBanner.image}
              alt={currentBanner.title}
              className="w-full h-full object-cover object-center brightness-[0.70] contrast-[1.05]"
              loading={currentIndex === 0 ? "eager" : "lazy"}
            />
          </motion.div>
        </AnimatePresence>

        {/* Sophisticated Editorial Vignette & Lighting */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_40%,_rgba(0,0,0,0.65)_100%)] pointer-events-none" />
      </div>

      {/* Living Atmospheric Glow Ring */}
      <div className="absolute -top-24 -left-24 size-80 rounded-full bg-saffron/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 size-80 rounded-full bg-terracotta/20 blur-3xl pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col justify-between flex-1 p-6 sm:p-10 lg:p-12 min-h-[580px] sm:min-h-[620px]">
        {/* Top Header Row in Banner */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <EkaLogo
                markClassName="size-7"
                className="text-white"
                textClassName="text-white font-serif text-xl tracking-[0.2em] font-bold"
                withTagline={false}
              />
            </Link>
            <span className="inline-block text-[10px] sm:text-xs font-mono tracking-widest text-amber-300 font-semibold uppercase">
              • ONE WITHIN. ONE WITH ALL.
            </span>
          </div>

          {/* Location Badge */}
          {currentBanner.location && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-mono text-white/90 shadow-sm shrink-0">
              <MapPin className="size-3 text-amber-300 shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-none">{currentBanner.location}</span>
            </div>
          )}
        </div>

        {/* Central Editorial Narrative */}
        <div className="my-auto py-6 sm:py-8 max-w-2xl space-y-5">
          {/* Permanent Core Anchor */}
          <div className="space-y-2">
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal leading-[1.02] tracking-tight text-white drop-shadow-md">
              ONE WORLD. <br />
              BILLIONS OF STORIES.
            </h1>
            <p className="font-serif italic text-2xl sm:text-3xl text-amber-200/90 font-light">
              One Within. One With All.
            </p>
          </div>

          {/* Dynamic Living Story Card inside Hero */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner.id}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="p-5 sm:p-6 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 text-white/95 max-w-xl shadow-lg space-y-2.5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-amber-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-amber-300 shrink-0 animate-pulse" />
                  {currentBanner.eyebrow}
                  {currentBanner.festival && ` • ${currentBanner.festival}`}
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-white/60">
                  {currentBanner.location}
                </span>
              </div>

              {/* Curiosity Question */}
              {currentBanner.curiosityQuestion ? (
                <p className="text-sm sm:text-base font-medium text-white leading-snug">
                  {currentBanner.curiosityQuestion}
                </p>
              ) : (
                <p className="text-sm sm:text-base font-medium text-white leading-snug">
                  {currentBanner.title}
                </p>
              )}

              {/* Simple Supporting Description */}
              <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
                {currentBanner.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <Button
              size="lg"
              onClick={(e) => handlePrimaryCtaClick(e, "#living-world")}
              className="rounded-2xl px-7 py-5 bg-terracotta hover:bg-terracotta/90 text-white font-medium text-xs font-mono tracking-wider uppercase gap-2 shadow-calm group transition-all"
            >
              <span>EXPLORE THE WORLD</span>
              <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Link to="/join">
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl px-6 py-5 border-white/30 bg-black/40 backdrop-blur-md text-white hover:bg-white/20 font-medium text-xs font-mono tracking-wider uppercase"
              >
                JOIN EKA
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom Navigation & Indicator Bar */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
          {/* Subtle Indicator Dots */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Living story moments">
            {banners.map((b, idx) => (
              <button
                key={b.id}
                role="tab"
                aria-selected={idx === currentIndex}
                aria-label={`View story ${idx + 1}: ${b.eyebrow}`}
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
              aria-label="Previous story moment"
              className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/10"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              aria-label="Next story moment"
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
