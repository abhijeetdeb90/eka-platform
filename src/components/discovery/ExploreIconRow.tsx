import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Compass,
  Globe,
  Users,
  Landmark,
  Sparkles,
  BookOpen,
  Feather,
  ShoppingBag,
} from "lucide-react";
import { EXPLORE_ICONS, type ExploreIconItem } from "@/lib/homepage-data";

export function ExploreIconRow() {
  const getIcon = (name: string) => {
    switch (name) {
      case "Compass":
        return Compass;
      case "Globe":
        return Globe;
      case "Users":
        return Users;
      case "Landmark":
        return Landmark;
      case "Sparkles":
        return Sparkles;
      case "BookOpen":
        return BookOpen;
      case "Feather":
        return Feather;
      case "ShoppingBag":
      default:
        return ShoppingBag;
    }
  };

  return (
    <section
      id="explore-eka-icons"
      className="border-y border-border/70 bg-card/60 py-6 backdrop-blur-xs"
    >
      <div className="container-eka">
        <div className="flex items-center justify-between gap-4 mb-3">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground font-semibold">
            Explore EKA by Dimension
          </p>
          <span className="hidden sm:inline-block text-xs text-muted-foreground font-light">
            9 Canonical Gateways into the Human Context Graph
          </span>
        </div>

        {/* Horizontal scrollable icon row */}
        <nav
          aria-label="EKA Cultural Dimensions"
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {EXPLORE_ICONS.map((item: ExploreIconItem) => {
            const Icon = getIcon(item.iconName);
            return (
              <Link
                key={item.id}
                to={item.to}
                data-testid={`explore-icon-${item.id}`}
                className="group relative flex flex-col items-center justify-center shrink-0 min-w-[76px] sm:min-w-[88px] min-h-[76px] rounded-2xl border border-border/80 bg-background/80 p-3 text-center transition-all duration-300 hover:border-primary/50 hover:bg-card hover:shadow-calm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {/* Visual Icon Badge */}
                <div className="relative flex size-11 items-center justify-center rounded-xl bg-sand/60 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">
                  <Icon className="size-5" />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-1.5 rounded-full bg-saffron text-black text-[9px] font-bold px-1.5 py-0.2 shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Text Label */}
                <span className="mt-2 text-xs font-medium text-foreground transition-colors group-hover:text-primary">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
