import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppScreen } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import { MEMBERSHIP, MONTHLY_THEMES, currentTheme } from "@/lib/membership";
import { track } from "@/lib/analytics";
import { useSubscription } from "@/hooks/useProfile";

export const Route = createFileRoute("/_authenticated/app/plus")({
  component: MembershipPage,
});

function MembershipPage() {
  const { data: subscription } = useSubscription();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const theme = currentTheme();

  const join = async () => {
    track("subscription_cta_click", { plan: "membership" });
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const { error } = await supabase.from("subscriptions").upsert(
      {
        user_id: auth.user.id,
        plan: "plus",
        status: "trialing",
        price_cents: MEMBERSHIP.priceCents,
        currency: MEMBERSHIP.currency,
      },
      { onConflict: "user_id,plan" },
    );
    if (error) {
      toast.error("We couldn't start that just now.");
      return;
    }
    track("subscription_purchase", { plan: "membership" });
    await queryClient.invalidateQueries({ queryKey: ["subscription"] });
    toast.success("Your EKA membership is active. Start with day one.");
  };

  const active = subscription?.status === "active" || subscription?.status === "trialing";

  return (
    <AppScreen eyebrow="One membership" title={MEMBERSHIP.name}>
      <div className="rounded-2xl border border-primary/30 bg-primary-soft/40 p-8 text-center shadow-calm">
        <p className="font-display text-4xl">
          {MEMBERSHIP.price}
          <span className="text-base text-muted-foreground">/{MEMBERSHIP.cadence}</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {MEMBERSHIP.taxesNote} · Localised pricing in your currency outside India.
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          {MEMBERSHIP.promise}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {MEMBERSHIP.pillars.map((p) => (
          <section key={p.key} className="rounded-2xl border border-border bg-card p-6 shadow-calm">
            <h2 className="font-display text-lg">{p.key}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            <ul className="mt-4 space-y-2">
              {p.items.map((i) => (
                <li key={i} className="flex gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {i}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-sand/50 p-6">
        <h2 className="font-display text-base">The year, as twelve experiences</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {MONTHLY_THEMES.map((m) => (
            <p
              key={m.name}
              className={
                m.month === theme.month
                  ? "rounded-lg bg-primary-soft/60 px-3 py-2 text-sm"
                  : "px-3 py-2 text-sm text-muted-foreground"
              }
            >
              <span className="font-medium">{m.name}</span> — {m.line}
            </p>
          ))}
        </div>
      </section>

      {active ? (
        <div className="space-y-3 rounded-2xl border border-border bg-card p-5 text-sm shadow-calm">
          <p>
            Your membership is active.{" "}
            <Link to="/app/dashboard" className="underline underline-offset-4">
              See where you are.
            </Link>
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="sm" variant="outline" asChild>
              <Link to="/app/billing">Billing, plan and renewal</Link>
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <Link to="/app/cancel">Cancel or pause</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Button className="w-full" size="lg" onClick={join}>
            Become a member — {MEMBERSHIP.price}/{MEMBERSHIP.cadence}
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => navigate({ to: "/app" })}>
            Keep looking around
          </Button>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Billing is not yet connected — membership is recorded on your account and will be charged
        once payments go live.
      </p>
    </AppScreen>
  );
}
