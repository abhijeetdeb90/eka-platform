import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BadgeCheck, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/app/Avatar";
import { PostCard } from "@/components/app/PostCard";
import { EmptyState } from "@/components/app/AppScreen";
import { fetchPostsBy, fetchSocialCounts, toggleFollow, type ProfileRow } from "@/lib/api";
import { track } from "@/lib/analytics";

export function ProfileView({ profile, isSelf }: { profile: ProfileRow; isSelf: boolean }) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"posts" | "about" | "communities">("posts");

  const { data: counts } = useQuery({
    queryKey: ["counts", profile.id],
    queryFn: () => fetchSocialCounts(profile.id),
  });

  const { data: posts } = useQuery({
    queryKey: ["feed", "author", profile.id],
    queryFn: () => fetchPostsBy({ authorId: profile.id }),
  });

  const { data: communities } = useQuery({
    queryKey: ["profile-communities", profile.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("community_members")
        .select("communities(id, name, slug, member_count)")
        .eq("user_id", profile.id);
      return (data ?? []).map((r) => r.communities).filter(Boolean) as {
        id: string;
        name: string;
        slug: string;
        member_count: number;
      }[];
    },
  });

  const { data: following } = useQuery({
    queryKey: ["following", profile.id],
    enabled: !isSelf,
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return false;
      const { data } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", auth.user.id)
        .eq("following_id", profile.id)
        .maybeSingle();
      return Boolean(data);
    },
  });

  const follow = async () => {
    await toggleFollow(profile.id, Boolean(following));
    if (!following) track("follow", { target: profile.id });
    void queryClient.invalidateQueries({ queryKey: ["following", profile.id] });
    void queryClient.invalidateQueries({ queryKey: ["counts", profile.id] });
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-5 pt-6 lg:pt-10">
      <header className="animate-rise">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <UserAvatar profile={profile} className="size-16 text-lg" />
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-1.5">
                <h1 className="truncate text-2xl">{profile.display_name ?? profile.username}</h1>
                {profile.verified && <BadgeCheck className="size-5 shrink-0 text-primary" />}
              </div>
              <p className="truncate text-sm text-muted-foreground">@{profile.username}</p>
              {profile.account_type !== "personal" && (
                <span className="mt-1 inline-block rounded-full bg-primary-soft px-2 py-0.5 text-[10px] uppercase tracking-[0.16em]">
                  {profile.account_type}
                </span>
              )}
            </div>
          </div>
          {isSelf ? (
            <Button asChild variant="outline" size="sm">
              <Link to="/app/settings">Edit profile</Link>
            </Button>
          ) : (
            <Button size="sm" variant={following ? "outline" : "default"} onClick={follow}>
              {following ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        {profile.bio && <p className="mt-4 text-sm leading-relaxed">{profile.bio}</p>}

        {profile.interests.length > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">{profile.interests.join(" · ")}</p>
        )}

        <div className="mt-5 flex gap-6 text-sm">
          <span>
            <strong>{counts?.posts ?? 0}</strong>{" "}
            <span className="text-muted-foreground">Posts</span>
          </span>
          <span>
            <strong>{counts?.followers ?? 0}</strong>{" "}
            <span className="text-muted-foreground">Followers</span>
          </span>
          <span>
            <strong>{counts?.following ?? 0}</strong>{" "}
            <span className="text-muted-foreground">Following</span>
          </span>
        </div>

        <div className="mt-6 flex gap-1 border-b border-border">
          {(["posts", "about", "communities"] as const).map((t) => (
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
      </header>

      <div className="mt-6 space-y-4">
        {tab === "posts" &&
          ((posts?.length ?? 0) === 0 ? (
            <EmptyState
              title="No posts yet"
              body="Reflections shared here will appear on this profile."
            />
          ) : (
            posts?.map((p) => <PostCard key={p.id} post={p} />)
          ))}

        {tab === "about" && (
          <div className="space-y-4 rounded-2xl border border-border bg-card p-5 text-sm shadow-calm">
            <Field label="Bio" value={profile.bio ?? "Not added yet."} />
            <Field label="Here for" value={profile.intentions.join(" · ") || "—"} />
            <Field label="Interests" value={profile.interests.join(" · ") || "—"} />
            <Field label="Practices" value={profile.practices.join(" · ") || "—"} />
            <Field
              label="Joined"
              value={new Date(profile.created_at).toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            />
          </div>
        )}

        {tab === "communities" &&
          ((communities?.length ?? 0) === 0 ? (
            <EmptyState title="No Sanghas yet" body="Communities joined will be listed here." />
          ) : (
            communities?.map((c) => (
              <Link
                key={c.id}
                to="/app/sanghas/$slug"
                params={{ slug: c.slug }}
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-calm transition-colors hover:bg-accent"
              >
                <span className="font-display text-base">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.member_count} members</span>
              </Link>
            ))
          ))}

        {isSelf && (
          <Link
            to="/app/plus"
            className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary-soft/40 p-5 text-sm"
          >
            <Sparkles className="size-5 text-primary" />
            Go further within with EKA Plus — ₹99/month.
          </Link>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}
