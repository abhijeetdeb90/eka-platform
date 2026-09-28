import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Bookmark, Share2, ArrowRight, ShieldCheck, MapPin, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { EkaDiscoveryCard } from "@/lib/homepage-data";

interface EkaBaseCardProps {
  card: EkaDiscoveryCard;
  onInspect: (card: EkaDiscoveryCard) => void;
  className?: string;
  size?: "default" | "large" | "compact";
}

export function EkaBaseCard({
  card,
  onInspect,
  className = "",
  size = "default",
}: EkaBaseCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("eka_saved_cards_v1") || "[]");
      if (Array.isArray(saved) && saved.includes(card.id)) {
        setIsSaved(true);
      }
    } catch {
      // Ignored
    }
  }, [card.id]);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const saved: string[] = JSON.parse(localStorage.getItem("eka_saved_cards_v1") || "[]");
      let updated: string[];
      if (saved.includes(card.id)) {
        updated = saved.filter((id) => id !== card.id);
        setIsSaved(false);
        toast.success(`Removed "${card.title}" from your saved cards.`);
      } else {
        updated = [...saved, card.id];
        setIsSaved(true);
        toast.success(`Saved "${card.title}" to your knowledge library.`);
      }
      localStorage.setItem("eka_saved_cards_v1", JSON.stringify(updated));
    } catch {
      setIsSaved((prev) => !prev);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url =
      typeof window !== "undefined" ? `${window.location.origin}${card.linkTo}#${card.id}` : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: `EKA — ${card.title}`,
          text: `${card.oneLiner} (${card.categoryBadge})`,
          url,
        });
      } catch {
        // Ignored
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${card.title} — ${card.oneLiner} | EKA: ${url}`);
      toast.success("Card link copied to clipboard.");
    }
  };

  const isLarge = size === "large";

  return (
    <article
      data-testid={`eka-card-${card.id}`}
      role="button"
      tabIndex={0}
      onClick={() => onInspect(card)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onInspect(card);
        }
      }}
      className={`group relative flex flex-col cursor-pointer overflow-hidden rounded-3xl border border-border/80 bg-card shadow-calm transition-all duration-400 hover:border-primary/50 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        isLarge ? "sm:grid sm:grid-cols-2 sm:gap-6" : ""
      } ${className}`}
    >
      {/* Visual Frame */}
      <div
        className={`relative overflow-hidden bg-sand/30 ${
          isLarge ? "h-64 sm:h-full w-full" : "aspect-[16/10] w-full"
        }`}
      >
        <img
          src={card.image}
          alt={card.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-background/90 px-3 py-1 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-foreground backdrop-blur-md border border-border/60">
            {card.categoryBadge}
          </span>
          {card.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-forest/90 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
              <ShieldCheck className="size-3" />
              <span>Verified</span>
            </span>
          )}
        </div>

        {/* Location overlay */}
        {card.location && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center text-[11px] text-white/90">
            <MapPin className="mr-1 size-3 shrink-0 text-saffron" />
            <span className="truncate font-light">{card.location}</span>
          </div>
        )}
      </div>

      {/* Editorial Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {card.community && (
          <div className="text-[11px] font-medium text-terracotta tracking-wider uppercase truncate">
            {card.community}
          </div>
        )}

        <h3 className="mt-1.5 font-display text-lg sm:text-xl font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
          {card.title}
        </h3>

        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground font-light line-clamp-2 sm:line-clamp-3">
          {card.oneLiner}
        </p>

        {/* Knowledge Node Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {card.knowledgeTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-sand/60 px-2 py-0.5 text-[10px] font-medium text-foreground/80 border border-border/50"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Bar */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/60 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleSaveToggle}
              title={isSaved ? "Saved to Library" : "Save Card"}
              aria-label={isSaved ? "Saved card" : "Save card"}
              className={`rounded-lg p-2.5 min-h-[44px] min-w-[44px] inline-flex items-center justify-center transition-colors hover:bg-muted ${
                isSaved ? "text-primary bg-primary-soft/50" : "text-muted-foreground"
              }`}
            >
              <Bookmark className={`size-4 ${isSaved ? "fill-current" : ""}`} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              title="Share Card"
              aria-label="Share card"
              className="rounded-lg p-2.5 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Share2 className="size-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onInspect(card);
            }}
            aria-label={`Explore ${card.title}`}
            className="inline-flex min-h-[44px] items-center gap-1 text-xs font-medium text-terracotta transition-colors hover:text-primary"
          >
            <span>Explore</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </article>
  );
}
