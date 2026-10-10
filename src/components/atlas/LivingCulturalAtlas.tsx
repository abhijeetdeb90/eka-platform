// ==============================================================================
// EKA LIVING CULTURAL ATLAS — FLAGSHIP WORLD MAP EXPERIENCE
// ==============================================================================
// "See -> Discover -> Understand -> Explore -> Connect"
// National Geographic editorial cartography x Modern digital atlas x EKA Design Identity.
// Replaces dark SaaS dashboard with warm parchment, verified cultural signals,
// intelligent geographic clusters, India-first hierarchy, and rich story modes.
// ==============================================================================

import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  Globe,
  Plus,
  Minus,
  RotateCcw,
  BookOpen,
  List,
  Eye,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  ExternalLink,
  ShieldCheck,
  Flame,
  Landmark,
  Hammer,
  UtensilsCrossed,
  Scroll,
  Music,
  Shield,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ATLAS_VIEWBOX_PRESETS,
  projectLngLat,
  type MapRegionPreset,
} from "./world-map-paths";
import { NATURAL_EARTH_COUNTRIES } from "./natural-earth-data";
import {
  ATLAS_CATEGORIES,
  ATLAS_CULTURAL_OBJECTS,
  ATLAS_CLUSTERS,
  type AtlasCategory,
  type AtlasRegion,
  type AtlasCulturalObject,
  type AtlasCluster,
} from "@/lib/cultural-intelligence/cultural-atlas-data";
import { AtlasStoryDrawer } from "./AtlasStoryDrawer";
import { cn } from "@/lib/utils";

export interface LivingCulturalAtlasProps {
  className?: string;
  initialRegion?: AtlasRegion;
  initialCategory?: AtlasCategory | "all";
  onAskEka?: (target: {
    title: string;
    location?: string;
    category?: string;
    initialQuestion?: string;
    preloadedSummary?: string;
  }) => void;
  showEditorialBanner?: boolean;
}

export function LivingCulturalAtlas({
  className = "",
  initialRegion = "all",
  initialCategory = "all",
  onAskEka,
  showEditorialBanner = true,
}: LivingCulturalAtlasProps) {
  // Navigation & Filter State
  const [currentRegion, setCurrentRegion] = useState<AtlasRegion>(initialRegion);
  const [selectedSubregionId, setSelectedSubregionId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AtlasCategory | "all">(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  // Selection & Modal State
  const [selectedObjectId, setSelectedObjectId] = useState<string>("obj-jaipur-blue-pottery");
  const [hoveredObjectId, setHoveredObjectId] = useState<string | null>(null);
  const [isStoryDrawerOpen, setIsStoryDrawerOpen] = useState(false);
  const [isFeaturedCardMinimized, setIsFeaturedCardMinimized] = useState(false);

  // Active Selected Object
  const selectedObject = useMemo(() => {
    return (
      ATLAS_CULTURAL_OBJECTS.find((o) => o.id === selectedObjectId) ||
      ATLAS_CULTURAL_OBJECTS[0]!
    );
  }, [selectedObjectId]);

  // Current ViewBox Computation
  const currentViewBox = useMemo(() => {
    const regionPreset = ATLAS_VIEWBOX_PRESETS[currentRegion] || ATLAS_VIEWBOX_PRESETS.world!;
    if (currentRegion === "india" && selectedSubregionId) {
      const sub = regionPreset.subregions?.find((s) => s.id === selectedSubregionId);
      if (sub) return sub.viewBox;
    }
    return regionPreset.viewBox;
  }, [currentRegion, selectedSubregionId]);

  // Filtered Cultural Objects
  const filteredObjects = useMemo(() => {
    return ATLAS_CULTURAL_OBJECTS.filter((obj) => {
      const matchesRegion =
        currentRegion === "all" ? true : obj.region === currentRegion;
      const matchesCategory =
        selectedCategory === "all" ? true : obj.category === selectedCategory;
      const matchesQuery =
        !searchQuery.trim()
          ? true
          : obj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            obj.stateOrDistrict.toLowerCase().includes(searchQuery.toLowerCase()) ||
            obj.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
            obj.oneLiner.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRegion && matchesCategory && matchesQuery;
    });
  }, [currentRegion, selectedCategory, searchQuery]);

  // Relevant Clusters for the Current Region (shown only on World view to keep map clean)
  const visibleClusters = useMemo(() => {
    if (currentRegion !== "all") return [];
    return ATLAS_CLUSTERS;
  }, [currentRegion]);

  // Region Selection Handler
  const handleSelectRegion = (region: AtlasRegion) => {
    setCurrentRegion(region);
    setSelectedSubregionId(null);
    const firstInRegion = ATLAS_CULTURAL_OBJECTS.find(
      (o) => region === "all" || o.region === region
    );
    if (firstInRegion) {
      setSelectedObjectId(firstInRegion.id);
    }
  };

  // Cluster Click -> Zoom in
  const handleClusterClick = (cluster: AtlasCluster) => {
    if (cluster.region === "india") {
      setCurrentRegion("india");
    } else {
      setCurrentRegion(cluster.region);
    }
    if (cluster.objectIds[0]) {
      setSelectedObjectId(cluster.objectIds[0]);
    }
  };

  // Object Selection Handler
  const handleSelectObject = (objectId: string) => {
    setSelectedObjectId(objectId);
    const obj = ATLAS_CULTURAL_OBJECTS.find((o) => o.id === objectId);
    if (obj) {
      if (currentRegion !== "all" && obj.region !== currentRegion) {
        setCurrentRegion(obj.region);
      }
    }
  };

  // Category Icon Renderer
  const renderCategoryIcon = (category: AtlasCategory, iconClass: string = "size-3.5") => {
    switch (category) {
      case "sacred_places":
        return <Landmark className={iconClass} />;
      case "traditions":
        return <Flame className={iconClass} />;
      case "crafts":
        return <Hammer className={iconClass} />;
      case "food":
        return <UtensilsCrossed className={iconClass} />;
      case "language":
        return <Scroll className={iconClass} />;
      case "music":
        return <Music className={iconClass} />;
      case "heritage":
        return <Shield className={iconClass} />;
      case "local_life":
        return <Users className={iconClass} />;
      default:
        return <Compass className={iconClass} />;
    }
  };

  return (
    <div
      data-testid="eka-living-cultural-atlas"
      className={cn(
        "relative rounded-3xl border border-border/80 bg-card overflow-hidden shadow-calm text-foreground font-sans",
        className
      )}
    >
      {/* ==================================================================== */}
      {/* 1. EDITORIAL HEADER & HUMAN DISCOVERY INVITATION                    */}
      {/* ==================================================================== */}
      {showEditorialBanner && (
        <div className="border-b border-border/60 bg-sand/20 dark:bg-stone-900/40 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-terracotta animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest text-terracotta font-semibold">
                  EXPLORE THE LIVING WORLD · LIVING CULTURAL ATLAS
                </span>
                <span className="text-muted-foreground/60 hidden sm:inline">•</span>
                <span className="text-xs text-muted-foreground italic hidden sm:inline">
                  See → Discover → Understand → Connect
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-foreground">
                The world is full of living stories. EKA helps you understand them.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl font-light leading-relaxed">
                Cartographic discovery across sacred geography, master artisan guilds, oral epics,
                and ancestral foodways. Every marker links to verified human keepers and living traditions.
              </p>
            </div>

            {/* Quick Search & View Toggle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search craft, place, or tradition…"
                  className="rounded-full pl-9 pr-4 text-xs bg-background/90 h-9"
                  aria-label="Search cultural atlas"
                />
              </div>

              <div className="flex items-center rounded-full border border-border/70 bg-background/80 p-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode("map")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono font-medium transition-all cursor-pointer",
                    viewMode === "map"
                      ? "bg-terracotta text-white shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label="Switch to interactive map view"
                >
                  <Compass className="size-3" />
                  <span>Atlas Map</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono font-medium transition-all cursor-pointer",
                    viewMode === "list"
                      ? "bg-terracotta text-white shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label="Switch to accessible cultural directory"
                >
                  <List className="size-3" />
                  <span>Directory</span>
                </button>
              </div>
            </div>
          </div>

          {/* ==================================================================== */}
          {/* 2. REGIONAL EXPLORATION NAVIGATION                                   */}
          {/* ==================================================================== */}
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/40 pt-4 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(
                [
                  { id: "all", label: "World", flag: "🌍" },
                  { id: "india", label: "India", flag: "🇮🇳" },
                  { id: "asia", label: "Asia", flag: "⛩️" },
                  { id: "middle_east", label: "Middle East", flag: "🕌" },
                  { id: "africa", label: "Africa", flag: "🌍" },
                  { id: "europe", label: "Europe", flag: "🏛️" },
                  { id: "americas", label: "Americas", flag: "🌽" },
                ] as const
              ).map((r) => {
                const isActive = currentRegion === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelectRegion(r.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all shrink-0 cursor-pointer",
                      isActive
                        ? "bg-foreground text-background shadow-xs font-semibold"
                        : "border border-border/70 bg-background/80 text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    )}
                  >
                    <span>{r.flag}</span>
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>

            {/* India Subregion Dropdown if India active */}
            {currentRegion === "india" && (
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                <span className="font-semibold text-terracotta">India Zoom:</span>
                <button
                  type="button"
                  onClick={() => setSelectedSubregionId(null)}
                  className={cn(
                    "px-2 py-1 rounded-md text-[11px] transition-colors cursor-pointer",
                    selectedSubregionId === null
                      ? "bg-terracotta/15 text-terracotta font-semibold"
                      : "hover:bg-accent text-muted-foreground"
                  )}
                >
                  Subcontinent Overview
                </button>
                {ATLAS_VIEWBOX_PRESETS.india?.subregions?.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubregionId(sub.id)}
                    className={cn(
                      "px-2 py-1 rounded-md text-[11px] transition-colors cursor-pointer hidden md:inline",
                      selectedSubregionId === sub.id
                        ? "bg-terracotta/15 text-terracotta font-semibold"
                        : "hover:bg-accent text-muted-foreground"
                    )}
                  >
                    {sub.name.split("&")[0]?.trim()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ==================================================================== */}
          {/* 3. HORIZONTAL DISCOVERY CATEGORY CAROUSEL                            */}
          {/* ==================================================================== */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-mono transition-all shrink-0 flex items-center gap-1.5 border cursor-pointer",
                selectedCategory === "all"
                  ? "border-terracotta bg-terracotta text-white font-semibold shadow-2xs"
                  : "border-border/70 bg-card/70 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              )}
            >
              <Compass className="size-3" />
              <span>All Living Culture ({ATLAS_CULTURAL_OBJECTS.length})</span>
            </button>

            {ATLAS_CATEGORIES.map((cat) => {
              const count = ATLAS_CULTURAL_OBJECTS.filter((o) => o.category === cat.id).length;
              const isCatActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-mono transition-all shrink-0 flex items-center gap-1.5 border cursor-pointer",
                    isCatActive
                      ? "border-terracotta bg-terracotta/15 text-terracotta font-semibold"
                      : "border-border/60 bg-card/60 text-muted-foreground hover:border-terracotta/40 hover:text-foreground"
                  )}
                >
                  {renderCategoryIcon(cat.id, "size-3")}
                  <span>{cat.shortLabel}</span>
                  <span className="opacity-60 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. MAIN ATLAS WORKSPACE — INTERACTIVE MAP CANVAS                     */}
      {/* ==================================================================== */}
      {viewMode === "map" ? (
        <div className="relative w-full aspect-[16/9] min-h-[480px] sm:min-h-[580px] lg:min-h-[640px] bg-[#EDE7DA] dark:bg-[#12161E] overflow-hidden select-none">
          {/* Subtle Cartographic Sea Wash & Coordinate Grid */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 500"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="sea-graticule-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(194, 94, 62, 0.08)" strokeWidth="0.4" className="dark:stroke-white/5" />
              </pattern>
            </defs>

            {/* Base Sea Rect */}
            <rect width="1000" height="500" fill="#EDE7DA" className="dark:fill-[#12161E]" />
            <rect width="1000" height="500" fill="url(#sea-graticule-grid)" />

            {/* Major Cartographic Parallels */}
            <line x1="0" y1="257.5" x2="1000" y2="257.5" stroke="#C25E3E" strokeWidth="0.75" strokeDasharray="6 4" opacity="0.35" />
            <line x1="0" y1="186.3" x2="1000" y2="186.3" stroke="#9E472A" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.25" />
            <line x1="0" y1="328.7" x2="1000" y2="328.7" stroke="#9E472A" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.25" />
            <line x1="500" y1="0" x2="500" y2="500" stroke="#9E472A" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.2" />

            <text x="20" y="254" fill="#C25E3E" opacity="0.45" fontSize="7.5" fontFamily="monospace" letterSpacing="0.15em">
              EQUATOR · 0°
            </text>
            <text x="20" y="183" fill="#9E472A" opacity="0.4" fontSize="7" fontFamily="monospace" letterSpacing="0.12em">
              TROPIC OF CANCER · 23.5° N
            </text>
          </svg>

          {/* ==================================================================== */}
          {/* MAP CANVAS: SMOOTH DYNAMIC VIEWBOX CARTOGRAPHY                       */}
          {/* ==================================================================== */}
          <svg
            viewBox={currentViewBox}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 w-full h-full transition-all duration-700 ease-out"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 1. Natural Earth Country Landmasses */}
            <g className="natural-earth-landmasses">
              {NATURAL_EARTH_COUNTRIES.map((c) => {
                const isIndia = c.name === "India";
                return (
                  <path
                    key={c.code}
                    d={c.d}
                    fill={isIndia ? "#EAE3D2" : "#F1ECE1"}
                    stroke="#D5CDBE"
                    strokeWidth={isIndia ? "1.2" : "0.75"}
                    strokeLinejoin="round"
                    className={cn(
                      "transition-colors duration-500",
                      isIndia
                        ? "hover:fill-[#E4DBC5] dark:fill-[#252E3C] dark:stroke-[#3E4D63]"
                        : "hover:fill-[#EAE5D9] dark:fill-[#1C232E] dark:stroke-[#2E3B4E]"
                    )}
                  />
                );
              })}
            </g>

            {/* 2. Regional Cultural Clusters (Shown on World view) */}
            {visibleClusters.map((cluster) => {
              const px = (cluster.x / 100) * 1000;
              const py = (cluster.y / 100) * 500;
              return (
                <g
                  key={cluster.id}
                  className="cursor-pointer group"
                  onClick={() => handleClusterClick(cluster)}
                >
                  <circle
                    cx={px}
                    cy={py}
                    r="18"
                    fill="#C25E3E"
                    fillOpacity="0.14"
                    className="animate-pulse"
                  />
                  <circle
                    cx={px}
                    cy={py}
                    r="11"
                    fill="#C25E3E"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="drop-shadow-xs transition-transform duration-300 group-hover:scale-110"
                  />
                  <text
                    x={px}
                    y={py + 3.5}
                    fill="#FFFFFF"
                    fontSize="8"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {cluster.storyCount}
                  </text>
                  {/* Tooltip on hover */}
                  <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <rect
                      x={px - 36}
                      y={py - 24}
                      width="72"
                      height="15"
                      rx="7.5"
                      fill="#1C1917"
                      fillOpacity="0.92"
                    />
                    <text
                      x={px}
                      y={py - 14}
                      fill="#FFFFFF"
                      fontSize="6.5"
                      fontFamily="sans-serif"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {cluster.stateOrDistrict.split("&")[0]?.trim()}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* 3. Individual Cultural Discovery Objects */}
            {filteredObjects.map((obj) => {
              let px: number, py: number;
              if (obj.coordinates.lat !== undefined && obj.coordinates.lng !== undefined) {
                [px, py] = projectLngLat(obj.coordinates.lng, obj.coordinates.lat);
              } else {
                px = (obj.coordinates.x / 100) * 1000;
                py = (obj.coordinates.y / 100) * 500;
              }

              const isSelected = selectedObjectId === obj.id;
              const isHovered = hoveredObjectId === obj.id;
              const categoryMeta =
                ATLAS_CATEGORIES.find((c) => c.id === obj.category) || ATLAS_CATEGORIES[0]!;

              return (
                <g
                  key={obj.id}
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => handleSelectObject(obj.id)}
                  onMouseEnter={() => setHoveredObjectId(obj.id)}
                  onMouseLeave={() => setHoveredObjectId(null)}
                >
                  {/* Radiant Active Indicator */}
                  {isSelected && (
                    <>
                      <circle
                        cx={px}
                        cy={py}
                        r="16"
                        fill={categoryMeta.accentColor}
                        fillOpacity="0.25"
                        className="animate-pulse"
                      />
                      <circle
                        cx={px}
                        cy={py}
                        r="10"
                        fill="none"
                        stroke={categoryMeta.accentColor}
                        strokeWidth="1.2"
                        strokeDasharray="3 2"
                      />
                    </>
                  )}

                  {/* Marker Pin Base */}
                  <circle
                    cx={px}
                    cy={py}
                    r={isSelected ? "6.5" : isHovered ? "5.5" : "4.8"}
                    fill={isSelected ? categoryMeta.accentColor : "#1E2A38"}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? "2" : "1.5"}
                    className="drop-shadow-xs transition-transform duration-300"
                  />

                  {/* Center Core Beacon */}
                  <circle
                    cx={px}
                    cy={py}
                    r={isSelected ? "2.2" : "1.6"}
                    fill={isSelected ? "#FFFFFF" : categoryMeta.accentColor}
                  />

                  {/* Floating Location Tooltip on Hover or Select */}
                  {(isSelected || isHovered) && (
                    <foreignObject
                      x={px - 60}
                      y={py - 45}
                      width="120"
                      height="40"
                      className="pointer-events-none transition-all duration-300 overflow-visible"
                    >
                      <div className="flex flex-col bg-[#1C1917]/95 rounded-md border border-[#FFFFFF]/20 p-1.5 shadow-xl w-full h-full justify-center pointer-events-auto">
                        <span className="text-[#FFFFFF] text-[5px] font-bold leading-tight truncate">
                          {obj.title.split("A")[0]?.split("&")[0]?.trim()}
                        </span>
                        <span className="text-muted-foreground text-[4px] leading-tight line-clamp-2 mt-0.5 whitespace-normal">
                          {obj.oneLiner || (obj as any).summary}
                        </span>
                        <a 
                          href={`/knowledge/${obj.slug}`}
                          onClick={(e) => { e.stopPropagation(); }}
                          className="text-[#C25E3E] hover:text-[#D97757] text-[4.5px] font-semibold mt-1 inline-flex items-center gap-0.5"
                        >
                          View Details <ArrowUpRight className="w-[4px] h-[4px]" />
                        </a>
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </svg>

          {/* ==================================================================== */}
          {/* 5. EDITORIAL BOTTOM-LEFT STORY CARD (COMPACT & DISMISSIBLE)          */}
          {/* ==================================================================== */}
          {selectedObject && (
            <div
              className={cn(
                "absolute left-4 bottom-4 sm:left-6 sm:bottom-6 z-30 w-[calc(100%-2rem)] sm:w-96 transition-all duration-300",
                isFeaturedCardMinimized ? "translate-y-2" : "translate-y-0"
              )}
            >
              <div className="rounded-2xl border border-border/80 bg-background/95 dark:bg-card/95 backdrop-blur-xl p-4 sm:p-5 shadow-2xl space-y-3">
                {/* Header: Category + Location + Minimize toggle */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-terracotta font-semibold">
                        {selectedObject.category.replace("_", " ")}
                      </span>
                      <span className="text-muted-foreground/60">•</span>
                      <span className="text-[10.5px] font-medium text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-3 text-terracotta shrink-0" />
                        <span>{selectedObject.stateOrDistrict}, {selectedObject.country}</span>
                      </span>
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-foreground leading-snug">
                      {selectedObject.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsFeaturedCardMinimized(!isFeaturedCardMinimized)}
                    aria-label={isFeaturedCardMinimized ? "Expand card" : "Minimize card"}
                    className="size-6 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    {isFeaturedCardMinimized ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </button>
                </div>

                {/* Body (Hidden if minimized) */}
                {!isFeaturedCardMinimized && (
                  <>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed line-clamp-2">
                      {selectedObject.oneLiner}
                    </p>

                    {/* Actions: Explore Story + Ask EKA */}
                    <div className="pt-1 flex items-center justify-between gap-2">
                      <Button
                        size="sm"
                        onClick={() => setIsStoryDrawerOpen(true)}
                        className="rounded-full text-xs h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shadow-xs cursor-pointer"
                      >
                        <BookOpen className="size-3" />
                        <span>Explore Story</span>
                        <ArrowRight className="size-3" />
                      </Button>

                      {onAskEka && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onAskEka({
                              title: selectedObject.title,
                              location: `${selectedObject.stateOrDistrict}, ${selectedObject.country}`,
                              category: selectedObject.category,
                              initialQuestion: selectedObject.curiosityQuestion,
                              preloadedSummary: selectedObject.storySummary,
                            })
                          }
                          className="rounded-full text-xs h-8 px-3 border-terracotta/40 hover:bg-terracotta/10 text-terracotta gap-1 cursor-pointer"
                          title="Ask EKA about this place"
                        >
                          <Sparkles className="size-3" />
                          <span className="hidden sm:inline">Ask EKA</span>
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ==================================================================== */}
          {/* 6. CORNER CONTROLS: ZOOM & RESET                                    */}
          {/* ==================================================================== */}
          <div className="absolute top-4 right-4 z-20 flex flex-col items-center gap-1.5 bg-background/85 dark:bg-card/85 backdrop-blur-md p-1 rounded-2xl border border-border/70 shadow-xs">
            <button
              type="button"
              onClick={() => handleSelectRegion(currentRegion === "india" ? "all" : "india")}
              title={currentRegion === "india" ? "Zoom out to World" : "Zoom into India"}
              className="size-7 rounded-xl hover:bg-accent text-foreground flex items-center justify-center text-xs transition-colors cursor-pointer"
              aria-label="Toggle India focus"
            >
              🇮🇳
            </button>
            <button
              type="button"
              onClick={() => handleSelectRegion("all")}
              title="Reset to World View"
              className="size-7 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Reset zoom"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* ==================================================================== */
        /* 5. ACCESSIBLE STRUCTURED DIRECTORY (NON-MAP VIEW FOR ACCESSIBILITY)  */
        /* ==================================================================== */
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <p className="text-xs font-mono text-muted-foreground">
              Showing {filteredObjects.length} cultural objects in {currentRegion.toUpperCase()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredObjects.map((obj) => {
              const cat = ATLAS_CATEGORIES.find((c) => c.id === obj.category) || ATLAS_CATEGORIES[0]!;
              return (
                <div
                  key={obj.id}
                  className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 space-y-3 hover:border-primary/50 transition-all shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {cat.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-3 text-terracotta" />
                        {obj.country}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-foreground">
                      {obj.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {obj.oneLiner}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-border/40">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedObjectId(obj.id);
                        setIsStoryDrawerOpen(true);
                      }}
                      className="rounded-full text-xs h-7 px-3 text-terracotta hover:bg-terracotta/10"
                    >
                      <span>Explore</span>
                      <ArrowRight className="size-3 ml-1" />
                    </Button>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {obj.livingStatus.unbrokenYears}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. EDITORIAL STORY DRAWER (MAP -> STORY TRANSITION)                  */}
      {/* ==================================================================== */}
      <AtlasStoryDrawer
        object={selectedObject}
        isOpen={isStoryDrawerOpen}
        onClose={() => setIsStoryDrawerOpen(false)}
        onAskEka={onAskEka}
      />
    </div>
  );
}
