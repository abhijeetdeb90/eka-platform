import { BookCheck, Lightbulb, MessageSquare, Bot, AlertCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProvenanceKind =
  "documented" | "interpretation" | "opinion" | "community" | "ai_assisted" | "unverified";

export interface ProvenanceBadgeProps {
  kind: ProvenanceKind | string;
  sourceCitations?: number;
  className?: string;
  showTooltip?: boolean;
}

const CONFIG: Record<
  ProvenanceKind,
  {
    label: string;
    icon: typeof BookCheck;
    classes: string;
    description: string;
  }
> = {
  documented: {
    label: "Documented Tradition",
    icon: BookCheck,
    classes: "bg-forest/10 text-forest border-forest/20",
    description:
      "Supported by identified canonical scriptures, historical texts, or archaeological records.",
  },
  interpretation: {
    label: "Interpretation",
    icon: Lightbulb,
    classes: "bg-terracotta/10 text-terracotta border-terracotta/20",
    description:
      "A philosophical explanation or personal commentary; not asserted as universal canon.",
  },
  opinion: {
    label: "Opinion & Reflection",
    icon: MessageSquare,
    classes: "bg-sand/60 text-muted-foreground border-border/80",
    description: "A personal reflection or experiential insight.",
  },
  community: {
    label: "Living Community Practice",
    icon: Shield,
    classes: "bg-saffron/15 text-saffron-dark border-saffron/30",
    description: "A living oral tradition or regional custom observed by a community.",
  },
  ai_assisted: {
    label: "AI Synthesis (Unverified)",
    icon: Bot,
    classes: "bg-indigo-ink/10 text-indigo-ink border-indigo-ink/20",
    description: "Machine-synthesized summary awaiting human reviewer validation.",
  },
  unverified: {
    label: "Unverified Claim",
    icon: AlertCircle,
    classes: "bg-destructive/10 text-destructive border-destructive/20",
    description: "Awaiting primary source citations and community verification.",
  },
};

export function ProvenanceBadge({ kind, sourceCitations, className }: ProvenanceBadgeProps) {
  const normalized =
    (kind.toLowerCase().replace(/[^a-z]/g, "_") as ProvenanceKind) in CONFIG
      ? (kind.toLowerCase().replace(/[^a-z]/g, "_") as ProvenanceKind)
      : "opinion";

  const item = CONFIG[normalized] ?? CONFIG.opinion;
  const Icon = item.icon;

  return (
    <span
      title={item.description}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-wide transition-colors",
        item.classes,
        className,
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden="true" />
      <span>{item.label}</span>
      {typeof sourceCitations === "number" && sourceCitations > 0 && (
        <span className="opacity-75">({sourceCitations})</span>
      )}
    </span>
  );
}
