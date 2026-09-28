import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppScreen, EmptyState } from "@/components/app/AppScreen";
import { PostCard } from "@/components/app/PostCard";
import { hydratePosts, type PostRow } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/app/saved")({
  component: Saved,
});

function Saved() {
  const { data } = useQuery({
    queryKey: ["saved"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return [];
      const { data: saves } = await supabase
        .from("post_saves")
        .select("post_id")
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false });
      const ids = (saves ?? []).map((s) => s.post_id);
      if (ids.length === 0) return [];
      const { data: posts } = await supabase.from("posts").select("*").in("id", ids);
      return hydratePosts((posts ?? []) as PostRow[]);
    },
  });

  return (
    <AppScreen eyebrow="Collections" title="Saved">
      {(data?.length ?? 0) === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          body="Tap the bookmark on any post to keep it here."
        />
      ) : (
        data?.map((p) => <PostCard key={p.id} post={p} />)
      )}
    </AppScreen>
  );
}
