import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppScreen } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";
import { useProfile } from "@/hooks/useProfile";
import { fetchCompletions } from "@/lib/sadhana";
import {
  currentTheme,
  dayNumberFor,
  fetchDayLogs,
  fetchEnrollments,
  fetchJourneys,
} from "@/lib/membership";

export const Route = createFileRoute("/_authenticated/app/dashboard")({
  component: Dashboard,
});

async function fetchCounts() {
  const uid = await currentUserId();
  if (!uid) return { reflections: 0, circles: 0, contributions: 0 };
  const [journal, circles, posts] = await Promise.all([
    supabase
      .from("journal_entries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", uid),
    supabase
      .from("community_members")
      .select("id", { count: "exact", head: true })
      .eq("user_id", uid),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("author_id", uid),
  ]);
  return {
    reflections: journal.count ?? 0,
    circles: circles.count ?? 0,
    contributions: posts.count ?? 0,
  };
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-calm">
      <p className="font-display text-2xl">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Dashboard() {
  const theme = currentTheme();
  const { data: profile } = useProfile();
  const { data: journeys } = useQuery({ queryKey: ["journeys"], queryFn: fetchJourneys });
  const { data: enrollments } = useQuery({ queryKey: ["enrollments"], queryFn: fetchEnrollments });
  const { data: logs } = useQuery({ queryKey: ["day-logs"], queryFn: fetchDayLogs });
  const { data: practice } = useQuery({
    queryKey: ["practice-completions"],
    queryFn: fetchCompletions,
  });
  const { data: counts } = useQuery({ queryKey: ["member-counts"], queryFn: fetchCounts });

  const active = (enrollments ?? []).find((e) => !e.completed_at);
  const journey = journeys?.find((j) => j.id === active?.journey_id);
  const day = active && journey ? dayNumberFor(active, journey.duration_days) : null;
  const journeyDone = (logs ?? []).filter((l) => l.journey_id === journey?.id).length;
  const daysWithEka = profile
    ? Math.max(
        1,
        Math.floor((Date.now() - new Date(profile.created_at).getTime()) / 86_400_000) + 1,
      )
    : 0;

  return (
    <AppScreen eyebrow={`${theme.name} · ${theme.line}`} title="My EKA">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat value={daysWithEka} label="Days with EKA" />
        <Stat value={practice?.streak ?? 0} label="Day streak" />
        <Stat value={(logs ?? []).length} label="Journey days" />
        <Stat value={counts?.reflections ?? 0} label="Reflections" />
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-calm">
        <h2 className="font-display text-base">My journey</h2>
        {journey && day ? (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              {journey.title} — day {day} of {journey.duration_days}
            </p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.round((journeyDone / journey.duration_days) * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {journeyDone} days completed · {journey.promise}
            </p>
            <Button asChild size="sm" className="mt-5">
              <Link to="/app/daily">Open today</Link>
            </Button>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              You are not on a journey. Everything here works better when you are.
            </p>
            <Button asChild size="sm" className="mt-5">
              <Link to="/app/journeys">Choose a journey</Link>
            </Button>
          </>
        )}
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-calm">
          <h2 className="font-display text-base">My circle</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {counts?.circles ? `${counts.circles} circles` : "No circle yet"} — small groups, shared
            rituals, no follower counts.
          </p>
          <Button asChild size="sm" variant="outline" className="mt-4">
            <Link to="/app/sanghas">Find a circle</Link>
          </Button>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-calm">
          <h2 className="font-display text-base">My contribution</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {counts?.contributions ?? 0} offerings shared with the community, and{" "}
            {practice?.totalDays ?? 0} days of practice held.
          </p>
          <Button asChild size="sm" variant="outline" className="mt-4">
            <Link to="/app/create">Share something</Link>
          </Button>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-sand/50 p-6">
        <h2 className="font-display text-base">What changed</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You have kept {(logs ?? []).length + (practice?.totalDays ?? 0)} days of practice and
          written {counts?.reflections ?? 0} reflections since joining. Read them back at the end of
          the month — that is where the change shows up.
        </p>
        <Button asChild size="sm" variant="outline" className="mt-4">
          <Link to="/app/journal">Read my reflections</Link>
        </Button>
      </section>
    </AppScreen>
  );
}
