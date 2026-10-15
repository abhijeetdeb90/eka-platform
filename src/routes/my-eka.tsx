// ==============================================================================
// MY EKA — USER'S PERSONAL SANCTUARY LAYER
// ==============================================================================

import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Settings,
  LogOut
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { MetaTags } from "@/components/seo";
import { fetchPostsBy, hydratePosts, type PostRow } from "@/lib/api";
import { PostCard } from "@/components/app/PostCard";
import { EmptyState } from "@/components/app/AppScreen";

export const Route = createFileRoute("/my-eka")({
  head: () => ({
    meta: [
      { title: "My EKA — Personal Sanctuary & Archive | EKA" },
      {
        name: "description",
        content: "Manage your personal cultural profile.",
      },
    ],
  }),
  component: MyEkaPage,
});

function MyEkaPage() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const [activeTab, setActiveTab] = useState("stories");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    void navigate({ to: "/" });
  };

  const { data: myStories } = useQuery({
    queryKey: ["my-stories", profile?.id],
    enabled: !!profile?.id,
    queryFn: () => fetchPostsBy({ authorId: profile!.id }),
  });

  const { data: savedKnowledge } = useQuery({
    queryKey: ["saved-knowledge", profile?.id],
    enabled: !!profile?.id,
    queryFn: async () => {
      const { data: saves } = await supabase
        .from("post_saves")
        .select("post_id")
        .eq("user_id", profile!.id)
        .limit(50);
      if (!saves?.length) return [];
      const { data: posts } = await supabase
        .from("posts")
        .select("*")
        .in("id", saves.map((s) => s.post_id));
      return hydratePosts((posts ?? []) as PostRow[]);
    },
  });

  const { data: communities } = useQuery({
    queryKey: ["my-communities", profile?.id],
    enabled: !!profile?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("community_members")
        .select("communities(id, name, slug, member_count)")
        .eq("user_id", profile!.id);
      return (data ?? []).map((r) => r.communities).filter(Boolean) as {
        id: string;
        name: string;
        slug: string;
        member_count: number;
      }[];
    },
  });

  return (
    <div className="min-h-screen bg-sand/20 dark:bg-stone-950 text-foreground flex flex-col selection:bg-terracotta/20">
      <MetaTags
        title="My EKA — Personal Cultural Sanctuary"
        description="Manage your personalized cultural archive."
        ogTitle="My EKA — Personal Sanctuary"
        ogDescription="Your personal cultural archive."
        canonicalUrl="/my-eka"
        noIndex={true}
      />
      <SiteHeader />

      <main id="main-content" className="flex-1 py-8 sm:py-14 space-y-8">
        <div className="container-eka max-w-3xl space-y-8">
          {/* Profile Card */}
          <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-calm">
            {profile ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="size-16 sm:size-20 rounded-full border-2 border-primary/30 overflow-hidden bg-accent flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.display_name || "Profile"}
                        className="size-full object-cover"
                      />
                    ) : (
                      <User className="size-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                        {profile.display_name || profile.username || "Seeker"}
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/50 px-2 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200/50 font-sans" title="Verified Cultural Custodian">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award fill-amber-500 text-amber-600"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                          Custodian
                        </span>
                      </h1>
                    </div>
                    <p className="text-xs sm:text-sm font-mono text-muted-foreground">
                      @{profile.username || "sanctuary_seeker"}
                    </p>
                    {profile.bio && (
                      <p className="text-xs text-muted-foreground/90 italic pt-1 max-w-md">
                        "{profile.bio}"
                      </p>
                    )}
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      <span className="bg-accent/60 px-2.5 py-0.5 rounded-full font-semibold text-terracotta">
                        {profile.account_type || "Cultural Steward"}
                      </span>
                      <span>•</span>
                      <span>Living Human Custody Archive</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end flex-wrap">
                  <Button variant="outline" size="sm" asChild className="rounded-xl text-xs">
                    <Link to="/app/subscriptions">
                      <span>My Subscriptions</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="rounded-xl text-xs">
                    <Link to="/app/settings">
                      <Settings className="size-3.5 mr-1.5" />
                      <span>Settings</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="rounded-xl text-xs text-destructive hover:text-destructive"
                  >
                    <LogOut className="size-3.5 mr-1" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4 max-w-md mx-auto">
                <div className="size-14 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                  <User className="size-7" />
                </div>
                <div className="space-y-1">
                  <h1 className="font-serif text-2xl font-bold text-foreground">
                    Welcome to My EKA
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground font-light">
                    Sign in to personalize your cultural journey.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button asChild className="rounded-xl px-5 bg-primary">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </div>
              </div>
            )}
          </section>

          {/* Personal Sanctuary Tabs */}
          {profile && (
            <section className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-card border border-border/70 p-1 rounded-2xl flex-wrap h-auto gap-1">
                  <TabsTrigger value="stories" className="rounded-xl text-xs">
                    My Stories
                  </TabsTrigger>
                  <TabsTrigger value="knowledge" className="rounded-xl text-xs">
                    Saved Knowledge
                  </TabsTrigger>
                  <TabsTrigger value="communities" className="rounded-xl text-xs">
                    Communities
                  </TabsTrigger>
                  <TabsTrigger value="places" className="rounded-xl text-xs">
                    Places Explored
                  </TabsTrigger>
                  <TabsTrigger value="contributions" className="rounded-xl text-xs">
                    My Contributions
                  </TabsTrigger>
                  <TabsTrigger value="interests" className="rounded-xl text-xs">
                    Interests
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="stories" className="space-y-4 pt-4">
                  {(myStories?.length ?? 0) === 0 ? (
                    <EmptyState
                      title="No stories yet"
                      body="Share your cultural reflections here."
                    />
                  ) : (
                    myStories?.map((p) => <PostCard key={p.id} post={p} />)
                  )}
                </TabsContent>

                <TabsContent value="knowledge" className="space-y-4 pt-4">
                  {(savedKnowledge?.length ?? 0) === 0 ? (
                    <EmptyState
                      title="No saved knowledge"
                      body="Bookmarks and wisdom you collect will appear here."
                    />
                  ) : (
                    savedKnowledge?.map((p) => <PostCard key={p.id} post={p} />)
                  )}
                </TabsContent>

                <TabsContent value="communities" className="space-y-4 pt-4">
                  {(communities?.length ?? 0) === 0 ? (
                    <EmptyState
                      title="No communities yet"
                      body="Join Sanghas to connect with others."
                    />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {communities?.map((c) => (
                        <Link
                          key={c.id}
                          to="/app/sanghas/$slug"
                          params={{ slug: c.slug }}
                          className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-calm transition-colors hover:bg-accent gap-2"
                        >
                          <span className="font-serif font-bold text-lg">{c.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {c.member_count} members
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="places" className="space-y-4 pt-4">
                  <EmptyState
                    title="No places explored"
                    body="Your checked-in sacred places will be documented here."
                  />
                </TabsContent>

                <TabsContent value="contributions" className="space-y-4 pt-4">
                  <EmptyState
                    title="No contributions yet"
                    body="Your community edits and cultural contributions will appear here."
                  />
                </TabsContent>

                <TabsContent value="interests" className="space-y-4 pt-4">
                  {profile.interests && profile.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((int: string) => (
                        <Badge key={int} variant="secondary" className="px-3 py-1">
                          {int}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No interests added"
                      body="Update your profile settings to add cultural interests."
                    />
                  )}
                </TabsContent>
              </Tabs>
            </section>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

