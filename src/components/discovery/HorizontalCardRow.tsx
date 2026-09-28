import React, { useRef, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EkaBaseCard } from "./EkaBaseCard";
import type { EkaDiscoveryCard } from "@/lib/homepage-data";

interface HorizontalCardRowProps {
  id: string;
  badge: string;
  title: string;
  description?: string;
  cards: EkaDiscoveryCard[];
  onInspectCard: (card: EkaDiscoveryCard) => void;
  viewAllLink?: string;
  viewAllText?: string;
  className?: string;
}

export function HorizontalCardRow({
  id,
  badge,
  title,
  description,
  cards,
  onInspectCard,
  viewAllLink,
  viewAllText = "Explore All",
  className = "",
}: HorizontalCardRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [cards]);

  const scrollByAmount = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id={id} className={`py-12 sm:py-16 ${className}`}>
      <div className="container-eka">
        {/* Header & Controls */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-1 text-xs tracking-[0.2em] text-terracotta uppercase">
              <span className="size-1.5 rounded-full bg-terracotta" />
              <span>{badge}</span>
            </div>
            <h2 className="mt-2.5 font-display text-2xl sm:text-3xl lg:text-4xl text-foreground">
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-sm text-muted-foreground font-light max-w-2xl">
                {description}
              </p>
            )}
          </div>

          {/* Desktop Arrow Controls & View All */}
          <div className="flex items-center gap-2.5">
            {viewAllLink && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex text-xs text-muted-foreground hover:text-foreground"
              >
                <Link to={viewAllLink}>
                  <span>{viewAllText}</span>
                  <ArrowRight className="ml-1.5 size-3.5" />
                </Link>
              </Button>
            )}

            <div className="hidden sm:flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollByAmount("left")}
                disabled={!canScrollLeft}
                aria-label={`Scroll ${title} carousel left`}
                className="size-10 rounded-xl border-border/80 bg-card disabled:opacity-30"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollByAmount("right")}
                disabled={!canScrollRight}
                aria-label={`Scroll ${title} carousel right`}
                className="size-10 rounded-xl border-border/80 bg-card disabled:opacity-30"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Carousel Viewport (Mobile snap swipe & Desktop smooth scroll) */}
        <div
          ref={scrollRef}
          role="region"
          aria-label={`${title} carousel`}
          tabIndex={0}
          className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar focus:outline-none focus:ring-1 focus:ring-primary/40 rounded-2xl"
        >
          {cards.map((card) => (
            <div key={card.id} className="w-[84vw] max-w-[340px] sm:w-[360px] shrink-0 snap-start">
              <EkaBaseCard card={card} onInspect={onInspectCard} className="h-full" />
            </div>
          ))}

          {/* End cap: Signaling more exploration */}
          {viewAllLink && (
            <div className="w-[60vw] max-w-[240px] sm:w-[260px] shrink-0 snap-start flex flex-col items-center justify-center p-6 rounded-3xl border border-dashed border-border/80 bg-card/60 text-center">
              <span className="text-xs uppercase tracking-[0.2em] text-terracotta font-medium">
                Deep Dive
              </span>
              <h3 className="mt-2 font-display text-lg font-medium text-foreground">
                More in {title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground font-light">
                Discover the connected human context graph.
              </p>
              <Button asChild size="sm" className="mt-4 rounded-xl">
                <Link to={viewAllLink}>
                  <span>Explore All</span>
                  <ArrowRight className="ml-1 size-3.5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
