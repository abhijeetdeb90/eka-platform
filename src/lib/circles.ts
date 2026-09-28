import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";

export const ACTIVITY_KINDS = [
  {
    id: "ritual",
    label: "Shared ritual",
    blurb: "A practice the circle does together, at the same hour.",
  },
  {
    id: "story",
    label: "Member story",
    blurb: "Something true from your own practice, told plainly.",
  },
  {
    id: "service",
    label: "Act of service",
    blurb: "An hour that helps someone outside the circle.",
  },
  { id: "milestone", label: "Milestone", blurb: "A moment the circle reached together." },
] as const;

export type ActivityKind = (typeof ACTIVITY_KINDS)[number]["id"];

export function kindLabel(kind: string) {
  return ACTIVITY_KINDS.find((k) => k.id === kind)?.label ?? kind;
}

type MiniProfile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

export type ActivityParticipant = {
  id: string;
  user_id: string;
  status: string;
  attended: boolean;
  profile: MiniProfile | null;
};

export type CircleActivity = {
  id: string;
  community_id: string;
  created_by: string;
  kind: string;
  title: string;
  body: string;
  starts_at: string | null;
  created_at: string;
  capacity: number | null;
  requires_approval: boolean;
  closed: boolean;
  author: MiniProfile | null;
  participants: number;
  pending: number;
  joined: boolean;
  myStatus: string | null;
  isHost: boolean;
  full: boolean;
  people: ActivityParticipant[];
};

export async function fetchCircleActivities(communityId: string): Promise<CircleActivity[]> {
  const uid = await currentUserId();
  const { data } = await supabase
    .from("circle_activities")
    .select(
      "id, community_id, created_by, kind, title, body, starts_at, created_at, capacity, requires_approval, closed",
    )
    .eq("community_id", communityId)
    .order("created_at", { ascending: false })
    .limit(50);
  const rows = (data ?? []) as {
    id: string;
    community_id: string;
    created_by: string;
    kind: string;
    title: string;
    body: string;
    starts_at: string | null;
    created_at: string;
    capacity: number | null;
    requires_approval: boolean;
    closed: boolean;
  }[];
  if (rows.length === 0) return [];

  const [profiles, joins] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .in("id", [...new Set(rows.map((r) => r.created_by))]),
    supabase
      .from("circle_activity_joins")
      .select("id, activity_id, user_id, status, attended")
      .in(
        "activity_id",
        rows.map((r) => r.id),
      ),
  ]);

  const joinRows = (joins.data ?? []) as {
    id: string;
    activity_id: string;
    user_id: string;
    status: string;
    attended: boolean;
  }[];
  const joinerIds = [...new Set(joinRows.map((j) => j.user_id))];
  const joinerProfiles = joinerIds.length
    ? await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .in("id", joinerIds)
    : { data: [] as MiniProfile[] };

  const pMap = new Map<string, MiniProfile>(
    (profiles.data ?? []).map((p) => [p.id, p as MiniProfile]),
  );
  const jMap = new Map<string, MiniProfile>(
    (joinerProfiles.data ?? []).map((p) => [p.id, p as MiniProfile]),
  );

  return rows.map((r) => {
    const forActivity = joinRows.filter((j) => j.activity_id === r.id);
    const approved = forActivity.filter((j) => j.status === "approved");
    const mineRow = uid ? forActivity.find((j) => j.user_id === uid) : undefined;
    const capacity = r.capacity ?? null;
    return {
      ...r,
      author: pMap.get(r.created_by) ?? null,
      participants: approved.length,
      pending: forActivity.filter((j) => j.status === "pending").length,
      joined: Boolean(mineRow),
      myStatus: mineRow?.status ?? null,
      isHost: Boolean(uid && uid === r.created_by),
      full: capacity !== null && approved.length >= capacity,
      people: forActivity.map((j) => ({
        id: j.id,
        user_id: j.user_id,
        status: j.status,
        attended: j.attended,
        profile: jMap.get(j.user_id) ?? null,
      })),
    };
  });
}

export async function createActivity(input: {
  communityId: string;
  kind: ActivityKind;
  title: string;
  body: string;
  startsAt?: string | null;
  capacity?: number | null;
  requiresApproval?: boolean;
}) {
  const uid = await currentUserId();
  if (!uid) return;
  const { error } = await supabase.from("circle_activities").insert({
    community_id: input.communityId,
    created_by: uid,
    kind: input.kind,
    title: input.title,
    body: input.body,
    starts_at: input.startsAt || null,
    capacity: input.capacity ?? null,
    requires_approval: input.requiresApproval ?? false,
  });
  if (error) throw error;
}

/** Joining respects capacity and the host's approval setting. */
export async function requestJoin(activity: CircleActivity) {
  const uid = await currentUserId();
  if (!uid) return;
  if (activity.joined) {
    await supabase
      .from("circle_activity_joins")
      .delete()
      .eq("activity_id", activity.id)
      .eq("user_id", uid);
    return "left" as const;
  }
  if (activity.closed) throw new Error("This is closed.");
  if (activity.full) throw new Error("This one is full.");
  const status = activity.requires_approval ? "pending" : "approved";
  const { error } = await supabase
    .from("circle_activity_joins")
    .insert({ activity_id: activity.id, user_id: uid, status });
  if (error) throw error;
  return status;
}

export async function decideJoin(joinId: string, decision: "approved" | "declined") {
  await supabase
    .from("circle_activity_joins")
    .update({ status: decision, decided_at: new Date().toISOString() })
    .eq("id", joinId);
}

export async function setAttended(joinId: string, attended: boolean) {
  await supabase.from("circle_activity_joins").update({ attended }).eq("id", joinId);
}

export async function removeParticipant(joinId: string) {
  await supabase.from("circle_activity_joins").delete().eq("id", joinId);
}

export async function setActivityClosed(activityId: string, closed: boolean) {
  await supabase.from("circle_activities").update({ closed }).eq("id", activityId);
}
