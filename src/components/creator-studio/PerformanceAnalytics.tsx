import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  Users,
  ArrowUpDown,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { CreatorPostItem, DateRangeFilter } from "./CreatorOverview";
import { timeAgo } from "@/lib/eka";

interface PerformanceAnalyticsProps {
  posts: CreatorPostItem[];
  followerCount: number;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  dateRange: DateRangeFilter;
  onDateRangeChange: (range: DateRangeFilter) => void;
  onSelectPost: (post: CreatorPostItem) => void;
}

type SortField = "views" | "likes" | "comments" | "saves" | "engagementRate" | "date";

export function PerformanceAnalytics({
  posts,
  followerCount,
  viewsCount,
  likesCount,
  commentsCount,
  savesCount,
  dateRange,
  onDateRangeChange,
  onSelectPost,
}: PerformanceAnalyticsProps) {
  const [sortField, setSortField] = useState<SortField>("views");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const published = posts.filter((p) => p.status === "visible");
  const totalEngagement = likesCount + commentsCount + savesCount;
  const overallEngagementRate =
    viewsCount > 0 ? ((totalEngagement / viewsCount) * 100).toFixed(1) : "0.0";

  // Calculate engagement rate for individual posts
  const postAnalytics = published.map((post) => {
    const v = post.views_count || 0;
    const l = post.like_count || 0;
    const c = post.comment_count || 0;
    const s = post.saves_count || 0;
    const eng = l + c + s;
    const rate = v > 0 ? (eng / v) * 100 : 0;

    return {
      post,
      views: v,
      likes: l,
      comments: c,
      saves: s,
      totalEng: eng,
      engagementRate: rate,
      createdTime: new Date(post.created_at).getTime(),
    };
  });

  // Sort
  const sorted = [...postAnalytics].sort((a, b) => {
    let diff = 0;
    if (sortField === "views") diff = a.views - b.views;
    else if (sortField === "likes") diff = a.likes - b.likes;
    else if (sortField === "comments") diff = a.comments - b.comments;
    else if (sortField === "saves") diff = a.saves - b.saves;
    else if (sortField === "engagementRate") diff = a.engagementRate - b.engagementRate;
    else if (sortField === "date") diff = a.createdTime - b.createdTime;

    return sortAsc ? diff : -diff;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header with Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="size-5 text-primary" />
            <span>Audience & Content Performance Analytics</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Grounded database metrics from seekers interacting with your cultural archive.
          </p>
        </div>

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
      </div>

      {/* 2. Key Metrics Summary Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border/80 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              Total Real Views
            </CardDescription>
            <Eye className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-primary">{viewsCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Recorded post view events</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              Engagement Rate
            </CardDescription>
            <TrendingUp className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-foreground">{overallEngagementRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Interactions per recorded view</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              Saves & Bookmarks
            </CardDescription>
            <Bookmark className="size-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-foreground">{savesCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Added to seeker passports</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              Follower Community
            </CardDescription>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-foreground">{followerCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Seekers actively following you</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Content-Level Performance Comparison Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-serif text-lg font-semibold text-foreground">Content-Level Comparison</h3>
          <span className="text-xs text-muted-foreground">
            Click column headers to sort by performance
          </span>
        </div>

        {sorted.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-8 text-center text-xs text-muted-foreground">
            No published content to compare. Once you publish visible stories, their detailed telemetry will appear here.
          </div>
        ) : (
          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30 font-mono text-[11px] text-muted-foreground">
                    <th className="py-3 px-4 font-semibold">Story / Title</th>
                    <th className="py-3 px-3">Format</th>
                    <th className="py-3 px-3">Category</th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => toggleSort("views")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Views</span>
                        <ArrowUpDown className="size-3" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => toggleSort("likes")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Likes</span>
                        <ArrowUpDown className="size-3" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => toggleSort("comments")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Comments</span>
                        <ArrowUpDown className="size-3" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => toggleSort("saves")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Saves</span>
                        <ArrowUpDown className="size-3" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => toggleSort("engagementRate")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Eng. Rate</span>
                        <ArrowUpDown className="size-3" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => toggleSort("date")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Date</span>
                        <ArrowUpDown className="size-3" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {sorted.map(({ post, views, likes, comments, saves, engagementRate }) => (
                    <tr
                      key={post.id}
                      onClick={() => onSelectPost(post)}
                      className="hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-medium text-foreground max-w-xs truncate">
                        {post.content.slice(0, 60) || "Untitled Story"}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground uppercase">
                        {post.media_kind || post.type}
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                          {post.topic || "Culture"}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-display font-medium text-primary">
                        {views.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-display">{likes.toLocaleString()}</td>
                      <td className="py-3 px-3 font-display">{comments.toLocaleString()}</td>
                      <td className="py-3 px-3 font-display">{saves.toLocaleString()}</td>
                      <td className="py-3 px-3 font-mono font-medium text-emerald-600">
                        {views > 0 ? `${engagementRate.toFixed(1)}%` : "—"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-[11px]">
                        {timeAgo(post.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 4. Privacy & Measurement Integrity Notice */}
      <div className="rounded-2xl border border-border/60 bg-muted/20 p-5 flex items-start gap-3 text-xs text-muted-foreground">
        <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">Data Minimization & Ethical Telemetry</p>
          <p className="leading-relaxed font-light">
            EKA measures authentic audience interactions (views, saves, discussions, citations) without
            tracking invasive cross-site browsing or personal identities. In compliance with data protection
            principles, engagement statistics are aggregated directly from your content's interaction log.
          </p>
        </div>
      </div>
    </div>
  );
}
