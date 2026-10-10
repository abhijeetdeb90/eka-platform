import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Sparkles, Lock, BookOpen, Palette, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppScreen } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MEMBERSHIP, MONTHLY_THEMES, currentTheme } from "@/lib/membership";
import {
  EKA_ACCESS_FEATURES,
  PRODUCT_TIERS,
  CORE_PHILOSOPHY,
  useMonetizationTier,
} from "@/lib/monetization";
import { track } from "@/lib/analytics";
import { useSubscription } from "@/hooks/useProfile";
import { useRazorpayCheckout } from "@/lib/payments/useRazorpayCheckout";

export const Route = createFileRoute("/_authenticated/app/plus")({
  component: MembershipPage,
});

function MembershipPage() {
  const { data: subscription } = useSubscription();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const theme = currentTheme();
  const { tier, setTier } = useMonetizationTier();
  const { openCheckout, loading: checkoutLoading } = useRazorpayCheckout();

  const joinPlan = async (plan: "plus" | "creator") => {
    track("subscription_cta_click", { plan });
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      toast.error("Please sign in to manage membership.");
      return;
    }
    const priceCents = plan === "creator" ? 79900 : 29900;
    const planName = plan === "creator" ? "Creator Studio Professional" : "EKA+ Intelligence";

    openCheckout({
      amount: priceCents,
      currency: "INR",
      name: planName,
      description: `Monthly subscription to ${planName}`,
      prefill: {
        email: auth.user.email,
        name: auth.user.user_metadata?.full_name || auth.user.user_metadata?.name || "",
      },
      notes: {
        user_id: auth.user.id,
        plan,
      },
      onSuccess: async (rzpResponse) => {
        const { error } = await supabase.from("subscriptions").upsert(
          {
            user_id: auth.user.id,
            plan,
            status: "active",
            price_cents: priceCents,
            currency: "INR",
          },
          { onConflict: "user_id,plan" },
        );
        if (error) {
          console.error("[Subscription upsert error]", error);
        }
        setTier(plan);
        track("subscription_purchase", { plan, payment_id: rzpResponse.razorpay_payment_id });
        await queryClient.invalidateQueries({ queryKey: ["subscription"] });
        toast.success(`Your ${PRODUCT_TIERS[plan].name} membership is active!`);
      },
    });
  };

  const active = subscription?.status === "active" || subscription?.status === "trialing" || tier !== "free";

  return (
    <AppScreen eyebrow="EKA Access Model" title="Go beyond the story.">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 sm:p-8 text-center space-y-3 shadow-calm">
        <Badge variant="outline" className="border-primary/40 text-primary text-xs font-mono uppercase">
          EKA Access Architecture
        </Badge>
        <h2 className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
          {CORE_PHILOSOPHY.subscriptionHook}
        </h2>
        <p className="mx-auto max-w-xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Knowledge should be free. Intelligence should be paid. Creation should be paid.
          Explore the global library freely. Upgrade when you need deep intelligence and creation tools.
        </p>
      </div>

      {/* 2. Three Architecture Tiers */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* FREE */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-xs">
          <Badge variant="outline" className="text-[10px] font-mono uppercase">
            FREE LIBRARY
          </Badge>
          <div>
            <h3 className="font-serif text-lg font-medium text-foreground">Free Library</h3>
            <p className="font-mono text-xs text-emerald-600 font-semibold mt-0.5">
              Discover → Read → Explore → Follow
            </p>
          </div>
          <p className="text-2xl font-semibold text-foreground font-display">₹0</p>
          <p className="text-xs text-muted-foreground">
            Free access to the cultural library, global map, and all stories.
          </p>
          <div className="border-t border-border/60 pt-3 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-foreground/90">
              <Check className="size-3.5 text-emerald-600" />
              <span>Explore global map & stories</span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground/90">
              <Check className="size-3.5 text-emerald-600" />
              <span>View traditions, places & images</span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground/90">
              <Check className="size-3.5 text-emerald-600" />
              <span>Search cultural knowledge</span>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild className="w-full rounded-full text-xs mt-2">
            <Link to="/app/explore">Explore Free Library</Link>
          </Button>
        </div>

        {/* EKA+ */}
        <div className="rounded-2xl border-2 border-primary bg-card p-5 space-y-3 shadow-lift relative">
          <Badge className="bg-primary text-primary-foreground text-[10px] font-mono uppercase">
            EKA+ INTELLIGENCE
          </Badge>
          <div>
            <h3 className="font-serif text-lg font-medium text-foreground">EKA+</h3>
            <p className="font-mono text-xs text-primary font-semibold mt-0.5">
              Ask → Understand → Compare → Research
            </p>
          </div>
          <p className="text-2xl font-semibold text-primary font-display">
            ₹299<span className="text-xs text-muted-foreground font-mono">/mo</span>
          </p>
          <p className="text-xs text-muted-foreground">
            EKA AI, cross-cultural comparisons, personalized journeys & primary sources.
          </p>
          <div className="border-t border-border/60 pt-3 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-foreground/90 font-medium">
              <Sparkles className="size-3.5 text-saffron" />
              <span>EKA AI interactive exploration</span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground/90 font-medium">
              <Sparkles className="size-3.5 text-saffron" />
              <span>AI cultural comparisons across regions</span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground/90 font-medium">
              <Sparkles className="size-3.5 text-saffron" />
              <span>Deep research & manuscript sources</span>
            </div>
          </div>
          <Button
            size="sm"
            disabled={checkoutLoading}
            onClick={() => joinPlan("plus")}
            className="w-full rounded-full text-xs mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {checkoutLoading ? "Opening Checkout..." : tier === "plus" ? "Active Plan" : "Get EKA+ (₹299/mo)"}
          </Button>
        </div>

        {/* CREATOR */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-xs">
          <Badge variant="outline" className="border-terracotta/40 text-terracotta text-[10px] font-mono uppercase">
            CREATOR WORKSPACE
          </Badge>
          <div>
            <h3 className="font-serif text-lg font-medium text-foreground">Creator Studio</h3>
            <p className="font-mono text-xs text-terracotta font-semibold mt-0.5">
              Create → Publish → Analyse → Grow
            </p>
          </div>
          <p className="text-2xl font-semibold text-foreground font-display">
            ₹799<span className="text-xs text-muted-foreground font-mono">/mo</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Dedicated paid workspace to create, publish, analyze and participate in 85% revenue pools.
          </p>
          <div className="border-t border-border/60 pt-3 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-foreground/90">
              <Palette className="size-3.5 text-terracotta" />
              <span>Creator Studio workspace</span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground/90">
              <Palette className="size-3.5 text-terracotta" />
              <span>Create & publish stories</span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground/90">
              <Palette className="size-3.5 text-terracotta" />
              <span>Creator analytics & 85% pools</span>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={checkoutLoading}
            onClick={() => joinPlan("creator")}
            className="w-full rounded-full text-xs mt-2 border-terracotta/40 text-terracotta hover:bg-terracotta/5"
          >
            {checkoutLoading ? "Opening Checkout..." : tier === "creator" ? "Active Workspace" : "Enter Creator (₹799/mo)"}
          </Button>
        </div>
      </div>

      {/* 3. Canonical Feature Table */}
      <section className="space-y-3 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <h3 className="font-serif text-lg text-foreground">Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border font-mono text-[11px] text-muted-foreground">
                <th className="py-2.5 px-3">Feature</th>
                <th className="py-2.5 px-3 text-center w-24">Free</th>
                <th className="py-2.5 px-3 text-center w-24 text-primary">Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {EKA_ACCESS_FEATURES.map((f) => (
                <tr key={f.id} className="hover:bg-sand/15">
                  <td className="py-2 px-3 text-foreground font-medium">{f.name}</td>
                  <td className="py-2 px-3 text-center">
                    {f.free ? <Check className="size-3.5 text-emerald-600 inline" /> : "—"}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <Check className="size-3.5 text-primary font-bold inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Active membership controls */}
      {active && (
        <div className="space-y-3 rounded-2xl border border-border bg-card p-5 text-sm shadow-calm">
          <p className="text-foreground">
            Active Tier: <strong className="uppercase font-mono text-primary">{tier}</strong>.{" "}
            <Link to="/app/dashboard" className="underline underline-offset-4 text-primary">
              See where you are in your path.
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
      )}

      <p className="text-center text-xs text-muted-foreground">
        Billing is currently recording active mock settlements on your account. Cancel anytime with zero questions asked.
      </p>
    </AppScreen>
  );
}
