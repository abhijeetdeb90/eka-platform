import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Search,
  X,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  MapPin,
  RefreshCw,
  Lock,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  askEkaCulturalEngine,
  generateQuestionsForSubject,
  getCuriosityLoops,
  type CulturalInquiryResult,
  type CuriosityLoopItem,
} from "@/lib/cultural-intelligence";
import { useMonetizationTier, CORE_PHILOSOPHY } from "@/lib/monetization";
import { toast } from "sonner";

export interface ContextualAskEkaTarget {
  title: string;
  location?: string;
  category?: string;
  initialQuestion?: string;
  preloadedSummary?: string;
}

interface ContextualAskEkaModalProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  target?: ContextualAskEkaTarget | null;
}

const DEFAULT_SUGGESTED_PROMPTS = [
  { icon: "🌍", text: "Why do people celebrate this?", query: "Why do people celebrate this cultural festival?" },
  { icon: "🕯️", text: "What does this ritual mean?", query: "What does this ritual mean and what is its spiritual root?" },
  { icon: "🍛", text: "Why is this food important?", query: "Why is this sacred food important to the community?" },
  { icon: "🛕", text: "What happens inside this sacred place?", query: "What happens inside this sacred place and what etiquette should I follow?" },
  { icon: "👘", text: "What does this clothing represent?", query: "What does this traditional clothing and weaving represent?" },
  { icon: "🗣️", text: "Where did this language come from?", query: "Where did this ancestral language come from and how is it spoken?" },
  { icon: "💍", text: "How do people get married here?", query: "How do wedding rituals work here and what vows are exchanged?" },
  { icon: "🎉", text: "What festival is happening today?", query: "What festivals are celebrated during this season across cultures?" },
  { icon: "🧬", text: "How did this tradition evolve?", query: "How did this tradition evolve over the last 500 years?" },
  { icon: "🤝", text: "What should I know before visiting?", query: "What cultural etiquette and customs should I know before visiting this community?" },
];

export function ContextualAskEkaModal({
  open,
  isOpen,
  onOpenChange,
  onClose,
  target,
}: ContextualAskEkaModalProps) {
  const isModalOpen = open ?? isOpen ?? false;
  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange?.(nextOpen);
    if (!nextOpen) onClose?.();
  };

  const { canUseIntelligence, setTier } = useMonetizationTier();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CulturalInquiryResult | null>(null);
  const [curiosityLoops, setCuriosityLoops] = useState<CuriosityLoopItem[]>([]);

  // When target changes, set up contextual question and chips
  useEffect(() => {
    if (target) {
      const defaultQ =
        target.initialQuestion ||
        `Why is ${target.title} important in ${target.location || "this culture"}?`;
      setQuery(defaultQ);
      setCuriosityLoops(getCuriosityLoops(target.title));
      // Auto-fetch if initialQuestion was explicitly provided
      if (target.initialQuestion) {
        void handleExecuteQuery(defaultQ);
      } else {
        setResult(null);
      }
    } else {
      setQuery("");
      setResult(null);
      setCuriosityLoops(getCuriosityLoops("culture"));
    }
  }, [target, isModalOpen]);

  const handleExecuteQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setQuery(queryText);

    try {
      const contextPrefix = target ? `[Context: ${target.title} in ${target.location || "Global"}] ` : "";
      const res = await askEkaCulturalEngine(`${contextPrefix}${queryText}`);
      setResult(res);
      setCuriosityLoops(getCuriosityLoops(queryText));
    } catch {
      toast.error("Unable to connect to Cultural Intelligence engine. Using verified archives.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleExecuteQuery(query);
  };

  const handleSelectPrompt = (promptText: string) => {
    void handleExecuteQuery(promptText);
  };

  const dimensionalSet = target
    ? generateQuestionsForSubject(
        target.title,
        target.category || "tradition",
        target.location || "World",
        target.preloadedSummary
      )
    : null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border border-border/80 bg-background shadow-2xl text-foreground scrollbar-thin"
        data-testid="contextual-ask-eka-modal"
      >
          {/* Modal Header */}
          <div className="relative border-b border-border/60 bg-sand/15 p-6 sm:p-7">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-mono uppercase tracking-wider text-primary font-semibold">
                <Sparkles className="size-3 text-saffron" />
                EKA Cultural Guide
              </span>
              {!canUseIntelligence ? (
                <span className="inline-flex items-center gap-1 text-xs font-mono text-terracotta font-semibold">
                  <Lock className="size-3" /> EKA+ Intelligence
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">• Trusted Intelligence</span>
              )}
            </div>

            <DialogTitle className="font-serif text-2xl sm:text-3xl font-normal text-foreground">
              {target ? (
                <>
                  I can help you understand{" "}
                  <span className="italic font-medium text-primary">{target.title}</span>.
                </>
              ) : (
                <>
                  Ask EKA {!canUseIntelligence && <Lock className="inline size-5 text-saffron align-middle" />}
                </>
              )}
            </DialogTitle>

            <DialogDescription className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {target ? (
                target.location ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3 text-terracotta" />
                    {target.location} · What would you like to know?
                  </span>
                ) : (
                  "What would you like to know about this living tradition?"
                )
              ) : (
                "Understand the world, one question at a time."
              )}
            </DialogDescription>

            {!canUseIntelligence && (
              <div className="mt-2.5 rounded-xl border border-primary/30 bg-primary/5 p-2.5 text-xs text-primary font-serif italic">
                "{CORE_PHILOSOPHY.subscriptionHook}"
              </div>
            )}
          </div>

        {/* Query Input Section */}
        <div className="p-6 sm:p-7 space-y-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-card px-4 py-3 shadow-inner focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="size-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you curious about?"
                className="w-full bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
                data-testid="ask-eka-modal-input"
              />
              <Button
                type="submit"
                size="sm"
                disabled={isLoading || !query.trim()}
                className="rounded-full text-xs shrink-0 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? (
                  <RefreshCw className="size-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Ask</span>
                    <ArrowRight className="size-3.5" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Quick Question Chips */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              {target ? "Questions you can ask about this" : "Suggested questions to explore"}
            </span>

            <div className="flex flex-wrap gap-2">
              {dimensionalSet
                ? dimensionalSet.questions.slice(0, 6).map((q) => (
                    <button
                      key={q.question}
                      type="button"
                      onClick={() => handleSelectPrompt(q.question)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs text-foreground hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      <span className="text-[10px] font-mono text-primary font-bold">
                        {q.label}
                      </span>
                      <span>{q.question}</span>
                    </button>
                  ))
                : DEFAULT_SUGGESTED_PROMPTS.slice(0, 6).map((p) => (
                    <button
                      key={p.text}
                      type="button"
                      onClick={() => handleSelectPrompt(p.query)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs text-foreground hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <span>{p.icon}</span>
                      <span>{p.text}</span>
                    </button>
                  ))}
            </div>
          </div>

          {/* Answer Display */}
          {isLoading && (
            <div className="rounded-2xl border border-border/60 bg-sand/10 p-6 text-center space-y-2">
              <RefreshCw className="size-5 animate-spin mx-auto text-primary" />
              <p className="text-sm font-medium text-foreground">
                Retrieving verified cultural knowledge…
              </p>
              <p className="text-xs text-muted-foreground">
                Grounded in primary sources · Zero hallucination
              </p>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-5 rounded-2xl border border-primary/20 bg-card p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  Cultural Intelligence Answer
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {result.aiExplanation.poweredBy}
                </span>
              </div>

              {/* 1. Concise Summary */}
              <div className="space-y-1">
                <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Direct Understanding
                </h4>
                <p className="text-sm sm:text-base font-serif text-foreground leading-relaxed">
                  {result.aiExplanation.summary}
                </p>
              </div>

              {/* 2. Deep Meaning & Context */}
              <div className="space-y-1.5 rounded-xl border border-border/60 bg-muted/40 p-3.5 text-xs sm:text-sm">
                <h5 className="font-mono text-[11px] uppercase tracking-wider text-terracotta font-semibold">
                  Why it matters
                </h5>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {result.aiExplanation.deepExplanation}
                </p>
              </div>

              {/* 3. Respectful Visitor Etiquette */}
              {result.aiExplanation.visitorGuidance && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-xs">
                  <span className="font-mono font-semibold uppercase tracking-wider text-emerald-700 block mb-1">
                    What to know before visiting
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    {result.aiExplanation.visitorGuidance}
                  </p>
                </div>
              )}

              {/* Verified Sources / Trust Layer */}
              {result.verifiedSources && result.verifiedSources.length > 0 && (
                <div className="border-t border-border/50 pt-3 text-[11px] text-muted-foreground flex flex-wrap items-center gap-2">
                  <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium text-foreground">Verified source:</span>
                  <span>{result.verifiedSources[0]?.title}</span>
                  <span className="text-muted-foreground/60">
                    ({result.verifiedSources[0]?.citationRef})
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 7. "You might also wonder..." Curiosity Loops */}
          <div className="border-t border-border/60 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif text-sm font-medium text-foreground flex items-center gap-1.5">
                <Compass className="size-3.5 text-primary" />
                You might also wonder…
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                Knowledge connections
              </span>
            </div>

            <div className="grid gap-2">
              {curiosityLoops.map((loop) => (
                <button
                  key={loop.question}
                  type="button"
                  onClick={() => handleSelectPrompt(loop.question)}
                  className="group flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-card p-3 text-left transition-all hover:border-primary/60 hover:bg-primary/5"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-base shrink-0">{loop.icon}</span>
                    <div>
                      <p className="text-xs sm:text-sm font-normal text-foreground group-hover:text-primary transition-colors">
                        {loop.question}
                      </p>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {loop.connectedCulture}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="size-3.5 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-1 group-hover:text-primary mt-1" />
                </button>
              ))}
            </div>
          </div>

          {/* EKA+ Conversion & Preview Ribbon for Free Users */}
          {!canUseIntelligence && (
            <div className="rounded-2xl border border-primary/30 bg-sand/20 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-terracotta font-semibold block">
                  Understand more with EKA AI
                </span>
                <p className="text-xs sm:text-sm font-serif text-foreground mt-0.5">
                  Knowledge is free. Intelligence is paid. Unlock unlimited inquiries, comparisons & primary sources.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button asChild size="sm" className="rounded-full text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link to="/membership">Get EKA+ (₹299/mo)</Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setTier("plus");
                    toast.success("EKA+ preview activated!");
                  }}
                  className="rounded-full text-xs border-primary/40 text-primary hover:bg-primary/5"
                >
                  Preview EKA+
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
