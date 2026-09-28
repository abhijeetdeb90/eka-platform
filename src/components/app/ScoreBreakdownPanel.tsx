import { useQuery } from "@tanstack/react-query";
import { fetchMyScoreBreakdown, fetchScoreHistory, improvementSuggestions } from "@/lib/trust";
import { useFeatureFlag } from "@/hooks/useFlags";

/** "Why this score?" — every dimension, its weight, and the evidence behind it. */
export function ScoreBreakdownPanel() {
  const enabled = useFeatureFlag("creator_score_v2_enabled");
  const { data: b } = useQuery({
    queryKey: ["score-breakdown"],
    queryFn: fetchMyScoreBreakdown,
    enabled,
  });
  const { data: history } = useQuery({
    queryKey: ["score-history"],
    queryFn: fetchScoreHistory,
    enabled,
  });

  if (!enabled || !b) return null;

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-lg">Your Creator Score</h2>
        <span className="font-display text-2xl">
          {b.total}
          <span className="text-sm text-muted-foreground">/1000</span>
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Built from what happened, not from what was spent. Advertising cannot move it.
      </p>

      <div className="mt-4 space-y-2.5">
        {b.weights.map((w) => {
          const value = b.dimensions[w.key];
          return (
            <div key={w.key}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span>{w.label}</span>
                <span className="text-muted-foreground">
                  {value === null ? "not enough data yet" : `${Math.round(value)} / 100`} ·{" "}
                  {w.percent}%
                </span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${value ?? 0}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{w.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-border/60 p-4">
        <p className="text-sm">What would raise it</p>
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          {improvementSuggestions(b).map((s) => (
            <li key={s}>· {s}</li>
          ))}
        </ul>
      </div>

      {history && history.length > 1 && (
        <p className="mt-4 text-xs text-muted-foreground">
          History:{" "}
          {history
            .slice(0, 6)
            .map((h) => `${new Date(h.created_at).toLocaleDateString()} — ${h.total}`)
            .join(" · ")}
        </p>
      )}
    </section>
  );
}
