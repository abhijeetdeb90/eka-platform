import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { STAGES, stageProgress, type Stage } from "@/lib/path";
import { UNLOCKS, checkAccess } from "@/lib/unlocks";
import type { Entitlement } from "@/lib/billing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ journey map ---
 * Progression here is spiritual, not numeric: Begin, Continue, Return,
 * Deepen, Unlock. Every closed stage says plainly what opens it, and never
 * implies the member is behind.
 * -------------------------------------------------------------------------- */

export const MOVEMENTS = [
  { key: "begin", verb: "Begin", line: "Show up once." },
  { key: "discipline", verb: "Continue", line: "Come back tomorrow." },
  { key: "awareness", verb: "Return", line: "Come back after you stopped." },
  { key: "wisdom", verb: "Deepen", line: "Let what you saw change how you act." },
  { key: "integration", verb: "Unlock", line: "The practice and the day become one." },
] as const;

function verbFor(stage: Stage) {
  return MOVEMENTS.find((m) => m.key === stage.key) ?? MOVEMENTS[0];
}

export function JourneyMap({
  tokens,
  entitlement,
}: {
  tokens: number;
  entitlement: Entitlement | null | undefined;
}) {
  const progress = stageProgress(tokens);

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Your Journey</p>
      <h2 className="mt-2 font-display text-xl">Begin · Continue · Return · Deepen · Unlock</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        Five movements, not five levels. You are at{" "}
        <strong className="font-normal text-foreground">{progress.current.name}</strong>
        {progress.next
          ? ` — ${progress.remaining} Path Tokens from ${progress.next.name}.`
          : " — the map ends, the practice does not."}
      </p>

      <ol className="mt-5 space-y-3">
        {STAGES.map((stage) => {
          const reached = tokens >= stage.gate;
          const current = stage.key === progress.current.key;
          const movement = verbFor(stage);
          const gated = UNLOCKS.filter((u) => u.gate === stage.gate);
          const blocked = gated
            .map((u) => checkAccess(u.key, tokens, entitlement))
            .find((a) => !a.allowed);

          return (
            <li
              key={stage.key}
              className={cn(
                "rounded-xl border p-4",
                current
                  ? "border-primary/50 bg-primary/5"
                  : reached
                    ? "border-primary/25 bg-card"
                    : "border-border/70 bg-parchment/40",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full border text-base",
                    reached
                      ? "border-primary/40 bg-background"
                      : "border-border bg-background/60 opacity-60",
                  )}
                >
                  {reached ? stage.glyph : <Lock className="size-3.5" strokeWidth={1.6} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="uppercase tracking-[0.18em] text-[11px] text-muted-foreground">
                      {movement.verb}
                    </span>
                    <span className="mx-2 text-muted-foreground/50">·</span>
                    {stage.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {reached ? stage.invitation : movement.line}
                  </p>

                  {!reached && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Locked because this stage opens at {stage.gate} Path Tokens. You have {tokens}
                      . Tokens come from practice, reflection and observation — they can never be
                      bought.
                    </p>
                  )}

                  {reached && blocked && (
                    <p className="mt-2 text-xs text-muted-foreground">{blocked.reason}</p>
                  )}

                  {gated.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {gated.map((u) => (
                        <li key={u.key} className="text-xs text-muted-foreground">
                          <span aria-hidden>{u.glyph}</span> {u.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {progress.next && (
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to="/app/rhythm">Practise today</Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link to="/app/journeys">Choose a Journey</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
