import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Search,
  Scroll,
  Layers,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  askEkaKnowledge,
  type AskEkaKnowledgeResult,
} from "@/lib/ai-knowledge";

interface CreatorProductivityProps {
  onAttachToDraft: (researchData: {
    title: string;
    caption: string;
    topic: string;
    sources: string;
  }) => void;
}

const PRESET_TOPICS = [
  "Majuli Island handloom weaving traditions and sattras",
  "The metaphysical meaning of lighting brass lamps at dusk",
  "Varanasi silk weaving lineages and master guilds",
  "Symbolism of traditional floor patterns across Bengal and Tamil Nadu",
  "Chamba Rumal embroidery: Double-sided satin stitch heritage",
  "Bishnoi sacred ecological principles and wildlife preservation",
];

export function CreatorProductivity({ onAttachToDraft }: CreatorProductivityProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AskEkaKnowledgeResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSearch = async (customQuery?: string) => {
    const q = customQuery !== undefined ? customQuery : query;
    if (!q.trim()) {
      toast.error("Please enter a cultural inquiry topic.");
      return;
    }

    setLoading(true);
    try {
      const res = await askEkaKnowledge(q, "what_is");
      setResult(res);
      toast.success("Cultural intelligence retrieved with primary sources.");
    } catch (err: any) {
      toast.error(`Research retrieval error: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUseResearchInDraft = () => {
    if (!result) return;

    const sourcesSummary = result.sources
      .map((s) => `${s.title} (${s.kind}${s.century ? `, ${s.century}` : ""}): ${s.citation}`)
      .join("\n");

    const draftedCaption = `${result.summary}\n\nKey Cultural Significance:\n${result.explanation.slice(
      0,
      300
    )}…\n\nVerified Sources:\n${sourcesSummary}`;

    onAttachToDraft({
      title: result.topic,
      caption: draftedCaption,
      topic: result.tradition || "Traditions",
      sources: sourcesSummary,
    });

    toast.success("Attached research to a new story draft in Content Management!");
  };

  const handleCopySummary = () => {
    if (!result) return;
    navigator.clipboard.writeText(
      `${result.topic}\n\n${result.summary}\n\nVerified Sources:\n` +
        result.sources.map((s) => `• ${s.title}: ${s.citation}`).join("\n")
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Research copied to clipboard.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header */}
      <div className="border-b border-border/60 pb-5">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-mono uppercase border-primary/40 text-primary">
            <Sparkles className="size-3 mr-1 inline" />
            EKA+ Research Engine
          </Badge>
        </div>
        <h2 className="font-serif text-xl font-semibold text-foreground mt-2">
          Ask EKA AI — Cultural Research & Citation Tool
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl leading-relaxed">
          Ground your stories and videos in primary manuscript citations, living traditions, and verified lineage
          contexts. Seamlessly convert research findings into published stories.
        </p>
      </div>

      {/* 2. Research Query Input */}
      <div className="space-y-3 max-w-3xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSearch();
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Research a ritual, festival, sacred place, craft, or philosophy…"
              className="pl-10 h-11 text-xs rounded-2xl bg-card border-border/80"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 rounded-2xl px-5 text-xs bg-primary text-primary-foreground font-medium"
          >
            {loading ? "Researching…" : "Inquire"}
          </Button>
        </form>

        {/* Curated Inquiries Chips */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Suggested Inquiries:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  setQuery(topic);
                  void handleSearch(topic);
                }}
                className="rounded-full border border-border/70 bg-card px-3 py-1 text-[11px] text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Research Results Card */}
      {result && (
        <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 space-y-6 shadow-calm animate-in fade-in max-w-4xl">
          {/* Top Result Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                  {result.tradition || "Cultural Lineage"}
                </Badge>
                <span className="text-xs text-muted-foreground">Verified Grounded Inquiry</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mt-1">{result.topic}</h3>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopySummary}
                className="rounded-full text-xs h-8 px-3"
              >
                {copied ? <Check className="size-3.5 mr-1.5 text-emerald-600" /> : <Copy className="size-3.5 mr-1.5" />}
                <span>{copied ? "Copied" : "Copy Citations"}</span>
              </Button>
              <Button
                size="sm"
                onClick={handleUseResearchInDraft}
                className="rounded-full text-xs h-8 px-3 bg-primary text-primary-foreground gap-1.5"
              >
                <Plus className="size-3.5" />
                <span>Attach to Story Draft</span>
              </Button>
            </div>
          </div>

          {/* Epistemic Summary & Detailed Explanation */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-sand/30 border border-primary/15 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary font-mono">
                Epistemic Synthesis
              </span>
              <p className="text-sm font-serif text-foreground leading-relaxed">{result.summary}</p>
            </div>

            <div className="space-y-2 text-xs text-foreground/90 leading-relaxed font-light">
              <span className="font-semibold uppercase tracking-wider text-muted-foreground font-mono text-[10px]">
                Historical & Lineage Context
              </span>
              <p className="whitespace-pre-wrap">{result.explanation}</p>
            </div>
          </div>

          {/* Primary Sources & Citations */}
          {result.sources.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-border/60">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-mono">
                <Scroll className="size-3.5 text-primary" />
                <span>Primary Manuscript & Scholarly Sources</span>
              </h4>

              <div className="grid gap-3 sm:grid-cols-2">
                {result.sources.map((src, idx) => (
                  <div key={idx} className="rounded-xl border border-border/80 bg-background/60 p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-xs text-foreground">{src.title}</span>
                      <Badge variant="outline" className="text-[10px] py-0 px-1 font-mono">
                        {src.kind}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{src.citation}</p>
                    {src.century && (
                      <p className="text-[10px] text-primary/80 font-mono">Historical Era: {src.century}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regional Variations */}
          {result.regionalVariations.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-border/60">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-mono">
                <Layers className="size-3.5 text-amber-600" />
                <span>Regional & Lineage Variations</span>
              </h4>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {result.regionalVariations.map((reg, idx) => (
                  <div key={idx} className="rounded-xl border border-border/70 p-3 space-y-1 bg-background/40">
                    <span className="font-semibold text-xs text-foreground">{reg.region}</span>
                    <p className="text-[11px] text-muted-foreground leading-snug">{reg.practice}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
