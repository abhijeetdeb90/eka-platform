import React from "react";
import { X, Heart, MessageCircle, Bookmark, Share2, MapPin, Film, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CreatorPostItem } from "./CreatorOverview";
import { timeAgo } from "@/lib/eka";

interface ContentPreviewModalProps {
  post: CreatorPostItem | null;
  isOpen: boolean;
  onClose: () => void;
  creatorName?: string;
  creatorUsername?: string;
  creatorAvatar?: string | null;
}

export function ContentPreviewModal({
  post,
  isOpen,
  onClose,
  creatorName = "EKA Creator",
  creatorUsername = "creator",
  creatorAvatar,
}: ContentPreviewModalProps) {
  if (!isOpen || !post) return null;

  const isVideo = post.media_kind === "video" || post.type === "video";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-lift overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] uppercase font-mono">
              Live Preview
            </Badge>
            <span className="text-xs text-muted-foreground">How seekers see your story</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full size-8">
            <X className="size-4" />
          </Button>
        </div>

        {/* Story Card Container */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Author Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm overflow-hidden">
                {creatorAvatar ? (
                  <img src={creatorAvatar} alt={creatorName} className="size-full object-cover" />
                ) : (
                  creatorName.slice(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground leading-tight">{creatorName}</p>
                <p className="text-xs text-muted-foreground">@{creatorUsername} · {timeAgo(post.created_at)}</p>
              </div>
            </div>

            <Badge variant={post.status === "visible" ? "default" : "secondary"} className="text-[10px]">
              {post.status === "visible" ? "Published" : "Draft"}
            </Badge>
          </div>

          {/* Media Player / Image */}
          {post.media_url && (
            <div className="rounded-2xl overflow-hidden bg-black/5 border border-border/60">
              {isVideo ? (
                <video
                  src={post.media_url}
                  controls
                  playsInline
                  className="w-full max-h-96 object-contain bg-black"
                />
              ) : (
                <img
                  src={post.thumbnail_url || post.media_url}
                  alt={post.content.slice(0, 40)}
                  className="w-full max-h-96 object-cover"
                />
              )}
            </div>
          )}

          {/* Badges / Topic */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {post.topic && (
              <Badge variant="secondary" className="text-[11px] font-normal">
                {post.topic}
              </Badge>
            )}
            {post.tradition && (
              <Badge variant="outline" className="text-[11px] font-normal border-primary/30 text-primary">
                {post.tradition}
              </Badge>
            )}
            {post.location_label && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3 text-primary" />
                <span>{post.location_label}</span>
              </span>
            )}
          </div>

          {/* Story Narrative */}
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-serif">
            {post.content}
          </p>

          {/* Engagement Mock Bar */}
          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Heart className="size-4 text-rose-500" />
                <span>{post.like_count || 0}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="size-4" />
                <span>{post.comment_count || 0}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Bookmark className="size-4" />
                <span>{post.saves_count || 0}</span>
              </span>
            </div>
            <span className="text-[11px]">Attribution: Living Cultural Archive</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border/60 bg-muted/10 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-full text-xs">
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
