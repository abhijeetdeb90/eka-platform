import { supabase } from "@/integrations/supabase/client";

export type ProfileRow = {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  account_type: string;
  intentions: string[];
  interests: string[];
  practices: string[];
  verified: boolean;
  suspended: boolean;
  onboarded: boolean;
  reflection_tone: string;
  created_at: string;
  age_bracket?: string | null;
  region?: string | null;
  language?: string | null;
  religion?: string | null;
  community_background?: string | null;
  purposes?: string[];
  standards_accepted_at?: string | null;
};

export type CommunityRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  cover_image: string | null;
  category: string;
  rules: string | null;
  featured: boolean;
  member_count: number;
  created_by: string | null;
  created_at: string;
};

export type PostRow = {
  id: string;
  author_id: string;
  type: string;
  content: string;
  media_url: string | null;
  topic: string | null;
  community_id: string | null;
  status: string;
  like_count: number;
  comment_count: number;
  created_at: string;
};

export type FeedPost = PostRow & {
  author: ProfileRow | null;
  community: Pick<CommunityRow, "id" | "name" | "slug"> | null;
  liked: boolean;
  saved: boolean;
  reason?: FeedReason;
};

const PROFILE_COLS =
  "id, display_name, username, avatar_url, bio, account_type, intentions, interests, practices, verified, suspended, onboarded, reflection_tone, created_at";

export async function currentUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export const MEDIA_BUCKET = "post-media";
const STORAGE_PREFIX = `storage:${MEDIA_BUCKET}/`;

export function isStoredMedia(url: string | null) {
  return !!url && url.startsWith(STORAGE_PREFIX);
}

export function toStoredMedia(path: string) {
  return `${STORAGE_PREFIX}${path}`;
}

export function parseMediaArray(raw: string | null): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string" && item.length > 0);
      }
    } catch {
      // Fallback to single string
    }
  }
  return [trimmed];
}

/** Turns internal storage references into temporary viewable URLs. */
async function resolveMedia(rows: PostRow[]): Promise<Map<string, string>> {
  const paths: string[] = [];
  for (const r of rows) {
    if (!r.media_url) continue;
    const items = parseMediaArray(r.media_url);
    for (const item of items) {
      if (isStoredMedia(item)) {
        paths.push(item.slice(STORAGE_PREFIX.length));
      }
    }
  }
  if (paths.length === 0) return new Map();
  const { data } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrls([...new Set(paths)], 60 * 60);
  const map = new Map<string, string>();
  for (const item of data ?? []) {
    if (item.path && item.signedUrl) map.set(`${STORAGE_PREFIX}${item.path}`, item.signedUrl);
  }
  return map;
}

export async function hydratePosts(rows: PostRow[]): Promise<FeedPost[]> {
  if (rows.length === 0) return [];
  const uid = await currentUserId();
  const authorIds = [...new Set(rows.map((r) => r.author_id))];
  const communityIds = [...new Set(rows.map((r) => r.community_id).filter(Boolean))] as string[];
  const postIds = rows.map((r) => r.id);

  const [profiles, communities, likes, saves, mediaMap] = await Promise.all([
    supabase.from("profiles").select(PROFILE_COLS).in("id", authorIds),
    communityIds.length
      ? supabase.from("communities").select("id, name, slug").in("id", communityIds)
      : Promise.resolve({ data: [] as never[] }),
    uid
      ? supabase.from("post_likes").select("post_id").eq("user_id", uid).in("post_id", postIds)
      : Promise.resolve({ data: [] as { post_id: string }[] }),
    uid
      ? supabase.from("post_saves").select("post_id").eq("user_id", uid).in("post_id", postIds)
      : Promise.resolve({ data: [] as { post_id: string }[] }),
    resolveMedia(rows),
  ]);

  const pMap = new Map((profiles.data ?? []).map((p) => [p.id, p as unknown as ProfileRow]));
  const cMap = new Map(
    ((communities.data ?? []) as unknown as CommunityRow[]).map((c) => [c.id, c] as const),
  );
  const likedSet = new Set((likes.data ?? []).map((l) => l.post_id));
  const savedSet = new Set((saves.data ?? []).map((s) => s.post_id));

  return rows.map((r) => {
    let resolvedMedia: string | null = null;
    if (r.media_url) {
      const items = parseMediaArray(r.media_url);
      if (items.length > 1) {
        const resolved = items
          .map((item) => mediaMap.get(item) ?? (isStoredMedia(item) ? null : item))
          .filter((u): u is string => Boolean(u));
        resolvedMedia = resolved.length > 0 ? JSON.stringify(resolved) : null;
      } else if (items.length === 1) {
        const item = items[0];
        resolvedMedia = mediaMap.get(item) ?? (isStoredMedia(item) ? null : item);
      }
    }

    return {
      ...r,
      media_url: resolvedMedia,
      author: pMap.get(r.author_id) ?? null,
      community: r.community_id ? (cMap.get(r.community_id) ?? null) : null,
      liked: likedSet.has(r.id),
      saved: savedSet.has(r.id),
    };
  }) as FeedPost[];
}

export type FeedReason = "following" | "sangha" | "interest" | "recent";

/**
 * Home feed ranking: posts from followed accounts and joined Sanghas come first,
 * then interest-matched recommendations, then fresh community-wide posts.
 */
export async function fetchHomeFeed(): Promise<FeedPost[]> {
  const uid = await currentUserId();
  let authorFilter: string[] = [];
  let communityFilter: string[] = [];
  let interests: string[] = [];
  if (uid) {
    const [follows, memberships, profile] = await Promise.all([
      supabase.from("follows").select("following_id").eq("follower_id", uid),
      supabase.from("community_members").select("community_id").eq("user_id", uid),
      supabase.from("profiles").select("interests").eq("id", uid).maybeSingle(),
    ]);
    authorFilter = [...(follows.data ?? []).map((f) => f.following_id), uid];
    communityFilter = (memberships.data ?? []).map((m) => m.community_id);
    interests = (profile.data?.interests as string[] | undefined) ?? [];
  }

  const personal =
    authorFilter.length || communityFilter.length
      ? await supabase
          .from("posts")
          .select("*")
          .eq("status", "visible")
          .or(
            [
              authorFilter.length ? `author_id.in.(${authorFilter.join(",")})` : "",
              communityFilter.length ? `community_id.in.(${communityFilter.join(",")})` : "",
            ]
              .filter(Boolean)
              .join(","),
          )
          .order("created_at", { ascending: false })
          .limit(40)
      : { data: [] as PostRow[] };

  const interestPosts = interests.length
    ? await supabase
        .from("posts")
        .select("*")
        .eq("status", "visible")
        .in("topic", interests)
        .order("created_at", { ascending: false })
        .limit(25)
    : { data: [] as PostRow[] };

  const recent = await supabase
    .from("posts")
    .select("*")
    .eq("status", "visible")
    .order("created_at", { ascending: false })
    .limit(30);

  const followSet = new Set(authorFilter);
  const communitySet = new Set(communityFilter);
  const interestSet = new Set(interests.map((i) => i.toLowerCase()));

  const seen = new Set<string>();
  const merged: PostRow[] = [];
  for (const row of [
    ...((personal.data ?? []) as PostRow[]),
    ...((interestPosts.data ?? []) as PostRow[]),
    ...((recent.data ?? []) as PostRow[]),
  ]) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    merged.push(row);
  }

  const now = Date.now();
  const reasonFor = (r: PostRow): FeedReason =>
    followSet.has(r.author_id)
      ? "following"
      : r.community_id && communitySet.has(r.community_id)
        ? "sangha"
        : r.topic && interestSet.has(r.topic.toLowerCase())
          ? "interest"
          : "recent";

  const weight: Record<FeedReason, number> = {
    following: 100,
    sangha: 80,
    interest: 45,
    recent: 0,
  };

  const ranked = merged
    .map((r) => {
      const reason = reasonFor(r);
      const ageHours = Math.max(0, (now - new Date(r.created_at).getTime()) / 3_600_000);
      const freshness = 60 / (1 + ageHours / 12);
      const engagement = Math.min(30, r.like_count * 2 + r.comment_count * 3);
      return { row: r, reason, score: weight[reason] + freshness + engagement };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);

  const hydrated = await hydratePosts(ranked.map((r) => r.row));
  return hydrated.map((p, i) => ({ ...p, reason: ranked[i]!.reason }));
}

export async function fetchPostsBy(filter: {
  authorId?: string;
  communityId?: string;
  topic?: string;
  type?: string;
}) {
  let q = supabase.from("posts").select("*").eq("status", "visible");
  if (filter.authorId) q = q.eq("author_id", filter.authorId);
  if (filter.communityId) q = q.eq("community_id", filter.communityId);
  if (filter.topic) q = q.eq("topic", filter.topic);
  if (filter.type) q = q.eq("type", filter.type);
  const { data, error } = await q.order("created_at", { ascending: false }).limit(50);
  if (error) throw error;
  return hydratePosts((data ?? []) as PostRow[]);
}

export async function toggleLike(postId: string, liked: boolean, authorId: string) {
  const uid = await currentUserId();
  if (!uid) return;
  if (liked) {
    await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", uid);
  } else {
    await supabase.from("post_likes").insert({ post_id: postId, user_id: uid });
    if (authorId !== uid) {
      await supabase
        .from("notifications")
        .insert({ user_id: authorId, actor_id: uid, type: "like", post_id: postId });
    }
  }
}

export async function toggleSave(postId: string, saved: boolean) {
  const uid = await currentUserId();
  if (!uid) return;
  if (saved) {
    await supabase.from("post_saves").delete().eq("post_id", postId).eq("user_id", uid);
  } else {
    await supabase.from("post_saves").insert({ post_id: postId, user_id: uid });
  }
}

export async function toggleFollow(targetId: string, following: boolean) {
  const uid = await currentUserId();
  if (!uid || uid === targetId) return;
  if (following) {
    await supabase.from("follows").delete().eq("follower_id", uid).eq("following_id", targetId);
  } else {
    await supabase.from("follows").insert({ follower_id: uid, following_id: targetId });
    await supabase
      .from("notifications")
      .insert({ user_id: targetId, actor_id: uid, type: "follow" });
  }
}

export async function toggleMembership(communityId: string, joined: boolean) {
  const uid = await currentUserId();
  if (!uid) return;
  if (joined) {
    await supabase
      .from("community_members")
      .delete()
      .eq("community_id", communityId)
      .eq("user_id", uid);
  } else {
    await supabase.from("community_members").insert({ community_id: communityId, user_id: uid });
  }
}

export async function fetchProfileByUsername(username: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLS)
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as ProfileRow) ?? null;
}

export async function fetchSocialCounts(userId: string) {
  const [followers, following, posts] = await Promise.all([
    supabase
      .from("follows")
      .select("id", { count: "exact", head: true })
      .eq("following_id", userId),
    supabase.from("follows").select("id", { count: "exact", head: true }).eq("follower_id", userId),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("author_id", userId),
  ]);
  return {
    followers: followers.count ?? 0,
    following: following.count ?? 0,
    posts: posts.count ?? 0,
  };
}

export async function reportContent(input: {
  postId?: string;
  commentId?: string;
  reportedUserId?: string;
  reason: string;
  details?: string;
}) {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase.from("content_reports").insert({
    reporter_id: uid,
    post_id: input.postId ?? null,
    comment_id: input.commentId ?? null,
    reported_user_id: input.reportedUserId ?? null,
    reason: input.reason,
    details: input.details ?? null,
  });
}
