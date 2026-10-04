// ==============================================================================
// EKA DYNAMIC EDITORIAL BANNER ENGINE — REGIONAL PERSONALIZATION
// ==============================================================================
// Supports Regional Entry Points without creating cultural silos:
// Assam user: "অসমৰ কাহিনী আৱিষ্কাৰ কৰক" (Bihu, Sualkuchi, Kamakhya, Majuli)
// Tamil user: "தமிழ்நாட்டின் கதைகளை அறிந்துகொள்ளுங்கள்" (Pongal, Madurai, Kanchipuram)
// Bengal user: "বাংলার ঐতিহ্য ও সংস্কৃতি আবিষ্কার করুন"
// Hindi user: "अपनी संस्कृति और विश्व की कहानियों को जानें"
// Global user: "ONE WORLD. BILLIONS OF STORIES."
// ==============================================================================

import type { EKABannerItem } from "./banner-types";
import type { SupportedLocale, RegionalContext } from "@/lib/i18n/types";

import heroImage from "@/assets/hero.jpg";
import ritualLamp from "@/assets/ritual-lamp.jpg";
import kyotoImage from "@/assets/places/kyoto.jpg";
import marrakeshImage from "@/assets/places/marrakesh.jpg";
import varanasiImage from "@/assets/places/varanasi.jpg";
import todayReflection from "@/assets/today-reflection.jpg";

export const GLOBAL_HOME_BANNERS: EKABannerItem[] = [
  {
    id: "banner-brand",
    type: "brand",
    eyebrow: "EKA",
    title: "ONE WORLD.\nBILLIONS OF STORIES.",
    subtitle: "One Within. One With All.",
    description:
      "Discover the traditions, places, people and stories that make our world.",
    curiosityQuestion: "What if the world is far more connected than you think?",
    image: heroImage,
    location: "Global Heritage",
    category: "World Discovery",
    ctaLabel: "EXPLORE THE WORLD",
    ctaRoute: "#living-world",
    secondaryCtaLabel: "JOIN EKA",
    secondaryCtaRoute: "/join",
    priority: 10,
    isActive: true,
  },
  {
    id: "banner-festival",
    type: "festival",
    eyebrow: "FESTIVAL",
    title: "Every celebration has a story.",
    subtitle: "Varanasi · Ganga & The Light of Twilight",
    description:
      "Discover why people celebrate, what they believe, and how traditions live today.",
    curiosityQuestion: "Why do millions of people light lamps at dusk?",
    image: ritualLamp,
    location: "Varanasi, India",
    category: "Living Ritual",
    ctaLabel: "Explore festivals",
    ctaRoute: "/stories",
    secondaryCtaLabel: "Read the story",
    secondaryCtaRoute: "/discover",
    festival: "Diwali & Dev Deepawali",
    season: "Autumn",
    priority: 9,
    isActive: true,
  },
  {
    id: "banner-culture",
    type: "culture",
    eyebrow: "CULTURE",
    title: "The world is full of ways to live.",
    subtitle: "Fez · The Unbroken Guilds",
    description:
      "Explore traditions, food, crafts, language and everyday life from different communities.",
    curiosityQuestion: "How is this craft passed from one generation to another?",
    image: marrakeshImage,
    location: "Fez & Marrakesh, Morocco",
    category: "Artisan Lineage",
    ctaLabel: "Discover culture",
    ctaRoute: "/discover",
    secondaryCtaLabel: "Meet the makers",
    secondaryCtaRoute: "/stories",
    priority: 8,
    isActive: true,
  },
  {
    id: "banner-place",
    type: "place",
    eyebrow: "A PLACE. A STORY.",
    title: "Every place has something to teach us.",
    subtitle: "Kyoto · Sacred Boundaries",
    description:
      "Go beyond the landmark. Discover the people, history and traditions behind the place.",
    curiosityQuestion: "Why are these gates found at the entrance of sacred spaces?",
    image: kyotoImage,
    location: "Kyoto, Japan",
    category: "Sacred Topography",
    ctaLabel: "Explore places",
    ctaRoute: "/junction",
    secondaryCtaLabel: "See location map",
    secondaryCtaRoute: "#living-world",
    priority: 8,
    isActive: true,
  },
  {
    id: "banner-knowledge",
    type: "knowledge",
    eyebrow: "YOUR WORLD",
    title: "Your city has stories too.",
    subtitle: "Living Heritage in Everyday Streets",
    description:
      "Discover local traditions, hidden places, food, people and community knowledge.",
    curiosityQuestion: "What does your neighborhood remember that the internet missed?",
    image: varanasiImage,
    location: "Across All Towns & Cities",
    category: "Local Knowledge",
    ctaLabel: "Browse knowledge",
    ctaRoute: "/knowledge",
    secondaryCtaLabel: "Share your place",
    secondaryCtaRoute: "/stories",
    priority: 7,
    isActive: true,
  },
];

/**
 * Returns dynamic editorial banners tailored to user's detected region and language
 */
export function getRegionalBanners(
  region: RegionalContext,
  locale: SupportedLocale
): EKABannerItem[] {
  // 1. ASSAM REGIONAL EXPERIENCE
  if (region === "assam" || locale === "as") {
    const assamBanner: EKABannerItem = {
      id: "banner-assam-hero",
      type: "brand",
      eyebrow: "অসমৰ সংস্কৃতি · ASSAM HERITAGE",
      title: "অসমৰ কাহিনী আৱিষ্কাৰ কৰক",
      subtitle: "বিহু · শুৱালকুছি · কামাখ্যা · মাজুলী সত্ৰীয়া ঐতিহ্য",
      description:
        "অসমৰ লোক-পৰম্পৰা, খাদ্য, শিল্পকলা আৰু পৱিত্ৰ স্থানসমূহৰ জীৱন্ত কাহিনী জানক।",
      curiosityQuestion: "কিয় বিহুৰ সময়ত প্ৰকৃতি আৰু মানুহৰ মাজত এক অপূৰ্ব মিলন ঘটে?",
      image: heroImage,
      location: "অসম, ভাৰত",
      category: "অসমৰ ঐতিহ্য",
      ctaLabel: "বিহু জানক",
      ctaRoute: "/knowledge/bohag-bihu",
      secondaryCtaLabel: "মাজুলী সত্ৰীয়া সংস্কৃতি",
      secondaryCtaRoute: "/knowledge/majuli-sattra-culture",
      priority: 15,
      isActive: true,
    };
    return [assamBanner, ...GLOBAL_HOME_BANNERS];
  }

  // 2. TAMIL NADU REGIONAL EXPERIENCE
  if (region === "tamil_nadu" || locale === "ta") {
    const tamilBanner: EKABannerItem = {
      id: "banner-tamil-hero",
      type: "brand",
      eyebrow: "தமிழ்நாடு பாரம்பரியம் · TAMIL HERITAGE",
      title: "தமிழ்நாட்டின் கதைகளை அறிந்துகொள்ளுங்கள்",
      subtitle: "பொங்கல் · மதுரை மீனாட்சி · காஞ்சிபுரம் · பரதநாட்டியம்",
      description:
        "பண்டைய கோயில்கள், கைவினைப் பொருட்கள், செட்டிநாடு உணவு மற்றும் வாழும் மரபுகளை ஆராயுங்கள்.",
      curiosityQuestion: "தமிழர்களின் அறுவடைத் திருநாள் எவ்வாறு இயற்கை வழிபாடாக மாறுகிறது?",
      image: ritualLamp,
      location: "தமிழ்நாடு, இந்தியா",
      category: "தமிழ் மரபு",
      ctaLabel: "பொங்கல் காண்க",
      ctaRoute: "/knowledge/pongal",
      secondaryCtaLabel: "தோடர் புனித மரபு",
      secondaryCtaRoute: "/knowledge/toda-dairy-ritual",
      priority: 15,
      isActive: true,
    };
    return [tamilBanner, ...GLOBAL_HOME_BANNERS];
  }

  // 3. WEST BENGAL REGIONAL EXPERIENCE
  if (region === "bengal" || locale === "bn") {
    const bengalBanner: EKABannerItem = {
      id: "banner-bengal-hero",
      type: "brand",
      eyebrow: "বাংলার ঐতিহ্য · BENGAL HERITAGE",
      title: "বাংলার ঐতিহ্য ও সংস্কৃতি আবিষ্কার করুন",
      subtitle: "দুর্গা পূজা · বিষ্ণুপুর মৃৎশিল্প · বাউল গান · শান্তি নিকেতন",
      description:
        "বাংলার লোকশিল্প, গান, শারদোৎসব এবং শতাব্দী প্রাচীন জীবন্ত ঐতিহ্য অন্বেষণ করুন।",
      curiosityQuestion: "কীভাবে বাংলার মৃৎশিল্পীরা মাটির মূর্তিতে প্রাণ সঞ্চার করেন?",
      image: varanasiImage,
      location: "পশ্চিমবঙ্গ, ভারত",
      category: "বাংলার সংস্কৃতি",
      ctaLabel: "দীপাবলি ও কালীপূজা",
      ctaRoute: "/knowledge/diwali",
      secondaryCtaLabel: "বিশ্ব ঐতিহ্য",
      secondaryCtaRoute: "#living-world",
      priority: 15,
      isActive: true,
    };
    return [bengalBanner, ...GLOBAL_HOME_BANNERS];
  }

  // 4. HINDI BELT REGIONAL EXPERIENCE
  if (region === "hindi_belt" || locale === "hi") {
    const hindiBanner: EKABannerItem = {
      id: "banner-hindi-hero",
      type: "brand",
      eyebrow: "अपनी संस्कृति · LIVING HERITAGE",
      title: "अपनी संस्कृति और विश्व की कहानियों को जानें",
      subtitle: "दीपावली · काशी के घाट · बिश्नोई पर्यावरण परंपरा · अयोध्या",
      description:
        "भारत की समृद्ध आध्यात्मिक और सांस्कृतिक धरोहर का अन्वेषण करें।",
      curiosityQuestion: "लाखों लोग गोधूलि बेला में गंगा तट पर दीप क्यों प्रज्वलित करते हैं?",
      image: ritualLamp,
      location: "काशी, अयोध्या एवं भारत",
      category: "भारतीय संस्कृति",
      ctaLabel: "दीपावली परंपरा",
      ctaRoute: "/knowledge/diwali",
      secondaryCtaLabel: "बिश्नोई संरक्षण",
      secondaryCtaRoute: "/knowledge/bishnoi-conservation",
      priority: 15,
      isActive: true,
    };
    return [hindiBanner, ...GLOBAL_HOME_BANNERS];
  }

  // 5. GLOBAL FALLBACK
  return GLOBAL_HOME_BANNERS;
}

export const HOME_BANNERS = GLOBAL_HOME_BANNERS;
