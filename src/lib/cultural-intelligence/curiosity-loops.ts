// ==============================================================================
// EKA CURIOSITY LOOPS ENGINE: "YOU MIGHT ALSO WONDER..."
// ==============================================================================
// Generates interconnected inquiry paths after any answer.
// Creates a living cultural knowledge graph disguised as discovery.
// ==============================================================================

export interface CuriosityLoopItem {
  icon: string;
  question: string;
  connectedCulture: string;
  category: "ritual" | "symbol" | "comparison" | "place" | "lineage";
}

export interface CuriosityLoopResponse {
  leadTopic: string;
  loops: CuriosityLoopItem[];
  connectionExplorationSlug?: string;
}

const THEMATIC_CURIOSITY_LOOPS: Record<string, CuriosityLoopItem[]> = {
  light: [
    {
      icon: "🔥",
      question: "Why do humans use fire in sacred rituals across continents?",
      connectedCulture: "Comparative Religions",
      category: "comparison",
    },
    {
      icon: "🕯️",
      question: "Why do Christians light candles during Advent and Easter?",
      connectedCulture: "European Traditions",
      category: "ritual",
    },
    {
      icon: "🪔",
      question: "Why are clay lamps specifically chosen over brass in traditional Hinduism?",
      connectedCulture: "South Asia",
      category: "symbol",
    },
    {
      icon: "🏮",
      question: "Why are glowing lanterns released into rivers during East Asian festivals?",
      connectedCulture: "China & East Asia",
      category: "ritual",
    },
    {
      icon: "🔥",
      question: "Why do certain cultures walk barefoot across glowing coals?",
      connectedCulture: "Theyyam & Thimithi Traditions",
      category: "lineage",
    },
  ],

  food: [
    {
      icon: "🍛",
      question: "Why is food treated as sacred offering (Prasadam) before consumption?",
      connectedCulture: "Indic Temple Traditions",
      category: "symbol",
    },
    {
      icon: "🍵",
      question: "What does the Japanese tea master mean by 'Ichigo Ichie'?",
      connectedCulture: "Japan (Chanoyu)",
      category: "ritual",
    },
    {
      icon: "🍬",
      question: "Why do Indian families distribute sweets (mithai) during celebrations?",
      connectedCulture: "Pan-India",
      category: "ritual",
    },
    {
      icon: "🌾",
      question: "Which world cultures celebrate the autumn harvest with communal feasting?",
      connectedCulture: "Global Harvests",
      category: "comparison",
    },
    {
      icon: "🥖",
      question: "Why is breaking bread together a universal pledge of peace?",
      connectedCulture: "Mediterranean & Middle East",
      category: "comparison",
    },
  ],

  water: [
    {
      icon: "🌊",
      question: "Why do humans immerse sacred clay idols back into rivers?",
      connectedCulture: "Durga Puja & Ganesha Utsav",
      category: "ritual",
    },
    {
      icon: "💧",
      question: "What is the spiritual meaning behind holy water in Christianity, Islam, and Hinduism?",
      connectedCulture: "Comparative Worldviews",
      category: "comparison",
    },
    {
      icon: "🏛️",
      question: "Why did ancient Indian kings carve subterranean stepwells (baolis) as temples?",
      connectedCulture: "Gujarat & Rajasthan",
      category: "place",
    },
    {
      icon: "⛲",
      question: "How did Moorish architects use acoustic water fountains to cool Alhambra palaces?",
      connectedCulture: "Andalusia, Spain",
      category: "place",
    },
    {
      icon: "🚣",
      question: "Why do New Zealand Māori recognize sacred rivers as living legal ancestors?",
      connectedCulture: "Māori (Aotearoa)",
      category: "lineage",
    },
  ],

  silence: [
    {
      icon: "🤫",
      question: "Why does Bali shut down airports, vehicles, and lights for 24 hours of silence?",
      connectedCulture: "Balinese Nyepi",
      category: "ritual",
    },
    {
      icon: "⛰️",
      question: "How do monks on Mount Athos practice unceasing silent heart prayer?",
      connectedCulture: "Orthodox Hesychasm",
      category: "lineage",
    },
    {
      icon: "🕯️",
      question: "Why do Jewish communities disconnect from all electronics during Shabbat?",
      connectedCulture: "Jewish Sabbath",
      category: "ritual",
    },
    {
      icon: "🪨",
      question: "Why are Zen rock gardens raked into waves without a single plant or water drop?",
      connectedCulture: "Kyoto Zen",
      category: "place",
    },
  ],

  passage: [
    {
      icon: "🌿",
      question: "Why do so many cultures shave hair during major spiritual life passages?",
      connectedCulture: "Comparative Rites",
      category: "comparison",
    },
    {
      icon: "🦁",
      question: "How does the Maasai Eunoto warrior ceremony welcome young men into elderhood?",
      connectedCulture: "East Africa",
      category: "lineage",
    },
    {
      icon: "📜",
      question: "What is the significance of reading from the scroll during a Bar Mitzvah?",
      connectedCulture: "Judaism",
      category: "ritual",
    },
    {
      icon: "👗",
      question: "Why does the Quinceañera ceremony involve changing from flat shoes to heels?",
      connectedCulture: "Latin America",
      category: "symbol",
    },
  ],
};

/**
 * Return tailored curiosity loops based on user query or topic
 */
export function getCuriosityLoops(queryOrTopic: string): CuriosityLoopItem[] {
  const q = queryOrTopic.toLowerCase();

  if (q.includes("lamp") || q.includes("light") || q.includes("diya") || q.includes("fire") || q.includes("candle") || q.includes("diwali")) {
    return THEMATIC_CURIOSITY_LOOPS["light"]!;
  }

  if (q.includes("food") || q.includes("eat") || q.includes("tea") || q.includes("sweet") || q.includes("harvest") || q.includes("fast")) {
    return THEMATIC_CURIOSITY_LOOPS["food"]!;
  }

  if (q.includes("water") || q.includes("river") || q.includes("ganga") || q.includes("immerse") || q.includes("fountain") || q.includes("durga")) {
    return THEMATIC_CURIOSITY_LOOPS["water"]!;
  }

  if (q.includes("silence") || q.includes("quiet") || q.includes("nyepi") || q.includes("meditat") || q.includes("still") || q.includes("shabbat")) {
    return THEMATIC_CURIOSITY_LOOPS["silence"]!;
  }

  if (q.includes("age") || q.includes("adult") || q.includes("marri") || q.includes("child") || q.includes("grow") || q.includes("rite")) {
    return THEMATIC_CURIOSITY_LOOPS["passage"]!;
  }

  // Balanced default curiosity loop spanning cross-cultural wonders
  return [
    {
      icon: "🔥",
      question: "Why do humans use fire in sacred rituals across continents?",
      connectedCulture: "Comparative Religions",
      category: "comparison",
    },
    {
      icon: "🤫",
      question: "Why does Bali shut down completely for 24 hours of silence during Nyepi?",
      connectedCulture: "Bali, Indonesia",
      category: "ritual",
    },
    {
      icon: "🍵",
      question: "Why is drinking tea treated as a sacred path to inner peace in Japan?",
      connectedCulture: "Kyoto, Japan",
      category: "ritual",
    },
    {
      icon: "🌊",
      question: "Why are clay idols immersed into rivers at the end of festivals?",
      connectedCulture: "Durga Puja & India",
      category: "symbol",
    },
    {
      icon: "🦁",
      question: "How do Maasai communities pass down traditions without fences or books?",
      connectedCulture: "Kenya & Tanzania",
      category: "lineage",
    },
  ];
}
