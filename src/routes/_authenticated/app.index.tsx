import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Composer } from "@/components/app/Composer";
import { PostCard } from "@/components/app/PostCard";
import { DailyRitual } from "@/components/app/DailyRitual";
import { HomeRail } from "@/components/app/HomeRail";
import { UserAvatar } from "@/components/app/Avatar";
import { fetchHomeFeed } from "@/lib/api";
import { useProfile } from "@/hooks/useProfile";
import { FadeIn, HoverLiftCard } from "@/components/motion/MotionPrimitives";
import stillWater from "@/assets/still-water.jpg";
import ritualLamp from "@/assets/ritual-lamp.jpg";
import readingTable from "@/assets/reading-table.jpg";
import { fetchActiveHomepageSections, resolveSectionCards } from "@/lib/studio/homepage-service";
import { PageShell } from "@/components/layout/PageShell";

export const Route = createFileRoute("/_authenticated/app/")({
  component: HomeFeed,
});

const REASON_COPY: Record<string, string> = {
  following: "From someone you follow",
  sangha: "From your Circle",
  interest: "Because of your interests",
};

/** Editorial cards woven into the feed so the page always has something to look at. */
const EDITORIAL = [
  {
    image: stillWater,
    eyebrow: "Reading · Silence",
    title: "Silence isn’t the absence of thought",
    body: "It is the space in which thought becomes visible. A short essay on what practitioners across traditions mean when they say “sit”.",
    tags: ["Silence", "Practice", "Zen"],
    to: "/app/explore",
    cta: "Read in Explore",
  },
  {
    image: ritualLamp,
    eyebrow: "Ritual · Light",
    title: "The small flame that people keep",
    body: "Lamps, candles, oil and wick — why nearly every tradition marks attention with a light, and what it asks of the person holding it.",
    tags: ["Ritual", "Devotion", "Culture"],
    to: "/app/discover",
    cta: "Religions & cultures",
  },
  {
    image: readingTable,
    eyebrow: "Study · Text",
    title: "Reading slowly, on purpose",
    body: "One page, twice. A practice for scripture, poetry and anything else worth not finishing quickly.",
    tags: ["Study", "Wisdom", "Journal"],
    to: "/app/journal",
    cta: "Open your journal",
  },
] as const;

function EditorialCard({ item }: { item: (typeof EDITORIAL)[number] }) {
  return (
    <HoverLiftCard className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-calm transition-all duration-300 hover:border-border hover:shadow-lift">
      <Link to={item.to} className="block focus:outline-hidden">
        <div className="overflow-hidden">
          <img
            src={item.image}
            alt={`${item.title} — ${item.eyebrow}`}
            loading="lazy"
            width={1280}
            height={960}
            className="h-56 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] sm:h-72"
          />
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            {item.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-xl font-normal leading-snug sm:text-2xl">
            {item.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-light">
            {item.body}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {item.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border/70 bg-sand/30 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                {t}
              </span>
            ))}
            <span className="ml-auto inline-flex items-center text-sm font-medium text-terracotta transition-transform group-hover:translate-x-1">
              <span>{item.cta}</span>
              <ArrowRight className="ml-1 size-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </HoverLiftCard>
  );
}

function HomeFeed() {
  const { data: profile, isLoading } = useProfile();
  const { data: posts, isLoading: feedLoading } = useQuery({
    queryKey: ["feed", "home"],
    queryFn: fetchHomeFeed,
  });

  const { data: suggestions } = useQuery({
    queryKey: ["suggested-people"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, bio")
        .neq("id", auth.user?.id ?? "")
        .limit(8);
      return data ?? [];
    },
  });

  const { data: studioSections = [] } = useQuery({
    queryKey: ["studio-homepage-sections"],
    queryFn: fetchActiveHomepageSections,
  });

  if (!isLoading && profile && !profile.onboarded) {
    return <Navigate to="/app/onboarding" />;
  }

  const feed = posts ?? [];

  // Weave an editorial card in after every third post so the column never runs dry.
  const stream: Array<{ key: string; node: React.ReactNode }> = [];
  feed.forEach((post, i) => {
    stream.push({
      key: post.id,
      node: (
        <FadeIn delay={0.03} direction="up" className="space-y-1.5">
          {post.reason && post.reason !== "recent" && (
            <p className="px-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {REASON_COPY[post.reason]}
            </p>
          )}
          <PostCard post={post} />
        </FadeIn>
      ),
    });
    const editorialIndex = Math.floor(i / 3);
    if ((i + 1) % 3 === 0 && editorialIndex < EDITORIAL.length) {
      stream.push({
        key: `editorial-${editorialIndex}`,
        node: (
          <FadeIn delay={0.05} direction="up">
            <EditorialCard item={EDITORIAL[editorialIndex]!} />
          </FadeIn>
        ),
      });
    }
  });
  if (!feedLoading && feed.length < 3) {
    EDITORIAL.slice(feed.length === 0 ? 0 : 1).forEach((item, i) =>
      stream.push({
        key: `fill-${i}`,
        node: (
          <FadeIn delay={i * 0.05} direction="up">
            <EditorialCard item={item} />
          </FadeIn>
        ),
      }),
    );
  }

  // On narrow screens the rail is folded into the column after the first posts,
  // as a dense two-up grid, so nothing is stranded below an empty stretch.
  const railIndex = Math.min(2, stream.length);
  stream.splice(railIndex, 0, {
    key: "rail-inline",
    node: (
      <div className="xl:hidden">
        <HomeRail dense />
      </div>
    ),
  });

  return (
    <PageShell variant="canvas" rightRail={<HomeRail />}>
      <h1 className="sr-only">Your EKA home</h1>
      <FadeIn delay={0.02} direction="up">
        <DailyRitual name={profile?.display_name ?? null} />
      </FadeIn>

          <FadeIn delay={0.06} direction="up">
            <Composer />
          </FadeIn>

          {/* Dynamic Sections from Studio Control Plane */}
          {studioSections.slice(1, 3).map((section) => {
            const cards = resolveSectionCards(section);
            if (cards.length === 0) return null;

            return (
              <FadeIn key={section.id} delay={0.07} direction="up">
                <section
                  aria-label={section.title}
                  className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      {section.config.badge && (
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                          {section.config.badge}
                        </p>
                      )}
                      <h2 className="font-display text-lg font-normal text-foreground">{section.title}</h2>
                      {section.subtitle && (
                        <p className="text-xs text-muted-foreground">{section.subtitle}</p>
                      )}
                    </div>
                    {section.config.cta_link && (
                      <Link
                        to={section.config.cta_link}
                        className="text-xs font-medium text-terracotta hover:underline"
                      >
                        {section.config.cta_text || "Explore"} →
                      </Link>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {cards.slice(0, 2).map((card) => (
                      <div
                        key={card.id}
                        className="rounded-xl border border-border/70 bg-accent/20 p-4 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase">
                          <span>{card.type}</span>
                          <span className="text-primary font-semibold">{card.verification_status}</span>
                        </div>
                        <h3 className="font-display text-base font-medium">{card.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{card.summary}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </FadeIn>
            );
          })}

          {(suggestions?.length ?? 0) > 0 && (
            <FadeIn delay={0.08} direction="up">
              <section
                aria-label="People you may resonate with"
                className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                  <Sparkles className="size-3 text-saffron" />
                  <h2>People you may resonate with</h2>
                </div>
                <div className="mt-3 flex gap-4 overflow-x-auto pb-1">
                  {suggestions?.map((s) => (
                    <Link
                      key={s.id}
                      to="/app/u/$username"
                      params={{ username: s.username ?? "" }}
                      className="group flex w-20 shrink-0 flex-col items-center gap-2 rounded-xl py-1 text-center transition-opacity hover:opacity-85"
                    >
                      <UserAvatar
                        profile={s}
                        className="size-12 ring-2 ring-border/50 transition-transform group-hover:scale-105"
                      />
                      <span className="truncate text-[11px] font-medium text-foreground">
                        {s.display_name ?? s.username}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            </FadeIn>
          )}

          {feedLoading && (
            <div className="flex items-center justify-center py-12">
              <p aria-live="polite" className="text-sm text-muted-foreground animate-pulse">
                Gathering your feed…
              </p>
            </div>
          )}

          <div className="space-y-6">
            {stream.map((item) => (
              <div key={item.key}>{item.node}</div>
            ))}
          </div>

          {!feedLoading && feed.length === 0 && (
            <div className="rounded-2xl border border-border/60 bg-sand/20 p-8 text-center">
              <p className="text-sm leading-relaxed text-muted-foreground font-light">
                Your sanctuary feed deepens as you follow seekers and join Circles. In the meantime,
                explore the reflections above.
              </p>
            </div>
          )}
    </PageShell>
  );
}
