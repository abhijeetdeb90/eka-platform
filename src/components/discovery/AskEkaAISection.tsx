import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  BookOpen,
  CornerDownLeft,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromptSample {
  question: string;
  source: string;
  preview: string;
}

const SAMPLE_PROMPTS: PromptSample[] = [
  {
    question: "Why are sacred temple bells made of Panchaloha (five metals)?",
    source: "Agama Shastra & Acoustic Metallurgy Archives",
    preview:
      "Panchaloha bells are cast using specific proportions of copper, zinc, tin, lead, and gold/silver to sustain a reverberation at 432 Hz for over 7 seconds, calming brainwave frequencies as one crosses the temple threshold.",
  },
  {
    question: "How do the Sattras of Majuli preserve neo-Vaishnavite democracy?",
    source: "Majuli Cultural Registry & Srimanta Sankardeva Archives",
    preview:
      "Established in the 15th century, Sattras function as egalitarian communal monasteries where decisions are reached by consensus in the Namghar (prayer hall), devoid of caste hierarchy, practicing community theater (Bhaona).",
  },
  {
    question: "Why do Kutch embroiderers encode migration routes in stitches?",
    source: "Kutch Craft Council & Oral Lineage Recordings",
    preview:
      "Rabari and Mutwa women developed distinct non-verbal stitch vocabularies that served as visual passports across arid frontiers, recording maternal family journeys, watering holes, and kinship alliances.",
  },
];

export const AskEkaAISection: React.FC = () => {
  const [activePromptIndex, setActivePromptIndex] = useState<number>(0);
  const [query, setQuery] = useState<string>(SAMPLE_PROMPTS[0]?.question ?? "");
  const navigate = useNavigate();

  const handleSelectPrompt = (index: number) => {
    const prompt = SAMPLE_PROMPTS[index];
    if (prompt) {
      setActivePromptIndex(index);
      setQuery(prompt.question);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentSample = SAMPLE_PROMPTS[activePromptIndex] ?? SAMPLE_PROMPTS[0];
    const finalQuery = query.trim() || currentSample?.question || "Tell me about sacred traditions";
    // Navigate to Journey route with search parameter
    navigate({
      to: "/journey",
      search: { q: finalQuery } as Record<string, unknown>,
    });
  };

  const activeSample = SAMPLE_PROMPTS[activePromptIndex] ?? SAMPLE_PROMPTS[0]!;

  return (
    <section aria-labelledby="ask-eka-ai-title" className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background radial atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-saffron/15 via-terracotta/10 to-primary-soft/20 blur-3xl"
      />

      <div className="container-eka">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-saffron uppercase">
            <Sparkles className="size-3.5" />
            <span>EKA Intelligence</span>
          </div>
          <h2
            id="ask-eka-ai-title"
            className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl text-foreground"
          >
            Ask EKA AI.
            <span className="block mt-1 font-serif font-light text-2xl sm:text-3xl lg:text-4xl text-muted-foreground">
              Direct provenance, zero algorithmic noise.
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-muted-foreground font-light leading-relaxed">
            Query across 6,000+ verified cultural lineages, temple geometries, sacred foodways, and
            oral histories grounded in community custodianship.
          </p>
        </div>

        {/* Interactive Query Box */}
        <div className="mt-12 mx-auto max-w-3xl">
          <div className="rounded-3xl border border-border/80 bg-card/95 p-4 sm:p-6 shadow-lift backdrop-blur-md">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/80 px-4 py-3 shadow-inner focus-within:border-primary/80 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Search className="size-5 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask any cultural, sacred tradition or place question..."
                  className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-hidden"
                  aria-label="Ask EKA AI a question"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-xl px-4 py-2 font-medium shrink-0 flex items-center gap-1.5"
                >
                  <span>Explore</span>
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </form>

            {/* Prompt Suggestion Chips */}
            <div className="mt-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5 font-medium">
                <Compass className="size-3.5 text-terracotta" />
                <span>Try an authentic inquiry:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PROMPTS.map((sample, idx) => (
                  <button
                    key={sample.question}
                    type="button"
                    onClick={() => handleSelectPrompt(idx)}
                    className={`rounded-full border px-3.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                      activePromptIndex === idx
                        ? "border-primary bg-primary-soft/80 text-foreground font-medium"
                        : "border-border/70 bg-background/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {sample.question}
                  </button>
                ))}
              </div>
            </div>

            {/* Synthesized Live Answer Preview */}
            <div className="mt-6 rounded-2xl border border-border/60 bg-sand/30 p-5 transition-all">
              <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-saffron animate-pulse" />
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    EKA Synthesized Response
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-forest font-medium">
                  <ShieldCheck className="size-3.5" />
                  <span>Ground truth verified</span>
                </div>
              </div>

              <p className="mt-3 font-sans text-sm sm:text-base font-light leading-relaxed text-foreground">
                "{activeSample.preview}"
              </p>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground pt-3 border-t border-border/40">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="size-3.5 text-terracotta" />
                  <span>Source: {activeSample.source}</span>
                </div>
                <Link
                  to="/journey"
                  search={{ q: activeSample.question }}
                  className="font-medium text-terracotta hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Continue inquiry in Journey</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
