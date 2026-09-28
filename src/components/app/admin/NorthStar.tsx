import { useQuery } from "@tanstack/react-query";
import {
  fetchJourneyCompletion,
  fetchMeaningfulDays,
  fetchRetention,
  percent,
  trailingAverage,
} from "@/lib/northstar";

/* ----------------------------------------------------- north-star metrics ---
 * Meaningful Spiritual Days is the only number EKA optimises. Retention and
 * Journey completion say whether the practice actually holds.
 * -------------------------------------------------------------------------- */

export function NorthStar() {
  const { data: msd } = useQuery({ queryKey: ["msd"], queryFn: () => fetchMeaningfulDays(30) });
  const { data: cohorts } = useQuery({
    queryKey: ["retention-cohorts"],
    queryFn: () => fetchRetention(8),
  });
  const { data: journeys } = useQuery({
    queryKey: ["journey-completion"],
    queryFn: fetchJourneyCompletion,
  });

  const rows = msd ?? [];
  const peak = Math.max(1, ...rows.map((r) => r.members));
  const today = rows.at(-1);
  const avg = trailingAverage(rows);

  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">North star</p>
        <h2 className="mt-2 font-display text-xl">Meaningful Spiritual Days</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          A day on which a member touched at least two of Journey, Practice, Journal or Observe. Not
          sessions, not minutes on screen.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Today" value={today?.members ?? 0} />
        <Stat label="7-day average" value={avg} />
        <Stat label="Actions today" value={today?.actions ?? 0} />
      </div>

      <div
        className="flex h-24 items-end gap-[3px]"
        role="img"
        aria-label="Meaningful Spiritual Days over the last 30 days"
      >
        {rows.map((r) => (
          <div
            key={r.day}
            title={`${r.day}: ${r.members}`}
            className="flex-1 rounded-t bg-primary/70"
            style={{ height: `${Math.max(2, (r.members / peak) * 100)}%` }}
          />
        ))}
        {rows.length === 0 && <p className="text-xs text-muted-foreground">No data yet.</p>}
      </div>

      <div>
        <h3 className="font-display text-lg">Retention by signup week</h3>
        <table className="mt-2 w-full text-xs">
          <thead className="text-muted-foreground">
            <tr className="text-left">
              <th className="py-1 font-normal">Cohort</th>
              <th className="py-1 font-normal">Joined</th>
              <th className="py-1 font-normal">Day 7</th>
              <th className="py-1 font-normal">Day 30</th>
            </tr>
          </thead>
          <tbody>
            {(cohorts ?? []).map((c) => (
              <tr key={c.cohort} className="border-t border-border/60">
                <td className="py-1.5">{new Date(c.cohort).toLocaleDateString()}</td>
                <td className="py-1.5 tabular-nums">{c.signups}</td>
                <td className="py-1.5 tabular-nums">
                  {c.d7} · {percent(c.d7, c.signups)}%
                </td>
                <td className="py-1.5 tabular-nums">
                  {c.d30} · {percent(c.d30, c.signups)}%
                </td>
              </tr>
            ))}
            {(cohorts ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="py-2 text-muted-foreground">
                  No cohorts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="font-display text-lg">Journey completion</h3>
        <ul className="mt-2 space-y-1.5">
          {(journeys ?? []).map((j) => (
            <li key={j.journey} className="flex items-baseline justify-between gap-3 text-xs">
              <span className="min-w-0 truncate text-muted-foreground">
                {j.journey} · {j.duration_days} days
              </span>
              <span className="shrink-0 tabular-nums">
                {j.completed}/{j.enrolled} · {percent(j.completed, j.enrolled)}%
              </span>
            </li>
          ))}
          {(journeys ?? []).length === 0 && (
            <li className="text-xs text-muted-foreground">No enrolments yet.</li>
          )}
        </ul>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/70 bg-parchment/40 p-3">
      <p className="font-display text-2xl tabular-nums">{value}</p>
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
    </div>
  );
}
