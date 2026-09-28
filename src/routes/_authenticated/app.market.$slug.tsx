import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { UnlockNotice, useUnlocks } from "@/components/app/UnlockGate";
import { marketAccess } from "@/lib/unlocks";
import { Check, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/app/Avatar";
import { BadgeRow, VerifiedMark } from "@/components/app/PractitionerCard";
import {
  CATEGORY_LABEL,
  authenticityChecks,
  bookPackage,
  fetchPackages,
  fetchPractitioner,
  fetchReviews,
  fetchSlots,
  formatINR,
  formatSlot,
  isEkaVerified,
  splitPrice,
  type Package,
  type Slot,
} from "@/lib/marketplace";
import { usePlatformConfig } from "@/hooks/usePlatformConfig";
import { TrustPanel } from "@/components/app/TrustPanel";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/market/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — practitioner on EKA` },
      {
        name: "description",
        content:
          "A practitioner profile on EKA: verified credentials, expertise, transparent packages and reviews from completed sessions only.",
      },
      { property: "og:title", content: "Practitioner profile | EKA Marketplace" },
      {
        property: "og:description",
        content:
          "Verified credentials, transparent packages, reviews from completed sessions only.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Practitioner profile | EKA Marketplace" },
      {
        name: "twitter:description",
        content:
          "Verified credentials, transparent packages, reviews from completed sessions only.",
      },
    ],
  }),
  component: PractitionerProfile,
});

function PractitionerProfile() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Package | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [booking, setBooking] = useState(false);
  const { tokens, entitlement } = useUnlocks();
  const access = marketAccess(tokens, entitlement);

  const { data: person, isLoading } = useQuery({
    queryKey: ["practitioner", slug],
    queryFn: () => fetchPractitioner(slug),
  });
  const { data: packages } = useQuery({
    queryKey: ["practitioner-packages", person?.id],
    queryFn: () => fetchPackages(person!.id),
    enabled: !!person,
  });
  const { data: slots } = useQuery({
    queryKey: ["practitioner-slots", person?.id],
    queryFn: () => fetchSlots(person!.id),
    enabled: !!person,
  });
  const { data: reviews } = useQuery({
    queryKey: ["practitioner-reviews", person?.id],
    queryFn: () => fetchReviews(person!.id),
    enabled: !!person,
  });

  if (isLoading) return <p className="p-8 text-sm text-muted-foreground">Opening this profile…</p>;
  if (!person)
    return (
      <div className="mx-auto max-w-2xl px-5 py-12">
        <p className="text-sm text-muted-foreground">This practitioner is no longer listed.</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link to="/app/market">Back to the marketplace</Link>
        </Button>
      </div>
    );

  async function confirm() {
    if (!selected) return;
    setBooking(true);
    const created = await bookPackage({ pkg: selected, slot });
    setBooking(false);
    if (!created) {
      toast.error("That booking could not be completed. Please try again.");
      return;
    }
    void navigate({ to: "/app/market/booking/$id", params: { id: created.id } });
  }

  const active = (packages ?? []).filter((p) => p.active);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-10 pt-6 lg:pt-10">
      <Link
        to="/app/market"
        className="text-xs text-muted-foreground underline-offset-4 hover:underline"
      >
        ← EKA Marketplace
      </Link>

      <header className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4">
        <UserAvatar
          className="size-16"
          profile={{ display_name: person.display_name, avatar_url: person.avatar_url }}
        />
        <div className="min-w-0">
          {isEkaVerified(person) && <VerifiedMark />}
          <h1 className="font-display text-3xl leading-tight">{person.display_name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {person.years_experience}+ years experience ·{" "}
            {person.mode === "both"
              ? "Online or in person"
              : person.mode === "online"
                ? "Online"
                : "In person"}
            {person.location ? ` · ${person.location}` : ""}
          </p>
          <p className="mt-1 flex items-center gap-1 text-sm">
            <Star aria-hidden="true" className="size-3.5 fill-current" />
            {person.rating.toFixed(1)}
            <span className="text-muted-foreground">({person.review_count} reviews)</span>
          </p>
        </div>
      </header>

      <div className="mt-4">
        <BadgeRow practitioner={person} />
      </div>

      <section className="mt-8">
        <h2 className="text-xs uppercase tracking-[0.28em] text-muted-foreground">About</h2>
        <p className="mt-2 text-sm leading-relaxed">{person.about}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {person.categories.map((c) => CATEGORY_LABEL[c] ?? c).join(" · ")}
        </p>
      </section>

      {person.categories.includes("astrology") && (
        <p className="mt-4 rounded-xl border border-border/70 bg-parchment/50 p-4 text-xs leading-relaxed text-muted-foreground">
          Astrology on EKA is offered as a traditional and reflective practice. It is not a
          guaranteed prediction, and it is not a substitute for medical, legal or financial advice.
        </p>
      )}

      <section className="mt-8">
        <h2 className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Expertise</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {person.expertise.map((e) => (
            <li
              key={e}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
            >
              {e}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Authenticity</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {authenticityChecks(person).map((c) => (
            <li key={c.label} className="flex items-center gap-2 text-sm">
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full border",
                  c.ok
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground",
                )}
              >
                {c.ok ? <Check className="size-3" /> : "–"}
              </span>
              <span className={cn(!c.ok && "text-muted-foreground")}>
                {c.label}
                {!c.ok && " — not yet reviewed"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section id="packages" className="mt-10 scroll-mt-20">
        <h2 className="font-display text-xl">Packages</h2>
        <ul className="mt-4 space-y-3">
          {active.map((p) => {
            const chosen = selected?.id === p.id;
            const split = splitPrice(p.price_cents, p.payout_cents);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(chosen ? null : p);
                    setSlot(null);
                  }}
                  aria-pressed={chosen}
                  className={cn(
                    "grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-4 rounded-2xl border p-5 text-left transition-colors",
                    chosen
                      ? "border-primary bg-primary/5"
                      : "border-border/70 bg-card hover:border-primary/40",
                  )}
                >
                  <span className="min-w-0">
                    <span className="block font-display text-lg leading-tight">{p.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {p.description}
                    </span>
                    <span className="mt-2 block text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {p.sessions_count > 1
                        ? `${p.sessions_count} × ${p.duration_minutes} min`
                        : `${p.duration_minutes} min`}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-medium">{formatINR(p.price_cents)}</span>
                    <span className="mt-1 block text-[11px] text-muted-foreground">
                      {formatINR(split.payout)} to the practitioner
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {selected && (
          <div className="mt-5 rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display text-lg">Choose a time</h3>
            {(slots ?? []).length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                No open times right now. You can still book and the practitioner will write to you.
              </p>
            ) : (
              <ul className="mt-3 flex flex-wrap gap-2">
                {(slots ?? []).slice(0, 12).map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setSlot(slot?.id === s.id ? null : s)}
                      aria-pressed={slot?.id === s.id}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs",
                        slot?.id === s.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {formatSlot(s.starts_at)}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <FeeTable priceCents={selected.price_cents} payoutCents={selected.payout_cents} />

            {access.allowed ? (
              <>
                <Button className="mt-4 w-full" onClick={confirm} disabled={booking}>
                  {booking ? "Confirming…" : `Book ${selected.title}`}
                </Button>
                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                  Test payment path — no card is charged yet.
                </p>
              </>
            ) : (
              <div className="mt-4">
                <UnlockNotice access={access} tokens={tokens} />
              </div>
            )}
          </div>
        )}
      </section>

      <section className="mt-10">
        <TrustPanel practitionerId={person.id} />
        <h2 className="font-display text-xl">Reviews from completed sessions</h2>
        {(reviews ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No written reviews yet. Only people who finished a session can leave one.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {(reviews ?? []).map((r) => (
              <li key={r.id} className="rounded-2xl border border-border/70 bg-card p-5">
                <p
                  className="flex items-center gap-1 text-sm"
                  aria-label={`Rated ${r.rating} out of 5`}
                >
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} aria-hidden="true" className="size-3.5 fill-current" />
                  ))}
                </p>
                {r.body && <p className="mt-2 text-sm leading-relaxed">{r.body}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export function FeeTable({
  priceCents,
  payoutCents,
}: {
  priceCents: number;
  payoutCents?: number | null;
}) {
  const { feePercent } = usePlatformConfig();
  const { price, fee, payout } = splitPrice(priceCents, payoutCents);
  return (
    <table className="mt-5 w-full text-sm">
      <caption className="mb-2 text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
        What you pay, before you pay it
      </caption>
      <tbody>
        <tr className="border-b border-border/60">
          <th scope="row" className="py-2 text-left font-normal">
            Practitioner price
          </th>
          <td className="py-2 text-right">{formatINR(payout)}</td>
        </tr>
        <tr className="border-b border-border/60">
          <th scope="row" className="py-2 text-left font-normal text-muted-foreground">
            EKA platform fee · {feePercent}%
          </th>
          <td className="py-2 text-right text-muted-foreground">{formatINR(fee)}</td>
        </tr>
        <tr>
          <th scope="row" className="py-2 text-left font-normal">
            Total
          </th>
          <td className="py-2 text-right font-medium">{formatINR(price)}</td>
        </tr>
      </tbody>
    </table>
  );
}
