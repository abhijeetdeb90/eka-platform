import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Compass,
  Heart,
  Users,
  Flame,
  BookOpen,
  SunMedium,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import {
  FadeIn,
  StaggerGroup,
  StaggerItem,
  HoverLiftCard,
} from "@/components/motion/MotionPrimitives";

// Discovery Components
import { DiscoveryHero } from "@/components/discovery/DiscoveryHero";
import { ExploreIconRow } from "@/components/discovery/ExploreIconRow";
import { HorizontalCardRow } from "@/components/discovery/HorizontalCardRow";
import { InterestFilterSection } from "@/components/discovery/InterestFilterSection";
import { FeaturedCulturesSection } from "@/components/discovery/FeaturedCulturesSection";
import { AskEkaAISection } from "@/components/discovery/AskEkaAISection";
import { MembershipBannerSection } from "@/components/discovery/MembershipBannerSection";
import { DeepKnowledgeModal } from "@/components/discovery/DeepKnowledgeModal";
import { EkaBaseCard } from "@/components/discovery/EkaBaseCard";

// Verified Data
import {
  TODAY_ON_EKA,
  COMMUNITIES_LIST,
  STORIES_LIST,
  PLACES_LIST,
  TRADITIONS_LIST,
  CREATORS_LIST,
  LOCAL_BRANDS,
  type EkaDiscoveryCard,
} from "@/lib/homepage-data";

import practiceImage from "@/assets/practice.jpg";
import observeImage from "@/assets/observe.jpg";
import giveImage from "@/assets/give.jpg";
import journeyImage from "@/assets/journey.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EKA — The Trusted Intelligence Layer for Culture, Community & Local Knowledge" },
      {
        name: "description",
        content:
          "Discover cultures, communities, sacred traditions, and authentic stories around you. Grounded in community verification, provenance, and reverence.",
      },
      {
        property: "og:title",
        content: "EKA — The Trusted Intelligence Layer for Culture, Community & Local Knowledge",
      },
      {
        property: "og:description",
        content:
          "A living cultural intelligence sanctuary to explore cultures, meet unbroken communities, and ask EKA AI with verified citations.",
      },
      { property: "og:image", content: "/brand/eka-banner-sunset.jpg" },
      { property: "og:image:alt", content: "EKA — One within. One with all." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/brand/eka-banner-sunset.jpg" },
    ],
  }),
  component: Landing,
});

const corePillars = [
  {
    to: "/practice",
    label: "Practice",
    image: practiceImage,
    alt: "A clay bowl resting on folded linen in soft morning light",
    body: "A faith-aware library across six traditions, with completions and streaks.",
    status: "Live",
  },
  {
    to: "/observe",
    label: "Observe",
    image: observeImage,
    alt: "A crescent moon over still water at dusk",
    body: "The multi-faith sacred calendar for 2026, with fasting start and end.",
    status: "Live",
  },
  {
    to: "/give",
    label: "Give",
    image: giveImage,
    alt: "Two open hands holding grains of rice in warm sunlight",
    body: "Verified institutions, published spending and honest receipts.",
    status: "In preview",
  },
  {
    to: "/journey",
    label: "Journey",
    image: journeyImage,
    alt: "A pilgrim walking a stone path through misty hills at dawn",
    body: "Sacred routes planned around the calendar you already keep.",
    status: "In preview",
  },
] as const;

const philosophyPillars = [
  {
    icon: Compass,
    title: "Discover",
    body: "Find people, ideas and practices that resonate with you without algorithmic noise.",
  },
  {
    icon: Heart,
    title: "Connect",
    body: "Meet practitioners, seekers, and scholars exploring similar questions.",
  },
  {
    icon: Users,
    title: "Belong",
    body: "Join Sanghas built around authentic practices, lineages and contemplative ideas.",
  },
  {
    icon: Flame,
    title: "Practice",
    body: "Turn fleeting inspiration into daily devotion with sacred rhythms and milestones.",
  },
  {
    icon: BookOpen,
    title: "Explore",
    body: "Discover universal principles across Hindu, Buddhist, Sufi, Christian, Sikh and Jain paths.",
  },
  {
    icon: SunMedium,
    title: "Grow",
    body: "Return to a feed that quietly reflects who you are becoming, not what triggers you.",
  },
] as const;

function Landing() {
  const [selectedCard, setSelectedCard] = useState<EkaDiscoveryCard | null>(null);
  const [selectedInterest, setSelectedInterest] = useState<string>("all");

  // Aggregate all discovery cards for global search/filtering
  const allCards = useMemo(() => {
    return [
      ...TODAY_ON_EKA,
      ...COMMUNITIES_LIST,
      ...STORIES_LIST,
      ...PLACES_LIST,
      ...TRADITIONS_LIST,
      ...CREATORS_LIST,
      ...LOCAL_BRANDS,
    ];
  }, []);

  // Filtered cards based on active interest
  const filteredCards = useMemo(() => {
    if (selectedInterest === "all") return [];
    const term = selectedInterest.toLowerCase();
    return allCards.filter((card) => {
      const matchTags = card.knowledgeTags.some((t) => t.toLowerCase().includes(term));
      const matchBadge = card.categoryBadge.toLowerCase().includes(term);
      const matchTitle = card.title.toLowerCase().includes(term);
      const matchDesc = card.fullExplanation.toLowerCase().includes(term);
      const matchOneLiner = card.oneLiner.toLowerCase().includes(term);
      return matchTags || matchBadge || matchTitle || matchDesc || matchOneLiner;
    });
  }, [allCards, selectedInterest]);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary-soft selection:text-foreground">
      {/* 1. Header Navigation */}
      <SiteHeader />

      <main id="main-content" className="relative overflow-x-hidden">
        {/* 2. Hero Section: Instagram-Style Entry + Animated Knowledge Cards */}
        <DiscoveryHero onInspectCard={(card) => setSelectedCard(card)} />

        {/* 3. Snapchat-Style Visual Icon Gateway */}
        <ExploreIconRow />

        {/* 4. TODAY ON EKA: Horizontal Carousel */}
        <HorizontalCardRow
          id="row-today-on-eka"
          badge="TODAY ON EKA"
          title="Daily Cultural Perspectives"
          description="Fresh observations, living rituals, and rediscovered civilizational wisdom."
          cards={TODAY_ON_EKA}
          onInspectCard={(card) => setSelectedCard(card)}
          viewAllLink="/stories"
          viewAllText="View Daily Compendium"
          className="border-b border-border/50"
        />

        {/* 5. Deepstash-Style Visual Interest Filters */}
        <InterestFilterSection
          selectedInterest={selectedInterest}
          onSelectInterest={(interest) => setSelectedInterest(interest)}
          matchingCount={filteredCards.length}
        />

        {/* 5b. Dynamic Interest Results (if filter active) */}
        {selectedInterest !== "all" && (
          <section
            aria-label="Filtered cultural discoveries"
            className="py-12 bg-sand/15 border-b border-border/60 transition-all"
          >
            <div className="container-eka">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Filter className="size-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-medium text-foreground">
                      Discoveries matching "{selectedInterest}"
                    </h3>
                    <p className="text-xs text-muted-foreground font-light">
                      Found {filteredCards.length} verified knowledge nodes
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedInterest("all")}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear filter
                </Button>
              </div>

              {filteredCards.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/80 bg-card p-10 text-center">
                  <Sparkles className="mx-auto size-6 text-muted-foreground/60" />
                  <p className="mt-2 text-sm text-foreground font-medium">
                    No exact matches found for this specific interest tag.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Try another topic above or query our full archive using EKA AI.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedInterest("all")}
                    className="mt-4 rounded-xl text-xs"
                  >
                    Reset to All Interests
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCards.map((card) => (
                    <EkaBaseCard key={card.id} card={card} onInspect={(c) => setSelectedCard(c)} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 6. Featured Cultures: Magazine Layout */}
        <FeaturedCulturesSection onInspectCard={(card) => setSelectedCard(card)} />

        {/* 7. Communities to Discover */}
        <HorizontalCardRow
          id="row-communities"
          badge="COMMUNITIES TO DISCOVER"
          title="The Keepers of Memory"
          description="Groups, guilds, and clans sustaining language, ecology, and sacred crafts across generations."
          cards={COMMUNITIES_LIST}
          onInspectCard={(card) => setSelectedCard(card)}
          viewAllLink="/stories?dimension=Communities"
          viewAllText="Explore All Communities"
          className="bg-sand/20 border-y border-border/50"
        />

        {/* 8. Stories Horizontal Row */}
        <HorizontalCardRow
          id="row-stories"
          badge="STORIES THAT CONNECT"
          title="Why Traditions Endure"
          description="Oral histories, indigenous ethnobotany, and untranslatable states of consciousness."
          cards={STORIES_LIST}
          onInspectCard={(card) => setSelectedCard(card)}
          viewAllLink="/stories"
          viewAllText="Read More Stories"
        />

        {/* 9. Places With a Story */}
        <HorizontalCardRow
          id="row-places"
          badge="PLACES WITH A SACRED STORY"
          title="Sacred Topographies"
          description="Where ancient stone, flowing rivers, and centuries of prayer meet living memory."
          cards={PLACES_LIST}
          onInspectCard={(card) => setSelectedCard(card)}
          viewAllLink="/stories?dimension=Places"
          viewAllText="Explore Sacred Maps"
          className="bg-sand/20 border-y border-border/50"
        />

        {/* 10. Traditions Horizontal Row */}
        <HorizontalCardRow
          id="row-traditions"
          badge="LIVING TRADITIONS"
          title="Rhythms of Mind & Hand"
          description="Lunisolar timekeeping, handloom mathematics, and rituals synchronized with nature."
          cards={TRADITIONS_LIST}
          onInspectCard={(card) => setSelectedCard(card)}
          viewAllLink="/practice"
          viewAllText="Explore Daily Rhythms"
        />

        {/* 11. Creators & Stewards */}
        <HorizontalCardRow
          id="row-creators"
          badge="CREATORS & SCHOLARS"
          title="Knowledge Custodians"
          description="Researchers, founders, elders, and classical masters safeguarding ancestral wisdom."
          cards={CREATORS_LIST}
          onInspectCard={(card) => setSelectedCard(card)}
          viewAllLink="/founder/ad"
          viewAllText="View Founder Profile"
          className="bg-sand/20 border-y border-border/50"
        />

        {/* 12. Local Life & Ancestral Brands */}
        <HorizontalCardRow
          id="row-local-brands"
          badge="LOCAL LIFE & CRAFTS"
          title="Living Regional Heritage"
          description="Authentic objects, non-toxic crafts, and sacred perfumes rooted in native geography."
          cards={LOCAL_BRANDS}
          onInspectCard={(card) => setSelectedCard(card)}
          viewAllLink="/ritual-kits"
          viewAllText="Browse Ritual Objects"
        />

        {/* 13. Ask EKA AI: Interactive Conversational Inquiry */}
        <AskEkaAISection />

        {/* 14. EKA Philosophy: Paradigm Shift */}
        <section className="border-y border-border/60 bg-sand/30 py-24">
          <div className="container-eka">
            <FadeIn direction="up">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-terracotta">
                  A Quiet Paradigm Shift
                </p>
                <h2 className="mt-3 font-display text-3xl leading-snug sm:text-4xl text-foreground">
                  Social media connects your external life. EKA connects your inner world.
                </h2>
              </div>
            </FadeIn>

            <StaggerGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {philosophyPillars.map((s) => (
                <StaggerItem key={s.title}>
                  <HoverLiftCard className="h-full rounded-2xl border border-border/80 bg-card p-8 shadow-calm transition-all duration-300 hover:border-primary/40 hover:shadow-lift">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary-soft/60 text-primary">
                      <s.icon className="size-5" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-medium">{s.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground font-light">
                      {s.body}
                    </p>
                  </HoverLiftCard>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* 15. The Pillars of Everyday Practice */}
        <section className="py-24">
          <div className="container-eka">
            <FadeIn direction="up">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Available Today
                  </p>
                  <h2 className="mt-3 font-display text-3xl leading-snug sm:text-4xl text-foreground">
                    The Pillars of Everyday Practice
                  </h2>
                </div>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground font-light">
                  Seeded across Hindu, Buddhist, Sikh, Christian, Islamic and Jain traditions —
                  honoring both distinction and unity.
                </p>
              </div>
            </FadeIn>

            <StaggerGroup className="mt-12 grid gap-7 sm:grid-cols-2">
              {corePillars.map((f) => (
                <StaggerItem key={f.to}>
                  <HoverLiftCard className="group h-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-calm transition-all duration-500 hover:border-primary/40 hover:shadow-lift">
                    <Link to={f.to} className="flex h-full flex-col">
                      <div className="relative overflow-hidden">
                        <img
                          src={f.image}
                          alt={f.alt}
                          loading="lazy"
                          width={1600}
                          height={1008}
                          className="h-56 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                        <div className="absolute top-4 right-4 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-[11px] font-medium tracking-wider uppercase text-foreground backdrop-blur-md">
                          {f.status}
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-8">
                        <h3 className="font-display text-2xl font-normal group-hover:text-primary transition-colors">
                          {f.label}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground font-light">
                          {f.body}
                        </p>
                        <div className="mt-auto pt-6 flex items-center text-sm font-medium text-terracotta">
                          <span>Explore {f.label}</span>
                          <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  </HoverLiftCard>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* 16. EKA ₹299/mo Creator / Fellowship Banner */}
        <MembershipBannerSection />
      </main>

      {/* 17. Deep Knowledge Modal: Progressive Disclosure Dialog */}
      <DeepKnowledgeModal card={selectedCard} onClose={() => setSelectedCard(null)} />

      {/* 18. Site Footer */}
      <SiteFooter />
    </div>
  );
}
