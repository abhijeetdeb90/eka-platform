import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { INTENTIONS, saveCheckIn, type CheckIn, type Reminder } from "@/lib/rhythm";
import { cn } from "@/lib/utils";

/**
 * A check-in is optional and short: the intention you brought, and one honest
 * line afterwards. Both become openings for your journal rather than a score.
 */
export function MomentCheckIn({
  reminder,
  existing,
  onDone,
}: {
  reminder: Reminder;
  existing?: CheckIn | null;
  onDone?: () => void;
}) {
  const qc = useQueryClient();
  const [intention, setIntention] = useState(existing?.intention_note ?? reminder.intention ?? "");
  const [reflection, setReflection] = useState(existing?.reflection ?? "");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    const { error } = await saveCheckIn({
      reminderId: reminder.id,
      intentionNote: intention,
      reflection,
    });
    setBusy(false);
    if (error) {
      toast.error(error);
      return;
    }
    await qc.invalidateQueries({ queryKey: ["rhythm-checkins"] });
    toast.success("Kept in your own words.");
    onDone?.();
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          What are you bringing?
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {INTENTIONS.map((i) => (
            <button
              key={i}
              type="button"
              aria-pressed={intention === i}
              onClick={() => setIntention(intention === i ? "" : i)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                intention === i
                  ? "border-primary bg-primary-soft/30"
                  : "border-border hover:bg-accent",
              )}
            >
              {i}
            </button>
          ))}
        </div>
        <label className="sr-only" htmlFor={`intent-${reminder.id}`}>
          Intention for {reminder.label}
        </label>
        <Textarea
          id={`intent-${reminder.id}`}
          rows={2}
          maxLength={280}
          placeholder="Or say it in your own words — optional."
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          className="mt-2"
        />
      </div>

      <div>
        <label
          htmlFor={`reflect-${reminder.id}`}
          className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          And afterwards?
        </label>
        <Textarea
          id={`reflect-${reminder.id}`}
          rows={3}
          maxLength={600}
          placeholder="One line is enough."
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          className="mt-2"
        />
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={save}
          disabled={busy || (!intention.trim() && !reflection.trim())}
        >
          Save check-in
        </Button>
        {onDone && (
          <Button size="sm" variant="ghost" onClick={onDone}>
            Not today
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Private to you. It will surface later as a journal prompt.
      </p>
    </div>
  );
}
