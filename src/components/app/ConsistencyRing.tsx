import { cn } from "@/lib/utils";

/**
 * A signature EKA element: an arc, not a score. It shows how often you returned
 * over a recent window, and never frames the remainder as failure.
 */
export function ConsistencyRing({
  percent,
  kept,
  window,
  size = 116,
  className,
}: {
  percent: number;
  kept: number;
  window: number;
  size?: number;
  className?: string;
}) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = (Math.min(100, Math.max(0, percent)) / 100) * c;

  return (
    <div className={cn("flex items-center gap-5", className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`Rhythm kept on ${kept} of the last ${window} days`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${c - filled}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="text-primary transition-[stroke-dasharray] duration-700"
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-display text-2xl">
          {percent}%
        </span>
      </div>
      <div className="min-w-0">
        <p className="font-display text-lg">Your practice</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          You've maintained your rhythm for {kept} of the last {window} days.
        </p>
        {percent < 100 && (
          <p className="mt-2 text-sm text-muted-foreground">
            Your path is still here. Begin again.
          </p>
        )}
      </div>
    </div>
  );
}
