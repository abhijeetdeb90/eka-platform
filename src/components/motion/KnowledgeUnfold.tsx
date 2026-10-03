// ==============================================================================
// EKA MOTION COMPONENT: KnowledgeUnfold (Progressive Cultural Idea Unpacker)
// ==============================================================================
// Progressive disclosure of wisdom:
// 1. Core Insight / Idea Spark
// 2. Source Manuscript / Lineage Provenance
// 3. Deep Contextual Commentary
// 4. Actionable Takeaway / Sadhana Integration
// 5. Interconnected Wisdom Nodes
// ==============================================================================

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  BookOpen,
  Sparkles,
  Scroll,
  Flame,
  Bookmark,
  Share2,
  Check,
  Compass,
  ArrowRight,
} from "lucide-react";
import { Pressable } from "./Pressable";
import { Expandable } from "./Expandable";
import { epistemicTiers, type EpistemicTier } from "@/lib/tokens/theme";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface KnowledgeUnfoldData {
  id: string;
  spark: string;
  sourceText?: string;
  lineageOrAuthor?: string;
  eraOrDate?: string;
  epistemicTier?: EpistemicTier;
  context?: string;
  meaning?: string;
  actionablePractice?: string;
  relatedConcepts?: Array<{ label: string; slug: string }>;
}

interface KnowledgeUnfoldProps {
  data: KnowledgeUnfoldData;
  initiallyExpanded?: boolean;
  className?: string;
  onSave?: (id: string) => void;
}

export function KnowledgeUnfold({
  data,
  initiallyExpanded = false,
  className,
  onSave,
}: KnowledgeUnfoldProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [activeTab, setActiveTab] = useState<"context" | "meaning" | "practice">("meaning");
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const tierMeta = data.epistemicTier ? epistemicTiers[data.epistemicTier] : null;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`"${data.spark}" — ${data.sourceText || data.lineageOrAuthor || "EKA Wisdom"}`);
    setCopied(true);
    toast.success("Quote copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    if (onSave) onSave(data.id);
    toast.success(isSaved ? "Removed from your Sanctuary" : "Saved to your Sanctuary reflections");
  };

  return (
    <article
      className={cn(
        "rounded-2xl border border-border/70 bg-card/85 backdrop-blur-md overflow-hidden transition-all duration-300 shadow-calm hover:border-terracotta/30",
        className
      )}
    >
      {/* Top Bar: Epistemic Provenance & Quick Actions */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-border/40 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {tierMeta && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border",
                tierMeta.colorClass,
                tierMeta.bgClass,
                tierMeta.borderClass
              )}
            >
              <Sparkles className="size-2.5" />
              {tierMeta.badgeText}
            </span>
          )}

          {data.eraOrDate && (
            <span className="text-[11px] font-mono text-muted-foreground/80">
              {data.eraOrDate}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Pressable
            onClick={handleCopy}
            aria-label="Copy wisdom quote"
            className="size-8 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="size-3.5 text-emerald-500" /> : <Share2 className="size-3.5" />}
          </Pressable>

          <Pressable
            onClick={handleSave}
            aria-label="Save to Sanctuary"
            className="size-8 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bookmark className={cn("size-3.5", isSaved && "text-terracotta fill-terracotta")} />
          </Pressable>
        </div>
      </div>

      {/* Primary Card Body: The Spark (Bite-sized core insight) */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 cursor-pointer select-none group"
      >
        <p className="font-serif text-lg sm:text-xl font-normal leading-relaxed text-foreground tracking-tight group-hover:text-terracotta transition-colors">
          "{data.spark}"
        </p>

        {/* Source Citation Line */}
        {(data.sourceText || data.lineageOrAuthor) && (
          <div className="mt-3 flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Scroll className="size-3.5 text-saffron shrink-0" />
            <span className="font-medium text-foreground/85">{data.sourceText}</span>
            {data.lineageOrAuthor && (
              <>
                <span className="opacity-40">•</span>
                <span className="italic">{data.lineageOrAuthor}</span>
              </>
            )}
          </div>
        )}

        {/* Progressive Unfold Trigger Indicator */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/30 text-xs">
          <span className="text-terracotta font-medium flex items-center gap-1.5 group-hover:underline">
            <BookOpen className="size-3.5" />
            {isExpanded ? "Fold wisdom layers" : "Unfold deep commentary & practice"}
          </span>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-muted-foreground group-hover:text-foreground"
          >
            <ChevronDown className="size-4" />
          </motion.div>
        </div>
      </div>

      {/* Progressive Disclosure Layers */}
      <Expandable isExpanded={isExpanded}>
        <div className="px-5 pb-5 pt-1 border-t border-border/40 bg-sand/30 dark:bg-stone-900/40">
          {/* Tab Navigation for Progressive Layers */}
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/40 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab("meaning")}
              className={cn(
                "px-3 py-1 rounded-full font-mono text-xs transition-all",
                activeTab === "meaning"
                  ? "bg-terracotta text-white shadow-xs font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Essential Meaning
            </button>
            <button
              onClick={() => setActiveTab("context")}
              className={cn(
                "px-3 py-1 rounded-full font-mono text-xs transition-all",
                activeTab === "context"
                  ? "bg-terracotta text-white shadow-xs font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Historical & Cultural Context
            </button>
            <button
              onClick={() => setActiveTab("practice")}
              className={cn(
                "px-3 py-1 rounded-full font-mono text-xs transition-all",
                activeTab === "practice"
                  ? "bg-terracotta text-white shadow-xs font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Daily Sadhana / Practice
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="text-sm leading-relaxed text-muted-foreground">
            {activeTab === "meaning" && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <p className="text-foreground/90 font-serif text-base leading-relaxed">
                  {data.meaning ||
                    "This teaching highlights that truth is not a mental construct, but a living realization born from silent attention to unbroken flow."}
                </p>
              </motion.div>
            )}

            {activeTab === "context" && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <p>
                  {data.context ||
                    "Preserved in palm-leaf manuscripts and maintained through unbroken teacher-disciple lineages across the Nilgiri hills and Kerala ghats."}
                </p>
              </motion.div>
            )}

            {activeTab === "practice" && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-saffron/30 bg-amber-500/10 p-3 text-amber-950 dark:text-amber-200"
              >
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider mb-1 text-saffron">
                  <Flame className="size-3" />
                  Takeaway Practice
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  {data.actionablePractice ||
                    "Pause for 60 seconds before speaking in a tense discussion. Inhale awareness of the space between words."}
                </p>
              </motion.div>
            )}
          </div>

          {/* Related Interconnected Concept Tags */}
          {data.relatedConcepts && data.relatedConcepts.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border/30 flex items-center gap-2 flex-wrap text-xs">
              <span className="font-mono text-[10px] uppercase text-muted-foreground tracking-wider flex items-center gap-1">
                <Compass className="size-3 text-terracotta" />
                Interconnected:
              </span>
              {data.relatedConcepts.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-accent/70 hover:bg-accent text-accent-foreground font-mono text-[11px] cursor-pointer transition-colors"
                >
                  {item.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </Expandable>
    </article>
  );
}
