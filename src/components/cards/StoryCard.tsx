// ==============================================================================
// EKA STORY CARD COMPONENT SYSTEM
// ==============================================================================
// Specification: Sections 3, 4, 5
// Versatile Story Card component system supporting:
// 1. Reel (9:16 vertical short-form video/reel, duration, play indicator, creator, location)
// 2. Carousel (cover image, multi-slide indicator/dots, category, short title, context)
// 3. Static (editorial image, short title, 1-2 lines context, location, creator)
// 4. Featured (large editorial hero showcase, 12-col responsive, deep description, CTA)
// 5. Highlight (circular/rounded visual collections, gradient unviewed ring, title underneath)
//
// Designed with EKA editorial tokens: Fraunces display typography, Karla body,
// terracotta / saffron / sand pigment palette, epistemic provenance, collectible tactile feel.
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
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Clock,
  UserPlus,
  Check,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { track } from "@/lib/analytics";
import { epistemicTiers, type EpistemicTier } from "@/lib/tokens/theme";

export type StoryCardVariant = "reel" | "carousel" | "static" | "featured" | "highlight";

export interface CreatorAttribution {
  name: string;
  handle?: string;
  avatar?: string;
  role?: string;
  tradition?: string;
  verified?: boolean;
}

export interface StorySlide {
  id?: string;
  imageUrl: string;
  caption?: string;
}

export interface StoryCardProps {
  id: string;
  variant?: StoryCardVariant;
  title: string;
  subtitle?: string;
  category?: string;
  location?: string;

  // Media
  mediaUrl?: string;
  mediaType?: "video" | "image";
  thumbnailUrl?: string;
  imageUrl?: string;
  coverImageUrl?: string;
  posterUrl?: string;
  slides?: (string | StorySlide)[];
  slidesCount?: number;

  // Editorial Context
  context?: string;
  contextOneLiner?: string;
  description?: string;
  duration?: string;
  tags?: string[];

  // Epistemic tier & Provenance
  epistemicTier?: EpistemicTier;

  // Creator Attribution
  creator?: CreatorAttribution;

  // Metrics & State
  likesCount?: number;
  storyCount?: number;
  isUnviewed?: boolean;
  featured?: boolean;

  // Interactive triggers
  ctaLabel?: string;
  actionTo?: string;
  onClick?: () => void;
  onLike?: (id: string, liked: boolean) => void;
  onSave?: (id: string, saved: boolean) => void;
  onShare?: (id: string) => void;
  onFollow?: (creator: CreatorAttribution) => void;
  onIntent?: (type: string) => void;

  // Styling & Layout
  className?: string;
  aspectRatio?: "vertical" | "portrait" | "landscape" | "square";
}

// -----------------------------------------------------------------------------
// HELPER: SHARE HANDLER
// -----------------------------------------------------------------------------
async function handleShareAction(title: string, actionTo?: string) {
  const url = typeof window !== "undefined" ? window.location.origin + (actionTo || "/stories") : "";
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, url });
      return;
    } catch {
      // fallback
    }
  }
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(url);
    toast.success("Story link copied to clipboard");
  }
}

// =============================================================================
// 1. REEL CARD (9:16 Vertical Video / Story Card)
// =============================================================================
export type ReelCardProps = StoryCardProps;

export function ReelStoryCard({
  id,
  title,
  category = "Living Tradition",
  location,
  mediaUrl,
  thumbnailUrl,
  imageUrl,
  duration = "0:45",
  creator = { name: "Cultural Custodian", verified: true },
  likesCount = 120,
  actionTo = "/stories",
  onClick,
  onIntent,
  className,
  epistemicTier,
}: ReelCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState(likesCount);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const displayImage = thumbnailUrl || imageUrl || mediaUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80";
  const isVideo = mediaUrl && (mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".webm"));

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) {
      setIsPlaying(!isPlaying);
      return;
    }
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const nextState = !hasLiked;
    setHasLiked(nextState);
    setLikes((prev) => (nextState ? prev + 1 : prev - 1));
    track("reel_like", { id, liked: nextState });
    if (nextState) toast.success("Added to liked stories");
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const nextState = !isSaved;
    setIsSaved(nextState);
    track("reel_save", { id, saved: nextState });
    toast.success(nextState ? "Saved to your Sanctuary" : "Removed from Sanctuary");
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    track("reel_share", { id });
    handleShareAction(title, actionTo);
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const nextFollow = !isFollowing;
    setIsFollowing(nextFollow);
    toast.success(nextFollow ? `Following ${creator.name}` : `Unfollowed ${creator.name}`);
  };

  const tierMeta = epistemicTier ? epistemicTiers[epistemicTier] : null;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative aspect-[9/16] w-full min-w-[200px] max-w-[285px] overflow-hidden rounded-2xl bg-stone-900 shadow-calm transition-all duration-300 hover:shadow-lift hover:scale-[1.01] cursor-pointer shrink-0 select-none",
        className,
      )}
    >
      {/* Background Media */}
      {isVideo ? (
        <video
          ref={videoRef}
          src={mediaUrl}
          poster={displayImage}
          loop
          muted={isMuted}
          playsInline
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <img
          src={displayImage}
          alt={title}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      )}

      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/35 pointer-events-none" />

      {/* Top Header: Category & Duration / Sound Controls */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between text-white/90 text-xs z-10">
        <span className="font-mono text-[10px] tracking-wider uppercase text-amber-300 font-semibold drop-shadow-sm truncate max-w-[60%]">
          {category}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {isVideo && (
            <button
              type="button"
              onClick={toggleMute}
              className="size-6 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 border border-white/10 hover:bg-black/60 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="size-3" /> : <Volume2 className="size-3" />}
            </button>
          )}

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-mono border border-white/10">
            <Play className="size-2.5 fill-white text-white" />
            <span>{duration}</span>
          </div>
        </div>
      </div>

      {/* Center Play Button on Hover */}
      <div
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
      >
        <div className="size-12 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-lg transform group-hover:scale-110 transition-transform">
          {isPlaying ? <Pause className="size-5 fill-white" /> : <Play className="size-5 fill-white ml-0.5" />}
        </div>
      </div>

      {/* Epistemic Provenance Tier (if present) */}
      {tierMeta && (
        <div className="absolute top-10 left-3 z-10">
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[9px] font-mono border backdrop-blur-md",
              tierMeta.bgClass,
              tierMeta.colorClass,
              tierMeta.borderClass,
            )}
          >
            {tierMeta.badgeText}
          </span>
        </div>
      )}

      {/* Bottom Content & Creator Attribution */}
      <div className="absolute bottom-3 inset-x-3 text-white space-y-2 z-10">
        {/* Location Kicker */}
        {location && (
          <div className="flex items-center gap-1 text-[11px] text-white/80 font-light truncate">
            <MapPin className="size-3 text-amber-400 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        )}

        {/* Title */}
        <h4 className="font-display text-sm sm:text-base font-normal leading-snug text-white line-clamp-2 drop-shadow-sm group-hover:text-amber-200 transition-colors">
          {title}
        </h4>

        {/* Creator Info & Action Bar */}
        <div className="pt-1 flex items-center justify-between gap-2 border-t border-white/15">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="size-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-semibold text-white overflow-hidden shrink-0">
              {creator.avatar ? (
                <img src={creator.avatar} alt={creator.name} className="size-full object-cover" />
              ) : (
                creator.name.charAt(0)
              )}
            </div>
            <span className="text-[11px] font-medium text-white/90 truncate flex items-center gap-1">
              <span className="truncate">{creator.name}</span>
              {creator.verified && <ShieldCheck className="size-3 text-emerald-400 shrink-0" />}
            </span>

            {/* Micro Follow Button */}
            <button
              type="button"
              onClick={handleFollow}
              className={cn(
                "ml-1 px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors cursor-pointer",
                isFollowing
                  ? "bg-white/20 text-white"
                  : "bg-terracotta text-white hover:bg-terracotta/90",
              )}
              title={isFollowing ? "Following" : "Follow"}
            >
              {isFollowing ? "Following" : "+ Follow"}
            </button>
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1 shrink-0 text-white/80">
            <button
              type="button"
              onClick={handleLike}
              className="p-1 hover:text-white transition-colors cursor-pointer"
              title="Like"
              aria-label="Like story"
            >
              <Heart
                className={cn("size-3.5", hasLiked && "fill-rose-500 text-rose-500")}
              />
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="p-1 hover:text-white transition-colors cursor-pointer"
              title="Save"
              aria-label="Save to Sanctuary"
            >
              <Bookmark
                className={cn("size-3.5", isSaved && "fill-amber-400 text-amber-400")}
              />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="p-1 hover:text-white transition-colors cursor-pointer"
              title="Share"
              aria-label="Share story"
            >
              <Share2 className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 2. CAROUSEL CARD (Multi-Slide Story with Cover, Dots & Swiping)
// =============================================================================
export type CarouselCardProps = StoryCardProps;

export function CarouselStoryCard({
  id,
  title,
  category = "Cultural Lineage",
  slidesCount = 5,
  coverImageUrl,
  imageUrl,
  mediaUrl,
  slides,
  location,
  contextOneLiner,
  context,
  creator = { name: "Cultural Guild", verified: true },
  actionTo = "/stories",
  onClick,
  className,
}: CarouselCardProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const slideList: string[] = slides
    ? slides.map((s) => (typeof s === "string" ? s : s.imageUrl))
    : [
        coverImageUrl || imageUrl || mediaUrl || "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
      ];

  const totalSlides = Math.max(slidesCount, slideList.length);
  const currentImage = slideList[currentSlideIndex % slideList.length] || slideList[0];

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slideList.length - 1));
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev + 1) % slideList.length);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isSaved;
    setIsSaved(next);
    toast.success(next ? "Saved to your Sanctuary" : "Removed from Sanctuary");
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleShareAction(title, actionTo);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-calm transition-all duration-300 hover:border-primary/40 hover:shadow-lift cursor-pointer",
        className,
      )}
    >
      {/* Cover Image / Slides Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={currentImage}
          alt={title}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Slide Counter Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-mono font-medium text-white backdrop-blur-md border border-white/10">
          <Layers className="size-3" />
          <span>
            {currentSlideIndex + 1}/{totalSlides}
          </span>
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-amber-300 drop-shadow">
            {category}
          </span>
        </div>

        {/* Interactive Prev/Next Slide Arrows (revealed on hover) */}
        {slideList.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handlePrevSlide}
              className="size-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleNextSlide}
              className="size-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}

        {/* Slide Dots Indicator */}
        {slideList.length > 1 && (
          <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1">
            {slideList.map((_, idx) => (
              <span
                key={idx}
                className={cn(
                  "size-1.5 rounded-full transition-all",
                  idx === currentSlideIndex % slideList.length
                    ? "bg-amber-300 w-3"
                    : "bg-white/50",
                )}
              />
            ))}
          </div>
        )}

        {/* Location Kicker */}
        {location && (
          <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[11px] text-white/90 font-light truncate max-w-[80%]">
            <MapPin className="size-3 text-amber-400 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        )}
      </div>

      {/* Editorial Content */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-display text-base font-normal text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
            {title}
          </h4>
          {(contextOneLiner || context) && (
            <p className="mt-1 text-xs text-muted-foreground font-light line-clamp-2 leading-relaxed">
              {contextOneLiner || context}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
          {creator && (
            <span className="text-[11px] font-medium text-foreground truncate flex items-center gap-1">
              <span>{creator.name}</span>
              {creator.verified && <ShieldCheck className="size-3 text-forest shrink-0" />}
            </span>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handleSave}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Save"
            >
              <Bookmark className={cn("size-3.5", isSaved && "fill-amber-500 text-amber-500")} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Share"
            >
              <Share2 className="size-3.5" />
            </button>
            <span className="text-terracotta group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-medium text-[11px]">
              <span>Swipe</span>
              <ArrowRight className="size-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 3. STATIC STORY CARD (Editorial Photography + Short Title + 1-2 Line Context)
// =============================================================================
export type StaticStoryCardProps = StoryCardProps;

export function StaticStoryCard({
  id,
  title,
  category = "Ritual & Sacred Place",
  location,
  imageUrl,
  mediaUrl,
  thumbnailUrl,
  context,
  contextOneLiner,
  creator = { name: "Knowledge Keeper", verified: true },
  actionTo = "/stories",
  onClick,
  className,
}: StaticStoryCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const displayImage = imageUrl || thumbnailUrl || mediaUrl || "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80";

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isSaved;
    setIsSaved(next);
    toast.success(next ? "Saved to your Sanctuary" : "Removed from Sanctuary");
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleShareAction(title, actionTo);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-calm transition-all duration-300 hover:border-primary/40 hover:shadow-lift cursor-pointer",
        className,
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <img
          src={displayImage}
          alt={title}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-wider text-amber-300 font-semibold drop-shadow">
          {category}
        </div>

        {location && (
          <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[11px] text-white font-light truncate max-w-[85%]">
            <MapPin className="size-3 text-amber-400 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-display text-base font-normal text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
            {title}
          </h4>
          {(context || contextOneLiner) && (
            <p className="mt-1 text-xs text-muted-foreground font-light line-clamp-2 leading-relaxed">
              {context || contextOneLiner}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
          {creator && (
            <span className="text-[11px] text-foreground font-medium flex items-center gap-1 truncate max-w-[50%]">
              <span className="truncate">{creator.name}</span>
              {creator.verified && <ShieldCheck className="size-3 text-forest shrink-0" />}
            </span>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handleSave}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Save"
            >
              <Bookmark className={cn("size-3.5", isSaved && "fill-amber-500 text-amber-500")} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Share"
            >
              <Share2 className="size-3.5" />
            </button>
            <span className="text-terracotta text-[11px] font-medium group-hover:underline flex items-center gap-0.5">
              <span>Read</span>
              <ArrowRight className="size-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 4. FEATURED STORY CARD (Large Editorial Showcase Hero)
// =============================================================================
export type FeaturedStoryCardProps = StoryCardProps;

export function FeaturedStoryCard({
  id,
  title,
  subtitle,
  category = "Living Heritage",
  location = "India",
  imageUrl,
  mediaUrl,
  thumbnailUrl,
  description = "A living exploration of unbroken human ritual, sacred craft, and community memory.",
  creator = { name: "Cultural Custodian", role: "Living Tradition Keeper", verified: true },
  ctaLabel = "Experience Story",
  actionTo = "/stories",
  onClick,
  className,
}: FeaturedStoryCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const displayImage = imageUrl || thumbnailUrl || mediaUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80";

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isSaved;
    setIsSaved(next);
    toast.success(next ? "Saved to your Sanctuary" : "Removed from Sanctuary");
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleShareAction(title, actionTo);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative grid grid-cols-1 md:grid-cols-12 overflow-hidden rounded-3xl border border-border/80 bg-card shadow-lift transition-all duration-300 hover:border-primary/50 cursor-pointer",
        className,
      )}
    >
      {/* Visual Container */}
      <div className="relative md:col-span-7 aspect-[16/10] md:aspect-auto md:min-h-[380px] overflow-hidden bg-stone-900">
        <img
          src={displayImage}
          alt={title}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta text-white text-xs font-mono font-medium tracking-wide uppercase shadow-sm">
            <Sparkles className="size-3" />
            Featured Story
          </span>
          <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-amber-300 text-xs font-mono border border-white/10 uppercase">
            {category}
          </span>
        </div>
      </div>

      {/* Editorial Content */}
      <div className="p-6 md:p-8 md:col-span-5 flex flex-col justify-between space-y-4 bg-card">
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <MapPin className="size-3.5 text-terracotta" />
            <span>{location}</span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-normal text-foreground group-hover:text-primary transition-colors leading-tight">
            {title}
          </h3>

          {subtitle && (
            <p className="font-serif text-sm italic text-terracotta font-medium">
              &ldquo;{subtitle}&rdquo;
            </p>
          )}

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light">
            {description}
          </p>
        </div>

        {/* Creator & CTA */}
        <div className="pt-4 border-t border-border/50 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground truncate flex items-center gap-1">
              <span>{creator.name}</span>
              {creator.verified && <ShieldCheck className="size-3.5 text-forest shrink-0" />}
            </p>
            {creator.role && (
              <p className="text-[11px] text-muted-foreground truncate font-light">
                {creator.role}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSave}
              className="p-2 rounded-xl border border-border/60 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title="Save"
            >
              <Bookmark className={cn("size-4", isSaved && "fill-amber-500 text-amber-500")} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl border border-border/60 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title="Share"
            >
              <Share2 className="size-4" />
            </button>

            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium shadow-calm group-hover:shadow-lift transition-all">
              <span>{ctaLabel}</span>
              <ArrowRight className="size-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 5. HIGHLIGHT CARD (Curated Visual Collections Bubble)
// =============================================================================
export type HighlightCardProps = StoryCardProps;

export function HighlightStoryCard({
  id,
  title,
  imageUrl,
  thumbnailUrl,
  mediaUrl,
  storyCount,
  isUnviewed = true,
  onClick,
  className,
}: HighlightCardProps) {
  const displayImage = imageUrl || thumbnailUrl || mediaUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center gap-2 shrink-0 cursor-pointer select-none transition-transform hover:scale-105 focus:outline-hidden",
        className,
      )}
    >
      {/* Outer Visual Circle with Accent Gradient Ring */}
      <div
        className={cn(
          "relative size-16 sm:size-20 rounded-full p-[2.5px] transition-all duration-300",
          isUnviewed
            ? "bg-gradient-to-tr from-amber-500 via-terracotta to-saffron shadow-sm group-hover:shadow-md"
            : "bg-border/80 group-hover:bg-border",
        )}
      >
        <div className="size-full rounded-full overflow-hidden bg-background p-0.5">
          <img
            src={displayImage}
            alt={title}
            className="size-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Micro Story Count Badge */}
        {storyCount !== undefined && (
          <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-stone-900 border border-white/20 text-[9px] font-mono text-white font-medium shadow">
            {storyCount}
          </span>
        )}
      </div>

      {/* Label */}
      <span className="font-mono text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-foreground/90 max-w-[80px] text-center truncate group-hover:text-primary transition-colors">
        {title}
      </span>
    </button>
  );
}

// =============================================================================
// 6. SHORT EDITORIAL CARD (Concise Knowledge Card for Articles / Blogs)
// =============================================================================
export interface ShortEditorialCardProps {
  id: string;
  title: string;
  category: string;
  location?: string;
  imageUrl?: string;
  explanation: string;
  actionTo?: string;
  onClick?: () => void;
  className?: string;
}

export function ShortEditorialCard({
  id,
  title,
  category,
  location,
  imageUrl,
  explanation,
  actionTo = "/stories",
  onClick,
  className,
}: ShortEditorialCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex flex-col justify-between p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/40 shadow-calm hover:shadow-lift transition-all duration-300 cursor-pointer space-y-3",
        className,
      )}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span className="text-[10px] uppercase font-semibold text-terracotta tracking-wider">
            {category}
          </span>
          {location && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <MapPin className="size-3 text-amber-500" />
              <span>{location}</span>
            </span>
          )}
        </div>

        <h4 className="font-display text-base font-normal text-foreground group-hover:text-primary transition-colors leading-snug">
          {title}
        </h4>

        <p className="text-xs text-muted-foreground font-light leading-relaxed line-clamp-3">
          {explanation}
        </p>
      </div>

      <div className="pt-2 border-t border-border/40 flex items-center justify-between">
        <span className="text-[11px] font-mono text-muted-foreground">Short Editorial</span>
        <span className="text-xs font-medium text-terracotta group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          <span>Explore</span>
          <ArrowRight className="size-3" />
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// UNIFIED MASTER STORY CARD COMPONENT
// =============================================================================
// Switches based on `variant` prop.
// Defaults:
// - "featured" if `featured === true`
// - "highlight" if `variant === "highlight"`
// - "carousel" if `variant === "carousel"`
// - "static" if `variant === "static"`
// - "reel" if `variant === "reel"` or default
// =============================================================================
export function StoryCard(props: StoryCardProps) {
  const effectiveVariant: StoryCardVariant =
    props.variant ||
    (props.featured
      ? "featured"
      : props.aspectRatio === "landscape" || props.aspectRatio === "square"
        ? "static"
        : "reel");

  switch (effectiveVariant) {
    case "reel":
      return <ReelStoryCard {...props} />;
    case "carousel":
      return <CarouselStoryCard {...props} />;
    case "static":
      return <StaticStoryCard {...props} />;
    case "featured":
      return <FeaturedStoryCard {...props} />;
    case "highlight":
      return <HighlightStoryCard {...props} />;
    default:
      return <ReelStoryCard {...props} />;
  }
}

// Attach subcomponents for compound syntax
StoryCard.Reel = ReelStoryCard;
StoryCard.Carousel = CarouselStoryCard;
StoryCard.Static = StaticStoryCard;
StoryCard.Featured = FeaturedStoryCard;
StoryCard.Highlight = HighlightStoryCard;
StoryCard.Editorial = ShortEditorialCard;

// Named exports aliases
export {
  ReelStoryCard as ReelCard,
  CarouselStoryCard as CarouselCard,
  HighlightStoryCard as HighlightCard,
};
