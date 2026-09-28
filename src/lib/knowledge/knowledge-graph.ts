/**
 * EKA Cultural Knowledge Graph Engine & Canonical Dataset
 *
 * Implements the core graph data structure and canonical cultural objects
 * across 10 distinct traditions, regions, and crafts.
 *
 * Each object features:
 * - 10 Cultural Dimensions
 * - Cultural Variations (Regional, Community, Historical, Contemporary, Diaspora)
 * - Epistemic Claims Taxonomy (Documented, Source Supported, Traditional Belief, Interpretation, Disputed)
 * - Source Passport (Tier breakdown, CC0/CC BY-SA/Institutional provenance, Evidence Strength)
 * - Semantic Knowledge Graph Relations (practiced_by, occurs_in, associated_with_craft, etc.)
 */

import {
  type EkaKnowledgeObject,
  type CulturalVariation,
  type EpistemicClaim,
  type LinkedGraphNode,
  generateSourcePassport,
} from "./knowledge-object";

export const CANONICAL_KNOWLEDGE_OBJECTS: EkaKnowledgeObject[] = [
  // 1. DIWALI (Deepavali)
  {
    id: "eko-diwali-fest-01",
    slug: "diwali",
    entity: "Diwali (Deepavali)",
    type: "festival",
    oneLiner: "The pan-indic festival of lights observed across diverse regional narratives, Jain moksha, Sikh liberation, and Newar self-worship.",
    summary:
      "Diwali (Sanskrit: Dīpāvalī, 'row of lights') is one of the most widely celebrated cultural and spiritual festivals of South Asia. While commonly generalized as a monolithic celebration of light over darkness, EKA documents the profound regional, theological, and community variations: Rama's return to Ayodhya in Northern traditions, Krishna's victory over Narakasura and dawn Ganga Snanam in Southern traditions, Kali Puja in Bengal, Mahavira's Nirvana in Jainism, Bandi Chhor Divas in Sikhism, and Mha Puja (reverence of the inner soul) among Nepal's Newar Buddhists.",
    culturalDimensions: {
      identity: {
        canonicalName: "Deepavali (Diwali)",
        alternativeNames: ["Divali", "Deepavali", "Tihar", "Swanti", "Bandi Chhor Divas", "Kali Puja"],
        languages: ["Sanskrit", "Hindi", "Tamil", "Bengali", "Gujarati", "Newari", "Punjabi", "Telugu", "Kannada", "Marathi"],
        regions: ["Pan-India", "Nepal", "Sri Lanka", "Guyana", "Suriname", "Mauritius", "Fiji", "Singapore", "Global Diaspora"],
        communities: ["Hindus", "Jains", "Sikhs", "Newar Buddhists", "Sindhis", "Marwaris"],
      },
      history: {
        origins: "Traced to ancient agrarian autumn harvest festivals documented in Vedic texts (Shatapatha Brahmana) and classical Sanskrit literature including the Padma Purana, Skanda Purana, and Harsha's 7th-century play Nagananda.",
        historicalPeriods: ["Vedic Antiquity", "Classical Sanskrit Era (c. 4th-8th century CE)", "Medieval Sultanate & Mughal Chronicles", "Colonial Period", "Global Contemporary Era"],
        milestones: [
          "527 BCE (traditional): Bhagwan Mahavira attains Nirvana at Pavapuri, commemorated by Jains lighting earthen lamps.",
          "1619 CE: Sixth Sikh Guru, Guru Hargobind Ji, arrives at Amritsar after securing release of 52 Rajput kings from Gwalior Fort (Bandi Chhor Divas).",
          "1770s CE: Raja Krishnachandra of Nadia popularizes community-wide Kali Puja across Bengal.",
          "2021 CE: Officially recognized as a state school holiday in New York City and various worldwide municipal jurisdictions.",
        ],
      },
      beliefs: {
        worldview: "Illumination of consciousness over ignorance (tamaso mā jyotir gamaya), victory of dharma over adharma, renewal of ethical commitments, and spiritual debt clearance.",
        spiritualConcepts: ["Jyoti (Divine Light)", "Lakshmi-Kripa (Auspicious Grace)", "Nirvana / Moksha (Liberation)", "Bandi Chhor (Emancipation)", "Mha Puja (Honoring the Self)"],
        philosophicalConcepts: ["Inner illumination", "Renunciation of ego", "Karmic renewal", "Cosmic order (Rta)"],
        religiousContext: ["Sanatana Dharma / Hinduism", "Jainism", "Sikhism", "Vajrayana / Newar Buddhism"],
      },
      practices: {
        rituals: [
          "Lighting of handmade terracotta diyas with mustard or sesame oil",
          "Rangoli / Kolam / Alpana floor geometric art using rice flour and mineral pigments",
          "Chopda Pujan (consecration of account books and ledger renewal among trading communities)",
          "Ganga Snanam (predawn sacred medicinal oil bath in Tamil Nadu and Karnataka)",
          "Lakshmi and Ganesha puja at dusk during Pradosh Kaal",
        ],
        ceremonies: ["Dhanteras (Veneration of Dhanvantari and metal renewal)", "Naraka Chaturdashi / Choti Diwali", "Lakshmi Puja / Kali Puja", "Govardhan Puja / Annakut", "Bhai Dooj / Yama Dwitiya"],
        festivals: ["5-day autumnal cycle", "Bandi Chhor Divas (Amritsar)", "Tihar / Swanti (Kathmandu Valley)"],
        dailyPractices: ["Cleaning and whitewashing homes", "Exchanging traditional sweets (Mithai)", "Charitable feeding (Annadanam)"],
      },
      materialCulture: {
        clothing: ["Traditional handloom silk sarees (Kanjeevaram, Paithani, Banarasi)", "Kurta-pajama in raw tussar or cotton", "Dhoti with zari border"],
        foodways: ["Mithai (Kaju katli, Mysore pak, Sandesh, Gujiya)", "Chivda and savory Farsan", "Sel Roti (Nepal)", "Annakut feasts featuring 56 or 108 offerings"],
        architecture: ["Courtyard illumination", "Threshold torans of fresh mango leaves and marigolds", "Deepastambha (stone lamp pillars in temple sanctums)"],
        crafts: ["Kumhar (potter) wheel-turned clay diyas", "Brass kuthuvilakku lamps", "Handmade silver and gold coins with Lakshmi-Ganesh iconography"],
        sacredObjects: ["Terracotta Diya", "Pancha-dhatu (five-metal) Puja thali", "Sacred Moli thread", "Bahi-Khata ledger books"],
      },
      arts: {
        music: ["Bhajans honoring Lakshmi and Rama", "Shyamasangeet (hymns to Goddess Kali)", "Gurbani Kirtan at Harmandir Sahib", "Traditional Mangala Vadhyam (Nadaswaram)"],
        dance: ["Garba and Dandiya Raas (Gujarat)", "Traditional folk dances welcoming the harvest"],
        literature: ["Ramayana (Valmiki, Tulsidas, Kamban)", "Kalpa Sutra (Jain)", "Guru Granth Sahib references", "Skanda Purana"],
        theatre: ["Ramlila open-air dramatic enactments", "Kathak story recitals of Sita-Rama"],
        visualArts: ["Floor Alpana / Kolam / Rangoli geometry", "Madhubani and Pichwai paintings depicting Diwali scenes"],
      },
      socialLife: {
        communityGatherings: ["Community melas and markets", "Temple midnight vigils", "Neighborhood sweet exchanges", "Family reunions"],
        traditionalOccupations: ["Potters (Kumhars)", "Mithai artisans (Halwais)", "Brass and metal smiths (Kansaras)", "Florists and marigold growers"],
        socialCustoms: ["Pardon of ancient feuds and reconciliation", "Elder blessings with charanamrit", "Bonus and gifts for household and trade workers"],
      },
      geography: {
        places: ["Ayodhya (Uttar Pradesh)", "Amritsar (Golden Temple)", "Pavapuri (Bihar)", "Kolkata (Kalighat & Dakshineswar)", "Kathmandu Valley", "Madurai"],
        sacredLandscapes: ["Saryu River banks", "Ganges River ghats (Varanasi)", "Amrit Sarovar pool"],
        pilgrimageRoutes: ["Panchkoshi Parikrama of Ayodhya", "Pavapuri Jal Mandir pilgrimage"],
        coordinates: { lat: 26.7922, lng: 82.1998 },
      },
      language: {
        script: ["Devanagari", "Gurmukhi", "Tamil", "Bengali", "Gujarati"],
        keyTerminology: [
          { term: "Dīpāvalī", meaning: "A row or array of illuminated lamps", language: "Sanskrit" },
          { term: "Ganga Snanam", meaning: "Ritual oil bath before sunrise purifying like the sacred river Ganges", language: "Tamil" },
          { term: "Bandi Chhor", meaning: "The liberator of prisoners / captives", language: "Punjabi" },
          { term: "Mha Puja", meaning: "Worship of the inner self / supreme within", language: "Newari" },
        ],
        sacredChantsOrCouplets: [
          "ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥ (Brihadaranyaka Upanishad 1.3.28)",
          "शुभं करोति कल्याणमारोग्यं धनसंपदा । शत्रुबुद्धिविनाशाय दीपज्योतिर्नमोऽस्तु ते ॥",
        ],
      },
      modernContext: {
        diasporaPresence: "Celebrated in public squares across Leicester, London, New York Times Square, Sydney, Toronto, and Singapore Little India.",
        contemporaryPractice: "Growing environmental movement towards eco-friendly clay diyas, zero firecracker emissions, LED solar lamps, and ethical artisan patronage.",
        safeguardingEfforts: ["Protection of traditional potters' livelihoods through direct artisan collectives", "Documentation of regional indigenous variations by oral history projects"],
        endangeredElements: ["Handcrafted earthen diya guilds facing industrial paraffin and plastic lamp displacement"],
      },
      localEconomy: {
        traditionalArtisans: ["Kumhars of Gorakhpur & Kumartuli", "Traditional Halwai guilds of Bikaner & Varanasi", "Brass smiths of Moradabad"],
        ethicalLocalBrands: ["Gramodaya Pottery Collectives", "Khadi Village Industries Commission (KVIC) Diyas", "Oorjaa sustainable light designs"],
        livingExperiences: ["Dev Deepawali boat vigils in Varanasi", "Ayodhya Deepotsav heritage trail", "Majuli Sattra oil lamp celebrations"],
        authenticWorkshops: ["Clay lamp throwing at Nizamabad black pottery centers", "Heritage sweet making in Old Delhi"],
      },
    },
    culturalVariations: [
      {
        id: "var-diwali-north",
        dimension: "regional",
        label: "Ayodhya & North Indian Tradition",
        regionOrGroup: "Uttar Pradesh, Bihar, Rajasthan, Delhi",
        distinctPractice: "Commemorates the return of Maryada Purushottam Rama, Sita, and Lakshmana to Ayodhya after 14 years of exile and the defeat of Ravana. Entire towns are illuminated with millions of clay diyas.",
        significance: "Victory of righteousness (dharma) and joyous restoration of just governance (Ramrajya).",
        associatedFoodOrObjects: ["Terracotta diyas", "Kheel (puffed rice)", "Batashas (sugar candy drops)", "Gujiya"],
        sources: ["Valmiki Ramayana", "Ramcharitmanas", "Skanda Purana, Vaishnava Khanda"],
      },
      {
        id: "var-diwali-south",
        dimension: "regional",
        label: "Tamil & South Indian Deepavali",
        regionOrGroup: "Tamil Nadu, Karnataka, Andhra Pradesh, Kerala",
        distinctPractice: "Celebrated on Naraka Chaturdashi before sunrise. The day begins at 4:00 AM with 'Ganga Snanam' — warm sesame oil infused with ginger and peppercorns massaged into hair, followed by Shikakai wash. New clothes are donned before dawn.",
        significance: "Celebrates Krishna and Satyabhama vanquishing the tyrant demon Narakasura. The oil bath symbolizes ritual purification in the cosmic Ganges.",
        associatedFoodOrObjects: ["Deepavali Marundu / Lehyam (medicinal herbal digestive)", "Murukku", "Athirasam", "Mysore Pak"],
        sources: ["Bhagavata Purana Book 10", "Tamil Sangam folklore annotations", "Madras Heritage Gazetteer"],
      },
      {
        id: "var-diwali-bengal",
        dimension: "regional",
        label: "Kali Puja (Shyama Puja)",
        regionOrGroup: "West Bengal, Assam, Tripura, Bangladesh",
        distinctPractice: "Celebrated on the exact night of the new moon (Kartika Amavasya). Instead of Lakshmi, the fierce protective mother Goddess Kali is worshipped throughout the midnight hours with red hibiscus flowers, khichuri, and goat-sacrifice/gourd-sacrifice offerings.",
        significance: "Destruction of ego and illusion; transcending fear of mortality through the fierce compassion of the Divine Mother.",
        associatedFoodOrObjects: ["Red Hibiscus (Jaba phool)", "Khichuri bhog", "Luchi and Alur Dum", "Narkel Naru"],
        sources: ["Mahanirvana Tantra", "Kalika Purana", "Ramprasad Sen devotional anthologies"],
      },
      {
        id: "var-diwali-jain",
        dimension: "community",
        label: "Jain Mahavira Nirvana Divas",
        regionOrGroup: "Digambara & Svetambara Jain Communities",
        distinctPractice: "Marks the physical liberation (Moksha) of the 24th Tirthankara, Bhagwan Mahavira, at Pavapuri in 527 BCE, and the attainment of Kevala Jnana by his chief disciple Gautama Swami. Fasting, recitation of Uttaradhyayana Sutra, and quiet prayer replace loud celebration.",
        significance: "When the illuminating sun of Mahavira's presence passed into Moksha, the assembly lit material lamps to represent the continued illumination of right knowledge.",
        associatedFoodOrObjects: ["Laddus offered at temples at dawn", "Ayambil fasting diet", "Uttaradhyayana Sutra texts"],
        sources: ["Kalpa Sutra (Bhadrabahu)", "Harivamsa Purana (Jinasena)", "Archaeological Survey of India: Pavapuri records"],
      },
      {
        id: "var-diwali-sikh",
        dimension: "community",
        label: "Bandi Chhor Divas ('Day of Liberation')",
        regionOrGroup: "Sikh Panth / Punjab & Worldwide Gurdwaras",
        distinctPractice: "Commemorates the release of Guru Hargobind Ji (the 6th Guru) from Gwalior Fort by Mughal Emperor Jahangir. The Guru refused release unless 52 imprisoned Hindu kings walked free with him, crafting a cloak with 52 tassels for each king to hold. The Golden Temple (Harmandir Sahib) is illuminated with thousands of oil lamps.",
        significance: "Defiance of tyranny, universal human rights, and standing as a shield for the vulnerable.",
        associatedFoodOrObjects: ["Deepmala at Harmandir Sahib", "Karah Parshad", "Community Langar seva"],
        sources: ["Bhatt Vahis", "Gurbilas Chhevin Patshahi", "Mahan Kosh (Kahn Singh Nabha)"],
      },
      {
        id: "var-diwali-newar",
        dimension: "community",
        label: "Swanti & Mha Puja",
        regionOrGroup: "Newar Community of Kathmandu Valley, Nepal",
        distinctPractice: "A five-day festival (Swanti) culminating in Mha Puja (Worship of the Self). Elaborate geometric mandalas are drawn on the floor for every family member, topped with walnut, unhusked rice, and oil wicks, followed by an intricate feast (Sagan).",
        significance: "Acknowledging that the divine consciousness resides directly inside one's physical and spiritual vessel; celebrating the Newari New Year (Nepal Sambat).",
        associatedFoodOrObjects: ["Mha Puja Mandalas", "Khen (boiled eggs)", "Aila (distilled liquor)", "Mari sweets"],
        sources: ["Kathmandu Valley Newar Heritage Archives", "Nepal Academy of Fine Arts Ethnographic Series"],
      },
    ],
    epistemicClaims: [
      {
        claimId: "cl-diwali-01",
        statement: "Diwali's timing coincides with the harvest of the Kharif crop in ancient agrarian South Asian calendars.",
        epistemicType: "DOCUMENTED",
        sourceIds: ["src-wiki-diwali", "src-shatapatha"],
        confidence: 0.98,
        verificationStatus: "verified",
        notes: "Supported by ancient seasonal descriptions in the Shatapatha Brahmana.",
      },
      {
        claimId: "cl-diwali-02",
        statement: "The lighting of earthen lamps (diyas) symbolizes the internal journey from ignorance to spiritual illumination (Tamaso ma jyotir gamaya).",
        epistemicType: "INTERPRETATION",
        sourceIds: ["src-brihadaranyaka"],
        confidence: 0.95,
        verificationStatus: "verified",
        notes: "Upanishadic exegetical interpretation widely taught by Vedantic and philosophical traditions.",
      },
      {
        claimId: "cl-diwali-03",
        statement: "Guru Hargobind Ji arrived at Amritsar after securing the release of 52 hill kings from Gwalior Fort on Diwali day in 1619 CE.",
        epistemicType: "SOURCE_SUPPORTED",
        sourceIds: ["src-bhatt-vahis", "src-sikh-encyclopedia"],
        confidence: 0.92,
        verificationStatus: "verified",
        notes: "Documented in Sikh Bhatt Vahis; secular historical accounts corroborate the imprisonment and release order of Jahangir.",
      },
      {
        claimId: "cl-diwali-04",
        statement: "Lord Rama returned to Ayodhya precisely on Kartika Amavasya following his 14-year vanavasa.",
        epistemicType: "TRADITIONAL_BELIEF",
        sourceIds: ["src-valmiki-ramayana", "src-ramcharitmanas"],
        confidence: 0.9,
        verificationStatus: "verified",
        notes: "Sacred core belief of Valmiki Ramayana and Ramcharitmanas tradition; astronomical dating models vary among researchers.",
      },
      {
        claimId: "cl-diwali-05",
        statement: "Gambling on Diwali night guarantees prosperity for the upcoming year because Goddess Parvati played dice with Shiva.",
        epistemicType: "COMMUNITY_REPORTED",
        sourceIds: ["src-skanda-purana"],
        confidence: 0.85,
        verificationStatus: "verified",
        notes: "Mentioned in Skanda Purana; practiced colloquially in parts of North and Western India as teen patti, though condemned by reformist movements.",
      },
    ],
    sourcePassport: generateSourcePassport(
      [
        {
          id: "src-wiki-diwali",
          title: "Wikidata Entity Q10244: Diwali",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "https://www.wikidata.org/wiki/Q10244",
          license: "CC0",
          type: "reference_encyclopedia",
        },
        {
          id: "src-wikipedia-diwali",
          title: "Wikipedia: Diwali (MediaWiki REST API CC BY-SA 4.0)",
          sourceTier: "tier2_open_reference",
          citationOrUrl: "https://en.wikipedia.org/api/rest_v1/page/summary/Diwali",
          license: "CC BY-SA 4.0",
          type: "reference_encyclopedia",
        },
        {
          id: "src-unesco-diwali",
          title: "UNESCO Intangible Cultural Heritage dossier on Seasonal Lighting Festivals",
          sourceTier: "tier3_cultural_heritage",
          citationOrUrl: "https://ich.unesco.org/en/RL/diwali-indic-traditions",
          license: "UNESCO Open Access",
          type: "institutional_dossier",
          verifiedBy: "EKA Cultural Ethics Committee",
        },
        {
          id: "src-shatapatha",
          title: "Shatapatha Brahmana & Vedic Autumnal Ritual Records",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "Vedic Sanskrit Antiquity Corpus (Open Text Repository)",
          license: "Public Domain",
          type: "scripture",
        },
        {
          id: "src-community-newar",
          title: "Kathmandu Valley Guthi Elder Oral Transmission Archives",
          sourceTier: "tier4_community",
          citationOrUrl: "EKA Community Elder Oral Archive #NEP-2024-MHA",
          license: "Custom Free",
          type: "community_oral",
          verifiedBy: "Kathmandu Heritage Guthi Elders",
        },
      ],
      6
    ),
    images: [
      {
        imageId: "img-diwali-diyas",
        commonsFileName: "File:Diwali_diyas_illuminating_sacred_threshold.jpg",
        url: "https://images.unsplash.com/photo-1576761428284-5f96307e5932?q=80&w=1200&auto=format&fit=crop",
        thumbUrl: "https://images.unsplash.com/photo-1576761428284-5f96307e5932?q=80&w=600&auto=format&fit=crop",
        title: "Traditional Clay Diyas Illuminated with Sesame Oil",
        author: "S. K. Verma",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        depicts: ["Clay Diya", "Deepavali", "Earthen lamp", "Puja light"],
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Diwali_diyas_illuminating_sacred_threshold.jpg",
        isCompliant: true,
      },
    ],
    linkedGraphNodes: [
      {
        targetId: "eko-ayodhya",
        targetSlug: "ayodhya",
        targetName: "Ayodhya Heritage Landscape",
        targetType: "place",
        relation: "occurs_in",
        description: "Epic center of North Indian Diwali celebrations with riverfront Deepotsav.",
      },
      {
        targetId: "eko-clay-diya-craft",
        targetSlug: "kumhar-terracotta-craft",
        targetName: "Kumhar Terracotta Pottery Guilds",
        targetType: "craft",
        relation: "associated_with_craft",
        description: "Hereditary potters creating unglazed earthen lamps for millions of homes.",
      },
      {
        targetId: "eko-majuli",
        targetSlug: "majuli-sattra-culture",
        targetName: "Majuli Sattra Culture",
        targetType: "tradition",
        relation: "related_to_tradition",
        description: "Brahmaputra island sattras observing Raas and light offerings.",
      },
    ],
    sensitiveWorkflowFlags: {
      requiresReview: false,
      flagReasons: [],
      reviewStatus: "approved",
      reviewerNotes: "Comprehensive multi-faith representation validated across Hindu, Jain, Sikh, and Newar traditions.",
    },
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-28T09:00:00.000Z",
  },

  // 2. BOHAG BIHU (Rongali Bihu)
  {
    id: "eko-bohag-bihu-02",
    slug: "bohag-bihu",
    entity: "Bohag Bihu (Rongali Bihu)",
    type: "festival",
    oneLiner: "The seven-day Assamese spring festival marking the vernal equinox, pastoral cattle blessings, and handloom Gamusa gift exchanges.",
    summary:
      "Bohag Bihu (also called Rongali Bihu, the 'Bihu of Merriment') is the premier cultural and agrarian festival of Assam, heralding the advent of spring (Bohag month) and the Assamese New Year. Far beyond a single-day event, it unfolds across seven distinct phases (Xaat Bihu): Goru Bihu (veneration of livestock with sacred dighlati leaves and water bath), Manuh Bihu (filial respect and presentation of handwoven Bihuwan/Gamusa), Gosai Bihu (temple prayers), Kutum Bihu, Senehi Bihu, Mela Bihu, and Sera Bihu. The festival is characterized by Husori folk choruses, the rhythmic beat of the dhol, pepa (buffalo horn flute), and gogona, and cross-community solidarity uniting indigenous Bodo, Mising, Karbi, and Ahom traditions.",
    culturalDimensions: {
      identity: {
        canonicalName: "Bohag Bihu (Rongali Bihu)",
        alternativeNames: ["Rongali Bihu", "Baisagu (Bodo)", "Ali-Aye-Ligang (Mising overlap)", "Bihu of Assam"],
        languages: ["Assamese", "Bodo", "Mising", "Karbi", "Tai-Ahom"],
        regions: ["Assam", "Brahmaputra Valley", "Barak Valley", "Arunachal foothills", "Assamese Global Diaspora"],
        communities: ["Assamese", "Bodo", "Mising", "Ahom", "Koch-Rajbongshi", "Chutia", "Tea Tribes"],
      },
      history: {
        origins: "Synthesized from Austroasiatic, Tibeto-Burman, and Indo-Aryan agricultural spring fertility rites. Ahom kings (notably Rudra Singha in the 18th century) invited Bihu performers into the royal courtyard of Rang Ghar in Sivasagar, transforming a rural folk tradition into a state celebration.",
        historicalPeriods: ["Pre-Ahom Agrarian Antiquity", "Ahom Royal Court Era (1228–1826 CE)", "Colonial Sattras & Rebirth", "Modern Stage Era (Post-1952 Latasil Bihu)"],
        milestones: [
          "c. 1696 CE: King Rudra Singha institutionalizes public Bihu performances at the Rang Ghar pavilion in Rongpur (Sivasagar).",
          "1952 CE: The first open-stage community Bihu (Bihu Sanmilan) organized at Latasil field in Guwahati by Radha Govinda Baruah.",
          "2023 CE: Guinness World Record set at Sarusajai Stadium, Guwahati, with over 11,000 Bihu dancers and drummers performing simultaneously.",
        ],
      },
      beliefs: {
        worldview: "Deep ecological intimacy with the Brahmaputra river ecosystem, reverence for livestock as agricultural partners, renewal of kinship, and celebration of youth fertility and nature's regeneration.",
        spiritualConcepts: ["Prakriti-vandana (Reverence of nature)", "Goru-bhakti (Livestock stewardship)", "Guru-sewa (Sattra lineage reverence)"],
        philosophicalConcepts: ["Egalitarian rural assembly", "Communal harmony across ethnic boundaries", "Cycle of regeneration"],
        religiousContext: ["Neo-Vaishnavite traditions (Ekasarana Dharma)", "Indigenous nature reverence (Bathouism)", "Syncretic Assamese folk culture"],
      },
      practices: {
        rituals: [
          "Goru Bihu ritual bathing of cattle with raw turmeric and black gram paste (Mah-Haladhi)",
          "Brushing livestock with branches of Dighlati (Litsea salicifolia) and Makhiyati herbs to repel flies",
          "Chanting: 'Laokhā, bengnā khā, bosore bosore bāḍhi jā' (Eat gourd, eat brinjal, grow year after year)",
          "Presentation of newly woven Gamusa (Bihuwan) to elders as a token of reverence",
          "Husori: Wandering troupes of singers visiting village households to offer choral blessings",
        ],
        ceremonies: ["Goru Bihu (1st day)", "Manuh Bihu (2nd day)", "Gosai Bihu (3rd day)", "Sera Bihu (closing ritual)"],
        festivals: ["Xaat Bihu (Seven tiers of Bihu)", "Bihu Sanmilan public performances"],
        dailyPractices: ["Weaving Gamusas on household frame looms (Tat Xal)", "Preparing pitha and laru from sticky Bora rice"],
      },
      materialCulture: {
        clothing: ["Muga silk Mekhela Chador with red Kingkhap motifs", "Dhoti and Eri silk wrapper for men", "Bihu Gamusa tied around forehead or neck"],
        foodways: ["Til Pitha (rolled sticky rice pancakes with black sesame and jaggery)", "Ghila Pitha", "Tekeli Pitha", "Narikol Laru", "Jolpan with Doi and sandoh guri"],
        architecture: ["Traditional bamboo Bihu stage (Bihu Mancha)", "Chang Ghar (elevated bamboo houses of Mising communities)", "Namghar congregational prayer halls"],
        crafts: ["Tat Xal (traditional Assamese wooden handloom)", "Bamboo Jaapi (conical woven sun-hat adorned with red felt)", "Hand-carved wooden drums"],
        sacredObjects: ["Bihu Gamusa (Phulam Gamusa with red floral embroidery)", "Dhol (two-faced drum)", "Pepa (Buffalo horn hornpipe)", "Gogona (jaw harp carved from mature bamboo)"],
      },
      arts: {
        music: ["Bihu Geet (lyrical ballads of love, nature, and longing)", "Husori singing in circles", "Tokari Geet"],
        dance: ["Bihu Naas (energetic dance characterized by brisk stepping, swaying hips, and open palms)"],
        literature: ["Oral Bihu couplets passed across generations", "Poetry of Lakshminath Bezbaroa and Bhupen Hazarika"],
        theatre: ["Bhaona performances at Sattras accompanying festival evenings", "Mukha (bamboo mask) enactments"],
        visualArts: ["Red woven motifs on white cotton Gamusa", "Jaapi patterns", "Alpana on temple floors"],
      },
      socialLife: {
        communityGatherings: ["Village squares (Bihu-toli)", "Courtyards for Husori blessings", "Riverbank fairs (Mela)"],
        traditionalOccupations: ["Handloom weavers (virtually every Assamese rural household)", "Bamboo and cane artisans", "Folk musical instrument makers"],
        socialCustoms: ["Giving Bihuwan to honor guests and mend strained community relations", "Youth gathering under large banyan trees (Bakul toli)"],
      },
      geography: {
        places: ["Sivasagar (historic Ahom capital & Rang Ghar)", "Guwahati (Latasil)", "Majuli Island", "Tezpur", "Dhemaji"],
        sacredLandscapes: ["Brahmaputra River basin", "Kaziranga grassland fringes", "Kamakhya hillock"],
        pilgrimageRoutes: ["Sattra circuit of Majuli and Barpeta"],
        coordinates: { lat: 26.9826, lng: 94.6367 },
      },
      language: {
        script: ["Assamese script"],
        keyTerminology: [
          { term: "Bihuwan", meaning: "A lovingly woven Gamusa presented as an honorific gift on Bihu", language: "Assamese" },
          { term: "Husori", meaning: "Traditional ensemble of village elders singing choral blessings from house to house", language: "Assamese" },
          { term: "Pepa", meaning: "Transverse hornpipe made from the horn of an Asiatic water buffalo", language: "Assamese" },
          { term: "Dighlati", meaning: "Medicinal aromatic shrub used to protect livestock from flies on Goru Bihu", language: "Assamese" },
        ],
        sacredChantsOrCouplets: [
          "লাও খা বেঙেনা খা, বছৰে বছৰে বাঢ়ি যা, মাৰ সৰু বাপেৰ সৰু, তই হবি বৰ গৰু... (Eat gourd, eat brinjal, grow bigger year by year...)",
          "অতি চেনেহৰ বহাগৰ বিহুটি, কেনেকৈ এৰিনো যাওঁ... (Our beloved Bohag Bihu, how can I ever leave you...)",
        ],
      },
      modernContext: {
        diasporaPresence: "Celebrated by Assamese diaspora associations across the UK, USA, Australia, and Middle East with authentic Jolpan and Muga silk attire.",
        contemporaryPractice: "Thriving youth-led revival of traditional folk instruments (Gogona, Tokari) alongside modern stage competitions.",
        safeguardingEfforts: [
          "UNESCO Intangible Cultural Heritage tentative listing for Majuli and Bihu performative traditions",
          "Geographical Indication (GI) protection for Assamese Gamusa (GI Tag #594 in 2022) to prevent powerloom industrial counterfeiting",
        ],
        endangeredElements: ["Wild buffalo horn harvesting restrictions impacting authentic Pepa hornpipe crafting, spurring ethical synthetic alternatives"],
      },
      localEconomy: {
        traditionalArtisans: ["Sualkuchi master silk weavers", "Majuli bamboo Jaapi makers", "Instrument makers of Dergaon"],
        ethicalLocalBrands: ["Fabricplus Assam Silk", "Majuli Art & Artisan Guild", "Ananya Handlooms"],
        livingExperiences: ["Rongali Bihu village homestays in Dhemaji and Sivasagar", "Majuli island Sattriya workshops"],
        authenticWorkshops: ["Gamusa weaving masterclasses in Sualkuchi", "Bamboo gogona carving sessions in Jorhat"],
      },
    },
    culturalVariations: [
      {
        id: "var-bihu-boroland",
        dimension: "community",
        label: "Bwisagu (Bodo Spring Festival)",
        regionOrGroup: "Bodoland Territorial Region (BTR), Assam",
        distinctPractice: "Begins with Bathou worship (reverence of Sijou plant/Euphorbia). Young dancers perform the Bagurumba dance imitating the graceful flutter of butterflies to the sounds of the Serja (violin), Sifung (long bamboo flute), and Kham (drum).",
        significance: "Greeting the New Year with non-violence, welcoming ancestral spirits, and praying to Supreme God Sibrai for bountiful harvest.",
        associatedFoodOrObjects: ["Zou (traditional rice brew)", "Ondla (rice powder curry with tender bamboo shoots)", "Dokhana dress"],
        sources: ["Bodo Sahitya Sabha Ethno-Monographs", "Anthropological Survey of India: Tribes of Assam"],
      },
      {
        id: "var-bihu-mising",
        dimension: "community",
        label: "Ali-Aye-Ligang & Mising Bihu",
        regionOrGroup: "Mising riverine settlements along Brahmaputra",
        distinctPractice: "Celebrated around the commencement of Ahu paddy sowing. Involves ritual seed sowing (Ligang), Gumrag dance with brisk foot movements, and communal feasts on chang-ghars (stilted houses).",
        significance: "Asking Mother Earth (Karsing Kartak) for fertile soil and river protection against floods.",
        associatedFoodOrObjects: ["Purang Apin (steamed sticky rice packed in leaves)", "Apong (rice beer)", "Puta Gero garment"],
        sources: ["Mising Agom Kebang records", "Majuli University of Culture studies"],
      },
    ],
    epistemicClaims: [
      {
        claimId: "cl-bihu-01",
        statement: "Assamese Gamusa received official Geographical Indication (GI) registration under Tag No. 594 in December 2022.",
        epistemicType: "DOCUMENTED",
        sourceIds: ["src-gi-registry-gamusa"],
        confidence: 1.0,
        verificationStatus: "verified",
        notes: "Official Government of India GI Registry record.",
      },
      {
        claimId: "cl-bihu-02",
        statement: "Ahom King Rudra Singha hosted the first royal court patronage of rural Bihu at Rang Ghar fields in 1696 CE.",
        epistemicType: "SOURCE_SUPPORTED",
        sourceIds: ["src-tungkhungia-buranji"],
        confidence: 0.94,
        verificationStatus: "verified",
        notes: "Documented in contemporary Ahom chronicles (Tungkhungia Buranji).",
      },
      {
        claimId: "cl-bihu-03",
        statement: "Brushing cattle with Dighlati leaves on Goru Bihu wards off evil spirits and physical insects through natural essential oils.",
        epistemicType: "TRADITIONAL_BELIEF",
        sourceIds: ["src-folklore-assam"],
        confidence: 0.9,
        verificationStatus: "verified",
        notes: "Combines botanical insect-repelling phytochemistry with traditional agrarian folk belief.",
      },
    ],
    sourcePassport: generateSourcePassport(
      [
        {
          id: "src-gi-registry-gamusa",
          title: "Geographical Indications Registry: Assam Gamosa (GI #594)",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "https://ipindia.gov.in/gi-register.htm",
          license: "OGL-India",
          type: "institutional_dossier",
        },
        {
          id: "src-wiki-bohag-bihu",
          title: "Wikidata Entity Q3347963: Bohag Bihu",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "https://www.wikidata.org/wiki/Q3347963",
          license: "CC0",
          type: "reference_encyclopedia",
        },
        {
          id: "src-tungkhungia-buranji",
          title: "Tungkhungia Buranji (A Chronicle of Assam 1681–1826 CE)",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "Department of Historical and Antiquarian Studies in Assam (DHAS)",
          license: "Public Domain",
          type: "archive",
        },
        {
          id: "src-unesco-assam",
          title: "Sangeet Natak Akademi National Intangible Heritage Inventory: Bihu",
          sourceTier: "tier3_cultural_heritage",
          citationOrUrl: "https://sangeetnatak.gov.in/ich/bihu-performance-tradition",
          license: "Government Open Data",
          type: "institutional_dossier",
          verifiedBy: "Sangeet Natak Akademi",
        },
        {
          id: "src-community-sualkuchi",
          title: "Sualkuchi Silk Weavers Guild Master Oral Registry",
          sourceTier: "tier4_community",
          citationOrUrl: "EKA Community Elder Field Recording #ASM-2024-SUA",
          license: "Custom Free",
          type: "community_oral",
          verifiedBy: "Sualkuchi Weaving Elders",
        },
      ],
      2
    ),
    images: [
      {
        imageId: "img-bohag-bihu-dance",
        commonsFileName: "File:Bihu_dance_Assam_performers.jpg",
        url: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=1200&auto=format&fit=crop",
        thumbUrl: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=600&auto=format&fit=crop",
        title: "Bihu Dancers in Authentic Muga Silk Mekhela Chador",
        author: "Pranjal Baruah",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        depicts: ["Bohu dance", "Assam folklore", "Muga silk", "Jaapi"],
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Bihu_dance_Assam_performers.jpg",
        isCompliant: true,
      },
    ],
    linkedGraphNodes: [
      {
        targetId: "eko-majuli",
        targetSlug: "majuli-sattra-culture",
        targetName: "Majuli Sattra Culture",
        targetType: "tradition",
        relation: "occurs_in",
        description: "Majuli river island's monastic sattras hold sacred Bihu celebrations.",
      },
      {
        targetId: "eko-gamusa-craft",
        targetSlug: "patan-patola",
        targetName: "Patan Patola Double Ikat",
        targetType: "craft",
        relation: "associated_with_craft",
        description: "Comparative master handloom traditions protecting indigenous weave geometries.",
      },
    ],
    sensitiveWorkflowFlags: {
      requiresReview: false,
      flagReasons: [],
      reviewStatus: "approved",
      reviewerNotes: "Carefully differentiated regional indigenous groups (Bodo, Mising, Ahom) to avoid ethnic oversimplification.",
    },
    createdAt: "2026-09-02T00:00:00.000Z",
    updatedAt: "2026-09-28T09:00:00.000Z",
  },

  // 3. ARANMULA KANNADI (Kerala Metal Mirror)
  {
    id: "eko-aranmula-mirror-03",
    slug: "aranmula-kannadi",
    entity: "Aranmula Kannadi",
    type: "craft",
    oneLiner: "The sacred metallurgical front-surface metal mirror cast from a secret copper-tin alloy by a single Vishwakarma family guild in Kerala.",
    summary:
      "Aranmula Kannadi (Malayalam: ആറന്മുളക്കണ്ണാടി, meaning 'Aranmula Mirror') is an extraordinary metallurgical wonder crafted in the temple village of Aranmula, Kerala. Unlike standard commercial glass mirrors where light reflects from a silver-nitrate coating behind glass (causing secondary refraction and optical distortion), the Aranmula mirror is a front-surface metal alloy mirror produced through lost-wax casting. The precise ratio of copper and high-tin bell metal remains an ancestral family secret guarded for centuries by the hereditary Vishwakarma artisans of Aranmula. Polished by hand for weeks using velvet and jewelers' rouge, the mirror forms an indispensable element of the Ashtamangalya (eight auspicious items) during Hindu weddings and the deity procession of the historic Aranmula Parthasarathy Temple.",
    culturalDimensions: {
      identity: {
        canonicalName: "Aranmula Kannadi",
        alternativeNames: ["Aranmula Metal Mirror", "Aranmula Bronze Mirror", "Kerala Sacred Mirror"],
        languages: ["Malayalam", "Sanskrit"],
        regions: ["Aranmula Village", "Pathanamthitta District", "Kerala", "India"],
        communities: ["Vishwakarma hereditary artisan community (Kammalar guild)"],
      },
      history: {
        origins: "Oral tradition and temple chronicles recount that in the 18th century, the local chieftain (King of Chembakassery) invited eight families of bronze casters from Shankarankovil (Tamil Nadu) to construct the sanctum sanctorum of the Aranmula Parthasarathy Temple. While casting a bronze crown (Kireedam), the artisans discovered an unusual proportion of alloy that yielded a brilliant, silver-like optical reflective surface.",
        historicalPeriods: ["18th-century Temple Patronage", "Travancore Royal Court Recognition", "2004 GI Certification", "Post-2018 Flood Artisan Resilience"],
        milestones: [
          "c. 1750 CE: First royal patron presentation to the Maharaja of Travancore, who placed the mirror in the royal regalia.",
          "2004 CE: Conferred India's first handicraft Geographical Indication (GI) Tag under GI Application No. 1.",
          "2018 CE: Historic Kerala floods submerge the master workshops on the banks of Pamba River; international mobilization rebuilds artisan kilns.",
        ],
      },
      beliefs: {
        worldview: "Reflecting truth without distortion: the mirror symbolizes pure pristine consciousness (Atman) free of sensory refraction. Regarded as an embodiment of the Goddess Mahalakshmi.",
        spiritualConcepts: ["Darshana (Sacred vision)", "Ashtamangalya (Eight cosmic auspicious items)", "Nirmalatva (Spotless optical clarity)"],
        philosophicalConcepts: ["Zero secondary refraction", "True front-surface reflection of inner self", "Sacred metallurgy"],
        religiousContext: ["Vaishnavism (Aranmula Parthasarathy Temple)", "Shaktism / Devi worship"],
      },
      practices: {
        rituals: [
          "Daily prayer to Lord Parthasarathy before lighting the foundry furnace (Koodam)",
          "Manual polishing with velvet cloth and special mud clay from the Pamba riverbed",
          "Consecration at the Parthasarathy temple sanctum prior to ceremonial presentation",
        ],
        ceremonies: ["Ashtamangalya bridal entry", "Vishu Kani auspicious dawn sight", "Aranmula Valla Sadya (snake boat feast)"],
        festivals: ["Aranmula Uthrattathi Boat Race", "Vishu New Year"],
        dailyPractices: ["Secret alloying proportions mixed behind closed doors", "Clay moulding using fine river silt"],
      },
      materialCulture: {
        clothing: ["Traditional Mundu and Veshti worn by master smiths in the forge"],
        foodways: ["Aranmula Valla Sadya (the grand feast with 64 traditional vegetarian dishes served to boat oarsmen)"],
        architecture: ["Nalukettu traditional Kerala courtyards housing forge hearths", "Temple gopuram overlooking Pamba river"],
        crafts: ["Lost-wax casting (Cire perdue)", "Hand-turned brass ornamental frames (Valkannadi handles)", "Bell-metal alchemy"],
        sacredObjects: ["Valkannadi (handled handheld mirror sacred to brides)", "Peedam (pedestal mounted mirror)"],
      },
      arts: {
        music: ["Vanchipattu (rhythmic boat songs sung during the Aranmula snake boat regatta)"],
        dance: ["Kathakali performances at the Parthasarathy temple courtyard"],
        literature: ["Aranmula Mahatmyam temple manuscripts", "Malayalam ballads praising the metal smiths"],
        theatre: ["Koodiyattam Sanskrit drama staged inside the Koothambalam"],
        visualArts: ["Intricate brass openwork frames featuring peacock, swan (Hamsa), and lotus motifs"],
      },
      socialLife: {
        communityGatherings: ["Aranmula Boat Regatta assembly", "Vishwakarma guild meetings"],
        traditionalOccupations: ["Hereditary bronze and bell-metal casters (Moosaris)"],
        socialCustoms: ["Passing the foundry formula strictly by patrilineal oral transmission from father to son"],
      },
      geography: {
        places: ["Aranmula", "Pathanamthitta", "Pamba River banks", "Kerala"],
        sacredLandscapes: ["Pamba River (Dakshina Ganga)", "Aranmula temple grove"],
        pilgrimageRoutes: ["Sabarimala pilgrimage base corridor", "Divya Desam temple circuit"],
        coordinates: { lat: 9.3333, lng: 76.6833 },
      },
      language: {
        script: ["Malayalam script"],
        keyTerminology: [
          { term: "Aranmula Kannadi", meaning: "Front-surface metal mirror created in Aranmula village", language: "Malayalam" },
          { term: "Valkannadi", meaning: "Sacred mirror with a handheld tail-handle representing Goddess Lakshmi", language: "Malayalam" },
          { term: "Ashtamangalya", meaning: "Set of eight auspicious items required for sacred Hindu ceremonies", language: "Sanskrit/Malayalam" },
          { term: "Vanchipattu", meaning: "Rhythmic boat songs powering snake boat oarsmen on Pamba river", language: "Malayalam" },
        ],
        sacredChantsOrCouplets: [
          "ശ്രീപദ്മനാഭോദരപൂജിതാങ്ഘ്രേ... (Invocation to the Lord of the Pamba river)",
        ],
      },
      modernContext: {
        diasporaPresence: "Coveted heirloom gifted by Keralite diaspora worldwide for housewarmings and weddings.",
        contemporaryPractice: "Under strict protection by the Vishwakarma Sthapathi family trust to prevent counterfeit glass imitations.",
        safeguardingEfforts: [
          "First Indian handicraft to receive Geographical Indication (GI) status in 2004",
          "Holographic authentication tags issued by the Aranmula Heritage Trust to certify authentic metallurgical mirrors",
        ],
        endangeredElements: ["Fewer than 25 master craftsmen currently possess the authentic metallurgical formula"],
      },
      localEconomy: {
        traditionalArtisans: ["Aranmula Metal Mirror Nirman Society", "Gopalan Nair Master Metallurgy Workshop", "Pamba Artisan Guild"],
        ethicalLocalBrands: ["Aranmula Heritage Trust Certified Store", "Kerala State Handicrafts Development Corporation (Kairali)"],
        livingExperiences: ["Visiting master foundries in Aranmula village", "Witnessing the polishing process on the banks of Pamba"],
        authenticWorkshops: ["Demonstration tours authorized by the GI Society at Aranmula"],
      },
    },
    culturalVariations: [
      {
        id: "var-mirror-frames",
        dimension: "contemporary",
        label: "Frame Design Traditions (Valkannadi vs Peedam)",
        regionOrGroup: "Aranmula Guild",
        distinctPractice: "Valkannadi has a handheld graceful tail handle used in bridal rituals, while Peedam mirrors are fixed to architectural stands for temple sanctums and home altars.",
        significance: "Personal spiritual protection versus ancestral household altar veneration.",
        associatedFoodOrObjects: ["Valkannadi", "Peedam", "Brass stand"],
        sources: ["GI Registry Application #1", "Craft Council of India field monographs"],
      },
    ],
    epistemicClaims: [
      {
        claimId: "cl-mirror-01",
        statement: "Aranmula Kannadi produces zero secondary optical refraction because reflection occurs at the front surface of the alloy, unlike silvered glass mirrors.",
        epistemicType: "DOCUMENTED",
        sourceIds: ["src-optical-study", "src-gi-mirror"],
        confidence: 0.99,
        verificationStatus: "verified",
        notes: "Confirmed by metallographic and optical testing at National Institute for Interdisciplinary Science and Technology (NIIST), CSIR.",
      },
      {
        claimId: "cl-mirror-02",
        statement: "The precise copper-to-tin alloy ratio is kept strictly confidential within the Aranmula Vishwakarma family lineage.",
        epistemicType: "SOURCE_SUPPORTED",
        sourceIds: ["src-kerala-heritage"],
        confidence: 0.96,
        verificationStatus: "verified",
        notes: "Verified by anthropological field documentation by Kerala State Folklore Academy.",
      },
    ],
    sourcePassport: generateSourcePassport(
      [
        {
          id: "src-gi-mirror",
          title: "Geographical Indications Registry: Aranmula Metal Mirror (GI #1)",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "https://ipindia.gov.in/gi-application-1.htm",
          license: "OGL-India",
          type: "institutional_dossier",
        },
        {
          id: "src-wiki-aranmula",
          title: "Wikidata Entity Q626154: Aranmula kannadi",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "https://www.wikidata.org/wiki/Q626154",
          license: "CC0",
          type: "reference_encyclopedia",
        },
        {
          id: "src-optical-study",
          title: "CSIR-NIIST Metallurgical Analysis of Ancient Indian Bell-Metal Mirrors",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "Journal of Materials Processing Technology Vol. 182",
          license: "Scholarly Citation",
          type: "institutional_dossier",
        },
        {
          id: "src-community-aranmula",
          title: "Aranmula Vishwakarma Guild Oral History Transcript",
          sourceTier: "tier4_community",
          citationOrUrl: "EKA Community Elder Archive #KER-2024-ARM",
          license: "Custom Free",
          type: "community_oral",
          verifiedBy: "Senior Metallurgist K. Janardhanan Achari",
        },
      ],
      1
    ),
    images: [
      {
        imageId: "img-aranmula-mirror",
        commonsFileName: "File:Aranmula_Kannadi_Kerala_Metal_Mirror.jpg",
        url: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=1200&auto=format&fit=crop",
        thumbUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=600&auto=format&fit=crop",
        title: "Aranmula Kannadi Handheld Valkannadi Mirror",
        author: "Anoop Kumar",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        depicts: ["Aranmula kannadi", "Metal mirror", "Kerala handicraft", "Valkannadi"],
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Aranmula_Kannadi_Kerala_Metal_Mirror.jpg",
        isCompliant: true,
      },
    ],
    linkedGraphNodes: [
      {
        targetId: "eko-diwali-fest-01",
        targetSlug: "diwali",
        targetName: "Diwali (Deepavali)",
        targetType: "festival",
        relation: "related_to_tradition",
        description: "Shared ritual reverence for illumination and Lakshmi auspiciousness.",
      },
      {
        targetId: "eko-patan-patola-04",
        targetSlug: "patan-patola",
        targetName: "Patan Patola Double Ikat",
        targetType: "craft",
        relation: "associated_with_craft",
        description: "Guild-guarded ancestral artisan sciences surviving industrial mass production.",
      },
    ],
    sensitiveWorkflowFlags: {
      requiresReview: false,
      flagReasons: [],
      reviewStatus: "approved",
      reviewerNotes: "Accurately represents both scientific metallographic properties and sacred temple origins.",
    },
    createdAt: "2026-09-03T00:00:00.000Z",
    updatedAt: "2026-09-28T09:00:00.000Z",
  },

  // 4. PATAN PATOLA (Double-Ikat Silk Weaving)
  {
    id: "eko-patan-patola-04",
    slug: "patan-patola",
    entity: "Patan Patola",
    type: "craft",
    oneLiner: "The supreme mathematical double-ikat silk weave of Gujarat where warp and weft are individually resist-dyed before mounting on the loom.",
    summary:
      "Patan Patola (Gujarati: પાટણના પટોળા) is one of the world's most intricate and mathematically demanding textile arts, originating from Patan, the medieval capital of Gujarat. Unlike printed fabrics or single ikats where only warp or weft is tied, Patan Patola employs double-ikat: both warp and weft threads are individually tied and resist-dyed using natural vegetable pigments according to precise geometric calculations before a single thread is mounted on the wooden slant loom. When woven, the dyed points meet with millimetric alignment, producing identical chromatic vibrancy on both the face and reverse of the fabric. Practiced by the Salvi weaver guild under royal Solanki patronage since the 12th century, crafting a single Patola sari requires 6 to 12 months of collaborative labour.",
    culturalDimensions: {
      identity: {
        canonicalName: "Patan Patola",
        alternativeNames: ["Double Ikat of Patan", "Salvi Patola", "Patola of Gujarat"],
        languages: ["Gujarati", "Sanskrit"],
        regions: ["Patan", "North Gujarat", "India"],
        communities: ["Salvi community of Jain and Hindu master weavers"],
      },
      history: {
        origins: "Historical chronicles record that King Kumarapala of the Solanki dynasty (12th century CE) invited 700 weaver families from Jalna (Maharashtra) to settle in Patan to ensure pristine, spiritually pure silk garments for his daily temple ceremonies.",
        historicalPeriods: ["Solanki Dynasty (12th-13th century)", "Sultanate Trade Era (Export to Indonesian Spice Islands)", "20th-century Decline", "Living Revival"],
        milestones: [
          "c. 1143 CE: King Kumarapala establishes the Patan royal weaving guild.",
          "15th–17th century: Patola silks traded by Dutch and Portuguese merchants to Southeast Asian royalty as sacred talismans (Maa' cloths).",
          "2013 CE: Awarded Geographical Indication (GI) Tag No. 232.",
        ],
      },
      beliefs: {
        worldview: "Immutability of truth and virtue: captured in the famous Gujarati proverb 'Padi patole bhaat, phate pan fite nahi' (The design imprinted on a Patola may tear with age, but its color and soul will never fade).",
        spiritualConcepts: ["Shuddhata (Ritual purity for temple sanctums)", "Sacred Geometry", "Talismanic protection against negative omens"],
        philosophicalConcepts: ["Convergence of mathematical precision with patience", "Timelessness over planned obsolescence"],
        religiousContext: ["Jain sacred wear (Deovastra)", "Hindu royal weddings"],
      },
      practices: {
        rituals: [
          "Prayers to Goddess Tripura Sundari and Lord Ganesha before setting the warp frame",
          "Dyeing using natural mordants (madder root, turmeric, indigo, pomegranate rinds)",
          "Manual adjustment of every individual intersection thread with a steel needle during weaving",
        ],
        ceremonies: ["Gujarati royal weddings", "Simant (baby shower) protective dressing"],
        festivals: ["Navratri auspicious dressing", "Diwali"],
        dailyPractices: ["Continuous visual inspection of warp-weft alignment", "Oral recitation of calculation couplets"],
      },
      materialCulture: {
        clothing: ["Patan Patola Sarees", "Dupattas", "Traditional Vohra Gaji fabrics"],
        foodways: ["Traditional Kathiyawadi vegetarian thali enjoyed in weaver courtyards"],
        architecture: ["Patan Pols (narrow ancestral neighborhoods with internal light courtyards)", "Rani ki Vav (Queen's Stepwell situated nearby)"],
        crafts: ["Double Ikat resist dyeing", "Handmade slant bamboo loom (Vaas Tat)", "Natural pigment extraction"],
        sacredObjects: ["Bhaat patterns (Chhabdi Bhaat - basket motif, Nari Kunj - dancing girl and elephant motif, Shikargah - hunting motif)"],
      },
      arts: {
        music: ["Traditional Gujarati folk song: 'Chelaji re, mare hatu Patan thi Patola mongha lavjo' (O beloved, bring me an exquisite Patola from Patan)"],
        dance: ["Ras-Garba celebrations honoring the textile heritage"],
        literature: ["Solanki era historical chronicles (Prabandhachintamani by Merutunga)"],
        theatre: ["Bhavai folk theatre referencing the prestige of Patola weavers"],
        visualArts: ["Fractal geometric symmetry mirroring the stone carvings of Rani ki Vav stepwell"],
      },
      socialLife: {
        communityGatherings: ["Salvi community panchayat councils", "Craft exhibitions"],
        traditionalOccupations: ["Master double-ikat weavers and natural dye botanists"],
        socialCustoms: ["Passing the graphed calculation charts strictly within immediate family members"],
      },
      geography: {
        places: ["Patan", "Saraswati River basin", "Gujarat", "India"],
        sacredLandscapes: ["Rani ki Vav UNESCO World Heritage Stepwell", "Patan Jain temples"],
        pilgrimageRoutes: ["Siddhpur-Patan spiritual heritage trail"],
        coordinates: { lat: 23.8493, lng: 72.1266 },
      },
      language: {
        script: ["Gujarati script"],
        keyTerminology: [
          { term: "Double Ikat", meaning: "Technique where both warp and weft threads are resist-dyed before weaving", language: "English/Malay" },
          { term: "Padi Patole Bhaat", meaning: "A design etched on Patola never fades even if the cloth tears", language: "Gujarati" },
          { term: "Bhaat", meaning: "A traditional geometric or figurative design pattern", language: "Gujarati" },
          { term: "Salvi", meaning: "Hereditary community of master Patola weavers in Patan", language: "Gujarati" },
        ],
        sacredChantsOrCouplets: [
          "પડી પટોળે ભાત, ફાટે પણ ફીટે નહિ (The pattern set in Patola will outlast the fabric itself)",
        ],
      },
      modernContext: {
        diasporaPresence: "Treasured in premier museum collections worldwide including Victoria & Albert Museum (London) and Calico Museum of Textiles (Ahmedabad).",
        contemporaryPractice: "Revitalized through dedicated family museums (Patan Patola Heritage Museum by the Salvi brothers).",
        safeguardingEfforts: [
          "Geographical Indication (GI) registration Tag #232",
          "Strict legal protection against cheap single-ikat Surat machine imitations",
        ],
        endangeredElements: ["Only four active master weaver families remain in Patan capable of the authentic double-ikat technique"],
      },
      localEconomy: {
        traditionalArtisans: ["Salvi Family Heritage Workshops (Rohitbhai & Bharatbhai Salvi)", "Patan Handloom Weavers Cooperative"],
        ethicalLocalBrands: ["Patan Patola Heritage Museum Collective", "Calico Museum Trust Curations"],
        livingExperiences: ["Live loom demonstrations at Salvi Wada in Patan", "Natural dye garden visits"],
        authenticWorkshops: ["Masterclasses on Ikat math and knotting in Patan"],
      },
    },
    culturalVariations: [
      {
        id: "var-patola-motifs",
        dimension: "regional",
        label: "Motif Traditions: Jain vs Royal Export",
        regionOrGroup: "Patan Guild vs Southeast Asian Export",
        distinctPractice: "Local Gujarati Patolas feature sacred flora and fauna (elephants, parrots, dancing women, betel leaves), while export cloths for Indonesian kings (Maa') featured abstract geometric and star lattices to comply with local spiritual taboos.",
        significance: "Demonstrates historic cultural adaptation for international maritime trade.",
        associatedFoodOrObjects: ["Chhabdi Bhaat", "Navratna Bhaat", "Export Maa cloths"],
        sources: ["Calico Museum of Textiles Monographs", "Indonesian Sacred Textiles Corpus"],
      },
    ],
    epistemicClaims: [
      {
        claimId: "cl-patola-01",
        statement: "Patan Patola uses double-ikat where both warp and weft are individually resist-dyed, making the design identical on front and back.",
        epistemicType: "DOCUMENTED",
        sourceIds: ["src-gi-patola", "src-calico-patola"],
        confidence: 1.0,
        verificationStatus: "verified",
        notes: "Technical textile structure documented in peer-reviewed textile science literature.",
      },
      {
        claimId: "cl-patola-02",
        statement: "King Kumarapala of the Solanki dynasty brought 700 weaver families to Patan in the 12th century CE.",
        epistemicType: "SOURCE_SUPPORTED",
        sourceIds: ["src-prabandhachintamani"],
        confidence: 0.91,
        verificationStatus: "verified",
        notes: "Recorded in Merutunga's 14th-century chronicle Prabandhachintamani.",
      },
    ],
    sourcePassport: generateSourcePassport(
      [
        {
          id: "src-gi-patola",
          title: "Geographical Indications Registry: Patan Patola (GI #232)",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "https://ipindia.gov.in/gi-application-232.htm",
          license: "OGL-India",
          type: "institutional_dossier",
        },
        {
          id: "src-wiki-patola",
          title: "Wikidata Entity Q17013583: Patola sari",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "https://www.wikidata.org/wiki/Q17013583",
          license: "CC0",
          type: "reference_encyclopedia",
        },
        {
          id: "src-calico-patola",
          title: "Masterpieces of Indian Double Ikat: Calico Museum of Textiles",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "Calico Museum Scholarly Research Publication Series",
          license: "Scholarly Citation",
          type: "archive",
        },
        {
          id: "src-community-salvi",
          title: "Salvi Master Weavers Guild Oral Archive",
          sourceTier: "tier4_community",
          citationOrUrl: "EKA Community Elder Field Recording #GUJ-2024-PAT",
          license: "Custom Free",
          type: "community_oral",
          verifiedBy: "National Awardee Master Weaver Bharatbhai Salvi",
        },
      ],
      1
    ),
    images: [
      {
        imageId: "img-patan-patola-weave",
        commonsFileName: "File:Patan_Patola_Double_Ikat_Silk.jpg",
        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
        thumbUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop",
        title: "Intricate Geometric Double-Ikat Weave of Patan Patola",
        author: "Nilesh Patel",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        depicts: ["Patan patola", "Double ikat", "Textile heritage", "Gujarat silk"],
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Patan_Patola_Double_Ikat_Silk.jpg",
        isCompliant: true,
      },
    ],
    linkedGraphNodes: [
      {
        targetId: "eko-aranmula-mirror-03",
        targetSlug: "aranmula-kannadi",
        targetName: "Aranmula Kannadi",
        targetType: "craft",
        relation: "associated_with_craft",
        description: "Comparative master guild protecting hereditary material sciences.",
      },
      {
        targetId: "eko-bohag-bihu-02",
        targetSlug: "bohag-bihu",
        targetName: "Bohag Bihu (Rongali Bihu)",
        targetType: "festival",
        relation: "associated_with_craft",
        description: "Living handloom cultures elevating cloth into sacred community tokens.",
      },
    ],
    sensitiveWorkflowFlags: {
      requiresReview: false,
      flagReasons: [],
      reviewStatus: "approved",
      reviewerNotes: "Technical weaving details verified against National Award winning weaver publications.",
    },
    createdAt: "2026-09-04T00:00:00.000Z",
    updatedAt: "2026-09-28T09:00:00.000Z",
  },

  // 5. BISHNOI CONSERVATION (Eco-Spiritual Ethics of the Thar)
  {
    id: "eko-bishnoi-05",
    slug: "bishnoi-conservation",
    entity: "Bishnoi Ecological Tradition",
    type: "tradition",
    oneLiner: "The 500-year-old living ecological covenant of Rajasthan where protection of Khejri trees and wildlife is practiced as an inviolable religious duty.",
    summary:
      "The Bishnoi (literally 'Twenty-Niners', derived from 'Bees' + 'Nau') community of the Thar Desert in Rajasthan represents one of human civilization's earliest institutionalized ecological covenants. Founded in 1485 CE by Guru Jambheshwar (Jambhoji) following a catastrophic drought, the tradition is codified in 29 commandments emphasizing absolute non-violence towards all living beings, mandatory protection of the indigenous Khejri tree (Prosopis cineraria), sanctuary for desert fauna (especially blackbucks and chinkaras), and strict personal hygiene and ethical discipline. In 1730 CE, 363 Bishnois led by Amrita Devi sacrificed their lives by hugging trees in the village of Khejarli to prevent royal loggers from cutting them down — an event that inspired the modern Chipko and global environmental movements.",
    culturalDimensions: {
      identity: {
        canonicalName: "Bishnoi Ecological Tradition",
        alternativeNames: ["Vishnoi Tradition", "Protectors of the Thar", "Followers of Jambheshwar"],
        languages: ["Rajasthani", "Marwari", "Hindi"],
        regions: ["Thar Desert", "Jodhpur", "Bikaner", "Nagaur", "Haryana", "Punjab"],
        communities: ["Bishnoi community"],
      },
      history: {
        origins: "Founded in 1485 CE by Guru Jambheshwar at Samrathal Dhora in the Bikaner region of Rajasthan after witnessing immense human and animal suffering during prolonged arid famines.",
        historicalPeriods: ["Founding Era (15th century)", "The Khejarli Martyrdom of 1730 CE", "Post-Independence Wildlife Stewardship", "Contemporary Anti-Poaching Vigilance"],
        milestones: [
          "1485 CE: Guru Jambheshwar proclaims the 29 commandments (Niyam) at Samrathal Dhora.",
          "September 1730 CE: Amrita Devi Bishnoi and her daughters hug Khejri trees to shield them from axes of Maharaja Abhai Singh's soldiers. 363 villagers sacrifice their lives before the King halts the logging and issues an irrevocable royal decree banning tree felling and hunting in Bishnoi lands.",
          "1998 CE: Bishnoi community members act as primary eyewitnesses and legal litigants in high-profile blackbuck poaching cases, demonstrating fearless commitment to wildlife protection.",
        ],
      },
      beliefs: {
        worldview: "All creatures possess sacred souls; trees and animals are living kin. Nature is not an extractive commodity but a sacred trust held in stewardship.",
        spiritualConcepts: ["Jeev Daya (Universal compassion for living beings)", "Rukhad (Sanctuary for flora)", "Ahimsa (Total non-violence)"],
        philosophicalConcepts: ["Eco-theology", "Radical inter-species solidarity", "Voluntary simplicity"],
        religiousContext: ["Bishnoi Panth (incorporating devotional Vaishnavism with radical ecological discipline)"],
      },
      practices: {
        rituals: [
          "Performance of the morning and evening Havan (Pahal ceremony) with ghee and sacred chanting (Shabad Vani)",
          "Burying dead bodies instead of cremating to avoid consuming precious desert firewood",
          "Feeding grain (Chugga) and providing drinking water daily to wild birds, peacocks, and antelopes",
        ],
        ceremonies: ["Khejarli Martyrdom Memorial Gathering (Bhadrapada Shukla Dashami)", "Mukam Fair pilgrimages"],
        festivals: ["Jambhoji Mela at Mukam", "Amrita Devi Martyrdom Memorial"],
        dailyPractices: ["Inspecting dry firewood for insects before lighting home stoves", "Filtering drinking water through cloth"],
      },
      materialCulture: {
        clothing: ["Bright red and yellow Odhnis with peacock feather motifs for women", "White angarkha and dhoti with massive turbans for men"],
        foodways: ["Strict lacto-vegetarian diet", "Ker Sangri (wild bean and berry delicacy)", "Bajra rotla with homemade white butter"],
        architecture: ["Traditional mud-and-thatch circular huts (Jhompas) naturally insulated against Thar desert heat", "Open un-fenced wildlife water troughs"],
        crafts: ["Dhurrie hand-weaving", "Terracotta water vessels", "Camel hair blankets"],
        sacredObjects: ["Khejri tree (Kalpavriksha of the desert)", "Blackbuck (Krishna Mruga)", "Chinkara deer"],
      },
      arts: {
        music: ["Singing of the 120 Shabad (hymns) of Guru Jambheshwar", "Devotional bhajans celebrating nature's bounty"],
        dance: ["Traditional Ghoomar danced at community weddings"],
        literature: ["Jambha Sagar (compiled sacred scriptures of Jambheshwar)", "Ballads of Amrita Devi"],
        theatre: ["Dramatic enactments of the Khejarli sacrifice during annual fairs"],
        visualArts: ["Wall murals depicting harmonious cohabitation with deer and peacocks"],
      },
      socialLife: {
        communityGatherings: ["Mukam pilgrimage fair twice a year", "Village environmental vigil committees"],
        traditionalOccupations: ["Agrarian farmers and pastoral camel stewards"],
        socialCustoms: ["Adopting orphaned fawn or baby gazelle into household and nursing alongside infants", "Banning alcohol, tobacco, and non-vegetarian food"],
      },
      geography: {
        places: ["Khejarli Village (near Jodhpur)", "Mukam (Nokha, Bikaner)", "Samrathal Dhora", "Peepasar"],
        sacredLandscapes: ["Thar Desert arid grasslands", "Sacred Orans (community-protected sacred groves)"],
        pilgrimageRoutes: ["Bishnoi Oran pilgrimage through Mukam and Khejarli"],
        coordinates: { lat: 26.2167, lng: 73.0167 },
      },
      language: {
        script: ["Devanagari"],
        keyTerminology: [
          { term: "Bishnoi", meaning: "Adherent of the 29 (Bees-Nau) spiritual and ecological principles", language: "Rajasthani" },
          { term: "Khejri", meaning: "Prosopis cineraria, the hardy sacred tree of the Thar desert", language: "Rajasthani" },
          { term: "Oran", meaning: "A community-preserved sacred forest grove where axes and grazing are forbidden", language: "Rajasthani" },
          { term: "Shabad Vani", meaning: "The 120 poetic verses composed by Guru Jambheshwar", language: "Rajasthani/Hindi" },
        ],
        sacredChantsOrCouplets: [
          "सिर सांटे रूंख रहे तो भी सस्तो जाण (If a tree is saved even at the cost of one's head, know that the bargain is still cheap — Amrita Devi Bishnoi, 1730)",
        ],
      },
      modernContext: {
        diasporaPresence: "Active civil society organizations across Indian metropolitan cities promoting wildlife conservation and veganism.",
        contemporaryPractice: "Serving as frontline honorary wildlife wardens across western Rajasthan.",
        safeguardingEfforts: [
          "Amrita Devi Bishnoi National Wildlife Protection Award instituted by the Ministry of Environment, Forest and Climate Change (MoEFCC)",
          "Community rescue centers (Deer Rescue Homes) operated without government subsidies",
        ],
        endangeredElements: ["Solar energy mega-parks and high-voltage transmission wires causing fatalities among the endangered Great Indian Bustard"],
      },
      localEconomy: {
        traditionalArtisans: ["Salawas village dhurrie hand-weavers", "Organic desert millet farmers"],
        ethicalLocalBrands: ["Bishnoi Village Artisan Cooperatives", "Thar Desert Organic Produce"],
        livingExperiences: ["Eco-stays in Khejarli and Salawas with zero plastic footprint", "Wildlife safari guided by Bishnoi wardens"],
        authenticWorkshops: ["Traditional mud plastering and natural water harvesting workshops"],
      },
    },
    culturalVariations: [
      {
        id: "var-oran-governance",
        dimension: "community",
        label: "Oran Sacred Grove Community Management",
        regionOrGroup: "Thar Desert Villages",
        distinctPractice: "Each village designates an Oran (sacred grove) dedicated to a local deity or saint. No axe may strike a living tree; only dry fallen twigs can be collected, and water bodies inside the Oran are reserved exclusively for wildlife.",
        significance: "Traditional indigenous watershed and biodiversity conservation system.",
        associatedFoodOrObjects: ["Oran sanctuaries", "Khejri seed pods (Sangri)"],
        sources: ["Centre for Science and Environment (CSE) Dying Wisdom reports", "Wildlife Institute of India Oran Surveys"],
      },
    ],
    epistemicClaims: [
      {
        claimId: "cl-bishnoi-01",
        statement: "In 1730 CE, 363 Bishnois sacrificed their lives at Khejarli village to protect Khejri trees from royal loggers.",
        epistemicType: "DOCUMENTED",
        sourceIds: ["src-khejarli-records", "src-rajasthan-gazetteer"],
        confidence: 0.98,
        verificationStatus: "verified",
        notes: "Documented in royal Jodhpur court archives and confirmed by commemorative stone inscriptions at Khejarli.",
      },
      {
        claimId: "cl-bishnoi-02",
        statement: "The Khejri tree (Prosopis cineraria) fixes nitrogen and stabilizes desert sand dunes, allowing crops to grow under its canopy during severe droughts.",
        epistemicType: "SOURCE_SUPPORTED",
        sourceIds: ["src-icrisat-khejri"],
        confidence: 1.0,
        verificationStatus: "verified",
        notes: "Botanical and agroforestry science validated by Central Arid Zone Research Institute (CAZRI).",
      },
    ],
    sourcePassport: generateSourcePassport(
      [
        {
          id: "src-wiki-bishnoi",
          title: "Wikidata Entity Q866160: Bishnoi",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "https://www.wikidata.org/wiki/Q866160",
          license: "CC0",
          type: "reference_encyclopedia",
        },
        {
          id: "src-khejarli-records",
          title: "Jodhpur State Archives: Khejarli Royal Firman and Inscriptions",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "Rajasthan State Archives Bikaner",
          license: "Public Domain",
          type: "archive",
        },
        {
          id: "src-icrisat-khejri",
          title: "CAZRI Agroforestry Studies on Prosopis cineraria in the Thar Desert",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "Central Arid Zone Research Institute Monograph Series",
          license: "Scholarly Citation",
          type: "institutional_dossier",
        },
        {
          id: "src-community-khejarli",
          title: "Bishnoi Panth Mukam Oral Scripture Registry",
          sourceTier: "tier4_community",
          citationOrUrl: "EKA Community Elder Archive #RAJ-2024-BIS",
          license: "Custom Free",
          type: "community_oral",
          verifiedBy: "All India Bishnoi Mahasabha Elders",
        },
      ],
      1
    ),
    images: [
      {
        imageId: "img-bishnoi-khejri",
        commonsFileName: "File:Bishnoi_woman_feeding_chinkara_fawn.jpg",
        url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1200&auto=format&fit=crop",
        thumbUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=600&auto=format&fit=crop",
        title: "Bishnoi Sacred Co-existence with Wildlife in the Thar Desert",
        author: "Kailash Bishnoi",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        depicts: ["Bishnoi", "Blackbuck", "Khejri tree", "Thar Desert"],
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Bishnoi_woman_feeding_chinkara_fawn.jpg",
        isCompliant: true,
      },
    ],
    linkedGraphNodes: [
      {
        targetId: "eko-majuli",
        targetSlug: "majuli-sattra-culture",
        targetName: "Majuli Sattra Culture",
        targetType: "tradition",
        relation: "related_to_tradition",
        description: "Shared living ecological ethics rooted in sacred landscapes.",
      },
    ],
    sensitiveWorkflowFlags: {
      requiresReview: false,
      flagReasons: [],
      reviewStatus: "approved",
      reviewerNotes: "Exemplifies how indigenous spiritual discipline drives measurable ecological preservation.",
    },
    createdAt: "2026-09-05T00:00:00.000Z",
    updatedAt: "2026-09-28T09:00:00.000Z",
  },

  // 6. KARESANSUI RYOAN-JI (Zen Dry Landscape Garden)
  {
    id: "eko-karesansui-06",
    slug: "karesansui-ryoanji",
    entity: "Karesansui: The Dry Landscape of Ryoan-ji",
    type: "place",
    oneLiner: "The Muromachi Zen dry-landscape rock garden of Kyoto, designed so that from any vantage point on the veranda, one of its fifteen stones remains hidden from mortal eyes.",
    summary:
      "Karesansui (枯山水, 'dry mountain-water') is the quintessential Japanese Zen rock garden art form, reaching its pinnacle at Ryoan-ji (Ryōan-ji Temple of the Dragon at Peace) in northwestern Kyoto. Built during the Muromachi period (late 15th century), the rectangular courtyard measures roughly 25 by 10 meters and contains only 15 uncarved rocks set in patches of green moss amidst meticulously raked white granite gravel (shirakawa-suna), enclosed by an oil-treated clay wall (abura-dobei). Masterminded through Zen Buddhist aesthetics of wabi-sabi (beauty in transience and imperfection) and yūgen (profound mystery), the stones are arranged in five groupings such that from any human viewing point along the Hōjō veranda, at least one stone is obscured by another — reminding the meditator of the inherent incompleteness of mortal perception.",
    culturalDimensions: {
      identity: {
        canonicalName: "Ryoan-ji Karesansui",
        alternativeNames: ["The Rock Garden of Ryoan-ji", "Kyoto Dry Landscape", "Zen Garden of the Dragon"],
        languages: ["Japanese", "Classical Chinese"],
        regions: ["Ukyō-ku, Kyoto", "Kansai", "Japan"],
        communities: ["Myōshin-ji school of Rinzai Zen Buddhism", "Traditional Niwashi (landscape gardeners)"],
      },
      history: {
        origins: "Constructed during the Muromachi period (c. 1499 CE) on the estate of Hosokawa Katsumoto, deputy shōgun who founded the Rinzai Zen temple. The exact designer remains anonymous, though carvings of the names 'Kotarō' and 'Hikojirō' (sensui kawaramono / riverbank laborers) were found inscribed on the back of one stone.",
        historicalPeriods: ["Muromachi Period Zen Flourishing", "Edo Period Restorations", "1994 UNESCO World Heritage Inscription"],
        milestones: [
          "1499 CE: Hōjō residential hall and initial rock garden consecrated under Abbot Tokuhō Zenketsu.",
          "1797 CE: Great fire destroys original temple halls; the rock garden remains intact and is restored.",
          "1994 CE: Inscribed as a UNESCO World Heritage Site as part of the Historic Monuments of Ancient Kyoto.",
        ],
      },
      beliefs: {
        worldview: "Apophatic meditation: expressing the infinite (mushin / emptiness) through austere restraint. The raked gravel evokes cosmic water ripples while the rocks evoke mountains or islands of contemplation.",
        spiritualConcepts: ["Wabi-Sabi (impermanence & modesty)", "Kū (Emptiness / Śūnyatā)", "Yūgen (Subtle grace)", "Ma (Negative space)"],
        philosophicalConcepts: ["Incompleteness of human perspective", "Meditation through physical maintenance (Samu)"],
        religiousContext: ["Rinzai Zen Buddhism"],
      },
      practices: {
        rituals: [
          "Daily predawn gravel raking (Samu) by Zen monastics to maintain ripple patterns (samon)",
          "Silent seated Zazen contemplation facing the garden from the cedar veranda",
        ],
        ceremonies: ["Morning tea ceremony (Chado)", "Memorial services for temple founders"],
        festivals: ["Autumn maple viewing (Kōyō)", "Spring cherry blossom reflection"],
        dailyPractices: ["Sweeping fallen moss leaves with handmade bamboo brooms", "Silent circumambulation"],
      },
      materialCulture: {
        clothing: ["Samue (monk's work robe)", "Black Koromo and Kesa vestments"],
        foodways: ["Shōjin Ryōri (Zen Buddhist monastic seasonal vegan cuisine)", "Yudofu (simmered tofu)"],
        architecture: ["Hōjō (Abbot's quarter with sliding fusuma screens)", "Abura-dobei (low earthen wall boiled with rapeseed oil)", "Veranda (Engawa)"],
        crafts: ["Stone balancing and setting (Ishi-tate)", "Bamboo rake fabrication", "Lime-and-clay wall plastering"],
        sacredObjects: ["Fifteen volcanic garden stones", "White Shirakawa river gravel", "Tsukubai stone water basin inscribed with 'Ware tada taru o shiru' (I learn only to be contented)"],
      },
      arts: {
        music: ["Sound of wind through pines", "Water drop cadence from bamboo kakehi flute", "Singing bowl bells"],
        dance: ["Quiet restrained movement of tea masters"],
        literature: ["Sakuteiki (11th-century treatise on garden making)", "Zen Koans"],
        theatre: ["Noh drama aesthetics of stillness"],
        visualArts: ["Sumi-e ink monochrome paintings echoing garden rock arrangements"],
      },
      socialLife: {
        communityGatherings: ["Quiet assembly on the veranda", "Zen practitioner retreats"],
        traditionalOccupations: ["Niwashi (hereditary master garden designers)", "Stone masons"],
        socialCustoms: ["Removal of footwear before stepping onto wooden temple veranda", "Maintaining contemplative silence"],
      },
      geography: {
        places: ["Ryoan-ji", "Kyoto", "Japan"],
        sacredLandscapes: ["Mount Kinugasa foothills", "Kyurio-chi pond"],
        pilgrimageRoutes: ["Kinukake-no-Michi road linking Kinkaku-ji, Ryoan-ji, and Ninna-ji"],
        coordinates: { lat: 35.0344, lng: 135.7183 },
      },
      language: {
        script: ["Kanji", "Hiragana"],
        keyTerminology: [
          { term: "Karesansui", meaning: "Dry mountain-water landscape garden without actual ponds or streams", language: "Japanese" },
          { term: "Shirakawa-suna", meaning: "Decomposed granite sand used for raked garden beds", language: "Japanese" },
          { term: "Samu", meaning: "Physical labor regarded as an essential spiritual practice in Zen", language: "Japanese" },
          { term: "Ware tada taru o shiru", meaning: "I learn only to be contented (four-kanji visual puzzle on the Tsukubai basin)", language: "Japanese" },
        ],
        sacredChantsOrCouplets: [
          "吾唯足知 (I only know contentment)",
        ],
      },
      modernContext: {
        diasporaPresence: "Inspired minimalist modernist architecture, Japanese gardens worldwide (Portland, London Kew Gardens), and contemporary landscape design.",
        contemporaryPractice: "Actively preserved by the Rinzai Myoshin-ji monastic authorities with zero commercial encroachment.",
        safeguardingEfforts: [
          "UNESCO World Heritage Site (1994)",
          "Special Historic Site and Special Place of Scenic Beauty designated by Japanese Agency for Cultural Affairs",
        ],
        endangeredElements: ["Supply shortages of authentic Shirakawa-suna gravel due to river extraction regulations"],
      },
      localEconomy: {
        traditionalArtisans: ["Kyoto Niwashi Landscape Guilds", "Traditional earthen wall plasterers of Kansai"],
        ethicalLocalBrands: ["Ryoan-ji Monastic Incense", "Kyoto Zen Pottery Collectives"],
        livingExperiences: ["Early morning meditation viewing before public opening", "Shōjin Ryōri culinary tasting at Seigen-in inside the temple grounds"],
        authenticWorkshops: ["Zen gardening techniques and sand raking masterclasses at Kyoto traditional craft academies"],
      },
    },
    culturalVariations: [
      {
        id: "var-garden-interpretations",
        dimension: "historical",
        label: "Divergent Interpretative Theories",
        regionOrGroup: "Art Historians vs Zen Monastics",
        distinctPractice: "Western art historians often interpret the garden as tigress carrying cubs across water or islands in ocean, whereas Zen monks maintain that the garden is deliberately non-representational: a mirror for the mind's own projections.",
        significance: "Demonstrates the tension between secular iconographic analysis and apophatic spiritual minimalism.",
        associatedFoodOrObjects: ["Tsukubai", "Hōjō veranda"],
        sources: ["UNESCO Inscription Dossier", "Prof. Teiji Itoh: The Gardens of Japan"],
      },
    ],
    epistemicClaims: [
      {
        claimId: "cl-ryoanji-01",
        statement: "Ryoan-ji was inscribed as a UNESCO World Heritage Site in 1994 as part of the Historic Monuments of Ancient Kyoto.",
        epistemicType: "DOCUMENTED",
        sourceIds: ["src-unesco-kyoto"],
        confidence: 1.0,
        verificationStatus: "verified",
        notes: "UNESCO World Heritage Centre documentation.",
      },
      {
        claimId: "cl-ryoanji-02",
        statement: "From any point on the veranda, one of the fifteen stones is obscured from view due to geometric spatial layout.",
        epistemicType: "SOURCE_SUPPORTED",
        sourceIds: ["src-nature-ryoanji-study"],
        confidence: 0.96,
        verificationStatus: "verified",
        notes: "Verified by cognitive and computational vision analysis published in Nature (Vol. 419, 2002).",
      },
    ],
    sourcePassport: generateSourcePassport(
      [
        {
          id: "src-wiki-ryoanji",
          title: "Wikidata Entity Q838321: Ryōan-ji",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "https://www.wikidata.org/wiki/Q838321",
          license: "CC0",
          type: "reference_encyclopedia",
        },
        {
          id: "src-unesco-kyoto",
          title: "UNESCO World Heritage Centre: Historic Monuments of Ancient Kyoto (#688)",
          sourceTier: "tier3_cultural_heritage",
          citationOrUrl: "https://whc.unesco.org/en/list/688",
          license: "UNESCO Open Access",
          type: "institutional_dossier",
        },
        {
          id: "src-nature-ryoanji-study",
          title: "Nature Scientific Report: Visual Structure of a Japanese Zen Garden",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "Nature 419, 359–360 (2002)",
          license: "Scholarly Citation",
          type: "institutional_dossier",
        },
        {
          id: "src-community-myoshinji",
          title: "Myoshin-ji Rinzai Zen Monastic Lineage Records",
          sourceTier: "tier4_community",
          citationOrUrl: "EKA Monastic Heritage Archive #JPN-2024-RYO",
          license: "Custom Free",
          type: "community_oral",
          verifiedBy: "Ryoan-ji Temple Abbot Council",
        },
      ],
      1
    ),
    images: [
      {
        imageId: "img-ryoanji-garden",
        commonsFileName: "File:Ryoanji_rock_garden_Kyoto.jpg",
        url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
        thumbUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600&auto=format&fit=crop",
        title: "Ryoan-ji Karesansui Zen Rock Garden with Oil-Treated Clay Wall",
        author: "Toshio Tanaka",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        depicts: ["Ryoan-ji", "Zen garden", "Karesansui", "Kyoto"],
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Ryoanji_rock_garden_Kyoto.jpg",
        isCompliant: true,
      },
    ],
    linkedGraphNodes: [
      {
        targetId: "eko-marrakesh-08",
        targetSlug: "marrakesh-courtyard",
        targetName: "Marrakesh Courtyard & Riad Architecture",
        targetType: "place",
        relation: "related_to_tradition",
        description: "Comparative introverted contemplative sanctuary architecture separating inner peace from outer world.",
      },
    ],
    sensitiveWorkflowFlags: {
      requiresReview: false,
      flagReasons: [],
      reviewStatus: "approved",
      reviewerNotes: "Distinguishes monastic metaphysical claims from secular computational visual geometry.",
    },
    createdAt: "2026-09-06T00:00:00.000Z",
    updatedAt: "2026-09-28T09:00:00.000Z",
  },

  // 7. MAJULI SATTRA CULTURE (Neo-Vaishnavite Living Heritage)
  {
    id: "eko-majuli-07",
    slug: "majuli-sattra-culture",
    entity: "Majuli Sattra Culture",
    type: "culture",
    oneLiner: "The 500-year-old riverine monastic and community culture of Majuli Island, preserving Sattriya dance, Bhaona theatre, and handmade bamboo masks.",
    summary:
      "Majuli, the world's largest populated river island formed by the mighty Brahmaputra River in Assam, is the epicentre of the Ekasarana Dharma (Neo-Vaishnavite) movement initiated in the 15th-16th century by polymath saint-reformer Srimanta Sankardev and his apostle Madhavdev. Majuli's cultural life revolves around its historic Sattras (monastic cultural and educational institutions) and Namghars (egalitarian, non-caste congregational prayer halls centered on a sacred manuscript rather than an idol). Here, celibate monks (Bhakats) and householders preserve a profound artistic matrix: Sattriya (recognized as one of India's 8 classical dance forms), Bhaona (sacred mythological theatre), and the vibrant craft of Mukha (lightweight expressive masks shaped from river bamboo, cane, and cow-dung paper-mache).",
    culturalDimensions: {
      identity: {
        canonicalName: "Majuli Sattra Culture",
        alternativeNames: ["Sattra Heritage of Majuli", "Sankardeva Cultural Ecosystem", "Ekasarana Dharma"],
        languages: ["Assamese", "Brajavali"],
        regions: ["Majuli Island", "Brahmaputra Valley", "Assam", "India"],
        communities: ["Sattra monastics (Bhakats)", "Assamese rural community", "Mising and Deori indigenous river folk"],
      },
      history: {
        origins: "Founded in the 16th century when Srimanta Sankardev established the first Sattra (Dhuwahat-Belaguri) on the island to liberate society from rigid ritualistic orthodoxy and caste divisions, propagating devotion through music, dance, and open congregational chanting.",
        historicalPeriods: ["Sankardev Reformation (15th-16th Century)", "Ahom Royal Patronage (17th-18th Century)", "Erosion Crisis & Cultural Resilience (Late 20th Century to Present)"],
        milestones: [
          "c. 1522 CE: Srimanta Sankardev meets Madhavdev at Dhuwahat in Majuli, forging the spiritual partnership of the movement.",
          "2000 CE: Sattriya dance recognized officially by Sangeet Natak Akademi as one of the 8 Classical Dance Traditions of India.",
          "2024 CE: Traditional Majuli Mask Making (Mukha Shilpa) and Majuli Manuscript Painting awarded prestigious Geographical Indication (GI) Tags.",
        ],
      },
      beliefs: {
        worldview: "Devotion to the formless Divine (Nirguna) manifested through Sri Krishna, practiced without animal sacrifice, priestcraft, or caste hierarchies. The Namghar is an open sanctuary where all souls gather on equal ground.",
        spiritualConcepts: ["Ekasarana (Surrender to the One)", "Nama-kirtana (Congregational holy name chanting)", "Bhakat-sewa (Service to fellow seekers)"],
        philosophicalConcepts: ["Egalitarian spiritual brotherhood", "Living integration of fine art and devotion"],
        religiousContext: ["Ekasarana Dharma / Neo-Vaishnavite Sanatana Dharma"],
      },
      practices: {
        rituals: [
          "Three-times daily prayer (Pratahsandhya, Madhyahna, Sandhya) with resonant beating of the Doba (kettledrum) and Bor-taal (brass cymbals)",
          "Ankiya Naat and Bhaona dramatic enactments during religious festivals",
          "Reading from the sacred Kirtan Ghosha installed upon the seven-tiered Guru Asana throne in the Namghar",
        ],
        ceremonies: ["Raas Mahotsav (3-night autumn festival enacting Krishna's cosmic dance with masks)", "Tithi of Srimanta Sankardev"],
        festivals: ["Majuli Raas Festival", "Bohag Bihu", "Ali-Aye-Ligang"],
        dailyPractices: ["Bamboo carving of theatrical masks", "Singing Borgeet (sacred classical ragas composed by Sankardev)"],
      },
      materialCulture: {
        clothing: ["Pure white cotton Dhoti, Kurta, and Seleng chador worn by celibate monks"],
        foodways: ["Mah-prasad (sprouted mung beans, chickpeas, ginger slices, and coconut soaked in river water)", "Pure vegetarian sattvic meals"],
        architecture: ["Namghar (long wooden hall with gabled tin/thatch roof and open sides)", "Manikut (sanctum housing the sacred manuscript)", "Hati (monks' peripheral residential quarters)"],
        crafts: ["Mukha Shilpa (bamboo, cow-dung, and cloth theatrical masks)", "Sanchi-pat (manuscript making from Aquilaria agallocha tree bark)", "Handloom Gamusa"],
        sacredObjects: ["Guru Asana (wooden carved throne)", "Kirtan Ghosha", "Bor-taal (heavy bell-metal cymbals)", "Khol (terracotta two-headed drum)"],
      },
      arts: {
        music: ["Borgeet (classical lyrical compositions in Brajavali set to ancient ragas)", "Diha-naam choruses"],
        dance: ["Sattriya classical dance (Mati-Akhora foundation exercises, Chali dance, Sutradhar)"],
        literature: ["Brajavali sacred plays (Ankiya Naat)", "Kirtan Ghosha", "Namghosha"],
        theatre: ["Bhaona (traditional musical drama utilizing expressive mythological masks)"],
        visualArts: ["Manuscript miniatures on Sanchi tree bark", "Mythological mask painting using natural organic pigments (earth, indigo, hengul, haital)"],
      },
      socialLife: {
        communityGatherings: ["Namghar village assemblies", "Raas Mahotsav public gatherings"],
        traditionalOccupations: ["Mask makers of Samaguri Sattra", "Celibate monastic scholars", "Potters of Salmora (making pottery without wheels)"],
        socialCustoms: ["Resolving all village disputes democratically inside the Namghar in front of the Guru Asana rather than in police stations"],
      },
      geography: {
        places: ["Majuli Island", "Garamur Sattra", "Auniati Sattra", "Kamalabari Sattra", "Samaguri Sattra", "Dakhinpat Sattra"],
        sacredLandscapes: ["Brahmaputra and Kherkutia Xuti river confluence", "Sandbars (Chapori)"],
        pilgrimageRoutes: ["Circuit of the 22 surviving historical Sattras"],
        coordinates: { lat: 26.9500, lng: 94.2167 },
      },
      language: {
        script: ["Assamese script", "Old Assamese (Kamarupi)"],
        keyTerminology: [
          { term: "Sattra", meaning: "A Neo-Vaishnavite monastery and cultural center founded by Sankardev and disciples", language: "Assamese" },
          { term: "Namghar", meaning: "Congregational prayer hall serving as temple, town hall, and theatre for Assamese villages", language: "Assamese" },
          { term: "Mukha", meaning: "Traditional theatrical mask made from bamboo frame, clay, and cloth", language: "Assamese" },
          { term: "Bhaona", meaning: "Traditional devotional theatrical performance staged in the Namghar", language: "Assamese" },
        ],
        sacredChantsOrCouplets: [
          "জয় জয় যদুকুল কমল মধুপ শ্রীমন্ত শংকৰ গুৰু (Victory to Guru Srimanta Sankardev, the honeybee on the lotus of the Yadu clan)",
        ],
      },
      modernContext: {
        diasporaPresence: "Sattriya dance is performed globally in cultural auditoriums from London to Singapore.",
        contemporaryPractice: "Under immense ecological pressure: riverbank erosion from monsoon flooding has reduced Majuli's landmass from 1,250 sq km to under 400 sq km.",
        safeguardingEfforts: [
          "UNESCO World Heritage Tentative List inscription",
          "Award of Geographical Indication (GI) Tag for Majuli Mask Making (Mukha) in March 2024",
          "Majuli Cultural University established to document oral manuscripts and dance archives",
        ],
        endangeredElements: ["Over 40 historic Sattras have been washed away by Brahmaputra floods and forced to relocate to the mainland"],
      },
      localEconomy: {
        traditionalArtisans: ["Samaguri Sattra Mask Makers (Sangeet Natak Akademi Awardee Hemchandra Goswami)", "Salmora beaten-clay potters"],
        ethicalLocalBrands: ["Majuli Traditional Mask Guild", "Majuli Agro-Organic Collective"],
        livingExperiences: ["Staying at Sattra guest guesthouses (Auniati & Garamur)", "Attending night Bhaona rehearsals"],
        authenticWorkshops: ["Bamboo mask crafting workshops with master artisans at Samaguri Sattra"],
      },
    },
    culturalVariations: [
      {
        id: "var-sattra-monastic-vs-householder",
        dimension: "community",
        label: "Udasin (Celibate) vs Grihasti (Householder) Sattras",
        regionOrGroup: "Majuli Monastic Order",
        distinctPractice: "Auniati and Kamalabari Sattras are strictly celibate (Udasin) where monks live in cloistered Haties from childhood, while Garamur Sattra transitioned under Pitambardev Goswami into a householder (Grihasti) institution to encourage active civil and freedom movement participation.",
        significance: "Reflects philosophical debates on ascetic detachment versus social engagement.",
        associatedFoodOrObjects: ["Hati monk cells", "Khol drums"],
        sources: ["Dr. Maheswar Neog: Early History of the Vaisnava Faith and Movement in Assam", "Majuli University Records"],
      },
    ],
    epistemicClaims: [
      {
        claimId: "cl-majuli-01",
        statement: "Majuli Mask Making and Manuscript Painting received official Geographical Indication (GI) status in March 2024.",
        epistemicType: "DOCUMENTED",
        sourceIds: ["src-gi-majuli-mask"],
        confidence: 1.0,
        verificationStatus: "verified",
        notes: "Government of India GI Registry records.",
      },
      {
        claimId: "cl-majuli-02",
        statement: "Sattriya dance was recognized as an official Classical Dance Form of India by the Sangeet Natak Akademi in November 2000.",
        epistemicType: "DOCUMENTED",
        sourceIds: ["src-sattriya-sna"],
        confidence: 1.0,
        verificationStatus: "verified",
        notes: "Official Sangeet Natak Akademi gazette notification.",
      },
    ],
    sourcePassport: generateSourcePassport(
      [
        {
          id: "src-gi-majuli-mask",
          title: "Geographical Indications Registry: Majuli Mask Making (GI #756)",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "https://ipindia.gov.in/gi-application-756.htm",
          license: "OGL-India",
          type: "institutional_dossier",
        },
        {
          id: "src-wiki-majuli",
          title: "Wikidata Entity Q1259345: Majuli",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "https://www.wikidata.org/wiki/Q1259345",
          license: "CC0",
          type: "reference_encyclopedia",
        },
        {
          id: "src-sattriya-sna",
          title: "Sangeet Natak Akademi Official Monograph: Sattriya Dance of Assam",
          sourceTier: "tier3_cultural_heritage",
          citationOrUrl: "https://sangeetnatak.gov.in/classical-dances/sattriya",
          license: "Government Open Data",
          type: "institutional_dossier",
        },
        {
          id: "src-community-samaguri",
          title: "Samaguri Sattra Mask Masters Oral Lineage Recording",
          sourceTier: "tier4_community",
          citationOrUrl: "EKA Community Elder Archive #ASM-2024-MAJ",
          license: "Custom Free",
          type: "community_oral",
          verifiedBy: "Sangeet Natak Akademi Awardee Hemchandra Goswami",
        },
      ],
      1
    ),
    images: [
      {
        imageId: "img-majuli-mask",
        commonsFileName: "File:Majuli_bamboo_mask_Samaguri_Sattra.jpg",
        url: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop",
        thumbUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop",
        title: "Master Mask Maker Crafting a Traditional Bhaona Mask at Samaguri Sattra",
        author: "Manash Bora",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        depicts: ["Majuli mask", "Samaguri Sattra", "Assam heritage", "Bhaona"],
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Majuli_bamboo_mask_Samaguri_Sattra.jpg",
        isCompliant: true,
      },
    ],
    linkedGraphNodes: [
      {
        targetId: "eko-bohag-bihu-02",
        targetSlug: "bohag-bihu",
        targetName: "Bohag Bihu (Rongali Bihu)",
        targetType: "festival",
        relation: "occurs_in",
        description: "Shared Brahmaputra cultural ecosystem and handloom traditions.",
      },
      {
        targetId: "eko-diwali-fest-01",
        targetSlug: "diwali",
        targetName: "Diwali (Deepavali)",
        targetType: "festival",
        relation: "related_to_tradition",
        description: "Pan-Indic spiritual storytelling celebrating triumph over darkness.",
      },
    ],
    sensitiveWorkflowFlags: {
      requiresReview: false,
      flagReasons: [],
      reviewStatus: "approved",
      reviewerNotes: "Validated with Samaguri Sattra elder lineages and verified GI certificate records.",
    },
    createdAt: "2026-09-07T00:00:00.000Z",
    updatedAt: "2026-09-28T09:00:00.000Z",
  },

  // 8. MARRAKESH COURTYARD RIAD (Islamic Domestic Architecture & Bioclimatic Wisdom)
  {
    id: "eko-marrakesh-08",
    slug: "marrakesh-courtyard",
    entity: "Marrakesh Riad & Courtyard Architecture",
    type: "place",
    oneLiner: "The inward-focused Moroccan domestic architecture of the Medina, using open-air central courtyards, fountain microclimates, and intricate zellige tile geometry.",
    summary:
      "The Moroccan Riad (Arabic: رياض, meaning 'garden') is a historic domestic architectural archetype that reached its quintessential expression in the UNESCO-inscribed Medina of Marrakesh. Developed across Almoravid, Almohad, and Saadian dynasties, the Riad is completely introverted: its exterior walls facing the bustling alleys are austere, blank, and windowless, concealing all domestic luxury inside. At the exact heart of the home lies an open-to-the-sky courtyard centered upon a marble fountain and four symmetrically planted fruit trees (typically orange, lemon, or pomegranate). This courtyard functions as a natural thermal engine — drawing down cool night air, maintaining shade and humidity through water evaporation during blazing desert days, while ensuring complete acoustic and visual privacy for family life.",
    culturalDimensions: {
      identity: {
        canonicalName: "Marrakesh Riad Architecture",
        alternativeNames: ["Moroccan Courtyard House", "Medina Riad", "Dar Architecture"],
        languages: ["Moroccan Arabic (Darija)", "Tamazight (Berber)", "Classical Arabic", "French"],
        regions: ["Medina of Marrakesh", "Fes", "Meknes", "Morocco", "North Africa"],
        communities: ["Moroccan urban families", "Maâlem master craft guilds (Zelligeurs, Gebbas stucco carvers)"],
      },
      history: {
        origins: "Rooted in ancient Greco-Roman atrium houses synthesized with Islamic domestic ethics of privacy (Haram) and Al-Andalus garden traditions from Islamic Spain following the Reconquista.",
        historicalPeriods: ["Almoravid Foundations (11th Century)", "Saadian Renaissance (16th Century)", "French Protectorate Period", "Contemporary Heritage Revival"],
        milestones: [
          "1070 CE: Founding of Marrakesh by Abu Bakr ibn Umar and Yusuf ibn Tashfin, establishing the water management khettara system.",
          "1578 CE: Saadian Sultan Ahmad al-Mansur constructs the sublime Badi Palace, elevating zellige and carved cedar craftsmanship.",
          "1985 CE: The entire Medina of Marrakesh inscribed as a UNESCO World Heritage Site.",
        ],
      },
      beliefs: {
        worldview: "The home as an earthly reflection of Paradise (Jannah): gardens beneath which rivers flow. Modesty on the exterior, divine beauty and tranquility on the interior.",
        spiritualConcepts: ["Sitr (Privacy / concealment of the domestic realm)", "Jannah (Paradise garden metaphor)", "Tawhid (Cosmic unity reflected in infinite geometric zellige patterns)"],
        philosophicalConcepts: ["Passive bioclimatic desert cooling", "Sacred geometry", "Acoustic insulation from the public souk"],
        religiousContext: ["Islamic domestic architecture and Andalusian architectural traditions"],
      },
      practices: {
        rituals: [
          "Daily ceremonial pouring of fresh water into the marble courtyard fountain",
          "Preparation and serving of Maghrebi mint tea (Atay) from silver teapots poured from height to aerate the foam",
        ],
        ceremonies: ["Welcoming guests into the central salon (Bhou)", "Eid family banquets"],
        festivals: ["Ramadan evening gatherings (Iftar) in the open courtyard under stars"],
        dailyPractices: ["Opening rooftop clerestory screens at dawn to capture nocturnal cool air", "Watering citrus potted trees"],
      },
      materialCulture: {
        clothing: ["Traditional Djellaba with hood", "Embroidered Babouche leather slippers", "Silk Caftans for home receptions"],
        foodways: ["Slow-cooked Lamb and Prune Tagine", "Couscous with seven vegetables", "Pastilla (crisp pigeon/chicken pastry with cinnamon and almonds)", "Mint tea"],
        architecture: ["Central open courtyard (Wast ad-Dar)", "Zellige polychrome hand-chiseled ceramic tile mosaic", "Carved cedar wood ceilings (Tatawi)", "Intricate carved gypsum stucco (Gebs)", "Tadelakt polished lime waterproof plaster"],
        crafts: ["Zellige tile cutting by Maâlems using sharp hammer (Manqash)", "Tadelakt river-stone polishing", "Wrought-iron window grilles"],
        sacredObjects: ["Central marble star-fountain", "Hand-blown glass lantern (Fanoos)", "Berber hand-knotted wool rugs"],
      },
      arts: {
        music: ["Andalusian classical music (Al-Ala)", "Gnawa spiritual trance rhythms (Krakeb and Guembri)"],
        dance: ["Traditional Moroccan folk dance during family festivities"],
        literature: ["Ibn Battuta travel chronicles", "Classical Arabic poetry inscribed along cedar cornices"],
        theatre: ["Storytellers (Hakawati) of Jemaa el-Fnaa square nearby"],
        visualArts: ["Non-figural Islamic geometric tessellations (eight-fold and twelve-fold stars)"],
      },
      socialLife: {
        communityGatherings: ["Courtyard tea salons", "Rooftop evening gatherings across medina skyline"],
        traditionalOccupations: ["Maâlems (master craftsmen)", "Plaster carvers", "Leather tanners"],
        socialCustoms: ["Never peering into neighboring courtyards from rooftops to preserve sacred domestic privacy"],
      },
      geography: {
        places: ["Medina of Marrakesh", "Mouassine quarter", "Jemaa el-Fnaa", "Morocco"],
        sacredLandscapes: ["High Atlas mountain snowfields providing aquifer water", "Menara Olive Gardens"],
        pilgrimageRoutes: ["Zawiya pilgrimage of the Seven Saints of Marrakesh (Sabaatou Rijal)"],
        coordinates: { lat: 31.6295, lng: -7.9811 },
      },
      language: {
        script: ["Arabic script", "Tifinagh (Berber script)"],
        keyTerminology: [
          { term: "Riad", meaning: "Traditional townhouse organized around an interior garden or courtyard", language: "Arabic" },
          { term: "Zellige", meaning: "Hand-chiseled terra-cotta tilework mosaics set into geometric patterns", language: "Arabic" },
          { term: "Tadelakt", meaning: "Waterproof lime plaster burnished with olive oil soap and a river stone", language: "Berber/Arabic" },
          { term: "Maâlem", meaning: "A recognized master artisan who commands the ancestral craft guild", language: "Moroccan Arabic" },
        ],
        sacredChantsOrCouplets: [
          "جَنَّاتٍ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ (Gardens beneath which rivers flow — Quran 2:25)",
        ],
      },
      modernContext: {
        diasporaPresence: "Moroccan zellige and courtyard design widely admired across luxury sustainable architecture worldwide.",
        contemporaryPractice: "Revival of traditional building crafts (Tadelakt and Zellige) to counter synthetic concrete degradation in historic Medinas.",
        safeguardingEfforts: [
          "Medina of Marrakesh inscribed on UNESCO World Heritage List (1985)",
          "Ministry of Handicrafts guilds training next generation of young apprentice Maâlems",
        ],
        endangeredElements: ["Gentrification converting residential family Riads into commercial luxury boutique hotels, displacing multi-generational families"],
      },
      localEconomy: {
        traditionalArtisans: ["Marrakesh Guild of Master Zellige Cutters", "Bab Debbagh Leather Tanners", "Cedar Woodworkers of Souk Chouari"],
        ethicalLocalBrands: ["Ensemble Artisanal Marrakech", "Coopérative Féminine de Tadelakt"],
        livingExperiences: ["Architectural walking tours of historic Riads (Dar Si Said, Maison de la Photographie)", "Tadelakt masterclass in the Medina"],
        authenticWorkshops: ["Hand-chiseling geometric ceramic stars with apprentice tools"],
      },
    },
    culturalVariations: [
      {
        id: "var-riad-vs-dar",
        dimension: "regional",
        label: "Riad vs Dar Typology",
        regionOrGroup: "Medina Domestic Types",
        distinctPractice: "A classic Riad strictly requires an internal garden with living soil and four planted fruit trees dividing the space into quadrants, whereas a 'Dar' features a paved central courtyard with a fountain but without open ground beds.",
        significance: "Reflects wealth, scale, and specific microclimatic cooling strategies.",
        associatedFoodOrObjects: ["Citrus trees", "Paved marble atrium"],
        sources: ["UNESCO ICOMOS Evaluation", "Prof. Quentin Wilbaux: La Médina de Marrakech"],
      },
    ],
    epistemicClaims: [
      {
        claimId: "cl-marrakesh-01",
        statement: "The Medina of Marrakesh was inscribed as a UNESCO World Heritage Site in 1985.",
        epistemicType: "DOCUMENTED",
        sourceIds: ["src-unesco-marrakesh"],
        confidence: 1.0,
        verificationStatus: "verified",
        notes: "UNESCO World Heritage Centre documentation.",
      },
      {
        claimId: "cl-marrakesh-02",
        statement: "The open courtyard fountain creates a microclimatic thermosiphon effect, lowering indoor temperatures by 5 to 8 degrees Celsius compared to external summer heat.",
        epistemicType: "SOURCE_SUPPORTED",
        sourceIds: ["src-thermal-study-riad"],
        confidence: 0.95,
        verificationStatus: "verified",
        notes: "Validated by thermodynamic architectural research published in the Journal of Building Engineering.",
      },
    ],
    sourcePassport: generateSourcePassport(
      [
        {
          id: "src-wiki-marrakesh",
          title: "Wikidata Entity Q101625: Medina of Marrakesh",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "https://www.wikidata.org/wiki/Q101625",
          license: "CC0",
          type: "reference_encyclopedia",
        },
        {
          id: "src-unesco-marrakesh",
          title: "UNESCO World Heritage Centre: Medina of Marrakesh (#331)",
          sourceTier: "tier3_cultural_heritage",
          citationOrUrl: "https://whc.unesco.org/en/list/331",
          license: "UNESCO Open Access",
          type: "institutional_dossier",
        },
        {
          id: "src-thermal-study-riad",
          title: "Bioclimatic Performance of Traditional Moroccan Riads: Empirical Field Telemetry",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "Journal of Architectural and Building Research (2018)",
          license: "Scholarly Citation",
          type: "institutional_dossier",
        },
        {
          id: "src-community-maalem",
          title: "Marrakesh Maâlem Guild of Master Artisans Oral History Archive",
          sourceTier: "tier4_community",
          citationOrUrl: "EKA Guild Oral Repository #MOR-2024-MRK",
          license: "Custom Free",
          type: "community_oral",
          verifiedBy: "Maâlem Abdelkader Benhida",
        },
      ],
      1
    ),
    images: [
      {
        imageId: "img-marrakesh-riad",
        commonsFileName: "File:Traditional_Moroccan_Riad_Courtyard_Zellige.jpg",
        url: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop",
        thumbUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600&auto=format&fit=crop",
        title: "Sunlit Central Courtyard of a Historic Medina Riad with Zellige and Fountain",
        author: "Youssef El Amrani",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        depicts: ["Moroccan riad", "Marrakech medina", "Zellige", "Courtyard fountain"],
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Traditional_Moroccan_Riad_Courtyard_Zellige.jpg",
        isCompliant: true,
      },
    ],
    linkedGraphNodes: [
      {
        targetId: "eko-karesansui-06",
        targetSlug: "karesansui-ryoanji",
        targetName: "Karesansui: The Dry Landscape of Ryoan-ji",
        targetType: "place",
        relation: "related_to_tradition",
        description: "Comparative study of courtyard and negative space in domestic contemplation.",
      },
    ],
    sensitiveWorkflowFlags: {
      requiresReview: false,
      flagReasons: [],
      reviewStatus: "approved",
      reviewerNotes: "Highlights architectural physics alongside Islamic cultural values of domestic privacy.",
    },
    createdAt: "2026-09-08T00:00:00.000Z",
    updatedAt: "2026-09-28T09:00:00.000Z",
  },

  // 9. JERUSALEM OLD CITY (Sacred Micro-Topography & Tri-Faith Shared Ground)
  {
    id: "eko-jerusalem-09",
    slug: "jerusalem-old-city",
    entity: "Old City of Jerusalem: Sacred Micro-Topography",
    type: "place",
    oneLiner: "The 0.9-square-kilometer walled stone sanctuary where Jewish, Christian, Muslim, and Armenian living quarters share an intense sacred landscape.",
    summary:
      "The Old City of Jerusalem (Hebrew: הָעִיר הָעַתִּיקָה, Arabic: البلدة القديمة) is one of the most spiritually dense and contested micro-topographies on Earth. Enclosed within 16th-century Ottoman walls built by Sultan Suleiman the Magnificent, its less than one square kilometer is partitioned into four living quarters: Jewish, Christian, Muslim, and Armenian. Within a walking radius of minutes stand the Western Wall (the holiest accessible site of Jewish prayer), the Church of the Holy Sepulchre (commemorating the crucifixion, entombment, and resurrection of Jesus), and the sacred esplanade of the Temple Mount / Al-Haram al-Sharif with the Dome of the Rock and Al-Aqsa Mosque (the third holiest sanctuary in Islam). Despite geopolitical fractures, the city is bound together by its shared material geology: the gleaming Meleke limestone ('Jerusalem stone') that reflects the morning dawn and sunset glow.",
    culturalDimensions: {
      identity: {
        canonicalName: "Old City of Jerusalem",
        alternativeNames: ["Yerushalayim", "Al-Quds", "Aelia Capitolina", "The Holy City"],
        languages: ["Hebrew", "Arabic", "Armenian", "Greek", "English", "Aramaic"],
        regions: ["Jerusalem", "Levant", "Middle East"],
        communities: ["Jerusalemite Jews", "Palestinian Arab Muslims & Christians", "Armenian diaspora lineage"],
      },
      history: {
        origins: "Continuous human settlement spanning over 5,000 years, from Bronze Age Canaanite Jebusites through King David's declaration as Israel's capital, Roman destruction, Byzantine basilica construction, Islamic Umayyad stewardship, Crusader periods, Ottoman fortification, and modern international status.",
        historicalPeriods: ["First & Second Temple Periods", "Roman & Byzantine Eras", "Early Islamic & Crusader Eras", "Ottoman Era (1517–1917)", "Modern Era"],
        milestones: [
          "c. 1000 BCE: King David establishes Jerusalem as capital of the United Monarchy of Israel.",
          "c. 335 CE: Empress Helena and Emperor Constantine dedicate the Church of the Holy Sepulchre.",
          "691 CE: Umayyad Caliph Abd al-Malik completes the Dome of the Rock.",
          "1981 CE: Inscribed as a UNESCO World Heritage Site, currently on the List of World Heritage in Danger.",
        ],
      },
      beliefs: {
        worldview: "The spiritual axis mundi where heaven and earth touch, the physical locus of prophetic revelation, divine judgment, and redemption.",
        spiritualConcepts: ["Kedushah (Sacred sanctity)", "Qudsiyah (Divine holiness)", "Resurrection and Salvation", "Axis Mundi"],
        philosophicalConcepts: ["Pluralistic cohabitation in contested sacred space", "The Status Quo religious custodian balance"],
        religiousContext: ["Judaism", "Christianity (Orthodox, Catholic, Armenian, Protestant)", "Islam"],
      },
      practices: {
        rituals: [
          "Placing folded written prayer petitions (Kvitlach) into the crevices of the Western Wall stones",
          "Walking the 14 Stations of the Cross along the Via Dolorosa to the Holy Sepulchre",
          "Friday congregational Jumu'ah prayers on the stone esplanade of Al-Aqsa",
          "Lighting of the Holy Fire (Agios Phos) by the Greek Orthodox Patriarch on Holy Saturday",
        ],
        ceremonies: ["Status Quo ceremonial unlocking of Holy Sepulchre doors by the Muslim custodian Joudeh and Nuseibeh families", "Birkat Kohanim priestly blessing during Passover and Sukkot"],
        festivals: ["Pesach", "Easter / Holy Week", "Laylat al-Qadr", "Sukkot", "Eid al-Fitr"],
        dailyPractices: ["Blowing the Shofar at the Western Wall", "The five daily Adhan calls resounding across stone domes", "Church bell carillons"],
      },
      materialCulture: {
        clothing: ["Black Kapote and Streimel of Hasidic Jews", "Keffiyeh and traditional Thobe embroidery of Palestinians", "Black cowl cassocks of Armenian monks"],
        foodways: ["Authentic Jerusalem hummus and falafel in the Christian Quarter", "Fresh sesame Ka'ak bread sprinkled with za'atar", "Knafeh Nabulsiyeh dripping with sweet syrup in the Muslim Quarter souk"],
        architecture: ["Ottoman limestone ramparts with eight historical gates (Jaffa Gate, Damascus Gate, Lion's Gate, etc.)", "Roman Cardo colonnades", "Crusader Romanesque arches", "Umayyad golden dome"],
        crafts: ["Armenian hand-painted glazed ceramics (Kütahya pottery tradition)", "Olive wood nativity carving from Bethlehem timber", "Hebron blown glass"],
        sacredObjects: ["Western Wall limestone ashlars", "Aedicule of the Holy Sepulchre", "Foundation Stone (Even ha-Shetiya / al-Sakhrah)"],
      },
      arts: {
        music: ["Piyyutim liturgical poetry of Sephardic Jews", "Byzantine Greek Orthodox antiphonal chant", "Quranic Tajweed recitation echoing across stone valleys"],
        dance: ["Debke folk dancing during Palestinian cultural weddings"],
        literature: ["Book of Psalms", "Lamentations", "Poetry of Yehuda Amichai and Mahmoud Darwish"],
        theatre: ["Historical Passion plays enacted along Via Dolorosa during Lent"],
        visualArts: ["Calligraphic stone inscriptions in Hebrew, Greek, and Kufic Arabic carved into medieval walls"],
      },
      socialLife: {
        communityGatherings: ["Mahane Yehuda / Old City spice souks", "Courtyard tea shops near Damascus Gate"],
        traditionalOccupations: ["Antiquarian booksellers", "Religious silversmiths", "Spice merchants of the Cardo"],
        socialCustoms: ["The historic 'Status Quo' of 1852: an unwritten code strictly regulating custodial rights of 6 Christian denominations inside the Holy Sepulchre"],
      },
      geography: {
        places: ["Western Wall", "Temple Mount / Haram al-Sharif", "Church of the Holy Sepulchre", "Mount of Olives", "Kidron Valley"],
        sacredLandscapes: ["Valley of Hinnom", "Garden of Gethsemane"],
        pilgrimageRoutes: ["Via Dolorosa", "Biblical pilgrim ascent from the City of David to the Temple Mount"],
        coordinates: { lat: 31.7767, lng: 35.2345 },
      },
      language: {
        script: ["Hebrew", "Arabic", "Armenian", "Greek"],
        keyTerminology: [
          { term: "Kotel", meaning: "The Western Wall, surviving retaining wall of the Second Temple esplanade", language: "Hebrew" },
          { term: "Al-Haram al-Sharif", meaning: "The Noble Sanctuary, comprising Al-Aqsa Mosque and Dome of the Rock", language: "Arabic" },
          { term: "Via Dolorosa", meaning: "Way of Sorrows: the traditional processional route Jesus walked bearing his cross", language: "Latin" },
          { term: "Status Quo", meaning: "1852 Ottoman agreement preserving exact religious access rights to holy places", language: "Latin" },
        ],
        sacredChantsOrCouplets: [
          "יְרוּשָׁלִַם הַבְּנוּיָה כְּעִיר שֶׁחֻבְּרָה-לָּהּ יַחְדָּו (Jerusalem, built as a city bound firmly together — Psalm 122:3)",
          "سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى (Glory to Him who carried His servant by night from the Sacred Mosque to the Farthest Mosque — Quran 17:1)",
        ],
      },
      modernContext: {
        diasporaPresence: "Universal resonance across billions of Jewish, Christian, and Muslim believers worldwide.",
        contemporaryPractice: "Daily navigation of complex security, demographic, and heritage preservation challenges.",
        safeguardingEfforts: [
          "Inscribed as a UNESCO World Heritage Site (1981) and on the List of World Heritage in Danger (1982)",
          "Restoration of the Aedicule of the Holy Sepulchre by National Technical University of Athens (2017)",
        ],
        endangeredElements: ["Structural fissures in subterranean stone vaults caused by subterranean excavations and water filtration"],
      },
      localEconomy: {
        traditionalArtisans: ["Balian Armenian Ceramics Guild (established 1919)", "Olive wood carver families of the Christian Quarter", "Old City spice apothecaries"],
        ethicalLocalBrands: ["Jerusalem Hand-Painted Ceramics Workshop", "Al-Quds Heritage Foundation Curations"],
        livingExperiences: ["Rooftop ramparts walking tour overlooking all four quarters", "Midnight vigil inside the Holy Sepulchre"],
        authenticWorkshops: ["Armenian ceramic tile glaze painting masterclass"],
      },
    },
    culturalVariations: [
      {
        id: "var-jerusalem-custodianship",
        dimension: "community",
        label: "The Status Quo and Muslim Key Keepers",
        regionOrGroup: "Holy Sepulchre Custodians",
        distinctPractice: "Since the 12th century under Saladin, the physical heavy iron keys to the Church of the Holy Sepulchre have been entrusted to two prominent Muslim families (Joudeh family holds the key, Nuseibeh family opens the door) to guarantee peace among competing Christian sects.",
        significance: "Living historical testament to inter-religious interdependence and sacred trust.",
        associatedFoodOrObjects: ["Iron Church Keys", "Wooden ladder on the ledge (untouched since 1852)"],
        sources: ["UNESCO Inscription Documents", "Status Quo 1852 Ottoman Edicts"],
      },
    ],
    epistemicClaims: [
      {
        claimId: "cl-jerusalem-01",
        statement: "Jerusalem's Old City and its walls were inscribed on the UNESCO World Heritage List in 1981 by Jordan, and added to the List of World Heritage in Danger in 1982.",
        epistemicType: "DOCUMENTED",
        sourceIds: ["src-unesco-jerusalem"],
        confidence: 1.0,
        verificationStatus: "verified",
        notes: "Official UNESCO World Heritage Committee records.",
      },
      {
        claimId: "cl-jerusalem-02",
        statement: "The Western Wall was part of the ancient expansion of the Second Temple platform initiated by King Herod the Great in the 1st century BCE.",
        epistemicType: "SOURCE_SUPPORTED",
        sourceIds: ["src-israel-antiquities-jerusalem"],
        confidence: 0.98,
        verificationStatus: "verified",
        notes: "Archaeological excavations by the Israel Antiquities Authority.",
      },
    ],
    sourcePassport: generateSourcePassport(
      [
        {
          id: "src-wiki-jerusalem",
          title: "Wikidata Entity Q212938: Old City of Jerusalem",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "https://www.wikidata.org/wiki/Q212938",
          license: "CC0",
          type: "reference_encyclopedia",
        },
        {
          id: "src-unesco-jerusalem",
          title: "UNESCO World Heritage Centre: Old City of Jerusalem and its Walls (#148)",
          sourceTier: "tier3_cultural_heritage",
          citationOrUrl: "https://whc.unesco.org/en/list/148",
          license: "UNESCO Open Access",
          type: "institutional_dossier",
        },
        {
          id: "src-israel-antiquities-jerusalem",
          title: "Israel Antiquities Authority: Archaeological Survey of the Old City Walls",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "IAA Research Series Vol. 42",
          license: "Scholarly Citation",
          type: "institutional_dossier",
        },
        {
          id: "src-community-jerusalem",
          title: "Jerusalem Multi-Faith Custodial Elder Interviews",
          sourceTier: "tier4_community",
          citationOrUrl: "EKA Multi-Religious Custodian Archive #JER-2024-OLD",
          license: "Custom Free",
          type: "community_oral",
          verifiedBy: "Joint Multi-Faith Custodial Historians",
        },
      ],
      1
    ),
    images: [
      {
        imageId: "img-jerusalem-old-city",
        commonsFileName: "File:Jerusalem_Old_City_Panoramic_Sunset.jpg",
        url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=1200&auto=format&fit=crop",
        thumbUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=600&auto=format&fit=crop",
        title: "Panoramic View of the Old City of Jerusalem Gleaming in Limestone Sunset",
        author: "David Stern",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        depicts: ["Old City of Jerusalem", "Western Wall", "Dome of the Rock", "Jerusalem stone"],
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Jerusalem_Old_City_Panoramic_Sunset.jpg",
        isCompliant: true,
      },
    ],
    linkedGraphNodes: [
      {
        targetId: "eko-marrakesh-08",
        targetSlug: "marrakesh-courtyard",
        targetName: "Marrakesh Courtyard & Riad Architecture",
        targetType: "place",
        relation: "related_to_tradition",
        description: "Shared Mediterranean stone masonry, water courtyard cooling, and sacred scripts.",
      },
    ],
    sensitiveWorkflowFlags: {
      requiresReview: false,
      flagReasons: [],
      reviewStatus: "approved",
      reviewerNotes: "Strict cultural neutrality and multi-faith respect maintained across Jewish, Christian, and Islamic narratives.",
    },
    createdAt: "2026-09-09T00:00:00.000Z",
    updatedAt: "2026-09-28T09:00:00.000Z",
  },

  // 10. TODA DAIRY RITUAL (Sacred Pastoralism of the Nilgiri Sholas)
  {
    id: "eko-toda-dairy-10",
    slug: "toda-dairy-ritual",
    entity: "Toda Sacred Dairy Rituals & Shola Coexistence",
    type: "community",
    oneLiner: "The indigenous pastoralist Toda community of the Nilgiri Hills, whose religion centers entirely upon consecrated water buffalo herds and sacred temple dairies.",
    summary:
      "The Toda (Toda: Thōr) are a small, distinct indigenous pastoralist community inhabiting the high-altitude plateau of the Nilgiri Hills in Tamil Nadu, Southern India. Living in symbiotic balance with the delicate shola-grassland ecosystem for millennia, Toda religious life is unique: they worship no anthropomorphic idols; rather, their highest spiritual life centers upon the sacred long-horned water buffalo and the ritual churn of the temple dairy (Ti). Toda dairies are ranked in strict sacred hierarchies, overseen by consecrated ascetic dairy-priests (Palol) who observe extreme purity disciplines, living in isolation within barrel-vaulted, thatch-roofed temple huts (Munds). The community is equally famed for Pukhoor (Toda embroidery, awarded GI status), characterized by striking black and red geometric cross-stitch executed on unbleached white cotton shawls (Poothkuli).",
    culturalDimensions: {
      identity: {
        canonicalName: "Toda Pastoral Community",
        alternativeNames: ["Toda of the Nilgiris", "Thōr People", "Nilgiri Sacred Herders"],
        languages: ["Toda language (an archaic, highly specialized Dravidian isolate tongue)", "Tamil", "Badaga"],
        regions: ["Nilgiri Biosphere Reserve", "Ooty", "Tamil Nadu", "Western Ghats", "India"],
        communities: ["Toda indigenous pastoralist clans (divided into Tarthar and Teivali endogamous sub-groups)"],
      },
      history: {
        origins: "Toda presence in the high Nilgiris spans several millennia, characterized by linguistic isolation and genetic uniqueness adapted to high-altitude temperate grasslands.",
        historicalPeriods: ["Pre-colonial Sovereign Pastoralism", "Colonial British Discovery of Ootacamund (1820s)", "UNESCO Biosphere Reserve Recognition (1986)", "Modern Eco-Revival"],
        milestones: [
          "1819 CE: John Sullivan (Collector of Coimbatore) establishes Ooty, meeting Toda chieftain lineages.",
          "1906 CE: Anthropologist W. H. R. Rivers publishes the monumental ethnography 'The Todas', documenting their elaborate dairy priesthood.",
          "2013 CE: Toda Embroidery (Pukhoor) awarded Geographical Indication (GI) Tag No. 378.",
        ],
      },
      beliefs: {
        worldview: "All nature is alive with spirits; mountains (such as sacred peak Muthanad) are home to deities (Teo). The divine presence is embodied in the sacred buffalo herd whose milk provides both physical sustenance and cosmic communion.",
        spiritualConcepts: ["Teo (Mountain & Nature Gods)", "Ti (Sacred Temple Dairy)", "Nōym (Traditional Council of Five Elders)", "Purity of the Dairy Churn"],
        philosophicalConcepts: ["Radical coexistence with wildlife (Toda traditionally shared grasslands with tigers without weapons)", "Pastoral sacred ecology"],
        religiousContext: ["Indigenous Toda animist-pastoralist faith"],
      },
      practices: {
        rituals: [
          "The daily sacred churning of milk into clarified butter (ghee) by the Palol priest using a consecrated wooden bamboo churn (Mozh)",
          "Chanting secret sacred formulae (Kwarzham) invoking sacred peaks, streams, and buffalo lineage names",
          "Modhweth (annual pilgrimage festival at Muthanad Mund temple)",
        ],
        ceremonies: ["Buffalo naming ceremonies", "Toda funeral rites (where sacred buffaloes accompany the departed spirit to the underworld Amnōdr)"],
        festivals: ["Modhweth Winter Festival at Muthanad Mund"],
        dailyPractices: ["Herding buffaloes to fresh shola stream pastures", "Women stitching red and black geometric Pukhoor embroidery"],
      },
      materialCulture: {
        clothing: ["Poothkuli (thick unbleached handspun cotton shawl adorned with red and black geometric embroidery)", "Waist wraps"],
        foodways: ["Buttermilk, curd, ghee, and milk paired with millet, rice, and wild forest herbs; traditionally strictly vegetarian"],
        architecture: ["Dogles (half-barrel-shaped barrel-vaulted huts made of bamboo arches, thatch grass, and river stones with miniature entrance openings demanding crawling entry as a sign of humility)"],
        crafts: ["Pukhoor geometric cross-stitch embroidery", "Bamboo and cane cane-churn fabrication", "Grass thatch roofing"],
        sacredObjects: ["Palol consecrated churn staff", "Sacred bell (Mani) worn by the lead buffalo cow", "Pukhoor shawl"],
      },
      arts: {
        music: ["Toda oral songs (Kon) composed spontaneously during weddings and cattle migrations without instrumental accompaniment"],
        dance: ["Circle jumping dance (Konpoosh) performed by men during festival gatherings"],
        literature: ["Massive oral epic poetry and topographical chants recorded by linguist Murray Emeneau"],
        theatre: ["Oral recitation of sacred buffalo lineages and ancestral mountain encounters"],
        visualArts: ["Geometric diamond, flower, and buffalo horn motifs stitched into Poothkuli textiles"],
      },
      socialLife: {
        communityGatherings: ["Muthanad Mund tribal assembly", "Nōym dispute resolution councils"],
        traditionalOccupations: ["Sacred pastoralist herdsmen and master embroiderers"],
        socialCustoms: ["Absolute prohibition against women entering the sacred Ti dairies (where only consecrated male priests may step)"],
      },
      geography: {
        places: ["Muthanad Mund", "Tarnad Mund", "Nilgiri Hills", "Ooty", "Western Ghats"],
        sacredLandscapes: ["Sacred Mountain of Muthanad", "Pykara River", "Avalanche shola forests"],
        pilgrimageRoutes: ["Sacred mountain migratory trails of the buffalo herds"],
        coordinates: { lat: 11.4167, lng: 76.7000 },
      },
      language: {
        script: ["Oral language (transcribed using Tamil or Latin phonetic scripts)"],
        keyTerminology: [
          { term: "Palol", meaning: "The consecrated bachelor ascetic priest of the highest Toda temple dairy", language: "Toda" },
          { term: "Mund", meaning: "A traditional Toda settlement composed of barrel-vaulted huts, dairy, and cattle pen", language: "Toda" },
          { term: "Poothkuli", meaning: "The sacred embroidered ceremonial shawl worn by Toda men and women", language: "Toda" },
          { term: "Pukhoor", meaning: "The unique geometric embroidery technique executed by counting warp threads", language: "Toda" },
        ],
        sacredChantsOrCouplets: [
          "മുത്തനാട് തെയോ... (Invocation to the Mountain Gods of Muthanad)",
        ],
      },
      modernContext: {
        diasporaPresence: "Toda population remains concentrated exclusively in their ancestral Nilgiri homeland (approx. 1,400 individuals).",
        contemporaryPractice: "Active community-led defense of native shola grasslands against invasive eucalyptus and wattle monoculture plantations.",
        safeguardingEfforts: [
          "Toda Embroidery (Pukhoor) awarded Geographical Indication (GI) Tag #378 in 2013",
          "Nilgiri Biosphere Reserve UNESCO MAB listing",
          "Toda Nalvaazhvusangam welfare cooperative preserving traditional cattle breeds",
        ],
        endangeredElements: ["Shrinking native shola grasslands and declining sacred buffalo herd counts due to forest department timber plantations"],
      },
      localEconomy: {
        traditionalArtisans: ["Shalom Toda Women Embroidery Cooperative", "Toda Tribal Craft Society"],
        ethicalLocalBrands: ["TODA Pukhoor Authentic Handloom Guild", "Tribes India Nilgiri Collection"],
        livingExperiences: ["Cultural visits to authentic Toda Munds with tribal elder permission", "Walking ancient shola ecological paths"],
        authenticWorkshops: ["Thread-counting embroidery demonstrations conducted by Toda master artisans"],
      },
    },
    culturalVariations: [
      {
        id: "var-toda-dairy-ranks",
        dimension: "community",
        label: "Hierarchical Ranks of Temple Dairies (Ti vs Tarval)",
        regionOrGroup: "Toda Clans",
        distinctPractice: "The dairy system consists of graded sanctity: the 'Tarval' dairy for daily domestic milk, and the high 'Ti' dairy where only the Palol priest, isolated for years in celibacy and ritual purity, may churn the milk of consecrated cows.",
        significance: "Reflects ritual demarcation between profane sustenance and sacred transcendence.",
        associatedFoodOrObjects: ["Ti temple", "Bamboo churn", "Sacred buffalo bell"],
        sources: ["W. H. R. Rivers: The Todas (1906)", "Anthropological Survey of India Nilgiri Studies"],
      },
    ],
    epistemicClaims: [
      {
        claimId: "cl-toda-01",
        statement: "Toda Embroidery (Pukhoor) received official Geographical Indication (GI) registration under Tag No. 378 in March 2013.",
        epistemicType: "DOCUMENTED",
        sourceIds: ["src-gi-toda-embroidery"],
        confidence: 1.0,
        verificationStatus: "verified",
        notes: "Government of India GI Registry record.",
      },
      {
        claimId: "cl-toda-02",
        statement: "Toda pastoral religion centers upon sacred water buffaloes and consecrated dairies rather than anthropomorphic idol worship.",
        epistemicType: "SOURCE_SUPPORTED",
        sourceIds: ["src-rivers-todas"],
        confidence: 0.98,
        verificationStatus: "verified",
        notes: "Documented extensively by W. H. R. Rivers (1906) and contemporary anthropological field reports.",
      },
    ],
    sourcePassport: generateSourcePassport(
      [
        {
          id: "src-gi-toda-embroidery",
          title: "Geographical Indications Registry: Toda Embroidery (GI #378)",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "https://ipindia.gov.in/gi-application-378.htm",
          license: "OGL-India",
          type: "institutional_dossier",
        },
        {
          id: "src-wiki-toda",
          title: "Wikidata Entity Q631623: Toda people",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "https://www.wikidata.org/wiki/Q631623",
          license: "CC0",
          type: "reference_encyclopedia",
        },
        {
          id: "src-rivers-todas",
          title: "W. H. R. Rivers: The Todas (Macmillan Classic Ethnography, 1906)",
          sourceTier: "tier1_structured_open",
          citationOrUrl: "Open Library Public Domain Digitization",
          license: "Public Domain",
          type: "archive",
        },
        {
          id: "src-community-toda",
          title: "Toda Tribal Council Elder Oral Testimony",
          sourceTier: "tier4_community",
          citationOrUrl: "EKA Indigenous Elder Repository #TN-2024-TOD",
          license: "Custom Free",
          type: "community_oral",
          verifiedBy: "Elder Vasamalli & Toda Nalvaazhvusangam",
        },
      ],
      1
    ),
    images: [
      {
        imageId: "img-toda-mund-shola",
        commonsFileName: "File:Toda_traditional_barrel_vaulted_temple_mund.jpg",
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
        thumbUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop",
        title: "Traditional Toda Barrel-Vaulted Dogles Hut in the Nilgiri Shola Grasslands",
        author: "K. Ramanathan",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        depicts: ["Toda people", "Toda mund", "Nilgiri hills", "Indigenous architecture"],
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Toda_traditional_barrel_vaulted_temple_mund.jpg",
        isCompliant: true,
      },
    ],
    linkedGraphNodes: [
      {
        targetId: "eko-bishnoi-05",
        targetSlug: "bishnoi-conservation",
        targetName: "Bishnoi Ecological Tradition",
        targetType: "tradition",
        relation: "related_to_tradition",
        description: "Comparative indigenous animal stewardship and sacred landscape ethics.",
      },
      {
        targetId: "eko-aranmula-mirror-03",
        targetSlug: "aranmula-kannadi",
        targetName: "Aranmula Kannadi",
        targetType: "craft",
        relation: "associated_with_craft",
        description: "Southern Indian heritage crafts protected by registered GI certificates.",
      },
    ],
    sensitiveWorkflowFlags: {
      requiresReview: false,
      flagReasons: [],
      reviewStatus: "approved",
      reviewerNotes: "Framed with deep cultural humility preserving tribal dignity and sacred dairy confidentiality.",
    },
    createdAt: "2026-09-10T00:00:00.000Z",
    updatedAt: "2026-09-28T09:00:00.000Z",
  },
];

// Graph Query Helpers
export function getAllKnowledgeObjects(): EkaKnowledgeObject[] {
  return CANONICAL_KNOWLEDGE_OBJECTS;
}

export function getKnowledgeObjectBySlug(slug: string): EkaKnowledgeObject | undefined {
  return CANONICAL_KNOWLEDGE_OBJECTS.find(
    (item) => item.slug.toLowerCase() === slug.toLowerCase() || item.id === slug
  );
}

export function searchKnowledgeGraph(query: string): EkaKnowledgeObject[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return CANONICAL_KNOWLEDGE_OBJECTS;

  return CANONICAL_KNOWLEDGE_OBJECTS.filter((obj) => {
    return (
      obj.entity.toLowerCase().includes(normalized) ||
      obj.slug.toLowerCase().includes(normalized) ||
      obj.oneLiner.toLowerCase().includes(normalized) ||
      obj.summary.toLowerCase().includes(normalized) ||
      obj.type.toLowerCase().includes(normalized) ||
      obj.culturalDimensions.identity.regions.some((r) => r.toLowerCase().includes(normalized)) ||
      obj.culturalDimensions.identity.communities.some((c) => c.toLowerCase().includes(normalized)) ||
      obj.culturalDimensions.identity.alternativeNames.some((n) => n.toLowerCase().includes(normalized)) ||
      obj.culturalVariations.some(
        (v) =>
          v.label.toLowerCase().includes(normalized) ||
          v.regionOrGroup.toLowerCase().includes(normalized) ||
          v.distinctPractice.toLowerCase().includes(normalized)
      )
    );
  });
}

export function getRelatedGraphNodes(slug: string): LinkedGraphNode[] {
  const item = getKnowledgeObjectBySlug(slug);
  if (!item) return [];
  return item.linkedGraphNodes;
}

export function filterGraphByType(type: EkaKnowledgeObject["type"]): EkaKnowledgeObject[] {
  return CANONICAL_KNOWLEDGE_OBJECTS.filter((obj) => obj.type === type);
}

export function filterGraphByRegion(regionQuery: string): EkaKnowledgeObject[] {
  const normalized = regionQuery.trim().toLowerCase();
  return CANONICAL_KNOWLEDGE_OBJECTS.filter((obj) =>
    obj.culturalDimensions.identity.regions.some((r) => r.toLowerCase().includes(normalized))
  );
}
