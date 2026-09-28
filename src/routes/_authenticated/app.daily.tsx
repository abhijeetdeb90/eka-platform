import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Clock, Sunrise } from "lucide-react";
import { toast } from "sonner";
import { AppScreen, EmptyState } from "@/components/app/AppScreen";
import { EntitlementStrip } from "@/components/app/EntitlementStrip";
import { AiCompanion } from "@/components/app/AiCompanion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  PROMPT_KIND_LABEL,
  arcDayFor,
  currentTheme,
  dayNumberFor,
  fetchDailyPrompts,
  fetchDayLogs,
  fetchEnrollments,
  fetchJourneyDays,
  fetchJourneys,
  logJourneyDay,
  promptForToday,
  weekFor,
} from "@/lib/membership";
import { todayISO } from "@/lib/sadhana";

export const Route = createFileRoute("/_authenticated/app/daily")({
  component: DailyScreen,
});

function DailyScreen() {
  const qc = useQueryClient();
  const [reflection, setReflection] = useState("");
  const theme = currentTheme();

  const { data: journeys } = useQuery({ queryKey: ["journeys"], queryFn: fetchJourneys });
  const { data: enrollments } = useQuery({ queryKey: ["enrollments"], queryFn: fetchEnrollments });
  const { data: logs } = useQuery({ queryKey: ["day-logs"], queryFn: fetchDayLogs });
  const { data: prompts } = useQuery({ queryKey: ["daily-prompts"], queryFn: fetchDailyPrompts });

  const active = (enrollments ?? []).find((e) => !e.completed_at);
  const journey = journeys?.find((j) => j.id === active?.journey_id);
  const dayNumber = active && journey ? dayNumberFor(active, journey.duration_days) : null;

  const { data: days } = useQuery({
    queryKey: ["journey-days", journey?.id],
    queryFn: () => fetchJourneyDays(journey!.id),
    enabled: !!journey,
  });

  const today = dayNumber ? days?.find((d) => d.arc_day === arcDayFor(dayNumber)) : undefined;
  const doneToday =
    !!journey &&
    !!dayNumber &&
    (logs ?? []).some((l) => l.journey_id === journey.id && l.day_number === dayNumber);
  const prompt = promptForToday(prompts ?? []);

  const complete = useMutation({
    mutationFn: () => logJourneyDay(journey!.id, dayNumber!, reflection.trim()),
    onSuccess: async () => {
      setReflection("");
      await qc.invalidateQueries({ queryKey: ["day-logs"] });
      toast.success("Day marked. See you tomorrow.");
    },
    onError: () => toast.error("Could not save that just now."),
  });

  return (
    <AppScreen eyebrow={`${theme.name} · ${theme.line}`} title="EKA Daily">
      <EntitlementStrip />
      <p className="text-sm text-muted-foreground">
        {new Date(`${todayISO()}T00:00:00`).toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
        {" — three to ten minutes."}
      </p>

      {journey && dayNumber && today ? (
        <section className="rounded-2xl border border-primary/30 bg-primary-soft/30 p-6 shadow-calm">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            {journey.title} · Day {dayNumber} of {journey.duration_days} · Week {weekFor(dayNumber)}
          </p>
          <h2 className="mt-2 font-display text-2xl leading-snug">{today.title}</h2>
          <p className="mt-4 leading-relaxed">{today.practice}</p>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="size-3.5" strokeWidth={1.6} />
            {today.minutes} min
          </p>

          <div className="mt-6 rounded-xl border border-border bg-background/70 p-4">
            <p className="text-sm font-medium">{today.reflection}</p>
            {doneToday ? (
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="size-4 text-primary" />
                Completed today.
              </p>
            ) : (
              <>
                <Textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Answer in a line or two — this stays private."
                  className="mt-3 min-h-24 resize-none"
                />
                <div className="mt-3">
                  <AiCompanion
                    mode="draft"
                    note={reflection}
                    onUse={(text) => setReflection(reflection ? `${reflection}\n\n${text}` : text)}
                    hint="A quiet opening line, drawn from your own recent reflections."
                  />
                </div>
                <Button
                  className="mt-3"
                  size="sm"
                  disabled={complete.isPending}
                  onClick={() => complete.mutate()}
                >
                  Complete day {dayNumber}
                </Button>
              </>
            )}
          </div>
        </section>
      ) : (
        <EmptyState
          title="You are not on a journey yet"
          body="EKA Daily is strongest when it is one day of something longer. Choose a journey to begin."
        />
      )}

      {!journey && (
        <Button asChild>
          <Link to="/app/journeys">Choose a journey</Link>
        </Button>
      )}

      {prompt && (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-calm">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <Sunrise className="size-3.5" strokeWidth={1.6} />
            {PROMPT_KIND_LABEL[prompt.kind] ?? "Today"} · {prompt.theme}
          </p>
          <h2 className="mt-2 font-display text-xl leading-snug">{prompt.title}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{prompt.body}</p>
          <p className="mt-4 text-sm">{prompt.action}</p>
          <p className="mt-3 text-xs text-muted-foreground">{prompt.minutes} min</p>
        </section>
      )}

      <AiCompanion
        mode="recommend"
        title="What next"
        hint="A suggestion for tomorrow's prompt, grounded in what you have actually written."
      />

      <section className="rounded-2xl border border-border bg-sand/50 p-6">
        <h2 className="font-display text-base">Carry it further</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to="/app/practice">Today's practice</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/app/journal">Write it down</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/app/sanghas">Your circle</Link>
          </Button>
        </div>
      </section>
    </AppScreen>
  );
}
