import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INTENTIONS, PILLAR_GLYPH, type Pillar, type Reminder } from "@/lib/rhythm";
import { cn } from "@/lib/utils";

const GLYPHS = ["🌅", "☀️", "🌆", "🌙", "🕉️", "🪷", "🔔", "📿"];
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const PILLARS: Pillar[] = ["practice", "observe", "journal", "journey"];

export type ReminderDraft = {
  glyph: string;
  label: string;
  guidance: string;
  time_of_day: string;
  days_of_week: number[];
  pillar: Pillar;
  intention: string | null;
  notify: boolean;
};

/** Creating a Sacred Moment always asks why — the intention is the point. */
export function ReminderForm({
  initial,
  submitLabel = "Create moment",
  onSubmit,
  onCancel,
}: {
  initial?: Reminder;
  submitLabel?: string;
  onSubmit: (draft: ReminderDraft) => Promise<void> | void;
  onCancel?: () => void;
}) {
  const [glyph, setGlyph] = useState(initial?.glyph ?? "🌅");
  const [label, setLabel] = useState(initial?.label ?? "");
  const [guidance, setGuidance] = useState(initial?.guidance ?? "");
  const [time, setTime] = useState((initial?.time_of_day ?? "06:30:00").slice(0, 5));
  const [days, setDays] = useState<number[]>(initial?.days_of_week ?? [0, 1, 2, 3, 4, 5, 6]);
  const [pillar, setPillar] = useState<Pillar>(initial?.pillar ?? "practice");
  const [intention, setIntention] = useState<string | null>(initial?.intention ?? null);
  const [saving, setSaving] = useState(false);

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!label.trim() || days.length === 0) return;
        setSaving(true);
        await onSubmit({
          glyph,
          label: label.trim(),
          guidance: guidance.trim(),
          time_of_day: `${time}:00`,
          days_of_week: days.slice().sort(),
          pillar,
          intention,
          notify: initial?.notify ?? true,
        });
        setSaving(false);
      }}
    >
      <div>
        <Label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Symbol
        </Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {GLYPHS.map((g) => (
            <button
              key={g}
              type="button"
              aria-label={`Choose symbol ${g}`}
              aria-pressed={glyph === g}
              onClick={() => setGlyph(g)}
              className={cn(
                "grid size-10 place-items-center rounded-full border text-lg",
                glyph === g ? "border-primary bg-primary/10" : "border-border",
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="moment-label">Name</Label>
          <Input
            id="moment-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Morning Moment"
            className="mt-1.5"
            required
          />
        </div>
        <div>
          <Label htmlFor="moment-time">Time</Label>
          <Input
            id="moment-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1.5"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="moment-guidance">A line of guidance</Label>
        <Input
          id="moment-guidance"
          value={guidance}
          onChange={(e) => setGuidance(e.target.value)}
          placeholder="Begin your day with intention."
          className="mt-1.5"
        />
      </div>

      <div>
        <Label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Days
        </Label>
        <div className="mt-2 flex gap-2">
          {DAYS.map((d, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Day ${i}`}
              aria-pressed={days.includes(i)}
              onClick={() =>
                setDays((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))
              }
              className={cn(
                "size-9 rounded-full border text-xs",
                days.includes(i)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground",
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          This moment opens
        </Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {PILLARS.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={pillar === p}
              onClick={() => setPillar(p)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs capitalize",
                pillar === p
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground",
              )}
            >
              {PILLAR_GLYPH[p]} {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-display text-base">Why do you want to practise?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {INTENTIONS.map((i) => (
            <button
              key={i}
              type="button"
              aria-pressed={intention === i}
              onClick={() => setIntention(intention === i ? null : i)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs",
                intention === i
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground",
              )}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={saving || !label.trim() || days.length === 0}>
          {saving ? "Saving…" : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
