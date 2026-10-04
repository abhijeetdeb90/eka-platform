import React, { useState } from "react";
import { Sparkles, Search, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AskEkaHeroProps {
  onAskEka: (target: {
    title: string;
    location?: string;
    initialQuestion?: string;
    preloadedSummary?: string;
  }) => void;
  className?: string;
}

const SUGGESTED_HERO_PROMPTS = [
  { icon: "🌍", text: "Why do people celebrate this?", query: "Why do people celebrate this cultural festival?" },
  { icon: "🕯️", text: "What does this ritual mean?", query: "What does this ritual mean and what is its spiritual root?" },
  { icon: "🍛", text: "Why is this food important?", query: "Why is this sacred food important to the community?" },
  { icon: "🛕", text: "What happens inside this sacred place?", query: "What happens inside this sacred place and what etiquette should I follow?" },
  { icon: "👘", text: "What does this clothing represent?", query: "What does this traditional clothing represent?" },
  { icon: "🗣️", text: "Where did this language come from?", query: "Where did this ancestral language originate?" },
  { icon: "💍", text: "How do people get married here?", query: "How do traditional weddings take place across different communities?" },
  { icon: "🎉", text: "What festival is happening today?", query: "What cultural festivals and observances are celebrated in this season?" },
  { icon: "🧬", text: "How did this tradition evolve?", query: "How did this tradition evolve over the centuries?" },
  { icon: "🤝", text: "What should I know before visiting?", query: "What cultural customs and etiquette should I know before visiting this community?" },
];

export function AskEkaHero({ onAskEka, className = "" }: AskEkaHeroProps) {
  const [heroQuery, setHeroQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroQuery.trim()) return;
    onAskEka({
      title: "Cultural Curiosity",
      initialQuestion: heroQuery.trim(),
    });
  };

  const handleSelectPrompt = (query: string) => {
    onAskEka({
      title: "Cultural Curiosity",
      initialQuestion: query,
    });
  };

  return (
    <section
      data-testid="ask-eka-hero-section"
      className={`relative overflow-hidden rounded-3xl border border-border/80 bg-sand/15 p-6 sm:p-12 lg:p-16 text-center space-y-8 ${className}`}
    >
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[450px] w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-saffron/15 via-terracotta/10 to-primary/10 blur-3xl"
      />

      {/* Header Copy */}
      <div className="max-w-3xl mx-auto space-y-3">
        <Badge
          variant="outline"
          className="border-primary/40 text-primary text-xs font-mono uppercase tracking-wider mb-1"
        >
          <Sparkles className="size-3 mr-1 text-saffron inline" />
          The Cultural Guide
        </Badge>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-foreground tracking-tight">
          Ask EKA
        </h1>

        <p className="font-serif text-lg sm:text-2xl font-light text-muted-foreground leading-relaxed">
          Understand the world, one question at a time.
        </p>

        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          Not an AI chatbot clone. A grounded cultural guide connecting you to verified traditions,
          sacred geography, and community knowledge.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-background/95 px-4 py-3 sm:py-3.5 shadow-lift focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={heroQuery}
              onChange={(e) => setHeroQuery(e.target.value)}
              placeholder="What are you curious about?"
              className="w-full bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
              data-testid="ask-eka-hero-input"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!heroQuery.trim()}
              className="rounded-full text-xs shrink-0 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <span>Ask</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>

      {/* 10 Suggested Prompts Underneath */}
      <div className="max-w-4xl mx-auto space-y-2.5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold block">
          Suggested curiosities to begin:
        </span>

        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTED_HERO_PROMPTS.map((p) => (
            <button
              key={p.text}
              type="button"
              onClick={() => handleSelectPrompt(p.query)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 backdrop-blur-xs px-3.5 py-1.5 text-xs text-foreground hover:border-primary hover:bg-primary/5 transition-all shadow-2xs"
            >
              <span>{p.icon}</span>
              <span>{p.text}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
