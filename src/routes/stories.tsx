// ==============================================================================
// EKA STORIES: CULTURAL REELS & VISUAL DISCOVERY LAYER
// ==============================================================================
// 1. Full-screen 9:16 Vertical Reels Experience
// 2. Gesture support: Swipe/Scroll up & down, Tap to pause/play
// 3. Cultural Knowledge Graph Connected:
//    STORY → CREATOR → PLACE → CULTURE → KNOWLEDGE → COMMUNITY → MESSAGES
// 4. Culturally contextual, not generic entertainment.
// ==============================================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  MapPin,
  BookOpen,
  HelpCircle,
  Users,
  MessageSquare,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  Plus,
  Compass,
  ArrowRight,
  Heart,
  Lightbulb,
  HandHeart,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { track } from "@/lib/analytics";
import { fetchReels, REACTIONS, recordView, type Reel } from "@/lib/discover";
import { ContextualAskEkaModal } from "@/components/discovery/ContextualAskEkaModal";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Stories — Cultural Reels & Living Knowledge | EKA" },
      {
        name: "description",
        content:
          "Experience the world through vertical cultural reels. 1 billion people, 1 billion stories — preserving living rituals, crafts, festivals, and sacred places.",
      },
      { property: "og:title", content: "EKA Stories — Cultural Reels" },
      {
        property: "og:description",
        content: "Watch, wonder, understand, and connect with living cultural lineages.",
      },
    ],
  }),
  component: StoriesReelsPage,
});

interface CulturalReelItem {
  id: string;
  title: string;
  contextNote: string;
  tradition: string;
  category: "festival" | "craft" | "sacred_place" | "ritual" | "food" | "lineage";
  place: string;
  country: string;
  videoUrl?: string;
  imageUrl: string;
  creator: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    role: string;
    verified: boolean;
  };
  learnSlug: string;
  communitySlug: string;
  curiosityQuestion: string;
  durationSeconds: number;
  reactions: Record<string, number>;
}

// Curated high-fidelity cultural reels representing unbroken lineages
const EDITORIAL_CULTURAL_REELS: CulturalReelItem[] = [
  {
    id: "reel-kashi-aarti",
    title: "The Twilight Fire Offering of Dashashwamedh",
    contextNote:
      "Every evening for over 1,200 continuous years, seven young priests lift 4.5kg brass tiered lamps in synchrony to return light to the Ganges as living gratitude.",
    tradition: "Sanatana Dharma / Vedic Rhythms",
    category: "ritual",
    place: "Varanasi, Uttar Pradesh",
    country: "India",
    imageUrl: "/places/varanasi.jpg",
    creator: {
      id: "creator-ramakrishna",
      name: "Pt. Ramakrishna Shastry",
      handle: "kashi_lineage",
      avatar: "/brand/ad-founder.jpg",
      role: "Eighth-Generation Archaka",
      verified: true,
    },
    learnSlug: "kashi-ganga-aarti",
    communitySlug: "sacred-geography",
    curiosityQuestion: "Why is fire returned back to the river water at sunset?",
    durationSeconds: 45,
    reactions: { appreciate: 1240, respect: 890, learned: 620, inspiring: 430 },
  },
  {
    id: "reel-kyoto-chado",
    title: "Chado: Silence Whispered into Matcha",
    contextNote:
      "In a two-mat tearoom in Kyoto, every movement of the bamboo whisk (chasen) reminds master and guest of 'Ichi-go ichi-e' — this exact moment will never recur.",
    tradition: "Japanese Zen Way of Tea",
    category: "craft",
    place: "Kyoto",
    country: "Japan",
    imageUrl: "/places/kyoto.jpg",
    creator: {
      id: "creator-soukaku",
      name: "Master Sen Soukaku",
      handle: "kyoto_chado",
      avatar: "/content/monastery-corridor.jpg",
      role: "Urasenke Lineage Master",
      verified: true,
    },
    learnSlug: "japanese-tea-ceremony",
    communitySlug: "mindful-living",
    curiosityQuestion: "How does preparing a bowl of powdered tea become silent meditation?",
    durationSeconds: 60,
    reactions: { appreciate: 980, respect: 750, learned: 810, inspiring: 540 },
  },
  {
    id: "reel-oaxaca-altar",
    title: "Golden Marigold Paths for the Returning Spirits",
    contextNote:
      "In Oaxaca, families carpet cobblestone alleys with cempasúchil petals and light copal incense. Rather than grieving loss, death is welcomed home with favorite foods and song.",
    tradition: "Zapotec-Mesoamerican Remembrance",
    category: "festival",
    place: "Oaxaca & Michoacán",
    country: "Mexico",
    imageUrl: "/content/observe.jpg",
    creator: {
      id: "creator-elena",
      name: "Doña Elena Morales",
      handle: "oaxaca_memoria",
      avatar: "/content/today-reflection.jpg",
      role: "Community Elder & Weaver",
      verified: true,
    },
    learnSlug: "dia-de-los-muertos",
    communitySlug: "living-rituals",
    curiosityQuestion: "Why are yellow marigolds believed to guide departed ancestors?",
    durationSeconds: 52,
    reactions: { appreciate: 1430, respect: 910, learned: 740, inspiring: 610 },
  },
  {
    id: "reel-aranmula-mirror",
    title: "Aranmula Kannadi: The Metal That Mirrors Soul",
    contextNote:
      "Cast only by a single family guild in Kerala using an undisclosed alloy of copper and tin, these sacred mirrors produce front-surface reflections without secondary glass refraction.",
    tradition: "Vishwakarma Sacred Metallurgy",
    category: "craft",
    place: "Aranmula, Kerala",
    country: "India",
    imageUrl: "/content/monastery-corridor.jpg",
    creator: {
      id: "creator-sudhakaran",
      name: "K. Sudhakaran Achari",
      handle: "aranmula_guild",
      avatar: "/content/observe.jpg",
      role: "Master Metal Artisan",
      verified: true,
    },
    learnSlug: "aranmula-sacred-mirrors",
    communitySlug: "artisan-guilds",
    curiosityQuestion: "Why is Aranmula metal mirror optical reflection different from ordinary glass?",
    durationSeconds: 58,
    reactions: { appreciate: 860, respect: 1120, learned: 940, inspiring: 480 },
  },
  {
    id: "reel-majuli-masks",
    title: "Majuli Island: The Bamboo Spirit Masks of Samaguri",
    contextNote:
      "Crafted from river silt clay, cow dung, and woven split bamboo, Sattriya monastery performers bring sacred epics to life in the world's largest river island.",
    tradition: "Assamese Sattriya Culture",
    category: "lineage",
    place: "Majuli, Assam",
    country: "India",
    imageUrl: "/content/reading-table.jpg",
    creator: {
      id: "creator-prabin",
      name: "Prabin Goswami",
      handle: "majuli_masks",
      avatar: "/places/kolkata.jpg",
      role: "Sattriya Mask Maker",
      verified: true,
    },
    learnSlug: "majuli-sattra-culture",
    communitySlug: "sacred-geography",
    curiosityQuestion: "How do Assamese masks articulate open jaws and eyes using river reed fibers?",
    durationSeconds: 50,
    reactions: { appreciate: 720, respect: 680, learned: 850, inspiring: 410 },
  },
  {
    id: "reel-fez-tanneries",
    title: "The Thousand-Year Terraces of Chouara",
    contextNote:
      "Leather dyed using wild saffron, cedar bark, and poppy flowers inside stone vats carved in the 11th century, honoring artisanal kinship across Moroccan guilds.",
    tradition: "Maghrebi Guild Heritage",
    category: "craft",
    place: "Fez",
    country: "Morocco",
    imageUrl: "/places/marrakesh.jpg",
    creator: {
      id: "creator-tariq",
      name: "Maâlem Tariq Benjelloun",
      handle: "fez_artisan",
      avatar: "/content/journey.jpg",
      role: "Guild Master",
      verified: true,
    },
    learnSlug: "moroccan-artisan-guilds",
    communitySlug: "artisan-guilds",
    curiosityQuestion: "How do natural mineral and botanical dyes achieve sun-fast vibrant pigments?",
    durationSeconds: 65,
    reactions: { appreciate: 1150, respect: 830, learned: 790, inspiring: 510 },
  },
];

function StoriesReelsPage() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [showPlayPulse, setShowPlayPulse] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch database reels with fallback
  const { data: dbReels } = useQuery({
    queryKey: ["stories-reels-feed"],
    queryFn: () => fetchReels(),
  });

  // Filter reels
  const activeReels = EDITORIAL_CULTURAL_REELS.filter((r) => {
    if (selectedCategory === "all") return true;
    return r.category === selectedCategory;
  });

  const currentReel = activeReels[activeIndex] ?? activeReels[0]!;

  useEffect(() => {
    track("story_started", {
      reelId: currentReel.id,
      title: currentReel.title,
      place: currentReel.place,
    });
  }, [currentReel]);

  const handleNext = useCallback(() => {
    if (activeIndex < activeReels.length - 1) {
      setActiveIndex((prev) => prev + 1);
      track("story_completed", { reelId: currentReel.id });
    }
  }, [activeIndex, activeReels.length, currentReel.id]);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  }, [activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "j") handleNext();
      if (e.key === "ArrowUp" || e.key === "k") handlePrev();
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const togglePlay = () => {
    setIsPlaying((p) => !p);
    setShowPlayPulse(true);
    setTimeout(() => setShowPlayPulse(false), 600);
  };

  const handleReaction = (type: string) => {
    toast.success(`Respect noted: ${type}`);
    track("reel_reaction", { reelId: currentReel.id, type });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentReel.title,
          text: currentReel.contextNote,
          url,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Story link copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col select-none">
      <SiteHeader />

      {/* Main Reels Theater Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center relative py-2 sm:py-4 px-2 sm:px-4">
        {/* Category Filter Pills (Top Floating) */}
        <div className="z-20 mb-3 flex flex-wrap items-center justify-center gap-1.5 max-w-xl mx-auto">
          {[
            { id: "all", label: "All Stories" },
            { id: "ritual", label: "Rituals" },
            { id: "festival", label: "Festivals" },
            { id: "craft", label: "Crafts & Food" },
            { id: "sacred_place", label: "Sacred Places" },
            { id: "lineage", label: "Lineages" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setActiveIndex(0);
                track("story_topic_opened", { category: cat.id });
              }}
              className={`rounded-full px-3 py-1 text-xs font-mono transition-all ${
                selectedCategory === cat.id
                  ? "bg-terracotta text-white font-medium shadow-md shadow-terracotta/30"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 9:16 Vertical Reel Frame */}
        <div
          ref={containerRef}
          className="relative w-full max-w-[420px] aspect-[9/16] rounded-3xl overflow-hidden bg-neutral-900 border border-white/15 shadow-2xl flex flex-col justify-between"
        >
          {/* Reel Visual Media (Background Canvas) */}
          <div
            className="absolute inset-0 w-full h-full cursor-pointer"
            onClick={togglePlay}
          >
            <img
              src={currentReel.imageUrl}
              alt={currentReel.title}
              className={`size-full object-cover transition-transform duration-700 ${
                isPlaying ? "scale-100" : "scale-[1.02] filter brightness-90"
              }`}
            />
            {/* Dark gradient overlay for typography readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />

            {/* Play/Pause Pulse Animation */}
            <AnimatePresence>
              {showPlayPulse && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.4 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                >
                  <div className="size-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                    {isPlaying ? <Play className="size-8 ml-1" /> : <Pause className="size-8" />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Top Bar inside Reel: Location + Mute Button */}
          <div className="relative z-20 flex items-center justify-between p-4">
            <Link
              to="/discover"
              onClick={() =>
                track("story_location_opened", {
                  place: currentReel.place,
                  country: currentReel.country,
                })
              }
              className="inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md px-3 py-1.5 text-xs text-white/90 border border-white/20 hover:bg-black/70 hover:border-white/40 transition-all"
            >
              <MapPin className="size-3.5 text-terracotta shrink-0" />
              <span className="font-medium truncate max-w-[200px]">
                {currentReel.place}, {currentReel.country}
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted((m) => !m)}
                className="size-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90 border border-white/20 hover:bg-black/70 transition-all"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
            </div>
          </div>

          {/* Right Action Rail (Connected Cultural Actions) */}
          <div className="absolute right-3.5 bottom-24 z-20 flex flex-col items-center gap-3.5">
            {/* Respect Reaction */}
            <button
              onClick={() => handleReaction("respect")}
              className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-transform active:scale-90"
              title="Give Respect"
            >
              <div className="size-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 hover:border-terracotta">
                <HandHeart className="size-5 text-saffron" />
              </div>
              <span className="text-[10px] font-mono">
                {currentReel.reactions.respect ?? 890}
              </span>
            </button>

            {/* Learned Reaction */}
            <button
              onClick={() => handleReaction("learned")}
              className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-transform active:scale-90"
              title="Learned Something"
            >
              <div className="size-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 hover:border-emerald-400">
                <Lightbulb className="size-5 text-emerald-400" />
              </div>
              <span className="text-[10px] font-mono">
                {currentReel.reactions.learned ?? 620}
              </span>
            </button>

            {/* Ask EKA Contextual Prompt */}
            <button
              onClick={() => setAskModalOpen(true)}
              className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-transform active:scale-90"
              title="Ask EKA Contextual Question"
            >
              <div className="size-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 hover:border-primary">
                <HelpCircle className="size-5 text-primary" />
              </div>
              <span className="text-[10px] font-mono">Ask</span>
            </button>

            {/* Related Community (Sangha) */}
            <Link
              to="/community"
              className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-transform active:scale-90"
              title="Join Related Community"
            >
              <div className="size-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 hover:border-blue-400">
                <Users className="size-5 text-blue-400" />
              </div>
              <span className="text-[10px] font-mono">Circle</span>
            </Link>

            {/* Direct Messages / Inquire */}
            <Link
              to="/messages"
              className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-transform active:scale-90"
              title="Message Creator / Inquire"
            >
              <div className="size-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 hover:border-purple-400">
                <MessageSquare className="size-5 text-purple-400" />
              </div>
              <span className="text-[10px] font-mono">Message</span>
            </Link>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-transform active:scale-90"
              title="Share Story"
            >
              <div className="size-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Share2 className="size-5 text-white" />
              </div>
              <span className="text-[10px] font-mono">Share</span>
            </button>
          </div>

          {/* Bottom Contextual Story Overlay */}
          <div className="relative z-20 p-4 sm:p-5 pr-14 space-y-2.5">
            {/* Creator Attribution */}
            <div className="flex items-center gap-2.5">
              <img
                src={currentReel.creator.avatar}
                alt={currentReel.creator.name}
                className="size-8 rounded-full border border-white/40 object-cover"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-xs text-white truncate">
                    {currentReel.creator.name}
                  </span>
                  {currentReel.creator.verified && (
                    <ShieldCheck className="size-3 text-saffron shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-white/70 font-mono">
                  {currentReel.creator.role} · @{currentReel.creator.handle}
                </p>
              </div>
            </div>

            {/* Reel Title & Tradition */}
            <div>
              <Badge
                variant="outline"
                className="border-terracotta/60 text-saffron text-[10px] font-mono uppercase tracking-wider mb-1 px-2 py-0 bg-black/40"
              >
                {currentReel.tradition}
              </Badge>
              <h2 className="font-serif text-base sm:text-lg font-bold text-white leading-snug line-clamp-2">
                {currentReel.title}
              </h2>
            </div>

            {/* Cultural Context Note (Not generic entertainment) */}
            <p className="text-xs text-white/85 font-light leading-relaxed line-clamp-3">
              {currentReel.contextNote}
            </p>

            {/* Deep Knowledge Handoff */}
            <div className="pt-1 flex items-center gap-2">
              <Link
                to="/learn"
                className="inline-flex items-center gap-1 text-xs text-saffron hover:underline font-medium"
              >
                <BookOpen className="size-3.5" />
                <span>Understand deeper knowledge</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>

          {/* Progress Timeline Indicator */}
          <div className="relative z-20 h-1 bg-white/20 w-full overflow-hidden">
            <motion.div
              key={currentReel.id}
              initial={{ width: "0%" }}
              animate={{ width: isPlaying ? "100%" : "0%" }}
              transition={{ duration: currentReel.durationSeconds, ease: "linear" }}
              className="h-full bg-gradient-to-r from-terracotta to-saffron"
            />
          </div>
        </div>

        {/* Desktop Up/Down Navigation Controls */}
        <div className="hidden sm:flex flex-col gap-2 mt-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="rounded-full border-white/20 bg-white/5 hover:bg-white/15 text-white text-xs h-9"
            >
              <ChevronUp className="size-4 mr-1" />
              <span>Previous (k)</span>
            </Button>
            <span className="text-xs font-mono text-white/60">
              {activeIndex + 1} / {activeReels.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={activeIndex === activeReels.length - 1}
              className="rounded-full border-white/20 bg-white/5 hover:bg-white/15 text-white text-xs h-9"
            >
              <span>Next (j)</span>
              <ChevronDown className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      </main>

      {/* Contextual Ask EKA Modal */}
      <ContextualAskEkaModal
        open={askModalOpen}
        onOpenChange={setAskModalOpen}
        target={{
          title: currentReel.title,
          location: currentReel.place,
          initialQuestion: currentReel.curiosityQuestion,
          preloadedSummary: currentReel.contextNote,
        }}
      />
    </div>
  );
}
