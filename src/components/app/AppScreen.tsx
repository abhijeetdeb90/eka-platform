import type { ReactNode } from "react";
import { PageShell, type PageShellVariant } from "@/components/layout/PageShell";

export function AppScreen({
  eyebrow,
  title,
  action,
  children,
  variant = "reading",
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
  variant?: PageShellVariant;
}) {
  return (
    <PageShell variant={variant} eyebrow={eyebrow} title={title} action={action}>
      {children}
    </PageShell>
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
