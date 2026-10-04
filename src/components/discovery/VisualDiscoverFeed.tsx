import React, { useState, useMemo } from "react";
import {
  Sparkles,
  MapPin,
  Compass,
  ArrowRight,
  Heart,
  Bookmark,
  Share2,
  Utensils,
  Plane,
  Flame,
  History,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export interface DiscoverCardItem {
  id: string;
  title: string;
  location: string;
  countryFlag: string;
  wonderQuestion: string;
  summary: string;
  imageUrl: string;
  curiosityCategory: "food" | "travel" | "spirituality" | "history" | "all";
  tag: string;
  saved?: boolean;
}

const DISCOVER_FEED_ITEMS: DiscoverCardItem[] = [
  {
    id: "nyepi-bali",
    title: "Balinese Nyepi",
    location: "Bali, Indonesia",
    countryFlag: "🇮🇩",
    wonderQuestion: "Why does Bali go silent for an entire day?",
    summary:
      "For 24 hours, an entire island shuts down international flights, cars, and lights to reset spiritual balance and cleanse the atmosphere.",
    imageUrl: "/content/hero.jpg",
    curiosityCategory: "spirituality",
    tag: "Day of Silence",
  },
  {
    id: "durga-puja-kolkata",
    title: "Durga Puja",
    location: "Kolkata, India",
    countryFlag: "🇮🇳",
    wonderQuestion: "Why is the Durga idol immersed into water at the end?",
    summary:
      "A celebration of the divine feminine where the clay goddess arrives as a beloved daughter and is returned to the river after 5 days of devotion.",
    imageUrl: "/places/kolkata.jpg",
    curiosityCategory: "spirituality",
    tag: "Sacred Art & Homecoming",
  },
  {
    id: "tea-ceremony-kyoto",
    title: "Japanese Tea Ceremony",
    location: "Kyoto, Japan",
    countryFlag: "🇯🇵",
    wonderQuestion: "Why is tea more than a drink in Japan?",
    summary:
      "Every gesture in preparing matcha is a meditation on presence, seasonal beauty, and the sacred truth that this gathering will happen only once.",
    imageUrl: "/places/kyoto.jpg",
    curiosityCategory: "food",
    tag: "Chanoyu Mindful Tea",
  },
  {
    id: "maasai-heritage",
    title: "Maasai Living Traditions",
    location: "Rift Valley, Kenya & Tanzania",
    countryFlag: "🇰🇪",
    wonderQuestion: "How do Maasai communities preserve their traditions without fences?",
    summary:
      "Living alongside wildlife on the open savannah, guided by oral songs, warrior age-sets, and ancestral elder councils.",
    imageUrl: "/content/journey.jpg",
    curiosityCategory: "travel",
    tag: "Pastoral Lineage",
  },
  {
    id: "maori-haka",
    title: "Māori Culture & Whakapapa",
    location: "Aotearoa New Zealand",
    countryFlag: "🇳🇿",
    wonderQuestion: "What does the haka mean, and how does whakapapa connect all living things?",
    summary:
      "A living worldview where mountains, rivers, and people share an unbroken ancestral genealogy passed down across generations.",
    imageUrl: "/content/monastery-corridor.jpg",
    curiosityCategory: "history",
    tag: "Indigenous Wisdom",
  },
  {
    id: "diwali-lamps",
    title: "Diwali (Festival of Lights)",
    location: "India & Global Diaspora",
    countryFlag: "🇮🇳",
    wonderQuestion: "Why do humans light clay lamps in the dark?",
    summary:
      "Illuminating houses with earthen oil lamps on the darkest autumn night to welcome auspicious grace and awaken inner consciousness.",
    imageUrl: "/content/ritual-lamp.jpg",
    curiosityCategory: "spirituality",
    tag: "Living Flame",
  },
  {
    id: "kashi-ghats-varanasi",
    title: "Dawn on the Ghats of Varanasi",
    location: "Varanasi, India",
    countryFlag: "🇮🇳",
    wonderQuestion: "What should I understand before visiting Varanasi?",
    summary:
      "One of humanity's oldest living cities, where fire offerings at sunrise and cremations along the sacred river Ganga honor the cycle of liberation.",
    imageUrl: "/places/varanasi.jpg",
    curiosityCategory: "travel",
    tag: "Sacred Geography",
  },
  {
    id: "medina-courtyards-marrakesh",
    title: "Moroccan Medina Riads",
    location: "Marrakesh, Morocco",
    countryFlag: "🇲🇦",
    wonderQuestion: "Why are traditional houses windowless to the street but open inside?",
    summary:
      "Ancient bioclimatic courtyards cool desert homes through central fountains and shade, creating tranquil oases within bustling souks.",
    imageUrl: "/places/marrakesh.jpg",
    curiosityCategory: "travel",
    tag: "Courtyard Architecture",
  },
  {
    id: "dia-muertos-oaxaca",
    title: "Día de los Muertos",
    location: "Oaxaca, Mexico",
    countryFlag: "🇲🇽",
    wonderQuestion: "Why do families build multi-tiered altars for the departed?",
    summary:
      "Death is greeted not with dread but with joyful reunion, marigold flower paths, copal incense, and favorite foods shared with returning ancestors.",
    imageUrl: "/content/observe.jpg",
    curiosityCategory: "history",
    tag: "Honoring Ancestors",
  },
  {
    id: "temple-sweets-india",
    title: "Sacred Foodways & Mithai",
    location: "Puri & Pan-India",
    countryFlag: "🇮🇳",
    wonderQuestion: "Why do Indians eat sweets during celebrations and offering?",
    summary:
      "Sweets represent the highest sattvic offering (Prasadam), shared to signify goodwill, harmony, and gratitude across family and neighbors.",
    imageUrl: "/content/practice.jpg",
    curiosityCategory: "food",
    tag: "Sacred Food",
  },
];

interface VisualDiscoverFeedProps {
  onAskEka: (target: {
    title: string;
    location?: string;
    initialQuestion?: string;
    preloadedSummary?: string;
  }) => void;
  className?: string;
}

export function VisualDiscoverFeed({
  onAskEka,
  className = "",
}: VisualDiscoverFeedProps) {
  const [selectedCuriosity, setSelectedCuriosity] = useState<
    "all" | "food" | "travel" | "spirituality" | "history"
  >("all");
  const [savedCards, setSavedCards] = useState<Set<string>>(new Set());

  const handleToggleSave = (id: string, title: string) => {
    setSavedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info(`Removed ${title} from saved wonders.`);
      } else {
        next.add(id);
        toast.success(`Saved ${title} to your curiosities.`);
      }
      return next;
    });
  };

  const filteredItems = useMemo(() => {
    if (selectedCuriosity === "all") return DISCOVER_FEED_ITEMS;
    return DISCOVER_FEED_ITEMS.filter((i) => i.curiosityCategory === selectedCuriosity);
  }, [selectedCuriosity]);

  return (
    <div
      data-testid="visual-discover-feed"
      className={`space-y-8 ${className}`}
    >
      {/* 1. Feed Header & Personal Curiosity Layer */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-terracotta font-semibold flex items-center gap-1.5">
            <Sparkles className="size-3 text-saffron" />
            Visual Discover Feed
          </span>
          <h3 className="font-serif text-2xl sm:text-4xl font-normal text-foreground mt-1">
            See → Wonder → Ask → Understand
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            Don't just scroll the world. Explore questions that reveal why cultures live, celebrate,
            and create the way they do.
          </p>
        </div>

        {/* 5. Personal Curiosity Layer Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCuriosity("all")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all shrink-0 ${
              selectedCuriosity === "all"
                ? "bg-foreground text-background font-semibold"
                : "border border-border/70 bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            All Wonders
          </button>
          <button
            type="button"
            onClick={() => setSelectedCuriosity("food")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCuriosity === "food"
                ? "bg-foreground text-background font-semibold"
                : "border border-border/70 bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            <span>🍛</span>
            <span>Food</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCuriosity("travel")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCuriosity === "travel"
                ? "bg-foreground text-background font-semibold"
                : "border border-border/70 bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            <span>🧭</span>
            <span>Travel</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCuriosity("spirituality")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCuriosity === "spirituality"
                ? "bg-foreground text-background font-semibold"
                : "border border-border/70 bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            <span>🕉️</span>
            <span>Spirituality</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCuriosity("history")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCuriosity === "history"
                ? "bg-foreground text-background font-semibold"
                : "border border-border/70 bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            <span>📜</span>
            <span>History</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Discover Cards Grid (Pinterest x NatGeo style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isSaved = savedCards.has(item.id);

          return (
            <article
              key={item.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card shadow-calm hover:shadow-lift transition-all duration-300"
            >
              {/* Full Image with Overlay */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand/20">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/content/hero.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                  <Badge className="bg-background/85 text-foreground backdrop-blur-md border border-border/60 text-[10px] font-mono uppercase tracking-wider">
                    {item.tag}
                  </Badge>

                  <button
                    type="button"
                    onClick={() => handleToggleSave(item.id, item.title)}
                    className="size-8 rounded-full bg-background/80 backdrop-blur-md border border-border/50 flex items-center justify-center text-foreground hover:text-terracotta transition-colors"
                    aria-label="Save card"
                  >
                    <Bookmark
                      className={`size-3.5 ${isSaved ? "fill-terracotta text-terracotta" : ""}`}
                    />
                  </button>
                </div>

                {/* Bottom Image Caption: Title & Location */}
                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium">
                    <span>{item.countryFlag}</span>
                    <span>{item.location}</span>
                  </div>
                  <h4 className="font-serif text-xl font-normal text-white drop-shadow-sm mt-0.5">
                    {item.title}
                  </h4>
                </div>
              </div>

              {/* Wonder Question & Ask EKA Bottom Section */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <p className="font-serif text-base font-normal text-foreground group-hover:text-primary transition-colors italic leading-snug">
                    "{item.wonderQuestion}"
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* The "Ask EKA about this" CTA */}
                <div className="border-t border-border/60 pt-3 flex items-center justify-between">
                  <Button
                    onClick={() =>
                      onAskEka({
                        title: item.title,
                        location: item.location,
                        initialQuestion: item.wonderQuestion,
                        preloadedSummary: item.summary,
                      })
                    }
                    className="rounded-full text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                  >
                    <Sparkles className="size-3 text-saffron" />
                    <span>Ask EKA about this</span>
                    <ArrowRight className="size-3 ml-auto" />
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
