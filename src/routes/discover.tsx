// ==============================================================================
// EKA DISCOVER — UNIFIED CULTURAL EXPLORATION ENVIRONMENT
// ==============================================================================
// Specification: Section 2
// Merged LEARN + DISCOVER into a single, intuitive knowledge & exploration destination.
// Loop: Discover a culture → open a story → understand context → explore related places → ask EKA → save → follow
// Contains Visual Category Cards + Curated Discovery Cards + Living Cultural Map.
// Completely removed misplaced "Ask EKA" hero module from Discover landing (moved to /ask).
// ==============================================================================

import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Compass,
  ArrowRight,
  Globe,
  MapPin,
  Sparkles,
  ShieldCheck,
  Bookmark,
  Share2,
  Heart,
  Layers,
  Filter,
  CheckCircle2,
  UserPlus,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CategoryCard } from "@/components/cards/CategoryCard";
import { GlobalCulturalMap } from "@/components/discovery/GlobalCulturalMap";
import { CompareCulturesSection } from "@/components/discovery/CompareCulturesSection";
import { toast } from "sonner";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { MetaTags } from "@/components/seo";
import { EkaBreadcrumb } from "@/components/navigation";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover Cultures, Traditions & Sacred Places — EKA" },
      {
        name: "description",
        content:
          "Explore living traditions, sacred places, master crafts, foodways, and cultural lineages across unbroken human history. Don't just scroll the world. Understand it.",
      },
      { property: "og:title", content: "Discover Cultures & Traditions — EKA" },
      {
        property: "og:description",
        content: "Explore living cultures, unbroken lineages, crafts, and sacred places.",
      },
    ],
  }),
  component: DiscoverPage,
});

// -----------------------------------------------------------------------------
// Visual Category Cards Definition (Specification Section 2)
// -----------------------------------------------------------------------------
interface VisualCategory {
  id: string;
  title: string;
  subtitle: string;
  itemCount: number;
  imageUrl: string;
  filterKey: string;
}

const VISUAL_CATEGORIES: VisualCategory[] = [
  {
    id: "cat-cultures",
    title: "Living Cultures",
    subtitle: "Living ways of being across 7 continents",
    itemCount: 48,
    imageUrl: "/brand/eka-circle-communion.jpg",
    filterKey: "culture",
  },
  {
    id: "cat-traditions",
    title: "Traditions & Rituals",
    subtitle: "Unbroken generational customs and dawn rites",
    itemCount: 84,
    imageUrl: "/content/ritual-lamp.jpg",
    filterKey: "tradition",
  },
  {
    id: "cat-sacred-places",
    title: "Sacred Places",
    subtitle: "Temples, rivers, shrines, and sacred geography",
    itemCount: 62,
    imageUrl: "/places/varanasi.jpg",
    filterKey: "place",
  },
  {
    id: "cat-crafts",
    title: "Master Crafts",
    subtitle: "Hereditary textile, metal, and ceramic arts",
    itemCount: 56,
    imageUrl: "/content/practice.jpg",
    filterKey: "craft",
  },
  {
    id: "cat-festivals",
    title: "Festivals & Rites",
    subtitle: "Equinox celebrations, harvests, and public pageants",
    itemCount: 39,
    imageUrl: "/places/kolkata.jpg",
    filterKey: "festival",
  },
  {
    id: "cat-foodways",
    title: "Foodways & Feasts",
    subtitle: "Ancestral gastronomy, temple offerings, and fermentation",
    itemCount: 31,
    imageUrl: "/places/kyoto.jpg",
    filterKey: "food",
  },
  {
    id: "cat-heritage",
    title: "Heritage & Architecture",
    subtitle: "Mud brick fortifications, stone stepwells, and ancient geometry",
    itemCount: 37,
    imageUrl: "/places/marrakesh.jpg",
    filterKey: "heritage",
  },
  {
    id: "cat-communities",
    title: "Communities & Elders",
    subtitle: "Custodians, monastic guilds, and indigenous guardians",
    itemCount: 45,
    imageUrl: "/content/monastery-corridor.jpg",
    filterKey: "community",
  },
  {
    id: "cat-languages",
    title: "Languages & Oral Epics",
    subtitle: "Living chants, dialects, and unwritten epics",
    itemCount: 28,
    imageUrl: "/content/reading-table.jpg",
    filterKey: "language",
  },
  {
    id: "cat-history",
    title: "History & Lineages",
    subtitle: "Centuries of continuous transmission and lineage texts",
    itemCount: 41,
    imageUrl: "/content/journey.jpg",
    filterKey: "history",
  },
  {
    id: "cat-ideas",
    title: "Ideas & Universal Wisdom",
    subtitle: "Philosophies of impermanence, harmony, and interconnectedness",
    itemCount: 52,
    imageUrl: "/content/today-reflection.jpg",
    filterKey: "ideas",
  },
  {
    id: "cat-experiences",
    title: "Cultural Experiences",
    subtitle: "Dawn pilgrimages, temple stays, and master artisan immersions",
    itemCount: 34,
    imageUrl: "/brand/eka-banner-sunset.jpg",
    filterKey: "experience",
  },
];

// -----------------------------------------------------------------------------
// Curated Cultural Discovery Cards
// -----------------------------------------------------------------------------
interface DiscoveryCultureItem {
  id: string;
  title: string;
  culture: string;
  category: string;
  region: string;
  imageUrl: string;
  summary: string;
  lineageEra: string;
  custodian: string;
  relatedStoryLink: string;
  relatedPlaceLink?: string;
  questionPrompt: string;
  filterKey: string;
}

const DISCOVERY_CULTURE_ITEMS: DiscoveryCultureItem[] = [
  {
    id: "disc-durga-puja",
    title: "Uma’s Homecoming: The Humanized Goddess of Bengal",
    culture: "Bengali Shakta Tradition",
    category: "Festival & Ritual",
    region: "Kolkata, West Bengal",
    imageUrl: "/places/kolkata.jpg",
    summary:
      "While other regions fast during Navratri, Bengal welcomes Durga as an intimate daughter returning home with her four children for four days of street music and sacred clay sculpture.",
    lineageEra: "16th Century CE community codification",
    custodian: "Kumartuli Potter Artisans & Dhaaki Drummer Lineages",
    relatedStoryLink: "/knowledge/durga-puja-bengal-distinct-tradition",
    relatedPlaceLink: "/places/kolkata",
    questionPrompt: "Why do Bengalis celebrate Durga Puja differently from the rest of India?",
    filterKey: "festival",
  },
  {
    id: "disc-japanese-chado",
    title: "Chado: The Sacred Architecture of Japanese Tea",
    culture: "Zen Monastic & Chanoyu",
    category: "Craft & Stillness",
    region: "Kyoto, Japan",
    imageUrl: "/places/kyoto.jpg",
    summary:
      "Every gesture from water ladle to whisking powdered matcha embodies 'Ichi-go ichi-e' (one time, one meeting) — treating this fleeting instant as unrepeatable.",
    lineageEra: "16th Century Sen no Rikyu lineage",
    custodian: "Urasenke & Omotesenke Tea Master Lineages",
    relatedStoryLink: "/stories",
    relatedPlaceLink: "/places/kyoto",
    questionPrompt: "What is the story behind the Japanese Tea Ceremony?",
    filterKey: "craft",
  },
  {
    id: "disc-varanasi-aarti",
    title: "Twilight Fire Offering: The Geometry of Ganga Aarti",
    culture: "Vedic River Veneration",
    category: "Sacred Place",
    region: "Dashashwamedh Ghat, Varanasi",
    imageUrl: "/places/varanasi.jpg",
    summary:
      "Seven tiered brass oil lamps hoisted by white-clad priests invoking the sacred river at the exact transition between dusk and dark, synchronized with conch shells.",
    lineageEra: "Continuous Vedic continuity",
    custodian: "Ghat Priests & Traditional Boatmen of Kashi",
    relatedStoryLink: "/knowledge/varanasi-ganga-aarti",
    relatedPlaceLink: "/places/varanasi",
    questionPrompt: "Why is Varanasi considered sacred across millennia?",
    filterKey: "place",
  },
  {
    id: "disc-majuli-satras",
    title: "Majuli Island: The Bamboo Mask & Monastery Republic",
    culture: "Sattriya Vaishnavism",
    category: "Living Culture",
    region: "Majuli, Assam",
    imageUrl: "/brand/eka-banner-sunset.jpg",
    summary:
      "An egalitarian river island republic where monastics craft cowdung-and-bamboo masks for night performances of Bhaona, preserving 500 years of unbroken spiritual theater.",
    lineageEra: "15th Century Srimanta Sankaradeva",
    custodian: "Samaguri Satra Mask Guild & Sattriya Bhakats",
    relatedStoryLink: "/knowledge/majuli-sattra-culture",
    questionPrompt: "What makes Majuli's Satra monastic life unique?",
    filterKey: "culture",
  },
  {
    id: "disc-marrakesh-souks",
    title: "Berber Rug Weaving: The Secret Mathematical Lexicon",
    culture: "Amazigh Heritage",
    category: "Master Craft",
    region: "Atlas Mountains & Marrakesh, Morocco",
    imageUrl: "/places/marrakesh.jpg",
    summary:
      "Hand-knotted wool rugs carrying matrilineal symbols of birth, fertility, arid protection, and cosmic harmony passed from mother to daughter without written patterns.",
    lineageEra: "Millennia-old matrilineal craft",
    custodian: "Beni Ourain & High Atlas Women Weavers",
    relatedStoryLink: "/stories",
    relatedPlaceLink: "/places/marrakesh",
    questionPrompt: "How do Berber women encode family lineages in woven rugs?",
    filterKey: "craft",
  },
  {
    id: "disc-bishnoi-forest",
    title: "The 29 Precepts: Sacred Ecology in the Arid Thar",
    culture: "Bishnoi Faith Stream",
    category: "Community",
    region: "Jodhpur & Thar Desert, Rajasthan",
    imageUrl: "/content/observe.jpg",
    summary:
      "A community that sacrificed 363 lives to protect the green Khejri trees in 1730, today safeguarding desert blackbucks, trees, and groundwater with religious devotion.",
    lineageEra: "1485 CE Guru Jambheshwar",
    custodian: "Bishnoi Dharma Sanstha & Village Councils",
    relatedStoryLink: "/knowledge/bishnoi-ecology",
    questionPrompt: "What are the 29 principles of Bishnoi sacred ecology?",
    filterKey: "community",
  },
  {
    id: "disc-diya-tradition",
    title: "Light Over Darkness: The Vedic Sandhya Lamp",
    culture: "Sanatana Dharma",
    category: "Tradition & Ritual",
    region: "Pan-India",
    imageUrl: "/content/ritual-lamp.jpg",
    summary:
      "Lighting handmade earthenware diyas with sesame or mustard oil at twilight, returning warmth and gratitude to cosmic light.",
    lineageEra: "Vedic Antiquity",
    custodian: "Hereditary Potter Lineages & Household Elders",
    relatedStoryLink: "/stories",
    questionPrompt: "Why do people light clay diyas at sunset?",
    filterKey: "tradition",
  },
  {
    id: "disc-kyoto-tea",
    title: "Chado: The Zen Way of Tea and Stillness",
    culture: "Japanese Zen",
    category: "Master Craft",
    region: "Kyoto, Japan",
    imageUrl: "/places/kyoto.jpg",
    summary:
      "The meditative preparation of matcha green tea embodying 'Ichi-go ichi-e' — treating this single meeting as unrepeatable.",
    lineageEra: "16th Century Sen no Rikyu",
    custodian: "Urasenke Tea Guild Masters",
    relatedStoryLink: "/stories",
    relatedPlaceLink: "/places/kyoto",
    questionPrompt: "What is the story behind the Japanese Tea Ceremony?",
    filterKey: "craft",
  },
  {
    id: "disc-oaxaca-food",
    title: "Ceremonial Mole Negro: The 30-Ingredient Hearth",
    culture: "Zapotec & Oaxacan Heritage",
    category: "Foodways & Feasts",
    region: "Oaxaca Valley, Mexico",
    imageUrl: "/content/reading-table.jpg",
    summary:
      "Smoked chiles, heirloom criollo cacao, plantains, and toasted seeds ground on volcanic metate stones for communal rites of passage.",
    lineageEra: "Pre-Columbian Mesoamerican Continuity",
    custodian: "Cocinera Tradicional Matriarchs",
    relatedStoryLink: "/stories",
    questionPrompt: "What is the cultural history of ceremonial Mole in Oaxaca?",
    filterKey: "food",
  },
  {
    id: "disc-sanskrit-chant",
    title: "Vedic Oral Chanting: The Unbroken Acoustic Memory",
    culture: "Vedic Heritage",
    category: "Languages & Oral Epics",
    region: "Varanasi & Kerala, India",
    imageUrl: "/content/reading-table.jpg",
    summary:
      "UNESCO-recognized oral preservation using rigorous mnemonic permutations (Veda Patha) unchanged for 3,500 years without written text.",
    lineageEra: "Bronze Age Vedic transmission",
    custodian: "Namboodiri & Shastry Chanting Lineages",
    relatedStoryLink: "/knowledge/vedic-chanting",
    questionPrompt: "How has Vedic chanting survived 3,500 years without changing a syllable?",
    filterKey: "language",
  },
  {
    id: "disc-fez-heritage",
    title: "Fez Medina: The Carved Cedar & Stucco Sanctuaries",
    culture: "Maghrebi Andalusian",
    category: "Heritage & Architecture",
    region: "Fez, Morocco",
    imageUrl: "/places/marrakesh.jpg",
    summary:
      "Geometric muqarnas stalactites, zellij mosaics, and carved cedar screens channeling natural desert ventilation inside car-free alleys.",
    lineageEra: "9th Century CE Idrissid Era",
    custodian: "Medina Maâlems Guild",
    relatedStoryLink: "/stories",
    relatedPlaceLink: "/places/marrakesh",
    questionPrompt: "How do historical islamic cities design passive desert cooling?",
    filterKey: "heritage",
  },
  {
    id: "disc-langar-seva",
    title: "Guru Ka Langar: The Radical Table of Equality",
    culture: "Sikh Living Faith",
    category: "Tradition & Community",
    region: "Amritsar, Punjab",
    imageUrl: "/content/journey.jpg",
    summary:
      "Serving over 100,000 free hot vegetarian meals daily to all humans regardless of caste, faith, or status sitting side-by-side on floor mats.",
    lineageEra: "1469 CE Guru Nanak Dev Ji",
    custodian: "Golden Temple Sevadaars & Sangat",
    relatedStoryLink: "/stories",
    questionPrompt: "What was the social revolution behind Guru Nanak's Langar?",
    filterKey: "tradition",
  },
];

function DiscoverPage() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [activeView, setActiveView] = useState<"cards" | "map">("cards");
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [followedKeepers, setFollowedKeepers] = useState<Set<string>>(new Set());

  const handleToggleSave = (id: string, title: string) => {
    setSavedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info(`Removed "${title}" from your sanctuary`);
      } else {
        next.add(id);
        toast.success(`Saved "${title}" to your sanctuary`);
        track("discover_item_saved" as any, { id, title });
      }
      return next;
    });
  };

  const handleToggleFollow = (custodian: string) => {
    setFollowedKeepers((prev) => {
      const next = new Set(prev);
      if (next.has(custodian)) {
        next.delete(custodian);
        toast.info(`Unfollowed ${custodian}`);
      } else {
        next.add(custodian);
        toast.success(`Following ${custodian}`);
        track("discover_custodian_followed" as any, { custodian });
      }
      return next;
    });
  };

  const filteredItems = DISCOVERY_CULTURE_ITEMS.filter((item) => {
    if (selectedFilter === "all") return true;
    return item.filterKey === selectedFilter;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <MetaTags
        title="Discover Cultures, Traditions & Sacred Places"
        description="Explore living traditions, sacred places, master crafts, foodways, and cultural lineages across unbroken human history. Don't just scroll the world. Understand it."
        ogTitle="Discover Cultures, Traditions & Sacred Places — EKA"
        ogDescription="Explore living cultures, unbroken lineages, crafts, and sacred places."
        ogImage="/brand/eka-banner.jpg"
        canonicalUrl="/discover"
        twitterCard="summary_large_image"
        twitterTitle="Discover Cultures, Traditions & Sacred Places — EKA"
        twitterDescription="Explore living traditions, sacred places, master crafts, foodways, and cultural lineages."
        keywords={["discover culture", "sacred places", "world traditions", "global cultural map", "master crafts"]}
      />
      <SiteHeader />

      {/* Breadcrumb Navigation Bar */}
      <div className="border-b border-border/40 bg-sand/10">
        <div className="container-eka">
          <EkaBreadcrumb
            items={[
              { label: "Discover", active: true },
            ]}
          />
        </div>
      </div>

      <main id="main-content" className="flex-1 space-y-12 sm:space-y-16 py-8 sm:py-14">
        {/* Header Hero Section */}
        <section className="container-eka max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium tracking-wide uppercase">
            <Compass className="size-3.5" />
            <span>Living Cultural Discovery & Knowledge</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-foreground">
            Explore Culture, Traditions & Sacred Places
          </h1>

          <p className="font-serif text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            Don&apos;t just scroll the world. Understand it. Discover unbroken living customs,
            ancestral crafts, holy geography, and the custodians who keep human memory alive.
          </p>

          {/* View Toggle */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveView("cards")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer",
                activeView === "cards"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-accent/40 text-muted-foreground hover:text-foreground",
              )}
            >
              Curated Discovery Cards
            </button>
            <button
              type="button"
              onClick={() => setActiveView("map")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5",
                activeView === "map"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-accent/40 text-muted-foreground hover:text-foreground",
              )}
            >
              <Globe className="size-3.5" />
              <span>Global Cultural Map</span>
            </button>
          </div>
        </section>

        {activeView === "map" ? (
          /* Global Cultural Map View */
          <section className="container-eka max-w-6xl space-y-4">
            <GlobalCulturalMap onAskEka={() => {}} />
          </section>
        ) : (
          <>
            {/* 1. Visual Category Cards Section (Section 2) */}
            <section className="container-eka max-w-6xl space-y-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-normal text-foreground">
                    Explore by Cultural Category
                  </h2>
                  <p className="text-xs text-muted-foreground font-light">
                    Every culture connects to a tradition, a craft, and a living community.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {VISUAL_CATEGORIES.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    id={cat.id}
                    title={cat.title}
                    subtitle={cat.subtitle}
                    itemCount={cat.itemCount}
                    imageUrl={cat.imageUrl}
                    onClick={() => {
                      setSelectedFilter(cat.filterKey);
                      // smooth scroll to items
                      const el = document.getElementById("discovery-items-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                  />
                ))}
              </div>
            </section>

            {/* 2. Interactive Discovery Feed (Curiosity Loops) */}
            <section
              id="discovery-items-section"
              className="container-eka max-w-6xl space-y-6 pt-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-3">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-normal text-foreground">
                    Curated Discoveries
                  </h2>
                  <p className="text-xs text-muted-foreground font-light">
                    Tap any discovery to explore the living story, understand context, or ask EKA.
                  </p>
                </div>

                {/* Filter Tabs (Zero-Pill: Segmented Button Control) */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                  <button
                    type="button"
                    onClick={() => setSelectedFilter("all")}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer",
                      selectedFilter === "all"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-accent/40 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    All Discoveries
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFilter("culture")}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer",
                      selectedFilter === "culture"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-accent/40 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Cultures
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFilter("festival")}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer",
                      selectedFilter === "festival"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-accent/40 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Festivals
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFilter("place")}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer",
                      selectedFilter === "place"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-accent/40 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Sacred Places
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFilter("craft")}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer",
                      selectedFilter === "craft"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-accent/40 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Master Crafts
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFilter("community")}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer",
                      selectedFilter === "community"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-accent/40 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Communities
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFilter("tradition")}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer",
                      selectedFilter === "tradition"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-accent/40 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Traditions & Rites
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFilter("food")}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer",
                      selectedFilter === "food"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-accent/40 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Foodways
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFilter("heritage")}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer",
                      selectedFilter === "heritage"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-accent/40 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Heritage
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFilter("language")}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer",
                      selectedFilter === "language"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-accent/40 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Languages & Epics
                  </button>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => {
                  const isSaved = savedItems.has(item.id);
                  const isFollowing = followedKeepers.has(item.custodian);

                  return (
                    <article
                      key={item.id}
                      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card shadow-calm hover:border-primary/50 hover:shadow-lift transition-all duration-300"
                    >
                      {/* Image Thumbnail with Overlay */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-900">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Top Kicker */}
                        <div className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-wider text-amber-300 font-semibold drop-shadow">
                          {item.category}
                        </div>

                        {/* Save Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleSave(item.id, item.title)}
                          className={cn(
                            "absolute top-3 right-3 size-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer",
                            isSaved
                              ? "bg-terracotta text-white"
                              : "bg-black/40 text-white/90 hover:bg-black/60",
                          )}
                          title="Save to sanctuary"
                        >
                          <Bookmark className={cn("size-3.5", isSaved && "fill-white")} />
                        </button>

                        {/* Location */}
                        <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[11px] text-white/90 font-light">
                          <MapPin className="size-3 text-amber-400 shrink-0" />
                          <span>{item.region}</span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          {/* Culture Subtitle */}
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono font-medium uppercase tracking-wider">
                            <span className="text-terracotta">{item.culture}</span>
                            <span aria-hidden="true" className="opacity-40">·</span>
                            <span className="truncate">{item.lineageEra}</span>
                          </div>

                          {/* Title */}
                          <h3 className="font-display text-lg font-medium text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {item.title}
                          </h3>

                          {/* Summary */}
                          <p className="text-xs text-muted-foreground font-light leading-relaxed line-clamp-3">
                            {item.summary}
                          </p>
                        </div>

                        {/* Custodian & Follow Action */}
                        <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2 text-xs">
                          <div className="min-w-0">
                            <p className="text-[11px] text-muted-foreground font-light">
                              Custodian / Lineage
                            </p>
                            <p className="text-xs font-medium text-foreground truncate flex items-center gap-1">
                              <span>{item.custodian}</span>
                              <ShieldCheck className="size-3 text-forest shrink-0" />
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleFollow(item.custodian)}
                            className={cn(
                              "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors shrink-0 cursor-pointer flex items-center gap-1",
                              isFollowing
                                ? "bg-accent/60 text-foreground"
                                : "text-terracotta hover:bg-terracotta/10 border border-border/60",
                            )}
                          >
                            {isFollowing ? (
                              <>
                                <CheckCircle2 className="size-3 text-emerald-600" />
                                <span>Following</span>
                              </>
                            ) : (
                              <>
                                <UserPlus className="size-3" />
                                <span>Follow</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Curiosity Loop Action CTAs: Open Story & Ask EKA */}
                        <div className="pt-2 flex items-center justify-between gap-2 border-t border-border/40 text-xs">
                          <Link
                            to="/ask"
                            search={{ q: item.questionPrompt } as any}
                            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium transition-colors"
                          >
                            <Sparkles className="size-3 text-saffron" />
                            <span>Ask EKA</span>
                          </Link>

                          <Link
                            to={item.relatedStoryLink as any}
                            className="inline-flex items-center gap-1 font-medium text-xs text-primary hover:underline group-hover:translate-x-0.5 transition-transform"
                          >
                            <span>Explore Context</span>
                            <ArrowRight className="size-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* 3. Cross-Cultural Comparison */}
            <section className="container-eka max-w-6xl space-y-6 pt-4">
              <CompareCulturesSection onAskEka={() => {}} />
            </section>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
