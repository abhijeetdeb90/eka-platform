import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BadgeRow } from "@/components/app/PractitionerCard";
import {
  MARKET_CATEGORIES,
  addSlot,
  createMyPractitioner,
  createPackage,
  fetchMyPractitioner,
  fetchPackages,
  fetchPractitionerBookings,
  fetchSlots,
  formatINR,
  formatSlot,
  monthSummary,
  priceForPayout,
} from "@/lib/marketplace";
import { PayoutPanel } from "@/components/app/PayoutPanel";
import { ScoreBreakdownPanel } from "@/components/app/ScoreBreakdownPanel";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/market/practice")({
  head: () => ({
    meta: [
      { title: "Offer guidance on EKA | Your practice" },
      {
        name: "description",
        content:
          "Set up your practitioner profile on EKA: name your own payout, publish packages, open times and see your monthly earnings.",
      },
      { property: "og:title", content: "Offer guidance on EKA" },
      {
        property: "og:description",
        content: "Publish packages, open times and track your earnings on EKA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Offer guidance on EKA" },
      {
        name: "twitter:description",
        content: "Publish packages, open times and track your earnings on EKA.",
      },
    ],
  }),
  component: MyPractice,
});

function MyPractice() {
  const { data: me, isLoading } = useQuery({
    queryKey: ["my-practitioner"],
    queryFn: fetchMyPractitioner,
  });

  if (isLoading) return <p className="p-8 text-sm text-muted-foreground">Loading your practice…</p>;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-12 pt-6 lg:pt-10">
      <h1 className="font-display text-3xl leading-tight">Your practice</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        You name what you want to receive. EKA adds a 10% platform fee on top, shown openly to the
        seeker — your payout never quietly shrinks.
      </p>
      {me ? <Dashboard practitionerId={me.id} me={me} /> : <Onboard />}
    </div>
  );
}

function Onboard() {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    display_name: "",
    headline: "",
    about: "",
    years_experience: 3,
  });
  const [cats, setCats] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  return (
    <section className="mt-8 rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-xl">Introduce yourself</h2>
      <div className="mt-5 grid gap-4">
        <div>
          <Label htmlFor="p-name">Name as people should see it</Label>
          <Input
            id="p-name"
            value={form.display_name}
            onChange={(e) => setForm({ ...form, display_name: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="p-headline">One line about your work</Label>
          <Input
            id="p-headline"
            value={form.headline}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
            placeholder="Hatha yoga and breath, taught slowly"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="p-about">About your practice and lineage</Label>
          <Textarea
            id="p-about"
            rows={5}
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="p-years">Years of experience</Label>
          <Input
            id="p-years"
            type="number"
            min={0}
            value={form.years_experience}
            onChange={(e) => setForm({ ...form, years_experience: Number(e.target.value) })}
            className="mt-1.5 w-28"
          />
        </div>
        <fieldset>
          <legend className="text-sm font-medium">What do you offer?</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {MARKET_CATEGORIES.map((c) => {
              const on = cats.includes(c.slug);
              return (
                <button
                  key={c.slug}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCats(on ? cats.filter((x) => x !== c.slug) : [...cats, c.slug])}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition-colors",
                    on
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        By continuing you agree to the{" "}
        <Link to="/standards" className="underline underline-offset-2">
          EKA Community Standards
        </Link>
        , including honest representation of your training. Verification is reviewed by a person,
        not granted automatically.
      </p>

      <Button
        className="mt-5"
        disabled={saving || !form.display_name.trim() || cats.length === 0}
        onClick={async () => {
          setSaving(true);
          const { error } = await createMyPractitioner({ ...form, categories: cats });
          setSaving(false);
          if (error) {
            toast.error(error);
            return;
          }
          await qc.invalidateQueries({ queryKey: ["my-practitioner"] });
          toast.success("Your practice is listed. Add a package next.");
        }}
      >
        {saving ? "Creating…" : "Create my practice"}
      </Button>
    </section>
  );
}

function Dashboard({
  practitionerId,
  me,
}: {
  practitionerId: string;
  me: Parameters<typeof BadgeRow>[0]["practitioner"];
}) {
  const qc = useQueryClient();
  const { data: packages } = useQuery({
    queryKey: ["practitioner-packages", practitionerId],
    queryFn: () => fetchPackages(practitionerId),
  });
  const { data: slots } = useQuery({
    queryKey: ["practitioner-slots", practitionerId],
    queryFn: () => fetchSlots(practitionerId),
  });
  const { data: bookings } = useQuery({
    queryKey: ["practitioner-bookings", practitionerId],
    queryFn: () => fetchPractitionerBookings(practitionerId),
  });

  const summary = monthSummary(bookings ?? []);
  const [pkg, setPkg] = useState({
    title: "",
    description: "",
    duration_minutes: 45,
    payout_cents: 90000,
    sessions_count: 1,
  });
  const [slotAt, setSlotAt] = useState("");
  const preview = priceForPayout(pkg.payout_cents);

  return (
    <>
      <section className="mt-6 rounded-2xl border border-border/70 bg-parchment/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl">{me.display_name}</h2>
            <p className="text-sm text-muted-foreground">{me.headline}</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/app/market/$slug" params={{ slug: me.slug }}>
              View public profile
            </Link>
          </Button>
        </div>
        <div className="mt-3">
          <BadgeRow practitioner={me} />
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          { label: "Sessions this month", value: String(summary.sessions) },
          { label: "Gross", value: formatINR(summary.gross) },
          { label: "EKA fee", value: formatINR(summary.fee) },
          { label: "You receive", value: formatINR(summary.net) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border/70 bg-card p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-1 font-display text-xl">{s.value}</p>
          </div>
        ))}
      </section>

      <ScoreBreakdownPanel />
      <PayoutPanel />

      <section className="mt-8">
        <h2 className="font-display text-xl">Your packages</h2>
        <ul className="mt-3 space-y-2">
          {(packages ?? []).map((p) => (
            <li
              key={p.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-border/70 bg-card p-4"
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium">{p.title}</span>
                <span className="block text-xs text-muted-foreground">
                  {p.sessions_count > 1 ? `${p.sessions_count} × ` : ""}
                  {p.duration_minutes} min
                </span>
              </span>
              <span className="shrink-0 text-right text-sm">
                {formatINR(p.price_cents)}
                <span className="block text-[11px] text-muted-foreground">
                  you get {formatINR(p.payout_cents)}
                </span>
              </span>
            </li>
          ))}
          {(packages ?? []).length === 0 && (
            <li className="text-sm text-muted-foreground">
              No packages yet. Add your first one below.
            </li>
          )}
        </ul>

        <div className="mt-4 rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display text-lg">Add a package</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="pk-title">Title</Label>
              <Input
                id="pk-title"
                value={pkg.title}
                onChange={(e) => setPkg({ ...pkg, title: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="pk-desc">Who it is for</Label>
              <Textarea
                id="pk-desc"
                rows={3}
                value={pkg.description}
                onChange={(e) => setPkg({ ...pkg, description: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="pk-mins">Minutes per session</Label>
              <Input
                id="pk-mins"
                type="number"
                min={15}
                value={pkg.duration_minutes}
                onChange={(e) => setPkg({ ...pkg, duration_minutes: Number(e.target.value) })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="pk-count">Number of sessions</Label>
              <Input
                id="pk-count"
                type="number"
                min={1}
                value={pkg.sessions_count}
                onChange={(e) => setPkg({ ...pkg, sessions_count: Number(e.target.value) })}
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="pk-payout">What you want to receive (₹)</Label>
              <Input
                id="pk-payout"
                type="number"
                min={100}
                step={50}
                value={Math.round(pkg.payout_cents / 100)}
                onChange={(e) => setPkg({ ...pkg, payout_cents: Number(e.target.value) * 100 })}
                className="mt-1.5 w-40"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Seeker pays {formatINR(preview.price)} · EKA fee {formatINR(preview.fee)} · you
                receive {formatINR(preview.payout)}
              </p>
            </div>
          </div>
          <Button
            className="mt-4"
            disabled={!pkg.title.trim()}
            onClick={async () => {
              const { error } = await createPackage(practitionerId, pkg);
              if (error) {
                toast.error(error);
                return;
              }
              setPkg({ ...pkg, title: "", description: "" });
              await qc.invalidateQueries({ queryKey: ["practitioner-packages", practitionerId] });
              toast.success("Package published.");
            }}
          >
            Publish package
          </Button>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl">Open times</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {(slots ?? []).map((s) => (
            <li
              key={s.id}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground"
            >
              {formatSlot(s.starts_at)}
            </li>
          ))}
          {(slots ?? []).length === 0 && (
            <li className="text-sm text-muted-foreground">No open times yet.</li>
          )}
        </ul>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div>
            <Label htmlFor="slot-at">Add a time</Label>
            <Input
              id="slot-at"
              type="datetime-local"
              value={slotAt}
              onChange={(e) => setSlotAt(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <Button
            variant="outline"
            disabled={!slotAt}
            onClick={async () => {
              const { error } = await addSlot(practitionerId, new Date(slotAt).toISOString());
              if (error) {
                toast.error(error);
                return;
              }
              setSlotAt("");
              await qc.invalidateQueries({ queryKey: ["practitioner-slots", practitionerId] });
              toast.success("Time added.");
            }}
          >
            Add time
          </Button>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl">Bookings</h2>
        <ul className="mt-3 space-y-2">
          {(bookings ?? []).map((b) => (
            <li
              key={b.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-border/70 bg-card p-4"
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium">{b.package_title}</span>
                <span className="block text-xs text-muted-foreground">
                  {b.starts_at ? formatSlot(b.starts_at) : "Time to be agreed"} · {b.status}
                </span>
              </span>
              <span className="shrink-0 text-sm">{formatINR(b.payout_cents)}</span>
            </li>
          ))}
          {(bookings ?? []).length === 0 && (
            <li className="text-sm text-muted-foreground">No bookings yet.</li>
          )}
        </ul>
      </section>
    </>
  );
}
