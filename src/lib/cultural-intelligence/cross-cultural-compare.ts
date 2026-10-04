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
