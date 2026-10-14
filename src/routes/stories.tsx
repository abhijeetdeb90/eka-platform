// ==============================================================================
// EKA STORIES: VISUAL-FIRST STORYTELLING DESTINATION
// ==============================================================================
// Specification: Sections 3, 4, 5, 6
// 1. Stories is EKA's visual storytelling destination (NOT a text blog list).
// 2. Supports:
//    - REELS (9:16 vertical cards + immersive reel theater modal)
//    - CAROUSELS (multi-slide visual cards with slide counter)
//    - STATIC VISUAL STORIES (editorial image, short title, 1-2 lines context)
//    - HIGHLIGHTS (horizontal circular visual collections at top)
// 3. Short Editorial Cards for Knowledge/Articles ("Why do people light diyas?", etc.)
// 4. Mobile-first, scannable, visual cards with Save, Share, Follow actions.
// ==============================================================================

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  MapPin,
  BookOpen,
  HelpCircle,
  Users,
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
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Layers,
  Filter,
  Eye,
  X,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { track } from "@/lib/analytics";
import {
  StoryCard,
  ReelCard,
  CarouselCard,
  StaticStoryCard,
  FeaturedStoryCard,
  HighlightCard,
  ShortEditorialCard,
} from "@/components/cards/StoryCard";
import { ContextualAskEkaModal } from "@/components/discovery/ContextualAskEkaModal";
import { cn } from "@/lib/utils";
import { MetaTags } from "@/components/seo";
import { EkaBreadcrumb } from "@/components/navigation";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Stories — Visual Cultural Stories & Living Lineages | EKA" },
      {
        name: "description",
        content:
          "Watch, wonder, understand, and connect with living cultural lineages. Visual reels, carousels, highlights, and short editorial stories across 1 billion people.",
      },
      { property: "og:title", content: "EKA Stories — Visual Cultural Destination" },
      {
        property: "og:description",
        content:
          "1 billion people, 1 billion stories. Experience living rituals, crafts, foodways, and sacred places.",
      },
      { property: "og:image", content: "/brand/eka-banner.jpg" },
    ],
  }),
  component: EkaStoriesPage,
});

// -----------------------------------------------------------------------------
// 1. HIGHLIGHT COLLECTIONS DATA (Section 4)
// -----------------------------------------------------------------------------
interface HighlightSequence {
  id: string;
  title: string;
  coverImage: string;
  storyCount: number;
  slides: {
    id: string;
    title: string;
    location: string;
    caption: string;
    imageUrl: string;
    custodian: string;
    askPrompt: string;
  }[];
}

const HIGHLIGHT_COLLECTIONS: HighlightSequence[] = [
  {
    id: "diwali",
    title: "Diwali",
    coverImage: "/content/ritual-lamp.jpg",
    storyCount: 4,
    slides: [
      {
        id: "d-1",
        title: "The Awakening of Inner Jyoti",
        location: "Ayodhya & Varanasi, India",
        caption: "Clay diyas lit with mustard oil to signify the return of light and knowledge over darkness.",
        imageUrl: "/content/ritual-lamp.jpg",
        custodian: "Vedic Temple Custodians",
        askPrompt: "Why do people light clay diyas during Diwali?",
      },
      {
        id: "d-2",
        title: "Kumartuli: Mud, Straw & Reverence",
        location: "Kolkata, India",
        caption: "Potter guilds shaping Ganga clay on wooden wheels before the festive dawn.",
        imageUrl: "/places/kolkata.jpg",
        custodian: "Kumartuli Potter Artisans",
        askPrompt: "How are sacred clay deities created sustainably in Kumartuli?",
      },
      {
        id: "d-3",
        title: "Rangoli: Ephemeral Welcomes",
        location: "Tamil Nadu, India",
        caption: "Geometric Kolam patterns drawn with rice flour at dawn to feed ants and invite auspicious presence.",
        imageUrl: "/content/observe.jpg",
        custodian: "Generational Matriarchs",
        askPrompt: "What is the spiritual meaning behind drawing Kolam at sunrise?",
      },
    ],
  },
  {
    id: "india",
    title: "India",
    coverImage: "/places/varanasi.jpg",
    storyCount: 5,
    slides: [
      {
        id: "in-1",
        title: "The 1,200-Year Twilight Flame",
        location: "Dashashwamedh Ghat, Varanasi",
        caption: "Seven tiered brass lamps returning fire to the holy river at the exact junction of dusk.",
        imageUrl: "/places/varanasi.jpg",
        custodian: "Ganga Seva Nidhi Priests",
        askPrompt: "Why is Varanasi sacred across millennia?",
      },
      {
        id: "in-2",
        title: "Majuli Island: Bamboo Spirit Masks",
        location: "Brahmaputra River, Assam",
        caption: "Living theatrical masks crafted from river silt and bamboo reeds in 500-year-old satras.",
        imageUrl: "/brand/eka-banner-sunset.jpg",
        custodian: "Samaguri Satra Mask Guild",
        askPrompt: "What is the tradition of Sattriya monastery culture in Majuli?",
      },
    ],
  },
  {
    id: "sacred-places",
    title: "Sacred Places",
    coverImage: "/places/kyoto.jpg",
    storyCount: 6,
    slides: [
      {
        id: "sp-1",
        title: "Torii Gate Alleys of Inari",
        location: "Kyoto, Japan",
        caption: "Over 10,000 vermilion torii gates winding up Mount Inari, marking the boundary into sacred realm.",
        imageUrl: "/places/kyoto.jpg",
        custodian: "Shinto Shrine Stewards",
        askPrompt: "What is the spiritual boundary marked by a Torii gate?",
      },
      {
        id: "sp-2",
        title: "The Stone Terraces of Chouara",
        location: "Fez Medina, Morocco",
        caption: "A 1,000-year-old artisanal guild preserving natural botanical dye pits in ancient stone.",
        imageUrl: "/places/marrakesh.jpg",
        custodian: "Chouara Artisan Guild",
        askPrompt: "How do artisans in Fez use natural botanicals to dye textiles?",
      },
    ],
  },
  {
    id: "foodways",
    title: "Foodways",
    coverImage: "/content/reading-table.jpg",
    storyCount: 4,
    slides: [
      {
        id: "fw-1",
        title: "The Fermented Hearth of Tingmo",
        location: "Dharamshala & Ladakh, India",
        caption: "Wild yeast sourdough steamed in tiered bamboo baskets to sustain mountain monks during winter meditation.",
        imageUrl: "/content/reading-table.jpg",
        custodian: "Tibetan Hearth Custodians",
        askPrompt: "How did Tibetan foodways evolve for high-altitude monastic life?",
      },
      {
        id: "fw-2",
        title: "Mole Negro: The 30-Spice Harmony",
        location: "Oaxaca, Mexico",
        caption: "Roasted chiles, cacao, and toasted pumpkin seeds simmered over ocote wood embers for three days.",
        imageUrl: "/content/journey.jpg",
        custodian: "Zapotec Traditional Cooks",
        askPrompt: "What is the cultural history of ceremonial Mole in Oaxaca?",
      },
    ],
  },
  {
    id: "crafts",
    title: "Crafts",
    coverImage: "/content/monastery-corridor.jpg",
    storyCount: 5,
    slides: [
      {
        id: "cr-1",
        title: "Aranmula Kannadi: The Mirror of Soul",
        location: "Kerala, India",
        caption: "Cast only by one family guild using a secret bronze alloy with zero glass refraction.",
        imageUrl: "/content/monastery-corridor.jpg",
        custodian: "Aranmula Metal Mirror Heritage (GI Tagged)",
        askPrompt: "Why does the Aranmula metal mirror reflect without glass refraction?",
      },
      {
        id: "cr-2",
        title: "Kintsugi: Gold in the Fractures",
        location: "Kanazawa, Japan",
        caption: "Mending shattered ceramics with golden lacquer, honoring imperfection as sacred history.",
        imageUrl: "/places/kyoto.jpg",
        custodian: "Urushi Lacquer Masters",
        askPrompt: "What philosophy underpins the Japanese art of Kintsugi?",
      },
    ],
  },
  {
    id: "festivals",
    title: "Festivals",
    coverImage: "/places/kolkata.jpg",
    storyCount: 7,
    slides: [
      {
        id: "fe-1",
        title: "Uma's Homecoming in Autumn",
        location: "Kolkata, West Bengal",
        caption: "Neighborhoods transformed into open-air museum installations for Durga Puja.",
        imageUrl: "/places/kolkata.jpg",
        custodian: "Kolkata Cultural Trusts",
        askPrompt: "Why do Bengalis celebrate Durga Puja differently from other Indian festivals?",
      },
      {
        id: "fe-2",
        title: "Marigold Trails of Remembrance",
        location: "Oaxaca & Michoacán, Mexico",
        caption: "Lighting copal incense and scattering yellow petals to welcome ancestors home.",
        imageUrl: "/content/observe.jpg",
        custodian: "Oaxaca Community Elders",
        askPrompt: "Why are yellow marigolds used during Día de los Muertos?",
      },
    ],
  },
  {
    id: "women-culture",
    title: "Women & Culture",
    coverImage: "/content/practice.jpg",
    storyCount: 4,
    slides: [
      {
        id: "wc-1",
        title: "Mithila Matrilineal Wall Murals",
        location: "Madhubani, Bihar",
        caption: "Mothers teaching daughters cosmic deities painted with bamboo twigs and natural mineral pigments.",
        imageUrl: "/content/practice.jpg",
        custodian: "Mithila Women Collective",
        askPrompt: "How is Mithila painting passed down matrilineally?",
      },
      {
        id: "wc-2",
        title: "Berber Rugs: Woven Matrilineal Codes",
        location: "High Atlas Mountains, Morocco",
        caption: "Geometric symbols encoded directly on the loom representing female lineage, fertility, and cosmic protection.",
        imageUrl: "/places/marrakesh.jpg",
        custodian: "Beni Ourain Women Weavers",
        askPrompt: "How do Berber women encode family histories in woven rugs?",
      },
    ],
  },
  {
    id: "living-traditions",
    title: "Living Traditions",
    coverImage: "/content/today-reflection.jpg",
    storyCount: 5,
    slides: [
      {
        id: "lt-1",
        title: "Bhoota Kola: Spirit Oracles",
        location: "Tulu Nadu, Coastal Karnataka",
        caption: "Performers entering trances to voice ancestral justice, mediated with areca nut offerings.",
        imageUrl: "/content/today-reflection.jpg",
        custodian: "Daivaradhane Lineage Keepers",
        askPrompt: "What is Bhoota Kola and how does it function as living justice?",
      },
      {
        id: "lt-2",
        title: "Whirling Dervishes of Konya",
        location: "Konya, Turkey",
        caption: "Turning counterclockwise with open palms to bridge divine love into the earthly world.",
        imageUrl: "/content/monastery-corridor.jpg",
        custodian: "Mevlevi Sufi Order",
        askPrompt: "What is the symbolic meaning of the Sema Whirling ceremony?",
      },
    ],
  },
  {
    id: "asia",
    title: "Asia",
    coverImage: "/places/kyoto.jpg",
    storyCount: 8,
    slides: [
      {
        id: "as-1",
        title: "The Whispered Way of Chado",
        location: "Kyoto, Japan",
        caption: "Preparing powdered green tea with bamboo whisks inside quiet tatami rooms.",
        imageUrl: "/places/kyoto.jpg",
        custodian: "Urasenke Chado Heritage",
        askPrompt: "What is the philosophical core of the Japanese tea ceremony?",
      },
    ],
  },
  {
    id: "africa",
    title: "Africa",
    coverImage: "/places/marrakesh.jpg",
    storyCount: 4,
    slides: [
      {
        id: "af-1",
        title: "Terraces of Chouara",
        location: "Fez, Morocco",
        caption: "Thousand-year guild stone vats dyed with saffron, cedar, and poppy flowers.",
        imageUrl: "/places/marrakesh.jpg",
        custodian: "Chouara Artisan Guild Heritage",
        askPrompt: "How do artisanal guilds operate in Fez?",
      },
    ],
  },
  {
    id: "latin-america",
    title: "Latin America",
    coverImage: "/content/observe.jpg",
    storyCount: 5,
    slides: [
      {
        id: "la-1",
        title: "Golden Petals of Oaxaca",
        location: "Oaxaca, Mexico",
        caption: "Carpeted alleys with cempasúchil petals welcoming returning departed souls.",
        imageUrl: "/content/observe.jpg",
        custodian: "Oaxaca Community Tradition",
        askPrompt: "What does death signify in Mesoamerican cultural traditions?",
      },
    ],
  },
];

// -----------------------------------------------------------------------------
// 2. REELS DATA (9:16 Visual Reels — Section 5.A)
// -----------------------------------------------------------------------------
interface ReelItem {
  id: string;
  title: string;
  duration: string;
  category: string;
  location: string;
  mediaUrl: string;
  thumbnailUrl: string;
  contextNote: string;
  creator: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  curiosityQuestion: string;
  likesCount: number;
}

const REELS_DATA: ReelItem[] = [
  {
    id: "reel-kashi-aarti",
    title: "The Twilight Fire Offering of Dashashwamedh",
    duration: "0:45",
    category: "Rituals",
    location: "Varanasi, India",
    mediaUrl: "/places/varanasi.jpg",
    thumbnailUrl: "/places/varanasi.jpg",
    contextNote:
      "Every evening for centuries, priests lift brass tiered lamps in synchrony to return light to the Ganges as living gratitude.",
    creator: {
      name: "Varanasi Ganga Aarti Tradition",
      handle: "varanasi_traditions",
      avatar: "",
      verified: false,
    },
    curiosityQuestion: "Why is fire returned back to the river water at sunset?",
    likesCount: 1420,
  },
  {
    id: "reel-kyoto-chado",
    title: "Chado: Silence Whispered into Matcha",
    duration: "1:00",
    category: "Crafts",
    location: "Kyoto, Japan",
    mediaUrl: "/places/kyoto.jpg",
    thumbnailUrl: "/places/kyoto.jpg",
    contextNote:
      "In a traditional Kyoto tearoom, movements of the bamboo whisk (chasen) embody 'Ichi-go ichi-e' — cherishing each unrepeatable encounter.",
    creator: {
      name: "Kyoto Chado Heritage",
      handle: "kyoto_heritage",
      avatar: "",
      verified: false,
    },
    curiosityQuestion: "How does preparing a bowl of powdered tea become silent meditation?",
    likesCount: 980,
  },
  {
    id: "reel-oaxaca-altar",
    title: "Golden Marigold Paths for Returning Spirits",
    duration: "0:52",
    category: "Festivals",
    location: "Oaxaca, Mexico",
    mediaUrl: "/content/observe.jpg",
    thumbnailUrl: "/content/observe.jpg",
    contextNote:
      "In Oaxaca, families line alleys with cempasúchil petals and light copal incense. Memory of departed ancestors is welcomed home with food and song.",
    creator: {
      name: "Oaxaca Community Tradition",
      handle: "oaxaca_heritage",
      avatar: "",
      verified: false,
    },
    curiosityQuestion: "Why are yellow marigolds believed to guide departed ancestors?",
    likesCount: 1140,
  },
  {
    id: "reel-aranmula-mirror",
    title: "Aranmula Kannadi: The Metal That Mirrors Soul",
    duration: "0:58",
    category: "Crafts",
    location: "Kerala, India",
    mediaUrl: "/content/monastery-corridor.jpg",
    thumbnailUrl: "/content/monastery-corridor.jpg",
    contextNote:
      "Cast by specialized family workshops in Kerala using a bronze alloy, producing front-surface reflections without glass refraction (GI Registered).",
    creator: {
      name: "Aranmula Metal Mirror Heritage (GI)",
      handle: "aranmula_heritage",
      avatar: "",
      verified: false,
    },
    curiosityQuestion: "Why does the Aranmula metal mirror reflect without glass refraction?",
    likesCount: 890,
  },
  {
    id: "reel-majuli-masks",
    title: "Bamboo Spirit Masks of Samaguri Satra",
    duration: "0:50",
    category: "Living Cultures",
    location: "Majuli, Assam",
    mediaUrl: "/content/practice.jpg",
    thumbnailUrl: "/content/practice.jpg",
    contextNote:
      "Crafted from river silt clay, cow dung, and woven split bamboo, Sattriya monastery performers bring sacred epics to life in the river island of Majuli.",
    creator: {
      name: "Samaguri Satra Mask Tradition",
      handle: "sattriya_heritage",
      avatar: "",
      verified: false,
    },
    curiosityQuestion: "How do Assamese masks articulate open jaws and eyes using river reeds?",
    likesCount: 760,
  },
  {
    id: "reel-fez-tanneries",
    title: "Thousand-Year Terraces of Chouara",
    duration: "1:05",
    category: "Crafts",
    location: "Fez, Morocco",
    mediaUrl: "/places/marrakesh.jpg",
    thumbnailUrl: "/places/marrakesh.jpg",
    contextNote:
      "Leather dyed using botanical ingredients inside stone vats dating to the medieval era, preserved across generations of Moroccan artisan guilds.",
    creator: {
      name: "Chouara Artisan Guild Heritage",
      handle: "fez_guilds",
      avatar: "",
      verified: false,
    },
    curiosityQuestion: "How do natural botanical dyes achieve permanent sun-fast vibrant pigments?",
    likesCount: 1320,
  },
];

// -----------------------------------------------------------------------------
// 3. CAROUSEL STORIES DATA (Section 5.B)
// -----------------------------------------------------------------------------
interface CarouselItem {
  id: string;
  title: string;
  category: string;
  slidesCount: number;
  coverImageUrl: string;
  location: string;
  contextOneLiner: string;
  creator: {
    name: string;
    verified: boolean;
  };
}

const CAROUSEL_DATA: CarouselItem[] = [
  {
    id: "car-durga-sculpture",
    title: "From Ganga Mud to Divinity: The 4 Rites of Clay",
    category: "Sacred Crafts",
    slidesCount: 5,
    coverImageUrl: "/places/kolkata.jpg",
    location: "Kumartuli, Kolkata",
    contextOneLiner: "How straw armatures and sacred river clay from riverside hubs become Uma's living presence.",
    creator: { name: "Kumartuli Artisan Guild", verified: false },
  },
  {
    id: "car-zen-gardens",
    title: "Raking Stillness: The 15 Stones of Ryoan-ji",
    category: "Sacred Places",
    slidesCount: 6,
    coverImageUrl: "/places/kyoto.jpg",
    location: "Kyoto, Japan",
    contextOneLiner: "Why no matter where you sit on the wooden veranda, only 14 stones are visible at once.",
    creator: { name: "Ryoan-ji Monastic Heritage", verified: false },
  },
  {
    id: "car-bishnoi-blackbucks",
    title: "The 363 Martyrs & Desert Gazelles of Thar",
    category: "Living Ecology",
    slidesCount: 4,
    coverImageUrl: "/content/observe.jpg",
    location: "Jodhpur, Rajasthan",
    contextOneLiner: "The 29 principles that guide desert communities in ecological protection of trees and wildlife.",
    creator: { name: "Bishnoi Ecological Tradition", verified: false },
  },
  {
    id: "car-berber-rugs",
    title: "The Hidden Mathematical Language of High Atlas Weavers",
    category: "Master Crafts",
    slidesCount: 5,
    coverImageUrl: "/places/marrakesh.jpg",
    location: "Atlas Mountains, Morocco",
    contextOneLiner: "How Amazigh matriarchs weave generational genealogies and geometric patterns on traditional handlooms.",
    creator: { name: "Beni Ourain Weaving Heritage", verified: false },
  },
];

// -----------------------------------------------------------------------------
// 4. SHORT EDITORIAL CARDS DATA (Section 6)
// -----------------------------------------------------------------------------
interface EditorialExplainer {
  id: string;
  title: string;
  category: string;
  location: string;
  summary: string;
  imageUrl: string;
  fullContent: {
    lead: string;
    ritualSignificance: string;
    symbolism: string;
    modernContinuity: string;
    custodians: string;
    askPrompt: string;
  };
}

const EDITORIAL_EXPLAINERS: EditorialExplainer[] = [
  {
    id: "exp-diyas",
    title: "WHY DO PEOPLE LIGHT DIYAS?",
    category: "Tradition",
    location: "India",
    summary:
      "A short explanation of the ritual, symbolism, and cultural context of clay oil lamps returning light over darkness.",
    imageUrl: "/content/ritual-lamp.jpg",
    fullContent: {
      lead: "A diya is a simple shallow lamp carved from earthenware clay, filled with mustard or sesame oil, and lit with a rolled cotton wick. But in Indic thought, it is an altar of living wisdom.",
      ritualSignificance:
        "Lighting a diya at twilight (Sandhya) marks the transition between light and darkness. The clay (Prithvi) represents the mortal body, the oil represents worldly attachments, and the flame (Agni) represents pure illumination burning away illusion.",
      symbolism:
        "Unlike an electric bulb which projects outward, a flame naturally points upward toward the formless divine, reminding the observer of self-effacing surrender.",
      modernContinuity:
        "Across millions of households from Diwali to daily dawn prayer, lighting the lamp is an unbroken gesture of gratitude connecting family memory.",
      custodians: "Potter guilds of North and South India, temple priests, and generational grandmothers.",
      askPrompt: "Why do people light clay diyas during Diwali and dawn prayer?",
    },
  },
  {
    id: "exp-varanasi",
    title: "WHY IS VARANASI SACRED?",
    category: "Sacred Places",
    location: "India",
    summary:
      "A concise cultural explanation of the world's oldest continuously inhabited spiritual city where death is celebrated as liberation.",
    imageUrl: "/places/varanasi.jpg",
    fullContent: {
      lead: "Mark Twain wrote that Varanasi is older than history, older than tradition, older even than legend, and looks twice as old as all of them put together.",
      ritualSignificance:
        "Perched on the crescent bend of the holy Ganges where the river turns north toward its Himalayan source (Uttara-vahini), Kashi is considered by pilgrims to be the city where Shiva whispers the saving mantra into the ear of the departing soul.",
      symbolism:
        "In Varanasi, death is not hidden behind sanitized hospital curtains; Manikarnika and Harishchandra Ghats burn eternal funeral pyres in broad daylight, instructing the living that impermanence is sacred reality.",
      modernContinuity:
        "Sanskrit universities, classical Dhrupad music academies, and weaving guilds continue in narrow cobblestone lanes without disruption.",
      custodians: "The traditional Dom Raja families, boatmen lineages, and Kashi Pandits.",
      askPrompt: "Why is Varanasi considered sacred across millennia?",
    },
  },
  {
    id: "exp-tea",
    title: "THE STORY BEHIND JAPANESE TEA",
    category: "Craft",
    location: "Japan",
    summary:
      "A visual introduction to Chado (The Way of Tea) and the quiet zen culture surrounding its preparation.",
    imageUrl: "/places/kyoto.jpg",
    fullContent: {
      lead: "In Japan, tea is not a beverage; it is an architecture of undivided attention.",
      ritualSignificance:
        "Developed by 16th-century Zen master Sen no Rikyu, Chado requires guests to crawl through a humble low doorway (Nijiriguchi), forcing samurai to remove their swords and enter as equal mortals.",
      symbolism:
        "The core tenet 'Ichi-go ichi-e' translates as 'one time, one meeting'. Because the water temperature, the wind outside, and the minds of those present can never be duplicated, this single sip of bitter matcha is sacred.",
      modernContinuity:
        "Grandmasters in Kyoto continue decades of training to master the curvature of bamboo spoons and sound of boiling kettle steam.",
      custodians: "Urasenke, Omotesenke, and Mushakojisenke tea lineage schools.",
      askPrompt: "What is the story behind the Japanese Tea Ceremony?",
    },
  },
  {
    id: "exp-langar",
    title: "WHY DO SIKHS SERVE FREE LANGAR?",
    category: "Tradition",
    location: "Punjab, India",
    summary:
      "The revolutionary egalitarian kitchen where kings and peasants sit shoulder-to-shoulder on the floor for communal food.",
    imageUrl: "/content/give.jpg",
    fullContent: {
      lead: "Instituted in the 15th century by Guru Nanak, Langar is a radical spiritual institution of universal hospitality.",
      ritualSignificance:
        "At a time when medieval India enforced strict caste and purity hierarchies forbidding higher castes from dining with lower castes, the Sikh Gurus mandated that anyone seeking audience must first sit together in Pangat (on the same floor mat) and eat Sangat.",
      symbolism:
        "Food served with love (Seva) dissolves ego. No money is accepted; all vegetables are peeled and rotis rolled by volunteers singing sacred verses.",
      modernContinuity:
        "At the Golden Temple in Amritsar, over 100,000 hot vegetarian meals are served every single day, 24/7, without exception.",
      custodians: "Sikh community volunteers and Gurdwara sewadars worldwide.",
      askPrompt: "What was the social revolution behind Guru Nanak's Langar?",
    },
  },
  {
    id: "exp-bhoota-kola",
    title: "WHAT IS BHOOTA KOLA?",
    category: "Sacred Ritual",
    location: "Karnataka, India",
    summary:
      "A living spirit oracle where dancers enter trances to arbitrate justice and balance between villages and forest deities.",
    imageUrl: "/content/practice.jpg",
    fullContent: {
      lead: "In the coastal belt of Tulu Nadu, Bhoota Kola is not folklore performance; it is real-time community adjudication.",
      ritualSignificance:
        "Performers from marginalized hereditary communities adorn elaborate areca palm headgear (Ani), painted faces, and brass ornaments to channel local protector spirits (Daivas like Panjurli and Guliga).",
      symbolism:
        "The spirit demands honesty: wealthy landlords and poor farmers must stand before the oracle to resolve property boundaries, ecological disputes, and family discord.",
      modernContinuity:
        "Thousands of village groves hold annual night vigils illuminated by torches until dawn.",
      custodians: "Nalike and Parava hereditary performer families.",
      askPrompt: "How does Bhoota Kola serve as community justice in Tulu Nadu?",
    },
  },
  {
    id: "exp-bishnoi",
    title: "HOW DO THE BISHNOI PROTECT DESERT WILDLIFE?",
    category: "Living Ecology",
    location: "Rajasthan, India",
    summary:
      "The community that treats trees and wild blackbucks as sacred family, sacrificing lives to protect the desert canopy.",
    imageUrl: "/content/observe.jpg",
    fullContent: {
      lead: "In 1730 CE, 363 Bishnoi women and men hugged Khejri trees and gave their lives when a king's soldiers came to fell the desert forest.",
      ritualSignificance:
        "Founded by Guru Jambheshwar in 1485, the Bishnoi follow 29 sacred principles including forbidding the cutting of green trees and hunting of any animal.",
      symbolism:
        "Bishnoi mothers have famously breastfed orphaned blackbuck fawns alongside their own infants, exemplifying universal kinship with non-human life.",
      modernContinuity:
        "In the harsh Thar desert, Bishnoi villages stand out as lush oases teeming with free-roaming antelopes and ancient trees.",
      custodians: "Bishnoi village councils and forest wardens.",
      askPrompt: "What are the 29 principles of Bishnoi sacred ecology?",
    },
  },
  {
    id: "exp-kumartuli-clay",
    title: "FROM GANGA MUD TO DIVINITY: THE RITES OF CLAY",
    category: "Sacred Crafts",
    location: "Kolkata, India",
    summary:
      "How straw armatures and alluvial river silt from the holy Hooghly are transformed by generational sculptors into living presence.",
    imageUrl: "/places/kolkata.jpg",
    fullContent: {
      lead: "Every autumn in the alleyways of Kumartuli, sculptors welcome the sacred river clay into their studios to give form to the formless.",
      ritualSignificance:
        "The creation begins with straw and bamboo structures bound with jute twine, layered with Ganga silt (Entel mati and Bele mati), culminating in the sacred ritual of 'Chokkhudan' — painting the eyes of the deity on Mahalaya dawn.",
      symbolism:
        "Clay drawn from the river returns to the river upon immersion (Visarjan), completing the eternal cosmic cycle of creation and dissolution.",
      modernContinuity:
        "Hundreds of family workshops continue an unbroken craft lineage spanning over three centuries in North Kolkata.",
      custodians: "Patuapara and Kumartuli hereditary clay idol makers.",
      askPrompt: "What is the spiritual significance of the four rites of clay in Kumartuli?",
    },
  },
  {
    id: "exp-ryoanji-stones",
    title: "RAKING STILLNESS: THE 15 STONES OF RYOAN-JI",
    category: "Sacred Places",
    location: "Kyoto, Japan",
    summary:
      "Why no matter where you sit on the wooden veranda of this dry landscape Zen garden, only 14 stones can ever be seen at once.",
    imageUrl: "/content/still-water.jpg",
    fullContent: {
      lead: "At Ryoan-ji in northwest Kyoto, fifteen moss-ringed boulders rest in a rectangular bed of combed white gravel.",
      ritualSignificance:
        "Designed in the Muromachi period as a karesansui (dry landscape) rock garden, the site eliminates all decorative plants, water, and ornament to reflect the mind back upon itself.",
      symbolism:
        "The architecture ensures that from any earthly viewpoint on the veranda, at least one stone remains obscured from human sight, reminding the seeker of the incompleteness of ego and the mystery of totality.",
      modernContinuity:
        "Monks rake the gravel every morning into linear oceanic patterns before the garden gate opens.",
      custodians: "Myoshin-ji school of Rinzai Zen Buddhism.",
      askPrompt: "Why are only 14 stones visible at once in Ryoan-ji?",
    },
  },
  {
    id: "exp-berber-weaving",
    title: "THE MATHEMATICAL LANGUAGE OF ATLAS WEAVERS",
    category: "Master Crafts",
    location: "Atlas Mountains, Morocco",
    summary:
      "How Amazigh matriarchs weave generational genealogies, fertility talismans, and mountain topography on upright wooden handlooms.",
    imageUrl: "/places/marrakesh.jpg",
    fullContent: {
      lead: "In the snow-capped High Atlas Mountains, Beni Ourain and Amazigh rugs are not decorative furnishings; they are woven memoirs.",
      ritualSignificance:
        "Working without paper cartoons or preliminary sketches, weavers recite poetry and count uncarded sheep wool knots in memory of ancestral lineage.",
      symbolism:
        "Lozenge diamonds represent the protective eye, zigzags denote running mountain water, and deliberate asymmetries ward off misfortune.",
      modernContinuity:
        "Village cooperatives preserve traditional vegetable dyeing with madder root, saffron, and indigo.",
      custodians: "Amazigh matriarchs and rural artisan cooperatives of Morocco.",
      askPrompt: "How do Amazigh weaving motifs preserve family oral genealogy?",
    },
  },
];

// -----------------------------------------------------------------------------
// 5. STATIC VISUAL STORIES DATA (Section 5.C)
// -----------------------------------------------------------------------------
interface StaticStoryItem {
  id: string;
  title: string;
  category: string;
  location: string;
  imageUrl: string;
  context: string;
  creator: {
    name: string;
    verified: boolean;
  };
}

const STATIC_STORIES_DATA: StaticStoryItem[] = [
  {
    id: "stat-kolkata-durga",
    title: "The Autumn Scent of Shiuli: Uma Returns",
    category: "Festivals",
    location: "Kolkata, India",
    imageUrl: "/places/kolkata.jpg",
    context: "White kash grass blooming by railway tracks heralds the four days when the Mother Goddess visits as beloved daughter.",
    creator: { name: "Bengal Cultural Lore", verified: false },
  },
  {
    id: "stat-kyoto-bamboo",
    title: "Wind in the Stalks of Sagano",
    category: "Sacred Places",
    location: "Arashiyama, Kyoto",
    imageUrl: "/places/kyoto.jpg",
    context: "Designated as one of the '100 Soundscapes of Japan', the creak of towering green bamboo reminds travelers to listen with stillness.",
    creator: { name: "Kyoto Heritage Archive", verified: false },
  },
  {
    id: "stat-marrakesh-courtyard",
    title: "The Geometry of Cool Water in Medina",
    category: "Heritage",
    location: "Marrakesh, Morocco",
    imageUrl: "/places/marrakesh.jpg",
    context: "Zellij ceramic tiles arranged in infinite radial stars around central fountains to keep desert heat outside thick mud-brick walls.",
    creator: { name: "Moroccan Architecture Heritage", verified: false },
  },
  {
    id: "stat-varanasi-dawn",
    title: "Subah-e-Banaras: Dawn Ragas over the River",
    category: "Rituals",
    location: "Assi Ghat, Varanasi",
    imageUrl: "/places/varanasi.jpg",
    context: "Before the sun rises above the sandy eastern shore, sitarists and vocalists offer music to the river as living salutation.",
    creator: { name: "Banaras Musical Traditions", verified: false },
  },
];

// -----------------------------------------------------------------------------
// MAIN STORIES COMPONENT
// -----------------------------------------------------------------------------
function EkaStoriesPage() {
  const navigate = useNavigate();

  // Active filter tab: "all" | "reels" | "editorial"
  const [activeTab, setActiveTab] = useState<"all" | "reels" | "editorial">("all");

  // Highlight Viewer Modal State
  const [activeHighlight, setActiveHighlight] = useState<HighlightSequence | null>(null);
  const [highlightSlideIndex, setHighlightSlideIndex] = useState(0);

  // Fullscreen Reel Player Modal State
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [isReelPlaying, setIsReelPlaying] = useState(true);
  const [isReelMuted, setIsReelMuted] = useState(false);

  // Short Editorial Reader Modal State
  const [selectedExplainer, setSelectedExplainer] = useState<EditorialExplainer | null>(null);

  // Contextual Ask EKA Modal State
  const [askTarget, setAskTarget] = useState<{ title: string; location?: string; initialQuestion?: string } | null>(null);
  const [askModalOpen, setAskModalOpen] = useState(false);

  // ---------------------------------------------------------------------------
  // Highlight Story Progression
  // ---------------------------------------------------------------------------
  const openHighlight = (highlight: HighlightSequence) => {
    setActiveHighlight(highlight);
    setHighlightSlideIndex(0);
    track("highlight_opened" as any, { highlightId: highlight.id, title: highlight.title });
  };

  const nextHighlightSlide = useCallback(() => {
    if (!activeHighlight) return;
    if (highlightSlideIndex < activeHighlight.slides.length - 1) {
      setHighlightSlideIndex((prev) => prev + 1);
    } else {
      setActiveHighlight(null);
      setHighlightSlideIndex(0);
      toast.info("Completed highlight collection");
    }
  }, [activeHighlight, highlightSlideIndex]);

  const prevHighlightSlide = useCallback(() => {
    if (highlightSlideIndex > 0) {
      setHighlightSlideIndex((prev) => prev - 1);
    }
  }, [highlightSlideIndex]);

  // Auto-progress for highlight viewer (5 seconds per slide)
  useEffect(() => {
    if (!activeHighlight) return;
    const timer = setTimeout(() => {
      nextHighlightSlide();
    }, 6000);
    return () => clearTimeout(timer);
  }, [activeHighlight, highlightSlideIndex, nextHighlightSlide]);

  // ---------------------------------------------------------------------------
  // Reel Viewer Actions
  // ---------------------------------------------------------------------------
  const openReelTheater = (index: number) => {
    setActiveReelIndex(index);
    setIsReelPlaying(true);
    const reel = REELS_DATA[index];
    if (reel) {
      track("story_started", { reelId: reel.id, title: reel.title });
    }
  };

  const nextReel = useCallback(() => {
    if (activeReelIndex !== null && activeReelIndex < REELS_DATA.length - 1) {
      setActiveReelIndex((prev) => (prev !== null ? prev + 1 : 0));
    }
  }, [activeReelIndex]);

  const prevReel = useCallback(() => {
    if (activeReelIndex !== null && activeReelIndex > 0) {
      setActiveReelIndex((prev) => (prev !== null ? prev - 1 : 0));
    }
  }, [activeReelIndex]);

  // Keyboard navigation for reels modal
  useEffect(() => {
    if (activeReelIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "j") nextReel();
      if (e.key === "ArrowUp" || e.key === "k") prevReel();
      if (e.key === " ") {
        e.preventDefault();
        setIsReelPlaying((p) => !p);
      }
      if (e.key === "Escape") setActiveReelIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeReelIndex, nextReel, prevReel]);

  const triggerAskEka = (question: string, contextTitle: string, loc?: string) => {
    setAskTarget({
      title: contextTitle,
      location: loc,
      initialQuestion: question,
    });
    setAskModalOpen(true);
    track("ask_eka_triggered_from_story" as any, { question, contextTitle });
  };

  const currentModalReel = activeReelIndex !== null ? REELS_DATA[activeReelIndex] : null;

  return (
    <div className="min-h-screen bg-sand/20 dark:bg-stone-950 text-foreground flex flex-col font-sans">
      <MetaTags
        title="Stories — Visual Cultural Stories & Living Lineages"
        description="Watch, wonder, understand, and connect with living cultural lineages. Visual reels, carousels, highlights, and short editorial stories across 1 billion people."
        ogTitle="EKA Stories — Visual Cultural Destination"
        ogDescription="1 billion people, 1 billion stories. Experience living rituals, crafts, foodways, and sacred places."
        ogImage="/brand/eka-banner.jpg"
        canonicalUrl="/stories"
        twitterCard="summary_large_image"
        twitterTitle="EKA Stories — Visual Cultural Destination"
        twitterDescription="Watch, wonder, understand, and connect with living cultural lineages."
        keywords={["cultural stories", "reels", "carousels", "living lineages", "crafts", "rituals", "indigenous knowledge"]}
      />
      <SiteHeader />

      {/* Breadcrumb Navigation Bar */}
      <div className="border-b border-border/40 bg-sand/10">
        <div className="container-eka">
          <EkaBreadcrumb
            items={[
              { label: "Stories", active: true },
            ]}
          />
        </div>
      </div>

      <main id="main-content" className="flex-1 space-y-10 sm:space-y-14 py-12 sm:py-16">
        {/* ==================================================================== */}
        {/* HERO / KICKER & TITLE */}
        {/* ==================================================================== */}
        <section className="container-eka space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-mono font-medium tracking-wide uppercase mb-2">
                <Sparkles className="size-3.5" />
                <span>EKA Visual Storytelling Destination</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
                Stories of the World
              </h1>
              <p className="font-serif text-sm sm:text-base text-muted-foreground max-w-2xl mt-1 leading-relaxed font-light">
                Watch, wonder, understand, and connect. 1 billion people, 1 billion living stories —
                crafted by generational custodians, artisans, and elders.
              </p>
            </div>

            {/* Quick Reel Theater Launcher Button */}
            <Button
              onClick={() => openReelTheater(0)}
              className="rounded-xl bg-gradient-to-r from-terracotta to-saffron text-white shadow-calm hover:shadow-lift transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <Play className="size-4 fill-white" />
              <span>Watch Reels Theater</span>
            </Button>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* SECTION 4: HORIZONTAL HIGHLIGHTS ROW (Near the Top of Stories) */}
        {/* ==================================================================== */}
        <section className="container-eka space-y-3">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-terracotta animate-pulse" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Curated Highlights & Sequences
              </h2>
            </div>
            <span className="text-[11px] text-muted-foreground font-light">
              Tap a circle to open visual sequence
            </span>
          </div>

          {/* Horizontal Scrolling Bar */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
            {HIGHLIGHT_COLLECTIONS.map((highlight) => (
              <HighlightCard
                key={highlight.id}
                id={highlight.id}
                title={highlight.title}
                imageUrl={highlight.coverImage}
                storyCount={highlight.storyCount}
                onClick={() => openHighlight(highlight)}
              />
            ))}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* SECTION 5.D: FEATURED STORY CARD (Hero Showcase) */}
        {/* ==================================================================== */}
        <section className="container-eka">
          <FeaturedStoryCard
            id="featured-kashi"
            title="The Twilight Fire Offering of Dashashwamedh"
            subtitle="Returning Light to the Sacred River for 1,200 Unbroken Years"
            category="Living Ritual"
            location="Dashashwamedh Ghat, Varanasi, India"
            imageUrl="/places/varanasi.jpg"
            description="Every evening at dusk, seven young priests lift 4.5kg brass tiered lamps in synchrony. The conch shells sound across the water as fire is returned to the river as living gratitude for existence."
            creator={{
              name: "Varanasi Ganga Aarti Tradition",
              role: "Public Living Ritual (Documented)",
              verified: false,
            }}
            ctaLabel="Watch Story Experience"
            onClick={() => openReelTheater(0)}
          />
        </section>

        {/* ==================================================================== */}
        {/* ==================================================================== */}
        {/* VIEW FILTER TABS */}
        {/* ==================================================================== */}
        <section className="container-eka">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "all", label: "All Stories" },
              { id: "reels", label: "Living Traditions" },
              { id: "editorial", label: "Editorials" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "bg-card border border-border/70 text-muted-foreground hover:text-foreground hover:bg-accent/40",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* SECTION 5.A: REELS SECTION (Vertical 9:16 Cards) */}
        {/* ==================================================================== */}
        {(activeTab === "all" || activeTab === "reels") && (
          <section className="container-eka space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-normal text-foreground">
                  Living Traditions
                </h3>
                <p className="text-xs text-muted-foreground font-light">
                  Direct glimpses of living practices, sacred craft, and rituals from around the globe.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openReelTheater(0)}
                className="text-xs font-medium text-terracotta hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Play all stories</span>
                <ArrowRight className="size-3" />
              </button>
            </div>

            {/* Responsive Grid of Reels */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {REELS_DATA.map((reel, idx) => (
                <ReelCard
                  key={reel.id}
                  id={reel.id}
                  title={reel.title}
                  duration={reel.duration}
                  category={reel.category}
                  location={reel.location}
                  mediaUrl={reel.mediaUrl}
                  thumbnailUrl={reel.thumbnailUrl}
                  creator={reel.creator}
                  likesCount={reel.likesCount}
                  onClick={() => openReelTheater(idx)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* SECTION 6: SHORT EDITORIAL CARDS (Editorials Only) */}
        {/* ==================================================================== */}
        {(activeTab === "all" || activeTab === "editorial") && (
          <section className="container-eka space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-normal text-foreground">
                  Editorials
                </h3>
                <p className="text-xs text-muted-foreground font-light">
                  Direct answers to eternal questions. Concise, scannable, verified cultural insights.
                </p>
              </div>
              <Link
                to="/ask"
                search={{ q: "" } as any}
                className="text-xs font-medium text-terracotta hover:underline flex items-center gap-1"
              >
                <span>Ask your own question</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {/* Grid of Short Editorial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {EDITORIAL_EXPLAINERS.map((item) => (
                <ShortEditorialCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  category={item.category}
                  location={item.location}
                  imageUrl={item.imageUrl}
                  explanation={item.summary}
                  onClick={() => {
                    setSelectedExplainer(item);
                    track("editorial_card_explored" as any, { id: item.id, title: item.title });
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ==================================================================== */}
      {/* 1. INTERACTIVE HIGHLIGHT VIEWER MODAL (Section 4) */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {activeHighlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4 select-none backdrop-blur-md"
            onClick={() => setActiveHighlight(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-[420px] aspect-[9/16] rounded-3xl overflow-hidden bg-neutral-900 shadow-2xl flex flex-col justify-between border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background Slide Image */}
              {activeHighlight.slides[highlightSlideIndex] && (
                <img
                  src={activeHighlight.slides[highlightSlideIndex].imageUrl}
                  alt={activeHighlight.slides[highlightSlideIndex].title}
                  className="absolute inset-0 size-full object-cover transition-all duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/70 pointer-events-none" />

              {/* Progress Ticks at Top */}
              <div className="relative z-10 p-4 space-y-3">
                <div className="flex items-center gap-1.5 w-full">
                  {activeHighlight.slides.map((slide, idx) => (
                    <div
                      key={slide.id}
                      className="h-1 flex-1 rounded-full overflow-hidden bg-white/30"
                    >
                      <div
                        className={cn(
                          "h-full bg-white transition-all duration-300",
                          idx < highlightSlideIndex && "w-full",
                          idx === highlightSlideIndex && "w-full animate-[progress_6s_linear]",
                          idx > highlightSlideIndex && "w-0",
                        )}
                      />
                    </div>
                  ))}
                </div>

                {/* Highlight Header */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-amber-300 font-bold">
                      {activeHighlight.title}
                    </span>
                    <span className="text-white/40 text-xs">•</span>
                    <span className="text-xs text-white/80 font-mono">
                      {highlightSlideIndex + 1}/{activeHighlight.slides.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveHighlight(null)}
                    className="size-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* Tap Left / Right Zones */}
              <div className="absolute inset-y-16 inset-x-0 z-10 flex">
                <div
                  className="w-1/2 h-full cursor-pointer"
                  onClick={prevHighlightSlide}
                  title="Previous slide"
                />
                <div
                  className="w-1/2 h-full cursor-pointer"
                  onClick={nextHighlightSlide}
                  title="Next slide"
                />
              </div>

              {/* Bottom Caption & Ask EKA Trigger */}
              {activeHighlight.slides[highlightSlideIndex] && (
                <div className="relative z-20 p-5 space-y-3 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
                    <MapPin className="size-3.5 shrink-0" />
                    <span>{activeHighlight.slides[highlightSlideIndex].location}</span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl text-white font-normal leading-snug">
                    {activeHighlight.slides[highlightSlideIndex].title}
                  </h3>

                  <p className="text-xs text-white/90 font-light leading-relaxed">
                    {activeHighlight.slides[highlightSlideIndex].caption}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-white/20 gap-2">
                    <span className="text-[11px] text-white/70 truncate">
                      By {activeHighlight.slides[highlightSlideIndex].custodian}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        triggerAskEka(
                          activeHighlight.slides[highlightSlideIndex]!.askPrompt,
                          activeHighlight.slides[highlightSlideIndex]!.title,
                          activeHighlight.slides[highlightSlideIndex]!.location,
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-terracotta text-white text-xs font-medium hover:bg-terracotta/90 transition-all cursor-pointer shadow-md"
                    >
                      <HelpCircle className="size-3" />
                      <span>Ask EKA</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* 2. FULLSCREEN REELS THEATER MODAL (Section 3 & 5.A) */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {currentModalReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4 select-none backdrop-blur-md"
            onClick={() => setActiveReelIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-[420px] aspect-[9/16] rounded-3xl overflow-hidden bg-neutral-900 shadow-2xl flex flex-col justify-between border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Visual Media */}
              <img
                src={currentModalReel.mediaUrl}
                alt={currentModalReel.title}
                className={cn(
                  "absolute inset-0 size-full object-cover transition-transform duration-700",
                  isReelPlaying ? "scale-100" : "scale-[1.02] filter brightness-90",
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/60 pointer-events-none" />

              {/* Top Controls */}
              <div className="relative z-10 p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-amber-300 font-bold bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
                    {currentModalReel.category}
                  </span>
                  <span className="text-xs font-mono text-white/80 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                    {activeReelIndex! + 1}/{REELS_DATA.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReelMuted(!isReelMuted)}
                    className="size-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white border border-white/10 cursor-pointer"
                  >
                    {isReelMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveReelIndex(null)}
                    className="size-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white border border-white/10 cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* Middle Play/Pause Tap Target */}
              <div
                className="absolute inset-20 flex items-center justify-center cursor-pointer z-10"
                onClick={() => setIsReelPlaying(!isReelPlaying)}
              >
                {!isReelPlaying && (
                  <div className="size-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-xl">
                    <Play className="size-6 fill-white ml-1" />
                  </div>
                )}
              </div>

              {/* Right Side Up/Down Arrows */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={activeReelIndex === 0}
                  onClick={prevReel}
                  className="size-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white disabled:opacity-30 border border-white/10 cursor-pointer"
                  title="Previous Reel"
                >
                  <ChevronUp className="size-5" />
                </button>
                <button
                  type="button"
                  disabled={activeReelIndex === REELS_DATA.length - 1}
                  onClick={nextReel}
                  className="size-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white disabled:opacity-30 border border-white/10 cursor-pointer"
                  title="Next Reel"
                >
                  <ChevronDown className="size-5" />
                </button>
              </div>

              {/* Bottom Content & Interactive Ask EKA Button */}
              <div className="relative z-20 p-5 space-y-3 text-white">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
                  <MapPin className="size-3.5 shrink-0" />
                  <span>{currentModalReel.location}</span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl text-white font-normal leading-snug">
                  {currentModalReel.title}
                </h3>

                <p className="text-xs text-white/90 font-light leading-relaxed">
                  {currentModalReel.contextNote}
                </p>

                {/* Creator Attribution */}
                <div className="pt-2 flex items-center justify-between border-t border-white/20 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={currentModalReel.creator.avatar}
                      alt={currentModalReel.creator.name}
                      className="size-7 rounded-full object-cover border border-white/30 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white truncate flex items-center gap-1">
                        <span>{currentModalReel.creator.name}</span>
                        {currentModalReel.creator.verified && (
                          <ShieldCheck className="size-3 text-emerald-400 shrink-0" />
                        )}
                      </p>
                      <p className="text-[10px] text-white/70 font-mono">
                        @{currentModalReel.creator.handle}
                      </p>
                    </div>
                  </div>

                  {/* Ask EKA Button */}
                  <button
                    type="button"
                    onClick={() =>
                      triggerAskEka(
                        currentModalReel.curiosityQuestion,
                        currentModalReel.title,
                        currentModalReel.location,
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-terracotta to-saffron text-white text-xs font-medium shadow-md hover:opacity-95 transition-all shrink-0 cursor-pointer"
                  >
                    <HelpCircle className="size-3.5" />
                    <span>Ask EKA</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* 3. SHORT EDITORIAL READER DIALOG (Section 6) */}
      {/* ==================================================================== */}
      <Dialog
        open={!!selectedExplainer}
        onOpenChange={(open) => !open && setSelectedExplainer(null)}
      >
        {selectedExplainer && (
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl border-border bg-card p-6 sm:p-8">
            <DialogHeader>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-terracotta font-semibold">
                <span>{selectedExplainer.category}</span>
                <span>•</span>
                <span className="text-muted-foreground">{selectedExplainer.location}</span>
              </div>
              <DialogTitle className="mt-2 font-display text-2xl sm:text-3xl text-foreground font-normal leading-tight">
                {selectedExplainer.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground font-light">
                Verified Epistemic Explainer • Living Cultural Context
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-5 text-foreground">
              {/* Editorial Visual */}
              <div className="overflow-hidden rounded-2xl border border-border/70 max-h-72 w-full bg-muted">
                <img
                  src={selectedExplainer.imageUrl}
                  alt={selectedExplainer.title}
                  className="size-full object-cover"
                />
              </div>

              {/* Lead Paragraph */}
              <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/90 font-normal">
                {selectedExplainer.fullContent.lead}
              </p>

              {/* Key Deep Explanations */}
              <div className="space-y-4 pt-2 border-t border-border/50">
                <div className="space-y-1">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-terracotta font-semibold">
                    Ritual & Cultural Significance
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light">
                    {selectedExplainer.fullContent.ritualSignificance}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-terracotta font-semibold">
                    Spiritual & Philosophical Symbolism
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light">
                    {selectedExplainer.fullContent.symbolism}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-terracotta font-semibold">
                    Living Lineage & Modern Continuity
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light">
                    {selectedExplainer.fullContent.modernContinuity}
                  </p>
                </div>
              </div>

              {/* Provenance & Custodians */}
              <div className="rounded-xl border border-border/60 bg-accent/20 p-3.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Custodians: <strong className="text-foreground">{selectedExplainer.fullContent.custodians}</strong>
                </span>
                <span className="flex items-center gap-1 text-forest font-medium">
                  <ShieldCheck className="size-3.5" />
                  <span>Verified</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border/60">
                <Button
                  variant="outline"
                  onClick={() => setSelectedExplainer(null)}
                  className="rounded-xl text-xs"
                >
                  Close Reader
                </Button>

                <Button
                  onClick={() => {
                    setSelectedExplainer(null);
                    triggerAskEka(
                      selectedExplainer.fullContent.askPrompt,
                      selectedExplainer.title,
                      selectedExplainer.location,
                    );
                  }}
                  className="rounded-xl bg-terracotta hover:bg-terracotta/90 text-white text-xs flex items-center gap-1.5 shadow-calm"
                >
                  <HelpCircle className="size-3.5" />
                  <span>Ask EKA About This</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* ==================================================================== */}
      {/* 4. CONTEXTUAL ASK EKA MODAL */}
      {/* ==================================================================== */}
      <ContextualAskEkaModal
        open={askModalOpen}
        onOpenChange={setAskModalOpen}
        onClose={() => setAskModalOpen(false)}
        target={askTarget}
      />

      <SiteFooter />
    </div>
  );
}
