import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { KeyRound, ArrowRight } from "lucide-react";
import { entitlementFor, fetchSubscription } from "@/lib/billing";
import { dayNumberFor, fetchDayLogs, fetchEnrollments, fetchJourneys } from "@/lib/membership";

const STATE_LABEL: Record<string, string> = {
  none: "No membership",
  trialing: "Trial",
  active: "Member",
  ending: "Ending soon",
  paused: "Paused",
  past_due: "Payment retrying",
  canceled: "Ended",
};

/**
 * Always-visible answer to two questions: what can I open right now,
 * and what is the single next thing to do.
 */
export function EntitlementStrip() {
  const { data } = useQuery({
    queryKey: ["entitlement-strip"],
    queryFn: async () => {
      const [sub, enrollments, journeys, logs] = await Promise.all([
        fetchSubscription(),
        fetchEnrollments(),
        fetchJourneys(),
        fetchDayLogs(),
      ]);
      return { sub, enrollments, journeys, logs };
    },
  });

  if (!data) return null;
  const ent = entitlementFor(data.sub);

  const active = data.enrollments.find((e) => !e.completed_at);
  const journey = active ? data.journeys.find((j) => j.id === active.journey_id) : undefined;

  let next: { label: string; to: string; params?: Record<string, string> } = {
    label: "Start a journey — seven days is enough to feel it",
    to: "/app/journeys",
  };
  if (active && journey) {
    const day = dayNumberFor(active, journey.duration_days);
    const doneToday = data.logs.some((l) => l.journey_id === journey.id && l.day_number === day);
    next = doneToday
      ? {
          label: `Day ${day} of ${journey.title} is logged. Today's EKA Daily is next.`,
          to: "/app/daily",
        }
      : {
          label: `Resume ${journey.title} — Day ${day} of ${journey.duration_days}`,
          to: "/app/daily",
        };
  }

  return (
    <section className="rounded-2xl border border-border bg-card/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <KeyRound className="size-4 shrink-0 text-primary" aria-hidden />
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {STATE_LABEL[ent.state] ?? "Membership"}
          </p>
          <span className="truncate text-xs text-muted-foreground">· {ent.message}</span>
        </div>
        {!ent.active ? (
          <Link
            to="/app/plus"
            className="inline-flex items-center gap-1 rounded-full border border-primary px-3 py-1.5 text-xs text-primary"
          >
            Open everything <ArrowRight className="size-3" aria-hidden />
          </Link>
        ) : (
          <Link
            to="/app/billing"
            className="text-xs text-muted-foreground underline underline-offset-4"
          >
            Manage
          </Link>
        )}
      </div>

      <Link
        to={next.to}
        className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm transition-colors hover:bg-accent"
      >
        <span className="min-w-0 truncate">{next.label}</span>
        <ArrowRight className="size-4 shrink-0 text-primary" aria-hidden />
      </Link>

      {!ent.active && (
        <p className="mt-2 text-xs text-muted-foreground">
          Journeys and EKA Daily stay readable. Logging days, reflections and circles need a
          membership.
        </p>
      )}
    </section>
  );
}
