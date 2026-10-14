import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Film,
  Image as ImageIcon,
  Layers,
  FileText,
  Search,
  Filter,
  Plus,
  Edit2,
  Eye,
  Trash2,
  ExternalLink,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/eka";
import type { CreatorPostItem } from "./CreatorOverview";

interface ContentManagementProps {
  posts: CreatorPostItem[];
  onEditPost: (post: CreatorPostItem) => void;
  onPreviewPost: (post: CreatorPostItem) => void;
  onDeletePost: (post: CreatorPostItem) => void;
  onNewStory: () => void;
}

export function ContentManagement({
  posts,
  onEditPost,
  onPreviewPost,
  onDeletePost,
  onNewStory,
}: ContentManagementProps) {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPosts = posts.filter((post) => {
    // Type filter
    if (filterType !== "all") {
      const pKind = post.media_kind || post.type;
      if (filterType === "video" && pKind !== "video") return false;
      if (filterType === "image" && pKind !== "image" && pKind !== "photo") return false;
      if (filterType === "carousel" && pKind !== "carousel") return false;
      if (filterType === "story" && pKind !== "story" && pKind !== "post") return false;
      if (filterType === "article" && pKind !== "article") return false;
    }

    // Status filter
    if (filterStatus !== "all") {
      if (filterStatus === "published" && post.status !== "visible") return false;
      if (filterStatus === "draft" && post.status !== "draft") return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchContent = post.content?.toLowerCase().includes(q);
      const matchTopic = post.topic?.toLowerCase().includes(q);
      const matchTradition = post.tradition?.toLowerCase().includes(q);
      if (!matchContent && !matchTopic && !matchTradition) return false;
    }

    return true;
  });

  const getFormatIcon = (post: CreatorPostItem) => {
    const k = post.media_kind || post.type;
    if (k === "video") return <Film className="size-4 text-primary" />;
    if (k === "carousel") return <Layers className="size-4 text-amber-600" />;
    if (k === "image" || k === "photo") return <ImageIcon className="size-4 text-emerald-600" />;
    return <FileText className="size-4 text-muted-foreground" />;
  };

  const getFormatLabel = (post: CreatorPostItem) => {
    const k = post.media_kind || post.type;
    if (k === "video") return "Video";
    if (k === "carousel") return "Carousel";
    if (k === "image" || k === "photo") return "Photo";
    if (k === "article") return "Article";
    return "Story";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">Content Library & Organization</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your published stories, photos, videos, reels, and drafts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button onClick={onNewStory} size="sm" className="rounded-full gap-1.5 bg-primary text-primary-foreground">
            <Plus className="size-4" />
            <span>Create Story</span>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full gap-1.5">
            <Link to="/create">
              <span>Open Free /create</span>
              <ExternalLink className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl border border-border/80 bg-card shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by caption, topic, tradition…"
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Format Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-9 rounded-xl border border-input bg-background px-3 text-xs"
          >
            <option value="all">All Formats</option>
            <option value="story">Stories</option>
            <option value="video">Videos / Reels</option>
            <option value="carousel">Carousels</option>
            <option value="image">Photos</option>
            <option value="article">Articles</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 rounded-xl border border-input bg-background px-3 text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published (Live)</option>
            <option value="draft">Drafts</option>
          </select>

          {(filterType !== "all" || filterStatus !== "all" || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterType("all");
                setFilterStatus("all");
                setSearchQuery("");
              }}
              className="h-9 text-xs text-muted-foreground rounded-xl"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* 3. Content Table / Grid */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/40 p-10 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            {posts.length === 0
              ? "No content in your library yet. Share your first cultural story or video."
              : "No content matches the selected filter criteria."}
          </p>
          <Button onClick={onNewStory} size="sm" className="rounded-full bg-primary text-primary-foreground">
            <Plus className="size-4 mr-1.5" /> Create Content
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs divide-y divide-border/60">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Left Item Details */}
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="size-10 rounded-xl bg-muted/80 flex items-center justify-center shrink-0 border border-border/40 overflow-hidden">
                  {post.thumbnail_url ? (
                    <img src={post.thumbnail_url} alt="" className="size-full object-cover" />
                  ) : post.media_url && (post.media_kind === "image" || post.type === "image") ? (
                    <img src={post.media_url} alt="" className="size-full object-cover" />
                  ) : (
                    getFormatIcon(post)
                  )}
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate max-w-md">
                      {post.content.slice(0, 70) || "Untitled Story"}
                    </p>
                    <Badge
                      variant={post.status === "visible" ? "default" : "secondary"}
                      className="text-[10px] py-0 px-2 font-normal"
                    >
                      {post.status === "visible" ? "Published" : "Draft"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-muted-foreground">
                    <span className="font-mono">{getFormatLabel(post)}</span>
                    <span>·</span>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                      {post.topic || "Culture"}
                    </Badge>
                    {post.tradition && (
                      <>
                        <span>·</span>
                        <span>{post.tradition}</span>
                      </>
                    )}
                    <span>·</span>
                    <span>Updated {timeAgo(post.updated_at || post.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPreviewPost(post)}
                  className="rounded-full text-xs h-8 px-2.5 text-muted-foreground hover:text-foreground"
                  title="Preview story as seekers see it"
                >
                  <Eye className="size-3.5 mr-1" />
                  <span>Preview</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditPost(post)}
                  className="rounded-full text-xs h-8 px-2.5 text-muted-foreground hover:text-foreground"
                  title="Edit metadata and captions"
                >
                  <Edit2 className="size-3.5 mr-1" />
                  <span>Edit</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeletePost(post)}
                  className="rounded-full text-xs h-8 px-2.5 text-muted-foreground hover:text-destructive"
                  title="Permanently delete post"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
