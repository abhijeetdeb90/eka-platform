import React from "react";
import { Link } from "@tanstack/react-router";
import { Compass, Users, ArrowRight, ShieldCheck } from "lucide-react";

export function StitchEditorialHero({ profile, loginForm }: { profile: any; loginForm: React.ReactNode }) {
  return (
    <div className="w-full">
      {/* Top Trust & Editorial Overline Ribbon */}
      <section className="w-full bg-sand/30 dark:bg-card/50 border-b border-border/60 py-2 px-4 sm:px-6">
        <div className="container-eka flex flex-col sm:flex-row items-center justify-between gap-2 text-muted-foreground text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-2 rounded-full bg-terracotta animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-terracotta font-semibold">
              Living Human Custody Archive
            </span>
            <span className="hidden md:inline text-border">•</span>
            <span className="hidden md:inline text-[11px]">
              100% Verified Human Lineages • Zero Synthetic Creators • Zero Bot Accounts
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/standards" className="hover:text-terracotta transition-colors flex items-center gap-1 font-medium text-[11px]">
              <span>Read Our Human Covenant</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 1: Welcoming Editorial Hero */}
      <section className="container-eka pt-10 pb-8 sm:pt-14 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Text & Core Promise */}
          <div className="lg:col-span-7 flex flex-col items-start pr-0 lg:pr-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/70 text-terracotta font-mono text-[10px] uppercase tracking-wider font-semibold mb-4">
              <span>∞</span>
              One Within. One With All.
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-foreground tracking-tight leading-[1.1] mb-5">
              A Place Where <span className="italic text-terracotta">Curiosity</span> Becomes Belonging.
            </h1>

            <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl">
              We created EKA because the world does not need another feed of infinite distraction. It needs a sanctuary of genuine human wisdom, where meeting someone from another culture teaches you about yourself.
            </p>

            {/* Core Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mb-8">
              <Link
                to="/discover"
                className="px-6 py-3 rounded-full bg-terracotta hover:bg-terracotta/90 text-white font-medium text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>Explore Living Culture</span>
                <Compass className="size-4" />
              </Link>

              <Link
                to="/find-your-people"
                className="px-5 py-3 rounded-full bg-card border border-border/80 hover:bg-accent text-foreground font-medium text-xs sm:text-sm transition-colors flex items-center gap-2"
              >
                <span>Find Your People</span>
                <Users className="size-4 text-terracotta" />
              </Link>

              <Link
                to="/standards"
                className="px-3 py-3 text-muted-foreground hover:text-terracotta text-xs font-medium transition-colors flex items-center gap-1 group"
              >
                <span>Read Our Human Covenant</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Epistemic Proof Badge */}
            <div className="w-full max-w-xl bg-sand/30 dark:bg-card/50 border border-border/60 rounded-2xl p-4 flex items-center gap-3.5 mb-6">
              <div className="size-10 rounded-full bg-accent/60 flex items-center justify-center shrink-0 text-terracotta">
                <ShieldCheck className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Our Human Connection Principle
                </span>
                <p className="text-xs sm:text-sm text-foreground font-medium italic mt-0.5">
                  "Behind every story is a person. Behind every culture is a community."
                </p>
              </div>
            </div>

            {/* Render Login Form if logged out */}
            {!profile && loginForm}
          </div>

          {/* Hero Atmospheric Image Mosaic */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-accent/40 border border-border/60">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
                alt="Close up warm photography of weathered human hands tenderly cupping a burning clay terracotta diya lamp at twilight during an ancient Indian ritual along the sacred riverbanks of Varanasi."
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300 font-semibold">
                  Dashashwamedh Ghat, Varanasi
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-normal mt-1">
                  The Twilight Fire Offering
                </h3>
                <p className="text-xs text-white/90 font-light mt-1 line-clamp-2">
                  "Fire is the only element that naturally points upward. Offering a clay lamp returns life to the source."
                </p>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/20">
                  <span className="size-6 rounded-full bg-terracotta text-white text-[10px] flex items-center justify-center font-bold">
                    PS
                  </span>
                  <span className="font-mono text-[11px] text-white/90">
                    Pt. Ramakrishna Shastry • Rigvedic Lineage
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Secondary Archival Card */}
            <div className="hidden sm:flex absolute -bottom-5 -left-6 bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl p-3.5 shadow-xl max-w-xs items-center gap-3">
              <div className="size-14 rounded-xl overflow-hidden shrink-0 bg-accent/40">
                <img
                  src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=200&q=80"
                  alt="Atmospheric serene shot of a traditional wooden machiya tea room in Kyoto Japan"
                  className="size-full object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-wider text-terracotta font-semibold">
                  Kyoto, Kansai
                </span>
                <span className="font-serif text-sm font-semibold text-foreground truncate">
                  Chado: Silence in Matcha
                </span>
                <span className="text-[11px] text-muted-foreground">Master Sen Soukaku</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
