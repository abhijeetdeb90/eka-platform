// ==============================================================================
// EKA CULTURAL COMMAND PALETTE & SEARCH BAR
// ==============================================================================
// Modal overlay search across living traditions, communities, sacred geography,
// ancestral crafts, stories, and platform navigation.
// Adheres strictly to EKA calm editorial aesthetic and Zero-Pill discipline.
// ==============================================================================

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from "react";
import { useNavigate } from "@tanstack/react-router";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Search,
  Flame,
  Users,
  Landmark,
  Hammer,
  BookOpen,
  Compass,
  Sparkles,
  ArrowRight,
  Clock,
  X,
  CornerDownLeft,
  ChevronRight,
  MapPin,
  ShieldCheck,
  History,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CULTURAL_KNOWLEDGE_CORPUS } from "@/lib/cultural-intelligence/knowledge-corpus";
import { ATLAS_CULTURAL_OBJECTS } from "@/lib/cultural-intelligence/cultural-atlas-data";
import { CANONICAL_KNOWLEDGE_OBJECTS } from "@/lib/knowledge/knowledge-graph";
import { track } from "@/lib/analytics";

// -----------------------------------------------------------------------------
// Types & Categories
// -----------------------------------------------------------------------------
export type SearchFilterType =
  | "all"
  | "tradition"
  | "community"
  | "place"
  | "craft"
  | "story"
  | "navigation";

export interface CulturalSearchItem {
  id: string;
  title: string;
  subTitle?: string;
  category: "tradition" | "community" | "place" | "craft" | "story" | "navigation";
  categoryLabel: string;
  region?: string;
  community?: string;
  lineageYears?: string;
  description: string;
  to: string;
  iconName: "flame" | "users" | "landmark" | "hammer" | "book" | "compass" | "sparkles";
  keywords: string[];
  isVerified?: boolean;
}

// -----------------------------------------------------------------------------
// Pre-indexed Cultural Data Collection
// -----------------------------------------------------------------------------
function buildCanonicalSearchIndex(): CulturalSearchItem[] {
  const items: CulturalSearchItem[] = [];

  // 1. Platform Navigation & Actions
  items.push(
    {
      id: "nav-discover",
      title: "Living Cultural Discoveries",
      subTitle: "Curated regional traditions and verified knowledge cards",
      category: "navigation",
      categoryLabel: "Navigation",
      description: "Browse high-fidelity living traditions and epistemic cards across 6 faith streams.",
      to: "/discover",
      iconName: "compass",
      keywords: ["discover", "explore", "browse", "home", "traditions", "feed"],
    },
    {
      id: "nav-atlas",
      title: "Living Cultural Atlas",
      subTitle: "Sacred geography and living corridor map",
      category: "navigation",
      categoryLabel: "Navigation",
      description: "Interactive global projection connecting temples, shrines, and artisan lineages.",
      to: "/junction",
      iconName: "landmark",
      keywords: ["atlas", "map", "geography", "sacred places", "world", "junction"],
    },
    {
      id: "nav-ask-ai",
      title: "Ask EKA Cultural Intelligence",
      subTitle: "Grounded 5-tier epistemic inquiries with Gemini",
      category: "navigation",
      categoryLabel: "Navigation",
      description: "Inquire deeply into canonical roots, ritual steps, and regional variations.",
      to: "/ask",
      iconName: "sparkles",
      keywords: ["ask", "ai", "gemini", "questions", "epistemic", "scholar"],
    },
    {
      id: "nav-practice",
      title: "Daily Sadhana & Living Rhythms",
      subTitle: "Dawn observations, contemplative practices, and rituals",
      category: "navigation",
      categoryLabel: "Navigation",
      description: "Align your daily cadence with traditional contemplative practices.",
      to: "/practice",
      iconName: "flame",
      keywords: ["practice", "sadhana", "ritual", "meditation", "daily", "dawn"],
    },
    {
      id: "nav-community",
      title: "Community Sanctuaries & Sanghas",
      subTitle: "Living spiritual fellowships and verified lineage keepers",
      category: "navigation",
      categoryLabel: "Navigation",
      description: "Connect with authentic practitioner circles, elder councils, and custodians.",
      to: "/community",
      iconName: "users",
      keywords: ["community", "sangha", "fellowship", "circles", "elders", "custodians"],
    },
    {
      id: "nav-stories",
      title: "Oral Epics & Living Stories",
      subTitle: "Ancestral narratives, origin accounts, and living lore",
      category: "navigation",
      categoryLabel: "Navigation",
      description: "Unbroken oral literature from folklore custodians and master bards.",
      to: "/stories",
      iconName: "book",
      keywords: ["stories", "narratives", "folklore", "oral", "epics", "legends"],
    },
  );

  // 2. Cultural Knowledge Corpus (Corpus Objects)
  for (const obj of CULTURAL_KNOWLEDGE_CORPUS) {
    items.push({
      id: `corpus-${obj.id}`,
      title: obj.title,
      subTitle: obj.curiosityQuestion,
      category: "tradition",
      categoryLabel: "Living Tradition",
      region: obj.region,
      community: obj.who?.custodians || undefined,
      lineageYears: obj.origin?.era || "Centuries unbroken",
      description: obj.summary,
      to: `/knowledge/${obj.slug}`,
      iconName: "flame",
      keywords: [
        obj.title.toLowerCase(),
        obj.slug.toLowerCase(),
        obj.region.toLowerCase(),
        obj.category.toLowerCase(),
        obj.curiosityQuestion.toLowerCase(),
        ...(obj.who?.custodians ? [obj.who.custodians.toLowerCase()] : []),
        ...(obj.origin?.era ? [obj.origin.era.toLowerCase()] : []),
      ],
      isVerified: true,
    });
  }

  // 3. Atlas Cultural Objects (Sacred Places, Crafts, Communities)
  for (const obj of ATLAS_CULTURAL_OBJECTS) {
    const isCraft = obj.category === "crafts";
    const isSacred = obj.category === "sacred_places";
    const isCommunity = obj.category === "local_life";

    const itemCategory = isCraft
      ? "craft"
      : isSacred
        ? "place"
        : isCommunity
          ? "community"
          : "tradition";

    const itemCategoryLabel = isCraft
      ? "Master Craft"
      : isSacred
        ? "Sacred Place"
        : isCommunity
          ? "Community"
          : "Living Tradition";

    const icon = isCraft ? "hammer" : isSacred ? "landmark" : isCommunity ? "users" : "flame";

    items.push({
      id: `atlas-${obj.id}`,
      title: obj.title,
      subTitle: obj.subTitle,
      category: itemCategory,
      categoryLabel: itemCategoryLabel,
      region: `${obj.stateOrDistrict}, ${obj.country}`,
      community: obj.keeper ? `${obj.keeper.name} (${obj.keeper.community})` : undefined,
      lineageYears: obj.livingStatus.unbrokenYears,
      description: obj.oneLiner || obj.storySummary,
      to: `/knowledge/${obj.slug}`,
      iconName: icon,
      keywords: [
        obj.title.toLowerCase(),
        obj.subTitle.toLowerCase(),
        obj.country.toLowerCase(),
        obj.region.toLowerCase(),
        obj.stateOrDistrict.toLowerCase(),
        ...obj.tags.map((t) => t.toLowerCase()),
        obj.curiosityQuestion.toLowerCase(),
      ],
      isVerified: true,
    });
  }

  // 4. Knowledge Graph Canonical Objects (Distinct Traditions, Communities & Festivals)
  for (const obj of CANONICAL_KNOWLEDGE_OBJECTS) {
    // Only add if not already captured
    if (!items.some((i) => i.id.includes(obj.slug))) {
      items.push({
        id: `graph-${obj.slug}`,
        title: obj.entity,
        subTitle: obj.oneLiner,
        category: obj.type === "craft" ? "craft" : obj.type === "place" ? "place" : "tradition",
        categoryLabel:
          obj.type === "craft"
            ? "Master Craft"
            : obj.type === "place"
              ? "Sacred Place"
              : "Living Tradition",
        region: obj.culturalDimensions.identity.regions.join(", "),
        community: obj.culturalDimensions.identity.communities.slice(0, 2).join(", "),
        description: obj.summary.slice(0, 160) + "...",
        to: `/knowledge/${obj.slug}`,
        iconName: obj.type === "craft" ? "hammer" : obj.type === "place" ? "landmark" : "flame",
        keywords: [
          obj.entity.toLowerCase(),
          obj.slug.toLowerCase(),
          ...obj.culturalDimensions.identity.alternativeNames.map((n) => n.toLowerCase()),
          ...obj.culturalDimensions.identity.languages.map((l) => l.toLowerCase()),
          ...obj.culturalDimensions.identity.regions.map((r) => r.toLowerCase()),
          ...obj.culturalDimensions.identity.communities.map((c) => c.toLowerCase()),
        ],
        isVerified: true,
      });
    }
  }

  // 5. Dedicated Living Community Fellowships
  const specificCommunities: CulturalSearchItem[] = [
    {
      id: "comm-majuli-satras",
      title: "Vaishnavite Satras of Majuli",
      subTitle: "Egalitarian river island monastic culture & mask guilds",
      category: "community",
      categoryLabel: "Community",
      region: "Assam, Brahmaputra Basin",
      community: "Sattriya Vaishnava Bhakats & Samaguri Artisans",
      lineageYears: "500+ unbroken years",
      description:
        "Founded by Srimanta Sankaradeva in the 15th century. A living democracy of monastic life, bamboo-clay mask theater (Bhaona), and classical Sattriya dance.",
      to: "/knowledge/majuli-sattra-culture",
      iconName: "users",
      keywords: ["majuli", "satra", "assam", "sankaradeva", "bhaona", "monastery", "bhakat", "mask"],
      isVerified: true,
    },
    {
      id: "comm-bishnoi-keepers",
      title: "Bishnoi Ecological Guardians",
      subTitle: "29 Inviolate Precepts of Sacred Living & Forest Stewardship",
      category: "community",
      categoryLabel: "Community",
      region: "Rajasthan & Thar Desert",
      community: "Bishnoi Dharma Sanstha",
      lineageYears: "540 unbroken years",
      description:
        "Pioneers of ecological martyrdom who sacrificed 363 lives to protect the sacred Khejri trees in Khejarli (1730). Renowned protectors of blackbucks and arid fauna.",
      to: "/knowledge/bishnoi-ecology",
      iconName: "users",
      keywords: ["bishnoi", "khejarli", "trees", "ecology", "rajasthan", "blackbuck", "guru jambheshwar"],
      isVerified: true,
    },
    {
      id: "comm-kumartuli-guild",
      title: "Kumartuli Clay Sculptor Guilds",
      subTitle: "Hereditary potters sculpting the sacred earth into deities",
      category: "community",
      categoryLabel: "Community",
      region: "Kolkata, West Bengal",
      community: "Kumartuli Mritsilpi Samiti (Pal & Chitrakar Lineages)",
      lineageYears: "300+ unbroken years",
      description:
        "Artisans along the Hooghly river who transform sacred alluvial silt, bamboo frames, and straw into the transcendent idols of Durga Puja.",
      to: "/knowledge/durga-puja-bengal-distinct-tradition",
      iconName: "users",
      keywords: ["kumartuli", "sculptor", "kolkata", "clay", "potter", "durga", "idols"],
      isVerified: true,
    },
    {
      id: "comm-patan-salvi",
      title: "Salvi Master Weavers of Patan",
      subTitle: "Double Ikat silk heritage preserved by three living families",
      category: "community",
      categoryLabel: "Community",
      region: "Patan, Gujarat",
      community: "Salvi Silk Guild",
      lineageYears: "900 unbroken years",
      description:
        "Master weavers creating the geometrically flawless Patan Patola, where warp and weft are individually dyed with botanical extracts prior to weaving.",
      to: "/knowledge/patan-patola",
      iconName: "users",
      keywords: ["patan", "patola", "salvi", "ikat", "silk", "weaving", "gujarat"],
      isVerified: true,
    },
    {
      id: "comm-sufi-qawwals",
      title: "Dargah Qawwali Custodians",
      subTitle: "Chishti lineage devotional singers of Hazrat Nizamuddin & Ajmer",
      category: "community",
      categoryLabel: "Community",
      region: "Delhi & Ajmer, India",
      community: "Nizami & Warsi Qawwal Lineages",
      lineageYears: "750 unbroken years",
      description:
        "Sufi vocal masters tracing their musical and spiritual transmission directly to Amir Khusrau and Hazrat Nizamuddin Auliya.",
      to: "/knowledge/sufi-qawwali-tradition",
      iconName: "users",
      keywords: ["qawwali", "sufi", "chishti", "nizamuddin", "ajmer", "khusrau", "sama"],
      isVerified: true,
    },
    {
      id: "comm-baul-mystics",
      title: "Baul & Fakir Wandering Mystics",
      subTitle: "Non-sectarian song bards of the human temple",
      category: "community",
      categoryLabel: "Community",
      region: "Birbhum & Nadia, Bengal",
      community: "Baul Sadhakas",
      lineageYears: "600 unbroken years",
      description:
        "UNESCO Intangible Heritage custodians who reject temple rituals, mosques, and caste divisions, seeking the 'Moner Manush' (Person of the Heart) through the Ektara.",
      to: "/knowledge/baul-mystic-songs",
      iconName: "users",
      keywords: ["baul", "lalon", "ektara", "bengal", "fakir", "mystic", "songs"],
      isVerified: true,
    },
  ];

  for (const c of specificCommunities) {
    if (!items.some((i) => i.id === c.id)) {
      items.push(c);
    }
  }

  // 6. Popular Inquiries / Stories
  const inquiries: CulturalSearchItem[] = [
    {
      id: "inq-durga-puja",
      title: "Why Bengalis celebrate Durga Puja differently from the rest of India",
      subTitle: "Uma as the beloved daughter rather than a distant warrior deity",
      category: "story",
      categoryLabel: "Cultural Inquiry",
      region: "Bengal",
      description:
        "Shakta theology humanizes the cosmic mother as returning home for four joyful days with her children, celebrated through egalitarian neighborhood pandals.",
      to: "/knowledge/durga-puja-bengal-distinct-tradition",
      iconName: "book",
      keywords: ["durga puja", "bengal", "uma", "navratri", "why", "pandal", "kolkata"],
      isVerified: true,
    },
    {
      id: "inq-aranmula-mirror",
      title: "Why the Aranmula Mirror contains no silver or glass",
      subTitle: "Secret bell-metal alloy casting without front-surface refraction",
      category: "craft",
      categoryLabel: "Master Craft",
      region: "Kerala, Aranmula",
      community: "Viswakarma Metal Craftsmen",
      lineageYears: "500 unbroken years",
      description:
        "Cast from a sacred copper-tin alloy that eliminates secondary optical reflections, crafted by a single familial guild in Kerala.",
      to: "/knowledge/aranmula-kannadi",
      iconName: "hammer",
      keywords: ["aranmula", "mirror", "kannadi", "kerala", "metal", "alloy", "craft"],
      isVerified: true,
    },
    {
      id: "inq-ganga-aarti",
      title: "The Sacred Geometry of Varanasi Evening Ganga Aarti",
      subTitle: "Brass multi-tiered lamps and synchronized Vedic chanting at Dashashwamedh Ghat",
      category: "place",
      categoryLabel: "Sacred Place",
      region: "Varanasi, Uttar Pradesh",
      lineageYears: "Ancient continuous continuity",
      description:
        "Every twilight, young priests perform the elaborate offering of fire, conch shells, and incense to the river Ganga, invoking cosmic harmony.",
      to: "/knowledge/varanasi-ganga-aarti",
      iconName: "landmark",
      keywords: ["varanasi", "kashi", "ganga aarti", "dashashwamedh", "river", "ghat", "fire"],
      isVerified: true,
    },
  ];

  for (const inq of inquiries) {
    if (!items.some((i) => i.id === inq.id)) {
      items.push(inq);
    }
  }

  return items;
}

// -----------------------------------------------------------------------------
// Global Context & Hook for Command Palette
// -----------------------------------------------------------------------------
interface CommandPaletteContextType {
  isOpen: boolean;
  openPalette: (initialFilter?: SearchFilterType, initialQuery?: string) => void;
  closePalette: () => void;
  togglePalette: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextType | null>(null);

export function useCulturalCommandPalette() {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error(
      "useCulturalCommandPalette must be used within a CulturalCommandPaletteProvider",
    );
  }
  return context;
}

// -----------------------------------------------------------------------------
// Provider Component
// -----------------------------------------------------------------------------
export function CulturalCommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<SearchFilterType>("all");
  const [query, setQuery] = useState("");

  const openPalette = useCallback((filter: SearchFilterType = "all", initialQuery = "") => {
    setActiveFilter(filter);
    setQuery(initialQuery);
    setIsOpen(true);
    track("search_command_palette_opened", { initialFilter: filter });
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
  }, []);

  const togglePalette = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K, or pressing "/" when not typing)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Quick slash "/" shortcut when not focused on an input/textarea
      if (
        e.key === "/" &&
        !isOpen &&
        !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName) &&
        !(e.target as HTMLElement)?.isContentEditable
      ) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <CommandPaletteContext.Provider
      value={{
        isOpen,
        openPalette,
        closePalette,
        togglePalette,
      }}
    >
      {children}
      <CulturalCommandPaletteModal
        isOpen={isOpen}
        onClose={closePalette}
        initialFilter={activeFilter}
        initialQuery={query}
      />
    </CommandPaletteContext.Provider>
  );
}

// -----------------------------------------------------------------------------
// Modal Dialog Implementation
// -----------------------------------------------------------------------------
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilter?: SearchFilterType;
  initialQuery?: string;
}

const RECENT_SEARCHES_KEY = "eka_recent_cultural_searches";
const MAX_RECENT_SEARCHES = 5;

function CulturalCommandPaletteModal({
  isOpen,
  onClose,
  initialFilter = "all",
  initialQuery = "",
}: ModalProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedFilter, setSelectedFilter] = useState<SearchFilterType>(initialFilter);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load indexed canonical items
  const allItems = useMemo(() => buildCanonicalSearchIndex(), []);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // gracefully ignore storage read errors
    }
  }, [isOpen]);

  const saveRecentSearch = useCallback(
    (term: string) => {
      const cleaned = term.trim();
      if (!cleaned) return;
      try {
        setRecentSearches((prev) => {
          const updated = [
            cleaned,
            ...prev.filter((s) => s.toLowerCase() !== cleaned.toLowerCase()),
          ].slice(0, MAX_RECENT_SEARCHES);
          localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
          return updated;
        });
      } catch {
        // gracefully ignore
      }
    },
    [],
  );

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // gracefully ignore
    }
  };

  // Sync initial query when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialQuery);
      setSelectedFilter(initialFilter);
      setSelectedIndex(0);
    }
  }, [isOpen, initialQuery, initialFilter]);

  // Filter items based on active query and selected category tab
  const filteredItems = useMemo(() => {
    const queryNormalized = searchQuery.trim().toLowerCase();

    return allItems.filter((item) => {
      // Category filter match
      if (selectedFilter !== "all" && item.category !== selectedFilter) {
        return false;
      }

      // Empty query shows all or popular items in that category
      if (!queryNormalized) {
        return true;
      }

      // Match title, subTitle, region, community, description, or keywords
      const titleMatch = item.title.toLowerCase().includes(queryNormalized);
      const subTitleMatch = item.subTitle?.toLowerCase().includes(queryNormalized);
      const regionMatch = item.region?.toLowerCase().includes(queryNormalized);
      const communityMatch = item.community?.toLowerCase().includes(queryNormalized);
      const descMatch = item.description.toLowerCase().includes(queryNormalized);
      const keywordMatch = item.keywords.some((k) => k.includes(queryNormalized));

      return (
        titleMatch ||
        subTitleMatch ||
        regionMatch ||
        communityMatch ||
        descMatch ||
        keywordMatch
      );
    });
  }, [allItems, searchQuery, selectedFilter]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, selectedFilter]);

  // Handle item navigation
  const handleSelectItem = useCallback(
    (item: CulturalSearchItem) => {
      if (searchQuery.trim()) {
        saveRecentSearch(searchQuery.trim());
      }
      track("search_item_selected", {
        itemId: item.id,
        category: item.category,
        query: searchQuery,
      });
      onClose();
      navigate({ to: item.to });
    },
    [navigate, onClose, searchQuery, saveRecentSearch],
  );

  // Keyboard navigation inside list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length === 0 ? 0 : (prev + 1) % filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredItems.length === 0 ? 0 : (prev - 1 + filteredItems.length) % filteredItems.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const current = filteredItems[selectedIndex];
      if (current) {
        handleSelectItem(current);
      } else if (searchQuery.trim()) {
        // Direct search fallback to Ask EKA
        onClose();
        navigate({ to: "/search", search: { q: searchQuery.trim() } });
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        {/* Backdrop overlay */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/70 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />

        {/* Modal Window */}
        <DialogPrimitive.Content
          onKeyDown={handleKeyDown}
          className="fixed left-[50%] top-[12%] z-50 w-full max-w-2xl translate-x-[-50%] rounded-2xl border border-border/80 bg-card p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-98 data-[state=open]:zoom-in-98 focus:outline-hidden overflow-hidden"
          aria-label="Cultural Knowledge & Community Search"
        >
          {/* Top Search Input Bar */}
          <div className="relative flex items-center border-b border-border/70 px-4 py-3 sm:py-3.5 bg-background/50">
            <Search className="size-5 shrink-0 text-muted-foreground mr-3" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search living traditions, communities, sacred geography, crafts..."
              className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground/80 focus:outline-hidden font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="size-6 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors mr-2 cursor-pointer"
                title="Clear query"
              >
                <X className="size-3.5" />
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-[11px] text-muted-foreground font-mono bg-accent/40 px-2 py-0.5 rounded-md border border-border/50">
              <span>ESC</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="sm:hidden size-7 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Interactive Filter Segmented Bar (Zero-Pill Discipline: functional buttons) */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-border/40 bg-accent/20 overflow-x-auto scrollbar-none">
            <FilterTab
              active={selectedFilter === "all"}
              onClick={() => setSelectedFilter("all")}
              label="All"
            />
            <FilterTab
              active={selectedFilter === "tradition"}
              onClick={() => setSelectedFilter("tradition")}
              label="Traditions"
            />
            <FilterTab
              active={selectedFilter === "community"}
              onClick={() => setSelectedFilter("community")}
              label="Communities"
            />
            <FilterTab
              active={selectedFilter === "place"}
              onClick={() => setSelectedFilter("place")}
              label="Sacred Places"
            />
            <FilterTab
              active={selectedFilter === "craft"}
              onClick={() => setSelectedFilter("craft")}
              label="Master Crafts"
            />
            <FilterTab
              active={selectedFilter === "story"}
              onClick={() => setSelectedFilter("story")}
              label="Stories & Inquiries"
            />
          </div>

          {/* Recent Searches (Shown when query is empty and history exists) */}
          {!searchQuery && recentSearches.length > 0 && (
            <div className="px-4 py-2.5 border-b border-border/40 bg-accent/10 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
                <span className="text-muted-foreground shrink-0 flex items-center gap-1 font-medium">
                  <History className="size-3 text-muted-foreground" />
                  Recent:
                </span>
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchQuery(term)}
                    className="shrink-0 text-foreground/90 hover:text-foreground transition-colors hover:underline cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={clearRecentSearches}
                className="text-[11px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                title="Clear recent searches"
              >
                <Trash2 className="size-3" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          )}

          {/* Results List */}
          <div className="max-h-[380px] sm:max-h-[440px] overflow-y-auto p-2 divide-y divide-border/20">
            {filteredItems.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <div className="mx-auto size-12 rounded-full bg-accent/40 flex items-center justify-center text-muted-foreground mb-3">
                  <Compass className="size-6 text-muted-foreground" />
                </div>
                <h4 className="font-display text-base font-medium text-foreground">
                  No cultural records found
                </h4>
                <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                  We couldn't find an exact match for &ldquo;{searchQuery}&rdquo;. Try searching by tradition, region, craft, or community.
                </p>

                {searchQuery.trim() && (
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate({
                          to: "/ask",
                          search: { q: searchQuery.trim() },
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
                    >
                      <Sparkles className="size-3.5" />
                      <span>Ask EKA AI about &ldquo;{searchQuery}&rdquo;</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate({
                          to: "/search",
                          search: { q: searchQuery.trim() },
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border border-input bg-card text-foreground hover:bg-accent transition-colors cursor-pointer"
                    >
                      <Search className="size-3.5" />
                      <span>Full Multilingual Search</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 cursor-pointer group",
                      isSelected
                        ? "bg-accent/70 text-accent-foreground shadow-xs"
                        : "hover:bg-accent/40 text-foreground",
                    )}
                  >
                    {/* Item Type Icon */}
                    <div
                      className={cn(
                        "size-9 rounded-lg flex items-center justify-center shrink-0 transition-colors mt-0.5",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent/60 text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      <ResultIcon iconName={item.iconName} />
                    </div>

                    {/* Content Details */}
                    <div className="min-w-0 flex-1">
                      {/* Quiet Unboxed Metadata (Zero-Pill Discipline) */}
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-0.5 font-medium tracking-wide">
                        <span className="uppercase text-terracotta tracking-wider">
                          {item.categoryLabel}
                        </span>
                        {item.region && (
                          <>
                            <span aria-hidden="true" className="opacity-40">·</span>
                            <span className="truncate">{item.region}</span>
                          </>
                        )}
                        {item.lineageYears && (
                          <>
                            <span aria-hidden="true" className="opacity-40">·</span>
                            <span className="shrink-0">{item.lineageYears}</span>
                          </>
                        )}
                        {item.isVerified && (
                          <>
                            <span aria-hidden="true" className="opacity-40">·</span>
                            <span className="text-forest inline-flex items-center gap-0.5 shrink-0">
                              <ShieldCheck className="size-3 inline" /> Verified
                            </span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="font-display text-sm font-medium text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>

                      {/* Subtitle / Question */}
                      {item.subTitle && item.subTitle !== item.title && (
                        <p className="text-xs text-muted-foreground/90 font-light line-clamp-1 mt-0.5">
                          {item.subTitle}
                        </p>
                      )}

                      {/* Description excerpt */}
                      <p className="text-xs text-muted-foreground/75 line-clamp-1 mt-0.5 font-sans">
                        {item.description}
                      </p>
                    </div>

                    {/* Arrow / Selection Indicator */}
                    <div className="shrink-0 self-center pl-2 text-muted-foreground/60 group-hover:text-foreground transition-colors">
                      <ChevronRight className="size-4" />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="border-t border-border/60 bg-muted/30 px-4 py-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 font-mono">
                <span className="bg-background border border-border/80 px-1 rounded text-[10px]">↑</span>
                <span className="bg-background border border-border/80 px-1 rounded text-[10px]">↓</span>
                Navigate
              </span>
              <span className="inline-flex items-center gap-1 font-mono">
                <span className="bg-background border border-border/80 px-1 rounded text-[10px]">↵</span>
                Select
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">
                {filteredItems.length} cultural {filteredItems.length === 1 ? "entry" : "entries"}
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate({ to: "/search" });
                }}
                className="text-terracotta hover:underline font-medium ml-2 cursor-pointer"
              >
                Advanced Search
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// -----------------------------------------------------------------------------
// Interactive Filter Tab (Segmented Control Button)
// -----------------------------------------------------------------------------
function FilterTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 text-xs font-medium rounded-lg transition-all shrink-0 cursor-pointer",
        active
          ? "bg-card text-foreground shadow-xs border border-border/70"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/40",
      )}
    >
      {label}
    </button>
  );
}

// -----------------------------------------------------------------------------
// Helper Icon Resolver
// -----------------------------------------------------------------------------
function ResultIcon({ iconName }: { iconName: CulturalSearchItem["iconName"] }) {
  switch (iconName) {
    case "flame":
      return <Flame className="size-4 text-terracotta" />;
    case "users":
      return <Users className="size-4 text-forest" />;
    case "landmark":
      return <Landmark className="size-4 text-saffron" />;
    case "hammer":
      return <Hammer className="size-4 text-indigo-ink" />;
    case "book":
      return <BookOpen className="size-4 text-muted-foreground" />;
    case "sparkles":
      return <Sparkles className="size-4 text-saffron" />;
    case "compass":
    default:
      return <Compass className="size-4 text-foreground" />;
  }
}

// -----------------------------------------------------------------------------
// Embeddable Search Bar Component (Trigger for the Command Palette)
// -----------------------------------------------------------------------------
export interface CulturalSearchBarProps {
  className?: string;
  placeholder?: string;
  variant?: "header" | "hero" | "compact";
  category?: SearchFilterType;
}

export function CulturalSearchBar({
  className,
  placeholder = "Search living traditions, communities, crafts...",
  variant = "header",
  category = "all",
}: CulturalSearchBarProps) {
  const { openPalette } = useCulturalCommandPalette();

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => openPalette(category)}
        className={cn(
          "flex items-center justify-center size-8.5 rounded-full text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground border border-transparent hover:border-border/60 cursor-pointer",
          className,
        )}
        aria-label="Search traditions and communities (⌘K)"
        title="Search (⌘K)"
      >
        <Search className="size-4" />
      </button>
    );
  }

  if (variant === "hero") {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => openPalette(category)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPalette(category);
          }
        }}
        className={cn(
          "group relative flex w-full max-w-xl items-center rounded-2xl border border-border/80 bg-card/90 px-4 py-3.5 shadow-calm backdrop-blur-md transition-all hover:border-border hover:shadow-lift cursor-pointer",
          className,
        )}
      >
        <Search className="size-5 shrink-0 text-muted-foreground mr-3 transition-colors group-hover:text-primary" />
        <span className="flex-1 text-sm text-muted-foreground font-light text-left truncate">
          {placeholder}
        </span>
        <div className="flex items-center gap-1 shrink-0 text-xs text-muted-foreground font-mono bg-accent/40 border border-border/60 px-2 py-0.5 rounded-lg">
          <span className="text-[10px]">⌘</span>
          <span>K</span>
        </div>
      </div>
    );
  }

  // Header variant (default)
  return (
    <button
      type="button"
      onClick={() => openPalette(category)}
      className={cn(
        "group flex items-center gap-2 rounded-xl border border-border/60 bg-accent/20 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-border hover:bg-accent/40 hover:text-foreground cursor-pointer max-w-[220px] sm:max-w-[280px]",
        className,
      )}
      aria-label="Open search palette (⌘K)"
    >
      <Search className="size-3.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
      <span className="truncate text-left font-light">Search traditions...</span>
      <kbd className="ml-auto hidden md:inline-flex items-center gap-0.5 rounded border border-border/80 bg-background/80 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
        <span className="text-[9px]">⌘</span>K
      </kbd>
    </button>
  );
}
