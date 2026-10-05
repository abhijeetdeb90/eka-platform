import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
  Flag,
  GitFork,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { AuthorLine } from "@/components/app/Avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { postTypeLabel, timeAgo } from "@/lib/eka";
import { track } from "@/lib/analytics";
import { reportContent, toggleLike, toggleSave, type FeedPost } from "@/lib/api";
import { isVideoUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import { ProvenanceBadge } from "@/components/app/ProvenanceBadge";
import { ShareCardModal } from "@/components/app/ShareCardModal";
import { CommunityVariationModal } from "@/components/app/CommunityVariationModal";

function parseMediaUrls(raw: string | null): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string" && item.length > 0);
      }
    } catch {
      // fallback
    }
  }
  return [trimmed];
}

function MediaCarousel({ urls, post }: { urls: string[]; post: FeedPost }) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (index < urls.length - 1) setIndex((i) => i + 1);
  };

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (index > 0) setIndex((i) => i - 1);
  };

  return (
    <div className="relative overflow-hidden bg-muted group/carousel">
      {/* Active Carousel Slide */}
      <Link
        to="/app/p/$postId"
        params={{ postId: post.id }}
        className="block overflow-hidden focus:outline-hidden"
      >
        <img
          src={urls[index]}
          alt={
            post.topic
              ? `${post.topic} - Slide ${index + 1} of ${urls.length}`
              : `Slide ${index + 1} of ${urls.length}`
          }
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded((prev) => ({ ...prev, [index]: true }))}
          className={cn(
            "max-h-[30rem] w-full object-cover transition-all duration-500 ease-out",
            loaded[index] ? "opacity-100" : "media-loading min-h-56 opacity-0",
          )}
        />
      </Link>

      {/* Slide Index Badge (e.g. 1 / 4) */}
      <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur shadow-sm select-none">
        <Layers className="size-3" />
        <span>
          {index + 1} / {urls.length}
        </span>
      </div>

      {/* Prev / Next tactile buttons */}
      {index > 0 && (
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-2 text-foreground shadow-lift backdrop-blur transition-all duration-200 hover:bg-background hover:scale-105 active:scale-95 z-10"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}

      {index < urls.length - 1 && (
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-2 text-foreground shadow-lift backdrop-blur transition-all duration-200 hover:bg-background hover:scale-105 active:scale-95 z-10"
        >
          <ChevronRight className="size-4" />
        </button>
      )}

      {/* Indicator dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 select-none">
        {urls.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIndex(i);
            }}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === i ? "w-6 bg-white shadow" : "w-1.5 bg-white/50 hover:bg-white/80",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function PostCard({ post, compact = false }: { post: FeedPost; compact?: boolean }) {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.like_count);
  const [saved, setSaved] = useState(post.saved);
  const [mediaReady, setMediaReady] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [variationModalOpen, setVariationModalOpen] = useState(false);
  const mediaUrls = parseMediaUrls(post.media_url);

  const like = async () => {
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    await toggleLike(post.id, liked, post.author_id);
    if (next) track("like", { post_id: post.id });
    void queryClient.invalidateQueries({ queryKey: ["feed"] });
  };

  const save = async () => {
    const next = !saved;
    setSaved(next);
    await toggleSave(post.id, saved);
    toast.success(next ? "Saved to your sanctuary" : "Removed from saved");
    void queryClient.invalidateQueries({ queryKey: ["saved"] });
  };

  const share = () => {
    setShareModalOpen(true);
  };

  const report = async () => {
    await reportContent({
      postId: post.id,
      reportedUserId: post.author_id,
      reason: "Reported from feed",
    });
    toast.success("Thank you. Our moderators will review this.");
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-calm transition-all duration-300 hover:border-border hover:shadow-lift">
      <div className="p-5 sm:p-6">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <AuthorLine
            profile={post.author}
            meta={[
              post.author?.username ? `@${post.author.username}` : null,
              timeAgo(post.created_at),
              post.community ? `in ${post.community.name}` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="More actions for this post"
                className="size-8 rounded-lg text-muted-foreground transition-colors hover:text-foreground"
              >
                <MoreHorizontal aria-hidden="true" className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl shadow-lift">
              <DropdownMenuItem onClick={share}>Share reflection</DropdownMenuItem>
              <DropdownMenuItem onClick={save}>
                {saved ? "Unsave" : "Save to sanctuary"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={report}
                className="text-destructive focus:text-destructive"
              >
                <Flag className="mr-2 size-4" /> Report content
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <ProvenanceBadge
            kind={
              (post as { provenance?: string }).provenance ??
              (post.type === "reading"
                ? "documented"
                : post.type === "practice"
                  ? "community"
                  : "interpretation")
            }
          />
          <span className="rounded-full bg-primary-soft/80 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground">
            {postTypeLabel(post.type)}
          </span>
          {post.topic && (
            <span className="rounded-full border border-border/70 bg-sand/30 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {post.topic}
            </span>
          )}
        </div>

        <Link
          to="/app/p/$postId"
          params={{ postId: post.id }}
          className="block focus:outline-hidden"
        >
          <p
            className={cn(
              "mt-3 whitespace-pre-wrap font-display text-[19px] leading-[1.6] text-foreground sm:text-[21px] font-normal",
              compact && "line-clamp-4",
            )}
          >
            {post.content}
          </p>
        </Link>
      </div>

      {mediaUrls.length > 1 ? (
        <MediaCarousel urls={mediaUrls} post={post} />
      ) : mediaUrls.length === 1 ? (
        isVideoUrl(mediaUrls[0]) ? (
          <video
            src={mediaUrls[0]}
            controls
            playsInline
            preload="metadata"
            aria-label={`Video shared by ${post.author?.display_name ?? "a member"}`}
            className="max-h-[30rem] w-full bg-muted object-cover"
          />
        ) : (
          <Link
            to="/app/p/$postId"
            params={{ postId: post.id }}
            className="block overflow-hidden focus:outline-hidden"
          >
            <img
              src={mediaUrls[0]}
              alt={
                post.topic
                  ? `Image shared with the post about ${post.topic}`
                  : "Image shared with this post"
              }
              loading="lazy"
              decoding="async"
              onLoad={() => setMediaReady(true)}
              className={cn(
                "max-h-[30rem] w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.015]",
                mediaReady ? "opacity-100" : "media-loading min-h-56 opacity-0",
              )}
            />
          </Link>
        )
      ) : null}

      <footer className="flex items-center gap-1 border-t border-border/40 px-3 py-2 text-muted-foreground sm:px-4">
        {/* Like/Resonate Button with Spring Bounce */}
        <Button
          variant="ghost"
          size="sm"
          onClick={like}
          aria-pressed={liked}
          aria-label={liked ? "Remove your reflection mark" : "Mark that this resonated"}
          className={cn(
            "group/like rounded-lg transition-colors hover:text-foreground",
            liked && "text-primary hover:text-primary",
          )}
        >
          <motion.span
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
          >
            <Heart className={cn("size-4 transition-colors", liked && "fill-current")} />
          </motion.span>
          {likes > 0 && <span className="ml-1.5 text-xs font-medium">{likes}</span>}
        </Button>

        {/* Comment Button */}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="rounded-lg transition-colors hover:text-foreground"
        >
          <Link
            to="/app/p/$postId"
            params={{ postId: post.id }}
            aria-label={`Open comments (${post.comment_count})`}
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            {post.comment_count > 0 && (
              <span className="ml-1.5 text-xs font-medium">{post.comment_count}</span>
            )}
          </Link>
        </Button>

        {/* Add Your Version Button (Zero-cost viral participation) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setVariationModalOpen(true)}
          className="rounded-lg text-xs text-muted-foreground hover:text-foreground gap-1.5"
          title="How does your community practice this tradition?"
        >
          <GitFork className="size-3.5 text-terracotta" />
          <span className="hidden sm:inline">Add Your Version</span>
        </Button>

        {/* Share Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={share}
          aria-label="Share this story card"
          className="rounded-lg transition-colors hover:text-foreground"
        >
          <Share2 aria-hidden="true" className="size-4" />
        </Button>

        {/* Bookmark/Save Button with Spring Bounce */}
        <Button
          variant="ghost"
          size="sm"
          onClick={save}
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved" : "Save this post"}
          className={cn(
            "ml-auto rounded-lg transition-colors hover:text-foreground",
            saved && "text-primary hover:text-primary",
          )}
        >
          <motion.span
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
          >
            <Bookmark className={cn("size-4 transition-colors", saved && "fill-current")} />
          </motion.span>
        </Button>
      </footer>

      {/* Share Card Modal (WhatsApp / Social) */}
      <ShareCardModal post={post} open={shareModalOpen} onOpenChange={setShareModalOpen} />

      {/* Community Variation Modal */}
      <CommunityVariationModal
        open={variationModalOpen}
        onOpenChange={setVariationModalOpen}
        parentTopic={post.topic || post.community?.name || "Sacred Tradition"}
        parentPostId={post.id}
        onSuccess={() => void queryClient.invalidateQueries({ queryKey: ["feed"] })}
      />
    </article>
  );
}
