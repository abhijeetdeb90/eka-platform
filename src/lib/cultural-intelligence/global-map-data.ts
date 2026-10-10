// ==============================================================================
// EKA GLOBAL CULTURAL INTELLIGENCE MAP DATASET
// ==============================================================================
// Powers the interactive World Map across 7 EKA regions:
// India · Asia · Middle East · Africa · Europe · Americas · Oceania
// ==============================================================================

export type EkaRegion =
  | "all"
  | "india"
  | "asia"
  | "middle_east"
  | "africa"
  | "europe"
  | "americas"
  | "oceania";

export interface CulturalStoryItem {
  id: string;
  title: string;
  place: string;
  country: string;
  wonderQuestion: string;
  summary: string;
  imageUrl: string;
  category: "festival" | "tradition" | "craft" | "sacred_place" | "ritual" | "food" | "community" | "story";
  curiosityPrompt: string;
}

export interface CountryCulturalProfile {
  id: string;
  name: string;
  flag: string;
  region: EkaRegion;
  regionLabel: string;
  intro: string;
  heroImage: string;
  languages: string[];
  communities: string[];
  worldviews: string[];
  traditions: string[];
  festivals: string[];
  foodAndCrafts: string[];
  stories: CulturalStoryItem[];
  // Normalized Map coordinates for SVG pin placement (x: 0-100%, y: 0-100%)
  mapCoordinates: {
    x: number;
    y: number;
  };
}

export interface MapHotspotMarker {
  id: string;
  name: string;
  country: string;
  region: EkaRegion;
  type: "story" | "festival" | "tradition" | "sacred_place" | "craft" | "community" | "ritual" | "food";
  wonderQuestion: string;
  storyId: string;
  countryId: string;
  x: number; // Percentage on world map (0-100)
  y: number; // Percentage on world map (0-100)
  knowledgeSlug?: string;
  filterCategory?: string;
  stateOrDistrict?: string;
}

export const CULTURAL_MAP_FILTER_OPTIONS = [
  { id: "all", label: "All Layers", icon: "🌐" },
  { id: "spirituality", label: "Religion / Spirituality", icon: "🛕" },
  { id: "festivals", label: "Festivals", icon: "🎉" },
  { id: "traditions", label: "Traditions", icon: "🕯️" },
  { id: "food", label: "Food", icon: "🍛" },
  { id: "language", label: "Language", icon: "🗣️" },
  { id: "craft", label: "Craft", icon: "🧵" },
  { id: "music", label: "Music", icon: "🎵" },
  { id: "dance", label: "Dance", icon: "💃" },
  { id: "architecture", label: "Architecture", icon: "🏛️" },
  { id: "sacred_places", label: "Sacred Places", icon: "⛰️" },
  { id: "communities", label: "Communities", icon: "👥" },
  { id: "historical_events", label: "Historical Events", icon: "📜" },
  { id: "people", label: "People / Keepers", icon: "🧑‍🌾" },
  { id: "stories", label: "Cultural Stories", icon: "📖" },
] as const;

export type CulturalMapFilterId = (typeof CULTURAL_MAP_FILTER_OPTIONS)[number]["id"];

export const EKA_REGIONS: Array<{ id: EkaRegion; label: string; icon: string }> = [
  { id: "all", label: "All World", icon: "🌍" },
  { id: "india", label: "India", icon: "🇮🇳" },
  { id: "asia", label: "Asia", icon: "⛩️" },
  { id: "middle_east", label: "Middle East", icon: "🕌" },
  { id: "africa", label: "Africa", icon: "🦁" },
  { id: "europe", label: "Europe", icon: "🏛️" },
  { id: "americas", label: "Americas", icon: "🌽" },
  { id: "oceania", label: "Oceania", icon: "🌊" },
];

export const COUNTRY_PROFILES: CountryCulturalProfile[] = [
  // 1. INDIA
  {
    id: "india",
    name: "India",
    flag: "🇮🇳",
    region: "india",
    regionLabel: "South Asia / India",
    intro:
      "A civilization with hundreds of living cultures, thousands of languages and dialects, and an unbroken continuum of sacred rituals and crafts.",
    heroImage: "/places/kolkata.jpg",
    languages: ["Hindi", "Bengali", "Tamil", "Telugu", "Marathi", "Sanskrit", "Urdu", "Kannada", "Assamese"],
    communities: ["Bengali", "Tamil", "Punjabi", "Rajasthani", "Bishnoi", "Khasi", "Malayali", "Gujarati"],
    worldviews: ["Sanatana Dharma / Hinduism", "Buddhism", "Jainism", "Sikhism", "Sufism", "Tribal Animism"],
    traditions: ["Kashi Ganga Aarti", "Aranmula Sacred Mirrors", "Bishnoi Eco-Tenets", "Tamil Kolam Sacred Geometry"],
    festivals: ["Durga Puja", "Diwali", "Chhath Puja", "Bohag Bihu", "Jagannath Rath Yatra", "Pandharpur Vari"],
    foodAndCrafts: ["Patan Patola Double-Ikat", "Rogan Art", "Temple Prasadam Foodways", "Ayurvedic Culinary Rhythms"],
    mapCoordinates: { x: 67.5, y: 46.0 },
    stories: [
      {
        id: "durga-puja",
        title: "Durga Puja",
        place: "Kolkata, West Bengal",
        country: "India",
        wonderQuestion: "Why is Durga Puja celebrated as a daughter's homecoming?",
        summary: "A 5-day festival transforming Kolkata into the world's largest public art installation, celebrating Goddess Durga's return to her maternal home.",
        imageUrl: "/places/kolkata.jpg",
        category: "festival",
        curiosityPrompt: "Why do Bengalis immerse the Durga idol in water on the final day?",
      },
      {
        id: "diwali",
        title: "Diwali (Festival of Lights)",
        place: "Pan-India & Diaspora",
        country: "India",
        wonderQuestion: "Why do people light clay lamps (diyas)?",
        summary: "Illuminating homes to welcome divine grace, renew ethical intentions, and dispel inner darkness on the darkest autumn night.",
        imageUrl: "/content/ritual-lamp.jpg",
        category: "festival",
        curiosityPrompt: "How is Diwali celebrated differently between Tamil Nadu, Bengal, and Gujarat?",
      },
      {
        id: "kashi-ghats",
        title: "Dawn on the Ghats of Varanasi",
        place: "Varanasi, Uttar Pradesh",
        country: "India",
        wonderQuestion: "Why have fire and river rituals continued unbroken here for over 2,000 years?",
        summary: "Along the sacred crescent of the Ganga, continuous prayer, cremation, and Vedic chanting reflect the eternal cycle of life and dissolution.",
        imageUrl: "/places/varanasi.jpg",
        category: "sacred_place",
        curiosityPrompt: "What should someone understand before visiting the Kashi burning ghats?",
      },
    ],
  },

  // 2. JAPAN
  {
    id: "japan",
    name: "Japan",
    flag: "🇯🇵",
    region: "asia",
    regionLabel: "East Asia",
    intro:
      "A culture where reverence for nature (Shinto) seamlessly integrates with Zen stillness, seasonal sensitivity, and meticulous craftsmanship.",
    heroImage: "/places/kyoto.jpg",
    languages: ["Japanese", "Ainu", "Ryukyuan"],
    communities: ["Yamato", "Ainu of Hokkaido", "Okinawan", "Kyoto Artisan Guilds"],
    worldviews: ["Shinto Kami Reverence", "Zen Buddhism", "Pure Land Buddhism", "Confucian Ethics"],
    traditions: ["Chanoyu (The Way of Tea)", "Ise Jingu 20-Year Shikinen Sengu", "Karesansui Zen Rock Gardens"],
    festivals: ["Gion Matsuri in Kyoto", "Obon Ancestor Lanterns", "Hanami Cherry Blossom Gathering"],
    foodAndCrafts: ["Kaiseki Seasonal Gastronomy", "Kintsugi Gold Ceramic Repair", "Washi Papermaking", "Katana Forging"],
    mapCoordinates: { x: 84.5, y: 38.5 },
    stories: [
      {
        id: "japanese-tea-ceremony",
        title: "Japanese Tea Ceremony (Chanoyu)",
        place: "Kyoto",
        country: "Japan",
        wonderQuestion: "Why is tea more than a drink in Japan?",
        summary: "Sen no Rikyu's legacy of Wabi-cha teaches that sharing a simple bowl of matcha is an irreplaceable once-in-a-lifetime moment (Ichigo Ichie).",
        imageUrl: "/places/kyoto.jpg",
        category: "tradition",
        curiosityPrompt: "What is the meaning of entering a traditional Japanese tea room through a tiny crawl-in door?",
      },
      {
        id: "ryoanji-zen-garden",
        title: "The 15 Stones of Ryoan-ji",
        place: "Kyoto",
        country: "Japan",
        wonderQuestion: "Why can you never see all 15 stones from any single vantage point?",
        summary: "A dry landscape garden designed in the 15th century to reflect the incompleteness of the human ego without enlightenment.",
        imageUrl: "/content/still-water.jpg",
        category: "sacred_place",
        curiosityPrompt: "How does Zen gardening use empty raked gravel to represent moving water?",
      },
    ],
  },

  // 3. INDONESIA / BALI
  {
    id: "indonesia",
    name: "Indonesia (Bali)",
    flag: "🇮🇩",
    region: "asia",
    regionLabel: "Southeast Asia",
    intro:
      "An archipelago of 17,000 islands whose jewel Bali preserves Agama Hindu Dharma—a living harmony between humans, nature, and the unseen spirit realm.",
    heroImage: "/content/hero.jpg",
    languages: ["Bahasa Indonesia", "Balinese", "Javanese", "Sundanese"],
    communities: ["Balinese Subak Farmers", "Javanese Kejawen", "Toraja of Sulawesi", "Dayak of Borneo"],
    worldviews: ["Tri Hita Karana", "Agama Hindu Dharma", "Islam Nusantara", "Animist Marapu"],
    traditions: ["Subak Water Temple Irrigation", "Gamelan Polyphonic Orchestration", "Wayang Kulit Shadow Puppetry"],
    festivals: ["Nyepi (Day of Silence)", "Galungan & Kuningan", "Toraja Funeral Feasts"],
    foodAndCrafts: ["Balinese Batik Canting", "Woodcarving of Mas", "Canang Sari Daily Offerings"],
    mapCoordinates: { x: 79.5, y: 59.5 },
    stories: [
      {
        id: "balinese-nyepi",
        title: "Balinese Nyepi",
        place: "Bali",
        country: "Indonesia",
        wonderQuestion: "Why does Bali go silent for an entire day?",
        summary: "An island-wide 24-hour total halt to electricity, traffic, and international flights, resetting spiritual balance and purifying the skies.",
        imageUrl: "/content/hero.jpg",
        category: "ritual",
        curiosityPrompt: "What are the four sacred restrictions of Nyepi and what do the Ogoh-Ogoh monsters mean?",
      },
      {
        id: "subak-water-temples",
        title: "The Subak Democratic Water Temples",
        place: "Ubud & Jatiluwih, Bali",
        country: "Indonesia",
        wonderQuestion: "How do village priests manage an entire island's ecology through water democracy?",
        summary: "A 1,000-year-old egalitarian cooperative where water distribution is agreed upon inside shrines honoring the goddess of lakes.",
        imageUrl: "/content/still-water.jpg",
        category: "tradition",
        curiosityPrompt: "Why did modern Green Revolution chemicals fail until farmers returned to the Subak temple calendar?",
      },
    ],
  },

  // 4. KENYA & TANZANIA
  {
    id: "kenya",
    name: "Kenya & Tanzania (Maasai)",
    flag: "🇰🇪",
    region: "africa",
    regionLabel: "East Africa",
    intro:
      "Home to ancient pastoralists and coastal Swahili dhow trade, where community identity is preserved through oral songs, age cohorts, and beadwork.",
    heroImage: "/content/journey.jpg",
    languages: ["Swahili", "Maa", "Kikuyu", "Luo", "English"],
    communities: ["Maasai", "Samburu", "Swahili Coast Guilds", "Turkana", "Kikuyu"],
    worldviews: ["Enkai God of Rain & Cattle", "Ubuntu Communal Philosophy", "African Traditional Worldviews"],
    traditions: ["Eunoto Warrior Graduation", "Adumu Jumping Dance", "Age-Set Elders Councils"],
    festivals: ["Maasai Eunoto", "Lamu Cultural Festival", "Wildebeest Great Migration Rites"],
    foodAndCrafts: ["Maasai Beadwork Storytelling", "Kitenge Cloth Weaving", "Calabash Gourd Preservation"],
    mapCoordinates: { x: 57.0, y: 55.0 },
    stories: [
      {
        id: "maasai-traditions",
        title: "Maasai Living Traditions",
        place: "Rift Valley, Kenya & Tanzania",
        country: "Kenya",
        wonderQuestion: "How do Maasai communities preserve their traditions?",
        summary: "Semi-nomadic pastoralists living in symbiosis with lions and savannah ecology, maintaining warrior discipline and elder wisdom without fencing the land.",
        imageUrl: "/content/journey.jpg",
        category: "community",
        curiosityPrompt: "What should someone understand before visiting a Maasai cultural boma?",
      },
    ],
  },

  // 5. AOTEAROA NEW ZEALAND
  {
    id: "new-zealand",
    name: "Aotearoa New Zealand (Māori)",
    flag: "🇳🇿",
    region: "oceania",
    regionLabel: "Oceania & Polynesia",
    intro:
      "The land of the long white cloud, where the indigenous Māori maintain Tikanga, ancestral whakapapa genealogies, and deep kinship with sacred mountains and rivers.",
    heroImage: "/content/monastery-corridor.jpg",
    languages: ["Te Reo Māori", "English", "New Zealand Sign Language"],
    communities: ["Ngāi Tahu", "Waikato Tainui", "Ngāpuhi", "Te Arawa"],
    worldviews: ["Whakapapa (Universal Kinship)", "Kaitiakitanga (Guardianship of Earth)", "Mana and Tapu"],
    traditions: ["The Haka Ceremonial Dance", "Pōwhiri Marae Welcome", "Tā Moko Chiseled Markings"],
    festivals: ["Matariki (Māori New Year)", "Waitangi Commemorations", "Te Matatini Performing Arts"],
    foodAndCrafts: ["Hāngī Earth Oven Feasting", "Pounamu Greenstone Carving", "Waka Voyaging Canoes"],
    mapCoordinates: { x: 93.0, y: 82.0 },
    stories: [
      {
        id: "maori-culture",
        title: "Māori Culture & The Haka",
        place: "Rotorua & North Island",
        country: "Aotearoa New Zealand",
        wonderQuestion: "What does the haka mean, and how does whakapapa connect all living things?",
        summary: "A cultural worldview where every mountain, river, and human being shares a common ancestral descent, protected through guardianship rather than ownership.",
        imageUrl: "/content/monastery-corridor.jpg",
        category: "tradition",
        curiosityPrompt: "Why did New Zealand grant legal personhood to the Whanganui River based on Māori worldview?",
      },
    ],
  },

  // 6. MOROCCO & MIDDLE EAST
  {
    id: "morocco",
    name: "Morocco",
    flag: "🇲🇦",
    region: "middle_east",
    regionLabel: "North Africa / Maghreb",
    intro:
      "The crossroads of Andalusian architecture, Amazigh (Berber) desert heritage, and vibrant medina crafts centered on courtyard living and hospitality.",
    heroImage: "/places/marrakesh.jpg",
    languages: ["Arabic (Darija)", "Tamazight (Berber)", "French"],
    communities: ["Amazigh (Berbers)", "Fassi Artisan Guilds", "Sahrawi Nomads"],
    worldviews: ["Islamic Maliki Tradition", "Sufi Zawiyas", "Ancestral Berber Ecological Lore"],
    traditions: ["Zellij Geometry Tilework", "Traditional Medina Riads", "Gnawa Sacred Trance Healing"],
    festivals: ["Fez Sacred Music Festival", "Imilchil Marriage Moussem", "Gnaoua World Music Festival"],
    foodAndCrafts: ["Tagine & Mint Tea Hospitality", "Chouara Leather Tanning", "Argan Oil Extraction"],
    mapCoordinates: { x: 44.0, y: 38.0 },
    stories: [
      {
        id: "marrakesh-courtyard",
        title: "The Architecture of the Medina Courtyard",
        place: "Marrakesh Medina",
        country: "Morocco",
        wonderQuestion: "Why are traditional houses windowless to the street but completely open to the sky inside?",
        summary: "Centuries-old bioclimatic riads create cool private paradises inside bustling alleyways, centered on fountains that cool the air without machinery.",
        imageUrl: "/places/marrakesh.jpg",
        category: "sacred_place",
        curiosityPrompt: "What is the cultural philosophy behind Moroccan mint tea hospitality?",
      },
    ],
  },

  // 7. GREECE & EUROPE
  {
    id: "greece",
    name: "Greece (Mount Athos)",
    flag: "🇬🇷",
    region: "europe",
    regionLabel: "Southern Europe",
    intro:
      "The cradle of Mediterranean philosophy, classical arts, and the preserved 1,000-year-old contemplative monastic republic of Mount Athos.",
    heroImage: "/content/reading-table.jpg",
    languages: ["Greek", "Church Slavonic"],
    communities: ["Athonite Monks", "Cretan Mountain Clans", "Aegean Island Mariners"],
    worldviews: ["Eastern Orthodox Hesychasm", "Ancient Hellenic Philosophy"],
    traditions: ["Hesychasm Heart Prayer in Silence", "Byzantine Iconography", "Island Panigiri Feasts"],
    festivals: ["Orthodox Holy Pascha", "Feast of the Dormition", "Olive Harvest Gatherings"],
    foodAndCrafts: ["Olive Oil and Bread Rites", "Beeswax Incense Making", "Byzantine Chanting"],
    mapCoordinates: { x: 53.0, y: 35.0 },
    stories: [
      {
        id: "mount-athos-stillness",
        title: "The Contemplative Stillness of Mount Athos",
        place: "Athos Peninsula",
        country: "Greece",
        wonderQuestion: "How has a mountain community lived by Byzantine clock rhythms without change since 963 CE?",
        summary: "Twenty historic monasteries where time is measured from sunset, preserving continuous manuscript copying and unceasing prayer.",
        imageUrl: "/content/reading-table.jpg",
        category: "sacred_place",
        curiosityPrompt: "What is Hesychasm and how does it relate to silent mindfulness across other cultures?",
      },
    ],
  },

  // 8. MEXICO & AMERICAS
  {
    id: "mexico",
    name: "Mexico",
    flag: "🇲🇽",
    region: "americas",
    regionLabel: "Mesoamerica",
    intro:
      "A rich synthesis of Maya and Zapotec cosmovisions with vibrant colonial traditions, honoring ancestors through color, culinary memory, and woven storytelling.",
    heroImage: "/content/observe.jpg",
    languages: ["Spanish", "Nahuatl", "Maya", "Zapotec", "Mixtec"],
    communities: ["Oaxacan Zapotec", "Yucatan Maya", "Huichol (Wixárika)", "Tarahumara (Rarámuri)"],
    worldviews: ["Mesoamerican Cosmovision", "Syncretic Catholicism", "Sacred Corn Reverence"],
    traditions: ["Día de los Muertos Altars", "Guelaguetza Communal Sharing", "Talavera Ceramics"],
    festivals: ["Día de los Muertos", "La Guelaguetza in Oaxaca", "Semana Santa"],
    foodAndCrafts: ["Sacred Mole & Heritage Corn", "Alebrije Folk Carvings", "Cochineal Red Dye Weaving"],
    mapCoordinates: { x: 23.0, y: 45.0 },
    stories: [
      {
        id: "dia-de-los-muertos",
        title: "Día de los Muertos (Day of the Dead)",
        place: "Oaxaca & Michoacán",
        country: "Mexico",
        wonderQuestion: "Why do families build multi-tiered altars for the departed?",
        summary: "Instead of fearing death, Mexican communities lay out marigold pathways, copal incense, and favorite foods to feast joyfully with returning spirits.",
        imageUrl: "/content/observe.jpg",
        category: "festival",
        curiosityPrompt: "Why are yellow marigolds considered the flower of the dead?",
      },
      {
        id: "hopi-corn-covenant",
        title: "The Hopi Dry-Farming Covenant with Corn",
        place: "Black Mesa, Arizona, USA",
        country: "Americas",
        wonderQuestion: "How do indigenous farmers grow sweet corn in arid deserts without irrigation?",
        summary: "Planting seeds up to a foot deep into sand, relying on spiritual humility and rain songs passed down for over a thousand years.",
        imageUrl: "/content/today-reflection.jpg",
        category: "tradition",
        curiosityPrompt: "Why do indigenous Hopi call themselves custodians of the earth rather than owners?",
      },
    ],
  },
];

// Curated Map Hotspots with precise percentage coordinates on the world map
export const MAP_HOTSPOTS: MapHotspotMarker[] = [
  {
    id: "spot-kolkata",
    name: "Durga Puja & Bengali Wedding Rites",
    country: "India",
    region: "india",
    type: "tradition",
    wonderQuestion: "Why is the bride carried on a pidi and how do Streearchar rites work?",
    storyId: "bengali-wedding",
    countryId: "india",
    x: 69.5,
    y: 45.0,
    knowledgeSlug: "bengali-wedding",
    filterCategory: "traditions",
    stateOrDistrict: "West Bengal, Kolkata",
  },
  {
    id: "spot-varanasi",
    name: "Varanasi (Kashi) Ghats & Silk Weavers",
    country: "India",
    region: "india",
    type: "sacred_place",
    wonderQuestion: "Why is Varanasi considered the threshold where life meets eternity?",
    storyId: "varanasi",
    countryId: "india",
    x: 67.5,
    y: 43.5,
    knowledgeSlug: "varanasi",
    filterCategory: "sacred_places",
    stateOrDistrict: "Uttar Pradesh, Varanasi",
  },
  {
    id: "spot-bhoota-kola",
    name: "Bhoota Kola Spirit Justice",
    country: "India",
    region: "india",
    type: "ritual",
    wonderQuestion: "What is Bhoota Kola and how do forest spirits mediate village justice?",
    storyId: "bhoota-kola",
    countryId: "india",
    x: 66.8,
    y: 52.0,
    knowledgeSlug: "bhoota-kola",
    filterCategory: "traditions",
    stateOrDistrict: "Coastal Karnataka, Udupi & Mangaluru",
  },
  {
    id: "spot-ayodhya",
    name: "Ayodhya & Clay Diya Guilds",
    country: "India",
    region: "india",
    type: "festival",
    wonderQuestion: "Why do millions of families light terracotta lamps at dusk for Diwali?",
    storyId: "diwali",
    countryId: "india",
    x: 67.8,
    y: 43.0,
    knowledgeSlug: "diwali",
    filterCategory: "festivals",
    stateOrDistrict: "Uttar Pradesh, Ayodhya",
  },
  {
    id: "spot-patan",
    name: "Patan Patola Double-Ikat",
    country: "India",
    region: "india",
    type: "craft",
    wonderQuestion: "What mathematical geometry guides the Salvi weavers of Gujarat?",
    storyId: "patan-patola",
    countryId: "india",
    x: 64.5,
    y: 45.5,
    knowledgeSlug: "patan-patola",
    filterCategory: "craft",
    stateOrDistrict: "Gujarat, Patan",
  },
  {
    id: "spot-aranmula",
    name: "Aranmula Sacred Metal Mirror",
    country: "India",
    region: "india",
    type: "craft",
    wonderQuestion: "What is the secret metallurgy behind the front-reflecting metal mirror?",
    storyId: "aranmula-kannadi",
    countryId: "india",
    x: 67.0,
    y: 55.0,
    knowledgeSlug: "aranmula-kannadi",
    filterCategory: "craft",
    stateOrDistrict: "Kerala, Pathanamthitta",
  },
  {
    id: "spot-bishnoi",
    name: "Bishnoi 29 Eco-Tenets",
    country: "India",
    region: "india",
    type: "community",
    wonderQuestion: "How do the Bishnoi protect desert wildlife as sacred family?",
    storyId: "bishnoi-conservation",
    countryId: "india",
    x: 64.8,
    y: 43.8,
    knowledgeSlug: "bishnoi-conservation",
    filterCategory: "communities",
    stateOrDistrict: "Rajasthan, Thar Desert",
  },
  {
    id: "spot-kyoto",
    name: "Ojigi Bowing & Zen Gardens",
    country: "Japan",
    region: "asia",
    type: "tradition",
    wonderQuestion: "Why do Japanese bow and what does embodied Kokoro mindfulness mean?",
    storyId: "ojigi",
    countryId: "japan",
    x: 84.5,
    y: 38.5,
    knowledgeSlug: "ojigi",
    filterCategory: "traditions",
    stateOrDistrict: "Kansai, Kyoto",
  },
  {
    id: "spot-bali",
    name: "Balinese Nyepi & Subak",
    country: "Indonesia",
    region: "asia",
    type: "ritual",
    wonderQuestion: "Why does Bali go completely silent for 24 hours?",
    storyId: "balinese-nyepi",
    countryId: "indonesia",
    x: 79.5,
    y: 59.5,
    knowledgeSlug: "balinese-nyepi",
    filterCategory: "spirituality",
    stateOrDistrict: "Bali",
  },
  {
    id: "spot-marrakesh",
    name: "Medina Courtyards & Riads",
    country: "Morocco",
    region: "middle_east",
    type: "sacred_place",
    wonderQuestion: "Why are traditional houses windowless to the street?",
    storyId: "marrakesh-courtyard",
    countryId: "morocco",
    x: 44.0,
    y: 38.0,
    knowledgeSlug: "marrakesh-courtyard",
    filterCategory: "architecture",
    stateOrDistrict: "Marrakesh-Safi",
  },
  {
    id: "spot-oaxaca",
    name: "Día de los Muertos Altars",
    country: "Mexico",
    region: "americas",
    type: "festival",
    wonderQuestion: "Why do families build multi-tiered altars for the departed?",
    storyId: "dia-de-los-muertos",
    countryId: "mexico",
    x: 23.0,
    y: 45.0,
    knowledgeSlug: "dia-de-los-muertos",
    filterCategory: "festivals",
    stateOrDistrict: "Oaxaca",
  },
];

/**
 * Search the global map dataset by country, culture, tradition, or place
 */
export function searchGlobalCulturalMap(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return { matchedCountry: COUNTRY_PROFILES[0], matchedStory: undefined, filteredHotspots: MAP_HOTSPOTS };

  // 1. Check stories
  for (const country of COUNTRY_PROFILES) {
    for (const story of country.stories) {
      if (
        story.title.toLowerCase().includes(q) ||
        story.place.toLowerCase().includes(q) ||
        story.wonderQuestion.toLowerCase().includes(q) ||
        story.summary.toLowerCase().includes(q)
      ) {
        return {
          matchedCountry: country,
          matchedStory: story,
          filteredHotspots: MAP_HOTSPOTS.filter((h) => h.countryId === country.id || h.storyId === story.id),
        };
      }
    }
  }

  // 2. Check countries, communities, languages, traditions
  for (const country of COUNTRY_PROFILES) {
    const textBlob = `${country.name} ${country.regionLabel} ${country.intro} ${country.languages.join(" ")} ${country.communities.join(" ")} ${country.traditions.join(" ")} ${country.festivals.join(" ")}`.toLowerCase();
    if (textBlob.includes(q)) {
      return {
        matchedCountry: country,
        matchedStory: country.stories[0],
        filteredHotspots: MAP_HOTSPOTS.filter((h) => h.countryId === country.id),
      };
    }
  }

  // 3. Fallback
  return {
    matchedCountry: COUNTRY_PROFILES[0],
    matchedStory: COUNTRY_PROFILES[0]?.stories[0],
    filteredHotspots: MAP_HOTSPOTS,
  };
}
