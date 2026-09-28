import React from "react";
import { Sparkles, X } from "lucide-react";
import { INTEREST_CHIPS } from "@/lib/homepage-data";
import { cn } from "@/lib/utils";

interface InterestFilterSectionProps {
  selectedInterest: string;
  onSelectInterest: (key: string) => void;
  matchingCount?: number;
}

export const InterestFilterSection: React.FC<InterestFilterSectionProps> = ({
  selectedInterest,
  onSelectInterest,
  matchingCount,
}) => {
  return (
    <section
      aria-label="Filter cards by interest"
      className="border-y border-border/60 bg-sand/30 py-10 transition-colors"
    >
      <div className="container-eka">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-terracotta">
              <Sparkles className="size-3.5" />
              <span>Explore by Interest</span>
            </div>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight sm:text-3xl text-foreground">
              Follow the threads that call to you.
            </h2>
            <p className="mt-1 text-sm text-muted-foreground font-light max-w-xl">
              Tap any category to focus your discovery across sacred architecture, living
              traditions, crafts, and foodways.
            </p>
          </div>

          {selectedInterest !== "all" && (
            <div className="flex items-center gap-2 self-start md:self-end">
              <span className="text-xs text-muted-foreground">
                {matchingCount !== undefined ? `${matchingCount} items matching` : "Filtering by"}{" "}
                <span className="font-semibold text-foreground capitalize">
                  {INTEREST_CHIPS.find((c) => c.key === selectedInterest)?.label ||
                    selectedInterest}
                </span>
              </span>
              <button
                type="button"
                onClick={() => onSelectInterest("all")}
                className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-background/80 px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                aria-label="Clear active interest filter"
              >
                <X className="size-3" />
                <span>Reset</span>
              </button>
            </div>
          )}
        </div>

        {/* Chips list: Horizontal scroll with snap on mobile, wrap on tablet/desktop */}
        <div
          role="toolbar"
          aria-label="Cultural interest filter chips"
          className="mt-6 -mx-4 px-4 flex gap-2.5 overflow-x-auto pb-2 scrollbar-none sm:mx-0 sm:px-0 sm:flex-wrap"
        >
          {INTEREST_CHIPS.map((chip) => {
            const isSelected = selectedInterest === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => onSelectInterest(chip.key)}
                aria-pressed={isSelected}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary cursor-pointer select-none",
                  "border min-h-[40px] flex items-center gap-1.5",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-xs font-semibold scale-105"
                    : "border-border/80 bg-card/80 text-foreground/80 hover:border-border hover:bg-card hover:text-foreground hover:shadow-xs active:scale-95",
                )}
              >
                {isSelected && <span className="size-1.5 rounded-full bg-primary-foreground" />}
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
