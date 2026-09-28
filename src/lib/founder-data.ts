export type EpistemicTier =
  | "Tier 1: Canonical Source"
  | "Tier 2: Scholarly Commentary"
  | "Tier 3: Lived Reflection"
  | "Tier 4: Living Community Practice"
  | "Tier 5: Bounded AI Synthesis";

export type CardDimension =
  | "Culture"
  | "Tradition"
  | "Local Knowledge"
  | "Spirituality"
  | "Communities"
  | "Places"
  | "Tourism"
  | "Local Brands"
  | "Creator Economy"
  | "Verification"
  | "Sacred Ecology"
  | "Living Crafts"
  | "Vernacular Dialects"
  | "Calendar Rhythms"
  | "Culinary Lineages"
  | "Sonic Traditions"
  | "Oral Epics"
  | "Sacred Architecture"
  | "Contemplative Science"
  | "Intergenerational Sanghas";

export interface PictorialCard {
  id: string;
  title: string;
  dimension: CardDimension;
  explanation: string;
  geoContext: string;
  epistemicTier: EpistemicTier;
  community: string;
  relatedKnowledge: string[];
  image: string;
  date: string;
  stats: {
    saves: number;
    discussions: number;
    views: number;
  };
  pinned?: boolean;
  featured?: boolean;
  status: "published" | "draft" | "under_review";
  sourceCitation?: string;
}

export interface FounderStory {
  id: string;
  title: string;
  caption: string;
  quote: string;
  image: string;
  date: string;
  stamp: string;
  location?: string;
  order: number;
}

export interface ConnectionDomain {
  id: string;
  name: string;
  shortDesc: string;
  badge: string;
  example: string;
  iconName: string;
  image: string;
}

export interface FounderProfile {
  name: string;
  role: string;
  positioning: string;
  avatar: string;
  banner: string;
  shortBio: string;
  vision: string;
  founderStory: string;
  whyEkaExists: string;
  whatAdIsBuilding: string;
  longTermMission: string;
  stats: {
    contributionsValidated: number;
    communitiesConnected: number;
    lineagesRecorded: number;
    openInquiries: number;
  };
  initiatives: Array<{
    title: string;
    description: string;
    status: string;
    metric: string;
  }>;
}

export const FOUNDER_PROFILE: FounderProfile = {
  name: "AD",
  role: "Founder, EKA",
  positioning:
    "Building the trusted intelligence layer for the world's cultures, communities and local knowledge.",
  avatar: "/brand/ad-founder.jpg",
  banner: "/brand/eka-banner-sunset.jpg",
  shortBio:
    "Technologist, systems architect, and cultural preservationist dedicated to building the civilizational intelligence substrate for human culture, sacred traditions, and localized living wisdom.",
  vision:
    "EKA is being built as a trusted intelligence layer for cultures, communities and local knowledge — connecting authentic knowledge, people, places, traditions, creators and communities into a living, verifiable human context graph.",
  founderStory:
    "Walking between traditional monastic retreats, regional weaver clusters, ancient temple libraries, and modern AI research labs, I saw a tragic paradox. The deepest human wisdom—accumulated over millennia across oral lineages and localized practices—is either neglected as 'unindexed noise' or chewed up into clickbait and hallucinated by generic AI models. EKA was born to give human cultural memory its own dignified, verifiable operating system.",
  whyEkaExists:
    "Important cultural and local knowledge is fragmented across people, communities, books, websites, social platforms, and oral traditions. When platforms optimize purely for viral outrage and programmatic advertising, nuance dies. EKA exists to replace the noise with an epistemic structure where communities can source, verify, contextualize, learn, discuss, create, and preserve.",
  whatAdIsBuilding:
    "A 5-layer civilizational technology stack: 1. Capture (vernacular & oral histories), 2. Verify (5-tier epistemic standard), 3. Structure (22-entity dynamic knowledge graph), 4. Experience (calm consumer sanctuary, Sanghas, and creator economy), and 5. Intelligence API (verifiable cultural context for frontier AI and global institutions).",
  longTermMission:
    "To ensure that as artificial intelligence scales, it is anchored to genuine human wisdom, verified cultural provenance, and living community stewardship—rather than homogenized caricatures.",
  stats: {
    contributionsValidated: 1420,
    communitiesConnected: 38,
    lineagesRecorded: 114,
    openInquiries: 89,
  },
  initiatives: [
    {
      title: "1,000 Stories Cultural Preservation Drive",
      description:
        "Documenting endangered oral histories, sacred crafts, and vernacular rituals across 28 states.",
      status: "Active Public Campaign",
      metric: "340+ Recorded",
    },
    {
      title: "Multi-Faith Sacred Calendar 2026",
      description:
        "Astronomical, lunisolar, and seasonal alignment across Hindu, Buddhist, Jain, Sikh, Sufi, and Christian paths.",
      status: "Live in Core App",
      metric: "365 Days Verified",
    },
    {
      title: "Living Lineage Endorsement Protocol",
      description:
        "Cryptographic and community provenance seals for traditional mutts, monasteries, and artisan guilds.",
      status: "Pilot Phase",
      metric: "18 Verified Institutions",
    },
    {
      title: "Open Cultural Context Protocol (CCP)",
      description:
        "Standardizing 11-dimension cultural ontology vectors for ethical LLM grounding and spatial computing.",
      status: "Research Specification",
      metric: "v1.0 Draft Approved",
    },
  ],
};

export const INITIAL_PICTORIAL_CARDS: PictorialCard[] = [
  {
    id: "card-1-culture",
    title: "A Culture Is More Than a Festival",
    dimension: "Culture",
    explanation:
      "Beyond the tourist spectacles and annual holidays lies the quiet, daily cadence of courtyard rituals, kitchen hearths, handloom rhythms, and spoken greetings that define how a community understands belonging.",
    geoContext: "Bishnupur & Majuli, Eastern India",
    epistemicTier: "Tier 4: Living Community Practice",
    community: "Terracotta Potter Guilds & Sattra Lineages",
    relatedKnowledge: ["Everyday Devotion", "Domestic Rituals", "Vernacular Ecology"],
    image: "/content/reading-table.jpg",
    date: "September 2026",
    stats: { saves: 428, discussions: 64, views: 3200 },
    pinned: true,
    featured: true,
    status: "published",
    sourceCitation:
      "Documented through fieldwork with Majuli Satradhikars and Bankura artisan elders (2025-2026).",
  },
  {
    id: "card-2-tradition",
    title: "Why Traditions Survive Generations",
    dimension: "Tradition",
    explanation:
      "A tradition endures not through rigid dogma, but because elders adapt its sacred core to each new generation through intimate household transmission, shared memory, and communal practice.",
    geoContext: "Thanjavur, Tamil Nadu & Kyoto, Japan",
    epistemicTier: "Tier 2: Scholarly Commentary",
    community: "Intergenerational Lineage Keepers",
    relatedKnowledge: ["Parampara", "Oral Transmission", "Rhythmic Memory"],
    image: "/places/kyoto.jpg",
    date: "September 2026",
    stats: { saves: 512, discussions: 89, views: 4100 },
    pinned: true,
    featured: true,
    status: "published",
    sourceCitation:
      "Comparative lineage archival records from the Saraswathi Mahal Library & Kyoto Heritage Registry.",
  },
  {
    id: "card-3-local-knowledge",
    title: "The Knowledge That Never Made It Into a Textbook",
    dimension: "Local Knowledge",
    explanation:
      "From indigenous weather prediction based on migratory bird calls to soil health diagnosed by scent, oral wisdom holds centuries of empirical observation that modern curricula overlooked.",
    geoContext: "Western Ghats, Maharashtra & Kerala",
    epistemicTier: "Tier 4: Living Community Practice",
    community: "Forest Forager & Farmer Collectives",
    relatedKnowledge: ["Ethnobotany", "Micro-climate Observation", "Oral Taxonomy"],
    image: "/content/practice.jpg",
    date: "September 2026",
    stats: { saves: 680, discussions: 112, views: 5400 },
    featured: true,
    status: "published",
    sourceCitation:
      "Oral interviews with village Vaidyas and botanical seed keepers across Wayanad and Pune dist.",
  },
  {
    id: "card-4-spirituality",
    title: "The Many Ways Humans Search for Meaning",
    dimension: "Spirituality",
    explanation:
      "Whether through silent Zazen, devotional Kirtan, Sufi Dhikr, contemplative Hesychasm, or Jain Sallekhana reflection, human inquiry into the transcendent reveals profound resonance across outer forms.",
    geoContext: "Jerusalem, Varanasi, Mount Athos & Bodh Gaya",
    epistemicTier: "Tier 1: Canonical Source",
    community: "Multi-Faith Contemplative Sanghas",
    relatedKnowledge: ["Apophatic Mysticism", "Bhakti Rhythms", "Interior Stillness"],
    image: "/places/jerusalem.jpg",
    date: "September 2026",
    stats: { saves: 890, discussions: 145, views: 7200 },
    featured: true,
    status: "published",
    sourceCitation:
      "Comparative theological texts: Upanishadic Chandogya, Philokalia, and Attar's Conference of the Birds.",
  },
  {
    id: "card-5-communities",
    title: "Every Community Has a Story",
    dimension: "Communities",
    explanation:
      "A community is not a demographic cohort; it is an unbroken tapestry of shared songs, migration journeys, mutual assistance customs, and collective memory sustained across centuries.",
    geoContext: "Kutch, Gujarat & Spiti Valley, Himachal",
    epistemicTier: "Tier 4: Living Community Practice",
    community: "Maldhari Pastoralists & Spiti Monastic Villages",
    relatedKnowledge: ["Pastoral Migration", "Commons Stewardship", "Tribal Memory"],
    image: "/brand/eka-circle-communion.jpg",
    date: "September 2026",
    stats: { saves: 430, discussions: 58, views: 3600 },
    status: "published",
    sourceCitation:
      "Field notes and oral geneaology recordings compiled with community elders in Banni grasslands.",
  },
  {
    id: "card-6-places",
    title: "A Place Is More Than Its Location",
    dimension: "Places",
    explanation:
      "A sacred place is where geography meets devotion. The stone ghats of Kashi, the ancient olive groves of the Levant, and the desert oases of the Maghreb are shaped by millions of footsteps and prayers.",
    geoContext: "Varanasi Ghats, Uttar Pradesh",
    epistemicTier: "Tier 1: Canonical Source",
    community: "Kashi Teertha Purohit Sabha",
    relatedKnowledge: ["Teertha Kshetra", "Sacred Topography", "Pilgrim Flow"],
    image: "/places/varanasi.jpg",
    date: "September 2026",
    stats: { saves: 760, discussions: 98, views: 6300 },
    featured: true,
    status: "published",
    sourceCitation:
      "Kashi Khanda of Skanda Purana cross-referenced with modern urban pilgrimage flow maps.",
  },
  {
    id: "card-7-tourism",
    title: "Travel Beyond the Tourist Map",
    dimension: "Tourism",
    explanation:
      "Sacred travel is the opposite of consumptive tourism. It invites the traveler to slow down, respect local customs, sit with community elders, and become a pilgrim rather than a spectator.",
    geoContext: "Camino de Santiago & Narmada Parikrama",
    epistemicTier: "Tier 3: Lived Reflection",
    community: "Parikramavasi Pilgrim Networks",
    relatedKnowledge: ["Contemplative Walking", "Pilgrim Ethics", "Sacred Hospitality"],
    image: "/content/journey.jpg",
    date: "September 2026",
    stats: { saves: 590, discussions: 74, views: 4800 },
    status: "published",
    sourceCitation:
      "First-hand accounts from completed 3,000 km Narmada circumambulation participants (2024-2025).",
  },
  {
    id: "card-8-local-brands",
    title: "The Story Behind a Local Brand",
    dimension: "Local Brands",
    explanation:
      "True local enterprise is rooted in lineage. When an artisan casts bell metal or presses cold mustard oil using stone mills, centuries of ancestral material science live inside the finished craft.",
    geoContext: "Aranmula, Kerala & Channapatna, Karnataka",
    epistemicTier: "Tier 4: Living Community Practice",
    community: "Vishwakarma Metal Casting Guilds",
    relatedKnowledge: [
      "Aranmula Kannadi",
      "Indigenous Metallurgy",
      "Heritage Intellectual Property",
    ],
    image: "/content/ritual-lamp.jpg",
    date: "September 2026",
    stats: { saves: 380, discussions: 49, views: 2900 },
    status: "published",
    sourceCitation:
      "Recorded in consultation with master metallurgists of Aranmula Heritage Trust.",
  },
  {
    id: "card-9-creator-economy",
    title: "Knowledge Can Become a Livelihood",
    dimension: "Creator Economy",
    explanation:
      "When community researchers, elder storytellers, and lineage masters are fairly compensated through EKA's Knowledge & Trust Payout Pools, cultural preservation shifts from an act of charity to a sustainable career.",
    geoContext: "Global Cultural Economy Network",
    epistemicTier: "Tier 2: Scholarly Commentary",
    community: "EKA Contributor & Creator Fellowship",
    relatedKnowledge: ["Knowledge Economy", "Ethical Payouts", "Decentralized Stewardship"],
    image: "/brand/ad-founder.jpg",
    date: "September 2026",
    stats: { saves: 620, discussions: 104, views: 5100 },
    featured: true,
    status: "published",
    sourceCitation:
      "EKA Blueprint 35: Attention + Knowledge + Trust Tri-Partite Payout Engine architecture.",
  },
  {
    id: "card-10-verification",
    title: "Who Gets to Say What Is Authentic?",
    dimension: "Verification",
    explanation:
      "Authenticity is not decided by an algorithmic vote or an ivory-tower monopoly. EKA separates verified canonical texts from community living practice and subjective reflection through multi-stakeholder consensus.",
    geoContext: "Pan-Indian & International Lineage Councils",
    epistemicTier: "Tier 1: Canonical Source",
    community: "EKA Trust & Epistemic Audit Board",
    relatedKnowledge: [
      "5-Tier Epistemic Ladder",
      "Zero-Hallucination Grounding",
      "Lineage Provenance",
    ],
    image: "/content/monastery-corridor.jpg",
    date: "September 2026",
    stats: { saves: 710, discussions: 128, views: 5900 },
    pinned: true,
    featured: true,
    status: "published",
    sourceCitation: "EKA Master Epistemic Governance Standard (BLU-008 & LEG-002).",
  },
  {
    id: "card-11-sacred-ecology",
    title: "The Sacred Grove & River Memory",
    dimension: "Sacred Ecology",
    explanation:
      "Ancient societies protected biodiversity not through fines, but through sacred reverence. Devrais in Maharashtra and Orans in Rajasthan preserved critical aquifers and rare flora as divine commons.",
    geoContext: "Western Ghats, Maharashtra & Thar Desert, Rajasthan",
    epistemicTier: "Tier 4: Living Community Practice",
    community: "Bishnoi & Western Ghats Village Panchayats",
    relatedKnowledge: ["Sacred Groves", "Indigenous Conservation", "Bishnoi Principles"],
    image: "/content/still-water.jpg",
    date: "September 2026",
    stats: { saves: 495, discussions: 62, views: 3900 },
    status: "published",
    sourceCitation:
      "Ecological surveys of 42 Deorais in Ratnagiri combined with oral lore from village pujaris.",
  },
  {
    id: "card-12-living-crafts",
    title: "The Geometry in the Loom",
    dimension: "Living Crafts",
    explanation:
      "A handwoven Jamdani, Patola, or Ikat is mathematical philosophy made tactile. Each warp and weft executes recursive geometric algorithms preserved entirely in master weaver memory songs.",
    geoContext: "Patan, Gujarat & Uppada, Andhra Pradesh",
    epistemicTier: "Tier 4: Living Community Practice",
    community: "Salvi Patola & Uppada Weaver Guilds",
    relatedKnowledge: ["Fractal Geometry in Textiles", "Natural Dyes", "Memory Songs"],
    image: "/content/today-reflection.jpg",
    date: "September 2026",
    stats: { saves: 540, discussions: 71, views: 4400 },
    status: "published",
    sourceCitation: "Interviews with 7th-generation Patola master weavers in Patan, Gujarat.",
  },
  {
    id: "card-13-vernacular-dialects",
    title: "Untranslatable Words for Inner States",
    dimension: "Vernacular Dialects",
    explanation:
      "Languages carry psychological architectures. Concepts like 'Sahaja' (effortless natural balance), 'Viraha' (sacred longing), and 'Sakkhi' (witnessing awareness) lose their healing depth when flattened into English.",
    geoContext: "Sanskrit, Tamil, Braj & Pali Linguistic Geographies",
    epistemicTier: "Tier 2: Scholarly Commentary",
    community: "Linguistic Heritage Scholars & Poets",
    relatedKnowledge: ["Sanskrit Aesthetics", "Tamil Sangam Poetry", "Interior Lexicons"],
    image: "/content/reading-table.jpg",
    date: "September 2026",
    stats: { saves: 650, discussions: 93, views: 5200 },
    status: "published",
    sourceCitation:
      "Etymological comparative database of 120 Indic affective and contemplative root words.",
  },
  {
    id: "card-14-calendar-rhythms",
    title: "Living by the Sun, Moon & Solstice",
    dimension: "Calendar Rhythms",
    explanation:
      "Before mechanical clocks, human life breathed with astronomical cycles. The Panchangam and lunar calendars aligned agricultural sowing, dietary cleansing, fasting, and festivals with biological circadian rhythms.",
    geoContext: "Pan-Indian Astronomical Observatories",
    epistemicTier: "Tier 1: Canonical Source",
    community: "Traditional Jyotisha & Panchanga Scribes",
    relatedKnowledge: ["Lunisolar Alignment", "Tithi Cycles", "Seasonal Dinacharya"],
    image: "/content/observe.jpg",
    date: "September 2026",
    stats: { saves: 730, discussions: 88, views: 6100 },
    featured: true,
    status: "published",
    sourceCitation:
      "Surya Siddhanta computational model verified against 2026 NASA ephemeris data.",
  },
  {
    id: "card-15-culinary-lineages",
    title: "Recipes as Family Epics",
    dimension: "Culinary Lineages",
    explanation:
      "A grandmother's spice blend is preventive medicine and historical record combined. The precise tempering order of fenugreek and asafoetida preserves centuries of seasonal gut-brain health knowledge.",
    geoContext: "Chettinad, Tamil Nadu & Malwa, Madhya Pradesh",
    epistemicTier: "Tier 4: Living Community Practice",
    community: "Aachis of Chettinad & Bundelkhand Kitchen Keepers",
    relatedKnowledge: ["Ayurvedic Dietetics", "Spice Chemistry", "Ancestral Foodways"],
    image: "/content/give.jpg",
    date: "September 2026",
    stats: { saves: 480, discussions: 67, views: 3700 },
    status: "published",
    sourceCitation:
      "Culinary oral recordings of 85 heirloom temple and domestic recipes across South India.",
  },
  {
    id: "card-16-sonic-traditions",
    title: "The Resonance of Shared Sound",
    dimension: "Sonic Traditions",
    explanation:
      "Sound before semantics: The continuous drone of a tanpura, the overtone chanting of Himalayan monks, and the acoustic resonance of 1,000-year-old stone temple mandapas induce immediate autonomic nervous system calm.",
    geoContext: "Brihadeeswara, Thanjavur & Tabo Monastery, Spiti",
    epistemicTier: "Tier 2: Scholarly Commentary",
    community: "Dhrupad Vocalists & Tibetan Tantric Chanting Guilds",
    relatedKnowledge: ["Nada Yoga", "Acoustic Archeology", "Vocal Resonance"],
    image: "/places/marrakesh.jpg",
    date: "September 2026",
    stats: { saves: 590, discussions: 82, views: 4900 },
    status: "published",
    sourceCitation:
      "Acoustic frequency analysis of Chola-era granite halls and Dhrupad octave modulations.",
  },
  {
    id: "card-17-oral-epics",
    title: "Singing Histories From Memory",
    dimension: "Oral Epics",
    explanation:
      "Bards who have never read a printed book can recite 50,000 lines of epic history over three nights. Their metric memory systems have preserved historical conflicts and migrations more accurately than weathered stone.",
    geoContext: "Rajasthan (Pabuji ki Phad) & Telangana (Oggu Katha)",
    epistemicTier: "Tier 4: Living Community Practice",
    community: "Bhopa Bards & Oggu Katha Performers",
    relatedKnowledge: ["Phad Painting", "Mnemonic Metre", "Vernacular Epics"],
    image: "/places/kolkata.jpg",
    date: "September 2026",
    stats: { saves: 420, discussions: 53, views: 3300 },
    status: "published",
    sourceCitation:
      "Audio recordings and scrolls documented with Bhopa performers in Nagaur, Rajasthan.",
  },
  {
    id: "card-18-sacred-architecture",
    title: "Stone Carved to Capture Solstice Dawn",
    dimension: "Sacred Architecture",
    explanation:
      "Ancient temple architects were master astrophysicists. At Konark, Modhera, and Angkor Wat, the first ray of the equinox sun penetrates through layers of sanctums to illuminate the inner deity at the exact minute of dawn.",
    geoContext: "Modhera, Gujarat & Konark, Odisha",
    epistemicTier: "Tier 1: Canonical Source",
    community: "Sompuras & Traditional Sthapatis",
    relatedKnowledge: ["Vastu Shastra", "Archaeo-astronomy", "Solstice Alignment"],
    image: "/content/monastery-corridor.jpg",
    date: "September 2026",
    stats: { saves: 670, discussions: 95, views: 5600 },
    featured: true,
    status: "published",
    sourceCitation:
      "Vastu Vidya manuscripts correlated with on-site GPS and solar azimuth field measurements.",
  },
  {
    id: "card-19-contemplative-science",
    title: "Centuries of Breath & Mind Observation",
    dimension: "Contemplative Science",
    explanation:
      "Long before fMRI scanners, contemplative yogis mapped the neurological shifts of alternate nostril breathing, heart rate variability during japa, and the cessation of mental fluctuations (citta-vritti nirodha).",
    geoContext: "Rishikesh, Uttarakhand & Dharamshala, Himachal",
    epistemicTier: "Tier 2: Scholarly Commentary",
    community: "Hatha Yoga & Buddhist Abhidharma Practitioners",
    relatedKnowledge: ["Pranayama Physiology", "Abhidharma Psychology", "Cognitive Stillness"],
    image: "/content/hero.jpg",
    date: "September 2026",
    stats: { saves: 820, discussions: 130, views: 6800 },
    status: "published",
    sourceCitation:
      "Patanjali Yoga Sutras mapped against contemporary peer-reviewed neurobiology studies.",
  },
  {
    id: "card-20-intergenerational-sanghas",
    title: "The Circle That Holds the Center",
    dimension: "Intergenerational Sanghas",
    explanation:
      "When grandparents, parents, and children sit together in weekly contemplative practice, loneliness dissolves. An authentic Sangha does not need charismatic leaders—it needs mutual reverence and dedicated presence.",
    geoContext: "Global EKA Community Circles",
    epistemicTier: "Tier 3: Lived Reflection",
    community: "EKA Global Sangha Circles",
    relatedKnowledge: ["Sangha Stewardship", "Intergenerational Healing", "Communal Silence"],
    image: "/brand/eka-banner-sunset.jpg",
    date: "September 2026",
    stats: { saves: 940, discussions: 162, views: 8100 },
    pinned: true,
    featured: true,
    status: "published",
    sourceCitation: "EKA Living Community Charter & Community Feedback Reports (2026).",
  },
];

export const FOUNDER_STORIES: FounderStory[] = [
  {
    id: "story-1",
    title: "Why I Started EKA",
    caption:
      "Watching irreplaceable oral wisdom disappear convinced me that cultural memory needed an epistemic infrastructure.",
    quote:
      "If we can build billion-dollar networks for viral dances and political outrage, we can build a cathedral for the inner life and human heritage.",
    image: "/brand/ad-founder.jpg",
    date: "2026",
    stamp: "AD · Founder, EKA",
    location: "Bengaluru & Varanasi",
    order: 1,
  },
  {
    id: "story-2",
    title: "The Problem I Saw",
    caption:
      "The modern web created high-speed distribution for outrage, but left living cultural wisdom scattered, unverified, or commodified.",
    quote:
      "When cultural memory is reduced to tourism brochures and social feeds, human civilization loses its moral and contemplative compass.",
    image: "/content/reading-table.jpg",
    date: "2026",
    stamp: "EKA · One within. One with all.",
    location: "Western Ghats, India",
    order: 2,
  },
  {
    id: "story-3",
    title: "Why Cultural Knowledge Matters",
    caption:
      "Culture is not an ornamental luxury; it is the battle-tested survival manual of human communities across ecological and personal crisis.",
    quote:
      "Before books, knowledge lived in song, stone, kitchen, and soil. That knowledge is deeply empirical—we just stopped knowing how to listen.",
    image: "/places/kyoto.jpg",
    date: "2026",
    stamp: "AD · Founder, EKA",
    location: "Kyoto, Japan",
    order: 3,
  },
  {
    id: "story-4",
    title: "Why EKA Is Not Another Social Network",
    caption:
      "We refused advertising, vanity follower counts, and outrage algorithms. EKA measures stillness, learning depth, and verifiable provenance.",
    quote:
      "A social network feeds on what agitates you. A sanctuary reflects who you are quietly becoming.",
    image: "/content/monastery-corridor.jpg",
    date: "2026",
    stamp: "EKA · One within. One with all.",
    location: "Tabo, Spiti Valley",
    order: 4,
  },
  {
    id: "story-5",
    title: "From Content to Knowledge",
    caption:
      "Social media treats culture as disposable content. EKA converts it into structured Atomic Knowledge Objects bound to verified lineage sources.",
    quote: "Content decays in 24 hours. Knowledge compounds across generations.",
    image: "/content/practice.jpg",
    date: "2026",
    stamp: "AD · Founder, EKA",
    location: "Kashi Library Archives",
    order: 5,
  },
  {
    id: "story-6",
    title: "From Knowledge to Community",
    caption:
      "A knowledge graph without living practitioners is merely an archive. EKA connects the graph directly to daily sadhana and living Sanghas.",
    quote:
      "Philosophy becomes real only when people sit together at dawn and practice what they have learned.",
    image: "/brand/eka-circle-communion.jpg",
    date: "2026",
    stamp: "EKA · One within. One with all.",
    location: "Community Sangha Circles",
    order: 6,
  },
  {
    id: "story-7",
    title: "Why Authenticity Matters",
    caption:
      "In an era of generative AI where anything can be fabricated in seconds, verifiable human lineage provenance is the rarest commodity on earth.",
    quote:
      "AI can generate a thousand synthetic mantras. It cannot replace the breath and lineage of an elder who has lived them for fifty years.",
    image: "/content/ritual-lamp.jpg",
    date: "2026",
    stamp: "AD · Founder, EKA",
    location: "Majuli Island, Assam",
    order: 7,
  },
  {
    id: "story-8",
    title: "Building With Communities, Not Just For Them",
    caption:
      "We do not parachute into indigenous communities to extract data. We build tools so lineage keepers own, govern, and benefit from their heritage.",
    quote: "True technology honors the sovereignty of the traditions it touches.",
    image: "/places/marrakesh.jpg",
    date: "2026",
    stamp: "EKA · One within. One with all.",
    location: "High Atlas & Thar Desert",
    order: 8,
  },
  {
    id: "story-9",
    title: "India as the Starting Point",
    caption:
      "India holds the densest, most polyphonic living spiritual laboratory in human history. If a knowledge system works here, it can work globally.",
    quote:
      "Nowhere else on earth do multiple 3,000-year-old continuous traditions share the same street, the same morning bells, and the same river.",
    image: "/places/varanasi.jpg",
    date: "2026",
    stamp: "AD · Founder, EKA",
    location: "Varanasi, India",
    order: 9,
  },
  {
    id: "story-10",
    title: "The Global Vision for EKA",
    caption:
      "To become the civilizational intelligence substrate connecting every tradition, sacred geography, and living culture to artificial intelligence and future human generations.",
    quote:
      "One within. One with all. That is not just an ancient aphorism—it is the engineering specification of EKA.",
    image: "/brand/eka-banner-sunset.jpg",
    date: "2026",
    stamp: "AD · Founder, EKA",
    location: "Global Civilizational Horizon",
    order: 10,
  },
];

export const CONNECTION_DOMAINS: ConnectionDomain[] = [
  {
    id: "domain-cultures",
    name: "Cultures",
    shortDesc: "Living ways of being, worldview paradigms, and regional cultural systems.",
    badge: "Way of Life",
    example: "Vedic, Celtic, Berber, Zen, Sufi, Nordic, and indigenous cultural epistemologies.",
    iconName: "Globe",
    image: "/places/kyoto.jpg",
  },
  {
    id: "domain-communities",
    name: "Communities",
    shortDesc: "The living people, lineages, sanghas, and clans that sustain collective memory.",
    badge: "People & Bonds",
    example: "Artisan guilds, forest forager collectives, pastoral nomads, and monastic councils.",
    iconName: "Users",
    image: "/brand/eka-circle-communion.jpg",
  },
  {
    id: "domain-traditions",
    name: "Traditions",
    shortDesc: "Unbroken generational continuities of philosophy, ethics, and practice.",
    badge: "Continuity",
    example:
      "Advaita Vedanta, Theravada Vinaya, Chisti Sufism, Sikh Gurmat, and Jain Anekantavada.",
    iconName: "Compass",
    image: "/content/monastery-corridor.jpg",
  },
  {
    id: "domain-spirituality",
    name: "Spirituality",
    shortDesc:
      "Experiential inner inquiry, contemplative prayer, meditation, and devotional depth.",
    badge: "Inner Life",
    example: "Vipassana, Japa meditation, Hesychasm Jesus Prayer, Whirling Dhikr, and Zazen.",
    iconName: "Sparkles",
    image: "/content/practice.jpg",
  },
  {
    id: "domain-religious-places",
    name: "Religious Places",
    shortDesc: "Sacred architectures, sanctums, pilgrimage shrines, and ancient energy nodes.",
    badge: "Sacred Space",
    example: "Kashi Vishwanath, Mount Kailash, Saint Peter's Basilica, and Golden Temple Amritsar.",
    iconName: "Landmark",
    image: "/places/varanasi.jpg",
  },
  {
    id: "domain-local-life",
    name: "Local Life",
    shortDesc:
      "The mundane yet sacred rhythms of daily markets, morning cleansings, and courtyard chats.",
    badge: "Everyday Rhythms",
    example: "Ghat bathing at sunrise, courtyard kolam drawings, and evening tea stalls.",
    iconName: "Sun",
    image: "/places/kolkata.jpg",
  },
  {
    id: "domain-tourism",
    name: "Tourism & Sacred Travel",
    shortDesc:
      "Mindful pilgrimage routes that replace extractive sightseeing with respectful encounter.",
    badge: "Sacred Journey",
    example: "Narmada Parikrama, Shikoku 88 Temple Pilgrimage, and the Char Dham Yatra.",
    iconName: "MapPin",
    image: "/content/journey.jpg",
  },
  {
    id: "domain-local-brands",
    name: "Local Brands & Artisans",
    shortDesc: "Heritage enterprises and artisan families preserving ancestral material science.",
    badge: "Heirloom Craft",
    example: "Aranmula mirror smiths, Channapatna toy turners, and Kannauj attar distillers.",
    iconName: "ShoppingBag",
    image: "/content/ritual-lamp.jpg",
  },
  {
    id: "domain-creators",
    name: "Creators & Mentors",
    shortDesc: "Contemporary writers, educators, guides, and artists translating ancient depth.",
    badge: "Living Voice",
    example: "Sanskrit translators, Dhrupad vocal masters, and indigenous oral storytellers.",
    iconName: "Feather",
    image: "/brand/ad-founder.jpg",
  },
  {
    id: "domain-community-experts",
    name: "Community Experts",
    shortDesc:
      "The village elders, traditional botanists, genealogists, and pandits holding oral memory.",
    badge: "Elders & Custodians",
    example: "Ayurvedic Vaidyas, tribal herbalists, and temple astrologers.",
    iconName: "Award",
    image: "/content/reading-table.jpg",
  },
  {
    id: "domain-local-knowledge",
    name: "Local Knowledge",
    shortDesc: "Vernacular wisdom, ecological signals, water harvesting, and seasonal foodways.",
    badge: "Empirical Wisdom",
    example: "Apatani wet rice-fish agroforestry and stepwell aquifer conservation.",
    iconName: "BookOpen",
    image: "/content/today-reflection.jpg",
  },
  {
    id: "domain-historical-knowledge",
    name: "Historical Knowledge",
    shortDesc:
      "Epigraphy, manuscript archives, oral lineages, and chronologies of cultural shifts.",
    badge: "Provenance",
    example: "Palm-leaf Grantha manuscripts, rock edicts of Ashoka, and Sangam poetry scrolls.",
    iconName: "Scroll",
    image: "/content/hero.jpg",
  },
  {
    id: "domain-contemporary-knowledge",
    name: "Contemporary Community Knowledge",
    shortDesc:
      "How living communities adapt sacred ethics to climate, urban migration, and technology today.",
    badge: "Living Evolution",
    example:
      "Diaspora digital satsangs, urban organic seed preservation, and clean river activism.",
    iconName: "Activity",
    image: "/brand/eka-banner-sunset.jpg",
  },
];

export const EKA_KNOWLEDGE_PIPELINE = [
  {
    step: "1. Source",
    title: "Ground-Level Ingestion",
    description:
      "Capturing oral histories, field audio, manuscript scans, and living community practices.",
  },
  {
    step: "2. Verify",
    title: "5-Tier Epistemic Audit",
    description:
      "Separating canonical documentation from living folkways, scholarly critique, and subjective reflection.",
  },
  {
    step: "3. Contextualize",
    title: "Semantic Graph Interconnection",
    description:
      "Linking claims to 22 entity types across geography, seasonal calendars, deity principles, and lineages.",
  },
  {
    step: "4. Learn",
    title: "Interactive AI & Personal Sadhana",
    description:
      "Allowing users to ask deep contextual questions with source citations and structured daily rhythms.",
  },
  {
    step: "5. Discuss",
    title: "Reverent Sangha Inquiries",
    description:
      "Facilitating ad-free, calm community deliberations without outrage algorithms or sensationalism.",
  },
  {
    step: "6. Create",
    title: "Creator Economy & Fair Payouts",
    description:
      "Compensating researchers, elders, and creators through Attention, Knowledge, and Trust reward pools.",
  },
  {
    step: "7. Preserve",
    title: "Permanent Civilizational Memory",
    description:
      "Anchoring human cultural context into an open protocol substrate for future generations and AI alignment.",
  },
];

// LocalStorage helpers for Founder Content Management
const STORAGE_KEY = "eka_founder_cards_v1";

export function getStoredFounderCards(): PictorialCard[] {
  if (typeof window === "undefined") {
    return INITIAL_PICTORIAL_CARDS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PICTORIAL_CARDS));
      return INITIAL_PICTORIAL_CARDS;
    }
    const parsed = JSON.parse(raw) as PictorialCard[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PICTORIAL_CARDS;
  } catch {
    return INITIAL_PICTORIAL_CARDS;
  }
}

export function saveFounderCards(cards: PictorialCard[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (err) {
    console.error("Failed to save founder cards to storage", err);
  }
}

export function addFounderCard(
  newCard: Omit<PictorialCard, "id" | "date" | "stats">,
): PictorialCard {
  const cards = getStoredFounderCards();
  const created: PictorialCard = {
    ...newCard,
    id: `card-${Date.now()}`,
    date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    stats: { saves: 0, discussions: 0, views: 1 },
  };
  const updated = [created, ...cards];
  saveFounderCards(updated);
  return created;
}

export function updateFounderCard(id: string, updates: Partial<PictorialCard>): PictorialCard[] {
  const cards = getStoredFounderCards();
  const updated = cards.map((c) => (c.id === id ? { ...c, ...updates } : c));
  saveFounderCards(updated);
  return updated;
}

export function deleteFounderCard(id: string): PictorialCard[] {
  const cards = getStoredFounderCards();
  const updated = cards.filter((c) => c.id !== id);
  saveFounderCards(updated);
  return updated;
}

export function resetFounderCardsToDefault(): PictorialCard[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  return INITIAL_PICTORIAL_CARDS;
}
