// ==============================================================================
// EKA CONSUMER PLATFORM — PRO MAX UI/UX SYSTEM
// ==============================================================================
// Combines:
// 1. Deepstash-style Progressive Knowledge Unfolding (Source → Context → Meaning → Practice)
// 2. Snapchat-like Visual Navigation & Vertical Snap Reel Experience
// 3. Calm Indic Editorial Visual Identity ("ONE WITHIN. ONE WITH ALL.")
// 4. 11 Unified Content Card Primitives & Structured Intent Triggers
// 5. Motion for React Choreography & Accessibility
// ==============================================================================

import { useState, useRef, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  Play,
  Pause,
  Sparkles,
  ArrowRight,
  Bookmark,
  Share2,
  Heart,
  Globe,
  MapPin,
  Film,
  BookOpen,
  Orbit,
  Layers,
  CheckCircle2,
  Flame,
  ChevronDown,
  Volume2,
  VolumeX,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CulturalIntelligenceExplorer } from "@/components/discovery/CulturalIntelligenceExplorer";

// EKA Motion Primitives
import {
  FadeIn,
  StaggerContainer,
  ScrollReveal,
  ConnectionOrbit,
  Pressable,
  KnowledgeUnfold,
  type KnowledgeUnfoldData,
} from "@/components/motion";

// EKA 11 Content Card Primitives
import {
  StoryCard,
  KnowledgeCard,
  CultureCard,
  CommunityCard,
  CreatorCard,
  PlaceCard,
  TraditionCard,
  EventCard,
  PodcastCard,
  ServiceCard,
  MarketplaceCard,
} from "@/components/cards";

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
      { title: "EKA — Living Cultural Stories, Sacred Geography & Contemplative Wisdom" },
      {
        name: "description",
        content:
          "A category-defining consumer platform merging Deepstash-style knowledge discovery with Snapchat-like visual storytelling, rooted in Indic cultural heritage.",
      },
      { property: "og:title", content: "EKA — ONE WITHIN. ONE WITH ALL." },
      {
        property: "og:description",
        content: "Short visual moments, unbroken lineages, and sacred geography.",
      },
      { property: "og:image", content: "/brand/eka-banner-sunset.jpg" },
    ],
  }),
  component: EkaProMaxConsumerPlatform,
});

// ==============================================================================
// EDITORIAL & KNOWLEDGE DATA FIXTURES
// ==============================================================================

const DAILY_WISDOM_UNFOLD: KnowledgeUnfoldData = {
  id: "daily-unfold-upanishad",
  spark: "That which permeates all existence yet cannot be grasped by the senses is the silent witness within.",
  sourceText: "Katha Upanishad, II.ii.12",
  lineageOrAuthor: "Vedic Contemplative Tradition",
  eraOrDate: "c. 800 BCE",
  epistemicTier: "DOCUMENTED",
  meaning:
    "The Upanishad emphasizes that true peace is not attained by manipulating external conditions, but by resting attention in the unchanging consciousness behind every perceived thought and sensation.",
  context:
    "Preserved through oral chanting lineages in the Garhwal and Narmada river valleys, this verse is traditionally studied during the twilight sandhya meditation.",
  actionablePractice:
    "Take 3 conscious breaths before opening any digital app today. Notice the silent awareness that remains untouched by notifications.",
  relatedConcepts: [
    { label: "Sakshi Bhav", slug: "sakshi-bhav" },
    { label: "Sandhya Timing", slug: "sandhya-timing" },
    { label: "Advaita Vedanta", slug: "advaita-vedanta" },
  ],
};

const FEATURED_KNOWLEDGE = [
  {
    id: "k-1",
    spark: "When sound dissolves into silence, the heart awakens to uncaused delight.",
    sourceText: "Vijnana Bhairava Tantra, Dharana 14",
    traditionOrAuthor: "Kashmir Shaiva Lineage",
    category: "Sacred Sound",
    epistemicTier: "DOCUMENTED" as const,
    takeaway: "Listen to the end of a bell ring until sound completely fades.",
    actionTo: "/stories",
  },
  {
    id: "k-2",
    spark: "The sacred grove is not separate from the temple; the living trees are the pillars.",
    sourceText: "Kavus Oral Preservation",
    traditionOrAuthor: "Sacred Grove Custodians, Kerala",
    category: "Ecological Lineage",
    epistemicTier: "LIVING_PRACTICE" as const,
    takeaway: "Traditional communities recognize biodiversity sanctuaries as holy soil.",
    actionTo: "/observe",
  },
  {
    id: "k-3",
    spark: "Every craft is sadhana when the maker's breath aligns with the chisel.",
    sourceText: "Manasara Shilpa Shastra",
    traditionOrAuthor: "Vishwakarma Guild Archive",
    category: "Guildcraft",
    epistemicTier: "DOCUMENTED" as const,
    takeaway: "Authentic creation requires internal stillness prior to external shaping.",
    actionTo: "/studio",
  },
];

const REEL_STORIES = [
  {
    id: "aranmula-mirror",
    title: "The Mirror That Holds No Glass",
    subtitle: "In a quiet village along the Pamba river, eight families preserve the metallurgy of reflective bronze alloy mirrors granted GI Tag #9.",
    category: "Sacred Metallurgy",
    location: "Aranmula, Kerala",
    mediaUrl: monasteryCorridor,
    aspectRatio: "vertical" as const,
    featured: true,
    creator: {
      name: "S. Janardhanan",
      handle: "@aranmula_guild",
      tradition: "Vishwakarma Guildholder",
      verified: true,
    },
    epistemicTier: "DOCUMENTED" as const,
    likesCount: 142,
    actionTo: "/stories",
  },
  {
    id: "kashi-ganga-aarti",
    title: "Dawn on the Ghats: Fire and Flow",
    subtitle: "How the five elements are offered back to the river each sunrise in a ritual that has not ceased for 1,200 years.",
    category: "Living Ritual",
    location: "Varanasi, Uttar Pradesh",
    mediaUrl: ritualLamp,
    aspectRatio: "vertical" as const,
    creator: {
      name: "Pandit Ramakrishna",
      handle: "@kashi_archive",
      tradition: "Dashashwamedh Lineage",
      verified: true,
    },
    epistemicTier: "LIVING_PRACTICE" as const,
    likesCount: 289,
    actionTo: "/stories",
  },
  {
    id: "bishnoi-khejarli",
    title: "Trees More Precious Than Life",
    subtitle: "The 29 desert tenets of Guru Jambheshwar and the living community that treats blackbucks as their own children.",
    category: "Ecological Lineage",
    location: "Jodhpur, Rajasthan",
    mediaUrl: stillWater,
    aspectRatio: "vertical" as const,
    creator: {
      name: "Rana Ram Bishnoi",
      handle: "@khejarli_stewards",
      tradition: "Bishnoi Elder",
      verified: true,
    },
    epistemicTier: "DOCUMENTED" as const,
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
    aspectRatio: "vertical" as const,
    creator: {
      name: "Ananya Barua",
      handle: "@brahmaputra_lore",
      tradition: "Sattriya Scholar",
      verified: true,
    },
    epistemicTier: "LIVING_PRACTICE" as const,
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
    aspectRatio: "vertical" as const,
    creator: {
      name: "Swami Chinmayananda",
      handle: "@himalayan_hermitage",
      tradition: "Advaita Lineage",
      verified: true,
    },
    epistemicTier: "SACRED_GEOGRAPHY" as const,
    likesCount: 310,
    actionTo: "/observe",
  },
];

const LIVING_TRADITIONS = [
  {
    id: "trad-aranmula",
    name: "Aranmula Kannadi Metal Mirrors",
    lineage: "Vishwakarma Bronze Alloy Lineage",
    origin: "Aranmula, Kerala",
    status: "SACRED_GUILD" as const,
    description: "Unlike commercial silver-backed glass, these front-surface alloy mirrors produce zero secondary refraction, cast according to secret family metallurgical proportions.",
    giTagNumber: "9",
    imageUrl: monasteryCorridor,
    epistemicTier: "DOCUMENTED" as const,
    actionTo: "/stories",
  },
  {
    id: "trad-dhrupad",
    name: "Dagarvani Dhrupad Sacred Intonation",
    lineage: "20-Generation Dagar Family",
    origin: "Varanasi & Udaipur",
    status: "UNBROKEN" as const,
    description: "The oldest existing form of classical Indian vocal music, exploring microtonal shrutis to induce deep meditational stillness.",
    imageUrl: ritualLamp,
    epistemicTier: "LIVING_PRACTICE" as const,
    actionTo: "/observe",
  },
  {
    id: "trad-toda-embroidery",
    name: "Toda Pukhoor Geometric Needlework",
    lineage: "Nilgiri Indigenous Tribal Guild",
    origin: "Ooty Hills, Tamil Nadu",
    status: "REVIVING" as const,
    description: "Distinctive black and red geometric thread embroidery stitched on unbleached white cotton shawls representing sacred buffalo horns and cosmos.",
    giTagNumber: "211",
    imageUrl: journeyImage,
    epistemicTier: "LIVING_PRACTICE" as const,
    actionTo: "/studio",
  },
];

const SACRED_PLACES = [
  {
    id: "place-kashi",
    name: "Kashi Manikarnika & Dashashwamedh Ghats",
    significance: "Continuous sacred river fire since antiquity, where time is contemplated as an unbroken circular flow.",
    state: "Uttar Pradesh",
    country: "India",
    imageUrl: ritualLamp,
    epistemicTier: "SACRED_GEOGRAPHY" as const,
    altitudeOrCoords: "81m • 25.3° N",
    bestSeason: "October — March",
    actionTo: "/junction",
  },
  {
    id: "place-arunachala",
    name: "Mount Arunachala & Sacred Pradakshina Path",
    significance: "Ancient granite hill of silent self-inquiry, walked clockwise by seekers for millennia.",
    state: "Tamil Nadu",
    country: "India",
    imageUrl: readingTable,
    epistemicTier: "SACRED_GEOGRAPHY" as const,
    altitudeOrCoords: "800m • 12.2° N",
    bestSeason: "November — February",
    actionTo: "/junction",
  },
  {
    id: "place-majuli",
    name: "Majuli River Island & Vaishnava Satras",
    significance: "The world's largest river island, home to living monastic centers practicing unbroken mask-making and neo-Vaishnavite dance.",
    state: "Assam",
    country: "India",
    imageUrl: todayReflection,
    epistemicTier: "SACRED_GEOGRAPHY" as const,
    altitudeOrCoords: "84m • 26.9° N",
    bestSeason: "November — April",
    actionTo: "/junction",
  },
];

const COMMUNITY_CIRCLES = [
  {
    id: "circle-silence",
    name: "Dawn Contemplative Sangha",
    focus: "Meditation & Reflection",
    description: "Daily silent meditation circle practicing Vedic & Buddhist contemplative breathing at sunrise.",
    membersCount: 1420,
    recentTopic: "Observing thoughts without identification during morning sit",
    actionTo: "/stories",
  },
  {
    id: "circle-folklore",
    name: "Oral Lore & River Ballads",
    focus: "Cultural Preservation",
    description: "Researchers and singers documenting endangered rural dialects, wandering Baul songs, and village lore.",
    membersCount: 890,
    recentTopic: "Field recording translations of Lalon Fakir songs",
    actionTo: "/stories",
  },
  {
    id: "circle-artisans",
    name: "Living Craft Guild Circle",
    focus: "Artisan Stewardship",
    description: "Direct bridge between consumers and traditional master weavers, bell-metal casters, and stone sculptors.",
    membersCount: 2310,
    recentTopic: "Fair price dakshina models for handloom silk weavers",
    actionTo: "/studio",
  },
];

const MARKETPLACE_CRAFTS = [
  {
    id: "craft-mirror",
    title: "Hand-cast Aranmula 4-inch Arch Mirror",
    artisanName: "Master S. Janardhanan",
    craftTradition: "Vishwakarma Bronze Alloy",
    origin: "Kerala, India",
    priceFormatted: "₹ 8,400",
    giTagNumber: "9",
    imageUrl: monasteryCorridor,
    inventoryStatus: "LAST_PIECE" as const,
    actionTo: "/studio",
  },
  {
    id: "craft-stole",
    title: "Hand-spun Organic Cotton Gamusa",
    artisanName: "Majuli Weavers Guild",
    craftTradition: "Sattriya Loom Weaving",
    origin: "Assam, India",
    priceFormatted: "₹ 1,850",
    giTagNumber: "384",
    imageUrl: todayReflection,
    inventoryStatus: "IN_STOCK" as const,
    actionTo: "/studio",
  },
  {
    id: "craft-lamp",
    title: "Ritual Cast Brass Diya with Peocock Finial",
    artisanName: "Nachiyar Koil Guild",
    craftTradition: "Lost-Wax Bell Metal Casting",
    origin: "Thanjavur, Tamil Nadu",
    priceFormatted: "₹ 4,200",
    giTagNumber: "155",
    imageUrl: ritualLamp,
    inventoryStatus: "MADE_TO_ORDER" as const,
    actionTo: "/studio",
  },
];

// ==============================================================================
// MAIN CONSUMER COMPONENT
// ==============================================================================

export function EkaProMaxConsumerPlatform() {
  const [experienceMode, setExperienceMode] = useState<"magazine" | "knowledge" | "reels">("magazine");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [activeReelIndex, setActiveReelIndex] = useState(0);

  const TAGS = [
    "All",
    "Sacred Metallurgy",
    "Living Ritual",
    "Ecological Lineage",
    "Folk Rhythm",
    "Contemplative Path",
  ];

  const filteredReels =
    selectedTag === "All"
      ? REEL_STORIES
      : REEL_STORIES.filter((s) => s.category === selectedTag);

  return (
    <div className="min-h-screen bg-sand/20 dark:bg-stone-950 text-foreground flex flex-col selection:bg-terracotta/20">
      <SiteHeader />

      <main id="main-content" className="flex-1 space-y-16 sm:space-y-24 pb-24 md:pb-16">
        {/* ==================================================================== */}
        {/* 1. HERO SHOWCASE WITH SACRED ORBIT MOTIF */}
        {/* ==================================================================== */}
        <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-end overflow-hidden border-b border-border/50">
          {/* Hero Background Photo */}
          <div className="absolute inset-0 w-full h-full bg-neutral-950">
            <img
              src={heroImage}
              alt="EKA Sacred Heritage — Light on ancient stone sanctuary"
              className="w-full h-full object-cover object-center brightness-75 transition-transform duration-1000 scale-[1.02]"
            />
            {/* Ambient gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/45 to-black/30" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 pointer-events-none" />
          </div>

          {/* EKA Signature Connection Orbit Floating Ambient */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-25 hidden lg:block">
            <ConnectionOrbit size={580} orbitCount={4} />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container-eka pb-14 sm:pb-20 max-w-5xl space-y-6">
            <FadeIn direction="up">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-white/95 text-xs font-mono shadow-calm">
                <span className="size-2 rounded-full bg-terracotta animate-pulse" />
                <span className="font-semibold tracking-wider uppercase text-amber-200">
                  ONE WITHIN. ONE WITH ALL.
                </span>
                <span className="opacity-40">•</span>
                <span>Cultural Intelligence Engine</span>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <h1 className="font-display font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] text-white tracking-tight drop-shadow-md">
                Don't just scroll the world. <br className="hidden sm:inline" />
                Understand it.
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <p className="max-w-2xl text-base sm:text-lg font-light text-white/85 leading-relaxed drop-shadow-sm">
                Discover and understand cultures, living traditions, sacred places, and artisan communities through trustworthy, contextualized knowledge. The anti-noise sanctuary for human cultural memory.
              </p>
            </FadeIn>

            {/* Experience Mode Toggle Switcher */}
            <FadeIn direction="up" delay={0.3}>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <div className="p-1 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-1">
                  <button
                    onClick={() => setExperienceMode("magazine")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                      experienceMode === "magazine"
                        ? "bg-terracotta text-white font-medium shadow-xs"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <Layers className="size-3.5" />
                    <span>Curated Magazine</span>
                  </button>

                  <button
                    onClick={() => setExperienceMode("knowledge")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                      experienceMode === "knowledge"
                        ? "bg-terracotta text-white font-medium shadow-xs"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <BookOpen className="size-3.5" />
                    <span>Deepstash Wisdom</span>
                  </button>

                  <button
                    onClick={() => setExperienceMode("reels")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                      experienceMode === "reels"
                        ? "bg-terracotta text-white font-medium shadow-xs"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <Film className="size-3.5 text-saffron" />
                    <span>Snapchat Reel Feed</span>
                  </button>
                </div>

                <Link to="/junction">
                  <Button
                    variant="outline"
                    className="rounded-2xl px-5 py-5 border-white/30 bg-black/40 backdrop-blur-md text-white hover:bg-white/20 font-medium text-xs font-mono gap-1.5"
                  >
                    <Compass className="size-3.5 text-cyan-300" />
                    <span>Sacred Map</span>
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* CONDITIONAL MODE 1: SNAPCHAT-STYLE FULL REEL EXPERIENCE */}
        {/* ==================================================================== */}
        {experienceMode === "reels" && (
          <section className="container-eka max-w-lg mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-terracotta font-semibold">
                  Snap Reel Feed
                </span>
                <h2 className="font-serif text-2xl font-normal">Living Moments</h2>
              </div>
              <button
                onClick={() => setExperienceMode("magazine")}
                className="text-xs font-mono text-muted-foreground hover:text-foreground"
              >
                Exit to Magazine
              </button>
            </div>

            {/* Vertical Snap Reel Cards */}
            <div className="space-y-8">
              {filteredReels.map((story) => (
                <div key={story.id} className="w-full">
                  <StoryCard {...story} aspectRatio="vertical" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* CONDITIONAL MODE 2: DEEPSTASH WISDOM STREAM */}
        {/* ==================================================================== */}
        {experienceMode === "knowledge" && (
          <section className="container-eka max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-terracotta font-semibold">
                  Knowledge Unfolder
                </span>
                <h2 className="font-serif text-3xl font-normal">Progressive Wisdom</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Bite-sized sparks that expand into manuscript context, commentary, and daily practice.
                </p>
              </div>
              <button
                onClick={() => setExperienceMode("magazine")}
                className="text-xs font-mono text-muted-foreground hover:text-foreground"
              >
                Exit to Magazine
              </button>
            </div>

            {/* Deepstash Progressive Accordion Unfolder */}
            <KnowledgeUnfold data={DAILY_WISDOM_UNFOLD} initiallyExpanded={true} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
              {FEATURED_KNOWLEDGE.map((k) => (
                <KnowledgeCard key={k.id} {...k} />
              ))}
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* DEFAULT MODE: CURATED EDITORIAL MAGAZINE RAILS */}
        {/* ==================================================================== */}
        {experienceMode === "magazine" && (
          <>
            {/* 1.5 CULTURAL INTELLIGENCE ENGINE & PROVOCATIVE INQUIRIES */}
            <section id="cultural-intelligence" className="container-eka space-y-6">
              <CulturalIntelligenceExplorer />
            </section>

            {/* 2. REEL STRIP: VERTICAL GLIMPSES OF LIVING FAITH */}
            <section className="container-eka space-y-6">
              <ScrollReveal>
                <div className="flex items-end justify-between border-b border-border/60 pb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-terracotta font-semibold flex items-center gap-1.5">
                      <Film className="size-3.5 text-saffron" />
                      Visual Storytelling Rail
                    </span>
                    <h2 className="font-display font-serif text-2xl sm:text-3xl font-normal mt-1">
                      Glimpses of Living Faith
                    </h2>
                  </div>
                  <Link
                    to="/stories"
                    className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <span>Watch 1,000 Stories</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </ScrollReveal>

              {/* Horizontal Snap Rail with Vertical Reel Cards */}
              <div className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none">
                {REEL_STORIES.map((story) => (
                  <div
                    key={story.id}
                    className="min-w-[270px] sm:min-w-[310px] max-w-[330px] shrink-0 snap-start"
                  >
                    <StoryCard {...story} aspectRatio="vertical" />
                  </div>
                ))}
              </div>
            </section>

            {/* 3. TODAY'S KNOWLEDGE UNFOLD (DEEPSTASH-STYLE WISDOM) */}
            <section className="container-eka space-y-6">
              <ScrollReveal>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-terracotta font-semibold flex items-center gap-1.5">
                      <BookOpen className="size-3.5 text-terracotta" />
                      Contemplative Deepstash
                    </span>
                    <h2 className="font-display font-serif text-2xl sm:text-3xl font-normal mt-1">
                      Today's Living Insight
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground font-light mt-1 max-w-lg">
                      Tap to unfold progressive layers: original Sanskrit manuscript, historical context, and daily sadhana practice.
                    </p>
                  </div>

                  <Link
                    to="/observe"
                    className="text-xs font-mono text-terracotta hover:underline flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>Browse Knowledge Codex</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </ScrollReveal>

              {/* Interactive Unfolding Component */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7">
                  <KnowledgeUnfold data={DAILY_WISDOM_UNFOLD} initiallyExpanded={true} />
                </div>
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  {FEATURED_KNOWLEDGE.slice(0, 2).map((item) => (
                    <KnowledgeCard key={item.id} {...item} />
                  ))}
                </div>
              </div>
            </section>

            {/* 4. LIVING TRADITIONS & GENERATIONAL GUILDS */}
            <section className="container-eka space-y-6">
              <ScrollReveal>
                <div className="flex items-end justify-between border-b border-border/60 pb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-terracotta font-semibold flex items-center gap-1.5">
                      <Flame className="size-3.5 text-saffron" />
                      Unbroken Lineages
                    </span>
                    <h2 className="font-display font-serif text-2xl sm:text-3xl font-normal mt-1">
                      Generational Crafts & Traditions
                    </h2>
                  </div>
                  <Link
                    to="/observe"
                    className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <span>Explore Lineages</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {LIVING_TRADITIONS.map((tradition) => (
                  <TraditionCard key={tradition.id} {...tradition} />
                ))}
              </div>
            </section>

            {/* 5. SACRED GEOGRAPHY & PILGRIMAGE (THE JUNCTION) */}
            <section className="container-eka space-y-6">
              <ScrollReveal>
                <div className="flex items-end justify-between border-b border-border/60 pb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-500 font-semibold flex items-center gap-1.5">
                      <Compass className="size-3.5" />
                      Sacred Topography
                    </span>
                    <h2 className="font-display font-serif text-2xl sm:text-3xl font-normal mt-1">
                      Pilgrimage Routes & River Confluences
                    </h2>
                  </div>
                  <Link
                    to="/junction"
                    className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <span>Open Sacred Map</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SACRED_PLACES.map((place) => (
                  <PlaceCard key={place.id} {...place} />
                ))}
              </div>
            </section>

            {/* 6. COMMUNITY CIRCLES & SANGHAS */}
            <section className="container-eka space-y-6">
              <ScrollReveal>
                <div className="flex items-end justify-between border-b border-border/60 pb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-forest font-semibold flex items-center gap-1.5">
                      <Orbit className="size-3.5" />
                      Sacred Fellowship
                    </span>
                    <h2 className="font-display font-serif text-2xl sm:text-3xl font-normal mt-1">
                      Living Circles & Sanghas
                    </h2>
                  </div>
                  <Link
                    to="/membership"
                    className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <span>Browse Circles</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {COMMUNITY_CIRCLES.map((circle) => (
                  <CommunityCard key={circle.id} {...circle} />
                ))}
              </div>
            </section>

            {/* 7. AUTHENTIC ARTISAN GUILD MARKETPLACE */}
            <section className="container-eka space-y-6">
              <ScrollReveal>
                <div className="flex items-end justify-between border-b border-border/60 pb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-600 font-semibold flex items-center gap-1.5">
                      <Layers className="size-3.5" />
                      Geographical Indication (GI) Crafts
                    </span>
                    <h2 className="font-display font-serif text-2xl sm:text-3xl font-normal mt-1">
                      Direct Artisan Guild Atelier
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground font-light mt-1">
                      100% direct-to-maker dakshina preserving endangered metallurgical and textile heritages.
                    </p>
                  </div>
                  <Link
                    to="/studio"
                    className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <span>Visit Guild Marketplace</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {MARKETPLACE_CRAFTS.map((craft) => (
                  <MarketplaceCard key={craft.id} {...craft} />
                ))}
              </div>
            </section>

            {/* 8. SANCTUARY INVITATION WITH SACRED ORBIT */}
            <section className="container-eka pb-8">
              <ScrollReveal>
                <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-sand/25 to-card p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-6 shadow-calm">
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <ConnectionOrbit size={380} orbitCount={3} />
                  </div>

                  <div className="relative z-10 size-14 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto">
                    <Sparkles className="size-7" />
                  </div>

                  <h2 className="relative z-10 font-display font-serif text-3xl sm:text-4xl lg:text-5xl font-normal">
                    One within. One with all.
                  </h2>

                  <p className="relative z-10 text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-xl mx-auto">
                    No algorithmic feeds. No outrage triggers. EKA is an intimate, reverent home for your inner life,
                    living traditions, and cultural heritage.
                  </p>

                  <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
                    <Link to="/join">
                      <Button className="rounded-xl px-8 py-5 bg-terracotta hover:bg-terracotta/90 text-white text-sm font-medium shadow-calm">
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
              </ScrollReveal>
            </section>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
