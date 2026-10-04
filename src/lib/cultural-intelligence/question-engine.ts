// ==============================================================================
// EKA CONSUMER QUESTION ENGINE: 10 CULTURAL DIMENSIONS
// ==============================================================================
// Generates consumer-friendly, curious questions across 10 dimensions:
// 1. What
// 2. Why
// 3. How
// 4. When
// 5. Who
// 6. Where
// 7. History
// 8. Meaning
// 9. Practice
// 10. Modern life
// ==============================================================================

export type QuestionDimension =
  | "what"
  | "why"
  | "how"
  | "when"
  | "who"
  | "where"
  | "history"
  | "meaning"
  | "practice"
  | "modern_life";

export interface DimensionalQuestion {
  dimension: QuestionDimension;
  label: string;
  question: string;
  shortAnswerSnippet?: string;
}

export interface CulturalCuriositySet {
  subjectId: string;
  title: string;
  location: string;
  headlineWonder: string;
  questions: DimensionalQuestion[];
  deepDiveQuestions: string[];
}

// Curated high-impact question sets for flagship cultural objects
export const CURATED_CURIOSITY_SETS: Record<string, CulturalCuriositySet> = {
  "durga-puja": {
    subjectId: "durga-puja",
    title: "Durga Puja",
    location: "Kolkata, West Bengal · India",
    headlineWonder: "Why do Bengalis welcome the goddess as a returning daughter?",
    questions: [
      {
        dimension: "what",
        label: "What",
        question: "What is Durga Puja?",
        shortAnswerSnippet: "A 5-day celebration of devotion, community art, and the victory of divine feminine grace.",
      },
      {
        dimension: "why",
        label: "Why",
        question: "Why do Bengalis celebrate Durga Puja as a homecoming?",
        shortAnswerSnippet: "In Bengal, Goddess Durga is cherished not just as an almighty deity, but as Uma—the daughter visiting her maternal home.",
      },
      {
        dimension: "how",
        label: "How",
        question: "How is Durga Puja different across India?",
        shortAnswerSnippet: "In the North, Navratri emphasizes fasting and Ramlila; in Gujarat, Garba dance; in Bengal, elaborate neighborhood pandal art and feast.",
      },
      {
        dimension: "when",
        label: "When",
        question: "When does Durga Puja happen and what is Mahalaya?",
        shortAnswerSnippet: "Celebrated in the autumn month of Ashwin, preceded by Mahalaya marking the dawn invocation through Birendra Krishna Bhadra's radio chanting.",
      },
      {
        dimension: "who",
        label: "Who",
        question: "Who sculpts the sacred idols in Kumartuli?",
        shortAnswerSnippet: "Hereditary artisans who shape Ganga clay mixed with sacred soil from outside the home, celebrating universal inclusion.",
      },
      {
        dimension: "where",
        label: "Where",
        question: "What should someone experience during Durga Puja in Kolkata?",
        shortAnswerSnippet: "All-night pandal hopping, acoustic resonance of dhak drums, Dhunuchi Naach dances, and neighborhood community meals (bhog).",
      },
      {
        dimension: "history",
        label: "History",
        question: "What is the story behind Durga's arrival?",
        shortAnswerSnippet: "Rooted in the Devi Mahatmya, where the unified energies of all gods created the Devi to overcome Mahishasura.",
      },
      {
        dimension: "meaning",
        label: "Meaning",
        question: "What does the dhak rhythm signify?",
        shortAnswerSnippet: "The heartbeat of the festival, calling all beings into celebration without linguistic or social barriers.",
      },
      {
        dimension: "practice",
        label: "Practice",
        question: "What happens during Sindoor Khela and the immersion?",
        shortAnswerSnippet: "Women celebrate with vermilion before the clay murti is returned to the river, completing the cycle of creation and return.",
      },
      {
        dimension: "modern_life",
        label: "Modern Life",
        question: "How has Durga Puja become the world's largest public art installation?",
        shortAnswerSnippet: "Recognized by UNESCO as Intangible Cultural Heritage, transforming entire city streets into architectural and social installations.",
      },
    ],
    deepDiveQuestions: [
      "Why do Bengalis celebrate Durga Puja?",
      "Why is the Durga idol immersed in water?",
      "What happens during Sindoor Khela?",
      "Why is the dhak important?",
      "What does Mahalaya signify?",
      "What is the story behind Durga's arrival?",
      "How is Durga Puja different across India?",
      "What should someone experience during Durga Puja in Kolkata?",
    ],
  },

  "japanese-tea-ceremony": {
    subjectId: "japanese-tea-ceremony",
    title: "Chanoyu (Japanese Tea Ceremony)",
    location: "Kyoto · Japan",
    headlineWonder: "Why is drinking powdered green tea treated as a sacred path to inner peace?",
    questions: [
      {
        dimension: "what",
        label: "What",
        question: "What is Chanoyu or the Japanese Tea Ceremony?",
        shortAnswerSnippet: "A choreographic ritual of preparing and serving powdered green matcha tea in an atmosphere of mindful presence.",
      },
      {
        dimension: "why",
        label: "Why",
        question: "Why is tea more than a drink in Japan?",
        shortAnswerSnippet: "It embodies Chado (The Way of Tea), uniting Zen aesthetics, hospitality, and seasonal reverence.",
      },
      {
        dimension: "how",
        label: "How",
        question: "How does one enter a traditional tearoom?",
        shortAnswerSnippet: "Through a tiny crawl-in door (nijiriguchi) requiring every guest, even powerful samurai, to bow and leave their swords outside.",
      },
      {
        dimension: "when",
        label: "When",
        question: "When are special seasonal tea ceremonies held?",
        shortAnswerSnippet: "At dawn in summer to catch cool air, in winter around sunken hearths (ro), and during autumn moon viewings.",
      },
      {
        dimension: "who",
        label: "Who",
        question: "Who founded the core tradition of Wabi-cha?",
        shortAnswerSnippet: "16th-century tea master Sen no Rikyu, who stripped away ostentation in favor of unpretentious rustic beauty.",
      },
      {
        dimension: "where",
        label: "Where",
        question: "Why are tearooms surrounded by moss gardens (roji)?",
        shortAnswerSnippet: "The roji (dewy path) prepares the mind to leave the bustling secular world behind before stepping inside.",
      },
      {
        dimension: "history",
        label: "History",
        question: "Where did tea culture originate before reaching Japan?",
        shortAnswerSnippet: "Brought by Zen Buddhist monks from Tang and Song dynasty China as an aid to keep awake during long hours of seated meditation.",
      },
      {
        dimension: "meaning",
        label: "Meaning",
        question: "What is the meaning of 'Ichigo Ichie'?",
        shortAnswerSnippet: "'One time, one meeting'—the awareness that this exact gathering will never happen again in this lifetime.",
      },
      {
        dimension: "practice",
        label: "Practice",
        question: "Why do guests rotate the tea bowl twice before sipping?",
        shortAnswerSnippet: "To show respect by admiring the bowl's main artistic face, and sipping from the side so as not to place one's mouth on the artwork.",
      },
      {
        dimension: "modern_life",
        label: "Modern Life",
        question: "How is Chanoyu practiced in contemporary fast-paced Japan?",
        shortAnswerSnippet: "As an oasis of digital detox and mental clarity taught in schools, universities, and workplace clubs.",
      },
    ],
    deepDiveQuestions: [
      "Why is tea more than a drink in Japan?",
      "What is the meaning of 'Ichigo Ichie'?",
      "Why do guests enter through a tiny crawl-in door?",
      "What is Wabi-Sabi and how is it reflected in a tea bowl?",
      "What customs should a visitor respect at a traditional tearoom?",
    ],
  },

  "maasai-traditions": {
    subjectId: "maasai-traditions",
    title: "Maasai Living Heritage",
    location: "Rift Valley · Kenya & Tanzania",
    headlineWonder: "How do Maasai communities preserve their ancestral pastoral bond with the savannah?",
    questions: [
      {
        dimension: "what",
        label: "What",
        question: "What defines Maasai cultural identity?",
        shortAnswerSnippet: "A semi-nomadic pastoral community living in balance with East Africa's wildlife, centered around cattle, age-sets, and oral lore.",
      },
      {
        dimension: "why",
        label: "Why",
        question: "Why are cattle sacred to the Maasai?",
        shortAnswerSnippet: "Cattle represent life, social bonds, and a gift from Enkai (God); wealth is counted in children and livestock.",
      },
      {
        dimension: "how",
        label: "How",
        question: "How do Maasai age-sets function?",
        shortAnswerSnippet: "Men and women graduate through cohorts (e.g. Moran warriors to elders) via landmark ceremonies like Eunoto.",
      },
      {
        dimension: "when",
        label: "When",
        question: "When does the Eunoto graduation ritual take place?",
        shortAnswerSnippet: "Every 10 to 15 years, when senior Moran warriors transition into junior elders and family leaders.",
      },
      {
        dimension: "who",
        label: "Who",
        question: "Who leads spiritual guidance and ceremonies?",
        shortAnswerSnippet: "The Oloiboni (ritual elder and healer) offers blessings, botanical remedies, and counsel to the clan.",
      },
      {
        dimension: "where",
        label: "Where",
        question: "Where do traditional Maasai homesteads (bomas) sit in the landscape?",
        shortAnswerSnippet: "Circular enclosures made of thorn acacia trees that protect families and herds from predators without stone barriers.",
      },
      {
        dimension: "history",
        label: "History",
        question: "How have the Maasai navigated colonial land changes?",
        shortAnswerSnippet: "By tenaciously protecting their language (Maa), beadwork codes, and communal governance while creating conservancies.",
      },
      {
        dimension: "meaning",
        label: "Meaning",
        question: "What do the colors in Maasai beadwork symbolize?",
        shortAnswerSnippet: "Red is bravery and blood; white is peace and milk; blue is sky and rainfall; black is the people's resilience.",
      },
      {
        dimension: "practice",
        label: "Practice",
        question: "What is the Adumu jumping dance?",
        shortAnswerSnippet: "A circle song and vertical leap where young warriors demonstrate endurance, posture, and communal camaraderie.",
      },
      {
        dimension: "modern_life",
        label: "Modern Life",
        question: "How are Maasai youth combining tradition with technology?",
        shortAnswerSnippet: "Community members lead eco-tourism conservancies, wildlife tracking apps, and university studies while returning for ceremonies.",
      },
    ],
    deepDiveQuestions: [
      "How do Maasai communities preserve their traditions?",
      "What is the significance of the Adumu jumping dance?",
      "What do the different colors of Maasai beadwork mean?",
      "What should I understand before visiting a Maasai village?",
      "How does the age-set system structure community leadership?",
    ],
  },

  "maori-culture": {
    subjectId: "maori-culture",
    title: "Māori Culture & Tikanga",
    location: "Aotearoa New Zealand",
    headlineWonder: "What does the haka mean, and how does whakapapa connect all living things?",
    questions: [
      {
        dimension: "what",
        label: "What",
        question: "What is Tikanga Māori?",
        shortAnswerSnippet: "The correct Māori way of doing things—customs, ethics, and values passed down from ancestors across generations.",
      },
      {
        dimension: "why",
        label: "Why",
        question: "Why is the marae central to Māori community life?",
        shortAnswerSnippet: "The marae is a sacred gathering place (turangawaewae) where identity, genealogical ties, and debates take physical form.",
      },
      {
        dimension: "how",
        label: "How",
        question: "What happens during a Pōwhiri welcoming ceremony?",
        shortAnswerSnippet: "Call of welcome (karanga), speeches (whaikōrero), songs (waiata), and the sharing of breath in the hongi pressing of noses.",
      },
      {
        dimension: "when",
        label: "When",
        question: "When is Matariki celebrated?",
        shortAnswerSnippet: "In mid-winter when the Pleiades star cluster rises, marking the Māori New Year, remembering ancestors and planting crops.",
      },
      {
        dimension: "who",
        label: "Who",
        question: "Who are the tangata whenua?",
        shortAnswerSnippet: "'People of the land'—the indigenous inhabitants with ancestral spiritual custody over specific territories.",
      },
      {
        dimension: "where",
        label: "Where",
        question: "What is the sacred wharenui meeting house?",
        shortAnswerSnippet: "The carved house represents an ancestor's body: ridge beam as spine, rafters as ribs, and doorway as the mouth.",
      },
      {
        dimension: "history",
        label: "History",
        question: "Where did Māori ancestors journey from?",
        shortAnswerSnippet: "Skilled Polynesian voyagers navigated open Pacific oceans in waka hourua (double-hulled canoes) following stars and swells.",
      },
      {
        dimension: "meaning",
        label: "Meaning",
        question: "What does the haka mean?",
        shortAnswerSnippet: "A fierce ceremonial expression of passion, ancestral courage, identity, and unity—performed at celebrations, grief, and challenges.",
      },
      {
        dimension: "practice",
        label: "Practice",
        question: "What is the sacred art of Tā Moko?",
        shortAnswerSnippet: "Chiseled permanent skin markings that record a person's lineage, status, and life deeds directly on the body.",
      },
      {
        dimension: "modern_life",
        label: "Modern Life",
        question: "How has the Māori language (Te Reo) undergone historic revival?",
        shortAnswerSnippet: "Through community immersion preschools (Kōhanga Reo), official status, and widespread national song and education.",
      },
    ],
    deepDiveQuestions: [
      "What does the haka mean?",
      "Why do Māori greet by pressing noses in the hongi?",
      "What is the significance of the meeting house carvings?",
      "How does whakapapa connect people to rivers and mountains?",
      "What is Matariki and how is it celebrated?",
    ],
  },

  "diwali": {
    subjectId: "diwali",
    title: "Diwali (Deepavali)",
    location: "India & Global Diaspora",
    headlineWonder: "Why do humans light lamps in the dark, and how does Diwali differ across traditions?",
    questions: [
      {
        dimension: "what",
        label: "What",
        question: "What is Diwali?",
        shortAnswerSnippet: "The pan-Indic festival of lights celebrating the triumph of knowledge over ignorance and light over inner darkness.",
      },
      {
        dimension: "why",
        label: "Why",
        question: "Why do people light clay lamps (diyas)?",
        shortAnswerSnippet: "Earthen lamps filled with oil symbolize the temporary human body illuminated by the unchanging soul within.",
      },
      {
        dimension: "how",
        label: "How",
        question: "How is Diwali celebrated differently across India?",
        shortAnswerSnippet: "In the North, Lord Rama's return to Ayodhya; in the South, dawn oil bath and Krishna's victory; in Bengal, intense Kali Puja; in Gujarat, new financial year.",
      },
      {
        dimension: "when",
        label: "When",
        question: "When does Diwali take place in the lunar calendar?",
        shortAnswerSnippet: "On the darkest new moon night (Amavasya) of the Hindu month of Kartika, usually in October or November.",
      },
      {
        dimension: "who",
        label: "Who",
        question: "Who celebrates Diwali beyond Hinduism?",
        shortAnswerSnippet: "Jains celebrate Lord Mahavira's Nirvana; Sikhs celebrate Bandi Chhor Divas (Guru Hargobind's release of prisoners); Newar Buddhists observe Mha Puja.",
      },
      {
        dimension: "where",
        label: "Where",
        question: "Where is Diwali celebrated across the global diaspora?",
        shortAnswerSnippet: "From Varanasi ghats to Guyana, Suriname, Fiji, Singapore, London, and New York City public schools.",
      },
      {
        dimension: "history",
        label: "History",
        question: "Where did Diwali originate in antiquity?",
        shortAnswerSnippet: "Mentioned in early Vedic texts as an agrarian harvest festival where lamps guided positive cosmic energies into homes.",
      },
      {
        dimension: "meaning",
        label: "Meaning",
        question: "What does the Rangoli or Kolam at the doorstep symbolize?",
        shortAnswerSnippet: "Geometric patterns drawn with rice flour welcome Goddess Lakshmi while offering food to ants and birds in universal kindness.",
      },
      {
        dimension: "practice",
        label: "Practice",
        question: "What actually happens during the Lakshmi Puja ritual?",
        shortAnswerSnippet: "Families cleanse their homes, light 14 or 21 lamps, account books are blessed, and sweets (mithai) are exchanged with neighbors.",
      },
      {
        dimension: "modern_life",
        label: "Modern Life",
        question: "How is Diwali adapting to modern ecological consciousness?",
        shortAnswerSnippet: "Growing shifts toward green eco-friendly lamps, noise-free celebrations, and community food drives replacing excessive firecrackers.",
      },
    ],
    deepDiveQuestions: [
      "Why do people light lamps during Diwali?",
      "How is Diwali celebrated differently across India?",
      "Why do Jains, Sikhs, and Buddhists also observe this festival?",
      "What is the story behind Kali Puja during Diwali night?",
      "Why do families exchange sweets during celebrations?",
    ],
  },

  "balinese-nyepi": {
    subjectId: "balinese-nyepi",
    title: "Balinese Nyepi (Day of Silence)",
    location: "Bali · Indonesia",
    headlineWonder: "Why does an entire modern island shut down airports, lights, and streets for 24 hours of silence?",
    questions: [
      {
        dimension: "what",
        label: "What",
        question: "What is Nyepi?",
        shortAnswerSnippet: "The Balinese Hindu New Year celebrated through complete island-wide stillness, fasting, and contemplation.",
      },
      {
        dimension: "why",
        label: "Why",
        question: "Why does Bali go silent for an entire day?",
        shortAnswerSnippet: "To fool wandering malevolent spirits into believing the island is uninhabited so they pass by without lingering.",
      },
      {
        dimension: "how",
        label: "How",
        question: "What are the four core restrictions of Nyepi?",
        shortAnswerSnippet: "Catur Brata: no fire or lights (Amati Geni), no work (Amati Karya), no travel (Amati Lelungan), and no entertainment (Amati Lelanguan).",
      },
      {
        dimension: "when",
        label: "When",
        question: "When does Nyepi take place?",
        shortAnswerSnippet: "In March, following the spring equinox on the night of the new moon according to the Balinese Saka lunar calendar.",
      },
      {
        dimension: "who",
        label: "Who",
        question: "Who enforces the silence across towns and beaches?",
        shortAnswerSnippet: "The Pecalang—traditional neighborhood village security wardens dressed in black and checkered sarongs.",
      },
      {
        dimension: "where",
        label: "Where",
        question: "Where are the Ogoh-Ogoh demon statues paraded?",
        shortAnswerSnippet: "Through major village intersections on the eve of Nyepi (Ngrupuk) with loud gongs, fire torches, and music before the silence begins.",
      },
      {
        dimension: "history",
        label: "History",
        question: "How old is the Balinese Saka calendar tradition?",
        shortAnswerSnippet: "Introduced in 78 CE and syncretized with indigenous Balinese animism and ancestor reverence over 1,200 years.",
      },
      {
        dimension: "meaning",
        label: "Meaning",
        question: "What is the ecological and spiritual impact of 24 hours of silence?",
        shortAnswerSnippet: "Bali saves an estimated 20,000 tons of carbon dioxide, light pollution vanishes revealing the Milky Way, and citizens reset their minds.",
      },
      {
        dimension: "practice",
        label: "Practice",
        question: "What happens the day after Nyepi (Ngembak Geni)?",
        shortAnswerSnippet: "Families visit neighbors to ask for forgiveness for past mistakes and celebrate renewal with communal feasts.",
      },
      {
        dimension: "modern_life",
        label: "Modern Life",
        question: "Do airports and hotels comply with Nyepi today?",
        shortAnswerSnippet: "Ngurah Rai International Airport halts all commercial flights for 24 hours, making it the only international airport in the world that closes for silence.",
      },
    ],
    deepDiveQuestions: [
      "Why does Bali go silent for an entire day?",
      "What are the giant Ogoh-Ogoh statues paraded the night before?",
      "What are the four sacred rules of Nyepi?",
      "What happens to tourists visiting Bali during Nyepi?",
      "How does the island reset its environment through this ritual?",
    ],
  },
};

/**
 * Generate 10 dimensional questions dynamically for any cultural object or country
 */
export function generateQuestionsForSubject(
  title: string,
  category: string,
  location: string,
  summary?: string
): CulturalCuriositySet {
  const slugKey = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (CURATED_CURIOSITY_SETS[slugKey]) {
    return CURATED_CURIOSITY_SETS[slugKey]!;
  }

  // Fallback to auto-generated 10-dimension questions
  return {
    subjectId: slugKey,
    title,
    location,
    headlineWonder: `Why is ${title} significant to the living culture of ${location}?`,
    questions: [
      {
        dimension: "what",
        label: "What",
        question: `What is ${title}?`,
        shortAnswerSnippet: summary || `A vital cultural tradition observed in ${location}.`,
      },
      {
        dimension: "why",
        label: "Why",
        question: `Why do people celebrate or preserve ${title}?`,
        shortAnswerSnippet: `It embodies living community values, memory, and spiritual connection.`,
      },
      {
        dimension: "how",
        label: "How",
        question: `How is ${title} practiced and passed down through generations?`,
        shortAnswerSnippet: `Through oral transmission, elder guidance, and community participation.`,
      },
      {
        dimension: "when",
        label: "When",
        question: `When does ${title} take place during the year or life cycle?`,
        shortAnswerSnippet: `Tied to seasonal cycles, celestial rhythms, or community milestones.`,
      },
      {
        dimension: "who",
        label: "Who",
        question: `Who keeps ${title} alive today?`,
        shortAnswerSnippet: `Master custodians, families, and neighborhood communities in ${location}.`,
      },
      {
        dimension: "where",
        label: "Where",
        question: `Where does ${title} originate, and how does it vary by region?`,
        shortAnswerSnippet: `Deeply grounded in the sacred geography of ${location}.`,
      },
      {
        dimension: "history",
        label: "History",
        question: `Where did ${title} originate, and how ancient is it?`,
        shortAnswerSnippet: `Rooted in unbroken centuries of shared heritage and lived memory.`,
      },
      {
        dimension: "meaning",
        label: "Meaning",
        question: `What does ${title} symbolize to those who live it?`,
        shortAnswerSnippet: `Connection with ancestors, community solidarity, and reverence for nature.`,
      },
      {
        dimension: "practice",
        label: "Practice",
        question: `What actually happens during the core ceremony or ritual?`,
        shortAnswerSnippet: `Specific gestures, sacred songs, communal feasts, and symbolic acts.`,
      },
      {
        dimension: "modern_life",
        label: "Modern Life",
        question: `How is ${title} evolving and staying relevant today?`,
        shortAnswerSnippet: `Adapting to contemporary life while maintaining ancestral roots intact.`,
      },
    ],
    deepDiveQuestions: [
      `Why is ${title} important in ${location}?`,
      `How do people celebrate or practice ${title}?`,
      `What should a respectful visitor understand?`,
      `How has ${title} changed over generations?`,
    ],
  };
}
