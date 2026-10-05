import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  HelpCircle,
  Compass,
  ArrowRight,
  BookOpen,
  Users,
  Search,
} from "lucide-react";
import { AppScreen } from "@/components/app/AppScreen";
import { AskEkaDrawer } from "@/components/app/AskEkaDrawer";
import { AiNavigator } from "@/components/app/AiNavigator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchThemes, type Theme } from "@/lib/themes";

export const Route = createFileRoute("/_authenticated/app/ask")({
  head: () => ({
    meta: [
      { title: "Ask EKA | Help me understand" },
      {
        name: "description",
        content:
          "Start with a question about rituals, festivals, texts, or traditions. EKA helps you understand with verified sources and human practitioners.",
      },
    ],
  }),
  component: AskPage,
});

const SUGGESTED_QUESTIONS = [
  "Why do people celebrate Diwali?",
  "What is Ekadashi and why do people fast?",
  "Why do Assamese weddings have these rituals?",
  "What is the difference between Shaiva and Vaishnava traditions?",
  "Where did the ritual of lighting lamps originate?",
  "What does silence mean across Zen, Advaita, and Christian monasticism?",
];

function AskPage() {
  const [activeQuery, setActiveQuery] = useState<string>("Sacred Harvest & Equinox Celebrations");
  const [inputVal, setInputVal] = useState<string>("");

  const { data: themes } = useQuery({
    queryKey: ["themes"],
    queryFn: fetchThemes,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setActiveQuery(inputVal.trim());
    }
  };

  const selectPreset = (q: string) => {
    setInputVal(q);
    setActiveQuery(q);
  };

  return (
    <AppScreen
      variant="feed"
      eyebrow="Cultural Intelligence · Verified Sources"
      title="What would you like to understand?"
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        Begin with your curiosity or an actual question. EKA brings together lineage context, verified sources,
        regional variations, and living practitioners.
      </p>

      {/* Primary Query Bar */}
      <form onSubmit={handleSearchSubmit} className="relative mt-2">
        <div className="relative flex items-center">
          <Input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask about a ritual, philosophy, festival, or meaning…"
            className="h-13 rounded-2xl border-primary/30 bg-card pr-28 pl-11 text-base shadow-calm transition-all focus-visible:border-primary focus-visible:ring-primary/20"
          />
          <Search className="absolute left-3.5 size-5 text-muted-foreground pointer-events-none" />
          <Button
            type="submit"
            size="sm"
            className="absolute right-2 rounded-xl px-4 font-medium shadow-xs"
          >
            Understand
          </Button>
        </div>
      </form>

      {/* Suggested Questions Carousel / Chips */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Curated inquiries
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => selectPreset(q)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-3.5 py-1.5 text-xs text-foreground/90 transition-all hover:border-primary/50 hover:bg-accent/70 hover:text-foreground active:scale-95"
            >
              <Sparkles className="size-3 text-primary shrink-0" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Answer Engine (Inline Drawer) */}
      <div className="pt-2">
        <AskEkaDrawer key={activeQuery} initialQuery={activeQuery} inline={true} />
      </div>

      {/* Start from a Human Problem / Theme */}
      {themes && themes.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-border/60">
          <div>
            <h2 className="font-display text-base">Start from what you are carrying</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Most people arrive carrying a human question, not looking for a tradition. Explore by life theme:
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {themes.slice(0, 6).map((t) => (
              <Link
                key={t.slug}
                to="/app/themes"
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-calm"
              >
                <div>
                  <p className="font-display text-sm group-hover:text-primary transition-colors">
                    {t.label}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {t.blurb}
                  </p>
                </div>
                <span className="mt-3 flex items-center gap-1 text-[11px] font-medium text-primary">
                  Explore theme <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Wisdom Navigator Guidance Section */}
      <section className="space-y-3 pt-6 border-t border-border/60">
        <div>
          <h2 className="font-display text-base">Personalized Wisdom Navigator</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            A quiet recommendation on what to explore next, drawn only from your own Wisdom Passport.
          </p>
        </div>
        <AiNavigator />
      </section>
    </AppScreen>
  );
}
