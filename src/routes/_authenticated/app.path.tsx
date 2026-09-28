import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { UnlockLadder } from "@/components/app/UnlockGate";
import { JourneyMap } from "@/components/app/JourneyMap";
import { PathGates } from "@/components/app/PathPreview";
import { useProfile } from "@/hooks/useProfile";
import { entitlementFor, fetchSubscription } from "@/lib/billing";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";
import {
  PILLARS,
  STAGES,
  TOKEN_VALUE,
  TRADITION_KEYS,
  TRADITION_PATHS,
  award,
  consistency,
  countsByKind,
  dayComplete,
  dayKeys,
  fetchEvents,
  fetchObservationLogs,
  fetchUserPath,
  milestonesFor,
  recordMilestones,
  reflectionInsights,
  reflectionMilestone,
  setTradition,
  stageFor,
  stageProgress,
  syncStage,
  todaysQuests,
  tokensToday,
  totalTokens,
  weeklyChallenge,
} from "@/lib/path";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/path")({
  head: () => ({
    meta: [
      { title: "Your Path — progression through practice | EKA" },
      {
        name: "description",
        content:
          "Journey, Practice, Journal and Observe. Earn Path Tokens through sincere daily action, unlock deeper stages, and watch your own consistency rather than a leaderboard.",
      },
      { property: "og:title", content: "Your Path | EKA" },
      {
        property: "og:description",
        content:
          "A devotional progression: Journey, Practice, Journal, Observe — and the tokens that mark your returning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Your Path | EKA" },
      {
        name: "twitter:description",
        content: "A devotional progression: Journey, Practice, Journal, Observe.",
      },
    ],
  }),
  component: PathBoard,
});

async function fetchJournalForInsights() {
  const uid = await currentUserId();
  if (!uid) return [] as Array<{ content: string; created_at: string }>;
  const { data } = await supabase
    .from("journal_entries")
    .select("content, created_at")
    .eq("user_id", uid)
    .order("created_at", { ascending: false })
    .limit(200);
  return (data ?? []) as Array<{ content: string; created_at: string }>;
}

function PathBoard() {
  const qc = useQueryClient();
  const { data: events, isLoading } = useQuery({
    queryKey: ["path-events"],
    queryFn: () => fetchEvents(),
  });
  const { data: userPath } = useQuery({ queryKey: ["user-path"], queryFn: fetchUserPath });
  const { data: observations } = useQuery({
    queryKey: ["observation-logs"],
    queryFn: fetchObservationLogs,
  });
  const { data: journal } = useQuery({
    queryKey: ["journal-insights"],
    queryFn: fetchJournalForInsights,
  });
  const { data: sub } = useQuery({ queryKey: ["subscription-row"], queryFn: fetchSubscription });
  const { data: profile } = useProfile();
  const entitlement = entitlementFor(sub);

  const list = events ?? [];
  const tokens = totalTokens(list);
  const tradition = userPath?.tradition ?? "universal";
  const progress = stageProgress(tokens);
  const run = consistency(list);
  const quests = todaysQuests(list, tradition);
  const allDone = dayComplete(quests);
  const claimedToday = list.some(
    (e) =>
      e.kind === "daily" && e.created_at.slice(0, 10) === new Date().toISOString().slice(0, 10),
  );
  const weekly = weeklyChallenge(list);
  const counts = countsByKind(list);
  const milestones = milestonesFor(list, journal?.length ?? 0, observations?.length ?? 0);
  const reflection = reflectionMilestone(journal?.length ?? 0);
  const insights = (journal?.length ?? 0) >= 7 ? reflectionInsights(journal ?? []) : [];

  useEffect(() => {
    if (!events) return;
    void syncStage(tokens);
    void recordMilestones(milestones);
    // Milestones and stage are derived, so this only records what is already true.
  }, [events, tokens, milestones]);

  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: ["path-events"] });
  };

  if (isLoading) return <p className="p-8 text-sm text-muted-foreground">Opening your path…</p>;

  return (
    <div className="mx-auto w-full max-w-2xl px-5 pb-16 pt-6 lg:pt-10">
      <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Your Path</p>
      <h1 className="mt-2 font-display text-3xl leading-tight">
        {progress.current.glyph} {progress.current.name}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{progress.current.line}</p>

      {/* ---------------------------------------------------- progress */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-display text-2xl">{tokens} Path Tokens</p>
          <p className="text-xs text-muted-foreground">{tokensToday(list)} today</p>
        </div>
        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={progress.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress toward ${progress.next?.name ?? "integration"}`}
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {progress.next
            ? `${progress.remaining} tokens until ${progress.next.glyph} ${progress.next.name}`
            : "You have walked the whole map. Begin again, more quietly."}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Tokens are earned, never bought. The first sincere action of a kind each day earns in
          full; repeats taper, because the point is your practice, not the number.
        </p>
      </section>

      {/* ------------------------------------------- what is open, what previews */}
      <div className="mt-8">
        <PathGates joinedAt={profile?.created_at} tokens={tokens} entitlement={entitlement} />
      </div>

      {/* ---------------------------------------------------- daily quest */}
      <section className="mt-8">
        <h2 className="font-display text-xl">Your path · today</h2>
        <p className="mt-1 text-sm text-muted-foreground">Three things for you.</p>
        <ul className="mt-4 space-y-2">
          {quests.map((q) => (
            <li key={q.kind}>
              <Link
                to={q.to}
                className={cn(
                  "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border p-4 transition-colors",
                  q.done
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/70 bg-card hover:border-primary/40",
                )}
              >
                <span aria-hidden="true" className="text-xl">
                  {q.glyph}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{q.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{q.detail}</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {q.done ? "Done" : `+${q.tokens}`}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Button
          className="mt-4 w-full"
          disabled={!allDone || claimedToday}
          onClick={async () => {
            const got = await award("daily", TOKEN_VALUE.dailyComplete);
            await refresh();
            toast.success(got > 0 ? `Day complete · +${got} tokens` : "Day complete.");
          }}
        >
          {claimedToday
            ? "Today is complete"
            : allDone
              ? `Complete your day · +${TOKEN_VALUE.dailyComplete}`
              : "Complete all three to close your day"}
        </Button>
      </section>

      {/* -------------------------------------------------------- rhythm */}
      <section className="mt-8 rounded-2xl border border-border bg-card p-5">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Your Rhythm</p>
        <h2 className="mt-1 font-display text-lg">Small moments, practiced consistently.</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A morning practice, a midday pause, an evening reflection, a night journal — gentle
          reminders that keep your path moving without asking for perfection.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/app/rhythm">Open your rhythm</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/reminders">Reminder settings</Link>
          </Button>
        </div>
      </section>

      {/* ------------------------------------------------------- unlocks */}
      <section id="unlocks" className="mt-8 scroll-mt-20">
        <h2 className="font-display text-xl">What opens, and when</h2>
        <p className="mb-4 mt-1 text-sm leading-relaxed text-muted-foreground">
          Tokens come from practice and can never be bought. Membership carries the cost of the
          guided material and the people who make it. Nothing you have written is ever locked away.
        </p>
        <UnlockLadder />
      </section>

      {/* ---------------------------------------------------- consistency */}
      <section className="mt-8 rounded-2xl border border-border/70 bg-parchment/40 p-5">
        <h2 className="font-display text-lg">
          {run.days > 0
            ? `${run.days} ${run.days === 1 ? "day" : "days"} of practice`
            : "Your path continues"}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {run.days > 0
            ? "Consistency, not a score. Nothing here is lost if tomorrow is quiet."
            : list.length === 0
              ? "Nothing has begun yet, and that is a fine place to start. One small action today is enough."
              : "Yesterday was quiet. Begin again today — that is the practice, not a failure of it."}
        </p>
      </section>

      {/* ---------------------------------------------------- weekly */}
      <section className="mt-8 rounded-2xl border border-border bg-card p-5">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">This week</p>
        <h2 className="mt-1 font-display text-xl">{weekly.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{weekly.line}</p>
        <ul className="mt-4 space-y-1.5 text-sm">
          {weekly.parts.map((p) => (
            <li key={p.kind} className="flex items-center justify-between gap-3">
              <span className="capitalize">
                {p.need}{" "}
                {p.kind === "journal"
                  ? "reflections"
                  : p.kind === "observe"
                    ? "observations"
                    : "practices"}
              </span>
              <span
                className={cn(
                  "text-xs",
                  p.done >= p.need ? "text-primary" : "text-muted-foreground",
                )}
              >
                {p.done} / {p.need}
              </span>
            </li>
          ))}
        </ul>
        <Button
          variant={weekly.complete && !weekly.claimed ? "default" : "outline"}
          size="sm"
          className="mt-4"
          disabled={!weekly.complete || weekly.claimed}
          onClick={async () => {
            const got = await award("weekly", TOKEN_VALUE.weekly, weekly.name);
            await refresh();
            toast.success(`🪷 Weekly journey complete · +${got} tokens`);
          }}
        >
          {weekly.claimed ? "Received this week" : `Claim +${weekly.reward} tokens`}
        </Button>
      </section>

      {/* ---------------------------------------------------- the journey map */}
      <div className="mt-10">
        <JourneyMap tokens={tokens} entitlement={entitlement} />
      </div>

      {/* ---------------------------------------------------- tradition */}
      <section className="mt-8 rounded-2xl border border-border/70 bg-card p-5">
        <h2 className="font-display text-lg">Your tradition</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The mechanics stay the same for everyone. The words, practices and worldview stay true to
          your path.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TRADITION_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={tradition === key}
              onClick={async () => {
                await setTradition(key);
                await qc.invalidateQueries({ queryKey: ["user-path"] });
              }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                tradition === key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {TRADITION_PATHS[key]!.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm">{TRADITION_PATHS[tradition]?.steps.join(" → ")}</p>
      </section>

      {/* ---------------------------------------------------- reflection */}
      {(reflection || insights.length > 0) && (
        <section className="mt-8 rounded-2xl border border-border/70 bg-parchment/40 p-5">
          {reflection && (
            <>
              <h2 className="font-display text-lg">
                {reflection.glyph} {reflection.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{reflection.line}</p>
            </>
          )}
          {insights.length > 0 && (
            <>
              <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                Reflection insights
              </p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {insights.map((i) => (
                  <li key={i.word}>{i.line}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                Patterns, not verdicts. Only you can see these.
              </p>
            </>
          )}
        </section>
      )}

      {/* ---------------------------------------------------- milestones */}
      <section className="mt-8">
        <h2 className="font-display text-xl">Milestones</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {milestones.map((m) => (
            <li
              key={m.code}
              className={cn(
                "rounded-2xl border p-4",
                m.earned ? "border-primary/40 bg-primary/5" : "border-border/60 bg-card opacity-60",
              )}
            >
              <p className="text-sm font-medium">
                <span aria-hidden="true">{m.glyph}</span> {m.name}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{m.line}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------- your profile */}
      <section className="mt-8 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg">Your path, in numbers</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          {[
            ["Journey steps", counts.journey],
            ["Days of practice", dayKeys(list).size],
            ["Reflections", journal?.length ?? 0],
            ["Observations", observations?.length ?? 0],
            ["Tokens", tokens],
            ["Milestones", milestones.filter((m) => m.earned).length],
          ].map(([label, value]) => (
            <div key={String(label)}>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {label}
              </dt>
              <dd className="font-display text-xl">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">
          There is no leaderboard here, and there never will be. This is only your own returning.
        </p>
      </section>

      {/* ---------------------------------------------------- pillars */}
      <section className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PILLARS.map((p) => (
          <Link
            key={p.key}
            to={
              p.key === "journey"
                ? "/app/journeys"
                : p.key === "practice"
                  ? "/app/practice"
                  : p.key === "journal"
                    ? "/app/journal"
                    : "/app/observe"
            }
            className="rounded-2xl border border-border/70 bg-card p-4 text-center transition-colors hover:border-primary/40"
          >
            <span aria-hidden="true" className="text-xl">
              {p.glyph}
            </span>
            <span className="mt-1 block text-sm font-medium">{p.label}</span>
            <span className="block text-[11px] text-muted-foreground">{p.outcome}</span>
          </Link>
        ))}
      </section>

      {/* ---------------------------------------------------- marketplace */}
      {tokens >= 300 && (
        <section className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <h2 className="font-display text-lg">You have reached {stageFor(tokens).name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ready to sit with an EKA Verified practitioner and take this further?
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link to="/app/market">Find guidance</Link>
          </Button>
        </section>
      )}
    </div>
  );
}
