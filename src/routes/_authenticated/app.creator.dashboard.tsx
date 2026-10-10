import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppScreen } from "@/components/app/AppScreen";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMonetizationTier } from "@/lib/monetization";
import { useProfile } from "@/hooks/useProfile";
import { Lock, ArrowUpRight, FileText, Video, Image as ImageIcon, Edit, Trash2, ShieldCheck, BarChart3, Eye, Heart, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/app/creator/dashboard")({
  component: CreatorStudioDashboard,
});

function CreatorStudioDashboard() {
  const { tier, setTier } = useMonetizationTier();
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();
  const isCreator = tier === "creator";
  const canUseCreatorStudio = isCreator; // Currently unrestricted in demo if bypassed

  const { data: userPosts, isLoading } = useQuery({
    queryKey: ["creator-posts"],
    queryFn: async () => {
      if (!profile?.id) return [];
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("author_id", profile.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id && canUseCreatorStudio
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Content deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["creator-posts"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete post");
    }
  });

  if (!canUseCreatorStudio) {
    return (
      <AppScreen eyebrow="Creator Studio" title="Professional Workspace">
        <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-calm space-y-6 text-center">
          <Badge variant="outline" className="border-terracotta/40 text-terracotta text-xs font-mono uppercase gap-1.5">
            <Lock className="size-3" /> Paid Workspace – Creator Tier
          </Badge>

          <div className="space-y-2 max-w-2xl mx-auto">
            <h1 className="font-serif text-3xl sm:text-4xl text-foreground font-normal">
              Creator Studio – Professional Workspace
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed pt-2">
              Creator Studio is a dedicated workspace for cultural storytellers to manage their content, track analytics, and manage monetization.
            </p>
          </div>

          <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-primary text-primary-foreground">
              <Link to="/membership">
                <span>Unlock Creator Studio (₹1799/month)</span>
                <ArrowUpRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setTier("creator");
                toast.success("Creator Studio preview mode activated!");
              }}
              className="w-full sm:w-auto rounded-full"
            >
              <span>Instant Workspace Demo Preview</span>
            </Button>
          </div>
        </div>
      </AppScreen>
    );
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this content? This action cannot be undone.")) {
      deletePostMutation.mutate(id);
    }
  };

  const publishedCount = userPosts?.filter((c: any) => c.status === "published").length || 0;
  const draftsCount = userPosts?.filter((c: any) => c.status === "draft").length || 0;
  
  // Mock aggregated analytics based on post count to make it feel alive
  const totalViews = (publishedCount * 1245) + (userPosts?.length || 0) * 80;
  const totalLikes = (publishedCount * 342) + (userPosts?.length || 0) * 15;
  const totalSaves = (publishedCount * 115) + (userPosts?.length || 0) * 5;

  return (
    <AppScreen eyebrow="Creator Studio" title="Workspace Dashboard">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your cultural stories, track publishing workflows, and deep dive into analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/membership">Account & Plan</Link>
          </Button>
          <Button variant="outline" asChild disabled>
            <Link to="/">View Earnings</Link>
          </Button>
        </div>
      </div>

      {/* Analytics Overview Section */}
      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        <Card className="bg-card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription className="font-medium text-xs uppercase tracking-wider">Total Content</CardDescription>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <div className="p-6 pt-0">
            <div className="text-3xl font-bold">{userPosts?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {publishedCount} Published · {draftsCount} Drafts
            </p>
          </div>
        </Card>
        
        <Card className="bg-card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription className="font-medium text-xs uppercase tracking-wider">Total Views</CardDescription>
            <Eye className="size-4 text-muted-foreground" />
          </CardHeader>
          <div className="p-6 pt-0">
            <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 mt-1 font-medium">+14% from last month</p>
          </div>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription className="font-medium text-xs uppercase tracking-wider">Total Likes</CardDescription>
            <Heart className="size-4 text-muted-foreground" />
          </CardHeader>
          <div className="p-6 pt-0">
            <div className="text-3xl font-bold text-terracotta">{totalLikes.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 mt-1 font-medium">+5% from last month</p>
          </div>
        </Card>
        
        <Card className="bg-card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription className="font-medium text-xs uppercase tracking-wider">Total Saves</CardDescription>
            <Bookmark className="size-4 text-muted-foreground" />
          </CardHeader>
          <div className="p-6 pt-0">
            <div className="text-3xl font-bold">{totalSaves.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 mt-1 font-medium">+22% from last month</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold">Content Management</h2>
          </div>
          <Card>
            <div className="divide-y divide-border">
              {isLoading ? (
                <div className="p-6 text-center text-muted-foreground text-sm animate-pulse">Loading content...</div>
              ) : !userPosts || userPosts.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm flex flex-col items-center justify-center gap-3">
                  <div className="p-3 bg-accent/50 rounded-full">
                    <FileText className="size-6 text-muted-foreground/60" />
                  </div>
                  <p>No content published yet.</p>
                  <Button variant="outline" asChild size="sm">
                    <Link to="/app/create">Start Publishing</Link>
                  </Button>
                </div>
              ) : (
                userPosts.map((item: any) => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground line-clamp-1">{item.topic || 'Untitled Story'}</span>
                        <Badge variant={item.status === "published" ? "default" : "secondary"} className="text-[10px] capitalize">
                          {item.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 capitalize">
                          {item.type === "video" ? <Video className="size-3" /> : item.type === "carousel" ? <ImageIcon className="size-3" /> : <FileText className="size-3" />}
                          {item.type || "post"}
                        </span>
                        <span>•</span>
                        <span>Created: {new Date(item.created_at).toLocaleDateString()}</span>
                        {item.tradition && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[150px]">{item.tradition}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="hidden sm:flex text-xs text-muted-foreground items-center gap-3 mr-4">
                        <span className="flex items-center gap-1" title="Views"><Eye className="size-3" /> {Math.floor(Math.random() * 1000) + 50}</span>
                        <span className="flex items-center gap-1" title="Likes"><Heart className="size-3" /> {Math.floor(Math.random() * 100) + 10}</span>
                      </div>
                      <Button variant="ghost" size="icon" disabled title="Edit functionality coming soon">
                        <Edit className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive hover:bg-destructive/10" disabled={deletePostMutation.isPending}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-display font-semibold">Create New</h2>
          <div className="grid gap-3">
            <Button asChild className="w-full justify-start gap-3 h-12 hover:bg-accent" variant="outline">
              <Link to="/app/create">
                <FileText className="size-4 text-primary" />
                Write a Cultural Story
              </Link>
            </Button>
            <Button asChild className="w-full justify-start gap-3 h-12 hover:bg-accent" variant="outline">
              <Link to="/app/create">
                <Video className="size-4 text-primary" />
                Upload a Reel / Video
              </Link>
            </Button>
            <Button asChild className="w-full justify-start gap-3 h-12 hover:bg-accent" variant="outline">
              <Link to="/app/create">
                <ImageIcon className="size-4 text-primary" />
                Create Image Carousel
              </Link>
            </Button>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 mt-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <BarChart3 className="size-16" />
            </div>
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <ShieldCheck className="size-4 text-primary" />
              <h3 className="font-medium text-sm">EKA Trust Layer</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed relative z-10">
              All content undergoes automated QCS checks prior to publication. Consistently citing verified cultural sources will elevate your <strong>Creator Trust Tier</strong>, unlocking wider distribution.
            </p>
          </div>
        </div>
      </div>
    </AppScreen>
  );
}
