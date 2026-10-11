import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  Play,
  MapPin,
  ShieldCheck,
  PlusCircle,
  HelpCircle,
  ChevronRight,
  X,
  Volume2,
  BookOpen,
  Feather
} from "lucide-react";
import { track } from "@/lib/analytics";

interface StitchLivingDiscoveryHomeProps {
  profile?: any;
  loginForm?: React.ReactNode;
}

export function StitchLivingDiscoveryHome({ profile, loginForm }: StitchLivingDiscoveryHomeProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Traditions");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInquiry, setModalInquiry] = useState("Why do people light diyas at dusk?");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      track("ask_query_submitted", { source: "stitch_living_home", q });
      setModalInquiry(q);
      setModalOpen(true);
    } else {
      navigate({ to: "/ask", search: { q: "", mode: "canon" } });
    }
  };

  const handleChipClick = (q: string) => {
    setSearchQuery(q);
    setModalInquiry(q);
    setModalOpen(true);
  };

  const handleDemoQuery = (q: string) => {
    setSearchQuery(q);
    setModalInquiry(q);
    setModalOpen(true);
  };

  const dimensions = [
    {
      category: "Living Ritual",
      tag: "Living Rituals",
      location: "Varanasi, India",
      title: "Why does sunrise aarti return fire to the river?",
      description:
        "Fire is the single element that ascends by nature. Offering flame across flowing water returns life's solar breath to its primordial source.",
      image:
        "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
      cta: "Explore tradition",
      link: "/stories?category=Rituals",
    },
    {
      category: "Master Craft",
      tag: "Master Crafts",
      location: "Aranmula, Kerala",
      title: "Aranmula Kannadi: The alloy that mirrors the soul",
      description:
        "Eight families guard the secret ratio of copper and tin that produces distortion-free front-surface mirrors without glass backing.",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      cta: "Meet the guild",
      link: "/discover?topic=crafts",
    },
    {
      category: "Living Lineage",
      tag: "Sacred Geography",
      location: "Kyoto, Japan",
      title: "How tea masters turn hospitality into quiet meditation",
      description:
        "Every whisk movement in Chado is designed to make both guest and host utterly present in a fleeting, once-in-a-lifetime encounter (Ichigo Ichie).",
      image:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
      cta: "View lineage",
      link: "/stories?category=Living+Traditions",
    },
    {
      category: "Community Lineage",
      tag: "Oral Lore",
      location: "Thar Desert, Rajasthan",
      title: "500 years protecting desert wildlife as family",
      description:
        "Twenty-nine strict vows established by Guru Jambheshwar in 1485 created the world's first documented ecological custodian movement.",
      image:
        "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
      cta: "Discover history",
      link: "/community",
    },
  ];

  const filteredDimensions =
    activeCategory === "All Traditions"
      ? dimensions
      : dimensions.filter((d) => d.tag === activeCategory);

  const reels = [
    {
      duration: "0:45 Reel",
      location: "Varanasi, India",
      title: "The Twilight Fire Offering of Dashashwamedh",
      custodian: "Pt. Ramakrishna Shastry",
      avatarLetter: "R",
      image:
        "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
    },
    {
      duration: "1:00 Reel",
      location: "Kyoto, Japan",
      title: "Chado: Silence Whispered into Matcha",
      custodian: "Master Sen Soukaku",
      avatarLetter: "S",
      image:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    },
    {
      duration: "1:15 Reel",
      location: "Kolkata, India",
      title: "Kolkata Pujo: The Art of Living Community Shrines",
      custodian: "Subhadra Sen",
      avatarLetter: "S",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    },
    {
      duration: "1:05 Reel",
      location: "Fez, Morocco",
      title: "Thousand-Year Terraces of Chouara",
      custodian: "Maâlem Tariq Benjelloun",
      avatarLetter: "T",
      image:
        "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="w-full bg-[#fff8f5] dark:bg-background text-[#1e1b19] dark:text-foreground">
      {/* =========================================================================
          SECTION 1: EDITORIAL HERO & LIVING ATLAS QUERY
          ========================================================================= */}
      <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Manifesto, Search & Direct Call to Action */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-[#f4ece8] dark:bg-card border border-[#e1bfb5]/40 text-[#88411a] dark:text-saffron">
              <span className="w-2 h-2 rounded-full bg-[#c2410c] animate-pulse" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                The Living Heritage Registry
              </span>
              <span className="text-[#e1bfb5]">•</span>
              <span className="text-xs font-medium text-[#59413a] dark:text-muted-foreground">
                One Within. One With All.
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1e1b19] dark:text-foreground tracking-tight leading-[1.12]">
                Don't just scroll the world. <br />
                <span className="italic text-[#c2410c] dark:text-terracotta">Understand it.</span>
              </h1>
              <p className="font-serif text-lg sm:text-xl text-[#59413a] dark:text-muted-foreground max-w-xl leading-relaxed">
                A billion stories. One living world to understand. Explore sacred geography, living traditions, master craft guilds, and oral lineages directly from verified community custodians.
              </p>
            </div>

            {/* Integrated Cultural Inquiry Box */}
            <div className="bg-white dark:bg-card rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e7dfd5] dark:border-border/80 space-y-3">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2 bg-[#faf2ee] dark:bg-background/80 rounded-full px-4 py-2 border border-[#e1bfb5]/30 focus-within:border-[#c2410c] transition-all"
              >
                <Sparkles className="size-5 text-[#c2410c] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask anything: Why do people light diyas at dusk? Kyoto tea masters?"
                  className="w-full bg-transparent text-sm sm:text-base text-[#1e1b19] dark:text-foreground placeholder:text-[#59413a]/60 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#c2410c] hover:bg-[#9b2f00] text-white text-xs sm:text-sm font-medium transition-colors shrink-0 flex items-center gap-1 shadow-sm active:scale-95"
                >
                  <span>Ask EKA</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </form>

              {/* Quick Discovery Queries */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="font-mono text-[10px] font-bold uppercase text-[#59413a]/80 dark:text-muted-foreground mr-1">
                  Frequent:
                </span>
                {[
                  "Why do people light diyas?",
                  "What makes Varanasi sacred?",
                  "Kyoto tea ceremony",
                  "Bhoota Kola traditions",
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    className="px-3 py-1 rounded-full bg-[#eee7e3] dark:bg-accent/60 hover:bg-[#c2410c] hover:text-white text-xs font-medium text-[#59413a] dark:text-foreground transition-all"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Callouts / Auth */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#discover-categories"
                className="px-6 py-3 rounded-full bg-[#c2410c] hover:bg-[#9b2f00] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 active:scale-95"
              >
                <span>Explore Living World</span>
                <Compass className="size-4" />
              </a>
              <Link
                to={profile ? "/create" : "/insights"}
                className="px-6 py-3 rounded-full bg-[#f4ece8] dark:bg-card border border-[#e7dfd5] text-[#1e1b19] dark:text-foreground text-sm font-semibold hover:bg-[#eee7e3] transition-colors flex items-center gap-2 active:scale-95"
              >
                <Feather className="size-4 text-[#88411a] dark:text-saffron" />
                <span>Share Your Family Story</span>
              </Link>
            </div>

            {/* If logged out, render inline login module */}
            {!profile && loginForm && (
              <div className="pt-2 max-w-md">
                {loginForm}
              </div>
            )}
          </div>

          {/* Right Column: Dual Visual Artifact Vignettes */}
          <div className="lg:col-span-5 relative">
            <div className="relative grid grid-cols-2 gap-4">
              {/* Primary Card: Varanasi Sunrise */}
              <div className="col-span-2 space-y-1">
                <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg border border-[#e7dfd5] group">
                  <img
                    src="https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80"
                    alt="Sacred dawn prayers along the ancient stone ghats of Varanasi"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-card/90 backdrop-blur-md font-mono text-[10px] uppercase font-bold text-[#88411a] dark:text-saffron">
                    Sacred Confluence
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                    <span className="text-xs font-mono text-[#ffb59d]">Varanasi, Uttar Pradesh</span>
                    <p className="font-serif text-lg font-medium leading-snug">The Eternal Ganga Dawn Aarti</p>
                    <p className="text-xs text-white/80 line-clamp-1 font-light">
                      3,000 continuous years of morning salutations to life and water.
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary Card 1: Kyoto Machiya */}
              <div className="relative h-44 rounded-2xl overflow-hidden shadow-md border border-[#e7dfd5] group">
                <img
                  src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
                  alt="Historic wooden machiya and stone alleys of Kyoto at twilight"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="font-mono text-[9px] uppercase font-bold text-[#ffb59d]">Living Lineage</span>
                  <p className="font-serif text-sm font-medium leading-tight">Kyoto Machiya Custodians</p>
                </div>
              </div>

              {/* Secondary Card 2: Human Provenance */}
              <div className="relative h-44 rounded-2xl bg-[#eee7e3] dark:bg-card p-4 flex flex-col justify-between border border-[#e7dfd5] dark:border-border/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <ShieldCheck className="size-7 text-[#c2410c]" />
                  <span className="font-mono text-[10px] font-bold text-[#88411a] dark:text-saffron uppercase">
                    EKA ETHOS
                  </span>
                </div>
                <div>
                  <p className="font-serif text-base font-semibold text-[#1e1b19] dark:text-foreground">
                    Human Provenance
                  </p>
                  <p className="text-xs text-[#59413a] dark:text-muted-foreground mt-1 leading-relaxed">
                    Zero bots. No synthetic distortions. Grounded in authentic elder lineage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Living Reflection Prompt Bar */}
        <div className="mt-12 p-5 bg-[#faf2ee] dark:bg-card rounded-2xl border border-[#e1bfb5]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#c2410c] text-white flex items-center justify-center shrink-0">
              <Sparkles className="size-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold uppercase text-[#88411a] dark:text-saffron tracking-wider">
                Daily Living Reflection
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-normal text-[#1e1b19] dark:text-foreground">
                “What is a tradition you carry that no one else in your life does?”
              </h2>
            </div>
          </div>
          <Link
            to="/feed"
            className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-white dark:bg-background text-[#c2410c] dark:text-terracotta border border-[#e1bfb5]/50 hover:bg-[#c2410c] hover:text-white transition-all text-xs font-semibold shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <span>Join Discussion</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CULTURAL CATEGORIES & DISCOVERY DIMENSIONS
          ========================================================================= */}
      <section className="w-full bg-[#faf2ee] dark:bg-card/40 py-16 border-y border-[#e7dfd5] dark:border-border/60" id="discover-categories">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#88411a] dark:text-saffron">
                Living Discovery
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1e1b19] dark:text-foreground tracking-tight mt-1">
                Curiosity across every dimension
              </h2>
              <p className="text-sm sm:text-base text-[#59413a] dark:text-muted-foreground max-w-2xl mt-1">
                Touch any dimension to discover what lies beneath the surface. Uncover origins, master techniques, and sacred geography.
              </p>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {["All Traditions", "Living Rituals", "Master Crafts", "Sacred Geography", "Oral Lore"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-[#c2410c] text-white shadow-sm"
                      : "bg-white dark:bg-card text-[#59413a] dark:text-muted-foreground border border-[#e7dfd5] dark:border-border hover:text-[#1e1b19]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Discovery Bento Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDimensions.map((dim, idx) => (
              <article
                key={idx}
                className="bg-white dark:bg-card rounded-2xl overflow-hidden border border-[#e7dfd5] dark:border-border shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dim.image}
                    alt={dim.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-card/90 backdrop-blur font-mono text-[10px] uppercase font-bold text-[#88411a] dark:text-saffron">
                    {dim.category}
                  </div>
                  <div className="absolute bottom-2 left-3 text-white font-mono text-xs drop-shadow flex items-center gap-1">
                    <MapPin className="size-3" />
                    <span>{dim.location}</span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#1e1b19] dark:text-foreground group-hover:text-[#c2410c] transition-colors leading-snug">
                      {dim.title}
                    </h3>
                    <p className="text-xs text-[#59413a] dark:text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                      {dim.description}
                    </p>
                  </div>
                  <Link
                    to={dim.link as any}
                    className="pt-2 flex items-center justify-between text-[#c2410c] dark:text-terracotta text-xs font-semibold group/link"
                  >
                    <span>{dim.cta}</span>
                    <ArrowRight className="size-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: FEATURED STORIES & COMMUNITY REELS
          ========================================================================= */}
      <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-8 py-16 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#88411a] dark:text-saffron">
              Stories from the World
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1e1b19] dark:text-foreground tracking-tight mt-1">
              Watch, Wonder & Experience Living Culture
            </h2>
            <p className="text-sm sm:text-base text-[#59413a] dark:text-muted-foreground max-w-2xl mt-1">
              Short-form cultural reels from real elders, master artisans, and community stewards. Unfiltered oral wisdom passed directly through human hands.
            </p>
          </div>
          <Link
            to="/stories"
            className="px-5 py-2.5 rounded-full bg-[#f4ece8] dark:bg-card border border-[#e7dfd5] hover:bg-[#eee7e3] transition-colors text-xs font-semibold self-start md:self-auto flex items-center gap-1.5"
          >
            <span>Explore All Stories</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reels.map((reel, idx) => (
            <Link
              key={idx}
              to="/stories"
              className="group relative rounded-2xl overflow-hidden shadow-md flex flex-col justify-end h-[380px] bg-[#1c1917] cursor-pointer border border-[#e7dfd5]/40"
            >
              <img
                src={reel.image}
                alt={reel.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              {/* Metadata Tags */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-card/90 backdrop-blur font-mono text-[10px] uppercase font-bold text-[#c2410c]">
                  {reel.duration}
                </span>
                <span className="w-8 h-8 rounded-full bg-white/80 dark:bg-card/80 backdrop-blur flex items-center justify-center text-[#1e1b19]">
                  <Play className="size-4 fill-current ml-0.5" />
                </span>
              </div>

              <div className="relative p-5 z-10 space-y-1 text-white">
                <div className="flex items-center gap-1 text-[#ffb59d] font-mono text-xs">
                  <MapPin className="size-3" />
                  <span>{reel.location}</span>
                </div>
                <h3 className="font-serif text-lg font-medium leading-tight">
                  {reel.title}
                </h3>
                <div className="pt-2 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#c2410c] text-white flex items-center justify-center text-[10px] font-bold">
                    {reel.avatarLetter}
                  </div>
                  <span className="text-xs text-white/80 font-medium">
                    {reel.custodian}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: THE EKA KNOWLEDGE ATLAS & HOW IT WORKS
          ========================================================================= */}
      <section className="w-full bg-[#f4ece8] dark:bg-card/50 py-16 border-y border-[#e7dfd5] dark:border-border/60">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#88411a] dark:text-saffron">
              The EKA Knowledge Model
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1e1b19] dark:text-foreground tracking-tight">
              Discover → Learn → Understand → Connect
            </h2>
            <p className="text-sm sm:text-base text-[#59413a] dark:text-muted-foreground">
              We turn surface curiosity into deeper human understanding without technical jargon or algorithmic noise.
            </p>
          </div>

          {/* 4 Step Sequential Process */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                label: "Curiosity Sparks",
                title: "Discover",
                desc: "See a living tradition, craft, or sacred site that catches your eye while traveling or exploring online.",
              },
              {
                num: "02",
                label: "Context & Story",
                title: "Learn",
                desc: "Hear the human story directly from verified elders and artisans, learning the ancestral lineage of why it exists.",
              },
              {
                num: "03",
                label: "Universal Truth",
                title: "Understand",
                desc: "Notice how different cultures share common human values—from gratitude for harvests to care for the dead.",
              },
              {
                num: "04",
                label: "Living Community",
                title: "Connect & Share",
                desc: "Support master makers directly, participate respectfully, and preserve your own family traditions for future generations.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-card rounded-2xl p-6 border border-[#e7dfd5] dark:border-border shadow-sm space-y-3 relative"
              >
                <span className="font-serif text-4xl text-[#c2410c] opacity-25 font-bold select-none">
                  {step.num}
                </span>
                <span className="block font-mono text-[10px] uppercase font-bold text-[#88411a] dark:text-saffron">
                  {step.label}
                </span>
                <h3 className="font-serif text-xl font-medium text-[#1e1b19] dark:text-foreground">
                  {step.title}
                </h3>
                <p className="text-xs text-[#59413a] dark:text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Real Demonstration Banner */}
          <div className="bg-white dark:bg-card rounded-2xl p-6 sm:p-8 border border-[#e7dfd5] dark:border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#fd8a42]/20 text-[#c2410c] flex items-center justify-center shrink-0">
                <Sparkles className="size-6" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-bold uppercase text-[#88411a] dark:text-saffron">
                  Demonstration Example: Step 01
                </span>
                <p className="font-serif text-lg font-medium text-[#1e1b19] dark:text-foreground mt-0.5">
                  “You notice a small clay lamp floating gently on the river at sunset...”
                </p>
                <p className="text-xs text-[#59413a] dark:text-muted-foreground mt-0.5">
                  Why do millions of families light lamps at dusk every autumn? Fire is the only element that naturally points upward.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDemoQuery("Why do millions of families light lamps at dusk every autumn?")}
              className="px-6 py-3 rounded-full bg-[#c2410c] hover:bg-[#9b2f00] text-white text-xs sm:text-sm font-semibold transition-colors shrink-0 shadow-sm active:scale-95"
            >
              Try this query
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: VERIFIED CUSTODIANS & CULTURAL PROVENANCE
          ========================================================================= */}
      <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-8 py-16 space-y-10" id="custodians">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdbd0] text-[#832600] font-mono text-[10px] font-bold uppercase mb-2">
              <ShieldCheck className="size-3.5" />
              <span>100% Real Human Heritage • Zero Synthetic Fakes</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1e1b19] dark:text-foreground tracking-tight">
              People make culture living
            </h2>
            <p className="text-sm sm:text-base text-[#59413a] dark:text-muted-foreground max-w-2xl mt-1">
              EKA is built around real community elders and certified guild artisans. We verify oral lineages at the root, ensuring custodians control how their knowledge is shared.
            </p>
          </div>
          <Link
            to={profile ? "/create" : "/membership"}
            className="px-6 py-3 rounded-full bg-[#c2410c] hover:bg-[#9b2f00] text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 self-start md:self-auto shadow-sm active:scale-95"
          >
            <PlusCircle className="size-4" />
            <span>Register as Custodian</span>
          </Link>
        </div>

        {/* 3 Verified Custodians */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              type: "Ecological Lineage",
              badge: "Verified",
              name: "Bishnoi Community Stewards",
              place: "Thar Desert, Rajasthan, India",
              desc: "For 500 years, keeping 29 sacred tenets that forbid felling green trees and protect wild blackbucks and gazelles with their own lives.",
              meta: "Lineage: 1485 CE • 84 Villages",
              link: "/community",
            },
            {
              type: "Sacred Metallurgy Guild",
              badge: "GI Certified",
              name: "Aranmula Vishwakarma Masters",
              place: "Pamba River Valley, Kerala, India",
              desc: "Eight remaining families casting GI-certified reflective bronze mirrors using secret copper-tin alloy formulas handed down verbally.",
              meta: "8 Guild Families • GI 2004",
              link: "/discover?topic=crafts",
            },
            {
              type: "Monastic Mask Guild",
              badge: "Verified",
              name: "Majuli Sattriya Mask Makers",
              place: "Brahmaputra Island, Assam, India",
              desc: "Crafting sacred theatre masks from river clay, bamboo, and cow dung in living river-island monasteries since the 15th-century Bhakti revival.",
              meta: "Samaguri Satra • 6 Generations",
              link: "/community",
            },
          ].map((cust, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-card rounded-2xl p-6 border border-[#e7dfd5] dark:border-border shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-[#f4ece8] dark:bg-accent text-[#59413a] dark:text-muted-foreground font-mono text-[10px] uppercase font-bold">
                    {cust.type}
                  </span>
                  <div className="flex items-center gap-1 text-[#88411a] dark:text-saffron">
                    <CheckCircle2 className="size-3.5 text-[#c2410c]" />
                    <span className="font-mono text-[10px] font-bold">{cust.badge}</span>
                  </div>
                </div>
                <h3 className="font-serif text-xl font-medium text-[#1e1b19] dark:text-foreground">
                  {cust.name}
                </h3>
                <p className="font-mono text-xs text-[#c2410c] dark:text-terracotta font-medium">
                  {cust.place}
                </p>
                <p className="text-xs text-[#59413a] dark:text-muted-foreground leading-relaxed">
                  {cust.desc}
                </p>
              </div>
              <div className="pt-4 border-t border-[#f4ece8] dark:border-border flex items-center justify-between text-[#59413a] dark:text-muted-foreground text-xs">
                <span>{cust.meta}</span>
                <Link
                  to={cust.link as any}
                  className="text-[#c2410c] dark:text-terracotta hover:underline font-semibold flex items-center gap-0.5"
                >
                  <span>Profile</span>
                  <ChevronRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Community Invoking Canvas */}
        <div
          className="relative rounded-3xl overflow-hidden bg-[#1c1917] text-white p-8 sm:p-12 text-center shadow-xl border border-border/40"
          id="contribute-story"
        >
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#ffb59d] font-bold">
              One Within • One With All
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white">
              Your story belongs here.
            </h2>
            <p className="font-serif text-base sm:text-lg text-white/80 leading-relaxed">
              Your family’s recipe. Your village festival. Your craft lineage. Your local memory. Share it with a global community that treasures genuine human heritage.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <Link
                to={profile ? "/create" : "/membership"}
                className="px-8 py-3 rounded-full bg-[#c2410c] hover:bg-[#9b2f00] text-white text-xs sm:text-sm font-semibold transition-colors shadow-lg active:scale-95"
              >
                Record Family Heritage
              </Link>
              <Link
                to="/insights"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                Oral History Guidelines
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: EXPLORE BY DESTINATION & LINEAGE INDEX
          ========================================================================= */}
      <section className="w-full bg-[#faf2ee] dark:bg-card/40 py-16 border-t border-[#e7dfd5] dark:border-border/60">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 space-y-8">
          <div className="space-y-1">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#88411a] dark:text-saffron">
              Geographic & Cultural Index
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1e1b19] dark:text-foreground tracking-tight">
              Explore by Destination & Lineage
            </h2>
            <p className="text-sm sm:text-base text-[#59413a] dark:text-muted-foreground max-w-2xl">
              Dynamic cultural topography spanning sacred confluences, craft villages, and living global traditions.
            </p>
          </div>

          {/* Region Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                title: "North & Central India",
                places: ["Varanasi", "Prayagraj", "Jaipur", "Ayodhya", "Ujjain", "Amritsar"],
              },
              {
                title: "East & Northeast",
                places: ["Kolkata", "Majuli Island", "Puri", "Guwahati", "Bhubaneswar", "Shillong"],
              },
              {
                title: "South India",
                places: ["Madurai", "Thanjavur", "Aranmula", "Kochi", "Kanchipuram", "Hampi"],
              },
              {
                title: "West India",
                places: ["Bhuj & Kutch", "Patan", "Ahmedabad", "Nashik", "Pandharpur", "Udaipur"],
              },
              {
                title: "Global Lineages",
                places: ["Kyoto", "Fez", "Oaxaca", "Mount Athos", "Kathmandu", "Cusco"],
              },
            ].map((reg, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-card p-5 rounded-2xl border border-[#e7dfd5] dark:border-border shadow-sm space-y-3"
              >
                <h3 className="font-serif text-base font-medium text-[#1e1b19] dark:text-foreground">
                  {reg.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {reg.places.map((place) => (
                    <button
                      key={place}
                      type="button"
                      onClick={() => {
                        navigate({ to: "/discover", search: { q: place } as any });
                      }}
                      className="px-2.5 py-1 rounded-full bg-[#f4ece8] dark:bg-accent text-[#59413a] dark:text-muted-foreground hover:bg-[#c2410c] hover:text-white font-mono text-[11px] transition-colors"
                    >
                      {place}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Exploration Pills across Cultural Themes */}
          <div className="pt-4 space-y-3">
            <span className="font-mono text-[10px] font-bold uppercase text-[#59413a] dark:text-muted-foreground">
              Explore by Cultural Category:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                "Sacred Rituals",
                "Master Crafts & GI Guilds",
                "Temple Prasadam & Foodways",
                "Living Chants & Vedic Sound",
                "Community Forest Sanctuaries",
                "Indigenous Navigation",
                "Seasonal Equinox Rites",
              ].map((pill) => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => {
                    navigate({ to: "/discover", search: { topic: pill.toLowerCase() } as any });
                  }}
                  className="px-4 py-1.5 rounded-full bg-white dark:bg-card border border-[#e7dfd5] dark:border-border text-xs text-[#59413a] dark:text-muted-foreground hover:bg-[#c2410c] hover:text-white transition-all shadow-2xs"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE KNOWLEDGE SYNTHESIS MODAL (ASK EKA)
          ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 border border-[#e7dfd5] dark:border-border animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-6 text-[#c2410c]" />
                <span className="font-serif text-xl font-normal text-[#1e1b19] dark:text-foreground">
                  Ask EKA • Knowledge Synthesis
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#f4ece8] dark:hover:bg-accent flex items-center justify-center text-[#59413a] dark:text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 bg-[#faf2ee] dark:bg-accent/40 rounded-2xl space-y-1 border border-[#e1bfb5]/30">
              <span className="font-mono text-[10px] font-bold text-[#88411a] dark:text-saffron uppercase">
                Inquiry
              </span>
              <p className="font-serif text-lg font-medium text-[#1e1b19] dark:text-foreground">
                “{modalInquiry}”
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-[#59413a] dark:text-muted-foreground">
                Living Synthesis • Verified Human Sources
              </span>
              <p className="text-sm text-[#1e1b19] dark:text-foreground/90 leading-relaxed">
                In Vedic cosmology and folk practice across the Indian subcontinent, dusk (Sandhya) marks the threshold between solar diurnal order and nightly dissolution. Fire (Agni) is the sole earthly element whose flame always climbs vertically regardless of angle, symbolizing consciousness offering itself back upward to its universal source.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-[#59413a] dark:text-muted-foreground border-t border-[#f4ece8] dark:border-border">
              <span className="truncate max-w-[240px]">
                Verified by: Pt. R. Shastry • Varanasi Sanskrit University
              </span>
              <button
                onClick={() => {
                  setModalOpen(false);
                  navigate({ to: "/ask", search: { q: modalInquiry, mode: "canon" } });
                }}
                className="px-4 py-1.5 rounded-full bg-[#c2410c] hover:bg-[#9b2f00] text-white text-xs font-semibold shadow-xs"
              >
                Deep Dive →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
