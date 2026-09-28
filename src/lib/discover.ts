import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";

export const REEL_BUCKET = "reel-media";
const REEL_PREFIX = `storage:${REEL_BUCKET}/`;

/** Respect-first reactions. These replace plain likes across Discover. */
export const REACTIONS = [
  { id: "appreciate", label: "Appreciate", emoji: "❤️", weight: 1 },
  { id: "respect", label: "Respect", emoji: "🤝", weight: 2 },
  { id: "learned", label: "Learned something", emoji: "💡", weight: 3 },
  { id: "discovery", label: "Cross-cultural discovery", emoji: "🌍", weight: 4 },
  { id: "inspiring", label: "Inspiring", emoji: "🙏", weight: 2 },
] as const;

export type ReactionId = (typeof REACTIONS)[number]["id"];

export const TRADITIONS = [
  "Universal",
  "Hindu",
  "Buddhist",
  "Sikh",
  "Jain",
  "Christian",
  "Islamic",
  "Jewish",
  "Indigenous",
  "Secular",
] as const;

export const NORMS = [
  "Learn before judging.",
  "Criticise ideas, never people.",
  "No hatred, dehumanisation or glorified violence.",
  "Ask the genuine question. It is welcome here.",
  "Give context before anything difficult.",
] as const;

export type Reel = {
  id: string;
  creator_id: string;
  title: string;
  context_note: string;
  tradition: string;
  topic_slug: string | null;
  media_kind: string;
  media_url: string;
  duration_seconds: number;
  sensitive: boolean;
  created_at: string;
  creator: {
    id: string;
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
  reactions: Record<string, number>;
  mine: string[];
  playbackUrl: string;
  completions: number;
};

function isStored(url: string) {
  return url.startsWith(REEL_PREFIX);
}

async function resolvePlayback(urls: string[]) {
  const paths = urls.filter(isStored).map((u) => u.slice(REEL_PREFIX.length));
  if (paths.length === 0) return new Map<string, string>();
  const { data } = await supabase.storage
    .from(REEL_BUCKET)
    .createSignedUrls([...new Set(paths)], 3600);
  const map = new Map<string, string>();
  for (const row of data ?? []) {
    if (row.path && row.signedUrl) map.set(`${REEL_PREFIX}${row.path}`, row.signedUrl);
  }
  return map;
}

/**
 * Discovery ranking: completion, saves and cross-tradition reach carry the feed.
 * Comment volume deliberately carries nothing, so heat is never a shortcut to reach.
 */
function scoreReel(reel: Reel, viewerTradition: string | null) {
  const reactionScore = REACTIONS.reduce(
    (sum, r) => sum + (reel.reactions[r.id] ?? 0) * r.weight,
    0,
  );
  const completion = reel.completions * 4;
  const crossing = viewerTradition && reel.tradition !== viewerTradition ? 12 : 0;
  const ageHours = (Date.now() - new Date(reel.created_at).getTime()) / 3_600_000;
  const freshness = Math.max(0, 40 - ageHours / 6);
  return reactionScore + completion + crossing + freshness;
}

export async function fetchReels(viewerTradition: string | null = null): Promise<Reel[]> {
  const uid = await currentUserId();
  const { data } = await supabase
    .from("reels")
    .select(
      "id, creator_id, title, context_note, tradition, topic_slug, media_kind, media_url, duration_seconds, sensitive, created_at",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(60);
  const rows = (data ?? []) as Omit<
    Reel,
    "creator" | "reactions" | "mine" | "playbackUrl" | "completions"
  >[];
  if (rows.length === 0) return [];

  const ids = rows.map((r) => r.id);
  const [profiles, reactions, views, playback] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url")
      .in("id", [...new Set(rows.map((r) => r.creator_id))]),
    supabase
      .from("content_reactions")
      .select("target_id, reaction, user_id")
      .eq("target_kind", "reel")
      .in("target_id", ids),
    supabase.from("reel_views").select("reel_id, completed").in("reel_id", ids),
    resolvePlayback(rows.map((r) => r.media_url)),
  ]);

  const pMap = new Map((profiles.data ?? []).map((p) => [p.id, p]));
  const counts = new Map<string, Record<string, number>>();
  const mine = new Map<string, string[]>();
  for (const r of reactions.data ?? []) {
    const bucket = counts.get(r.target_id) ?? {};
    bucket[r.reaction] = (bucket[r.reaction] ?? 0) + 1;
    counts.set(r.target_id, bucket);
    if (uid && r.user_id === uid)
      mine.set(r.target_id, [...(mine.get(r.target_id) ?? []), r.reaction]);
  }
  const completions = new Map<string, number>();
  for (const v of views.data ?? []) {
    if (v.completed) completions.set(v.reel_id, (completions.get(v.reel_id) ?? 0) + 1);
  }

  const reels: Reel[] = rows.map((r) => ({
    ...r,
    creator: pMap.get(r.creator_id) ?? null,
    reactions: counts.get(r.id) ?? {},
    mine: mine.get(r.id) ?? [],
    completions: completions.get(r.id) ?? 0,
    playbackUrl: playback.get(r.media_url) ?? r.media_url,
  }));

  return reels.sort((a, b) => scoreReel(b, viewerTradition) - scoreReel(a, viewerTradition));
}

export async function createReel(input: {
  title: string;
  contextNote: string;
  tradition: string;
  mediaKind: "upload" | "embed";
  mediaUrl: string;
  durationSeconds: number;
  sensitive: boolean;
  topicSlug?: string | null;
}) {
  const uid = await currentUserId();
  if (!uid) throw new Error("Sign in first.");
  const { error } = await supabase.from("reels").insert({
    creator_id: uid,
    title: input.title,
    context_note: input.contextNote,
    tradition: input.tradition,
    media_kind: input.mediaKind,
    media_url: input.mediaUrl,
    duration_seconds: input.durationSeconds,
    sensitive: input.sensitive,
    topic_slug: input.topicSlug ?? null,
  });
  if (error) throw error;
}

export async function uploadReelFile(file: File) {
  const uid = await currentUserId();
  if (!uid) throw new Error("Sign in first.");
  if (!file.type.startsWith("video/")) throw new Error("That is not a video file.");
  if (file.size > 80 * 1024 * 1024) throw new Error("Keep clips under 80 MB.");
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "mp4";
  const path = `${uid}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(REEL_BUCKET)
    .upload(path, file, { contentType: file.type });
  if (error) throw error;
  return `${REEL_PREFIX}${path}`;
}

export async function toggleReaction(
  targetKind: string,
  targetId: string,
  reaction: ReactionId,
  on: boolean,
) {
  const uid = await currentUserId();
  if (!uid) return;
  if (on) {
    await supabase
      .from("content_reactions")
      .delete()
      .eq("user_id", uid)
      .eq("target_kind", targetKind)
      .eq("target_id", targetId)
      .eq("reaction", reaction);
  } else {
    await supabase
      .from("content_reactions")
      .insert({ user_id: uid, target_kind: targetKind, target_id: targetId, reaction });
  }
}

export async function recordView(reelId: string, watchedSeconds: number, completed: boolean) {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase
    .from("reel_views")
    .upsert(
      { reel_id: reelId, user_id: uid, watched_seconds: Math.round(watchedSeconds), completed },
      { onConflict: "reel_id,user_id" },
    );
}

export async function reportContent(
  targetKind: string,
  targetId: string,
  reason: string,
  details: string,
) {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase.from("content_reports").insert({
    reporter_id: uid,
    target_kind: targetKind,
    target_id: targetId,
    reason,
    details: details || null,
  });
}

export const REPORT_REASONS = [
  "Hatred or dehumanisation",
  "Incitement or glorified violence",
  "Harassment of a person",
  "Deliberate misinformation",
  "Missing or misleading context",
  "Spam or manipulated engagement",
] as const;

export type ExploreTopic = {
  id: string;
  slug: string;
  title: string;
  tradition: string;
  kind: string;
  summary: string;
  origin: string | null;
  sort_order: number;
};

export type ExploreSection = { id: string; heading: string; body: string; sort_order: number };

export async function fetchTopics(): Promise<ExploreTopic[]> {
  const { data, error } = await supabase
    .from("explore_topics")
    .select("id, slug, title, tradition, kind, summary, origin, sort_order")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as ExploreTopic[];
}

export async function fetchTopic(slug: string) {
  const { data } = await supabase
    .from("explore_topics")
    .select("id, slug, title, tradition, kind, summary, origin, sort_order")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return null;
  const topic = data as ExploreTopic;
  const [sections, reels, episodes] = await Promise.all([
    supabase
      .from("explore_sections")
      .select("id, heading, body, sort_order")
      .eq("topic_id", topic.id)
      .order("sort_order"),
    supabase
      .from("reels")
      .select("id, title, tradition")
      .eq("topic_slug", slug)
      .eq("status", "published")
      .limit(12),
    supabase
      .from("episodes")
      .select("id, title, tradition, duration_minutes")
      .eq("topic_slug", slug)
      .eq("published", true)
      .limit(12),
  ]);
  return {
    topic,
    sections: (sections.data ?? []) as ExploreSection[],
    reels: (reels.data ?? []) as { id: string; title: string; tradition: string }[],
    episodes: (episodes.data ?? []) as {
      id: string;
      title: string;
      tradition: string;
      duration_minutes: number;
    }[],
  };
}

export type Episode = {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  tradition: string;
  topic_slug: string | null;
  media_kind: string;
  media_url: string | null;
  duration_minutes: number;
  scheduled_at: string | null;
  price_cents: number;
  created_at: string;
  host: {
    id: string;
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
  rsvps: number;
};

export async function fetchEpisodes(): Promise<Episode[]> {
  const { data } = await supabase
    .from("episodes")
    .select(
      "id, creator_id, title, description, tradition, topic_slug, media_kind, media_url, duration_minutes, scheduled_at, price_cents, created_at",
    )
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(50);
  const rows = (data ?? []) as Omit<Episode, "host" | "rsvps">[];
  if (rows.length === 0) return [];
  const [profiles, rsvps] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url")
      .in("id", [...new Set(rows.map((r) => r.creator_id))]),
    supabase
      .from("episode_rsvps")
      .select("episode_id")
      .in(
        "episode_id",
        rows.map((r) => r.id),
      ),
  ]);
  const pMap = new Map((profiles.data ?? []).map((p) => [p.id, p]));
  const counts = new Map<string, number>();
  for (const r of rsvps.data ?? []) counts.set(r.episode_id, (counts.get(r.episode_id) ?? 0) + 1);
  return rows.map((r) => ({
    ...r,
    host: pMap.get(r.creator_id) ?? null,
    rsvps: counts.get(r.id) ?? 0,
  }));
}

export async function fetchEpisode(id: string) {
  const { data } = await supabase
    .from("episodes")
    .select(
      "id, creator_id, title, description, tradition, topic_slug, media_kind, media_url, duration_minutes, scheduled_at, price_cents, created_at",
    )
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  const uid = await currentUserId();
  const row = data as Omit<Episode, "host" | "rsvps">;
  const [host, chapters, comments, rsvps, purchase] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url")
      .eq("id", row.creator_id)
      .maybeSingle(),
    supabase
      .from("episode_chapters")
      .select("id, label, starts_seconds")
      .eq("episode_id", id)
      .order("starts_seconds"),
    supabase
      .from("episode_comments")
      .select("id, user_id, body, created_at")
      .eq("episode_id", id)
      .order("created_at"),
    supabase.from("episode_rsvps").select("user_id").eq("episode_id", id),
    uid
      ? supabase
          .from("episode_purchases")
          .select("id")
          .eq("episode_id", id)
          .eq("user_id", uid)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const commentRows = (comments.data ?? []) as {
    id: string;
    user_id: string;
    body: string;
    created_at: string;
  }[];
  const authors = await supabase
    .from("profiles")
    .select("id, display_name, username, avatar_url")
    .in(
      "id",
      [...new Set(commentRows.map((c) => c.user_id))].length
        ? [...new Set(commentRows.map((c) => c.user_id))]
        : ["00000000-0000-0000-0000-000000000000"],
    );
  const aMap = new Map((authors.data ?? []).map((p) => [p.id, p]));

  return {
    episode: {
      ...row,
      host: (host.data as Episode["host"]) ?? null,
      rsvps: (rsvps.data ?? []).length,
    } as Episode,
    chapters: (chapters.data ?? []) as { id: string; label: string; starts_seconds: number }[],
    comments: commentRows.map((c) => ({ ...c, author: aMap.get(c.user_id) ?? null })),
    rsvped: Boolean(uid && (rsvps.data ?? []).some((r) => r.user_id === uid)),
    purchased: Boolean(purchase.data),
  };
}

export async function toggleRsvp(episodeId: string, on: boolean) {
  const uid = await currentUserId();
  if (!uid) return;
  if (on)
    await supabase.from("episode_rsvps").delete().eq("episode_id", episodeId).eq("user_id", uid);
  else await supabase.from("episode_rsvps").insert({ episode_id: episodeId, user_id: uid });
}

export async function addEpisodeComment(episodeId: string, body: string) {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase.from("episode_comments").insert({ episode_id: episodeId, user_id: uid, body });
}

export async function createEpisode(input: {
  title: string;
  description: string;
  tradition: string;
  mediaKind: "audio" | "video";
  mediaUrl: string | null;
  durationMinutes: number;
  scheduledAt: string | null;
  priceCents: number;
  topicSlug?: string | null;
}) {
  const uid = await currentUserId();
  if (!uid) throw new Error("Sign in first.");
  const { error } = await supabase.from("episodes").insert({
    creator_id: uid,
    title: input.title,
    description: input.description,
    tradition: input.tradition,
    media_kind: input.mediaKind,
    media_url: input.mediaUrl,
    duration_minutes: input.durationMinutes,
    scheduled_at: input.scheduledAt,
    price_cents: input.priceCents,
    topic_slug: input.topicSlug ?? null,
  });
  if (error) throw error;
}
