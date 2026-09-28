import { Link } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/eka";
import type { ProfileRow } from "@/lib/api";

export function UserAvatar({
  profile,
  className,
}: {
  profile: Pick<ProfileRow, "display_name" | "avatar_url"> | null;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-primary-soft text-sm font-medium text-foreground",
        className,
      )}
    >
      {profile?.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt={profile.display_name ? `${profile.display_name}'s avatar` : "User profile avatar"}
          className="size-full object-cover"
        />
      ) : (
        initials(profile?.display_name)
      )}
    </span>
  );
}

export function AuthorLine({ profile, meta }: { profile: ProfileRow | null; meta?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {profile?.username ? (
        <Link to="/app/u/$username" params={{ username: profile.username }}>
          <UserAvatar profile={profile} />
        </Link>
      ) : (
        <UserAvatar profile={profile} />
      )}
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-1.5">
          {profile?.username ? (
            <Link
              to="/app/u/$username"
              params={{ username: profile.username }}
              className="truncate text-sm font-medium hover:underline"
            >
              {profile.display_name ?? profile.username}
            </Link>
          ) : (
            <span className="truncate text-sm font-medium">Someone</span>
          )}
          {profile?.verified && <BadgeCheck className="size-4 shrink-0 text-primary" />}
          {(profile as unknown as { is_founding_contributor?: boolean })
            ?.is_founding_contributor && (
            <span
              className="rounded-full border border-saffron/30 bg-saffron/10 px-1.5 py-0.5 text-[9px] font-medium tracking-wider text-saffron uppercase"
              title="EKA Founding Contributor"
            >
              Founding
            </span>
          )}
        </div>
        {meta && <p className="truncate text-xs text-muted-foreground">{meta}</p>}
      </div>
    </div>
  );
}
