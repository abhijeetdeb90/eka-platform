// ==============================================================================
// EKA COMMUNITY — LIVING HUMAN INTERACTION LAYER (SANGHAS & DISCUSSIONS)
// ==============================================================================
// Connects people across living lineages, traditions, and contemplative practices.
// Supports: Communities · Discussions · Posts · Reactions · Guidelines · Related Content
// ==============================================================================

import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Plus,
  ArrowRight,
  Search,
  Film,
  BookOpen,
  MapPin,
  Heart,
  CheckCircle2,
  Radio,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RealtimeActivityFeed } from "@/components/community";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — Connect with People & Sanghas | EKA" },
      {
        name: "description",
        content:
          "Connect with practitioners, elders, artisans, and fellow seekers. Join cultural communities, participate in discussions, and share living traditions.",
      },
      { property: "og:title", content: "EKA Community — Living Sanghas" },
      {
        property: "og:description",
        content: "Respectful human connection rooted in culture and universal wisdom.",
      },
    ],
  }),
  component: CommunityPage,
});

interface CommunityItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  recentTopic?: string;
  relatedStoryLink?: string;
  relatedLearnLink?: string;
}

const CURATED_COMMUNITIES: CommunityItem[] = [
  {
    id: "c-sacred-geo",
    slug: "sacred-geography",
    name: "Sacred Geography & Confluences",
    description:
      "Pilgrims, explorers, and custodians documenting sacred rivers, holy peaks, monastic caves, and ancient wayfinding routes.",
    category: "Places & Pilgrimage",
    memberCount: 1420,
    recentTopic: "Why do ancient temples align with seasonal solstices?",
    relatedStoryLink: "/stories",
    relatedLearnLink: "/learn",
  },
  {
    id: "c-artisan-guilds",
    slug: "artisan-guilds",
    name: "Living Crafts & Master Guilds",
    description:
      "Master artisans, weavers, metal smiths, and potters preserving generational handmade traditions without industrial dilution.",
    category: "Crafts & Lineages",
    memberCount: 980,
    recentTopic: "Natural indigo fermentation vs synthetic chemical dyes",
    relatedStoryLink: "/stories",
    relatedLearnLink: "/learn",
  },
  {
    id: "c-mindful-living",
    slug: "mindful-living",
    name: "Contemplation & Quiet Rhythms",
    description:
      "Practitioners exploring silence, meditation, breathing practices, and evening gratitude across Zen, Advaita, and monastic paths.",
    category: "Practice & Stillness",
    memberCount: 2310,
    recentTopic: "The practice of reading one page twice in silence",
    relatedStoryLink: "/stories",
    relatedLearnLink: "/learn",
  },
  {
    id: "c-indic-wisdom",
    slug: "indic-wisdom",
    name: "Vedic, Buddhist & Indic Lore",
    description:
      "Scholars and seekers discussing primary texts, chants, Upanishadic inquiries, and seasonal fasting calendars.",
    category: "Philosophy & Texts",
    memberCount: 1840,
    recentTopic: "Understanding the five sheaths (Pancha Kosha) in daily life",
    relatedStoryLink: "/stories",
    relatedLearnLink: "/learn",
  },
  {
    id: "c-earth-keepers",
    slug: "earth-keepers",
    name: "Indigenous Earth Custodians",
    description:
      "Community elders sharing oral genealogies, sacred grove preservation, seed keeping, and ecological ceremonies.",
    category: "Indigenous Knowledge",
    memberCount: 1120,
    recentTopic: "How sacred groves protect groundwater during droughts",
    relatedStoryLink: "/stories",
    relatedLearnLink: "/learn",
  },
];

function CommunityPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: profile } = useProfile();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [communityView, setCommunityView] = useState<"stream" | "circles">("stream");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityDesc, setNewCommunityDesc] = useState("");
  const [joinedCommunities, setJoinedCommunities] = useState<Set<string>>(new Set());

  // Fetch Supabase communities
  const { data: dbCommunities } = useQuery({
    queryKey: ["all-communities-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .order("member_count", { ascending: false });
      return data || [];
    },
  });

  const allCommunities =
    dbCommunities && dbCommunities.length > 0
      ? dbCommunities.map((c) => ({
          id: c.id,
          slug: c.slug,
          name: c.name,
          description: c.description,
          category: c.category || "General",
          memberCount: c.member_count || 12,
          recentTopic: "Active discussion circle",
        }))
      : CURATED_COMMUNITIES;

  const filteredCommunities = allCommunities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "all" || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleToggleJoin = (id: string, name: string) => {
    if (!profile) {
      toast.info("Please sign in to join community circles");
      void navigate({ to: "/auth" });
      return;
    }

    setJoinedCommunities((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info(`Left ${name}`);
      } else {
        next.add(id);
        toast.success(`Welcome to ${name}!`);
        track("community_join", { communityId: id, name });
      }
      return next;
    });
  };

  const handleCreateCommunity = async () => {
    if (!profile) {
      toast.info("Please sign in to create a Sangha");
      void navigate({ to: "/auth" });
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

    const { error } = await supabase.from("communities").insert({
      slug,
      name: newCommunityName.trim(),
      description: newCommunityDesc.trim(),
      created_by: profile.id,
    });

    if (error) {
      toast.error("Could not create community: " + error.message);
    } else {
      toast.success("Community created successfully!");
      setCreateDialogOpen(false);
      setNewCommunityName("");
      setNewCommunityDesc("");
      void queryClient.invalidateQueries({ queryKey: ["all-communities-public"] });
    }
  };

  return (
    <div className="min-h-screen bg-sand/20 dark:bg-stone-950 text-foreground flex flex-col selection:bg-terracotta/20">
      <SiteHeader />

      <main id="main-content" className="flex-1 py-8 sm:py-14 space-y-10 sm:space-y-12">
        {/* Header & Mission */}
        <section className="container-eka max-w-4xl space-y-4 text-center">
          <Badge
            variant="outline"
            className="border-primary/40 text-primary text-xs font-mono uppercase tracking-wider mb-1"
          >
            <Users className="size-3 mr-1.5 inline" />
            Human Interaction Layer · Living Sanghas
          </Badge>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Connect With Living Lineages
          </h1>
          <p className="font-serif text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            EKA is not an anonymous feed. Join authentic communities where elders, artisans,
            scholars, and seekers learn, share rituals, and protect cultural memory together.
          </p>

          {/* Standards & Governance Banner */}
          <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4 max-w-2xl mx-auto flex items-center justify-between gap-4 text-xs text-muted-foreground text-left">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="size-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Respect-First Governance:</strong> All EKA communities prioritize thoughtful
                inquiry over outrage. No commercial spam, harassment, or hatred.
              </span>
            </div>
            <Link to="/standards" className="text-primary hover:underline font-medium shrink-0">
              Guidelines →
            </Link>
          </div>

          {/* View Switcher: Live Stream vs Circles Directory */}
          <div className="pt-2 max-w-sm mx-auto">
            <div className="flex items-center justify-center gap-1 p-1 rounded-2xl bg-card border border-border/80 shadow-xs">
              <button
                type="button"
                onClick={() => setCommunityView("stream")}
                className={cn(
                  "flex-1 py-2 px-3 text-xs font-medium rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5",
                  communityView === "stream"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Radio
                  className={cn(
                    "size-3.5",
                    communityView === "stream" && "animate-pulse text-amber-200",
                  )}
                />
                <span>Live Activity Stream</span>
              </button>
              <button
                type="button"
                onClick={() => setCommunityView("circles")}
                className={cn(
                  "flex-1 py-2 px-3 text-xs font-medium rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5",
                  communityView === "circles"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Users className="size-3.5" />
                <span>Sanghas & Circles</span>
              </button>
            </div>
          </div>
        </section>

        {communityView === "stream" ? (
          <section className="container-eka max-w-4xl">
            <RealtimeActivityFeed />
          </section>
        ) : (
          <>
            {/* Search, Filter & Create Bar */}
            <section className="container-eka max-w-4xl space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search communities by tradition, craft, or place…"
                    className="pl-10 rounded-xl bg-card border-border/80"
                  />
                </div>

                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="rounded-xl bg-gradient-to-r from-terracotta to-saffron text-white shadow-xs shrink-0 w-full sm:w-auto">
                      <Plus className="mr-1.5 size-4" />
                      <span>Create a Community</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-xl">Create a Living Sangha</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <p className="text-xs text-muted-foreground">
                        A Sangha is a dedicated circle of inquiry and stewardship around a lineage,
                        practice, craft, or place.
                      </p>
                      <Input
                        value={newCommunityName}
                        onChange={(e) => setNewCommunityName(e.target.value)}
                        placeholder="Community Name (e.g., Kashi Heritage Custodians)"
                        className="rounded-xl"
                      />
                      <Textarea
                        value={newCommunityDesc}
                        onChange={(e) => setNewCommunityDesc(e.target.value)}
                        placeholder="What is the shared purpose, lineage, or inquiries of this circle?"
                        rows={4}
                        className="rounded-xl"
                      />
                      <Button onClick={handleCreateCommunity} className="w-full rounded-xl">
                        Found Community
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </section>

            {/* Communities Grid */}
            <section className="container-eka max-w-4xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCommunities.map((c) => {
                  const isJoined = joinedCommunities.has(c.id);
                  return (
                    <div
                      key={c.id}
                      className="group rounded-2xl border border-border/80 bg-card p-5 shadow-calm hover:border-primary/50 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px] font-mono uppercase">
                            {c.category}
                          </Badge>
                          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                            <Users className="size-3" />
                            {c.memberCount} members
                          </span>
                        </div>

                        <h2 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {c.name}
                        </h2>

                        <p className="text-xs text-muted-foreground leading-relaxed font-light line-clamp-3">
                          {c.description}
                        </p>

                        {c.recentTopic && (
                          <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground flex items-start gap-1.5">
                            <MessageSquare className="size-3.5 text-primary shrink-0 mt-0.5" />
                            <span className="line-clamp-1 italic">"{c.recentTopic}"</span>
                          </div>
                        )}
                      </div>

                      {/* Actions & Connected Links */}
                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-border/40">
                        <div className="flex items-center gap-2">
                          <Link
                            to="/stories"
                            className="text-[11px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
                            title="View Related Stories"
                          >
                            <Film className="size-3 text-terracotta" />
                            <span>Stories</span>
                          </Link>
                          <span className="text-muted-foreground/40">·</span>
                          <Link
                            to="/learn"
                            className="text-[11px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
                            title="View Related Learn Guides"
                          >
                            <BookOpen className="size-3 text-saffron" />
                            <span>Learn</span>
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
                              <span>Joined</span>
                            </>
                          ) : (
                            <span>Join Circle</span>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
