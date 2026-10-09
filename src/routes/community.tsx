// ==============================================================================
// EKA COMMUNITY — GLOBAL CULTURAL COMMUNITIES
// ==============================================================================
// People who share something worth preserving.
// Categories: Traditions · Crafts · Places · Languages · Food · Faith · Philosophy · Local Life
// Sangha is a community TYPE, not the universal terminology.
// ==============================================================================

import { useState } from "react";
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

interface CommunityItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  recentTopic?: string;
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
  },
  {
    id: "c-mindful-living",
    slug: "mindful-living",
    name: "Contemplation & Quiet Rhythms",
    description:
      "Practitioners exploring silence, meditation, breathing practices, and evening gratitude across Zen, Advaita, and monastic paths.",
    category: "Faith",
    memberCount: 2310,
    recentTopic: "The practice of reading one page twice in silence",
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
  },
  {
    id: "c-earth-keepers",
    slug: "earth-keepers",
    name: "Indigenous Earth Custodians",
    description:
      "Community elders sharing oral genealogies, sacred grove preservation, seed keeping, and ecological ceremonies.",
    category: "Local Life",
    memberCount: 1120,
    recentTopic: "How sacred groves protect groundwater during droughts",
  },
  {
    id: "c-foodways",
    slug: "foodways",
    name: "Food & Culinary Traditions",
    description:
      "Home cooks, chefs, and food historians documenting heirloom recipes, fermentation knowledge, and harvest festivals.",
    category: "Food",
    memberCount: 3240,
    recentTopic: "Why does every culture have a dumpling?",
  },
];

const CATEGORY_FILTERS = [
  { id: "all", label: "All" },
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
  const [joinedCommunities, setJoinedCommunities] = useState<Set<string>>(new Set());

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

  const allCommunities = (dbCommunities && dbCommunities.length > 0)
    ? dbCommunities.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description,
        category: c.category || "General",
        memberCount: c.member_count || 12,
        recentTopic: "Active discussion",
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
      toast.info("Please sign in to join communities");
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
      toast.info("Please sign in to create a community");
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
      toast.success("Community created!");
      setCreateDialogOpen(false);
      setNewCommunityName("");
      setNewCommunityDesc("");
      void queryClient.invalidateQueries({ queryKey: ["all-communities-public"] });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />

      <main id="main-content" className="flex-1 py-8 sm:py-12 space-y-8">

        {/* ── Page Header ── */}
        <section className="container-eka max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-terracotta font-semibold mb-3">
            COMMUNITIES
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-foreground leading-tight">
            People who share something worth preserving.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl">
            Join groups built around traditions, crafts, places, languages, food, faith, and local life.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
            <span>
              Respect-first. No spam or outrage.{" "}
              <Link to="/standards" className="text-foreground hover:underline underline-offset-2">
                Community guidelines →
              </Link>
            </span>
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
                  <div className="space-y-2.5">
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

                    {c.recentTopic && (
                      <div className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground flex items-start gap-1.5">
                        <MessageSquare className="size-3.5 text-primary/50 shrink-0 mt-0.5" />
                        <span className="line-clamp-1 italic">"{c.recentTopic}"</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <Link to="/stories" className="hover:text-foreground flex items-center gap-1 transition-colors">
                        <Film className="size-3 text-terracotta" />
                        Stories
                      </Link>
                      <Link to="/learn" className="hover:text-foreground flex items-center gap-1 transition-colors">
                        <BookOpen className="size-3 text-saffron" />
                        Learn
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
      </main>

      <SiteFooter />
    </div>
  );
}
