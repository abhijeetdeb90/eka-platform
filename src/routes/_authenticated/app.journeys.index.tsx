import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppScreen } from "@/components/app/AppScreen";
import { EntitlementStrip } from "@/components/app/EntitlementStrip";
import { Button } from "@/components/ui/button";
import {
  currentTheme,
  dayNumberFor,
  fetchDayLogs,
  fetchEnrollments,
  fetchJourneys,
} from "@/lib/membership";

export const Route = createFileRoute("/_authenticated/app/journeys/")({
  component: JourneysIndex,
});

function JourneysIndex() {
  const theme = currentTheme();
  const { data: journeys, isLoading } = useQuery({
    queryKey: ["journeys"],
    queryFn: fetchJourneys,
  });
  const { data: enrollments } = useQuery({ queryKey: ["enrollments"], queryFn: fetchEnrollments });
  const { data: logs } = useQuery({ queryKey: ["day-logs"], queryFn: fetchDayLogs });

  return (
    <AppScreen eyebrow={`This month · ${theme.name}`} title="Journeys">
      <EntitlementStrip />
      <p className="text-sm text-muted-foreground">
        Not a library. A path with a beginning, a middle and an end — so you always know where you
        are, what you have done and what changed.
      </p>

      {isLoading && <p className="text-sm text-muted-foreground">Laying out the paths…</p>}

      {journeys?.map((j) => {
        const enrollment = enrollments?.find((e) => e.journey_id === j.id);
        const done = (logs ?? []).filter((l) => l.journey_id === j.id).length;
        const day = enrollment ? dayNumberFor(enrollment, j.duration_days) : null;
        return (
          <Link
            key={j.id}
            to="/app/journeys/$slug"
            params={{ slug: j.slug }}
            className="block rounded-2xl border border-border bg-card p-6 shadow-calm transition-shadow hover:shadow-lift"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {j.duration_days} days · {j.theme} ·{" "}
                  {j.pillar === "one_with_all" ? "One With All" : "One Within"}
                </p>
                <h2 className="mt-1.5 font-display text-xl leading-snug">{j.title}</h2>
              </div>
              {enrollment && (
                <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-[11px] text-primary-foreground">
                  Day {day}
                </span>
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{j.summary}</p>
            <p className="mt-3 text-sm">{j.promise}</p>
            {enrollment && (
              <div className="mt-4">
                <div className="h-1.5 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.round((done / j.duration_days) * 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {done} of {j.duration_days} days completed
                </p>
              </div>
            )}
          </Link>
        );
      })}

      <Button asChild variant="outline">
        <Link to="/app/daily">Go to EKA Daily</Link>
      </Button>
    </AppScreen>
  );
}
