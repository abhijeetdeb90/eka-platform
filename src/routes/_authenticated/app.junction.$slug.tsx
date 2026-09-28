import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppScreen } from "@/components/app/AppScreen";
import { supabase } from "@/integrations/supabase/client";
import { PLACE_IMAGES } from "@/lib/places";

export const Route = createFileRoute("/_authenticated/app/junction/$slug")({
  head: () => ({
    meta: [
      { title: "Place | EKA Junction" },
      { name: "description", content: "Culture, faith, food, craft and connected places." },
    ],
  }),
  component: PlacePage,
});

/* eslint-disable @typescript-eslint/no-explicit-any */
function PlacePage() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["place", slug],
    queryFn: async () => {
      const { data: place } = await supabase
        .from("places")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (!place) return null;
      const db = supabase as any;
      const [layers, items, points, rels] = await Promise.all([
        db.from("place_layers").select("*").eq("place_id", place.id),
        db.from("cultural_items").select("*").eq("place_id", place.id),
        db.from("place_map_points").select("*").eq("place_id", place.id),
        db
          .from("place_relationships")
          .select("*")
          .or(`from_place_id.eq.${place.id},to_place_id.eq.${place.id}`),
      ]);
      const otherIds = (rels.data ?? []).map((r: any) =>
        r.from_place_id === place.id ? r.to_place_id : r.from_place_id,
      );
      const { data: others } = otherIds.length
        ? await supabase.from("places").select("id,slug,name").in("id", otherIds)
        : { data: [] as any[] };
      return {
        place,
        layers: layers.data ?? [],
        items: items.data ?? [],
        points: points.data ?? [],
        rels: rels.data ?? [],
        others: others ?? [],
      };
    },
  });

  if (isLoading)
    return (
      <AppScreen title="…">
        <p className="text-sm text-muted-foreground">Arriving…</p>
      </AppScreen>
    );
  if (!data)
    return (
      <AppScreen title="Place not found">
        <Link to="/app/junction" className="text-terracotta">
          Back to the Junction
        </Link>
      </AppScreen>
    );
  const { place, layers, items, points, rels, others } = data;
  const img = PLACE_IMAGES[place.slug];

  return (
    <AppScreen
      eyebrow={`${place.kind} · ${place.country_code}${place.is_demo ? " · demonstration data" : ""}`}
      title={place.name}
    >
      {img && (
        <img
          src={img}
          alt={place.name}
          width={1200}
          height={900}
          className="h-64 w-full rounded-2xl object-cover sm:h-80"
        />
      )}
      <p className="text-sm leading-relaxed">{place.intro ?? place.summary}</p>

      {layers.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-lg">Go deeper</h2>
          {layers.map((l: any) => (
            <details key={l.id} className="rounded-2xl border border-border bg-card p-4">
              <summary className="cursor-pointer text-sm">{l.title ?? l.layer ?? l.kind}</summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {l.body ?? l.summary}
              </p>
            </details>
          ))}
        </section>
      )}

      {items.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg">Culture here</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((i: any) => (
              <div key={i.id} className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {i.kind}
                </p>
                <p className="mt-1 font-display">{i.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{i.summary ?? i.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {points.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg">On the map</h2>
          <ul className="space-y-2">
            {points.map((m: any) => (
              <li key={m.id}>
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-terracotta"
                  href={`https://www.google.com/maps/search/?api=1&query=${m.latitude},${m.longitude}`}
                >
                  {m.name ?? m.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {others.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg">Connected places</h2>
          <div className="flex flex-wrap gap-2">
            {others.map((o: any) => {
              const r = rels.find((x: any) => x.from_place_id === o.id || x.to_place_id === o.id);
              return (
                <Link
                  key={o.id}
                  to="/app/junction/$slug"
                  params={{ slug: o.slug }}
                  className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-accent"
                >
                  {o.name}
                  {r?.kind ? ` · ${String(r.kind).replace(/_/g, " ")}` : ""}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </AppScreen>
  );
}
