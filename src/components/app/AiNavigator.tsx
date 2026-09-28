import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Compass, UserRound } from "lucide-react";
import { navigator as navigatorFn, type NavigatorGuide } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

/**
 * A navigator, not an oracle: it reads only the member's own passport and the
 * observable trust graph, explains every suggestion, and always offers a person.
 */
export function AiNavigator() {
  const ask = useServerFn(navigatorFn);
  const [text, setText] = useState("");
  const [guides, setGuides] = useState<NavigatorGuide[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [asked, setAsked] = useState(false);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await ask();
      setText(result.text);
      setGuides(result.guides);
      setError(result.error);
      track("navigator_recommendation", { grounded: result.hasPassport });
    } catch {
      setError("The navigator could not answer just now.");
    }
    setAsked(true);
    setLoading(false);
  };

  return (
    <section className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm">
            <Compass className="size-4 text-primary" aria-hidden />
            Wisdom Navigator
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Suggestions drawn only from your own passport and from guides EKA has actually verified.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={run} disabled={loading}>
          {loading ? "Thinking…" : "What next"}
        </Button>
      </div>

      {error && <p className="mt-3 text-xs text-muted-foreground">{error}</p>}

      {text && (
        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {text}
        </p>
      )}

      {asked && (
        <div className="mt-5 border-t border-border/60 pt-4">
          <p className="flex items-center gap-2 text-sm">
            <UserRound className="size-4 text-primary" aria-hidden />
            Would you rather talk to a person?
          </p>
          {guides.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {guides.slice(0, 3).map((g) => (
                <li key={g.slug} className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate">{g.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {g.headline ?? g.traditions.join(", ") ?? ""}
                      {g.verified ? " · identity verified" : ""}
                      {g.recommended ? " · EKA recommended" : ""}
                    </span>
                  </span>
                  <Button asChild size="sm" variant="ghost">
                    <Link
                      to="/app/market/$slug"
                      params={{ slug: g.slug }}
                      onClick={() => track("navigator_handoff", { slug: g.slug })}
                    >
                      Talk to them
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              No verified guides are available yet. You can browse the marketplace when they are.
            </p>
          )}
          <Button asChild size="sm" variant="ghost" className="mt-2 px-0">
            <Link to="/app/market" onClick={() => track("navigator_handoff", { slug: "browse" })}>
              Browse all guides
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}
