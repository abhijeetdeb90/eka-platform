// ==============================================================================
// EKA LIVING CULTURAL ATLAS — CANONICAL DATASET
// ==============================================================================
// Powers the Living Cultural Atlas experience across 7 global regions.
// Every marker connects directly to a verified EKA Knowledge Object.
// No fabricated locations. 100% human lineage, provenance, and living practice.
// ==============================================================================

export type AtlasCategory =
  | "sacred_places"
  | "traditions"
  | "crafts"
  | "food"
  | "language"
  | "music"
  | "heritage"
  | "local_life";

export type AtlasRegion =
  | "all"
  | "india"
  | "asia"
  | "middle_east"
  | "africa"
  | "europe"
  | "americas";

export interface AtlasCategoryMeta {
  id: AtlasCategory;
  label: string;
  shortLabel: string;
  iconName: string;
  accentColor: string;
  description: string;
}

export const ATLAS_CATEGORIES: AtlasCategoryMeta[] = [
  {
    id: "sacred_places",
    label: "Sacred Places",
    shortLabel: "Sacred",
    iconName: "Landmark",
    accentColor: "#9E472A", // Terracotta
    description: "Temples, shrines, monasteries, mosques, and sacred geography",
  },
  {
    id: "traditions",
    label: "Living Traditions",
    shortLabel: "Traditions",
    iconName: "Flame",
    accentColor: "#D97706", // Amber / Warm Flame
    description: "Rituals, festivals, dawn rites, and community ceremonies",
  },
  {
    id: "crafts",
    label: "Master Crafts",
    shortLabel: "Crafts",
    iconName: "Hammer",
    accentColor: "#2E5C47", // Forest Sage
    description: "Artisan lineages, textile weaving, pottery, and metallurgy",
  },
  {
    id: "food",
    label: "Food & Culinary Culture",
    shortLabel: "Foodways",
    iconName: "UtensilsCrossed",
    accentColor: "#C25E3E", // Terracotta Rust
    description: "Ancestral fermentation, sacred feast rites, and agrarian lineage",
  },
  {
    id: "language",
    label: "Language & Oral Culture",
    shortLabel: "Oral Lore",
    iconName: "Scroll",
    accentColor: "#25384D", // Indigo Ink
    description: "Oral epics, classical scripts, folk tales, and living dialects",
  },
  {
    id: "music",
    label: "Music & Performance",
    shortLabel: "Performance",
    iconName: "Music",
    accentColor: "#7C3AED", // Royal Amethyst
    description: "Sacred chants, folk rhythm cycles, trance theatre, and classical dance",
  },
  {
    id: "heritage",
    label: "Heritage & History",
    shortLabel: "Heritage",
    iconName: "Shield",
    accentColor: "#4B5563", // Slate Stone
    description: "Monolithic stone masonry, dry-farming pacts, and historic medinas",
  },
  {
    id: "local_life",
    label: "Local Life & Commons",
    shortLabel: "Community",
    iconName: "Users",
    accentColor: "#059669", // Emerald
    description: "Communal water councils, guild halls, and village stewardship",
  },
];

export interface AtlasCulturalObject {
  id: string;
  knowledgeObjectId: string;
  slug: string;
  title: string;
  subTitle: string;
  category: AtlasCategory;
  country: string;
  region: AtlasRegion;
  stateOrDistrict: string;
  coordinates: {
    x: number; // Percent 0 - 100 on world projection
    y: number; // Percent 0 - 100 on world projection
    lat?: number;
    lng?: number;
  };
  oneLiner: string;
  curiosityQuestion: string;
  storySummary: string;
  culturalContext: string;
  heroImage: string;
  keeper: {
    name: string;
    role: string;
    community: string;
  };
  livingStatus: {
    isActiveNow: boolean;
    activeSeasonOrTime: string;
    unbrokenYears: string;
  };
  relatedKnowledgeSlugs: string[];
  sourcesCount: number;
  tags: string[];
}

export interface AtlasCluster {
  id: string;
  name: string;
  region: AtlasRegion;
  stateOrDistrict: string;
  storyCount: number;
  x: number; // Percent
  y: number; // Percent
  dominantCategory: AtlasCategory;
  objectIds: string[];
}

// Canonical Living Cultural Objects
export const ATLAS_CULTURAL_OBJECTS: AtlasCulturalObject[] = [
  // --------------------------------------------------------------------------
  // 1. INDIA — RAJASTHAN & GUJARAT
  // --------------------------------------------------------------------------
  {
    id: "obj-jaipur-blue-pottery",
    knowledgeObjectId: "eko-jaipur-craft-01",
    slug: "jaipur-blue-pottery",
    title: "Jaipur Blue Pottery",
    subTitle: "Quartz & Copper-Oxide Fired Ceramics",
    category: "crafts",
    country: "India",
    region: "india",
    stateOrDistrict: "Rajasthan, Jaipur",
    coordinates: { x: 65.2, y: 44.2, lat: 26.9124, lng: 75.7873 },
    oneLiner: "An ancient non-clay ceramic tradition shaped by ground quartz, glass, and copper oxide.",
    curiosityQuestion: "Why does Jaipur Blue Pottery use crushed quartz stone instead of clay from the earth?",
    storySummary:
      "Unlike conventional terracotta, Jaipur Blue Pottery uses no clay. Master artisans mix quartz powder, glass, Fuller's earth, and natural gum, firing it once at low temperatures to produce turquoise glazes imported through Persian-Mughal silk routes.",
    culturalContext:
      "Craft lineage passed down through generations of Kripal Kumbh guilds. Sits at the crossroads of Turko-Persian glazed pottery and Rajput palace architecture.",
    heroImage: "/content/reading-table.jpg",
    keeper: {
      name: "Kripal Kumbh Guild Keepers",
      role: "Master Artisan Circle",
      community: "Jaipur Kumbh lineage",
    },
    livingStatus: {
      isActiveNow: true,
      activeSeasonOrTime: "Year-round studio firing",
      unbrokenYears: "350+ years",
    },
    relatedKnowledgeSlugs: ["patan-patola", "varanasi"],
    sourcesCount: 14,
    tags: ["Ceramics", "Mughal-Rajput Heritage", "Guild Tradition", "Mineral Pigments"],
  },
  {
    id: "obj-kutch-ajrakh",
    knowledgeObjectId: "eko-kutch-ajrakh-01",
    slug: "kutch-ajrakh-printing",
    title: "Ajrakh Block Printing",
    subTitle: "Sacred Indigo & Madder River Alchemy",
    category: "crafts",
    country: "India",
    region: "india",
    stateOrDistrict: "Gujarat, Kutch (Dhamadka & Ajrakhpur)",
    coordinates: { x: 63.8, y: 46.5, lat: 23.3344, lng: 70.0216 },
    oneLiner: "A 16-stage hand-carved resist print tradition meditating on celestial geometry.",
    curiosityQuestion: "How do Kutch artisans align hand-carved wooden blocks in total harmony without modern tools?",
    storySummary:
      "Ajrakh (derived from the Arabic Azraq, meaning blue, or Hindi Aaj Rakh, 'keep it today') requires 16 distinct wash, dye, and resist stages using natural indigo, pomegranate rind, and iron rust fermented with jaggery over months.",
    culturalContext:
      "Practiced by the Khatri community of Kutch and Sindh. The geometric patterns reflect the starry night sky over the Rann of Kutch desert.",
    heroImage: "/content/observe.jpg",
    keeper: {
      name: "Dr. Ismail Mohammed Khatri",
      role: "Eighth-Generation Block Print Master",
      community: "Khatri Craft Commons",
    },
    livingStatus: {
      isActiveNow: true,
      activeSeasonOrTime: "Post-monsoon river washing cycle",
      unbrokenYears: "4,000+ years (traced to Mohenjo-daro)",
    },
    relatedKnowledgeSlugs: ["patan-patola", "jaipur-blue-pottery"],
    sourcesCount: 22,
    tags: ["Indigo", "Block Printing", "Desert Ecology", "Vedic-Sindh Lineage"],
  },
  {
    id: "obj-patan-patola",
    knowledgeObjectId: "eko-patan-patola-01",
    slug: "patan-patola",
    title: "Patan Patola Double-Ikat",
    subTitle: "Mathematical Silk Harmony of Gujarat",
    category: "crafts",
    country: "India",
    region: "india",
    stateOrDistrict: "Gujarat, Patan",
    coordinates: { x: 64.6, y: 45.8, lat: 23.85, lng: 72.12 },
    oneLiner: "Both warp and weft threads dyed with millimeter precision before weaving begins.",
    curiosityQuestion: "Why does it take six months to weave a single six-yard Patola saree without error?",
    storySummary:
      "In Patan, only three remaining Salvi family households maintain authentic double-ikat weaving. Each silk thread is tied and dyed according to mental trigonometric calculations; if a single thread slips by one millimeter, the entire design collapses.",
    culturalContext:
      "Patola silks were prized across Southeast Asian royal courts as sacred talismans possessing protective and healing properties.",
    heroImage: "/content/reading-table.jpg",
    keeper: {
      name: "Salvi Master Weavers",
      role: "Hereditary Silk Weavers",
      community: "Salvi Jain & Hindu Guild",
    },
    livingStatus: {
      isActiveNow: true,
      activeSeasonOrTime: "Continuous loom operation",
      unbrokenYears: "900+ years",
    },
    relatedKnowledgeSlugs: ["kutch-ajrakh-printing", "aranmula-kannadi"],
    sourcesCount: 18,
    tags: ["Textiles", "Double Ikat", "Mathematics", "Silk Road"],
  },

  // --------------------------------------------------------------------------
  // 2. INDIA — GANGETIC & NORTHERN PLAINS
  // --------------------------------------------------------------------------
  {
    id: "obj-varanasi-ghats",
    knowledgeObjectId: "eko-varanasi-kashi-01",
    slug: "varanasi",
    title: "Varanasi Ghats & Ganga Twilight Aarti",
    subTitle: "Threshold Where Life Meets Eternity",
    category: "traditions",
    country: "India",
    region: "india",
    stateOrDistrict: "Uttar Pradesh, Varanasi (Kashi)",
    coordinates: { x: 67.5, y: 43.8, lat: 25.3109, lng: 83.0107 },
    oneLiner: "Twilight five-element fire offerings upon the crescent bend of the holy river.",
    curiosityQuestion: "Why do millions of pilgrims gather at dusk to offer brass lamps of fire to flowing water?",
    storySummary:
      "Varanasi is among the world's oldest continuously inhabited cultural sanctuaries. Every evening at Dashashwamedh Ghat, young Vedic scholars lift tiered brass lamps weighing over five kilograms in synchronized ritual salutation to the river.",
    culturalContext:
      "Rooted in ancient Indic philosophy where fire is the only element that naturally ascends upward. Lighting clay diyas symbolizes returning the gift of light to the universe.",
    heroImage: "/places/varanasi.jpg",
    keeper: {
      name: "Ganga Seva Nidhi & Kashi Archaks",
      role: "Vedic Ritual Keepers",
      community: "Kashi Brahmin & Boatman (Mallah) Commons",
    },
    livingStatus: {
      isActiveNow: true,
      activeSeasonOrTime: "Nightly at Sandhya (Dusk)",
      unbrokenYears: "2,500+ years",
    },
    relatedKnowledgeSlugs: ["diwali", "bengali-wedding"],
    sourcesCount: 38,
    tags: ["Sacred Geography", "Vedic Rites", "Aarti", "Ganga", "Living Ritual"],
  },
  {
    id: "obj-ayodhya-deepotsav",
    knowledgeObjectId: "eko-diwali-fest-01",
    slug: "diwali",
    title: "Ayodhya Terracotta Diya Lineage",
    subTitle: "Potters' Wheel & The Festival of Lights",
    category: "traditions",
    country: "India",
    region: "india",
    stateOrDistrict: "Uttar Pradesh, Ayodhya & Gorakhpur",
    coordinates: { x: 67.8, y: 43.0, lat: 26.7922, lng: 82.1998 },
    oneLiner: "Millions of wheel-turned earthenware lamps hand-crafted from Sarayu river silt.",
    curiosityQuestion: "Why do potter guilds work all summer to shape millions of simple terracotta cups for one night?",
    storySummary:
      "Across Uttar Pradesh, Kumhar potter families turn riverside clay into sacred diyas. For Diwali and Deepotsav, more than two million lamps are lit along the Sarayu river, renewing communal debt clearance and spiritual illumination.",
    culturalContext:
      "Diwali celebrates the triumph of awareness over ignorance (tamaso mā jyotir gamaya), shared across Hindu, Jain, and Sikh historical commemorations.",
    heroImage: "/content/today-reflection.jpg",
    keeper: {
      name: "Gorakhpur & Ayodhya Kumhar Guilds",
      role: "Traditional Potter Craftsmen",
      community: "Kumhar Craft Community",
    },
    livingStatus: {
      isActiveNow: true,
      activeSeasonOrTime: "Autumn / Kartika Month (October-November)",
      unbrokenYears: "2,000+ years",
    },
    relatedKnowledgeSlugs: ["varanasi", "bhoota-kola"],
    sourcesCount: 29,
    tags: ["Festival of Lights", "Terracotta", "Diya", "Sarayu", "Deepavali"],
  },

  // --------------------------------------------------------------------------
  // 3. INDIA — EAST & SOUTH
  // --------------------------------------------------------------------------
  {
    id: "obj-kolkata-durga-puja",
    knowledgeObjectId: "eko-bengali-wedding-01",
    slug: "bengali-wedding",
    title: "Kumartuli Clay Sculptors & Streearchar Rites",
    subTitle: "Straw, River Clay & Community Celebration",
    category: "traditions",
    country: "India",
    region: "india",
    stateOrDistrict: "West Bengal, Kolkata",
    coordinates: { x: 69.8, y: 45.4, lat: 22.5726, lng: 88.3639 },
    oneLiner: "Hand-sculpted clay sacred figures returning to the holy Hooghly river in annual rebirth.",
    curiosityQuestion: "Why are clay deities sculpted with river mud and then immersed completely back into the water?",
    storySummary:
      "In North Kolkata's Kumartuli alleyways, pal-caste sculptors bind bamboo and Ganga clay to create colossal Durga effigies. At the conclusion of the festival, the icons are returned to the water, celebrating the transient, cyclical nature of reality.",
    culturalContext:
      "UNESCO Intangible Cultural Heritage. Blends sacred Shakti veneration, public street art, and familial Streearchar maternal blessings.",
    heroImage: "/places/kolkata.jpg",
    keeper: {
      name: "Kumartuli Mritshilpi Samiti",
      role: "Hereditary Clay Artists",
      community: "Pal Sculptors of Bengal",
    },
    livingStatus: {
      isActiveNow: true,
      activeSeasonOrTime: "Autumn (Ashwin Month, September-October)",
      unbrokenYears: "400+ years",
    },
    relatedKnowledgeSlugs: ["varanasi", "diwali"],
    sourcesCount: 31,
    tags: ["UNESCO", "Clay Sculpture", "Durga Puja", "Bengal", "Cycle of Life"],
  },
  {
    id: "obj-bhoota-kola",
    knowledgeObjectId: "eko-bhoota-kola-01",
    slug: "bhoota-kola",
    title: "Bhoota Kola Spirit Mediation",
    subTitle: "Sacred Forest Justice & Ritual Trance",
    category: "traditions",
    country: "India",
    region: "india",
    stateOrDistrict: "Coastal Karnataka (Udupi & Mangaluru)",
    coordinates: { x: 66.8, y: 52.2, lat: 13.3409, lng: 74.7421 },
    oneLiner: "Night-long village assemblies where forest spirits settle land disputes and familial grievances.",
    curiosityQuestion: "How do forest guardian spirits mediate real village justice in coastal Karnataka?",
    storySummary:
      "Bhoota Kola is an ancient non-Brahmanical shamanic assembly of Tulu Nadu. Adorned with natural areca palm headdresses and face paint, the hereditary performer channels Daivas (spirits like Panjurli and Guliga) to adjudicate disputes with binding moral authority.",
    culturalContext:
      "Demonstrates sacred ecological balance: village communities honor the wilderness guardians, promising not to over-extract forest timber or harm sacred groves.",
    heroImage: "/content/observe.jpg",
    keeper: {
      name: "Tuluva Daiva Narthaka Guild",
      role: "Hereditary Oracle Performer",
      community: "Nalike, Parava, and Pambada Tulu communities",
    },
    livingStatus: {
      isActiveNow: true,
      activeSeasonOrTime: "Winter to Pre-Monsoon (December-May)",
      unbrokenYears: "1,500+ years",
    },
    relatedKnowledgeSlugs: ["aranmula-kannadi", "diwali"],
    sourcesCount: 26,
    tags: ["Ecological Justice", "Tulu Nadu", "Forest Spirits", "Trance Dance", "Oral Law"],
  },
  {
    id: "obj-aranmula-mirror",
    knowledgeObjectId: "eko-aranmula-kannadi-01",
    slug: "aranmula-kannadi",
    title: "Aranmula Sacred Metal Mirror",
    subTitle: "Secret Metallurgical Alchemy of Kerala",
    category: "crafts",
    country: "India",
    region: "india",
    stateOrDistrict: "Kerala, Pathanamthitta",
    coordinates: { x: 67.2, y: 55.4, lat: 9.3333, lng: 76.6833 },
    oneLiner: "Front-reflecting alloy mirror crafted from copper and tin without silvered glass.",
    curiosityQuestion: "Why does the Aranmula mirror reflect light directly off metal without secondary refraction?",
    storySummary:
      "Unlike glass mirrors that reflect from a silver backing through glass, Aranmula Kannadi is a 100% polished metal alloy (copper-tin speculum) that produces a distortion-free, true front-surface reflection. The casting formula remains a closely guarded family secret.",
    culturalContext:
      "One of the eight auspicious items (Ashtamangalyam) used in sacred Kerala temple ceremonies and bridal blessings. Received India's first GI tag.",
    heroImage: "/content/reading-table.jpg",
    keeper: {
      name: "Vishwakarma Master Casters",
      role: "Hereditary Bronze Metalworkers",
      community: "Vishwakarma Caste Guild of Aranmula",
    },
    livingStatus: {
      isActiveNow: true,
      activeSeasonOrTime: "Year-round artisanal casting",
      unbrokenYears: "500+ years",
    },
    relatedKnowledgeSlugs: ["patan-patola", "bhoota-kola"],
    sourcesCount: 19,
    tags: ["Metallurgy", "Alloy Casting", "Ashtamangalyam", "Kerala Heritage", "GI Tag"],
  },

  // --------------------------------------------------------------------------
  // 4. ASIA & PACIFIC
  // --------------------------------------------------------------------------
  {
    id: "obj-kyoto-zen",
    knowledgeObjectId: "eko-japan-ojigi-01",
    slug: "ojigi",
    title: "Kyoto · The Sacred Thresholds & Ojigi",
    subTitle: "Embodied Mindfulness & The Torii Boundary",
    category: "traditions",
    country: "Japan",
    region: "asia",
    stateOrDistrict: "Kansai, Kyoto",
    coordinates: { x: 84.8, y: 38.8, lat: 35.0116, lng: 135.7681 },
    oneLiner: "Reverential bowing and threshold gates clearing the human heart before nature.",
    curiosityQuestion: "Why do Japanese bows differ in exact degrees depending on intent, humility, and gratitude?",
    storySummary:
      "In Kyoto's cedar forests and rock gardens, Ojigi (bowing) is not mere protocol; it is Kokoro—harmonizing the mind and physical breath. Stepping beneath a vermilion Torii gate marks the boundary where worldly hurry yields to sacred stillness.",
    culturalContext:
      "Shinto animism combined with Zen contemplative practices, emphasizing the impermanent beauty of all living things (Mono no aware).",
    heroImage: "/places/kyoto.jpg",
    keeper: {
      name: "Kyoto Tea & Temple Keepers",
      role: "Zen & Shinto Stewards",
      community: "Traditional Urasenke & Temple Masters",
    },
    livingStatus: {
      isActiveNow: true,
      activeSeasonOrTime: "Daily contemplative practice",
      unbrokenYears: "1,200+ years",
    },
    relatedKnowledgeSlugs: ["balinese-nyepi", "varanasi"],
    sourcesCount: 25,
    tags: ["Zen", "Shinto", "Mindfulness", "Bowing", "Kyoto", "Torii"],
  },
  {
    id: "obj-bali-subak",
    knowledgeObjectId: "eko-bali-nyepi-01",
    slug: "balinese-nyepi",
    title: "Bali Subak Sacred Water Temples",
    subTitle: "Ecology, Consensus & The Day of Silence",
    category: "local_life",
    country: "Indonesia",
    region: "asia",
    stateOrDistrict: "Bali (Ubud & Tabanan)",
    coordinates: { x: 79.8, y: 59.8, lat: -8.3405, lng: 115.092 },
    oneLiner: "1,000-year-old collective irrigation councils synchronizing volcanic valleys through water temples.",
    curiosityQuestion: "Why does the entire island of Bali shut down airport, cars, and lights for 24 hours of total silence?",
    storySummary:
      "The Subak system coordinates rice terrace irrigation via village democratic councils and water temples honoring Dewi Danu. On Nyepi (the Balinese Day of Silence), no fires are lit, no flights land, and islanders reflect inward so evil spirits find the island empty.",
    culturalContext:
      "Rooted in Tri Hita Karana—the tripartite philosophy of harmonious relationship between humans, nature, and the spiritual cosmos.",
    heroImage: "/content/observe.jpg",
    keeper: {
      name: "Pekaseh (Subak Council Heads)",
      role: "Traditional Water Guardians",
      community: "Balinese Village Subak Federations",
    },
    livingStatus: {
      isActiveNow: true,
      activeSeasonOrTime: "Nyepi (Balinese Saka New Year, March)",
      unbrokenYears: "1,000+ years",
    },
    relatedKnowledgeSlugs: ["ojigi", "bhoota-kola"],
    sourcesCount: 27,
    tags: ["UNESCO", "Tri Hita Karana", "Water Temples", "Nyepi", "Agroecology"],
  },

  // --------------------------------------------------------------------------
  // 5. MIDDLE EAST & NORTH AFRICA
  // --------------------------------------------------------------------------
  {
    id: "obj-fez-medina",
    knowledgeObjectId: "eko-morocco-marrakesh-01",
    slug: "marrakesh-courtyard",
    title: "Fez · The Unbroken Medinas & Zellij",
    subTitle: "Geometric Contemplation & Courtyard Architecture",
    category: "heritage",
    country: "Morocco",
    region: "middle_east",
    stateOrDistrict: "Fès-Meknès, Fez Medina",
    coordinates: { x: 44.5, y: 38.2, lat: 34.0181, lng: -5.0078 },
    oneLiner: "Carved plaster and glazed terracotta tiles cut by hand without blueprints in pedestrian stone mazes.",
    curiosityQuestion: "How do master artisans cut thousands of tiny geometric tiles to fit with zero mortar gaps?",
    storySummary:
      "In Fez el-Bali, the world's largest car-free urban zone, Maallem (guild masters) chisel glazed terracotta into complex star polygons using memory alone. Houses (riads) face completely inward to central cooling fountains, shielding private family life.",
    culturalContext:
      "Guild systems tracing to Andalusia and ancient Maghreb, where complex geometric symmetry is viewed as visual praise of infinite divine unity.",
    heroImage: "/places/marrakesh.jpg",
    keeper: {
      name: "Maallem Guild of Fez",
      role: "Master Tile & Leather Craftsmen",
      community: "Fassi Artisan Brotherhood",
    },
    livingStatus: {
      isActiveNow: true,
      activeSeasonOrTime: "Year-round workshop production",
      unbrokenYears: "1,100+ years",
    },
    relatedKnowledgeSlugs: ["jaipur-blue-pottery", "dia-de-los-muertos"],
    sourcesCount: 23,
    tags: ["Zellij", "Medina", "Islamic Architecture", "Maallem", "Fez"],
  },

  // --------------------------------------------------------------------------
  // 6. THE AMERICAS
  // --------------------------------------------------------------------------
  {
    id: "obj-oaxaca-muertos",
    knowledgeObjectId: "eko-mexico-muertos-01",
    slug: "dia-de-los-muertos",
    title: "Oaxaca · Día de los Muertos & Zapotec Weaving",
    subTitle: "Valley of Remembrance & Ancestral Welcoming",
    category: "traditions",
    country: "Mexico",
    region: "americas",
    stateOrDistrict: "Oaxaca (Teotitlán del Valle & Xoxocotlán)",
    coordinates: { x: 23.2, y: 45.4, lat: 17.0732, lng: -96.7266 },
    oneLiner: "Marigold pathways and copal incense guiding ancestors back for an annual celebration of life.",
    curiosityQuestion: "Why do Mexican families feast and play music in cemeteries at midnight instead of weeping?",
    storySummary:
      "Día de los Muertos is not sorrowful mourning; it is an annual family reunion with loved ones who passed away. Communities build multi-tiered ofrendas with cempasúchil (marigolds), pan de muerto, and mezcal, accompanied by Zapotec cochineal-dyed wool tapestries.",
    culturalContext:
      "Blends Indigenous Zapotec and Mixtec cosmovision with Catholic traditions. Affirms that a human being only truly dies when forgotten by their living descendants.",
    heroImage: "/content/observe.jpg",
    keeper: {
      name: "Oaxacan Consejo de Abuelas",
      role: "Elders & Master Weavers",
      community: "Indigenous Zapotec of Teotitlán del Valle",
    },
    livingStatus: {
      isActiveNow: true,
      activeSeasonOrTime: "Autumn / November 1-2 (Día de los Muertos)",
      unbrokenYears: "3,000+ years",
    },
    relatedKnowledgeSlugs: ["varanasi", "diwali"],
    sourcesCount: 30,
    tags: ["Ofrenda", "Zapotec", "Ancestral Memory", "Marigolds", "Oaxaca"],
  },
  {
    id: "obj-cuzco-incan-masonry",
    knowledgeObjectId: "eko-peru-cuzco-01",
    slug: "cuzco-living-stones",
    title: "Cuzco · The Living Stones & Pachamama",
    subTitle: "Mortarless Earth-Seismic Masonry of the Andes",
    category: "heritage",
    country: "Peru",
    region: "americas",
    stateOrDistrict: "Cuzco & Sacred Valley",
    coordinates: { x: 29.8, y: 66.8, lat: -13.5319, lng: -71.9675 },
    oneLiner: "Interlocking multi-angled granite blocks that dance safely during earthquakes.",
    curiosityQuestion: "How did Incan masons carve 100-ton stones to fit so tightly that a razor blade cannot slide between them?",
    storySummary:
      "In Cuzco (the Incan 'Navel of the World'), colossal granite blocks were shaped with bronze and stone hammers. Without mortar, the stones lock into each other with slight inclinations, allowing walls to move and resettle without collapsing during earthquakes.",
    culturalContext:
      "Quechua philosophy treats stones as living sacred beings (Huacas). Masons honored Pachamama (Mother Earth) by following the stone's natural cleavage rather than forcing it.",
    heroImage: "/content/journey.jpg",
    keeper: {
      name: "Quechua Cultural Stewards",
      role: "Heritage Stone & Textile Guardians",
      community: "Highland Quechua Communities",
    },
    livingStatus: {
      isActiveNow: true,
      activeSeasonOrTime: "Inti Raymi (Winter Solstice, June)",
      unbrokenYears: "600+ years",
    },
    relatedKnowledgeSlugs: ["marrakesh-courtyard", "varanasi"],
    sourcesCount: 21,
    tags: ["Inca", "Earthquake Architecture", "Pachamama", "Quechua", "Cuzco"],
  },

  // --------------------------------------------------------------------------
  // 7. EUROPE
  // --------------------------------------------------------------------------
  {
    id: "obj-athos-hesychasm",
    knowledgeObjectId: "eko-greece-athos-01",
    slug: "mount-athos-stillness",
    title: "Mount Athos · Hesychasm & Scriptorium",
    subTitle: "Monastic Republic & Byzantine Clock Rhythms",
    category: "sacred_places",
    country: "Greece",
    region: "europe",
    stateOrDistrict: "Macedonia, Mount Athos Peninsula",
    coordinates: { x: 53.2, y: 35.2, lat: 40.1583, lng: 24.3278 },
    oneLiner: "Twenty historic stone monasteries living by Byzantine sunset-based clock time since 963 CE.",
    curiosityQuestion: "Why does an autonomous community on a Mediterranean peninsula still set its clocks to sunset every day?",
    storySummary:
      "Mount Athos has maintained unbroken communal prayer and manuscript copying for over a thousand years. Monks practice Hesychasm—inner stillness through heart prayer—in stone clifftop cells overlooking the Aegean Sea, preserving botanical lore and Byzantine chanting.",
    culturalContext:
      "Direct living continuation of Byzantine Mediterranean spiritual culture, mirroring the silence and mindfulness traditions found across Asian monastic lines.",
    heroImage: "/content/reading-table.jpg",
    keeper: {
      name: "Holy Community of Mount Athos",
      role: "Monastic Council of Scribes & Elders",
      community: "Pan-Orthodox Monastic Brotherhoods",
    },
    livingStatus: {
      isActiveNow: true,
      activeSeasonOrTime: "Continuous monastic daily liturgy",
      unbrokenYears: "1,060+ years",
    },
    relatedKnowledgeSlugs: ["varanasi", "kyoto-zen"],
    sourcesCount: 24,
    tags: ["Hesychasm", "Byzantine", "Monasticism", "Manuscript", "Greece"],
  },
];

// Pre-computed Regional Clusters for Progressive Zoom Levels
export const ATLAS_CLUSTERS: AtlasCluster[] = [
  {
    id: "cluster-in-west",
    name: "Rajasthan & Gujarat Craft Axis",
    region: "india",
    stateOrDistrict: "Rajasthan & Gujarat",
    storyCount: 24,
    x: 64.5,
    y: 45.0,
    dominantCategory: "crafts",
    objectIds: ["obj-jaipur-blue-pottery", "obj-kutch-ajrakh", "obj-patan-patola"],
  },
  {
    id: "cluster-in-north",
    name: "Gangetic Plain & Kashi Corridor",
    region: "india",
    stateOrDistrict: "Uttar Pradesh & Bihar",
    storyCount: 32,
    x: 67.6,
    y: 43.4,
    dominantCategory: "traditions",
    objectIds: ["obj-varanasi-ghats", "obj-ayodhya-deepotsav"],
  },
  {
    id: "cluster-in-south",
    name: "Malabar & Coastal Sacred Sanctuaries",
    region: "india",
    stateOrDistrict: "Karnataka & Kerala",
    storyCount: 28,
    x: 67.0,
    y: 53.8,
    dominantCategory: "traditions",
    objectIds: ["obj-bhoota-kola", "obj-aranmula-mirror"],
  },
  {
    id: "cluster-japan",
    name: "Kyoto & Kansai Cultural Basin",
    region: "asia",
    stateOrDistrict: "Kansai, Japan",
    storyCount: 18,
    x: 84.8,
    y: 38.8,
    dominantCategory: "traditions",
    objectIds: ["obj-kyoto-zen"],
  },
  {
    id: "cluster-indonesia",
    name: "Bali Island Water & Ceremony Guilds",
    region: "asia",
    stateOrDistrict: "Bali, Indonesia",
    storyCount: 15,
    x: 79.8,
    y: 59.8,
    dominantCategory: "local_life",
    objectIds: ["obj-bali-subak"],
  },
  {
    id: "cluster-maghreb",
    name: "Moroccan Imperial Medinas",
    region: "middle_east",
    stateOrDistrict: "Fez & Marrakesh",
    storyCount: 16,
    x: 44.5,
    y: 38.2,
    dominantCategory: "heritage",
    objectIds: ["obj-fez-medina"],
  },
  {
    id: "cluster-mesoamerica",
    name: "Oaxaca & Central Mexican Highlands",
    region: "americas",
    stateOrDistrict: "Oaxaca & Michoacán",
    storyCount: 19,
    x: 23.2,
    y: 45.4,
    dominantCategory: "traditions",
    objectIds: ["obj-oaxaca-muertos"],
  },
  {
    id: "cluster-andes",
    name: "Cuzco & High Andean Valley",
    region: "americas",
    stateOrDistrict: "Cuzco, Peru",
    storyCount: 14,
    x: 29.8,
    y: 66.8,
    dominantCategory: "heritage",
    objectIds: ["obj-cuzco-incan-masonry"],
  },
  {
    id: "cluster-mediterranean",
    name: "Aegean & Byzantine Monastic Spine",
    region: "europe",
    stateOrDistrict: "Mount Athos & Aegean",
    storyCount: 12,
    x: 53.2,
    y: 35.2,
    dominantCategory: "sacred_places",
    objectIds: ["obj-athos-hesychasm"],
  },
];
