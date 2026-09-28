import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Lock, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppScreen, EmptyState } from "@/components/app/AppScreen";
import { AiCompanion } from "@/components/app/AiCompanion";
import { OfflineBanner } from "@/components/app/OfflineBanner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";
import { fetchCheckIns, fetchReminders, journalPromptsFrom } from "@/lib/rhythm";
import {
  REFLECTION_MILESTONES,
  claimDueMilestones,
  fetchEarnedMilestones,
  fetchJourneyPrompt,
  nextReflectionMilestone,
} from "@/lib/prompts";
import {
  cached,
  clearEdits,
  clearQueued,
  isOffline,
  mergeText,
  pendingEdits,
  pendingEntries,
  queueEdit,
  queueEntry,
  useOnline,
} from "@/lib/offline";

export const Route = createFileRoute("/_authenticated/app/journal")({
  component: JournalScreen,
});

type Entry = {
  id: string;
  content: string;
  mood: string | null;
  tags: string[];
  created_at: string;
  updated_at?: string | null;
};

async function fetchEntries(): Promise<Entry[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data, error } = await supabase
    .from("journal_entries")
    .select("id, content, mood, tags, created_at, updated_at")
    .eq("user_id", uid)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []) as Entry[];
}

async function pushEntry(content: string, mood: string | null) {
  const uid = await currentUserId();
  if (!uid) throw new Error("Sign in first.");
  const { error } = await supabase.from("journal_entries").insert({ user_id: uid, content, mood });
  if (error) throw error;
  // A reflection earns Path Tokens; the second and third of a day earn less.
  const { award, TOKEN_VALUE } = await import("@/lib/path");
  await award("journal", TOKEN_VALUE.journal);
}

/**
 * Push an edit made offline. If the entry moved on the server while this device
 * was away, both versions are merged — a member's words are never overwritten.
 */
async function pushEdit(edit: {
  entryId: string;
  content: string;
  mood: string | null;
  baseContent: string;
  baseUpdatedAt: string | null;
}): Promise<"clean" | "merged"> {
  const { data: current } = await supabase
    .from("journal_entries")
    .select("content, updated_at")
    .eq("id", edit.entryId)
    .maybeSingle();
  if (!current) throw new Error("Entry is gone.");

  const movedElsewhere = Boolean(edit.baseUpdatedAt) && current.updated_at !== edit.baseUpdatedAt;
  const merged = movedElsewhere
    ? mergeText(edit.baseContent, edit.content, current.content)
    : { text: edit.content, conflicted: false };

  const { error } = await supabase
    .from("journal_entries")
    .update({ content: merged.text, mood: edit.mood })
    .eq("id", edit.entryId);
  if (error) throw error;
  return merged.conflicted ? "merged" : "clean";
}

function JournalScreen() {
  const qc = useQueryClient();
  const online = useOnline();
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [queued, setQueued] = useState<Entry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const { data: entries, isLoading } = useQuery({
    queryKey: ["journal"],
    queryFn: async () => (await cached("journal", fetchEntries)).data,
  });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["journal"] });

  const refreshQueue = () =>
    setQueued(
      pendingEntries().map((e) => ({
        id: e.id,
        content: e.content,
        mood: e.mood,
        tags: [],
        created_at: e.created_at,
      })),
    );

  // Drain anything written offline as soon as the connection returns.
  useEffect(() => {
    refreshQueue();
    if (!online) return;
    const drain = async () => {
      const pending = pendingEntries();
      if (pending.length === 0 && pendingEdits().length === 0) return;
      const done: string[] = [];
      for (const entry of pending) {
        try {
          await pushEntry(entry.content, entry.mood);
          done.push(entry.id);
        } catch {
          break;
        }
      }
      const edits = pendingEdits();
      const editsDone: string[] = [];
      let mergedCount = 0;
      for (const edit of edits) {
        try {
          const result = await pushEdit(edit);
          if (result === "merged") mergedCount += 1;
          editsDone.push(edit.entryId);
        } catch {
          break;
        }
      }
      if (editsDone.length > 0) {
        clearEdits(editsDone);
        void invalidate();
        toast.success(
          mergedCount > 0
            ? `${editsDone.length} offline edit(s) synced · ${mergedCount} merged, nothing lost.`
            : `${editsDone.length} offline edit(s) synced.`,
        );
      }
      if (done.length > 0) {
        clearQueued(done);
        refreshQueue();
        void invalidate();
        toast.success(`${done.length} offline ${done.length === 1 ? "entry" : "entries"} synced.`);
      }
    };
    void drain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online]);

  const { data: checkins } = useQuery({
    queryKey: ["rhythm-checkins"],
    queryFn: () => fetchCheckIns(7),
  });
  const { data: rhythmReminders } = useQuery({
    queryKey: ["rhythm-reminders"],
    queryFn: fetchReminders,
  });
  const prompts = journalPromptsFrom(checkins ?? [], rhythmReminders ?? []);

  // The reflection the member's current Journey is actually asking for today.
  const { data: journeyPrompt } = useQuery({
    queryKey: ["journey-prompt"],
    queryFn: fetchJourneyPrompt,
  });
  const { data: earned } = useQuery({
    queryKey: ["reflection-milestones"],
    queryFn: fetchEarnedMilestones,
  });

  const reflectionCount = (entries ?? []).filter((e) => e.content.trim().length >= 60).length;
  const nextMilestone = nextReflectionMilestone(reflectionCount);
  const earnedCodes = new Set((earned ?? []).map((e) => e.code));

  // Milestones are verified and granted by the database; this only asks.
  useEffect(() => {
    if (!entries || !earned) return;
    void (async () => {
      const got = await claimDueMilestones(reflectionCount, earned);
      if (got > 0) {
        toast.success(`A reflection milestone · +${got} Path Tokens`);
        void qc.invalidateQueries({ queryKey: ["reflection-milestones"] });
        void qc.invalidateQueries({ queryKey: ["path-events"] });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reflectionCount, earned]);

  const save = useMutation({
    mutationFn: async () => {
      const body = content.trim();
      const feeling = mood.trim() || null;
      if (isOffline()) {
        queueEntry({ content: body, mood: feeling });
        refreshQueue();
        return "queued" as const;
      }
      try {
        await pushEntry(body, feeling);
        return "saved" as const;
      } catch {
        queueEntry({ content: body, mood: feeling });
        refreshQueue();
        return "queued" as const;
      }
    },
    onSuccess: (result) => {
      setContent("");
      setMood("");
      invalidate();
      toast.success(
        result === "queued"
          ? "Kept on this device. It syncs when you're back."
          : "Saved to your journal.",
      );
    },
    onError: () => toast.error("Could not save that entry."),
  });

  const saveEdit = useMutation({
    mutationFn: async (entry: Entry) => {
      const payload = {
        entryId: entry.id,
        content: draft.trim(),
        mood: entry.mood,
        baseContent: entry.content,
        baseUpdatedAt: entry.updated_at ?? null,
      };
      if (isOffline()) {
        queueEdit({ ...payload, editedAt: new Date().toISOString() });
        return "queued" as const;
      }
      try {
        return await pushEdit(payload);
      } catch {
        queueEdit({ ...payload, editedAt: new Date().toISOString() });
        return "queued" as const;
      }
    },
    onSuccess: (result) => {
      setEditingId(null);
      invalidate();
      toast.success(
        result === "queued"
          ? "Edit kept on this device — it merges safely when you reconnect."
          : result === "merged"
            ? "Merged with the version already saved. Both are kept."
            : "Entry updated.",
      );
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (id.startsWith("offline-")) {
        clearQueued([id]);
        refreshQueue();
        return;
      }
      await supabase.from("journal_entries").delete().eq("id", id);
    },
    onSuccess: invalidate,
  });

  const all = [...queued, ...(entries ?? [])];

  return (
    <AppScreen eyebrow="Private to you alone" title="Journal">
      <OfflineBanner note="Keep writing — entries are stored on this device and sync the moment you reconnect." />
      {queued.length > 0 && online && (
        <p className="text-xs text-muted-foreground">
          Syncing {queued.length} {queued.length === 1 ? "entry" : "entries"} written offline…
        </p>
      )}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5" strokeWidth={1.6} />
          Nothing written here is ever shared or posted.
        </p>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What is present today?"
          className="mt-4 min-h-32 resize-none border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
        />
        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
          <Input
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Mood (optional)"
          />
          <Button disabled={save.isPending || !content.trim()} onClick={() => save.mutate()}>
            Save entry
          </Button>
        </div>

        {prompts.length > 0 && !content.trim() && (
          <div className="mt-5 border-t border-border/60 pt-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              From your own check-ins
            </p>
            <ul className="mt-2 space-y-2">
              {prompts.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setContent(`${p.line}\n\n`)}
                    className="w-full rounded-xl border border-border/70 p-3 text-left text-sm leading-relaxed transition-colors hover:border-primary hover:bg-accent/40"
                  >
                    {p.line}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {journeyPrompt && !content.trim() && (
          <div className="mt-5 rounded-xl border border-primary/30 bg-primary-soft/30 p-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              {journeyPrompt.journeyTitle} · Day {journeyPrompt.dayNumber}
            </p>
            <p className="mt-2 text-sm">{journeyPrompt.dayTitle}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {journeyPrompt.prompt}
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={() => setContent(`${journeyPrompt.prompt}\n\n`)}
            >
              Write on this
            </Button>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card/60 p-5">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Reflection milestones
        </p>
        <ul className="mt-3 space-y-2">
          {REFLECTION_MILESTONES.map((m) => {
            const done = earnedCodes.has(m.code);
            return (
              <li
                key={m.code}
                className={`flex items-start gap-3 rounded-xl border p-3 ${
                  done ? "border-primary/35 bg-primary/5" : "border-border/70"
                }`}
              >
                <span aria-hidden className={done ? "" : "opacity-40"}>
                  {m.glyph}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.line}</p>
                </div>
                <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {done ? `+${m.tokens}` : `${Math.min(reflectionCount, m.need)}/${m.need}`}
                </span>
              </li>
            );
          })}
        </ul>
        {nextMilestone && (
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {nextMilestone.need - reflectionCount} more reflections reach {nextMilestone.name}.
            There is no hurry, and nothing is lost by pausing.
          </p>
        )}
      </section>

      <AiCompanion
        mode="draft"
        note={content}
        onUse={(text) => setContent(content ? `${content}\n\n${text}` : text)}
        hint="Stuck on the first line? The companion offers an opening in your own register — you finish it."
      />

      <AiCompanion
        mode="summary"
        title="What has changed"
        hint="A short, honest read of your recent reflections. Nothing is shared."
      />

      {isLoading && <p className="text-sm text-muted-foreground">Opening your journal…</p>}

      {!isLoading && all.length === 0 && (
        <EmptyState
          title="Your journal is empty"
          body="Write one honest line. It stays between you and the page."
        />
      )}

      {all.map((e) => (
        <article key={e.id} className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              {new Date(e.created_at).toLocaleString()}
              {e.mood ? ` · ${e.mood}` : ""}
              {e.id.startsWith("offline-") && " · waiting to sync"}
            </p>
            <div className="flex shrink-0 items-center gap-3">
              {!e.id.startsWith("offline-") && (
                <button
                  type="button"
                  aria-label="Edit entry"
                  onClick={() => {
                    setEditingId(e.id);
                    setDraft(e.content);
                  }}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Pencil className="size-4" strokeWidth={1.6} />
                </button>
              )}
              <button
                type="button"
                aria-label="Delete entry"
                onClick={() => remove.mutate(e.id)}
                className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="size-4" strokeWidth={1.6} />
              </button>
            </div>
          </div>
          {editingId === e.id ? (
            <div className="mt-3">
              <Textarea
                value={draft}
                onChange={(ev) => setDraft(ev.target.value)}
                className="min-h-28"
              />
              <div className="mt-2 flex gap-2">
                <Button size="sm" disabled={saveEdit.isPending} onClick={() => saveEdit.mutate(e)}>
                  Save changes
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                  Cancel
                </Button>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Edited offline? Your lines are merged with anything saved elsewhere — nothing is
                overwritten.
              </p>
            </div>
          ) : (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{e.content}</p>
          )}
        </article>
      ))}
    </AppScreen>
  );
}
