import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Scale } from "lucide-react";
import { toast } from "sonner";
import { AppScreen, EmptyState, Panel } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { APPEAL_OUTCOMES, APPEAL_REASONS, fetchMyAppeals, submitAppeal } from "@/lib/appeals";
import { fetchMyRestriction } from "@/lib/moderation";
import { timeAgo } from "@/lib/eka";

export const Route = createFileRoute("/_authenticated/app/appeal")({
  head: () => ({
    meta: [
      { title: "Appeal a moderation decision | EKA" },
      {
        name: "description",
        content:
          "Auto-hiding is fast, so it must be reversible. Appeal hidden content or a posting pause and a person returns a stated outcome.",
      },
      { property: "og:title", content: "Appeal a moderation decision | EKA" },
      {
        property: "og:description",
        content: "Clear reason codes, one appeal per action, and a consistent human outcome.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AppealScreen,
});

function AppealScreen() {
  const qc = useQueryClient();
  const [reason, setReason] = useState<string>(APPEAL_REASONS[0].code);
  const [statement, setStatement] = useState("");

  const { data: restriction } = useQuery({
    queryKey: ["my-restriction"],
    queryFn: fetchMyRestriction,
  });
  const { data: appeals } = useQuery({ queryKey: ["my-appeals"], queryFn: fetchMyAppeals });

  const send = useMutation({
    mutationFn: () =>
      submitAppeal({
        subjectKind: restriction ? "restriction" : "content",
        subjectId: restriction?.id ?? null,
        restrictionId: restriction?.id ?? null,
        reasonCode: reason,
        statement,
      }),
    onSuccess: () => {
      setStatement("");
      void qc.invalidateQueries({ queryKey: ["my-appeals"] });
      toast.success("Appeal sent. A person reads every one.");
    },
    onError: () => toast.error("You already have an open appeal for this."),
  });

  const chosen = APPEAL_REASONS.find((r) => r.code === reason);

  return (
    <AppScreen eyebrow="Moderation" title="Appeal a decision">
      <Panel
        title={restriction ? "Your posting is paused" : "Something of yours was hidden"}
        meta={
          restriction?.expires_at
            ? `until ${new Date(restriction.expires_at).toLocaleDateString()}`
            : undefined
        }
      >
        {restriction
          ? `Stated reason: ${restriction.reason}. If we read it wrong, say so here — the pause can be lifted or shortened.`
          : "If a report hid something you wrote, tell us what the reviewer missed. One appeal per action, read by a person."}
      </Panel>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
        <h2 className="flex items-center gap-2 font-display text-lg">
          <Scale className="size-4 text-primary" aria-hidden /> Why this was wrong
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {APPEAL_REASONS.map((r) => (
            <button
              key={r.code}
              type="button"
              onClick={() => setReason(r.code)}
              className={
                r.code === reason
                  ? "rounded-full bg-primary px-3 py-1.5 text-xs text-primary-foreground"
                  : "rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent"
              }
            >
              {r.label}
            </button>
          ))}
        </div>
        {chosen && <p className="mt-3 text-xs text-muted-foreground">{chosen.body}</p>}
        <Textarea
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          placeholder="In your own words — what should the reviewer know?"
          className="mt-4 min-h-28"
        />
        <Button
          className="mt-3"
          disabled={send.isPending || statement.trim().length < 10}
          onClick={() => send.mutate()}
        >
          Send appeal
        </Button>
      </section>

      <section className="rounded-2xl border border-border bg-card/60 p-5">
        <p className="text-sm">The four outcomes</p>
        <ul className="mt-2 space-y-2">
          {APPEAL_OUTCOMES.map((o) => (
            <li key={o.code} className="border-t border-border pt-2 first:border-0 first:pt-0">
              <p className="text-sm">{o.label}</p>
              <p className="text-xs text-muted-foreground">{o.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg">Your appeals</h2>
        {(appeals?.length ?? 0) === 0 ? (
          <EmptyState
            title="No appeals yet"
            body="Anything you appeal, and its outcome, stays listed here."
          />
        ) : (
          appeals?.map((a) => {
            const outcome = APPEAL_OUTCOMES.find((o) => o.code === a.outcome);
            return (
              <div key={a.id} className="rounded-2xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">
                  {APPEAL_REASONS.find((r) => r.code === a.reason_code)?.label ?? a.reason_code} ·{" "}
                  {timeAgo(a.created_at)}
                </p>
                <p className="mt-2 text-sm">{a.statement}</p>
                <p className="mt-2 text-xs">
                  {a.status === "open" ? (
                    <span className="text-muted-foreground">Waiting on a reviewer</span>
                  ) : (
                    <span className="text-primary">{outcome?.label ?? a.outcome}</span>
                  )}
                </p>
                {a.outcome_note && (
                  <p className="mt-1 text-xs text-muted-foreground">{a.outcome_note}</p>
                )}
              </div>
            );
          })
        )}
      </section>
    </AppScreen>
  );
}
