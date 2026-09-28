import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { entitlementFor, fetchSubscription } from "@/lib/billing";
import { fetchEvents, totalTokens } from "@/lib/path";
import { checkAccess, ladder, type Access } from "@/lib/unlocks";

/** Everything a screen needs to decide what is open, without repeating queries. */
export function useUnlocks() {
  const { data: events } = useQuery({ queryKey: ["path-events"], queryFn: () => fetchEvents() });
  const { data: sub } = useQuery({ queryKey: ["subscription"], queryFn: fetchSubscription });
  const tokens = totalTokens(events ?? []);
  const entitlement = entitlementFor(sub ?? null);
  return {
    tokens,
    entitlement,
    access: (key: string) => checkAccess(key, tokens, entitlement),
    ladder: () => ladder(tokens, entitlement),
  };
}

/**
 * A closed door in EKA is never a scolding. It says exactly what opens it,
 * and never suggests the member is behind.
 */
export function UnlockNotice({ access, tokens }: { access: Access; tokens: number }) {
  if (access.allowed) return null;
  const { unlock, needs, missingTokens } = access;
  return (
    <div className="rounded-2xl border border-primary/25 bg-parchment/50 p-5">
      <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
        <Lock className="size-3.5" strokeWidth={1.6} aria-hidden="true" />
        Opens later
      </p>
      <p className="mt-2 font-display text-lg">
        {unlock.glyph} {unlock.title}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{access.reason}</p>
      {missingTokens > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          You have {tokens} of {unlock.gate} Path Tokens. Every practice, observation and reflection
          adds to them.
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {missingTokens > 0 && (
          <Button asChild size="sm" variant="outline">
            <Link to="/app/rhythm">Practice today</Link>
          </Button>
        )}
        {(needs === "membership" || needs === "both") && (
          <Button asChild size="sm">
            <Link to="/app/plus">See membership</Link>
          </Button>
        )}
        <Button asChild size="sm" variant="ghost">
          <Link to="/app/path" hash="unlocks">
            What opens when
          </Link>
        </Button>
      </div>
    </div>
  );
}

/** The full ladder, so nothing about progression is a surprise. */
export function UnlockLadder() {
  const { tokens, ladder: rungs } = useUnlocks();
  return (
    <ul className="space-y-2">
      {rungs().map(({ unlock, access }) => (
        <li
          key={unlock.key}
          className={`rounded-xl border p-3.5 ${access.allowed ? "border-primary/35 bg-primary/5" : "border-border/70 bg-card"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm">
                <span aria-hidden="true">{unlock.glyph}</span> {unlock.title}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{unlock.detail}</p>
            </div>
            <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {access.allowed
                ? "Open"
                : unlock.gate > tokens
                  ? `${unlock.gate} tokens`
                  : "Membership"}
            </span>
          </div>
          {!access.allowed && <p className="mt-2 text-xs text-muted-foreground">{access.reason}</p>}
        </li>
      ))}
    </ul>
  );
}
