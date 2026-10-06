/**
 * ==============================================================================
 * EKA LOCAL KNOWLEDGE RETRIEVAL LAYER — QUERY CLASSIFIER
 * ==============================================================================
 * Zero-token, deterministic classification of cultural user queries.
 * Identifies domain, intent, entities, and keywords in <1ms without LLM latency.
 * ==============================================================================
 */

import { type EkaDomain, type EkaIntent, type QueryClassification } from "./types";

const STOP_WORDS = new Set([
  "a", "an", "the", "in", "on", "at", "to", "for", "of", "with", "by", "from",
  "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
  "do", "does", "did", "how", "what", "why", "when", "where", "who", "which",
  "can", "could", "would", "should", "tell", "me", "about", "please", "explain"
]);

const DOMAIN_PATTERNS: Array<{ domain: EkaDomain; regex: RegExp }> = [
  {
    domain: "Festivals & Observances",
    regex: /\b(festival|observance|diwali|deepavali|holi|navratri|durga|kali puja|onam|pongal|bihu|bohag|ramadan|eid|easter|christmas|yom kippur|pesach|vesak|paryushan|guru nanak|baisakhi|losar|celebrat|vrata|fasting)\b/i,
  },
  {
    domain: "Craft & Metallurgy",
    regex: /\b(aranmula|kannadi|mirror|metal|metallurgy|bronze|alloy|bell metal|craft|handicraft|pottery|terracotta|woodcarving|artisan)\b/i,
  },
  {
    domain: "Clothing & Textiles",
    regex: /\b(patola|patan|sari|saree|ikat|weaving|weaver|gamusa|shawl|textile|garment|silk|loom|khadi|turban)\b/i,
  },
  {
    domain: "Philosophy & Ethics",
    regex: /\b(philosophy|ethics|moral|dharma|karma|ahimsa|bishnoi|29 rules|jambheshwar|advaita|vedanta|sufism|theology|worldview|cosmology|values)\b/i,
  },
  {
    domain: "Art & Architecture",
    regex: /\b(architecture|temple|mosque|church|stupa|synagogue|gurdwara|monastery|garden|ryoan-ji|ryoanji|riad|courtyard|sculpture|fresco|mandapa|gopuram|shikhara)\b/i,
  },
  {
    domain: "Languages & Scripts",
    regex: /\b(language|script|dialect|mother tongue|hindi|tamil|bengali|sanskrit|telugu|kannada|malayalam|marathi|gujarati|punjabi|urdu|assamese|odia|brahmi|devanagari)\b/i,
  },
  {
    domain: "Rituals & Samskaras",
    regex: /\b(ritual|samskara|puja|aarti|havan|homa|darshan|prasad|yajna|baptism|communion|eucharist|nikah|aqiqah|marriage|funeral|cremation|initiation|toda|buffalo dairy)\b/i,
  },
  {
    domain: "Food & Culinary Heritage",
    regex: /\b(food|cuisine|culinary|prasad|bhog|feast|traditional dish|sweet|recipe|fermentation|cooking|diet|fasting food)\b/i,
  },
  {
    domain: "Music & Dance",
    regex: /\b(music|dance|classical dance|bharatanatyam|kathak|odissi|kuchipudi|kathakali|manipuri|mohinattam|sattriya|carnatic|hindustani|raga|tala|folk song|theatre|bhaona)\b/i,
  },
  {
    domain: "Community & Guilds",
    regex: /\b(community|guild|vishwakarma|lineage|clan|tribe|indigenous|custodians|toda|bishnoi|sattra|monks|pastoralist)\b/i,
  },
  {
    domain: "Sacred Geography",
    regex: /\b(pilgrimage|tirth|sacred site|sacred river|ganga|yamuna|kaveri|narmada|varanasi|kashi|jerusalem|mecca|medina|majuli|thiruvannamalai|holy city|mountain)\b/i,
  },
  {
    domain: "Sacred Texts",
    regex: /\b(text|scripture|veda|upanishad|gita|bhagavad|quran|qur'an|bible|tanakh|torah|guru granth|tripiṭaka|agama|purana|verse|hymn)\b/i,
  },
];

const INTENT_PATTERNS: Array<{ intent: EkaIntent; regex: RegExp }> = [
  {
    intent: "regional_variation",
    regex: /\b(differ|difference|vary|variat|across regions|regional|tamil nadu vs|bengal vs|how does .* differ|state-wise)\b/i,
  },
  {
    intent: "meaning",
    regex: /\b(significance|meaning|signify|deeper meaning|symbol|symbolism|why is .* important|what does .* mean|importance|purpose)\b/i,
  },
  {
    intent: "origin",
    regex: /\b(origin|history|roots|where did|who founded|started|ancient|antiquity|historical era|how did .* start)\b/i,
  },
  {
    intent: "practice",
    regex: /\b(practice|how to|how do people|steps|procedure|observance|ritual practice|guidelines|customs|performed)\b/i,
  },
  {
    intent: "custodians",
    regex: /\b(who practices|who are the|custodians|artisans|guild|lineage holders|preserves|families of)\b/i,
  },
  {
    intent: "visitor_guidance",
    regex: /\b(visit|visitor|travel|etiquette|rules for|dress code|how to experience|sacred space rules)\b/i,
  },
  {
    intent: "sources",
    regex: /\b(source|citation|reference|scripture reference|textual basis|documented in)\b/i,
  },
  {
    intent: "comparison",
    regex: /\b(compare|comparison|versus|vs|similar to|contrast)\b/i,
  },
  {
    intent: "philosophy",
    regex: /\b(philosophy|teachings|worldview|theology|spiritual concept|core philosophy)\b/i,
  },
];

export const ENTITY_TRADITION_MAP: Record<string, string[]> = {
  Diwali: ["Hinduism", "Jainism", "Sikhism", "Hindu"],
  Deepavali: ["Hinduism", "Jainism", "Sikhism", "Hindu"],
  Holi: ["Hinduism", "Hindu"],
  Navratri: ["Hinduism", "Hindu"],
  "Durga Puja": ["Hinduism", "Hindu", "Bengal"],
  "Kali Puja": ["Hinduism", "Hindu", "Bengal"],
  Ramadan: ["Islam", "Muslim"],
  Eid: ["Islam", "Muslim"],
  Christmas: ["Christianity", "Christian"],
  Easter: ["Christianity", "Christian"],
  "Aranmula Kannadi": ["Hinduism", "Hindu", "India"],
  "Patan Patola": ["Hinduism", "Jainism", "India"],
  "Bishnoi 29 Rules": ["Hinduism", "Indigenous", "India"],
  Bishnoi: ["Hinduism", "Indigenous", "India"],
  "Ryoan-ji": ["Buddhism", "East Asian"],
  "Majuli Sattras": ["Hinduism", "Neo-Vaishnavism"],
  Bhaona: ["Hinduism", "Neo-Vaishnavism"],
  Gamusa: ["Hinduism", "Assam"],
  "Bohag Bihu": ["Hinduism", "Assam"],
  "Toda Buffalo Dairy": ["Indigenous & Tribal Traditions", "Indigenous"],
  Toda: ["Indigenous & Tribal Traditions", "Indigenous"],
  "Marrakesh Riad": ["Islam", "Middle East"],
  "Jerusalem Old City": ["Judaism", "Christianity", "Islam"],
};

export const KNOWN_ENTITIES = [
  ...Object.keys(ENTITY_TRADITION_MAP),
  "Hindi", "Tamil", "Sanskrit", "Bengali", "Telugu", "Kannada", "Malayalam",
  "Puja", "Aarti", "Havan", "Prasad", "Pilgrimage", "Vrata", "Fast",
];

export function getAssociatedTraditions(entity: string): string[] {
  return ENTITY_TRADITION_MAP[entity] || [];
}

/**
 * Classifies a user query into domain, intent, entities, and keywords.
 */
export function classifyQuery(query: string): QueryClassification {
  const normalized = query.trim().toLowerCase();

  // 1. Detect Domain
  let domain: EkaDomain = "General Culture";
  for (const item of DOMAIN_PATTERNS) {
    if (item.regex.test(query)) {
      domain = item.domain;
      break;
    }
  }

  // 2. Detect Intent
  let intent: EkaIntent = "general";
  for (const item of INTENT_PATTERNS) {
    if (item.regex.test(query)) {
      intent = item.intent;
      break;
    }
  }
  // Default fallback for questions like "What is..."
  if (intent === "general" && /what is|why is|explain/i.test(query)) {
    intent = "meaning";
  }

  // 3. Detect Entities
  const detectedEntities: string[] = [];
  for (const entity of KNOWN_ENTITIES) {
    const pattern = new RegExp(`\\b${entity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (pattern.test(query)) {
      detectedEntities.push(entity);
    }
  }

  // 4. Extract Keywords
  const words = normalized
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const uniqueKeywords = Array.from(new Set(words));

  return {
    originalQuery: query,
    domain,
    intent,
    detectedEntities,
    keywords: uniqueKeywords,
    confidence: detectedEntities.length > 0 ? 0.95 : 0.8,
  };
}
