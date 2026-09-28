import React from "react";
import { GitBranch, MapPin, BookOpen, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CulturalVariation } from "@/lib/knowledge/knowledge-object";

interface CulturalVariationSectionProps {
  variations: CulturalVariation[];
  entityName: string;
  className?: string;
}

export function CulturalVariationSection({
  variations,
  entityName,
  className = "",
}: CulturalVariationSectionProps) {
  if (!variations || variations.length === 0) return null;

  return (
    <section
      data-testid="eka-cultural-variations-section"
      className={`rounded-3xl border border-primary/20 bg-card p-6 shadow-calm sm:p-8 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <GitBranch className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Documented Variations: Beyond the Monolith
            </h3>
            <Badge variant="outline" className="border-primary/40 text-primary">
              {variations.length} Variations Documented
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Culture is not a singular flat narrative. EKA records the divergent regional rituals,
            community expressions, and historical lineages that make {entityName} a living plural ecosystem.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {variations.map((v) => (
          <div
            key={v.id}
            id={v.id}
            data-testid={`variation-card-${v.id}`}
            className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-sand/15 p-5 transition-all hover:border-primary/40 hover:bg-sand/30"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant="secondary"
                  className="text-[10px] uppercase font-semibold tracking-wider"
                >
                  {v.dimension} variation
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>{v.regionOrGroup}</span>
                </div>
              </div>

              <h4 className="mt-3 font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {v.label}
              </h4>

              <div className="mt-3 space-y-2">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Distinct Practice
                  </span>
                  <p className="mt-0.5 text-sm text-foreground leading-relaxed">
                    {v.distinctPractice}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Cultural Significance
                  </span>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {v.significance}
                  </p>
                </div>

                {v.associatedFoodOrObjects.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Utensils className="h-3 w-3" /> Associated Objects & Foodways
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {v.associatedFoodOrObjects.map((item, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="bg-background/80 text-[11px] font-normal"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5 text-primary/70 shrink-0" />
              <span className="truncate">Sources: {v.sources.join("; ")}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
