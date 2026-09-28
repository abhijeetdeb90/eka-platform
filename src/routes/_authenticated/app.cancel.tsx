import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppScreen } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CANCEL_REASONS,
  closeSurvey,
  fetchProgressSnapshot,
  offerFor,
  recordCancellationSurvey,
  recordOffer,
  type CancelReasonId,
} from "@/lib/retention";
import {
  applyDiscount,
  fetchSubscription,
  pauseMembership,
  resumeMembership,
  scheduleCancellation,
} from "@/lib/billing";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/_authenticated/app/cancel")({
  component: CancelFlow,
});

type Step = "progress" | "survey" | "offer" | "done";

function CancelFlow() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>("progress");
  const [reason, setReason] = useState<CancelReasonId | null>(null);
  const [details, setDetails] = useState("");
  const [surveyId, setSurveyId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const { data: snapshot } = useQuery({
    queryKey: ["progress-snapshot"],
    queryFn: fetchProgressSnapshot,
  });
  const { data: sub } = useQuery({ queryKey: ["subscription-row"], queryFn: fetchSubscription });

  const offer = reason ? offerFor(reason) : null;
  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["subscription"] });
    await queryClient.invalidateQueries({ queryKey: ["subscription-row"] });
  };

  const goToSurvey = async () => {
    track("cancel_start", {});
    setStep("survey");
  };

  const submitSurvey = async () => {
    if (!reason) return;
    setBusy(true);
    const id = await recordCancellationSurvey(reason, details);
    setSurveyId(id);
    track("cancel_reason", { reason });
    const next = offerFor(reason);
    await recordOffer(next, "offered");
    setBusy(false);
    setStep("offer");
  };

  const acceptOffer = async () => {
    if (!offer) return;
    setBusy(true);
    if (offer.kind === "pause") await pauseMembership(offer.pauseDays ?? 60);
    else if (offer.kind === "discount") await applyDiscount(offer.discountPercent ?? 50);
    else await resumeMembership();
    await recordOffer(offer, "accepted");
    await closeSurvey(surveyId, offer.kind === "pause" ? "paused" : "stayed");
    track("retention_offer_accept", { kind: offer.kind });
    await refresh();
    setBusy(false);
    toast.success(
      offer.kind === "pause"
        ? "Paused. Nothing is lost."
        : "Welcome back. Your journey is where you left it.",
    );
    void navigate({ to: offer.kind === "circle_match" ? "/app/sanghas" : "/app/daily" });
  };

  const confirmCancel = async () => {
    setBusy(true);
    if (offer) await recordOffer(offer, "declined");
    await scheduleCancellation();
    await closeSurvey(surveyId, "canceled");
    track("cancel_confirm", { reason: reason ?? "unknown" });
    await refresh();
    setBusy(false);
    setStep("done");
  };

  return (
    <AppScreen eyebrow="Before you go" title="Your membership">
      {step === "progress" && snapshot && (
        <>
          <section className="rounded-2xl border border-primary/30 bg-primary-soft/40 p-6 shadow-calm">
            <h2 className="font-display text-xl">This is what you've built.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              None of it is deleted if you leave — but the journeys stop moving, and your circle
              carries on without you.
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat label="Days with EKA" value={snapshot.daysWithEka} />
              <Stat label="Journey days" value={snapshot.journeyDays} />
              <Stat label="Reflections" value={snapshot.reflections} />
              <Stat label="Practices" value={snapshot.practices} />
              <Stat label="Circles" value={snapshot.circles} />
              <Stat label="Journeys open" value={snapshot.activeJourneys} />
            </dl>
          </section>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/app/daily">Continue my journey</Link>
            </Button>
            <Button variant="outline" onClick={goToSurvey}>
              Continue to cancel
            </Button>
          </div>
        </>
      )}

      {step === "survey" && (
        <>
          <h2 className="font-display text-xl">What made you decide?</h2>
          <p className="text-sm text-muted-foreground">
            One answer. It changes what we offer you next.
          </p>
          <div className="space-y-2">
            {CANCEL_REASONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setReason(r.id)}
                className={`w-full rounded-2xl border p-4 text-left text-sm transition-colors ${
                  reason === r.id ? "border-primary bg-primary-soft/50" : "border-border bg-card"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Anything you'd like us to know (optional)"
            value={details}
            rows={3}
            onChange={(e) => setDetails(e.target.value)}
          />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("progress")}>
              Back
            </Button>
            <Button className="flex-1" disabled={!reason || busy} onClick={submitSurvey}>
              Continue
            </Button>
          </div>
        </>
      )}

      {step === "offer" && offer && (
        <>
          <section className="rounded-2xl border border-border bg-card p-6 shadow-calm">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              A different option
            </p>
            <h2 className="mt-2 font-display text-xl">{offer.headline}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{offer.body}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button disabled={busy} onClick={acceptOffer}>
                {offer.cta}
              </Button>
              <Button variant="ghost" disabled={busy} onClick={confirmCancel}>
                No thanks, cancel my membership
              </Button>
            </div>
          </section>
          <p className="text-xs text-muted-foreground">
            {sub?.current_period_end
              ? `If you cancel, access continues until ${new Date(sub.current_period_end).toLocaleDateString()}.`
              : "If you cancel, access continues to the end of your current period."}
          </p>
        </>
      )}

      {step === "done" && (
        <section className="rounded-2xl border border-border bg-card p-6 text-center shadow-calm">
          <h2 className="font-display text-xl">Your membership will end at the period's close.</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Your journeys, reflections and circle stay saved. Come back whenever you want to
            continue — nothing restarts from zero.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Button
              onClick={async () => {
                await resumeMembership();
                await refresh();
                toast.success("Your membership continues.");
                void navigate({ to: "/app/dashboard" });
              }}
            >
              Actually, keep my membership
            </Button>
            <Button variant="outline" asChild>
              <Link to="/app/dashboard">Back to My EKA</Link>
            </Button>
          </div>
        </section>
      )}
    </AppScreen>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-display text-2xl">{value}</dd>
    </div>
  );
}
