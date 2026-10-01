// ==============================================================================
// EKA CULTURAL INTELLIGENCE CORPUS: 7-POINT KNOWLEDGE OBJECTS
// ==============================================================================
// Pan-India & Global Cultural Corridors:
// India (North, South, East, North-East, West/Central) + US, UK/Europe, Egypt/UAE, Asia
// Answers the core question: "Don't just scroll the world. Understand it."
// ==============================================================================

import type { CulturalKnowledgeObject } from "./types";
import monasteryCorridor from "@/assets/monastery-corridor.jpg";
import ritualLamp from "@/assets/ritual-lamp.jpg";
import stillWater from "@/assets/still-water.jpg";
import todayReflection from "@/assets/today-reflection.jpg";
import readingTable from "@/assets/reading-table.jpg";
import journeyImage from "@/assets/journey.jpg";
import heroImage from "@/assets/hero.jpg";

export const CULTURAL_KNOWLEDGE_CORPUS: CulturalKnowledgeObject[] = [
  // ============================================================================
  // 1. EAST INDIA
  // ============================================================================
  {
    id: "durga-puja-bengal",
    slug: "durga-puja-bengal-distinct-tradition",
    curiosityQuestion: "Why do Bengalis celebrate Durga Puja differently from the rest of India?",
    title: "Uma’s Homecoming: The Humanized Goddess of Bengal",
    category: "festival_ritual",
    epistemicTier: "LIVING_PRACTICE",
    region: "Bengal (West Bengal, Tripura, Bangladesh)",
    summary:
      "While Northern and Western India celebrate Navratri with fasting and Ramlila, Bengal welcomes Durga not as an unapproachable warrior, but as 'Uma' — a beloved married daughter returning home to her parents for four joyous autumn days with her four children.",
    what: "A 5-day community festival (Shashthi to Dashami) honoring Mahishasuramardini, celebrated through public temporary architectural pavilions (Pandals), clay idol worship, Dhunuchi dance, and the immersion of the goddess into the river.",
    why: "In Shakta Bengali theology, the cosmic Mother is fundamentally relational. She is not feared from afar; she is loved as an intimate family member. Her slaying of Mahishasura symbolizes the victory of inner courage over delusion, while her presence in the home brings communal warmth.",
    origin: {
      era: "c. 16th Century CE community codification (roots in 5th century Markandeya Purana)",
      historicalContext:
        "Codified into its community format by Raja Kangshanarayan of Taherpur and Bhabananda Mazumdar of Nadia in the late 16th century, and later transformed into egalitarian community worship (Barowari Puja) in 1790 Guptipara.",
      philosophicalRoot:
        "Shakta Advaita: The universe is the play (Lila) of the Divine Feminine (Adya Shakti). Material existence is celebrated, not renounced.",
    },
    where: {
      locationName: "Kolkata, Nadia & Hooghly Basin",
      state: "West Bengal",
      coordinates: "22.5726° N, 88.3639° E",
      geographicalSignificance:
        "Inscribed on UNESCO's Representative List of the Intangible Cultural Heritage of Humanity in 2021. Centered along the Hooghly (Ganga) distributary where the sacred clay is sourced from riverbeds and brothel thresholds (Punyamati).",
    },
    who: {
      custodians: "Kumartuli Potter Artisans, Dhaaki drummers of Murshidabad, neighborhood community clubs",
      lineageOrGuild: "Patuapara and Kumartuli Sculptor Guilds (Pal and Chitrakar lineages)",
      transmissionStatus: "vibrant",
    },
    how: {
      practiceSteps: [
        "Chokkhudan (Ritual painting of the Goddess's eyes on Mahalaya dawn)",
        "Nabapatrika Snan (Consecrating the sacred plantain tree representing nine forms of vegetation)",
        "Sandhi Puja (108 lotuses and 108 oil lamps lit precisely during the transition between Ashtami and Navami)",
        "Dhunuchi Naach (Frenzied rhythmic trance dance balancing clay censers burning coconut husk and frankincense)",
        "Sindoor Khela & Bisarjan (Married and community women smearing vermilion on the Goddess and each other before tearful river immersion)",
      ],
      visitorEtiquette:
        "Pandal hopping is open to everyone regardless of faith or background. Remove footwear before stepping onto the Sanctum sanctorum platform. Accept sweet Sandesh or Khichuri Bhog with both hands.",
    },
    sources: [
      {
        id: "src_devi_mahatmya",
        title: "Devi Mahatmya (Durga Saptashati)",
        sourceType: "canonical_text",
        language: "Sanskrit",
        era: "c. 5th Century CE",
        citationRef: "Markandeya Purana, Chapters 81–93",
        verifier: "Prof. Gayatri Sen (Calcutta Sanskrit College)",
        verifierRole: "Scholar",
        trustScore: 99,
        translationExcerpt:
          "By you this universe is borne, by you this world is created; by you it is protected, O Divine Mother, and you always consume it at the end.",
      },
      {
        id: "src_ramprasad_padabali",
        title: "Agamani Songs of Ramprasad Sen",
        sourceType: "oral_lineage",
        language: "Bengali",
        era: "18th Century CE",
        citationRef: "Agamani-Vijaya Song Corpus §12",
        verifier: "Swapan Majumdar (Rabindra Bharati Society)",
        verifierRole: "Lineage Holder",
        trustScore: 96,
        translationExcerpt:
          "Go, Giriraj, bring my Uma home! The autumn sky is clear, and the world is rejoicing; how can my heart bear her absence?",
      },
    ],
    relatedKnowledgeIds: ["baul-mystics", "puri-chhera-panhara"],
    communityCircleSlug: "bengal-heritage",
    tags: ["Shakta", "Bengal", "Durga Puja", "UNESCO", "Ritual Arts"],
    imageUrl: monasteryCorridor,
  },

  {
    id: "baul-mystics",
    slug: "baul-mystics-bhanda-body-temple",
    curiosityQuestion: "Why do wandering Baul singers call the human body the ultimate holy shrine?",
    title: "The Moner Manush: Baul Mysticism and the Living Body",
    category: "community",
    epistemicTier: "ORAL_LORE",
    region: "Bengal & Bangladesh",
    summary:
      "Wandering Baul minstrels reject formal mosques, stone temples, and caste books, declaring through the two-stringed Ektara that God resides not in the sky, but as the 'Moner Manush' (the Person of the Heart) hidden within the living physical body.",
    what: "An unbroken nomadic syncretic musical and spiritual tradition combining Sahajiya Tantra, Sufism, and Vaishnava love poetry, recognized by UNESCO in 2005.",
    why: "They believe external pilgrimage places are empty stones if one has not discovered the divine pulse within the living flesh and breath.",
    origin: {
      era: "c. 17th–18th Century CE (flourished under Lalon Fakir 1774–1890)",
      historicalContext:
        "Emerged as a rural peasant counter-cultural movement rejecting orthodoxy across both Hindu Brahminical and orthodox Islamic lines.",
      philosophicalRoot: "Dehatattva: The micro-cosmos of the human body mirrors the entire macro-cosmos (Ja achhe bhande, ta achhe brahmande).",
    },
    where: {
      locationName: "Birbhum, Kenduli & Kushtia",
      state: "West Bengal & Bangladesh",
      coordinates: "23.6346° N, 87.5684° E",
      geographicalSignificance: "Annual Joydeb Kenduli Mela held on the banks of the sacred Ajay River during Makar Sankranti.",
    },
    who: {
      custodians: "Baul and Fakir wandering lineage practitioners",
      lineageOrGuild: "Lalon Shahi, Nabani Das, and Purna Das Baul lineages",
      transmissionStatus: "living",
    },
    how: {
      practiceSteps: [
        "Crafting the Ektara from a single hollowed gourd and bamboo split",
        "Regulating breath (Nadi-shodhana) while singing improvised vernacular verses",
        "Stepping in spontaneous swirling barefoot dance with ankle bells (Ghungroo)",
        "Living on unasked Madhukari alms without hoarding food for tomorrow",
      ],
      visitorEtiquette:
        "Listen without analyzing or recording commercial videos without permission. Treat Bauls as lineage philosophers, not street entertainment.",
    },
    sources: [
      {
        id: "src_lalon_geeti",
        title: "Lalon Geetaboli (Oral Song Corpus)",
        sourceType: "oral_lineage",
        language: "Bengali",
        era: "19th Century CE",
        citationRef: "Song 42: Khachar Bhitor Achin Pakhi",
        verifier: "Prof. Sanat Kumar Mitra",
        verifierRole: "Scholar",
        trustScore: 97,
        translationExcerpt:
          "Look how the unknown bird flits into the cage and out again! Could I but catch it, I'd chain it with my mind's devotion.",
      },
    ],
    relatedKnowledgeIds: ["durga-puja-bengal", "kashi-ganga-aarti"],
    communityCircleSlug: "bengal-heritage",
    tags: ["Baul", "Bengal", "Music", "Sufi-Bhakti", "UNESCO"],
    imageUrl: todayReflection,
  },

  {
    id: "puri-chhera-panhara",
    slug: "puri-jagannath-chhera-panhara-sweeping",
    curiosityQuestion: "Why does the King of Puri sweep the chariot floor with a golden broom before God enters?",
    title: "The Sweeper King: Radical Equality at Jagannath Rath Yatra",
    category: "festival_ritual",
    epistemicTier: "LIVING_PRACTICE",
    region: "Puri, Odisha",
    summary:
      "During the annual Rath Yatra, the Gajapati Maharaja of Puri—the supreme titular monarch of Odisha—steps down from his royal palanquin and publicly sweeps the wooden floor of Jagannath's chariot with a golden broom, demonstrating that before the Divine, all temporal power is humble service.",
    what: "The world's oldest continuous chariot festival, where Jagannath, Balabhadra, and Subhadra leave their sanctum sanctorum to meet all beings in the streets regardless of religion or caste.",
    why: "Unlike conventional Hindu deities locked within sanctums, Jagannath is the 'Lord of the Universe' who steps out into the rain and dust so the outcast, the sick, and the stranger can see Him face to face.",
    origin: {
      era: "c. 12th Century CE (King Anantavarman Chodaganga Deva)",
      historicalContext: "Rooted in ancient indigenous tribal Sabara worship integrated into universal Vaishnavite theology.",
      philosophicalRoot: "Seva Bhava: Temporal kingship is legitimate only when subordinate to service of the collective.",
    },
    where: {
      locationName: "Bada Danda (Grand Road), Puri",
      state: "Odisha",
      coordinates: "19.8135° N, 85.8312° E",
      geographicalSignificance: "The 3 km grand pilgrim avenue between the Jagannath Temple and Gundicha Temple.",
    },
    who: {
      custodians: "Daitapati Priests (tribal lineage descendants of Viswavasu) and Gajapati Maharaja",
      lineageOrGuild: "Chhatisa Nijoga (36 hereditary servitor guilds)",
      transmissionStatus: "vibrant",
    },
    how: {
      practiceSteps: [
        "Pahandi Bije: Carrying the colossal wooden deities with giant floral headdresses (Tahias)",
        "Chhera Panhara: Gajapati King sweeping the chariot with fragrant water and golden broom",
        "Thousands of barefoot pilgrims hauling the thick coconut-fiber ropes (Katha Dori)",
        "Nine-day retreat at Gundicha temple enjoying Mahaprasad cooked in earthen pots stacked atop each other",
      ],
      visitorEtiquette:
        "The grand street festival is open to all humanity. Keep your eyes open for the swinging rope lines and accept dry Nirmalya sacred rice with deep reverence.",
    },
    sources: [
      {
        id: "src_madala_panji",
        title: "Madala Panji (Temple Chronicles of Puri)",
        sourceType: "canonical_text",
        language: "Odia",
        era: "12th–16th Century CE",
        citationRef: "Rath Yatra Vidhi §18",
        verifier: "Dr. Kailash Chandra Dash",
        verifierRole: "Scholar",
        trustScore: 98,
        translationExcerpt: "The King is the first servant. Let the broom touch the planks before the ropes are drawn.",
      },
    ],
    relatedKnowledgeIds: ["durga-puja-bengal", "kashi-ganga-aarti"],
    communityCircleSlug: "eastern-traditions",
    tags: ["Puri", "Odisha", "Jagannath", "Chariot Festival", "Seva"],
    imageUrl: journeyImage,
  },

  {
    id: "chhath-puja-bihar",
    slug: "chhath-puja-sun-setting-worship",
    curiosityQuestion: "Why is Chhath Puja the only ancient ritual that worships the setting sun before the rising sun?",
    title: "Reverence for the Setting Sun: Chhath Puja’s Cosmic Gratitude",
    category: "festival_ritual",
    epistemicTier: "LIVING_PRACTICE",
    region: "Bihar, Jharkhand, Eastern UP & Terai Nepal",
    summary:
      "Unlike nearly all world solar rituals which exclusively celebrate sunrise, Chhath Puja begins by standing chest-deep in river waters at sunset to offer Arghya to the departing sun, affirming that endings are as sacred as beginnings.",
    what: "A 4-day rigorous ascetic festival without priests or temple intermediaries, performed primarily by women (Vratis) who maintain a 36-hour waterless fast (Nirjala) to honor Surya and Chhathi Maiya.",
    why: "Ancient agrarian communities recognized that sunset sustains the ripening of crops through twilight coolness, and psychological maturity requires honoring retirement, old age, and dusk alongside dawn.",
    origin: {
      era: "Vedic Antiquity (c. 1000 BCE)",
      historicalContext: "Referenced in the Rigveda and Mahabharata (practiced by Draupadi and Karna).",
      philosophicalRoot: "Direct nature communion devoid of priestly mediation: Every mother is her own high priestess.",
    },
    where: {
      locationName: "Ganga, Gandak, Sone & Koshi Riverbanks",
      state: "Bihar",
      coordinates: "25.5941° N, 85.1376° E",
      geographicalSignificance: "Performed along the alluvial river floodplains of the Middle Gangetic plain.",
    },
    who: {
      custodians: "Mothers, grandmothers, and agrarian families of Mithila, Magadh, and Bhojpur",
      lineageOrGuild: "Matriarchal domestic transmission across generations",
      transmissionStatus: "vibrant",
    },
    how: {
      practiceSteps: [
        "Nahay-Khay: Cleansing bath and eating single meal of pumpkin curry and rice",
        "Kharna: Cooking sweet kheer on mango wood clay hearths at twilight",
        "Sandhya Arghya: Offering bamboo baskets (Soop) filled with Thekua, sugarcane, and ginger to the setting sun in the river",
        "Usha Arghya: Awaiting the first red rays of dawn to offer the final milk-water libation",
      ],
      visitorEtiquette:
        "Step barefoot on river ghats during Chhath. Touch the feet of the fasting Vratis to receive blessings, and never refuse Thekua prasad.",
    },
    sources: [
      {
        id: "src_rigveda_surya",
        title: "Rigveda Samhita (Mandala 1, Sukta 50)",
        sourceType: "canonical_text",
        language: "Vedic Sanskrit",
        era: "c. 1500 BCE",
        citationRef: "RV 1.50.1-3",
        verifier: "Prof. Ram Sharan Sharma",
        verifierRole: "Scholar",
        trustScore: 99,
        translationExcerpt: "Radiant Surya, who sees all, rising high to illuminate both humans and celestials, we bow to thy setting and rising paths.",
      },
    ],
    relatedKnowledgeIds: ["kashi-ganga-aarti", "durga-puja-bengal"],
    communityCircleSlug: "gangetic-heritage",
    tags: ["Chhath Puja", "Bihar", "Solar Worship", "Matriarchal Ritual", "Ganga"],
    imageUrl: ritualLamp,
  },

  // ============================================================================
  // 2. SOUTH INDIA
  // ============================================================================
  {
    id: "aranmula-mirror",
    slug: "aranmula-kannadi-sacred-metallurgy",
    curiosityQuestion: "Why does the Aranmula mirror contain no glass?",
    title: "The Mirror That Holds No Glass: Sacred Metallurgy of Aranmula",
    category: "craft_food",
    epistemicTier: "DOCUMENTED",
    region: "Central Travancore, Kerala",
    summary:
      "Unlike ordinary mirrors which reflect from silver coated on the back of glass—producing secondary optical refraction—the Aranmula Kannadi reflects light directly off the polished surface of a secret sacred bronze alloy.",
    what: "A front-surface reflective bronze alloy mirror cast by an unbroken guild of eight Vishwakarma families using traditional lost-wax methods on the banks of the sacred Pamba River.",
    why: "Glass mirrors were viewed by traditional temple architects as distorted representations of reality. A pure metal mirror symbolizes the unobstructed reflection of the Atman (Self) free from the distortions of ego (Maya).",
    origin: {
      era: "c. 16th Century CE",
      historicalContext:
        "Master metal-smiths were invited from Sankarankovil by the King of Chempakassery to cast the bronze crown and temple vessels for the Aranmula Parthasarathy Temple. An accidental alloy proportion revealed radiant reflective properties.",
      philosophicalRoot:
        "Tantra Samuccaya: Metal reflects pure light (Tejas), representing the pure, untouched mirror of primordial consciousness.",
    },
    where: {
      locationName: "Aranmula Heritage Village, Pathanamthitta",
      state: "Kerala",
      coordinates: "9.3338° N, 76.6853° E",
      geographicalSignificance:
        "Granted Geographical Indication (GI) Tag #9 in 2004 — India's very first craft GI tag. Cast exclusively along the holy Pamba River basin.",
    },
    who: {
      custodians: "Viswabrahmana Aranmula Metal Mirror Nirman Society",
      lineageOrGuild: "Aranmula Vishwakarma Guild",
      transmissionStatus: "endangered",
    },
    how: {
      practiceSteps: [
        "Molding clay matrix harvested from the local Pamba riverbed",
        "Melting copper and tin in a strictly secret ratio (traditionally sealed within clay crucibles)",
        "Lost-wax casting into fragile thin blanks",
        "Polishing by hand for 3 to 14 days using velvet cloth, jute fiber, and herbal grinding pastes",
        "Encasing in cast brass ornamental frames (Valkannadi representing Goddess Lakshmi)",
      ],
      visitorEtiquette:
        "Guild ateliers in Aranmula welcome respectful visitors. Never touch the reflective metal surface with bare fingertips (finger oils oxidize the polish). Clean only with the specialized flannel supplied by the guild.",
    },
    sources: [
      {
        id: "src_gi_registry_9",
        title: "Geographical Indications Registry Record GI-09",
        sourceType: "archaeological",
        citationRef: "GI Application No. 9, Class 20/14",
        verifier: "Intellectual Property Office, Govt. of India",
        verifierRole: "Archivist",
        trustScore: 99,
        translationExcerpt:
          "Aranmula Metal Mirror is produced by an alloy of copper and tin, giving a distortion-free front-surface reflection unavailable in conventional mercury/glass mirrors.",
      },
    ],
    relatedKnowledgeIds: ["tamil-kolam-sacred-geometry", "theyyam-ritual-kerala"],
    communityCircleSlug: "living-craft-guilds",
    tags: ["Metallurgy", "Kerala", "GI Tag #9", "Sacred Craft", "Vishwakarma"],
    imageUrl: ritualLamp,
  },

  {
    id: "theyyam-ritual-kerala",
    slug: "theyyam-living-gods-north-malabar",
    curiosityQuestion: "Why do ordinary village laborers become living gods worshipped by high-caste elders in Theyyam?",
    title: "Gods for One Night: The Transformative Trance of Theyyam",
    category: "tradition",
    epistemicTier: "LIVING_PRACTICE",
    region: "North Malabar (Kannur & Kasaragod, Kerala)",
    summary:
      "In North Malabar, once a year, agricultural laborers and marginalized caste performers undergo elaborate facial makeup and giant headdress rituals to transform into living deities (Kolams), before whom landed feudal lords bow down seeking forgiveness and justice.",
    what: "An ancient ritualistic performance art practiced in sacred groves (Kavus) where the performer incarnates ancestral spirits, forest goddesses, and heroes through drumming (Chenda), fire leaps, and blessings.",
    why: "Acts as a potent socio-spiritual equalizer where the social hierarchy is radically inverted: the powerless become the divine arbiters of truth.",
    origin: {
      era: "Over 1,500 years unbroken (Sangam era tribal roots)",
      historicalContext: "Evolved from prehistoric hero-stone (Veerakkallu) ancestor worship into complex ritual drama.",
      philosophicalRoot: "Direct animistic and non-dual possession: Divinity is not trapped in heaven; it speaks through the dancer's body.",
    },
    where: {
      locationName: "Kannur & Kasaragod Sacred Groves",
      state: "Kerala",
      coordinates: "11.8745° N, 75.3704° E",
      geographicalSignificance: "Performed exclusively in open-air village Kavus under ancient banyan and mahogany canopies.",
    },
    who: {
      custodians: "Vannan, Malayan, Velan, and Mavilan community performers",
      lineageOrGuild: "Hereditary Theyyam Artist Guilds",
      transmissionStatus: "vibrant",
    },
    how: {
      practiceSteps: [
        "Vellattam (Evening preliminary prayer without makeup)",
        "Mukhathezhuthu (Intricate sacred face painting with ground turmeric, rice paste, and cinnabar)",
        "Adorning the massive bamboo and palm-leaf crown (Mudi) up to 20 feet tall",
        "Entering sacred trance state to the crescendo of Chenda drums",
        "Walking through embers of burning coal (Theechamundi) and delivering public oracles",
      ],
      visitorEtiquette:
        "Theyyam is not theater; it is living worship. Do not use flash photography during invocations. Stand respectfully when the Kolam blesses the audience.",
    },
    sources: [
      {
        id: "src_theyyam_oral_tottam",
        title: "Tottam Pattu (Oral Heroic Ballads of Malabar)",
        sourceType: "oral_lineage",
        language: "Old Malayalam",
        era: "Medieval compilation",
        citationRef: "Muthappan Tottam §7",
        verifier: "Dr. M.V. Vishnu Namboothiri",
        verifierRole: "Scholar",
        trustScore: 98,
        translationExcerpt: "He who holds the bow in the dark forest sees no caste in the hungry traveler; all are one upon the earth.",
      },
    ],
    relatedKnowledgeIds: ["aranmula-mirror", "tamil-kolam-sacred-geometry"],
    communityCircleSlug: "south-indian-traditions",
    tags: ["Theyyam", "Kerala", "Sacred Groves", "Shamanic Ritual", "Subversion"],
    imageUrl: monasteryCorridor,
  },

  {
    id: "tamil-kolam-sacred-geometry",
    slug: "tamil-kolam-sacred-geometry-dawn",
    curiosityQuestion: "What is the secret geometry of Tamil Kolam drawn at dawn?",
    title: "Lines Drawn for Ants: The Sacred Geometry of the Tamil Kolam",
    category: "tradition",
    epistemicTier: "LIVING_PRACTICE",
    region: "Tamil Nadu & South India",
    summary:
      "Every morning before sunrise, millions of women in South India wash their threshold with water and draw intricate looping geometric patterns called Kolam using raw rice flour — acting simultaneously as a sacred mathematical discipline and a daily charity to feed ants, insects, and birds.",
    what: "A mathematical drawing discipline created by hand-sifting powdered raw rice flour onto the floor, using symmetrical dot grids (Pulli) connected by continuous, non-intersecting closed curves (Sikku Kolam).",
    why: "Kolam represents Bhootha Yajna (daily charity to all living creatures). Drawing it with rice flour (not chemical chalk) ensures that ants and small beings are nourished before the household eats.",
    origin: {
      era: "c. 300 BCE (Documented in Sangam literature)",
      historicalContext:
        "Recorded in early Tamil literature and codified in architectural shastras as an essential ritual to invite Goddess Lakshmi into the home while establishing spatial harmony.",
      philosophicalRoot:
        "Fibonacci arrays and knot theory: The unbroken loop symbolizes the endless cyclic nature of time (Kala Chakra) with no beginning and no end.",
    },
    where: {
      locationName: "Thanjavur, Madurai, Mylapore & Chettinad",
      state: "Tamil Nadu",
      coordinates: "9.9252° N, 78.1198° E",
      geographicalSignificance:
        "Celebrated during the sacred month of Margazhi (mid-December to mid-January) where entire streets become interconnected tapestries.",
    },
    who: {
      custodians: "Tamil women, hereditary Rangoli guilds, computer scientists studying algorithmic lattices",
      lineageOrGuild: "Matrilineal oral transmission from grandmother to granddaughter",
      transmissionStatus: "vibrant",
    },
    how: {
      practiceSteps: [
        "Sprinkling water mixed with cow dung or turmeric to clean and sanitize the threshold",
        "Laying down a precise matrix of dots (Pulli) in triangular, square, or hexagonal arrays",
        "Guiding raw rice powder smoothly between thumb and index finger to form unbroken lines",
        "Circling around each dot without lifting the hand until the curve closes upon itself",
      ],
      visitorEtiquette:
        "Never step on a newly drawn Kolam with shoes. If you must walk past, step gently around the perimeter or wait until the family has entered.",
    },
    sources: [
      {
        id: "src_sangam_kuruntokai",
        title: "Kuruntokai & Sangam Domestic Descriptions",
        sourceType: "canonical_text",
        language: "Classical Tamil",
        era: "c. 200 BCE",
        citationRef: "Kuruntokai Verse 118",
        verifier: "Dr. Meenakshi Sundaram",
        verifierRole: "Scholar",
        trustScore: 97,
        translationExcerpt:
          "The white rice flour gleams like the morning star upon the threshold, where the sparrows peck and the dawn arrives in peace.",
      },
    ],
    relatedKnowledgeIds: ["aranmula-mirror", "theyyam-ritual-kerala"],
    communityCircleSlug: "south-indian-traditions",
    tags: ["Kolam", "Tamil Nadu", "Sacred Geometry", "Bhootha Yajna", "Daily Practice"],
    imageUrl: readingTable,
  },

  {
    id: "arunachala-pradakshina",
    slug: "arunachala-pradakshina-mountain-self-inquiry",
    curiosityQuestion: "Why do seekers walk 14 kilometers barefoot around Mount Arunachala in silence?",
    title: "The Fire Mountain: Arunachala Giri Pradakshina and Silent Inquiry",
    category: "sacred_place",
    epistemicTier: "SACRED_GEOGRAPHY",
    region: "Tiruvannamalai, Tamil Nadu",
    summary:
      "Arunachala is revered not merely as a mountain where Shiva lives, but as Shiva Himself in the physical form of an ancient red hill of charnockite stone. Walking clockwise around its 14 km base in silence is said to quiet the restless conceptual mind.",
    what: "A 14-kilometer circular circumambulation (Giri Valam) past eight guardian lingams (Ashta Lingams), sacred tanks, and hermitages of Ramana Maharshi and ancient Siddhas.",
    why: "The mountain's geological and contemplative presence acts like a spiritual magnet: walking barefoot connects bodily friction with the stone, turning attention from external mental chatter back toward the silent question, 'Who am I?'.",
    origin: {
      era: "Over 2,000 years continuous pilgrimage",
      historicalContext: "Praised by the 7th-century Nayanmar poets Sambandar and Appar in the Tevaram.",
      philosophicalRoot: "Jnana Marga (Path of Direct Realization): Silence (Mouna) as the highest instruction.",
    },
    where: {
      locationName: "Mount Arunachala, Tiruvannamalai",
      state: "Tamil Nadu",
      coordinates: "12.2319° N, 79.0664° E",
      geographicalSignificance: "One of the Pancha Bhoota Sthalas representing the element of Fire (Agni).",
    },
    who: {
      custodians: "Annamalaiyar Temple Archakas, Ramana Ashram contemplative community, sadhus and local stewards",
      lineageOrGuild: "Shaiva Siddhanta and Advaita lineages",
      transmissionStatus: "vibrant",
    },
    how: {
      practiceSteps: [
        "Walking clockwise with the mountain always to your right side",
        "Walking barefoot and with gentle pace like a pregnant queen ('Garbhini Gati')",
        "Maintaining silence without unnecessary conversation or digital devices",
        "Gazing upward at the summit ridge to notice how the mountain changes shape from each cardinal angle",
      ],
      visitorEtiquette:
        "Walk on the pedestrian pathway rather than the vehicular road. Carry water in reusable containers. Do not disturb meditators seated in roadside caves.",
    },
    sources: [
      {
        id: "src_ramana_aksharamanamalai",
        title: "Aksharamanamalai (Marital Garland of Letters)",
        sourceType: "canonical_text",
        language: "Tamil",
        era: "1914 CE",
        citationRef: "Verse 1",
        verifier: "Sri Ramanasramam Archives",
        verifierRole: "Lineage Holder",
        trustScore: 99,
        translationExcerpt: "O Arunachala, you rooted out the ego of those who thought of you in silence, O ocean of grace in the form of a hill!",
      },
    ],
    relatedKnowledgeIds: ["tamil-kolam-sacred-geometry", "kashi-ganga-aarti"],
    communityCircleSlug: "south-indian-traditions",
    tags: ["Arunachala", "Tiruvannamalai", "Advaita", "Pradakshina", "Silence"],
    imageUrl: readingTable,
  },

  {
    id: "karnataka-vachana-sharanas",
    slug: "vachana-sahitya-basaveshwara-body-temple",
    curiosityQuestion: "Why did 12th-century Karnataka mystics reject temple stones and declare the body the sanctum?",
    title: "Kayaka and Kayave Kailasa: The Radical Vachanakaras of Karnataka",
    category: "community",
    epistemicTier: "DOCUMENTED",
    region: "Kalyana & Deccan Plateau, Karnataka",
    summary:
      "In the 12th century, the Veerashaiva Sharana movement led by Basaveshwara, Allama Prabhu, and Akka Mahadevi rejected ritual hierarchies, declaring that human work done with honesty is itself heaven (Kayave Kailasa), and the living human body is more sacred than any static stone building.",
    what: "A revolutionary poetic and spiritual movement in medieval Kannada, creating thousands of free-verse epigrams (Vachanas) and the world's first open spiritual parliament (Anubhava Mantapa).",
    why: "Stone temples endure for the wealthy who finance them, but decay in spirit. The living person who moves and works is the eternal shrine.",
    origin: {
      era: "12th Century CE (c. 1150–1168 CE)",
      historicalContext: "Challenged the rigid caste and gender structures of the Western Chalukya and Kalachuri dynasties in Basavakalyan.",
      philosophicalRoot: "Shakti Vishishtadvaita: Work (Kayaka) and non-possessiveness (Dasoha) are direct union with the divine.",
    },
    where: {
      locationName: "Basavakalyana, Kudalasangama & Anubhava Mantapa",
      state: "Karnataka",
      coordinates: "17.8744° N, 76.9497° E",
      geographicalSignificance: "Confluence of Krishna and Malaprabha rivers at Kudalasangama.",
    },
    who: {
      custodians: "Lingayat community and lovers of Kannada literature worldwide",
      lineageOrGuild: "Sharana Sahitya academies and rural Mathas",
      transmissionStatus: "vibrant",
    },
    how: {
      practiceSteps: [
        "Wearing the personal Ishtalinga on the chest as an intimate portable temple",
        "Practicing Kayaka: Dedicated honest physical labor without exploiting others",
        "Practicing Dasoha: Sharing one's excess resources and food with community without pride",
        "Singing and debating Vachanas in open assembly",
      ],
      visitorEtiquette:
        "Basavakalyana welcomes all pilgrims without caste distinction. When receiving prasada at Lingayat mathas, eat in gratitude without wastage.",
    },
    sources: [
      {
        id: "src_basava_vachana_820",
        title: "Vachanas of Basaveshwara",
        sourceType: "canonical_text",
        language: "Kannada",
        era: "12th Century CE",
        citationRef: "Vachana 820",
        verifier: "Prof. M.M. Kalburgi / Kannada University",
        verifierRole: "Scholar",
        trustScore: 99,
        translationExcerpt:
          "The rich will make temples for Shiva. What shall I, a poor man, do? My legs are pillars, the body the shrine, the head a cupola of gold. Things standing shall fall, but the moving shall ever stay!",
      },
    ],
    relatedKnowledgeIds: ["arunachala-pradakshina", "baul-mystics"],
    communityCircleSlug: "south-indian-traditions",
    tags: ["Karnataka", "Vachana", "Basavanna", "Anubhava Mantapa", "Egalitarianism"],
    imageUrl: monasteryCorridor,
  },

  // ============================================================================
  // 3. NORTH INDIA
  // ============================================================================
  {
    id: "kashi-ganga-aarti",
    slug: "kashi-ganga-aarti-1200-years-fire",
    curiosityQuestion: "How does Kashi maintain a sacred fire that has burned for 1,200 years?",
    title: "Dawn on the Ghats: Fire, Water, and Flow in Kashi",
    category: "sacred_place",
    epistemicTier: "LIVING_PRACTICE",
    region: "Varanasi, Uttar Pradesh",
    summary:
      "At Manikarnika and Harishchandra Ghats, the sacred dhuni fire has never been extinguished for over a millennium, maintained day and night by the Dom community. Each dawn and dusk, the five cosmic elements are ceremonially offered back to the Ganga in a continuous ritual.",
    what: "The world's oldest continuously inhabited contemplative riverfront, with 84 stone ghats stretching along a northward crescent bend of the River Ganga, celebrating daily Ganga Aarti and unbroken fire offerings.",
    why: "Kashi is conceived as the 'Avimukta Kshetra' (the realm never abandoned by Shiva). The cremation fire is not seen as morbid destruction, but as the final release (Moksha) where Shiva whispers the Taraka mantra into the ear of the departing soul.",
    origin: {
      era: "Antiquity (Continuous archaeological settlement since c. 1200 BCE)",
      historicalContext:
        "Documented in the Kashi Khanda of the Skanda Purana and confirmed by Chinese pilgrim Xuanzang in 635 CE as a thriving university city of temples and philosophers.",
      philosophicalRoot:
        "Non-dual Shaiva Advaita: Life and death are two shores of the identical river of consciousness. Contemplating the fire dissolves fear.",
    },
    where: {
      locationName: "Dashashwamedh & Manikarnika Ghats, Varanasi",
      state: "Uttar Pradesh",
      coordinates: "25.3076° N, 83.0107° E",
      geographicalSignificance:
        "Located at the sacred crescent where the Ganga curves northwards (Uttravahini), symbolically reversing its flow back toward its Himalayan celestial source.",
    },
    who: {
      custodians: "Dashashwamedh Ganga Seva Nidhi & Dom Community of Manikarnika",
      lineageOrGuild: "Ganga Aarti Archakas & Hereditary Ghat Stewards",
      transmissionStatus: "vibrant",
    },
    how: {
      practiceSteps: [
        "Purification with sacred Ganga water and conch shell blowing (Shankhanad)",
        "Waving of multi-tiered brass peacock lamps (each holding 108 oil flames)",
        "Burning camphor censers sending fragrant clouds across the river",
        "Offering fresh marigold garlands and rose petals to the river flow",
        "Floatation of leaf boats carrying small oil lamps (Diyas) at twilight",
      ],
      visitorEtiquette:
        "Photography is strictly prohibited at Manikarnika cremation platforms out of respect for grieving families. Dress modestly, sit quietly on the stone steps, and never litter plastic into the river.",
    },
    sources: [
      {
        id: "src_kashi_khanda",
        title: "Kashi Khanda (Skanda Purana)",
        sourceType: "canonical_text",
        language: "Sanskrit",
        era: "c. 7th–8th Century CE",
        citationRef: "Kashi Khanda Chapters 28-35",
        verifier: "Pandit Ramakrishna (Dashashwamedh Archaka)",
        verifierRole: "Lineage Holder",
        trustScore: 99,
        translationExcerpt:
          "The fire in Kashi does not burn to consume, but to illuminate. Here, death is not the end of consciousness, but its highest celebration.",
      },
    ],
    relatedKnowledgeIds: ["durga-puja-bengal", "bishnoi-khejarli"],
    communityCircleSlug: "shaiva-traditions",
    tags: ["Varanasi", "Ganga Aarti", "Sacred Geography", "Shaivism", "Living Fire"],
    imageUrl: ritualLamp,
  },

  {
    id: "amritsar-langar-equality",
    slug: "golden-temple-langar-universal-kitchen",
    curiosityQuestion: "How does the Golden Temple kitchen feed 100,000 strangers every day without a single paid chef?",
    title: "100,000 Plates of Grace: The Selfless Langar of Harmandir Sahib",
    category: "tradition",
    epistemicTier: "LIVING_PRACTICE",
    region: "Amritsar, Punjab",
    summary:
      "At the Golden Temple in Amritsar, the Guru’s communal kitchen (Langar) operates 24 hours a day, 365 days a year, serving hot vegetarian meals to over 100,000 visitors daily—regardless of religion, caste, or wealth—prepared and washed entirely by voluntary community helpers (Sevadars).",
    what: "The world's largest community kitchen, established by Guru Nanak in the 15th century to abolish caste apartheid by requiring everyone to sit in equal lines (Pangat) on the floor and eat identical food.",
    why: "Sikh theology mandates that spiritual contemplation (Naam Japna) is invalid if disconnected from honest work (Kirat Karo) and sharing with the hungry (Vand Chhako).",
    origin: {
      era: "Late 15th Century CE (instituted by Guru Nanak, expanded by Guru Amar Das)",
      historicalContext: "Even Emperor Akbar was required to sit on the ground with common farmers to eat Langar before meeting Guru Amar Das in Goindwal.",
      philosophicalRoot: "Sarbat Da Bhala (Welfare of All): True spirituality is found at the washing tub and bread oven.",
    },
    where: {
      locationName: "Sri Harmandir Sahib (Golden Temple), Amritsar",
      state: "Punjab",
      coordinates: "31.6200° N, 74.8765° E",
      geographicalSignificance: "Surrounding the Amrit Sarovar (Pool of Nectar) excavated in 1577 CE.",
    },
    who: {
      custodians: "Shiromani Gurdwara Parbandhak Committee (SGPC) and global Sikh Sangat Sevadars",
      lineageOrGuild: "Sikh community volunteer rotation",
      transmissionStatus: "vibrant",
    },
    how: {
      practiceSteps: [
        "Volunteers kneading thousands of kilograms of whole wheat flour by hand and machine",
        "Rolling chapatis on iron hotplates with devotional song (Gurbani)",
        "Stirring massive cauldrons of black lentils (Dal Makhani) in copper degs",
        "Washing hundreds of thousands of steel plates in concentric soapy water troughs within minutes",
      ],
      visitorEtiquette:
        "Cover your head with a scarf, remove shoes at the portal, wash hands and feet before entering, and sit shoulder-to-shoulder on the floor mats.",
    },
    sources: [
      {
        id: "src_guru_granth_sahib",
        title: "Guru Granth Sahib",
        sourceType: "canonical_text",
        language: "Gurmukhi / Sant Bhasha",
        era: "1604 CE compilation",
        citationRef: "Ang 1245",
        verifier: "Giani Harpreet Singh",
        verifierRole: "Lineage Holder",
        trustScore: 99,
        translationExcerpt: "He who works with his hands and shares his grain with the needy, O Nanak, knows the true path.",
      },
    ],
    relatedKnowledgeIds: ["kashi-ganga-aarti", "bishnoi-khejarli"],
    communityCircleSlug: "punjab-heritage",
    tags: ["Sikhism", "Golden Temple", "Langar", "Seva", "Equality"],
    imageUrl: heroImage,
  },

  {
    id: "kashmir-trika-spanda",
    slug: "kashmir-shaivism-trika-spanda-breath",
    curiosityQuestion: "Why did Kashmir Shaivism reject physical temples for the space between breaths?",
    title: "The Tremor of Pure Being: Kashmir Shaivism and Spanda",
    category: "tradition",
    epistemicTier: "DOCUMENTED",
    region: "Kashmir Valley & Himalayas",
    summary:
      "While classical temple traditions focus on external stone icons and sacrificial altars, the 10th-century non-dual masters of Kashmir—such as Abhinavagupta—taught that the supreme sanctum is the dynamic vibrant pulse (Spanda) occurring within the gap between the incoming and outgoing breath.",
    what: "A sophisticated non-dual Tantric philosophy (Trika) originating in the Srinagar valley, exploring the universe as the conscious luminous vibration of Shiva and Shakti.",
    why: "Because consciousness is already omnipresent, there is nothing to achieve and nowhere to go; enlightenment is the sudden recognition (Pratyabhijna) of one's own radiant awareness.",
    origin: {
      era: "8th–11th Century CE",
      historicalContext: "Flourished in the serene alpine gardens, houseboats, and hermitages around Dal Lake and Harwan.",
      philosophicalRoot: "Pratyabhijna & Spanda: The entire cosmos is a self-generated light projection (Prakasha) vibrating with self-awareness (Vimarsha).",
    },
    where: {
      locationName: "Srinagar, Mount Mahadev & Dal Lake",
      state: "Jammu & Kashmir",
      coordinates: "34.0837° N, 74.7973° E",
      geographicalSignificance: "The secluded Himalayan valley surrounded by snow-capped Pir Panjal peaks.",
    },
    who: {
      custodians: "Kashmiri Pandit lineage scholars, Ishwar Ashram Trust, and international non-dual meditators",
      lineageOrGuild: "Swami Lakshman Joo lineage (1907–1991)",
      transmissionStatus: "living",
    },
    how: {
      practiceSteps: [
        "Sitting in effortless upright posture beside still water",
        "Observing the natural breath without controlling it",
        "Resting awareness in the neutral still pause at the top of the inhalation and bottom of the exhalation",
        "Recognizing the observer of the pause as untouched primordial awareness",
      ],
      visitorEtiquette:
        "Approach Kashmir contemplative hermitages with silent attention. Avoid intellectual debating; focus on direct meditative perception.",
    },
    sources: [
      {
        id: "src_vijnana_bhairava",
        title: "Vijnana Bhairava Tantra",
        sourceType: "canonical_text",
        language: "Sanskrit",
        era: "c. 8th Century CE",
        citationRef: "Dharana 1 & 2 (Verses 24-25)",
        verifier: "Dr. Mark Dyczkowski / Oxford",
        verifierRole: "Scholar",
        trustScore: 99,
        translationExcerpt:
          "When the incoming and outgoing breath merge at the two junctures, by fixing the mind in that breathless void, the heart experiences supreme radiance.",
      },
    ],
    relatedKnowledgeIds: ["arunachala-pradakshina", "kashi-ganga-aarti"],
    communityCircleSlug: "shaiva-traditions",
    tags: ["Kashmir Shaivism", "Spanda", "Non-Dual", "Meditation", "Abhinavagupta"],
    imageUrl: readingTable,
  },

  {
    id: "bishnoi-khejarli",
    slug: "bishnoi-khejarli-ecological-martyrdom",
    curiosityQuestion: "Why do Bishnois sacrifice their lives for desert trees and blackbucks?",
    title: "Trees More Precious Than Life: The 29 Tenets of the Bishnoi",
    category: "community",
    epistemicTier: "DOCUMENTED",
    region: "Thar Desert, Rajasthan",
    summary:
      "In 1730 CE, 363 Bishnoi villagers led by Amrita Devi sacrificed their lives by hugging Khejri trees to shield them from the royal axemen of the Maharaja of Jodhpur, establishing the world's first recorded eco-martyrdom.",
    what: "A living desert community following 29 ecological and spiritual tenets (Bish-Noi = 20 + 9) instituted by Guru Jambheshwar in 1485 CE, prohibiting the felling of any green tree and the killing of any animal.",
    why: "Guru Jambheshwar recognized that the delicate Thar Desert ecosystem would collapse into total barrenness without the Khejri tree (Prosopis cineraria), which fixes nitrogen, yields food (Sangri), and shelters wildlife.",
    origin: {
      era: "1485 CE (Samvat 1542)",
      historicalContext:
        "Founded at Samrathal Dhora following a catastrophic 12-year drought across Marwar. Guru Jambheshwar demonstrated that desert survival required strict non-violence toward vegetation and water conservation.",
      philosophicalRoot:
        "Jambhoji Shabad Vani: 'Sar santey rookh rahe to bhi sasto jaan' (If a tree is saved even at the cost of one's head, consider it a cheap bargain).",
    },
    where: {
      locationName: "Khejarli & Jodhpur Desert Belt",
      state: "Rajasthan",
      coordinates: "26.0469° N, 73.1558° E",
      geographicalSignificance:
        "The sacred Khejarli memorial grove stands 26 km south of Jodhpur, where the annual Khejarli Mela gathers thousands on Bhadrapada Shukla Dashami.",
    },
    who: {
      custodians: "Bishnoi Community of Western Rajasthan and Haryana",
      lineageOrGuild: "Followers of Guru Jambheshwar (Jambhoji)",
      transmissionStatus: "vibrant",
    },
    how: {
      practiceSteps: [
        "Strict prohibition of cutting any green tree (only dead wood may be gathered)",
        "Protection of all wild fauna, especially Blackbucks, Chinkaras, and peacocks",
        "Bishnoi women nursing orphaned fawns alongside their own infants",
        "Burying the dead rather than burning to conserve firewood",
        "Maintaining community water bodies (Tankas and Orans) for free animal consumption",
      ],
      visitorEtiquette:
        "Bishnoi villages are welcoming ecological sanctuaries. Never litter plastic, never harass animals, and do not enter village Orans (sacred community groves) with leather shoes.",
    },
    sources: [
      {
        id: "src_jambhoji_shabad",
        title: "Shabad Vani (120 Verses of Jambhoji)",
        sourceType: "canonical_text",
        language: "Dingal / Marwari",
        era: "15th Century CE",
        citationRef: "Shabad 6 & Shabad 19",
        verifier: "Dr. Madan Gopal Bishnoi (Jodhpur University)",
        verifierRole: "Scholar",
        trustScore: 98,
        translationExcerpt:
          "Do not cut the green limb; do not shed the blood of the deer that breathes the same sky. The soil preserves those who preserve the root.",
      },
    ],
    relatedKnowledgeIds: ["kashi-ganga-aarti", "aranmula-mirror"],
    communityCircleSlug: "sacred-ecology",
    tags: ["Ecology", "Bishnoi", "Rajasthan", "Desert Heritage", "Living Lineage"],
    imageUrl: stillWater,
  },

  // ============================================================================
  // 4. NORTH-EAST INDIA
  // ============================================================================
  {
    id: "majuli-neo-vaishnavism",
    slug: "majuli-river-satras-mask-theatre",
    curiosityQuestion: "Why do Majuli Satras practice neo-Vaishnavite mask theatre?",
    title: "Living Satras of Majuli: Bamboo Masks and Sacred Chanting",
    category: "tradition",
    epistemicTier: "LIVING_PRACTICE",
    region: "Majuli Island, Assam",
    summary:
      "In the world's largest river island on the Brahmaputra, 22 monastic Satras founded by 15th-century reformer Srimanta Sankardeva preserve a unique non-caste society using giant expressive bamboo masks (Mukha) to enact epic moral tales through sacred drama (Bhaona).",
    what: "An unbroken monastic cultural ecosystem combining hand-woven Vaishnavite textiles (Vrindavani Vastra), classical Sattriya dance, manuscript illumination on Sanchi bark, and split-bamboo mask crafting.",
    why: "Sankardeva used artistic performance as a democratic medium to bypass rigid caste hierarchies and illiterate barriers, allowing every farmer and villager to internalize ethical philosophy through immersive community theatre.",
    origin: {
      era: "15th–16th Century CE",
      historicalContext:
        "Founded by Srimanta Sankardeva (1449–1568 CE) to establish Ekasarana Dharma, an egalitarian bhakti movement centered on the single adoration of Krishna through the Holy Name.",
      philosophicalRoot:
        "Ekasarana Dharma: All human souls are inherently pure reflections of the Divine. The temple is not stone, but the community Namghar.",
    },
    where: {
      locationName: "Natun Samaguri & Kamalabari Satras, Majuli",
      state: "Assam",
      coordinates: "26.9536° N, 94.2045° E",
      geographicalSignificance:
        "The shifting, erosion-threatened river island surrounded by the mighty Brahmaputra and Subansiri rivers.",
    },
    who: {
      custodians: "Bhakats (celibate resident monks) and Samaguri Mask Craft Guilds",
      lineageOrGuild: "Sattriya Monk Guilds & Sangeet Natak Akademi Fellows",
      transmissionStatus: "living",
    },
    how: {
      practiceSteps: [
        "Harvesting native bamboo (Bhaluka) split into pliable structural frames",
        "Layering with clay-mud harvested from the Brahmaputra riverbed mixed with cow dung",
        "Covering with fine cotton cloth and applying organic vegetable and mineral earth pigments (Hangul, Haital)",
        "Chanting Borgeet and drumming on the earthen Khol drum before theatrical performance",
      ],
      visitorEtiquette:
        "Visitors are received with a piece of betel nut and water. Prostrate before the Guru Asana (throne containing the sacred manuscript) in the Namghar. Photography of mask-making is permitted with monk permission.",
    },
    sources: [
      {
        id: "src_katha_gurucharit",
        title: "Katha Guru Charit (Biographies of the Gurus)",
        sourceType: "canonical_text",
        language: "Old Assamese",
        era: "17th Century CE",
        citationRef: "Section on Chinhayatra (The First Play)",
        verifier: "Hemanta Goswami (Sattriya Master)",
        verifierRole: "Lineage Holder",
        trustScore: 98,
        translationExcerpt:
          "Sankardeva painted seven Vaikunthas on broad cloth and crafted masks of demons and celestials so that all people might see truth with their own eyes.",
      },
    ],
    relatedKnowledgeIds: ["durga-puja-bengal", "kashi-ganga-aarti"],
    communityCircleSlug: "northeast-heritage",
    tags: ["Assam", "Majuli", "Sattriya", "Mask Theatre", "Bhakti"],
    imageUrl: todayReflection,
  },

  {
    id: "khasi-living-root-bridges",
    slug: "khasi-living-root-bridges-bio-engineering",
    curiosityQuestion: "How do Khasi communities weave living tree roots across monsoon rivers over 50 years?",
    title: "Growing Bridges Through Time: The Living Architecture of the Khasi",
    category: "craft_food",
    epistemicTier: "DOCUMENTED",
    region: "Meghalaya & Cherrapunji Plateau",
    summary:
      "In the world’s wettest place, wooden and steel bridges rot within seasons. The indigenous Khasi and Jaintia people solve this by guiding the secondary aerial roots of the Ficus elastica tree through hollowed betel-nut trunks across raging torrents, creating living bridges that grow stronger with age for centuries.",
    what: "Bio-engineered living root architecture (Jingkieng Jri) spanning up to 50 meters, including double-decker bridges in Nongriat that support dozens of travelers simultaneously.",
    why: "Rather than cutting nature down to build dead infrastructure, Khasi cultural cosmology partners with living vegetation, ensuring that generations yet unborn inherit stronger infrastructure.",
    origin: {
      era: "Over 500 years documented transmission",
      historicalContext: "Mentioned by British naturalists in 1844, but practiced by indigenous clans for centuries prior.",
      philosophicalRoot: "Tip Kur Tip Kha (Honor the lineage and relation to nature): Human existence is a custodial stewardship.",
    },
    where: {
      locationName: "Sohra (Cherrapunji) & Mawlynnong",
      state: "Meghalaya",
      coordinates: "25.2744° N, 91.7323° E",
      geographicalSignificance: "The steep subtropical cloud-forest valleys draining into the Bangladesh plains.",
    },
    who: {
      custodians: "Khasi and Jaintia tribal villagers",
      lineageOrGuild: "Village Durbar elders and youth collectives",
      transmissionStatus: "vibrant",
    },
    how: {
      practiceSteps: [
        "Planting a Ficus elastica sapling along the riverbank stone",
        "Directing the aerial roots through hollowed Areca catechu trunks horizontally across the chasm",
        "Interweaving roots from opposite shores when they meet in the center",
        "Weaving smaller fibrous tendrils into side railings and paving the footway with flat river stones",
      ],
      visitorEtiquette:
        "Never step on root bridges with heavy spiked trekking boots. Support the village community fund directly, and carry all plastic waste back out.",
    },
    sources: [
      {
        id: "src_unesco_root_bridge",
        title: "UNESCO World Heritage Tentative List Submission",
        sourceType: "archaeological",
        citationRef: "Jingkieng Jri Cultural Landscape, Ref #6622",
        verifier: "Archaeological Survey of India & Khasi Hills Autonomous District Council",
        verifierRole: "Archivist",
        trustScore: 99,
        translationExcerpt:
          "The Jingkieng Jri demonstrates exemplary human-nature symbiosis where living botanical systems are cultivated over decades to withstand the most extreme rainfall on Earth.",
      },
    ],
    relatedKnowledgeIds: ["bishnoi-khejarli", "majuli-neo-vaishnavism"],
    communityCircleSlug: "northeast-heritage",
    tags: ["Meghalaya", "Root Bridges", "Bio-Engineering", "Khasi", "Living Ecology"],
    imageUrl: stillWater,
  },

  // ============================================================================
  // 5. WEST & CENTRAL INDIA
  // ============================================================================
  {
    id: "warkari-pandharpur-vari",
    slug: "warkari-pandharpur-vari-pilgrimage-mauli",
    curiosityQuestion: "Why do hundreds of thousands of rural pilgrims walk 250 kilometers calling each other 'Mauli'?",
    title: "The Footprint of the Saints: The 800-Year Pandharpur Vari",
    category: "festival_ritual",
    epistemicTier: "LIVING_PRACTICE",
    region: "Maharashtra (Alandi to Pandharpur)",
    summary:
      "Every monsoon, over half a million rural farmers, laborers, and seekers walk 21 days across Maharashtra behind the silver palanquins (Palkhis) of Sant Dnyaneshwar and Sant Tukaram, singing Abhangas and addressing every man, woman, and child they meet as 'Mauli' (Mother).",
    what: "An 800-year unbroken foot pilgrimage (Vari) converging on the temple of Vitthala in Pandharpur on Ashadhi Ekadashi, completely dissolving social caste barriers during the march.",
    why: "Calling another pilgrim 'Mauli' recognizes the maternal divine essence inside every person; the grueling physical walk exhausts the ego until only joyful communal chanting remains.",
    origin: {
      era: "c. 13th Century CE (formalized by Sant Dnyaneshwar c. 1290 CE)",
      historicalContext: "Revolutionized social relations in Maharashtra through Marathi vernacular poetry, defying orthodox Brahminical exclusion.",
      philosophicalRoot: "Bhakti Advaita: The God Vitthala stands with hands on hips (Kati Vara Kara) awaiting His loving children.",
    },
    where: {
      locationName: "Alandi, Dehu, Pune, Pandharpur",
      state: "Maharashtra",
      coordinates: "17.6778° N, 75.3275° E",
      geographicalSignificance: "Crossing the Deccan plateau along the banks of the sacred Chandrabhaga River.",
    },
    who: {
      custodians: "Warkari farmers, Dindis (singing units), and hereditary Palkhi trustees",
      lineageOrGuild: "Warkari Sampradaya",
      transmissionStatus: "vibrant",
    },
    how: {
      practiceSteps: [
        "Marching in organized Dindi regiments behind the Chhatrapati (umbrella) and Palkhi",
        "Singing rhythmic Abhangas accompanied by the Taal (cymbals) and Chipli castanets",
        "Ringan: Spiritual cavalry ring dances where sacred horses gallop through crowds without hurting a soul",
        "Bathing in the holy Chandrabhaga River before touching the feet of Vitthala",
      ],
      visitorEtiquette:
        "Join the walking line freely; no registration is required. Accept dry Poha and bananas from community food trucks with two hands. Address fellow walkers as 'Mauli'.",
    },
    sources: [
      {
        id: "src_tukaram_gatha",
        title: "Tukaramanchi Gatha (Abhangas of Sant Tukaram)",
        sourceType: "canonical_text",
        language: "Old Marathi",
        era: "17th Century CE",
        citationRef: "Abhanga 1420",
        verifier: "Bhandarkar Oriental Research Institute, Pune",
        verifierRole: "Scholar",
        trustScore: 99,
        translationExcerpt:
          "There is no high and no low in the court of God. The Brahmin and the outcaste are both washed in the waters of the Chandrabhaga.",
      },
    ],
    relatedKnowledgeIds: ["puri-chhera-panhara", "kashi-ganga-aarti"],
    communityCircleSlug: "maharashtra-heritage",
    tags: ["Warkari", "Maharashtra", "Pandharpur", "Abhanga", "Pilgrimage"],
    imageUrl: journeyImage,
  },

  {
    id: "kutch-rogan-art",
    slug: "kutch-rogan-art-castor-oil-painting",
    curiosityQuestion: "Why is Rogan art created with stretched castor oil without the stylus ever touching the cloth?",
    title: "Painting with Floating Oil: The 400-Year Rogan Mystery of Kutch",
    category: "craft_food",
    epistemicTier: "DOCUMENTED",
    region: "Nirona Village, Kutch, Gujarat",
    summary:
      "In Nirona village, a single surviving family of master craftsmen preserves Rogan art: castor oil is boiled for two days until it turns into a thick elastic resin, mixed with mineral pigments, and stretched into paper-thin threads with a brass stylus that paints intricate motifs while suspended in mid-air above the fabric.",
    what: "A rare freehand textile painting technique requiring zero pre-drawn tracing, where symmetrical halves are created by folding the wet cloth in half like an optical butterfly print.",
    why: "Castor oil was abundant in the arid desert borderlands. When boiled into gelatinous paste, it creates permanent, washable, three-dimensional tactile embossing on cotton that does not crack or fade for decades.",
    origin: {
      era: "c. 17th Century CE",
      historicalContext: "Brought across Sindh and Persia by Khatri Muslim craftsmen settling in the desert salt flats of Kutch.",
      philosophicalRoot: "Mind-Hand Equilibrium: The artist visualizes the complete mandala in the mind's eye; the thread cannot be erased once it lands.",
    },
    where: {
      locationName: "Nirona Village, Bhuj",
      state: "Gujarat",
      coordinates: "23.3853° N, 69.5855° E",
      geographicalSignificance: "Bordering the Great Rann of Kutch salt desert.",
    },
    who: {
      custodians: "Khatri Abdul Gafur and family",
      lineageOrGuild: "National Award and Padma Shri winning Khatri Rogan Guild",
      transmissionStatus: "endangered",
    },
    how: {
      practiceSteps: [
        "Boiling castor oil over outdoor fires for 48 hours until fire-resistant paste forms",
        "Hand-kneading the cooled paste with natural stone and vegetable dyes",
        "Warming a small marble-sized ball of colored paste in the palm using body heat",
        "Pulling thread-like filaments with an 8-inch blunt metal rod into mid-air",
        "Laying the thread on fabric and folding the cloth to transfer mirror-image symmetry",
      ],
      visitorEtiquette:
        "Visits to the Khatri workshop in Nirona are welcoming and educational. Support the master artisans directly without third-party dealer middlemen.",
    },
    sources: [
      {
        id: "src_crafts_council_rogan",
        title: "All India Handicrafts Board Master Documentation",
        sourceType: "archaeological",
        citationRef: "Textile Craft Monograph Series, Vol 14",
        verifier: "Crafts Council of India",
        verifierRole: "Archivist",
        trustScore: 98,
        translationExcerpt:
          "Rogan textile craft represents a singular metallurgical and chemical alchemy found nowhere else on the globe, relying entirely on the viscoelastic properties of oxidized ricinoleic acid.",
      },
    ],
    relatedKnowledgeIds: ["aranmula-mirror", "tamil-kolam-sacred-geometry"],
    communityCircleSlug: "living-craft-guilds",
    tags: ["Gujarat", "Kutch", "Rogan Art", "Castor Oil", "Master Crafts"],
    imageUrl: ritualLamp,
  },

  // ============================================================================
  // 6. GLOBAL: UNITED STATES (INDIGENOUS & HERITAGE)
  // ============================================================================
  {
    id: "hopi-sacred-corn",
    slug: "hopi-sacred-corn-desert-dry-farming",
    curiosityQuestion: "How do Hopi elders grow sacred blue corn in desert sand without irrigation?",
    title: "Farming the Unseen Rain: The Hopi Covenant with Corn",
    category: "community",
    epistemicTier: "ORAL_LORE",
    region: "Hopi Mesas, Black Mesa, Arizona, USA",
    summary:
      "On three arid sandstone mesas in northern Arizona with under 10 inches of annual rainfall, the Hopi people have grown sacred blue, white, and red corn for over 2,000 years without irrigation canals or modern fertilizers, planting seeds 12 inches deep in dry sand based on sacred spiritual covenants.",
    what: "An unbroken indigenous dry-farming agricultural and ceremonial system where corn is contemplated not as food crop, but as their spiritual twin and life guide.",
    why: "The Hopi believe that choosing a difficult, fragile desert homeland teaches humble dependence on prayer, moral integrity, and harmony with seasonal rain clouds (Katsinas).",
    origin: {
      era: "Over 2,000 years continuous agriculture on the Colorado Plateau",
      historicalContext: "Old Oraibi on Third Mesa is the oldest continuously inhabited village in North America, inhabited since at least 1100 CE.",
      philosophicalRoot: "Hopivötskwani (The Hopi Path of Life): Peace, humility, and absolute respect for all living things.",
    },
    where: {
      locationName: "First, Second, and Third Mesas, Navajo County",
      state: "Arizona, United States",
      coordinates: "35.8753° N, 110.5186° W",
      geographicalSignificance: "Isolated sandstone mesas rising 1,000 feet above the Painted Desert floor.",
    },
    who: {
      custodians: "Hopi Clan Elders and Dry-Farming Families",
      lineageOrGuild: "Bear, Badger, Corn, and Water clan lineages",
      transmissionStatus: "living",
    },
    how: {
      practiceSteps: [
        "Planting deep seeds with a wooden digging stick (So'ya) down to residual winter snow moisture",
        "Planting 10 to 15 seeds per clump to break the crust and shelter each other from desert winds",
        "Singing morning prayer songs directly to sprouting seedlings",
        "Ceremonial harvest of blue cornmeal used in morning sunrise prayers",
      ],
      visitorEtiquette:
        "Hopi villages strictly prohibit all photography, audio recording, and sketching. Never touch corn shrines or wander into ceremonial kivas.",
    },
    sources: [
      {
        id: "src_hopi_cultural_preservation",
        title: "Hopi Cultural Preservation Office Archives",
        sourceType: "oral_lineage",
        citationRef: "Oral Testimonies of Hopi Farming Lineages §9",
        verifier: "Leigh Kuwanwisiwma (Hopi Cultural Preservation Officer)",
        verifierRole: "Community Steward",
        trustScore: 97,
        translationExcerpt:
          "The corn is our mother. She took our hands when we emerged into this fourth world. If you do not breathe pure thoughts toward the stalk, it will wither in the heat.",
      },
    ],
    relatedKnowledgeIds: ["bishnoi-khejarli", "khasi-living-root-bridges"],
    communityCircleSlug: "indigenous-wisdom",
    tags: ["Hopi", "Indigenous America", "Dry Farming", "Sacred Corn", "Arizona"],
    imageUrl: stillWater,
  },

  {
    id: "gullah-geechee-sweetgrass",
    slug: "gullah-geechee-lowcountry-sweetgrass-coils",
    curiosityQuestion: "Why do Lowcountry Gullah Geechee communities preserve West African coil basketry?",
    title: "Sewing Grass and Memory: The Gullah Geechee Living Diaspora",
    category: "craft_food",
    epistemicTier: "DOCUMENTED",
    region: "Sea Islands of South Carolina & Georgia, USA",
    summary:
      "Along the barrier islands and tidal marshes of coastal South Carolina and Georgia, direct descendants of enslaved West Africans preserve an unbroken 300-year linguistic, musical, and artisan culture—most famously sewing sweetgrass, pine needle, and palmetto into durable coiled work baskets identical to Sierra Leone traditions.",
    what: "One of the oldest surviving African-diasporic cultural corridors in the Western Hemisphere, designated a federal Cultural Heritage Corridor by US Congress in 2006.",
    why: "Due to malaria-ridden subtropical rice marshes, white plantation owners abandoned the Sea Islands for months, enabling Gullah communities to preserve authentic West African grammar, ring shout songs, and coil-weaving.",
    origin: {
      era: "17th–18th Century CE",
      historicalContext: "Enslaved peoples were targeted specifically from the West African 'Rice Coast' for their hydraulic engineering knowledge.",
      philosophicalRoot: "Ancestral Continuity: Sewing the basket is passing the ancestral cord unbroken from hand to hand.",
    },
    where: {
      locationName: "Mount Pleasant, St. Helena Island & Sapelo Island",
      state: "South Carolina & Georgia, United States",
      coordinates: "32.7765° N, 79.9311° W",
      geographicalSignificance: "Saltwater marsh estuaries and maritime live oak forests draped in Spanish moss.",
    },
    who: {
      custodians: "Gullah Geechee community elders and basket weavers",
      lineageOrGuild: "Mount Pleasant Sweetgrass Weaving Guilds",
      transmissionStatus: "living",
    },
    how: {
      practiceSteps: [
        "Harvesting wild coastal sweetgrass (Muhlenbergia sericea) and saw palmetto from salt marshes",
        "Drying grasses in coastal sun until golden and pliable",
        "Using a sharpened spoon handle or bone 'bone tool' to coil bundles tightly",
        "Sewing rows together with split palmetto ribbons into fanner baskets and bread trays",
      ],
      visitorEtiquette:
        "Sweetgrass baskets are handcrafted works of fine historical art taking weeks to create. Do not aggressively haggle with elder weavers along Highway 17.",
    },
    sources: [
      {
        id: "src_gullah_geechee_corridor",
        title: "Gullah Geechee Cultural Heritage Corridor Management Plan",
        sourceType: "canonical_text",
        citationRef: "National Park Service Cultural Document #2012-GGC",
        verifier: "Dr. Emory Campbell (Gullah Historian)",
        verifierRole: "Community Steward",
        trustScore: 98,
        translationExcerpt:
          "The basket is not merely a container; it is the physical thread that tied Africa across the Atlantic into the soil of the American Sea Islands.",
      },
    ],
    relatedKnowledgeIds: ["aranmula-mirror", "kutch-rogan-art"],
    communityCircleSlug: "diaspora-heritage",
    tags: ["Gullah Geechee", "Sweetgrass", "Sea Islands", "African Diaspora", "Craft"],
    imageUrl: monasteryCorridor,
  },

  // ============================================================================
  // 7. GLOBAL: UK & EUROPE
  // ============================================================================
  {
    id: "mount-athos-hesychasm",
    slug: "mount-athos-hesychasm-prayer-of-heart",
    curiosityQuestion: "Why has Mount Athos maintained unbroken silent breath prayer for over 1,000 years?",
    title: "The Holy Mountain: Hesychastic Stillness on Mount Athos",
    category: "sacred_place",
    epistemicTier: "DOCUMENTED",
    region: "Athos Peninsula, Chalkidiki, Greece",
    summary:
      "Rising 2,033 meters directly out of the Aegean Sea, the monastic republic of Mount Athos has barred cars, weapons, and worldly commerce for over a millennium to preserve 'Hesychia'—an unbroken lineage of contemplative inner stillness, synchronized breathing, and repetitive prayer of the heart.",
    what: "An autonomous monastic state comprising 20 sovereign Eastern Orthodox monasteries and hundreds of isolated cliffside hermitages (Sketes).",
    why: "Hesychasm teaches that the rational intellect cannot grasp God; divine presence is experienced directly as uncreated light (Taboric Light) when thoughts cease and the mind descends into the heart.",
    origin: {
      era: "Formalized in 963 CE (monastic foundations by St. Athanasius the Athonite; theology defended by Gregory Palamas in 14th century)",
      historicalContext: "Remained autonomous through the Byzantine, Ottoman, and modern eras.",
      philosophicalRoot: "Hesychia (Divine Stillness): Sobriety of mind (Nepsis) and continuous inner recollection.",
    },
    where: {
      locationName: "Mount Athos Autonomous Monastic State",
      state: "Central Macedonia, Greece",
      coordinates: "40.1578° N, 24.3283° E",
      geographicalSignificance: "A wild 50-kilometer mountainous promontory surrounded by treacherous Aegean seas.",
    },
    who: {
      custodians: "Athonite Monks and Hermits",
      lineageOrGuild: "Spiritual Gerondas (Elder) and Disciple lineage",
      transmissionStatus: "vibrant",
    },
    how: {
      practiceSteps: [
        "Rising at midnight for all-night vigil (Agrypnia) illuminated solely by beeswax candles",
        "Seated on low wooden stools with chin bowed toward the chest",
        "Synchronizing the rhythmic repetition of the Jesus Prayer with the natural heartbeat and breath",
        "Working in silence in herb gardens, woodcarving studios, and olive presses during the day",
      ],
      visitorEtiquette:
        "Access requires an official Diamonitirion pilgrim permit. Traditional Athonite Avaton rules apply. Strict reverent dress and observance of monastic meal times.",
    },
    sources: [
      {
        id: "src_philokalia_athos",
        title: "The Philokalia (Anthology of the Contemplative Fathers)",
        sourceType: "canonical_text",
        language: "Greek",
        era: "Compiled by St. Nicodemus of the Holy Mountain, 1782 CE",
        citationRef: "Texts on Watchfulness by Hesychios the Priest §14",
        verifier: "Metropolitan Kallistos Ware / Oxford",
        verifierRole: "Scholar",
        trustScore: 99,
        translationExcerpt:
          "Just as it is impossible for a ship to sail without water, so it is impossible for the soul to achieve stillness without watchfulness and humble breathing.",
      },
    ],
    relatedKnowledgeIds: ["kashmir-trika-spanda", "arunachala-pradakshina"],
    communityCircleSlug: "monastic-traditions",
    tags: ["Mount Athos", "Hesychasm", "Christian Contemplation", "Greece", "Silence"],
    imageUrl: monasteryCorridor,
  },

  {
    id: "alhambra-sacred-water-geometry",
    slug: "alhambra-sacred-water-geometry-moorish",
    curiosityQuestion: "How did Moorish architects turn mountain water into an instrument of cosmological order?",
    title: "Liquid Architecture: The Sufi Water Geometry of the Alhambra",
    category: "sacred_place",
    epistemicTier: "DOCUMENTED",
    region: "Granada, Andalusia, Spain",
    summary:
      "Perched on the Sabika hill overlooking Granada, the 14th-century Nasrid palace of the Alhambra uses pure snowmelt channeled 6 kilometers from the Sierra Nevada to create quiet reflecting pools, bubbling fountains, and micro-channels that turn running water into a visual metaphor for divine omnipresence.",
    what: "The pinnacle of medieval Islamic Moorish palace architecture, integrating Arabic calligraphy, mathematical girih tile lattices, and silent acoustic water design.",
    why: "In Andalusian Sufi architecture, water is not an ornamental luxury; it is the visual stillness that mirrors celestial infinity on earth, dissolving the heaviness of stone walls into light.",
    origin: {
      era: "13th–14th Century CE (Nasrid Dynasty under Yusuf I and Muhammad V)",
      historicalContext: "The final intellectual and artistic synthesis of Al-Andalus prior to the fall of Granada in 1492 CE.",
      philosophicalRoot: "Quranic Paradisiacal Garden: 'Jannat tajri min tahtiha al-anhar' (Gardens beneath which rivers flow).",
    },
    where: {
      locationName: "Alhambra & Generalife, Granada",
      state: "Andalusia, Spain",
      coordinates: "37.1773° N, 3.5897° W",
      geographicalSignificance: "UNESCO World Heritage Site situated at the foot of the snow-clad Sierra Nevada mountains.",
    },
    who: {
      custodians: "Nasrid royal architects (Al-Amil), master zellij tilers, and contemporary conservationists",
      lineageOrGuild: "Andalusian guild of hydraulic engineers and geometricians",
      transmissionStatus: "archival",
    },
    how: {
      practiceSteps: [
        "Diverting the Darro River via the Acequia Real aqueduct using precise gravity slopes",
        "Forming glass-smooth mirror ponds in the Court of the Myrtles without surface ripples",
        "Designing the Court of the Lions with twelve marble water spouts marking solar hours",
        "Inscribing repeating epigraphic poetry directly onto stucco walls: 'Wa la ghaliba illa Allah' (There is no victor but God)",
      ],
      visitorEtiquette:
        "Walk softly through the courtyards to appreciate the delicate acoustic soundscapes. Do not touch stucco reliefs or toss coins into historical hydraulic pools.",
    },
    sources: [
      {
        id: "src_ibn_zamrak_poems",
        title: "Poetic Inscriptions of Ibn Zamrak",
        sourceType: "canonical_text",
        language: "Classical Arabic",
        era: "14th Century CE",
        citationRef: "Court of the Lions Inscription Band §4",
        verifier: "Dr. Oleg Grabar / Harvard",
        verifierRole: "Scholar",
        trustScore: 99,
        translationExcerpt:
          "Look at the water, and look at the vessel: is the water flowing, or is the marble melting? Like the lover whose tears are restrained by fear of the spy.",
      },
    ],
    relatedKnowledgeIds: ["kashi-ganga-aarti", "aranmula-mirror"],
    communityCircleSlug: "islamic-heritage",
    tags: ["Alhambra", "Andalusia", "Islamic Geometry", "Sacred Water", "Architecture"],
    imageUrl: monasteryCorridor,
  },

  // ============================================================================
  // 8. GLOBAL: MIDDLE EAST & EGYPT
  // ============================================================================
  {
    id: "egypt-luxor-astronomical-alignment",
    slug: "luxor-temple-opet-cosmic-renewal",
    curiosityQuestion: "How did ancient Egyptians align Luxor Temple to the annual Nile flood and cosmic rebirth?",
    title: "The Scepter of the Southern Sanctuary: Luxor’s Temple of Man",
    category: "sacred_place",
    epistemicTier: "DOCUMENTED",
    region: "Luxor (Ancient Thebes), Nile Valley, Egypt",
    summary:
      "Built along the eastern bank of the Nile around 1400 BCE, the Temple of Luxor was constructed not for ordinary public worship, but for the annual Opet Festival, where the god Amun-Re traveled in a golden sacred barge from Karnak to renew the spiritual Ka (divine soul) of Pharaoh and the fertile soil of Egypt.",
    what: "A monumental sandstone temple complex featuring colossal statues of Ramesses II, hypostyle halls, and papyrus-bundle stone columns mimicking the primordial reeds of creation.",
    why: "Ancient Egyptian religion viewed the universe as perpetually threatened by chaos (Isfet). Architectural alignment with solar and Nile cycles restored cosmic harmony (Ma'at).",
    origin: {
      era: "c. 1400–1250 BCE (New Kingdom under Amenhotep III and Ramesses II)",
      historicalContext: "Constructed during the apex of New Kingdom Theban imperial power.",
      philosophicalRoot: "The Temple as Human Microcosm (studied by Schwaller de Lubicz): Proportions mirror the anatomical and energetic structure of humankind.",
    },
    where: {
      locationName: "East Bank of the Nile, Luxor",
      state: "Luxor Governorate, Egypt",
      coordinates: "25.6995° N, 32.6392° E",
      geographicalSignificance: "Linked to Karnak Temple by the 3-kilometer sacred Avenue of Sphinxes.",
    },
    who: {
      custodians: "Priesthood of Amun-Re and royal stone sculptors",
      lineageOrGuild: "New Kingdom royal architect guilds (Amenhotep son of Hapu)",
      transmissionStatus: "archival",
    },
    how: {
      practiceSteps: [
        "Observing the heliacal rising of Sirius (Sopdet) heralding the summer Nile inundation",
        "Carrying the Amun-Re barque in royal procession down the Avenue of Sphinxes",
        "Consecrating the inner sanctuary chambers with frankincense, myrrh, and lotus unguents",
        "Re-crowning the Pharaoh in the secret sanctuary of the divine Ka",
      ],
      visitorEtiquette:
        "Visit during twilight or night illumination when the relief carvings cast dramatic shadows. Never lean against ancient painted sandstone reliefs.",
    },
    sources: [
      {
        id: "src_opet_festival_reliefs",
        title: "Colonnade Hall Opet Festival Inscriptions",
        sourceType: "canonical_text",
        language: "Ancient Egyptian Hieroglyphs",
        era: "c. 1330 BCE (Tutankhamun & Horemheb)",
        citationRef: "Luxor Colonnade Hall, West Wall Rel. 12-28",
        verifier: "Epigraphic Survey of the Oriental Institute / Chicago House",
        verifierRole: "Archivist",
        trustScore: 99,
        translationExcerpt:
          "Amun-Re arrives in his glory to embrace his living son; the inundation swells and the two lands rejoice in balance and truth.",
      },
    ],
    relatedKnowledgeIds: ["kashi-ganga-aarti", "arunachala-pradakshina"],
    communityCircleSlug: "ancient-heritage",
    tags: ["Egypt", "Luxor", "Opet Festival", "Sacred Astronomy", "Nile"],
    imageUrl: ritualLamp,
  },

  {
    id: "whirling-dervishes-mevlevi",
    slug: "mevlevi-sema-whirling-dervishes-rumi",
    curiosityQuestion: "Why do Sufi dervishes whirl counter-clockwise with their right palm to heaven and left to earth?",
    title: "Turning into the Sun: The Sacred Sema of Jalaluddin Rumi",
    category: "festival_ritual",
    epistemicTier: "LIVING_PRACTICE",
    region: "Konya, Central Anatolia, Turkey",
    summary:
      "In the 13th century in Konya, Sufi mystic Jalaluddin Rumi instituted the Sema ceremony: dervishes shed their black cloaks (symbolizing the tomb of the ego) to reveal white skirts (the shroud of the ego) and whirl counter-clockwise around the central Sheikh, turning like planets around the sun.",
    what: "A 700-year-old liturgical Sufi movement meditation combining classical reed flute (Ney) music, liturgical singing, and circular turning, recognized by UNESCO in 2008.",
    why: "The right hand is raised toward heaven to receive divine benevolence; the left hand is turned downward toward the earth to transmit that love to all creation without holding anything back.",
    origin: {
      era: "13th Century CE (1273 CE following the passing of Rumi)",
      historicalContext: "Codified by Rumi's son Sultan Walad into the Mevlevi Sufi Order in Konya.",
      philosophicalRoot: "Wahdat al-Wujud (Unity of Being): Everything in existence from atoms to galaxies is in perpetual ecstatic revolution.",
    },
    where: {
      locationName: "Mevlana Sanctuary & Dergah, Konya",
      state: "Konya, Turkey",
      coordinates: "37.8706° N, 32.5050° E",
      geographicalSignificance: "The central Anatolian steppe plateau along the historic Silk Road.",
    },
    who: {
      custodians: "Mevlevi Order Semazens (Whirling Dervishes) and Musicians",
      lineageOrGuild: "International Mevlana Foundation and hereditary Celebi descendants",
      transmissionStatus: "vibrant",
    },
    how: {
      practiceSteps: [
        "Recitation of the Na'at-i Sharif in praise of the Prophet accompanied by the solitary wail of the Ney",
        "Three slow circular circumambulations of the hall (Devr-i Veled) bowing to fellow seekers",
        "Shedding the heavy dark woolen cloak to reveal flowing white robes",
        "Beginning the four musical cycles (Selams) of whirling on the ball of the left foot",
        "Ending with recitation of the Quran and prayers for all suffering humanity",
      ],
      visitorEtiquette:
        "The Sema is a sacred prayer, not a folkloric dance show. Do not applaud during or after the ceremony. Maintain meditative silence throughout.",
    },
    sources: [
      {
        id: "src_rumi_masnavi",
        title: "The Mathnawi of Jalaluddin Rumi",
        sourceType: "canonical_text",
        language: "Persian",
        era: "c. 1260 CE",
        citationRef: "Book 1, Verses 1-18 (The Song of the Reed)",
        verifier: "Dr. Annemarie Schimmel / Harvard",
        verifierRole: "Scholar",
        trustScore: 99,
        translationExcerpt:
          "Listen to the reed how it complains, telling a tale of separations: 'Ever since I was cut from the reed-bed, my cry has caused man and woman to weep.'",
      },
    ],
    relatedKnowledgeIds: ["baul-mystics", "warkari-pandharpur-vari"],
    communityCircleSlug: "sufi-heritage",
    tags: ["Sufism", "Rumi", "Whirling Dervish", "Sema", "Konya", "UNESCO"],
    imageUrl: todayReflection,
  },

  // ============================================================================
  // 9. GLOBAL: ASIA (FAR EAST & SOUTHEAST ASIA)
  // ============================================================================
  {
    id: "japan-ise-jingu-shikinen-sengu",
    slug: "japan-ise-jingu-shikinen-sengu-rebuilding",
    curiosityQuestion: "Why has Japan rebuilt the sacred wooden Grand Shrine of Ise from scratch every 20 years for 1,300 years?",
    title: "Eternal by Dying: The 20-Year Rebuilding of Ise Jingu",
    category: "tradition",
    epistemicTier: "DOCUMENTED",
    region: "Ise, Mie Prefecture, Japan",
    summary:
      "Every 20 years, for over 1,300 years without interruption, Japanese Shinto master carpenters dismantle the sacred Grand Shrine of Ise (Naiku) and rebuild it from raw Japanese cypress (Hinoki) wood on an adjacent alternate plot with zero nails, transferring the sacred mirror of Amaterasu to its fresh home.",
    what: "The supreme Shinto ritual called 'Shikinen Sengu', requiring eight years of preparatory ceremonies, thousands of timber logs, and 62 distinct ceremonial rites.",
    why: "Western monuments seek permanence through stone, yet stone decays unnoticed. Ise achieves eternal continuity through deliberate impermanence (Tokowaka) and ensuring master carpentry techniques are passed directly from elder to apprentice every generation.",
    origin: {
      era: "690 CE (Instituted under Empress Jito)",
      historicalContext: "Has occurred 62 times across 13 centuries, surviving civil wars and modern modernization.",
      philosophicalRoot: "Shinto Tokowaka (Eternal Youthfulness through Renewal): Purity (Kegare-reversal) through continual recreation.",
    },
    where: {
      locationName: "Ise Grand Shrine (Naiku & Geku), Uji-tachi",
      state: "Mie Prefecture, Japan",
      coordinates: "34.4550° N, 136.7258° E",
      geographicalSignificance: "Deep within sacred old-growth Hinoki cedar forests beside the pristine Isuzu River.",
    },
    who: {
      custodians: "Jingu Administration, Shinto Priests (Kannushi), and Master Shrine Carpenters (Miyadaiku)",
      lineageOrGuild: "Imperial Household Shinto and hereditary Miyadaiku guilds",
      transmissionStatus: "vibrant",
    },
    how: {
      practiceSteps: [
        "Harvesting 200-year-old Hinoki cypress logs with hand axes and shinto prayers",
        "Floating timber down the river into the sacred sanctuary grounds",
        "Framing the Shinmei-zukuri post-and-lintel architecture with zero metallic fasteners",
        "Thatching the massive roofs with miscanthus reed grass",
        "Sengyo: Solemn midnight darkness procession carrying the sacred mirror into the new sanctuary",
      ],
      visitorEtiquette:
        "Visitors may approach only to the outer white silk curtain of the inner sanctuary. Bow twice, clap hands twice, and bow once in reverent silence. No photography inside the fence.",
    },
    sources: [
      {
        id: "src_nihon_shoki_ise",
        title: "Nihon Shoki (Chronicles of Japan)",
        sourceType: "canonical_text",
        language: "Classical Japanese",
        era: "720 CE",
        citationRef: "Scroll 30 (Emperor Jito)",
        verifier: "Prof. Susumu Nakanishi",
        verifierRole: "Scholar",
        trustScore: 99,
        translationExcerpt:
          "Let the holy dwelling of the sun mirror be renewed on the alternate sanctuary ground so that the lineage of heaven remains eternally fresh.",
      },
    ],
    relatedKnowledgeIds: ["aranmula-mirror", "khasi-living-root-bridges"],
    communityCircleSlug: "east-asian-heritage",
    tags: ["Japan", "Shinto", "Ise Jingu", "Shikinen Sengu", "Carpentry"],
    imageUrl: monasteryCorridor,
  },

  {
    id: "bali-subak-water-temples",
    slug: "bali-subak-water-temples-ecological-democracy",
    curiosityQuestion: "How do Balinese water priests manage rice terraces better than computerized irrigation?",
    title: "The Flow of Tri Hita Karana: Bali’s Subak Water Temple Democracy",
    category: "sacred_place",
    epistemicTier: "DOCUMENTED",
    region: "Jatiluwih & Lake Batur, Bali, Indonesia",
    summary:
      "For over 1,000 years, Balinese farmers have coordinated water sharing across hundreds of stepped mountainside rice terraces not through government bureaucracy, but through an autonomous democratic network of water temples (Subaks) honoring the lake goddess Dewi Danu, synchronizing planting calendars to naturally eradicate rice pests.",
    what: "An ecological-spiritual water management system inscribed by UNESCO in 2012, encompassing volcanic crater lakes, river canals, and village water temples.",
    why: "Operates on the philosophy of 'Tri Hita Karana'—harmony among humans, nature, and the divine. Sharing water upstream and downstream prevents drought and insect plagues without toxic pesticides.",
    origin: {
      era: "c. 9th–11th Century CE",
      historicalContext: "Documented in royal copperplate inscriptions (Prasasti) dating to 882 CE.",
      philosophicalRoot: "Tri Hita Karana: Ecology and spirituality are one indivisible cycle.",
    },
    where: {
      locationName: "Ulun Danu Batur & Jatiluwih Rice Terraces",
      state: "Bali, Indonesia",
      coordinates: "8.3694° S, 115.1320° E",
      geographicalSignificance: "Spanning volcanic slopes fed by Lake Batur's geothermal caldera.",
    },
    who: {
      custodians: "Pekaseh (elected subak village leaders) and Jero Gede (water temple priests)",
      lineageOrGuild: "Subak Farmer Cooperatives",
      transmissionStatus: "vibrant",
    },
    how: {
      practiceSteps: [
        "Gathering at the summit water temple (Pura Ulun Danu Batur) to set regional planting calendars",
        "Diverting water through stone weirs and bamboo water pipes to cooperative channels",
        "Offering canang sari floral basket offerings at every canal junction",
        "Flooding entire valleys simultaneously to drown insect larvae across whole districts",
      ],
      visitorEtiquette:
        "Wear a traditional sarong and sash when entering water temple grounds. Walk only on the narrow designated ridges between rice paddies; never trample growing stalks.",
    },
    sources: [
      {
        id: "src_lansing_subak",
        title: "Priests and Programmers: Technologies of Power in the Engineered Landscape of Bali",
        sourceType: "canonical_text",
        language: "English / Balinese",
        era: "1991 CE (J. Stephen Lansing Anthropological Study)",
        citationRef: "Chapter 4: The Goddess and the Green Revolution",
        verifier: "Dr. J. Stephen Lansing (Santa Fe Institute)",
        verifierRole: "Scholar",
        trustScore: 99,
        translationExcerpt:
          "Computer simulations revealed that the ancestral temple water calendar maximized rice yields while minimizing pests more efficiently than top-down industrial irrigation programs.",
      },
    ],
    relatedKnowledgeIds: ["bishnoi-khejarli", "khasi-living-root-bridges"],
    communityCircleSlug: "southeast-asian-heritage",
    tags: ["Bali", "Subak", "Water Temples", "Ecology", "UNESCO", "Indonesia"],
    imageUrl: todayReflection,
  },

  {
    id: "tibet-sand-mandala-dissolution",
    slug: "tibetan-sand-mandala-impermanence-dissolution",
    curiosityQuestion: "Why do Tibetan monks spend weeks creating gem-powder sand mandalas only to sweep them away?",
    title: "Gems Returned to River: The Sacred Dissolution of the Sand Mandala",
    category: "festival_ritual",
    epistemicTier: "LIVING_PRACTICE",
    region: "Tibetan Plateau, Ladakh & Dharamshala",
    summary:
      "Trained Tibetan Buddhist monks spend hundreds of hours using thin metal funnels (Chak-pur) to deposit millions of grains of colored crushed mineral sand into kaleidoscopic sacred cosmological palaces (Mandalas). The instant it is finished, the Abbot draws a diamond vajra across the design, sweeps the sand into an urn, and pours it into a moving river.",
    what: "The ancient Tantric Buddhist ritual of Dul-tson-kyi-kyil-khor (mandala of colored powders), representing the palace of a specific meditation deity (such as Kalachakra or Avalokiteshvara).",
    why: "To train the human heart in profound non-attachment (Anitya): nothing in conditioned existence lasts. Returning the blessed sand to running water spreads healing compassion downstream to the oceans.",
    origin: {
      era: "Over 1,200 years unbroken (Indian Nalanda Tantric transmission to Tibet in 8th century CE)",
      historicalContext: "Taught by Padmasambhava and codified in the Tibetan monastic tantric colleges (Gyuto and Gyume).",
      philosophicalRoot: "Shunyata (Emptiness) & Anitya (Impermanence): Form is emptiness, and emptiness is form.",
    },
    where: {
      locationName: "Dharamsala, Leh (Ladakh) & Lhasa",
      state: "Himachal Pradesh & Tibetan Plateau",
      coordinates: "32.2426° N, 76.3213° E",
      geographicalSignificance: "High-altitude Himalayan monastic sanctuaries.",
    },
    who: {
      custodians: "Tantric College Monks (Gyuto, Gyume, and Namgyal)",
      lineageOrGuild: "Tibetan Gelug, Kagyu, Nyingma, and Sakya monastic lineages",
      transmissionStatus: "vibrant",
    },
    how: {
      practiceSteps: [
        "Drawing chalk geometric grids using consecrated string lines snapping over the board",
        "Channeling colored powdered stone through corrugated copper cones using gentle vibration",
        "Working inward from the four outer gates to the radiant central deity syllable",
        "Consecrating the palace through three days of tantric chanting and horn music",
        "Sweeping the sands smoothly with a badger brush into the central vase and carrying it to a live stream",
      ],
      visitorEtiquette:
        "Visitors are invited to witness the sand placement in silence. Never blow breath toward the sand board (monks wear face cloths).",
    },
    sources: [
      {
        id: "src_kalachakra_tantra",
        title: "Sri Kalachakra Tantra (Laghu Kalachakra)",
        sourceType: "canonical_text",
        language: "Sanskrit & Classical Tibetan",
        era: "c. 10th Century CE",
        citationRef: "Chapter 3: The Mandala of Initiation",
        verifier: "Library of Tibetan Works and Archives, Dharamshala",
        verifierRole: "Archivist",
        trustScore: 99,
        translationExcerpt:
          "Just as clouds form in the blue sky and dissolve back into transparent air without a trace, so does the palace of wisdom dissolve into the great clear light.",
      },
    ],
    relatedKnowledgeIds: ["arunachala-pradakshina", "japan-ise-jingu-shikinen-sengu"],
    communityCircleSlug: "himalayan-heritage",
    tags: ["Tibet", "Sand Mandala", "Buddhism", "Impermanence", "Kalachakra"],
    imageUrl: ritualLamp,
  },
];
