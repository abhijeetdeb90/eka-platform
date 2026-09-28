import { REACTIONS, toggleReaction, type ReactionId } from "@/lib/discover";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Respect-first reactions. There is no single "like" — the strongest signals
 * are "learned something" and "cross-cultural discovery", not agreement.
 */
export function ReactionBar({
  targetKind,
  targetId,
  counts,
  mine,
  onChanged,
}: {
  targetKind: string;
  targetId: string;
  counts: Record<string, number>;
  mine: string[];
  onChanged: () => void;
}) {
  const press = async (id: ReactionId) => {
    const on = mine.includes(id);
    await toggleReaction(targetKind, targetId, id, on);
    if (!on) track("reel_reaction", { reaction: id, targetKind });
    onChanged();
  };

  return (
    <div className="flex flex-wrap gap-2">
      {REACTIONS.map((r) => {
        const active = mine.includes(r.id);
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => press(r.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
              active ? "border-primary bg-primary-soft/40" : "border-border hover:bg-accent",
            )}
            aria-pressed={active}
          >
            <span aria-hidden>{r.emoji}</span>
            <span>{r.label}</span>
            {(counts[r.id] ?? 0) > 0 && (
              <span className="text-muted-foreground">{counts[r.id]}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
