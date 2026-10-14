import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  Layers,
  BarChart3,
  Palette,
  Wallet,
  BookOpen,
  ShieldCheck,
  Plus,
  RefreshCw,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  Flame,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useEkaPlusAccess } from "@/hooks/useEkaPlusAccess";
import { EkaPlusUpgradeScreen } from "./EkaPlusUpgradeScreen";
import {
  CreatorOverview,
  type CreatorPostItem,
  type DateRangeFilter,
} from "./CreatorOverview";
import { ContentManagement } from "./ContentManagement";
import { PerformanceAnalytics } from "./PerformanceAnalytics";
import { CreatorProductivity } from "./CreatorProductivity";
import { MonetisationReadiness } from "./MonetisationReadiness";
import { ContentEditModal } from "./ContentEditModal";
import { ContentPreviewModal } from "./ContentPreviewModal";

interface CreatorStudioWorkspaceProps {
  /** If rendered inside AppScreen layout or standalone */
  inAppLayout?: boolean;
}

export function CreatorStudioWorkspace({ inAppLayout = false }: CreatorStudioWorkspaceProps) {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: access, isLoading: accessLoading } = useEkaPlusAccess();

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [dateRange, setDateRange] = useState<DateRangeFilter>("all");
  const [posts, setPosts] = useState<CreatorPostItem[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [walletBalancePaise, setWalletBalancePaise] = useState<number>(0);

  // Modals state
  const [editingPost, setEditingPost] = useState<CreatorPostItem | null>(null);
  const [previewingPost, setPreviewingPost] = useState<CreatorPostItem | null>(null);

  // 1. Fetch genuine recorded creator data from Supabase
  const loadCreatorData = useCallback(async () => {
    if (!profile?.id) return;
    setLoadingPosts(true);

    try {
      // A. Fetch creator's posts
      const { data: rawPosts, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("author_id", profile.id)
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Error fetching creator posts:", postsError);
        toast.error("Could not load your posts.");
        setLoadingPosts(false);
        return;
      }

      const postIds = (rawPosts || []).map((p) => p.id);

      // B. Fetch genuine views from post_views table
      let viewMap: Record<string, number> = {};
      if (postIds.length > 0) {
        const { data: viewsData, error: viewsError } = await supabase
          .from("post_views")
          .select("post_id, created_at")
          .in("post_id", postIds);

        if (!viewsError && viewsData) {
          viewsData.forEach((v) => {
            viewMap[v.post_id] = (viewMap[v.post_id] || 0) + 1;
          });
        }
      }

      // C. Fetch genuine saves from post_saves table
      let saveMap: Record<string, number> = {};
      if (postIds.length > 0) {
        const { data: savesData, error: savesError } = await supabase
          .from("post_saves")
          .select("post_id, created_at")
          .in("post_id", postIds);

        if (!savesError && savesData) {
          savesData.forEach((s) => {
            saveMap[s.post_id] = (saveMap[s.post_id] || 0) + 1;
          });
        }
      }

      // D. Combine into CreatorPostItem
      const enrichedPosts: CreatorPostItem[] = (rawPosts || []).map((p) => ({
        id: p.id,
        author_id: p.author_id,
        content: p.content,
        topic: p.topic,
        tradition: p.tradition,
        type: p.type,
        status: p.status,
        media_url: p.media_url,
        created_at: p.created_at,
        updated_at: p.updated_at,
        like_count: p.like_count || 0,
        comment_count: p.comment_count || 0,
        views_count: viewMap[p.id] || 0,
        saves_count: saveMap[p.id] || 0,
      }));

      setPosts(enrichedPosts);

      // E. Follower count from follows table
      const { count: followers, error: followError } = await supabase
        .from("follows")
        .select("id", { count: "exact", head: true })
        .eq("following_id", profile.id);

      if (!followError && typeof followers === "number") {
        setFollowerCount(followers);
      }

      // F. Wallet balance from wallets table (if present)
      const { data: walletData } = await supabase
        .from("wallets")
        .select("balance_cents")
        .eq("user_id", profile.id)
        .maybeSingle();

      if (walletData) {
        setWalletBalancePaise(walletData.balance_cents || 0);
      }
    } catch (err) {
      console.error("Failed to load creator telemetry:", err);
    } finally {
      setLoadingPosts(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    if (profile?.id && access?.isEntitled) {
      loadCreatorData();
    }
  }, [profile?.id, access?.isEntitled, loadCreatorData]);

  // 2. Filter posts by date range
  const filteredPosts = useMemo(() => {
    if (dateRange === "all") return posts;
    const now = Date.now();
    const daysLimit = dateRange === "7d" ? 7 : 30;
    const cutoff = now - daysLimit * 86_400_000;

    return posts.filter((p) => new Date(p.created_at).getTime() >= cutoff);
  }, [posts, dateRange]);

  // Totals for metrics
  const totalViews = useMemo(() => {
    return filteredPosts.reduce((acc, p) => acc + (p.views_count || 0), 0);
  }, [filteredPosts]);

  const totalLikes = useMemo(() => {
    return filteredPosts.reduce((acc, p) => acc + (p.like_count || 0), 0);
  }, [filteredPosts]);

  const totalComments = useMemo(() => {
    return filteredPosts.reduce((acc, p) => acc + (p.comment_count || 0), 0);
  }, [filteredPosts]);

  const totalSaves = useMemo(() => {
    return filteredPosts.reduce((acc, p) => acc + (p.saves_count || 0), 0);
  }, [filteredPosts]);

  // Handle post deletion
  const handleDeletePost = async (post: CreatorPostItem) => {
    const confirm = window.confirm(
      `Are you sure you want to delete "${post.content.slice(0, 40)}..."? This action cannot be undone.`
    );
    if (!confirm) return;

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id)
      .eq("author_id", profile?.id || "");

    if (error) {
      toast.error(`Could not delete post: ${error.message}`);
      return;
    }

    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    toast.success("Post deleted from archive.");
  };

  // Handle post update
  const handlePostUpdated = (updated: CreatorPostItem) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingPost(null);
  };

  // Handle research attach to draft
  const handleAttachToDraft = async (researchData: {
    title: string;
    caption: string;
    topic: string;
    sources: string;
  }) => {
    if (!profile?.id) {
      toast.error("Please sign in to save story drafts.");
      return;
    }

    try {
      const fullContent = `${researchData.title}\n\n${researchData.caption}`;
      const { data: newPost, error } = await supabase
        .from("posts")
        .insert({
          author_id: profile.id,
          content: fullContent,
          topic: researchData.topic || "Traditions",
          status: "draft",
          type: "story",
          source_name: researchData.sources || "EKA Research Manuscript",
        })
        .select()
        .single();

      if (error) {
        toast.error(`Failed to create draft: ${error.message}`);
        return;
      }

      toast.success("Cultural research attached as a new story draft!");
      setActiveTab("content");
      loadCreatorData();
    } catch (err: any) {
      toast.error(`Error attaching research: ${err?.message || "Unknown error"}`);
    }
  };

  // 3. Subscription Gate Enforced: If not entitled, show Upgrade Screen immediately
  if (!accessLoading && !access?.isEntitled) {
    return <EkaPlusUpgradeScreen onSuccess={loadCreatorData} />;
  }

  // 4. Loading state while checking credentials
  if (accessLoading || (access?.isEntitled && profileLoading)) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center p-8 space-y-4">
        <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-mono text-muted-foreground animate-pulse">
          Verifying EKA+ subscriber credentials…
        </p>
      </div>
    );
  }

  // 5. Entitled Subscriber View: Full Creator Studio Workspace
  return (
    <div className={`space-y-8 animate-in fade-in duration-300 ${inAppLayout ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"}`}>
      {/* Workspace Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border/70">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/5 text-primary text-[11px] font-mono uppercase tracking-wider gap-1.5 py-0.5 px-2.5"
            >
              <CheckCircle2 className="size-3.5 text-primary" />
              EKA+ Verified Workspace
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
              Plan: ₹499/mo
            </Badge>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            Creator & Contributor Studio
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            Professional workspace for verified cultural storytellers. Track real audience telemetry, manage multi-format archives, and research with grounded Ask EKA AI.
          </p>
        </div>

        {/* Global Quick Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={loadCreatorData}
            disabled={loadingPosts}
            className="rounded-full text-xs"
            title="Refresh recorded metrics from database"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loadingPosts ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            asChild
            size="sm"
            className="rounded-full text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-calm"
          >
            <Link to="/create">
              <Plus className="size-3.5 mr-1.5" />
              New Cultural Story
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Studio Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b border-border/60 overflow-x-auto scrollbar-none">
          <TabsList className="bg-transparent h-auto p-0 gap-2 sm:gap-6">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary px-3 py-2.5 text-xs sm:text-sm font-medium transition-all"
            >
              <Layers className="size-4 mr-2 inline" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary px-3 py-2.5 text-xs sm:text-sm font-medium transition-all"
            >
              <Palette className="size-4 mr-2 inline" />
              Content Management ({posts.length})
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary px-3 py-2.5 text-xs sm:text-sm font-medium transition-all"
            >
              <BarChart3 className="size-4 mr-2 inline" />
              Performance Analytics
            </TabsTrigger>
            <TabsTrigger
              value="productivity"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary px-3 py-2.5 text-xs sm:text-sm font-medium transition-all"
            >
              <Sparkles className="size-4 mr-2 inline text-saffron" />
              Ask EKA AI Research
            </TabsTrigger>
            <TabsTrigger
              value="monetisation"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary px-3 py-2.5 text-xs sm:text-sm font-medium transition-all"
            >
              <Wallet className="size-4 mr-2 inline" />
              Monetisation Readiness
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Creator Overview */}
        <TabsContent value="overview" className="mt-0 outline-none">
          <CreatorOverview
            posts={filteredPosts}
            followerCount={followerCount}
            viewsCount={totalViews}
            likesCount={totalLikes}
            commentsCount={totalComments}
            savesCount={totalSaves}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onSelectPost={(post) => setPreviewingPost(post)}
            onNewStory={() => navigate({ to: "/create" })}
            onOpenAnalytics={() => setActiveTab("analytics")}
          />
        </TabsContent>

        {/* Tab 2: Content Management */}
        <TabsContent value="content" className="mt-0 outline-none">
          <ContentManagement
            posts={posts}
            onEditPost={(post) => setEditingPost(post)}
            onPreviewPost={(post) => setPreviewingPost(post)}
            onDeletePost={handleDeletePost}
            onNewStory={() => navigate({ to: "/create" })}
          />
        </TabsContent>

        {/* Tab 3: Performance Analytics */}
        <TabsContent value="analytics" className="mt-0 outline-none">
          <PerformanceAnalytics
            posts={filteredPosts}
            followerCount={followerCount}
            viewsCount={totalViews}
            likesCount={totalLikes}
            commentsCount={totalComments}
            savesCount={totalSaves}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onSelectPost={(post) => setPreviewingPost(post)}
          />
        </TabsContent>

        {/* Tab 4: Creator Productivity & AI Research */}
        <TabsContent value="productivity" className="mt-0 outline-none">
          <CreatorProductivity onAttachToDraft={handleAttachToDraft} />
        </TabsContent>

        {/* Tab 5: Monetisation Readiness */}
        <TabsContent value="monetisation" className="mt-0 outline-none">
          <MonetisationReadiness
            grossEarningsPaise={walletBalancePaise}
            netPayablePaise={Math.round(walletBalancePaise * 0.9)}
            payoutStatus={walletBalancePaise > 0 ? "ready" : "unconfigured"}
          />
        </TabsContent>
      </Tabs>

      {/* Content Modals */}
      <ContentEditModal
        post={editingPost}
        isOpen={Boolean(editingPost)}
        onClose={() => setEditingPost(null)}
        onUpdated={handlePostUpdated}
      />

      <ContentPreviewModal
        post={previewingPost}
        isOpen={Boolean(previewingPost)}
        onClose={() => setPreviewingPost(null)}
        creatorName={profile?.display_name || "EKA Creator"}
        creatorUsername={profile?.username || "creator"}
        creatorAvatar={profile?.avatar_url}
      />
    </div>
  );
}
