// ==============================================================================
// EKA PUBLIC MULTILINGUAL CULTURAL SEARCH
// ==============================================================================
// Language-Independent Semantic Search across Canonical Entities & Community Lineages.
// Fully accessible to both guests and authenticated members.
// Maps:
// "বিহু কিয় পালন কৰা হয়?" -> Bihu (Assam)
// "பொங்கல் ஏன் கொண்டாடப்படுகிறது?" -> Pongal (Tamil Nadu)
// "दीपावली क्यों मनाई जाती है?" -> Diwali (Pan-India)
// ==============================================================================

import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, useSearch, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Filter,
  CheckCircle2,
  HelpCircle,
  Compass,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocalization } from "@/lib/i18n";
import { multilingualSearch, type MultilingualSearchResult } from "@/lib/knowledge/multilingual-search";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: (search["q"] as string) ?? "",
  }),
  head: () => ({
    meta: [
      { title: "Multilingual Cultural Search — EKA Living Archive" },
      {
        name: "description",
        content: "Search living traditions, sacred places, and global cultural intelligence in your native language on EKA.",
      },
    ],
  }),
  component: PublicMultilingualSearchPage,
});

const SUGGESTED_MULTILINGUAL_QUERIES = [
  { text: "বিহু কিয় পালন কৰা হয়?", lang: "Assamese", entity: "bohag-bihu" },
  { text: "பொங்கல் ஏன் கொண்டாடப்படுகிறது?", lang: "Tamil", entity: "pongal" },
  { text: "दीपावली क्यों मनाई जाती है?", lang: "Hindi", entity: "diwali" },
  { text: "দুর্গা পূজা", lang: "Bengali", entity: "diwali" },
  { text: "মাজুলীৰ সত্ৰ কি?", lang: "Assamese", entity: "majuli-sattra-culture" },
  { text: "పాటણના પટોળા", lang: "Gujarati", entity: "patan-patola" },
  { text: "Why do people light lamps at dusk?", lang: "English", entity: "diwali" },
];

function PublicMultilingualSearchPage() {
  const { q } = useSearch({ from: "/search" });
  const navigate = useNavigate();
  const { locale, localeInfo, t } = useLocalization();

  const [searchTerm, setSearchTerm] = useState(q || "");

  useEffect(() => {
    setSearchTerm(q || "");
  }, [q]);

  // Sync debounced search param to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== q) {
        void navigate({ to: "/search", search: { q: searchTerm } });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, q, navigate]);

  const searchResults = useMemo<MultilingualSearchResult[]>(() => {
    if (!searchTerm.trim() || searchTerm.trim().length < 2) return [];
    return multilingualSearch(searchTerm.trim(), locale);
  }, [searchTerm, locale]);

  return (
    <div className="min-h-screen bg-sand/20 dark:bg-stone-950 text-foreground flex flex-col selection:bg-terracotta/20">
      <SiteHeader />

      <main id="main-content" className="flex-1 py-10 sm:py-16">
        <div className="container-eka max-w-4xl space-y-8">
          {/* Header & Prompt */}
          <div className="text-center space-y-3">
            <Badge
              variant="outline"
              className="border-primary/40 text-primary text-xs font-mono uppercase tracking-wider mb-1"
            >
              <Sparkles className="size-3 mr-1.5 inline" />
              Language-Independent Cultural Search
            </Badge>

            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Search the Living Cultural Archive
            </h1>

            <p className="font-serif text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore traditions, stories, sacred places, communities, crafts and wisdom in your native tongue.
            </p>
          </div>

          {/* Unified Intelligent Layer: Ask EKA Bridge */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                <Sparkles className="size-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-semibold text-foreground">Looking for deep answers & synthesis?</span>
                  <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">Universal Wisdom</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ask EKA connects Stories, Codex Guides, Living Sanghas, and Cultural Lineages into one synthesized answer.
                </p>
              </div>
            </div>
            <Link
              to="/ask"
              search={{ q: searchTerm || "", mode: "auto" } as any}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-all"
            >
              <span>Open Ask EKA</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <div className="relative flex items-center rounded-2xl border border-border/80 bg-background/90 shadow-calm backdrop-blur-md transition-all focus-within:border-primary focus-within:shadow-lift">
              <Search className="ml-4 size-5 text-muted-foreground shrink-0" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("search.askQuestion", "Search people, traditions, places, crafts, festivals...")}
                className="border-0 bg-transparent py-6 px-3.5 text-base sm:text-lg shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/70"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mr-4 text-xs font-mono text-muted-foreground hover:text-foreground px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Contextual IA Pathway Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground pt-1 border-b border-border/50 pb-4">
            <span className="font-mono text-[11px] uppercase tracking-wider">Contextual Pathways:</span>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/discover"
                className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-card/60 px-2.5 py-1 text-foreground/80 hover:text-foreground hover:border-primary/40"
              >
                <Compass className="size-3 text-terracotta" />
                <span>Discover Map</span>
              </Link>
              <Link
                to="/stories"
                className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-card/60 px-2.5 py-1 text-foreground/80 hover:text-foreground hover:border-primary/40"
              >
                <BookOpen className="size-3 text-forest" />
                <span>Reels & Stories</span>
              </Link>
              <Link
                to="/learn"
                className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-card/60 px-2.5 py-1 text-foreground/80 hover:text-foreground hover:border-primary/40"
              >
                <BookOpen className="size-3 text-saffron" />
                <span>Knowledge Codex</span>
              </Link>
              <Link
                to="/community"
                className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-card/60 px-2.5 py-1 text-foreground/80 hover:text-foreground hover:border-primary/40"
              >
                <Filter className="size-3 text-primary" />
                <span>Communities</span>
              </Link>
              <Link
                to="/ask"
                search={{ q: searchTerm || "" } as any}
                className="inline-flex items-center gap-1 rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1 text-primary font-medium hover:bg-primary/20"
              >
                <Sparkles className="size-3" />
                <span>Ask EKA AI</span>
              </Link>
            </div>
          </div>

          {/* Quick Query Pills */}
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Try searching natural questions:
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_MULTILINGUAL_QUERIES.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setSearchTerm(item.text)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs text-foreground/90 transition-all hover:border-primary/50 hover:bg-accent hover:text-primary"
                >
                  <span>{item.text}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">({item.lang})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results Display */}
          <div className="space-y-4 pt-4">
            {searchTerm.trim().length > 1 && (
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-sm font-medium text-foreground">
                  {searchResults.length > 0
                    ? `${searchResults.length} cultural entities resolved for "${searchTerm}"`
                    : `No exact matches for "${searchTerm}"`}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  Locale: {localeInfo.nativeName} ({localeInfo.code})
                </span>
              </div>
            )}

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {searchResults.map((result) => (
                  <div
                    key={result.canonicalSlug}
                    className="group relative rounded-2xl border border-border/80 bg-card/90 p-5 shadow-calm transition-all hover:border-primary/50 hover:shadow-lift"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-mono uppercase">
                            {result.type}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px] flex items-center gap-1">
                            <MapPin className="size-3 text-primary" />
                            {result.region}
                          </Badge>
                          {result.isDirectSemanticMatch && (
                            <Badge className="bg-emerald-600/90 text-white text-[10px] flex items-center gap-1">
                              <CheckCircle2 className="size-3" />
                              Semantic Query Match
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {result.title}
                        </h3>

                        <p className="font-serif text-sm text-primary/90 font-medium">
                          "{result.oneLiner}"
                        </p>

                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {result.summary}
                        </p>

                        {/* Contextual Action Pathways */}
                        <div className="flex flex-wrap items-center gap-3 pt-3 text-xs">
                          <span className="text-[11px] font-mono text-muted-foreground uppercase">Connect to:</span>
                          <Link
                            to="/stories"
                            className="text-terracotta hover:underline font-medium"
                          >
                            Stories & Reels →
                          </Link>
                          <Link
                            to="/discover"
                            className="text-forest hover:underline font-medium"
                          >
                            Place on Map →
                          </Link>
                          <Link
                            to="/community"
                            className="text-primary hover:underline font-medium"
                          >
                            Community Discussions →
                          </Link>
                          <Link
                            to="/ask"
                            search={{ q: `What is the cultural significance of ${result.title}?` } as any}
                            className="text-saffron hover:underline font-medium"
                          >
                            Ask EKA AI →
                          </Link>
                        </div>
                      </div>

                      <div className="shrink-0 pt-2 sm:pt-0">
                        <Link
                          to="/knowledge/$slug"
                          params={{ slug: result.canonicalSlug }}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-xs transition-all hover:bg-primary/90 hover:shadow-calm"
                        >
                          <span>Explore Entity</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm.trim().length > 1 ? (
              <div className="rounded-2xl border border-border/80 bg-card/60 p-12 text-center space-y-4">
                <HelpCircle className="size-10 text-muted-foreground/60 mx-auto" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {t("search.noResults")}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Try asking our universal cultural AI, or exploring through the interactive global map.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <Link
                    to="/ask"
                    search={{ q: searchTerm } as any}
                  >
                    <Button className="rounded-full text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                      <Sparkles className="size-3.5" />
                      <span>Ask EKA About "{searchTerm}"</span>
                    </Button>
                  </Link>
                  <Link to="/discover">
                    <Button variant="outline" className="rounded-full text-xs gap-1.5">
                      <Compass className="size-3.5 text-primary" />
                      <span>Explore on Cultural Map</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
