import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppScreen } from "@/components/app/AppScreen";
import { NORMS, TRADITIONS, fetchTopics } from "@/lib/discover";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/discover/")({
  head: () => ({
    meta: [
      { title: "Discover religions and cultures | EKA" },
      {
        name: "description",
        content:
          "Structured pages on festivals, traditions and philosophies — history, how it is kept, regional differences, and the people who live it.",
      },
    ],
  }),
  component: DiscoverIndex,
});

function DiscoverIndex() {
  const [filter, setFilter] = useState<string>("All");
  const { data: topics, isLoading } = useQuery({
    queryKey: ["explore-topics"],
    queryFn: fetchTopics,
  });

  const shown = (topics ?? []).filter((t) => filter === "All" || t.tradition === filter);

  return (
    <AppScreen eyebrow="Discover · help me understand" title="Religions & cultures">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Nothing here ranks one tradition above another. Each page follows the same shape: what it
        is, where it came from, how it is actually kept, and how that differs from place to place.
      </p>

      <div className="flex items-center gap-2">
        <Link
          to="/discover"
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
        >
          <span>🌍 Explore the World's Cultural Intelligence Map</span>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", ...TRADITIONS].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              filter === t
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-accent",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Opening the shelves…</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {shown.map((t) => (
          <Link
            key={t.id}
            to="/app/discover/$slug"
            params={{ slug: t.slug }}
            className="rounded-2xl border border-border bg-card p-5 shadow-calm transition-shadow hover:shadow-lift"
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {t.tradition} · {t.kind}
            </p>
            <h2 className="mt-1.5 font-display text-lg leading-snug">{t.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.summary}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card/60 p-5">
        <p className="text-sm">How we behave here</p>
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          {NORMS.map((n) => (
            <li key={n}>· {n}</li>
          ))}
        </ul>
      </section>
    </AppScreen>
  );
}
