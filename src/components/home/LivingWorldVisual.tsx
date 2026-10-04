import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  Globe,
  HelpCircle,
  ZoomIn,
  Maximize2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import ritualLamp from "@/assets/ritual-lamp.jpg";
import kyotoImage from "@/assets/places/kyoto.jpg";
import marrakeshImage from "@/assets/places/marrakesh.jpg";
import todayReflection from "@/assets/today-reflection.jpg";
import stillWater from "@/assets/still-water.jpg";
import monasteryCorridor from "@/assets/monastery-corridor.jpg";
import readingTable from "@/assets/reading-table.jpg";
import journeyImage from "@/assets/journey.jpg";

export interface CulturalWorldHotspot {
  id: string;
  name: string;
  country: string;
  region: "asia" | "africa_med" | "americas";
  category: string;
  curiosityQuestion: string;
  shortStory: string;
  image: string;
  route: string;
  x: number; // Percent 0 - 100 on map
  y: number; // Percent 0 - 100 on map
}

export const CULTURAL_HOTSPOTS: CulturalWorldHotspot[] = [
  {
    id: "spot-india",
    name: "Varanasi & The Sacred River",
    country: "India",
    region: "asia",
    category: "Living Ritual",
    curiosityQuestion: "Why do millions of people light lamps at dusk?",
    shortStory:
      "During twilight aarti, five cosmic elements are offered back to the flowing river. Fire transforms into reverent gratitude, unbroken for 1,200 years.",
    image: ritualLamp,
    route: "/stories",
    x: 69.5,
    y: 47.0,
  },
  {
    id: "spot-japan",
    name: "Kyoto · Sacred Thresholds",
    country: "Japan",
    region: "asia",
    category: "Sacred Topography",
    curiosityQuestion: "Why are these gates found at the entrance of sacred spaces?",
    shortStory:
      "Torii gates mark the boundary where everyday busyness yields to natural reverence, inviting silent contemplation within ancient cedars.",
    image: kyotoImage,
    route: "/junction",
    x: 84.5,
    y: 41.5,
  },
  {
    id: "spot-morocco",
    name: "Fez · The Unbroken Medinas",
    country: "Morocco",
    region: "africa_med",
    category: "Artisan Lineage",
    curiosityQuestion: "How is this craft passed from one generation to another?",
    shortStory:
      "In labyrinthine stone courtyards, master artisans cut complex geometric zellige tiles without written blueprints, guided by memory and breath.",
    image: marrakeshImage,
    route: "/discover",
    x: 48.0,
    y: 43.5,
  },
  {
    id: "spot-mexico",
    name: "Oaxaca · Valley of Remembrance",
    country: "Mexico",
    region: "americas",
    category: "Community Reunion",
    curiosityQuestion: "Why does this celebration bring entire communities together?",
    shortStory:
      "Día de los Muertos is not mourning; it is an annual community reunion celebrating living memory with marigolds, bread, and midnight vigils.",
    image: todayReflection,
    route: "/stories",
    x: 23.5,
    y: 51.5,
  },
  {
    id: "spot-indonesia",
    name: "Bali · Subak Sacred Terraces",
    country: "Indonesia",
    region: "asia",
    category: "Ecological Lineage",
    curiosityQuestion: "Why do sacred water temples govern rice harvests?",
    shortStory:
      "The 1,000-year-old Subak system synchronizes water flow across entire volcanic valleys through collective village consensus and ritual stewardship.",
    image: stillWater,
    route: "/discover",
    x: 79.5,
    y: 62.5,
  },
  {
    id: "spot-nepal",
    name: "Kathmandu · High Valley Chants",
    country: "Nepal",
    region: "asia",
    category: "Sacred Wind",
    curiosityQuestion: "Why do prayer flags carry blessings into the wind?",
    shortStory:
      "Five colors represent the cosmic elements: earth, water, fire, wind, and sky, rippling goodwill outward across mountain passes.",
    image: monasteryCorridor,
    route: "/junction",
    x: 71.0,
    y: 45.0,
  },
  {
    id: "spot-greece",
    name: "Athens & Peloponnese",
    country: "Greece",
    region: "africa_med",
    category: "Generational Accord",
    curiosityQuestion: "Why has the olive branch signified peace across millennia?",
    shortStory:
      "Olive groves require decades to fruit. Planting one is a quiet promise of peace, knowing only future generations will harvest its shade.",
    image: readingTable,
    route: "/discover",
    x: 55.5,
    y: 42.0,
  },
  {
    id: "spot-peru",
    name: "Cuzco · The Living Stones",
    country: "Peru",
    region: "americas",
    category: "Ancient Architecture",
    curiosityQuestion: "How did stone masonry survive earthquakes without mortar?",
    shortStory:
      "Incan masons hand-carved colossal granite blocks with interlocking geometries that move like water during tremors and settle safely back into place.",
    image: journeyImage,
    route: "/discover",
    x: 29.5,
    y: 66.5,
  },
];

// Connection arcs linking key cultural corridors
const CULTURAL_CORRIDORS = [
  { from: CULTURAL_HOTSPOTS[0]!, to: CULTURAL_HOTSPOTS[5]! }, // Varanasi -> Nepal
  { from: CULTURAL_HOTSPOTS[5]!, to: CULTURAL_HOTSPOTS[1]! }, // Nepal -> Kyoto
  { from: CULTURAL_HOTSPOTS[1]!, to: CULTURAL_HOTSPOTS[4]! }, // Kyoto -> Bali
  { from: CULTURAL_HOTSPOTS[4]!, to: CULTURAL_HOTSPOTS[0]! }, // Bali -> Varanasi
  { from: CULTURAL_HOTSPOTS[0]!, to: CULTURAL_HOTSPOTS[6]! }, // Varanasi -> Greece
  { from: CULTURAL_HOTSPOTS[6]!, to: CULTURAL_HOTSPOTS[2]! }, // Greece -> Morocco
  { from: CULTURAL_HOTSPOTS[2]!, to: CULTURAL_HOTSPOTS[3]! }, // Morocco -> Mexico
  { from: CULTURAL_HOTSPOTS[3]!, to: CULTURAL_HOTSPOTS[7]! }, // Mexico -> Peru
];

export function LivingWorldVisual({ className = "" }: { className?: string }) {
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>("spot-india");
  const [regionFilter, setRegionFilter] = useState<"all" | "asia" | "africa_med" | "americas">("all");
  const [isHovering, setIsHovering] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load from session storage if visited previously
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("eka_selected_spot_id");
      if (saved && CULTURAL_HOTSPOTS.some((s) => s.id === saved)) {
        setSelectedHotspotId(saved);
      }
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
    }
  }, []);

  // Save selected spot in session
  const selectSpot = (spotId: string) => {
    setSelectedHotspotId(spotId);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("eka_selected_spot_id", spotId);
    }
  };

  // Ambient curiosity cycle (loops every 6s unless user interacts)
  useEffect(() => {
    if (isHovering || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setSelectedHotspotId((prev) => {
        const idx = CULTURAL_HOTSPOTS.findIndex((s) => s.id === prev);
        const nextIdx = (idx + 1) % CULTURAL_HOTSPOTS.length;
        const nextId = CULTURAL_HOTSPOTS[nextIdx]!.id;
        return nextId;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isHovering, prefersReducedMotion]);

  const activeSpot = useMemo(() => {
    return CULTURAL_HOTSPOTS.find((s) => s.id === selectedHotspotId) || CULTURAL_HOTSPOTS[0]!;
  }, [selectedHotspotId]);

  const filteredSpots = useMemo(() => {
    if (regionFilter === "all") return CULTURAL_HOTSPOTS;
    return CULTURAL_HOTSPOTS.filter((s) => s.region === regionFilter);
  }, [regionFilter]);

  return (
    <div
      id="living-world"
      ref={containerRef}
      role="region"
      aria-label="Interactive Living Cultural World Map"
      className={`relative w-full rounded-3xl border border-border/80 bg-neutral-950 text-white overflow-hidden shadow-lift ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* 1. Header Toolbar */}
      <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 border-b border-white/10 bg-gradient-to-b from-neutral-900/80 to-transparent backdrop-blur-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/20 border border-saffron/40 text-amber-200 text-xs font-mono uppercase tracking-widest">
            <span className="size-2 rounded-full bg-saffron animate-pulse" />
            <span>Living World Discovery</span>
          </div>
          <h2 className="font-display font-serif text-2xl sm:text-3xl font-normal text-white">
            Touch the map. Unfold a story.
          </h2>
          <p className="text-xs sm:text-sm text-white/70 font-light max-w-xl">
            Gentle pulses reveal living traditions, sacred places, and master crafts across humanity.
          </p>
        </div>

        {/* Region Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
          <button
            onClick={() => setRegionFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              regionFilter === "all"
                ? "bg-terracotta text-white shadow-xs font-medium"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            All World
          </button>
          <button
            onClick={() => setRegionFilter("asia")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              regionFilter === "asia"
                ? "bg-terracotta text-white shadow-xs font-medium"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            Asia & India
          </button>
          <button
            onClick={() => setRegionFilter("africa_med")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              regionFilter === "africa_med"
                ? "bg-terracotta text-white shadow-xs font-medium"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            Morocco & Med
          </button>
          <button
            onClick={() => setRegionFilter("americas")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              regionFilter === "americas"
                ? "bg-terracotta text-white shadow-xs font-medium"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            Americas
          </button>
        </div>
      </div>

      {/* 2. Map Canvas Stage */}
      <div className="relative w-full h-[460px] sm:h-[560px] lg:h-[620px] bg-[radial-gradient(ellipse_at_center,_#1c1917_0%,_#0c0a09_70%,_#000000_100%)] overflow-hidden select-none">
        {/* Subtle Latitude/Longitude Grid Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="world-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-sand/40" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#world-grid)" />
          {/* Equator & Prime Meridian Highlights */}
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(217, 119, 6, 0.25)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(217, 119, 6, 0.25)" strokeWidth="1" strokeDasharray="4 4" />
        </svg>

        {/* Stylized Continents Silhouettes */}
        <svg
          viewBox="0 0 1000 500"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30 text-stone-700"
        >
          {/* North America */}
          <path
            d="M 120 70 Q 180 50 250 80 Q 290 120 260 180 Q 230 230 200 240 Q 170 210 130 180 Q 90 130 120 70 Z"
            fill="currentColor"
          />
          {/* Central & South America */}
          <path
            d="M 210 240 Q 270 270 300 320 Q 320 380 290 440 Q 260 460 240 400 Q 220 330 200 270 Z"
            fill="currentColor"
          />
          {/* Europe */}
          <path
            d="M 470 90 Q 550 80 580 130 Q 560 170 510 180 Q 460 170 450 130 Z"
            fill="currentColor"
          />
          {/* Africa */}
          <path
            d="M 460 180 Q 560 180 580 240 Q 570 330 520 390 Q 470 380 440 290 Q 430 220 460 180 Z"
            fill="currentColor"
          />
          {/* Asia & India */}
          <path
            d="M 580 90 Q 750 70 850 140 Q 860 230 780 270 Q 710 250 680 300 Q 640 280 640 220 Q 590 180 580 90 Z"
            fill="currentColor"
          />
          {/* Indian Subcontinent Peninsula */}
          <path
            d="M 660 210 Q 710 230 700 290 Q 670 310 650 260 Z"
            fill="currentColor"
          />
          {/* Japan Arch */}
          <path
            d="M 830 170 Q 860 190 850 230 Q 830 220 830 170 Z"
            fill="currentColor"
          />
          {/* Southeast Asia & Indonesia archipelago */}
          <path
            d="M 740 280 Q 810 300 830 350 Q 780 360 740 310 Z"
            fill="currentColor"
          />
          {/* Australia */}
          <path
            d="M 810 360 Q 900 360 910 420 Q 850 460 800 420 Z"
            fill="currentColor"
          />
        </svg>

        {/* Ambient Arcs between Cultural Corridors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {CULTURAL_CORRIDORS.map((c, i) => {
            const isConnectedToActive =
              c.from.id === activeSpot.id || c.to.id === activeSpot.id;
            return (
              <motion.line
                key={`corr-${i}`}
                x1={`${c.from.x}%`}
                y1={`${c.from.y}%`}
                x2={`${c.to.x}%`}
                y2={`${c.to.y}%`}
                stroke={isConnectedToActive ? "oklch(0.585 0.077 45 / 0.75)" : "oklch(0.93 0.018 90 / 0.15)"}
                strokeWidth={isConnectedToActive ? "1.8" : "0.75"}
                strokeDasharray={isConnectedToActive ? "6 3" : "3 4"}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            );
          })}
        </svg>

        {/* Cultural Hotspot Markers */}
        <div className="absolute inset-0 w-full h-full">
          {filteredSpots.map((spot) => {
            const isSelected = spot.id === activeSpot.id;
            return (
              <div
                key={spot.id}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                {/* Marker Button */}
                <button
                  type="button"
                  onClick={() => selectSpot(spot.id)}
                  aria-label={`Explore ${spot.name}, ${spot.country}`}
                  aria-pressed={isSelected}
                  className="group relative flex items-center justify-center p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded-full cursor-pointer"
                >
                  {/* Subtle Expanding Ripple on Active Marker */}
                  {isSelected && (
                    <span className="absolute size-9 rounded-full bg-saffron/25 animate-ping pointer-events-none" />
                  )}

                  {/* Outer Glow Halo */}
                  <span
                    className={`size-6 sm:size-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? "bg-terracotta text-white shadow-lg scale-110 border-2 border-amber-200"
                        : "bg-neutral-900/90 hover:bg-neutral-800 text-amber-200/80 hover:text-white border border-white/30"
                    }`}
                  >
                    <span className={`size-2 rounded-full ${isSelected ? "bg-white" : "bg-saffron group-hover:scale-125 transition-transform"}`} />
                  </span>

                  {/* Floating Pill on Hover or Select */}
                  <span
                    className={`absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all duration-200 pointer-events-none ${
                      isSelected
                        ? "opacity-100 translate-y-0 bg-neutral-900/95 text-amber-200 border border-amber-300/40 shadow-sm"
                        : "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 bg-black/80 text-white/90 border border-white/20"
                    }`}
                  >
                    {spot.name.split("·")[0]?.split("&")[0]?.trim()}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* 3. Interactive Discovery Loop Card (Floating Overlay) */}
        <div className="absolute left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md bottom-4 sm:bottom-6 z-30">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSpot.id}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="rounded-2xl border border-white/20 bg-neutral-950/92 backdrop-blur-xl p-4 sm:p-5 shadow-2xl text-white space-y-3.5"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-saffron font-semibold">
                      {activeSpot.category}
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-[10px] font-mono text-white/70">
                      {activeSpot.country}
                    </span>
                  </div>
                  <h3 className="font-display font-serif text-lg sm:text-xl font-normal text-white leading-snug">
                    {activeSpot.name}
                  </h3>
                </div>

                {/* Thumbnail Image */}
                <div className="size-14 sm:size-16 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-xs">
                  <img
                    src={activeSpot.image}
                    alt={activeSpot.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Curiosity Question */}
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 flex items-start gap-2">
                <HelpCircle className="size-3.5 text-saffron shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-amber-100 leading-snug">
                  {activeSpot.curiosityQuestion}
                </p>
              </div>

              {/* Short 2-Sentence Context */}
              <p className="text-xs text-white/80 font-light leading-relaxed line-clamp-2 sm:line-clamp-3">
                {activeSpot.shortStory}
              </p>

              {/* Action Buttons */}
              <div className="pt-1 flex items-center justify-between gap-3">
                <Link to={activeSpot.route} className="flex-1">
                  <Button
                    size="sm"
                    className="w-full rounded-xl bg-terracotta hover:bg-terracotta/90 text-white font-medium text-[11px] font-mono tracking-wider uppercase gap-1.5 py-4 shadow-xs"
                  >
                    <span>Explore This Culture</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>

                <div className="flex items-center gap-1">
                  {CULTURAL_HOTSPOTS.map((s) => (
                    <button
                      key={`btn-pip-${s.id}`}
                      onClick={() => selectSpot(s.id)}
                      aria-label={`Switch to ${s.name}`}
                      className={`size-2 rounded-full transition-all ${
                        s.id === activeSpot.id ? "w-5 bg-saffron" : "bg-white/30 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
