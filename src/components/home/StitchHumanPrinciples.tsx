import React from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Compass, ShieldCheck, Users, Sparkles, BookOpen, Clock, ArrowRight } from "lucide-react";

export function StitchHumanPrinciples() {
  const principles = [
    {
      num: "01",
      icon: Heart,
      title: "People Before Algorithms",
      desc: "We never sort human connections by viral volatility or rage triggers. Conversations on EKA unfold at the natural, dignified speed of human reflection.",
      cue: "Chronological & contemplative cadence",
    },
    {
      num: "02",
      icon: Users,
      title: "Culture Lives in Communities",
      desc: "Traditions are not museum artifacts or solitary aesthetics. They are living relationships carried by families, guilds, elders, and hearth keepers.",
      cue: "Active circles & living lineages",
    },
    {
      num: "03",
      icon: ShieldCheck,
      title: "Zero Synthetic Impersonation",
      desc: "Every voice is a verified human steward. AI on EKA assists inquiry and contextual translation, but will never pose as a synthetic creator or community member.",
      cue: "100% human-verified custody",
    },
    {
      num: "04",
      icon: Compass,
      title: "Two Doorways of Discovery",
      desc: "Explore public cultural archives with complete open access, or join living hearth circles to build lasting cross-cultural bonds when you are ready.",
      cue: "Open archive + private circles",
    },
    {
      num: "05",
      icon: BookOpen,
      title: "Living Memory Over Content",
      desc: "We safeguard oral chants, heirloom kitchen lore, vernacular crafts, and ancestral wisdom that algorithms usually overlook.",
      cue: "Preserved across generations",
    },
    {
      num: "06",
      icon: Sparkles,
      title: "Curiosity Becomes Belonging",
      desc: "Meeting someone from another culture should teach you about yourself. A sanctuary where respectful questions turn strangers into kin.",
      cue: "One Within. One With All.",
    },
  ];

  return (
    <section className="container-eka mt-20">
      <div className="flex flex-col items-start mb-10 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-terracotta font-semibold mb-2">
          <Sparkles className="size-3.5 text-terracotta" />
          The Human-Centric Covenant
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-foreground tracking-tight mb-3">
          Built on principles that protect human warmth.
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Inspired by the early web belief in genuine connection, re-imagined for an age inundated with algorithmic noise, synthetic creators, and shallow feeds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {principles.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.num}
              className="rounded-2xl border border-border/80 bg-card p-6 flex flex-col justify-between hover:border-terracotta/40 hover:shadow-calm transition-all"
            >
              <div>
                <div className="size-11 rounded-xl bg-accent/60 text-terracotta flex items-center justify-center mb-4">
                  <Icon className="size-5" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Principle {p.num}
                </span>
                <h3 className="font-serif text-lg font-semibold text-foreground mt-1 mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {p.desc}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-border/40 flex items-center gap-2 text-terracotta text-xs font-medium">
                <Clock className="size-3.5" />
                <span>{p.cue}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Complementary Ways to Experience EKA Banner */}
      <div className="mt-14 rounded-3xl bg-sand/30 dark:bg-card/50 border border-border/80 p-8 sm:p-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="font-mono text-[10px] uppercase text-terracotta font-semibold tracking-widest">
            Architectural Clarity
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mt-1 mb-2">
            Two Complementary Ways to Experience EKA
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Whether you seek quiet solitary exploration or wish to build lasting bonds with culture bearers, both doorways are open.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="rounded-2xl bg-card border border-border/80 p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-accent/60 text-foreground font-mono text-[10px] uppercase tracking-wider font-semibold">
                  Public & Open Access
                </span>
                <span className="text-[11px] text-muted-foreground">No Sign-in Required</span>
              </div>
              <h4 className="font-serif text-xl font-semibold text-foreground mb-2">
                Doorway 01: Explore Living Culture
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                A serene cartographic and archival atlas of human ingenuity. Wander through master craft folios, sacred geographies, seasonal festivals, and high-fidelity oral recordings freely.
              </p>
            </div>
            <Link
              to="/discover"
              className="inline-flex items-center justify-between w-full rounded-xl bg-accent/60 hover:bg-accent px-4 py-2.5 text-xs font-semibold text-foreground transition-colors"
            >
              <span>Explore Public World Atlas</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="rounded-2xl bg-card border border-border/80 p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-terracotta/15 text-terracotta font-mono text-[10px] uppercase tracking-wider font-semibold">
                  Living Community
                </span>
                <span className="text-[11px] text-muted-foreground">Human Verified</span>
              </div>
              <h4 className="font-serif text-xl font-semibold text-foreground mb-2">
                Doorway 02: Find Your People
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                Join hearth circles gathered around heirloom foodways, ancient languages, artisan guilds, and local histories. Meet real stewards and engage in thoughtful dialogue.
              </p>
            </div>
            <Link
              to="/community"
              className="inline-flex items-center justify-between w-full rounded-xl bg-terracotta hover:bg-terracotta/90 text-white px-4 py-2.5 text-xs font-semibold transition-colors shadow-xs"
            >
              <span>Discover Living Hearths</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
