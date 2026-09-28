import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Headphones, Film } from "lucide-react";
import { AppScreen, EmptyState } from "@/components/app/AppScreen";
import { fetchTopic } from "@/lib/discover";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/_authenticated/app/discover/$slug")({
  component: TopicPage,
});

function TopicPage() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["explore-topic", slug],
    queryFn: () => fetchTopic(slug),
  });

  useEffect(() => {
    if (data?.topic) track("topic_view", { slug });
  }, [data?.topic, slug]);

  if (isLoading) return <AppScreen title="Discover">Opening…</AppScreen>;
  if (!data)
    return (
      <AppScreen title="Discover">
        <EmptyState title="Not here" body="This page has moved or was never written." />
      </AppScreen>
    );

  const { topic, sections, reels, episodes } = data;

  return (
    <AppScreen eyebrow={`${topic.tradition} · ${topic.kind}`} title={topic.title}>
      <p className="leading-relaxed text-muted-foreground">{topic.summary}</p>
      {topic.origin && (
        <p className="rounded-2xl border border-primary/30 bg-primary-soft/25 p-5 text-sm leading-relaxed">
          {topic.origin}
        </p>
      )}

      {sections.map((s) => (
        <section key={s.id} className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <h2 className="font-display text-lg">{s.heading}</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {s.body}
          </p>
        </section>
      ))}

      {reels.length > 0 && (
        <section className="space-y-2">
          <h2 className="flex items-center gap-2 font-display text-lg">
            <Film className="size-4 text-primary" aria-hidden /> Glimpses
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {reels.map((r) => (
              <Link
                key={r.id}
                to="/app/reels"
                className="rounded-xl border border-border bg-card p-4 text-sm transition-colors hover:bg-accent"
              >
                {r.title}
                <span className="block text-xs text-muted-foreground">{r.tradition}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="flex items-center gap-2 font-display text-lg">
          <Headphones className="size-4 text-primary" aria-hidden /> Longer conversations
        </h2>
        {episodes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No episode on this yet.{" "}
            <Link to="/app/episodes" className="underline underline-offset-4">
              Browse all conversations
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-2">
            {episodes.map((e) => (
              <Link
                key={e.id}
                to="/app/episodes/$id"
                params={{ id: e.id }}
                className="rounded-xl border border-border bg-card p-4 text-sm transition-colors hover:bg-accent"
              >
                {e.title}
                <span className="block text-xs text-muted-foreground">
                  {e.tradition} · {e.duration_minutes} min
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </AppScreen>
  );
}
