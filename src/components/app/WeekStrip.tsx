import { cn } from "@/lib/utils";

type Cell = { label: string; key: string; kept: boolean; future: boolean; today: boolean };

/** Seven days, filled or open. No red, no warnings. */
export function WeekStrip({ cells, kept }: { cells: Cell[]; kept: number }) {
  return (
    <div>
      <ul className="flex items-end gap-2" aria-label={`This week: ${kept} of 7 days kept`}>
        {cells.map((c) => (
          <li key={c.key} className="flex flex-1 flex-col items-center gap-1.5">
            <span
              className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
              aria-hidden="true"
            >
              {c.label}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "size-3 rounded-full border",
                c.kept
                  ? "border-primary bg-primary"
                  : c.future
                    ? "border-border/60"
                    : "border-border bg-muted",
                c.today && !c.kept && "ring-2 ring-primary/30",
              )}
            />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-muted-foreground">{kept} / 7 days</p>
    </div>
  );
}
