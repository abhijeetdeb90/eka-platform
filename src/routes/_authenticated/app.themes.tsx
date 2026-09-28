import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppScreen, EmptyState, Panel } from "@/components/app/AppScreen";
import { UserAvatar } from "@/components/app/Avatar";
import { useFeatureFlag } from "@/hooks/useFlags";
import { LANES, fetchThemeLanes, fetchThemes, type Theme } from "@/lib/themes";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/themes")({
  head: () => ({
    meta: [
      { title: "Start from your question | EKA" },
      {
        name: "description",
        content:
          "Grief, purpose, fear, meaning: begin with what you are actually carrying and see how different traditions, practices and people meet it.",
      },
      { property: "og:title", content: "Start from your question | EKA" },
      {
        property: "og:description",
        content:
          "Begin with a human question, not a tradition, and find practices, people and guidance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ThemesPage,
});

function ThemesPage() {
  const enabled = useFeatureFlag("discovery_v2_enabled");
  const [theme, setTheme] = useState<Theme | null>(null);
  const { data: themes } = useQuery({ queryKey: ["themes"], queryFn: fetchThemes, enabled });
  const { data: lanes } = useQuery({
    queryKey: ["theme-lanes", theme?.slug],
    queryFn: () => fetchThemeLanes(theme!),
    enabled: Boolean(theme),
  });

  if (!enabled) {
    return (
      <AppScreen title="Start from your question">
        <EmptyState
          title="Not open yet"
          body="This way of exploring EKA is still being prepared."
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen eyebrow="Discovery" title="Start from your question">
      <p className="text-sm text-muted-foreground">
        Most people arrive carrying something, not looking for a tradition. Choose what is closest.
      </p>

      <div className="flex flex-wrap gap-2">
        {(themes ?? []).map((t) => (
          <button
            key={t.slug}
            type="button"
            onClick={() => {
              setTheme(t);
              track("theme_open", { theme: t.slug });
            }}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              theme?.slug === t.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-accent/60",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!theme ? (
        <EmptyState
          title="Pick a starting point"
          body="Every theme opens five ways forward: explore, practise, connect, experience, deepen."
        />
      ) : (
        <div className="space-y-4">
          {theme.blurb && <p className="text-sm text-muted-foreground">{theme.blurb}</p>}

          {LANES.map((lane) => {
            const body = (() => {
              if (!lanes) return <p>Looking…</p>;
              if (lane.key === "explore")
                return lanes.posts.length ? (
                  <ul className="space-y-2">
                    {lanes.posts.map((p) => (
                      <li key={p.id}>
                        <Link
                          to="/app/p/$postId"
                          params={{ postId: p.id }}
                          className="hover:text-foreground"
                        >
                          {p.content.slice(0, 120)}
                          {p.content.length > 120 ? "…" : ""}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null;
              if (lane.key === "practice")
                return lanes.practices.length ? (
                  <ul className="space-y-1">
                    {lanes.practices.map((p) => (
                      <li key={p.id}>
                        <Link to="/app/practice" className="hover:text-foreground">
                          {p.title}
                          {p.tradition ? ` · ${p.tradition}` : ""}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null;
              if (lane.key === "connect")
                return lanes.people.length ? (
                  <ul className="space-y-2">
                    {lanes.people.map((p) => (
                      <li key={p.id}>
                        <Link
                          to="/app/u/$username"
                          params={{ username: p.username }}
                          className="flex items-center gap-2 hover:text-foreground"
                        >
                          <UserAvatar profile={p} className="size-7" />
                          {p.display_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null;
              if (lane.key === "experience")
                return lanes.episodes.length ? (
                  <ul className="space-y-1">
                    {lanes.episodes.map((e) => (
                      <li key={e.id}>
                        <Link
                          to="/app/episodes/$id"
                          params={{ id: e.id }}
                          className="hover:text-foreground"
                        >
                          {e.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null;
              return lanes.practitioners.length ? (
                <ul className="space-y-1">
                  {lanes.practitioners.map((p) => (
                    <li key={p.id}>
                      <Link
                        to="/app/market/$slug"
                        params={{ slug: p.slug }}
                        className="hover:text-foreground"
                      >
                        {p.display_name} — {p.headline}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null;
            })();

            return (
              <Panel key={lane.key} title={lane.label} meta={lane.blurb}>
                {body ?? <p>Not enough here yet.</p>}
              </Panel>
            );
          })}
        </div>
      )}
    </AppScreen>
  );
}
