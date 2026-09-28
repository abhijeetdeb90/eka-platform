import { useState } from "react";
import { cn } from "@/lib/utils";
import ekaLogoImg from "@/assets/brand/eka-logo.png";

export function EkaMark({
  className,
  useVector = false,
}: {
  className?: string;
  useVector?: boolean;
}) {
  const [imageError, setImageError] = useState(false);

  if (!useVector && !imageError) {
    return (
      <img
        src={ekaLogoImg}
        alt=""
        aria-hidden="true"
        onError={() => setImageError(true)}
        className={cn(
          "size-8 rounded-full object-contain shrink-0 drop-shadow-xs select-none",
          className,
        )}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      className={cn("size-8 shrink-0", className)}
    >
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {Array.from({ length: 12 }, (_, i) => {
          const a = (2 * Math.PI * i) / 12;
          return (
            <circle
              key={`o${i}`}
              cx={100 + 40 * Math.cos(a)}
              cy={100 + 40 * Math.sin(a)}
              r="38"
              opacity="0.55"
            />
          );
        })}
        <circle cx="100" cy="100" r="78" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (2 * Math.PI * i) / 12;
          return (
            <circle
              key={`n${i}`}
              cx={100 + 78 * Math.cos(a)}
              cy={100 + 78 * Math.sin(a)}
              r="3.4"
              fill="currentColor"
              stroke="none"
            />
          );
        })}
        <circle cx="100" cy="100" r="34" />
        <circle cx="100" cy="100" r="27" />
        <circle cx="100" cy="90" r="5.4" />
        <path d="M86 112c0-8 6.3-14 14-14s14 6 14 14" />
        <path d="M100 100v14" />
      </g>
    </svg>
  );
}

export function EkaLogo({
  className,
  markClassName,
  withTagline = false,
  useVector = false,
}: {
  className?: string;
  markClassName?: string;
  withTagline?: boolean;
  useVector?: boolean;
}) {
  return (
    <span className={cn("group inline-flex items-center gap-2.5", className)}>
      <EkaMark
        useVector={useVector}
        className={cn(
          "size-8 transition-transform duration-700 ease-out group-hover:scale-105",
          markClassName,
        )}
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl tracking-[0.22em] text-foreground">EKA</span>
        {withTagline && (
          <span className="mt-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            One Within. One With All.
          </span>
        )}
      </span>
    </span>
  );
}
