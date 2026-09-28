import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock3, Sunrise, Sparkles } from "lucide-react";
import { fetchDailyPrompts, promptForToday, PROMPT_KIND_LABEL } from "@/lib/membership";
import { greetingFor } from "@/lib/home";
import { BRAND } from "@/lib/eka";
import { TactileWrapper } from "@/components/motion/MotionPrimitives";
import heroImage from "@/assets/today-reflection.jpg";

/** The daily opening of the home page — a ritual before the social feed begins. */
export function DailyRitual({ name }: { name?: string | null }) {
  const { data: prompts } = useQuery({ queryKey: ["daily-prompts"], queryFn: fetchDailyPrompts });
  const prompt = promptForToday(prompts ?? []);

  return (
    <section className="group overflow-hidden rounded-3xl border border-border/80 bg-card shadow-calm transition-all duration-500 hover:shadow-lift">
      <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-sand/40 px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">
              <Sunrise className="size-3.5 text-saffron" />
              <span>
                {greetingFor()}
                {name ? `, ${name.split(" ")[0]}` : ""}
              </span>
            </div>
            <p className="mt-2 font-display text-sm italic text-terracotta">{BRAND.tagline}</p>
          </div>

          <div className="mt-7">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
              <Sparkles className="size-3 text-saffron" />
              <span>Today’s Reflection</span>
            </div>
            <h1 className="mt-3 font-display text-2xl font-normal leading-[1.25] text-foreground sm:text-[2rem]">
              {prompt?.title ?? "What changes when you stop trying to win the argument?"}
            </h1>
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground font-light">
              {prompt?.body ??
                "Take one disagreement you are carrying and try, for a few minutes, to hold the other person’s reasoning as if it were your own."}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <TactileWrapper>
              <Link
                to="/app/daily"
                className="group/btn inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-xs transition-opacity hover:opacity-90"
              >
                <span>Begin ritual</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
            </TactileWrapper>
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <Clock3 className="size-3.5" />
              {prompt
                ? `${PROMPT_KIND_LABEL[prompt.kind] ?? "Practice"} · ${prompt.minutes} min`
                : "Practice · 5 min"}
            </span>
          </div>
        </div>

        <div className="relative min-h-60 overflow-hidden border-t border-border/60 md:border-l md:border-t-0">
          <img
            src={heroImage}
            alt="A person sitting alone on temple steps above a misted valley at sunrise"
            width={1280}
            height={960}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
      </div>
    </section>
  );
}
