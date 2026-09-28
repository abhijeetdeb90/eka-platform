import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Live-refreshes notification queries whenever new activity lands for the signed-in user. */
export function useRealtimeNotifications() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    void (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user || cancelled) return;
      channel = supabase
        .channel(`notifications:${auth.user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${auth.user.id}`,
          },
          () => {
            void queryClient.invalidateQueries({ queryKey: ["notifications"] });
            void queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
          },
        )
        .subscribe();
    })();

    return () => {
      cancelled = true;
      if (channel) void supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

/** Live-refreshes the comment thread (and comment counts) for a single post. */
export function useRealtimeComments(postId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`comments:${postId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "post_comments", filter: `post_id=eq.${postId}` },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["comments", postId] });
          void queryClient.invalidateQueries({ queryKey: ["post", postId] });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [postId, queryClient]);
}
