import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";

/**
 * Appeals. Auto-hiding is fast, so it must be reversible. Every hidden item and
 * every restriction can be appealed once, with a stated reason code, and a
 * person returns one of four consistent outcomes.
 */

export const APPEAL_REASONS = [
  {
    code: "context_missing",
    label: "The context was missed",
    body: "The clip or post was educational and the reviewer read it without its framing.",
  },
  {
    code: "not_hateful",
    label: "This is not hatred",
    body: "A belief or idea was questioned, not a person or a people.",
  },
  {
    code: "quoted_to_criticise",
    label: "Quoted to criticise it",
    body: "Harmful words were shown in order to name them as harmful.",
  },
  {
    code: "mistaken_identity",
    label: "Wrong person or item",
    body: "This action landed on the wrong account or the wrong piece of content.",
  },
  {
    code: "coordinated_reports",
    label: "Mass or coordinated reporting",
    body: "The reports look organised rather than genuine.",
  },
  { code: "other", label: "Something else", body: "Explain it in your own words." },
] as const;

export const APPEAL_OUTCOMES = [
  {
    code: "overturned",
    label: "Overturned — content restored",
    body: "The action was wrong. The item comes back and any restriction is lifted.",
  },
  {
    code: "upheld",
    label: "Upheld — action stands",
    body: "The item breaks a stated norm. The reason is repeated to the member.",
  },
  {
    code: "reduced",
    label: "Reduced",
    body: "The action was too heavy. The restriction is shortened or downgraded.",
  },
  {
    code: "needs_edit",
    label: "Restore with context",
    body: "The item returns once the member adds the missing context.",
  },
] as const;

export type Appeal = {
  id: string;
  user_id: string;
  subject_kind: string;
  subject_id: string | null;
  report_id: string | null;
  restriction_id: string | null;
  reason_code: string;
  statement: string;
  status: string;
  outcome: string | null;
  outcome_note: string | null;
  reviewed_at: string | null;
  created_at: string;
};

const COLUMNS =
  "id, user_id, subject_kind, subject_id, report_id, restriction_id, reason_code, statement, status, outcome, outcome_note, reviewed_at, created_at";

export async function fetchMyAppeals(): Promise<Appeal[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data, error } = await supabase
    .from("content_appeals")
    .select(COLUMNS)
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Appeal[];
}

export async function fetchAppealQueue(): Promise<Appeal[]> {
  const { data, error } = await supabase
    .from("content_appeals")
    .select(COLUMNS)
    .eq("status", "open")
    .order("created_at", { ascending: true })
    .limit(100);
  if (error) throw error;
  return (data ?? []) as Appeal[];
}

export async function submitAppeal(input: {
  subjectKind: string;
  subjectId?: string | null;
  restrictionId?: string | null;
  reportId?: string | null;
  reasonCode: string;
  statement: string;
}) {
  const uid = await currentUserId();
  if (!uid) throw new Error("Sign in to appeal.");
  const { error } = await supabase.from("content_appeals").insert({
    user_id: uid,
    subject_kind: input.subjectKind,
    subject_id: input.subjectId ?? null,
    restriction_id: input.restrictionId ?? null,
    report_id: input.reportId ?? null,
    reason_code: input.reasonCode,
    statement: input.statement.trim(),
  });
  if (error) throw error;
}

/** A moderator returns one of the four outcomes, and the effect is applied. */
export async function decideAppeal(appeal: Appeal, outcome: string, note: string) {
  const uid = await currentUserId();

  if (outcome === "overturned") {
    if (appeal.restriction_id) {
      await supabase
        .from("user_restrictions")
        .update({ lifted_at: new Date().toISOString() })
        .eq("id", appeal.restriction_id);
    }
    if (appeal.subject_id) {
      const kind = appeal.subject_kind;
      if (kind === "post")
        await supabase.from("posts").update({ status: "visible" }).eq("id", appeal.subject_id);
      else if (kind === "comment")
        await supabase
          .from("post_comments")
          .update({ status: "visible" })
          .eq("id", appeal.subject_id);
      else if (kind === "reel")
        await supabase.from("reels").update({ status: "published" }).eq("id", appeal.subject_id);
      else if (kind === "question")
        await supabase
          .from("episode_questions")
          .update({ hidden: false })
          .eq("id", appeal.subject_id);
    }
  }

  if (outcome === "reduced" && appeal.restriction_id) {
    await supabase
      .from("user_restrictions")
      .update({ expires_at: new Date(Date.now() + 86_400_000).toISOString() })
      .eq("id", appeal.restriction_id);
  }

  await supabase
    .from("content_appeals")
    .update({
      status: "resolved",
      outcome,
      outcome_note: note.trim() || null,
      reviewed_by: uid ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", appeal.id);

  await supabase.from("moderation_actions").insert({
    target_kind: appeal.subject_kind,
    target_id: appeal.subject_id,
    subject_user_id: appeal.user_id,
    action: `appeal_${outcome}`,
    rung: "appeal",
    notes: note.trim() || null,
    actor_id: uid ?? null,
  });
}
