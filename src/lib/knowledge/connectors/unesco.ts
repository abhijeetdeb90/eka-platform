/**
 * EKA UNESCO Intangible Cultural Heritage (ICH) Connector
 *
 * Ingests institutional heritage documentation from the UNESCO Representative
 * List of the Intangible Cultural Heritage of Humanity and Urgent Safeguarding List.
 *
 * Epistemic Guardrail:
 * UNESCO data is an institutional source (Tier 3).
 * EKA explicitly avoids implying that UNESCO inscription denotes "superiority"
 * or that non-inscribed traditions are "less authentic". Inscription is treated
 * as an institutional documentation record and safeguarding milestone.
 */

export interface UnescoHeritageElement {
  id: string; // e.g. "unesco_ich_01258"
  elementName: string;
  country: string[];
  communities: string[];
  inscriptionYear: number;
  listType: "representative" | "urgent_safeguarding" | "good_safeguarding_practices";
  domain:
    | "oral_traditions"
    | "performing_arts"
    | "social_practices_rituals_festivals"
    | "knowledge_nature_universe"
    | "traditional_craftsmanship";
  summary: string;
  safeguardingMeasures: string[];
  nominationDossierUrl: string;
  institutionalAttribution: string;
}

/**
 * Curated registry of UNESCO Inscribed Intangible Cultural Elements
 */
export const UNESCO_CANONICAL_ELEMENTS: Record<string, UnescoHeritageElement> = {
  unesco_kumbh_mela: {
    id: "unesco_kumbh_mela",
    elementName: "Kumbh Mela",
    country: ["India"],
    communities: ["Naga Babas", "Akharas", "Pilgrims across all Indian states"],
    inscriptionYear: 2017,
    listType: "representative",
    domain: "social_practices_rituals_festivals",
    summary:
      "Kumbh Mela is the largest peaceful congregation of pilgrims on earth, during which participants bathe in sacred rivers to achieve purification from the cycle of rebirth.",
    safeguardingMeasures: [
      "Traditional Akhara transmission",
      "Environmental river flow monitoring",
      "Public sanitation and heritage education",
    ],
    nominationDossierUrl: "https://ich.unesco.org/en/RL/kumbh-mela-01258",
    institutionalAttribution:
      "UNESCO Representative List of the Intangible Cultural Heritage of Humanity (Inscribed 2017, File No. 01258).",
  },
  unesco_vedic_chanting: {
    id: "unesco_vedic_chanting",
    elementName: "Tradition of Vedic Chanting",
    country: ["India"],
    communities: ["Vedic Gurukuls", "Patanjali Shishya Paramparas"],
    inscriptionYear: 2008,
    listType: "representative",
    domain: "oral_traditions",
    summary:
      "Vedic chanting is a living oral tradition preserved for over 3,000 years through strict tonal mnemonic techniques (Pada, Krama, Jata, Ghana-patha) preserving sacred Sanskrit hymns without written distortion.",
    safeguardingMeasures: [
      "Traditional Gurukul oral transmission",
      "Acoustic frequency archival recordings",
      "Lineage elder support programs",
    ],
    nominationDossierUrl: "https://ich.unesco.org/en/RL/tradition-of-vedic-chanting-00062",
    institutionalAttribution:
      "UNESCO Representative List of the Intangible Cultural Heritage of Humanity (Inscribed 2008, File No. 00062).",
  },
  unesco_thatheras_craft: {
    id: "unesco_thatheras_craft",
    elementName: "Traditional brass and copper craft of utensil making among the Thatheras of Jandiala Guru",
    country: ["India"],
    communities: ["Thathera artisan guild of Punjab"],
    inscriptionYear: 2014,
    listType: "representative",
    domain: "traditional_craftsmanship",
    summary:
      "The craft of the Thatheras of Jandiala Guru constitutes the traditional technique of manufacturing brass and copper utensils using manual hammering and temperature-calibrated cooling.",
    safeguardingMeasures: [
      "Guild apprenticeship continuity",
      "Raw material access facilitation",
      "Ergonomic traditional workshop improvements",
    ],
    nominationDossierUrl:
      "https://ich.unesco.org/en/RL/traditional-brass-and-copper-craft-of-utensil-making-among-the-thatheras-of-jandiala-guru-punjab-india-00845",
    institutionalAttribution:
      "UNESCO Representative List of the Intangible Cultural Heritage of Humanity (Inscribed 2014, File No. 00845).",
  },
  unesco_kalbelia: {
    id: "unesco_kalbelia",
    elementName: "Kalbelia folk songs and dances of Rajasthan",
    country: ["India"],
    communities: ["Kalbelia nomadic community"],
    inscriptionYear: 2010,
    listType: "representative",
    domain: "performing_arts",
    summary:
      "Songs and dances of the Kalbelia community are an expression of their traditional way of life as serpent charmers and desert pastoralists, with graceful swirling movements mirroring the movements of a cobra.",
    safeguardingMeasures: [
      "Community youth transmission",
      "Poetic lyrical preservation",
      "Artisan livelihood fair compensation",
    ],
    nominationDossierUrl: "https://ich.unesco.org/en/RL/kalbelia-folk-songs-and-dances-of-rajasthan-00340",
    institutionalAttribution:
      "UNESCO Representative List of the Intangible Cultural Heritage of Humanity (Inscribed 2010, File No. 00340).",
  },
};

/**
 * Retrieves a UNESCO heritage element by ID or searches by name.
 */
export async function fetchUnescoElement(
  queryOrId: string,
): Promise<UnescoHeritageElement | null> {
  const normalized = queryOrId.toLowerCase().replace(/[^a-z0-9]/g, "_");
  if (UNESCO_CANONICAL_ELEMENTS[normalized]) {
    return UNESCO_CANONICAL_ELEMENTS[normalized];
  }

  // Case-insensitive search across canonical elements
  const match = Object.values(UNESCO_CANONICAL_ELEMENTS).find((item) =>
    item.elementName.toLowerCase().includes(queryOrId.toLowerCase()),
  );
  return match ?? null;
}
