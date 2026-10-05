import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppScreen, EmptyState } from "@/components/app/AppScreen";
import { PostCard } from "@/components/app/PostCard";
import { UserAvatar } from "@/components/app/Avatar";
import { hydratePosts, type PostRow, type FeedPost } from "@/lib/api";
import { INTERESTS } from "@/lib/eka";
import { useProfile } from "@/hooks/useProfile";
import { AskEkaDrawer } from "@/components/app/AskEkaDrawer";
import { SacredGeographyMap } from "@/components/app/SacredGeographyMap";

export const Route = createFileRoute("/_authenticated/app/explore")({

  component: Explore,
});

function Explore() {
  const { data: profile } = useProfile();

  const interests = profile?.interests ?? [];

  const { data } = useQuery({
    queryKey: ["explore", interests.join(",")],
    queryFn: async () => {
      const forYouQuery = interests.length
        ? supabase
            .from("posts")
            .select("*")
            .eq("status", "visible")
            .in("topic", interests)
            .order("created_at", { ascending: false })
            .limit(6)
        : Promise.resolve({ data: [] as PostRow[] });
      const [forYou, trending, questions, experiences, people, communities] = await Promise.all([
        forYouQuery,
        supabase
          .from("posts")
          .select("*")
          .eq("status", "visible")
          .order("like_count", { ascending: false })
          .limit(6),
        supabase
          .from("posts")
          .select("*")
          .eq("status", "visible")
          .eq("type", "question")
          .order("created_at", { ascending: false })
          .limit(4),
        supabase
          .from("posts")
          .select("*")
          .eq("status", "visible")
          .eq("type", "experience")
          .order("created_at", { ascending: false })
          .limit(4),
        supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url, bio, interests")
          .limit(8),
        supabase
          .from("communities")
          .select("id, slug, name, description, member_count, category")
          .order("member_count", { ascending: false })
          .limit(8),
      ]);
      const interestSet = new Set(interests.map((i) => i.toLowerCase()));
      type PersonRow = {
        id: string;
        username: string | null;
        display_name: string | null;
        avatar_url: string | null;
        bio: string | null;
        interests: string[] | null;
      };
      const rankedPeople = ((people.data ?? []) as unknown as PersonRow[])
        .map((p) => ({
          person: p,
          shared: (p.interests ?? []).filter((i) => interestSet.has(i.toLowerCase())).length,
        }))
        .sort((a, b) => b.shared - a.shared)
        .map((r) => r.person);

      return {
        forYou: await hydratePosts((forYou.data ?? []) as PostRow[]),
        trending: await hydratePosts((trending.data ?? []) as PostRow[]),
        questions: await hydratePosts((questions.data ?? []) as PostRow[]),
        experiences: await hydratePosts((experiences.data ?? []) as PostRow[]),
        people: rankedPeople,
        communities: communities.data ?? [],
      };
    },
  });

  const topics = profile?.interests?.length ? profile.interests : INTERESTS.slice(0, 10);

  return (
    <AppScreen variant="canvas" eyebrow="Explore" title="Ideas, people and Sanghas">
      {/* Interactive AI Knowledge Layer: Ask EKA */}
      <section className="space-y-2">
        <AskEkaDrawer inline />
      </section>

      {/* Sacred Geography & Google Maps Platform */}
      <section className="space-y-2">
        <SacredGeographyMap />
      </section>


      <section>
        <h2 className="font-display text-lg">Topics</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {topics.map((t) => (
            <Link
              key={t}
              to="/app/search"
              search={{ q: t }}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs transition-colors hover:bg-accent"
            >
              {t}
            </Link>
          ))}
        </div>
      </section>

      {(data?.forYou.length ?? 0) > 0 && (
        <Section
          title="For you"
          posts={data?.forYou}
          empty="Pick a few interests in onboarding to personalise this."
        />
      )}

      <section>
        <h2 className="font-display text-lg">People</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
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
                <p className="truncate text-xs text-muted-foreground">
                  {p.bio ?? (p.interests ?? []).join(" · ") ?? ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg">Sanghas</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {data?.communities.map((c) => (
            <Link
              key={c.id}
              to="/app/sanghas/$slug"
              params={{ slug: c.slug }}
              className="rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-accent"
            >
              <p className="font-display text-base">{c.name}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">{c.member_count} members</p>
            </Link>
          ))}
        </div>
      </section>

      <Section title="Trending" posts={data?.trending} empty="Nothing trending yet." />
      <Section title="Questions" posts={data?.questions} empty="No open questions right now." />
      <Section title="Experiences" posts={data?.experiences} empty="No experiences shared yet." />
    </AppScreen>
  );
}

function Section({
  title,
  posts,
  empty,
}: {
  title: string;
  posts: FeedPost[] | undefined;
  empty: string;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg">{title}</h2>
      {(posts?.length ?? 0) === 0 ? (
        <EmptyState title={title} body={empty} />
      ) : (
        posts?.map((p) => <PostCard key={p.id} post={p} compact />)
      )}
    </section>
  );
}
