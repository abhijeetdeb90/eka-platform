import React from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Check, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

const MEMBERSHIP_BENEFITS = [
  "Unrestricted access to EKA's structured cultural, spiritual and local-knowledge library",
  "AI-powered interactive exploration with contextual source citations and provenance",
  "Explore multidimensional connections between cultures, communities, places and rituals",
  "Save, organize, and annotate knowledge nodes into personal contemplation compendiums",
  "Direct participation in community discussions and dialogue circles",
  "Directly fund local knowledge stewards, elders, master weavers and researchers",
];

export const MembershipBannerSection: React.FC = () => {
  return (
    <section
      aria-labelledby="membership-section-title"
      className="py-20 lg:py-24 border-t border-border/60 bg-sand/20"
    >
      <div className="container-eka">
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 sm:p-12 lg:p-16 shadow-lift">
          {/* Subtle decorative glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-saffron/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-terracotta/10 blur-3xl"
          />

          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-forest/30 bg-forest/10 px-3.5 py-1 text-xs font-semibold text-forest uppercase tracking-wider">
                <HeartHandshake className="size-3.5" />
                <span>Knowledge & Trust Economy</span>
              </div>
              <h2
                id="membership-section-title"
                className="mt-4 font-display text-3xl font-medium sm:text-4xl lg:text-5xl text-foreground tracking-tight leading-tight"
              >
                Join the EKA Knowledge Fellowship.
              </h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
                Support the living preservation of cultures, communities, and authentic local
                lineages — without advertising incentives or algorithmic manipulation.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {MEMBERSHIP_BENEFITS.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="size-3" />
                    </div>
                    <span className="text-xs sm:text-sm font-light text-foreground/90 leading-snug">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-forest" />
                  <span>Verified receipts & ethical compensation</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="size-4 text-saffron" />
                  <span>Cancel anytime</span>
                </span>
              </div>
            </div>

            {/* Right Pricing Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-primary/30 bg-sand/40 p-6 sm:p-8 backdrop-blur-xs shadow-calm text-center lg:text-left flex flex-col justify-between h-full">
                <div>
                  <div className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                    EKA Creator / Membership
                  </div>
                  <div className="mt-4 flex items-baseline justify-center lg:justify-start gap-1">
                    <span className="font-display text-4xl sm:text-5xl font-semibold text-foreground">
                      ₹299
                    </span>
                    <span className="text-sm font-light text-muted-foreground">
                      / month + taxes
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Designed to be accessible so everyone can participate in, learn from, and enrich
                    the cultural commons.
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="w-full rounded-xl py-6 text-base font-semibold shadow-calm hover:shadow-lift"
                  >
                    <Link to="/join">
                      <span>Begin 14-Day Sacred Trial</span>
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl border-border/80 bg-background/60 text-xs"
                  >
                    <Link to="/auth">
                      <span>Already a member? Sign in</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
