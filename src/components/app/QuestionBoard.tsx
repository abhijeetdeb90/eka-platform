import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowBigUp, CheckCircle2, Pin, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ReportButton } from "@/components/app/ReportButton";
import {
  askQuestion,
  fetchQuestions,
  markAnswered,
  pinQuestion,
  removeQuestion,
  toggleQuestionVote,
} from "@/lib/questions";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** Ask, vote, and let the host answer the questions the room actually wants. */
export function QuestionBoard({ episodeId, isHost }: { episodeId: string; isHost: boolean }) {
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const { data: questions } = useQuery({
    queryKey: ["episode-questions", episodeId],
    queryFn: () => fetchQuestions(episodeId),
  });
  const refresh = () => void qc.invalidateQueries({ queryKey: ["episode-questions", episodeId] });

  const ask = async () => {
    if (!body.trim()) return;
    try {
      await askQuestion(episodeId, body);
      track("question_asked", { episode: episodeId });
      setBody("");
      refresh();
      toast.success("Asked. The room can vote it up.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "That didn't post.");
    }
  };

  const open = (questions ?? []).filter((q) => !q.answered);
  const answered = (questions ?? []).filter((q) => q.answered);

  return (
    <section className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-calm">
      <div>
        <h2 className="font-display text-lg">Questions for the host</h2>
        <p className="text-xs text-muted-foreground">
          The most voted questions rise to the top, so the host answers what the room is really
          asking.
        </p>
      </div>

      <Textarea
        rows={2}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Ask one clear question. Curiosity over challenge."
      />
      <Button size="sm" onClick={ask} disabled={!body.trim()}>
        Ask
      </Button>

      {(questions?.length ?? 0) === 0 && (
        <p className="text-sm text-muted-foreground">No questions yet. Yours can set the tone.</p>
      )}

      <ul className="space-y-2">
        {[...open, ...answered].map((q) => (
          <li
            key={q.id}
            className={cn(
              "grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 rounded-xl border border-border p-3",
              q.answered && "opacity-70",
            )}
          >
            <button
              type="button"
              aria-label={q.voted ? "Remove my vote" : "Vote for this question"}
              onClick={async () => {
                await toggleQuestionVote(q.id, q.voted);
                refresh();
              }}
              className={cn(
                "flex w-12 flex-col items-center rounded-lg border border-border py-1.5 text-xs transition-colors",
                q.voted ? "border-primary/50 bg-primary-soft/30 text-primary" : "hover:bg-accent",
              )}
            >
              <ArrowBigUp className="size-4" aria-hidden />
              {q.vote_count}
            </button>

            <div className="min-w-0">
              <p className="text-sm leading-relaxed">{q.body}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {q.author?.display_name ?? q.author?.username ?? "A member"}
                {q.pinned && " · pinned by the host"}
                {q.answered && " · answered"}
              </p>
              {q.answer_note && (
                <p className="mt-2 rounded-lg bg-accent/60 p-2 text-xs leading-relaxed">
                  {q.answer_note}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <ReportButton targetKind="question" targetId={q.id} />
              {isHost && (
                <>
                  <button
                    type="button"
                    aria-label="Pin question"
                    onClick={async () => {
                      await pinQuestion(q.id, !q.pinned);
                      refresh();
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pin className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label="Mark answered"
                    onClick={async () => {
                      await markAnswered(q.id, !q.answered);
                      refresh();
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <CheckCircle2 className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label="Remove question"
                    onClick={async () => {
                      await removeQuestion(q.id);
                      refresh();
                    }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
