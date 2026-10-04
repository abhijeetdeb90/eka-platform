import React, { useState } from "react";
import {
  Globe,
  Compass,
  MapPin,
  Flame,
  Sparkles,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface DiscoverNavSelection {
  pillar: "world" | "cultures" | "places" | "trending" | "ai";
  subCategory?: string;
}

interface DiscoverArchitectureNavProps {
  activePillar: string;
  activeSubcategory?: string;
  onSelect: (selection: DiscoverNavSelection) => void;
  className?: string;
}

const PILLARS = [
  {
    id: "world" as const,
    label: "Explore the World",
    icon: "🌍",
    subcategories: [
      "India",
      "Asia",
      "Middle East",
      "Africa",
      "Europe",
      "Americas",
      "Oceania",
    ],
  },
  {
    id: "cultures" as const,
    label: "Cultures",
    icon: "🧭",
    subcategories: [
      "Communities",
      "Languages",
      "Religions & Worldviews",
      "Traditions",
      "Rituals",
      "Festivals",
      "Food",
      "Clothing",
      "Music & Dance",
      "Art & Craft",
      "Stories",
    ],
  },
  {
    id: "places" as const,
    label: "Places",
    icon: "📍",
    subcategories: [
      "Sacred Places",
      "Heritage",
      "Cities",
      "Villages",
      "Cultural Destinations",
    ],
  },
  {
    id: "trending" as const,
    label: "Trending / Seasonal",
    icon: "🔥",
    subcategories: [
      "Happening Now",
      "Festivals Today",
      "This Week",
      "Around You",
    ],
  },
  {
    id: "ai" as const,
    label: "Ask EKA AI",
    icon: "✨",
    subcategories: ["What are you curious about?"],
  },
];

export function DiscoverArchitectureNav({
  activePillar,
  activeSubcategory,
  onSelect,
  className = "",
}: DiscoverArchitectureNavProps) {
  const [openPillar, setOpenPillar] = useState<string | null>(activePillar);

  const handlePillarClick = (pillarId: "world" | "cultures" | "places" | "trending" | "ai") => {
    if (pillarId === "ai") {
      onSelect({ pillar: "ai", subCategory: "What are you curious about?" });
      return;
    }
    const next = openPillar === pillarId ? null : pillarId;
    setOpenPillar(next);
    const pillarObj = PILLARS.find((p) => p.id === pillarId);
    onSelect({ pillar: pillarId, subCategory: pillarObj?.subcategories[0] });
  };

  const activePillarObj = PILLARS.find((p) => p.id === activePillar);

  return (
    <nav
      aria-label="Discover Architecture Navigation"
      className={`rounded-2xl border border-border/80 bg-card p-3 shadow-xs space-y-3 ${className}`}
    >
      {/* 5 Main Pillars Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {PILLARS.map((p) => {
          const isActive = activePillar === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePillarClick(p.id)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all shrink-0 flex items-center gap-2 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border/70 bg-background text-foreground hover:bg-accent"
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
              {p.id !== "ai" && (
                <ChevronDown
                  className={`size-3 transition-transform ${openPillar === p.id ? "rotate-180" : ""}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Subcategories Shelf */}
      {activePillarObj && activePillarObj.subcategories.length > 0 && activePillar !== "ai" && (
        <div className="border-t border-border/60 pt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mr-1 shrink-0">
            {activePillarObj.label}:
          </span>
          {activePillarObj.subcategories.map((sub) => {
            const isSubActive = activeSubcategory === sub;
            return (
              <button
                key={sub}
                type="button"
                onClick={() =>
                  onSelect({
                    pillar: activePillarObj.id,
                    subCategory: sub,
                  })
                }
                className={`rounded-full px-3 py-1 text-xs transition-all shrink-0 ${
                  isSubActive
                    ? "bg-foreground text-background font-semibold"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
