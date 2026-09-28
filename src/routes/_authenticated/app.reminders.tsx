import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppScreen } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_SETTINGS,
  applyMomentCount,
  fetchAdjustments,
  fetchReminders,
  fetchSettings,
  formatTime,
  notificationState,
  requestNotificationPermission,
  revertAdjustment,
  saveSettings,
  type RhythmSettings,
} from "@/lib/rhythm";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/reminders")({
  head: () => ({
    meta: [
      { title: "Reminders & rhythm settings | EKA" },
      {
        name: "description",
        content:
          "Choose how EKA reaches you, set quiet hours when nothing will reach you at all, and pick how many Sacred Moments belong in your day.",
      },
      { property: "og:title", content: "Reminders & rhythm settings | EKA" },
      {
        property: "og:description",
        content: "Channels, quiet hours and the number of Sacred Moments in your day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Reminders & rhythm settings | EKA" },
      { name: "twitter:description", content: "Gentle reminders, on your terms." },
    ],
  }),
  component: ReminderSettings,
});

const COUNTS = [
  { n: 1, label: "One", blurb: "A single anchor in the day." },
  { n: 2, label: "Two", blurb: "Morning and night." },
  { n: 3, label: "Three", blurb: "Morning, midday, evening." },
  { n: 4, label: "Four", blurb: "The full rhythm." },
];

function ReminderSettings() {
  const qc = useQueryClient();
  const [form, setForm] = useState<Omit<RhythmSettings, "user_id">>(DEFAULT_SETTINGS);
  const [busy, setBusy] = useState(false);
  const [perm, setPerm] = useState<string>("default");

  const { data: settings } = useQuery({ queryKey: ["rhythm-settings"], queryFn: fetchSettings });
  const { data: reminders } = useQuery({ queryKey: ["rhythm-reminders"], queryFn: fetchReminders });
  const { data: adjustments } = useQuery({
    queryKey: ["rhythm-adjustments"],
    queryFn: () => fetchAdjustments(),
  });

  useEffect(() => setPerm(notificationState()), []);
  useEffect(() => {
    if (!settings) return;
    const { user_id: _ignored, ...rest } = settings;
    setForm(rest);
  }, [settings]);

  const set = <K extends keyof Omit<RhythmSettings, "user_id">>(key: K, value: RhythmSettings[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    setBusy(true);
    const { error } = await saveSettings(form);
    if (!error) await applyMomentCount(reminders ?? [], form.moments_per_day);
    setBusy(false);
    if (error) {
      toast.error(error);
      return;
    }
    await qc.invalidateQueries({ queryKey: ["rhythm-settings"] });
    await qc.invalidateQueries({ queryKey: ["rhythm-reminders"] });
    toast.success("Saved. Your rhythm will follow this.");
  };

  const history = (adjustments ?? []).filter((a) => !a.reverted_at);

  return (
    <AppScreen eyebrow="Your rhythm" title="Reminders">
      <p className="-mt-2 text-sm leading-relaxed text-muted-foreground">
        Reminders invite, they never insist. Nothing here scores you, and quiet hours are always
        honoured.
      </p>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-calm">
        <div>
          <h2 className="font-display text-lg">How EKA reaches you</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose as few as you like. In-app is enough for most people.
          </p>
        </div>
        <Toggle
          id="ch-in-app"
          label="In the app"
          blurb="Your moments appear on Your Rhythm and Your Path."
          checked={form.channel_in_app}
          onChange={(v) => set("channel_in_app", v)}
        />
        <Toggle
          id="ch-browser"
          label="Browser notification"
          blurb={
            perm === "granted"
              ? "Allowed by this browser."
              : perm === "denied"
                ? "Your browser is blocking notifications."
                : "Needs your browser's permission."
          }
          checked={form.channel_browser}
          onChange={async (v) => {
            set("channel_browser", v);
            if (v && perm !== "granted") {
              const state = await requestNotificationPermission();
              setPerm(state);
              if (state !== "granted") toast.error("Your browser did not allow reminders.");
            }
          }}
        />
        <Toggle
          id="ch-email"
          label="Email"
          blurb="A single quiet note, only for moments you have missed all week."
          checked={form.channel_email}
          onChange={(v) => set("channel_email", v)}
        />
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-calm">
        <div>
          <h2 className="font-display text-lg">Quiet hours</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Nothing will reach you inside this window. Your moments still wait for you in the app.
          </p>
        </div>
        <Toggle
          id="dnd"
          label="Keep quiet hours"
          blurb={
            form.dnd_enabled
              ? `${formatTime(form.dnd_start)} to ${formatTime(form.dnd_end)}`
              : "Currently off."
          }
          checked={form.dnd_enabled}
          onChange={(v) => set("dnd_enabled", v)}
        />
        {form.dnd_enabled && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="dnd-start">From</Label>
              <input
                id="dnd-start"
                type="time"
                value={form.dnd_start.slice(0, 5)}
                onChange={(e) => e.target.value && set("dnd_start", `${e.target.value}:00`)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dnd-end">Until</Label>
              <input
                id="dnd-end"
                type="time"
                value={form.dnd_end.slice(0, 5)}
                onChange={(e) => e.target.value && set("dnd_end", `${e.target.value}:00`)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-calm">
        <div>
          <h2 className="font-display text-lg">Sacred Moments each day</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Fewer moments, kept, is better than more, missed. Extra moments are paused, never
            deleted.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-4">
          {COUNTS.map((c) => (
            <button
              key={c.n}
              type="button"
              aria-pressed={form.moments_per_day === c.n}
              onClick={() => set("moments_per_day", c.n)}
              className={cn(
                "rounded-xl border p-3 text-left transition-colors",
                form.moments_per_day === c.n
                  ? "border-primary bg-primary-soft/30"
                  : "border-border hover:bg-accent",
              )}
            >
              <span className="text-sm">{c.label}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{c.blurb}</span>
            </button>
          ))}
        </div>
        <Toggle
          id="checkins"
          label="Invite a short check-in"
          blurb="After each moment, a place for your intention and one line of reflection."
          checked={form.checkins_enabled}
          onChange={(v) => set("checkins_enabled", v)}
        />
        <Toggle
          id="auto"
          label="Let EKA suggest better times"
          blurb="Suggestions come from your own recent practice, and always show the reason."
          checked={form.auto_adjust}
          onChange={(v) => set("auto_adjust", v)}
        />
      </section>

      <Button onClick={save} disabled={busy}>
        Save
      </Button>

      {history.length > 0 && (
        <section className="space-y-3 rounded-2xl border border-border/70 bg-parchment/40 p-5">
          <h2 className="font-display text-lg">Changes EKA made with you</h2>
          <ul className="space-y-3">
            {history.map((a) => (
              <li key={a.id} className="text-sm">
                <p className="text-muted-foreground">{a.reason}</p>
                <p className="mt-0.5">
                  {a.from_time && a.to_time && a.from_time !== a.to_time
                    ? `Moved from ${formatTime(a.from_time)} to ${formatTime(a.to_time)}`
                    : `Days changed to ${(a.to_days ?? []).length} a week`}{" "}
                  · {new Date(a.created_at).toLocaleDateString()}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-1 px-0"
                  onClick={async () => {
                    await revertAdjustment(a);
                    await qc.invalidateQueries({ queryKey: ["rhythm-adjustments"] });
                    await qc.invalidateQueries({ queryKey: ["rhythm-reminders"] });
                    toast.success("Put back as it was.");
                  }}
                >
                  Undo this
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-sm text-muted-foreground">
        <Link to="/app/rhythm" className="underline underline-offset-4">
          Back to Your Rhythm
        </Link>
      </p>
    </AppScreen>
  );
}

function Toggle({
  id,
  label,
  blurb,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  blurb: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 accent-[var(--primary)]"
      />
      <span>
        <span className="block text-sm">{label}</span>
        <span className="block text-xs text-muted-foreground">{blurb}</span>
      </span>
    </label>
  );
}
