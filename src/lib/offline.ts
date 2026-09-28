import { useEffect, useState } from "react";

/**
 * Offline mode. Journal entries and scripture readings are the two things a
 * member should never lose when the signal goes. Everything here is local to
 * the device: a read-through cache plus a small write queue that drains the
 * moment connectivity returns.
 */

const PREFIX = "eka.offline.";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function readCache<T>(name: string): T | null {
  if (typeof window === "undefined") return null;
  return safeParse<T>(window.localStorage.getItem(PREFIX + name));
}

export function writeCache<T>(name: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + name, JSON.stringify(value));
  } catch {
    /* storage full or blocked — offline copy is best-effort */
  }
}

export function cacheStamp(name: string): string | null {
  return readCache<string>(`${name}.at`);
}

export function stampCache(name: string) {
  writeCache(`${name}.at`, new Date().toISOString());
}

/** Cache a fetch, and fall back to the cached copy when the fetch fails. */
export async function cached<T>(
  name: string,
  loader: () => Promise<T>,
): Promise<{ data: T; stale: boolean }> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    const local = readCache<T>(name);
    if (local !== null) return { data: local, stale: true };
  }
  try {
    const data = await loader();
    writeCache(name, data);
    stampCache(name);
    return { data, stale: false };
  } catch (error) {
    const local = readCache<T>(name);
    if (local !== null) return { data: local, stale: true };
    throw error;
  }
}

export type QueuedEntry = { id: string; content: string; mood: string | null; created_at: string };

const QUEUE = "journal.queue";

export function pendingEntries(): QueuedEntry[] {
  return readCache<QueuedEntry[]>(QUEUE) ?? [];
}

export function queueEntry(entry: Omit<QueuedEntry, "id" | "created_at">): QueuedEntry {
  const row: QueuedEntry = {
    ...entry,
    id: `offline-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    created_at: new Date().toISOString(),
  };
  writeCache(QUEUE, [row, ...pendingEntries()]);
  return row;
}

export function clearQueued(ids: string[]) {
  writeCache(
    QUEUE,
    pendingEntries().filter((e) => !ids.includes(e.id)),
  );
}

export function isOffline() {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

/** Hydration-safe: the server always renders as online. */
export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);
  return online;
}

/* ── Offline edits with safe merging ─────────────────────────────────────── */

export type QueuedEdit = {
  entryId: string;
  content: string;
  mood: string | null;
  baseContent: string;
  baseUpdatedAt: string | null;
  editedAt: string;
};

const EDITS = "journal.edits";

export function pendingEdits(): QueuedEdit[] {
  return readCache<QueuedEdit[]>(EDITS) ?? [];
}

export function queueEdit(edit: QueuedEdit) {
  const rest = pendingEdits().filter((e) => e.entryId !== edit.entryId);
  writeCache(EDITS, [edit, ...rest]);
}

export function clearEdits(entryIds: string[]) {
  writeCache(
    EDITS,
    pendingEdits().filter((e) => !entryIds.includes(e.entryId)),
  );
}

/**
 * Three-way line merge. When the same entry changed here and elsewhere while
 * this device was offline, both versions survive — nothing a member wrote is
 * ever silently dropped.
 */
export function mergeText(
  base: string,
  mine: string,
  theirs: string,
): { text: string; conflicted: boolean } {
  if (mine === theirs) return { text: mine, conflicted: false };
  if (theirs === base) return { text: mine, conflicted: false };
  if (mine === base) return { text: theirs, conflicted: false };

  const baseLines = new Set(base.split("\n"));
  const theirLines = theirs.split("\n");
  const mineLines = mine.split("\n");

  // Lines added on this device that the other version does not already have.
  const theirSet = new Set(theirLines);
  const onlyMine = mineLines.filter((l) => !baseLines.has(l) && !theirSet.has(l));
  if (onlyMine.length === 0) return { text: theirs, conflicted: false };

  return {
    text: `${theirs}\n\n— kept from this device —\n${onlyMine.join("\n")}`,
    conflicted: true,
  };
}
