import { supabase } from "@/integrations/supabase/client";

/* ------------------------------------------------------------ wisdom graph ---
 * Traditions, concepts, texts and practices, and how they relate.
 * Every entry and every link carries a named source. Nothing is anonymous,
 * and EKA never presents a relationship as settled truth.
 * -------------------------------------------------------------------------- */

export type WisdomKind = "tradition" | "concept" | "text" | "practice" | "figure";

export const KIND_LABEL: Record<WisdomKind, string> = {
  tradition: "Tradition",
  concept: "Concept",
  text: "Text",
  practice: "Practice",
  figure: "Person",
};

export type WisdomNode = {
  id: string;
  slug: string;
  kind: string;
  title: string;
  tradition: string | null;
  summary: string | null;
  source_name: string | null;
  source_url: string | null;
  license: string | null;
};

export type WisdomEdge = {
  id: string;
  from_node: string;
  to_node: string;
  relation: string;
  note: string | null;
  source_name: string | null;
  source_url: string | null;
};

export type WisdomGraph = { nodes: WisdomNode[]; edges: WisdomEdge[] };

const NODE_COLUMNS = "id, slug, kind, title, tradition, summary, source_name, source_url, license";
const EDGE_COLUMNS = "id, from_node, to_node, relation, note, source_name, source_url";

export async function fetchWisdomGraph(): Promise<WisdomGraph> {
  const [nodes, edges] = await Promise.all([
    supabase.from("wisdom_nodes").select(NODE_COLUMNS).order("sort_order").order("title"),
    supabase.from("wisdom_edges").select(EDGE_COLUMNS),
  ]);
  if (nodes.error) throw nodes.error;
  if (edges.error) throw edges.error;
  return { nodes: (nodes.data ?? []) as WisdomNode[], edges: (edges.data ?? []) as WisdomEdge[] };
}

export type Neighbour = { node: WisdomNode; edge: WisdomEdge; direction: "out" | "in" };

/** Everything directly connected to one entry, with the link that connects them. */
export function neighboursOf(graph: WisdomGraph, nodeId: string): Neighbour[] {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const out: Neighbour[] = [];
  for (const edge of graph.edges) {
    if (edge.from_node === nodeId) {
      const node = byId.get(edge.to_node);
      if (node) out.push({ node, edge, direction: "out" });
    } else if (edge.to_node === nodeId) {
      const node = byId.get(edge.from_node);
      if (node) out.push({ node, edge, direction: "in" });
    }
  }
  return out;
}

export function relationPhrase(relation: string, direction: "out" | "in") {
  const clean = relation.replace(/_/g, " ");
  return direction === "out" ? clean : `${clean} (from)`;
}

export function traditionsIn(graph: WisdomGraph): string[] {
  return Array.from(
    new Set(graph.nodes.map((n) => n.tradition).filter((t): t is string => Boolean(t))),
  ).sort();
}

export function kindsIn(graph: WisdomGraph): string[] {
  return Array.from(new Set(graph.nodes.map((n) => n.kind))).sort();
}
