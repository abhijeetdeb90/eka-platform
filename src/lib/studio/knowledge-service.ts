// ==============================================================================
// EKA STUDIO — CANONICAL KNOWLEDGE OBJECT SERVICE & VERIFICATION ENGINE
// ==============================================================================

import { supabase } from "@/integrations/supabase/client";
import { logStudioAction } from "./audit";
import type {
  CanonicalKnowledgeObject,
  KnowledgeObjectVersion,
  StudioRole,
  VerificationRecord,
  VerificationStatus,
} from "./types";

// Canonical in-memory seeds representing diverse traditions and epistemic rigor
export const SEED_KNOWLEDGE_OBJECTS: CanonicalKnowledgeObject[] = [
  {
    id: "ko_sandhya_01",
    title: "Evening Sandhyavandanam & Gayatri Contemplation",
    slug: "evening-sandhyavandanam-gayatri",
    summary: "The twilight contemplative ritual connecting breath, solar transitions, and Vedic contemplation.",
    description:
      "Sandhyavandanam is a canonical daily ritual practiced during the three junctions of the sun (dawn, noon, dusk). It integrates Achamana (purification), Pranayama (breath regulation), and Gayatri Japa (silent repetition of the solar illumination mantra from the Rigveda).",
    type: "Practice",
    category: "Contemplative Devotion",
    tradition: "Sanatana Dharma / Vedic",
    religion_worldview: "Hinduism / Advaita Vedanta",
    community: "Smartha & Universal Vedic Adapters",
    geography: {
      origin_region: "Indo-Gangetic Plain",
      cultural_locus: "South Asia",
      country: "India",
      coordinates: [25.3176, 82.9739],
      global_diaspora: true,
    },
    language: {
      liturgical: "Sanskrit",
      vernacular: ["Tamil", "Telugu", "Kannada", "Hindi"],
    },
    time_period: {
      historical_era: "Vedic Era (c. 1500–500 BCE)",
      approx_centuries: "35+ Centuries",
      continuity: "Active Living Practice",
    },
    practice: "Pranayama, Arghya Pradanam, Gayatri Japa",
    person: "Sage Vishwamitra (Drashta)",
    place: "Varanasi Ghats / Riverbank Tirthas",
    sources: ["Rigveda Samhita", "Taittiriya Aranyaka", "Bodhayana Grihyasutra"],
    primary_references: [
      {
        title: "Rigveda Samhita",
        citation: "Mandala 3, Sukta 62, Verse 10",
        access_uri: "urn:cts:sktlit:rigveda.3.62.10",
        author: "Sage Vishwamitra",
        publisher: "Sacred Texts of the East / Oxford Univ Press",
        year: "c. 1200 BCE",
      },
      {
        title: "Taittiriya Aranyaka",
        citation: "Prapathaka 2, Anuvaka 11",
        access_uri: "urn:cts:sktlit:taittiriya.aranyaka.2.11",
        author: "Yajurveda Lineage",
      },
    ],
    evidence: [
      "Epigraphical records in South Indian copper plates detailing morning/evening ritual endowments",
      "Living ritual manual manuscripts from the Sarasvati Mahal Library, Thanjavur",
    ],
    citations: [
      "Rigveda 3.62.10: 'Tat savitur vareṇyaṃ bhargo devasya dhīmahi dhiyo yo naḥ pracodayāt'",
      "Taittiriya Aranyaka 2.11.1 on Arghya offering to solar deities",
    ],
    verification_status: "Expert Verified",
    verification_records: [
      {
        id: "vr_01",
        who: "Prof. S. Ranganathan",
        role: "Verifier",
        when: "2026-09-15T10:00:00Z",
        decision: "approved",
        previous_status: "Under Review",
        new_status: "Expert Verified",
        evidence: "Verified against Taittiriya Aranyaka Critical Edition (Poona)",
        notes: "Accurate distinction preserved between Vedic root and Grihyasutra injunctions.",
      },
    ],
    community_validation: {
      count: 48,
      status: "corroborated",
      confirmations: [
        {
          user_id: "usr_smartha_01",
          community: "Smartha Brahminical",
          confirmed_at: "2026-09-18T14:20:00Z",
          comment: "Reflects living tradition practiced daily in Tamil Nadu & Karnataka.",
        },
      ],
    },
    expert_validation: {
      status: "endorsed",
      reviews: [
        {
          reviewer_id: "rev_sanskrit_01",
          name: "Dr. Vidya Shankar",
          affiliation: "National Sanskrit University, Tirupati",
          status: "endorsed",
          notes: "Textual citations are unimpeachable. Regional variations properly acknowledged.",
          reviewed_at: "2026-09-14T09:30:00Z",
        },
      ],
    },
    interpretation: [
      {
        school: "Advaita Vedanta (Adi Shankara)",
        scholar: "Adi Shankaracharya",
        explanation: "Gayatri is interpreted as the direct contemplation of the non-dual luminous witness-consciousness (Atman identical to Brahman).",
      },
      {
        school: "Arya Samaj",
        scholar: "Swami Dayananda Saraswati",
        explanation: "Universal spiritual practice open to every seeker without ritualistic gatekeeping.",
      },
    ],
    regional_variations: [
      {
        region: "Tamil Nadu",
        community: "Iyer / Smartha",
        variation_details: "Includes Samidhadhanam during Brahmacharya stage and specific Navagraha Tarpana.",
      },
      {
        region: "Bengal",
        community: "Rarhi Brahmin",
        variation_details: "Includes distinct Tantric Sandhya modifications harmonized with Shakta philosophy.",
      },
    ],
    confidence: 0.98,
    provenance: {
      source_name: "Canonical Vedic Texts",
      source_type: "canonical_scripture",
      publisher: "Oxford Sanskrit Series & Motilal Banarsidass",
      author: "Vedic Risis",
      confidence_score: 0.98,
      is_ai_generated: false,
      notes: "Strict human provenance verified. No synthetic AI text passed as scripture.",
    },
    related_objects: ["ko_varanasi_02", "ko_pranayama_03"],
    created_at: "2026-09-01T08:00:00Z",
    updated_at: "2026-09-20T12:00:00Z",
    status: "published",
    is_archived: false,
  },
  {
    id: "ko_varanasi_02",
    title: "Varanasi Ghats & Sacred Ganga Confluence",
    slug: "varanasi-ghats-sacred-ganga",
    summary: "The ancient civilizational riverfront where dawn contemplation, transition rites, and spiritual geography meet.",
    description:
      "Varanasi (Kashi) is one of the world's continuously inhabited sacred urban landscapes. The crescent riverfront of 84 stone ghats functions as an open-air temple where devotion, death contemplation, philosophy, and daily life intermingle.",
    type: "Place",
    category: "Sacred Geography",
    tradition: "Sanatana Dharma / Shaivism / Buddhism",
    religion_worldview: "Pan-Indian Dharmic",
    community: "Kashi Residents & Global Seekers",
    geography: {
      origin_region: "Varanasi, Uttar Pradesh",
      cultural_locus: "Ganges Basin",
      country: "India",
      coordinates: [25.3109, 83.0107],
      global_diaspora: true,
    },
    language: {
      liturgical: "Sanskrit",
      vernacular: ["Bhojpuri", "Hindi"],
    },
    time_period: {
      historical_era: "Antiquity to Contemporary",
      approx_centuries: "30+ Centuries",
      continuity: "Active Living Practice",
    },
    event: "Ganga Aarti, Dev Deepawali, Mahashivratri",
    place: "Dashashwamedh Ghat, Manikarnika Ghat, Assi Ghat",
    sources: ["Kashi Khanda (Skanda Purana)", "Al-Biruni's India (Kitab al-Hind)", "Eck, Diana L. 'Banaras: City of Light'"],
    primary_references: [
      {
        title: "Kashi Khanda",
        citation: "Skanda Purana, Section IV",
        publisher: "Chowkhamba Sanskrit Series",
        year: "c. 12th Century CE",
      },
    ],
    evidence: [
      "Archaeological layers from Rajghat plateau dating back to 9th-8th century BCE",
      "Historical chronicles of Hiuen Tsang (Xuanzang, 7th century CE)",
    ],
    citations: ["Skanda Purana: 'The world is sustained by the light of Kashi, where Shiva resides as eternal peace.'"],
    verification_status: "Published",
    verification_records: [],
    community_validation: {
      count: 112,
      status: "corroborated",
      confirmations: [],
    },
    expert_validation: {
      status: "endorsed",
      reviews: [],
    },
    interpretation: [],
    regional_variations: [],
    confidence: 0.99,
    provenance: {
      source_name: "Kashi Khanda & Historical Archaeology",
      source_type: "academic",
      confidence_score: 0.99,
      is_ai_generated: false,
    },
    related_objects: ["ko_sandhya_01"],
    created_at: "2026-09-02T09:00:00Z",
    updated_at: "2026-09-22T15:00:00Z",
    status: "published",
    is_archived: false,
  },
  {
    id: "ko_qawwali_03",
    title: "Chishti Sufi Sama & Qawwali Mystical Assembly",
    slug: "chishti-sufi-sama-qawwali",
    summary: "The devotional audition and mystical ecstasy practiced in Sufi shrines of South Asia.",
    description:
      "Qawwali is the musical tradition of Sufi devotional poetry originating in the 13th century under Amir Khusrau at the shrine of Nizamuddin Auliya. It serves as a contemplative vehicle (Sama) for spiritual remembrance (Zikr) and divine love.",
    type: "Practice",
    category: "Intangible Heritage",
    tradition: "Chishti Sufism",
    religion_worldview: "Islamic Mysticism / Sufism",
    community: "Chishti Silsila & Qawwal Lineages",
    geography: {
      origin_region: "Delhi / Indo-Persian",
      cultural_locus: "South Asia",
      country: "India / Pakistan",
      coordinates: [28.5916, 77.2415],
      global_diaspora: true,
    },
    language: {
      liturgical: "Arabic / Persian",
      vernacular: ["Urdu", "Punjabi", "Braj Bhasha", "Hindi"],
    },
    time_period: {
      historical_era: "Delhi Sultanate (13th Century CE)",
      approx_centuries: "8 Centuries",
      continuity: "Active Living Practice",
    },
    person: "Hazrat Nizamuddin Auliya & Amir Khusrau",
    place: "Dargah Nizamuddin Auliya, Ajmer Sharif",
    sources: ["Fawa'id al-Fu'ad (Amir Hasan Sijzi)", "Qawwali: Sufi Music of India and Pakistan (Regula Qureshi)"],
    primary_references: [
      {
        title: "Fawa'id al-Fu'ad (Morals for the Heart)",
        citation: "Discourses of Nizamuddin Auliya recorded by Amir Hasan Sijzi",
        year: "1322 CE",
      },
    ],
    evidence: [
      "Continuity of Hereditary Qawwal Bachche lineages traced across 700 years",
      "Historical recordings in the British Library Sound Archive",
    ],
    citations: [
      "Amir Khusrau: 'Chhap tilak sab chheen re mose naina milayike' (You have taken away all my identity with just one glance).",
    ],
    verification_status: "Source Verified",
    verification_records: [],
    community_validation: { count: 64, status: "corroborated", confirmations: [] },
    expert_validation: { status: "endorsed", reviews: [] },
    interpretation: [
      {
        school: "Chishti Silsila",
        explanation: "Sama is permissible under strict conditions of spiritual sincerity, absence of worldly desire, and presence of a spiritual guide.",
      },
    ],
    regional_variations: [],
    confidence: 0.96,
    provenance: {
      source_name: "Chishti Historical Archives & Ethnomusicology",
      source_type: "academic",
      confidence_score: 0.96,
      is_ai_generated: false,
    },
    related_objects: [],
    created_at: "2026-09-05T11:00:00Z",
    updated_at: "2026-09-24T18:00:00Z",
    status: "published",
    is_archived: false,
  },
  {
    id: "ko_bodhgaya_04",
    title: "Bodh Gaya Mahabodhi Tree & Vipassana Meditation",
    slug: "bodh-gaya-mahabodhi-vipassana",
    summary: "The supreme seat of awakening (Vajrasana) where Siddhartha Gautama attained Enlightenment.",
    description:
      "Located by the Falgu (Neranjara) river in Bihar, Bodh Gaya is the foundational spiritual locus of Buddhism. The sacred pipal tree (Ficus religiosa) and surrounding contemplative cloister mark the realization of the Four Noble Truths and Dependent Origination.",
    type: "Place",
    category: "Sacred Geography",
    tradition: "Theravada / Mahayana / Vajrayana",
    religion_worldview: "Buddhism",
    community: "Global Buddhist Sangha",
    geography: {
      origin_region: "Magadha / Bihar",
      cultural_locus: "South Asia",
      country: "India",
      coordinates: [24.6959, 84.9914],
      global_diaspora: true,
    },
    language: {
      liturgical: "Pali / Sanskrit",
      vernacular: ["Hindi", "Tibetan", "Thai", "Sinhalese"],
    },
    time_period: {
      historical_era: "6th-5th Century BCE to Present",
      approx_centuries: "26 Centuries",
      continuity: "Active Living Practice",
    },
    person: "Siddhartha Gautama Buddha",
    place: "Mahabodhi Temple Complex",
    sources: ["Majjhima Nikaya (Ariyapariyesana Sutta)", "Mahavamsa", "UNESCO World Heritage Inscription 1056"],
    primary_references: [
      {
        title: "Ariyapariyesana Sutta (The Noble Search)",
        citation: "Majjhima Nikaya 26",
        publisher: "Pali Text Society",
      },
    ],
    evidence: [
      "Emperor Ashoka's Diamond Throne (Vajrasana) stone inscriptions (c. 250 BCE)",
      "Pillar and balustrade carvings preserved at the site and Indian Museum",
    ],
    citations: ["Dhammapada: 'Hard is birth as a human; harder still is the life of mortals; hard is the hearing of the Dhamma; rare is the arising of Buddhas.'"],
    verification_status: "Published",
    verification_records: [],
    community_validation: { count: 180, status: "corroborated", confirmations: [] },
    expert_validation: { status: "endorsed", reviews: [] },
    interpretation: [],
    regional_variations: [],
    confidence: 0.99,
    provenance: {
      source_name: "Canonical Tipitaka & Archaeological Survey of India",
      source_type: "academic",
      confidence_score: 0.99,
      is_ai_generated: false,
    },
    related_objects: [],
    created_at: "2026-09-08T10:00:00Z",
    updated_at: "2026-09-25T16:00:00Z",
    status: "published",
    is_archived: false,
  },
  {
    id: "ko_chhath_05",
    title: "Chhath Puja: Archaic Solar & Vedic Usha Devotion",
    slug: "chhath-puja-solar-usha-devotion",
    summary: "The four-day riverbank festival of austere fasting, offering gratitude to the setting and rising sun.",
    description:
      "Chhath Puja is an ancient, living Vedic festival celebrated primarily in Bihar, Jharkhand, and Nepal without the mediation of priests. Vratis stand waist-deep in moving water during sunset and sunrise, offering Arghya to Surya (Sun) and Chhathi Maiya (Usha/Pratyusha).",
    type: "Festival",
    category: "Living Community Practice",
    tradition: "Folk Vedic / Regional Dharma",
    religion_worldview: "Sanatana Dharma",
    community: "Bhojpuri, Maithil, Magahi, and Global Diaspora",
    geography: {
      origin_region: "Mithila / Magadh / Purvanchal",
      cultural_locus: "Eastern India & Nepal",
      country: "India",
      coordinates: [25.6127, 85.1589],
      global_diaspora: true,
    },
    language: {
      liturgical: "Bhojpuri / Maithili folk hymns",
      vernacular: ["Bhojpuri", "Maithili", "Magahi", "Hindi"],
    },
    time_period: {
      historical_era: "Antiquity to Present",
      continuity: "Active Living Practice",
    },
    event: "Nahay-Khay, Kharna, Sandhya Arghya, Usha Arghya",
    sources: ["Rigveda solar hymns", "Mahabharata Karna/Kunti legends", "Living Ethnomusicological Archives"],
    primary_references: [
      {
        title: "Rigveda Samhita",
        citation: "Mandala 1, Hymns to Surya and Ushas",
      },
    ],
    evidence: ["Unbroken communal transmission of oral song cycles passed exclusively through matriarchs"],
    citations: ["Folk hymn: 'Kaanche hi baans ke bahangiya, bahangi lachkat jaaye'"],
    verification_status: "Community Verified",
    verification_records: [],
    community_validation: { count: 95, status: "corroborated", confirmations: [] },
    expert_validation: { status: "pending", reviews: [] },
    interpretation: [],
    regional_variations: [],
    confidence: 0.95,
    provenance: {
      source_name: "Community Oral Tradition & Ethnomusicology",
      source_type: "oral_lineage",
      confidence_score: 0.95,
      is_ai_generated: false,
    },
    related_objects: ["ko_varanasi_02"],
    created_at: "2026-09-10T12:00:00Z",
    updated_at: "2026-09-26T14:00:00Z",
    status: "published",
    is_archived: false,
  },
];

// In-memory version history cache
const memoryVersions: Map<string, KnowledgeObjectVersion[]> = new Map();

// Helper to seed initial versions
SEED_KNOWLEDGE_OBJECTS.forEach((obj) => {
  memoryVersions.set(obj.id, [
    {
      id: `ver_${obj.id}_1`,
      knowledge_object_id: obj.id,
      version_number: 1,
      title: obj.title,
      snapshot: JSON.parse(JSON.stringify(obj)),
      diff_summary: "Initial canonical creation with verified provenance.",
      changed_by: "System Genesis",
      change_reason: "Canonical bootstrap",
      created_at: obj.created_at,
    },
  ]);
});

// In-memory working copy
let liveObjects = [...SEED_KNOWLEDGE_OBJECTS];

// Service API Functions
export async function fetchKnowledgeObjects(filter?: {
  type?: string;
  tradition?: string;
  verification_status?: string;
  status?: string;
  query?: string;
}): Promise<CanonicalKnowledgeObject[]> {
  try {
    let q = (supabase as any).from("knowledge_objects").select("*").eq("is_archived", false);
    if (filter?.type && filter.type !== "all") q = q.eq("type", filter.type);
    if (filter?.tradition && filter.tradition !== "all") q = q.eq("tradition", filter.tradition);
    if (filter?.verification_status && filter.verification_status !== "all")
      q = q.eq("verification_status", filter.verification_status);
    if (filter?.status && filter.status !== "all") q = q.eq("status", filter.status);

    const { data, error } = await q.order("updated_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return data as unknown as CanonicalKnowledgeObject[];
    }
  } catch {
    // fallback to in-memory
  }

  return liveObjects.filter((o) => {
    if (o.is_archived) return false;
    if (filter?.type && filter.type !== "all" && o.type !== filter.type) return false;
    if (filter?.tradition && filter.tradition !== "all" && o.tradition !== filter.tradition)
      return false;
    if (
      filter?.verification_status &&
      filter.verification_status !== "all" &&
      o.verification_status !== filter.verification_status
    )
      return false;
    if (filter?.status && filter.status !== "all" && o.status !== filter.status) return false;
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      return (
        o.title.toLowerCase().includes(q) ||
        o.summary.toLowerCase().includes(q) ||
        o.tradition.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q)
      );
    }
    return true;
  });
}

export async function getKnowledgeObjectById(id: string): Promise<CanonicalKnowledgeObject | null> {
  const found = liveObjects.find((o) => o.id === id);
  return found ? JSON.parse(JSON.stringify(found)) : null;
}

export async function saveKnowledgeObject(
  obj: Partial<CanonicalKnowledgeObject> & { title: string },
  actorRole: StudioRole = "Knowledge Editor",
  reason = "Editor update",
): Promise<CanonicalKnowledgeObject> {
  const isNew = !obj.id;
  const id = obj.id || `ko_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  let existingIndex = liveObjects.findIndex((o) => o.id === id);
  let saved: CanonicalKnowledgeObject;

  if (existingIndex >= 0) {
    const prev = liveObjects[existingIndex];
    saved = {
      ...prev,
      ...obj,
      id,
      updated_at: now,
    } as CanonicalKnowledgeObject;
    liveObjects[existingIndex] = saved;
  } else {
    saved = {
      id,
      title: obj.title,
      slug: obj.slug || obj.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      summary: obj.summary || "",
      description: obj.description || "",
      type: obj.type || "Practice",
      category: obj.category || "General",
      tradition: obj.tradition || "Universal",
      religion_worldview: obj.religion_worldview || "Dharmic",
      community: obj.community || "Global",
      geography: obj.geography || {},
      language: obj.language || { vernacular: [] },
      time_period: obj.time_period || { continuity: "Active" },
      sources: obj.sources || [],
      primary_references: obj.primary_references || [],
      evidence: obj.evidence || [],
      citations: obj.citations || [],
      verification_status: obj.verification_status || "Draft",
      verification_records: obj.verification_records || [],
      community_validation: obj.community_validation || { count: 0, status: "pending", confirmations: [] },
      expert_validation: obj.expert_validation || { status: "pending", reviews: [] },
      interpretation: obj.interpretation || [],
      regional_variations: obj.regional_variations || [],
      confidence: obj.confidence ?? 0.85,
      provenance: obj.provenance || {
        source_type: "academic",
        confidence_score: 0.85,
        is_ai_generated: false,
      },
      related_objects: obj.related_objects || [],
      created_at: now,
      updated_at: now,
      status: obj.status || "draft",
      is_archived: false,
    };
    liveObjects.unshift(saved);
  }

  // Version snapshot
  const versions = memoryVersions.get(id) || [];
  const nextVersionNumber = versions.length + 1;
  const versionEntry: KnowledgeObjectVersion = {
    id: `ver_${id}_${nextVersionNumber}`,
    knowledge_object_id: id,
    version_number: nextVersionNumber,
    title: saved.title,
    snapshot: JSON.parse(JSON.stringify(saved)),
    diff_summary: isNew ? "Created object" : reason,
    changed_by: actorRole,
    change_reason: reason,
    created_at: now,
  };
  versions.unshift(versionEntry);
  memoryVersions.set(id, versions);

  // Log to audit log
  await logStudioAction({
    actor_role: actorRole,
    action: isNew ? "create" : "edit",
    target_type: "knowledge_object",
    target_id: saved.id,
    target_title: saved.title,
    details: { version: nextVersionNumber, reason, verification_status: saved.verification_status },
  });

  return saved;
}

export async function updateVerificationStatus(
  id: string,
  newStatus: VerificationStatus,
  decision: "approved" | "rejected" | "disputed" | "status_change",
  notes: string,
  actorRole: StudioRole = "Verifier",
  evidence?: string,
): Promise<CanonicalKnowledgeObject> {
  const obj = await getKnowledgeObjectById(id);
  if (!obj) throw new Error("Knowledge Object not found.");

  const record: VerificationRecord = {
    id: `vr_${Date.now()}`,
    who: actorRole,
    role: actorRole,
    when: new Date().toISOString(),
    decision,
    previous_status: obj.verification_status,
    new_status: newStatus,
    notes,
    ...(evidence ? { evidence } : {}),
  };

  obj.verification_records = [record, ...obj.verification_records];
  obj.verification_status = newStatus;
  if (newStatus === "Published") {
    obj.status = "published";
  } else if (newStatus === "Archived") {
    obj.status = "archived";
    obj.is_archived = true;
  }

  await saveKnowledgeObject(
    obj,
    actorRole,
    `Verification status transition from ${record.previous_status} to ${newStatus}: ${notes}`,
  );

  await logStudioAction({
    actor_role: actorRole,
    action: decision === "rejected" ? "reject" : "verify",
    target_type: "knowledge_object",
    target_id: id,
    target_title: obj.title,
    details: { previous: record.previous_status, next: newStatus, notes, evidence },
  });

  return obj;
}

export async function fetchObjectVersions(objectId: string): Promise<KnowledgeObjectVersion[]> {
  return memoryVersions.get(objectId) || [];
}

export async function restoreObjectVersion(
  objectId: string,
  versionNumber: number,
  actorRole: StudioRole = "Super Admin",
): Promise<CanonicalKnowledgeObject> {
  const versions = memoryVersions.get(objectId) || [];
  const target = versions.find((v) => v.version_number === versionNumber);
  if (!target) throw new Error(`Version ${versionNumber} not found for ${objectId}`);

  const restored = await saveKnowledgeObject(
    {
      ...target.snapshot,
      updated_at: new Date().toISOString(),
    },
    actorRole,
    `Restored to version ${versionNumber} from ${target.created_at}`,
  );

  await logStudioAction({
    actor_role: actorRole,
    action: "restore",
    target_type: "knowledge_object",
    target_id: objectId,
    target_title: restored.title,
    details: { restored_version: versionNumber },
  });

  return restored;
}

export async function archiveKnowledgeObject(
  objectId: string,
  actorRole: StudioRole = "Knowledge Editor",
): Promise<void> {
  const obj = await getKnowledgeObjectById(objectId);
  if (!obj) return;
  obj.is_archived = true;
  obj.status = "archived";
  obj.verification_status = "Archived";
  await saveKnowledgeObject(obj, actorRole, "Archived object");

  await logStudioAction({
    actor_role: actorRole,
    action: "delete",
    target_type: "knowledge_object",
    target_id: objectId,
    target_title: obj.title,
    details: { archive: true },
  });
}
