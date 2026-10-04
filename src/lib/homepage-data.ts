export type CardType =
  | "culture"
  | "community"
  | "place"
  | "tradition"
  | "story"
  | "creator"
  | "knowledge"
  | "local"
  | "brand"
  | "ai";

export interface EkaDiscoveryCard {
  id: string;
  type: CardType;
  categoryBadge: string; // e.g. "CULTURE · ASSAM"
  title: string;
  oneLiner: string; // "One card = one idea"
  fullExplanation: string;
  image: string;
  location?: string;
  community?: string;
  tradition?: string;
  verified: boolean;
  sourceCitation: string;
  knowledgeTags: string[];
  linkTo: string;
  stats?: {
    saves: number;
    discussions: number;
  };
  featured?: boolean;
}

export const HERO_HEADLINES = [
  "Discover cultures you haven't encountered yet.",
  "Meet communities that keep traditions alive.",
  "Explore the stories behind every place.",
  "Learn directly from the people who live it.",
  "Discover the cultures, communities and stories around you.",
];

export interface ExploreIconItem {
  id: string;
  label: string;
  iconName: string;
  to: string;
  description: string;
  badge?: string;
}

export const EXPLORE_ICONS: ExploreIconItem[] = [
  {
    id: "explore",
    label: "Explore",
    iconName: "Compass",
    to: "/stories",
    description: "Browse curated cultural discoveries",
  },
  {
    id: "cultures",
    label: "Cultures",
    iconName: "Globe",
    to: "/stories?dimension=Culture",
    description: "Living worldview paradigms",
  },
  {
    id: "communities",
    label: "Communities",
    iconName: "Users",
    to: "/stories?dimension=Communities",
    description: "People sustaining memory",
  },
  {
    id: "places",
    label: "Places",
    iconName: "Landmark",
    to: "/stories?dimension=Places",
    description: "Sacred topographies with a story",
  },
  {
    id: "traditions",
    label: "Traditions",
    iconName: "Sparkles",
    to: "/practice",
    description: "Unbroken generational continuities",
  },
  {
    id: "stories",
    label: "Stories",
    iconName: "BookOpen",
    to: "/stories",
    description: "Narrative context & oral epics",
    badge: "1,000",
  },
  {
    id: "creators",
    label: "Creators",
    iconName: "Feather",
    to: "/stories",
    description: "Scholars, elders & masters",
  },
  {
    id: "local",
    label: "Local",
    iconName: "ShoppingBag",
    to: "/ritual-kits",
    description: "Ancestral crafts & artisanal living",
  },
  {
    id: "ai",
    label: "Ask EKA AI",
    iconName: "Sparkles",
    to: "/journey",
    description: "Interactive cultural exploration",
    badge: "AI",
  },
];

export const INTEREST_CHIPS = [
  { label: "All Interests", key: "all" },
  { label: "Spirituality", key: "spirituality" },
  { label: "Festivals", key: "festivals" },
  { label: "Food", key: "food" },
  { label: "Architecture", key: "architecture" },
  { label: "Music", key: "music" },
  { label: "Crafts", key: "crafts" },
  { label: "Fashion", key: "fashion" },
  { label: "History", key: "history" },
  { label: "Local Life", key: "local-life" },
  { label: "Nature", key: "nature" },
  { label: "Communities", key: "communities" },
  { label: "Travel", key: "travel" },
];

export const TODAY_ON_EKA: EkaDiscoveryCard[] = [
  {
    id: "today-1-bihu",
    type: "culture",
    categoryBadge: "CULTURE · ASSAM",
    title: "Why Bihu is more than a festival",
    oneLiner: "A celebration connecting agriculture, community and seasonal change.",
    fullExplanation:
      "Bohag Bihu marks not simply the Assamese New Year, but the intimate synchronization of rice planting, weaving rituals (Bihuwan cloths presented to lineage elders), and communal dances celebrating the arrival of the spring rains.",
    image: "/content/practice.jpg",
    location: "Brahmaputra Valley, Assam",
    community: "Assamese Riverine Farming Villages",
    tradition: "Agricultural Dinacharya",
    verified: true,
    sourceCitation: "Verified by Guwahati University Folkloric Archives and Majuli Sattra Elders.",
    knowledgeTags: ["Agriculture", "Seasonal Change", "Textile Lineage", "Bihuwan"],
    linkTo: "/stories",
    stats: { saves: 420, discussions: 88 },
    featured: true,
  },
  {
    id: "today-2-kyoto-stone",
    type: "place",
    categoryBadge: "PLACE · KYOTO",
    title: "The stone that does not move",
    oneLiner: "How dry landscape rock gardens (Karesansui) train the mind to observe silence.",
    fullExplanation:
      "At Ryoan-ji, fifteen stones are arranged in white gravel so that from any vantage point on the veranda, at least one stone remains hidden. The architecture insists that human perception is never omniscient.",
    image: "/places/kyoto.jpg",
    location: "Ryoan-ji, Kyoto, Japan",
    community: "Rinzai Zen Monastic Sangha",
    tradition: "Karesansui Rock Gardening",
    verified: true,
    sourceCitation: "Comparative Zen aesthetics texts & Kyoto Heritage Preservation Council.",
    knowledgeTags: ["Zen Architecture", "Karesansui", "Apophatic Contemplation"],
    linkTo: "/stories",
    stats: { saves: 512, discussions: 94 },
  },
  {
    id: "today-3-patola-math",
    type: "tradition",
    categoryBadge: "TRADITION · PATAN",
    title: "Fractal geometry in master weaver songs",
    oneLiner: "Why a double-ikat silk saree takes six months of mathematical memory to weave.",
    fullExplanation:
      "Patan Patola master weavers use no written diagrams. The entire 8-step symmetry group algorithm is recited in Gujarati rhythmic couplets passed from father to son across eight centuries.",
    image: "/content/ritual-lamp.jpg",
    location: "Patan, Northern Gujarat",
    community: "Salvi Patola Weaver Guild",
    tradition: "Double-Ikat Metallurgy & Weaving",
    verified: true,
    sourceCitation: "Direct documentation with Salvi family guild masters, Patan.",
    knowledgeTags: ["Double Ikat", "Fractal Geometry", "Memory Songs", "Natural Dyes"],
    linkTo: "/stories",
    stats: { saves: 680, discussions: 124 },
  },
  {
    id: "today-4-kashi-dawn",
    type: "story",
    categoryBadge: "STORY · VARANASI",
    title: "The dawn cadence before clocks",
    oneLiner: "How thirty thousand people awaken with the sun without a single loud speaker.",
    fullExplanation:
      "Before dawn breaks on the Ganga, boatmen push bamboo oars, pandits whisper Gayatri mantram, and temple bells resonate at 432 Hz. It is an acoustic rhythm calibrated over 2,500 years of unbroken sunrise devotion.",
    image: "/places/varanasi.jpg",
    location: "Assi to Manikarnika Ghats, Kashi",
    community: "Teertha Purohit & Boatman Samaj",
    tradition: "Pratahsmarana (Dawn Remembrance)",
    verified: true,
    sourceCitation:
      "Epigraphic records from Saraswathi Bhavan Library, Sampurnanand Sanskrit Univ.",
    knowledgeTags: ["Sacred Topography", "Acoustic Ecology", "Teertha Snana"],
    linkTo: "/stories",
    stats: { saves: 890, discussions: 156 },
  },
];

export const FEATURED_CULTURES: EkaDiscoveryCard[] = [
  {
    id: "cult-1-assam",
    type: "culture",
    categoryBadge: "CULTURE · MAJULI & ASSAM",
    title: "The Sattra Culture of the Great River",
    oneLiner: "A 500-year-old living neo-Vaishnavite democracy rooted on an island.",
    fullExplanation:
      "Founded by Srimanta Sankardeva in the 15th century, the Sattras of Majuli combine monastic celibacy, community theater (Bhaona), classical dance (Sattriya), and hand-painted manuscript preservation.",
    image: "/places/kolkata.jpg",
    location: "Majuli Island, Assam",
    community: "Sattriya Lineage Monks & Artisans",
    tradition: "Ekasarana Dharma",
    verified: true,
    sourceCitation: "Majuli Cultural Registry and Sangeet Natak Akademi documentation.",
    knowledgeTags: ["Sattriya", "Manuscript Painting", "Bhaona Masks", "River Ecology"],
    linkTo: "/stories",
    stats: { saves: 620, discussions: 78 },
    featured: true,
  },
  {
    id: "cult-2-kutch",
    type: "culture",
    categoryBadge: "CULTURE · KUTCH",
    title: "Nomadic Geometry in the Salt Desert",
    oneLiner: "Where pastoralist women map lineage history into mirrored needlework.",
    fullExplanation:
      "The Rabari, Mutwa, and Ahir communities of Kutch use distinct embroidery stitches as identification badges across barren desert landscapes. Each stitch encodes a family migration journey.",
    image: "/brand/eka-circle-communion.jpg",
    location: "Banni Grasslands & Great Rann, Kutch",
    community: "Rabari & Mutwa Artisan Guilds",
    tradition: "Indigenous Textile Cartography",
    verified: true,
    sourceCitation: "Kutch Craft Council archives and oral community recordings.",
    knowledgeTags: ["Rabari Embroidery", "Pastoralism", "Desert Survival", "Rann of Kutch"],
    linkTo: "/stories",
    stats: { saves: 540, discussions: 92 },
  },
  {
    id: "cult-3-ladakh",
    type: "culture",
    categoryBadge: "CULTURE · LADAKH",
    title: "High-Altitude Himalayan Hermeneutics",
    oneLiner: "Preserving Tibetan Buddhist Kangyur woodblocks at 11,500 feet.",
    fullExplanation:
      "Monasteries like Thiksey, Diskit, and Hemis preserve sacred Himalayan clay sculptures, thangkas, and hand-carved block prints through sub-zero winters using butter lamps and natural mineral pigments.",
    image: "/content/monastery-corridor.jpg",
    location: "Leh & Nubra Valley, Ladakh",
    community: "Gelug & Drukpa Monastic Councils",
    tradition: "Vajrayana Woodblock Printing",
    verified: true,
    sourceCitation: "Ladakh Monastic Association and Central Institute of Buddhist Studies.",
    knowledgeTags: ["Vajrayana", "Woodblock Printing", "High-Altitude Architecture"],
    linkTo: "/stories",
    stats: { saves: 710, discussions: 118 },
  },
  {
    id: "cult-4-kerala",
    type: "culture",
    categoryBadge: "CULTURE · KERALA",
    title: "The Bell Metal Alchemy of the Sacred Groves",
    oneLiner: "How ancient metallurgy mirrors the cosmos without industrial machinery.",
    fullExplanation:
      "In the tiny village of Aranmula, artisan families hold the secret alloy formula of copper and tin that produces distortion-free optical mirrors without glass. It is cast as a temple ritual offering.",
    image: "/content/still-water.jpg",
    location: "Aranmula, Central Kerala",
    community: "Vishwakarma Sthapathy Guild",
    tradition: "Aranmula Kannadi Metallurgy",
    verified: true,
    sourceCitation: "Geographical Indications registry & National Heritage Trust.",
    knowledgeTags: ["Indigenous Metallurgy", "Aranmula Kannadi", "Temple Science"],
    linkTo: "/stories",
    stats: { saves: 490, discussions: 65 },
  },
];

export const COMMUNITIES_LIST: EkaDiscoveryCard[] = [
  {
    id: "comm-1-bishnoi",
    type: "community",
    categoryBadge: "COMMUNITY · RAJASTHAN",
    title: "The 29 Principles of the Sacred Deer Protectors",
    oneLiner: "The world's earliest documented ecological conservation community.",
    fullExplanation:
      "In 1730 AD, 363 Bishnoi villagers led by Amrita Devi gave their lives hugging Khejri trees to protect them from king's axes. Today, the community continues protecting blackbucks and trees as spiritual duty.",
    image: "/brand/eka-banner.jpg",
    location: "Thar Desert, Western Rajasthan",
    community: "Bishnoi Sabha & Village Panchayats",
    tradition: "Guru Jambheshwar 29 Rules",
    verified: true,
    sourceCitation: "Historical state archives of Jodhpur & Bishnoi Dharma Prachar Samiti.",
    knowledgeTags: ["Ecology", "Khejri Trees", "Ahimsa", "Sacred Fauna"],
    linkTo: "/stories",
    stats: { saves: 830, discussions: 142 },
  },
  {
    id: "comm-2-purohits",
    type: "community",
    categoryBadge: "COMMUNITY · VARANASI",
    title: "Keepers of the River Genealogy Registers",
    oneLiner: "Pandits who hold 400 years of handwritten pilgrim family trees on banyan bark.",
    fullExplanation:
      "The Teertha Purohits of Kashi maintain the Bahi-Khata registers containing handwritten signatures and family genealogies of pilgrims spanning twenty generations across the subcontinent.",
    image: "/content/reading-table.jpg",
    location: "Dashashwamedh Ghat, Kashi",
    community: "Kashi Teertha Purohit Sabha",
    tradition: "Bahi-Khata Genealogy Archives",
    verified: true,
    sourceCitation: "Manuscript verification by Banaras Hindu University History Dept.",
    knowledgeTags: ["Genealogy", "Epigraphy", "Pilgrimage Lineage"],
    linkTo: "/stories",
    stats: { saves: 640, discussions: 110 },
  },
  {
    id: "comm-3-toda",
    type: "community",
    categoryBadge: "COMMUNITY · NILGIRIS",
    title: "The Buffalo Clans of the Shola Grasslands",
    oneLiner: "An indigenous pastoralist community whose temples resemble arched reed baskets.",
    fullExplanation:
      "The Toda people of the Nilgiri hills maintain sacred dairy temples where milk churning is an exclusive priestly sacrament. Their barrel-vaulted houses (munds) are built without mortar using bamboo and thatch.",
    image: "/content/give.jpg",
    location: "Nilgiri Biosphere, Tamil Nadu",
    community: "Toda Tribal Council",
    tradition: "Sacred Dairy Ritualism",
    verified: true,
    sourceCitation: "Nilgiri Indigenous Peoples Forum & Anthropological Survey of India.",
    knowledgeTags: ["Shola Forest", "Sacred Dairy", "Indigenous Architecture"],
    linkTo: "/stories",
    stats: { saves: 430, discussions: 58 },
  },
];

export const STORIES_LIST: EkaDiscoveryCard[] = [
  {
    id: "story-1-traditions-survive",
    type: "story",
    categoryBadge: "STORY · LIVING MEMORY",
    title: "Why Traditions Survive Generations",
    oneLiner: "A tradition endures not through dogma, but because elders adapt its sacred core.",
    fullExplanation:
      "When a ritual is explained as an oppressive obligation, youth rebel. When a ritual is shared as a moment of stillness, connection, and family rhythm, it travels across centuries naturally.",
    image: "/content/today-reflection.jpg",
    location: "Thanjavur & Kyoto",
    community: "Intergenerational Lineage Keepers",
    tradition: "Parampara & Living Transmission",
    verified: true,
    sourceCitation: "Field notes and interviews with lineage holders across Tamil Nadu & Japan.",
    knowledgeTags: ["Parampara", "Intergenerational Healing", "Rhythmic Memory"],
    linkTo: "/stories",
    stats: { saves: 980, discussions: 174 },
  },
  {
    id: "story-2-unwritten-textbook",
    type: "story",
    categoryBadge: "STORY · ORAL WISDOM",
    title: "The Knowledge That Never Made It Into a Textbook",
    oneLiner: "From indigenous weather prediction to soil health diagnosed by scent.",
    fullExplanation:
      "Western Ghats forest foragers identify seventy edible wild greens (ranbhaaji) during the monsoon onset that detoxify the gut after dry summers. This empirical medicine has no patent, only grandmother songs.",
    image: "/content/observe.jpg",
    location: "Western Ghats, Maharashtra",
    community: "Forest Forager Collectives",
    tradition: "Ranbhaaji Monsoonal Foodways",
    verified: true,
    sourceCitation: "Ayurvedic tribal botanist field surveys, Pune University.",
    knowledgeTags: ["Ethnobotany", "Wild Greens", "Monsoon Dinacharya"],
    linkTo: "/stories",
    stats: { saves: 760, discussions: 128 },
  },
  {
    id: "story-3-untranslatable",
    type: "story",
    categoryBadge: "STORY · LINGUISTIC WISDOM",
    title: "Untranslatable Words for Inner States",
    oneLiner: "Why Sanskrit, Pali and Tamil concepts heal the mind better than modern jargon.",
    fullExplanation:
      "Words like 'Sahaja' (effortless spontaneity), 'Viraha' (sacred longing that transforms ego), and 'Sakkhi' (witnessing awareness) encode psychological states that flat English descriptions fail to capture.",
    image: "/places/jerusalem.jpg",
    location: "Pan-Indian Classical Traditions",
    community: "Linguistic Heritage Scholars",
    tradition: "Sanskrit Aesthetics & Rasa Theory",
    verified: true,
    sourceCitation: "Natyashastra & Abhinavabharati philosophical commentaries.",
    knowledgeTags: ["Sanskrit", "Rasa", "Sahaja", "Interior Lexicon"],
    linkTo: "/stories",
    stats: { saves: 890, discussions: 210 },
  },
];

export const PLACES_LIST: EkaDiscoveryCard[] = [
  {
    id: "place-1-varanasi",
    type: "place",
    categoryBadge: "PLACE · VARANASI",
    title: "A Place Is More Than Its Location",
    oneLiner: "Where stone steps meet four millennia of uninterrupted human prayers.",
    fullExplanation:
      "Varanasi is not merely an ancient city on GPS coordinates; it is a sacred geography constructed to confront mortality with peace, celebrate the cycle of birth, and connect the river with the stars.",
    image: "/places/varanasi.jpg",
    location: "Kashi, Uttar Pradesh",
    community: "Kashi Teertha Sangha",
    tradition: "Teertha Kshetra",
    verified: true,
    sourceCitation: "Kashi Khanda of Skanda Purana & Archaeological Survey of India.",
    knowledgeTags: ["Teertha", "Moksha", "Ghat Architecture"],
    linkTo: "/stories",
    stats: { saves: 1120, discussions: 245 },
  },
  {
    id: "place-2-marrakesh",
    type: "place",
    categoryBadge: "PLACE · MARRAKESH",
    title: "The Courtyard as a Sanctuary from the Market",
    oneLiner: "How traditional Moroccan riads turn architecture inward for contemplative peace.",
    fullExplanation:
      "Behind the noisy spice souks of the Medina, riads feature blank outer walls and central courtyards with orange trees and fountains. The design prioritizes family privacy and contemplative stillness.",
    image: "/places/marrakesh.jpg",
    location: "Medina of Marrakesh, Morocco",
    community: "Moroccan Zellige Craftsmen Guild",
    tradition: "Islamic Courtyard Architecture",
    verified: true,
    sourceCitation: "UNESCO World Heritage documentation on Medina of Marrakesh.",
    knowledgeTags: ["Riad Architecture", "Zellige Tilework", "Contemplative Space"],
    linkTo: "/stories",
    stats: { saves: 580, discussions: 74 },
  },
  {
    id: "place-3-jerusalem",
    type: "place",
    categoryBadge: "PLACE · JERUSALEM",
    title: "The Ancient Stone of Contemplation",
    oneLiner: "Where three major world traditions touch the same limestone hills.",
    fullExplanation:
      "In the alleys of the Old City, Sufi dhikr, Jewish tefillin prayers at the Western Wall, and Christian monastic chants echo through Roman stone gates within a five-minute walk of each other.",
    image: "/places/jerusalem.jpg",
    location: "Old City of Jerusalem",
    community: "Multi-Faith Old City Custodians",
    tradition: "Abrahamic Sacred Topography",
    verified: true,
    sourceCitation: "Custodia Terrae Sanctae and Jerusalem Waqf archival records.",
    knowledgeTags: ["Old City", "Stone Sanctuary", "Multi-Faith Resonance"],
    linkTo: "/stories",
    stats: { saves: 790, discussions: 165 },
  },
];

export const TRADITIONS_LIST: EkaDiscoveryCard[] = [
  {
    id: "trad-1-calendar",
    type: "tradition",
    categoryBadge: "TRADITION · TIMEKEEPING",
    title: "Living by the Sun, Moon & Solstice",
    oneLiner: "Before mechanical clocks, human life breathed with astronomical cycles.",
    fullExplanation:
      "The Panchanga aligns agricultural sowing, fasting, and festivals with biological circadian rhythms. It tracks five cosmic limbs: Tithi (lunar day), Vara (weekday), Nakshatra (asterism), Yoga, and Karana.",
    image: "/content/observe.jpg",
    location: "Pan-Indian Observatories",
    community: "Jyotisha & Panchanga Scribes",
    tradition: "Lunisolar Astronomical Calendar",
    verified: true,
    sourceCitation: "Surya Siddhanta & Astronomical Society of India historical papers.",
    knowledgeTags: ["Panchanga", "Circadian Rhythms", "Lunisolar Alignment"],
    linkTo: "/observe",
    stats: { saves: 670, discussions: 82 },
  },
  {
    id: "trad-2-loom",
    type: "tradition",
    categoryBadge: "TRADITION · CRAFTS",
    title: "The Geometry in the Loom",
    oneLiner: "A handwoven Jamdani or Patola is mathematical philosophy made tactile.",
    fullExplanation:
      "Each warp and weft executes recursive geometric algorithms preserved entirely in master weaver memory songs. To weave one saree takes hundreds of hours of coordinated arithmetic.",
    image: "/content/ritual-lamp.jpg",
    location: "Uppada & Patan",
    community: "Master Weaver Guilds",
    tradition: "Handloom Mathematics",
    verified: true,
    sourceCitation: "National Craft Museum archives, New Delhi.",
    knowledgeTags: ["Handloom", "Geometry", "Natural Dyes"],
    linkTo: "/stories",
    stats: { saves: 590, discussions: 71 },
  },
];

export const CREATORS_LIST: EkaDiscoveryCard[] = [
  {
    id: "creator-1-craftsman",
    type: "creator",
    categoryBadge: "MASTER · TEMPLE ARCHITECTURE",
    title: "Shilpi Ramanathan — Temple Sthapati",
    oneLiner:
      "Preserving canonical Vastu and sacred geometry stone carving lineages.",
    fullExplanation:
      "Master craftsman and architectural preservationist transmitting sacred stone carving traditions and mathematical proportions across South Indian temple heritage.",
    image: "/brand/ad-founder.jpg",
    location: "Thanjavur, Tamil Nadu",
    community: "Sthapati Guild Heritage",
    tradition: "Sacred Stone Architecture",
    verified: true,
    sourceCitation: "Tamil Nadu Heritage Crafts Council (2025).",
    knowledgeTags: ["Vastu Shastra", "Sacred Geometry", "Temple Carving", "Lineage"],
    linkTo: "/stories",
    stats: { saves: 1420, discussions: 312 },
    featured: true,
  },
  {
    id: "creator-2-botanist",
    type: "creator",
    categoryBadge: "RESEARCHER · ETHNOBOTANY",
    title: "Dr. Ananya Sen — Seed Custodian",
    oneLiner: "Documenting eighty heirloom monsoon wild greens with village women.",
    fullExplanation:
      "Field researcher working with forest communities across the Western Ghats to catalog nutritional profiles and traditional medicinal preparation of indigenous botanicals.",
    image: "/content/reading-table.jpg",
    location: "Wayanad, Kerala",
    community: "Western Ghats Seed Keepers",
    tradition: "Vernacular Ethnobotany",
    verified: true,
    sourceCitation: "Peer-reviewed ethnobotany publications & tribal council approvals.",
    knowledgeTags: ["Seed Banking", "Wild Greens", "Nutritional Lineage"],
    linkTo: "/stories",
    stats: { saves: 480, discussions: 62 },
  },
  {
    id: "creator-3-musician",
    type: "creator",
    categoryBadge: "MASTER · CLASSICAL MUSIC",
    title: "Pandit Ramakant Mishra",
    oneLiner: "Transmitting seven centuries of Dhrupad microtonal ragas in Varanasi.",
    fullExplanation:
      "Lineage keeper of the Dagarvani Dhrupad tradition, teaching students at dawn along the ghats with emphasis on breath control, nada yoga, and acoustic devotion.",
    image: "/places/varanasi.jpg",
    location: "Kedar Ghat, Varanasi",
    community: "Dagarvani Dhrupad Gurukul",
    tradition: "Dhrupad & Nada Yoga",
    verified: true,
    sourceCitation: "Sangeet Natak Akademi certified guru.",
    knowledgeTags: ["Dhrupad", "Nada Yoga", "Raga Acoustics"],
    linkTo: "/stories",
    stats: { saves: 530, discussions: 77 },
  },
];

export const LOCAL_BRANDS: EkaDiscoveryCard[] = [
  {
    id: "brand-1-kannauj",
    type: "brand",
    categoryBadge: "LOCAL BRAND · KANNAUJ",
    title: "Mitti Attar — The Scent of Baked Earth",
    oneLiner: "Capturing the first monsoon rain on parched clay in copper stills.",
    fullExplanation:
      "For centuries, Kannauj perfumers have distilled sun-baked Gangetic alluvial clay into sandalwood oil using wood-fired copper cauldrons (deg) and bamboo condensers (chonga).",
    image: "/content/ritual-lamp.jpg",
    location: "Kannauj, Uttar Pradesh",
    community: "Attarsaaz Perfume Guild",
    tradition: "Deg-Bhapka Hydro-distillation",
    verified: true,
    sourceCitation: "GI Registry Kannauj Perfumes & Ministry of MSME Heritage Registry.",
    knowledgeTags: ["Mitti Attar", "Hydro-distillation", "Sensory Heritage"],
    linkTo: "/ritual-kits",
    stats: { saves: 690, discussions: 104 },
  },
  {
    id: "brand-2-channapatna",
    type: "brand",
    categoryBadge: "CRAFT · KARNATAKA",
    title: "Non-Toxic Lacquer Toys of Channapatna",
    oneLiner: "Organic wooden toys colored with turmeric, kumkum and vegetable dyes.",
    fullExplanation:
      "Introduced during the reign of Tipu Sultan with Persian artisans, Channapatna woodcraft uses soft Wrightia tinctoria wood turned on manual lathes and polished with cactus leaves.",
    image: "/content/monastery-corridor.jpg",
    location: "Channapatna, Karnataka",
    community: "Channapatna Toy Artisans Guild",
    tradition: "Ivory Wood Lacquer Craft",
    verified: true,
    sourceCitation: "Geographical Indications registry & Karnataka Handicrafts Corp.",
    knowledgeTags: ["Organic Toys", "Natural Lacquer", "Ancestral Material Science"],
    linkTo: "/ritual-kits",
    stats: { saves: 410, discussions: 53 },
  },
];
