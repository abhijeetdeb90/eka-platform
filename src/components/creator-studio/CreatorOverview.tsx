import React from "react";
import { Link } from "@tanstack/react-router";
import {
  FileText,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  Film,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { timeAgo } from "@/lib/eka";

export type DateRangeFilter = "all" | "30d" | "7d";

export interface CreatorPostItem {
  id: string;
  author_id: string;
  content: string;
  topic: string | null;
  tradition: string | null;
  type: string;
  status: string;
  media_url: string | null;
  created_at: string;
  updated_at: string;
  like_count: number;
  comment_count: number;
  media_kind?: string;
  thumbnail_url?: string | null;
  caption_text?: string | null;
  format?: string;
  language?: string | null;
  location_label?: string | null;
  views_count?: number | null;
  saves_count?: number;
}

interface CreatorOverviewProps {
  posts: CreatorPostItem[];
  followerCount: number;
  viewsCount: number | null;
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  dateRange: DateRangeFilter;
  onDateRangeChange: (range: DateRangeFilter) => void;
  onSelectPost: (post: CreatorPostItem) => void;
  onNewStory: () => void;
  onOpenAnalytics: () => void;
}

export function CreatorOverview({
  posts,
  followerCount,
  viewsCount,
  likesCount,
  commentsCount,
  savesCount,
  dateRange,
  onDateRangeChange,
  onSelectPost,
  onNewStory,
  onOpenAnalytics,
}: CreatorOverviewProps) {
  const publishedPosts = posts.filter((p) => p.status === "visible");
  const draftPosts = posts.filter((p) => p.status === "draft");

  // Rank best performing by actual total engagements + views
  const sortedByEngagement = [...publishedPosts].sort((a, b) => {
    const scoreA = (a.views_count || 0) + (a.like_count || 0) * 2 + (a.comment_count || 0) * 3 + (a.saves_count || 0) * 4;
    const scoreB = (b.views_count || 0) + (b.like_count || 0) * 2 + (b.comment_count || 0) * 3 + (b.saves_count || 0) * 4;
    return scoreB - scoreA;
  });

  const topPosts = sortedByEngagement.slice(0, 3);
  const recentPosts = [...posts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 5);

  const totalEngagement = likesCount + commentsCount + savesCount;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Filter Bar & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">
            Period:
          </span>
          {(
            [
              { id: "all" as const, label: "All Time" },
              { id: "30d" as const, label: "Last 30 Days" },
              { id: "7d" as const, label: "Last 7 Days" },
            ] as const
          ).map((r) => (
            <Button
              key={r.id}
              variant={dateRange === r.id ? "default" : "outline"}
              size="sm"
              onClick={() => onDateRangeChange(r.id)}
              className="rounded-full text-xs h-8 px-3"
            >
              {r.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <Button onClick={onNewStory} size="sm" className="rounded-full gap-1.5 bg-primary text-primary-foreground">
            <Plus className="size-4" />
            <span>Create Story</span>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full gap-1.5">
            <Link to="/create">
              <span>Free Publishing Engine</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Primary KPI Telemetry Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Published Content */}
        <Card className="rounded-2xl border-border/80 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              Published Content
            </CardDescription>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-foreground">{publishedPosts.length}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <span>{draftPosts.length} drafts saved</span>
              <span>·</span>
              <span className="text-emerald-600 font-medium">{posts.length} total</span>
            </p>
          </CardContent>
        </Card>

        {/* Real Views */}
        <Card className="rounded-2xl border-border/80 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              Recorded Views
            </CardDescription>
            <Eye className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-primary">{viewsCount === null ? "—" : viewsCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {viewsCount === null ? "View tracking unavailable" : viewsCount === 0 ? "No views recorded yet" : "Authentic database views logged"}
            </p>
          </CardContent>
        </Card>

        {/* Engagements */}
        <Card className="rounded-2xl border-border/80 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              Total Engagements
            </CardDescription>
            <Heart className="size-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-foreground">{totalEngagement.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
              <span>{likesCount} likes</span>
              <span>·</span>
              <span>{commentsCount} comments</span>
              <span>·</span>
              <span>{savesCount} saves</span>
            </p>
          </CardContent>
        </Card>

        {/* Followers */}
        <Card className="rounded-2xl border-border/80 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              Followers
            </CardDescription>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-foreground">{followerCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active seekers following your archive
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Empty State / Onboarding for New Creators */}
      {posts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-8 sm:p-12 text-center space-y-4">
          <div className="size-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <Sparkles className="size-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="font-serif text-xl font-semibold text-foreground">
              Welcome to your Creator Studio
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              You haven't published any stories or cultural documentation yet. As an EKA+ subscriber,
              every piece of content you share will generate real audience analytics, viewer retention data,
              and citation tracking.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={onNewStory} className="rounded-full bg-primary text-primary-foreground gap-1.5">
              <Plus className="size-4" />
              <span>Create Your First Cultural Story</span>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/create">Use Free Living Archive Engine</Link>
            </Button>
          </div>
        </div>
      ) : (
        /* 4. Active Content Sections: Top Stories & Recent Activity */
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Best-Performing Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                <span>Best-Performing Content</span>
              </h3>
              <Button variant="link" size="sm" onClick={onOpenAnalytics} className="text-xs text-primary p-0 h-auto">
                Full analytics →
              </Button>
            </div>

            {topPosts.length === 0 ? (
              <div className="rounded-2xl border border-border p-6 text-center text-xs text-muted-foreground">
                Publish a visible story to see performance rankings.
              </div>
            ) : (
              <div className="space-y-3">
                {topPosts.map((post, rank) => (
                  <div
                    key={post.id}
                    onClick={() => onSelectPost(post)}
                    className="group rounded-2xl border border-border/80 bg-card p-4 hover:border-primary/50 transition-all cursor-pointer flex items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="size-8 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        #{rank + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                            {post.content.slice(0, 50) || "Untitled Story"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                            {post.topic || "Culture"}
                          </Badge>
                          <span>·</span>
                          <span>{timeAgo(post.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs shrink-0 text-muted-foreground">
                      <span className="flex items-center gap-1" title="Views">
                        <Eye className="size-3.5 text-primary" />
                        <span>{post.views_count == null ? "—" : post.views_count.toLocaleString()}</span>
                      </span>
                      <span className="flex items-center gap-1" title="Likes">
                        <Heart className="size-3.5 text-rose-500" />
                        <span>{post.like_count ?? 0}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Publishing Activity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span>Recent Activity</span>
              </h3>
              <Badge variant="outline" className="text-[10px] font-mono">
                {posts.length} Total Records
              </Badge>
            </div>

            <div className="divide-y divide-border/60 rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="p-3.5 hover:bg-muted/40 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                      {post.media_kind === "video" || post.type === "video" ? (
                        <Film className="size-3.5" />
                      ) : post.media_kind === "carousel" || post.type === "carousel" ? (
                        <Layers className="size-3.5" />
                      ) : (
                        <ImageIcon className="size-3.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {post.content.slice(0, 60) || "Story reflection"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {post.status === "visible" ? "Published" : "Draft"} · {timeAgo(post.created_at)}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={post.status === "visible" ? "default" : "secondary"}
                    className="text-[10px] py-0 px-2 shrink-0 font-normal"
                  >
                    {post.status === "visible" ? "Live" : "Draft"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
