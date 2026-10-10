// ==============================================================================
// EKA FEED â€” CONSUMER REAL-TIME ACTIVITY & COMMUNITY FEED
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
  Users, Sparkles, MessageSquare, Compass, ShieldCheck, 
  Heart, MessageCircle, Share2, Bookmark, UserPlus, 
  MapPin, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { MetaTags } from "@/components/seo";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Living Cultural Feed â€” EKA" },
      {
        name: "description",
        content:
          "Real-time stream of living cultural practices, verified custodian reflections, and community discussions across global traditions.",
      },
      { property: "og:title", content: "Living Cultural Feed â€” EKA" },
      {
        property: "og:description",
        content:
          "Explore real-time cultural interactions, elder teachings, and living traditions.",
      },
    ],
  }),
  component: FeedPage,
});

import { FeedPost } from "@/components/feed/FeedPost";

function FeedPage() {
  const [activeTab, setActiveTab] = useState("foryou");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["feed-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:profiles(id, display_name, account_type, avatar_url)
        `)
        .eq("status", "visible")
        .order("created_at", { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <MetaTags
        title="Living Cultural Feed"
        description="Real-time stream of living cultural practices, verified custodian reflections, and community discussions across global traditions."
        ogTitle="Living Cultural Feed â€” EKA"
        ogDescription="Explore real-time cultural interactions, elder teachings, and living traditions."
        ogImage="/brand/eka-banner.jpg"
        canonicalUrl="/feed"
        twitterCard="summary_large_image"
        twitterTitle="Living Cultural Feed â€” EKA"
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
                <Link to="/community">
                  <Users className="mr-1.5 size-3.5" />
                  Explore Sanghas & Groups
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-full text-xs">
                <Link to="/stories">
                  <Sparkles className="mr-1.5 size-3.5" />
                  Watch Stories
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="rounded-full text-xs">
                <Link to="/ask" search={{ q: "" } as any}>
                  <MessageSquare className="mr-1.5 size-3.5" />
                  Ask EKA
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Real-time Feed Core */}
        <section className="container-eka max-w-2xl py-8 md:py-12">
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
                <div className="p-8 text-center text-muted-foreground">Loading posts...</div>
              ) : posts && posts.length > 0 ? (
                posts.map((post: any) => (
                  <FeedPost 
                    key={post.id}
                    id={post.id}
                    avatar={post.author?.avatar_url || ""}
                    name={post.author?.display_name || "Unknown"}
                    identity={post.author?.account_type || "Contributor"}
                    time={new Date(post.created_at).toLocaleDateString()}
                    location={post.tradition || undefined}
                    verifiedHuman={true}
                    content={
                      <div className="space-y-3">
                        {post.topic && <p className="font-bold">{post.topic}</p>}
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
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground border border-dashed rounded-3xl">
                  No posts yet. Be the first to contribute to the living archive!
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="following" className="space-y-6">
              <div className="p-8 text-center text-muted-foreground border border-dashed rounded-3xl">
                Follow custodians to see their updates here.
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}




