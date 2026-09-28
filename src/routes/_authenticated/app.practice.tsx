import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Flame, Timer } from "lucide-react";
import { AppScreen, EmptyState, Panel } from "@/components/app/AppScreen";
import { OfflineBanner } from "@/components/app/OfflineBanner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cached, cacheStamp } from "@/lib/offline";
import {
  TRADITIONS,
  fetchCompletions,
  fetchPractices,
  fetchReadings,
  toggleCompletion,
} from "@/lib/sadhana";
import { useProfile } from "@/hooks/useProfile";

export const Route = createFileRoute("/_authenticated/app/practice")({
  component: PracticeLibrary,
});

function PracticeLibrary() {
  const qc = useQueryClient();
  const { data: profile } = useProfile();
  const [tradition, setTradition] = useState<string | null>(null);

  const { data: practices, isLoading } = useQuery({
    queryKey: ["practices"],
    queryFn: async () => (await cached("practices", fetchPractices)).data,
  });
  const { data: readings } = useQuery({
    queryKey: ["readings"],
    queryFn: async () => (await cached("readings", fetchReadings)).data,
  });
  const { data: completions } = useQuery({
    queryKey: ["practice-completions"],
    queryFn: fetchCompletions,
  });

  const complete = useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) => toggleCompletion(id, done),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["practice-completions"] }),
  });

  const shown = (practices ?? []).filter((p) => !tradition || p.tradition === tradition);
  const reading =
    (readings ?? []).find((r) => r.tradition === (tradition ?? profile?.practices?.[0])) ??
    readings?.[0];

  const savedAt = cacheStamp("readings");

  return (
    <AppScreen eyebrow="Turn inspiration into practice" title="Practice">
      <OfflineBanner
        note={`Your practices and readings are stored on this device${
          savedAt ? `, last saved ${new Date(savedAt).toLocaleString()}` : ""
        }. Completions sync when you're back.`}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Panel title={String(completions?.streak ?? 0)} meta="day streak" />
        <Panel title={String(completions?.totalDays ?? 0)} meta="days practised" />
        <Panel title={String(completions?.todayIds.size ?? 0)} meta="done today" />
      </div>

      {reading && (
        <section className="rounded-2xl border border-border bg-sand/60 p-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            {reading.tradition} · {reading.source}
          </p>
          <p className="mt-3 font-display text-lg leading-relaxed">{reading.body}</p>
        </section>
      )}

      {(readings?.length ?? 0) > 1 && (
        <details className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <summary className="cursor-pointer font-display text-lg">
            Readings kept on this device
          </summary>
          <div className="mt-3 space-y-3">
            {readings?.map((r) => (
              <div key={r.id} className="border-t border-border pt-3 first:border-0 first:pt-0">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {r.tradition} · {r.source}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </details>
      )}

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setTradition(null)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs transition-colors",
            tradition === null
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:bg-accent",
          )}
        >
          All
        </button>
        {TRADITIONS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTradition(t)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              tradition === t
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-accent",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Opening the library…</p>}

      {!isLoading && shown.length === 0 && (
        <EmptyState title="Nothing here yet" body="Try another tradition." />
      )}

      {shown.map((p) => {
        const done = completions?.todayIds.has(p.id) ?? false;
        const total = completions?.totals.get(p.id) ?? 0;
        return (
          <section key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-calm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {p.tradition} · {p.category}
                </p>
                <h2 className="mt-1.5 font-display text-lg leading-snug">{p.title}</h2>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                <Timer className="size-3.5" strokeWidth={1.6} />
                {p.duration_min} min
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
            <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
              {p.steps.map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="shrink-0 text-xs text-primary">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <div className="mt-5 flex items-center gap-3">
              <Button
                size="sm"
                variant={done ? "outline" : "default"}
                disabled={complete.isPending}
                onClick={() => complete.mutate({ id: p.id, done })}
              >
                {done ? <Check className="mr-2 size-4" /> : null}
                {done ? "Completed today" : "Mark complete"}
              </Button>
              {total > 0 && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Flame className="size-3.5" strokeWidth={1.6} />
                  {total} {total === 1 ? "time" : "times"}
                </span>
              )}
            </div>
          </section>
        );
      })}
    </AppScreen>
  );
}
