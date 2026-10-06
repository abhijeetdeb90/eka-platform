import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  Compass,
  ArrowRight,
  Sparkles,
  Globe,
  MapPin,
  BookOpen,
  Lock,
  ShieldCheck,
  Palette,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlobalCulturalMap } from "@/components/discovery/GlobalCulturalMap";
import {
  ContextualAskEkaModal,
  type ContextualAskEkaTarget,
} from "@/components/discovery/ContextualAskEkaModal";
import { IntelligencePaywallModal } from "@/components/discovery/IntelligencePaywallModal";
import {
  useMonetizationTier,
  CORE_PHILOSOPHY,
  PRODUCT_TIERS,
} from "@/lib/monetization";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn — Understand the World Through Its Stories | EKA" },
      {
        name: "description",
        content:
          "Explore cultures, traditions, languages, rituals, places, food, crafts and the people who keep them alive.",
      },
      { property: "og:title", content: "Learn on EKA — Living Cultural Stories" },
      {
        property: "og:description",
        content:
          "Learn how people live, celebrate, create and connect. Every place has a story. Every story connects to another.",
      },
    ],
  }),
  component: LearnPage,
});

// Flagship visual learn stories requested in specifications
const LEARN_VISUAL_STORIES = [
  {
    id: "durga-puja",
    name: "Durga Puja",
    location: "Kolkata, India",
    flag: "🇮🇳",
    question: "Why is Durga Puja celebrated?",
    storySummary:
      "A celebration of the goddess arriving as a daughter visiting her maternal home, bringing neighborhoods together in street art, drumming, and joy.",
    imageUrl: "/places/kolkata.jpg",
  },
  {
    id: "japanese-tea",
    name: "Japanese Tea Ceremony",
    location: "Kyoto, Japan",
    flag: "🇯🇵",
    question: "Why is tea more than a drink in Japan?",
    storySummary:
      "A peaceful ritual of mindfulness where preparing a bowl of green matcha reminds us that this exact moment will never happen again.",
    imageUrl: "/places/kyoto.jpg",
  },
  {
    id: "maasai-traditions",
    name: "Maasai Traditions",
    location: "Kenya & Tanzania",
    flag: "🇰🇪",
    question: "How do Maasai communities preserve their traditions?",
    storySummary:
      "Pastoral elders and young warriors living in harmony with wildlife, passing down knowledge through songs, age-sets, and beadwork.",
    imageUrl: "/content/journey.jpg",
  },
  {
    id: "maori-culture",
    name: "Māori Culture",
    location: "Aotearoa New Zealand",
    flag: "🇳🇿",
    question: "What does the haka mean?",
    storySummary:
      "A ceremonial dance of unity and passion, rooted in whakapapa—the idea that every human is kin to the sacred mountains and rivers.",
    imageUrl: "/content/monastery-corridor.jpg",
  },
  {
    id: "diwali-lamps",
    name: "Diwali",
    location: "India & global communities",
    flag: "🇮🇳",
    question: "Why do people light lamps?",
    storySummary:
      "Small clay lamps placed outside homes to guide good fortune, symbolize inner wisdom overcoming ignorance, and share sweets with neighbors.",
    imageUrl: "/content/ritual-lamp.jpg",
  },
  {
    id: "balinese-nyepi",
    name: "Balinese Nyepi",
    location: "Bali, Indonesia",
    flag: "🇮🇩",
    question: "Why does Bali go silent for an entire day?",
    storySummary:
      "The entire island pauses all noise, lights, and flights for 24 hours to give the earth rest and purify the spirit before the new year.",
    imageUrl: "/content/hero.jpg",
  },
  {
    id: "kashi-ghats",
    name: "Dawn on the Ghats",
    location: "Varanasi, India",
    flag: "🇮🇳",
    question: "Why do people gather at the river at sunrise?",
    storySummary:
      "Continuous prayers and fire offerings along the river Ganga have continued for over two thousand years, honoring the sacred cycle of life.",
    imageUrl: "/places/varanasi.jpg",
  },
  {
    id: "dia-de-los-muertos",
    name: "Day of the Dead",
    location: "Oaxaca, Mexico",
    flag: "🇲🇽",
    question: "Why do families build altars for the departed?",
    storySummary:
      "Bright marigold flowers and candlelit altars welcome ancestors back for an affectionate evening of favorite foods and family memories.",
    imageUrl: "/content/observe.jpg",
  },
];

function LearnPage() {
  const { canUseIntelligence, tier, setTier } = useMonetizationTier();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [activeTarget, setActiveTarget] = useState<ContextualAskEkaTarget | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  /**
   * Core Access Rule:
   * "I would therefore change the previous Learn implementation so 'Ask EKA'
   * does not directly open the AI for free users.
   * Instead:
   * Ask EKA 🔒
   * Understand more with EKA AI"
   */
  const handleInquiryTrigger = (target?: ContextualAskEkaTarget) => {
    setActiveTarget(target ?? null);

    if (canUseIntelligence) {
      // Subscribed or active tier opens AI directly
      setAiModalOpen(true);
    } else {
      // Free user opens the subscription screen / intelligence paywall
      setPaywallOpen(true);
    }
  };

  const handlePaywallUnlocked = () => {
    setPaywallOpen(false);
    setAiModalOpen(true);
  };

  return (
    <div
      data-testid="eka-learn-page"
      data-hydrated={isHydrated}
      className="min-h-screen bg-background text-foreground flex flex-col font-sans"
    >
      <SiteHeader />

      <main id="main-content" className="flex-1 container-eka py-8 sm:py-14 space-y-12 sm:space-y-16">
        {/* 1. Simple, Human Consumer Header */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge
            variant="outline"
            className="border-primary/40 text-primary text-xs font-mono uppercase tracking-wider"
          >
            <Compass className="size-3 mr-1.5 inline" />
            Learn
          </Badge>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-foreground tracking-tight">
            Understand the World Through Its Stories
          </h1>

          <p className="font-serif text-base sm:text-xl text-muted-foreground font-light leading-relaxed">
            Learn how people live, celebrate, create and connect.
          </p>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Explore cultures, traditions, languages, rituals, places, food, crafts and the people
            who keep them alive.
          </p>
        </section>

        {/* 2. EKA Access Model Banner: Free Cultural Library vs Paid Intelligence */}
        <section className="rounded-3xl border border-border/70 bg-sand/15 p-6 sm:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-terracotta font-semibold">
                Free Knowledge Commons · Paid Intelligence & Creation
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-foreground">
                Knowledge is free. Intelligence is paid. Creation is paid.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Explore the global map and all cultural stories for free. Upgrade to EKA+ when you
                want to ask questions, compare cultures, and explore deeper.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link to="/membership">
                <Button variant="outline" size="sm" className="rounded-full text-xs gap-1 border-primary/40 text-primary hover:bg-primary/5">
                  <Sparkles className="size-3 text-saffron" />
                  <span>See EKA Access Model</span>
                  <ArrowRight className="size-3" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-3.5 space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-emerald-600 flex items-center gap-1">
                <Check className="size-3" /> FREE (Active)
              </span>
              <p className="font-serif text-sm text-foreground">Discover → Read → Explore → Follow</p>
              <p className="text-[11px] text-muted-foreground">Global map, stories, traditions & places</p>
            </div>

            <div className="rounded-2xl border border-primary/40 bg-primary/5 p-3.5 space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-primary flex items-center gap-1">
                <Lock className="size-3 text-saffron" /> EKA+ (₹299/mo)
              </span>
              <p className="font-serif text-sm text-foreground">Ask → Understand → Compare → Research</p>
              <p className="text-[11px] text-muted-foreground">EKA AI, comparisons & primary source research</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/70 p-3.5 space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <Palette className="size-3" /> CREATOR (₹799/mo)
              </span>
              <p className="font-serif text-sm text-foreground">Create → Publish → Analyse → Grow</p>
              <p className="text-[11px] text-muted-foreground">Dedicated paid workspace for storytellers</p>
            </div>
          </div>
        </section>

        {/* 3. The Interactive World's Cultural Intelligence Map (Completely Free & Open) */}
        <section id="cultural-map-section" className="space-y-4">
          <GlobalCulturalMap onAskEka={handleInquiryTrigger} />
        </section>

        {/* 4. Real Visual Story Cards Section */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/60 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-terracotta font-semibold">
                Living Cultural Stories · Free to Read
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mt-0.5">
                Stories from around the world
              </h2>
            </div>
            <p className="text-xs text-muted-foreground sm:text-right">
              Image → Place → Story → Ask EKA 🔒
            </p>
          </div>

          {/* Grid of visual story cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEARN_VISUAL_STORIES.map((story) => (
              <article
                key={story.id}
                className="group flex flex-col justify-between rounded-3xl border border-border/80 bg-card overflow-hidden shadow-calm hover:shadow-lift transition-all"
              >
                {/* 1. Real Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand/20">
                  <img
                    src={story.imageUrl}
                    alt={story.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/content/hero.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Place Overlay */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                    <span className="text-[11px] font-mono text-white/90 flex items-center gap-1">
                      <MapPin className="size-3 text-saffron" />
                      {story.location}
                    </span>
                    <h3 className="font-serif text-lg font-normal text-white drop-shadow-xs mt-0.5">
                      {story.name}
                    </h3>
                  </div>
                </div>

                {/* 2. Story Content & Wonder Question */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <p className="font-serif text-sm font-medium text-primary group-hover:text-primary transition-colors italic">
                      "{story.question}"
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {story.storySummary}
                    </p>
                  </div>

                  {/* 2.5 Interconnected Loop Pathways */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                    <Link
                      to="/stories"
                      className="rounded-md bg-sand/60 dark:bg-stone-800/60 px-2 py-0.5 text-muted-foreground hover:text-terracotta hover:bg-terracotta/10 transition-colors font-medium"
                    >
                      Stories →
                    </Link>
                    <Link
                      to="/discover"
                      className="rounded-md bg-sand/60 dark:bg-stone-800/60 px-2 py-0.5 text-muted-foreground hover:text-forest hover:bg-forest/10 transition-colors font-medium"
                    >
                      Map Pin →
                    </Link>
                    <Link
                      to="/community"
                      className="rounded-md bg-sand/60 dark:bg-stone-800/60 px-2 py-0.5 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors font-medium"
                    >
                      Community →
                    </Link>
                  </div>

                  {/* 3. Ask EKA Action (Gated with Ask EKA 🔒 / Understand more with EKA AI) */}
                  <div className="border-t border-border/60 pt-3 flex flex-col gap-1.5">
                    <Button
                      onClick={() =>
                        handleInquiryTrigger({
                          title: story.name,
                          location: story.location,
                          initialQuestion: story.question,
                          preloadedSummary: story.storySummary,
                        })
                      }
                      className="rounded-full text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                    >
                      <Sparkles className="size-3 text-saffron" />
                      <span>Ask EKA</span>
                      {!canUseIntelligence && (
                        <Lock className="size-3 text-saffron ml-0.5" />
                      )}
                      <ArrowRight className="size-3 ml-auto" />
                    </Button>
                    <span className="text-[11px] text-muted-foreground text-center font-serif italic">
                      Understand more with EKA AI
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 5. Navigation to Knowledge Catalog & Stories */}
        <section className="rounded-3xl border border-border/70 bg-sand/15 p-6 sm:p-10 text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            One World. Billions of Stories.
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">
            EKA connects the world's cultures, communities and local knowledge.
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Country → Region → Community → Language → Culture → Tradition → Ritual → Story → Place → People.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link to="/knowledge">
              <Button variant="outline" className="rounded-full text-xs gap-1.5">
                <BookOpen className="size-3.5 text-primary" />
                <span>Browse All Traditions & Catalog</span>
                <ArrowRight className="size-3" />
              </Button>
            </Link>
            <Link to="/discover">
              <Button className="rounded-full text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                <Globe className="size-3.5" />
                <span>Explore Global Culture Intelligence</span>
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          </div>
        </section>

        {/* 6. Contextual Ask EKA Modal (For Unlocked / Subscribed Users) */}
        <ContextualAskEkaModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          target={activeTarget}
        />

        {/* 7. Intelligence Paywall Modal (For Free Users) */}
        <IntelligencePaywallModal
          isOpen={paywallOpen}
          onClose={() => setPaywallOpen(false)}
          target={activeTarget}
          onUnlocked={handlePaywallUnlocked}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
