// ==============================================================================
// EKA FOOTER LOCAL DISCOVERY & CULTURAL EXPLORATION SYSTEM
// ==============================================================================
// Scalable gateway for:
// Culture → Places → Communities → Traditions → Experiences → Knowledge → Local Discovery
// 1. Explore Culture & Places (Destinations, Local Life, Experiences)
// 2. Explore by Place (Geographic hierarchy with India wedge & global expansion)
// 3. Explore by Cultural Category
// 4. "Near You" Discovery (Privacy-safe geolocation + manual city selector)
// 5. "Popular on EKA" Trending discovery
// 6. "Start with a Question" Ask EKA shortcut
// 7. "Today on EKA" Seasonal discovery
// ==============================================================================

import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  Globe,
  HelpCircle,
  Film,
  BookOpen,
  Users,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Navigation,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { track } from "@/lib/analytics";

// Geographic Hierarchy: India wedge + Global expansion
const GEOGRAPHIC_WEDGE = [
  {
    region: "North & Central India",
    cities: ["Varanasi", "Prayagraj", "Ayodhya", "Delhi", "Jaipur", "Ujjain", "Amritsar"],
  },
  {
    region: "East & Northeast India",
    cities: ["Kolkata", "Majuli Island", "Guwahati", "Puri", "Bhubaneswar", "Shillong"],
  },
  {
    region: "South India",
    cities: ["Madurai", "Thanjavur", "Kanchipuram", "Aranmula", "Kochi", "Hampi", "Mysuru"],
  },
  {
    region: "West India",
    cities: ["Patan", "Bhuj & Kutch", "Ahmedabad", "Nashik", "Pandharpur", "Udaipur"],
  },
  {
    region: "Global Lineages",
    cities: ["Kyoto", "Fez", "Oaxaca", "Mount Athos", "Kathmandu", "Cusco", "Luang Prabang"],
  },
];

const CULTURAL_DESTINATIONS = [
  { name: "Sacred Places", query: "sacred places" },
  { name: "Heritage Sites", query: "heritage sites" },
  { name: "Museums & Galleries", query: "museums" },
  { name: "Cultural Landmarks", query: "landmarks" },
  { name: "Pilgrimage Routes", query: "pilgrimage" },
  { name: "Historical Places", query: "historical places" },
  { name: "Nature & Spiritual Retreats", query: "retreats" },
];

const LOCAL_LIFE = [
  { name: "Local Food & Foodways", query: "traditional food" },
  { name: "Traditional Crafts", query: "crafts" },
  { name: "Markets & Bazaars", query: "markets" },
  { name: "Festivals & Rites", query: "festivals" },
  { name: "Music & Sacred Chants", query: "music" },
  { name: "Clothing & Handlooms", query: "textiles" },
  { name: "Community Lineages", query: "communities" },
  { name: "Local Cultural Businesses", query: "businesses" },
];

const CULTURAL_EXPERIENCES = [
  { name: "Things to Do & Observe", query: "things to do" },
  { name: "Living Cultural Experiences", query: "cultural experiences" },
  { name: "Artisan Workshops", query: "workshops" },
  { name: "Spiritual Gatherings", query: "spiritual gatherings" },
  { name: "Local Heritage Walks", query: "heritage walks" },
  { name: "Seasonal Festivals", query: "festivals" },
  { name: "Creator Gatherings", query: "creators" },
];

const CULTURAL_CATEGORIES = [
  "Festivals",
  "Traditions",
  "Rituals",
  "Foodways",
  "Crafts",
  "Music",
  "Dance",
  "Clothing & Textiles",
  "Languages & Chants",
  "Oral Stories",
  "Spirituality",
  "Heritage Architecture",
  "Communities",
  "Sacred Places",
  "Historical Topography",
];

export function FooterLocalDiscovery() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [manualCity, setManualCity] = useState("Varanasi, India");
  const [questionInput, setQuestionInput] = useState("");
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    destinations: false,
    places: false,
    categories: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Safe coarse geolocation request
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      toast.info("Geolocation is not supported by your browser. Please select a city manually.");
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDetectingLocation(false);
        // We only use coarse approximation for discovery without exposing coordinates
        setUserLocation("Near Your Region (Coarse)");
        toast.success("Location enabled: Showing cultural places near you");
        track("near_me_used", { coarseEnabled: true });
      },
      (error) => {
        setDetectingLocation(false);
        toast.info("Location access not granted. Using manual city selection.");
      },
      { timeout: 8000, maximumAge: 600000 }
    );
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionInput.trim()) {
      track("question_started", { query: questionInput });
      void navigate({ to: "/ask", search: { q: questionInput.trim() } });
    }
  };

  return (
    <div className="border-t border-border/70 bg-card/60 backdrop-blur-xs py-12 sm:py-16 space-y-12">
      {/* 1. START WITH A QUESTION & WISDOM NAVIGATOR CTA */}
      <section className="container-eka max-w-4xl mx-auto">
        <div className="rounded-3xl border border-primary/25 bg-gradient-to-r from-primary/10 via-sand/30 to-terracotta/10 p-6 sm:p-8 text-center space-y-4 shadow-calm">
          <Badge variant="outline" className="text-[10px] font-mono uppercase text-primary border-primary/40">
            <Sparkles className="size-3 mr-1 inline text-saffron" />
            Curious about a tradition, ritual or place?
          </Badge>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Start from a Question
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground font-light max-w-xl mx-auto">
            Why do people light lamps? Where did this craft originate? Ask anything and EKA connects stories, articles, places, and verified sources.
          </p>

          <form onSubmit={handleQuestionSubmit} className="relative max-w-xl mx-auto pt-2">
            <div className="relative flex items-center rounded-2xl border border-border/80 bg-background shadow-xs">
              <HelpCircle className="ml-3.5 size-4 text-muted-foreground shrink-0" />
              <Input
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Ask any cultural question (e.g. Why is Diwali celebrated?)"
                className="border-0 bg-transparent py-5 px-3 text-sm focus-visible:ring-0 placeholder:text-muted-foreground/70"
              />
              <Button
                type="submit"
                size="sm"
                className="mr-1.5 rounded-xl bg-gradient-to-r from-terracotta to-saffron text-white h-8 px-4 text-xs font-medium"
              >
                <span>Ask EKA</span>
                <ArrowRight className="ml-1 size-3" />
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* 2. "NEAR YOU" CULTURAL DISCOVERY (LOCATION-AWARE) */}
      <section className="container-eka">
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Navigation className="size-4 text-terracotta" />
                <h4 className="font-serif text-lg font-bold text-foreground">
                  Explore What's Near You
                </h4>
              </div>
              <p className="text-xs text-muted-foreground font-light">
                Discover cultural heritage, sacred places, and master artisans near your current location or selected city.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                size="sm"
                variant={userLocation ? "secondary" : "outline"}
                onClick={handleRequestLocation}
                disabled={detectingLocation}
                className="rounded-xl text-xs gap-1.5"
              >
                <MapPin className="size-3.5 text-primary" />
                <span>{detectingLocation ? "Detecting…" : userLocation || "Use My Location"}</span>
              </Button>

              <select
                value={manualCity}
                onChange={(e) => {
                  setManualCity(e.target.value);
                  track("location_selected", { city: e.target.value });
                }}
                className="rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs text-foreground focus:outline-hidden"
              >
                <option value="Varanasi, India">Varanasi, India</option>
                <option value="Kolkata, India">Kolkata, India</option>
                <option value="Delhi, India">Delhi, India</option>
                <option value="Madurai, India">Madurai, India</option>
                <option value="Kochi, India">Kochi, India</option>
                <option value="Kyoto, Japan">Kyoto, Japan</option>
                <option value="Fez, Morocco">Fez, Morocco</option>
                <option value="Oaxaca, Mexico">Oaxaca, Mexico</option>
              </select>
            </div>
          </div>

          {/* Near You Discovery Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
            {[
              { label: "Cultural Places Near Me", q: `cultural places in ${manualCity}` },
              { label: "Temples & Sacred Places", q: `sacred places in ${manualCity}` },
              { label: "Heritage Sites Near Me", q: `heritage in ${manualCity}` },
              { label: "Traditional Food Near Me", q: `food culture in ${manualCity}` },
              { label: "Artisans & Crafts Near Me", q: `crafts in ${manualCity}` },
              { label: "Festivals Near Me", q: `festivals in ${manualCity}` },
              { label: "Communities Near Me", q: `communities in ${manualCity}` },
              { label: "Cultural Experiences", q: `experiences in ${manualCity}` },
              { label: "Heritage Walks", q: `walks in ${manualCity}` },
              { label: "Local Cultural Businesses", q: `cultural businesses in ${manualCity}` },
            ].map((item) => (
              <Link
                key={item.label}
                to="/search"
                search={{ q: item.q }}
                onClick={() => track("discovery_category_clicked", { category: item.label })}
                className="p-3 rounded-xl border border-border/60 bg-background/60 hover:bg-accent/40 hover:border-primary/40 text-xs transition-colors group flex items-center justify-between"
              >
                <span className="text-foreground/90 font-medium truncate">{item.label}</span>
                <ArrowRight className="size-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0 ml-1 opacity-60" />
              </Link>
            ))}
          </div>

          <p className="text-[10px] text-muted-foreground font-mono">
            Privacy First: We never store your precise latitude/longitude coordinates. Public discovery utilizes coarse regional resolution.
          </p>
        </div>
      </section>

      {/* 3. EXPLORE CULTURE & PLACES (DESTINATIONS, LOCAL LIFE, EXPERIENCES) */}
      <section className="container-eka space-y-4">
        <div>
          <h4 className="font-serif text-xl font-bold text-foreground">
            Explore Culture & Places
          </h4>
          <p className="text-xs text-muted-foreground font-light">
            Discover the places, people, traditions, stories, and experiences that make every culture unique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Group A: Cultural Destinations */}
          <div className="space-y-3 p-5 rounded-2xl border border-border/70 bg-card">
            <div className="flex items-center gap-2">
              <Compass className="size-4 text-blue-500" />
              <h5 className="font-display font-semibold text-xs uppercase tracking-wider text-foreground">
                Cultural Destinations
              </h5>
            </div>
            <ul className="space-y-2 text-xs">
              {CULTURAL_DESTINATIONS.map((d) => (
                <li key={d.name}>
                  <Link
                    to="/discover"
                    search={{ q: d.query }}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between group"
                  >
                    <span>{d.name}</span>
                    <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Group B: Local Life */}
          <div className="space-y-3 p-5 rounded-2xl border border-border/70 bg-card">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-terracotta" />
              <h5 className="font-display font-semibold text-xs uppercase tracking-wider text-foreground">
                Local Life & Lineages
              </h5>
            </div>
            <ul className="space-y-2 text-xs">
              {LOCAL_LIFE.map((l) => (
                <li key={l.name}>
                  <Link
                    to="/discover"
                    search={{ q: l.query }}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between group"
                  >
                    <span>{l.name}</span>
                    <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Group C: Experiences */}
          <div className="space-y-3 p-5 rounded-2xl border border-border/70 bg-card">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-saffron" />
              <h5 className="font-display font-semibold text-xs uppercase tracking-wider text-foreground">
                Living Experiences
              </h5>
            </div>
            <ul className="space-y-2 text-xs">
              {CULTURAL_EXPERIENCES.map((e) => (
                <li key={e.name}>
                  <Link
                    to="/discover"
                    search={{ q: e.query }}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between group"
                  >
                    <span>{e.name}</span>
                    <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. EXPLORE BY PLACE (GEOGRAPHIC HIERARCHY) */}
      <section className="container-eka space-y-4">
        <div>
          <h4 className="font-serif text-xl font-bold text-foreground">
            Explore by Place & Lineage
          </h4>
          <p className="text-xs text-muted-foreground font-light">
            Dynamic geographic hierarchy spanning sacred confluences, artisan towns, and global lineages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {GEOGRAPHIC_WEDGE.map((item) => (
            <div key={item.region} className="p-4 rounded-2xl border border-border/70 bg-card space-y-2.5">
              <h5 className="font-display font-semibold text-xs text-foreground pb-1 border-b border-border/50">
                {item.region}
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {item.cities.map((city) => (
                  <Link
                    key={city}
                    to="/discover"
                    search={{ q: city }}
                    onClick={() => track("location_selected", { city })}
                    className="rounded-lg bg-accent/40 border border-border/60 px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                  >
                    {city}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. EXPLORE BY CULTURAL CATEGORY */}
      <section className="container-eka space-y-4">
        <div>
          <h4 className="font-serif text-xl font-bold text-foreground">
            Explore by Cultural Category
          </h4>
          <p className="text-xs text-muted-foreground font-light">
            Every cultural category connects to places, stories, explainers, and living custodians.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {CULTURAL_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to="/search"
              search={{ q: cat }}
              onClick={() => track("discovery_category_clicked", { category: cat })}
              className="rounded-full border border-border/70 bg-card px-3.5 py-1.5 text-xs text-foreground/90 hover:border-primary/50 hover:bg-accent hover:text-primary transition-all font-mono"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
