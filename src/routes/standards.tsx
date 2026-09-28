import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Scale, MessageSquareWarning, Undo2 } from "lucide-react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { EkaLogo } from "@/components/brand/Logo";
import { STANDARDS_VERSION } from "@/lib/join";
import { AGREEMENT_TEXT, LADDER, NOT_REMOVED, REMOVED } from "@/lib/standards";

export const Route = createFileRoute("/standards")({
  head: () => ({
    meta: [
      { title: "Community Standards — EKA" },
      {
        name: "description",
        content:
          "How EKA keeps conversation across beliefs safe: what we remove, the enforcement ladder from warning to ban, and how to appeal any decision.",
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
