import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  ArrowRight,
  Sparkles,
  BookOpen,
  Orbit,
  Heart,
  Users,
  Film,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Flame,
  CheckCircle2,
  Share2,
  ShieldCheck,
  Utensils,
  Languages,
  PenTool,
  Layers,
  HelpCircle,
  Eye,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import heroImage from "@/assets/hero.jpg";
import ritualLamp from "@/assets/ritual-lamp.jpg";
import kyotoImage from "@/assets/places/kyoto.jpg";
import marrakeshImage from "@/assets/places/marrakesh.jpg";
import varanasiImage from "@/assets/places/varanasi.jpg";
import kolkataImage from "@/assets/places/kolkata.jpg";
import monasteryCorridor from "@/assets/monastery-corridor.jpg";
import stillWater from "@/assets/still-water.jpg";
import todayReflection from "@/assets/today-reflection.jpg";
import readingTable from "@/assets/reading-table.jpg";
import journeyImage from "@/assets/journey.jpg";
import observeImage from "@/assets/observe.jpg";

// ==============================================================================
// 1. SCREEN 3: 8 IMAGE-LED DISCOVERY CATEGORIES
// ==============================================================================
const DISCOVERY_CATEGORIES = [
  {
    id: "cat-traditions",
    label: "Traditions",
    question: "Why does the sunrise aarti return fire to the river?",
    image: ritualLamp,
    route: "/stories",
    location: "Varanasi, India",
  },
  {
    id: "cat-cultures",
    label: "Cultures",
    question: "How do tea masters turn hospitality into quiet meditation?",
    image: kyotoImage,
    route: "/discover",
    location: "Kyoto, Japan",
  },
  {
    id: "cat-communities",
    label: "Communities",
    question: "How do the Bishnoi protect desert wildlife as family?",
    image: stillWater,
    route: "/discover",
    location: "Rajasthan, India",
  },
  {
    id: "cat-places",
    label: "Places",
    question: "What makes river confluences sacred to wandering pilgrims?",
    image: varanasiImage,
    route: "/junction",
    location: "Prayagraj, India",
  },
  {
    id: "cat-people",
    label: "People",
    question: "Meet the eighth-generation bell-metal mirror masters.",
    image: monasteryCorridor,
    route: "/observe",
    location: "Aranmula, Kerala",
  },
  {
    id: "cat-languages",
    label: "Languages",
    question: "How do ancient chants preserve astronomy without paper?",
    image: readingTable,
    route: "/learn",
    location: "South & Central Asia",
  },
  {
    id: "cat-food",
    label: "Foodways",
    question: "Why is temple prasadam cooked only on earthen woodfire?",
    image: kolkataImage,
    route: "/stories",
    location: "Puri, Odisha",
  },
  {
    id: "cat-crafts",
    label: "Crafts",
    question: "How do Moroccan weavers remember patterns without drawings?",
    image: marrakeshImage,
    route: "/discover",
    location: "High Atlas, Morocco",
  },
];

// ==============================================================================
// 2. SCREEN 4: KNOWLEDGE MODEL CASE STUDY STEPS
// ==============================================================================
const KNOWLEDGE_STEPS = [
  {
    step: "01",
    id: "step-discover",
    title: "Discover",
    summary: "Curiosity Sparks",
    shortText: "See a living tradition that catches your eye.",
    casePrompt: "You notice a small clay lamp floating gently on the river at sunset.",
    curiosityQuestion: "Why do millions of families light lamps at dusk every autumn?",
  },
  {
    step: "02",
    id: "step-learn",
    title: "Learn",
    summary: "Context & Story",
    shortText: "Hear the human story directly from the community.",
    casePrompt: "You listen to the evening chants along Dashashwamedh Ghat.",
    curiosityQuestion: "For 1,200 years, the five elements are offered back to the water as living gratitude.",
  },
  {
    step: "03",
    id: "step-understand",
    title: "Understand",
    summary: "Universal Truth",
    shortText: "Notice how different cultures share common human values.",
    casePrompt: "You connect this ritual to global traditions of sacred light.",
    curiosityQuestion: "From Olympic fires in Greece to Celtic winter hearths, fire is reverence, not fear.",
  },
  {
    step: "04",
    id: "step-connect",
    title: "Connect",
    summary: "Living Community",
    shortText: "Support master makers and share your own family traditions.",
    casePrompt: "You join a quiet contemplation circle and support traditional potters.",
    curiosityQuestion: "You discover: we are all custodians of the world's shared memory.",
  },
];

// ==============================================================================
// 3. SCREEN 5: FROM ONE PLACE TO ANOTHER (Animated Journey)
// ==============================================================================
const JOURNEY_STOPS = [
  {
    id: "step-india",
    step: 1,
    place: "India",
    location: "Varanasi, Uttar Pradesh",
    coords: "25.3176° N, 82.9739° E",
    storyTitle: "Light on the Water",
    question: "Why do millions of people light lamps at dusk?",
    insight:
      "Fire is the only element that naturally points upward. Offering a clay diya to the river signifies returning the gift of life to the source.",
    image: ritualLamp,
    route: "/stories",
  },
  {
    id: "step-nepal",
    step: 2,
    place: "Nepal",
    location: "Kathmandu Valley",
    coords: "27.7172° N, 85.3240° E",
    storyTitle: "Wind of Compassion",
    question: "Why do prayer flags stay outdoors until they fray?",
    insight:
      "When the cotton dissolves into threads in mountain rain, the sacred blessings are believed to become part of the air all beings breathe.",
    image: monasteryCorridor,
    route: "/junction",
  },
  {
    id: "step-japan",
    step: 3,
    place: "Japan",
    location: "Kyoto & Nara",
    coords: "35.0116° N, 135.7681° E",
    storyTitle: "The Sacred Boundary",
    question: "Why are Torii gates painted vermilion?",
    insight:
      "Vermilion wardens against rot in sacred cedar wood, marking the exact threshold where human ambition yields to quiet contemplation.",
    image: kyotoImage,
    route: "/discover",
  },
  {
    id: "step-indonesia",
    step: 4,
    place: "Indonesia",
    location: "Bali Terraces",
    coords: "8.3405° S, 115.0920° E",
    storyTitle: "Water Consensus",
    question: "Why do priests manage mountain canals?",
    insight:
      "Water distribution is a spiritual trust. Farmers meet monthly at water temples to ensure every neighbor receives equal harvest water.",
    image: stillWater,
    route: "/discover",
  },
  {
    id: "step-morocco",
    step: 5,
    place: "Morocco",
    location: "Fez Medina",
    coords: "34.0181° N, 5.0078° W",
    storyTitle: "Geometry in Stone",
    question: "How does zellige tilework mirror the infinite?",
    insight:
      "Every tile is cut by hand with heavy iron chisels. Patterns repeat into infinity without a single focal portrait, honoring symmetry.",
    image: marrakeshImage,
    route: "/discover",
  },
  {
    id: "step-mexico",
    step: 6,
    place: "Mexico",
    location: "Oaxaca Valley",
    coords: "17.0732° N, 96.7266° W",
    storyTitle: "Celebration of Reunion",
    question: "Why are marigolds scattered on doorsteps?",
    insight:
      "The scent and golden glow of cempasúchil flowers guide ancestral spirits safely back to their family hearth for one night of music and remembrance.",
    image: todayReflection,
    route: "/stories",
  },
];

// ==============================================================================
// 4. SCREEN 6: REAL CUSTODIANS & LIVING COMMUNITIES
// ==============================================================================
const LIVING_CUSTODIANS = [
  {
    id: "cust-1",
    name: "Bishnoi Community Stewards",
    role: "Ecological Lineage",
    location: "Thar Desert, Rajasthan",
    bio: "For 500 years, keeping 29 tenets that forbid felling green trees and protect wild deer with their own lives.",
    image: stillWater,
  },
  {
    id: "cust-2",
    name: "Aranmula Vishwakarma Masters",
    role: "Sacred Metallurgy Guild",
    location: "Pamba Valley, Kerala",
    bio: "Eight remaining families casting GI-certified reflective bronze mirrors using secret copper-tin alloy formulas.",
    image: monasteryCorridor,
  },
  {
    id: "cust-3",
    name: "Majuli Sattriya Mask Makers",
    role: "Monastic Craft Preservers",
    location: "Brahmaputra River, Assam",
    bio: "Crafting sacred theatre masks from river clay, bamboo, and cow dung in living river-island monasteries.",
    image: todayReflection,
  },
];

export function DiscoveryJourney() {
  const [activeKnowledgeStep, setActiveKnowledgeStep] = useState(0);
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);
  const [isPlayingTour, setIsPlayingTour] = useState(false);

  // Auto-tour for the 6 journey stops
  useEffect(() => {
    if (!isPlayingTour) return;
    const timer = setInterval(() => {
      setActiveJourneyStep((prev) => (prev + 1) % JOURNEY_STOPS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlayingTour]);

  const currentJourney = JOURNEY_STOPS[activeJourneyStep]!;
  const currentModelStep = KNOWLEDGE_STEPS[activeKnowledgeStep]!;

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ==================================================================== */}
      {/* SCREEN 2: THE WORLD IS MORE THAN WHAT YOU SEE */}
      {/* ==================================================================== */}
      <section className="container-eka">
        <div className="relative rounded-3xl overflow-hidden border border-border/80 bg-gradient-to-br from-card via-sand/20 to-card p-8 sm:p-14 lg:p-16 shadow-calm">
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-mono uppercase tracking-widest font-semibold">
              <Eye className="size-3.5" />
              <span>Way of Seeing</span>
            </span>

            <h2 className="font-display font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-[1.1]">
              The world is more than <br className="hidden sm:inline" />
              what you see on a map.
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
              Every country is not just a border. It is a home of songs, meals cooked at dawn, crafts passed across generations, and sacred questions asked by people just like you.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link to="/discover">
                <Button className="rounded-xl px-6 py-5 bg-terracotta hover:bg-terracotta/90 text-white text-xs font-mono tracking-wider uppercase gap-2 shadow-xs">
                  <span>Explore Cultural Stories</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
              <span className="text-xs font-mono text-muted-foreground">
                One Within. One With All.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SCREEN 3: DISCOVER (Image-Led Cards across 8 Categories) */}
      {/* ==================================================================== */}
      <section className="container-eka space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-terracotta font-semibold flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-saffron" />
              Living Discovery
            </span>
            <h2 className="font-display font-serif text-2xl sm:text-4xl font-normal mt-1">
              Curiosity across every dimension
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-light mt-1">
              Touch any card to discover what lies beneath the surface.
            </p>
          </div>

          <Link
            to="/discover"
            className="text-xs font-mono text-terracotta hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>See all categories</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* 8 Category Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DISCOVERY_CATEGORIES.map((item) => (
            <Link
              key={item.id}
              to={item.route}
              className="group block relative rounded-2xl overflow-hidden border border-border/80 bg-card hover:shadow-lift transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                
                {/* Category Pill */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono uppercase tracking-wider text-amber-200">
                  {item.label}
                </div>

                {/* Location */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs font-mono">
                  <span className="flex items-center gap-1 truncate text-[11px]">
                    <MapPin className="size-3 text-saffron shrink-0" />
                    {item.location}
                  </span>
                  <ArrowRight className="size-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-amber-300" />
                </div>
              </div>

              {/* Inquiry Hook */}
              <div className="p-4 space-y-2">
                <p className="text-xs sm:text-sm font-medium text-foreground group-hover:text-terracotta transition-colors leading-snug">
                  {item.question}
                </p>
                <span className="text-[11px] font-mono text-muted-foreground group-hover:text-foreground inline-flex items-center gap-1">
                  <span>Explore</span>
                  <ChevronRight className="size-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SCREEN 4: UNDERSTAND (Interactive EKA Knowledge Model) */}
      {/* ==================================================================== */}
      <section className="container-eka">
        <div className="rounded-3xl border border-border/80 bg-sand/15 p-8 sm:p-14 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-terracotta font-semibold">
              The EKA Knowledge Model
            </span>
            <h2 className="font-display font-serif text-3xl sm:text-4xl font-normal text-foreground">
              Discover → Learn → Understand → Connect
            </h2>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              We turn surface curiosity into deeper human understanding without technical jargon. Tap each step to see how it works in real life.
            </p>
          </div>

          {/* Interactive Step Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {KNOWLEDGE_STEPS.map((k, idx) => {
              const isSelected = idx === activeKnowledgeStep;
              return (
                <button
                  key={k.id}
                  onClick={() => setActiveKnowledgeStep(idx)}
                  className={`text-left rounded-2xl border p-5 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-terracotta bg-card shadow-calm ring-2 ring-terracotta/20"
                      : "border-border/80 bg-card/60 hover:bg-card hover:border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`size-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                        isSelected
                          ? "bg-terracotta text-white"
                          : "bg-sand text-muted-foreground"
                      }`}
                    >
                      {k.step}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">
                      {k.summary}
                    </span>
                  </div>
                  <h3 className="font-display font-serif text-lg font-normal text-foreground">
                    {k.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">
                    {k.shortText}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Unfolded Real-World Demonstration Card */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono text-terracotta uppercase tracking-wider">
              <Sparkles className="size-3.5 text-saffron" />
              <span>Step {currentModelStep.step} Demonstration: {currentModelStep.title}</span>
            </div>

            <h4 className="font-display font-serif text-xl sm:text-2xl font-normal text-foreground">
              {currentModelStep.casePrompt}
            </h4>

            <div className="p-3.5 rounded-xl bg-sand/30 border border-border/80 text-xs sm:text-sm text-foreground flex items-start gap-2.5">
              <HelpCircle className="size-4 text-saffron shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">
                {currentModelStep.curiosityQuestion}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SCREEN 5: FROM ONE PLACE TO ANOTHER (Animated Journey) */}
      {/* ==================================================================== */}
      <section className="container-eka space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-terracotta font-semibold flex items-center gap-1.5">
              <Orbit className="size-3.5 text-saffron" />
              The Connected Journey
            </span>
            <h2 className="font-display font-serif text-2xl sm:text-4xl font-normal mt-1">
              From one place to another
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-light mt-1">
              Follow the living thread connecting six cultures across continents.
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsPlayingTour((prev) => !prev)}
            className="rounded-xl px-4 text-xs font-mono gap-1.5 self-start sm:self-auto"
          >
            {isPlayingTour ? (
              <>
                <Pause className="size-3 text-saffron" />
                <span>Pause Auto Journey</span>
              </>
            ) : (
              <>
                <Play className="size-3 text-saffron" />
                <span>Play Journey</span>
              </>
            )}
          </Button>
        </div>

        {/* Step Indicator Rail */}
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
          {JOURNEY_STOPS.map((stop, idx) => (
            <button
              key={stop.id}
              onClick={() => {
                setActiveJourneyStep(idx);
                setIsPlayingTour(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-2 ${
                idx === activeJourneyStep
                  ? "bg-terracotta text-white shadow-xs font-medium"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="size-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                {stop.step}
              </span>
              <span>{stop.place}</span>
            </button>
          ))}
        </div>

        {/* Selected Step Card */}
        <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-calm grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
          {/* Image Canvas */}
          <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto lg:h-[420px] w-full overflow-hidden bg-neutral-900">
            <img
              src={currentJourney.image}
              alt={currentJourney.storyTitle}
              className="w-full h-full object-cover transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent lg:hidden" />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-mono">
              Stop 0{currentJourney.step} of 06 • {currentJourney.place}
            </div>
            <div className="absolute bottom-4 left-4 text-[10px] font-mono text-white/70 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md">
              {currentJourney.coords}
            </div>
          </div>

          {/* Context & Wonder */}
          <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-mono text-terracotta uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {currentJourney.location}
              </span>
              <h3 className="font-display font-serif text-2xl sm:text-3xl font-normal text-foreground">
                {currentJourney.storyTitle}
              </h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-sand/30 border border-border/80 flex items-start gap-2.5">
              <HelpCircle className="size-4 text-saffron shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-medium text-foreground leading-snug">
                {currentJourney.question}
              </p>
            </div>

            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              {currentJourney.insight}
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Link to={currentJourney.route}>
                <Button className="rounded-xl px-6 py-5 bg-terracotta hover:bg-terracotta/90 text-white text-xs font-mono tracking-wider uppercase gap-2 shadow-xs">
                  <span>Explore this story</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>

              {activeJourneyStep < JOURNEY_STOPS.length - 1 ? (
                <button
                  onClick={() => setActiveJourneyStep((prev) => prev + 1)}
                  className="text-xs font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <span>Next: {JOURNEY_STOPS[activeJourneyStep + 1]?.place}</span>
                  <ChevronRight className="size-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setActiveJourneyStep(0)}
                  className="text-xs font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <span>Restart at India</span>
                  <ChevronRight className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SCREEN 6: PEOPLE MAKE CULTURE LIVING (Human / Community Layer) */}
      {/* ==================================================================== */}
      <section className="container-eka space-y-8">
        <div className="border-b border-border/70 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-forest font-semibold flex items-center gap-1.5">
              <Users className="size-3.5" />
              Living Traditions
            </span>
            <span className="text-border">•</span>
            <span className="text-[10px] font-mono uppercase text-muted-foreground">
              Documented Public Cultural Lineages
            </span>
          </div>
          <h2 className="font-display font-serif text-2xl sm:text-4xl font-normal mt-1">
            People make culture living
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-light mt-1 max-w-2xl">
            EKA is built around real people and real communities. AI assists research behind the scenes, but NEVER appears as fake creators, fake members or bot accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LIVING_CUSTODIANS.map((cust) => (
            <div
              key={cust.id}
              className="rounded-2xl border border-border/80 bg-card p-6 space-y-4 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-neutral-900 border border-border/60">
                  <img
                    src={cust.image}
                    alt={cust.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-mono">
                    {cust.role}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-serif text-lg font-normal text-foreground">
                    {cust.name}
                  </h3>
                  <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                    <MapPin className="size-3 text-terracotta" />
                    {cust.location}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {cust.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-muted-foreground">Public Documentation</span>
                <Link
                  to="/discover"
                  className="text-terracotta hover:underline inline-flex items-center gap-1"
                >
                  <span>Learn more</span>
                  <ChevronRight className="size-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SCREEN 7: YOUR WORLD IS WAITING + CREATOR INVITATION */}
      {/* ==================================================================== */}
      <section className="container-eka">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white p-8 sm:p-14 lg:p-16 text-center space-y-8 shadow-lift relative overflow-hidden">
          {/* Subtle Atmospheric Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-200 text-xs font-mono tracking-widest uppercase">
              <Sparkles className="size-3 text-saffron" />
              <span>One Within. One With All.</span>
            </span>

            <h2 className="font-display font-serif text-3xl sm:text-5xl font-normal leading-tight text-white">
              Your story belongs here.
            </h2>

            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">
              Your family's recipe. Your village festival. Your craft. Your local memory. Share it with a global community that treasures real human culture.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/discover">
              <Button
                size="lg"
                className="rounded-2xl px-8 py-6 bg-terracotta hover:bg-terracotta/90 text-white font-medium text-xs font-mono tracking-wider uppercase gap-2 shadow-calm"
              >
                <span>EXPLORE EKA</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            <Link to="/create">
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl px-8 py-6 border-white/30 bg-black/40 backdrop-blur-md text-white hover:bg-white/20 font-medium text-xs font-mono tracking-wider uppercase gap-2"
              >
                <span>Create on EKA</span>
              </Button>
            </Link>

            <Link to="/join">
              <Button
                size="lg"
                variant="ghost"
                className="rounded-2xl px-6 py-6 text-white/80 hover:text-white hover:bg-white/10 font-medium text-xs font-mono tracking-wider uppercase"
              >
                <span>Join the Community</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
