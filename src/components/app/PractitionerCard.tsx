import { Link } from "@tanstack/react-router";
import { BadgeCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/app/Avatar";
import {
  CATEGORY_LABEL,
  badgesFor,
  formatINR,
  fromPrice,
  isEkaVerified,
  type Package,
  type Practitioner,
} from "@/lib/marketplace";
import { cn } from "@/lib/utils";

export function VerifiedMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] text-primary", className)}>
      <BadgeCheck aria-hidden="true" className="size-3.5" />
      Eka Verified
    </span>
  );
}

export function BadgeRow({ practitioner }: { practitioner: Practitioner }) {
  const badges = badgesFor(practitioner);
  if (!badges.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {badges.map((b) => (
        <li
          key={b.label}
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em]",
            b.tone === "verified"
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border text-muted-foreground",
          )}
        >
          {b.label}
        </li>
      ))}
    </ul>
  );
}

export function PractitionerCard({
  practitioner,
  packages,
  compact,
}: {
  practitioner: Practitioner;
  packages: Package[];
  compact?: boolean;
}) {
  const min = fromPrice(packages);
  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5">
      <div className="flex min-w-0 items-start gap-3">
        <UserAvatar
          className="size-11 shrink-0"
          profile={{ display_name: practitioner.display_name, avatar_url: practitioner.avatar_url }}
        />
        <div className="min-w-0">
          {isEkaVerified(practitioner) && <VerifiedMark />}
          <h3 className="truncate font-display text-lg leading-tight">
            {practitioner.display_name}
          </h3>
          <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star aria-hidden="true" className="size-3 fill-current" />
              {practitioner.rating.toFixed(1)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{practitioner.session_count} sessions</span>
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {practitioner.categories.map((c) => CATEGORY_LABEL[c] ?? c).join(" · ")}
      </p>
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {practitioner.years_experience}+ years experience
      </p>

      {!compact && (
        <p className="text-sm leading-relaxed text-foreground/85">{practitioner.headline}</p>
      )}

      <BadgeRow practitioner={practitioner} />

      <div className="mt-auto space-y-3 pt-1">
        {min !== null && (
          <p className="text-sm">
            Packages from <span className="font-medium">{formatINR(min)}</span>
          </p>
        )}
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to="/app/market/$slug" params={{ slug: practitioner.slug }}>
              View profile
            </Link>
          </Button>
          <Button asChild size="sm" className="flex-1">
            <Link to="/app/market/$slug" params={{ slug: practitioner.slug }} hash="packages">
              Book session
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
