import React, { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Globe,
  RefreshCw,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  Flame,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { track } from "@/lib/analytics";
import {
  fetchGroundedCulturalSearch,
} from "@/lib/search/grounded-search-client";
import type { GroundedSearchResult } from "@/routes/api/public/search.grounded";

export interface GroundedCulturalSearchProps {
  initialQuery?: string;
  className?: string;
  variant?: "full" | "compact" | "card";
  onResultLoaded?: (result: GroundedSearchResult) => void;
}

const CURATED_GROUNDED_SUGGESTIONS = [
  "Sacred geometry of Varanasi Ganga Aarti",
  "Living traditions of Tulu Nadu Bhoota Kola",
  "How Bishnoi villagers protect desert wildlife",
  "Origins and contemplation in Zen tea ceremony",
  "Why the Aranmula mirror contains no glass",
  "Durga Puja in Bengal vs Pan-India Navratri",
];

export function GroundedCulturalSearch({
  initialQuery = "",
  className = "",
  variant = "full",
  onResultLoaded,
}: GroundedCulturalSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GroundedSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const performSearch = async (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setActiveQuery(trimmed);
    track("grounded_search_executed", { query: trimmed });

    try {
      const data = await fetchGroundedCulturalSearch(trimmed);
      setResult(data);
      if (onResultLoaded) onResultLoaded(data);
    } catch (err: any) {
      console.error("[GroundedCulturalSearch] Error:", err);
      setError(err?.message || "Failed to retrieve verified cultural information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery && initialQuery !== activeQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  const handleCopy = () => {
    if (!result?.answer) return;
    navigator.clipboard.writeText(`${result.query}\n\n${result.answer}\n\nVerified via EKA Google Search Grounding.`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-3xl border border-border/80 bg-card/80 p-5 sm:p-7 shadow-calm backdrop-blur-xs transition-all ${className}`}
    >
      {/* Header with Google Grounding Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4 mb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-terracotta">
              Google Search Grounding
            </span>
            <Badge
              variant="outline"
              className="text-[11px] font-mono border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 gap-1"
            >
              <ShieldCheck className="size-3" />
              Live Verified Canon
            </Badge>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
            Up-to-Date Cultural & Spiritual Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-light">
            Directly grounded in real-time Google Search sources with EKA's 5-tier epistemic verification standards.
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any cultural ritual, festival, sacred place, or lineage..."
            className="rounded-full pl-11 pr-4 bg-background/90 text-sm shadow-2xs h-12 border-border/80 focus-visible:ring-primary/30"
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !query.trim()}
          className="rounded-full px-6 h-12 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 gap-2 font-medium shadow-calm"
        >
          {loading ? (
            <>
              <RefreshCw className="size-4 animate-spin" />
              <span className="hidden sm:inline">Grounding...</span>
            </>
          ) : (
            <>
              <Sparkles className="size-4 text-saffron" />
              <span>Search & Verify</span>
            </>
          )}
        </Button>
      </form>

      {/* Curated Suggestion Chips */}
      <div className="flex flex-wrap items-center gap-1.5 mb-6">
        <span className="text-xs text-muted-foreground font-medium mr-1 flex items-center gap-1">
          <Flame className="size-3 text-terracotta" />
          Inquiries:
        </span>
        {CURATED_GROUNDED_SUGGESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleSuggestionClick(item)}
            className="rounded-full bg-background/70 hover:bg-accent/60 border border-border/70 hover:border-primary/50 px-3 py-1 text-xs text-foreground/80 hover:text-foreground transition-all shadow-2xs"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="rounded-2xl border border-border/60 bg-background/60 p-6 space-y-4 animate-pulse">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <RefreshCw className="size-3.5 animate-spin text-terracotta" />
            <span>Consulting Google Search grounding index and EKA verified epistemic canon...</span>
          </div>
          <div className="h-4 bg-muted/60 rounded-md w-3/4" />
          <div className="h-4 bg-muted/50 rounded-md w-full" />
          <div className="h-4 bg-muted/40 rounded-md w-5/6" />
        </div>
      )}

      {/* Error View */}
      {error && !loading && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-xs text-destructive flex items-start gap-2">
          <Info className="size-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Verification Notice</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Search Result Display */}
      {result && !loading && (
        <div className="rounded-2xl border border-primary/20 bg-background/90 p-5 sm:p-6 shadow-xs space-y-5 animate-in fade-in-50 duration-300">
          {/* Result Subheader */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div>
              <span className="font-mono text-[11px] text-muted-foreground">Inquiry Verified:</span>
              <h3 className="font-serif text-lg font-bold text-foreground">
                "{result.query}"
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="text-[10px] font-mono bg-accent/70 text-accent-foreground"
              >
                {result.model}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                {copied ? <Check className="size-3 mr-1 text-emerald-600" /> : <Copy className="size-3 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Synthesized Verified Knowledge */}
          <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed font-light whitespace-pre-line">
            {result.answer}
          </div>

          {/* Google Search Queries Grounded */}
          {result.searchQueries && result.searchQueries.length > 0 && (
            <div className="pt-2 border-t border-border/40">
              <p className="text-[11px] font-mono text-muted-foreground mb-1.5 flex items-center gap-1">
                <Search className="size-3" />
                Grounding Web Queries Executed:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.searchQueries.map((sq, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-accent/40 text-foreground border border-border/60"
                  >
                    "{sq}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Authoritative Grounding Sources */}
          {result.sources && result.sources.length > 0 && (
            <div className="pt-3 border-t border-border/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-foreground flex items-center gap-1.5">
                  <Globe className="size-3.5 text-terracotta" />
                  Verified Citations & Grounding Sources ({result.sources.length})
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  Click to inspect primary citations
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.sources.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between p-2.5 rounded-xl border border-border/70 bg-card/60 hover:bg-accent/40 hover:border-primary/50 transition-all text-left shadow-2xs"
                  >
                    <div className="space-y-0.5 min-w-0 pr-2">
                      <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {src.title}
                      </p>
                      {src.domain && (
                        <p className="text-[10px] font-mono text-muted-foreground truncate">
                          {src.domain}
                        </p>
                      )}
                    </div>
                    <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors mt-0.5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
