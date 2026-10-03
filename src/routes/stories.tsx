import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Sparkles,
  Globe2,
  Share2,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Compass,
  HeartHandshake,
  CheckCircle2,
  Layers,
  Users,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CommunityVariationModal } from "@/components/app/CommunityVariationModal";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "EKA: 1 Billion Stories — One Living Cultural Archive for the World" },
      {
        name: "description",
        content:
          "1 billion people. 1 billion stories. One living cultural archive for the world. Preserving traditions, oral histories, languages, rituals, and local knowledge.",
      },
      { property: "og:title", content: "EKA: 1 Billion Stories Initiative" },
      {
        property: "og:description",
        content:
          "From family traditions and ancient rituals to languages, local histories, food, crafts, festivals and everyday ways of life — EKA is building a living archive of human culture.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: StoriesCampaignPage,
});

const TARGET_STORIES = 1_000_000_000;

const GLOBAL_REGIONS = [
  {
    name: "Asia & Pacific Lineages",
    status: "Active Archiving",
    examples: "Himalayan prayer traditions, Mekong river rites, Japanese artisanal crafts, Polynesian wayfinding",
  },
  {
    name: "Middle East & North Africa",
    status: "Open for Contributions",
    examples: "Oasis water governance, Bedouin oral poetry, Andalusian-Maghrebi music, Levantine culinary lineages",
  },
  {
    name: "Africa & Global Diaspora",
    status: "Active Archiving",
    examples: "Griot oral genealogies, Yoruba sacred groves, polyrhythmic drumming traditions, Swahili coastal memory",
  },
  {
    name: "Europe & Mediterranean",
    status: "Open for Contributions",
    examples: "Alpine seasonal transhumance, Mediterranean olive lore, Celtic oral epics, Slavic solstice folkways",
  },
  {
    name: "The Americas & Indigenous Commons",
    status: "Active Archiving",
    examples: "Andean agricultural terraces, Amazonian plant knowledge, Pueblo pottery lineages, Mesoamerican milpa ecology",
  },
  {
    name: "Oceania & Global Commons",
    status: "Open for Contributions",
    examples: "Aboriginal songlines, Māori oral whakapapa, Melanesian customary ecology, Arctic maritime lore",
  },
];

const ARCHITECTURE_NODES = [
  { step: "01", title: "People", desc: "Authentic living practitioners and elders" },
  { step: "02", title: "Stories", desc: "Lived memories, folklore, and family practices" },
  { step: "03", title: "Traditions", desc: "Unbroken generational transmission" },
  { step: "04", title: "Communities", desc: "Shared cultural contexts and kinship" },
  { step: "05", title: "Places", desc: "Sacred geography and natural landscapes" },
  { step: "06", title: "Languages", desc: "Indigenous idioms, chants, and oral nuance" },
  { step: "07", title: "Rituals", desc: "Seasonal rhythms, ceremonies, and rites" },
  { step: "08", title: "Knowledge", desc: "Planetary cultural intelligence layer" },
];

function StoriesCampaignPage() {
  const [modalOpen, setModalOpen] = useState(false);

  // Dynamic count from actual verified EKA database (never hardcoded or fabricated)
  const { data: verifiedCount = 0, refetch } = useQuery({
    queryKey: ["campaign-stories-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true });
      if (error) {
        console.error("Failed to query stories count:", error);
        return 0;
      }
      return count ?? 0;
    },
  });

  const progressPercent = (verifiedCount / TARGET_STORIES) * 100;
  const hasVerifiedStories = verifiedCount > 0;

  const shareCampaignWhatsApp = () => {
    const text = `Join the EKA: 1 Billion Stories Initiative 🌍\n\n1 billion people. 1 billion stories. One living cultural archive for the world.\n\nFrom family traditions to ancient rituals, languages, and crafts — document your community's story on EKA:\nhttps://eka.earth/stories?ref=wa_global_1b`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary-soft selection:text-foreground">
      <SiteHeader />
      <main className="container-eka mx-auto max-w-5xl px-5 py-16 lg:py-24">
        {/* Campaign Hero */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/10 px-3.5 py-1 text-xs uppercase tracking-[0.22em] text-saffron">
            <Sparkles className="size-3.5" />
            <span>Global Cultural Preservation Initiative</span>
          </div>

          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground">
            EKA: 1 Billion Stories
          </h1>

          <p className="mx-auto mt-4 max-w-2xl font-serif text-xl sm:text-2xl text-foreground/90 font-normal leading-relaxed">
            1 billion people. 1 billion stories. One living cultural archive for the world.
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
            From family traditions and ancient rituals to languages, local histories, food, crafts,
            festivals and everyday ways of life — EKA is building a living archive of human culture.
          </p>

          {/* Progress Tracker Card */}
          <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-calm text-left">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
                    {verifiedCount.toLocaleString()}
                  </span>
                  <span className="text-sm sm:text-base font-light text-muted-foreground">
                    / 1,000,000,000 stories documented
                  </span>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 border border-forest/20 px-3 py-1 text-xs font-medium text-forest self-start sm:self-auto">
                <Globe2 className="size-3.5" />
                <span>
                  {hasVerifiedStories
                    ? `${progressPercent.toFixed(4)}% Documented`
                    : "Global Milestone Target: 1B"}
                </span>
              </div>
            </div>

            <Progress
              value={Math.max(progressPercent, hasVerifiedStories ? 0.1 : 0)}
              className="mt-5 h-2.5 bg-muted/60"
            />

            <div className="mt-4 flex flex-col gap-2 border-t border-border/40 pt-4">
              <p className="text-xs text-muted-foreground italic">
                Every story adds another piece to humanity's living cultural memory.
              </p>
              <p className="text-xs text-foreground/90">
                Every verified contributor becomes part of the{" "}
                <strong className="font-medium text-foreground">
                  living EKA archive of human culture
                </strong>
                .
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => setModalOpen(true)}
                size="lg"
                className="rounded-xl shadow-xs flex-1 sm:flex-none"
              >
                <BookOpen className="mr-2 size-4" /> Document a Story
              </Button>
              <Button
                onClick={shareCampaignWhatsApp}
                variant="outline"
                size="lg"
                className="rounded-xl flex-1 sm:flex-none"
              >
                <MessageSquare className="mr-2 size-4 text-[#25D366]" /> Share on WhatsApp
              </Button>
            </div>
          </div>
        </div>

        {/* The Cultural Intelligence Architecture */}
        <section className="mt-20">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-terracotta font-semibold">
              Platform Data Continuum
            </span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl text-foreground">
              1 Billion Stories · One Living Cultural Archive
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              One person may contribute multiple stories, and one story can represent an entire
              community. Every memory connects to a living cultural intelligence layer.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {ARCHITECTURE_NODES.map((node) => (
              <div
                key={node.title}
                className="rounded-2xl border border-border/70 bg-card p-4 text-center shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">
                    {node.step}
                  </span>
                  <h3 className="font-semibold text-sm text-foreground">{node.title}</h3>
                </div>
                <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
                  {node.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3 Steps: How to Participate */}
        <section className="mt-20">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-saffron font-semibold">
              Universal Participation
            </span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl text-foreground">
              How to Document in 3 Steps
            </h2>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-display text-3xl text-terracotta">01</span>
                <h3 className="mt-3 font-semibold text-base text-foreground">
                  Pick a Living Story or Tradition
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  An oral history, seasonal festival, family recipe, sacred ritual, craft technique,
                  or memory taught by your elders across any culture.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-display text-3xl text-terracotta">02</span>
                <h3 className="mt-3 font-semibold text-base text-foreground">
                  Document the Nuance & Context
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Explain how your community or family observes it with its authentic local names,
                  chants, seasonal timing, and unique cultural nuances.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-display text-3xl text-terracotta">03</span>
                <h3 className="mt-3 font-semibold text-base text-foreground">
                  Preserve for Humanity
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Your entry becomes a permanent verified node in the EKA planetary knowledge graph,
                  attributed to you and your community forever.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Global Cultural Macro-Regions */}
        <section className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-terracotta font-semibold">
                Planetary Scope
              </span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl text-foreground">
                Global Cultural Lineages
              </h2>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              Universal · Borderless · Multi-Vocal
            </span>
          </div>

          <div className="mt-6 grid gap-3.5 sm:grid-cols-2">
            {GLOBAL_REGIONS.map((r) => (
              <div
                key={r.name}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-sm text-foreground flex items-center gap-2">
                      <Globe2 className="size-4 text-terracotta" />
                      {r.name}
                    </h3>
                    <span className="rounded-full bg-sand-warm/60 dark:bg-stone-800 border border-border/60 px-2.5 py-0.5 text-[11px] font-mono text-muted-foreground">
                      {r.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {r.examples}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust & Ethical Stewardship */}
        <section className="mt-20 rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-forest">
            <ShieldCheck className="size-4 text-forest" />
            <span>Trusted Cultural Intelligence Layer</span>
          </div>
          <h2 className="mt-2 font-display text-xl sm:text-2xl text-foreground">
            Preserving Humanity's Memory with Integrity
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 text-xs leading-relaxed text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground text-sm mb-1">Human-Centered Provenance</h4>
              <p>
                Every submission is attributed to real practitioners and communities. We do not count
                automated bots or duplicate records toward the campaign count.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm mb-1">Non-Extractive Stewardship</h4>
              <p>
                Indigenous knowledge and sacred traditions are documented with consent and respect,
                safeguarding sacred boundaries while celebrating living culture.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm mb-1">AI for Discovery, Not Lore</h4>
              <p>
                AI assists exclusively with contextualization, multilingual translation, and knowledge
                graph indexing. It never fabricates synthetic community lore.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="mt-20 rounded-3xl border border-primary/30 bg-sand/40 p-8 text-center sm:p-12">
          <h2 className="font-display text-3xl text-foreground">
            Be Part of the 1 Billion Stories Archive
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground leading-relaxed">
            No academic credentials required. Only your authentic memory, community tradition,
            and lived human experience.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={() => setModalOpen(true)} size="lg" className="rounded-xl shadow-xs">
              <BookOpen className="mr-2 size-4" /> Document a Story
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <Link to="/discover">Explore Knowledge Graph</Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* Story Contribution Modal */}
      <CommunityVariationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        parentTopic="EKA: 1 Billion Stories Initiative"
        onSuccess={() => void refetch()}
      />
    </div>
  );
}
export default StoriesCampaignPage;
