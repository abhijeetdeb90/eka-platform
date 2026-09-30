// ==============================================================================
// EKA CARD PRIMITIVE: PlaceCard
// ==============================================================================
import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Compass, Bookmark, Navigation, ArrowUpRight } from "lucide-react";
import { AnimatedCard } from "@/components/motion/AnimatedCard";
import { Pressable } from "@/components/motion/Pressable";
import { epistemicTiers, type EpistemicTier, intentTriggers } from "@/lib/tokens/theme";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface PlaceCardProps {
  id: string;
  name: string;
  significance: string;
  state: string;
  country?: string;
  imageUrl: string;
  epistemicTier?: EpistemicTier;
  altitudeOrCoords?: string;
  bestSeason?: string;
  actionTo?: string;
  className?: string;
  onConsider?: () => void;
}

export function PlaceCard({
  id,
  name,
  significance,
  state,
  country = "India",
  imageUrl,
  epistemicTier = "SACRED_GEOGRAPHY",
  altitudeOrCoords,
  bestSeason,
  actionTo,
  className,
  onConsider,
}: PlaceCardProps) {
  const [saved, setSaved] = useState(false);
  const [considered, setConsidered] = useState(false);
  const tierMeta = epistemicTiers[epistemicTier];

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    toast.success(saved ? "Removed from pilgrimage wishlist." : "Saved to your pilgrimage wishlist.");
  };

  const handleConsider = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConsidered(!considered);
    const config = intentTriggers.CONSIDER_THIS;
    toast.success(config.successFeedback);
    if (onConsider) onConsider();
  };

  const content = (
    <div
      className={cn(
        "relative flex flex-col justify-end overflow-hidden rounded-2xl md:rounded-3xl border border-border/70 bg-neutral-950 aspect-[4/5] text-white shadow-calm group",
        className
      )}
    >
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none" />

      {/* Top Header */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-cyan-300 bg-cyan-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-cyan-500/30">
          Sacred Geography
        </span>

        <Pressable
          onClick={handleSave}
          aria-label="Save to Pilgrimage Wishlist"
          className="size-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/80 hover:text-white"
        >
          <Bookmark className={cn("size-3.5", saved && "text-saffron fill-saffron")} />
        </Pressable>
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-1.5 text-xs text-white/70 font-mono mb-1.5">
          <MapPin className="size-3 text-cyan-400" />
          <span>{state}, {country}</span>
          {altitudeOrCoords && (
            <>
              <span>•</span>
              <span className="text-white/60">{altitudeOrCoords}</span>
            </>
          )}
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-normal leading-tight text-white group-hover:text-cyan-200 transition-colors">
          {name}
        </h3>

        <p className="mt-1.5 text-xs sm:text-sm text-white/80 line-clamp-2 font-light leading-relaxed">
          {significance}
        </p>

        {bestSeason && (
          <div className="mt-2 text-[11px] font-mono text-cyan-300/90 flex items-center gap-1">
            <Compass className="size-3" /> Best season: {bestSeason}
          </div>
        )}

        <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
          <Pressable
            onClick={handleConsider}
            className={cn(
              "px-2.5 py-1 rounded-full font-mono text-[11px] tracking-wider transition-all flex items-center gap-1",
              considered
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs border border-white/20"
            )}
          >
            <Navigation className="size-3" />
            {considered ? "Pilgrimage Added" : "I'd consider this"}
          </Pressable>

          <span className="text-[11px] font-mono text-white/70 group-hover:text-white flex items-center gap-1">
            Explore Sacred Map <ArrowUpRight className="size-3" />
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
