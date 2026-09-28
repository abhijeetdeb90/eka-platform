import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppScreen } from "@/components/app/AppScreen";
import { supabase } from "@/integrations/supabase/client";
import { PLACE_IMAGES } from "@/lib/places";
import { SacredGeographyMap } from "@/components/app/SacredGeographyMap";


export const Route = createFileRoute("/_authenticated/app/junction/")({
  head: () => ({
    meta: [
      { title: "The Junction — places & cultures | EKA" },
      {
        name: "description",
        content:
          "Search a place and explore its faith, food, craft, language and the places it connects to.",
      },
    ],
  }),
  component: Junction,
});

function Junction() {
  const [q, setQ] = useState("");
  const { data: places, isLoading } = useQuery({
    queryKey: ["places"],
    queryFn: async () => {
      const { data } = await supabase
        .from("places")
        .select("id,slug,name,summary,country_code,kind,is_demo")
        .eq("status", "published")
        .order("name");
      return data ?? [];
    },
  });
  const shown = (places ?? []).filter((p) =>
    (p.name + p.summary).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppScreen eyebrow="The Junction · everything is connected" title="Places & cultures">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search a place…"
        aria-label="Search places"
        className="w-full rounded-full border border-border bg-card px-4 py-2.5 text-sm"
      />

      {/* Interactive Google Maps Platform Layer */}
      <SacredGeographyMap className="my-3" />

      {isLoading && <p className="text-sm text-muted-foreground">Opening the map…</p>}

      {!isLoading && shown.length === 0 && (
        <p className="text-sm text-muted-foreground">No places match yet.</p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        {shown.map((p) => (
          <Link
            key={p.id}
            to="/app/junction/$slug"
            params={{ slug: p.slug }}
            className="group overflow-hidden rounded-2xl border border-border/70 bg-card transition-shadow duration-500 hover:shadow-lift"
          >
            {PLACE_IMAGES[p.slug] && (
              <div className="overflow-hidden">
                <img
                  src={PLACE_IMAGES[p.slug]}
                  alt={p.name}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
            )}
            <div className="p-5">
              <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                {p.kind} · {p.country_code}
                {p.is_demo ? " · demonstration" : ""}
              </p>
              <h2 className="mt-2 font-display text-xl">{p.name}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
              <span className="mt-3 inline-block text-sm text-terracotta">Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </AppScreen>
  );
}
