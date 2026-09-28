import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { companion } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";

type Mode = "draft" | "summary" | "recommend";

const LABEL: Record<Mode, string> = {
  draft: "Help me start",
  summary: "What has changed",
  recommend: "What next",
};

/**
 * A quiet guide, not a chatbot: one button, one short answer, no thread.
 */
export function AiCompanion({
  mode,
  note,
  onUse,
  title,
  hint,
}: {
  mode: Mode;
  note?: string;
  onUse?: (text: string) => void;
  title?: string;
  hint?: string;
}) {
  const ask = useServerFn(companion);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await ask({ data: { mode, note: note ?? "" } });
      setText(result.text);
      setError(result.error);
    } catch {
      setError("The companion could not answer just now.");
    }
    setLoading(false);
  };

  return (
    <section className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm">
            <Sparkles className="size-4 text-primary" aria-hidden />
            {title ?? "Reflection companion"}
          </p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <Button size="sm" variant="outline" onClick={run} disabled={loading}>
          {loading ? "Thinking…" : LABEL[mode]}
        </Button>
      </div>

      {error && <p className="mt-3 text-xs text-muted-foreground">{error}</p>}

      {text && (
        <div className="mt-4 space-y-3">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {text}
          </p>
          {onUse && (
            <Button size="sm" variant="ghost" onClick={() => onUse(text)}>
              Use this as my starting point
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
