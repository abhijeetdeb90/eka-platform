import { useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppScreen, EmptyState } from "@/components/app/AppScreen";
import { PostCard } from "@/components/app/PostCard";
import { UserAvatar } from "@/components/app/Avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { hydratePosts, type PostRow } from "@/lib/api";
import { timeAgo } from "@/lib/eka";
import { track } from "@/lib/analytics";
import { useRealtimeComments } from "@/hooks/useRealtime";

export const Route = createFileRoute("/_authenticated/app/p/$postId")({
  component: PostDetail,
});

type CommentRow = {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  profiles: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

function PostDetail() {
  const { postId } = useParams({ from: "/_authenticated/app/p/$postId" });
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  useRealtimeComments(postId);

  const { data: post } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data } = await supabase.from("posts").select("*").eq("id", postId).maybeSingle();
      if (!data) return null;
      const [hydrated] = await hydratePosts([data as PostRow]);
      return hydrated ?? null;
    },
  });

  const { data: comments } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data } = await supabase
        .from("post_comments")
        .select(
          "id, post_id, user_id, parent_id, content, created_at, profiles:user_id(id, username, display_name, avatar_url)",
        )
        .eq("post_id", postId)
        .eq("status", "visible")
        .order("created_at", { ascending: true });
      return (data ?? []) as unknown as CommentRow[];
    },
  });

  const submit = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user || !body.trim()) return;
    await supabase.from("post_comments").insert({
      post_id: postId,
      user_id: auth.user.id,
      parent_id: replyTo,
      content: body.trim(),
    });
    if (post && post.author_id !== auth.user.id) {
      await supabase.from("notifications").insert({
        user_id: post.author_id,
        actor_id: auth.user.id,
        type: replyTo ? "reply" : "comment",
        post_id: postId,
      });
    }
    track("comment", { post_id: postId });
    setBody("");
    setReplyTo(null);
    void queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    void queryClient.invalidateQueries({ queryKey: ["post", postId] });
  };

  const roots = (comments ?? []).filter((c) => !c.parent_id);

  return (
    <AppScreen eyebrow="Conversation" title="Post">
      {post ? (
        <PostCard post={post} />
      ) : (
        <EmptyState title="Not found" body="This post is unavailable." />
      )}

      <div className="rounded-2xl border border-border bg-card p-5 shadow-calm">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
          placeholder={replyTo ? "Write a reply…" : "Add a comment…"}
          className="resize-none"
        />
        <div className="mt-3 flex justify-end gap-2">
          {replyTo && (
            <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)}>
              Cancel reply
            </Button>
          )}
          <Button size="sm" onClick={submit} disabled={!body.trim()}>
            Comment
          </Button>
        </div>
      </div>

      {roots.map((c) => (
        <div key={c.id} className="space-y-3">
          <CommentItem comment={c} onReply={() => setReplyTo(c.id)} />
          <div className="ml-12 space-y-3">
            {(comments ?? [])
              .filter((r) => r.parent_id === c.id)
              .map((r) => (
                <CommentItem key={r.id} comment={r} />
              ))}
          </div>
        </div>
      ))}
    </AppScreen>
  );
}

function CommentItem({ comment, onReply }: { comment: CommentRow; onReply?: () => void }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-card p-4">
      <UserAvatar profile={comment.profiles} className="size-8 text-xs" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">
          {comment.profiles?.display_name ?? comment.profiles?.username} ·{" "}
          {timeAgo(comment.created_at)}
        </p>
        <p className="mt-1 whitespace-pre-wrap text-sm">{comment.content}</p>
        {onReply && (
          <button
            onClick={onReply}
            className="mt-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Reply
          </button>
        )}
      </div>
    </div>
  );
}
