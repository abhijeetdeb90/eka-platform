import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Globe,
  Users,
  Compass,
  Sparkles,
  Landmark,
  Sun,
  MapPin,
  ShoppingBag,
  Feather,
  Award,
  BookOpen,
  Scroll,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CONNECTION_DOMAINS,
  EKA_KNOWLEDGE_PIPELINE,
  type ConnectionDomain,
} from "@/lib/founder-data";

export function AboutEkaVisualSection() {
  const [selectedDomain, setSelectedDomain] = useState<ConnectionDomain | null>(null);

  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case "Globe":
        return Globe;
      case "Users":
        return Users;
      case "Compass":
        return Compass;
      case "Sparkles":
        return Sparkles;
      case "Landmark":
        return Landmark;
      case "Sun":
        return Sun;
      case "MapPin":
        return MapPin;
      case "ShoppingBag":
        return ShoppingBag;
      case "Feather":
        return Feather;
      case "Award":
        return Award;
      case "BookOpen":
        return BookOpen;
      case "Scroll":
        return Scroll;
      case "Activity":
      default:
        return Activity;
    }
  };

  return (
    <section className="border-b border-border/70 bg-sand/30 py-20 lg:py-28">
      <div className="container-eka">
        {/* Editorial Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="border-terracotta/40 bg-terracotta/5 text-terracotta text-xs uppercase tracking-[0.2em]"
          >
            System Architecture
          </Badge>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl text-foreground">
            About EKA: The Architecture of Memory
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
            AD should not need to explain EKA from scratch every time. EKA is engineered as an
            objective, trusted intelligence layer for human culture, sacred traditions, and
            localized living wisdom.
          </p>
        </div>

        {/* 2-Column Core Explanation Grid: What is EKA & Why EKA */}
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Card 1: What is EKA? */}
          <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 sm:p-10 shadow-calm">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-saffron/10 blur-2xl"
            />
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-terracotta font-medium">
              <span className="size-2 rounded-full bg-terracotta" />
              <span>Definition</span>
            </div>
            <h3 className="mt-3 font-display text-2xl sm:text-3xl text-foreground">What is EKA?</h3>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground font-light">
              EKA is being built as a{" "}
              <strong className="font-medium text-foreground">
                trusted intelligence layer for cultures, communities and local knowledge
              </strong>{" "}
              — connecting authentic wisdom, people, places, traditions, creators and living
              practices into an open, verifiable human context graph.
            </p>
            <div className="mt-6 space-y-3 border-t border-border/60 pt-6 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-forest mt-0.5" />
                <span>
                  <strong>Not a generic social feed:</strong> Replaces algorithmic outrage with
                  quiet contemplation and epistemic source verification.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-forest mt-0.5" />
                <span>
                  <strong>Not a static encyclopedia:</strong> Connects philosophy directly to daily
                  practice rhythms (sadhana) and living Sanghas.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-forest mt-0.5" />
                <span>
                  <strong>Enterprise Ground Truth:</strong> Acts as the foundational bias-free
                  cultural grounding layer for artificial intelligence.
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Why EKA? */}
          <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 sm:p-10 shadow-calm">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-12 -right-12 size-48 rounded-full bg-forest/10 blur-2xl"
            />
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-forest font-medium">
              <span className="size-2 rounded-full bg-forest" />
              <span>The Civilizational Need</span>
            </div>
            <h3 className="mt-3 font-display text-2xl sm:text-3xl text-foreground">Why EKA?</h3>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground font-light">
              Important cultural and local knowledge is currently fragmented across elderly lineage
              keepers, regional dialects, decaying manuscripts, and chaotic social platforms
              optimized for outrage.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              EKA organizes this civilizational heritage into an epistemic system where individuals,
              scholars, and communities can participate with dignity.
            </p>

            <div className="mt-6 rounded-2xl border border-border/70 bg-sand/40 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                The 7-Stage Epistemic Cycle:
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs font-medium text-foreground">
                <span className="rounded-md bg-card px-2.5 py-1 border border-border/60">
                  Source
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="rounded-md bg-card px-2.5 py-1 border border-border/60">
                  Verify
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="rounded-md bg-card px-2.5 py-1 border border-border/60">
                  Contextualize
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="rounded-md bg-card px-2.5 py-1 border border-border/60">
                  Learn
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="rounded-md bg-card px-2.5 py-1 border border-border/60">
                  Discuss
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="rounded-md bg-card px-2.5 py-1 border border-border/60">
                  Create
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="rounded-md bg-primary text-primary-foreground px-2.5 py-1 shadow-xs">
                  Preserve
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Step Knowledge Flow Breakdown */}
        <div className="mt-14 rounded-3xl border border-border/80 bg-card p-8 sm:p-10 shadow-calm">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
              The Engine
            </p>
            <h3 className="mt-1 font-display text-2xl sm:text-3xl text-foreground">
              The Seven Steps of Cultural Epistemology
            </h3>
            <p className="mt-2 text-sm text-muted-foreground font-light">
              How messy human narratives transform into immutable, verified civilizational
              intelligence:
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
            {EKA_KNOWLEDGE_PIPELINE.map((p, idx) => (
              <div
                key={p.step}
                className="relative rounded-2xl border border-border/70 bg-sand/20 p-4 transition-all hover:bg-card hover:border-primary/50 hover:shadow-calm"
              >
                <div className="font-display text-xs font-semibold text-terracotta">{p.step}</div>
                <h4 className="mt-2 font-display text-sm font-medium text-foreground">{p.title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground font-light">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What EKA Connects: 13 Visual Domain Cards */}
        <div className="mt-20">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-terracotta font-semibold">
                Dynamic Ontology
              </p>
              <h3 className="mt-2 font-display text-3xl sm:text-4xl text-foreground">
                What EKA Connects
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl font-light">
                Explore the 13 distinct cultural dimensions networked within EKA's Human Context
                Graph:
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-forest" />
              <span>Multi-Lineage Grounded Entities</span>
            </div>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {CONNECTION_DOMAINS.map((domain) => {
              const Icon = getDomainIcon(domain.iconName);
              return (
                <div
                  key={domain.id}
                  data-testid={`domain-${domain.id}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedDomain(domain)}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedDomain(domain)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-calm transition-all duration-300 hover:border-primary/50 hover:shadow-lift"
                >
                  <div className="relative mb-4 h-36 w-full overflow-hidden rounded-xl border border-border/60">
                    <img
                      src={domain.image}
                      alt={domain.name}
                      className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 right-2.5 rounded-full bg-background/85 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-foreground backdrop-blur-md border border-border/60">
                      {domain.badge}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-sand/60 p-1.5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="size-4" />
                    </div>
                    <h4 className="font-display text-base font-medium text-foreground group-hover:text-primary transition-colors">
                      {domain.name}
                    </h4>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground font-light line-clamp-2">
                    {domain.shortDesc}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-[11px] text-terracotta font-medium">
                    <span>Inspect Graph Nodes</span>
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Domain Detail Modal */}
      <Dialog open={!!selectedDomain} onOpenChange={(open) => !open && setSelectedDomain(null)}>
        {selectedDomain && (
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border-border bg-card p-4 sm:p-6">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs uppercase tracking-wider">
                  {selectedDomain.badge}
                </Badge>
                <span className="text-xs text-muted-foreground">EKA Ontology Domain</span>
              </div>
              <DialogTitle className="mt-2 font-display text-2xl">
                {selectedDomain.name}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {selectedDomain.shortDesc}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div className="overflow-hidden rounded-xl border border-border/80 h-48">
                <img
                  src={selectedDomain.image}
                  alt={selectedDomain.name}
                  className="size-full object-cover"
                />
              </div>

              <div className="rounded-xl border border-border/70 bg-sand/30 p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Active Real-World Examples in EKA:
                </div>
                <p className="mt-1.5 text-sm text-foreground font-light leading-relaxed">
                  {selectedDomain.example}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedDomain(null)}
                  className="min-h-[44px]"
                >
                  Close Domain
                </Button>
                <Button asChild className="min-h-[44px]">
                  <Link to="/join">Explore this Domain on EKA</Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
