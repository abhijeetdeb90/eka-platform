import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ShowcaseLayout, ShowcaseSplit } from "@/components/site/Showcase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  Sparkles,
  Check,
  Globe,
  BookOpen,
  Palette,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  HeartHandshake,
  Compass,
} from "lucide-react";
import {
  EKA_ACCESS_FEATURES,
  PRODUCT_TIERS,
  CORE_PHILOSOPHY,
  useMonetizationTier,
  type MonetizationTier,
} from "@/lib/monetization";
import { MEMBERSHIP, MONTHLY_THEMES } from "@/lib/membership";
import circleCommunion from "@/assets/brand/eka-circle-communion.jpg";
import journeyImage from "@/assets/journey.jpg";
import giveImage from "@/assets/give.jpg";
import { toast } from "sonner";
import { RazorpayCheckoutButton } from "@/components/checkout/RazorpayCheckoutButton";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "EKA Access Model & Membership — Free Knowledge, Paid Intelligence" },
      {
        name: "description",
        content:
          "Knowledge is free. Intelligence is paid. Creation is paid. Explore the global map and read all cultural stories for free. Subscribe to EKA+ for AI, comparisons, and deep research.",
      },
      { property: "og:title", content: "Go beyond the story with EKA" },
      {
        property: "og:description",
        content:
          "Ask questions. Compare cultures. Explore deeper. Create with EKA.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/brand/eka-banner.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MembershipPage,
});

const loops = [
  {
    cadence: "Daily",
    trigger: "A morning nudge tied to today's contemplative inquiry",
    reward: "Three to ten minutes of living cultural understanding",
  },
  {
    cadence: "Weekly",
    trigger: "A cross-cultural milestone closes and community circles gather",
    reward: "A week of comparative perspectives and shared human questions",
  },
  {
    cadence: "Monthly",
    trigger: "A new seasonal theme opens with regional rituals",
    reward: "Deep exploration of traditions across civilizations",
  },
  {
    cadence: "Annual",
    trigger: "A completed passport of living traditions and verified lineages",
    reward: "Personal archive of living wisdom and lineage contributions",
  },
] as const;

function MembershipPage() {
  const { tier, setTier } = useMonetizationTier();

  const handleSimulate = (t: MonetizationTier) => {
    setTier(t);
    toast.success(`Switched active preview to: ${PRODUCT_TIERS[t].name}`);
  };

  return (
    <ShowcaseLayout
      eyebrow="EKA Access Model · Free Knowledge · Paid Intelligence & Creation"
      title="Go beyond the story."
      lede={CORE_PHILOSOPHY.subscriptionHook}
      image={circleCommunion}
      imageAlt="Diverse community members, researchers and cultural custodians standing in circular dialogue representing the universal EKA cultural commons"
    >
      {/* 1. The Important Distinction Section */}
      <section className="py-20 border-b border-border/60 bg-sand/15">
        <div className="container-eka">
          <div className="mx-auto max-w-3xl text-center space-y-3">
            <Badge
              variant="outline"
              className="border-primary/40 text-primary text-xs font-mono uppercase tracking-wider"
            >
              The Important Distinction
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-normal">
              Knowledge should be free. Intelligence should be paid. Creation should be paid.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-serif leading-relaxed font-light">
              That is a much stronger proposition than putting cultural stories behind a paywall.
              The free product becomes EKA's global cultural library, while subscriptions convert
              users who want to understand more, use AI, create, research and build.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {/* Free: Knowledge */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-4 shadow-calm">
              <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <BookOpen className="size-6" />
              </div>
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-600 font-bold">
                  FREE · Global Library
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-foreground mt-1">
                  Knowledge is Free
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                EKA's cultural database and global map are completely open. Anyone can explore the
                interactive map, read all cultural stories, view sacred places, and learn about
                communities without a paywall.
              </p>
              <div className="pt-2 text-xs font-mono text-emerald-700 font-medium">
                Discover → Read → Explore → Follow
              </div>
            </div>

            {/* Paid: Intelligence (EKA+) */}
            <div className="rounded-3xl border border-primary/50 bg-primary/5 p-6 sm:p-8 space-y-4 shadow-lift relative">
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground text-[10px]">
                  ₹299/month
                </Badge>
              </div>
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="size-6 text-saffron" />
              </div>
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-primary font-bold">
                  EKA+ · Intelligence Layer
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-foreground mt-1">
                  Intelligence is Paid
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                For curious seekers who want to go deeper. Ask questions with EKA AI, compare
                spiritual parallels across civilizations, personalized daily wisdom, and deep
                primary source manuscripts.
              </p>
              <div className="pt-2 text-xs font-mono text-primary font-medium">
                Ask → Understand → Compare → Research
              </div>
            </div>

            {/* Paid: Creation (Creator Studio) */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-4 shadow-calm">
              <div className="size-12 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center">
                <Palette className="size-6" />
              </div>
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-terracotta font-bold">
                  CREATOR · Paid Workspace
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-foreground mt-1">
                  Creation is Paid
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Creator Studio is clearly positioned as a paid workspace rather than a free social
                feed. Full publishing engine, real-time creator analytics, Qualified Contribution
                Score (QCS), and 85% subscription pool share.
              </p>
              <div className="pt-2 text-xs font-mono text-terracotta font-medium">
                Create → Publish → Analyse → Grow
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Canonical EKA Access Model Feature Matrix */}
      <section className="py-20">
        <div className="container-eka">
          <div className="mx-auto max-w-2xl text-center space-y-2">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary font-semibold">
              EKA Access Model
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl">Free vs. Paid Feature Matrix</h2>
            <p className="text-sm text-muted-foreground">
              Clear distinction between open cultural knowledge, paid intelligence, and creator
              workspaces.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-3xl border border-border/80 bg-card shadow-calm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-sand/30 font-mono text-xs text-muted-foreground">
                    <th className="py-4 px-6 font-semibold">Feature</th>
                    <th className="py-4 px-6 text-center font-semibold w-32 sm:w-40">Free</th>
                    <th className="py-4 px-6 text-center font-semibold w-32 sm:w-40 text-primary">Paid (EKA+ / Creator)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
                  {EKA_ACCESS_FEATURES.map((f) => (
                    <tr
                      key={f.id}
                      className={`hover:bg-sand/15 transition-colors ${
                        f.category.includes("Intelligence") ? "bg-primary/[0.02]" : ""
                      }`}
                    >
                      <td className="py-3.5 px-6">
                        <div className="font-medium text-foreground">{f.name}</div>
                        <div className="text-[11px] text-muted-foreground">{f.description}</div>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        {f.free ? (
                          <span className="inline-flex items-center justify-center size-6 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
                            ✓
                          </span>
                        ) : (
                          <span className="text-muted-foreground/60 font-mono text-base">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span className="inline-flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary font-bold">
                          ✓
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Product Architecture 3 Tiers Side-by-Side */}
      <section className="py-20 border-y border-border/60 bg-sand/20">
        <div className="container-eka">
          <div className="mx-auto max-w-2xl text-center space-y-2">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary font-semibold">
              Product Architecture
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl">Choose Your Relationship With EKA</h2>
            <p className="text-sm text-muted-foreground">
              From open global exploration to deep contextual intelligence and cultural stewardship.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {/* 1. FREE */}
            <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-8 shadow-calm">
              <div className="space-y-4">
                <Badge variant="outline" className="text-xs font-mono uppercase">
                  {PRODUCT_TIERS.free.badge}
                </Badge>
                <div>
                  <h3 className="font-serif text-2xl font-normal text-foreground">
                    {PRODUCT_TIERS.free.name}
                  </h3>
                  <p className="font-mono text-xs text-emerald-600 font-semibold mt-0.5">
                    {PRODUCT_TIERS.free.tagline}
                  </p>
                </div>
                <div className="pt-2">
                  <span className="font-display text-4xl text-foreground font-semibold">
                    {PRODUCT_TIERS.free.price}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1.5 font-mono">
                    /{PRODUCT_TIERS.free.period}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {PRODUCT_TIERS.free.description}
                </p>
                <div className="border-t border-border/60 pt-4 space-y-2.5">
                  {PRODUCT_TIERS.free.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <Check className="size-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="text-foreground/90">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-8">
                {tier === "free" ? (
                  <Button disabled className="w-full rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10" variant="secondary">
                    Current Plan
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="w-full rounded-full">
                    <Link to="/discover">{PRODUCT_TIERS.free.ctaLabel}</Link>
                  </Button>
                )}
              </div>
            </div>

            {/* 2. EKA+ (Intelligence) */}
            <div className="flex flex-col justify-between rounded-3xl border-2 border-primary bg-card p-8 shadow-lift relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground font-mono text-[10px] px-3">
                  MOST POPULAR
                </Badge>
              </div>
              <div className="space-y-4">
                <Badge variant="outline" className="border-primary/40 text-primary text-xs font-mono uppercase">
                  {PRODUCT_TIERS.plus.badge}
                </Badge>
                <div>
                  <h3 className="font-serif text-2xl font-normal text-foreground">
                    {PRODUCT_TIERS.plus.name}
                  </h3>
                  <p className="font-mono text-xs text-primary font-semibold mt-0.5">
                    {PRODUCT_TIERS.plus.tagline}
                  </p>
                </div>
                <div className="pt-2">
                  <span className="font-display text-4xl text-primary font-semibold">
                    {PRODUCT_TIERS.plus.price}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1.5 font-mono">
                    /{PRODUCT_TIERS.plus.period}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {PRODUCT_TIERS.plus.description}
                </p>
                <div className="border-t border-border/60 pt-4 space-y-2.5">
                  {PRODUCT_TIERS.plus.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <Sparkles className="size-3.5 text-saffron mt-0.5 shrink-0" />
                      <span className="text-foreground/90 font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-8 space-y-2">
                {tier === "plus" ? (
                  <Button disabled className="w-full rounded-full bg-primary/20 text-primary hover:bg-primary/20" variant="secondary">
                    Current Plan
                  </Button>
                ) : tier === "creator" ? (
                  <Button disabled className="w-full rounded-full bg-primary/20 text-primary hover:bg-primary/20" variant="secondary">
                    Included in Creator Plan
                  </Button>
                ) : import.meta.env.VITE_RAZORPAY_KEY_ID ? (
                  <RazorpayCheckoutButton
                    amount={29900}
                    currency="INR"
                    planName={PRODUCT_TIERS.plus.name}
                    description="Monthly access to EKA contextual intelligence & AI"
                    className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    label="Subscribe ₹299 / month"
                    onSuccess={() => handleSimulate("plus")}
                  />
                ) : (
                  <Button disabled className="w-full rounded-full bg-muted text-muted-foreground" variant="secondary">
                    Checkout Unavailable
                  </Button>
                )}
                <Button asChild variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
                  <Link to="/checkout">Order details & invoices</Link>
                </Button>
              </div>
            </div>

            {/* 3. CREATOR (Paid Workspace) */}
            <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-8 shadow-calm">
              <div className="space-y-4">
                <Badge variant="outline" className="border-terracotta/40 text-terracotta text-xs font-mono uppercase">
                  {PRODUCT_TIERS.creator.badge}
                </Badge>
                <div>
                  <h3 className="font-serif text-2xl font-normal text-foreground">
                    {PRODUCT_TIERS.creator.name}
                  </h3>
                  <p className="font-mono text-xs text-terracotta font-semibold mt-0.5">
                    {PRODUCT_TIERS.creator.tagline}
                  </p>
                </div>
                <div className="pt-2">
                  <span className="font-display text-4xl text-foreground font-semibold">
                    {PRODUCT_TIERS.creator.price}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1.5 font-mono">
                    /{PRODUCT_TIERS.creator.period}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {PRODUCT_TIERS.creator.description}
                </p>
                <div className="border-t border-border/60 pt-4 space-y-2.5">
                  {PRODUCT_TIERS.creator.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <Palette className="size-3.5 text-terracotta mt-0.5 shrink-0" />
                      <span className="text-foreground/90">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-8 space-y-2">
                {tier === "creator" ? (
                  <Button disabled className="w-full rounded-full bg-terracotta/20 text-terracotta hover:bg-terracotta/20" variant="secondary">
                    Current Plan
                  </Button>
                ) : import.meta.env.VITE_RAZORPAY_KEY_ID ? (
                  <RazorpayCheckoutButton
                    amount={79900}
                    currency="INR"
                    planName={PRODUCT_TIERS.creator.name}
                    description="Monthly access to professional Creator Studio workspace & settlement ledger"
                    className="w-full rounded-full bg-terracotta text-white hover:bg-terracotta/90"
                    label="Join Creator Studio ₹799 / month"
                    onSuccess={() => handleSimulate("creator")}
                  />
                ) : (
                  <Button disabled className="w-full rounded-full bg-muted text-muted-foreground" variant="secondary">
                    Checkout Unavailable
                  </Button>
                )}
                <Button asChild variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
                  <Link to="/checkout">Order details & invoices</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Creator Platform Economics & 85% Pool */}
      <section className="py-20">
        <div className="container-eka rounded-3xl border border-border bg-sand/30 p-8 md:p-12">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-mono font-semibold">
              Creator & Contributor Economy
            </p>
            <h2 className="mt-2 font-serif text-2xl md:text-3xl text-foreground">
              Fair, transparent platform economics.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              EKA charges an industry-low <strong>5–10% platform commission</strong> on marketplace
              services and workshops. In addition,{" "}
              <strong>85% of monthly subscription pools</strong> are allocated directly to qualified
              creators, lineage custodians, verifiers, and translators.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-xs text-muted-foreground">
              <div>
                <span className="font-semibold text-foreground text-sm">5% Commission</span>
                <p>On practitioner services, consultations & bookings</p>
              </div>
              <div>
                <span className="font-semibold text-foreground text-sm">10% Commission</span>
                <p>On physical ritual kits and commercial items</p>
              </div>
              <div>
                <span className="font-semibold text-foreground text-sm">85% Pool Share</span>
                <p>To verified creators, custodians, and sources</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Showcase Journeys & Monthly Themes */}
      <ShowcaseSplit
        image={journeyImage}
        imageAlt="A pilgrim walking a stone path through misty hills at dawn"
        title="Discover, practise, reflect, connect, progress, return."
        body="Every member is on a journey with a beginning, milestones and an end — seven days to ninety. You always know where you are, what you have done and what changed."
        points={[
          "7 days — Return to Self",
          "21 days — Cultivate Stillness, Gratitude",
          "40 days — Letting Go, Purpose",
          "90 days — Deepen Your Practice, Connection",
        ]}
      />

      <section className="py-20 border-t border-border/60">
        <div className="container-eka">
          <h2 className="text-3xl font-serif leading-snug">The year, as twelve experiences.</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {MONTHLY_THEMES.map((m) => (
              <div key={m.name} className="bg-card p-6">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-mono">
                  Month {m.month}
                </p>
                <h3 className="mt-1.5 font-serif text-lg text-foreground">{m.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ShowcaseSplit
        image={giveImage}
        imageAlt="Two open hands holding grains of rice in warm sunlight"
        title="You stay because you are becoming someone."
        body="No lock-in, no vanity metrics, no infinite scroll. The reasons to return are the loops themselves."
        points={loops.map((l) => `${l.cadence}: ${l.trigger} → ${l.reward}`)}
      />

      {/* 6. Closing Subscription Block */}
      <section className="py-24">
        <div className="container-eka rounded-3xl border border-border bg-card p-10 text-center shadow-calm space-y-4">
          <Badge variant="outline" className="border-primary/40 text-primary text-xs font-mono uppercase">
            EKA Access Model
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-normal">
            Knowledge is free. Intelligence is paid. Creation is paid.
          </h2>
          <p className="mx-auto max-w-lg text-sm text-muted-foreground leading-relaxed">
            Go beyond the story. Ask questions. Compare cultures. Explore deeper. Create with EKA.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/auth">Get EKA+ Intelligence (₹299/mo)</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link to="/discover">Explore Free Cultural Library</Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span>Cancel anytime</span>
            <span>·</span>
            <Link to="/refund" className="underline underline-offset-4 hover:text-foreground">
              Refund & Cancellation Policy
            </Link>
            <span>·</span>
            <Link to="/terms" className="underline underline-offset-4 hover:text-foreground">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </section>
    </ShowcaseLayout>
  );
}
