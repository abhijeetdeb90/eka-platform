// ==============================================================================
// EKA CONSUMER PLATFORM - HOMEPAGE (MARKETING VS SOCIAL FEED)
// ==============================================================================

import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { EKADynamicBanner } from "@/components/home/EKADynamicBanner";
import { LivingWorldVisual } from "@/components/home/LivingWorldVisual";
import { HomeStoriesSection } from "@/components/home/HomeStoriesSection";
import { DiscoveryJourney } from "@/components/home/DiscoveryJourney";
import { StitchHumanPrinciples } from "@/components/home/StitchHumanPrinciples";
import { StitchKeepersAndCovenant } from "@/components/home/StitchKeepersAndCovenant";
import { StitchEditorialHero } from "@/components/home/StitchEditorialHero";
import { StitchOralChantsSection } from "@/components/stories/StitchOralChantsSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Home, Compass, Film, MessageSquare, Bell, Bookmark, User as UserIcon, Settings, PlusCircle, CheckCircle2 } from "lucide-react";
import { track } from "@/lib/analytics";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { FeedPost } from "@/components/feed/FeedPost";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EKA - Understand the world." },
      { name: "description", content: "Don't just scroll the world. Understand it." },
    ],
  }),
  component: EkaHomePage,
});

function DailyReflection() {
  return (
    <section className="container-eka mt-8">
      <div className="rounded-2xl border border-saffron/40 bg-gradient-to-br from-saffron/10 to-transparent p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="size-4 text-saffron-600 dark:text-saffron-400" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-saffron-700 dark:text-saffron-400 font-semibold">
            Daily Reflection
          </p>
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-normal text-foreground mb-4">
          "What is a tradition you carry that no one else in your life does?"
        </h3>
        <Link to="/feed" className="text-sm font-medium text-terracotta hover:underline">
          Join the conversation →
        </Link>
      </div>
    </section>
  );
}

function RecommendedForYou() {
  const topics = ["Vedic Chanting", "Japanese Tea Ceremony", "Stoicism", "Indigenous Navigation", "Sufi Poetry"];
  return (
    <section className="container-eka mt-12">
      <p className="font-mono text-[10px] uppercase tracking-widest text-terracotta font-semibold mb-2">
        HIGHLIGHTS
      </p>
      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mb-5">Recommended for You</h2>
      <div className="flex flex-wrap gap-3">
        {topics.map(t => (
          <div key={t} className="px-5 py-2.5 rounded-full border border-border/80 bg-card/60 hover:bg-accent cursor-pointer transition-colors text-sm font-medium text-foreground shadow-sm">
            {t}
          </div>
        ))}
      </div>
    </section>
  );
}

function HomeLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back to EKA");
      navigate({ to: "/discover" });
    }
  };

  return (
    <div className="mt-8 bg-card/40 border border-border/60 rounded-2xl p-5 shadow-sm max-w-sm backdrop-blur-sm">
      <h3 className="font-serif text-lg font-medium mb-3">Sign in to EKA</h3>
      <form onSubmit={handleLogin} className="space-y-3">
        <Input 
          type="email" 
          placeholder="Email address" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="h-10 bg-background/50 border-border/80"
        />
        <Input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="h-10 bg-background/50 border-border/80"
        />
        <Button type="submit" disabled={loading} className="w-full rounded-xl bg-terracotta hover:bg-terracotta/90 text-white shadow-sm">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-3">
          New to EKA? <Link to="/join" className="text-terracotta hover:underline">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

function EkaLandingPage({ profile }: { profile: any }) {
  const [askQuery, setAskQuery] = useState("");
  const navigate = useNavigate();

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = askQuery.trim();
    track("ask_query_submitted", { source: "homepage_hero", q });
    if (q) {
      navigate({ to: "/ask", search: { q, mode: "canon" } });
    } else {
      navigate({ to: "/ask", search: { q: "", mode: "canon" } });
    }
  };

  const handleChipClick = (query: string) => {
    track("search_submitted", { source: "homepage", q: query });
    navigate({ to: "/ask", search: { q: query, mode: "canon" } });
  };

  return (
    <main id="main-content" className="flex-1 pb-20">
      {/* 1. STITCH EDITORIAL HERO & TRUST OVERLAY */}
      <StitchEditorialHero profile={profile} loginForm={<HomeLoginForm />} />

      {/* Daily Reflection */}
      <DailyReflection />

      {/* Highlights / Recommended */}
      <RecommendedForYou />

      {/* Trending Stories */}
      <div className="mt-14">
        <HomeStoriesSection />
      </div>

      {/* Stitch Oral Chants & Sound Lore Archive */}
      <StitchOralChantsSection />

      {/* Discover Cards (Living World Visual) */}
      <section className="container-eka mt-14">
        <div className="mb-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-terracotta font-semibold">
            DISCOVER
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mt-2">
            The world is full of stories.
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">
            Explore places. Every point is a living tradition waiting to be understood.
          </p>
        </div>
        <LivingWorldVisual />
      </section>

      {/* Ask EKA Preview */}
      <section className="container-eka mt-16">
        <div className="rounded-3xl border border-border/80 bg-card/60 p-8 shadow-sm">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mb-6">
            Understand something.
          </h2>
          <form onSubmit={handleAskSubmit} className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/60 pointer-events-none" />
              <Input
                value={askQuery}
                onChange={(e) => setAskQuery(e.target.value)}
                placeholder="Why do people light diyas? What is Bhoota Kola?"
                className="rounded-full bg-background/95 text-base shadow-sm h-14 pl-12 pr-4 border-border/80 focus-visible:ring-terracotta/30"
              />
            </div>
            <Button
              type="submit"
              className="rounded-full px-8 h-14 bg-foreground text-background hover:bg-foreground/90 shrink-0 text-sm font-semibold"
            >
              Ask EKA
            </Button>
          </form>
          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            {[
              "Why do people light diyas?",
              "Why is Varanasi sacred?",
              "What is Bhoota Kola?",
              "Why do Japanese bow?",
              "Holi vs. Songkran",
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="rounded-full bg-accent/50 border border-border/60 hover:border-terracotta/30 px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stitch Human Covenant & Strategic Principles */}
      <StitchHumanPrinciples />

      {/* Stitch Keepers of Living Memory, Founding Philosophy & Trust Standards */}
      <StitchKeepersAndCovenant />

      {/* Continue Exploring (Discovery Journey) */}
      <div className="mt-16">
        <div className="container-eka mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">Continue Exploring</h2>
        </div>
        <DiscoveryJourney />
      </div>
    </main>
  );
}

function SocialLeftNav() {
  const navItems = [
    { name: "Home", to: "/", icon: Home },
    { name: "Search", to: "/ask", search: { q: "", mode: "canon" }, icon: Search },
    { name: "Explore", to: "/discover", icon: Compass },
    { name: "Cultural Reels", to: "/stories", icon: Film },
    { name: "Messages", to: "/", icon: MessageSquare, disabled: true },
    { name: "Notifications", to: "/", icon: Bell, disabled: true },
    { name: "Create", to: "/app/create", icon: PlusCircle },
    { name: "Saved", to: "/app/me", icon: Bookmark },
    { name: "Profile", to: "/app/me", icon: UserIcon },
  ];

  return (
    <div className="w-64 flex-shrink-0 hidden lg:block sticky top-24 self-start">
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.to}
            search={item.search as any}
            className={`flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={(e) => {
              if (item.disabled) {
                e.preventDefault();
                toast.info("Coming soon!");
              }
            }}
          >
            <item.icon className="size-6 text-foreground" />
            <span className="font-medium text-[15px]">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

function SocialRightSidebar() {
  const suggestions = [
    { name: "Cultural Steward", role: "Varanasi, India", img: "https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1?auto=format&fit=crop&w=150&q=80" },
    { name: "Heritage Archive", role: "Living Traditions", img: "https://images.unsplash.com/photo-1620802051790-2ab14e3fb45c?auto=format&fit=crop&w=150&q=80" },
    { name: "Tea Master Sen", role: "Kyoto, Japan", img: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=150&q=80" }
  ];

  return (
    <div className="w-[300px] flex-shrink-0 hidden xl:block sticky top-24 self-start pl-6 border-l border-border/40">
      <h3 className="font-semibold text-sm text-muted-foreground mb-4">Suggested Custodians</h3>
      <div className="flex flex-col gap-4">
        {suggestions.map((s, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={s.img} alt={s.name} className="size-10 rounded-full object-cover" />
              <div>
                <p className="font-medium text-sm leading-none">{s.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.role}</p>
              </div>
            </div>
            <button className="text-xs font-semibold text-terracotta hover:text-terracotta/80">Follow</button>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-border/40">
        <h3 className="font-semibold text-sm text-muted-foreground mb-4">Curated Collections</h3>
        <div className="flex flex-wrap gap-2">
          {["Textiles", "Sacred Spaces", "Culinary Heritage", "Vedic Wisdom"].map(c => (
            <span key={c} className="text-xs bg-accent/60 px-2.5 py-1 rounded-md text-foreground">{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function EkaSocialFeed() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["social-feed-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:profiles(id, display_name, account_type, avatar_url)
        `)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(15);
      
      if (error) throw error;
      return data;
    }
  });

  // Mock stories
  const stories = [
    { id: 1, user: "Your Story", img: "", isSelf: true },
    { id: 2, user: "Steward", img: "https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1?auto=format&fit=crop&w=150&q=80" },
    { id: 3, user: "Heritage", img: "https://images.unsplash.com/photo-1620802051790-2ab14e3fb45c?auto=format&fit=crop&w=150&q=80" },
    { id: 4, user: "Culture", img: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=150&q=80" },
    { id: 5, user: "Traditions", img: "https://images.unsplash.com/photo-1582560469792-5645e7f1f3a2?auto=format&fit=crop&w=150&q=80" },
  ];

  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto flex px-4 sm:px-6 md:py-8 gap-8">
      {/* Left Navigation */}
      <SocialLeftNav />

      {/* Main Center Feed */}
      <main className="flex-1 max-w-[600px] w-full mx-auto pb-20">
        
        {/* Horizontal Stories */}
        <div className="flex items-center gap-4 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {stories.map(s => (
            <div key={s.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer">
              <div className={`relative rounded-full p-0.5 ${s.isSelf ? 'border-border/50' : 'bg-gradient-to-tr from-saffron to-terracotta'}`}>
                <div className="size-16 rounded-full bg-background border-2 border-background overflow-hidden relative flex items-center justify-center">
                  {s.img ? (
                    <img src={s.img} alt={s.user} className="size-full object-cover" />
                  ) : (
                    <UserIcon className="size-8 text-muted-foreground/40" />
                  )}
                  {s.isSelf && (
                    <div className="absolute bottom-0 right-0 bg-terracotta text-white rounded-full size-5 flex items-center justify-center border-2 border-background">
                      <PlusCircle className="size-3" />
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-medium text-foreground w-16 truncate text-center">{s.user}</span>
            </div>
          ))}
        </div>

        {/* Vertical Feed */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground animate-pulse flex flex-col gap-4">
              <div className="h-64 bg-accent/50 rounded-2xl"></div>
              <div className="h-64 bg-accent/50 rounded-2xl"></div>
            </div>
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
              No posts yet. <Link to="/app/create" className="text-terracotta hover:underline">Create a post</Link> to get started.
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <SocialRightSidebar />
    </div>
  );
}

function EkaHomePage() {
  const { data: profile } = useProfile();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-terracotta/20">
      <SiteHeader />
      
      {profile ? <EkaSocialFeed /> : <EkaLandingPage profile={profile} />}

      {/* Only show footer on landing page to maintain endless scroll feel on social */}
      {!profile && <SiteFooter />}
    </div>
  );
}

