// ==============================================================================
// EKA BETA ASK EKA PAGE
// ==============================================================================
// 1. Mobile-First Interactive Cultural Inquiry Engine
// 2. Real AI output via EKA Cultural Intelligence & Gemini (with robust fallback)
// 3. Clear structured answer cards:
//    - Short grounded explanation
//    - Why it matters & deep cultural context
//    - Lineage & regional nuance
//    - Visitor etiquette / cultural respect guidance
//    - Verified sources & provenance
//    - Related discover places and practices
// 4. Quick-starter inquiry chips & curated seed questions
// ==============================================================================

import { useState, useTransition, useEffect } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import {
  Search,
  HelpCircle,
  ArrowRight,
  BookOpen,
  AlertCircle,
  Sparkles,
  Loader2,
  Compass,
  CheckCircle2,
  RefreshCw,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BETA_ASK_QUESTIONS,
  BETA_PLACES_OR_PRACTICES,
  type AskQuestionItem,
  type PlaceOrPractice,
} from "@/data/beta-seed-data";
import { getAiAnswerServer } from "@/lib/ai/ask-eka.server";
import { askEkaCulturalEngine } from "@/lib/cultural-intelligence/ask-eka-engine";

export const Route = createFileRoute("/ask")({
  validateSearch: (search: Record<string, unknown>): { q?: string; mode?: string } => ({
    q: (search["q"] as string) ?? "",
    mode: (search["mode"] as string) ?? "canon",
  }),
  head: () => ({
    meta: [
      { title: "Ask EKA — Cultural Intelligence & Inquiries" },
      {
        name: "description",
        content: "Ask cultural questions and receive grounded, factual explanations of living traditions, sacred places, and regional crafts.",
      },
    ],
  }),
  component: AskEkaPage,
});

interface DisplayAnswer {
  questionText: string;
  category: string;
  answerSummary: string;
  answerBody: string;
  whyItMatters?: string;
  culturalNuance?: string;
  visitorGuidance?: string;
  sourcesNote: string;
  poweredBy: string;
  relatedPlaces?: PlaceOrPractice[];
  regionalVariations?: { regionOrGroup: string; distinctPractice: string; significance: string }[];
}

const QUICK_INQUIRY_PROMPTS = [
  { label: "Kerala Backwaters", query: "What makes Kerala's backwaters unique in world geography?" },
  { label: "Living Root Bridges", query: "How do living root bridges grow and endure monsoon floods?" },
  { label: "Aranmula Mirror", query: "Why is the Aranmula metal mirror cast without silver glass backing?" },
  { label: "Ganga Aarti Lamps", query: "What is the historical significance of lighting tiered brass lamps at river ghats?" },
  { label: "Tea Ceremony (Chanoyu)", query: "Why is the Japanese tea ceremony performed with such precise movements?" },
  { label: "Bishnoi Ecology", query: "What are the core environmental tenets of the Bishnoi community?" },
];

function AskEkaPage() {
  const searchParams = useSearch({ from: "/ask" });
  const [inputText, setInputText] = useState(searchParams.q || "");
  const [isSearching, setIsSearching] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Active answer state
  const [activeAnswer, setActiveAnswer] = useState<DisplayAnswer | null>(() => {
    // Initial seed question
    const defaultSeed = searchParams.q
      ? BETA_ASK_QUESTIONS.find((item) =>
          item.questionText.toLowerCase().includes(searchParams.q.toLowerCase())
        ) || BETA_ASK_QUESTIONS[0]
      : BETA_ASK_QUESTIONS[0];

    if (!defaultSeed) return null;

    const relatedItem = defaultSeed.relatedItemSlug
      ? BETA_PLACES_OR_PRACTICES.filter((p) => p.slug === defaultSeed.relatedItemSlug)
      : [];

    return {
      questionText: defaultSeed.questionText,
      category: defaultSeed.category,
      answerSummary: defaultSeed.answerSummary,
      answerBody: defaultSeed.answerBody,
      whyItMatters: "Grounded in living community continuity and documented historical lineages.",
      culturalNuance: defaultSeed.contextNote,
      visitorGuidance: defaultSeed.contextNote
        ? "Visitors are encouraged to observe respectfully without disrupting ceremonial rhythms."
        : undefined,
      sourcesNote: defaultSeed.sourcesNote,
      poweredBy: "EKA Curated Lineage Archives & Verified Citations",
      relatedPlaces: relatedItem,
    };
  });

  // Handle inquiry submission with real AI engine and fallback
  const handlePerformInquiry = async (queryToRun: string) => {
    const q = queryToRun.trim();
    if (!q) return;

    setIsSearching(true);

    try {
      // 1. Try server-side TanStack Start function (uses Gemini directly with secure server env)
      let aiResult: any = null;
      try {
        aiResult = await getAiAnswerServer({ data: { query: q } });
      } catch (serverErr) {
        console.warn("[Ask EKA] Server function error, evaluating local engine fallback:", serverErr);
      }

      if (aiResult && aiResult.simpleAnswer) {
        // Map rich structured AI answer
        const relatedPlaceMatches = BETA_PLACES_OR_PRACTICES.filter((p) => {
          const combined = `${p.title} ${p.regionOrState} ${p.summary} ${p.subCategory || ""}`.toLowerCase();
          return q.toLowerCase().split(/\s+/).some((token) => token.length > 3 && combined.includes(token));
        });

        setActiveAnswer({
          questionText: q,
          category: aiResult.primaryEntity?.category || "Cultural Inquiry",
          answerSummary: aiResult.simpleAnswer,
          answerBody: aiResult.culturalContext || aiResult.simpleAnswer,
          whyItMatters: aiResult.whyItMatters,
          culturalNuance: Array.isArray(aiResult.communityPerspectives)
            ? aiResult.communityPerspectives.join(" ")
            : undefined,
          visitorGuidance: "Observing with cultural humility: respect community photography rules, sacred footwear practices, and local guidance.",
          sourcesNote: aiResult.sources?.map((s: any) => s.title || s.citation).join(" • ") || "EKA Canonical Knowledge Objects & Verified Literature",
          poweredBy: `${aiResult.poweredBy || "Google Gemini 2.5 Flash"} • Grounded in EKA Knowledge Graph`,
          relatedPlaces: relatedPlaceMatches.length > 0 ? relatedPlaceMatches.slice(0, 2) : BETA_PLACES_OR_PRACTICES.slice(0, 2),
          regionalVariations: aiResult.regionalVariations,
        });
      } else {
        // 2. Fall back to EKA Cultural Intelligence Engine
        const engineResult = await askEkaCulturalEngine(q);
        const related = BETA_PLACES_OR_PRACTICES.filter(
          (p) => p.slug === engineResult.matchedObject.slug || p.regionOrState.includes(engineResult.matchedObject.region)
        );

        setActiveAnswer({
          questionText: q,
          category: engineResult.matchedObject.category || "Living Lineage",
          answerSummary: engineResult.aiExplanation.summary,
          answerBody: engineResult.aiExplanation.deepExplanation,
          whyItMatters: `Rooted in ${engineResult.matchedObject.origin.philosophicalRoot}. Historically practiced in ${engineResult.matchedObject.region}.`,
          culturalNuance: engineResult.aiExplanation.culturalNuance,
          visitorGuidance: engineResult.aiExplanation.visitorGuidance,
          sourcesNote: engineResult.verifiedSources.map((s) => s.citation).join(" • "),
          poweredBy: engineResult.aiExplanation.poweredBy,
          relatedPlaces: related.length > 0 ? related : BETA_PLACES_OR_PRACTICES.slice(0, 2),
        });
      }
    } catch (err) {
      console.error("[Ask EKA] Inquiry error:", err);
      // Fallback to closest seed item
      const closest = BETA_ASK_QUESTIONS.find((item) =>
        item.questionText.toLowerCase().includes(q.toLowerCase())
      ) || BETA_ASK_QUESTIONS[0]!;

      setActiveAnswer({
        questionText: q,
        category: closest.category,
        answerSummary: closest.answerSummary,
        answerBody: closest.answerBody,
        whyItMatters: "Grounded in living community continuity and documented historical lineages.",
        culturalNuance: closest.contextNote,
        sourcesNote: closest.sourcesNote,
        poweredBy: "EKA Curated Lineage Archives",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    startTransition(() => {
      void handlePerformInquiry(inputText);
    });
  };

  const handleSelectSeed = (seed: AskQuestionItem) => {
    setInputText(seed.questionText);
    startTransition(() => {
      void handlePerformInquiry(seed.questionText);
    });
    // Scroll smoothly to answer container on mobile
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      const el = document.getElementById("active-answer-card");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSelectChip = (chipQuery: string) => {
    setInputText(chipQuery);
    startTransition(() => {
      void handlePerformInquiry(chipQuery);
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#C45C26]/20">
      <SiteHeader />

      <main className="flex-1 py-8 sm:py-14 px-4 sm:px-6">
        <div className="mx-auto max-w-[1120px]">
          {/* Header */}
          <div className="max-w-2xl mb-6 sm:mb-8">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#C45C26] font-semibold">
                Cultural Intelligence
              </span>
              <span className="text-xs font-mono text-[#5C5C5C]">• Real AI Reasoning</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A1A] mt-2">
              Ask EKA
            </h1>
            <p className="text-sm sm:text-base text-[#5C5C5C] mt-2 leading-relaxed">
              Inquire into why cultural traditions exist, how architectural marvels were engineered, and what living rituals signify across world communities.
            </p>
          </div>

          {/* Interactive Inquiry Form */}
          <div className="mb-6 max-w-3xl">
            <form onSubmit={handleSubmitForm} className="space-y-3">
              <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#5C5C5C] pointer-events-none" />
                  <Input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask any cultural question (e.g. why living root bridges, tea ceremony...)"
                    className="h-13 pl-11 pr-10 rounded-xl border-[#E8E2D9] bg-white text-base text-[#1A1A1A] placeholder:text-[#5C5C5C]/70 shadow-xs focus-visible:ring-2 focus-visible:ring-[#C45C26]"
                    autoComplete="off"
                  />
                  {inputText && (
                    <button
                      type="button"
                      onClick={() => setInputText("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-[#5C5C5C] hover:text-[#1A1A1A] p-1"
                      aria-label="Clear input"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSearching || !inputText.trim()}
                  className="h-13 px-6 rounded-xl bg-[#C45C26] hover:bg-[#A34A1F] text-white font-medium text-sm shadow-xs transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Inquiring...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      <span>Ask EKA</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Inquiry Chips (Thumb-friendly on mobile) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-1 scrollbar-none">
                <span className="text-[11px] font-mono text-[#5C5C5C] uppercase tracking-wider shrink-0 mr-1">
                  Quick Ideas:
                </span>
                {QUICK_INQUIRY_PROMPTS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleSelectChip(item.query)}
                    className="shrink-0 rounded-full border border-[#E8E2D9] bg-white px-3 py-1.5 text-xs text-[#1A1A1A] hover:border-[#C45C26] hover:text-[#C45C26] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C45C26]"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Main Inquiry Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
            
            {/* Center / Primary Column: Active Answer Display (Immediately visible on mobile) */}
            <div id="active-answer-card" className="lg:col-span-8 order-1 lg:order-2 space-y-6">
              {isSearching ? (
                <div className="rounded-2xl border border-[#E8E2D9] bg-white p-8 sm:p-12 text-center space-y-4 shadow-xs">
                  <div className="size-12 rounded-full bg-[#F3EDE6] flex items-center justify-center mx-auto text-[#C45C26] animate-pulse">
                    <Sparkles className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#1A1A1A]">
                      Consulting Cultural Intelligence Engine
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C5C5C] mt-1 max-w-md mx-auto">
                      Grounding inquiry in authentic regional lineages, primary source archives, and Gemini reasoning...
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center">
                    <Loader2 className="size-5 text-[#C45C26] animate-spin" />
                  </div>
                </div>
              ) : activeAnswer ? (
                <div className="rounded-2xl border border-[#E8E2D9] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
                  {/* Category & AI Provenance Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E2D9] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#F3EDE6] px-3 py-1 text-xs font-medium text-[#C45C26]">
                        {activeAnswer.category}
                      </span>
                      <span className="text-xs text-[#5C5C5C] flex items-center gap-1">
                        <CheckCircle2 className="size-3.5 text-emerald-600" />
                        Grounded Analysis
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#5C5C5C] bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#E8E2D9]/80">
                      {activeAnswer.poweredBy}
                    </span>
                  </div>

                  {/* Question Heading */}
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1A1A] leading-snug">
                      {activeAnswer.questionText}
                    </h2>
                  </div>

                  {/* Primary Synthesis / Short Explanation */}
                  <div className="rounded-xl bg-[#FAF7F2] border border-[#E8E2D9] p-5 text-sm sm:text-base font-medium text-[#1A1A1A] leading-relaxed">
                    {activeAnswer.answerSummary}
                  </div>

                  {/* Why it Matters */}
                  {activeAnswer.whyItMatters && (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-[#C45C26] font-semibold">
                        Why It Matters
                      </h4>
                      <p className="text-sm text-[#1A1A1A] leading-relaxed">
                        {activeAnswer.whyItMatters}
                      </p>
                    </div>
                  )}

                  {/* Deep Cultural Context Body */}
                  <div className="space-y-2 border-t border-[#E8E2D9] pt-4">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C5C5C] font-semibold">
                      Historical Origin & Cultural Context
                    </h4>
                    <div className="text-sm text-[#1A1A1A] leading-relaxed space-y-3 font-normal">
                      <p className="whitespace-pre-line">{activeAnswer.answerBody}</p>
                    </div>
                  </div>

                  {/* Regional Variations if present */}
                  {activeAnswer.regionalVariations && activeAnswer.regionalVariations.length > 0 && (
                    <div className="space-y-3 border-t border-[#E8E2D9] pt-4">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C5C5C] font-semibold">
                        Regional Expressions & Continuity
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activeAnswer.regionalVariations.map((v, i) => (
                          <div key={i} className="rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] p-3 text-xs space-y-1">
                            <span className="font-semibold text-[#1A1A1A] block">{v.regionOrGroup}</span>
                            <p className="text-[#5C5C5C]">{v.distinctPractice}</p>
                            <p className="text-[#C45C26] italic text-[11px]">{v.significance}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cultural Respect / Visitor Guidance */}
                  {activeAnswer.visitorGuidance && (
                    <div className="rounded-xl bg-[#F3EDE6]/80 p-4 text-xs text-[#5C5C5C] space-y-1.5 border border-[#E8E2D9]">
                      <div className="flex items-center gap-1.5 font-medium text-[#1A1A1A]">
                        <AlertCircle className="size-4 text-[#C45C26]" />
                        <span>Cultural Respect & Visitor Etiquette</span>
                      </div>
                      <p className="leading-relaxed">{activeAnswer.visitorGuidance}</p>
                    </div>
                  )}

                  {/* Documentation Note & Sources */}
                  <div className="pt-2 text-xs text-[#5C5C5C] flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#E8E2D9]">
                    <div className="flex items-center gap-2">
                      <BookOpen className="size-3.5 text-[#C45C26] shrink-0" />
                      <span>Reference basis: {activeAnswer.sourcesNote}</span>
                    </div>
                  </div>

                  {/* Related Discover Items */}
                  {activeAnswer.relatedPlaces && activeAnswer.relatedPlaces.length > 0 && (
                    <div className="pt-4 border-t border-[#E8E2D9] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase tracking-wider text-[#C45C26] font-semibold">
                          Related Documented Places & Practices
                        </span>
                        <Link to="/discover" className="text-xs text-[#C45C26] hover:underline flex items-center gap-1">
                          <span>Explore all</span>
                          <ArrowRight className="size-3" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activeAnswer.relatedPlaces.map((place) => (
                          <Link
                            key={place.id}
                            to="/discover"
                            className="group flex gap-3 p-3 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] hover:bg-white hover:border-[#C45C26]/40 transition-colors"
                          >
                            <div className="size-16 rounded-lg overflow-hidden shrink-0 bg-[#F3EDE6]">
                              <img
                                src={place.imagePath}
                                alt={place.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                loading="lazy"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-mono text-[#5C5C5C] uppercase block truncate">
                                {place.location}
                              </span>
                              <h5 className="font-serif text-sm font-medium text-[#1A1A1A] group-hover:text-[#C45C26] transition-colors truncate">
                                {place.title}
                              </h5>
                              <p className="text-xs text-[#5C5C5C] line-clamp-1 mt-0.5">
                                {place.summary}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-12 text-center text-sm text-[#5C5C5C]">
                  Type a question or pick an idea from the list to view a grounded cultural explanation.
                </div>
              )}
            </div>

            {/* Left/Sidebar Column: Curated Starter Questions */}
            <div className="lg:col-span-4 order-2 lg:order-1 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="font-serif text-base font-medium text-[#1A1A1A]">
                  Curated Inquiries ({BETA_ASK_QUESTIONS.length})
                </span>
                <span className="text-xs text-[#5C5C5C]">Verified seed set</span>
              </div>

              <div className="space-y-2.5">
                {BETA_ASK_QUESTIONS.map((q) => {
                  const isCurrent = activeAnswer?.questionText === q.questionText;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleSelectSeed(q)}
                      className={`w-full text-left rounded-xl p-4 border transition-all text-left ${
                        isCurrent
                          ? "border-[#C45C26] bg-white shadow-xs ring-1 ring-[#C45C26]"
                          : "border-[#E8E2D9] bg-white hover:bg-white hover:border-[#C45C26]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="rounded bg-[#F3EDE6] px-2 py-0.5 text-[11px] font-medium text-[#5C5C5C]">
                          {q.category}
                        </span>
                        {isCurrent && (
                          <span className="text-xs font-medium text-[#C45C26] flex items-center gap-1">
                            <CheckCircle2 className="size-3" />
                            Active
                          </span>
                        )}
                      </div>
                      <p className="font-serif text-sm font-medium text-[#1A1A1A] leading-snug">
                        {q.questionText}
                      </p>
                      <p className="text-xs text-[#5C5C5C] line-clamp-1 mt-1">
                        {q.answerSummary}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
