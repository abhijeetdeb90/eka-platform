// ==============================================================================
// EKA COMMUNITY — GLOBAL CULTURAL COMMUNITIES
// ==============================================================================
// People who share something worth preserving.
// Categories: Traditions · Crafts · Places · Languages · Food · Faith · Philosophy · Local Life
// Sangha is a community TYPE, not the universal terminology.
// ==============================================================================

import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  MessageSquare,
  ShieldCheck,
  Plus,
  Search,
  Film,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { track } from "@/lib/analytics";
import { toggleMembership } from "@/lib/api";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Communities — People worth knowing | EKA" },
      {
        name: "description",
        content:
          "Join communities built around traditions, crafts, places, languages, food, faith, and local life. People who share something worth preserving.",
      },
      { property: "og:title", content: "EKA Communities" },
      {
        property: "og:description",
        content: "People who share something worth preserving.",
      },
    ],
  }),
  component: CommunityPage,
});

const CATEGORY_FILTERS = [
  { id: "all", label: "All" },
  { id: "joined", label: "My Communities" },
  { id: "Traditions", label: "Traditions" },
  { id: "Crafts & Lineages", label: "Crafts" },
  { id: "Places & Pilgrimage", label: "Places" },
  { id: "Languages", label: "Languages" },
  { id: "Food", label: "Food" },
  { id: "Faith", label: "Faith" },
  { id: "Philosophy & Texts", label: "Philosophy" },
  { id: "Local Life", label: "Local Life" },
];

function CommunityPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: profile } = useProfile();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityDesc, setNewCommunityDesc] = useState("");

  const { data: dbCommunities } = useQuery({
    queryKey: ["all-communities-public"],
    queryFn: async () => {
      const { data } = await supabase
        .from("communities")
        .select("*")
        .order("member_count", { ascending: false });
      return data || [];
    },
  });

  const { data: userMemberships } = useQuery({
    queryKey: ["user-community-memberships", profile?.id],
    enabled: !!profile?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("community_members")
        .select("community_id")
        .eq("user_id", profile!.id);
      return new Set((data || []).map((m) => m.community_id));
    },
  });

  const allCommunities = (dbCommunities || []).map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    category: c.category || "General",
    memberCount: c.member_count || 0,
  }));

  const joinedCommunities = userMemberships || new Set();

  const filteredCommunities = allCommunities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCat = false;
    if (selectedCategory === "all") {
      matchesCat = true;
    } else if (selectedCategory === "joined") {
      matchesCat = joinedCommunities.has(c.id);
    } else {
      matchesCat = c.category === selectedCategory;
    }

    return matchesSearch && matchesCat;
  });

  const handleToggleJoin = async (id: string, name: string) => {
    if (!profile) {
      toast.info("Please sign in to join communities");
      void navigate({ to: "/auth", search: { next: "/community" } as any });
      return;
    }
    
    const isJoined = joinedCommunities.has(id);
    await toggleMembership(id, isJoined);
    
    if (isJoined) {
      toast.info(`Left ${name}`);
    } else {
      toast.success(`Welcome to ${name}!`);
      track("community_join", { communityId: id, name });
    }
    
    void queryClient.invalidateQueries({ queryKey: ["user-community-memberships", profile.id] });
    void queryClient.invalidateQueries({ queryKey: ["all-communities-public"] });
  };

  const handleCreateCommunity = async () => {
    if (!profile) {
      toast.info("Please sign in to create a community");
      void navigate({ to: "/auth", search: { next: "/community" } as any });
      return;
    }
    if (!newCommunityName.trim()) {
      toast.error("Please enter a community name");
      return;
    }
    const slug = newCommunityName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    
    const { data: created, error } = await supabase.from("communities").insert({
      slug,
      name: newCommunityName.trim(),
      description: newCommunityDesc.trim(),
      category: "General",
      created_by: profile.id,
    }).select("id").single();
    
    if (error || !created) {
      toast.error("Could not create community: " + (error?.message || "Invalid input"));
    } else {
      await supabase.from("community_members").insert({
        community_id: created.id,
        user_id: profile.id,
        role: "owner"
      });
      toast.success("Community created!");
      setCreateDialogOpen(false);
      setNewCommunityName("");
      setNewCommunityDesc("");
      void queryClient.invalidateQueries({ queryKey: ["all-communities-public"] });
      void queryClient.invalidateQueries({ queryKey: ["user-community-memberships", profile.id] });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />

      <main id="main-content" className="flex-1 py-8 sm:py-12 space-y-8">

        {/* ── Page Header (Stitch Living Hearths Discovery) ── */}
        <section className="container-eka">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/60">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/70 text-terracotta font-mono text-[10px] uppercase tracking-wider font-semibold mb-3">
                <ShieldCheck className="size-3.5" />
                Living Guilds & Hearth Circles
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-foreground leading-[1.15]">
                Hearths of Living Practice
              </h1>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                Gather around heirloom foodways, lost-wax metallurgy, untranslatable poetry, and courtyard architecture. Stewarded by verified human practitioners.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-end">
              <Link
                to="/find-your-people"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent/60 hover:bg-accent text-xs font-semibold text-foreground transition-colors"
              >
                <Users className="size-3.5 text-terracotta" />
                <span>Find Your People</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Category Strip ── */}
        <section className="container-eka">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all border ${
                  selectedCategory === cat.id
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border/70 hover:border-border hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Search & Create ── */}
        <section className="container-eka">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search communities…"
                className="pl-10 rounded-xl bg-card border-border/80"
              />
            </div>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl bg-gradient-to-r from-terracotta to-saffron text-white shadow-xs shrink-0 w-full sm:w-auto">
                  <Plus className="mr-1.5 size-4" />
                  <span>Start a Community</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-serif text-xl">Start a Community</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <p className="text-xs text-muted-foreground">
                    A community is a dedicated circle around a lineage, practice, craft, or place.
                    Sanghas, guilds, and circles all welcome.
                  </p>
                  <Input
                    value={newCommunityName}
                    onChange={(e) => setNewCommunityName(e.target.value)}
                    placeholder="Community name"
                    className="rounded-xl"
                  />
                  <Textarea
                    value={newCommunityDesc}
                    onChange={(e) => setNewCommunityDesc(e.target.value)}
                    placeholder="What is the shared purpose of this community?"
                    rows={3}
                    className="rounded-xl"
                  />
                  <Button onClick={handleCreateCommunity} className="w-full rounded-xl">
                    Create Community
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* ── Communities Grid ── */}
        <section className="container-eka">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommunities.map((c) => {
              const isJoined = joinedCommunities.has(c.id);
              return (
                <div
                  key={c.id}
                  className="group rounded-2xl border border-border/70 bg-card p-5 hover:border-border hover:shadow-xs transition-all flex flex-col justify-between gap-4"
                >
                  <Link to="/app/sanghas/$slug" params={{ slug: c.slug }} className="block space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border border-border/60 rounded-full px-2.5 py-0.5">
                        {c.category}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                        <Users className="size-3" />
                        {c.memberCount.toLocaleString()}
                      </span>
                    </div>

                    <h2 className="font-serif text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {c.name}
                    </h2>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {c.description}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <Link to="/app/sanghas/$slug" params={{ slug: c.slug }} className="hover:text-foreground flex items-center gap-1 transition-colors">
                        <MessageSquare className="size-3 text-primary/60" />
                        Discussions
                      </Link>
                    </div>

                    <Button
                      size="sm"
                      variant={isJoined ? "outline" : "default"}
                      onClick={() => handleToggleJoin(c.id, c.name)}
                      className="rounded-xl text-xs h-8 px-3"
                    >
                      {isJoined ? (
                        <>
                          <CheckCircle2 className="size-3 mr-1 text-emerald-600" />
                          Joined
                        </>
                      ) : (
                        "Join"
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCommunities.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="size-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No communities found. Try a different search or category.</p>
            </div>
          )}
        </section>

        {/* ── Stitch Community Charter & Moderation Pledge ── */}
        <section className="container-eka">
          <div className="rounded-3xl bg-sand/30 dark:bg-card/50 border border-border/80 p-8 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8">
                <span className="font-mono text-[10px] uppercase text-terracotta font-semibold tracking-widest">
                  Community Covenant & Protection
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mt-1 mb-3">
                  A Sanctuary Protected by Human Stewards
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Every circle on EKA is safeguarded by hereditary practitioners and community elders. We do not tolerate hate speech, commercial spam, algorithmic manipulation, or uncredited cultural appropriation.
                </p>
              </div>
              <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-end">
                <Link
                  to="/standards"
                  className="inline-flex items-center justify-center rounded-xl bg-card border border-border/80 hover:bg-accent px-4 py-2.5 text-xs font-semibold text-foreground transition-colors"
                >
                  <span>Read Community Charter</span>
                </Link>
                <Link
                  to="/find-your-people"
                  className="inline-flex items-center justify-center rounded-xl bg-terracotta hover:bg-terracotta/90 text-white px-4 py-2.5 text-xs font-semibold transition-colors shadow-xs"
                >
                  <span>Find Your Circle</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
