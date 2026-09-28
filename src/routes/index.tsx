// ==============================================================================
// EKA CONSUMER PLATFORM — VISUAL STORYTELLING & REEL-LED HOMEPAGE
// ==============================================================================
// Hierarchy: VIDEO → STORY → IMAGE → PEOPLE → DISCOVERY → MEMBERSHIP
// Design System Primitive: StoryCard
// ==============================================================================

import { useState, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Compass,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  Bookmark,
  Share2,
  Heart,
  Globe,
  MapPin,
  CheckCircle2,
  Flame,
  Layers,
  Film,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StoryCard, type StoryCardProps } from "@/components/ui/StoryCard";

// Visual Assets
import heroImage from "@/assets/hero.jpg";
import stillWater from "@/assets/still-water.jpg";
import ritualLamp from "@/assets/ritual-lamp.jpg";
import monasteryCorridor from "@/assets/monastery-corridor.jpg";
import todayReflection from "@/assets/today-reflection.jpg";
import readingTable from "@/assets/reading-table.jpg";
import journeyImage from "@/assets/journey.jpg";
import observeImage from "@/assets/observe.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EKA — Living Cultural Stories, Sacred Geography & Contemplative Heritage" },
      {
        name: "description",
        content:
          "A visual culture magazine and living heritage sanctuary. Watch short cultural moments, explore authentic traditions, and discover sacred geography.",
      },
      { property: "og:title", content: "EKA — The Living Cultural Storytelling Platform" },
      {
        property: "og:description",
        content: "Short visual moments, unbroken lineages, and sacred geography.",
      },
      { property: "og:image", content: "/brand/eka-banner-sunset.jpg" },
    ],
  }),
  component: VisualConsumerHomePage,
});

// Editorial Stories Data
const FEATURED_STORIES: StoryCardProps[] = [
  {
    id: "aranmula-mirror",
    title: "The Mirror That Holds No Glass",
    subtitle: "In a quiet village along the Pamba river, eight families preserve the metallurgy of reflective bronze alloy mirrors granted GI Tag #9.",
    category: "Sacred Metallurgy",
    location: "Aranmula, Kerala",
    mediaUrl: monasteryCorridor,
    aspectRatio: "portrait",
    featured: true,
    creator: {
      name: "S. Janardhanan",
      handle: "@aranmula_guild",
      tradition: "Vishwakarma Guildholder",
      verified: true,
    },
    epistemicTier: "DOCUMENTED",
    likesCount: 142,
    actionTo: "/knowledge/aranmula-kannadi",
  },
  {
    id: "kashi-ganga-aarti",
    title: "Dawn on the Ghats: Fire and Flow",
    subtitle: "How the five elements are offered back to the river each sunrise in a ritual that has not ceased for 1,200 years.",
    category: "Living Ritual",
    location: "Varanasi, Uttar Pradesh",
    mediaUrl: ritualLamp,
    aspectRatio: "vertical",
    creator: {
      name: "Pandit Ramakrishna",
      handle: "@kashi_archive",
      tradition: "Dashashwamedh Lineage",
      verified: true,
    },
    epistemicTier: "LIVING_PRACTICE",
    likesCount: 289,
    actionTo: "/junction",
  },
  {
    id: "bishnoi-khejarli",
    title: "Trees More Precious Than Life",
    subtitle: "The 29 desert tenets of Guru Jambheshwar and the living community that treats blackbucks as their own children.",
    category: "Ecological Lineage",
    location: "Jodhpur, Rajasthan",
    mediaUrl: stillWater,
    aspectRatio: "vertical",
    creator: {
      name: "Rana Ram Bishnoi",
      handle: "@khejarli_stewards",
      tradition: "Bishnoi Elder",
      verified: true,
    },
    epistemicTier: "DOCUMENTED",
    likesCount: 215,
    actionTo: "/stories",
  },
  {
    id: "bohag-bihu",
    title: "Seven Rhythms of Ancestral Spring",
    subtitle: "From the cattle bath of Goru Bihu to the weaving of the Gamusa, Assam welcomes the rain through unbroken song.",
    category: "Folk Rhythm",
    location: "Majuli, Assam",
    mediaUrl: todayReflection,
    aspectRatio: "portrait",
    creator: {
      name: "Ananya Barua",
      handle: "@brahmaputra_lore",
      tradition: "Sattriya Scholar",
      verified: true,
    },
    epistemicTier: "LIVING_PRACTICE",
    likesCount: 184,
    actionTo: "/stories",
  },
  {
    id: "himalayan-silence",
    title: "The Architecture of Inward Attention",
    subtitle: "Carved stone cells, high-altitude prayer flags, and the rhythm of silent tea in Garhwal valleys.",
    category: "Contemplative Path",
    location: "Kedarnath Valley, Uttarakhand",
    mediaUrl: readingTable,
    aspectRatio: "vertical",
    creator: {
      name: "Swami Chinmayananda",
      handle: "@himalayan_hermitage",
      tradition: "Advaita Lineage",
      verified: true,
    },
    epistemicTier: "SACRED_GEOGRAPHY",
    likesCount: 310,
    actionTo: "/observe",
  },
  {
    id: "golden-temple-langar",
    title: "100,000 Meals of Universal Equality",
    subtitle: "Why the Guru's hearth never sleeps, and how feeding strangers is the ultimate spiritual practice.",
    category: "Sacred Service",
    location: "Amritsar, Punjab",
    mediaUrl: journeyImage,
    aspectRatio: "portrait",
    creator: {
      name: "Gurpreet Singh",
      handle: "@langar_seva",
      tradition: "Nishan-e-Sikhi",
      verified: true,
    },
    epistemicTier: "DOCUMENTED",
    likesCount: 421,
    actionTo: "/junction",
  },
];

// Visual Curated Collections
const COLLECTIONS = [
  {
    title: "The Cultural Junction",
    subtitle: "Sacred Geography, Pilgrimage Routes & Sacred Places",
    count: "12 Foundations",
    image: monasteryCorridor,
    to: "/junction",
    tag: "Geospatial",
  },
  {
    title: "1,000 Stories Campaign",
    subtitle: "Living oral lore and community traditions documented nationwide",
    count: "237 Stories",
    image: heroImage,
    to: "/stories",
    tag: "Oral Lore",
  },
  {
    title: "Sacred Calendar 2026",
    subtitle: "Fasting, sunrise, festivals and astronomical timing across 6 faiths",
    count: "365 Observances",
    image: observeImage,
    to: "/observe",
    tag: "Observances",
  },
  {
    title: "Creator Studio & Marketplace",
    subtitle: "Verified guides, scholars, and artisan workshops",
    count: "48 Practitioners",
    image: ritualLamp,
    to: "/studio",
    tag: "Creators",
  },
];

export function VisualConsumerHomePage() {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [heroVideoMuted, setHeroVideoMuted] = useState(true);

  const TAGS = ["All", "Sacred Metallurgy", "Living Ritual", "Ecological Lineage", "Folk Rhythm", "Contemplative Path", "Sacred Service"];

  const filteredStories = selectedTag === "All"
    ? FEATURED_STORIES
    : FEATURED_STORIES.filter((s) => s.category === selectedTag);

  return (
    <div className="min-h-screen bg-sand/15 text-foreground flex flex-col selection:bg-terracotta/20">
      <SiteHeader />

      <main className="flex-1 space-y-16 sm:space-y-24">
        
        {/* 1. HERO SHORT-FORM VIDEO & CINEMATIC SHOWCASE */}
        <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-end overflow-hidden">
          {/* Hero Background Media */}
          <div className="absolute inset-0 w-full h-full bg-neutral-950">
            <img
              src={heroImage}
              alt="EKA Sacred Heritage — Light on ancient stone"
              className="w-full h-full object-cover object-center brightness-85 transition-transform duration-1000 scale-[1.02]"
            />
            {/* Ambient gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/30" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60" />
          </div>

          {/* Hero Overlay Content */}
          <div className="relative z-10 container-eka pb-14 sm:pb-20 max-w-5xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white/90 text-xs font-mono">
              <span className="size-2 rounded-full bg-terracotta animate-pulse" />
              <span>Living Cultural Stories · Unbroken Traditions</span>
            </div>

            <h1 className="font-display font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] text-white tracking-tight drop-shadow-md">
              The world through <br className="hidden sm:inline" />
              its sacred keepers.
            </h1>

            <p className="max-w-xl text-base sm:text-lg font-light text-white/85 leading-relaxed drop-shadow-sm">
              Watch cultural moments. Trace sacred geography. Connect with unbroken communities
              preserving the inner life of humankind.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/junction">
                <Button className="rounded-xl px-6 py-6 bg-terracotta hover:bg-terracotta/90 text-white font-medium text-sm shadow-lift gap-2">
                  <Compass className="size-4" />
                  <span>Explore The Junction</span>
                </Button>
              </Link>
              <Link to="/stories">
                <Button
                  variant="outline"
                  className="rounded-xl px-6 py-6 border-white/30 bg-black/30 backdrop-blur-md text-white hover:bg-white/20 font-medium text-sm gap-2"
                >
                  <Film className="size-4 text-saffron" />
                  <span>Watch 1,000 Stories</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. REEL STRIP: VERTICAL GLIMPSES OF LIVING FAITH */}
        <section className="container-eka space-y-6">
          <div className="flex items-end justify-between border-b border-border/60 pb-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-terracotta font-semibold">
                Short-Form Moments
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-normal mt-1">
                Glimpses of Living Faith
              </h2>
            </div>
            <Link to="/stories" className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1">
              <span>View all moments</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Horizontal Snap Scroll of Vertical Story Cards */}
          <div className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none">
            {FEATURED_STORIES.slice(0, 5).map((story) => (
              <div key={story.id} className="min-w-[280px] sm:min-w-[320px] max-w-[340px] shrink-0 snap-start">
                <StoryCard {...story} aspectRatio="vertical" />
              </div>
            ))}
          </div>
        </section>

        {/* 3. CURATED STORY CARD FEED WITH CATEGORY CHIPS */}
        <section className="container-eka space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-terracotta font-semibold">
                Living Archive
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-normal mt-1">
                Verified Cultural Narratives
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-light mt-1 max-w-lg">
                Grounded in community provenance, master artisans, and 5-tier epistemic verification.
              </p>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-1.5">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                    selectedTag === tag
                      ? "bg-terracotta text-white font-medium shadow-xs"
                      : "bg-card border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Asymmetric Magazine-Style Story Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredStories.map((story) => (
              <StoryCard key={story.id} {...story} />
            ))}
          </div>
        </section>

        {/* 4. VISUAL COLLECTIONS (ASYMMETRIC EDITORIAL TILES) */}
        <section className="container-eka space-y-8">
          <div className="border-b border-border/60 pb-4">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-terracotta font-semibold">
              Thematic Portals
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-normal mt-1">
              Curated Cultural Collections
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLLECTIONS.map((col) => (
              <Link
                key={col.title}
                to={col.to}
                className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 aspect-[4/5] flex flex-col justify-between shadow-calm hover:shadow-lift hover:border-terracotta/40 transition-all duration-500"
              >
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img
                    src={col.image}
                    alt={col.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 brightness-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                </div>

                <div className="relative z-10 flex justify-between items-start text-white">
                  <Badge variant="outline" className="text-[10px] font-mono uppercase text-white/90 border-white/20 bg-black/30 backdrop-blur-md">
                    {col.tag}
                  </Badge>
                  <span className="text-[11px] font-mono text-white/70">{col.count}</span>
                </div>

                <div className="relative z-10 space-y-1.5 text-white">
                  <h3 className="font-display font-serif text-xl sm:text-2xl font-normal group-hover:text-amber-200 transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs text-white/80 font-light line-clamp-2 leading-relaxed">
                    {col.subtitle}
                  </p>
                  <div className="pt-2 flex items-center gap-1 text-xs font-mono text-terracotta group-hover:translate-x-1 transition-transform">
                    <span>Enter Collection</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. SACRED GEOGRAPHY HIGHLIGHT (THE JUNCTION) */}
        <section className="container-eka">
          <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-calm grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-6 p-8 sm:p-14 flex flex-col justify-center space-y-6">
              <Badge variant="outline" className="w-fit text-[10px] font-mono uppercase text-terracotta border-terracotta/30">
                Interactive Sacred Geography
              </Badge>

              <h2 className="font-display font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
                Every sacred place is connected.
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                Step into **The Junction** — an interactive geospatial sanctuary powered by Google Maps
                and living lore. Calculate pilgrimage distances, trace unbroken regional crafts, and
                discover places of reverence across seven traditions.
              </p>

              <div className="pt-2">
                <Link to="/junction">
                  <Button className="rounded-xl px-6 py-5 bg-terracotta hover:bg-terracotta/90 text-white font-medium text-sm gap-2">
                    <Compass className="size-4" />
                    <span>Open The Junction Map</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-full overflow-hidden bg-neutral-900">
              <img
                src={monasteryCorridor}
                alt="Sacred Architecture Corridor"
                className="w-full h-full object-cover brightness-85"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-card/80 via-transparent to-transparent hidden lg:block" />
            </div>
          </div>
        </section>

        {/* 6. CONTEMPLATIVE MEMBERSHIP & SANCTUARY FELLOWSHIP */}
        <section className="container-eka pb-12">
          <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-sand/20 to-card p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-6 shadow-calm">
            <div className="size-12 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto">
              <Sparkles className="size-6" />
            </div>

            <h2 className="font-display font-serif text-3xl sm:text-4xl font-normal">
              Enter the Sanctuary.
            </h2>

            <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-lg mx-auto">
              No algorithmic feeds. No outrage triggers. EKA is an intimate, reverent home for your inner life
              and living cultural heritage.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/join">
                <Button className="rounded-xl px-8 py-5 bg-terracotta hover:bg-terracotta/90 text-white text-sm font-medium">
                  Begin with Reverence
                </Button>
              </Link>
              <Link to="/membership">
                <Button variant="outline" className="rounded-xl px-8 py-5 text-sm font-medium">
                  Learn about Membership
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
