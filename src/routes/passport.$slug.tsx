import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { fetchPassportByToken } from "@/lib/passport";

export const Route = createFileRoute("/passport/$slug")({
  head: () => ({
    meta: [
      { title: "A Wisdom Passport on EKA" },
      {
        name: "description",
        content:
          "A read-only record of practices, traditions and journeys explored on EKA — shared by its owner, showing only what they chose.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "A Wisdom Passport on EKA" },
      {
        property: "og:description",
        content: "A shared, read-only record of spiritual exploration.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SharedPassportPage,
});

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border/60 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl">{value}</p>
    </div>
  );
}

function SharedPassportPage() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["shared-passport", slug],
    queryFn: () => fetchPassportByToken(slug),
  });

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-5 py-16">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : !data ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <h1 className="font-display text-xl">This link is not available</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The owner may have turned sharing off or replaced the link.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Wisdom Passport
            </p>
            <h1 className="mt-2 font-display text-3xl">{data.display_name ?? "A seeker on EKA"}</h1>
            {data.since && (
              <p className="mt-1 text-sm text-muted-foreground">
                Exploring since {new Date(data.since).toLocaleDateString()}
              </p>
            )}

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {data.practices !== undefined && <Stat label="Practices" value={data.practices} />}
              {data.traditions && <Stat label="Traditions" value={data.traditions.length} />}
              {data.journeys_completed !== undefined && (
                <Stat label="Journeys completed" value={data.journeys_completed} />
              )}
              {data.sessions !== undefined && <Stat label="Sessions" value={data.sessions} />}
              {data.circles !== undefined && <Stat label="Circles" value={data.circles} />}
              {data.reflections !== undefined && (
                <Stat label="Reflections" value={data.reflections} />
              )}
            </div>

            {data.traditions && data.traditions.length > 0 && (
              <p className="mt-6 text-sm text-muted-foreground">
                Traditions explored: {data.traditions.join(", ")}
              </p>
            )}

            {data.journey_list && data.journey_list.length > 0 && (
              <ul className="mt-6 space-y-1 text-sm">
                {data.journey_list.map((j) => (
                  <li key={j.title}>
                    {j.title}
                    {j.completed ? " — completed" : ""}
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-10 text-xs text-muted-foreground">
              A record of exploration, not an achievement. EKA does not rank people.
            </p>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
