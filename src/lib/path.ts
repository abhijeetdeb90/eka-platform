import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";

/* -------------------------------------------------------------- the idea ---
 * You do not "complete content" on EKA. You keep returning.
 * Path Tokens mark that returning. They are earned by action and consistency,
 * never bought, and they always point back toward the practice itself.
 * -------------------------------------------------------------------------- */

export type PathKind =
  "journey" | "practice" | "journal" | "observe" | "daily" | "weekly" | "community";

export type PathEvent = {
  id: string;
  kind: PathKind;
  ref: string | null;
  tokens: number;
  note: string | null;
  created_at: string;
};

export type UserPath = { user_id: string; tradition: string; stage: string; updated_at: string };

export type ObservationPrompt = {
  id: string;
  body: string;
  invitation: string;
  tradition: string;
  sort_order: number;
};

export type ObservationLog = {
  id: string;
  prompt_id: string | null;
  noticed_on: string;
  note: string | null;
  created_at: string;
};

/* ------------------------------------------------------------ the pillars */

export const PILLARS = [
  { key: "journey", glyph: "🛤️", label: "Journey", action: "Learn & progress", outcome: "Wisdom" },
  { key: "practice", glyph: "🧘", label: "Practice", action: "Do", outcome: "Discipline" },
  { key: "journal", glyph: "📖", label: "Journal", action: "Reflect", outcome: "Self-awareness" },
  { key: "observe", glyph: "👁️", label: "Observe", action: "Notice", outcome: "Awareness" },
] as const;

/* ------------------------------------------------------------- the stages */

export type Stage = {
  key: string;
  glyph: string;
  name: string;
  gate: number;
  line: string;
  invitation: string;
};

export const STAGES: Stage[] = [
  {
    key: "begin",
    glyph: "🌱",
    name: "Beginning",
    gate: 0,
    line: "Begin by becoming aware.",
    invitation: "Show up once. That is the whole of it for now.",
  },
  {
    key: "discipline",
    glyph: "🔥",
    name: "Discipline",
    gate: 150,
    line: "Return, especially on the days you would rather not.",
    invitation: "Steadiness is built from ordinary repetitions, not from intensity.",
  },
  {
    key: "awareness",
    glyph: "🌊",
    name: "Awareness",
    gate: 300,
    line: "Watch the mind instead of believing it.",
    invitation: "Notice what you usually move past.",
  },
  {
    key: "wisdom",
    glyph: "🪷",
    name: "Wisdom",
    gate: 500,
    line: "What you have seen begins to change how you act.",
    invitation: "Let understanding meet conduct.",
  },
  {
    key: "integration",
    glyph: "✨",
    name: "Integration",
    gate: 800,
    line: "The practice stops being separate from the day.",
    invitation: "There is nowhere left to arrive. Continue anyway.",
  },
];

export function stageFor(tokens: number): Stage {
  return [...STAGES].reverse().find((s) => tokens >= s.gate) ?? STAGES[0]!;
}

export function nextStage(tokens: number): Stage | null {
  return STAGES.find((s) => s.gate > tokens) ?? null;
}

export function stageProgress(tokens: number) {
  const current = stageFor(tokens);
  const next = nextStage(tokens);
  if (!next) return { percent: 100, remaining: 0, current, next: null as Stage | null };
  const span = next.gate - current.gate;
  const done = tokens - current.gate;
  return {
    percent: Math.max(0, Math.min(100, Math.round((done / span) * 100))),
    remaining: next.gate - tokens,
    current,
    next,
  };
}

/* --------------------------------------------------- the tradition layer */

/** Universal mechanics; the spiritual worldview stays authentic to each path. */
export const TRADITION_PATHS: Record<string, { label: string; steps: string[] }> = {
  universal: { label: "Universal", steps: ["Attention", "Steadiness", "Honesty", "Service"] },
  hindu: { label: "Hindu", steps: ["Mantra", "Dharma", "Seva", "Atma-vichara"] },
  buddhist: { label: "Buddhist", steps: ["Mindfulness", "Compassion", "Impermanence", "Insight"] },
  christian: { label: "Christian", steps: ["Prayer", "Scripture", "Contemplation", "Service"] },
  islamic: { label: "Islamic", steps: ["Dhikr", "Reflection", "Gratitude", "Character"] },
  sikh: { label: "Sikh", steps: ["Simran", "Seva", "Hukam", "Chardi Kala"] },
  jain: { label: "Jain", steps: ["Ahimsa", "Restraint", "Reflection", "Non-attachment"] },
};

export const TRADITION_KEYS = Object.keys(TRADITION_PATHS);

/** The same practice, spoken in the language of each tradition. */
export const TRADITION_PRACTICE: Record<string, string> = {
  universal: "10 minutes of quiet attention",
  hindu: "Mantra / japa practice",
  buddhist: "10-minute mindfulness meditation",
  christian: "10 minutes of contemplative prayer",
  islamic: "Dhikr and intentional reflection",
  sikh: "Simran — remembrance",
  jain: "Ahimsa reflection",
};

/* ------------------------------------------------------------ the tokens */

export const TOKEN_VALUE = {
  journey: 25,
  practice: 10,
  deepPractice: 20,
  journal: 10,
  observe: 5,
  dailyComplete: 10,
  weekly: 75,
  community: 10,
} as const;

/**
 * Award tokens through the database routine. The server owns the rules:
 * it verifies the action really happened, refuses to pay the same completion
 * twice, keeps a pause between rewards of a kind, applies diminishing returns
 * (full, half, quarter, then nothing) and caps what any single day can produce.
 * The value passed here is only ever a ceiling — never an instruction.
 */
export async function award(
  kind: PathKind,
  base: number,
  ref?: string,
  note?: string,
  dedupe?: string,
): Promise<number> {
  const args: { _kind: string; _base: number; _ref?: string; _note?: string; _dedupe?: string } = {
    _kind: kind,
    _base: base,
  };
  if (ref) args._ref = ref;
  if (note) args._note = note;
  if (dedupe) args._dedupe = dedupe;
  const { data, error } = await supabase.rpc("award_path_tokens", args);
  if (error) return 0;
  return (data as number) ?? 0;
}

export async function fetchEvents(limit = 400): Promise<PathEvent[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("path_events")
    .select("id, kind, ref, tokens, note, created_at")
    .eq("user_id", uid)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as PathEvent[];
}

export async function fetchUserPath(): Promise<UserPath | null> {
  const uid = await currentUserId();
  if (!uid) return null;
  const { data } = await supabase.from("user_path").select("*").eq("user_id", uid).maybeSingle();
  return (data as UserPath) ?? null;
}

export async function setTradition(tradition: string) {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase
    .from("user_path")
    .upsert({ user_id: uid, tradition, updated_at: new Date().toISOString() });
}

export async function syncStage(tokens: number) {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase
    .from("user_path")
    .upsert({ user_id: uid, stage: stageFor(tokens).key, updated_at: new Date().toISOString() });
}

/* ------------------------------------------------------------ observation */

const DAY = 86_400_000;

function isoDay(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export async function fetchObservationPrompts(tradition: string): Promise<ObservationPrompt[]> {
  const { data } = await supabase
    .from("observation_prompts")
    .select("id, body, invitation, tradition, sort_order")
    .in("tradition", ["universal", tradition])
    .order("sort_order");
  return (data ?? []) as ObservationPrompt[];
}

/** A stable prompt per day, so the invitation does not shuffle on refresh. */
export function promptForToday(prompts: ObservationPrompt[]): ObservationPrompt | null {
  if (prompts.length === 0) return null;
  const days = Math.floor(Date.now() / DAY);
  return prompts[days % prompts.length]!;
}

export async function fetchObservationLogs(): Promise<ObservationLog[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("observation_logs")
    .select("id, prompt_id, noticed_on, note, created_at")
    .eq("user_id", uid)
    .order("noticed_on", { ascending: false })
    .limit(120);
  return (data ?? []) as ObservationLog[];
}

export async function recordObservation(promptId: string | null, note: string) {
  const uid = await currentUserId();
  if (!uid) return { error: "Not signed in", tokens: 0 };
  const { error } = await supabase
    .from("observation_logs")
    .upsert(
      { user_id: uid, prompt_id: promptId, note: note || null, noticed_on: isoDay() },
      { onConflict: "user_id,noticed_on" },
    );
  if (error) return { error: error.message, tokens: 0 };
  const tokens = await award("observe", TOKEN_VALUE.observe, promptId ?? undefined);
  return { error: null, tokens };
}

/* -------------------------------------------------------- reading the path */

export function totalTokens(events: PathEvent[]) {
  return events.reduce((sum, e) => sum + e.tokens, 0);
}

export function countsByKind(events: PathEvent[]) {
  const out: Record<PathKind, number> = {
    journey: 0,
    practice: 0,
    journal: 0,
    observe: 0,
    daily: 0,
    weekly: 0,
    community: 0,
  };
  for (const e of events) out[e.kind] += 1;
  return out;
}

export function dayKeys(events: PathEvent[]) {
  return new Set(events.map((e) => e.created_at.slice(0, 10)));
}

/**
 * Consistency, not a streak to be punished for breaking. We count the run of
 * days up to today (or yesterday, so a day in progress does not end it).
 */
export function consistency(events: PathEvent[]) {
  const days = dayKeys(events);
  const today = isoDay();
  const yesterday = isoDay(new Date(Date.now() - DAY));
  let cursor = days.has(today)
    ? new Date()
    : days.has(yesterday)
      ? new Date(Date.now() - DAY)
      : null;
  if (!cursor) return { days: 0, activeToday: days.has(today), returning: days.size > 0 };
  let run = 0;
  while (days.has(isoDay(cursor))) {
    run += 1;
    cursor = new Date(cursor.getTime() - DAY);
  }
  return { days: run, activeToday: days.has(today), returning: days.size > 0 };
}

export function doneToday(events: PathEvent[], kind: PathKind) {
  const today = isoDay();
  return events.some((e) => e.kind === kind && e.created_at.slice(0, 10) === today);
}

export function tokensToday(events: PathEvent[]) {
  const today = isoDay();
  return events
    .filter((e) => e.created_at.slice(0, 10) === today)
    .reduce((s, e) => s + e.tokens, 0);
}

/* ------------------------------------------------------------ daily quest */

export type Quest = {
  kind: PathKind;
  glyph: string;
  title: string;
  detail: string;
  tokens: number;
  done: boolean;
  to: string;
};

export function todaysQuests(events: PathEvent[], tradition: string): Quest[] {
  return [
    {
      kind: "practice",
      glyph: "🧘",
      title: "Practice",
      detail: TRADITION_PRACTICE[tradition] ?? TRADITION_PRACTICE["universal"]!,
      tokens: TOKEN_VALUE.practice,
      done: doneToday(events, "practice"),
      to: "/app/practice",
    },
    {
      kind: "journal",
      glyph: "📖",
      title: "Reflect",
      detail: "Write what you noticed within yourself today",
      tokens: TOKEN_VALUE.journal,
      done: doneToday(events, "journal"),
      to: "/app/journal",
    },
    {
      kind: "observe",
      glyph: "👁️",
      title: "Observe",
      detail: "Notice today's invitation, without changing it",
      tokens: TOKEN_VALUE.observe,
      done: doneToday(events, "observe"),
      to: "/app/observe",
    },
  ];
}

export function dayComplete(quests: Quest[]) {
  return quests.every((q) => q.done);
}

/* --------------------------------------------------------- weekly challenge */

const WEEKLY_THEMES = [
  { name: "The Week of Gratitude", line: "Let thanks be the lens you look through." },
  { name: "The Week of Restraint", line: "Notice the impulse; let it pass unfed." },
  { name: "The Week of Attention", line: "Do one thing at a time, fully." },
  { name: "The Week of Service", line: "Do something useful that no one records." },
];

export function weekStart(d = new Date()) {
  const day = (d.getUTCDay() + 6) % 7;
  const s = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day));
  return s;
}

export function weeklyChallenge(events: PathEvent[]) {
  const start = weekStart();
  const theme = WEEKLY_THEMES[Math.floor(start.getTime() / (7 * DAY)) % WEEKLY_THEMES.length]!;
  const since = events.filter((e) => new Date(e.created_at) >= start);
  const need = 3;
  const parts = (["practice", "journal", "observe"] as PathKind[]).map((kind) => ({
    kind,
    done: Math.min(
      need,
      new Set(since.filter((e) => e.kind === kind).map((e) => e.created_at.slice(0, 10))).size,
    ),
    need,
  }));
  const complete = parts.every((p) => p.done >= p.need);
  const claimed = since.some((e) => e.kind === "weekly");
  return { ...theme, parts, complete, claimed, reward: TOKEN_VALUE.weekly, start };
}

/* -------------------------------------------------------------- milestones */

export type Milestone = {
  code: string;
  glyph: string;
  name: string;
  line: string;
  earned: boolean;
};

export function milestonesFor(
  events: PathEvent[],
  journalCount: number,
  observationCount: number,
): Milestone[] {
  const counts = countsByKind(events);
  const run = consistency(events).days;
  const days = dayKeys(events).size;
  const gaps = hasReturnedAfterBreak(events);

  const defs: Array<[string, string, string, string, boolean]> = [
    ["beginning", "🌱", "The Beginning", "Completed your first practice.", counts.practice >= 1],
    ["discipline", "🔥", "Discipline", "Practised on seven consecutive days.", run >= 7],
    ["witness", "👁️", "The Witness", "Completed 25 observations.", observationCount >= 25],
    ["self-reflector", "📖", "Self-Reflector", "Wrote 30 reflections.", journalCount >= 30],
    ["returning", "🪷", "Returning Within", "Came back to your practice after a break.", gaps],
    ["moon", "🌕", "One Moon Cycle", "Twenty-eight days on your path.", days >= 28],
    ["seeker", "✨", "Seeker", "Completed your first Journey.", counts.journey >= 1],
  ];

  return defs.map(([code, glyph, name, line, earned]) => ({ code, glyph, name, line, earned }));
}

function hasReturnedAfterBreak(events: PathEvent[]) {
  const days = [...dayKeys(events)].sort();
  for (let i = 1; i < days.length; i += 1) {
    const gap = (Date.parse(days[i]!) - Date.parse(days[i - 1]!)) / DAY;
    if (gap >= 3) return true;
  }
  return false;
}

export async function recordMilestones(milestones: Milestone[]) {
  const uid = await currentUserId();
  if (!uid) return;
  const earned = milestones.filter((m) => m.earned).map((m) => ({ user_id: uid, code: m.code }));
  if (earned.length === 0) return;
  await supabase
    .from("path_milestones")
    .upsert(earned, { onConflict: "user_id,code", ignoreDuplicates: true });
}

/* -------------------------------------------------- reflection insights */

const INSIGHT_WORDS: Array<[string, RegExp]> = [
  ["restlessness", /\b(restless|restlessness|agitat\w*|impatien\w*)\b/i],
  ["gratitude", /\b(grateful|gratitude|thankful|blessed)\b/i],
  ["fear", /\b(afraid|fear|anxious|anxiety|worry|worried)\b/i],
  ["anger", /\b(anger|angry|irritat\w*|frustrat\w*)\b/i],
  ["quiet", /\b(quiet|still|calm|peace|peaceful)\b/i],
  ["tiredness", /\b(tired|exhaust\w*|drained|weary)\b/i],
  ["longing", /\b(longing|yearn\w*|miss\w*|ache)\b/i],
];

export type Insight = { word: string; count: number; line: string };

/** Unlocked by reflection milestones — patterns, never judgements. */
export function reflectionInsights(
  entries: Array<{ content: string; created_at: string }>,
): Insight[] {
  const cutoff = Date.now() - 30 * DAY;
  const recent = entries.filter((e) => Date.parse(e.created_at) >= cutoff);
  const out: Insight[] = [];
  for (const [word, re] of INSIGHT_WORDS) {
    const count = recent.filter((e) => re.test(e.content)).length;
    if (count >= 3) {
      out.push({
        word,
        count,
        line: `You have written about ${word} in ${count} reflections this month.`,
      });
    }
  }
  return out.sort((a, b) => b.count - a.count).slice(0, 3);
}

export function reflectionMilestone(count: number) {
  if (count >= 100)
    return { glyph: "✨", name: "Witness", line: "100 moments of intentional reflection." };
  if (count >= 30)
    return {
      glyph: "🔥",
      name: "A Month of Reflection",
      line: "Thirty times you stopped to look.",
    };
  if (count >= 7)
    return {
      glyph: "🪷",
      name: "First Reflection",
      line: "You have looked inward for seven days.",
    };
  return null;
}
