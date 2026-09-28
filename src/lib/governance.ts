import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";

/* ------------------------------------------------------------- governance ---
 * Communities hold the standards for their own space. Every action a
 * community steward takes is written to the shared moderation record, so the
 * history is auditable rather than invisible.
 * -------------------------------------------------------------------------- */

export type CommunitySummary = {
  id: string;
  slug: string;
  name: string;
  description: string;
  rules: string | null;
  member_count: number;
  created_by: string | null;
};

export type Steward = {
  user_id: string;
  role: string;
  display_name: string | null;
  username: string | null;
};

export type GovernedPost = {
  id: string;
  content: string;
  status: string;
  created_at: string;
  author_id: string;
  author: string;
  reports: number;
};

export type ActionRow = {
  id: string;
  action: string;
  rung: string | null;
  notes: string | null;
  created_at: string;
  target_id: string | null;
};

export async function fetchMyGovernedCommunities(): Promise<CommunitySummary[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const [mine, owned] = await Promise.all([
    supabase.from("community_members").select("community_id, role").eq("user_id", uid),
    supabase.from("communities").select("id").eq("created_by", uid),
  ]);
  const ids = new Set<string>();
  for (const m of mine.data ?? []) {
    if (["owner", "admin", "moderator"].includes(m.role)) ids.add(m.community_id);
  }
  for (const c of owned.data ?? []) ids.add(c.id);
  if (ids.size === 0) return [];
  const { data } = await supabase
    .from("communities")
    .select("id, slug, name, description, rules, member_count, created_by")
    .in("id", [...ids]);
  return (data ?? []) as CommunitySummary[];
}

export async function fetchCommunityBySlug(slug: string): Promise<CommunitySummary | null> {
  const { data } = await supabase
    .from("communities")
    .select("id, slug, name, description, rules, member_count, created_by")
    .eq("slug", slug)
    .maybeSingle();
  return (data as CommunitySummary) ?? null;
}

export async function fetchStewards(communityId: string): Promise<Steward[]> {
  const { data } = await supabase
    .from("community_members")
    .select("user_id, role")
    .eq("community_id", communityId)
    .in("role", ["owner", "admin", "moderator"]);
  const rows = data ?? [];
  if (rows.length === 0) return [];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, username")
    .in(
      "id",
      rows.map((r) => r.user_id),
    );
  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
  return rows.map((r) => ({
    user_id: r.user_id,
    role: r.role,
    display_name: byId.get(r.user_id)?.display_name ?? null,
    username: byId.get(r.user_id)?.username ?? null,
  }));
}

export async function fetchCommunityPosts(communityId: string): Promise<GovernedPost[]> {
  const { data } = await supabase
    .from("posts")
    .select("id, content, status, created_at, author_id")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false })
    .limit(60);
  const rows = data ?? [];
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const [profiles, reports] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, username")
      .in(
        "id",
        rows.map((r) => r.author_id),
      ),
    supabase.from("content_reports").select("post_id").in("post_id", ids),
  ]);
  const byId = new Map((profiles.data ?? []).map((p) => [p.id, p]));
  const reportCount = new Map<string, number>();
  for (const r of reports.data ?? []) {
    if (r.post_id) reportCount.set(r.post_id, (reportCount.get(r.post_id) ?? 0) + 1);
  }
  return rows.map((r) => ({
    ...r,
    author: byId.get(r.author_id)?.display_name ?? byId.get(r.author_id)?.username ?? "A member",
    reports: reportCount.get(r.id) ?? 0,
  }));
}

export async function fetchCommunityActions(communityId: string): Promise<ActionRow[]> {
  const { data: posts } = await supabase.from("posts").select("id").eq("community_id", communityId);
  const ids = (posts ?? []).map((p) => p.id);
  if (ids.length === 0) return [];
  const { data } = await supabase
    .from("moderation_actions")
    .select("id, action, rung, notes, created_at, target_id")
    .in("target_id", ids)
    .order("created_at", { ascending: false })
    .limit(40);
  return (data ?? []) as ActionRow[];
}

/** Hide or restore a contribution, and record why. */
export async function setPostVisibility(postId: string, hidden: boolean, notes: string) {
  const uid = await currentUserId();
  if (!uid) throw new Error("Sign in first.");
  const { error } = await supabase
    .from("posts")
    .update({ status: hidden ? "hidden" : "published" })
    .eq("id", postId);
  if (error) throw error;
  await supabase.from("moderation_actions").insert({
    target_kind: "post",
    target_id: postId,
    action: hidden ? "hidden_by_community" : "restored_by_community",
    rung: "community",
    notes,
    actor_id: uid,
  });
}
