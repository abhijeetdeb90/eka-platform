import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Compass,
  Heart,
  Globe2,
  Share2,
  Layers,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CULTURAL_COMPARISONS,
  type CrossCulturalComparison,
} from "@/lib/cultural-intelligence";
import { toast } from "sonner";

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
  const [selectedComparisonId, setSelectedComparisonId] = useState<string>("coming-of-age");

  const currentComparison =
    CULTURAL_COMPARISONS.find((c) => c.id === selectedComparisonId) ||
    CULTURAL_COMPARISONS[0]!;

  const handleShareComparison = async () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(
        `${window.location.origin}/discover?compare=${currentComparison.id}`
      );
      toast.success("Cross-cultural comparison link copied to clipboard.");
    }
  };

  return (
    <section
      data-testid="compare-cultures-section"
      className={`rounded-3xl border border-border/80 bg-card overflow-hidden shadow-calm p-6 sm:p-10 space-y-8 ${className}`}
    >
      {/* 1. Header with "ONE WITH ALL" Ethos */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="border-terracotta/40 text-terracotta text-xs font-mono uppercase tracking-wider"
          >
            <Sparkles className="size-3 mr-1 text-saffron inline" />
            Compare Cultures · ONE WITH ALL
          </Badge>
          <h2 className="font-serif text-2xl sm:text-4xl font-normal text-foreground">
            Different cultures. Similar human questions.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            When you look beneath superficial differences, humanity asks the exact same questions
            about life, love, death, light, and passage.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShareComparison}
          className="rounded-full text-xs gap-1.5 self-start md:self-auto"
        >
          <Share2 className="size-3.5" />
          <span>Share comparison</span>
        </Button>
      </div>

      {/* 2. Interactive Topic Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CULTURAL_COMPARISONS.map((comp) => (
          <button
            key={comp.id}
            type="button"
            onClick={() => setSelectedComparisonId(comp.id)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-all shrink-0 flex items-center gap-2 ${
              selectedComparisonId === comp.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border/80 bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <span>{comp.title}</span>
          </button>
        ))}
      </div>

      {/* 3. The Central Question Banner */}
      <div className="rounded-2xl border border-terracotta/30 bg-terracotta/5 p-5 sm:p-6 text-center space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-terracotta font-semibold">
          The Human Question
        </span>
        <h3 className="font-serif text-xl sm:text-3xl font-medium text-foreground italic">
          "{currentComparison.humanQuestion}"
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {currentComparison.coreInsight}
        </p>
      </div>

      {/* 4. Side-by-Side Comparison Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {currentComparison.points.map((pt, idx) => (
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

      {/* 5. The Philosophical Synthesis Footer */}
      <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
            EKA Universal Synthesis
          </span>
          <p className="font-serif text-sm sm:text-base text-foreground leading-relaxed">
            {currentComparison.ekaOneWithAllThesis}
          </p>
        </div>

        <Button
          onClick={() =>
            onAskEka({
              title: currentComparison.title,
              initialQuestion: `Why do so many world cultures have ${currentComparison.title.toLowerCase()}? Compare their spiritual roots.`,
              preloadedSummary: currentComparison.coreInsight,
            })
          }
          className="rounded-full text-xs gap-1.5 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
          title="Understand more with EKA AI"
        >
          <Sparkles className="size-3.5 text-saffron" />
          <span>Ask EKA to compare</span>
          <Lock className="size-3 text-saffron" />
        </Button>
      </div>
    </section>
  );
}
