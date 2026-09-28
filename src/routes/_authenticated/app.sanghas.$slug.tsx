import { useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppScreen, EmptyState } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import { Composer } from "@/components/app/Composer";
import { PostCard } from "@/components/app/PostCard";
import { CircleActivities } from "@/components/app/CircleActivities";
import { UserAvatar } from "@/components/app/Avatar";
import { fetchPostsBy, toggleMembership, type CommunityRow } from "@/lib/api";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/_authenticated/app/sanghas/$slug")({
  component: SanghaPage,
});

function SanghaPage() {
  const { slug } = useParams({ from: "/_authenticated/app/sanghas/$slug" });
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"circle" | "feed" | "about" | "members">("circle");

  const { data: community } = useQuery({
    queryKey: ["sangha", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("communities")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      return (data as CommunityRow) ?? null;
    },
  });

  const { data: membership } = useQuery({
    queryKey: ["sangha-member", community?.id],
    enabled: Boolean(community?.id),
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user || !community) return false;
      const { data } = await supabase
        .from("community_members")
        .select("id")
        .eq("community_id", community.id)
        .eq("user_id", auth.user.id)
        .maybeSingle();
      return Boolean(data);
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["community-feed", community?.id],
    enabled: Boolean(community?.id),
    queryFn: () => fetchPostsBy({ communityId: community!.id }),
  });

  const { data: members } = useQuery({
    queryKey: ["sangha-members", community?.id],
    enabled: Boolean(community?.id) && tab === "members",
    queryFn: async () => {
      const { data } = await supabase
        .from("community_members")
        .select("role, profiles:user_id(id, username, display_name, avatar_url)")
        .eq("community_id", community!.id)
        .limit(50);
      return (data ?? []) as unknown as {
        role: string;
        profiles: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
        } | null;
      }[];
    },
  });

  if (!community) return <AppScreen title="Sangha">Loading…</AppScreen>;

  const join = async () => {
    await toggleMembership(community.id, Boolean(membership));
    if (!membership) track("community_join", { community_id: community.id });
    void queryClient.invalidateQueries({ queryKey: ["sangha-member", community.id] });
    void queryClient.invalidateQueries({ queryKey: ["sangha", slug] });
  };

  return (
    <AppScreen
      eyebrow={community.category}
      title={community.name}
      action={
        <Button size="sm" variant={membership ? "outline" : "default"} onClick={join}>
          {membership ? "Leave" : "Join"}
        </Button>
      }
    >
      <p className="text-sm text-muted-foreground">
        {community.description} · {community.member_count} members
      </p>

      <div className="flex gap-1 border-b border-border">
        {(["circle", "feed", "about", "members"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm capitalize transition-colors ${
              tab === t
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "circle" && (
        <CircleActivities communityId={community.id} isMember={Boolean(membership)} />
      )}

      {tab === "feed" && (
        <>
          {membership && <Composer communityId={community.id} />}
          {(posts?.length ?? 0) === 0 ? (
            <EmptyState
              title="No posts yet"
              body="Be the first to share something with this Sangha."
            />
          ) : (
            posts?.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </>
      )}

      {tab === "about" && (
        <div className="rounded-2xl border border-border bg-card p-5 text-sm shadow-calm">
          <p>{community.description}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">Rules</p>
          <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
            {community.rules ??
              "Be kind. No harassment, hate speech, religious incitement, fraudulent spiritual claims or medical misinformation."}
          </p>
        </div>
      )}

      {tab === "members" && (
        <div className="space-y-2">
          {members?.map((m) => (
            <div
              key={m.profiles?.id ?? Math.random()}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <UserAvatar profile={m.profiles} />
              <div className="min-w-0">
                <p className="truncate text-sm">
                  {m.profiles?.display_name ?? m.profiles?.username}
                </p>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppScreen>
  );
}
