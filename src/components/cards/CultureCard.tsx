// ==============================================================================
// EKA CARD PRIMITIVE: CultureCard
// ==============================================================================
import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Sparkles, Bookmark, Heart, ArrowUpRight } from "lucide-react";
import { AnimatedCard } from "@/components/motion/AnimatedCard";
import { Pressable } from "@/components/motion/Pressable";
import { epistemicTiers, type EpistemicTier, intentTriggers } from "@/lib/tokens/theme";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface CultureCardProps {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  region: string;
  imageUrl: string;
  epistemicTier?: EpistemicTier;
  lineageYears?: string;
  actionTo?: string;
  className?: string;
  onIntent?: (intent: string) => void;
}

export function CultureCard({
  id,
  title,
  subtitle,
  category,
  region,
  imageUrl,
  epistemicTier = "LIVING_PRACTICE",
  lineageYears,
  actionTo,
  className,
  onIntent,
}: CultureCardProps) {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const tierMeta = epistemicTiers[epistemicTier];

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    toast.success(saved ? "Removed from Sanctuary." : "Saved to your Sanctuary collections.");
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    toast.success(liked ? "Cultural resonance updated." : "Added to your cultural resonance.");
    if (onIntent) onIntent("INTO_THIS");
  };

  const content = (
    <div
      className={cn(
        "relative flex flex-col justify-end overflow-hidden rounded-2xl md:rounded-3xl border border-border/70 bg-neutral-950 aspect-[4/5] text-white shadow-calm group",
        className
      )}
    >
      {/* Background Media */}
      <img
        src={imageUrl}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Atmospheric Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20 pointer-events-none" />

      {/* Top Header */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
          {category}
        </span>

        <div className="flex items-center gap-1.5">
          <Pressable
            onClick={handleLike}
            aria-label="Heart cultural moment"
            className="size-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/80 hover:text-white"
          >
            <Heart className={cn("size-3.5", liked && "text-red-500 fill-red-500")} />
          </Pressable>
          <Pressable
            onClick={handleSave}
            aria-label="Save to Sanctuary"
            className="size-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/80 hover:text-white"
          >
            <Bookmark className={cn("size-3.5", saved && "text-saffron fill-saffron")} />
          </Pressable>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2 mb-1.5 text-xs text-white/70 font-mono">
          <span className="flex items-center gap-1">
            <MapPin className="size-3 text-terracotta" />
            {region}
          </span>
          {lineageYears && (
            <>
              <span>•</span>
              <span className="text-amber-300/90 font-medium">{lineageYears} unbroken</span>
            </>
          )}
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-normal leading-tight text-white group-hover:text-amber-200 transition-colors">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1.5 text-xs sm:text-sm text-white/80 line-clamp-2 font-light leading-relaxed">
            {subtitle}
          </p>
        )}

        <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
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

          <span className="text-[11px] font-mono text-white/70 group-hover:text-white flex items-center gap-1">
            Explore Heritage <ArrowUpRight className="size-3" />
          </span>
        </div>
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
