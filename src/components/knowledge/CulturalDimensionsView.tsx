import React, { useState } from "react";
import {
  Compass,
  History,
  Sparkles,
  Calendar,
  Hammer,
  Music,
  Users2,
  MapPin,
  Languages,
  TrendingUp,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { CulturalDimensions } from "@/lib/knowledge/knowledge-object";

interface CulturalDimensionsViewProps {
  dimensions: CulturalDimensions;
  className?: string;
}

export function CulturalDimensionsView({
  dimensions,
  className = "",
}: CulturalDimensionsViewProps) {
  const [activeTab, setActiveTab] = useState("identity");

  return (
    <div
      data-testid="eka-cultural-dimensions"
      className={`rounded-3xl border border-border/80 bg-card p-6 shadow-calm sm:p-8 ${className}`}
    >
      <div className="mb-6">
        <h3 className="font-serif text-2xl font-bold text-foreground">
          The 10 Cultural Dimensions
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          EKA models traditions across comprehensive multidimensional lenses rather than flat encyclopedia paragraphs.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <TabsList className="h-auto p-1 bg-sand/30 rounded-2xl flex w-max space-x-1">
            <TabsTrigger
              value="identity"
              className="rounded-xl px-3.5 py-2 text-xs font-medium flex items-center gap-1.5"
            >
              <Compass className="h-3.5 w-3.5" /> Identity
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-xl px-3.5 py-2 text-xs font-medium flex items-center gap-1.5"
            >
              <History className="h-3.5 w-3.5" /> History
            </TabsTrigger>
            <TabsTrigger
              value="beliefs"
              className="rounded-xl px-3.5 py-2 text-xs font-medium flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" /> Beliefs & Worldview
            </TabsTrigger>
            <TabsTrigger
              value="practices"
              className="rounded-xl px-3.5 py-2 text-xs font-medium flex items-center gap-1.5"
            >
              <Calendar className="h-3.5 w-3.5" /> Practices & Rituals
            </TabsTrigger>
            <TabsTrigger
              value="material"
              className="rounded-xl px-3.5 py-2 text-xs font-medium flex items-center gap-1.5"
            >
              <Hammer className="h-3.5 w-3.5" /> Material Culture
            </TabsTrigger>
            <TabsTrigger
              value="arts"
              className="rounded-xl px-3.5 py-2 text-xs font-medium flex items-center gap-1.5"
            >
              <Music className="h-3.5 w-3.5" /> Arts & Performance
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="rounded-xl px-3.5 py-2 text-xs font-medium flex items-center gap-1.5"
            >
              <Users2 className="h-3.5 w-3.5" /> Social Fabric
            </TabsTrigger>
            <TabsTrigger
              value="geography"
              className="rounded-xl px-3.5 py-2 text-xs font-medium flex items-center gap-1.5"
            >
              <MapPin className="h-3.5 w-3.5" /> Sacred Geography
            </TabsTrigger>
            <TabsTrigger
              value="language"
              className="rounded-xl px-3.5 py-2 text-xs font-medium flex items-center gap-1.5"
            >
              <Languages className="h-3.5 w-3.5" /> Language & Texts
            </TabsTrigger>
            <TabsTrigger
              value="modern"
              className="rounded-xl px-3.5 py-2 text-xs font-medium flex items-center gap-1.5"
            >
              <TrendingUp className="h-3.5 w-3.5" /> Modern Economy
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 1. IDENTITY */}
        <TabsContent value="identity" className="mt-6 space-y-4">
          <div className="rounded-2xl bg-sand/20 p-5">
            <h4 className="font-serif text-lg font-semibold text-foreground">
              {dimensions.identity.canonicalName}
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {dimensions.identity.alternativeNames.map((name) => (
                <Badge key={name} variant="secondary" className="text-xs">
                  {name}
                </Badge>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Communities
                </span>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {dimensions.identity.communities.join(", ")}
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Regions
                </span>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {dimensions.identity.regions.join(", ")}
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Languages
                </span>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {dimensions.identity.languages.join(", ")}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 2. HISTORY */}
        <TabsContent value="history" className="mt-6 space-y-4">
          <div className="rounded-2xl bg-sand/20 p-5">
            <h5 className="text-xs font-semibold text-primary uppercase tracking-wider">
              Origins & Emergence
            </h5>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              {dimensions.history.origins}
            </p>
            <div className="mt-5">
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Key Historical Milestones
              </h5>
              <ul className="mt-2 space-y-2.5">
                {dimensions.history.milestones.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* 3. BELIEFS & WORLDVIEW */}
        <TabsContent value="beliefs" className="mt-6 space-y-4">
          <div className="rounded-2xl bg-sand/20 p-5">
            <h5 className="text-xs font-semibold text-primary uppercase tracking-wider">
              Underlying Worldview
            </h5>
            <p className="mt-2 font-serif text-base italic text-foreground leading-relaxed">
              "{dimensions.beliefs.worldview}"
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border/80 bg-card p-4">
                <h6 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Spiritual Concepts
                </h6>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {dimensions.beliefs.spiritualConcepts.map((c) => (
                    <Badge key={c} variant="outline" className="text-xs">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border/80 bg-card p-4">
                <h6 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Religious Context
                </h6>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {dimensions.beliefs.religiousContext.map((c) => (
                    <Badge key={c} variant="secondary" className="text-xs">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 4. PRACTICES & RITUALS */}
        <TabsContent value="practices" className="mt-6 space-y-4">
          <div className="rounded-2xl bg-sand/20 p-5 space-y-5">
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Living Rituals
              </h5>
              <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {dimensions.practices.rituals.map((r, idx) => (
                  <div key={idx} className="rounded-xl border border-border/60 bg-card p-3 text-sm text-foreground">
                    ✦ {r}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Ceremonies & Cycles
              </h5>
              <div className="mt-2 flex flex-wrap gap-2">
                {dimensions.practices.ceremonies.map((c) => (
                  <Badge key={c} variant="outline" className="text-xs py-1 px-2.5">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 5. MATERIAL CULTURE */}
        <TabsContent value="material" className="mt-6 space-y-4">
          <div className="rounded-2xl bg-sand/20 p-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border/80 bg-card p-4">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Attire & Weaves
                </span>
                <ul className="mt-2 space-y-1 text-sm text-foreground">
                  {dimensions.materialCulture.clothing.map((c, i) => (
                    <li key={i}>• {c}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border/80 bg-card p-4">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Foodways & Feasts
                </span>
                <ul className="mt-2 space-y-1 text-sm text-foreground">
                  {dimensions.materialCulture.foodways.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border/80 bg-card p-4">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Sacred Objects
                </span>
                <ul className="mt-2 space-y-1 text-sm text-foreground">
                  {dimensions.materialCulture.sacredObjects.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 6. ARTS & PERFORMANCE */}
        <TabsContent value="arts" className="mt-6 space-y-4">
          <div className="rounded-2xl bg-sand/20 p-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <h6 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Music & Instruments
                </h6>
                <p className="mt-2 text-sm text-foreground">
                  {dimensions.arts.music.join(" • ")}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <h6 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Dance & Theatre
                </h6>
                <p className="mt-2 text-sm text-foreground">
                  {dimensions.arts.dance.join(" • ")}
                  {dimensions.arts.theatre.length > 0 && ` • Theatre: ${dimensions.arts.theatre.join(", ")}`}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 7. SOCIAL FABRIC */}
        <TabsContent value="social" className="mt-6 space-y-4">
          <div className="rounded-2xl bg-sand/20 p-5 space-y-4">
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Traditional Occupations & Guilds
              </h5>
              <div className="mt-2 flex flex-wrap gap-2">
                {dimensions.socialLife.traditionalOccupations.map((o) => (
                  <Badge key={o} variant="secondary" className="text-xs">
                    {o}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Social Customs & Assembly
              </h5>
              <ul className="mt-2 space-y-2">
                {dimensions.socialLife.socialCustoms.map((c, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-primary font-bold">›</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* 8. SACRED GEOGRAPHY */}
        <TabsContent value="geography" className="mt-6 space-y-4">
          <div className="rounded-2xl bg-sand/20 p-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              {dimensions.geography.places.map((p) => (
                <Badge key={p} variant="outline" className="text-xs py-1 px-3">
                  <MapPin className="h-3 w-3 mr-1 text-primary" /> {p}
                </Badge>
              ))}
            </div>
            <div className="mt-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Sacred Landscapes & Watercourses
              </span>
              <p className="mt-1 text-sm text-foreground">
                {dimensions.geography.sacredLandscapes.join("; ")}
              </p>
            </div>
          </div>
        </TabsContent>

        {/* 9. LANGUAGE & TEXTS */}
        <TabsContent value="language" className="mt-6 space-y-4">
          <div className="rounded-2xl bg-sand/20 p-5 space-y-5">
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Key Terminology & Etymology
              </h5>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {dimensions.language.keyTerminology.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-border bg-card p-3.5">
                    <div className="flex justify-between items-center">
                      <span className="font-serif font-bold text-foreground text-sm">
                        {item.term}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {item.language}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {item.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {dimensions.language.sacredChantsOrCouplets && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Sacred Chants & Couplets
                </span>
                <div className="mt-2 space-y-2">
                  {dimensions.language.sacredChantsOrCouplets.map((chant, i) => (
                    <p key={i} className="font-serif text-sm italic text-foreground">
                      "{chant}"
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* 10. MODERN ECONOMY */}
        <TabsContent value="modern" className="mt-6 space-y-4">
          <div className="rounded-2xl bg-sand/20 p-5 space-y-5">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Living Experiences & Authentic Visits
              </span>
              <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {dimensions.localEconomy.livingExperiences.map((exp, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-3 text-sm text-foreground">
                    📍 {exp}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <h6 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Master Artisans & Guilds
                </h6>
                <ul className="mt-2 space-y-1 text-sm text-foreground">
                  {dimensions.localEconomy.traditionalArtisans.map((a, i) => (
                    <li key={i}>• {a}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <h6 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ethical Safeguarding & Brands
                </h6>
                <ul className="mt-2 space-y-1 text-sm text-foreground">
                  {dimensions.localEconomy.ethicalLocalBrands.map((b, i) => (
                    <li key={i}>• {b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
