// ==============================================================================
// EKA STUDIO — FIRST-CLASS KNOWLEDGE GRAPH RELATIONSHIP ENGINE
// ==============================================================================

import { supabase } from "@/integrations/supabase/client";
import { logStudioAction } from "./audit";
import type { GraphPredicate, KnowledgeRelationship, StudioRole } from "./types";

export const GRAPH_PREDICATES: Array<{ value: GraphPredicate; label: string; description: string }> = [
  { value: "ASSOCIATED_WITH", label: "Associated With", description: "Entity connects or relates to another" },
  { value: "PRACTICED_IN", label: "Practiced In", description: "Tradition or ritual observed in a geographical locus" },
  { value: "BELONGS_TO", label: "Belongs To", description: "Festival, ceremony or scripture belongs to a tradition" },
  { value: "LOCATED_IN", label: "Located In", description: "Community, sacred site or business located in place" },
  { value: "EXPLAINS", label: "Explains", description: "Creator, scholar or lineage explains knowledge object" },
  { value: "SUPPORTS", label: "Supports", description: "Primary source or citation provides evidence for knowledge" },
  { value: "CODIFIED_IN", label: "Codified In", description: "Philosophical practice or precept recorded in canonical text" },
  { value: "CELEBRATED_AT", label: "Celebrated At", description: "Festival occurs at specific sacred locus or season" },
  { value: "OBSERVED_VIA", label: "Observed Via", description: "Festival manifested through specific ritual or practice" },
  { value: "PRESERVES", label: "Preserves", description: "Community or lineage preserves an intangible practice" },
  { value: "DERIVED_FROM", label: "Derived From", description: "Living practice evolved from ancient root text" },
  { value: "DISPUTED_BY", label: "Disputed By", description: "Contrasting theological or hermeneutic interpretation" },
];

export const SEED_RELATIONSHIPS: KnowledgeRelationship[] = [
  {
    id: "rel_01",
    from_id: "person_vishwamitra",
    from_type: "PERSON",
    from_title: "Sage Vishwamitra",
    predicate: "ASSOCIATED_WITH",
    to_id: "ko_sandhya_01",
    to_type: "TRADITION",
    to_title: "Evening Sandhya & Gayatri Meditation",
    confidence: 0.99,
    provenance: {
      source: "Rigveda Samhita Mandala 3 Sukta 62",
      notes: "Canonical seer (Drashta) of the Gayatri mantra.",
    },
    notes: "Primary canonical association verified by Vedic scholars.",
    is_disputed: false,
    created_at: "2026-09-10T10:00:00Z",
    updated_at: "2026-09-10T10:00:00Z",
  },
  {
    id: "rel_02",
    from_id: "ko_sandhya_01",
    from_type: "TRADITION",
    from_title: "Evening Sandhya & Gayatri Meditation",
    predicate: "PRACTICED_IN",
    to_id: "ko_varanasi_02",
    to_type: "PLACE",
    to_title: "Varanasi Ghats & Sacred Ganga",
    confidence: 0.98,
    provenance: {
      source: "Skanda Purana Kashi Khanda & living ethnography",
      notes: "Centuries of continuous riverbank dawn and dusk sandhya japa.",
    },
    notes: "Living tradition observed daily at Assi and Dashashwamedh Ghats.",
    is_disputed: false,
    created_at: "2026-09-12T11:00:00Z",
    updated_at: "2026-09-12T11:00:00Z",
  },
  {
    id: "rel_03",
    from_id: "ko_chhath_05",
    from_type: "FESTIVAL",
    from_title: "Chhath Puja Solar Devotion",
    predicate: "BELONGS_TO",
    to_id: "trad_folk_vedic",
    to_type: "TRADITION",
    to_title: "Vedic Solar Folkways",
    confidence: 0.97,
    provenance: {
      source: "Rigveda Solar Hymns & Mithila traditions",
      notes: "Direct archaic continuity of solar and dawn worship.",
    },
    notes: "Purohit-free community ritual unbroken across millennia.",
    is_disputed: false,
    created_at: "2026-09-14T08:30:00Z",
    updated_at: "2026-09-14T08:30:00Z",
  },
  {
    id: "rel_04",
    from_id: "comm_mithila",
    from_type: "COMMUNITY",
    from_title: "Maithil & Bhojpuri Cultural Community",
    predicate: "LOCATED_IN",
    to_id: "geo_gangetic_plain",
    to_type: "GEOGRAPHY",
    to_title: "Indo-Gangetic Basin",
    confidence: 1.0,
    provenance: {
      source: "Census & Anthropological Survey of India",
      notes: "Cultural and linguistic core region.",
    },
    notes: "Geographic homeland preserving Chhath and Madhubani traditions.",
    is_disputed: false,
    created_at: "2026-09-15T09:00:00Z",
    updated_at: "2026-09-15T09:00:00Z",
  },
  {
    id: "rel_05",
    from_id: "ko_bodhgaya_04",
    from_type: "PLACE",
    from_title: "Bodh Gaya Mahabodhi Tree",
    predicate: "ASSOCIATED_WITH",
    to_id: "pilgrimage_buddhist_circuit",
    to_type: "PILGRIMAGE",
    to_title: "Great Buddhist Eight-Holy-Places Circuit",
    confidence: 1.0,
    provenance: {
      source: "Mahaparinibbana Sutta & UNESCO Inscription",
      notes: "One of four essential pilgrimage sites commanded by the Buddha.",
    },
    notes: "Locus of Enlightenment and universal contemplative destination.",
    is_disputed: false,
    created_at: "2026-09-16T12:00:00Z",
    updated_at: "2026-09-16T12:00:00Z",
  },
  {
    id: "rel_06",
    from_id: "biz_banaras_handloom",
    from_type: "BUSINESS",
    from_title: "Varanasi Silk Weaver Artisan Guild",
    predicate: "LOCATED_IN",
    to_id: "ko_varanasi_02",
    to_type: "PLACE",
    to_title: "Varanasi (Madanpura & Kotwa)",
    confidence: 0.99,
    provenance: {
      source: "Geographical Indications Registry (GI Tag: Banaras Brocades)",
      notes: "Heritage artisan enterprise located in Varanasi.",
    },
    notes: "Generational weavers producing sacred pit-loom textiles.",
    is_disputed: false,
    created_at: "2026-09-18T14:00:00Z",
    updated_at: "2026-09-18T14:00:00Z",
  },
  {
    id: "rel_07",
    from_id: "creator_pandit_shastri",
    from_type: "CREATOR",
    from_title: "Pt. Ramesh Shastri (Vedic Scholar)",
    predicate: "EXPLAINS",
    to_id: "ko_sandhya_01",
    to_type: "KNOWLEDGE",
    to_title: "Evening Sandhya & Gayatri Meditation",
    confidence: 0.96,
    provenance: {
      source: "EKA Audio Discourses & Sanskrit University Fellowship",
      notes: "Creator video & text explanation with complete phonetic chants.",
    },
    notes: "Verified practitioner audio module with full provenance.",
    is_disputed: false,
    created_at: "2026-09-20T16:00:00Z",
    updated_at: "2026-09-20T16:00:00Z",
  },
  {
    id: "rel_08",
    from_id: "src_rigveda",
    from_type: "SOURCE",
    from_title: "Rigveda Samhita (Mandala 3, 62.10)",
    predicate: "SUPPORTS",
    to_id: "ko_sandhya_01",
    to_type: "KNOWLEDGE",
    to_title: "Evening Sandhya & Gayatri Meditation",
    confidence: 1.0,
    provenance: {
      source: "Max Müller Critical Edition & Poona Vaidika Samshodhana Mandala",
      notes: "Primary scriptural root citation.",
    },
    notes: "Unimpeachable primary scripture verification.",
    is_disputed: false,
    created_at: "2026-09-21T09:00:00Z",
    updated_at: "2026-09-21T09:00:00Z",
  },
];

let liveRelationships = [...SEED_RELATIONSHIPS];

export async function fetchRelationships(filter?: {
  predicate?: string;
  from_type?: string;
  to_type?: string;
  query?: string;
}): Promise<KnowledgeRelationship[]> {
  try {
    let q = supabase.from("knowledge_relationships").select("*");
    if (filter?.predicate && filter.predicate !== "all") q = q.eq("predicate", filter.predicate);
    if (filter?.from_type && filter.from_type !== "all") q = q.eq("from_type", filter.from_type);
    if (filter?.to_type && filter.to_type !== "all") q = q.eq("to_type", filter.to_type);

    const { data, error } = await q.order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return data as unknown as KnowledgeRelationship[];
    }
  } catch {
    // fallback to memory
  }

  return liveRelationships.filter((r) => {
    if (filter?.predicate && filter.predicate !== "all" && r.predicate !== filter.predicate)
      return false;
    if (filter?.from_type && filter.from_type !== "all" && r.from_type !== filter.from_type)
      return false;
    if (filter?.to_type && filter.to_type !== "all" && r.to_type !== filter.to_type)
      return false;
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      return (
        r.from_title?.toLowerCase().includes(q) ||
        r.to_title?.toLowerCase().includes(q) ||
        r.predicate.toLowerCase().includes(q) ||
        r.notes?.toLowerCase().includes(q)
      );
    }
    return true;
  });
}

export async function saveRelationship(
  rel: Partial<KnowledgeRelationship> & {
    from_id: string;
    from_type: string;
    predicate: GraphPredicate;
    to_id: string;
    to_type: string;
  },
  actorRole: StudioRole = "Knowledge Editor",
): Promise<KnowledgeRelationship> {
  const isNew = !rel.id;
  const id = rel.id || `rel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const saved: KnowledgeRelationship = {
    id,
    from_id: rel.from_id,
    from_type: rel.from_type,
    from_title: rel.from_title || rel.from_id,
    predicate: rel.predicate,
    to_id: rel.to_id,
    to_type: rel.to_type,
    to_title: rel.to_title || rel.to_id,
    confidence: rel.confidence ?? 0.95,
    provenance: rel.provenance || { notes: "Manually registered in Studio" },
    notes: rel.notes || "",
    is_disputed: Boolean(rel.is_disputed),
    created_at: rel.created_at || now,
    updated_at: now,
  };

  const idx = liveRelationships.findIndex((r) => r.id === id);
  if (idx >= 0) {
    liveRelationships[idx] = saved;
  } else {
    liveRelationships.unshift(saved);
  }

  await logStudioAction({
    actor_role: actorRole,
    action: isNew ? "create" : "edit",
    target_type: "relationship",
    target_id: id,
    target_title: `${saved.from_title} —[${saved.predicate}]→ ${saved.to_title}`,
    details: {
      from: saved.from_id,
      predicate: saved.predicate,
      to: saved.to_id,
      confidence: saved.confidence,
    },
  });

  return saved;
}

export async function deleteRelationship(
  id: string,
  actorRole: StudioRole = "Knowledge Editor",
): Promise<void> {
  const target = liveRelationships.find((r) => r.id === id);
  liveRelationships = liveRelationships.filter((r) => r.id !== id);

  await logStudioAction({
    actor_role: actorRole,
    action: "delete",
    target_type: "relationship",
    target_id: id,
    target_title: target ? `${target.from_title} → ${target.to_title}` : id,
    details: { deleted: true },
  });
}

// Convert relationships into @xyflow/react node and edge layout structures
export function convertToGraphFlow(relationships: KnowledgeRelationship[]) {
  const nodeMap = new Map<string, { id: string; label: string; type: string }>();

  relationships.forEach((r) => {
    if (!nodeMap.has(r.from_id)) {
      nodeMap.set(r.from_id, {
        id: r.from_id,
        label: r.from_title || r.from_id,
        type: r.from_type,
      });
    }
    if (!nodeMap.has(r.to_id)) {
      nodeMap.set(r.to_id, {
        id: r.to_id,
        label: r.to_title || r.to_id,
        type: r.to_type,
      });
    }
  });

  // Calculate clean circular/grid coordinates
  const nodes = Array.from(nodeMap.values()).map((node, index, arr) => {
    const angle = (index / arr.length) * 2 * Math.PI;
    const radius = 280;
    const x = Math.round(350 + radius * Math.cos(angle));
    const y = Math.round(280 + radius * Math.sin(angle));

    let color = "#3b82f6"; // default blue
    if (node.type === "PERSON" || node.type === "CREATOR") color = "#f97316"; // orange
    if (node.type === "PLACE" || node.type === "GEOGRAPHY") color = "#10b981"; // emerald
    if (node.type === "TRADITION") color = "#8b5cf6"; // purple
    if (node.type === "FESTIVAL") color = "#ec4899"; // pink
    if (node.type === "SOURCE") color = "#eab308"; // yellow
    if (node.type === "BUSINESS") color = "#06b6d4"; // cyan

    return {
      id: node.id,
      position: { x, y },
      data: { label: node.label, type: node.type },
      style: {
        background: "var(--card)",
        border: `2px solid ${color}`,
        borderRadius: "14px",
        padding: "12px 18px",
        fontSize: "12px",
        fontWeight: "600",
        color: "var(--foreground)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        width: 180,
        textAlign: "center" as const,
      },
    };
  });

  const edges = relationships.map((r) => ({
    id: r.id,
    source: r.from_id,
    target: r.to_id,
    label: r.predicate.replace(/_/g, " "),
    animated: r.predicate === "EXPLAINS" || r.predicate === "SUPPORTS",
    style: {
      stroke: r.is_disputed ? "#ef4444" : "#a8a29e",
      strokeWidth: 2,
    },
    labelStyle: {
      fill: "#78716c",
      fontWeight: 500,
      fontSize: 10,
    },
  }));

  return { nodes, edges };
}
