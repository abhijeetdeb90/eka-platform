import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";

/**
 * The escalation ladder. Severe reports hide content instantly (rung 1), a
 * person reviews every hidden item (rung 2), and repeat harm earns a temporary
 * restriction rather than a silent permanent ban (rung 3).
 */

export const LADDER = [
  {
    rung: "Rung 1 · Auto-hide",
    body: "Hate, incitement or harassment reports hide the item immediately, before anyone else sees it.",
  },
  {
    rung: "Rung 2 · Human review",
    body: "Every hidden item lands in this queue. A person upholds or restores it — never a model alone.",
  },
  {
    rung: "Rung 3 · Temporary restriction",
    body: "Repeat harm pauses posting for a fixed window, with the reason stated to the member.",
  },
] as const;

export const SEVERE_REASONS = [
  "Hatred or dehumanisation",
  "Incitement or glorified violence",
  "Harassment of a person",
] as const;

export type QueueReport = {
  id: string;
  reason: string;
  details: string | null;
  status: string;
  severity: string;
  auto_hidden: boolean;
  target_kind: string;
  target_id: string | null;
  post_id: string | null;
  comment_id: string | null;
  reported_user_id: string | null;
  created_at: string;
};

export async function fetchQueue(
  status: "open" | "escalated" | "resolved",
): Promise<QueueReport[]> {
  const { data, error } = await supabase
    .from("content_reports")
    .select(
      "id, reason, details, status, severity, auto_hidden, target_kind, target_id, post_id, comment_id, reported_user_id, created_at",
    )
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []) as QueueReport[];
}

function targetOf(report: QueueReport) {
  return {
    kind: report.target_kind ?? (report.post_id ? "post" : report.comment_id ? "comment" : "other"),
    id: report.target_id ?? report.post_id ?? report.comment_id,
  };
}

async function setVisibility(kind: string, id: string, hidden: boolean) {
  if (kind === "post")
    await supabase
      .from("posts")
      .update({ status: hidden ? "hidden" : "visible" })
      .eq("id", id);
  else if (kind === "comment")
    await supabase
      .from("post_comments")
      .update({ status: hidden ? "hidden" : "visible" })
      .eq("id", id);
  else if (kind === "reel")
    await supabase
      .from("reels")
      .update({ status: hidden ? "hidden" : "published" })
      .eq("id", id);
  else if (kind === "question")
    await supabase.from("episode_questions").update({ hidden }).eq("id", id);
}

/** Rung 2: a person decides. Upheld stays hidden, restored comes back. */
export async function reviewReport(
  report: QueueReport,
  outcome: "upheld" | "restored",
  notes?: string,
) {
  const uid = await currentUserId();
  const { kind, id } = targetOf(report);
  if (id) await setVisibility(kind, id, outcome === "upheld");

  await supabase
    .from("content_reports")
    .update({
      status: "resolved",
      resolution: outcome,
      reviewed_by: uid ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", report.id);

  await supabase.from("moderation_actions").insert({
    target_kind: kind,
    target_id: id,
    subject_user_id: report.reported_user_id,
    action: outcome === "upheld" ? "content_removed" : "content_restored",
    rung: "review",
    notes: notes ?? report.reason,
    actor_id: uid ?? null,
  });
}

export const RESTRICTION_WINDOWS = [
  { label: "24 hours", days: 1 },
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
] as const;

/** Rung 3: a fixed, explained pause — never a silent shadow ban. */
export async function restrictUser(userId: string, days: number, reason: string) {
  const uid = await currentUserId();
  const expires = new Date(Date.now() + days * 86_400_000).toISOString();
  await supabase.from("user_restrictions").insert({
    user_id: userId,
    level: "posting_paused",
    reason,
    issued_by: uid ?? null,
    expires_at: expires,
  });
  await supabase.from("moderation_actions").insert({
    target_kind: "member",
    subject_user_id: userId,
    action: "temporary_restriction",
    rung: "restriction",
    notes: `${days} day pause · ${reason}`,
    actor_id: uid ?? null,
  });
}

export async function liftRestriction(id: string) {
  await supabase
    .from("user_restrictions")
    .update({ lifted_at: new Date().toISOString() })
    .eq("id", id);
}

export type Restriction = {
  id: string;
  user_id: string;
  level: string;
  reason: string;
  expires_at: string | null;
  lifted_at: string | null;
  created_at: string;
};

export async function fetchActiveRestrictions(): Promise<Restriction[]> {
  const { data } = await supabase
    .from("user_restrictions")
    .select("id, user_id, level, reason, expires_at, lifted_at, created_at")
    .is("lifted_at", null)
    .order("created_at", { ascending: false })
    .limit(50);
  return ((data ?? []) as Restriction[]).filter(
    (r) => !r.expires_at || new Date(r.expires_at) > new Date(),
  );
}

export async function fetchMyRestriction(): Promise<Restriction | null> {
  const uid = await currentUserId();
  if (!uid) return null;
  const { data } = await supabase
    .from("user_restrictions")
    .select("id, user_id, level, reason, expires_at, lifted_at, created_at")
    .eq("user_id", uid)
    .is("lifted_at", null)
    .order("created_at", { ascending: false })
    .limit(1);
  const row = (data ?? [])[0] as Restriction | undefined;
  if (!row) return null;
  if (row.expires_at && new Date(row.expires_at) <= new Date()) return null;
  return row;
}

export async function fetchActionLog() {
  const { data } = await supabase
    .from("moderation_actions")
    .select("id, target_kind, action, rung, notes, created_at")
    .order("created_at", { ascending: false })
    .limit(30);
  return data ?? [];
}
