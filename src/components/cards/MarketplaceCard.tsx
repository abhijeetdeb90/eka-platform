// ==============================================================================
// EKA CARD PRIMITIVE: MarketplaceCard
// ==============================================================================
import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, Heart, Layers, ArrowUpRight } from "lucide-react";
import { AnimatedCard } from "@/components/motion/AnimatedCard";
import { Pressable } from "@/components/motion/Pressable";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface MarketplaceCardProps {
  id: string;
  title: string;
  artisanName: string;
  craftTradition: string;
  origin: string;
  priceFormatted: string;
  giTagNumber?: string;
  imageUrl: string;
  inventoryStatus?: "IN_STOCK" | "MADE_TO_ORDER" | "LAST_PIECE";
  actionTo?: string;
  className?: string;
  onExploreMaker?: () => void;
}

export function MarketplaceCard({
  id,
  title,
  artisanName,
  craftTradition,
  origin,
  priceFormatted,
  giTagNumber,
  imageUrl,
  inventoryStatus = "MADE_TO_ORDER",
  actionTo,
  className,
  onExploreMaker,
}: MarketplaceCardProps) {
  const [liked, setLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    toast.success(liked ? "Removed from wishlist." : "Added craft to your sanctuary wishlist.");
  };

  const handleExplore = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(`Opening ${artisanName}'s guild atelier.`);
    if (onExploreMaker) onExploreMaker();
  };

  const inventoryBadge = {
    IN_STOCK: { label: "Ready to Dispatch", color: "text-emerald-500 bg-emerald-500/10" },
    MADE_TO_ORDER: { label: "Handcrafted to Order", color: "text-amber-500 bg-amber-500/10" },
    LAST_PIECE: { label: "Singular Masterwork", color: "text-terracotta bg-terracotta/10" },
  }[inventoryStatus];

  const content = (
    <div
      className={cn(
        "flex flex-col justify-between h-full p-4 sm:p-5 rounded-2xl md:rounded-3xl border border-border/70 bg-card/90 backdrop-blur-md shadow-calm hover:border-saffron/40 transition-colors group",
        className
      )}
    >
      <div>
        {/* Craft Product Photo */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3.5 bg-neutral-900">
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
            {giTagNumber ? (
              <span className="text-[10px] font-mono text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/20 flex items-center gap-1">
                <ShieldCheck className="size-3 text-emerald-400" />
                GI Tag #{giTagNumber}
              </span>
            ) : <span />}

            <Pressable
              onClick={handleLike}
              aria-label="Wishlist craft"
              className="size-7 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/80 hover:text-white"
            >
              <Heart className={cn("size-3.5", liked && "text-red-500 fill-red-500")} />
            </Pressable>
          </div>

          <div className="absolute bottom-2.5 left-2.5">
            <span
              className={cn(
                "text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-xs border border-white/10 font-medium",
                inventoryBadge.color
              )}
            >
              {inventoryBadge.label}
            </span>
          </div>
        </div>

        <div className="text-xs font-mono text-muted-foreground mb-1 flex items-center gap-1.5">
          <span>{craftTradition}</span>
          <span>•</span>
          <span>{origin}</span>
        </div>

        <h3 className="font-serif text-lg font-normal leading-snug text-foreground group-hover:text-saffron transition-colors line-clamp-1">
          {title}
        </h3>

        <p className="text-xs font-mono text-foreground/80 mt-1">
          Master Artisan: <span className="font-medium text-foreground">{artisanName}</span>
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono uppercase text-muted-foreground block">Artisan Dakshina</span>
          <span className="font-serif text-base font-semibold text-foreground">{priceFormatted}</span>
        </div>

        <Pressable
          onClick={handleExplore}
          className="px-3 py-1.5 rounded-full text-xs font-mono bg-accent/80 hover:bg-saffron hover:text-white text-foreground transition-colors border border-border/50 flex items-center gap-1"
        >
          <Layers className="size-3" />
          <span>Explore Maker</span>
        </Pressable>
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
