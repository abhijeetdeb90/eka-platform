import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";

/**
 * Structured questions for conversations and live sessions. Members ask, the
 * room votes, the host answers the ones that matter most — so the best question
 * rises instead of the loudest comment.
 */

export type EpisodeQuestion = {
  id: string;
  episode_id: string;
  user_id: string;
  body: string;
  vote_count: number;
  answered: boolean;
  pinned: boolean;
  answer_note: string | null;
  created_at: string;
  author: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
  voted: boolean;
};

export async function fetchQuestions(episodeId: string): Promise<EpisodeQuestion[]> {
  const uid = await currentUserId();
  const { data, error } = await supabase
    .from("episode_questions")
    .select("id, episode_id, user_id, body, vote_count, answered, pinned, answer_note, created_at")
    .eq("episode_id", episodeId)
    .eq("hidden", false)
    .order("pinned", { ascending: false })
    .order("vote_count", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = data ?? [];
  if (rows.length === 0) return [];

  const [{ data: profiles }, { data: votes }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url")
      .in("id", [...new Set(rows.map((r) => r.user_id))]),
    uid
      ? supabase
          .from("episode_question_votes")
          .select("question_id")
          .eq("user_id", uid)
          .in(
            "question_id",
            rows.map((r) => r.id),
          )
      : Promise.resolve({ data: [] as { question_id: string }[] }),
  ]);

  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
  const mine = new Set((votes ?? []).map((v) => v.question_id));

  return rows.map((r) => ({
    ...r,
    author: byId.get(r.user_id) ?? null,
    voted: mine.has(r.id),
  })) as EpisodeQuestion[];
}

export async function askQuestion(episodeId: string, body: string) {
  const uid = await currentUserId();
  if (!uid) throw new Error("Sign in to ask.");
  const { error } = await supabase
    .from("episode_questions")
    .insert({ episode_id: episodeId, user_id: uid, body: body.trim() });
  if (error) throw error;
}

export async function toggleQuestionVote(questionId: string, voted: boolean) {
  const uid = await currentUserId();
  if (!uid) return;
  if (voted) {
    await supabase
      .from("episode_question_votes")
      .delete()
      .eq("question_id", questionId)
      .eq("user_id", uid);
  } else {
    await supabase.from("episode_question_votes").insert({ question_id: questionId, user_id: uid });
  }
}

export async function markAnswered(questionId: string, answered: boolean, note?: string) {
  await supabase
    .from("episode_questions")
    .update({ answered, answer_note: note?.trim() || null })
    .eq("id", questionId);
}

export async function pinQuestion(questionId: string, pinned: boolean) {
  await supabase.from("episode_questions").update({ pinned }).eq("id", questionId);
}

export async function removeQuestion(questionId: string) {
  await supabase.from("episode_questions").delete().eq("id", questionId);
}

/* ── Following a conversation ────────────────────────────────────────────── */

export type EpisodeFollow = {
  id: string;
  notify_questions: boolean;
  notify_schedule: boolean;
};

export async function fetchEpisodeFollow(episodeId: string): Promise<EpisodeFollow | null> {
  const uid = await currentUserId();
  if (!uid) return null;
  const { data } = await supabase
    .from("episode_follows")
    .select("id, notify_questions, notify_schedule")
    .eq("episode_id", episodeId)
    .eq("user_id", uid)
    .maybeSingle();
  return (data as EpisodeFollow | null) ?? null;
}

export async function followEpisode(episodeId: string) {
  const uid = await currentUserId();
  if (!uid) throw new Error("Sign in to follow.");
  const { error } = await supabase
    .from("episode_follows")
    .insert({ episode_id: episodeId, user_id: uid });
  if (error) throw error;
}

export async function unfollowEpisode(episodeId: string) {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase.from("episode_follows").delete().eq("episode_id", episodeId).eq("user_id", uid);
}

export async function setFollowPrefs(
  id: string,
  prefs: Partial<Pick<EpisodeFollow, "notify_questions" | "notify_schedule">>,
) {
  await supabase.from("episode_follows").update(prefs).eq("id", id);
}
