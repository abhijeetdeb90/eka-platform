// ==============================================================================
// EKA MULTILINGUAL SEMANTIC SEARCH ENGINE
// ==============================================================================
// Language-Independent Semantic Entity Resolution:
// "বিহু কিয় পালন কৰা হয়?" (Assamese) -> Bihu → Festival → Assam
// "பொங்கல் ஏன் கொண்டாடப்படுகிறது?" (Tamil) -> Pongal → Festival → Tamil Nadu
// "बिहू क्यों मनाया जाता है?" (Hindi) -> Bihu → Festival → Assam
// "দুর্গা পূজা" (Bengali) -> Durga Puja → Festival → West Bengal
// ==============================================================================

import type { SupportedLocale } from "@/lib/i18n/types";
import {
  getAllKnowledgeObjects,
} from "./knowledge-graph";
import type { EkaKnowledgeObject } from "./knowledge-object";
import { getContent, CULTURAL_TRANSLATIONS_MAP } from "./multilingual-content";

export interface MultilingualSearchResult {
  canonicalSlug: string;
  matchedEntity: string;
  title: string;
  oneLiner: string;
  summary: string;
  type: string;
  region: string;
  confidence: number;
  matchedLocale: string;
  matchedKeyword?: string;
  isDirectSemanticMatch: boolean;
  traditions: string[];
  places: string[];
}

/**
 * Multilingual Semantic Alias Index
 * Maps multilingual queries and questions to canonical knowledge graph entities.
 */
const MULTILINGUAL_ALIAS_INDEX: Array<{
  canonicalSlug: string;
  keywords: string[];
  semanticQuestions: string[];
  region: string;
  type: string;
}> = [
  {
    canonicalSlug: "bohag-bihu",
    keywords: [
      "bihu", "bohag", "rongali", "sat bihu", "husori", "pepa", "gamusa", "dhol",
      // Assamese
      "বিহু", "বোহাগ বিহু", "ৰঙালী বিহু", "সাতবিহু", "হুঁচৰি", "পেঁপা", "গামোচা", "ঢোল", "অসম",
      // Hindi
      "बिहू", "बोहाग बिहू", "रोंगाली बिहू", "असमिया नववर्ष", "असम",
      // Tamil
      "பிஹு", "போஹாக் பிஹு", "அசாம்",
      // Bengali
      "বিহু", "বোহাগ বিহু", "রঙালি বিহু", "আসাম",
    ],
    semanticQuestions: [
      "বিহু কিয় পালন কৰা হয়?",
      "বোহাগ বিহু কি?",
      "बिहू क्यों मनाया जाता है?",
      "why is bihu celebrated?",
      "what is bohag bihu?",
      "who celebrates bihu?",
      "bihu festival assam",
      "what is husori?",
    ],
    region: "Assam",
    type: "festival",
  },
  {
    canonicalSlug: "pongal",
    keywords: [
      "pongal", "thai pongal", "mattu pongal", "jallikattu", "kolam", "tamil nadu",
      // Tamil
      "பொங்கல்", "தைப்பொங்கல்", "மாட்டுப் பொங்கல்", "ஜல்லிக்கட்டு", "கோலம்", "தமிழ்நாடு", "தை",
      // Hindi
      "पोंगल", "थाई पोंगल", "मट्टू पोंगल", "तमिलनाडु",
      // Assamese
      "পোংগল", "তামিলনাডু",
      // Bengali
      "পোঙ্গল", "তামিলনাড়ু",
    ],
    semanticQuestions: [
      "பொங்கல் ஏன் கொண்டாடப்படுகிறது?",
      "தைப்பொங்கல் என்றால் என்ன?",
      "पोंगल क्यों मनाया जाता है?",
      "why is pongal celebrated?",
      "what is pongal festival?",
      "what is jallikattu?",
    ],
    region: "Tamil Nadu",
    type: "festival",
  },
  {
    canonicalSlug: "diwali",
    keywords: [
      "diwali", "deepavali", "lights", "diya", "lakshmi", "kali puja", "bandi chhor", "ayodhya",
      // Hindi
      "दीपावली", "दिवाली", "दीपक", "दीप", "लक्ष्मी पूजन", "अयोध्या", "काशी",
      // Assamese
      "দীপাৱলী", "চাকি", "পোহৰৰ উৎসৱ",
      // Tamil
      "தீபாவளி", "கங்கா ஸ்நானம்", "விளக்கு",
      // Bengali
      "দীপাবলি", "কালী পূজা", "প্রদীপ",
    ],
    semanticQuestions: [
      "दीपावली क्यों मनाई जाती है?",
      "why do people light lamps at dusk?",
      "தீபாவளி ஏன் கொண்டாடப்படுகிறது?",
      "দীপাৱলী কিয় উদযাপন কৰা হয়?",
      "why is diwali celebrated?",
      "what is the story of diwali?",
    ],
    region: "Pan-India",
    type: "festival",
  },
  {
    canonicalSlug: "majuli-sattra-culture",
    keywords: [
      "majuli", "sattra", "sankardeva", "sattriya", "bhaona", "mukha", "samaguri",
      // Assamese
      "মাজুলী", "সত্ৰ", "শংকৰদেৱ", "সত্ৰীয়া", "ভাওনা", "মুখা", "চামগুৰি",
      // Hindi
      "माजुली", "सत्र", "शंकरदेव", "सत्रिया", "मुखौटा कला",
      // Tamil
      "மஜூலி", "சத்ரா",
    ],
    semanticQuestions: [
      "মাজুলীৰ সত্ৰ কি?",
      "মাজুলীৰ মুখাশিল্প কেনেকৈ নিৰ্মাণ কৰা হয়?",
      "what are the sattras of majuli?",
      "who founded majuli sattras?",
      "sattriya classical dance history",
    ],
    region: "Assam",
    type: "culture",
  },
  {
    canonicalSlug: "aranmula-kannadi",
    keywords: [
      "aranmula", "kannadi", "metal mirror", "metallurgy", "kerala", "parthasarathy",
      // Malayalam
      "ആറന്മുള", "കണ്ണാടി", "ലോഹക്കണ്ണാടി", "കേരളം",
      // Hindi
      "आरनमुला कन्नाडी", "धातु का दर्पण", "केरल",
    ],
    semanticQuestions: [
      "ആറന്മുള കണ്ണാടിയുടെ പ്രത്യേകത എന്താണ്?",
      "how is the aranmula metal mirror made?",
      "why is aranmula mirror special?",
    ],
    region: "Kerala",
    type: "craft",
  },
  {
    canonicalSlug: "patan-patola",
    keywords: [
      "patan", "patola", "double ikat", "salvi", "silk", "weaving", "gujarat",
      // Gujarati
      "પાટણ", "પટોળા", "સાળવી", "રેશમ", "બેવડી ઈકત", "ગુજરાત",
      // Hindi
      "पाटन पटोला", "डबल इकत", "रेशम बुनाई", "गुजरात",
    ],
    semanticQuestions: [
      "પાટણના પટોળાની વિશેષતા શું છે?",
      "what is patan patola double ikat?",
      "how long does it take to weave a patola saree?",
    ],
    region: "Gujarat",
    type: "craft",
  },
  {
    canonicalSlug: "bishnoi-conservation",
    keywords: [
      "bishnoi", "conservation", "khejri", "blackbuck", "amrita devi", "rajasthan",
      // Hindi
      "बिश्नोई", "खेजड़ी", "अमृता देवी", "काले हिरण", "पर्यावरण संरक्षण", "राजस्थान",
    ],
    semanticQuestions: [
      "बिश्नोई समाज पर्यावरण की रक्षा कैसे करता है?",
      "how do the bishnoi protect desert wildlife?",
      "who was amrita devi bishnoi?",
    ],
    region: "Rajasthan",
    type: "tradition",
  },
  {
    canonicalSlug: "toda-dairy-ritual",
    keywords: [
      "toda", "nilgiri", "dairy temple", "sacred buffalo", "mund", "tamil nadu",
      // Tamil
      "தோடர்", "நீலகிரி", "பால் கோயில்", "எருமை",
    ],
    semanticQuestions: [
      "தோடர் மக்களின் புனித மரபுகள் என்ன?",
      "what is the toda sacred dairy ritual?",
      "toda community nilgiri hills",
    ],
    region: "Tamil Nadu",
    type: "community",
  },
  {
    canonicalSlug: "karesansui-ryoanji",
    keywords: ["karesansui", "ryoanji", "zen", "rock garden", "kyoto", "japan", "meditation"],
    semanticQuestions: [
      "why are there 15 rocks in ryoanji?",
      "what is japanese rock garden zen meditation?",
    ],
    region: "Kyoto, Japan",
    type: "place",
  },
  {
    canonicalSlug: "marrakesh-courtyard",
    keywords: ["marrakesh", "riad", "courtyard", "morocco", "islamic architecture", "zellige"],
    semanticQuestions: [
      "why do riads have open central courtyards?",
      "moroccan traditional courtyard architecture",
    ],
    region: "Marrakesh, Morocco",
    type: "place",
  },
  {
    canonicalSlug: "jerusalem-old-city",
    keywords: ["jerusalem", "old city", "four quarters", "western wall", "holy sepulchre", "al aqsa"],
    semanticQuestions: [
      "what are the four quarters of jerusalem?",
      "sacred geography of jerusalem old city",
    ],
    region: "Jerusalem",
    type: "place",
  },
];

/**
 * Cleans and tokenizes text across scripts (Devanagari, Bengali-Assamese, Tamil, Latin, etc.)
 */
function normalizeQuery(q: string): string {
  return q
    .toLowerCase()
    .replace(/[?|।!.,;:—–"']/g, " ")
    .trim();
}

/**
 * Multilingual Semantic Search Core
 * Resolves multilingual queries to canonical knowledge graph entities.
 */
export function multilingualSearch(
  query: string,
  targetLocale: SupportedLocale = "en"
): MultilingualSearchResult[] {
  const cleanQ = normalizeQuery(query);
  if (!cleanQ || cleanQ.length < 2) return [];

  const tokens = cleanQ.split(/\s+/).filter(Boolean);
  const resultsMap = new Map<string, MultilingualSearchResult>();

  // 1. Direct Question / Semantic Matching
  for (const item of MULTILINGUAL_ALIAS_INDEX) {
    let score = 0;
    let matchedKeyword = "";
    let isDirectQuestion = false;

    // Check full question match
    for (const sq of item.semanticQuestions) {
      const cleanSq = normalizeQuery(sq);
      if (cleanSq.includes(cleanQ) || cleanQ.includes(cleanSq)) {
        score += 80;
        isDirectQuestion = true;
        matchedKeyword = sq;
        break;
      }
    }

    // Check keyword and token matches
    for (const kw of item.keywords) {
      const cleanKw = normalizeQuery(kw);
      if (cleanQ === cleanKw) {
        score += 100;
        matchedKeyword = kw;
      } else if (cleanQ.includes(cleanKw)) {
        score += 50;
        matchedKeyword = kw;
      } else {
        // Token level match
        for (const t of tokens) {
          if (cleanKw === t) {
            score += 30;
            matchedKeyword = kw;
          } else if (cleanKw.includes(t) && t.length > 2) {
            score += 15;
          }
        }
      }
    }

    if (score > 0) {
      const content = getContent({
        entity: item.canonicalSlug,
        language: targetLocale,
      });

      resultsMap.set(item.canonicalSlug, {
        canonicalSlug: item.canonicalSlug,
        matchedEntity: content.localizedName,
        title: content.localizedTitle,
        oneLiner: content.localizedOneLiner,
        summary: content.localizedSummary,
        type: item.type,
        region: content.region,
        confidence: Math.min(1.0, score / 100),
        matchedLocale: targetLocale,
        matchedKeyword,
        isDirectSemanticMatch: isDirectQuestion || score >= 50,
        traditions: content.traditions,
        places: content.places,
      });
    }
  }

  // 2. Scan all Canonical Knowledge Objects as general fallback
  const allObjects = getAllKnowledgeObjects();
  for (const obj of allObjects) {
    if (resultsMap.has(obj.slug)) continue;

    let score = 0;
    const cleanSlug = normalizeQuery(obj.slug);
    const cleanEntity = normalizeQuery(obj.entity);
    const cleanOneLiner = normalizeQuery(obj.oneLiner);

    if (cleanEntity.includes(cleanQ) || cleanSlug.includes(cleanQ)) {
      score += 40;
    } else {
      for (const t of tokens) {
        if (cleanEntity.includes(t) || cleanOneLiner.includes(t)) {
          score += 15;
        }
      }
    }

    // Check alternative names & languages
    for (const alt of obj.culturalDimensions.identity.alternativeNames) {
      if (normalizeQuery(alt).includes(cleanQ)) score += 35;
    }

    if (score > 0) {
      const content = getContent({
        entity: obj.slug,
        language: targetLocale,
      });

      resultsMap.set(obj.slug, {
        canonicalSlug: obj.slug,
        matchedEntity: content.localizedName,
        title: content.localizedTitle,
        oneLiner: content.localizedOneLiner,
        summary: content.localizedSummary,
        type: obj.type,
        region: content.region,
        confidence: Math.min(1.0, score / 100),
        matchedLocale: targetLocale,
        isDirectSemanticMatch: false,
        traditions: content.traditions,
        places: content.places,
      });
    }
  }

  // Sort by confidence score descending
  return Array.from(resultsMap.values()).sort(
    (a, b) => b.confidence - a.confidence
  );
}
