// ==============================================================================
// EKA CARD PRIMITIVE: TraditionCard
// ==============================================================================
import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, Flame, Bookmark, ArrowUpRight } from "lucide-react";
import { AnimatedCard } from "@/components/motion/AnimatedCard";
import { Pressable } from "@/components/motion/Pressable";
import { epistemicTiers, type EpistemicTier } from "@/lib/tokens/theme";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface TraditionCardProps {
  id: string;
  name: string;
  lineage: string;
  origin: string;
  status: "UNBROKEN" | "REVIVING" | "SACRED_GUILD" | "ENDANGERED";
  description: string;
  giTagNumber?: string;
  imageUrl?: string;
  epistemicTier?: EpistemicTier;
  actionTo?: string;
  className?: string;
}

export function TraditionCard({
  id,
  name,
  lineage,
  origin,
  status = "UNBROKEN",
  description,
  giTagNumber,
  imageUrl,
  epistemicTier = "LIVING_PRACTICE",
  actionTo,
  className,
}: TraditionCardProps) {
  const [saved, setSaved] = useState(false);
  const tierMeta = epistemicTiers[epistemicTier];

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    toast.success(saved ? "Removed from Tradition archives." : "Saved to your Sanctuary lineages.");
  };

  const statusConfig = {
    UNBROKEN: { label: "Unbroken Lineage", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    REVIVING: { label: "Reviving Tradition", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    SACRED_GUILD: { label: "Sacred Guild", color: "text-saffron bg-saffron/10 border-saffron/20" },
    ENDANGERED: { label: "Critical Preservation", color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
  }[status];

  const content = (
    <div
      className={cn(
        "flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl md:rounded-3xl border border-border/70 bg-card/90 backdrop-blur-md shadow-calm hover:border-terracotta/40 transition-colors",
        className
      )}
    >
      <div>
        {imageUrl && (
          <div className="w-full h-36 rounded-xl overflow-hidden mb-4 relative">
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {giTagNumber && (
              <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/20">
                GI Tag #{giTagNumber}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span
            className={cn(
              "text-[10px] font-mono uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full border",
              statusConfig.color
            )}
          >
            {statusConfig.label}
          </span>

          <Pressable
            onClick={handleSave}
            aria-label="Save tradition"
            className="size-7 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bookmark className={cn("size-3.5", saved && "text-terracotta fill-terracotta")} />
          </Pressable>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-normal leading-tight text-foreground group-hover:text-terracotta transition-colors">
          {name}
        </h3>

        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground mt-1 mb-2">
          <span>{lineage}</span>
          <span>•</span>
          <span>{origin}</span>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between text-xs">
        <span className="text-[11px] font-mono text-terracotta font-medium flex items-center gap-1">
          <Flame className="size-3" />
          Living Archive
        </span>

        {actionTo && (
          <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground flex items-center gap-0.5">
            Read Lineage Codex <ArrowUpRight className="size-3" />
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
