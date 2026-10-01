// ==============================================================================
// EKA CULTURAL INTELLIGENCE EXPLORER
// ==============================================================================
// Answers the core question: "Don't just scroll the world. Understand it."
// 1. Curiosity Sparks Rail
// 2. 7-Point Structured Knowledge Unfold (What, Why, Origin, Where, Who, How, Sources)
// 3. Grounded "Ask EKA" Intelligent Query Interface
// ==============================================================================

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  BookOpen,
  Scroll,
  MapPin,
  Users,
  Compass,
  Bookmark,
  Share2,
  Search,
  CheckCircle2,
  ShieldCheck,
  Flame,
  ArrowRight,
  Info,
  Clock,
  Layers,
} from "lucide-react";
import {
  CULTURAL_KNOWLEDGE_CORPUS,
  askEkaCulturalEngine,
  type CulturalKnowledgeObject,
  type CulturalInquiryResult,
} from "@/lib/cultural-intelligence";
import { Pressable } from "@/components/motion/Pressable";
import { ConnectionOrbit } from "@/components/motion/ConnectionOrbit";
import { epistemicTiers } from "@/lib/tokens/theme";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CulturalIntelligenceExplorer() {
  const [selectedId, setSelectedId] = useState<string>(CULTURAL_KNOWLEDGE_CORPUS[0]!.id);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"what_why" | "origin_sources" | "where_who" | "how_experience">("what_why");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [aiResult, setAiResult] = useState<CulturalInquiryResult | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const REGION_FILTERS = [
    "All",
    "North India",
    "South India",
    "East India",
    "North-East India",
    "West & Central",
    "Americas / US",
    "UK & Europe",
    "Egypt & Middle East",
    "Asia",
  ];

  const filteredCorpus = CULTURAL_KNOWLEDGE_CORPUS.filter((item) => {
    if (selectedRegionFilter === "All") return true;
    if (selectedRegionFilter === "North India")
      return item.region.includes("Uttar Pradesh") || item.region.includes("Punjab") || item.region.includes("Kashmir") || item.region.includes("Rajasthan");
    if (selectedRegionFilter === "South India")
      return item.region.includes("Kerala") || item.region.includes("Tamil Nadu") || item.region.includes("Karnataka");
    if (selectedRegionFilter === "East India")
      return item.region.includes("Bengal") || item.region.includes("Odisha") || item.region.includes("Bihar");
    if (selectedRegionFilter === "North-East India")
      return item.region.includes("Assam") || item.region.includes("Meghalaya");
    if (selectedRegionFilter === "West & Central")
      return item.region.includes("Maharashtra") || item.region.includes("Gujarat");
    if (selectedRegionFilter === "Americas / US")
      return item.region.includes("USA") || item.region.includes("Arizona") || item.region.includes("Carolina");
    if (selectedRegionFilter === "UK & Europe")
      return item.region.includes("Greece") || item.region.includes("Spain") || item.region.includes("Europe");
    if (selectedRegionFilter === "Egypt & Middle East")
      return item.region.includes("Egypt") || item.region.includes("Turkey") || item.region.includes("Konya");
    if (selectedRegionFilter === "Asia")
      return item.region.includes("Japan") || item.region.includes("Bali") || item.region.includes("Tibet") || item.region.includes("Ladakh");
    return true;
  });

  const currentObject = CULTURAL_KNOWLEDGE_CORPUS.find((c) => c.id === selectedId) || CULTURAL_KNOWLEDGE_CORPUS[0]!;
  const tierMeta = epistemicTiers[currentObject.epistemicTier];

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info("Removed from Sanctuary reflections.");
      } else {
        next.add(id);
        toast.success("Saved to your Sanctuary reflections.");
      }
      return next;
    });
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await askEkaCulturalEngine(searchQuery);
      setAiResult(res);
      if (res.matchedObject) {
        setSelectedId(res.matchedObject.id);
      }
    } catch {
      toast.error("Unable to query EKA Cultural Engine. Using curated corpus.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ==================================================================== */}
      {/* 1. ASK EKA QUERY BAR (CULTURAL INTELLIGENCE SEARCH) */}
      {/* ==================================================================== */}
      <div className="relative rounded-3xl border border-terracotta/30 bg-card/90 p-5 sm:p-7 backdrop-blur-md shadow-calm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-terracotta font-semibold flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-saffron" />
              EKA Cultural Intelligence Layer
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-normal mt-0.5 text-foreground">
              What do you want to understand today?
            </h3>
          </div>
          <span className="text-xs font-mono text-muted-foreground self-start md:self-auto bg-muted px-2.5 py-1 rounded-full border border-border/50">
            Direct Provenance • Zero Hallucination
          </span>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-background px-4 py-2.5 shadow-inner focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/20 transition-all">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask anything: 'Why do Bengalis celebrate differently?', 'Explain sacred metallurgy', 'What is Bhootha Yajna?'"
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 outline-hidden font-sans"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-1.5 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white font-mono text-xs uppercase tracking-wider shadow-xs font-medium shrink-0 transition-colors disabled:opacity-50"
            >
              {isSearching ? "Searching..." : "Ask EKA"}
            </button>
          </div>
        </form>

        {/* AI Answer Stream Card (when query is submitted) */}
        {aiResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 p-4 sm:p-5 rounded-2xl bg-sand-warm/50 dark:bg-stone-900/60 border border-saffron/30 space-y-3"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-terracotta font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="size-3.5" /> EKA Intelligence Response
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Powered by {aiResult.aiExplanation.poweredBy}
              </span>
            </div>

            <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground">
              {aiResult.aiExplanation.summary}
            </p>

            <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line pt-2 border-t border-border/40">
              {aiResult.aiExplanation.deepExplanation}
            </div>

            {aiResult.aiExplanation.visitorGuidance && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 dark:text-amber-200">
                <strong className="font-mono uppercase font-bold text-saffron block mb-1">
                  Visitor Etiquette & Cultural Respect:
                </strong>
                {aiResult.aiExplanation.visitorGuidance}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* 2. CURIOSITY SPARKS RAIL (PROVOCATIVE QUESTIONS BY GEOGRAPHY) */}
      {/* ==================================================================== */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Provocative Inquiries • Tap to Understand
          </span>
          <span className="text-xs font-mono text-terracotta">
            {filteredCorpus.length} of {CULTURAL_KNOWLEDGE_CORPUS.length} Verified Objects
          </span>
        </div>

        {/* Region / Corridor Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-none mb-2">
          {REGION_FILTERS.map((filter) => {
            const isSelected = selectedRegionFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedRegionFilter(filter)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-mono shrink-0 transition-all",
                  isSelected
                    ? "bg-terracotta text-white font-medium shadow-xs"
                    : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
                )}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
          {filteredCorpus.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedId(item.id);
                  setAiResult(null);
                }}
                className={cn(
                  "shrink-0 max-w-[280px] sm:max-w-[320px] text-left p-3.5 rounded-2xl border transition-all select-none snap-start",
                  isSelected
                    ? "bg-terracotta text-white border-terracotta shadow-calm"
                    : "bg-card/90 text-foreground border-border/70 hover:border-terracotta/40 hover:bg-accent/40"
                )}
              >
                <span
                  className={cn(
                    "text-[10px] font-mono uppercase tracking-wider block mb-1",
                    isSelected ? "text-white/80" : "text-terracotta"
                  )}
                >
                  {item.region}
                </span>
                <p className="font-serif text-sm font-medium leading-snug line-clamp-2">
                  "{item.curiosityQuestion}"
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. 7-POINT DEEP KNOWLEDGE UNFOLD */}
      {/* ==================================================================== */}
      <article className="rounded-3xl border border-border/80 bg-card/95 backdrop-blur-md overflow-hidden shadow-calm">
        {/* Header Bar */}
        <div className="p-5 sm:p-7 border-b border-border/50 bg-sand/20 dark:bg-stone-900/30">
          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-terracotta bg-terracotta/10 px-2.5 py-1 rounded-full border border-terracotta/20">
                {currentObject.region}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border",
                  tierMeta.colorClass,
                  tierMeta.bgClass,
                  tierMeta.borderClass
                )}
              >
                <ShieldCheck className="size-2.5" />
                {tierMeta.badgeText}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Pressable
                onClick={() => handleToggleSave(currentObject.id)}
                aria-label="Save reflection"
                className="size-8 rounded-full border border-border/60 hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Bookmark
                  className={cn(
                    "size-3.5",
                    savedIds.has(currentObject.id) && "text-terracotta fill-terracotta"
                  )}
                />
              </Pressable>
              <Pressable
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard.");
                }}
                aria-label="Share tradition"
                className="size-8 rounded-full border border-border/60 hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Share2 className="size-3.5" />
              </Pressable>
            </div>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-foreground leading-tight">
            {currentObject.title}
          </h2>

          <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl font-light">
            {currentObject.summary}
          </p>
        </div>

        {/* 4 Navigation Tabs for the 7 Dimensions */}
        <div className="flex items-center gap-2 px-5 sm:px-7 pt-4 pb-2 border-b border-border/40 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab("what_why")}
            className={cn(
              "px-3.5 py-1.5 rounded-full transition-all shrink-0",
              activeTab === "what_why"
                ? "bg-terracotta text-white font-medium shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            1. What & Why
          </button>
          <button
            onClick={() => setActiveTab("origin_sources")}
            className={cn(
              "px-3.5 py-1.5 rounded-full transition-all shrink-0",
              activeTab === "origin_sources"
                ? "bg-terracotta text-white font-medium shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            2. Origin & Sources ({currentObject.sources.length})
          </button>
          <button
            onClick={() => setActiveTab("where_who")}
            className={cn(
              "px-3.5 py-1.5 rounded-full transition-all shrink-0",
              activeTab === "where_who"
                ? "bg-terracotta text-white font-medium shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            3. Where & Who
          </button>
          <button
            onClick={() => setActiveTab("how_experience")}
            className={cn(
              "px-3.5 py-1.5 rounded-full transition-all shrink-0",
              activeTab === "how_experience"
                ? "bg-terracotta text-white font-medium shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            4. How to Experience & Etiquette
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-7">
          {activeTab === "what_why" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2 p-5 rounded-2xl bg-muted/40 border border-border/50">
                <span className="text-[10px] font-mono uppercase tracking-wider text-terracotta font-bold flex items-center gap-1.5">
                  <Info className="size-3.5" /> What Is It?
                </span>
                <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground">
                  {currentObject.what}
                </p>
              </div>

              <div className="space-y-2 p-5 rounded-2xl bg-sand/40 dark:bg-stone-900/50 border border-saffron/30">
                <span className="text-[10px] font-mono uppercase tracking-wider text-saffron font-bold flex items-center gap-1.5">
                  <Flame className="size-3.5" /> Why Does It Exist?
                </span>
                <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground">
                  {currentObject.why}
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "origin_sources" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border/50">
                <div className="flex items-center gap-2 text-xs font-mono text-terracotta font-semibold mb-2">
                  <Clock className="size-3.5" />
                  <span>Era: {currentObject.origin.era}</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {currentObject.origin.historicalContext}
                </p>
                <div className="mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground font-mono">
                  <strong>Philosophical Grounding:</strong> {currentObject.origin.philosophicalRoot}
                </div>
              </div>

              {/* Verified Primary Citations */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Scroll className="size-3.5 text-saffron" />
                  Verified Primary Sources & Canonical Citations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentObject.sources.map((src) => (
                    <div
                      key={src.id}
                      className="p-4 rounded-xl border border-border/60 bg-card space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-medium text-foreground">{src.title}</span>
                        <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {src.trustScore}% Verified
                        </span>
                      </div>
                      <p className="text-xs font-mono text-terracotta">{src.citationRef}</p>
                      <blockquote className="text-xs font-serif italic text-muted-foreground border-l-2 border-terracotta/40 pl-2.5">
                        "{src.translationExcerpt}"
                      </blockquote>
                      <div className="pt-2 border-t border-border/30 text-[10px] font-mono text-muted-foreground">
                        Verified by {src.verifier} ({src.verifierRole})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "where_who" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="p-5 rounded-2xl bg-muted/40 border border-border/50 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-semibold">
                  <MapPin className="size-3.5" />
                  <span>Where: {currentObject.where.locationName}</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {currentObject.where.geographicalSignificance}
                </p>
                {currentObject.where.coordinates && (
                  <span className="inline-block text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border/50">
                    GPS: {currentObject.where.coordinates}
                  </span>
                )}
              </div>

              <div className="p-5 rounded-2xl bg-muted/40 border border-border/50 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-mono text-forest font-semibold">
                  <Users className="size-3.5" />
                  <span>Who: Custodians & Living Lineage</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {currentObject.who.custodians}
                </p>
                <div className="text-xs font-mono text-muted-foreground">
                  <strong>Lineage Guild:</strong> {currentObject.who.lineageOrGuild}
                </div>
                <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Status: {currentObject.who.transmissionStatus}
                </span>
              </div>
            </motion.div>
          )}

          {activeTab === "how_experience" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Layers className="size-3.5 text-terracotta" />
                  Ritual & Craft Steps
                </h4>
                <ol className="space-y-2.5">
                  {currentObject.how.practiceSteps.map((step, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/40 text-xs sm:text-sm text-foreground/90 font-sans"
                    >
                      <span className="size-5 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center font-mono text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-950 dark:text-amber-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-mono uppercase font-bold text-saffron tracking-wider text-xs">
                  <CheckCircle2 className="size-3.5" /> Respectful Visitor Etiquette:
                </div>
                <p className="leading-relaxed font-light">{currentObject.how.visitorEtiquette}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Bar: The 5 Product Primitives Bridge */}
        <div className="p-4 sm:p-6 border-t border-border/50 bg-sand/30 dark:bg-stone-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-muted-foreground">EKA 5 Primitives:</span>
            <span className="text-foreground font-semibold">1. Discover</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground font-semibold">2. Understand</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground font-semibold">3. Verify</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground font-semibold">4. Connect</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground font-semibold">5. Experience</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/junction"
              className="text-terracotta hover:underline flex items-center gap-1"
            >
              <span>Explore on Map</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
