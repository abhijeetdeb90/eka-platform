import { STAGES, stageFor, type Stage } from "@/lib/path";
import type { Entitlement } from "@/lib/billing";

/* ------------------------------------------------------------- the ladder --
 * Two gates, always stated plainly: tokens are earned through practice and can
 * never be bought; membership carries the cost of the guided material and the
 * people who make it. Nothing already written by a member is ever locked away.
 * -------------------------------------------------------------------------- */

export type Unlock = {
  key: string;
  gate: number;
  glyph: string;
  title: string;
  detail: string;
  member: boolean;
};

export const UNLOCKS: Unlock[] = [
  {
    key: "daily",
    gate: 0,
    glyph: "🌱",
    title: "EKA Daily, practices, journal and observation",
    detail: "The whole of your own practice — free, always.",
    member: false,
  },
  {
    key: "rhythm",
    gate: 0,
    glyph: "🕰️",
    title: "Your Rhythm and Sacred Moments",
    detail: "Four daily moments, reminders and your consistency ring.",
    member: false,
  },
  {
    key: "journey-7",
    gate: 0,
    glyph: "🛤️",
    title: "Seven-day journeys",
    detail: "Any journey of a week or less, to see whether this is for you.",
    member: false,
  },
  {
    key: "journey-21",
    gate: 150,
    glyph: "🔥",
    title: "Journeys beyond a week",
    detail: "21 and 30-day arcs open at the Discipline stage.",
    member: true,
  },
  {
    key: "circles",
    gate: 150,
    glyph: "🫂",
    title: "Circle activities",
    detail: "Shared sits and gatherings with a Circle matched to you.",
    member: true,
  },
  {
    key: "market",
    gate: 300,
    glyph: "🤝",
    title: "Booking a practitioner",
    detail: "One-to-one guidance from verified practitioners, at the Awareness stage.",
    member: true,
  },
  {
    key: "journey-90",
    gate: 500,
    glyph: "🪷",
    title: "Long journeys, 60 to 90 days",
    detail: "The longest arcs ask for a practice that already holds.",
    member: true,
  },
  {
    key: "integration",
    gate: 800,
    glyph: "✨",
    title: "Integration teachings and mentor sessions",
    detail: "Where the practice stops being separate from the day.",
    member: true,
  },
];

export type Access =
  | { allowed: true; reason: string }
  | {
      allowed: false;
      needs: "tokens" | "membership" | "both";
      missingTokens: number;
      reason: string;
      unlock: Unlock;
    };

export function unlockFor(key: string) {
  return UNLOCKS.find((u) => u.key === key) ?? null;
}

export function checkAccess(
  key: string,
  tokens: number,
  entitlement: Entitlement | null | undefined,
): Access {
  const unlock = unlockFor(key);
  if (!unlock) return { allowed: true, reason: "Open to everyone." };

  const missingTokens = Math.max(0, unlock.gate - tokens);
  const needsMember = unlock.member && !(entitlement?.active ?? false);

  if (missingTokens === 0 && !needsMember) {
    return {
      allowed: true,
      reason: unlock.gate > 0 ? `Unlocked at ${unlock.gate} Path Tokens.` : "Open to everyone.",
    };
  }

  const needs =
    missingTokens > 0 && needsMember ? "both" : missingTokens > 0 ? "tokens" : "membership";
  const reason =
    needs === "both"
      ? `${missingTokens} more Path Tokens and an active membership open this.`
      : needs === "tokens"
        ? `${missingTokens} more Path Tokens open this. They come from practice, never from payment.`
        : "Membership carries the cost of the guided material and the people who make it.";

  return { allowed: false, needs, missingTokens, reason, unlock };
}

/** Journeys are gated by their own length: a week is free, longer arcs are earned. */
export function journeyUnlockKey(durationDays: number) {
  if (durationDays <= 7) return "journey-7";
  if (durationDays <= 30) return "journey-21";
  return "journey-90";
}

export function journeyAccess(
  durationDays: number,
  tokens: number,
  entitlement: Entitlement | null | undefined,
) {
  return checkAccess(journeyUnlockKey(durationDays), tokens, entitlement);
}

export function marketAccess(tokens: number, entitlement: Entitlement | null | undefined) {
  return checkAccess("market", tokens, entitlement);
}

/** The ladder as the member sees it: earned, next, or later. */
export function ladder(tokens: number, entitlement: Entitlement | null | undefined) {
  return UNLOCKS.map((u) => {
    const access = checkAccess(u.key, tokens, entitlement);
    return { unlock: u, access, earnedTokens: tokens >= u.gate };
  });
}

export function stageOfUnlock(u: Unlock): Stage {
  return [...STAGES].reverse().find((s) => u.gate >= s.gate) ?? stageFor(0);
}

/* ---------------------------------------------------- the preview window --
 * The middle path: the first seven days and the first 100 Path Tokens are open
 * to everyone, so a member can see the whole shape of the practice before any
 * money is asked for. After that, the deeper surfaces move into preview — never
 * a blank wall, and never a member's own words.
 * -------------------------------------------------------------------------- */

export const FREE_DAYS = 7;
export const FREE_TOKENS = 100;

export type PathAreaKey = "practice" | "observe" | "journal-history" | "rhythm" | "journey";

export type PathArea = {
  key: PathAreaKey;
  glyph: string;
  label: string;
  open: string;
  preview: string;
};

export const PATH_AREAS: PathArea[] = [
  {
    key: "practice",
    glyph: "🧘",
    label: "Guided practices",
    open: "Every guided practice in your tradition, in full.",
    preview:
      "Today's practice stays open. The wider library and its guided audio need a membership.",
  },
  {
    key: "observe",
    glyph: "👁️",
    label: "Observe",
    open: "A new observation prompt each day, and your record of what you noticed.",
    preview:
      "Today's prompt stays open. Your observation history and its patterns need a membership.",
  },
  {
    key: "journal-history",
    glyph: "📖",
    label: "Journal history and patterns",
    open: "Every reflection you have written, with the patterns drawn from them.",
    preview:
      "Your words are always yours to read and export. The patterns drawn across them need a membership.",
  },
  {
    key: "rhythm",
    glyph: "🕰️",
    label: "Spiritual Rhythm",
    open: "Four Sacred Moments, gentle reminders and your consistency ring.",
    preview:
      "Today's moments stay open. Smart adjustment, weekly review and reminders need a membership.",
  },
  {
    key: "journey",
    glyph: "🛤️",
    label: "Journey progress",
    open: "Journeys of any length, and the stages they open.",
    preview: "Seven-day Journeys stay open. Longer arcs and stage progress need a membership.",
  },
];

export type PathWindow = { open: boolean; daysLeft: number; tokensLeft: number; reason: string };

/** Where a member stands in the free window, stated plainly. */
export function previewWindow(joinedAt: string | null | undefined, tokens: number): PathWindow {
  const joined = joinedAt ? Date.parse(joinedAt) : Date.now();
  const days = Math.floor((Date.now() - joined) / 86_400_000);
  const daysLeft = Math.max(0, FREE_DAYS - days);
  const tokensLeft = Math.max(0, FREE_TOKENS - tokens);
  const open = daysLeft > 0 || tokensLeft > 0;
  return {
    open,
    daysLeft,
    tokensLeft,
    reason: open
      ? `Everything is open for your first ${FREE_DAYS} days and first ${FREE_TOKENS} Path Tokens — ${daysLeft} ${daysLeft === 1 ? "day" : "days"} and ${tokensLeft} tokens to go.`
      : "Your own practice — today's moments, reflections and observations — stays free always. The deeper surfaces are held by membership.",
  };
}

export type AreaState = { area: PathArea; open: boolean; line: string };

export function pathAreas(
  window: PathWindow,
  entitlement: Entitlement | null | undefined,
): AreaState[] {
  const member = entitlement?.active ?? false;
  return PATH_AREAS.map((area) => {
    const open = member || window.open;
    return { area, open, line: open ? area.open : area.preview };
  });
}
