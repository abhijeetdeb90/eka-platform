import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UnlockNotice, useUnlocks } from "@/components/app/UnlockGate";
import { journeyAccess } from "@/lib/unlocks";
import { Check, Lock } from "lucide-react";
import { toast } from "sonner";
import { AppScreen, EmptyState } from "@/components/app/AppScreen";
import { EntitlementStrip } from "@/components/app/EntitlementStrip";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  arcDayFor,
  dayNumberFor,
  enroll,
  fetchDayLogs,
  fetchEnrollments,
  fetchJourneyDays,
  fetchJourneys,
  leaveJourney,
  weekFor,
} from "@/lib/membership";

export const Route = createFileRoute("/_authenticated/app/journeys/$slug")({
  component: JourneyDetail,
});

function JourneyDetail() {
  const { slug } = Route.useParams();
  const qc = useQueryClient();
  const { tokens, entitlement } = useUnlocks();

  const { data: journeys, isLoading } = useQuery({
    queryKey: ["journeys"],
    queryFn: fetchJourneys,
  });
  const { data: enrollments } = useQuery({ queryKey: ["enrollments"], queryFn: fetchEnrollments });
  const { data: logs } = useQuery({ queryKey: ["day-logs"], queryFn: fetchDayLogs });

  const journey = journeys?.find((j) => j.slug === slug);
  const { data: days } = useQuery({
    queryKey: ["journey-days", journey?.id],
    queryFn: () => fetchJourneyDays(journey!.id),
    enabled: !!journey,
  });

  const enrollment = enrollments?.find((e) => e.journey_id === journey?.id);
  const completed = new Set(
    (logs ?? []).filter((l) => l.journey_id === journey?.id).map((l) => l.day_number),
  );
  const currentDay = enrollment && journey ? dayNumberFor(enrollment, journey.duration_days) : null;

  const invalidate = async () => {
    await qc.invalidateQueries({ queryKey: ["enrollments"] });
    await qc.invalidateQueries({ queryKey: ["day-logs"] });
  };

  const begin = useMutation({
    mutationFn: () => enroll(journey!.id),
    onSuccess: async () => {
      await invalidate();
      toast.success("Journey begun. Day one is waiting in EKA Daily.");
    },
  });
  const leave = useMutation({
    mutationFn: () => leaveJourney(journey!.id),
    onSuccess: invalidate,
  });

  if (isLoading) return <AppScreen title="Journey">Opening the path…</AppScreen>;
  if (!journey)
    return (
      <AppScreen title="Journey">
        <EmptyState title="Not found" body="That journey is not here." />
      </AppScreen>
    );

  const milestones = Math.ceil(journey.duration_days / 7);
  const access = journeyAccess(journey.duration_days, tokens, entitlement);
  const locked = !access.allowed && !enrollment;

  return (
    <AppScreen
      eyebrow={`${journey.duration_days} days · ${journey.theme}`}
      title={journey.title}
      action={
        enrollment ? (
          <Button size="sm" variant="outline" onClick={() => leave.mutate()}>
            Leave
          </Button>
        ) : locked ? null : (
          <Button size="sm" disabled={begin.isPending} onClick={() => begin.mutate()}>
            Begin
          </Button>
        )
      }
    >
      <EntitlementStrip />
      {locked && <UnlockNotice access={access} tokens={tokens} />}
      <p className="leading-relaxed text-muted-foreground">{journey.summary}</p>

      <p className="rounded-2xl border border-primary/30 bg-primary-soft/30 p-5 leading-relaxed">
        {journey.promise}
      </p>

      {enrollment && currentDay && (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-display text-2xl">{currentDay}</p>
              <p className="text-xs text-muted-foreground">Where I am</p>
            </div>
            <div>
              <p className="font-display text-2xl">{completed.size}</p>
              <p className="text-xs text-muted-foreground">Days done</p>
            </div>
            <div>
              <p className="font-display text-2xl">{weekFor(currentDay)}</p>
              <p className="text-xs text-muted-foreground">of {milestones} milestones</p>
            </div>
          </div>
          <Button asChild className="mt-5 w-full">
            <Link to="/app/daily">Open today</Link>
          </Button>
        </section>
      )}

      <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
        <h2 className="font-display text-base">The seven-day arc</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {journey.duration_days > 7
            ? "This arc repeats and deepens each week for the length of the journey."
            : "Seven days, seven distinct movements."}
        </p>
        <ol className="mt-4 space-y-4">
          {days?.map((d) => {
            const isToday = currentDay !== null && arcDayFor(currentDay) === d.arc_day;
            return (
              <li
                key={d.id}
                className={cn(
                  "rounded-xl border p-4",
                  isToday ? "border-primary/50 bg-primary-soft/25" : "border-border",
                )}
              >
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Day {d.arc_day} · {d.minutes} min
                </p>
                <h3 className="mt-1 font-display text-lg leading-snug">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.practice}</p>
                <p className="mt-2 text-sm">{d.reflection}</p>
              </li>
            );
          })}
        </ol>
      </section>

      {enrollment && (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <h2 className="font-display text-base">Your days</h2>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {Array.from({ length: journey.duration_days }, (_, i) => i + 1).map((n) => {
              const done = completed.has(n);
              const locked = currentDay !== null && n > currentDay;
              return (
                <span
                  key={n}
                  title={`Day ${n}`}
                  className={cn(
                    "grid size-7 place-items-center rounded-md border text-[10px]",
                    done
                      ? "border-primary bg-primary text-primary-foreground"
                      : locked
                        ? "border-border text-muted-foreground/50"
                        : "border-border text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-3.5" /> : locked ? <Lock className="size-3" /> : n}
                </span>
              );
            })}
          </div>
        </section>
      )}
    </AppScreen>
  );
}
