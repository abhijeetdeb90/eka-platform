import type { ReactNode } from "react";

export function AppScreen({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 pt-6 lg:pt-10">
      <header className="grid animate-rise grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">{eyebrow}</p>
          )}
          <h1 className="mt-2 text-2xl leading-snug sm:text-3xl">{title}</h1>
        </div>
        {action}
      </header>
      <div className="mt-6 space-y-4">{children}</div>
    </div>
  );
}

export function Panel({
  title,
  meta,
  children,
  footer,
}: {
  title?: string | undefined;
  meta?: string | undefined;
  children?: ReactNode | undefined;
  footer?: ReactNode | undefined;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
      {(title || meta) && (
        <div className="flex items-start justify-between gap-4">
          {title && <h2 className="font-display text-lg leading-snug">{title}</h2>}
          {meta && <span className="shrink-0 text-xs text-muted-foreground">{meta}</span>}
        </div>
      )}
      {children && (
        <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
      )}
      {footer && <div className="mt-4">{footer}</div>}
    </section>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-10 text-center">
      <p className="font-display text-lg">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
