import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppScreen, EmptyState } from "@/components/app/AppScreen";
import { UserAvatar } from "@/components/app/Avatar";
import { timeAgo } from "@/lib/eka";
import { useRealtimeNotifications } from "@/hooks/useRealtime";

export const Route = createFileRoute("/_authenticated/app/notifications")({
  component: Notifications,
});

const COPY: Record<string, string> = {
  follow: "started following you",
  like: "liked your post",
  comment: "commented on your post",
  reply: "replied to your comment",
  community_invite: "invited you to a Sangha",
  community_activity: "posted in your Sangha",
  question_pinned: "pinned your question",
  question_answered: "answered your question",
  question_rising: "your question is rising in the room",
  episode_scheduled: "scheduled a conversation you follow",
  episode_published: "published a conversation you follow",
};

function Notifications() {
  const queryClient = useQueryClient();
  useRealtimeNotifications();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return [];
      const { data } = await supabase
        .from("notifications")
        .select(
          "id, type, post_id, episode_id, read, created_at, profiles:actor_id(id, username, display_name, avatar_url)",
        )
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false })
        .limit(60);
      return (data ?? []) as unknown as {
        id: string;
        type: string;
        post_id: string | null;
        episode_id: string | null;
        read: boolean;
        created_at: string;
        profiles: {
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
        } | null;
      }[];
    },
  });

  useEffect(() => {
    void (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", auth.user.id)
        .eq("read", false);
      void queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
    })();
  }, [queryClient]);

  return (
    <AppScreen eyebrow="Activity" title="Notifications">
      {(data?.length ?? 0) === 0 && (
        <EmptyState
          title="Nothing yet"
          body="Follows, likes, comments and Sangha activity land here."
        />
      )}
      {data?.map((n) => {
        const line = (
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <UserAvatar profile={n.profiles} className="size-9" />
            <p className="min-w-0 flex-1 text-sm">
              <span className="font-medium">
                {n.profiles?.display_name ?? n.profiles?.username ?? "Someone"}
              </span>{" "}
              <span className="text-muted-foreground">{COPY[n.type] ?? "interacted with you"}</span>
            </p>
            <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(n.created_at)}</span>
          </div>
        );
        if (n.episode_id)
          return (
            <Link key={n.id} to="/app/episodes/$id" params={{ id: n.episode_id }}>
              {line}
            </Link>
          );
        return n.post_id ? (
          <Link key={n.id} to="/app/p/$postId" params={{ postId: n.post_id }}>
            {line}
          </Link>
        ) : (
          <div key={n.id}>{line}</div>
        );
      })}
    </AppScreen>
  );
}
