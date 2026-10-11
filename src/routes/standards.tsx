import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Scale,
  MessageSquareWarning,
  Undo2,
  UserCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  Clock,
  BookOpen,
} from "lucide-react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { EkaLogo } from "@/components/brand/Logo";
import { STANDARDS_VERSION } from "@/lib/join";
import {
  AGREEMENT_TEXT,
  HUMAN_FIRST_RULE,
  LADDER,
  NOT_REMOVED,
  REMOVED,
} from "@/lib/standards";

export const Route = createFileRoute("/standards")({
  head: () => ({
    meta: [
      { title: "Community Standards — EKA" },
      {
        name: "description",
        content:
          "How EKA keeps conversation across beliefs safe: the Human-First Community Rule, what we remove, the enforcement ladder from warning to ban, and how to appeal any decision.",
      },
      { property: "og:title", content: "EKA Community Standards" },
      {
        property: "og:description",
        content:
          "Different beliefs. Different cultures. One human community — and clear, appealable rules.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StandardsPage,
});

function StandardsPage() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-5 py-16">
        <Link to="/">
          <EkaLogo />
        </Link>

        <h1 className="mt-10 font-display text-4xl leading-tight">Community Standards</h1>
        <p className="mt-3 text-muted-foreground">
          Different beliefs. Different cultures. One human community. These standards exist so that
          curiosity is possible here — you can question an idea as hard as you like, and no one gets
          attacked for who they are.
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Version {STANDARDS_VERSION}
        </p>

        <section className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-calm">
          <h2 className="flex items-center gap-2 font-display text-xl">
            <ShieldCheck className="size-5 text-primary" aria-hidden /> The agreement
          </h2>
          <p className="mt-3 text-sm leading-relaxed">{AGREEMENT_TEXT}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Everyone who joins EKA accepts this once, before creating an account. It is an
            agreement, not an oath — we care what you do here, not what you profess.
          </p>
        </section>

        {/* The Human-First Community Rule */}
        <section id="safety" className="mt-8 rounded-2xl border border-primary/40 bg-sand/20 p-6 sm:p-8 shadow-calm">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-terracotta">
            <UserCheck className="size-4" />
            <span>Foundational Sanctuary Standard</span>
          </div>
          <h2 className="mt-2 font-display text-2xl text-foreground">
            The Human-First Community Rule
          </h2>
          <p className="mt-1 text-base font-medium text-primary">
            "{HUMAN_FIRST_RULE.motto}"
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {HUMAN_FIRST_RULE.summary}
          </p>

          {/* Distinction Table: Allowed vs Not Allowed */}
          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-border bg-muted/40 p-3 text-xs font-semibold uppercase tracking-wider">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" /> Allowed: AI Behind the Scenes
              </div>
              <div className="flex items-center gap-1.5 text-destructive mt-2 sm:mt-0">
                <XCircle className="size-3.5" /> Prohibited: Synthetic Community
              </div>
            </div>
            <div className="divide-y divide-border text-xs">
              {HUMAN_FIRST_RULE.distinctions.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-2 p-3 gap-2 sm:gap-4 hover:bg-muted/10 transition-colors"
                >
                  <div className="text-foreground/90 font-medium">
                    {item.allowed}
                  </div>
                  <div className="text-muted-foreground">
                    {item.notAllowed}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" /> Behind-the-scenes AI capabilities that empower EKA:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
              {HUMAN_FIRST_RULE.behindTheScenesAI.map((cap, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-primary" />
                  <span>{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 font-display text-lg">
              <MessageSquareWarning className="size-4 text-primary" aria-hidden /> What comes down
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {REMOVED.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 font-display text-lg">
              <Scale className="size-4 text-primary" aria-hidden /> What stays up
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {NOT_REMOVED.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-xl">Enforcement ladder</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Concrete steps, applied in order, with severe harm allowed to skip ahead. No vague
            promises — you always know what happens next.
          </p>
          <ol className="mt-4 space-y-3">
            {LADDER.map((rung, index) => (
              <li
                key={rung.step}
                className="flex gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <span className="font-display text-2xl text-muted-foreground">{index + 1}</span>
                <div>
                  <p className="font-medium">{rung.step}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{rung.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-display text-xl">
            <Undo2 className="size-5 text-primary" aria-hidden /> Every step can be appealed
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Hiding content quickly is only fair if undoing it is just as easy. Any removal,
            restriction or ban can be appealed from inside EKA, with a stated reason. A person
            reviews it and returns one of four outcomes: overturned, upheld, reduced, or restore
            with added context.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            What you told us about your religion or community background is optional, and is never
            part of a moderation decision. Enforcement looks at behaviour — reports, history,
            severity — not identity.
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-display text-xl">
            <Clock className="size-5 text-primary" aria-hidden /> Reviewer Operations & Response SLAs
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            All reviews and appeals are governed by strict operational targets. Reviewers must declare conflicts and recuse themselves from evaluating their own contributions, institutions, or paid relationships.
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-foreground font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Queue</th>
                  <th className="p-3">First Response</th>
                  <th className="p-3">Final Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-muted-foreground">
                <tr>
                  <td className="p-3 font-medium text-foreground">Safety / Hate / Harassment</td>
                  <td className="p-3 text-emerald-600 font-semibold">6 hours</td>
                  <td className="p-3">24 hours</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-foreground">Copyright Takedown</td>
                  <td className="p-3">36 hours</td>
                  <td className="p-3">Per statutory policy</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-foreground">Knowledge Verification (L2+)</td>
                  <td className="p-3">72 hours</td>
                  <td className="p-3">7 days</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-foreground">Disputed Claims (remains visible with flag)</td>
                  <td className="p-3">72 hours</td>
                  <td className="p-3">14 days (needs ≥2 lineage reviewers)</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-foreground">Appeals (independent reviewer)</td>
                  <td className="p-3">72 hours</td>
                  <td className="p-3">7 days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Verification Level 2 and above can only ever be conferred by a verified human tradition keeper or accredited scholar, never by an automated algorithm or AI system.
          </p>
        </section>

        <section id="verification" className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-display text-xl">
            <BookOpen className="size-5 text-primary" aria-hidden /> Verification & The 5-Tier Epistemic Canon
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            To prevent distortion, every piece of cultural knowledge in EKA is classified along two axes: <strong>Epistemic Type</strong> and <strong>Verification Level (L0 to L5)</strong>, supplemented by explicit provenance flags:
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-lg border border-border p-3 bg-muted/20">
              <span className="font-semibold text-foreground">1. Documented Tradition:</span>
              <p className="mt-1 text-muted-foreground">Verifiable historical, canonical, or scriptural citations.</p>
            </div>
            <div className="rounded-lg border border-border p-3 bg-muted/20">
              <span className="font-semibold text-foreground">2. Interpretation:</span>
              <p className="mt-1 text-muted-foreground">Commentary or philosophical exposition by a specific school.</p>
            </div>
            <div className="rounded-lg border border-border p-3 bg-muted/20">
              <span className="font-semibold text-foreground">3. Living Practice:</span>
              <p className="mt-1 text-muted-foreground">Active folkways, ritual practices, and oral community heritage.</p>
            </div>
            <div className="rounded-lg border border-border p-3 bg-muted/20">
              <span className="font-semibold text-foreground">4. Opinion & Reflection:</span>
              <p className="mt-1 text-muted-foreground">Subjective experience and personal contemplation.</p>
            </div>
            <div className="rounded-lg border border-border p-3 bg-muted/20 sm:col-span-2">
              <span className="font-semibold text-foreground">5. AI-Assisted Synthesis:</span>
              <p className="mt-1 text-muted-foreground">Architecturally capped at Level 1. Can never achieve Level 2+ without human lineage endorsement.</p>
            </div>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/join">Join EKA</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
