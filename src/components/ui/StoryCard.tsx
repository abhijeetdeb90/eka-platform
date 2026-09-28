// ==============================================================================
// EKA DESIGN SYSTEM PRIMITIVE: STORY CARD (v1.0)
// ==============================================================================
// The core atomic visual storytelling unit of EKA.
// Supports full-bleed vertical short-form video, editorial photography,
// cultural taxonomy badges, epistemic provenance, and creator attribution.
// ==============================================================================

import { useState, useRef, useEffect } from "react";
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
  Maximize2,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  epistemicTier?: "DOCUMENTED" | "LIVING_PRACTICE" | "SACRED_GEOGRAPHY" | "ORAL_LORE";
  tags?: string[];
  likesCount?: number;
  duration?: string;
  actionTo?: string;
  onClick?: () => void;
  className?: string;
  featured?: boolean;
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
}: StoryCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likesCount);
  const [saved, setSaved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Aspect ratio classes
  const aspectClass = {
    vertical: "aspect-[9/16]",
    portrait: "aspect-[4/5]",
    square: "aspect-square",
    landscape: "aspect-[16/9]",
  }[aspectRatio];

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
        "group relative overflow-hidden rounded-2xl md:rounded-3xl border border-border/60 bg-card shadow-calm transition-all duration-500 ease-out hover:shadow-lift hover:border-terracotta/40 select-none",
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
            {/* Play/Pause Overlay indicator on hover */}
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

        {/* Cinematic Vignette & Ambient Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 pointer-events-none" />
      </div>

      {/* Top Controls & Category Badge */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
            {category}
          </span>
          {epistemicTier && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-amber-300/90 bg-amber-950/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-500/20">
              <Sparkles className="size-2.5" />
              {epistemicTier.replace("_", " ")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {mediaType === "video" && (
            <button
              onClick={handleToggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="size-8 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
            </button>
          )}
          <button
            onClick={handleSave}
            aria-label="Save story"
            className={cn(
              "size-8 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center transition-colors",
              saved ? "text-saffron fill-saffron" : "text-white/80 hover:text-white"
            )}
          >
            <Bookmark className={cn("size-3.5", saved && "fill-current")} />
          </button>
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

        <h3 className="font-display font-serif text-lg sm:text-xl lg:text-2xl font-normal leading-tight text-white group-hover:text-amber-100 transition-colors drop-shadow-sm">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1.5 text-xs sm:text-sm font-light leading-relaxed text-white/80 line-clamp-2 drop-shadow-xs">
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
                  className="size-6 rounded-full object-cover border border-white/30"
                />
              ) : (
                <div className="size-6 rounded-full bg-terracotta/40 border border-white/30 flex items-center justify-center text-[10px] font-serif font-bold text-white">
                  {creator.name[0]}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-white truncate flex items-center gap-1 leading-none">
                  {creator.name}
                  {creator.verified && <CheckCircle2 className="size-2.5 text-amber-400 shrink-0" />}
                </p>
                {creator.tradition && (
                  <p className="text-[9px] font-mono text-white/60 truncate leading-none mt-0.5">
                    {creator.tradition}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-[10px] font-mono text-white/60">EKA Living Archive</div>
          )}

          {/* Social Reactions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1 text-[11px] transition-colors",
                liked ? "text-terracotta" : "text-white/80 hover:text-white"
              )}
            >
              <Heart className={cn("size-3.5", liked && "fill-current")} />
              <span>{likes > 0 ? likes : ""}</span>
            </button>

            <button
              onClick={handleShare}
              aria-label="Share"
              className="text-white/80 hover:text-white transition-colors"
            >
              <Share2 className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );

  if (actionTo) {
    return (
      <Link to={actionTo} className="block focus:outline-hidden">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
