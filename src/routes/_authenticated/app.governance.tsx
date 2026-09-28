import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppScreen } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import {
  fetchCommunityActions,
  fetchCommunityPosts,
  fetchMyGovernedCommunities,
  fetchStewards,
  setPostVisibility,
} from "@/lib/governance";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/governance")({
  head: () => ({
    meta: [
      { title: "Community governance | EKA" },
      {
        name: "description",
        content:
          "Stewards see what has been reported inside their own Circle, hide or restore it, and keep an open record of every decision.",
      },
      { property: "og:title", content: "Community governance | EKA" },
      {
        property: "og:description",
        content:
          "Reported contributions, steward decisions and an open action history for your Circle.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Governance,
});

function Governance() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const communities = useQuery({
    queryKey: ["governed-communities"],
    queryFn: fetchMyGovernedCommunities,
  });
  const active = communities.data?.find((c) => c.id === selected) ?? communities.data?.[0] ?? null;

  const stewards = useQuery({
    queryKey: ["stewards", active?.id],
    queryFn: () => fetchStewards(active!.id),
    enabled: Boolean(active),
  });
  const posts = useQuery({
    queryKey: ["community-posts", active?.id],
    queryFn: () => fetchCommunityPosts(active!.id),
    enabled: Boolean(active),
  });
  const actions = useQuery({
    queryKey: ["community-actions", active?.id],
    queryFn: () => fetchCommunityActions(active!.id),
    enabled: Boolean(active),
  });

  const visibility = useMutation({
    mutationFn: ({ id, hidden }: { id: string; hidden: boolean }) =>
      setPostVisibility(id, hidden, notes.trim() || "No note given."),
    onSuccess: (_d, v) => {
      toast.success(v.hidden ? "Hidden from the Circle." : "Restored to the Circle.");
      setNotes("");
      void queryClient.invalidateQueries({ queryKey: ["community-posts", active?.id] });
      void queryClient.invalidateQueries({ queryKey: ["community-actions", active?.id] });
    },
    onError: () => toast.error("That could not be saved. Please try again."),
  });

  return (
    <AppScreen eyebrow="Community" title="Holding the standards of your Circle">
      <p className="text-sm leading-relaxed text-muted-foreground">
        A Circle keeps its own standards. Every decision made here is written into the shared
        record, so members can see what was done and why.
      </p>

      {communities.isLoading && (
        <p className="text-sm text-muted-foreground">Looking up your Circles…</p>
      )}
      {communities.isError && (
        <p className="text-sm text-destructive">
          Your Circles could not be loaded. Please try again.
        </p>
      )}
      {communities.data && communities.data.length === 0 && (
        <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
          You do not steward a Circle yet. Once you found one, or a steward invites you, it appears
          here.
        </p>
      )}

      {communities.data && communities.data.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {communities.data.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelected(c.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                active?.id === c.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-accent",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {active && (
        <>
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg">{active.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{active.description}</p>
            <p className="mt-2 text-xs text-muted-foreground">{active.member_count} members</p>
            {active.rules && (
              <p className="mt-3 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                {active.rules}
              </p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              Stewards:{" "}
              {stewards.data && stewards.data.length > 0
                ? stewards.data.map((s) => s.display_name ?? s.username ?? "A member").join(", ")
                : "—"}
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm">Contributions in this Circle</h2>
            <label htmlFor="notes" className="mt-3 block text-xs text-muted-foreground">
              Why are you making this decision? (recorded with the action)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Context for the record…"
              className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-sm"
            />

            {posts.isLoading && (
              <p className="mt-3 text-sm text-muted-foreground">Loading contributions…</p>
            )}
            {posts.isError && (
              <p className="mt-3 text-sm text-destructive">These could not be loaded.</p>
            )}
            {posts.data && posts.data.length === 0 && (
              <p className="mt-3 text-sm text-muted-foreground">
                Nothing has been posted in this Circle yet.
              </p>
            )}

            <ul className="mt-4 space-y-3">
              {posts.data?.map((p) => (
                <li key={p.id} className="rounded-xl border border-border/70 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    {p.author} · {new Date(p.created_at).toLocaleDateString()}
                    {p.reports > 0 && ` · ${p.reports} report${p.reports === 1 ? "" : "s"}`}
                    {p.status !== "published" && ` · ${p.status}`}
                  </p>
                  <p className="mt-2 line-clamp-4 text-sm leading-relaxed">{p.content}</p>
                  <div className="mt-3">
                    <Button
                      size="sm"
                      variant={p.status === "published" ? "outline" : "default"}
                      disabled={visibility.isPending}
                      onClick={() =>
                        visibility.mutate({ id: p.id, hidden: p.status === "published" })
                      }
                    >
                      {p.status === "published" ? "Hide from Circle" : "Restore"}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card/60 p-5">
            <h2 className="text-sm">What has been decided here</h2>
            {actions.isLoading && (
              <p className="mt-2 text-sm text-muted-foreground">Loading the record…</p>
            )}
            {actions.isError && (
              <p className="mt-2 text-sm text-destructive">The record could not be loaded.</p>
            )}
            {actions.data && actions.data.length === 0 && (
              <p className="mt-2 text-sm text-muted-foreground">No decisions have been made yet.</p>
            )}
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              {actions.data?.map((a) => (
                <li key={a.id}>
                  {new Date(a.created_at).toLocaleString()} · {a.action.replace(/_/g, " ")}
                  {a.notes ? ` — ${a.notes}` : ""}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </AppScreen>
  );
}
