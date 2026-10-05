import React from "react";
import { Check, ShieldCheck, Sparkles, Building2, Award, Star } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ProfileRow } from "@/lib/api";

export type EkaBadgeTier = "member" | "contributor" | "creator" | "brand" | "steward";

export interface EkaBadgeProps {
  tier?: EkaBadgeTier;
  profile?: (Partial<ProfileRow> & {
    is_brand?: boolean;
    is_creator?: boolean;
    is_contributor?: boolean;
    badge_specialization?: string;
  }) | null;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function resolveBadgeTier(
  profile?: (Partial<ProfileRow> & {
    is_brand?: boolean;
    is_creator?: boolean;
    is_contributor?: boolean;
  }) | null,
): EkaBadgeTier {
  if (!profile) return "member";

  if (profile.account_type === "brand" || profile.is_brand) {
    return "brand";
  }
  if (profile.verified && (profile.account_type === "creator" || profile.is_creator)) {
    return "creator";
  }
  if (profile.verified || profile.is_contributor) {
    return "contributor";
  }
  // All authenticated participants are EKA members
  return "member";
}

const BADGE_METADATA: Record<
  EkaBadgeTier,
  {
    title: string;
    role: string;
    color: string;
    border: string;
    bg: string;
    text: string;
    gradient: string;
    description: string;
    criteria: string[];
    disclaimer: string;
  }
> = {
  member: {
    title: "EKA Member",
    role: "Authenticated Seeker",
    color: "text-sky-500",
    border: "border-sky-500/30",
    bg: "bg-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
    gradient: "from-sky-400 to-blue-600",
    description: "An authentic, authenticated member of the EKA living knowledge sanctuary.",
    criteria: [
      "Authenticated account credentials",
      "Accepted EKA community standards",
      "Active participant in discussions and study",
    ],
    disclaimer: "Basic membership represents personal participation, not formal editorial review.",
  },
  contributor: {
    title: "Verified Contributor",
    role: "Community Credibility",
    color: "text-slate-400",
    border: "border-slate-300 dark:border-slate-700",
    bg: "bg-slate-100 dark:bg-slate-800/80",
    text: "text-slate-700 dark:text-slate-200",
    gradient: "from-slate-200 via-slate-400 to-zinc-400",
    description:
      "A trusted contributor with a verified record of useful reflections and community confirmations.",
    criteria: [
      "Demonstrated contribution history",
      "Multiple community confirmations on shared insights",
      "Source citations provided in shared posts",
      "Maintained constructive community conduct",
    ],
    disclaimer: "Silver badge is earned through participation and never granted for purchase.",
  },
  creator: {
    title: "EKA Creator & Knowledge Keeper",
    role: "Recognized Cultural Authority",
    color: "text-amber-500",
    border: "border-amber-400/40 dark:border-amber-500/30",
    bg: "bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-300",
    gradient: "from-amber-300 via-amber-500 to-yellow-600",
    description:
      "Recognized cultural practitioner, scholar, artist, or storyteller preserving living heritage.",
    criteria: [
      "Identity and cultural lineage confirmed",
      "Primary-source backed contributions published",
      "Peer review and community corroboration",
      "Exemplary adherence to epistemic grounding",
    ],
    disclaimer: "Gold signifies proven dedication to heritage curation. Opinions remain their own.",
  },
  brand: {
    title: "Verified Organization",
    role: "Official Institution / Enterprise",
    color: "text-rose-500",
    border: "border-rose-400/40 dark:border-rose-500/30",
    bg: "bg-rose-500/10",
    text: "text-rose-700 dark:text-rose-300",
    gradient: "from-rose-400 via-red-500 to-rose-700",
    description:
      "An officially verified institution, heritage trust, archive, monastery, or cultural enterprise.",
    criteria: [
      "Official corporate or trust identity validated",
      "Authorized representative verification",
      "Verified institutional domain or archival registry",
    ],
    disclaimer:
      "Red indicates an official organization. Verification does not imply EKA editorial endorsement.",
  },
  steward: {
    title: "EKA Steward",
    role: "Archival Trustee",
    color: "text-cyan-400",
    border: "border-cyan-300/40",
    bg: "bg-cyan-500/10",
    text: "text-cyan-700 dark:text-cyan-300",
    gradient: "from-cyan-200 via-teal-300 to-sky-400",
    description: "Exceptional archival trustee or elder reviewing community epistemic provenance.",
    criteria: [
      "Extensive academic or institutional archival benchmark",
      "EKA Governance election or trustee appointment",
      "Stewards epistemic provenance verification",
    ],
    disclaimer: "Custodial role over the cultural knowledge graph.",
  },
};

export function EkaBadge({
  tier: explicitTier,
  profile,
  className,
  size = "sm",
  showLabel = false,
}: EkaBadgeProps) {
  const tier = explicitTier || resolveBadgeTier(profile);
  const meta = BADGE_METADATA[tier];
  const specialization =
    profile?.badge_specialization ||
    (profile?.interests && profile.interests.length > 0 ? profile.interests.slice(0, 2).join(" · ") : null);

  const sizeClasses = {
    xs: "size-3.5",
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
  };

  const badgeIcon = () => {
    switch (tier) {
      case "member":
        return (
          <span
            className={cn(
              "relative inline-flex items-center justify-center rounded-full bg-sky-500 text-white shadow-xs transition-transform hover:scale-110",
              sizeClasses[size],
            )}
            title="EKA Member"
          >
            <Check className="size-[65%] stroke-[3.5]" />
          </span>
        );
      case "contributor":
        return (
          <span
            className={cn(
              "relative inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-slate-300 via-slate-100 to-zinc-400 text-slate-800 shadow-xs ring-1 ring-slate-400/40 transition-transform hover:scale-110",
              sizeClasses[size],
            )}
            title="Verified Contributor"
          >
            <Award className="size-[68%] stroke-[2.8]" />
          </span>
        );
      case "creator":
        return (
          <span
            className={cn(
              "relative inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-yellow-500 text-amber-950 shadow-sm ring-1 ring-amber-500/50 transition-transform hover:scale-110",
              sizeClasses[size],
            )}
            title="EKA Creator & Knowledge Keeper"
          >
            <Sparkles className="size-[65%] stroke-[2.8] fill-amber-950/20" />
          </span>
        );
      case "brand":
        return (
          <span
            className={cn(
              "relative inline-flex items-center justify-center rounded-[5px] bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-xs ring-1 ring-red-400/50 transition-transform hover:scale-110",
              sizeClasses[size],
            )}
            title="Verified Organization"
          >
            <Building2 className="size-[65%] stroke-[2.8]" />
          </span>
        );
      case "steward":
        return (
          <span
            className={cn(
              "relative inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-cyan-300 via-teal-100 to-sky-400 text-cyan-950 shadow-md ring-1 ring-cyan-400/60 transition-transform hover:scale-110",
              sizeClasses[size],
            )}
            title="EKA Steward"
          >
            <Star className="size-[65%] stroke-[2.8] fill-cyan-950/20" />
          </span>
        );
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Verified badge: ${meta.title}`}
          className={cn(
            "inline-flex items-center gap-1.5 align-middle select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-full cursor-pointer",
            className,
          )}
        >
          {badgeIcon()}
          {showLabel && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase border",
                meta.bg,
                meta.border,
                meta.text,
              )}
            >
              {meta.title}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-80 rounded-2xl border border-border bg-card p-4 shadow-xl backdrop-blur-md"
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start gap-3 border-b border-border/60 pb-3">
            <div className="mt-0.5 shrink-0">{badgeIcon()}</div>
            <div className="min-w-0">
              <h4 className="font-display text-sm font-semibold leading-tight text-foreground">
                {meta.title}
              </h4>
              <p className={cn("text-[11px] font-medium tracking-tight", meta.text)}>
                {meta.role}
              </p>
              {specialization && (
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  Focus: <span className="text-foreground">{specialization}</span>
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs leading-relaxed text-muted-foreground">{meta.description}</p>

          {/* Verification Criteria */}
          <div className="space-y-1.5 rounded-xl bg-accent/40 p-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Verification Standards
            </p>
            <ul className="space-y-1 text-xs text-foreground/90">
              {meta.criteria.map((c, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-500" strokeWidth={2.5} />
                  <span className="leading-tight text-[11px]">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] leading-tight text-muted-foreground/80 italic">
            {meta.disclaimer}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
