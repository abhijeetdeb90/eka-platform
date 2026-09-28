import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TRADITIONS } from "@/lib/discover";
import { SOURCE_KINDS, publishKnowledge, type SourceKind } from "@/lib/knowledge";
import { fetchWisdomGraph } from "@/lib/wisdom";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/* Publishing knowledge asks for two things an ordinary post never does:
 * which tradition it comes from, and who or what it came from. */

export function KnowledgeComposer({
  communityId,
  onPublished,
}: {
  communityId?: string;
  onPublished?: (postId: string) => void;
}) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [tradition, setTradition] = useState<string>("Universal");
  const [topic, setTopic] = useState("");
  const [community, setCommunity] = useState(communityId ?? "");
  const [sourceKind, setSourceKind] = useState<SourceKind>("scripture");
  const [sourceName, setSourceName] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [nodeIds, setNodeIds] = useState<string[]>([]);
  const [nodeQuery, setNodeQuery] = useState("");
  const [busy, setBusy] = useState(false);

  const { data: graph } = useQuery({ queryKey: ["wisdom-graph"], queryFn: fetchWisdomGraph });

  const { data: joined } = useQuery({
    queryKey: ["my-communities"],
    enabled: !communityId,
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return [];
      const { data } = await supabase
        .from("community_members")
        .select("community_id, communities(id, name)")
        .eq("user_id", auth.user.id);
      return (data ?? []) as {
        community_id: string;
        communities: { id: string; name: string } | null;
      }[];
    },
  });

  const matches = useMemo(() => {
    const nodes = graph?.nodes ?? [];
    const q = nodeQuery.trim().toLowerCase();
    const pool = q ? nodes.filter((n) => n.title.toLowerCase().includes(q)) : nodes;
    return pool.slice(0, 12);
  }, [graph, nodeQuery]);

  const chosen = (graph?.nodes ?? []).filter((n) => nodeIds.includes(n.id));

  const toggleNode = (id: string) =>
    setNodeIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const id = await publishKnowledge({
        content,
        tradition,
        topic: topic.trim() || null,
        communityId: community || null,
        sourceKind,
        sourceName,
        sourceUrl: sourceUrl.trim() || null,
        nodeIds,
      });
      track("post_create", { type: "knowledge", tradition, links: nodeIds.length });
      toast.success("Your contribution is live.");
      setContent("");
      setTopic("");
      setSourceName("");
      setSourceUrl("");
      setNodeIds([]);
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
      void queryClient.invalidateQueries({ queryKey: ["community-feed"] });
      onPublished?.(id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "We couldn't publish that. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const chipClass = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1 text-xs transition-colors",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border text-muted-foreground hover:bg-accent",
    );

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
      <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        Contribute knowledge
      </p>
      <h2 className="mt-2 font-display text-xl leading-snug sm:text-2xl">
        Share something and say where it comes from
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground" id="knowledge-hint">
        Naming the tradition and the source is what lets another tradition find and trust this.
      </p>

      <Label htmlFor="knowledge-content" className="sr-only">
        Your contribution
      </Label>
      <Textarea
        id="knowledge-content"
        aria-describedby="knowledge-hint"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        placeholder="What is the teaching, and what does it ask of a person?"
        className="mt-4 resize-none text-[16px] leading-relaxed"
      />

      <fieldset className="mt-4">
        <legend className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Tradition
        </legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {TRADITIONS.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tradition === t}
              onClick={() => setTradition(t)}
              className={chipClass(tradition === t)}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-4">
        <legend className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Kind of source
        </legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SOURCE_KINDS.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={sourceKind === s.id}
              onClick={() => setSourceKind(s.id)}
              className={chipClass(sourceKind === s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="knowledge-source-name">Source</Label>
          <Input
            id="knowledge-source-name"
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            placeholder="Text, teacher, book, or your own experience"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="knowledge-source-url">Link (optional)</Label>
          <Input
            id="knowledge-source-url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://"
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="mt-3">
        <Label htmlFor="knowledge-topic">Topic (optional)</Label>
        <Input
          id="knowledge-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="silence, grief, gratitude…"
          className="mt-1.5"
        />
      </div>

      {!communityId && (joined?.length ?? 0) > 0 && (
        <div className="mt-3">
          <Label htmlFor="knowledge-audience">Where to publish</Label>
          <select
            id="knowledge-audience"
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
            className="mt-1.5 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Everyone on EKA</option>
            {joined?.map((m) => (
              <option key={m.community_id} value={m.community_id}>
                {m.communities?.name ?? "Circle"}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-4">
        <Label htmlFor="knowledge-link">Connect to the knowledge library (optional)</Label>
        {(graph?.nodes.length ?? 0) === 0 ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            The library has no entries yet. You can publish without linking.
          </p>
        ) : (
          <>
            <Input
              id="knowledge-link"
              value={nodeQuery}
              onChange={(e) => setNodeQuery(e.target.value)}
              placeholder="Search concepts, texts, practices…"
              className="mt-1.5"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {matches.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  aria-pressed={nodeIds.includes(n.id)}
                  onClick={() => toggleNode(n.id)}
                  className={chipClass(nodeIds.includes(n.id))}
                >
                  {n.title}
                </button>
              ))}
            </div>
            {chosen.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Linked to {chosen.map((n) => n.title).join(", ")}
              </p>
            )}
          </>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          A named source is required — even if it is your own experience.
        </p>
        <Button onClick={submit} disabled={busy || !content.trim() || !sourceName.trim()}>
          {busy && <Loader2 aria-hidden="true" className="mr-2 size-4 animate-spin" />}
          {busy ? "Publishing…" : "Publish"}
        </Button>
      </div>
    </div>
  );
}
