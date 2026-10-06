// ==============================================================================
// EKA CROSS-CULTURAL COMPARISON ENGINE: "ONE WITH ALL"
// ==============================================================================
// Visualizes universal human questions across distinct cultural traditions.
// Principle: "Different cultures. Similar human question."
// ==============================================================================

export interface CultureComparisonPoint {
  cultureName: string;
  flagEmoji: string;
  location: string;
  traditionName: string;
  practiceSnippet: string;
  meaningSnippet: string;
}

export interface CrossCulturalComparison {
  id: string;
  title: string;
  humanQuestion: string;
  universalTheme: string;
  coreInsight: string;
  ekaOneWithAllThesis: string;
  points: CultureComparisonPoint[];
  curiosityLoops: string[];
}

export const CULTURAL_COMPARISONS: CrossCulturalComparison[] = [
  {
    id: "coming-of-age",
    title: "Coming-of-Age Ceremonies",
    humanQuestion: "When does a child become an adult?",
    universalTheme: "Transition from youth to communal responsibility",
    coreInsight:
      "Every society marks the moment childhood ends—not with a lone birthday cake, but with a community rite testing character, conferring sacred knowledge, and welcoming youth into lifelong duty.",
    ekaOneWithAllThesis:
      "Across continents and centuries, human beings recognize that growing up is too significant to leave unmarked. Distinct rituals, one shared human passage.",
    points: [
      {
        cultureName: "India & South Asia",
        flagEmoji: "🇮🇳",
        location: "Pan-India",
        traditionName: "Upanayana & Regional Rites",
        practiceSnippet: "Investiture of the sacred cord (Yajnopavita), initiation into Gayatri mantra, and transition into studenthood (Brahmacharya).",
        meaningSnippet: "Symbolizes a 'second birth' through knowledge, moral discipline, and intellectual responsibility.",
      },
      {
        cultureName: "Japan",
        flagEmoji: "🇯🇵",
        location: "Nationwide Japan",
        traditionName: "Seijin no Hi (Coming of Age Day)",
        practiceSnippet: "Youth turning 20 dress in traditional furisode kimono or formal suits, gather at city halls, and visit Shinto shrines for blessings.",
        meaningSnippet: "Public acknowledgement of adulthood, autonomy, voting rights, and civic contribution.",
      },
      {
        cultureName: "Jewish Communities",
        flagEmoji: "✡️",
        location: "Global Diaspora & Israel",
        traditionName: "Bar & Bat Mitzvah",
        practiceSnippet: "At age 13 (or 12 for girls), adolescents read publicly from the Torah scroll in the synagogue before family and congregation.",
        meaningSnippet: "Acceptance of personal moral accountability for observing the commandments and contributing to community welfare.",
      },
      {
        cultureName: "Latin America",
        flagEmoji: "🌎",
        location: "Mexico, Colombia, Americas",
        traditionName: "Quinceañera",
        practiceSnippet: "A 15th-birthday celebration beginning with a Catholic Mass of Thanksgiving followed by the ceremonial change of shoes from flats to heels.",
        meaningSnippet: "Honoring gratitude to family, womanhood, and community commitment with maternal blessings.",
      },
      {
        cultureName: "Maasai People",
        flagEmoji: "🇰🇪",
        location: "Kenya & Tanzania",
        traditionName: "Eunoto Graduation",
        practiceSnippet: "After years living in the wild as Moran warriors, young men have their ochre-colored hair ritually shaved by their mothers.",
        meaningSnippet: "Crossing over from warrior status into senior elders eligible to marry, lead council debates, and protect community cattle.",
      },
    ],
    curiosityLoops: [
      "Why do so many cultures shave hair during major life transitions?",
      "How do Spartan and Indigenous Australian walkabouts compare?",
      "Why do modern societies struggle with youth loneliness when these rites disappear?",
    ],
  },

  {
    id: "sacred-light",
    title: "Sacred Light & Living Flame",
    humanQuestion: "Why do humans kindle fire in the dark?",
    universalTheme: "Light as the triumph of consciousness over despair",
    coreInsight:
      "Fire is the original hearth. When night falls or winter deepens, cultures worldwide light lamps and candles to recall the warmth of spirit, dispel malevolence, and honor divine presence.",
    ekaOneWithAllThesis:
      "Whether through mustard oil in clay or beeswax before an altar, every culture discovers that darkness cannot drive out darkness; only light can do that.",
    points: [
      {
        cultureName: "India & South Asia",
        flagEmoji: "🇮🇳",
        location: "India & Diaspora",
        traditionName: "Diwali Diyas & Kashi Aarti",
        practiceSnippet: "Millions of handmade clay lamps filled with mustard oil line windows, river ghats, and doorsteps during Kartik new moon.",
        meaningSnippet: "The inner flame of awareness (Atman) illuminating the illusion of separateness.",
      },
      {
        cultureName: "Christianity & Europe",
        flagEmoji: "🕯️",
        location: "Global & European Cathedrals",
        traditionName: "Advent Wreaths & Paschal Candle",
        practiceSnippet: "Lighting progressive candles each Sunday of Advent leading to Christmas, and the Easter vigil kindling in total dark.",
        meaningSnippet: "Hope growing amidst the winter solstice; Christ as the light of the world driving back shadow.",
      },
      {
        cultureName: "East Asia & China",
        flagEmoji: "🏮",
        location: "China, Taiwan, Vietnam",
        traditionName: "Yuanxiao Lantern Festival",
        practiceSnippet: "Red glowing lanterns carrying poetic riddles hoisted into skies and floated upon waterways on the first full moon of the lunar year.",
        meaningSnippet: "Reconciliation, peace, welcoming spring, and lighting the path for benevolent ancestors.",
      },
      {
        cultureName: "Persian Tradition",
        flagEmoji: "🇮🇷",
        location: "Iran, Central Asia, Azerbaijan",
        traditionName: "Chaharshanbe Suri (Fire Festival)",
        practiceSnippet: "On the eve of the last Wednesday before Nowruz, people leap over bonfires chanting: 'Give me your redness, take my yellowness!'",
        meaningSnippet: "Purifying the body of winter sluggishness and sickness through the cleansing vitality of fire.",
      },
      {
        cultureName: "Jewish Tradition",
        flagEmoji: "🕎",
        location: "Global Jewish Diaspora",
        traditionName: "Hanukkah Menorah",
        practiceSnippet: "Kindling the 8-branched Hanukkiah night by night using the attendant candle (shamash) during the darkest winter nights.",
        meaningSnippet: "Remembering the miracle of the temple oil that burned 8 days; dedication to freedom of conscience.",
      },
    ],
    curiosityLoops: [
      "Why is fire considered an incorruptible element in Zoroastrianism and Hinduism?",
      "Why do lanterns floating on water symbolize releasing grief in Thailand (Loy Krathong)?",
      "How did early humans develop sacred myths around hearth keeping?",
    ],
  },

  {
    id: "sacred-fasting",
    title: "Sacred Fasting & Renunciation",
    humanQuestion: "Why do humans choose to hunger?",
    universalTheme: "Voluntary restraint to awaken empathy and spiritual clarity",
    coreInsight:
      "When the belly is full, attention scatters outward. By willingly refusing food, every major civilization uses hunger as a chisel to sculpt humility, test resolve, and bridge solidarity with the poor.",
    ekaOneWithAllThesis:
      "From the desert sands of Arabia to the Jain temples of Gujarat, hunger is embraced not as punishment, but as freedom from appetite.",
    points: [
      {
        cultureName: "Islamic World",
        flagEmoji: "🌙",
        location: "Global Muslim Ummah",
        traditionName: "Ramadan Sawm",
        practiceSnippet: "Abstaining from all food, water, and anger from dawn until sunset for an entire lunar month, breaking fast with dates at Iftar.",
        meaningSnippet: "Cultivating Taqwa (God-consciousness), gratitude, and lived empathy for those who go hungry every day.",
      },
      {
        cultureName: "Jain Tradition",
        flagEmoji: "🕊️",
        location: "Western India & Communities",
        traditionName: "Paryushana & Upvas",
        practiceSnippet: "Days of unbroken water-only fasts culminating in Michhami Dukkadam—the universal request for forgiveness from every living creature.",
        meaningSnippet: "Shedding accumulated karmic matter and affirming absolute non-violence (Ahimsa) toward all living forms.",
      },
      {
        cultureName: "Judaism",
        flagEmoji: "✡️",
        location: "Global Jewish Community",
        traditionName: "Yom Kippur (Day of Atonement)",
        practiceSnippet: "A strict 25-hour complete fast from food and drink accompanied by intensive prayer and confession in white garments.",
        meaningSnippet: "Afflicting the soul in solemn repentance so that sins are sealed for forgiveness in the Book of Life.",
      },
      {
        cultureName: "Hindu Tradition",
        flagEmoji: "🕉️",
        location: "India & Diaspora",
        traditionName: "Ekadashi & Navratri Vrat",
        practiceSnippet: "Fasting twice a lunar month on the 11th lunar day (Ekadashi) and 9 days of satvik grain-free dining during Navratri.",
        meaningSnippet: "Aligning bodily biology with planetary lunar tides and turning physical energy inward toward devotion.",
      },
      {
        cultureName: "Christianity",
        flagEmoji: "✝️",
        location: "Orthodox & Catholic Traditions",
        traditionName: "Great Lent (Fast of 40 Days)",
        practiceSnippet: "Orthodox Christian Great Lent abstains from meat, dairy, eggs, and wine to accompany Christ's journey into the desert.",
        meaningSnippet: "Subduing bodily pride to prepare for the joyful resurrection of Easter.",
      },
    ],
    curiosityLoops: [
      "Why do medical scientists now confirm the cellular benefits of autophagy discovered by ancient fasters?",
      "Why is water fasting considered the ultimate truth test across indigenous vision quests?",
      "What is the psychology of breaking the fast together in communal meals?",
    ],
  },

  {
    id: "ancestor-remembrance",
    title: "Honoring Ancestors & The Departed",
    humanQuestion: "How do the living speak to those who came before?",
    universalTheme: "The unbroken thread between the living and the dead",
    coreInsight:
      "No human culture truly believes the dead vanish. Whether through marigold petals, rice balls offered to crows, or lantern boats, societies build annual bridges across the veil of memory.",
    ekaOneWithAllThesis:
      "We exist because thousands came before us. Gratitude to our roots is the soil from which our own future branches grow.",
    points: [
      {
        cultureName: "Mexico & Latin America",
        flagEmoji: "🇲🇽",
        location: "Oaxaca, Michoacán, Mexico",
        traditionName: "Día de los Muertos (Day of the Dead)",
        practiceSnippet: "Families construct vibrant multi-tiered ofrendas (altars) adorned with marigolds (cempasúchil), sugar skulls, and favorite foods.",
        meaningSnippet: "Death is not mourned in terror but celebrated as an affectionate reunion where the souls return to feast with the living.",
      },
      {
        cultureName: "India & South Asia",
        flagEmoji: "🇮🇳",
        location: "Gaya, Varanasi, Across India",
        traditionName: "Pitru Paksha & Shraddha",
        practiceSnippet: "During a 16-day lunar period, sons and daughters offer water, sesame seeds, and rice balls (pinda) to ancestors and feed birds.",
        meaningSnippet: "Repaying the sacred debt (Pitru Rina) to our forebears, easing their journey in the ancestral realm.",
      },
      {
        cultureName: "Japan",
        flagEmoji: "🇯🇵",
        location: "Nationwide Japan",
        traditionName: "Obon & Toro Nagashi",
        practiceSnippet: "Lanterns are lit at household altars to guide spirits home, followed by the Bon Odori folk dance and releasing candle lanterns into rivers.",
        meaningSnippet: "Honoring Buddhist ancestral spirits with joy, cleansing the village, and gently guiding ancestors back to the spirit world.",
      },
      {
        cultureName: "China & East Asia",
        flagEmoji: "🇨🇳",
        location: "China, Singapore, Malaysia",
        traditionName: "Qingming (Tomb Sweeping Day)",
        practiceSnippet: "Families travel to ancestral graves to weed, sweep, offer cold food, and burn paper currency or incense in reverence.",
        meaningSnippet: "Filial piety (xiao) extending past physical death; reinforcing family clan solidarity across generations.",
      },
      {
        cultureName: "Celtic & Irish Heritage",
        flagEmoji: "🇮🇪",
        location: "Ireland & Ancient Celtic Lands",
        traditionName: "Samhain (Root of Halloween)",
        practiceSnippet: "Lighting community bonfires as the harvest ends and winter begins, leaving plates of food outside for travelling ancestral souls.",
        meaningSnippet: "The liminal moment when the boundary between this world and the Otherworld becomes wafer-thin.",
      },
    ],
    curiosityLoops: [
      "Why is the orange marigold flower used for the dead in both Mexico and India?",
      "Why do cultures leave food offerings for crows and birds in ancestor rites?",
      "How does remembering our lineage protect mental resilience in times of crisis?",
    ],
  },
];

export function getComparisonById(id: string): CrossCulturalComparison | undefined {
  return CULTURAL_COMPARISONS.find((c) => c.id === id);
}

// ==============================================================================
// PAIRWISE CULTURAL COMPARISONS: HEAD-TO-HEAD RIGOROUS ANALYSIS
// ==============================================================================
// Required by EKA Competitive Standard #11:
// Explicitly distinguishes:
// - Similarities
// - Differences
// - Documented Historical Relationship vs No Known Relationship
// - Regional Variations
// - Sources with Provenance
// "Never infer historical connections from visual similarity alone."
// ==============================================================================

export type HistoricalRelationshipType =
  | "DOCUMENTED_HISTORICAL_TRANSMISSION"
  | "PARALLEL_HUMAN_QUESTION"
  | "INDIRECT_SYNCRETISM"
  | "DISPUTED_OR_UNKNOWN";

export interface PairwiseCultureComparisonEntity {
  name: string;
  culture: string;
  region: string;
  flagEmoji: string;
  timePeriod: string;
  keySymbol: string;
  knowledgeSlug?: string;
  summary: string;
}

export interface PairwiseCultureComparison {
  id: string;
  title: string;
  humanQuestion: string;
  entityA: PairwiseCultureComparisonEntity;
  entityB: PairwiseCultureComparisonEntity;
  similarities: string[];
  differences: string[];
  historicalRelationshipType: HistoricalRelationshipType;
  historicalRelationshipBadge: string;
  historicalRelationshipDetail: string;
  epistemicWarning: string;
  regionalVariations: {
    entityA: string[];
    entityB: string[];
  };
  sources: Array<{
    title: string;
    citation: string;
    verificationLevel:
      | "PRIMARY_SOURCE"
      | "INSTITUTIONAL"
      | "SCHOLARLY"
      | "COMMUNITY_VERIFIED"
      | "EKA_RESEARCHED";
    url?: string;
  }>;
  askEkaPrompt: string;
}

export const PAIRWISE_CULTURAL_COMPARISONS: PairwiseCultureComparison[] = [
  {
    id: "diwali-vs-lunar-new-year",
    title: "Diwali vs. Lunar New Year",
    humanQuestion: "Why do civilizations welcome renewal with lamps, feasts, and sound?",
    entityA: {
      name: "Diwali (Deepavali)",
      culture: "Indic / Hindu, Jain & Sikh",
      region: "South Asia & Global Diaspora",
      flagEmoji: "🇮🇳",
      timePeriod: "Kartik Amavasya (Autumn New Moon, Oct-Nov)",
      keySymbol: "Clay Diya (Mustard Oil Lamp)",
      knowledgeSlug: "diwali",
      summary:
        "The festival of lights celebrating the triumph of spiritual awareness (Sattva) over darkness, wealth of virtue (Lakshmi), and Lord Rama's return to Ayodhya.",
    },
    entityB: {
      name: "Lunar New Year (Chūn Jié / Tết / Seollal)",
      culture: "Sinosphere / East Asia",
      region: "China, Vietnam, Korea & Global Diaspora",
      flagEmoji: "🏮",
      timePeriod: "1st Day of First Lunar Month (Jan-Feb)",
      keySymbol: "Red Lantern & Paper Couplets (Chunlian)",
      summary:
        "The Spring Festival marking the agricultural turn from winter freeze to fertile spring, reuniting families, honoring ancestors, and warding off the mythological beast Nian.",
    },
    similarities: [
      "Kindling sacred light (diyas / red lanterns) to dispel malevolent spirits, gloom, and cold.",
      "Extensive deep-cleaning of homes before the festival to welcome blessings and purge misfortune.",
      "Homecoming of dispersed family members sharing elaborate multi-generational banquet feasts.",
      "Gifting auspicious wealth (mithai & gifts / hóngbāo red envelopes with money) to younger kin.",
      "Honoring deities and concepts of wealth, longevity, and household fortune.",
    ],
    differences: [
      "Temporal Cycle: Diwali marks the dark new moon of mid-autumn; Lunar New Year heralds the imminent arrival of spring (Lìchūn).",
      "Philosophical Core: Diwali centers on the inner light of Atman and cosmic righteousness; Lunar New Year centers on family lineage, filial piety (Xiào), and cosmological balance.",
      "Symbolic Palette: Diwali uses warm terracotta, brass, and auspicious saffron/rangoli powders; Lunar New Year strictly privileges auspicious crimson red (warding beast Nian) and imperial gold.",
      "Dietary Traditions: Diwali emphasizes vegetarian sweets (kaju katli, laddus, murukku); Lunar New Year emphasizes dumplings (jiaozi resembling ingots) and whole steamed fish (symbolizing abundance/yu).",
    ],
    historicalRelationshipType: "PARALLEL_HUMAN_QUESTION",
    historicalRelationshipBadge: "No Known Historical Connection (Parallel Human Question)",
    historicalRelationshipDetail:
      "Scholarly consensus confirms NO DOCUMENTED DIRECT HISTORICAL TRANSMISSION between ancient Indic Deepavali and East Asian Lunar New Year rituals. Both emerged autonomously within their respective agro-climatic and philosophical matrices. Shared motifs of flame, feast, and renewal represent parallel human cognitive responses to winter darkness, not borrowing or common descent.",
    epistemicWarning:
      "EKA Provenance Standard: Never infer historical connections from visual similarity alone. Fire, feasts, and family reunions are universal human archetypes.",
    regionalVariations: {
      entityA: [
        "North India: Five-day festival centering on Lakshmi Puja and Ramayana homecoming.",
        "South India: Deepavali celebrated at dawn on Naraka Chaturdashi with sesame oil bath.",
        "Bengal: Concurrently observed as Shyama Puja (worship of Goddess Kali).",
        "Jain Tradition: Commemorates the final liberation (Moksha/Nirvana) of Lord Mahavira.",
      ],
      entityB: [
        "Northern China: Making and eating crescent-shaped pork and cabbage dumplings on New Year's Eve.",
        "Southern China & Hong Kong: Flower markets, lion dances, and steamed sweet rice cakes (Nian Gao).",
        "Vietnam (Tết Nguyên Đán): Square sticky rice cake (Bánh chưng) and yellow apricot blossoms.",
        "Korea (Seollal): Ancestral rite (Charye) and eating rice cake soup (Tteokguk) to gain one year of age.",
      ],
    },
    sources: [
      {
        title: "UNESCO Intangible Cultural Heritage Dossiers",
        citation: "UNESCO Representative List of Cultural Traditions, ICH-00234 & ICH-00412",
        verificationLevel: "INSTITUTIONAL",
      },
      {
        title: "Oxford Centre for Hindu Studies: Festivals & Rites of Kartik",
        citation: "Flood, Gavin. An Introduction to Hinduism. Cambridge University Press, 1996.",
        verificationLevel: "SCHOLARLY",
      },
      {
        title: "Chinese Folk Customs & Seasonal Calendars",
        citation: "Bodde, Derk. Festivals in Classical China. Princeton University Press, 1975.",
        verificationLevel: "SCHOLARLY",
      },
    ],
    askEkaPrompt: "Compare Diwali and Lunar New Year: what do their celebrations reveal about how humanity responds to darkness?",
  },
  {
    id: "holi-vs-songkran",
    title: "Holi vs. Songkran",
    humanQuestion: "Why do cultures dissolve social barriers through water and sacred play?",
    entityA: {
      name: "Holi (Phagwah)",
      culture: "Indic / Hindu",
      region: "India, Nepal & Caribbean Diaspora",
      flagEmoji: "🇮🇳",
      timePeriod: "Phalguna Purnima (Full Moon of Feb-March)",
      keySymbol: "Gulal (Organic Colored Powder)",
      knowledgeSlug: "holi",
      summary:
        "The festival of divine colors and spring joy celebrating the burning of demoness Holika, the devotion of Prahlada, and the divine play (Leela) of Radha-Krishna.",
    },
    entityB: {
      name: "Songkran (Water Festival)",
      culture: "Southeast Asian / Theravāda Buddhist & Tai",
      region: "Thailand, Laos, Myanmar (Thingyan), Cambodia",
      flagEmoji: "🇹🇭",
      timePeriod: "April 13–15 (Solar Astrological New Year)",
      keySymbol: "Water Vessels & Scented Water (Nam Ob)",
      summary:
        "The traditional Thai New Year marked by pouring scented water over Buddha images and elders' hands, evolving into nationwide civic water splashing to cleanse the past year.",
    },
    similarities: [
      "Total dissolution of daily rigid social hierarchy and status during public outdoor play.",
      "Communal immersion in fluids/colors to wash away the physical heat and mental burdens of the old season.",
      "Marking the decisive seasonal transition into summer / spring harvest.",
      "Preceded by solemn rituals honoring elders and ancestors before wild street celebrations commence.",
    ],
    differences: [
      "Medium of Play: Holi primarily centers on colored powders (gulal) and coloured water; Songkran is exclusively clean, often scented or chilled water without powder.",
      "Mythological Grounding: Holi commemorates Prahlada's deliverance from fire and Radha-Krishna's Vrindavan romances; Songkran commemorates the mythological tale of Thao Kabinlaphrom and the seven Nang Songkran ladies.",
      "Astrological Base: Holi is locked to the lunar full moon of Phalguna; Songkran is tied to the sidereal solar transit into Mesha (Aries), fixed to April 13-15.",
      "Religious Solemnity: Songkran includes rigorous Buddhist temple merit-making (Tak Bat) and constructing sand stupas (Chedi Sai) at wat grounds.",
    ],
    historicalRelationshipType: "DOCUMENTED_HISTORICAL_TRANSMISSION",
    historicalRelationshipBadge: "Documented Historical Transmission (Sanskrit Saṅkrānti)",
    historicalRelationshipDetail:
      "DOCUMENTED HISTORICAL TRANSMISSION: The name 'Songkran' is linguistically derived directly from the Sanskrit word 'Saṅkrānti' (संक्रान्ति), designating the transit of the sun into a new zodiac sign—specifically Mesha Saṅkrānti (the vernal equinox). Transmitted via maritime trade routes, Brahmanical astrology, and Theravāda Buddhist networks from India to Southeast Asia during the Dvaravati and early Sukhothai eras, it syncretized with indigenous Southeast Asian seasonal water-splashing customs.",
    epistemicWarning:
      "EKA Provenance Standard: Acknowledge historical transmission accurately: while the astrological name and date stem from India, the specific water-splashing folklore and Theravāda Buddhist merit rituals are unique Southeast Asian cultural achievements.",
    regionalVariations: {
      entityA: [
        "Braj / Barsana: Celebrated as Lathmar Holi where women playfully beat men's shields with sticks.",
        "Bengal & Odisha: Known as Dol Jatra with deities placed on decorated palanquins and swung.",
        "Goa: Observed as Shigmo with vibrant street parades and traditional folk dances (Ghode Modni).",
      ],
      entityB: [
        "Chiang Mai: The epicenter of Songkran with massive moat parades and Buddha statue bathing.",
        "Central Thailand / Bangkok: Massive citywide water splashing on Silom and Khao San Road.",
        "Rural Thailand: Rod Nam Dum Hua ceremony where youth pour fragrant water over elders' palms seeking blessings.",
      ],
    },
    sources: [
      {
        title: "École française d'Extrême-Orient (EFEO) Archives",
        citation: "Coedès, George. The Indianized States of Southeast Asia. East-West Center Press, 1968.",
        verificationLevel: "SCHOLARLY",
      },
      {
        title: "UNESCO Representative List of Intangible Cultural Heritage",
        citation: "Songkran in Thailand, traditional Thai New Year festival (Inscribed 2023).",
        verificationLevel: "INSTITUTIONAL",
      },
      {
        title: "Braj Cultural Heritage Monograph",
        citation: "Haberman, David L. Journey Through the Twelve Forests. Oxford University Press, 1994.",
        verificationLevel: "SCHOLARLY",
      },
    ],
    askEkaPrompt: "Explain the historical link between Indian Sanskrit Sankranti and Thailand's Songkran festival.",
  },
  {
    id: "indian-weddings-vs-japanese-weddings",
    title: "Indian Weddings vs. Japanese Weddings",
    humanQuestion: "How do sacred ceremonies bind two families and invoke spiritual witnesses?",
    entityA: {
      name: "Indian Hindu Wedding (Vivaha Samskara)",
      culture: "Indic / Vedic & Regional",
      region: "Pan-India & Global Diaspora",
      flagEmoji: "🇮🇳",
      timePeriod: "Multi-day continuum (Auspicious Muhurat)",
      keySymbol: "Agni (Sacred Fire) & Mangalsutra / Sindoor",
      knowledgeSlug: "bengali-wedding",
      summary:
        "A monumental multi-day sacrament binding two extended lineages through sacred fire, Vedic mantras, emotional songs, and communal feasts.",
    },
    entityB: {
      name: "Japanese Shinto Wedding (Shinzen Kekkon)",
      culture: "Japanese / Shinto",
      region: "Japan & Shinto Shrines",
      flagEmoji: "🇯🇵",
      timePeriod: "Single day solemn ritual (Taian auspicious days)",
      keySymbol: "San-san-kudo (Three-times-three Sake Cups)",
      knowledgeSlug: "ojigi",
      summary:
        "A contemplative, serene ritual conducted inside a Shinto shrine before the Kami (spirits), centering on ritual purity, sacred sake vows, and quiet familial devotion.",
    },
    similarities: [
      "Sacred Union of Lineages: Both rites prioritize joining two family ancestral lines rather than just a standalone individual contract.",
      "Elemental Offerings: Both invoke sacred elemental witnesses (Vedic Fire Agni in India; Shinto Kami spirits of nature and sake in Japan).",
      "Special Auspicious Scheduling: Astrological matching (Kundali/Muhurat in India; Rokuyo calendar Taian days in Japan).",
      "Symbolic Garments: Strictly codified attire imbued with purity and marital virtue (Banarasi silk / Kanjeevaram sari vs. Shiromuku white kimono / Uchikake).",
    ],
    differences: [
      "Acoustic & Spatial Atmosphere: Indian weddings are acoustically expressive, joyful, and multi-generational (dholak, shehnai, 300-1000 guests); traditional Shinto weddings require quiet, reverent shrine intimacy limited to immediate family.",
      "Core Sacramental Act: Indian weddings center on Saptapadi (Seven Steps around sacred fire); Japanese weddings center on San-san-kudo (nuptial cups of sacred sake sipped in three rounds).",
      "Role of the Priest: Hindu priest (pandit) recites Sanskrit mantras for hours explaining cosmic commitments; Shinto priest (kannushi) conducts purification (harae) and reads prayer (norito) with brief shrine maiden (miko) sacred dance.",
      "Contemporary Evolution: Indian weddings preserve traditional rites inside grand celebrations; Japanese modern couples often conduct Shinto shrine rites followed by Western-style chapel and hotel banquets.",
    ],
    historicalRelationshipType: "PARALLEL_HUMAN_QUESTION",
    historicalRelationshipBadge: "No Known Historical Connection (Parallel Human Institution)",
    historicalRelationshipDetail:
      "NO DOCUMENTED HISTORICAL TRANSMISSION. Vedic marriage sacraments and Japanese Shinto wedding customs arose in absolute independence. Their parallel emphasis on familial lineage, ritual purity, and cosmic witnessing reflects shared human anthropological imperatives surrounding matrimonial cohesion.",
    epistemicWarning:
      "EKA Provenance Standard: Never confuse modern Westernized receptions in Mumbai or Tokyo with historical indigenous sacraments. Treat both as autonomous cultural summits.",
    regionalVariations: {
      entityA: [
        "Bengali: Saat Paak (bride carried on wooden seat), Subho Drishti eye contact, and Bou Bhaat feast.",
        "South Indian / Tamil: Kanyadaanam, Tying the Thaali, and Saptapadi with foot-touching grinding stone.",
        "Punjabi: Anand Karaj (in Gurdwara around Guru Granth Sahib) or vibrant Hindu Baraat processions.",
      ],
      entityB: [
        "Shinto Traditional: Solemn shrine ceremony in pure white Shiromuku kimono representing purity and maiden death/rebirth into groom's family.",
        "Western Chapel: White dress Christian-style ceremony inside dedicated hotel chapels, popular since the 1980s.",
        "Okinawa Ryukyu Style: Traditional Bingata colorful robes with ancestral Ryukyuan blessings.",
      ],
    },
    sources: [
      {
        title: "Anthropological Survey of India Marriage Series",
        citation: "Singh, K.S. People of India: Cultural Diversity and Ritual Bonds. ASI, 1998.",
        verificationLevel: "INSTITUTIONAL",
      },
      {
        title: "Shinto Wedding Ritual Studies",
        citation: "Bocking, Brian. A Popular Dictionary of Shinto. Curzon Press, 1997.",
        verificationLevel: "SCHOLARLY",
      },
      {
        title: "Vedic Samskaras Compendium",
        citation: "Pandey, Rajbali. Hindu Samskaras: Socio-Religious Study of the Hindu Sacraments. Motilal Banarsidass, 1969.",
        verificationLevel: "SCHOLARLY",
      },
    ],
    askEkaPrompt: "Compare Indian Vivaha and Japanese Shinto wedding rituals: why do both view marriage as joining families rather than individuals?",
  },
  {
    id: "yoga-vs-tai-chi",
    title: "Yoga vs. Tai Chi (Taijiquan)",
    humanQuestion: "How do humans cultivate vitality, breath, and inner stillness through movement?",
    entityA: {
      name: "Classical Indian Yoga",
      culture: "Indic / Vedic, Upanishadic & Tantric",
      region: "India (Himalayas, Rishikesh, Pan-India)",
      flagEmoji: "🇮🇳",
      timePeriod: "Over 2,500 years (Patanjali c. 400 CE; Hatha c. 1100 CE)",
      keySymbol: "Padmasana (Lotus Pose) & Om Pranava",
      knowledgeSlug: "varanasi",
      summary:
        "The eight-limbed path (Ashtanga) unifying individual consciousness with the infinite through ethical restraint, bodily posture (asana), breath regulation (pranayama), and meditation (dhyana).",
    },
    entityB: {
      name: "Tai Chi Chuan (Taijiquan)",
      culture: "Chinese / Daoist & Neo-Confucian",
      region: "China (Chenjiagou, Wudang Mountains)",
      flagEmoji: "🇨🇳",
      timePeriod: "Rooted in 13th-17th Century CE martial arts",
      keySymbol: "Taijitu (Yin-Yang Harmony Crest)",
      summary:
        "An internal Chinese martial art (Neijia) practicing continuous, soft, circular movements to balance Qi (life force), harmonize Yin and Yang, and achieve active moving meditation.",
    },
    similarities: [
      "Mind-Body-Breath Integration: Synchronization of breathing rhythms with mental focus and physical alignment.",
      "Vital Energy Anatomy: Working with unseen life energy currents (Prana and Nadis in Yoga; Qi and Meridians in Tai Chi).",
      "Stress Reduction & Nervous System Calm: Modern clinical trials validate profound autonomic regulation from both disciplines.",
      "Rooted Posture: Emphasizing downward grounding into the earth while maintaining an elongated, tension-free spine.",
    ],
    differences: [
      "Movement Philosophy: Yoga predominantly employs static held postures (asanas) with intervals of stillness; Tai Chi is continuous, uninterrupted flowing movement without stops.",
      "Martial Origin: Yoga is primarily an ascetic contemplative discipline oriented toward spiritual liberation (Moksha); Tai Chi is an authentic combat martial art designed for self-defense using internal yielding force (Jin).",
      "Metaphysical Goal: Yoga seeks transcendence beyond dualities and worldly illusion (Kaivalya/Samadhi); Tai Chi seeks harmonious participation within the dynamic dualities of nature (Yin and Yang Dao).",
      "Spine & Joint Alignment: Yoga often works with deep spinal extensions and deep joint flexion; Tai Chi maintains slightly bent knees, sunken chest, and relaxed neutral spine at all times.",
    ],
    historicalRelationshipType: "INDIRECT_SYNCRETISM",
    historicalRelationshipBadge: "Documented Cross-Pollination with Independent Roots",
    historicalRelationshipDetail:
      "DOCUMENTED CROSS-POLLINATION: When the South Indian Buddhist patriarch Bodhidharma (Da Mo) arrived at China's Shaolin Monastery around the 5th-6th century CE, he introduced Indian breathwork and physical conditioning (Yijin Jing muscle-tendon transformation exercises). This infused Chinese martial practice with Indian physiological methods. However, Tai Chi's core philosophy—the Yin-Yang duality, Daoist yielding principles, and Neidan alchemy—originated completely within Chinese indigenous thought.",
    epistemicWarning:
      "EKA Provenance Standard: Do not reduce Tai Chi to 'Chinese Yoga' or Yoga to 'Indian Martial Arts'. They possess fundamentally distinct metaphysical frameworks (Moksha/Samadhi vs Daoist Wu Wei).",
    regionalVariations: {
      entityA: [
        "Rishikesh / Himalayan Tradition: Meditative, pranayama-intensive classical Hatha.",
        "Mysore Ashtanga: Dynamic, sweating vinyasa flow codified by Krishnamacharya and Pattabhi Jois.",
        "Iyengar Tradition: Anatomical precision and therapeutic props (belts, blocks, ropes).",
      ],
      entityB: [
        "Chen Style: The oldest lineage featuring sudden bursts of explosive power (Fa Jin) alternated with slow coils.",
        "Yang Style: The most widely practiced global form featuring slow, expansive, graceful continuous motions.",
        "Wu Style: Compact movements with subtle internal focus and forward leaning stance.",
      ],
    },
    sources: [
      {
        title: "Harvard Medical School Guide to Tai Chi",
        citation: "Wayne, Peter M. The Harvard Medical School Guide to Tai Chi. Shambhala, 2013.",
        verificationLevel: "SCHOLARLY",
      },
      {
        title: "Yoga: Immortality and Freedom",
        citation: "Eliade, Mircea. Yoga: Immortality and Freedom. Princeton University Press, 1958.",
        verificationLevel: "SCHOLARLY",
      },
      {
        title: "Chinese Martial Arts History",
        citation: "Lorge, Peter A. Chinese Martial Arts: From Antiquity to the Twenty-First Century. Cambridge University Press, 2012.",
        verificationLevel: "SCHOLARLY",
      },
    ],
    askEkaPrompt: "How do Yoga and Tai Chi approach the breath and vital energy differently?",
  },
  {
    id: "indian-temple-vs-japanese-shrine-architecture",
    title: "Hindu Temple vs. Japanese Shinto Shrine Architecture",
    humanQuestion: "How do humans manifest sacred divine presence in stone, wood, and sacred landscape?",
    entityA: {
      name: "Hindu Temple Architecture (Mandir)",
      culture: "Indic / Hindu (Nagara & Dravida)",
      region: "India (Khajuraho, Thanjavur, Konark, Pan-India)",
      flagEmoji: "🇮🇳",
      timePeriod: "Evolved 5th Century CE to present day",
      keySymbol: "Gopuram / Shikhara & Garbhagriha (Inner Sanctum)",
      knowledgeSlug: "varanasi",
      summary:
        "Monumental stone and brick cosmic mountains (Meru) constructed on mathematical Vastu Purusha Mandalas, housing divine deities within a darkened womb-chamber.",
    },
    entityB: {
      name: "Japanese Shinto Shrine Architecture (Jinja)",
      culture: "Japanese / Shinto (Shinmei, Taisha & Nagare styles)",
      region: "Japan (Ise Jingu, Izumo Taisha, Fushimi Inari)",
      flagEmoji: "🇯🇵",
      timePeriod: "Rooted in Yayoi/Kofun periods (c. 300 BCE - 700 CE)",
      keySymbol: "Torii Gate & Chigi / Katsuogi Roof Beams",
      knowledgeSlug: "ojigi",
      summary:
        "Natural unpainted wood structures nestled in sacred primeval forests (Chinju no Mori), designed to house invisible nature spirits (Kami) with minimalist harmony.",
    },
    similarities: [
      "Sacred Thresholds: Both employ iconic boundary gateways that visitors must cross to leave the mundane world (Torana / Gopuram in India; Torii in Japan).",
      "Purification Before Entry: Ritual ablution of hands, mouth, or feet before approaching the deity (Temple pushkarini/tanks in India; Temizuya water pavilion in Japan).",
      "Orientation and Geometry: Strict directional orientations aligned with cardinal points and sacred geography (mountains, rivers).",
      "Inner Sanctum Mystery: The supreme sacred entity is veiled inside an innermost sanctuary inaccessible to casual visitors.",
    ],
    differences: [
      "Building Material & Permanence: Hindu temples use monumental carved granite, sandstone, or marble built for eternal durability; Shinto shrines use unpainted, fragrant Japanese cypress (hinoki) wood with thatch or bark roofs.",
      "The Philosophy of Rebuilding: Ise Jingu is dismantled and rebuilt every 20 years in its entirety (Shikinen Sengu) to maintain absolute ritual purity and pass carpentry skills; Hindu stone temples are sacred permanently standing structures continuously restored.",
      "Iconography: Hindu temples are densely sculpted with thousands of deities, celestial musicians, and narrative epics; Shinto shrines feature no anthropomorphic idols in the sanctuary, relying on symbolic Kami vessels (shintai: mirrors, swords, or sacred stones).",
      "Sacred Interior: Mandir has a deep, stone-carved, dark womb-chamber (Garbhagriha); Jinja has an elevated wooden Honden sanctuary raised on pillars resembling ancient storehouses.",
    ],
    historicalRelationshipType: "INDIRECT_SYNCRETISM",
    historicalRelationshipBadge: "Indirect Syncretism & Torii Gateway Transmissions",
    historicalRelationshipDetail:
      "INDIRECT ARCHITECTURAL CROSS-POLLINATION: Shinto sacred architecture evolved natively from prehistoric raised granaries and sacred mountain veneration. However, when Buddhism entered Japan from India via China and Korea in the 6th century CE, it introduced Buddhist temple forms that deeply influenced Shinto layouts (Shinbutsu-shugo syncretism). Scholars note that the iconic Japanese Torii gate shares morphological and phonetic relationships with ancient Indian Torana gateways found at Buddhist stupas like Sanchi.",
    epistemicWarning:
      "EKA Provenance Standard: Understand material philosophy: Hindu temples build mountains in stone to emulate Mount Meru, while Shinto shrines harmonize with living trees to let the forest spirit breathe.",
    regionalVariations: {
      entityA: [
        "Nagara Style (North India): Curvilinear bee-hive shikhara spires (e.g., Khajuraho, Sun Temple Modhera).",
        "Dravida Style (South India): Pyramidal stepped vimana towers and massive gateway gopurams (e.g., Brihadisvara Thanjavur).",
        "Vesara Style (Deccan / Hoysala): Star-shaped soapstone platforms with intricate micro-carvings (e.g., Belur, Halebidu).",
      ],
      entityB: [
        "Shinmei-zukuri (Ise Jingu): Ancient pure style with straight gables, round pillars, and gold-tipped katsuogi logs.",
        "Taisha-zukuri (Izumo Taisha): Monumental gabled roof with central support pillar, evoking ancient palace halls.",
        "Nagare-zukuri (Fushimi Inari): Curved asymmetric roof sweeping out over the front entrance, the most common shrine style.",
      ],
    },
    sources: [
      {
        title: "The Hindu Temple (Vol. I & II)",
        citation: "Kramrisch, Stella. The Hindu Temple. University of Calcutta & Motilal Banarsidass, 1946.",
        verificationLevel: "SCHOLARLY",
      },
      {
        title: "Japanese Shinto Architecture Monographs",
        citation: "Inoue, Nobutaka et al. Shinto: A Short History. RoutledgeCurzon, 2003.",
        verificationLevel: "SCHOLARLY",
      },
      {
        title: "Archaeological Survey of India Architectural Survey Series",
        citation: "Soundara Rajan, K.V. Temple Architecture in Kerala. Archaeological Survey of India, 1974.",
        verificationLevel: "INSTITUTIONAL",
      },
    ],
    askEkaPrompt: "Contrast Hindu stone temple architecture and Japanese Shinto shrine architecture: why does Ise Jingu get rebuilt every 20 years while Indian temples stand for millennia?",
  },
];

export function getPairwiseComparisonById(
  id: string
): PairwiseCultureComparison | undefined {
  return PAIRWISE_CULTURAL_COMPARISONS.find((c) => c.id === id);
}

