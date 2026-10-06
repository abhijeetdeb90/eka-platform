import React, { useState, useMemo } from "react";
import {
  Compass,
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  Globe,
  Layers,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Info,
  Maximize2,
  ZoomIn,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "@tanstack/react-router";
import {
  COUNTRY_PROFILES,
  MAP_HOTSPOTS,
  EKA_REGIONS,
  CULTURAL_MAP_FILTER_OPTIONS,
  type CulturalMapFilterId,
  searchGlobalCulturalMap,
  type CountryCulturalProfile,
  type CulturalStoryItem,
  type MapHotspotMarker,
  type EkaRegion,
} from "@/lib/cultural-intelligence";

interface GlobalCulturalMapProps {
  onAskEka: (target: {
    title: string;
    location?: string;
    initialQuestion?: string;
    preloadedSummary?: string;
  }) => void;
  className?: string;
  compactMode?: boolean;
}

export function GlobalCulturalMap({
  onAskEka,
  className = "",
  compactMode = false,
}: GlobalCulturalMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<EkaRegion>("all");
  const [selectedFilter, setSelectedFilter] = useState<CulturalMapFilterId>("all");
  const [selectedCountryId, setSelectedCountryId] = useState<string>("india");
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>("spot-kolkata");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredHotspot, setHoveredHotspot] = useState<MapHotspotMarker | null>(null);
  const [isExpandedMapOpen, setIsExpandedMapOpen] = useState(false);

  // Search logic
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) return;
    const { matchedCountry, matchedStory, filteredHotspots } = searchGlobalCulturalMap(query);
    if (matchedCountry) {
      setSelectedCountryId(matchedCountry.id);
      setSelectedRegion(matchedCountry.region);
      if (matchedStory) {
        const spot = filteredHotspots.find((h) => h.storyId === matchedStory.id);
        setSelectedHotspotId(spot?.id ?? null);
      }
    }
  };

  const currentCountry = useMemo(() => {
    return (
      COUNTRY_PROFILES.find((c) => c.id === selectedCountryId) ||
      COUNTRY_PROFILES[0]!
    );
  }, [selectedCountryId]);

  const currentHotspot = useMemo(() => {
    return MAP_HOTSPOTS.find((h) => h.id === selectedHotspotId) || MAP_HOTSPOTS[0]!;
  }, [selectedHotspotId]);

  const filteredHotspots = useMemo(() => {
    return MAP_HOTSPOTS.filter((h) => {
      const regionMatches = selectedRegion === "all" || h.region === selectedRegion;
      const filterMatches =
        selectedFilter === "all" ||
        h.filterCategory === selectedFilter ||
        (selectedFilter === "festivals" && h.type === "festival") ||
        (selectedFilter === "traditions" && (h.type === "tradition" || h.type === "ritual")) ||
        (selectedFilter === "sacred_places" && h.type === "sacred_place") ||
        (selectedFilter === "craft" && h.type === "craft") ||
        (selectedFilter === "communities" && h.type === "community") ||
        (selectedFilter === "stories" && h.type === "story");
      return regionMatches && filterMatches;
    });
  }, [selectedRegion, selectedFilter]);

  const handleHotspotClick = (spot: MapHotspotMarker) => {
    setSelectedHotspotId(spot.id);
    setSelectedCountryId(spot.countryId);
    setSelectedRegion(spot.region);
  };

  const handleCountrySelect = (countryId: string) => {
    setSelectedCountryId(countryId);
    const country = COUNTRY_PROFILES.find((c) => c.id === countryId);
    if (country) {
      setSelectedRegion(country.region);
      const spot = MAP_HOTSPOTS.find((h) => h.countryId === countryId);
      setSelectedHotspotId(spot?.id ?? null);
    }
  };

  return (
    <div
      data-testid="eka-global-cultural-map"
      className={`relative rounded-3xl border border-border/80 bg-card overflow-hidden shadow-calm ${className}`}
    >
      {/* 1. Header & World Regions */}
      <div className="border-b border-border/60 bg-sand/15 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge
              variant="outline"
              className="border-primary/40 text-primary text-xs font-mono uppercase tracking-wider"
            >
              <Globe className="size-3 mr-1.5 inline" />
              The World's Cultural Intelligence Map · Free Cultural Library
            </Badge>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-foreground">
              Every place has a story. Every story connects to another.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              195+ countries · thousands of communities · languages · traditions · stories
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-72 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search country, culture or story…"
              className="rounded-full pl-9 pr-4 text-xs bg-background/90"
              data-testid="map-search-input"
            />
          </div>
        </div>

        {/* Region Filter Bar */}
        <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {EKA_REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRegion(r.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                selectedRegion === r.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border/70 bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
              data-testid={`region-btn-${r.id}`}
            >
              <span>{r.icon}</span>
              <span>{r.label}</span>
            </button>
          ))}
        </div>

        {/* 14 Cultural Knowledge Layers Filters */}
        <div className="mt-3 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {CULTURAL_MAP_FILTER_OPTIONS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFilter(f.id)}
              className={`rounded-full px-3 py-1 text-[11px] font-mono transition-all shrink-0 flex items-center gap-1 border ${
                selectedFilter === f.id
                  ? "border-terracotta bg-terracotta/10 text-terracotta font-semibold"
                  : "border-border/60 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
              data-testid={`filter-btn-${f.id}`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Hierarchical Navigation Breadcrumb: World → Region → Country → District → Knowledge Object */}
        <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground flex-wrap">
          <span className="text-foreground font-semibold">World</span>
          <ChevronRight className="size-3 text-muted-foreground/60" />
          <span className="capitalize">{selectedRegion === "all" ? "Planetary" : selectedRegion}</span>
          <ChevronRight className="size-3 text-muted-foreground/60" />
          <span className="text-foreground font-medium">{currentCountry.name}</span>
          {currentHotspot?.stateOrDistrict && (
            <>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <span>{currentHotspot.stateOrDistrict}</span>
            </>
          )}
          {currentHotspot && (
            <>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <span className="text-primary font-bold">{currentHotspot.name}</span>
            </>
          )}
        </div>
      </div>

      {/* 2. Interactive Map & Country Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        {/* Left / Center: Interactive World Map Graphic (7-8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 p-4 sm:p-6 bg-muted/20 relative flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/60">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span className="font-mono flex items-center gap-1.5">
              <Compass className="size-3.5 text-primary" />
              Click a cultural pin or select a country to explore
            </span>
            <span className="text-[11px] font-mono hidden sm:inline">
              Showing {filteredHotspots.length} living traditions
            </span>
          </div>

          {/* Creative World Map Canvas Container */}
          <div className="relative w-full aspect-[16/9] rounded-2xl border border-border/80 overflow-hidden shadow-2xl bg-slate-950 flex items-center justify-center group">
            {/* 1. Creative World Map Image Backdrop */}
            <img
              src="/places/creative-cultural-world-map.jpg"
              alt="EKA Global Cultural Intelligence Map"
              className="absolute inset-0 w-full h-full object-cover object-center select-none transition-transform duration-700 group-hover:scale-[1.01]"
              loading="eager"
            />

            {/* Subtle atmospheric vignette and tone mapping overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-background/25 pointer-events-none" />

            {/* Map Mode Badge & Inspect Action */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full bg-background/85 backdrop-blur-md px-3 py-1 border border-border/60 text-[10px] font-mono text-foreground/90 shadow-sm">
              <Sparkles className="size-3 text-saffron" />
              <span>Illuminated Cultural Cartography</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpandedMapOpen(true)}
              className="absolute top-3 right-3 z-20 h-7 rounded-full bg-background/85 backdrop-blur-md px-2.5 text-[10px] font-mono gap-1 border-border/70 hover:bg-background text-foreground/90 shadow-sm"
              title="Inspect high-resolution illustrated world map"
            >
              <Maximize2 className="size-3 text-primary" />
              <span className="hidden sm:inline">Inspect Map</span>
            </Button>

            {/* 2. Interactive SVG Pins & Hotspots Overlay */}
            <svg
              viewBox="0 0 1000 562.5"
              className="relative z-10 w-full h-full select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Radial Glow for Selected Pin */}
                <radialGradient id="hotspot-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#e07a5f" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#e07a5f" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#e07a5f" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="hotspot-ambient-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Cultural Hotspot Pins */}
              {filteredHotspots.map((spot) => {
                const posX = (spot.x / 100) * 1000;
                const posY = (spot.y / 100) * 562.5;
                const isSelected = selectedHotspotId === spot.id;
                const isHovered = hoveredHotspot?.id === spot.id;

                return (
                  <g
                    key={spot.id}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => handleHotspotClick(spot)}
                    onMouseEnter={() => setHoveredHotspot(spot)}
                    onMouseLeave={() => setHoveredHotspot(null)}
                  >
                    {/* Pulsing ring if selected or hovered */}
                    {(isSelected || isHovered) && (
                      <>
                        <circle
                          cx={posX}
                          cy={posY}
                          r={isSelected ? "32" : "22"}
                          fill="url(#hotspot-glow)"
                          className="animate-pulse"
                        />
                        <circle
                          cx={posX}
                          cy={posY}
                          r={isSelected ? "18" : "12"}
                          fill="none"
                          stroke="#e07a5f"
                          strokeWidth="1.5"
                          strokeDasharray="4 2"
                        />
                      </>
                    )}

                    {/* Ambient breathing ring for all pins */}
                    {!isSelected && (
                      <circle
                        cx={posX}
                        cy={posY}
                        r="14"
                        fill="url(#hotspot-ambient-glow)"
                        opacity="0.6"
                      />
                    )}

                    {/* Outer indicator circle */}
                    <circle
                      cx={posX}
                      cy={posY}
                      r={isSelected ? "9" : "6.5"}
                      fill={isSelected ? "#e07a5f" : "#d97706"}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? "2.5" : "1.8"}
                      className="filter drop-shadow(0 2px 4px rgba(0,0,0,0.7))"
                    />

                    {/* Inner core dot */}
                    <circle
                      cx={posX}
                      cy={posY}
                      r={isSelected ? "3" : "2"}
                      fill="#ffffff"
                    />

                    {/* Label Badge with dark semi-transparent pill backdrop for pristine readability */}
                    <g className="pointer-events-none">
                      <rect
                        x={posX - ((spot.name.split(" ")[0]?.length ?? 4) * 3.6 + 8)}
                        y={posY - 26}
                        width={(spot.name.split(" ")[0]?.length ?? 4) * 7.2 + 16}
                        height="16"
                        rx="8"
                        fill="rgba(15, 23, 42, 0.85)"
                        stroke={isSelected ? "#e07a5f" : "rgba(255, 255, 255, 0.25)"}
                        strokeWidth={isSelected ? "1.5" : "0.75"}
                        className="backdrop-blur-xs"
                      />
                      <text
                        x={posX}
                        y={posY - 14}
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize="9.5"
                        fontWeight={isSelected ? "700" : "500"}
                        letterSpacing="0.02em"
                      >
                        {spot.name.split(" ")[0]}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Hover tooltip */}
            {hoveredHotspot && (
              <div className="absolute top-12 left-4 bg-background/95 backdrop-blur-md border border-border/80 px-3.5 py-2.5 rounded-2xl shadow-xl pointer-events-none max-w-xs z-30 animate-in fade-in zoom-in-95 duration-150">
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="size-3 text-terracotta" />
                  {hoveredHotspot.name} · {hoveredHotspot.country}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {hoveredHotspot.wonderQuestion}
                </p>
                <div className="mt-1.5 flex items-center gap-1 text-[10px] font-mono text-primary font-medium">
                  <span>Click pin to view living traditions</span>
                  <ArrowRight className="size-2.5" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Country Pill Switcher at bottom of map */}
          <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground shrink-0 mr-1">
              Popular places:
            </span>
            {COUNTRY_PROFILES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCountrySelect(c.id)}
                className={`rounded-full px-2.5 py-1 text-xs transition-all shrink-0 flex items-center gap-1 ${
                  selectedCountryId === c.id
                    ? "bg-foreground text-background font-semibold"
                    : "bg-card border border-border/70 text-foreground hover:bg-accent"
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Country Cultural Panel (5-4 cols) */}
        <div
          data-testid="country-cultural-panel"
          className="lg:col-span-5 xl:col-span-4 p-6 sm:p-7 flex flex-col justify-between bg-card space-y-6"
        >
          {/* Country Intro Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-terracotta font-semibold">
                  {currentCountry.regionLabel}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-foreground flex items-center gap-2 mt-0.5">
                  <span>{currentCountry.flag}</span>
                  <span>{currentCountry.name}</span>
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onAskEka({
                    title: currentCountry.name,
                    location: currentCountry.regionLabel,
                    initialQuestion: `What should I understand before visiting ${currentCountry.name}?`,
                    preloadedSummary: currentCountry.intro,
                  })
                }
                className="rounded-full text-xs gap-1.5 shrink-0 border-primary/40 text-primary hover:bg-primary/5"
                title="Understand more with EKA AI"
              >
                <Sparkles className="size-3 text-saffron" />
                <span>Ask EKA</span>
                <Lock className="size-3 text-saffron" />
              </Button>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {currentCountry.intro}
            </p>

            {/* Quick Country Cultural Tags */}
            <div className="space-y-2 border-t border-b border-border/60 py-3 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground font-mono text-[11px] shrink-0 w-20">
                  Languages:
                </span>
                <span className="text-foreground font-medium">
                  {currentCountry.languages.slice(0, 4).join(", ")}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground font-mono text-[11px] shrink-0 w-20">
                  Communities:
                </span>
                <span className="text-foreground font-medium">
                  {currentCountry.communities.slice(0, 4).join(", ")}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground font-mono text-[11px] shrink-0 w-20">
                  Traditions:
                </span>
                <span className="text-foreground font-medium">
                  {currentCountry.traditions.slice(0, 3).join(", ")}
                </span>
              </div>
            </div>
          </div>

          {/* Cultural Stories for this country */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Stories from {currentCountry.name}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {currentCountry.stories.length} featured
              </span>
            </div>

            <div className="space-y-3">
              {currentCountry.stories.map((story) => (
                <div
                  key={story.id}
                  className="group rounded-2xl border border-border/70 bg-sand/10 p-3.5 hover:border-primary/60 hover:bg-card transition-all space-y-2.5"
                >
                  <div className="flex gap-3">
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="size-16 rounded-xl object-cover shrink-0 border border-border/50"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/content/hero.jpg";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono text-terracotta uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="size-2.5" />
                        {story.place}
                      </span>
                      <h4 className="font-serif text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {story.title}
                      </h4>
                      <p className="text-xs text-primary font-medium mt-0.5 line-clamp-1 italic">
                        "{story.wonderQuestion}"
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {story.summary}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        onAskEka({
                          title: story.title,
                          location: story.place,
                          initialQuestion: story.wonderQuestion,
                          preloadedSummary: story.summary,
                        })
                      }
                      className="h-7 text-xs px-2 text-primary hover:text-primary gap-1"
                      title="Understand more with EKA AI"
                    >
                      <Sparkles className="size-3 text-saffron" />
                      <span>Ask EKA</span>
                      <Lock className="size-2.5 text-saffron" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onAskEka({
                          title: story.title,
                          location: story.place,
                          initialQuestion: story.curiosityPrompt,
                          preloadedSummary: story.summary,
                        })
                      }
                      className="h-7 text-xs rounded-full gap-1"
                    >
                      <span>Explore story</span>
                      <ArrowRight className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Explore CTAs: Knowledge Object & Ask EKA */}
          <div className="border-t border-border/60 pt-4 space-y-2">
            {currentHotspot?.knowledgeSlug && (
              <Link
                to="/knowledge/$slug"
                params={{ slug: currentHotspot.knowledgeSlug }}
                className="block w-full"
              >
                <Button
                  variant="outline"
                  className="w-full rounded-full gap-2 text-xs border-primary/40 text-primary hover:bg-primary/5 font-medium cursor-pointer"
                >
                  <BookOpen className="size-3.5 text-primary" />
                  <span>Open Canonical Knowledge Object</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            )}

            <Button
              className="w-full rounded-full gap-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              onClick={() =>
                onAskEka({
                  title: currentHotspot ? currentHotspot.name : currentCountry.name,
                  location: currentHotspot?.stateOrDistrict || currentCountry.regionLabel,
                  initialQuestion: currentHotspot?.wonderQuestion || `Explain the living traditions of ${currentCountry.name}.`,
                  preloadedSummary: currentCountry.intro,
                })
              }
            >
              <Sparkles className="size-3.5 text-saffron" />
              <span>Ask EKA about {currentHotspot ? currentHotspot.name.split(" ")[0] : currentCountry.name}</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Inspecting the Creative World Map in High Resolution */}
      <Dialog open={isExpandedMapOpen} onOpenChange={setIsExpandedMapOpen}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 rounded-3xl border border-border/80 bg-background overflow-hidden shadow-2xl">
          <div className="relative border-b border-border/60 bg-sand/15 p-4 sm:p-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider text-primary font-semibold">
                  <Globe className="size-3 text-saffron" />
                  Illustrated Cultural Cartography
                </span>
                <span className="text-xs text-muted-foreground">• National Geographic × Living Heritage</span>
              </div>
              <DialogTitle className="font-serif text-xl sm:text-2xl text-foreground font-normal">
                The World's Cultural Intelligence Map
              </DialogTitle>
            </div>
          </div>

          <div className="relative p-2 sm:p-4 bg-slate-950 max-h-[75vh] overflow-auto flex items-center justify-center">
            <img
              src="/places/creative-cultural-world-map.jpg"
              alt="High-resolution EKA Cultural Intelligence World Map"
              className="w-full h-auto rounded-xl shadow-2xl object-contain select-none"
            />
          </div>

          <div className="p-4 sm:p-6 bg-card border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>
              Featuring indigenous architecture, sacred rivers, celestial meridians, and thousands of living community lineages across unbroken millennia.
            </p>
            <Button
              size="sm"
              onClick={() => setIsExpandedMapOpen(false)}
              className="rounded-full text-xs shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Back to Explorer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
