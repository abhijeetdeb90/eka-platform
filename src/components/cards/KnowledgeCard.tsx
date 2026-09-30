// ==============================================================================
// EKA CARD PRIMITIVE: KnowledgeCard
// ==============================================================================
import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Scroll, Bookmark, Share2, Compass, ArrowUpRight } from "lucide-react";
import { AnimatedCard } from "@/components/motion/AnimatedCard";
import { Pressable } from "@/components/motion/Pressable";
import { epistemicTiers, type EpistemicTier, intentTriggers } from "@/lib/tokens/theme";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface KnowledgeCardProps {
  id: string;
  spark: string;
  sourceText?: string;
  traditionOrAuthor?: string;
  category: string;
  epistemicTier?: EpistemicTier;
  tags?: string[];
  takeaway?: string;
  actionTo?: string;
  className?: string;
  onIntent?: (intent: string) => void;
}

export function KnowledgeCard({
  id,
  spark,
  sourceText,
  traditionOrAuthor,
  category,
  epistemicTier = "DOCUMENTED",
  tags = [],
  takeaway,
  actionTo,
  className,
  onIntent,
}: KnowledgeCardProps) {
  const [saved, setSaved] = useState(false);
  const tierMeta = epistemicTiers[epistemicTier];

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    toast.success(saved ? "Removed from Sanctuary." : "Saved to your Sanctuary reflections.");
  };

  const handleTriggerIntent = (e: React.MouseEvent, type: "INTO_THIS" | "SHOW_MORE") => {
    e.stopPropagation();
    const config = intentTriggers[type];
    toast.success(config.successFeedback);
    if (onIntent) onIntent(type);
  };

  const content = (
    <div
      className={cn(
        "flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl md:rounded-3xl border border-border/70 bg-card/90 backdrop-blur-md transition-colors hover:border-terracotta/40 shadow-calm",
        className
      )}
    >
      <div>
        {/* Header: Category & Epistemic Provenance */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-terracotta bg-terracotta/10 px-2.5 py-1 rounded-full border border-terracotta/20">
            {category}
          </span>

          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border",
                tierMeta.colorClass,
                tierMeta.bgClass,
                tierMeta.borderClass
              )}
            >
              <Sparkles className="size-2.5" />
              {tierMeta.badgeText}
            </span>

            <Pressable
              onClick={handleSave}
              aria-label="Save to Sanctuary"
              className="size-7 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bookmark className={cn("size-3.5", saved && "text-terracotta fill-terracotta")} />
            </Pressable>
          </div>
        </div>

        {/* Core Wisdom Quote */}
        <blockquote className="font-serif text-lg sm:text-xl font-normal leading-relaxed text-foreground tracking-tight line-clamp-4">
          "{spark}"
        </blockquote>

        {/* Source & Lineage */}
        {(sourceText || traditionOrAuthor) && (
          <div className="mt-3 flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Scroll className="size-3.5 text-saffron shrink-0" />
            <span className="font-medium text-foreground/80">{sourceText}</span>
            {traditionOrAuthor && (
              <>
                <span className="opacity-40">•</span>
                <span className="italic">{traditionOrAuthor}</span>
              </>
            )}
          </div>
        )}

        {takeaway && (
          <p className="mt-3 p-2.5 rounded-xl bg-sand/50 dark:bg-stone-900/50 text-xs text-muted-foreground line-clamp-2 border border-border/40 font-sans leading-relaxed">
            <strong className="text-foreground/80 font-medium">Core Reflection: </strong>
            {takeaway}
          </p>
        )}
      </div>

      {/* Footer Intent Triggers */}
      <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Pressable
            onClick={(e) => handleTriggerIntent(e, "INTO_THIS")}
            className="px-2.5 py-1 rounded-full text-xs font-mono bg-accent/60 hover:bg-terracotta hover:text-white transition-colors border border-border/50 text-muted-foreground"
          >
            I'm into this
          </Pressable>
          <Pressable
            onClick={(e) => handleTriggerIntent(e, "SHOW_MORE")}
            className="px-2.5 py-1 rounded-full text-xs font-mono bg-accent/60 hover:bg-accent text-foreground transition-colors border border-border/50"
          >
            Show me more
          </Pressable>
        </div>

        {actionTo && (
          <span className="text-xs font-mono text-muted-foreground group-hover:text-terracotta flex items-center gap-0.5">
            Explore <ArrowUpRight className="size-3" />
          </span>
        )}
      </div>
    </div>
  );

  return (
    <AnimatedCard className="h-full">
      {actionTo ? (
        <Link to={actionTo} className="block h-full">
          {content}
        </Link>
      ) : (
        content
      )}
    </AnimatedCard>
  );
}
