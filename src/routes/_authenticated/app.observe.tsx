import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Moon } from "lucide-react";
import { AppScreen, EmptyState } from "@/components/app/AppScreen";
import { DailyObservation } from "@/components/app/DailyObservation";
import { Button } from "@/components/ui/button";
import { endFast, fetchFastingLogs, fetchObservances, startFast, todayISO } from "@/lib/sadhana";

export const Route = createFileRoute("/_authenticated/app/observe")({
  component: ObserveScreen,
});

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function ObserveScreen() {
  const qc = useQueryClient();
  const { data: observances, isLoading } = useQuery({
    queryKey: ["observances"],
    queryFn: fetchObservances,
  });
  const { data: fasts } = useQuery({ queryKey: ["fasting-logs"], queryFn: fetchFastingLogs });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["fasting-logs"] });
  const begin = useMutation({
    mutationFn: ({ label, id }: { label: string; id: string | null }) => startFast(label, id),
    onSuccess: invalidate,
  });
  const close = useMutation({ mutationFn: endFast, onSuccess: invalidate });

  const today = todayISO();
  const upcoming = (observances ?? []).filter((o) => o.observed_on >= today);
  const list = upcoming.length > 0 ? upcoming : (observances ?? []);
  const active = (fasts ?? []).find((f) => !f.ended_at);

  return (
    <AppScreen eyebrow="The multi-faith sacred calendar" title="Observe">
      <DailyObservation />
      {active ? (
        <section className="rounded-2xl border border-primary/40 bg-primary-soft/40 p-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Fast in progress
          </p>
          <h2 className="mt-1.5 font-display text-lg">{active.label}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Began {new Date(active.started_at).toLocaleString()}
          </p>
          <Button size="sm" className="mt-4" onClick={() => close.mutate(active.id)}>
            End fast
          </Button>
        </section>
      ) : (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <h2 className="font-display text-lg">No fast in progress</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Begin a fast from any observance below, or start one of your own.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-4"
            onClick={() => begin.mutate({ label: "Personal fast", id: null })}
          >
            Start a personal fast
          </Button>
        </section>
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Reading the calendar…</p>}

      {!isLoading && list.length === 0 && (
        <EmptyState title="No observances yet" body="The calendar will fill in shortly." />
      )}

      {list.map((o) => (
        <section key={o.id} className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {o.tradition}
              </p>
              <h2 className="mt-1.5 font-display text-lg leading-snug">{o.name}</h2>
            </div>
            {o.fasting && (
              <span className="flex shrink-0 items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                <Moon className="size-3.5" strokeWidth={1.6} />
                Fasting
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{fmt(o.observed_on)}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{o.description}</p>
          {o.fasting && !active && (
            <Button
              size="sm"
              variant="outline"
              className="mt-4"
              onClick={() => begin.mutate({ label: o.name, id: o.id })}
            >
              Start this fast
            </Button>
          )}
        </section>
      ))}

      {(fasts?.length ?? 0) > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <h2 className="font-display text-base">Your fasting history</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {fasts?.map((f) => (
              <li key={f.id} className="flex justify-between gap-4">
                <span className="truncate">{f.label}</span>
                <span className="shrink-0 text-xs">
                  {new Date(f.started_at).toLocaleDateString()}
                  {f.ended_at ? ` — ${new Date(f.ended_at).toLocaleDateString()}` : " — ongoing"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AppScreen>
  );
}
