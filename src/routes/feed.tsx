// ==============================================================================
// EKA FEED — CONSUMER REAL-TIME ACTIVITY & COMMUNITY FEED
// ==============================================================================
// Specification: Primary Consumer Navigation Pillar: FEED (/feed)
// Directly connects the user to living community interactions, discussions,
// creator reflections, and real-time cultural activities.
// ==============================================================================

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { 
  Users, Sparkles, MessageSquare, Plus,
  RefreshCw, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { MetaTags } from "@/components/seo";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FeedPost } from "@/components/feed/FeedPost";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Living Cultural Feed — EKA" },
      {
        name: "description",
        content:
          "Real-time stream of living cultural practices, verified custodian reflections, and community discussions across global traditions.",
      },
      { property: "og:title", content: "Living Cultural Feed — EKA" },
      {
        property: "og:description",
        content:
          "Explore real-time cultural interactions, elder teachings, and living traditions.",
      },
    ],
  }),
  component: FeedPage,
});

function FeedPage() {
  const [activeTab, setActiveTab] = useState("foryou");

  const { data: feedResult, isLoading, isError, refetch } = useQuery({
    queryKey: ["feed-posts", activeTab],
    queryFn: async () => {
      let followedIds: string[] | null = null;

      if (activeTab === "following") {
        const { data: auth, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!auth.user) return { posts: [], requiresSignIn: true };

        const { data: follows, error: followError } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", auth.user.id);
        if (followError) throw followError;

        followedIds = (follows ?? []).map((follow) => follow.following_id);
        if (followedIds.length === 0) return { posts: [], requiresSignIn: false };
      }

      let query = supabase
        .from("posts")
        .select(`
          *,
          author:profiles(id, display_name, account_type, avatar_url, verified)
        `)
        .eq("status", "visible");

      if (followedIds) query = query.in("author_id", followedIds);

      const { data, error } = await query.order("created_at", { ascending: false }).limit(20);
      if (error) {
        console.error("Feed query failed:", error.message);
        throw error;
      }

      return { posts: data ?? [], requiresSignIn: false };
    },
    retry: 1,
  });

  const posts = feedResult?.posts ?? [];
  const requiresSignIn = feedResult?.requiresSignIn ?? false;

  const renderPost = (post: any) => (
    <FeedPost
      key={post.id}
      id={post.id}
      avatar={post.author?.avatar_url || ""}
      name={post.author?.display_name || "Unknown"}
      identity={post.author?.account_type || "Contributor"}
      time={new Date(post.created_at).toLocaleDateString()}
      location={post.tradition || undefined}
      verifiedHuman={post.author?.verified === true}
      topic={post.topic || undefined}
      content={
        <div className="space-y-3">
          {post.topic && <p className="font-bold text-foreground font-sans">{post.topic}</p>}
          <p className="whitespace-pre-wrap">{post.content}</p>
          {post.media_url && (
            post.type === "video" ? (
              <video src={post.media_url} controls className="w-full rounded-xl mt-3 max-h-[60vh] bg-black" />
            ) : (
              <img src={post.media_url} alt="Post media" className="w-full rounded-xl mt-3 max-h-[60vh] object-cover bg-black/5" />
            )
          )}
        </div>
      }
    />
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <MetaTags
        title="Living Cultural Feed — EKA"
        description="Real-time stream of living cultural practices, verified custodian reflections, and community discussions across global traditions."
        ogTitle="Living Cultural Feed — EKA"
        ogDescription="Explore real-time cultural interactions, elder teachings, and living traditions."
        ogImage="/brand/eka-banner.jpg"
        canonicalUrl="/feed"
        twitterCard="summary_large_image"
        twitterTitle="Living Cultural Feed — EKA"
        twitterDescription="Real-time stream of living cultural practices, verified custodian reflections, and community discussions."
        keywords={["community feed", "cultural reflections", "elder teachings", "living rituals", "custodians"]}
      />
      <SiteHeader />

      <main className="flex-1">
        {/* Editorial Subheader */}
        <section className="border-b border-border/40 bg-sand/15 dark:bg-charcoal-light/20 py-8 md:py-12">
          <div className="container-eka max-w-4xl">
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-mono uppercase tracking-wider text-terracotta">
                <Sparkles className="size-3" />
                <span>Living Human Pulse</span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
                Community Activity Feed
              </h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl font-sans">
                Real-time updates, sacred ritual observations, artisanal craft demonstrations, and respectful inquiries shared by custodians and practitioners across global lineages.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-border/30">
              <Button asChild size="sm" className="bg-terracotta text-terracotta-foreground hover:bg-terracotta/90 rounded-full text-xs">
                <Link to="/create">
                  <Plus className="mr-1.5 size-3.5" />
                  Share Cultural Post
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-full text-xs">
                <Link to="/stories">
                  <Sparkles className="mr-1.5 size-3.5" />
                  Watch Stories
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="rounded-full text-xs">
                <Link to="/ask">
                  <MessageSquare className="mr-1.5 size-3.5" />
                  Ask EKA
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Real-time Feed Core */}
        <section className="container-eka max-w-2xl py-8 md:py-12">
          {/* Quick Post Prompt Composer Bar */}
          <div className="mb-6 rounded-2xl border border-border/70 bg-card p-4 shadow-calm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded-full bg-accent flex items-center justify-center shrink-0 text-muted-foreground">
                <Users className="size-5" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                Carry a family ritual or local craft? Share it with the community...
              </p>
            </div>
            <Button asChild size="sm" className="rounded-xl bg-primary text-primary-foreground text-xs shrink-0">
              <Link to="/create">
                <Plus className="size-3.5 mr-1" />
                <span>Post</span>
              </Link>
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-card border border-border/70 p-1 rounded-2xl flex w-full mb-6">
              <TabsTrigger value="foryou" className="rounded-xl text-sm flex-1">
                For You
              </TabsTrigger>
              <TabsTrigger value="following" className="rounded-xl text-sm flex-1">
                Following
              </TabsTrigger>
            </TabsList>

            <TabsContent value="foryou" className="space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="rounded-3xl border border-border/80 bg-card p-6 shadow-calm space-y-4 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-accent" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-4 w-28 bg-accent rounded" />
                          <div className="h-3 w-40 bg-accent/60 rounded" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-accent rounded" />
                        <div className="h-4 w-3/4 bg-accent rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <div className="p-8 text-center text-muted-foreground border border-dashed rounded-3xl space-y-3">
                  <p>Could not refresh live posts from the server.</p>
                  <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl">
                    <RefreshCw className="size-3.5 mr-1.5" />
                    <span>Try again</span>
                  </Button>
                </div>
              ) : posts.map(renderPost)}

              {!isLoading && !isError && posts?.length === 0 && (
                <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-2xl bg-card/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span>No community posts yet. Be the first to share a cultural story!</span>
                  <Button asChild size="sm" variant="outline" className="rounded-xl text-xs shrink-0">
                    <Link to="/create">
                      <span>Create Post</span>
                      <ArrowRight className="size-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="following" className="space-y-6">
              {isLoading ? (
                <p className="p-8 text-center text-sm text-muted-foreground">Loading posts from people you follow…</p>
              ) : isError ? (
                <div className="p-8 text-center text-muted-foreground border border-dashed rounded-3xl space-y-3">
                  <p>Could not load posts from people you follow.</p>
                  <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl">
                    <RefreshCw className="size-3.5 mr-1.5" />
                    Try again
                  </Button>
                </div>
              ) : requiresSignIn ? (
                <div className="p-8 text-center text-muted-foreground border border-dashed rounded-3xl space-y-3">
                  <p>Sign in to see updates from people you follow.</p>
                  <Button asChild size="sm" variant="outline" className="rounded-xl">
                    <Link to="/auth">Sign in</Link>
                  </Button>
                </div>
              ) : posts.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground border border-dashed rounded-3xl space-y-3">
                  <p>No posts from followed accounts yet.</p>
                  <Button asChild size="sm" variant="outline" className="rounded-xl">
                    <Link to="/discover">Discover people to follow</Link>
                  </Button>
                </div>
              ) : (
                posts.map(renderPost)
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
