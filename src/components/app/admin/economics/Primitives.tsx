import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { formatMoney, formatPercent } from "@/lib/money";

/* Small, quiet building blocks so every section of the founder dashboard
 * reads the same way. Nothing here calculates money; it only presents it. */

export function Section({
  title,
  hint,
  action,
  children,
  id,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-lg">{title}</h2>
          {hint && <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-4", className)}>{children}</div>
  );
}

export function Stat({
  label,
  value,
  sub,
  tone = "default",
  emphasis,
}: {
  label: string;
  value: string;
  sub?: ReactNode;
  tone?: "default" | "positive" | "negative";
  emphasis?: boolean;
}) {
  return (
    <Panel className={cn(emphasis && "border-primary/40 bg-primary/5")}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 font-display tabular-nums",
          emphasis ? "text-3xl" : "text-2xl",
          tone === "negative" && "text-destructive",
        )}
      >
        {value}
      </p>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </Panel>
  );
}

export function Delta({ current, previous }: { current: number; previous: number }) {
  if (!previous) return <span className="text-muted-foreground">No previous period</span>;
  const change = ((current - previous) / Math.abs(previous)) * 100;
  const up = change >= 0;
  return (
    <span className={up ? "text-primary" : "text-destructive"}>
      {up ? "+" : ""}
      {change.toFixed(1)}% vs previous period
    </span>
  );
}

export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <Panel className="border-dashed">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
    </Panel>
  );
}

export function Money({
  minor,
  currency = "INR",
  decimals,
}: {
  minor: number;
  currency?: string;
  decimals?: boolean;
}) {
  return (
    <span className="tabular-nums">
      {formatMoney(minor, currency, { decimals: decimals ?? false })}
    </span>
  );
}

export function Row({
  label,
  value,
  strong,
  negative,
}: {
  label: string;
  value: ReactNode;
  strong?: boolean;
  negative?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 py-1.5 text-sm",
        strong && "border-t border-border pt-2 font-medium",
      )}
    >
      <span className={strong ? "" : "text-muted-foreground"}>{label}</span>
      <span className={cn("tabular-nums", negative && "text-destructive")}>{value}</span>
    </div>
  );
}

export function Progress({
  value,
  target,
  label,
  format,
}: {
  value: number;
  target: number;
  label: string;
  format: (n: number) => string;
}) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span>{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {format(value)} / {target > 0 ? format(target) : "—"}
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {target > 0 ? `${pct.toFixed(0)}%` : "No target set"}
      </p>
    </div>
  );
}

export function PercentText({ value }: { value: number | null }) {
  return <span className="tabular-nums">{formatPercent(value)}</span>;
}

export function Scroller({ children }: { children: ReactNode }) {
  return <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">{children}</div>;
}
