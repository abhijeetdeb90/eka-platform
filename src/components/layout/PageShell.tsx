import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PageShellVariant = "feed" | "reading" | "canvas" | "broad";

export interface PageShellProps {
  variant?: PageShellVariant;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  rightRail?: ReactNode;
  className?: string;
  contentClassName?: string;
}

const VARIANT_CONTAINER_CLASSES: Record<PageShellVariant, string> = {
  feed: "max-w-5xl px-4 sm:px-6 py-6 lg:py-10",
  reading: "max-w-2xl px-5 py-6 lg:py-10",
  canvas: "max-w-6xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8",
  broad: "max-w-7xl px-4 sm:px-6 lg:px-8 py-6",
};

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
  className,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  if (!eyebrow && !title && !subtitle && !action) return null;

  return (
    <header className={cn("grid animate-rise grid-cols-[minmax(0,1fr)_auto] items-end gap-4 pb-6", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        {title && (
          <h1 className="mt-1.5 font-display text-2xl font-normal leading-snug text-foreground sm:text-3xl">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-light">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

export function PageShell({
  variant = "feed",
  eyebrow,
  title,
  subtitle,
  action,
  children,
  rightRail,
  className,
  contentClassName,
}: PageShellProps) {
  const containerClass = VARIANT_CONTAINER_CLASSES[variant];

  return (
    <div className={cn("mx-auto w-full", containerClass, className)}>
      <PageHeader eyebrow={eyebrow} title={title} subtitle={subtitle} action={action} />

      {rightRail ? (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className={cn("min-w-0 space-y-6", contentClassName)}>{children}</div>
          <aside aria-label="Sidebar Rail" className="hidden xl:block">
            <div className="sticky top-6 max-h-[calc(100dvh-3rem)] overflow-y-auto pb-10 pr-1">
              {rightRail}
            </div>
          </aside>
        </div>
      ) : (
        <div className={cn("space-y-6", contentClassName)}>{children}</div>
      )}
    </div>
  );
}
