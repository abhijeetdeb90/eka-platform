// ==============================================================================
// EKA STUDIO — HIERARCHICAL TAXONOMY ENGINE (KNOW-003)
// ==============================================================================

import { supabase } from "@/integrations/supabase/client";
import { logStudioAction } from "./audit";
import type { StudioRole, TaxonomyNode } from "./types";

export const SEED_TAXONOMY_NODES: TaxonomyNode[] = [
  // Root Culture
  {
    id: "tax_culture",
    parent_id: null,
    name: "Culture",
    slug: "culture",
    kind: "culture",
    description: "Civilizational, continental, and regional cultural matrices.",
    sort_order: 1,
    meta: {},
  },
  {
    id: "tax_south_asia",
    parent_id: "tax_culture",
    name: "South Asia",
    slug: "south-asia",
    kind: "culture",
    description: "Indo-Gangetic, Himalayan, Deccan, and Coastal cultural sub-regions.",
    sort_order: 1,
    meta: {},
  },
  {
    id: "tax_india",
    parent_id: "tax_south_asia",
    name: "India",
    slug: "india",
    kind: "geography",
    description: "The Republic of India and historic civilizational Bharatvarsha.",
    sort_order: 1,
    meta: { iso: "IN" },
  },
  {
    id: "tax_tamil_nadu",
    parent_id: "tax_india",
    name: "Tamil Nadu",
    slug: "tamil-nadu",
    kind: "geography",
    description: "Dravidian sacred temple architecture, classical Carnatic music, and Sangam literature.",
    sort_order: 1,
    meta: { state_code: "TN" },
  },
  {
    id: "tax_assam",
    parent_id: "tax_india",
    name: "Assam",
    slug: "assam",
    kind: "geography",
    description: "Brahmaputra valley sacred sattras, Kamakhya Shakta pitha, and Bihu traditions.",
    sort_order: 2,
    meta: { state_code: "AS" },
  },
  {
    id: "tax_maharashtra",
    parent_id: "tax_india",
    name: "Maharashtra",
    slug: "maharashtra",
    kind: "geography",
    description: "Warkari Vithoba pilgrimage, saint-poets (Jnaneshwar, Tukaram), and Western Ghat shrines.",
    sort_order: 3,
    meta: { state_code: "MH" },
  },

  // Root Traditions
  {
    id: "tax_traditions",
    parent_id: null,
    name: "Traditions",
    slug: "traditions",
    kind: "tradition",
    description: "Epistemic systems, spiritual paths, philosophies, and lineages.",
    sort_order: 2,
    meta: {},
  },
  {
    id: "tax_religious",
    parent_id: "tax_traditions",
    name: "Religious",
    slug: "religious",
    kind: "tradition",
    description: "Formal theological, monastic, and canonical scriptural traditions.",
    sort_order: 1,
    meta: {},
  },
  {
    id: "tax_folk",
    parent_id: "tax_traditions",
    name: "Folk",
    slug: "folk",
    kind: "tradition",
    description: "Oral transmission, agricultural calendar festivals, and local nature devotions.",
    sort_order: 2,
    meta: {},
  },
  {
    id: "tax_regional",
    parent_id: "tax_traditions",
    name: "Regional",
    slug: "regional",
    kind: "tradition",
    description: "Specific river-valley, desert, and mountain cultural adaptations.",
    sort_order: 3,
    meta: {},
  },
  {
    id: "tax_community",
    parent_id: "tax_traditions",
    name: "Community",
    slug: "community",
    kind: "tradition",
    description: "Tribal, artisan guild, linguistic, and jati-specific living customs.",
    sort_order: 4,
    meta: {},
  },
  {
    id: "tax_contemporary",
    parent_id: "tax_traditions",
    name: "Contemporary",
    slug: "contemporary",
    kind: "tradition",
    description: "Modern contemplative, interfaith, mindfulness, and diaspora reinterpretations.",
    sort_order: 5,
    meta: {},
  },

  // Root Intangible Heritage
  {
    id: "tax_intangible",
    parent_id: null,
    name: "Intangible Cultural Heritage",
    slug: "intangible-heritage",
    kind: "heritage",
    description: "Music, chant, traditional crafts, sacred foods, and oral memory.",
    sort_order: 3,
    meta: {},
  },
  {
    id: "tax_chant",
    parent_id: "tax_intangible",
    name: "Sacred Chant & Hymnody",
    slug: "sacred-chant",
    kind: "heritage",
    description: "Vedic chanting, Dhrupad, Qawwali, Gregorian, and Gurbani Kirtan.",
    sort_order: 1,
    meta: {},
  },
  {
    id: "tax_textiles",
    parent_id: "tax_intangible",
    name: "Sacred Textiles & Weaving",
    slug: "sacred-textiles",
    kind: "heritage",
    description: "Varanasi brocades, Kanchipuram silk, Thangka silk mounts, and Khadi.",
    sort_order: 2,
    meta: {},
  },
];

let liveTaxonomy: TaxonomyNode[] = [...SEED_TAXONOMY_NODES];

export function buildTaxonomyTree(flatNodes: TaxonomyNode[]): TaxonomyNode[] {
  const nodeMap = new Map<string, TaxonomyNode>();
  flatNodes.forEach((node) => nodeMap.set(node.id, { ...node, children: [] }));

  const roots: TaxonomyNode[] = [];
  nodeMap.forEach((node) => {
    if (node.parent_id && nodeMap.has(node.parent_id)) {
      const parent = nodeMap.get(node.parent_id)!;
      parent.children = parent.children || [];
      parent.children.push(node);
      parent.children.sort((a, b) => a.sort_order - b.sort_order);
    } else {
      roots.push(node);
    }
  });

  return roots.sort((a, b) => a.sort_order - b.sort_order);
}

export async function fetchTaxonomyTree(): Promise<TaxonomyNode[]> {
  try {
    const { data, error } = await (supabase as any).from("taxonomy_nodes").select("*").order("sort_order");
    if (!error && data && data.length > 0) {
      return buildTaxonomyTree(data as unknown as TaxonomyNode[]);
    }
  } catch {
    // fallback
  }

  return buildTaxonomyTree(liveTaxonomy);
}

export async function fetchFlatTaxonomy(): Promise<TaxonomyNode[]> {
  return [...liveTaxonomy];
}

export async function saveTaxonomyNode(
  node: Partial<TaxonomyNode> & { name: string; kind: TaxonomyNode["kind"] },
  actorRole: StudioRole = "Knowledge Editor",
): Promise<TaxonomyNode> {
  const isNew = !node.id;
  const id = node.id || `tax_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const saved: TaxonomyNode = {
    id,
    parent_id: node.parent_id || null,
    name: node.name,
    slug: node.slug || node.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    kind: node.kind,
    description: node.description || "",
    sort_order: node.sort_order ?? liveTaxonomy.length + 1,
    meta: node.meta || {},
    created_at: node.created_at || now,
    updated_at: now,
  };

  const idx = liveTaxonomy.findIndex((n) => n.id === id);
  if (idx >= 0) {
    liveTaxonomy[idx] = saved;
  } else {
    liveTaxonomy.push(saved);
  }

  await logStudioAction({
    actor_role: actorRole,
    action: isNew ? "create" : "edit",
    target_type: "taxonomy",
    target_id: id,
    target_title: saved.name,
    details: { parent_id: saved.parent_id, kind: saved.kind },
  });

  return saved;
}

export async function deleteTaxonomyNode(
  id: string,
  actorRole: StudioRole = "Knowledge Editor",
): Promise<void> {
  // Cascading removal of descendants
  const toDelete = new Set<string>([id]);
  let added = true;
  while (added) {
    added = false;
    liveTaxonomy.forEach((n) => {
      if (n.parent_id && toDelete.has(n.parent_id) && !toDelete.has(n.id)) {
        toDelete.add(n.id);
        added = true;
      }
    });
  }

  const target = liveTaxonomy.find((n) => n.id === id);
  liveTaxonomy = liveTaxonomy.filter((n) => !toDelete.has(n.id));

  await logStudioAction({
    actor_role: actorRole,
    action: "delete",
    target_type: "taxonomy",
    target_id: id,
    target_title: target?.name || id,
    details: { deleted_count: toDelete.size },
  });
}
