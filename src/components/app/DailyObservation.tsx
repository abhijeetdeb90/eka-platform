import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchObservationLogs,
  fetchObservationPrompts,
  fetchUserPath,
  promptForToday,
  recordObservation,
} from "@/lib/path";

/**
 * Observe is EKA's quietest mechanic: nothing to do, only something to notice.
 * One invitation a day, one acknowledgement, and the day is marked.
 */
export function DailyObservation() {
  const qc = useQueryClient();
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: userPath } = useQuery({ queryKey: ["user-path"], queryFn: fetchUserPath });
  const tradition = userPath?.tradition ?? "universal";
  const { data: prompts } = useQuery({
    queryKey: ["observation-prompts", tradition],
    queryFn: () => fetchObservationPrompts(tradition),
  });
  const { data: logs } = useQuery({
    queryKey: ["observation-logs"],
    queryFn: fetchObservationLogs,
  });

  const prompt = promptForToday(prompts ?? []);
  const today = new Date().toISOString().slice(0, 10);
  const doneToday = (logs ?? []).some((l) => l.noticed_on === today);

  if (!prompt) return null;

  return (
    <section className="rounded-2xl border border-primary/30 bg-primary-soft/30 p-5">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        Today's observation
      </p>
      <h2 className="mt-2 font-display text-xl leading-snug">{prompt.body}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">{prompt.invitation}</p>

      {doneToday ? (
        <p className="mt-4 text-sm">
          You observed it today.{" "}
          <span className="text-muted-foreground">Nothing more is required.</span>
        </p>
      ) : (
        <>
          <label
            htmlFor="observation-note"
            className="mt-4 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
          >
            What did you notice? (optional)
          </label>
          <Textarea
            id="observation-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="A sentence is enough."
            className="mt-2 bg-background"
          />
          <Button
            className="mt-3"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              const { error, tokens } = await recordObservation(prompt.id, note.trim());
              setSaving(false);
              if (error) {
                toast.error(error);
                return;
              }
              setNote("");
              await qc.invalidateQueries({ queryKey: ["observation-logs"] });
              await qc.invalidateQueries({ queryKey: ["path-events"] });
              toast.success(tokens > 0 ? `Observed · +${tokens} tokens` : "Observed.");
            }}
          >
            {saving ? "Marking…" : "I observed it"}
          </Button>
        </>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        {(logs ?? []).length} moment{(logs ?? []).length === 1 ? "" : "s"} noticed so far.
      </p>
    </section>
  );
}
