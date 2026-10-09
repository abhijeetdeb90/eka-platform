// ==============================================================================
// ASK EKA — LIVING CULTURAL INTELLIGENCE (PRIMARY INTERACTION)
// ==============================================================================
// 8-Part Canonical Answer Structure:
// 1. Simple answer
// 2. Cultural context
// 3. Regional variations
// 4. Community perspectives
// 5. Sources & Provenance (EKA Trust Standard)
// 6. Related knowledge ("You might also wonder...")
// 7. Compare Cultures
// 8. Explore deeper
// ==============================================================================

import React, { useState, useEffect } from "react";
import { createFileRoute, Link, useSearch, useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  Search,
  BookOpen,
  Film,
  MapPin,
  Users,
  ShieldCheck,
  Bookmark,
  ArrowRight,
  Compass,
  Scroll,
  HelpCircle,
  Share2,
  ExternalLink,
  CheckCircle2,
  Layers,
  Scale,
  Info,
  Globe,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { askEkaTokenOptimized, type AskEkaStructuredResponse } from "@/lib/ai/token-optimized-ai";
import { getTrustVerificationMeta } from "@/lib/knowledge/knowledge-object";
import { track } from "@/lib/analytics";
import { useLocalization } from "@/lib/i18n";
import { QuestionCard } from "@/components/cards/QuestionCard";
import { MetaTags, createFaqPageSchema } from "@/components/seo";
import { EkaBreadcrumb } from "@/components/navigation";
import { GroundedCulturalSearch } from "@/components/search";

export const Route = createFileRoute("/ask")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: (search["q"] as string) ?? "",
    mode: (search["mode"] as string) ?? "canon",
  }),
  head: () => ({
    meta: [
      { title: "Ask EKA — Living Cultural Intelligence" },
      {
        name: "description",
        content:
          "Ask anything about traditions, rituals, festivals, sacred places, and living crafts. Grounded in verified canonical lineages, regional variations, and living practitioners.",
      },
      { property: "og:title", content: "Ask EKA — Living Cultural Intelligence" },
      {
        property: "og:description",
        content:
          "Don't just scroll the world. Understand it. See → Ask → Understand → Explore → Connect.",
      },
    ],
  }),
  component: AskEkaPage,
});

interface CuratedQuestionItem {
  id: string;
  question: string;
  category: string;
  regionOrCulture: string;
  shortHook: string;
}

const POPULAR_QUESTIONS: CuratedQuestionItem[] = [
  {
    id: "pop-1",
    question: "Why do people light diyas?",
    category: "Rituals & Light",
    regionOrCulture: "Indic Traditions",
    shortHook: "The ancient symbolism of earthenware clay, mustard oil, and Agni burning worldly attachments.",
  },
  {
    id: "pop-2",
    question: "Why is Varanasi sacred?",
    category: "Sacred Geography",
    regionOrCulture: "Varanasi, India",
    shortHook: "The crescent bend of the holy Ganges where Shiva whispers liberation to the departing soul.",
  },
  {
    id: "pop-3",
    question: "What is Bhoota Kola?",
    category: "Living Lineages",
    regionOrCulture: "Tulu Nadu, Karnataka",
    shortHook: "The spirit possession oracle dance where impersonators channel ancestral village protector deities.",
  },
  {
    id: "pop-4",
    question: "Why do Japanese bow?",
    category: "Social Philosophy",
    regionOrCulture: "Japan · Shinto/Zen",
    shortHook: "The bodily language of Eshaku and Saikeirei reflecting mutual sacred non-harm.",
  },
  {
    id: "pop-5",
    question: "How do the Bishnoi protect desert wildlife as family?",
    category: "Living Ecology",
    regionOrCulture: "Thar Desert, Rajasthan",
    shortHook: "The 29 commandments that turn desert villagers into fierce ecological guardians nursing fawns.",
  },
  {
    id: "pop-6",
    question: "What does silence mean across Zen, Advaita, and Christian monasticism?",
    category: "Contemplative Wisdom",
    regionOrCulture: "Cross-Cultural",
    shortHook: "Comparative inquiry into Mauna, Hesychasm, and Mu: beyond discursive concepts.",
  },
];

interface CultureCategory {
  culture: string;
  tradition: string;
  questions: CuratedQuestionItem[];
}

const CULTURE_SECTIONS: CultureCategory[] = [
  {
    culture: "Indic & Himalayan",
    tradition: "Hindu, Buddhist, Sikh, Jain traditions",
    questions: [
      {
        id: "cul-ind-1",
        question: "Why do people circumambulate temples clockwise (Pradakshina)?",
        category: "Rituals",
        regionOrCulture: "Pan-India",
        shortHook: "Keeping the sacred center on the right side of the heart during movement.",
      },
      {
        id: "cul-ind-2",
        question: "What is the science and philosophy behind the sacred hearth (Homa/Havan)?",
        category: "Vedic Wisdom",
        regionOrCulture: "Sanatana Dharma",
        shortHook: "Transforming botanical offerings into subtle atmospheric purification and gratitude.",
      },
      {
        id: "cul-ind-3",
        question: "What is Langar and why does everyone sit at equal floor height?",
        category: "Sikh Lineage",
        regionOrCulture: "Punjab",
        shortHook: "Guru Nanak's radical egalitarianism breaking caste and hierarchy through shared bread.",
      },
    ],
  },
  {
    culture: "East Asian & Zen",
    tradition: "Japanese, Chinese, and Korean traditions",
    questions: [
      {
        id: "cul-ea-1",
        question: "What is the cultural philosophy of Wabi-Sabi and Kintsugi?",
        category: "Aesthetics & Zen",
        regionOrCulture: "Japan",
        shortHook: "Finding transcendent beauty in imperfection, weathering, and repair.",
      },
      {
        id: "cul-ea-2",
        question: "What does the boundary of a Torii gate signify when crossing?",
        category: "Shinto Geography",
        regionOrCulture: "Kyoto, Japan",
        shortHook: "Stepping from the mundane realm of ego into the dwelling of Kami.",
      },
      {
        id: "cul-ea-3",
        question: "How did the Zen Tea Ceremony (Chado) evolve as a moving meditation?",
        category: "Contemplative Ritual",
        regionOrCulture: "Japan",
        shortHook: "Harmony, respect, purity, and tranquility embodied in one shared cup of matcha.",
      },
    ],
  },
  {
    culture: "Mediterranean & Middle Eastern",
    tradition: "Levantine, Islamic, and Amazigh traditions",
    questions: [
      {
        id: "cul-me-1",
        question: "How do Amazigh weavers encode maternal lineage in High Atlas carpets?",
        category: "Sacred Crafts",
        regionOrCulture: "Morocco · Atlas Mountains",
        shortHook: "Geometric patterns carrying oral memories and tribal protection symbols.",
      },
      {
        id: "cul-me-2",
        question: "What is the sacred geometry behind Zellij mosaic tile stars?",
        category: "Islamic Architecture",
        regionOrCulture: "Andalusia & Fez",
        shortHook: "Infinite repeating tessellations evoking the transcendent formlessness of the divine.",
      },
      {
        id: "cul-me-3",
        question: "Why is hospitality (Diyafa) considered a sacred obligation across desert cultures?",
        category: "Living Lineage",
        regionOrCulture: "Levant & Bedouin",
        shortHook: "Welcoming strangers for three days without asking their name or intent.",
      },
    ],
  },
];

const CURATED_CURIOSITIES = [
  "Why do people light diyas?",
  "Why is Varanasi sacred?",
  "What is Bhoota Kola?",
  "Why do Japanese bow?",
  "What does this symbol mean?",
  "Where did this food originate?",
  "Why is this festival celebrated?",
  "What should I know before visiting this place?",
  "How do the Bishnoi protect desert wildlife as family?",
  "What does silence mean across Zen, Advaita, and Christian monasticism?",
];

function AskEkaPage() {
  const { q, mode } = useSearch({ from: "/ask" });
  const navigate = useNavigate();
  const { locale, t } = useLocalization();

  const [inputVal, setInputVal] = useState(q || "Why do people light diyas?");
  const [activeQuery, setActiveQuery] = useState(q || "Why do people light diyas?");
  const [activeMode, setActiveMode] = useState<"canon" | "grounded">(
    mode === "grounded" ? "grounded" : "canon",
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AskEkaStructuredResponse | null>(null);
  const [saved, setSaved] = useState(false);

  // Sync from URL search param
  useEffect(() => {
    if (q && q !== activeQuery) {
      setInputVal(q);
      setActiveQuery(q);
    }
    if (mode && (mode === "canon" || mode === "grounded")) {
      setActiveMode(mode);
    }
  }, [q, mode, activeQuery]);

  // Execute Token-Optimized Ask EKA query
  useEffect(() => {
    let isMounted = true;
    async function loadKnowledge() {
      if (!activeQuery.trim()) return;
      setLoading(true);
      track("ask_query_submitted", { query: activeQuery });
      try {
        const res = await askEkaTokenOptimized(activeQuery);
        if (isMounted) {
          setResult(res);
          setSaved(false);
          track("ask_result_opened", { entity: res.primaryEntity.name });
        }
      } catch (err) {
        if (isMounted) toast.error("Could not retrieve cultural intelligence right now.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    void loadKnowledge();
    return () => {
      isMounted = false;
    };
  }, [activeQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setActiveQuery(inputVal.trim());
      void navigate({ to: "/ask", search: { q: inputVal.trim() } });
    }
  };

  const handleSelectPreset = (preset: string) => {
    setInputVal(preset);
    setActiveQuery(preset);
    void navigate({ to: "/ask", search: { q: preset } });
  };

  const handleSaveToPassport = () => {
    setSaved(true);
    track("ask_eka_save_passport", { entity: result?.primaryEntity.name });
    toast.success("Saved to your Wisdom Passport!");
  };

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Query link copied to clipboard.");
    }
  };

  const dynamicTitle = activeQuery
    ? `Ask EKA: "${activeQuery}"`
    : "Ask EKA — Living Cultural Intelligence";
  const dynamicDesc = result?.simpleAnswer
    ? result.simpleAnswer.slice(0, 160)
    : "Ask anything about traditions, rituals, festivals, sacred places, and living crafts. Grounded in verified canonical lineages and living practitioners.";

  return (
    <div className="min-h-screen bg-sand/20 dark:bg-stone-950 text-foreground flex flex-col selection:bg-terracotta/20">
      <MetaTags
        title={dynamicTitle}
        description={dynamicDesc}
        ogTitle={dynamicTitle}
        ogDescription={dynamicDesc}
        canonicalUrl={activeQuery ? `/ask?q=${encodeURIComponent(activeQuery)}` : "/ask"}
        twitterTitle={dynamicTitle}
        twitterDescription={dynamicDesc}
        keywords={["Ask EKA", "cultural inquiry", "living traditions", "sacred questions", activeQuery].filter(Boolean) as string[]}
        structuredData={
          result
            ? createFaqPageSchema([
                {
                  question: activeQuery,
                  answer: result.simpleAnswer,
                },
              ])
            : undefined
        }
      />
      <SiteHeader />

      {/* Breadcrumbs Navigation */}
      <div className="border-b border-border/40 bg-sand/10">
        <div className="container-eka">
          <EkaBreadcrumb
            items={[
              { label: "Ask EKA", to: "/ask", active: !activeQuery },
              ...(activeQuery ? [{ label: activeQuery, active: true }] : []),
            ]}
          />
        </div>
      </div>

      <main id="main-content" className="flex-1 py-8 sm:py-14 space-y-10 sm:space-y-12">
        {/* Hero & Universal Query Engine */}
        <section className="container-eka max-w-4xl space-y-6 text-center">
          <div className="space-y-3">
            <Badge
              variant="outline"
              className="border-primary/40 text-primary text-xs font-mono uppercase tracking-wider mb-1"
            >
              <Sparkles className="size-3 mr-1.5 inline text-saffron" />
              Ask EKA · Living Cultural Intelligence
            </Badge>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Ask EKA anything about culture.
            </h1>
            <p className="font-serif text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              Don't just scroll the world. Understand it. Begin with your curiosity — explore
              traditions, rituals, sacred places, philosophy, or living crafts through verified
              sources.
            </p>

            {/* Mode Switcher: Canonical vs Google Search Grounded */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveMode("canon");
                  void navigate({ to: "/ask", search: { q: activeQuery, mode: "canon" } });
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeMode === "canon"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-card/70 border border-border/70 text-muted-foreground hover:text-foreground"
                }`}
              >
                Canonical Knowledge Graph
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMode("grounded");
                  void navigate({ to: "/ask", search: { q: activeQuery, mode: "grounded" } });
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeMode === "grounded"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-card/70 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
                }`}
              >
                <ShieldCheck className="size-3.5" />
                <span>Google Search Grounded (Live)</span>
              </button>
            </div>
          </div>

          {/* Render Grounded Cultural Search when in grounded mode */}
          {activeMode === "grounded" ? (
            <div className="pt-2">
              <GroundedCulturalSearch
                initialQuery={activeQuery}
                className="text-left"
                onResultLoaded={(res) => setActiveQuery(res.query)}
              />
            </div>
          ) : (
            <>
              {/* Primary Query Input Bar */}
              <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
                <div className="relative flex items-center rounded-2xl border border-border/80 bg-background/95 shadow-calm backdrop-blur-md transition-all focus-within:border-primary focus-within:shadow-lift">
                  <Search className="ml-4 size-5 text-muted-foreground shrink-0" />
                  <Input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Ask: Why do people light diyas? Why is Varanasi sacred? What is Bhoota Kola?…"
                    className="border-0 bg-transparent py-6 px-3.5 text-base sm:text-lg shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
                  />
                  <Button
                    type="submit"
                    className="mr-2 rounded-xl px-5 font-medium shadow-xs bg-gradient-to-r from-terracotta to-saffron text-white hover:opacity-95"
                  >
                    <span>Understand</span>
                    <ArrowRight className="ml-1.5 size-3.5" />
                  </Button>
                </div>
              </form>

              {/* Curated Questions Carousel / Chips */}
              <div className="space-y-2 pt-1">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Popular questions:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {CURATED_CURIOSITIES.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectPreset(item)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-all border ${
                        activeQuery === item
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border/60 bg-card/70 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      <Sparkles className="size-3 text-terracotta" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>

        {/* Loading State (for Canon mode) */}
        {activeMode === "canon" && loading && (
          <div className="container-eka max-w-4xl text-center py-12 space-y-3">
            <div className="inline-block size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm font-mono text-muted-foreground">
              Retrieving verified lineages, primary sources & connected knowledge…
            </p>
          </div>
        )}

        {/* 8-PART CANONICAL CULTURAL RESPONSE (for Canon mode) */}
        {activeMode === "canon" && !loading && result && (
          <section className="container-eka max-w-4xl space-y-8 animate-fadeIn">
            {/* Header & Verification Ribbon */}
            <div className="rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8 shadow-calm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className="border-terracotta/40 text-terracotta text-xs font-mono uppercase bg-terracotta/5"
                    >
                      {result.primaryEntity.category} ·{" "}
                      {result.exploreDeeper.mapLocation || "Cultural Heritage"}
                    </Badge>
                    <Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-mono flex items-center gap-1">
                      <ShieldCheck className="size-3" />
                      <span>{result.sources.length} Verified Sources</span>
                    </Badge>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                    {result.primaryEntity.name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    Inquiry: "{activeQuery}"
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleShare}
                    className="rounded-xl text-xs gap-1.5"
                  >
                    <Share2 className="size-3.5" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                  <Button
                    size="sm"
                    variant={saved ? "secondary" : "outline"}
                    onClick={handleSaveToPassport}
                    className="rounded-xl text-xs gap-1.5"
                  >
                    <Bookmark className={`size-3.5 ${saved ? "fill-primary text-primary" : ""}`} />
                    <span>{saved ? "Saved" : "Save"}</span>
                  </Button>
                </div>
              </div>

              {/* 1. SIMPLE ANSWER */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold">
                  1. Simple Answer
                </span>
                <p className="text-base sm:text-lg leading-relaxed text-foreground font-serif">
                  {result.simpleAnswer}
                </p>
              </div>

              {/* 2. CULTURAL CONTEXT */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  2. Cultural Context & Deeper Origin
                </span>
                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground font-light">
                  {result.culturalContext}
                </p>
              </div>

              {/* 3. REGIONAL VARIATIONS */}
              {result.regionalVariations && result.regionalVariations.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Layers className="size-4 text-terracotta" />
                    <span className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
                      3. Regional Variations across Communities
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {result.regionalVariations.map((v, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-border/70 bg-sand/10 p-3.5 text-xs space-y-1.5"
                      >
                        <span className="font-semibold text-foreground font-serif">
                          {v.regionOrGroup}
                        </span>
                        <p className="text-muted-foreground leading-relaxed">
                          <strong>Practice:</strong> {v.distinctPractice}
                        </p>
                        <p className="text-muted-foreground/80 italic">
                          <strong>Meaning:</strong> {v.significance}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. COMMUNITY PERSPECTIVES */}
              {result.communityPerspectives && result.communityPerspectives.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-purple-600" />
                    <span className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
                      4. Community Perspectives & Living Voices
                    </span>
                  </div>
                  <div className="space-y-2">
                    {result.communityPerspectives.map((persp, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs text-foreground/90 italic"
                      >
                        "{persp}"
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. SOURCES & PROVENANCE (EKA Trust Standard) */}
              {result.sources && result.sources.length > 0 && (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      <ShieldCheck className="size-4 text-emerald-600" />
                      <span>5. Verified Sources & Provenance (EKA Trust Standard)</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {result.sources.length} sources cited
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{result.provenanceBasis}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {result.sources.map((src, i) => {
                      const meta = getTrustVerificationMeta(src.verificationLevel);
                      return (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-card border border-border/70 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-foreground truncate">
                              {src.title}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[9px] font-mono px-1.5 py-0 shrink-0 ${meta.colorClass} ${meta.badgeBorder}`}
                            >
                              {meta.shortLabel}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground font-mono text-[11px]">
                            Ref: {src.citation}
                          </p>
                          <p className="text-[10px] text-muted-foreground/80 line-clamp-2">
                            {meta.basis}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 6. YOU MIGHT ALSO WONDER... (Cultural Discovery Alternative to Infinite Scroll) */}
            {result.youMightAlsoWonder && result.youMightAlsoWonder.length > 0 && (
              <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-saffron" />
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    6. You might also wonder…
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Follow genuine curiosity to explore connected lineages:
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {result.youMightAlsoWonder.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(q)}
                      className="text-left p-3 rounded-xl border border-border/60 bg-sand/15 hover:border-primary/50 hover:bg-card transition-all text-xs font-serif text-foreground group flex items-start justify-between gap-2"
                    >
                      <span className="group-hover:text-primary transition-colors">"{q}"</span>
                      <ArrowRight className="size-3 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 7. COMPARE CULTURES ("ONE WITH ALL") */}
            {result.compareSuggestion && (
              <div className="rounded-3xl border border-terracotta/30 bg-terracotta/5 p-6 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="size-4 text-terracotta" />
                    <span className="text-xs font-mono uppercase tracking-wider text-terracotta font-semibold">
                      7. Compare Cultures
                    </span>
                  </div>
                  <Link to="/discover">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
                      <span>Explore all comparisons →</span>
                    </Button>
                  </Link>
                </div>
                <h4 className="font-serif text-base font-bold text-foreground">
                  {result.compareSuggestion.comparisonTitle}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {result.compareSuggestion.insight}
                </p>
              </div>
            )}

            {/* 8. EXPLORE DEEPER (Connected Knowledge Object Ecosystem) */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="size-4 text-primary" />
                  <h3 className="font-serif text-base font-bold text-foreground">
                    8. Explore Deeper in the EKA Archive
                  </h3>
                </div>
                <Link
                  to="/knowledge/$slug"
                  params={{ slug: result.exploreDeeper.knowledgeSlug }}
                  className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                >
                  <span>Open Canonical Knowledge Object</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <Link
                  to="/knowledge/$slug"
                  params={{ slug: result.exploreDeeper.knowledgeSlug }}
                  className="p-3.5 rounded-2xl border border-border/70 bg-sand/15 hover:border-primary/50 transition-all space-y-1 block"
                >
                  <BookOpen className="size-4 text-primary" />
                  <p className="font-serif text-xs font-bold text-foreground">Knowledge Object</p>
                  <p className="text-[11px] text-muted-foreground">Full 10 dimensions & lineage</p>
                </Link>

                <Link
                  to="/discover"
                  className="p-3.5 rounded-2xl border border-border/70 bg-sand/15 hover:border-primary/50 transition-all space-y-1 block"
                >
                  <MapPin className="size-4 text-blue-500" />
                  <p className="font-serif text-xs font-bold text-foreground">Cultural Map</p>
                  <p className="text-[11px] text-muted-foreground">Locate sacred geography</p>
                </Link>

                <Link
                  to="/stories"
                  className="p-3.5 rounded-2xl border border-border/70 bg-sand/15 hover:border-primary/50 transition-all space-y-1 block"
                >
                  <Film className="size-4 text-terracotta" />
                  <p className="font-serif text-xs font-bold text-foreground">Visual Stories</p>
                  <p className="text-[11px] text-muted-foreground">9:16 vertical field reels</p>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* POPULAR QUESTIONS SECTION (Zero-Pill QuestionCard Grid) */}
        {/* ==================================================================== */}
        <section className="container-eka max-w-5xl space-y-4 pt-4 border-t border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border/60 pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-terracotta uppercase tracking-wider mb-1">
                <HelpCircle className="size-3.5" />
                <span>Curated Inquiries</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-normal text-foreground">
                Popular Questions
              </h2>
            </div>
            <p className="text-xs text-muted-foreground font-light max-w-md">
              Tap any inquiry to explore the 8-part verified answer, regional variations, and living custodians.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {POPULAR_QUESTIONS.map((item) => (
              <QuestionCard
                key={item.id}
                id={item.id}
                question={item.question}
                category={item.category}
                regionOrCulture={item.regionOrCulture}
                shortHook={item.shortHook}
                bgVariant="card"
                onClick={() => handleSelectPreset(item.question)}
              />
            ))}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* EXPLORE BY CULTURE SECTION (Using QuestionCard by Living Traditions) */}
        {/* ==================================================================== */}
        <section className="container-eka max-w-5xl space-y-8 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border/60 pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-terracotta uppercase tracking-wider mb-1">
                <Globe className="size-3.5" />
                <span>Comparative Wisdom</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-normal text-foreground">
                Explore by Culture
              </h2>
            </div>
            <p className="text-xs text-muted-foreground font-light max-w-md">
              Deepen cultural literacy across polyphonic traditions, sacred geometries, and living craft lineages.
            </p>
          </div>

          <div className="space-y-8">
            {CULTURE_SECTIONS.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-baseline justify-between border-b border-border/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-saffron" />
                    <h3 className="font-display text-lg sm:text-xl font-medium text-foreground">
                      {section.culture}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {section.tradition}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {section.questions.map((qItem) => (
                    <QuestionCard
                      key={qItem.id}
                      id={qItem.id}
                      question={qItem.question}
                      category={qItem.category}
                      regionOrCulture={qItem.regionOrCulture}
                      shortHook={qItem.shortHook}
                      bgVariant="sand"
                      onClick={() => handleSelectPreset(qItem.question)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
