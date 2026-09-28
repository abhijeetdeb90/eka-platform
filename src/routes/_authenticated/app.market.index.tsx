import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PractitionerCard } from "@/components/app/PractitionerCard";
import {
  MARKET_CATEGORIES,
  SORT_OPTIONS,
  applyFilters,
  fetchAllPackages,
  fetchAvailablePractitionerIds,
  fetchPractitioners,
  groupPackages,
  type MarketFilters,
  type SortKey,
} from "@/lib/marketplace";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/market/")({
  head: () => ({
    meta: [
      { title: "EKA Marketplace — trusted practitioners for your practice" },
      {
        name: "description",
        content:
          "Meet verified teachers, astrologers, priests and wellness practitioners. Transparent packages, a visible 10% EKA fee, and reviews only from completed sessions.",
      },
      { property: "og:title", content: "EKA Marketplace — trusted practitioners" },
      {
        property: "og:description",
        content: "Meet trusted people who can guide your practice and spiritual journey.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "EKA Marketplace" },
      {
        name: "twitter:description",
        content: "Meet trusted people who can guide your practice and spiritual journey.",
      },
    ],
  }),
  component: MarketIndex,
});

const chip = "rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:outline-none";

function MarketIndex() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("");
  const [sort, setSort] = useState<SortKey>("recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [mode, setMode] = useState("any");
  const [language, setLanguage] = useState("");
  const [tradition, setTradition] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [minExperience, setMinExperience] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const { data: people, isLoading } = useQuery({
    queryKey: ["practitioners"],
    queryFn: fetchPractitioners,
  });
  const { data: packages } = useQuery({ queryKey: ["market-packages"], queryFn: fetchAllPackages });
  const { data: availableIds } = useQuery({
    queryKey: ["market-availability"],
    queryFn: fetchAvailablePractitionerIds,
  });

  const byPractitioner = useMemo(() => groupPackages(packages ?? []), [packages]);
  const traditions = useMemo(
    () => Array.from(new Set((people ?? []).flatMap((p) => p.traditions))).sort(),
    [people],
  );
  const languages = useMemo(
    () => Array.from(new Set((people ?? []).flatMap((p) => p.languages))).sort(),
    [people],
  );

  const filters: MarketFilters = {
    q,
    category,
    verifiedOnly,
    mode,
    language,
    tradition,
    availableOnly,
    availableIds: availableIds ?? new Set<string>(),
    minRating,
    minExperience,
    maxPrice,
    sort,
  };
  const results = useMemo(
    () => applyFilters(people ?? [], byPractitioner, filters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      people,
      byPractitioner,
      q,
      category,
      verifiedOnly,
      mode,
      language,
      tradition,
      availableOnly,
      availableIds,
      minRating,
      minExperience,
      maxPrice,
      sort,
    ],
  );

  const curated = (people ?? []).filter((p) => p.eka_recommended).slice(0, 4);
  const rising = [...(people ?? [])]
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-6 pt-6 lg:pt-10">
      <header className="animate-rise">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">EKA Marketplace</p>
        <h1 className="mt-2 max-w-xl font-display text-3xl leading-tight sm:text-4xl">
          Meet trusted people who can guide your practice
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Practitioners are verified by EKA before they appear here. Packages are priced openly, EKA
          keeps 10%, and reviews can only be written after a session actually happened.
        </p>
      </header>

      <div className="mt-6 grid gap-3">
        <label htmlFor="market-search" className="sr-only">
          Search practitioners or services
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="market-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search practitioners or services…"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Categories">
          <button
            type="button"
            onClick={() => setCategory("")}
            aria-pressed={category === ""}
            className={cn(
              chip,
              category === ""
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            Everything
          </button>
          {MARKET_CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategory(category === c.slug ? "" : c.slug)}
              aria-pressed={category === c.slug}
              className={cn(
                chip,
                category === c.slug
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              <span aria-hidden="true" className="mr-1">
                {c.glyph}
              </span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {curated.length > 0 && !q && !category && (
        <section className="mt-10" aria-labelledby="curated-heading">
          <h2
            id="curated-heading"
            className="text-xs uppercase tracking-[0.28em] text-muted-foreground"
          >
            Curated by EKA
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Trusted practitioners for your journey.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {curated.map((p) => (
              <PractitionerCard key={p.id} practitioner={p} packages={byPractitioner[p.id] ?? []} />
            ))}
          </div>
        </section>
      )}

      {!q && !category && (
        <section className="mt-10" aria-labelledby="rising-heading">
          <h2
            id="rising-heading"
            className="text-xs uppercase tracking-[0.28em] text-muted-foreground"
          >
            New &amp; rising
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {rising.map((p) => (
              <PractitionerCard
                key={p.id}
                practitioner={p}
                packages={byPractitioner[p.id] ?? []}
                compact
              />
            ))}
          </div>
        </section>
      )}

      {!q && !category && (
        <section className="mt-10" aria-labelledby="popular-heading">
          <h2
            id="popular-heading"
            className="text-xs uppercase tracking-[0.28em] text-muted-foreground"
          >
            Popular services
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {POPULAR.map((slug) => {
              const c = MARKET_CATEGORIES.find((x) => x.slug === slug);
              if (!c) return null;
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => setCategory(slug)}
                  className="rounded-2xl border border-border/70 bg-card p-4 text-left transition-colors hover:border-primary/40"
                >
                  <span aria-hidden="true" className="text-xl">
                    {c.glyph}
                  </span>
                  <span className="mt-1 block text-sm font-medium">{c.label}</span>
                  <span className="block text-[11px] leading-snug text-muted-foreground">
                    {c.blurb}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-10" aria-labelledby="all-heading">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2
            id="all-heading"
            className="text-xs uppercase tracking-[0.28em] text-muted-foreground"
          >
            All practitioners
          </h2>
          <div className="flex shrink-0 items-center gap-2">
            <label htmlFor="market-sort" className="sr-only">
              Sort practitioners
            </label>
            <select
              id="market-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal aria-hidden="true" className="mr-1 size-3.5" />
              Filters
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-4 rounded-2xl border border-border/70 bg-parchment/40 p-5 sm:grid-cols-2">
            <Field label="Session mode" id="f-mode">
              <select
                id="f-mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className={selectClass}
              >
                <option value="any">Online or in person</option>
                <option value="online">Online</option>
                <option value="in_person">In person</option>
              </select>
            </Field>
            <Field label="Language" id="f-lang">
              <select
                id="f-lang"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={selectClass}
              >
                <option value="">Any language</option>
                {languages.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tradition or school" id="f-tradition">
              <select
                id="f-tradition"
                value={tradition}
                onChange={(e) => setTradition(e.target.value)}
                className={selectClass}
              >
                <option value="">Any tradition</option>
                {traditions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Minimum rating" id="f-rating">
              <select
                id="f-rating"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className={selectClass}
              >
                <option value={0}>Any rating</option>
                <option value={4}>4.0 and above</option>
                <option value={4.5}>4.5 and above</option>
                <option value={4.8}>4.8 and above</option>
              </select>
            </Field>
            <Field label="Experience" id="f-exp">
              <select
                id="f-exp"
                value={minExperience}
                onChange={(e) => setMinExperience(Number(e.target.value))}
                className={selectClass}
              >
                <option value={0}>Any experience</option>
                <option value={5}>5+ years</option>
                <option value={10}>10+ years</option>
                <option value={15}>15+ years</option>
              </select>
            </Field>
            <Field label="Price ceiling" id="f-price">
              <select
                id="f-price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className={selectClass}
              >
                <option value={0}>Any price</option>
                <option value={100000}>Up to ₹1,000</option>
                <option value={200000}>Up to ₹2,000</option>
                <option value={500000}>Up to ₹5,000</option>
              </select>
            </Field>
            <label className="flex items-center gap-2 self-end text-sm">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="size-4 accent-[var(--primary)]"
              />
              Eka Verified only
            </label>
            <label className="flex items-center gap-2 self-end text-sm">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="size-4 accent-[var(--primary)]"
              />
              Has open times
            </label>
          </div>
        )}

        {isLoading && (
          <p className="mt-6 text-sm text-muted-foreground">Gathering practitioners…</p>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {results.map((p) => (
            <PractitionerCard key={p.id} practitioner={p} packages={byPractitioner[p.id] ?? []} />
          ))}
        </div>

        {!isLoading && results.length === 0 && (
          <p className="mt-6 rounded-2xl border border-border/70 bg-card p-6 text-sm text-muted-foreground">
            No practitioner matches that yet. Try a wider search — the marketplace grows slowly on
            purpose.
          </p>
        )}
      </section>

      <section className="mt-12 rounded-2xl border border-border/70 bg-parchment/50 p-6">
        <h2 className="font-display text-lg">Are you a practitioner?</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Name the payout you want and EKA adds its 10% on top, so what you see is what you earn.
          Verification is reviewed before your profile becomes visible.
        </p>
        <Button asChild size="sm" className="mt-4">
          <Link to="/app/market/practice">Open your practice dashboard</Link>
        </Button>
      </section>
    </div>
  );
}

const POPULAR = ["yoga", "astrology", "meditation", "religious-services"];

const selectClass = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
