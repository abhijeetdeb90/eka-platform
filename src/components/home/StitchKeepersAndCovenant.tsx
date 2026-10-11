import React from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowRight, UserCheck, EyeOff, FileText } from "lucide-react";

export function StitchKeepersAndCovenant() {
  const stewards = [
    {
      name: "Pt. Ramakrishna Shastry",
      role: "Vedic Chanting Master",
      region: "Varanasi, India",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
      tradition: "Rigvedic Oral Recitation (43rd Gen)",
      quote: "Breath and tone carry what paper cannot record.",
    },
    {
      name: "Sen Soshitsu",
      role: "Chado Tea Master",
      region: "Kyoto, Japan",
      image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=400&q=80",
      tradition: "Urasenke Way of Tea",
      quote: "One time, one meeting — cherishing each human encounter.",
    },
    {
      name: "Doña Elena Quintero",
      role: "Natural Dye Weaver",
      region: "Oaxaca, Mexico",
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80",
      tradition: "Zapotec Cochineal & Indigo Guild",
      quote: "The wool remembers every river and every grandmother's recipe.",
    },
    {
      name: "Lalla Fatima Zahra",
      role: "Spice Lore Custodian",
      region: "Fez, Morocco",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      tradition: "Heirloom Ras el Hanout Lineage",
      quote: "A kitchen is not a recipe book; it is a shared hearth of memory.",
    },
  ];

  return (
    <section className="container-eka mt-20">
      {/* SECTION 4: MEET THE KEEPERS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase text-terracotta font-semibold tracking-widest">
            Living Guardianship
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-foreground tracking-tight mt-1">
            Meet the Keepers of Living Memory
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mt-2">
            Not creators chasing viral volatility, but master practitioners, oral bards, and family matriarchs safeguarding irreplaceable human lineages.
          </p>
        </div>
        <Link
          to="/community"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta hover:underline shrink-0"
        >
          <span>Explore All Stewards</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stewards.map((s) => (
          <div
            key={s.name}
            className="group rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-calm hover:border-terracotta/40 transition-all flex flex-col justify-between"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-accent/40 relative">
              <img
                src={s.image}
                alt={s.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider text-foreground">
                {s.region}
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-terracotta font-semibold">
                  {s.tradition}
                </span>
                <h3 className="font-serif text-base font-semibold text-foreground mt-0.5">
                  {s.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 mb-2">{s.role}</p>
                <p className="text-xs italic text-muted-foreground/80 leading-relaxed border-l-2 border-terracotta/30 pl-2">
                  "{s.quote}"
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  Verified Lineage
                </span>
                <Link
                  to="/community"
                  className="text-terracotta hover:underline font-medium text-[11px]"
                >
                  View Lore
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
                Human Identity Verification
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Members are real human participants. Contributor lineages undergo peer and community review before carrying epistemic badges.
              </p>
            </div>
            <span className="mt-4 text-[10px] font-mono uppercase tracking-wider text-emerald-600 font-semibold">
              Zero Synthetic Accounts
            </span>
          </div>

          <div className="rounded-2xl bg-card border border-border/80 p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="size-10 rounded-xl bg-accent/60 text-terracotta flex items-center justify-center mb-4">
                <ShieldCheck className="size-5" />
              </div>
              <h4 className="font-serif text-base font-semibold text-foreground mb-2">
                Hereditary Custodian Sovereign Lore
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Traditional knowledge belongs to the practitioners. Custodians retain complete copyright, attribution, and licensing rights over sacred recordings.
              </p>
            </div>
            <span className="mt-4 text-[10px] font-mono uppercase tracking-wider text-terracotta font-semibold">
              Custody Sovereignty
            </span>
          </div>

          <div className="rounded-2xl bg-card border border-border/80 p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="size-10 rounded-xl bg-accent/60 text-terracotta flex items-center justify-center mb-4">
                <EyeOff className="size-5" />
              </div>
              <h4 className="font-serif text-base font-semibold text-foreground mb-2">
                Data Dignity & Zero Ad Tracking
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We never monetize your attention with behavioral advertising or trade cultural browsing habits with data brokers.
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
