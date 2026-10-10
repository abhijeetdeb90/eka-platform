import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppScreen } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toggleMembership, type CommunityRow } from "@/lib/api";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/_authenticated/app/sanghas/")({
  component: Sanghas,
});

function Sanghas() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data } = useQuery({
    queryKey: ["sanghas"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      const [all, mine] = await Promise.all([
        supabase.from("communities").select("*").order("member_count", { ascending: false }),
        auth.user
          ? supabase.from("community_members").select("community_id").eq("user_id", auth.user.id)
          : Promise.resolve({ data: [] as { community_id: string }[] }),
      ]);
      return {
        communities: (all.data ?? []) as CommunityRow[],
        joined: new Set((mine.data ?? []).map((m) => m.community_id)),
      };
    },
  });

  const join = async (id: string, joined: boolean) => {
    await toggleMembership(id, joined);
    if (!joined) track("community_join", { community_id: id });
    void queryClient.invalidateQueries({ queryKey: ["sanghas"] });
  };

  const create = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user || !name.trim()) return;
    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const { data: created, error } = await supabase
      .from("communities")
      .insert({
        slug,
        name: name.trim(),
        description: description.trim(),
        category: "General",
        created_by: auth.user.id,
      })
      .select("id")
      .single();
    if (error || !created) {
      toast.error("That Sangha name is taken or invalid.");
      return;
    }
    await supabase
      .from("community_members")
      .insert({ community_id: created.id, user_id: auth.user.id, role: "owner" });
    setOpen(false);
    setName("");
    setDescription("");
    void queryClient.invalidateQueries({ queryKey: ["sanghas"] });
    toast.success("Sangha created.");
  };

  return (
    <AppScreen
      eyebrow="Communities"
      title="Sanghas"
      action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a Sangha</DialogTitle>
            </DialogHeader>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this Sangha for?"
            />
            <Button onClick={create} disabled={!name.trim()}>
              Create
            </Button>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="mb-4 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-xs shadow-calm">
        <span className="text-muted-foreground">
          <strong className="text-foreground">Human-First Sanctuary:</strong> The intelligence is artificial. The community isn't.
        </span>
        <Link to="/standards" className="text-primary hover:underline font-medium">
          Standards & Rules →
        </Link>
      </div>

      {data?.communities.map((c) => {
        const joined = data.joined.has(c.id);
        return (
          <div
            key={c.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-calm"
          >
            <Link to="/app/sanghas/$slug" params={{ slug: c.slug }} className="min-w-0">
              <p className="font-display text-lg">{c.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {c.category} · {c.member_count} members
              </p>
            </Link>
            <Button
              size="sm"
              variant={joined ? "outline" : "default"}
              onClick={() => join(c.id, joined)}
            >
              {joined ? "Joined" : "Join"}
            </Button>
          </div>
        );
      })}
    </AppScreen>
  );
}
