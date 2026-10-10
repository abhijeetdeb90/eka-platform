import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Compass,
  Globe2,
  Share2,
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  ShieldCheck,
  Scale,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CULTURAL_COMPARISONS,
  PAIRWISE_CULTURAL_COMPARISONS,
  type PairwiseCultureComparison,
  type CrossCulturalComparison,
} from "@/lib/cultural-intelligence";
import { getTrustVerificationMeta } from "@/lib/knowledge/knowledge-object";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

interface CompareCulturesSectionProps {
  onAskEka: (target: {
    title: string;
    location?: string;
    initialQuestion?: string;
    preloadedSummary?: string;
  }) => void;
  className?: string;
}

export function CompareCulturesSection({
  onAskEka,
  className = "",
}: CompareCulturesSectionProps) {
  // Mode: 'pairwise' (Direct pairs) | 'thematic' (Universal questions across 5 cultures)
  const [viewMode, setViewMode] = useState<"pairwise" | "thematic">("pairwise");
  const [selectedPairwiseId, setSelectedPairwiseId] = useState<string>("diwali-vs-lunar-new-year");
  const [selectedThematicId, setSelectedThematicId] = useState<string>("coming-of-age");

  const currentPairwise: PairwiseCultureComparison =
    PAIRWISE_CULTURAL_COMPARISONS.find((c) => c.id === selectedPairwiseId) ||
    PAIRWISE_CULTURAL_COMPARISONS[0]!;

  const currentThematic: CrossCulturalComparison =
    CULTURAL_COMPARISONS.find((c) => c.id === selectedThematicId) ||
    CULTURAL_COMPARISONS[0]!;

  const handleShareComparison = async () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      const activeId = viewMode === "pairwise" ? currentPairwise.id : currentThematic.id;
      await navigator.clipboard.writeText(
        `${window.location.origin}/discover?compare=${activeId}&mode=${viewMode}`
      );
      toast.success("Cross-cultural comparison link copied to clipboard.");
    }
  };

  const getRelationshipBadgeColor = (type: string) => {
    switch (type) {
      case "DOCUMENTED_HISTORICAL_TRANSMISSION":
        return "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border-emerald-600/30";
      case "PARALLEL_HUMAN_QUESTION":
        return "bg-amber-600/10 text-amber-700 dark:text-amber-400 border-amber-600/30";
      case "INDIRECT_SYNCRETISM":
        return "bg-blue-600/10 text-blue-700 dark:text-blue-400 border-blue-600/30";
      default:
        return "bg-purple-600/10 text-purple-700 dark:text-purple-400 border-purple-600/30";
    }
  };

  return (
    <section
      data-testid="compare-cultures-section"
      className={`rounded-3xl border border-border/80 bg-card overflow-hidden shadow-calm p-6 sm:p-10 space-y-8 ${className}`}
    >
      {/* 1. Header with "ONE WITH ALL" Ethos & View Mode Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-terracotta/40 text-terracotta text-xs font-mono uppercase tracking-wider"
            >
              <Sparkles className="size-3 mr-1 text-saffron inline" />
              Compare Cultures · Living Cultural Intelligence
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Epistemic Rigor Standard
            </Badge>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-normal text-foreground">
            Different cultures. Similar human questions.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Understand how civilizations resolve universal questions of light, transition, marriage, movement, and sacred space—distinguishing verified historical transmission from parallel human evolution.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <div className="flex bg-sand/30 p-1 rounded-xl border border-border/80">
            <button
              type="button"
              onClick={() => setViewMode("pairwise")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "pairwise"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Direct Pairwise
            </button>
            <button
              type="button"
              onClick={() => setViewMode("thematic")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "thematic"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Universal Themes
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShareComparison}
            className="rounded-full text-xs gap-1.5"
          >
            <Share2 className="size-3.5" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>

      {/* VIEW MODE A: PAIRWISE COMPARISONS */}
      {viewMode === "pairwise" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Pair Switcher Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {PAIRWISE_CULTURAL_COMPARISONS.map((comp) => (
              <button
                key={comp.id}
                type="button"
                onClick={() => setSelectedPairwiseId(comp.id)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all shrink-0 flex items-center gap-2 ${
                  selectedPairwiseId === comp.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border/80 bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <span>{comp.title}</span>
              </button>
            ))}
          </div>

          {/* The Human Question Banner */}
          <div className="rounded-2xl border border-terracotta/30 bg-terracotta/5 p-5 sm:p-6 text-center space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-terracotta font-semibold">
              The Shared Human Question
            </span>
            <h3 className="font-serif text-xl sm:text-3xl font-medium text-foreground italic">
              "{currentPairwise.humanQuestion}"
            </h3>
          </div>

          {/* Side-by-Side Entity Cards (A vs B) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Entity A */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{currentPairwise.entityA.flagEmoji}</span>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-foreground">
                      {currentPairwise.entityA.name}
                    </h4>
                    <p className="text-xs font-mono text-muted-foreground">
                      {currentPairwise.entityA.culture} · {currentPairwise.entityA.region}
                    </p>
                  </div>
                </div>
                {currentPairwise.entityA.knowledgeSlug && (
                  <Link
                    to="/knowledge/$slug"
                    params={{ slug: currentPairwise.entityA.knowledgeSlug }}
                    className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    <span>Canonical</span>
                    <ExternalLink className="size-3" />
                  </Link>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between bg-sand/30 p-2.5 rounded-xl">
                  <span className="text-muted-foreground">Time Period:</span>
                  <span className="font-medium text-foreground">{currentPairwise.entityA.timePeriod}</span>
                </div>
                <div className="flex items-center justify-between bg-sand/30 p-2.5 rounded-xl">
                  <span className="text-muted-foreground">Key Sacred Symbol:</span>
                  <span className="font-medium text-terracotta font-serif">{currentPairwise.entityA.keySymbol}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {currentPairwise.entityA.summary}
              </p>
            </div>

            {/* Entity B */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{currentPairwise.entityB.flagEmoji}</span>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-foreground">
                      {currentPairwise.entityB.name}
                    </h4>
                    <p className="text-xs font-mono text-muted-foreground">
                      {currentPairwise.entityB.culture} · {currentPairwise.entityB.region}
                    </p>
                  </div>
                </div>
                {currentPairwise.entityB.knowledgeSlug && (
                  <Link
                    to="/knowledge/$slug"
                    params={{ slug: currentPairwise.entityB.knowledgeSlug }}
                    className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    <span>Canonical</span>
                    <ExternalLink className="size-3" />
                  </Link>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between bg-sand/30 p-2.5 rounded-xl">
                  <span className="text-muted-foreground">Time Period:</span>
                  <span className="font-medium text-foreground">{currentPairwise.entityB.timePeriod}</span>
                </div>
                <div className="flex items-center justify-between bg-sand/30 p-2.5 rounded-xl">
                  <span className="text-muted-foreground">Key Sacred Symbol:</span>
                  <span className="font-medium text-terracotta font-serif">{currentPairwise.entityB.keySymbol}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {currentPairwise.entityB.summary}
              </p>
            </div>
          </div>

          {/* Similarities & Differences Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Similarities */}
            <div className="rounded-2xl border border-emerald-600/30 bg-emerald-500/5 p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="size-5 shrink-0" />
                <h4 className="font-serif text-base font-semibold">
                  Universal Shared Patterns (Similarities)
                </h4>
              </div>
              <ul className="space-y-2.5">
                {currentPairwise.similarities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground/90">
                    <span className="size-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Differences */}
            <div className="rounded-2xl border border-terracotta/30 bg-terracotta/5 p-6 space-y-4">
              <div className="flex items-center gap-2 text-terracotta">
                <Scale className="size-5 shrink-0" />
                <h4 className="font-serif text-base font-semibold">
                  Fundamental Distinctive Distinctions (Differences)
                </h4>
              </div>
              <ul className="space-y-2.5">
                {currentPairwise.differences.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground/90">
                    <span className="size-1.5 rounded-full bg-terracotta shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Epistemic Provenance: Documented Historical Relationship vs Parallel Human Evolution */}
          <div className="rounded-2xl border border-border/80 bg-background/90 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-foreground">
                  EKA Epistemic Provenance Standard
                </span>
              </div>
              <Badge
                variant="outline"
                className={`text-xs font-medium ${getRelationshipBadgeColor(
                  currentPairwise.historicalRelationshipType
                )}`}
              >
                {currentPairwise.historicalRelationshipBadge}
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              {currentPairwise.historicalRelationshipDetail}
            </p>

            {/* Cautionary Warning Banner */}
            <div className="rounded-xl border border-amber-600/30 bg-amber-500/10 p-3.5 flex items-start gap-3">
              <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
                {currentPairwise.epistemicWarning}
              </p>
            </div>
          </div>

          {/* Regional Variations Side-by-Side */}
          <div className="rounded-2xl border border-border/70 bg-sand/15 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              <h4 className="font-serif text-base font-semibold text-foreground">
                Regional Variations & Living Traditions
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold text-terracotta">
                  {currentPairwise.entityA.name} Variations:
                </span>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {currentPairwise.regionalVariations.entityA.map((v, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-terracotta">›</span>
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold text-terracotta">
                  {currentPairwise.entityB.name} Variations:
                </span>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {currentPairwise.regionalVariations.entityB.map((v, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-terracotta">›</span>
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sources & Evidence */}
          <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-muted-foreground" />
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-muted-foreground">
                  Corroborated Scholarly & Institutional Sources
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                {currentPairwise.sources.length} Verified Citations
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentPairwise.sources.map((src, idx) => {
                const meta = getTrustVerificationMeta(src.verificationLevel);
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-border/60 bg-sand/20 p-3 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={`text-[10px] ${meta.colorClass} ${meta.badgeBg} ${meta.badgeBorder}`}>
                        {meta.label}
                      </Badge>
                    </div>
                    <p className="font-medium text-foreground line-clamp-1">{src.title}</p>
                    <p className="text-[11px] text-muted-foreground italic line-clamp-2">
                      {src.citation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Synthesis CTA Footer */}
          <div className="rounded-2xl border border-primary/30 bg-sand/30 p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
                Explore Deeper with EKA Cultural Intelligence
              </span>
              <p className="font-serif text-sm sm:text-base text-foreground leading-relaxed">
                "{currentPairwise.askEkaPrompt}"
              </p>
            </div>

            <Button
              onClick={() =>
                onAskEka({
                  title: currentPairwise.title,
                  initialQuestion: currentPairwise.askEkaPrompt,
                  preloadedSummary: currentPairwise.historicalRelationshipDetail,
                })
              }
              className="rounded-full text-xs gap-2 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Sparkles className="size-3.5 text-saffron" />
              <span>Ask EKA to Analyze</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* VIEW MODE B: THEMATIC MULTI-CULTURE COMPARISONS */}
      {viewMode === "thematic" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Topic Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CULTURAL_COMPARISONS.map((comp) => (
              <button
                key={comp.id}
                type="button"
                onClick={() => setSelectedThematicId(comp.id)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all shrink-0 flex items-center gap-2 ${
                  selectedThematicId === comp.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border/80 bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <span>{comp.title}</span>
              </button>
            ))}
          </div>

          {/* Central Question Banner */}
          <div className="rounded-2xl border border-terracotta/30 bg-terracotta/5 p-5 sm:p-6 text-center space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-terracotta font-semibold">
              The Universal Human Question
            </span>
            <h3 className="font-serif text-xl sm:text-3xl font-medium text-foreground italic">
              "{currentThematic.humanQuestion}"
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {currentThematic.coreInsight}
            </p>
          </div>

          {/* 5-Culture Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {currentThematic.points.map((pt) => (
              <div
                key={pt.cultureName}
                className="rounded-2xl border border-border/70 bg-sand/15 p-4 flex flex-col justify-between space-y-3 hover:border-primary/50 transition-all shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{pt.flagEmoji}</span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">
                      {pt.location}
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-foreground">
                    {pt.cultureName}
                  </h4>
                  <p className="text-xs font-mono text-terracotta font-medium">
                    → {pt.traditionName}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pt.practiceSnippet}
                  </p>
                </div>

                <div className="border-t border-border/50 pt-2 text-[11px] text-foreground font-medium italic">
                  "{pt.meaningSnippet}"
                </div>
              </div>
            ))}
          </div>

          {/* Philosophical Synthesis Footer */}
          <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
                EKA Universal Synthesis
              </span>
              <p className="font-serif text-sm sm:text-base text-foreground leading-relaxed">
                {currentThematic.ekaOneWithAllThesis}
              </p>
            </div>

            <Button
              onClick={() =>
                onAskEka({
                  title: currentThematic.title,
                  initialQuestion: `Why do so many world cultures have ${currentThematic.title.toLowerCase()}? Compare their spiritual roots.`,
                  preloadedSummary: currentThematic.coreInsight,
                })
              }
              className="rounded-full text-xs gap-1.5 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Sparkles className="size-3.5 text-saffron" />
              <span>Ask EKA to compare</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
