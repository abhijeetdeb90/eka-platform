import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Access } from "@/lib/unlocks";
import { cn } from "@/lib/utils";

/* ------------------------------------------------ preview vs locked state ---
 * A member always sees the shape of what is waiting. Never a blank wall, never
 * a scolding — a soft preview and one honest sentence about what opens it.
 * A member's own words are never hidden behind this.
 * -------------------------------------------------------------------------- */

export function PreviewGate({
  access,
  tokens,
  title,
  invitation,
  children,
}: {
  access: Access;
  tokens: number;
  title: string;
  invitation: string;
  children: ReactNode;
}) {
  if (access.allowed) return <>{children}</>;
  const { unlock, needs, missingTokens } = access;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border">
      <div
        aria-hidden
        className="pointer-events-none max-h-72 select-none overflow-hidden opacity-40 blur-[2px]"
      >
        {children}
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/95 to-transparent p-5 pt-16">
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          <Lock className="size-3.5" strokeWidth={1.6} aria-hidden /> A preview
        </p>
        <p className="mt-2 font-display text-lg">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{invitation}</p>
        <p className="mt-2 text-xs text-muted-foreground">{access.reason}</p>
        {missingTokens > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            {tokens} of {unlock.gate} Path Tokens. They come from practice, never from payment.
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {(needs === "membership" || needs === "both") && (
            <Button asChild size="sm">
              <Link to="/app/plus">See membership</Link>
            </Button>
          )}
          {missingTokens > 0 && (
            <Button asChild size="sm" variant="outline">
              <Link to="/app/rhythm">Practise today</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/** A quiet strip for surfaces that are open now but will ask for membership later. */
export function PreviewNotice({
  className,
  line,
  cta = "See membership",
}: {
  className?: string;
  line: string;
  cta?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/25 bg-primary-soft/30 p-4",
        className,
      )}
    >
      <p className="text-xs leading-relaxed text-muted-foreground">{line}</p>
      <Button asChild size="sm" variant="outline">
        <Link to="/app/plus">{cta}</Link>
      </Button>
    </div>
  );
}

/* -------------------------------------------------------- Your Path gates ---
 * One panel that says exactly what is open now, what is in preview, and what
 * membership carries. No countdown pressure, no loss language.
 * -------------------------------------------------------------------------- */

import { pathAreas, previewWindow } from "@/lib/unlocks";
import type { Entitlement } from "@/lib/billing";

export function PathGates({
  joinedAt,
  tokens,
  entitlement,
}: {
  joinedAt: string | null | undefined;
  tokens: number;
  entitlement: Entitlement | null | undefined;
}) {
  const window = previewWindow(joinedAt, tokens);
  const areas = pathAreas(window, entitlement);
  const member = entitlement?.active ?? false;

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
        {member
          ? "Open to you"
          : window.open
            ? "Open, while you look around"
            : "Open, and in preview"}
      </p>
      <h2 className="mt-2 font-display text-xl">What Your Path holds</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {member ? "Your membership carries all of this. Nothing here expires." : window.reason}
      </p>

      <ul className="mt-4 space-y-2">
        {areas.map(({ area, open, line }) => (
          <li
            key={area.key}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-3.5",
              open ? "border-primary/30 bg-primary/5" : "border-border/70 bg-parchment/40",
            )}
          >
            <span aria-hidden className={open ? "" : "opacity-50"}>
              {area.glyph}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm">{area.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{line}</p>
            </div>
            <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {open ? "Open" : "Preview"}
            </span>
          </li>
        ))}
      </ul>

      {!member && (
        <PreviewNotice
          className="mt-4"
          line="Membership carries the guided material and the people who make it. Your own words and today's practice are free, always."
        />
      )}
    </section>
  );
}
