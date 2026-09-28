import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";

/* -------------------------------------------------------- wisdom passport ---
 * A lifelong record of what a person explored, owned by that person.
 * Private by default: nothing here leaves the account unless it is switched on.
 * -------------------------------------------------------------------------- */

export type PassportSection =
  "practices" | "traditions" | "journeys" | "teachers" | "circles" | "reflections";

export const SECTION_LABEL: Record<PassportSection, string> = {
  practices: "Practices explored",
  traditions: "Traditions explored",
  journeys: "Journeys",
  teachers: "Teachers learned from",
  circles: "Circles and gatherings",
  reflections: "Reflections and observations",
};

export type Passport = {
  practices: number;
  practice_breakdown: { label: string; tradition: string | null; count: number }[];
  traditions: string[];
  journeys_started: number;
  journeys_completed: number;
  journey_list: { title: string; completed: boolean }[];
  sessions: number;
  teachers: string[];
  circles: number;
  circle_sessions: number;
  reflections: number;
  observations: number;
  tokens: number;
  since: string | null;
};

export type SharedPassport = Partial<Passport> & {
  display_name: string | null;
  username: string | null;
  since: string | null;
};

export type PassportSettings = {
  user_id: string;
  share_enabled: boolean;
  share_slug: string | null;
  sections: Record<PassportSection, boolean>;
};

const EMPTY_SECTIONS: Record<PassportSection, boolean> = {
  practices: false,
  traditions: false,
  journeys: false,
  teachers: false,
  circles: false,
  reflections: false,
};

export async function fetchMyPassport(): Promise<Passport | null> {
  const { data, error } = await supabase.rpc("my_wisdom_passport");
  if (error) throw error;
  return (data as unknown as Passport) ?? null;
}

export async function fetchSharedPassport(slug: string): Promise<SharedPassport | null> {
  const { data, error } = await supabase.rpc("shared_wisdom_passport", { _slug: slug });
  if (error) throw error;
  return (data as unknown as SharedPassport) ?? null;
}

export async function fetchPassportSettings(): Promise<PassportSettings | null> {
  const uid = await currentUserId();
  if (!uid) return null;
  const { data } = await supabase
    .from("wisdom_passport_settings")
    .select("user_id, share_enabled, share_slug, sections")
    .eq("user_id", uid)
    .maybeSingle();
  if (!data)
    return {
      user_id: uid,
      share_enabled: false,
      share_slug: null,
      sections: { ...EMPTY_SECTIONS },
    };
  return {
    user_id: data.user_id,
    share_enabled: data.share_enabled,
    share_slug: data.share_slug,
    sections: { ...EMPTY_SECTIONS, ...((data.sections ?? {}) as Record<PassportSection, boolean>) },
  };
}

export async function savePassportSettings(next: Omit<PassportSettings, "user_id">) {
  const uid = await currentUserId();
  if (!uid) return { error: new Error("Not signed in") };
  const { error } = await supabase.from("wisdom_passport_settings").upsert(
    {
      user_id: uid,
      share_enabled: next.share_enabled,
      share_slug: next.share_slug,
      sections: next.sections as never,
    },
    { onConflict: "user_id" },
  );
  return { error };
}

/** Short, unguessable link fragment. Regenerating it revokes the old link. */
export function newShareSlug() {
  const bytes = crypto.getRandomValues(new Uint8Array(9));
  return Array.from(bytes, (b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 14);
}

export async function deletePassportSharing() {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase.from("wisdom_passport_settings").delete().eq("user_id", uid);
}

/** A plain-text export the member owns. */
export function passportToText(p: Passport): string {
  const lines = [
    "My Wisdom Passport — EKA",
    p.since ? `Since ${new Date(p.since).toLocaleDateString()}` : "",
    "",
    `Practices completed: ${p.practices}`,
    ...p.practice_breakdown.map(
      (x) => `  ${x.label}${x.tradition ? ` (${x.tradition})` : ""} — ${x.count}`,
    ),
    `Traditions explored: ${p.traditions.join(", ") || "—"}`,
    `Journeys started: ${p.journeys_started} · completed: ${p.journeys_completed}`,
    ...p.journey_list.map((j) => `  ${j.title}${j.completed ? " — completed" : ""}`),
    `Sessions with teachers: ${p.sessions}`,
    `Teachers: ${p.teachers.join(", ") || "—"}`,
    `Circles joined: ${p.circles} · gatherings attended: ${p.circle_sessions}`,
    `Reflections written: ${p.reflections} · observations noted: ${p.observations}`,
    `Path tokens: ${p.tokens}`,
  ];
  return lines.filter((l) => l !== undefined).join("\n");
}

/* ---------------------------------------------------- granular share links ---
 * Each link is independent: its own name, its own chosen sections, its own
 * revoke switch. Editing or revoking one never touches another.
 * -------------------------------------------------------------------------- */

export type PassportShare = {
  id: string;
  slug: string;
  label: string;
  sections: Record<PassportSection, boolean>;
  revoked_at: string | null;
  expires_at: string | null;
  view_count: number;
  created_at: string;
};

function normaliseSections(raw: unknown): Record<PassportSection, boolean> {
  return { ...EMPTY_SECTIONS, ...((raw ?? {}) as Record<PassportSection, boolean>) };
}

export async function fetchPassportShares(): Promise<PassportShare[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data, error } = await supabase
    .from("passport_shares")
    .select("id, slug, label, sections, revoked_at, expires_at, view_count, created_at")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    label: row.label,
    sections: normaliseSections(row.sections),
    revoked_at: row.revoked_at,
    expires_at: row.expires_at,
    view_count: row.view_count,
    created_at: row.created_at,
  }));
}

export async function createPassportShare(
  label: string,
  sections: Record<PassportSection, boolean>,
) {
  const uid = await currentUserId();
  if (!uid) return { error: new Error("Not signed in") };
  const { error } = await supabase.from("passport_shares").insert({
    user_id: uid,
    slug: newShareSlug(),
    label: label.trim() || "Untitled link",
    sections: sections as never,
  });
  return { error };
}

export async function updateShareSections(id: string, sections: Record<PassportSection, boolean>) {
  const { error } = await supabase
    .from("passport_shares")
    .update({ sections: sections as never })
    .eq("id", id);
  return { error };
}

export async function renamePassportShare(id: string, label: string) {
  const { error } = await supabase
    .from("passport_shares")
    .update({ label: label.trim() || "Untitled link" })
    .eq("id", id);
  return { error };
}

/** Revoking is one-way for that link only; every other link keeps working. */
export async function revokePassportShare(id: string) {
  const { error } = await supabase
    .from("passport_shares")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id);
  return { error };
}

export async function restorePassportShare(id: string) {
  const { error } = await supabase
    .from("passport_shares")
    .update({ revoked_at: null })
    .eq("id", id);
  return { error };
}

export async function deletePassportShare(id: string) {
  const { error } = await supabase.from("passport_shares").delete().eq("id", id);
  return { error };
}

/** A link created through the granular system; falls back to the legacy single link. */
export async function fetchPassportByToken(
  slug: string,
): Promise<(SharedPassport & { label?: string }) | null> {
  const { data } = await supabase.rpc("passport_by_token", { _slug: slug });
  if (data) return data as unknown as SharedPassport & { label?: string };
  return fetchSharedPassport(slug);
}
