import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PenLine } from "lucide-react";
import { MomentCheckIn } from "@/components/app/MomentCheckIn";
import {
  PILLAR_ROUTE,
  formatTime,
  keepMoment,
  todayKey,
  type CheckIn,
  type Moment,
} from "@/lib/rhythm";
import { cn } from "@/lib/utils";

/**
 * The daily tracker. Each row opens the real activity; the circle marks it kept
 * and awards tokens through the shared path economy. A check-in may follow, but
 * only if the member has asked for one.
 */
export function RhythmToday({
  moments,
  checkins = [],
  checkinsEnabled = true,
}: {
  moments: Moment[];
  checkins?: CheckIn[];
  checkinsEnabled?: boolean;
}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState<string | null>(null);
  const today = todayKey();

  const keep = async (m: Moment) => {
    const { error, tokens } = await keepMoment(m.reminder);
    if (error) {
      toast.error(error);
      return;
    }
    await qc.invalidateQueries({ queryKey: ["rhythm-completions"] });
    await qc.invalidateQueries({ queryKey: ["path-events"] });
    toast.success(
      tokens > 0 ? `${m.reminder.label} kept · +${tokens} tokens` : `${m.reminder.label} kept.`,
    );
    if (checkinsEnabled) setOpen(m.reminder.id);
  };

  if (moments.length === 0) {
    return <p className="text-sm text-muted-foreground">No moments yet. Add one below.</p>;
  }

  return (
    <ul className="space-y-2">
      {moments.map((m) => {
        const checkin =
          checkins.find((c) => c.reminder_id === m.reminder.id && c.done_on === today) ?? null;
        return (
          <li
            key={m.reminder.id}
            className={cn(
              "rounded-2xl border p-3.5",
              m.done
                ? "border-primary/40 bg-primary/5"
                : m.overdue
                  ? "border-primary/25 bg-card"
                  : "border-border/70 bg-card",
              !m.scheduledToday && "opacity-55",
            )}
          >
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
              <span aria-hidden="true" className="text-xl">
                {m.reminder.glyph}
              </span>
              <Link to={PILLAR_ROUTE[m.reminder.pillar]} className="min-w-0">
                <span className="block text-sm font-medium">
                  <span className="text-muted-foreground">
                    {formatTime(m.reminder.time_of_day)}
                  </span>{" "}
                  · {m.reminder.label}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {m.scheduledToday
                    ? m.reminder.guidance || "A moment for your practice."
                    : "Not set for today"}
                </span>
              </Link>
              <div className="flex items-center gap-1">
                {checkinsEnabled && m.done && (
                  <button
                    type="button"
                    onClick={() => setOpen(open === m.reminder.id ? null : m.reminder.id)}
                    aria-expanded={open === m.reminder.id}
                    aria-label={
                      checkin
                        ? `Edit your check-in for ${m.reminder.label}`
                        : `Add a check-in for ${m.reminder.label}`
                    }
                    className="grid size-8 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  >
                    <PenLine className="size-3.5" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  disabled={m.done}
                  onClick={() => keep(m)}
                  aria-label={m.done ? `${m.reminder.label} kept` : `Mark ${m.reminder.label} kept`}
                  className={cn(
                    "grid size-8 place-items-center rounded-full border text-sm transition-colors",
                    m.done
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary",
                  )}
                >
                  {m.done ? "●" : "○"}
                </button>
              </div>
            </div>

            {checkin && open !== m.reminder.id && (
              <p className="mt-2 border-t border-border/60 pt-2 text-xs text-muted-foreground">
                {checkin.intention_note && <span>Brought: {checkin.intention_note}. </span>}
                {checkin.reflection}
              </p>
            )}

            {checkinsEnabled && open === m.reminder.id && (
              <div className="mt-3 border-t border-border/60 pt-3">
                <MomentCheckIn
                  reminder={m.reminder}
                  existing={checkin}
                  onDone={() => setOpen(null)}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
