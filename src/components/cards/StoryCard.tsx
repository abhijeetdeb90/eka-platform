// ==============================================================================
// EKA CARD PRIMITIVE: StoryCard (Consumer Visual Reel & Story Unit)
// ==============================================================================
import React, { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Bookmark,
  Share2,
  Heart,
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { AnimatedCard } from "@/components/motion/AnimatedCard";
import { Pressable } from "@/components/motion/Pressable";
import { epistemicTiers, type EpistemicTier } from "@/lib/tokens/theme";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface StoryCardProps {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  location?: string;
  mediaUrl: string;
  mediaType?: "video" | "image";
  posterUrl?: string;
  aspectRatio?: "vertical" | "portrait" | "landscape" | "square";
  creator?: {
    name: string;
    handle?: string;
    avatar?: string;
    tradition?: string;
    verified?: boolean;
  };
  epistemicTier?: EpistemicTier;
  tags?: string[];
  likesCount?: number;
  duration?: string;
  actionTo?: string;
  onClick?: () => void;
  className?: string;
  featured?: boolean;
  onIntent?: (type: string) => void;
}

export function StoryCard({
  id,
  title,
  subtitle,
  category,
  location,
  mediaUrl,
  mediaType = "image",
  posterUrl,
  aspectRatio = "portrait",
  creator,
  epistemicTier = "LIVING_PRACTICE",
  tags = [],
  likesCount = 0,
  duration,
  actionTo,
  onClick,
  className,
  featured = false,
  onIntent,
}: StoryCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likesCount);
  const [saved, setSaved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const aspectClass = {
    vertical: "aspect-[9/16]",
    portrait: "aspect-[4/5]",
    square: "aspect-square",
    landscape: "aspect-[16/10]",
  }[aspectRatio];

  const tierMeta = epistemicTiers[epistemicTier];

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) {
      setLiked(false);
      setLikes((c) => Math.max(0, c - 1));
    } else {
      setLiked(true);
      setLikes((c) => c + 1);
      toast.success("Added to your cultural reflections.");
      if (onIntent) onIntent("INTO_THIS");
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    toast.success(saved ? "Removed from your Sanctuary." : "Saved to your Sanctuary collection.");
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: subtitle || title,
          url: window.location.href,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Story link copied to clipboard.");
    }
  };

  const cardContent = (
    <article
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl md:rounded-3xl border border-border/70 bg-card shadow-calm transition-all duration-500 ease-out hover:shadow-lift hover:border-terracotta/40 select-none",
        aspectClass,
        featured && "md:col-span-2 md:aspect-[16/10]",
        className
      )}
    >
      {/* Media Layer (Video or Image) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-900">
        {mediaType === "video" ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={mediaUrl}
              poster={posterUrl || mediaUrl}
              loop
              muted={isMuted}
              playsInline
              preload="metadata"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="size-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                {isPlaying ? <Pause className="size-5" /> : <Play className="size-5 ml-0.5" />}
              </div>
            </div>
          </div>
        ) : (
          <img
            src={mediaUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}

        {/* Ambient Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/25 pointer-events-none" />
      </div>

      {/* Top Controls & Category Badge */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
            {category}
          </span>
          {tierMeta && (
            <span
              className={cn(
                "hidden sm:inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider backdrop-blur-md px-2 py-0.5 rounded-full border",
                tierMeta.colorClass,
                tierMeta.bgClass,
                tierMeta.borderClass
              )}
            >
              <Sparkles className="size-2.5" />
              {tierMeta.badgeText}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {mediaType === "video" && (
            <Pressable
              onClick={handleToggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="size-8 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
            </Pressable>
          )}
          <Pressable
            onClick={handleSave}
            aria-label="Save story"
            className={cn(
              "size-8 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center transition-colors",
              saved ? "text-saffron fill-saffron" : "text-white/80 hover:text-white"
            )}
          >
            <Bookmark className={cn("size-3.5", saved && "fill-current")} />
          </Pressable>
        </div>
      </div>

      {/* Bottom Content & Editorial Typography */}
      <div className="absolute bottom-4 inset-x-4 z-10 flex flex-col justify-end text-white">
        {location && (
          <div className="flex items-center gap-1 text-[11px] font-mono text-white/70 mb-1.5 tracking-wide">
            <MapPin className="size-3 text-terracotta shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        )}

        <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-normal leading-tight text-white group-hover:text-amber-100 transition-colors drop-shadow-xs">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1.5 text-xs sm:text-sm font-light leading-relaxed text-white/80 line-clamp-2">
            {subtitle}
          </p>
        )}

        {/* Creator Attribution & Interaction Bar */}
        <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
          {creator ? (
            <div className="flex items-center gap-2 min-w-0">
              {creator.avatar ? (
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="size-6 rounded-full object-cover border border-white/30 shrink-0"
                />
              ) : (
                <div className="size-6 rounded-full bg-terracotta/40 border border-white/30 flex items-center justify-center font-serif text-[10px] text-white shrink-0">
                  {creator.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-white truncate text-[11px]">{creator.name}</span>
                  {creator.verified && <CheckCircle2 className="size-3 text-saffron fill-saffron/20 shrink-0" />}
                </div>
                {creator.tradition && (
                  <span className="text-[10px] font-mono text-white/60 truncate block">{creator.tradition}</span>
                )}
              </div>
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
            >
              <Heart className={cn("size-3.5", liked && "text-red-500 fill-red-500")} />
              <span className="font-mono text-[11px]">{likes}</span>
            </button>
            <button
              onClick={handleShare}
              className="text-white/80 hover:text-white transition-colors"
            >
              <Share2 className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <AnimatedCard className="h-full">
      {actionTo ? (
        <Link to={actionTo} className="block h-full">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </AnimatedCard>
  );
}
