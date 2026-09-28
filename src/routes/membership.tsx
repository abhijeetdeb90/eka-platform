import { createFileRoute, Link } from "@tanstack/react-router";
import { ShowcaseLayout, ShowcaseSplit } from "@/components/site/Showcase";
import { Button } from "@/components/ui/button";
import { MEMBERSHIP, MONTHLY_THEMES } from "@/lib/membership";
import circleCommunion from "@/assets/brand/eka-circle-communion.jpg";
import practiceImage from "@/assets/practice.jpg";
import journeyImage from "@/assets/journey.jpg";
import giveImage from "@/assets/give.jpg";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "EKA Membership — ₹299/month for Cultural Knowledge & Spiritual Living" },
      {
        name: "description",
        content:
          "Access EKA's structured cultural and spiritual library, AI-powered interactive exploration, personalized learning, and community discussions. ₹299/month + applicable taxes.",
      },
      { property: "og:title", content: "EKA Membership — ₹299/month" },
      {
        property: "og:description",
        content:
          "A structured cultural library, AI-powered contextual exploration, and an authentic community.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/brand/eka-circle-communion.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/brand/eka-circle-communion.jpg" },
    ],
  }),
  component: MembershipPage,
});

const loops = [
  {
    cadence: "Daily",
    trigger: "A morning nudge tied to today's journey day",
    reward: "Three to ten minutes that leave you steadier",
  },
  {
    cadence: "Weekly",
    trigger: "A milestone closes and your circle gathers",
    reward: "A week reviewed, and people who noticed you were there",
  },
  {
    cadence: "Monthly",
    trigger: "A new theme opens with its own rituals",
    reward: "A fresh experience and a summary of what changed",
  },
  {
    cadence: "Seasonal",
    trigger: "A limited drop or gathering tied to a journey you finished",
    reward: "Something physical that marks what you did",
  },
] as const;

function MembershipPage() {
  return (
    <ShowcaseLayout
      eyebrow="One membership · ₹299/month + applicable taxes"
      title="An accessible entry to living wisdom & community."
      lede={MEMBERSHIP.promise}
      image={circleCommunion}
      imageAlt="Diverse seekers and practitioners standing in circular communion around the sacred EKA mandala"
    >
      {/* What Members Get */}
      <section className="py-20">
        <div className="container-eka">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Member Benefits</p>
            <h2 className="mt-2 font-display text-3xl">What members get</h2>
            <p className="mt-3 text-muted-foreground">
              Everything needed to learn, reflect, question, and connect across authentic
              traditions.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MEMBERSHIP.benefits.map((b, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card p-6 shadow-calm transition-all hover:border-primary/40"
              >
                <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {idx + 1}
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Interactive Layer Feature */}
      <section className="border-y border-border bg-card/40 py-20">
        <div className="container-eka grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Intelligence Layer</p>
            <h2 className="mt-2 font-display text-3xl">
              Not just a static library. An interactive intelligence interface.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Ask EKA transforms static texts into contextual living knowledge. Explore primary
              sources, lineages, cultural contexts, and cross-regional variations without sectarian
              bias.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-primary" />
                <span>
                  <strong>Ask EKA:</strong> "What is this tradition?", "Where did it originate?",
                  "How is it practiced differently?"
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-primary" />
                <span>
                  <strong>Structured Response:</strong> Source → Context → AI Explanation → Related
                  Knowledge
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-primary" />
                <span>
                  <strong>Cross-Cultural Discovery:</strong> Tradition ↔ Region ↔ Community ↔ Ritual
                  ↔ Place
                </span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-calm">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs font-mono text-muted-foreground">
              <p className="font-semibold text-foreground">
                Query: "How does the spring harvest ritual differ across regions?"
              </p>
              <div className="mt-3 space-y-2 border-t border-border/60 pt-2">
                <p className="text-primary font-sans font-medium">1. Primary Sources & Lineage</p>
                <p className="text-muted-foreground font-sans">
                  Rigveda Book 10, Sangam literature (Purananuru), Asomiya Buranjis
                </p>
                <p className="text-primary font-sans font-medium">2. Cultural Context</p>
                <p className="text-muted-foreground font-sans">
                  Agricultural equinox celebration; thanking the earth, ancestors, and livestock
                </p>
                <p className="text-primary font-sans font-medium">3. Cross-Regional Connections</p>
                <p className="text-muted-foreground font-sans">
                  Baisakhi (Punjab) ↔ Vishu (Kerala) ↔ Rongali Bihu (Assam) ↔ Poila Baisakh (Bengal)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creator & Commercial Platform Commission */}
      <section className="py-20">
        <div className="container-eka rounded-2xl border border-border bg-sand/30 p-8 md:p-12">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">
              Creator & Contributor Economy
            </p>
            <h2 className="mt-2 font-display text-2xl md:text-3xl">
              Fair, transparent platform economics.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              EKA charges an industry-low <strong>5–10% platform commission</strong> on marketplace
              services, bookings, workshops, and ritual kits. In addition,{" "}
              <strong>85% of monthly membership subscription pools</strong> are allocated directly
              to qualified creators, lineage sources, verifiers, and community stewards.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-xs text-muted-foreground">
              <div>
                <span className="font-semibold text-foreground text-sm">5% Commission</span>
                <p>On practitioner services, consultations, and bookings</p>
              </div>
              <div>
                <span className="font-semibold text-foreground text-sm">10% Commission</span>
                <p>On physical ritual kits and commercial marketplace items</p>
              </div>
              <div>
                <span className="font-semibold text-foreground text-sm">85% Pool Share</span>
                <p>To knowledge creators, sources, verifiers, and translators</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      <section className="py-20">
        <div className="container-eka">
          <h2 className="text-3xl leading-snug">The year, as twelve experiences.</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {MONTHLY_THEMES.map((m) => (
              <div key={m.name} className="bg-card p-6">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Month {m.month}
                </p>
                <h3 className="mt-1.5 font-display text-lg">{m.name}</h3>
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

      <section className="py-24">
        <div className="container-eka rounded-2xl border border-border bg-card p-10 text-center shadow-calm">
          <p className="font-display text-4xl">
            ₹299<span className="text-base text-muted-foreground">/month</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            + applicable taxes · Localised worldwide
          </p>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
            A transparent monthly membership for your quiet daily practice, structured cultural
            library, AI-powered interactive exploration, and community circles. Cancel anytime with
            zero exit fees or questions asked.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
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
          <Button asChild size="lg" className="mt-8">
            <Link to="/auth">Begin your first journey</Link>
          </Button>
        </div>
      </section>
    </ShowcaseLayout>
  );
}
