// ==============================================================================
// EKA HOME: STORIES FROM THE WORLD (LIVING CULTURAL STORIES & REELS)
// ==============================================================================
// Directly visible on Home page.
// Features 9:16 cultural reels & visual stories connecting festivals, crafts,
// foodways, traditions, and sacred places.
// ==============================================================================

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Film,
  Play,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Utensils,
  BookOpen,
} from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

interface StoryPreview {
  id: string;
  title: string;
  category: "festival" | "craft" | "tradition" | "food" | "sacred_place";
  categoryLabel: string;
  location: string;
  curiosityQuestion: string;
  imageUrl: string;
  creatorName: string;
  duration: string;
}

const FEATURED_HOME_STORIES: StoryPreview[] = [
  {
    id: "reel-kashi-aarti",
    title: "The Twilight Fire Offering of Dashashwamedh",
    category: "tradition",
    categoryLabel: "Living Ritual",
    location: "Varanasi, India",
    curiosityQuestion: "Why is fire offered back to the river water at dusk?",
    imageUrl: "/places/varanasi.jpg",
    creatorName: "Pt. Ramakrishna",
    duration: "0:45",
  },
  {
    id: "reel-kyoto-chado",
    title: "Chado: Silence Whispered into Matcha",
    category: "craft",
    categoryLabel: "Artisan Way",
    location: "Kyoto, Japan",
    curiosityQuestion: "How does one bowl of green tea become silent meditation?",
    imageUrl: "/places/kyoto.jpg",
    creatorName: "Master Soukaku",
    duration: "1:00",
  },
  {
    id: "reel-oaxaca-altar",
    title: "Golden Marigold Paths for Returning Spirits",
    category: "festival",
    categoryLabel: "Ancestor Festival",
    location: "Oaxaca, Mexico",
    curiosityQuestion: "Why are yellow marigolds placed outside front doors?",
    imageUrl: "/content/observe.jpg",
    creatorName: "Elena Morales",
    duration: "0:52",
  },
  {
    id: "reel-aranmula-mirror",
    title: "Aranmula Kannadi: The Metal Mirror Guild",
    category: "craft",
    categoryLabel: "Sacred Craft",
    location: "Kerala, India",
    curiosityQuestion: "Why does this ancient metal mirror have zero distortion?",
    imageUrl: "/content/monastery-corridor.jpg",
    creatorName: "Sudhakaran Achari",
    duration: "0:58",
  },
  {
    id: "reel-majuli-masks",
    title: "Majuli Island: Bamboo Spirit Masks of the Sattras",
    category: "sacred_place",
    categoryLabel: "Monastic Lineage",
    location: "Assam, India",
    curiosityQuestion: "How do monastery masks move their jaws using reed strings?",
    imageUrl: "/content/reading-table.jpg",
    creatorName: "Prabin Goswami",
    duration: "0:50",
  },
  {
    id: "reel-fez-tanneries",
    title: "The Thousand-Year Terraces of Chouara",
    category: "food",
    categoryLabel: "Guild Heritage",
    location: "Fez, Morocco",
    curiosityQuestion: "How do natural botanical dyes preserve color for centuries?",
    imageUrl: "/places/marrakesh.jpg",
    creatorName: "Tariq Benjelloun",
    duration: "1:05",
  },
];

export function HomeStoriesSection() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredStories = FEATURED_HOME_STORIES.filter((s) => {
    if (selectedFilter === "all") return true;
    return s.category === selectedFilter;
  });

  return (
    <section className="container-eka py-6 sm:py-10 space-y-6">
      {/* Header & Subtext */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <Badge
            variant="outline"
            className="border-terracotta/40 text-terracotta text-xs font-mono uppercase tracking-wider mb-1"
          >
            <Film className="size-3 mr-1.5 inline" />
            Stories from the World
          </Badge>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground">
            Watch, Wonder & Experience Living Culture
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            Short-form cultural reels from real elders, master artisans, and community stewards.
            From family traditions and ancient rituals to foodways, crafts, festivals and everyday ways of life.
          </p>
        </div>

        <Button asChild variant="outline" className="rounded-xl shrink-0 self-start sm:self-auto">
          <Link
            to="/stories"
            onClick={() => track("story_topic_opened", { source: "home_header" })}
          >
            <span>Explore All Stories</span>
            <ArrowRight className="ml-1.5 size-4" />
          </Link>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: "all", label: "All Stories" },
          { id: "festival", label: "Festivals" },
          { id: "craft", label: "Crafts" },
          { id: "tradition", label: "Rituals & Traditions" },
          { id: "sacred_place", label: "Sacred Places" },
          { id: "food", label: "Foodways" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              selectedFilter === tab.id
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card border border-border/70 text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 9:16 Vertical Story Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {filteredStories.map((story) => (
          <motion.div
            key={story.id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group relative flex flex-col rounded-2xl overflow-hidden bg-neutral-900 border border-border/60 shadow-calm aspect-[9/16]"
          >
            <Link
              to="/stories"
              onClick={() => track("story_started", { storyId: story.id, source: "home_grid" })}
              className="absolute inset-0 z-10"
              aria-label={story.title}
            >
              <img
                src={story.imageUrl}
                alt={story.title}
                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50" />
            </Link>

            {/* Top Badge: Duration & Category */}
            <div className="relative z-20 flex items-center justify-between p-2.5 pointer-events-none">
              <span className="rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-mono text-white/90">
                {story.duration}
              </span>
              <span className="rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-mono text-saffron uppercase">
                {story.categoryLabel}
              </span>
            </div>

            {/* Center Play Button Icon on Hover */}
            <div className="relative z-20 flex-1 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="size-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-lg">
                <Play className="size-5 ml-0.5 fill-white" />
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-20 p-2.5 sm:p-3 space-y-1 pointer-events-none">
              <div className="flex items-center gap-1 text-[10px] text-white/70 truncate">
                <MapPin className="size-2.5 text-terracotta shrink-0" />
                <span className="truncate">{story.location}</span>
              </div>
              <h3 className="font-serif text-xs sm:text-sm font-semibold text-white line-clamp-2 leading-tight">
                {story.title}
              </h3>
              <p className="text-[10px] text-white/60 font-mono truncate">
                by {story.creatorName}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
