import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConsistencyRing } from "@/components/app/ConsistencyRing";
import { ReminderForm } from "@/components/app/ReminderForm";
import { RhythmToday } from "@/components/app/RhythmToday";
import { WeekStrip } from "@/components/app/WeekStrip";
import { WeeklyReview } from "@/components/app/WeeklyReview";
import { ReflectionCard } from "@/components/app/ReflectionCard";
import {
  applyAdjustment,
  consistencyRing,
  declineAdjustment,
  fetchCheckIns,
  fetchSettings,
  inQuietHours,
  proposeAdjustments,
  createReminder,
  currentRhythm,
  deleteReminder,
  fetchCompletions,
  fetchReminders,
  formatTime,
  intentionNudge,
  lifetimeDays,
  nextMoment,
  notificationState,
  requestNotificationPermission,
  seedDefaultMoments,
  showMomentNotification,
  todaysMoments,
  updateReminder,
  weekStrip,
  type Moment,
} from "@/lib/rhythm";
import { countsByKind, fetchEvents, nextStage, stageFor, totalTokens, weekStart } from "@/lib/path";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/rhythm")({
  head: () => ({
    meta: [
      { title: "Your Rhythm — small moments, practiced consistently | EKA" },
      {
        name: "description",
        content:
          "A spiritual rhythm tracker, not a habit app: sacred moments through the day, gentle reminders, a consistency ring, and a weekly reflection that feeds your path.",
      },
      { property: "og:title", content: "Your Rhythm | EKA" },
      {
        property: "og:description",
        content: "Small moments, practiced consistently. Reminders that guide rather than nag.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Your Rhythm | EKA" },
      { name: "twitter:description", content: "Small moments, practiced consistently." },
    ],
  }),
  component: RhythmPage,
});

function RhythmPage() {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [perm, setPerm] = useState<string>("default");
  const fired = useRef<Set<string>>(new Set());

  const { data: reminders, isLoading } = useQuery({
    queryKey: ["rhythm-reminders"],
    queryFn: fetchReminders,
  });
  const { data: completions } = useQuery({
    queryKey: ["rhythm-completions"],
    queryFn: () => fetchCompletions(),
  });
  const { data: events } = useQuery({ queryKey: ["path-events"], queryFn: () => fetchEvents() });
  const { data: settings } = useQuery({ queryKey: ["rhythm-settings"], queryFn: fetchSettings });
  const { data: checkins } = useQuery({
    queryKey: ["rhythm-checkins"],
    queryFn: () => fetchCheckIns(),
  });

  useEffect(() => setPerm(notificationState()), []);

  const list = useMemo(() => reminders ?? [], [reminders]);
  const done = useMemo(() => completions ?? [], [completions]);
  const moments = todaysMoments(list, done);
  const upcoming = nextMoment(moments);
  const strip = weekStrip(done);
  const ring = consistencyRing(done);
  const proposals = settings?.auto_adjust === false ? [] : proposeAdjustments(list, done);
  const nudge = intentionNudge(list);

  // Gentle cue while the tab is open; the in-app strip is the reliable path.
  useEffect(() => {
    if (perm !== "granted" || settings?.channel_browser === false) return;
    const tick = () => {
      const now = new Date();
      const mins = now.getHours() * 60 + now.getMinutes();
      if (settings && inQuietHours(settings, now)) return;
      for (const m of todaysMoments(list, done, now)) {
        const key = `${m.reminder.id}-${now.toDateString()}`;
        if (
          m.scheduledToday &&
          !m.done &&
          mins >= m.minutes &&
          mins <= m.minutes + 5 &&
          !fired.current.has(key)
        ) {
          fired.current.add(key);
          showMomentNotification(m);
        }
      }
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [perm, list, done, settings]);

  const evs = events ?? [];
  const tokens = totalTokens(evs);
  const counts = countsByKind(evs);
  const start = weekStart();
  const weekEvents = evs.filter((e) => new Date(e.created_at) >= start);
  const weekCounts = countsByKind(weekEvents);
  const upNext = nextStage(tokens);

  if (isLoading) return <p className="p-8 text-sm text-muted-foreground">Finding your rhythm…</p>;

  return (
    <div className="mx-auto w-full max-w-2xl px-5 pb-16 pt-6 lg:pt-10">
      <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Your Rhythm</p>
      <h1 className="mt-2 font-display text-3xl leading-tight">
        Small moments, practiced consistently.
      </h1>

      {list.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg">Begin with four moments</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Morning practice, a midday pause, evening reflection and a night journal. Change the
            times, or remove any of them — this rhythm is yours.
          </p>
          <Button
            className="mt-4"
            onClick={async () => {
              await seedDefaultMoments();
              await qc.invalidateQueries({ queryKey: ["rhythm-reminders"] });
              toast.success("Your rhythm has begun.");
            }}
          >
            Set my rhythm
          </Button>
        </section>
      ) : (
        <>
          {upcoming && (
            <p className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
              <span aria-hidden="true">{upcoming.reminder.glyph}</span> Next:{" "}
              {upcoming.reminder.label} at {formatTime(upcoming.reminder.time_of_day)}
              {upcoming.overdue && (
                <span className="text-muted-foreground"> — still open for today</span>
              )}
            </p>
          )}

          <section className="mt-6">
            <h2 className="font-display text-xl">Today</h2>
            <div className="mt-3">
              <RhythmToday
                moments={moments}
                checkins={checkins ?? []}
                checkinsEnabled={settings?.checkins_enabled ?? true}
              />
            </div>
          </section>

          {nudge && (
            <section className="mt-6 rounded-2xl border border-border/70 bg-parchment/40 p-5">
              <p className="text-sm leading-relaxed">{nudge.line}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 px-0"
                onClick={async () => {
                  await updateReminder(nudge.reminder.id, {
                    intention_shown_at: new Date().toISOString(),
                  });
                  await qc.invalidateQueries({ queryKey: ["rhythm-reminders"] });
                }}
              >
                Noted
              </Button>
            </section>
          )}

          {proposals.map((p) => (
            <section
              key={`${p.kind}-${p.reminder.id}`}
              className="mt-4 rounded-2xl border border-border bg-card p-5"
            >
              <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                A change EKA is suggesting
              </p>
              <p className="mt-2 text-sm font-medium">
                {p.kind === "time"
                  ? `Move ${p.reminder.label} to ${formatTime(p.toTime!)}?`
                  : p.kind === "frequency"
                    ? `Keep ${p.reminder.label} on ${p.toDays!.length} days instead of ${p.reminder.days_of_week.length}?`
                    : `Return ${p.reminder.label} to every day?`}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Why: {p.reason}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={async () => {
                    const { error } = await applyAdjustment(p);
                    if (error) {
                      toast.error(error);
                      return;
                    }
                    await qc.invalidateQueries({ queryKey: ["rhythm-reminders"] });
                    await qc.invalidateQueries({ queryKey: ["rhythm-adjustments"] });
                    toast.success("Adjusted. You can undo this in Reminders.");
                  }}
                >
                  {p.kind === "time" ? `Move to ${formatTime(p.toTime!)}` : "Yes, adjust it"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await declineAdjustment(p);
                    await qc.invalidateQueries({ queryKey: ["rhythm-reminders"] });
                  }}
                >
                  Keep {formatTime(p.reminder.time_of_day)}
                </Button>
              </div>
            </section>
          ))}

          <section className="mt-8 rounded-2xl border border-border bg-card p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              This week
            </p>
            <div className="mt-3">
              <WeekStrip cells={strip.cells} kept={strip.kept} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Current rhythm
                </p>
                <p className="font-display text-2xl">{currentRhythm(done)} days</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Lifetime practice
                </p>
                <p className="font-display text-2xl">{lifetimeDays(done)} days</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {currentRhythm(done) > 0
                ? "Nothing here is lost if tomorrow is quiet."
                : "Yesterday was a pause. Today is another beginning."}
            </p>
          </section>

          <section className="mt-6 rounded-2xl border border-border bg-card p-5">
            <ConsistencyRing percent={ring.percent} kept={ring.kept} window={ring.window} />
          </section>

          <section className="mt-6 rounded-2xl border border-border/70 bg-card p-5">
            <h2 className="font-display text-lg">Your rhythm so far</h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li>🧘 Practice: {counts.practice} sessions</li>
              <li>👁️ Observation: {counts.observe} moments</li>
              <li>📖 Journal: {counts.journal} entries</li>
              <li>🪙 Total tokens: {tokens}</li>
              <li>🛤️ Current stage: {stageFor(tokens).name}</li>
              {upNext && <li>✨ Next unlock: {upNext.gate - tokens} tokens</li>}
            </ul>
          </section>

          <div className="mt-6">
            <WeeklyReview
              data={{
                practices: weekCounts.practice,
                observations: weekCounts.observe,
                journals: weekCounts.journal,
                rhythmDays: strip.kept,
                tokens: weekEvents.reduce((s, e) => s + e.tokens, 0),
                nextStageName: upNext ? `${upNext.glyph} ${upNext.name}` : null,
                nextStageGap: upNext ? upNext.gate - tokens : 0,
              }}
            />
          </div>

          <div className="mt-6">
            <ReflectionCard
              data={{
                weekLabel: `Week of ${start.toLocaleDateString(undefined, { day: "numeric", month: "long" })}`,
                keptDays: strip.kept,
                ringPercent: ring.percent,
                tokens: weekEvents.reduce((s, e) => s + e.tokens, 0),
                practices: weekCounts.practice,
                observations: weekCounts.observe,
                journals: weekCounts.journal,
                stageName: stageFor(tokens).name,
                intention: list.find((r) => r.intention)?.intention ?? null,
              }}
            />
          </div>
        </>
      )}

      {/* ------------------------------------------------------- moments */}
      <section id="your-moments" className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl">Your moments</h2>
          <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}>
            <Plus className="mr-1 size-4" aria-hidden="true" />
            {adding ? "Close" : "Add"}
          </Button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Reminders, not alarms. They invite; they never insist.{" "}
          <Link to="/app/reminders" className="underline underline-offset-4">
            Channels, quiet hours and how many
          </Link>
          .
        </p>

        {adding && (
          <div className="mt-4 rounded-2xl border border-border bg-card p-5">
            <ReminderForm
              onSubmit={async (draft) => {
                const { error } = await createReminder(draft);
                if (error) {
                  toast.error(error);
                  return;
                }
                setAdding(false);
                await qc.invalidateQueries({ queryKey: ["rhythm-reminders"] });
                toast.success("Moment added.");
              }}
              onCancel={() => setAdding(false)}
            />
          </div>
        )}

        <ul className="mt-4 space-y-2">
          {list.map((r) => (
            <li key={r.id} className="rounded-2xl border border-border/70 bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    <span aria-hidden="true">{r.glyph}</span> {r.label} ·{" "}
                    <span className="text-muted-foreground">{formatTime(r.time_of_day)}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {r.guidance || "A moment for your practice."}
                  </p>
                  {r.intention && (
                    <p className="mt-1 text-xs text-muted-foreground">Intention: {r.intention}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={r.active ? `Pause ${r.label}` : `Resume ${r.label}`}
                    onClick={async () => {
                      await updateReminder(r.id, { active: !r.active });
                      await qc.invalidateQueries({ queryKey: ["rhythm-reminders"] });
                    }}
                  >
                    {r.active ? (
                      <Bell className="size-4" aria-hidden="true" />
                    ) : (
                      <BellOff className="size-4" aria-hidden="true" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Remove ${r.label}`}
                    onClick={async () => {
                      await deleteReminder(r.id);
                      await qc.invalidateQueries({ queryKey: ["rhythm-reminders"] });
                    }}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
              <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span>Time</span>
                <input
                  type="time"
                  defaultValue={r.time_of_day.slice(0, 5)}
                  aria-label={`Time for ${r.label}`}
                  className="rounded-md border border-border bg-background px-2 py-1"
                  onChange={async (e) => {
                    if (!e.target.value) return;
                    await updateReminder(r.id, { time_of_day: `${e.target.value}:00` });
                    await qc.invalidateQueries({ queryKey: ["rhythm-reminders"] });
                  }}
                />
              </label>
            </li>
          ))}
        </ul>

        <div
          className={cn(
            "mt-5 rounded-2xl border border-border/70 bg-parchment/40 p-4",
            perm === "granted" && "hidden",
          )}
        >
          <p className="text-sm text-muted-foreground">
            EKA can whisper these moments through your browser. You'll always see them here
            regardless.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3"
            onClick={async () => {
              const state = await requestNotificationPermission();
              setPerm(state);
              if (state === "unsupported") toast.error("This browser cannot show reminders.");
            }}
          >
            Allow gentle reminders
          </Button>
        </div>
      </section>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        <Link to="/app/path" className="underline underline-offset-4">
          Back to Your Path
        </Link>
      </p>
    </div>
  );
}

export type { Moment };
