import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppScreen, EmptyState, Panel } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFeatureFlag } from "@/hooks/useFlags";
import { track } from "@/lib/analytics";
import {
  KIND_LABEL,
  fetchWisdomGraph,
  kindsIn,
  neighboursOf,
  relationPhrase,
  traditionsIn,
  type WisdomKind,
  type WisdomNode,
} from "@/lib/wisdom";

export const Route = createFileRoute("/_authenticated/app/wisdom")({
  head: () => ({
    meta: [
      { title: "Wisdom Graph | EKA" },
      {
        name: "description",
        content:
          "Explore traditions, concepts, texts and practices and how they relate — every entry and every link carries a named source.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Wisdom Graph | EKA" },
      {
        property: "og:description",
        content: "Traditions, concepts, texts and practices, and how they relate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WisdomGraphPage,
});

function kindLabel(kind: string) {
  return KIND_LABEL[kind as WisdomKind] ?? kind;
}

function Source({ name, url }: { name: string | null; url: string | null }) {
  if (!name && !url)
    return <span className="text-xs text-muted-foreground">Source not recorded</span>;
  return url ? (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="text-xs underline underline-offset-4"
    >
      Source: {name ?? url}
    </a>
  ) : (
    <span className="text-xs text-muted-foreground">Source: {name}</span>
  );
}

/** A calm radial map: the chosen entry at the centre, what it touches around it. */
function RadialMap({
  center,
  around,
  onPick,
}: {
  center: WisdomNode;
  around: { node: WisdomNode; label: string }[];
  onPick: (id: string) => void;
}) {
  const size = 320;
  const r = 120;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto h-[320px] w-full max-w-[320px]"
      role="img"
      aria-label={`Connections for ${center.title}`}
    >
      {around.map((item, i) => {
        const angle = (i / Math.max(around.length, 1)) * Math.PI * 2 - Math.PI / 2;
        const x = size / 2 + Math.cos(angle) * r;
        const y = size / 2 + Math.sin(angle) * r;
        return (
          <g key={item.node.id}>
            <line
              x1={size / 2}
              y1={size / 2}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.25}
            />
            <circle
              cx={x}
              cy={y}
              r={22}
              className="cursor-pointer fill-card stroke-border"
              onClick={() => onPick(item.node.id)}
            />
            <text x={x} y={y + 38} textAnchor="middle" className="fill-current text-[9px]">
              {item.node.title.slice(0, 18)}
            </text>
          </g>
        );
      })}
      <circle cx={size / 2} cy={size / 2} r={30} className="fill-primary/15 stroke-primary" />
      <text x={size / 2} y={size / 2 + 4} textAnchor="middle" className="fill-current text-[10px]">
        {center.title.slice(0, 14)}
      </text>
    </svg>
  );
}

function WisdomGraphPage() {
  const enabled = useFeatureFlag("wisdom_graph_enabled");
  const { data, isLoading } = useQuery({
    queryKey: ["wisdom-graph"],
    queryFn: fetchWisdomGraph,
    enabled,
  });

  const [kind, setKind] = useState<string>("all");
  const [tradition, setTradition] = useState<string>("all");
  const [term, setTerm] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (enabled) track("wisdom_graph_view", {});
  }, [enabled]);

  const graph = data ?? { nodes: [], edges: [] };
  const filtered = useMemo(
    () =>
      graph.nodes.filter(
        (n) =>
          (kind === "all" || n.kind === kind) &&
          (tradition === "all" || n.tradition === tradition) &&
          (term.trim() === "" ||
            `${n.title} ${n.summary ?? ""}`.toLowerCase().includes(term.trim().toLowerCase())),
      ),
    [graph.nodes, kind, tradition, term],
  );

  const current = graph.nodes.find((n) => n.id === selected) ?? null;
  const neighbours = current ? neighboursOf(graph, current.id) : [];

  if (!enabled) {
    return (
      <AppScreen title="Wisdom Graph">
        <EmptyState
          title="Not open yet"
          body="The Wisdom Graph is still being prepared. It will appear here when it is ready."
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen eyebrow="How it all connects" title="Wisdom Graph">
      <p className="text-sm text-muted-foreground">
        Traditions, concepts, texts and practices, and the links between them. Each entry names its
        source. A link shows how two things are related in the source material — never that one
        tradition is right about another.
      </p>

      {isLoading ? (
        <Panel>Gathering the graph…</Panel>
      ) : graph.nodes.length === 0 ? (
        <EmptyState
          title="Not enough data yet"
          body="No entries have been added to the graph. Once traditions, concepts and texts are recorded with their sources, they appear here."
        />
      ) : (
        <>
          <Panel title="Find an entry">
            <Input
              placeholder="Search traditions, concepts, texts…"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {["all", ...kindsIn(graph)].map((k) => (
                <Button
                  key={k}
                  size="sm"
                  variant={kind === k ? "secondary" : "ghost"}
                  onClick={() => setKind(k)}
                >
                  {k === "all" ? "Everything" : kindLabel(k)}
                </Button>
              ))}
            </div>
            {traditionsIn(graph).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {["all", ...traditionsIn(graph)].map((t) => (
                  <Button
                    key={t}
                    size="sm"
                    variant={tradition === t ? "secondary" : "ghost"}
                    onClick={() => setTradition(t)}
                  >
                    {t === "all" ? "All traditions" : t}
                  </Button>
                ))}
              </div>
            )}
          </Panel>

          <Panel title={`Entries (${filtered.length})`}>
            {filtered.length === 0 ? (
              <p>Nothing matches that yet.</p>
            ) : (
              <ul className="space-y-2">
                {filtered.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      className={`w-full rounded-xl border p-3 text-left ${selected === n.id ? "border-primary" : "border-border/60"}`}
                      onClick={() => {
                        setSelected(n.id);
                        track("wisdom_node_open", { slug: n.slug, kind: n.kind });
                      }}
                    >
                      <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {kindLabel(n.kind)}
                        {n.tradition ? ` · ${n.tradition}` : ""}
                      </span>
                      <span className="mt-1 block text-foreground">{n.title}</span>
                      {n.summary && <span className="mt-1 block text-xs">{n.summary}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {current && (
            <Panel title={current.title} meta={kindLabel(current.kind)}>
              {current.summary && <p>{current.summary}</p>}
              <div className="mt-2">
                <Source name={current.source_name} url={current.source_url} />
                {current.license && (
                  <p className="mt-1 text-xs text-muted-foreground">Licence: {current.license}</p>
                )}
              </div>

              {neighbours.length === 0 ? (
                <p className="mt-4 text-xs">
                  No relationships have been recorded for this entry yet.
                </p>
              ) : (
                <>
                  <div className="mt-4 text-muted-foreground">
                    <RadialMap
                      center={current}
                      around={neighbours.map((n) => ({ node: n.node, label: n.edge.relation }))}
                      onPick={(id) => setSelected(id)}
                    />
                  </div>
                  <ul className="mt-4 space-y-3">
                    {neighbours.map((n) => (
                      <li key={n.edge.id} className="rounded-xl border border-border/60 p-3">
                        <p className="text-foreground">
                          {current.title}{" "}
                          <span className="text-muted-foreground">
                            {relationPhrase(n.edge.relation, n.direction)}
                          </span>{" "}
                          <button
                            type="button"
                            className="underline underline-offset-4"
                            onClick={() => setSelected(n.node.id)}
                          >
                            {n.node.title}
                          </button>
                        </p>
                        {n.edge.note && <p className="mt-1 text-xs">{n.edge.note}</p>}
                        <div className="mt-1">
                          <Source name={n.edge.source_name} url={n.edge.source_url} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Panel>
          )}
        </>
      )}
    </AppScreen>
  );
}
