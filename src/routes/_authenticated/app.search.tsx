import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppScreen, EmptyState } from "@/components/app/AppScreen";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/components/app/PostCard";
import { UserAvatar } from "@/components/app/Avatar";
import { hydratePosts, type PostRow } from "@/lib/api";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/_authenticated/app/search")({
  validateSearch: (search: Record<string, unknown>) => ({ q: (search["q"] as string) ?? "" }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = useSearch({ from: "/_authenticated/app/search" });
  const navigate = useNavigate();
  const [term, setTerm] = useState(q);

  useEffect(() => setTerm(q), [q]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (term !== q) void navigate({ to: "/app/search", search: { q: term } });
    }, 350);
    return () => clearTimeout(id);
  }, [term, q, navigate]);

  const { data } = useQuery({
    queryKey: ["search", q],
    enabled: q.trim().length > 1,
    queryFn: async () => {
      track("search", { q });
      const like = `%${q.trim()}%`;
      const [people, communities, posts] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url, bio")
          .or(`display_name.ilike.${like},username.ilike.${like},bio.ilike.${like}`)
          .limit(10),
        supabase
          .from("communities")
          .select("id, slug, name, description, member_count")
          .or(`name.ilike.${like},description.ilike.${like},category.ilike.${like}`)
          .limit(10),
        supabase
          .from("posts")
          .select("*")
          .eq("status", "visible")
          .or(`content.ilike.${like},topic.ilike.${like}`)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);
      return {
        people: people.data ?? [],
        communities: communities.data ?? [],
        posts: await hydratePosts((posts.data ?? []) as PostRow[]),
      };
    },
  });

  return (
    <AppScreen eyebrow="Search" title="Find your people">
      <Input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="People, Sanghas, topics, posts"
        autoFocus
      />

      {q.trim().length < 2 && (
        <EmptyState
          title="Search EKA"
          body="Try “meditation”, “Vedanta”, “breathwork” or a name."
        />
      )}

      {(data?.people.length ?? 0) > 0 && (
        <section className="space-y-2">
          <h2 className="font-display text-lg">People</h2>
          {data?.people.map((p) => (
            <Link
              key={p.id}
              to="/app/u/$username"
              params={{ username: p.username ?? "" }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-accent"
            >
              <UserAvatar profile={p} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{p.display_name ?? p.username}</p>
                <p className="truncate text-xs text-muted-foreground">@{p.username}</p>
              </div>
            </Link>
          ))}
        </section>
      )}

      {(data?.communities.length ?? 0) > 0 && (
        <section className="space-y-2">
          <h2 className="font-display text-lg">Sanghas</h2>
          {data?.communities.map((c) => (
            <Link
              key={c.id}
              to="/app/sanghas/$slug"
              params={{ slug: c.slug }}
              className="block rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-accent"
            >
              <p className="font-display text-base">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.member_count} members</p>
            </Link>
          ))}
        </section>
      )}

      {(data?.posts.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-lg">Posts</h2>
          {data?.posts.map((p) => (
            <PostCard key={p.id} post={p} compact />
          ))}
        </section>
      )}
    </AppScreen>
  );
}
