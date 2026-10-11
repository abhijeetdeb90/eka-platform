import React from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowRight, UserCheck, EyeOff, FileText } from "lucide-react";

export function StitchKeepersAndCovenant() {
  const traditions = [
    {
      title: "Rigvedic Oral Chanting",
      category: "Oral Intangible Heritage",
      region: "Varanasi, India",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
      discipline: "Metric Recitation & Vedic Phonetics",
      quote: "Breath, pitch, and accent carry what paper alone cannot preserve.",
      status: "UNESCO Recognized",
    },
    {
      title: "Chadō (The Way of Tea)",
      category: "Aesthetic & Living Philosophy",
      region: "Kyoto, Japan",
      image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=400&q=80",
      discipline: "Ritual Preparation & Hospitality",
      quote: "Ichi-go ichi-e: Cherishing each encounter as an unrepeatable moment.",
      status: "Living Heritage",
    },
    {
      title: "Zapotec Natural Dye Weaving",
      category: "Artisan Guild Heritage",
      region: "Oaxaca, Mexico",
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80",
      discipline: "Cochineal & Handloom Weaving",
      quote: "The wool carries generational memory through wild botanical dyes.",
      status: "Community Tradition",
    },
    {
      title: "North African Spice Alchemy",
      category: "Culinary & Herbal Traditions",
      region: "Fez & Marrakesh, Morocco",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      discipline: "Heirloom Ras el Hanout Craft",
      quote: "The communal hearth is not just cooking; it is shared cultural memory.",
      status: "Living Culinary Lore",
    },
  ];

  return (
    <section className="container-eka mt-20">
      {/* SECTION 4: LIVING TRADITIONS SPOTLIGHT */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase text-terracotta font-semibold tracking-widest">
            Living Heritage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-foreground tracking-tight mt-1">
            Spotlight on Living Cultural Traditions
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mt-2">
            Explore documented living heritages, master craft disciplines, and community traditions preserved across generations.
          </p>
        </div>
        <Link
          to="/discover"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta hover:underline shrink-0"
        >
          <span>Explore All Traditions</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {traditions.map((t) => (
          <div
            key={t.title}
            className="group rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-calm hover:border-terracotta/40 transition-all flex flex-col justify-between"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-accent/40 relative">
              <img
                src={t.image}
                alt={t.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider text-foreground">
                {t.region}
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-terracotta font-semibold">
                  {t.category}
                </span>
                <h3 className="font-serif text-base font-semibold text-foreground mt-0.5">
                  {t.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 mb-2">{t.discipline}</p>
                <p className="text-xs italic text-muted-foreground/80 leading-relaxed border-l-2 border-terracotta/30 pl-2">
                  "{t.quote}"
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-muted-foreground" />
                  {t.status}
                </span>
                <Link
                  to="/discover"
                  className="text-terracotta hover:underline font-medium text-[11px]"
                >
                  Explore
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 6: FOUNDING ESSAY SNIPPET */}
      <div className="mt-16 rounded-3xl bg-card border border-border/80 p-8 sm:p-12 relative overflow-hidden shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/60 text-terracotta font-mono text-[10px] uppercase tracking-wider font-semibold mb-4">
            <FileText className="size-3.5" />
            EKA Insights — Founding Philosophy
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-foreground tracking-tight mb-3">
            Why We Need Each Other's Stories: A Note on the Future of Human Connection
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-6">
            <span>By EKA Founding Stewards</span>
            <span>•</span>
            <span>Spring 2026</span>
            <span>•</span>
            <span className="text-terracotta font-medium">5 min contemplative read</span>
          </div>
          <div className="space-y-4 text-muted-foreground text-sm leading-relaxed border-l-2 border-terracotta/40 pl-4 py-1">
            <p>
              "In the early days of the social web, we gathered because we genuinely loved meeting people across boundaries. A student in Istanbul could converse with a ceramicist in Kyoto; a curious seeker in Ohio could learn the grammar of Bengali poetry directly from someone who loved it. Somewhere along the way, algorithmic volatility replaced empathy, and advertising feeds replaced human friendships."
            </p>
            <p>
              "EKA is our quiet return to what matters: human beings listening to human beings. When you sit with someone else's living heritage, you do not just learn about them. You discover the universal thread that weaves through all of us."
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/insights"
              className="inline-flex items-center gap-2 text-xs font-semibold text-terracotta hover:underline"
            >
              <span>Read Full Founding Essay Collection</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION 7: COVENANT & ACCOUNTABILITY */}
      <div className="mt-16 rounded-3xl bg-sand/30 dark:bg-card/50 border border-border/80 p-8 sm:p-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-mono text-[10px] uppercase text-terracotta font-semibold tracking-widest">
            Trust & Sovereignty
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mt-1 mb-2">
            No Bots. No Anonymous Troll Swarms. No Synthetic Cultural Imitations.
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            We built EKA to be a calm, dignified shelter for real cultural knowledge. Our verification standards are designed for integrity, not invasive surveillance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-card border border-border/80 p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="size-10 rounded-xl bg-accent/60 text-terracotta flex items-center justify-center mb-4">
                <UserCheck className="size-5" />
              </div>
              <h4 className="font-serif text-base font-semibold text-foreground mb-2">
                Authentic Human Community
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Built for real people connecting across cultures. We prioritize authentic member contributions over synthetic content farms and algorithmic engagement bait.
              </p>
            </div>
            <span className="mt-4 text-[10px] font-mono uppercase tracking-wider text-emerald-600 font-semibold">
              Human-Centered Platform
            </span>
          </div>

          <div className="rounded-2xl bg-card border border-border/80 p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="size-10 rounded-xl bg-accent/60 text-terracotta flex items-center justify-center mb-4">
                <ShieldCheck className="size-5" />
              </div>
              <h4 className="font-serif text-base font-semibold text-foreground mb-2">
                Cultural Attribution & Rights
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Traditional knowledge belongs to its practitioners. Contributors maintain attribution, copyright, and sovereignty over their shared recordings and cultural stories.
              </p>
            </div>
            <span className="mt-4 text-[10px] font-mono uppercase tracking-wider text-terracotta font-semibold">
              Author Sovereignty
            </span>
          </div>

          <div className="rounded-2xl bg-card border border-border/80 p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="size-10 rounded-xl bg-accent/60 text-terracotta flex items-center justify-center mb-4">
                <EyeOff className="size-5" />
              </div>
              <h4 className="font-serif text-base font-semibold text-foreground mb-2">
                Data Dignity & Privacy
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We do not monetize your curiosity with behavioral ad tracking or selling browsing data. Your cultural exploration remains private and dignified.
              </p>
            </div>
            <span className="mt-4 text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Privacy by Design
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
