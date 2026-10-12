// ==============================================================================
// EKA BETA: EXPLORE BY CULTURAL CATEGORY
// ==============================================================================
// 12 Primary Cultural Dimensions directly matching Stitch design specifications:
// Living Cultures, Traditions & Rituals, Sacred Places, Master Crafts,
// Festivals & Rites, Foodways & Feasts, Heritage & Architecture,
// Communities & Elders, Languages & Oral Epics, History & Lineages,
// Ideas & Universal Wisdom, Cultural Experiences.
// ==============================================================================

import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import ekaCircleCommunion from "@/assets/brand/eka-circle-communion.jpg";
import ritualLamp from "@/assets/ritual-lamp.jpg";
import varanasiImage from "@/assets/places/varanasi.jpg";
import practiceImage from "@/assets/practice.jpg";
import kolkataImage from "@/assets/places/kolkata.jpg";
import kyotoImage from "@/assets/places/kyoto.jpg";
import marrakeshImage from "@/assets/places/marrakesh.jpg";
import monasteryCorridor from "@/assets/monastery-corridor.jpg";
import readingTable from "@/assets/reading-table.jpg";
import journeyImage from "@/assets/journey.jpg";
import todayReflection from "@/assets/today-reflection.jpg";
import heroImage from "@/assets/hero.jpg";

export interface CulturalCategoryItem {
  id: string;
  title: string;
  entries: number;
  subtitle: string;
  image: string;
  filterCategory: string;
}

export const CULTURAL_CATEGORIES_DATA: CulturalCategoryItem[] = [
  {
    id: "cat-living-cultures",
    title: "Living Cultures",
    entries: 48,
    subtitle: "Living ways of being across 7 continents",
    image: ekaCircleCommunion,
    filterCategory: "Practices",
  },
  {
    id: "cat-traditions-rituals",
    title: "Traditions & Rituals",
    entries: 84,
    subtitle: "Unbroken generational customs and dawn rites",
    image: ritualLamp,
    filterCategory: "Practices",
  },
  {
    id: "cat-sacred-places",
    title: "Sacred Places",
    entries: 62,
    subtitle: "Temples, rivers, shrines, and sacred geography",
    image: varanasiImage,
    filterCategory: "Places",
  },
  {
    id: "cat-master-crafts",
    title: "Master Crafts",
    entries: 56,
    subtitle: "Hereditary textile, metal, and ceramic arts",
    image: practiceImage,
    filterCategory: "Crafts",
  },
  {
    id: "cat-festivals-rites",
    title: "Festivals & Rites",
    entries: 39,
    subtitle: "Equinox celebrations, harvests, and public ceremonies",
    image: kolkataImage,
    filterCategory: "Practices",
  },
  {
    id: "cat-foodways-feasts",
    title: "Foodways & Feasts",
    entries: 31,
    subtitle: "Ancestral gastronomy, temple offerings, and heirloom hearths",
    image: kyotoImage,
    filterCategory: "Practices",
  },
  {
    id: "cat-heritage-architecture",
    title: "Heritage & Architecture",
    entries: 37,
    subtitle: "Mud brick fortifications, stone stepwells, and timber joinery",
    image: marrakeshImage,
    filterCategory: "Places",
  },
  {
    id: "cat-communities-elders",
    title: "Communities & Elders",
    entries: 45,
    subtitle: "Custodians, monastic guilds, and generational memory",
    image: monasteryCorridor,
    filterCategory: "Practices",
  },
  {
    id: "cat-languages-oral-epics",
    title: "Languages & Oral Epics",
    entries: 28,
    subtitle: "Living chants, dialects, and unwritten epics",
    image: readingTable,
    filterCategory: "Practices",
  },
  {
    id: "cat-history-lineages",
    title: "History & Lineages",
    entries: 41,
    subtitle: "Centuries of continuous transmission and unbroken archives",
    image: journeyImage,
    filterCategory: "Places",
  },
  {
    id: "cat-ideas-universal-wisdom",
    title: "Ideas & Universal Wisdom",
    entries: 52,
    subtitle: "Philosophies of impermanence, harmony, and cosmic order",
    image: todayReflection,
    filterCategory: "Practices",
  },
  {
    id: "cat-cultural-experiences",
    title: "Cultural Experiences",
    entries: 34,
    subtitle: "Dawn pilgrimages, temple stays, and master guild visits",
    image: heroImage,
    filterCategory: "Places",
  },
];

interface ExploreByCulturalCategoryProps {
  className?: string;
  onSelectCategory?: (category: string) => void;
}

export function ExploreByCulturalCategory({
  className = "",
  onSelectCategory,
}: ExploreByCulturalCategoryProps) {
  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-10 max-w-2xl">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-4xl font-normal tracking-tight text-[#1A1A1A]">
            Explore by Cultural Category
          </h2>
          <p className="text-sm sm:text-base text-[#5C5C5C] mt-2 font-normal leading-relaxed">
            Every culture connects to a tradition, a craft, and a living community.
          </p>
        </div>

        {/* 12-Card Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {CULTURAL_CATEGORIES_DATA.map((cat) => (
            <Link
              key={cat.id}
              to="/discover"
              search={{ topic: cat.title.toLowerCase() } as any}
              onClick={() => {
                if (onSelectCategory) {
                  onSelectCategory(cat.filterCategory);
                }
              }}
              className="group relative h-[220px] sm:h-[240px] w-full rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between p-5 border border-white/20 select-none cursor-pointer"
            >
              {/* Background Photography with Warm Atmospheric Gradient */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Deep Legibility Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20 group-hover:via-black/50 transition-colors" />
              </div>

              {/* Top Row: Entry Count Badge */}
              <div className="relative z-10 flex justify-end">
                <span className="font-mono text-[10px] tracking-wider text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  {cat.entries} entries
                </span>
              </div>

              {/* Bottom Content: Title, Subtitle & Explore Link */}
              <div className="relative z-10 space-y-1.5">
                <h3 className="font-serif text-lg sm:text-xl font-medium text-white leading-snug group-hover:text-amber-200 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-white/75 font-normal leading-relaxed line-clamp-2">
                  {cat.subtitle}
                </p>
                <div className="pt-1 flex items-center justify-end">
                  <span className="text-xs font-medium text-amber-300/90 group-hover:text-amber-200 flex items-center gap-1 transition-transform group-hover:translate-x-0.5">
                    Explore <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
