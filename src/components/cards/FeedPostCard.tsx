// ==============================================================================
// EKA FEED POST CARD COMPONENT
// ==============================================================================
// Specification: Sections 10, 11
// Social participation card supporting:
// - Posts from other people
// - Creator & Community posts
// - Cultural observations & reflections
// - User's own posts
// - Like, Comment, Share, Save, Follow
// ==============================================================================

import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MapPin,
  ShieldCheck,
  UserPlus,
  UserCheck,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { track } from "@/lib/analytics";

export interface FeedPostProps {
  id: string;
  author: {
    id?: string;
    name: string;
    handle?: string;
    avatarUrl?: string;
    role?: string;
    verified?: boolean;
    isFollowing?: boolean;
    isSelf?: boolean;
  };
  timeAgo: string;
  location?: string;
  cultureOrTradition?: string;
  topic?: string;
  text: string;
  mediaUrls?: string[];
  mediaType?: "image" | "carousel" | "video";
  likesCount?: number;
  commentsCount?: number;
  initialLiked?: boolean;
  initialSaved?: boolean;
  onCommentClick?: () => void;
  className?: string;
}

export function FeedPostCard({
  id,
  author,
  timeAgo,
  location,
  cultureOrTradition,
  topic,
  text,
  mediaUrls,
  mediaType = "image",
  likesCount = 14,
  commentsCount = 2,
  initialLiked = false,
  initialSaved = false,
  onCommentClick,
  className,
}: FeedPostProps) {
  const [hasLiked, setHasLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(likesCount);
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isFollowing, setIsFollowing] = useState(author.isFollowing ?? false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const handleToggleLike = () => {
    setHasLiked(!hasLiked);
    setLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
    track("feed_post_liked", { id });
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from sanctuary" : "Saved to your sanctuary");
    track("feed_post_saved", { id });
  };

  const handleToggleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? `Unfollowed ${author.name}` : `Following ${author.name}`);
    track("feed_post_follow", { authorName: author.name });
  };

  const handleShare = async () => {
    const url = window.location.origin + `/community#post-${id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${author.name} on EKA`, text, url });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(url);
    toast.success("Post link copied");
  };

  return (
    <article
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-calm transition-all hover:border-primary/40",
        className,
      )}
    >
      {/* Post Header: Author, Metadata & Follow Button */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Avatar */}
          <div className="size-10 rounded-full bg-accent/60 flex items-center justify-center text-foreground font-serif text-sm font-semibold overflow-hidden shrink-0">
            {author.avatarUrl ? (
              <img
                src={author.avatarUrl}
                alt={author.name}
                className="size-full object-cover"
              />
            ) : (
              author.name.charAt(0)
            )}
          </div>

          {/* Author Details */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-medium text-sm text-foreground truncate">
                {author.name}
              </span>
              {author.verified && (
                <ShieldCheck
                  className="size-3.5 text-forest shrink-0"
                  aria-label="Verified Lineage Custodian"
                />
              )}
              {author.isSelf && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/10 text-primary font-medium">
                  You
                </span>
              )}
            </div>

            {/* Quiet Unboxed Metadata: Time · Location · Role */}
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-light flex-wrap">
              <span>{timeAgo}</span>
              {location && (
                <>
                  <span aria-hidden="true" className="opacity-40">·</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="size-2.5 text-terracotta inline" />
                    {location}
                  </span>
                </>
              )}
              {author.role && (
                <>
                  <span aria-hidden="true" className="opacity-40">·</span>
                  <span className="truncate">{author.role}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Header Action: Follow or Options */}
        {!author.isSelf && (
          <button
            type="button"
            onClick={handleToggleFollow}
            className={cn(
              "px-3 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1",
              isFollowing
                ? "bg-accent/60 text-foreground hover:bg-accent"
                : "border border-border/80 hover:border-primary text-terracotta hover:bg-terracotta/5",
            )}
          >
            {isFollowing ? (
              <>
                <UserCheck className="size-3" />
                <span>Following</span>
              </>
            ) : (
              <>
                <UserPlus className="size-3" />
                <span>Follow</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Culture / Topic Tag Kicker (Zero-Pill: quiet uppercase text) */}
      {(cultureOrTradition || topic) && (
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
          {cultureOrTradition && (
            <span className="text-terracotta">{cultureOrTradition}</span>
          )}
          {cultureOrTradition && topic && (
            <span aria-hidden="true" className="opacity-40">·</span>
          )}
          {topic && <span>{topic}</span>}
        </div>
      )}

      {/* Post Text */}
      <p className="text-sm text-foreground/90 leading-relaxed font-light whitespace-pre-line mb-3 font-sans">
        {text}
      </p>

      {/* Media Attachments (Single image, Carousel, or Video) */}
      {mediaUrls && mediaUrls.length > 0 && (
        <div className="mb-3 rounded-xl overflow-hidden border border-border/60 bg-stone-900 relative">
          <img
            src={mediaUrls[activeMediaIndex] || mediaUrls[0]}
            alt="Post media"
            className="w-full max-h-[440px] object-cover"
            loading="lazy"
          />

          {/* Carousel Indicator if multiple images */}
          {mediaUrls.length > 1 && (
            <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1.5">
              {mediaUrls.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveMediaIndex(idx)}
                  className={cn(
                    "size-2 rounded-full transition-all cursor-pointer",
                    activeMediaIndex === idx
                      ? "bg-white w-4"
                      : "bg-white/50 hover:bg-white/80",
                  )}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interaction Bar: Like, Comment, Share, Save */}
      <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleToggleLike}
            className={cn(
              "flex items-center gap-1.5 transition-colors cursor-pointer py-1",
              hasLiked
                ? "text-rose-600 font-medium"
                : "hover:text-foreground",
            )}
          >
            <Heart
              className={cn("size-4", hasLiked && "fill-rose-500 text-rose-500")}
            />
            <span>{likes}</span>
          </button>

          <button
            type="button"
            onClick={onCommentClick}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer py-1"
          >
            <MessageSquare className="size-4" />
            <span>{commentsCount}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer py-1"
            title="Share"
          >
            <Share2 className="size-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleToggleSave}
          className={cn(
            "p-1 rounded-lg transition-colors cursor-pointer",
            isSaved ? "text-amber-500" : "hover:text-foreground",
          )}
          title="Save post"
        >
          <Bookmark className={cn("size-4", isSaved && "fill-amber-400")} />
        </button>
      </div>
    </article>
  );
}
