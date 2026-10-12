// ==============================================================================
// EKA BETA DISCOVER PAGE: HIERARCHICAL CULTURAL EXPLORATION
// ==============================================================================
// 1. Categorization first by Country / State, followed by sub-categories
// 2. Dynamic in-page exploration experience (no prompt resets)
// 3. High-resolution matched imagery & factual cultural documentation
// 4. In-place related cultural questions & answers
// ==============================================================================

import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  ArrowRight,
  HelpCircle,
  Search,
  Filter,
  ChevronRight,
  Globe,
  Sparkles,
  Layers,
  ChevronDown,
  X,
  Compass,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BETA_PLACES_OR_PRACTICES,
  BETA_ASK_QUESTIONS,
  type PlaceOrPractice,
} from "@/data/beta-seed-data";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Explore Places & Practices — EKA" },
      {
        name: "description",
        content:
          "Curated discovery of public cultural traditions, crafts, and landmarks categorized by country, state, and living tradition.",
      },
    ],
  }),
  component: DiscoverPage,
});

function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Places" | "Practices" | "Crafts">("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("All");

  // Selected item for dynamic in-page detail modal
  const [selectedItem, setSelectedItem] = useState<PlaceOrPractice | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Extract unique countries
  const countries = useMemo(() => {
    const set = new Set(BETA_PLACES_OR_PRACTICES.map((item) => item.country));
    return ["All", ...Array.from(set)];
  }, []);

  // Extract unique regions/states depending on selected country
  const regionsForCountry = useMemo(() => {
    const filtered = selectedCountry === "All"
      ? BETA_PLACES_OR_PRACTICES
      : BETA_PLACES_OR_PRACTICES.filter((item) => item.country === selectedCountry);
    const set = new Set(filtered.map((item) => item.regionOrState));
    return ["All", ...Array.from(set)];
  }, [selectedCountry]);

  // Extract unique subcategories
  const subCategories = useMemo(() => {
    const set = new Set(
      BETA_PLACES_OR_PRACTICES.map((item) => item.subCategory).filter(Boolean) as string[]
    );
    return ["All", ...Array.from(set)];
  }, []);

  // Filter items based on active criteria
  const filteredItems = useMemo(() => {
    return BETA_PLACES_OR_PRACTICES.filter((item) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          item.title.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.regionOrState.toLowerCase().includes(q) ||
          item.country.toLowerCase().includes(q) ||
          (item.subCategory && item.subCategory.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // Country filter
      if (selectedCountry !== "All" && item.country !== selectedCountry) {
        return false;
      }

      // Region/State filter
      if (selectedRegion !== "All" && item.regionOrState !== selectedRegion) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }

      // Sub-category filter
      if (selectedSubCategory !== "All" && item.subCategory !== selectedSubCategory) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCountry, selectedRegion, selectedCategory, selectedSubCategory]);

  // Questions related to the currently viewed item
  const relatedQuestions = useMemo(() => {
    if (!selectedItem) return [];
    return BETA_ASK_QUESTIONS.filter(
      (q) => selectedItem.relatedQuestionIds.includes(q.id) || q.relatedItemSlug === selectedItem.slug
    );
  }, [selectedItem]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#C45C26]/20">
      <SiteHeader />

      <main className="flex-1 py-8 sm:py-14 px-4 sm:px-6">
        <div className="mx-auto max-w-[1120px]">
          
          {/* Header */}
          <div className="mb-6 sm:mb-8 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C45C26] font-semibold">
              Curated Cultural Geography
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A1A] mt-1.5">
              Explore places & practices
            </h1>
            <p className="text-sm sm:text-base text-[#5C5C5C] mt-2 leading-relaxed">
              Discover living cultural traditions, architectural landmarks, and craftsmanship organized by country, state, and heritage category.
            </p>
          </div>

          {/* Search & Hierarchical Filter Controls */}
          <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-6 mb-8 shadow-xs space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#5C5C5C] pointer-events-none" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by place, state, craft, or tradition (e.g. Kerala, Meghalaya, bronze mirror...)"
                className="h-11 pl-10 pr-9 rounded-xl border-[#E8E2D9] bg-[#FAF7F2]/60 text-sm placeholder:text-[#5C5C5C]/70 focus-visible:ring-1 focus-visible:ring-[#C45C26]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5C5C5C] hover:text-[#1A1A1A]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Hierarchical Filter Rows */}
            <div className="space-y-3 pt-1 border-t border-[#E8E2D9]/70">
              
              {/* Level 1: Country Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#5C5C5C] flex items-center gap-1.5 shrink-0 mr-1">
                  <Globe className="size-3.5 text-[#C45C26]" />
                  Country:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {countries.map((country) => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => {
                        setSelectedCountry(country);
                        setSelectedRegion("All"); // Reset state when country changes
                      }}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        selectedCountry === country
                          ? "bg-[#C45C26] text-white shadow-xs"
                          : "border border-[#E8E2D9] bg-white text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[#F3EDE6]"
                      }`}
                    >
                      {country === "All" ? "All Countries" : country}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level 2: Region / State Filter (Dynamic: only displayed when a country is chosen) */}
              {selectedCountry !== "All" && (
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E8E2D9]/40">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#5C5C5C] flex items-center gap-1.5 shrink-0 mr-1">
                    <MapPin className="size-3.5 text-[#C45C26]" />
                    {selectedCountry} Regions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {regionsForCountry.map((region) => (
                      <button
                        key={region}
                        type="button"
                        onClick={() => setSelectedRegion(region)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          selectedRegion === region
                            ? "bg-[#1A1A1A] text-white shadow-xs"
                            : "border border-[#E8E2D9] bg-white text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[#F3EDE6]"
                        }`}
                      >
                        {region === "All" ? `All in ${selectedCountry}` : region}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Level 3: Heritage Category Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#5C5C5C] flex items-center gap-1.5 shrink-0 mr-1">
                  <Layers className="size-3.5 text-[#C45C26]" />
                  Category:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(["All", "Places", "Practices", "Crafts"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        selectedCategory === cat
                          ? "bg-[#C45C26] text-white shadow-xs"
                          : "border border-[#E8E2D9] bg-white text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[#F3EDE6]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Active Filters Summary & Reset */}
            {(selectedCountry !== "All" || selectedRegion !== "All" || selectedCategory !== "All" || searchQuery) && (
              <div className="flex items-center justify-between text-xs text-[#5C5C5C] pt-2 border-t border-[#E8E2D9]/50">
                <span>Showing {filteredItems.length} documented cultural objects</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCountry("All");
                    setSelectedRegion("All");
                    setSelectedCategory("All");
                    setSelectedSubCategory("All");
                    setSearchQuery("");
                  }}
                  className="text-[#C45C26] hover:underline font-medium cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>

          {/* Cards Grid: 1 -> 2 -> 3 columns */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setExpandedQuestionId(null);
                  }}
                  className="group rounded-2xl border border-[#E8E2D9] bg-white p-4 flex flex-col justify-between hover:border-[#C45C26]/40 hover:shadow-sm cursor-pointer transition-all duration-200"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedItem(item);
                      setExpandedQuestionId(null);
                    }
                  }}
                >
                  <div>
                    {/* High-res Verified Photo (4:3 aspect container) */}
                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F3EDE6] mb-3 relative">
                      <img
                        src={item.imagePath}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                      <span className="absolute top-2.5 right-2.5 rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-medium text-[#1A1A1A] shadow-xs">
                        {item.category}
                      </span>
                    </div>

                    {/* Geographical Pill: Country • State */}
                    <div className="flex items-center justify-between text-xs text-[#5C5C5C] mb-1.5">
                      <span className="flex items-center gap-1 font-mono text-[11px] text-[#C45C26] font-medium">
                        <MapPin className="size-3 shrink-0" />
                        {item.regionOrState}, {item.country}
                      </span>
                      {item.subCategory && (
                        <span className="text-[10px] text-[#5C5C5C] truncate max-w-[130px]" title={item.subCategory}>
                          {item.subCategory.split("&")[0]}
                        </span>
                      )}
                    </div>

                    {/* Title & Summary */}
                    <h2 className="font-serif text-lg font-medium text-[#1A1A1A] leading-snug group-hover:text-[#C45C26] transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed mt-1.5 line-clamp-2">
                      {item.summary}
                    </p>
                  </div>

                  {/* Caption & Quick Open Indicator */}
                  <div className="mt-3 pt-2.5 border-t border-[#E8E2D9]/70 flex items-center justify-between text-[11px] text-[#5C5C5C]">
                    <span className="italic truncate max-w-[200px]">{item.imageCaption}</span>
                    <span className="text-[#C45C26] font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Explore <ChevronRight className="size-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-12 text-center space-y-3">
              <Compass className="size-8 text-[#5C5C5C] mx-auto opacity-40" />
              <h3 className="font-serif text-lg font-medium text-[#1A1A1A]">
                No documented places or practices found
              </h3>
              <p className="text-sm text-[#5C5C5C] max-w-md mx-auto">
                No items matched the active filters ({selectedCountry} • {selectedRegion} • {selectedCategory}). Try clearing filters to see more world cultures.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCountry("All");
                  setSelectedRegion("All");
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="rounded-full border-[#E8E2D9] text-xs font-medium"
              >
                Reset filters
              </Button>
            </div>
          )}

        </div>
      </main>

      {/* Dynamic In-Page Item Detail Modal (Preserves Context, No Prompt Reset) */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        {selectedItem && (
          <DialogContent className="max-w-2xl bg-white border-[#E8E2D9] p-6 sm:p-8 rounded-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-2 text-left">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#F3EDE6] px-3 py-1 text-xs font-medium text-[#C45C26]">
                    {selectedItem.category}
                  </span>
                  {selectedItem.subCategory && (
                    <span className="rounded-full bg-[#FAF7F2] border border-[#E8E2D9] px-2.5 py-0.5 text-[11px] text-[#5C5C5C]">
                      {selectedItem.subCategory}
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#5C5C5C] flex items-center gap-1 font-mono">
                  <MapPin className="size-3 text-[#C45C26]" />
                  {selectedItem.location}
                </span>
              </div>

              <DialogTitle className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1A1A]">
                {selectedItem.title}
              </DialogTitle>

              <DialogDescription className="text-sm text-[#5C5C5C] leading-relaxed">
                {selectedItem.summary}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 pt-2">
              {/* High-res Image & Caption */}
              <div className="space-y-1.5">
                <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#F3EDE6]">
                  <img
                    src={selectedItem.imagePath}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-[#5C5C5C] italic">
                  {selectedItem.imageCaption}
                </p>
              </div>

              {/* Full Cultural Documentation Narrative */}
              <div className="prose text-sm text-[#1A1A1A] leading-relaxed space-y-3 font-normal border-t border-[#E8E2D9] pt-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#C45C26] font-semibold">
                  Cultural Documentation & Origins
                </h4>
                <p>{selectedItem.body}</p>
              </div>

              {/* Related Cultural Questions with In-Place Accordion (No Prompt Reset) */}
              {relatedQuestions.length > 0 && (
                <div className="pt-4 border-t border-[#E8E2D9] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-base font-medium text-[#1A1A1A] flex items-center gap-1.5">
                      <HelpCircle className="size-4 text-[#C45C26]" />
                      <span>Inquiries & Cultural Answers</span>
                    </h4>
                    <span className="text-[11px] font-mono text-[#5C5C5C]">
                      Tap to read answers
                    </span>
                  </div>

                  <div className="space-y-2">
                    {relatedQuestions.map((q) => {
                      const isExpanded = expandedQuestionId === q.id;
                      return (
                        <div
                          key={q.id}
                          className="rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] overflow-hidden transition-all"
                        >
                          <button
                            type="button"
                            onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                            className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-[#F3EDE6]/50 transition-colors"
                          >
                            <span className="font-medium text-xs sm:text-sm text-[#1A1A1A]">
                              {q.questionText}
                            </span>
                            <ChevronDown
                              className={`size-4 text-[#5C5C5C] shrink-0 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {isExpanded && (
                            <div className="px-3.5 pb-3.5 pt-1 text-xs text-[#5C5C5C] space-y-2 border-t border-[#E8E2D9]/60">
                              <p className="font-medium text-[#1A1A1A]">{q.answerSummary}</p>
                              <p className="leading-relaxed">{q.answerBody}</p>
                              <div className="pt-1 text-[11px] text-[#5C5C5C]/80">
                                Basis: {q.sourcesNote}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action: Place Detail Page & Ask EKA AI Companion */}
              <div className="pt-4 border-t border-[#E8E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full border-[#E8E2D9] text-xs font-medium text-[#1A1A1A] hover:bg-[#F3EDE6]"
                >
                  <Link
                    to="/places/$slug"
                    params={{ slug: selectedItem.slug }}
                  >
                    <span>View Dedicated Place Page</span>
                    <ChevronRight className="size-3.5 ml-1" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="sm"
                  className="rounded-full bg-[#C45C26] hover:bg-[#A34A1F] text-white text-xs font-medium px-4 shrink-0"
                >
                  <Link
                    to="/ask"
                    search={{ q: `What makes ${selectedItem.title} culturally significant in ${selectedItem.regionOrState}?` } as any}
                  >
                    <Sparkles className="size-3.5 mr-1.5" />
                    <span>Ask EKA AI</span>
                  </Link>
                </Button>
              </div>

            </div>
          </DialogContent>
        )}
      </Dialog>

      <SiteFooter />
    </div>
  );
}
