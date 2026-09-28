import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";
import type { WisdomNode } from "@/lib/wisdom";

/* --------------------------------------------------------------- knowledge ---
 * A contribution is not a status update. It carries a tradition, a named
 * source, and links into the shared knowledge library, so what one person
 * publishes becomes something another tradition can find and learn from.
 * -------------------------------------------------------------------------- */

export const SOURCE_KINDS = [
  { id: "scripture", label: "Scripture or text" },
  { id: "teacher", label: "Teacher or lineage" },
  { id: "book", label: "Book or scholarship" },
  { id: "historical", label: "Historical source" },
  { id: "interpretation", label: "My interpretation" },
  { id: "experience", label: "Personal experience" },
] as const;

export type SourceKind = (typeof SOURCE_KINDS)[number]["id"];

export type KnowledgeDraft = {
  content: string;
  tradition: string;
  topic: string | null;
  communityId: string | null;
  sourceKind: SourceKind;
  sourceName: string;
  sourceUrl: string | null;
  nodeIds: string[];
};

/** Publish a contribution and attach it to the knowledge library in one step. */
export async function publishKnowledge(draft: KnowledgeDraft) {
  const uid = await currentUserId();
  if (!uid) throw new Error("Sign in first.");
  if (draft.content.trim().length < 20)
    throw new Error("Say a little more — at least a couple of sentences.");
  if (!draft.sourceName.trim())
    throw new Error("Name the source, even if it is your own experience.");

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: uid,
      type: "knowledge",
      content: draft.content.trim(),
      topic: draft.topic,
      community_id: draft.communityId,
      tradition: draft.tradition,
      source_kind: draft.sourceKind,
      source_name: draft.sourceName.trim(),
      source_url: draft.sourceUrl?.trim() || null,
    })
    .select("id")
    .single();
  if (error) throw error;

  if (draft.nodeIds.length > 0) {
    const { error: linkError } = await supabase
      .from("post_knowledge_links")
      .insert(draft.nodeIds.map((node_id) => ({ post_id: data.id, node_id, created_by: uid })));
    if (linkError) throw linkError;
  }
  return data.id as string;
}

export type LinkedContribution = {
  post_id: string;
  node_id: string;
  content: string;
  tradition: string | null;
  source_kind: string | null;
  source_name: string | null;
  source_url: string | null;
  created_at: string;
  author: { id: string; display_name: string | null; username: string | null } | null;
};

/** Every contribution attached to a knowledge entry, whatever tradition it came from. */
export async function fetchContributionsForNodes(nodeIds: string[]): Promise<LinkedContribution[]> {
  if (nodeIds.length === 0) return [];
  const { data, error } = await supabase
    .from("post_knowledge_links")
    .select(
      "node_id, post_id, posts!inner(id, content, tradition, source_kind, source_name, source_url, created_at, status, author_id)",
    )
    .in("node_id", nodeIds)
    .limit(200);
  if (error) throw error;

  const rows = (data ?? []).filter((r) => (r.posts as { status: string }).status === "published");
  const authorIds = [...new Set(rows.map((r) => (r.posts as { author_id: string }).author_id))];
  const { data: profiles } = authorIds.length
    ? await supabase.from("profiles").select("id, display_name, username").in("id", authorIds)
    : { data: [] };
  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

  return rows.map((r) => {
    const p = r.posts as unknown as {
      id: string;
      content: string;
      tradition: string | null;
      source_kind: string | null;
      source_name: string | null;
      source_url: string | null;
      created_at: string;
      author_id: string;
    };
    return {
      post_id: p.id,
      node_id: r.node_id,
      content: p.content,
      tradition: p.tradition,
      source_kind: p.source_kind,
      source_name: p.source_name,
      source_url: p.source_url,
      created_at: p.created_at,
      author: byId.get(p.author_id) ?? null,
    };
  });
}

/** Knowledge entries attached to one contribution, for the source panel. */
export async function fetchPostKnowledge(postId: string): Promise<WisdomNode[]> {
  const { data, error } = await supabase
    .from("post_knowledge_links")
    .select(
      "wisdom_nodes!inner(id, slug, kind, title, tradition, summary, source_name, source_url, license)",
    )
    .eq("post_id", postId);
  if (error) throw error;
  return (data ?? []).map((r) => r.wisdom_nodes as unknown as WisdomNode);
}
