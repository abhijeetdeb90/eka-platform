import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, CalendarDays, Circle, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { UserAvatar } from "@/components/app/Avatar";
import { fetchTopics } from "@/lib/discover";
import { fetchDayLogs, fetchEnrollments, fetchJourneys, dayNumberFor } from "@/lib/membership";
import {
  fetchPersonalCircles,
  fetchRecentTopics,
  fetchUpcomingCircles,
  rankTopicsForProfile,
  wisdomForProfile,
} from "@/lib/home";
import { kindLabel } from "@/lib/circles";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";
import todayImage from "@/assets/monastery-corridor.jpg";
import type { ReactNode } from "react";

/** Shared row styling so every rail item is a real, focusable target. */
const rowClass =
  "group block rounded-lg px-2 py-1.5 transition-colors hover:bg-accent/60 focus-visible:bg-accent/60";

function RailCard({
  label,
  children,
  action,
  className,
}: {
  label: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-label={label}
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/70 transition-shadow duration-500 hover:shadow-calm",
        className,
      )}
    >
      <h2 className="px-5 pt-4 text-[10px] font-normal uppercase tracking-[0.28em] text-muted-foreground">
        {label}
      </h2>
      <div className="flex-1 px-5 pb-4 pt-3">{children}</div>
      {action && <div className="border-t border-border/60 px-5 py-3 text-sm">{action}</div>}
    </section>
  );
}

function RailLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-1.5 rounded-md text-sm text-terracotta transition-colors hover:text-foreground focus-visible:text-foreground"
    >
      {children}
      <ArrowUpRight
        aria-hidden="true"
        className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>
  );
}

export function HomeRail({ dense = false }: { dense?: boolean }) {
  const { data: profile } = useProfile();
  const wisdom = wisdomForProfile(profile);

  const { data: allTopics } = useQuery({ queryKey: ["explore-topics"], queryFn: fetchTopics });
  const { data: journeys } = useQuery({ queryKey: ["journeys"], queryFn: fetchJourneys });
  const { data: enrollments } = useQuery({ queryKey: ["enrollments"], queryFn: fetchEnrollments });
  const { data: logs } = useQuery({ queryKey: ["day-logs"], queryFn: fetchDayLogs });
  const { data: circles } = useQuery({
    queryKey: ["upcoming-circles"],
    queryFn: fetchUpcomingCircles,
  });
  const { data: recentTopics } = useQuery({
    queryKey: ["my-recent-topics"],
    queryFn: fetchRecentTopics,
  });

  const { data: suggestedCircles } = useQuery({
    queryKey: [
      "personal-circles",
      profile?.religion ?? "",
      (profile?.interests ?? []).join(","),
      (recentTopics ?? []).join(","),
    ],
    queryFn: () => fetchPersonalCircles(profile, recentTopics ?? []),
    enabled: (circles?.length ?? 0) === 0,
  });

  const { data: people } = useQuery({
    queryKey: ["rail-people", profile?.religion ?? "", (profile?.interests ?? []).join(",")],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, bio, religion, interests")
        .neq("id", auth.user?.id ?? "")
        .not("username", "is", null)
        .limit(24);

      const religion = (profile?.religion ?? "").toLowerCase();
      const mine = new Set((profile?.interests ?? []).map((i) => i.toLowerCase()));
      return (data ?? [])
        .map((p, i) => {
          const theirs = ((p as { interests?: string[] }).interests ?? []).map((x) =>
            x.toLowerCase(),
          );
          let score = theirs.filter((t) => mine.has(t)).length * 2;
          if (
            religion &&
            ((p as { religion?: string | null }).religion ?? "").toLowerCase() === religion
          )
            score += 3;
          return { p, i, score };
        })
        .sort((a, b) => b.score - a.score || a.i - b.i)
        .slice(0, 3)
        .map((x) => ({ ...x.p, matched: x.score > 0 }));
    },
  });

  const topics = rankTopicsForProfile(allTopics ?? [], profile).slice(0, 3);
  const active = (enrollments ?? []).find((e) => !e.completed_at);
  const activeJourney = active
    ? (journeys ?? []).find((j) => j.id === active.journey_id)
    : undefined;
  const day = active && activeJourney ? dayNumberFor(active, activeJourney.duration_days) : 0;
  const done = active ? (logs ?? []).filter((l) => l.journey_id === active.journey_id).length : 0;

  const faithNote = profile?.religion ? `Chosen for your ${profile.religion} path` : null;

  return (
    <div
      className={cn(
        "gap-4",
        dense ? "grid grid-cols-1 sm:grid-cols-2 sm:auto-rows-fr" : "flex flex-col",
      )}
    >
      <section
        aria-label="EKA Today"
        className={cn(
          "overflow-hidden rounded-2xl border border-border/70 bg-card transition-shadow duration-500 hover:shadow-lift",
          dense && "sm:col-span-2",
        )}
      >
        <div className="relative">
          <img
            src={todayImage}
            alt="Sunlight falling across an old cloister corridor"
            loading="lazy"
            width={1280}
            height={960}
            className={cn("w-full object-cover", dense ? "h-32 sm:h-36" : "h-40")}
          />
          <span className="absolute left-4 top-4 rounded-full bg-background/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-foreground backdrop-blur">
            EKA Today
          </span>
        </div>
        <div className="px-5 py-4">
          <p className="font-display text-lg leading-snug">“{wisdom.line}”</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {wisdom.source}
            {faithNote ? ` · ${faithNote}` : ""}
          </p>
          <div className="mt-4">
            <RailLink to="/app/daily">Read today’s reflection</RailLink>
          </div>
        </div>
      </section>

      <RailCard
        label="Your practice"
        action={<RailLink to="/app/practice">Continue practice</RailLink>}
      >
        <ul className="space-y-1.5 text-sm">
          {[
            { to: "/app/practice", label: "5 min silence", meta: "Sit" },
            { to: "/app/journal", label: "Journal a line", meta: "Write" },
            { to: "/app/observe", label: "Observe today", meta: "Notice" },
          ].map((row) => (
            <li key={row.to}>
              <Link to={row.to} className={cn(rowClass, "flex items-center gap-3")}>
                <Circle
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-terracotta"
                  strokeWidth={1.6}
                />
                <span className="min-w-0 flex-1 truncate">{row.label}</span>
                <span className="shrink-0 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {row.meta}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </RailCard>

      <RailCard label="People & ideas" action={<RailLink to="/app/explore">Explore</RailLink>}>
        <ul className="space-y-1.5">
          {topics.map((t) => (
            <li key={t.id}>
              <Link to="/app/discover/$slug" params={{ slug: t.slug }} className={rowClass}>
                <span className="block text-sm leading-snug">{t.title}</span>
                <span className="block text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {t.tradition}
                </span>
              </Link>
            </li>
          ))}
          {topics.length === 0 && (
            <li className="px-2 text-sm text-muted-foreground">
              Ideas appear here as you add interests.
            </li>
          )}
        </ul>
        {(people?.length ?? 0) > 0 && (
          <ul className="mt-4 space-y-1.5 border-t border-border/60 pt-3">
            {people?.map((p) => (
              <li key={p.id}>
                <Link
                  to="/app/u/$username"
                  params={{ username: p.username ?? "" }}
                  className={cn(rowClass, "flex items-center gap-3")}
                >
                  <UserAvatar profile={p} className="size-8 shrink-0" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm">{p.display_name ?? p.username}</span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {p.matched ? "Shares your path" : p.bio ? p.bio : `@${p.username}`}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </RailCard>

      <RailCard
        label="Upcoming circles"
        action={<RailLink to="/app/sanghas">All circles</RailLink>}
      >
        {(circles?.length ?? 0) > 0 ? (
          <ul className="space-y-1.5">
            {circles?.map((c) => (
              <li key={c.id}>
                <Link
                  to="/app/sanghas/$slug"
                  params={{ slug: c.community_slug }}
                  className={rowClass}
                >
                  <span className="block text-sm leading-snug">{c.title}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <CalendarDays aria-hidden="true" className="size-3 shrink-0" />
                    {new Date(c.starts_at).toLocaleString(undefined, {
                      weekday: "short",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    <span>· {kindLabel(c.kind)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-1.5">
            {(suggestedCircles ?? []).map((c) => (
              <li key={c.id}>
                <Link to="/app/sanghas/$slug" params={{ slug: c.slug }} className={rowClass}>
                  <span className="block text-sm leading-snug">{c.name}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Users aria-hidden="true" className="size-3 shrink-0" />
                    {c.matched ? "Matches your interests" : `${c.member_count} members`} ·{" "}
                    {c.category}
                  </span>
                </Link>
              </li>
            ))}
            {(suggestedCircles?.length ?? 0) === 0 && (
              <li className="px-2 text-sm text-muted-foreground">
                No gatherings on the calendar yet.
              </li>
            )}
          </ul>
        )}
      </RailCard>

      <RailCard
        label="Continue your journey"
        action={
          <RailLink to="/app/journeys">{active ? "Open journey" : "Choose a journey"}</RailLink>
        }
        className={cn(dense && "sm:col-span-2")}
      >
        {active && activeJourney ? (
          <div>
            <p className="font-display text-base leading-snug">{activeJourney.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Day {day} of {activeJourney.duration_days} · {done} reflections kept
            </p>
            <div
              role="progressbar"
              aria-label={`${activeJourney.title} progress`}
              aria-valuenow={day}
              aria-valuemin={0}
              aria-valuemax={activeJourney.duration_days}
              className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-terracotta transition-[width] duration-700"
                style={{ width: `${Math.min(100, (day / activeJourney.duration_days) * 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            A journey gives the week a shape — one small practice a day, held for a season.
          </p>
        )}
      </RailCard>
    </div>
  );
}
