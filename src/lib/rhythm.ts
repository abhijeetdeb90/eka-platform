import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";
import { TOKEN_VALUE, award, type PathKind } from "@/lib/path";

/* -------------------------------------------------------------- the idea ---
 * Rhythm is not a habit tracker. It is a set of small moments, kept.
 * Nothing here punishes a missed day: the lifetime count never resets, and
 * the copy always points back to beginning again rather than to a broken run.
 * -------------------------------------------------------------------------- */

export type Pillar = "practice" | "observe" | "journal" | "journey";

export type Reminder = {
  id: string;
  glyph: string;
  label: string;
  guidance: string;
  time_of_day: string; // "06:30:00"
  days_of_week: number[]; // 0 = Sunday
  pillar: Pillar;
  intention: string | null;
  active: boolean;
  notify: boolean;
  shift_suggestion_dismissed_at: string | null;
  window_suggestion_dismissed_at: string | null;
  intention_shown_at: string | null;
  sort_order: number;
  created_at: string;
};

export type Completion = {
  id: string;
  reminder_id: string | null;
  done_on: string;
  minute_of_day: number;
  completed_at: string;
};

export const INTENTIONS = [
  "Peace",
  "Discipline",
  "Devotion",
  "Awareness",
  "Healing",
  "Gratitude",
  "Learning",
] as const;

export const PILLAR_ROUTE: Record<Pillar, string> = {
  practice: "/app/practice",
  observe: "/app/observe",
  journal: "/app/journal",
  journey: "/app/journeys",
};

export const PILLAR_GLYPH: Record<Pillar, string> = {
  practice: "🧘",
  observe: "👁️",
  journal: "📖",
  journey: "🛤️",
};

const PILLAR_TOKENS: Record<Pillar, number> = {
  practice: TOKEN_VALUE.practice,
  observe: TOKEN_VALUE.observe,
  journal: TOKEN_VALUE.journal,
  journey: TOKEN_VALUE.journey,
};

export const DEFAULT_MOMENTS: Array<
  Omit<
    Reminder,
    | "id"
    | "created_at"
    | "sort_order"
    | "active"
    | "notify"
    | "intention"
    | "shift_suggestion_dismissed_at"
    | "window_suggestion_dismissed_at"
    | "intention_shown_at"
  >
> = [
  {
    glyph: "🌅",
    label: "Morning Moment",
    guidance: "Begin your day with intention.",
    time_of_day: "06:30:00",
    days_of_week: [0, 1, 2, 3, 4, 5, 6],
    pillar: "practice",
  },
  {
    glyph: "☀️",
    label: "Midday Pause",
    guidance: "Pause. Notice your breath. Notice your mind.",
    time_of_day: "12:30:00",
    days_of_week: [0, 1, 2, 3, 4, 5, 6],
    pillar: "observe",
  },
  {
    glyph: "🌆",
    label: "Evening Reflection",
    guidance: "What did today teach you?",
    time_of_day: "18:30:00",
    days_of_week: [0, 1, 2, 3, 4, 5, 6],
    pillar: "journey",
  },
  {
    glyph: "🌙",
    label: "Night Journal",
    guidance: "Write one honest line before sleep.",
    time_of_day: "21:30:00",
    days_of_week: [0, 1, 2, 3, 4, 5, 6],
    pillar: "journal",
  },
];

/* ------------------------------------------------------------------ time */

export function minutesOf(timeOfDay: string) {
  const [h, m] = timeOfDay.split(":");
  return Number(h) * 60 + Number(m ?? 0);
}

export function formatTime(timeOfDay: string) {
  const total = minutesOf(timeOfDay);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const suffix = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatMinutes(total: number) {
  return formatTime(
    `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`,
  );
}

export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dayKeyOffset(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return todayKey(d);
}

/* ----------------------------------------------------------------- reads */

export async function fetchReminders(): Promise<Reminder[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("rhythm_reminders")
    .select("*")
    .eq("user_id", uid)
    .order("time_of_day", { ascending: true });
  return (data ?? []) as Reminder[];
}

export async function fetchCompletions(days = 120): Promise<Completion[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("rhythm_completions")
    .select("id, reminder_id, done_on, minute_of_day, completed_at")
    .eq("user_id", uid)
    .gte("done_on", dayKeyOffset(days))
    .order("done_on", { ascending: false });
  return (data ?? []) as Completion[];
}

/* ---------------------------------------------------------------- writes */

export async function seedDefaultMoments() {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase
    .from("rhythm_reminders")
    .insert(DEFAULT_MOMENTS.map((m, i) => ({ ...m, user_id: uid, sort_order: i })));
}

export async function createReminder(input: {
  glyph: string;
  label: string;
  guidance: string;
  time_of_day: string;
  days_of_week: number[];
  pillar: Pillar;
  intention: string | null;
  notify: boolean;
}) {
  const uid = await currentUserId();
  if (!uid) return { error: "Please sign in." };
  const { error } = await supabase.from("rhythm_reminders").insert({ ...input, user_id: uid });
  return { error: error?.message ?? null };
}

export async function updateReminder(id: string, patch: Partial<Reminder>) {
  const { error } = await supabase.from("rhythm_reminders").update(patch).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteReminder(id: string) {
  await supabase.from("rhythm_reminders").delete().eq("id", id);
}

/**
 * Marking a moment kept awards tokens through the shared path economy, so the
 * same daily tapering applies — Rhythm cannot be farmed for progression.
 */
export async function keepMoment(
  reminder: Reminder,
): Promise<{ error: string | null; tokens: number }> {
  const uid = await currentUserId();
  if (!uid) return { error: "Please sign in.", tokens: 0 };
  const now = new Date();
  const { error } = await supabase.from("rhythm_completions").insert({
    user_id: uid,
    reminder_id: reminder.id,
    done_on: todayKey(now),
    minute_of_day: now.getHours() * 60 + now.getMinutes(),
  });
  if (error) {
    return { error: error.code === "23505" ? "Already kept today." : error.message, tokens: 0 };
  }
  const tokens = await award(
    reminder.pillar as PathKind,
    PILLAR_TOKENS[reminder.pillar],
    reminder.label,
  );
  return { error: null, tokens };
}

/* -------------------------------------------------------------- today ---- */

export type Moment = {
  reminder: Reminder;
  done: boolean;
  minutes: number;
  overdue: boolean;
  scheduledToday: boolean;
};

export function todaysMoments(
  reminders: Reminder[],
  completions: Completion[],
  now = new Date(),
): Moment[] {
  const key = todayKey(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const doneIds = new Set(completions.filter((c) => c.done_on === key).map((c) => c.reminder_id));
  return reminders
    .filter((r) => r.active)
    .map((r) => {
      const minutes = minutesOf(r.time_of_day);
      const done = doneIds.has(r.id);
      const scheduledToday = r.days_of_week.includes(now.getDay());
      return {
        reminder: r,
        done,
        minutes,
        scheduledToday,
        overdue: scheduledToday && !done && nowMinutes > minutes,
      };
    })
    .sort((a, b) => a.minutes - b.minutes);
}

export function nextMoment(moments: Moment[], now = new Date()): Moment | null {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const pending = moments.filter((m) => m.scheduledToday && !m.done);
  return pending.find((m) => m.minutes >= nowMinutes) ?? pending[0] ?? null;
}

/* --------------------------------------------------------- consistency -- */

export function keptDays(completions: Completion[]) {
  return new Set(completions.map((c) => c.done_on));
}

/** Days kept in a row, counted back from today or yesterday — never negative, never punishing. */
export function currentRhythm(completions: Completion[]) {
  const days = keptDays(completions);
  let start = 0;
  if (!days.has(dayKeyOffset(0))) {
    if (!days.has(dayKeyOffset(1))) return 0;
    start = 1;
  }
  let count = 0;
  for (let i = start; i < 400; i++) {
    if (!days.has(dayKeyOffset(i))) break;
    count++;
  }
  return count;
}

/** Every day ever kept. A pause never removes one. */
export function lifetimeDays(completions: Completion[]) {
  return keptDays(completions).size;
}

export function weekStrip(completions: Completion[], now = new Date()) {
  const days = keptDays(completions);
  const monday = new Date(now);
  const shift = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - shift);
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  const cells = labels.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = todayKey(d);
    return { label, key, kept: days.has(key), future: d > now, today: key === todayKey(now) };
  });
  return { cells, kept: cells.filter((c) => c.kept).length };
}

export function consistencyRing(completions: Completion[], window = 25) {
  const days = keptDays(completions);
  let kept = 0;
  for (let i = 0; i < window; i++) if (days.has(dayKeyOffset(i))) kept++;
  return { kept, window, percent: Math.round((kept / window) * 100) };
}

/* ---------------------------------------------------------- suggestions -- */

export type Suggestion =
  | { kind: "shift"; reminder: Reminder; line: string }
  | {
      kind: "window";
      reminder: Reminder;
      line: string;
      suggested: string;
      from: number;
      to: number;
    };

function scheduledOccurrences(reminder: Reminder, lookback = 21) {
  let n = 0;
  for (let i = 1; i <= lookback; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (reminder.days_of_week.includes(d.getDay()) && new Date(reminder.created_at) <= d) n++;
  }
  return n;
}

/**
 * EKA notices, then asks. It never moves a reminder on its own, and a declined
 * suggestion stays quiet.
 */
export function suggestionsFor(reminders: Reminder[], completions: Completion[]): Suggestion[] {
  const out: Suggestion[] = [];
  const recent = new Set([...Array(21).keys()].map((i) => dayKeyOffset(i + 1)));

  for (const r of reminders.filter((x) => x.active)) {
    const mine = completions.filter((c) => c.reminder_id === r.id);
    const recentKept = mine.filter((c) => recent.has(c.done_on));
    const scheduled = scheduledOccurrences(r);
    const missed = Math.max(0, scheduled - recentKept.length);

    if (
      !r.shift_suggestion_dismissed_at &&
      scheduled >= 6 &&
      missed >= 5 &&
      recentKept.length <= 2
    ) {
      out.push({
        kind: "shift",
        reminder: r,
        line: `${formatTime(r.time_of_day)} seems difficult for you. Move your ${r.label.toLowerCase()}?`,
      });
      continue;
    }

    if (!r.window_suggestion_dismissed_at && mine.length >= 8) {
      const mins = mine.map((c) => c.minute_of_day).sort((a, b) => a - b);
      const lo = mins[Math.floor(mins.length * 0.2)]!;
      const hi = mins[Math.floor(mins.length * 0.8)]!;
      const mid = Math.round((lo + hi) / 2);
      if (hi - lo <= 90 && Math.abs(mid - minutesOf(r.time_of_day)) >= 20) {
        const hh = String(Math.floor(mid / 60)).padStart(2, "0");
        const mm = String(mid % 60).padStart(2, "0");
        out.push({
          kind: "window",
          reminder: r,
          from: lo,
          to: hi,
          suggested: `${hh}:${mm}:00`,
          line: `You usually practise between ${formatMinutes(lo)}–${formatMinutes(hi)}. Set your reminder around this time?`,
        });
      }
    }
  }
  return out;
}

/** Bring the stated intention back into view, gently and rarely. */
export function intentionNudge(reminders: Reminder[]): { reminder: Reminder; line: string } | null {
  const week = 7 * 24 * 3600 * 1000;
  const due = reminders.filter(
    (r) =>
      r.active &&
      r.intention &&
      (!r.intention_shown_at || Date.now() - Date.parse(r.intention_shown_at) > week),
  );
  const r = due[0];
  if (!r) return null;
  return {
    reminder: r,
    line: `You began this practice with the intention of cultivating ${r.intention!.toLowerCase()}. Take a moment today to notice whether you've experienced it.`,
  };
}

/* -------------------------------------------------------- notifications -- */

export async function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported" as const;
  if (Notification.permission === "granted") return "granted" as const;
  return (await Notification.requestPermission()) as "granted" | "denied" | "default";
}

export function notificationState() {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported" as const;
  return Notification.permission;
}

export function showMomentNotification(m: Moment) {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    Notification.permission !== "granted"
  )
    return;
  new Notification(`${m.reminder.glyph} ${m.reminder.label}`, {
    body: m.reminder.guidance || "A moment for your practice.",
    tag: `eka-${m.reminder.id}-${todayKey()}`,
  });
}

/* ------------------------------------------------------------- settings -- */

export type RhythmSettings = {
  user_id: string;
  channel_in_app: boolean;
  channel_browser: boolean;
  channel_email: boolean;
  dnd_enabled: boolean;
  dnd_start: string;
  dnd_end: string;
  moments_per_day: number;
  auto_adjust: boolean;
  checkins_enabled: boolean;
};

export const DEFAULT_SETTINGS: Omit<RhythmSettings, "user_id"> = {
  channel_in_app: true,
  channel_browser: false,
  channel_email: false,
  dnd_enabled: false,
  dnd_start: "22:00:00",
  dnd_end: "06:00:00",
  moments_per_day: 4,
  auto_adjust: true,
  checkins_enabled: true,
};

export async function fetchSettings(): Promise<RhythmSettings | null> {
  const uid = await currentUserId();
  if (!uid) return null;
  const { data } = await supabase
    .from("rhythm_settings")
    .select("*")
    .eq("user_id", uid)
    .maybeSingle();
  if (data) return data as RhythmSettings;
  return { user_id: uid, ...DEFAULT_SETTINGS };
}

export async function saveSettings(patch: Partial<Omit<RhythmSettings, "user_id">>) {
  const uid = await currentUserId();
  if (!uid) return { error: "Please sign in." };
  const { error } = await supabase
    .from("rhythm_settings")
    .upsert({ user_id: uid, ...DEFAULT_SETTINGS, ...patch }, { onConflict: "user_id" });
  return { error: error?.message ?? null };
}

/** Quiet hours may wrap past midnight, so the comparison is circular. */
export function inQuietHours(
  s: Pick<RhythmSettings, "dnd_enabled" | "dnd_start" | "dnd_end">,
  at = new Date(),
) {
  if (!s.dnd_enabled) return false;
  const now = at.getHours() * 60 + at.getMinutes();
  const start = minutesOf(s.dnd_start);
  const end = minutesOf(s.dnd_end);
  return start <= end ? now >= start && now < end : now >= start || now < end;
}

/** Four moments is the full rhythm; fewer keeps the earliest, most-kept ones. */
export function momentsForCount(reminders: Reminder[], count: number) {
  return [...reminders]
    .sort((a, b) => minutesOf(a.time_of_day) - minutesOf(b.time_of_day))
    .slice(0, count);
}

/** Apply the chosen number of daily moments by pausing the surplus, never deleting. */
export async function applyMomentCount(reminders: Reminder[], count: number) {
  const keep = new Set(momentsForCount(reminders, count).map((r) => r.id));
  await Promise.all(
    reminders
      .filter((r) => r.active !== keep.has(r.id))
      .map((r) => updateReminder(r.id, { active: keep.has(r.id) })),
  );
}

/* ------------------------------------------------------------- check-ins -- */

export type CheckIn = {
  id: string;
  reminder_id: string | null;
  done_on: string;
  intention_note: string;
  reflection: string;
  mood: string | null;
  created_at: string;
};

export async function fetchCheckIns(days = 60): Promise<CheckIn[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("rhythm_checkins")
    .select("id, reminder_id, done_on, intention_note, reflection, mood, created_at")
    .eq("user_id", uid)
    .gte("done_on", dayKeyOffset(days))
    .order("created_at", { ascending: false });
  return (data ?? []) as CheckIn[];
}

export async function saveCheckIn(input: {
  reminderId: string;
  intentionNote: string;
  reflection: string;
  mood?: string | null;
  doneOn?: string;
}) {
  const uid = await currentUserId();
  if (!uid) return { error: "Please sign in." };
  const { error } = await supabase.from("rhythm_checkins").upsert(
    {
      user_id: uid,
      reminder_id: input.reminderId,
      done_on: input.doneOn ?? todayKey(),
      intention_note: input.intentionNote.trim(),
      reflection: input.reflection.trim(),
      mood: input.mood ?? null,
    },
    { onConflict: "reminder_id,done_on" },
  );
  return { error: error?.message ?? null };
}

/**
 * Check-ins are the seed of the journal: your own words, offered back as an
 * opening line rather than a machine's idea of what you should write about.
 */
export function journalPromptsFrom(checkins: CheckIn[], reminders: Reminder[], limit = 3) {
  const label = (id: string | null) => reminders.find((r) => r.id === id)?.label ?? "a moment";
  return checkins
    .filter((c) => c.reflection.trim().length > 0 || c.intention_note.trim().length > 0)
    .slice(0, limit)
    .map((c) => {
      const seed = (c.reflection || c.intention_note).trim();
      const short = seed.length > 90 ? `${seed.slice(0, 90).trimEnd()}…` : seed;
      return {
        id: c.id,
        source: label(c.reminder_id),
        when: c.done_on,
        line: `At your ${label(c.reminder_id).toLowerCase()} you wrote: “${short}” — what has happened since?`,
        seed,
      };
    });
}

/* ----------------------------------------------------------- adjustments -- */

export type Adjustment = {
  id: string;
  reminder_id: string;
  kind: string;
  reason: string;
  from_time: string | null;
  to_time: string | null;
  from_days: number[] | null;
  to_days: number[] | null;
  reverted_at: string | null;
  created_at: string;
};

export async function fetchAdjustments(limit = 20): Promise<Adjustment[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("rhythm_adjustments")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as Adjustment[];
}

export type ProposedAdjustment = {
  reminder: Reminder;
  kind: "time" | "frequency" | "restore";
  reason: string;
  toTime?: string;
  toDays?: number[];
};

const DAY_NAME = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Behaviour-led adjustment. EKA only proposes what the last three weeks of your
 * own practice already show, and every proposal carries the reason in plain words.
 */
export function proposeAdjustments(
  reminders: Reminder[],
  completions: Completion[],
): ProposedAdjustment[] {
  const out: ProposedAdjustment[] = [];
  const recent = new Set([...Array(21).keys()].map((i) => dayKeyOffset(i + 1)));

  for (const r of reminders.filter((x) => x.active)) {
    const mine = completions.filter((c) => c.reminder_id === r.id);
    const kept = mine.filter((c) => recent.has(c.done_on));
    const scheduled = scheduledOccurrences(r);
    if (scheduled < 6) continue;

    // 1. A settled window in your own completions beats the time you first picked.
    if (kept.length >= 6) {
      const mins = kept.map((c) => c.minute_of_day).sort((a, b) => a - b);
      const lo = mins[Math.floor(mins.length * 0.2)]!;
      const hi = mins[Math.floor(mins.length * 0.8)]!;
      const mid = Math.round((lo + hi) / 2);
      if (hi - lo <= 90 && Math.abs(mid - minutesOf(r.time_of_day)) >= 20) {
        out.push({
          reminder: r,
          kind: "time",
          toTime: `${String(Math.floor(mid / 60)).padStart(2, "0")}:${String(mid % 60).padStart(2, "0")}:00`,
          reason: `You kept this ${kept.length} times in the last three weeks, almost always between ${formatMinutes(lo)} and ${formatMinutes(hi)} — not at ${formatTime(r.time_of_day)}.`,
        });
        continue;
      }
    }

    // 2. Rarely kept: fewer days, so the rhythm can be met rather than missed.
    if (kept.length <= 2 && r.days_of_week.length > 3) {
      const byDay = new Map<number, number>();
      for (const c of kept)
        byDay.set(new Date(c.done_on).getDay(), (byDay.get(new Date(c.done_on).getDay()) ?? 0) + 1);
      const preferred = [...byDay.entries()].sort((a, b) => b[1] - a[1]).map(([d]) => d);
      const days = (preferred.length >= 3 ? preferred.slice(0, 3) : [1, 3, 5]).sort();
      out.push({
        reminder: r,
        kind: "frequency",
        toDays: days,
        reason: `Of ${scheduled} scheduled days you kept ${kept.length}. Three days you can meet is worth more than seven you cannot — ${days.map((d) => DAY_NAME[d]).join(", ")}.`,
      });
      continue;
    }

    // 3. Steady on a reduced week: offer the fuller rhythm back.
    if (r.days_of_week.length < 7 && kept.length >= r.days_of_week.length * 2) {
      out.push({
        reminder: r,
        kind: "restore",
        toDays: [0, 1, 2, 3, 4, 5, 6],
        reason: `You have kept this ${kept.length} times recently — steadier than the ${r.days_of_week.length} days you asked for. Return it to every day?`,
      });
    }
  }
  return out;
}

export async function applyAdjustment(p: ProposedAdjustment) {
  const uid = await currentUserId();
  if (!uid) return { error: "Please sign in." };
  const patch: Partial<Reminder> = {};
  if (p.toTime) patch.time_of_day = p.toTime;
  if (p.toDays) patch.days_of_week = p.toDays;
  const { error } = await updateReminder(p.reminder.id, patch);
  if (error) return { error };
  await supabase.from("rhythm_adjustments").insert({
    user_id: uid,
    reminder_id: p.reminder.id,
    kind: p.kind,
    reason: p.reason,
    from_time: p.reminder.time_of_day,
    to_time: p.toTime ?? p.reminder.time_of_day,
    from_days: p.reminder.days_of_week,
    to_days: p.toDays ?? p.reminder.days_of_week,
  });
  return { error: null };
}

export async function revertAdjustment(a: Adjustment) {
  const patch: Partial<Reminder> = {};
  if (a.from_time) patch.time_of_day = a.from_time;
  if (a.from_days) patch.days_of_week = a.from_days;
  await updateReminder(a.reminder_id, patch);
  await supabase
    .from("rhythm_adjustments")
    .update({ reverted_at: new Date().toISOString() })
    .eq("id", a.id);
}

/** Declining a proposal keeps it quiet, using the existing dismissal fields. */
export async function declineAdjustment(p: ProposedAdjustment) {
  const stamp = new Date().toISOString();
  await updateReminder(
    p.reminder.id,
    p.kind === "time"
      ? { window_suggestion_dismissed_at: stamp }
      : { shift_suggestion_dismissed_at: stamp },
  );
}
