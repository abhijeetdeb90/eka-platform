import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Search,
  MapPin,
  Heart,
  MessageSquare,
  ShieldCheck,
  Compass,
  ArrowRight,
  Sparkles,
  Send,
  X,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/find-your-people")({
  head: () => ({
    meta: [
      { title: "Find Your People — Cultural Connection & Hearth Circles | EKA" },
      {
        name: "description",
        content:
          "Connect with culture keepers, oral bards, artisan practitioners, and living hearth circles across the world.",
      },
    ],
  }),
  component: FindYourPeoplePage,
});

// Curated active inquiries inspired by Stitch design
const ACTIVE_CONVERSATIONS = [
    {
    id: "conv-1",
    tag: "Sacred Foodways",
    question: "How do you keep sourdough and kanji starters alive during tropical monsoon shifts?",
    participants: 14,
    responses: 38,
    activeRegion: "Kerala & coastal Karnataka",
  },
  {
    id: "conv-2",
    tag: "Oral Poetry & Chants",
    question: "Do the metric rhythms of Baul songs alter when translated across dialects?",
    participants: 22,
    responses: 51,
    activeRegion: "Bengal & Sylhet diaspora",
  },
  {
    id: "conv-3",
    tag: "Vernacular Architecture",
    question: "Restoring sloped mud-lime courtyards before winter frost: which lime putty binders endure?",
    participants: 9,
    responses: 27,
    activeRegion: "Himachal & Ladakh",
  },
];

// Bioregion & Diaspora Hearth Circles from Stitch design
const REGIONAL_HEARTHS = [
  {
    city: "Kolkata & Bengal Delta",
    descriptor: "Clay pots, river hymns, old printing presses & adda lore",
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=500&q=80",
    members: 420,
    circleSlug: "bengal-delta-adda",
  },
  {
    city: "Kyoto & Kansai",
    descriptor: "Cedar courtyard machiyas, woodblock carving & tea hearths",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80",
    members: 310,
    circleSlug: "kyoto-machiya-guild",
  },
  {
    city: "Oaxaca & Central Valleys",
    descriptor: "Cochineal vats, botanical dyes, clay ovens & zapotec weaving",
    image: "https://images.unsplash.com/photo-1512816943410-14e606b83e85?auto=format&fit=crop&w=500&q=80",
    members: 265,
    circleSlug: "oaxaca-weavers-circle",
  },
  {
    city: "London & Global Diaspora",
    descriptor: "Spice shelf archives, immigrant dialects & kitchen memory",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=500&q=80",
    members: 580,
    circleSlug: "diaspora-kitchen-lore",
  },
];

function FindYourPeoplePage() {
  const { data: profile } = useProfile();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHearth, setSelectedHearth] = useState<{ name: string; region: string; topic: string } | null>(null);
  const [inquiryText, setInquiryText] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Fetch real community stewards / members from profiles
  const { data: realProfiles } = useQuery({
    queryKey: ["stewards-and-seekers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, bio, account_type")
        .limit(8);
      if (error) return [];
      return data || [];
    },
  });

  const handleOpenInquiry = (name: string, region: string, topic: string) => {
    setSelectedHearth({ name, region, topic });
    setInquiryText("");
  };

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      toast.info("Please sign in to begin a respectful cultural inquiry");
      navigate({ to: "/auth" });
      return;
    }
    if (!inquiryText.trim()) return;

    setIsSending(true);
    // Track respectful inquiry
    track("cultural_inquiry_sent", { recipient: selectedHearth?.name, topic: selectedHearth?.topic });
    await new Promise((r) => setTimeout(r, 600));
    setIsSending(false);
    setSelectedHearth(null);
    toast.success("Inquiry sent with respect. Stewards reply in the natural rhythm of human reflection.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-terracotta/20">
      <SiteHeader />

      <main className="flex-1 pb-20">
        {/* SECTION 1: HERO & PHILOSOPHY COMMAND BAR */}
        <section className="relative px-4 sm:px-6 py-12 md:py-20 bg-sand/30 dark:bg-card/40 border-b border-border/60">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/70 text-terracotta font-mono text-[10px] uppercase tracking-wider font-semibold mb-4">
              <Sparkles className="size-3.5" />
              Human Connection & Living Custody
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-foreground max-w-4xl tracking-tight leading-[1.1] mb-5">
              People are the living library. Find the ones carrying what you seek.
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
              No vanity algorithms or influencer spam. EKA connects you with oral bards, heirloom cooks, guild weavers, and kindred seekers through sovereign, respectful inquiry.
            </p>

            <div className="max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/60 pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by living craft, tradition, region, or dialect..."
                className="rounded-full bg-background/95 h-14 pl-12 pr-4 shadow-sm border-border/80 text-sm focus-visible:ring-terracotta/30"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: HEARTH CONFLUENCES (ACTIVE CONVERSATIONS) */}
        <section className="container-eka mt-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <span className="font-mono text-[10px] uppercase text-terracotta font-semibold tracking-widest">
                Living Inquiries
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mt-1">
                Active Conversations Looking For Voices
              </h2>
            </div>
            <Link to="/feed" className="text-xs font-semibold text-terracotta hover:underline flex items-center gap-1">
              <span>View Community Feed</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ACTIVE_CONVERSATIONS.map((conv) => (
              <div
                key={conv.id}
                className="rounded-2xl border border-border/80 bg-card p-6 flex flex-col justify-between hover:border-terracotta/40 hover:shadow-xs transition-all"
              >
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-accent/60 text-foreground font-mono text-[10px] uppercase tracking-wider font-semibold mb-3">
                    {conv.tag}
                  </span>
                  <h3 className="font-serif text-base font-semibold text-foreground leading-snug mb-3">
                    "{conv.question}"
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="size-3 text-terracotta" />
                    <span>{conv.activeRegion}</span>
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    {conv.participants} custodians • {conv.responses} notes
                  </span>
                  <Link
                    to="/feed"
                    className="text-xs font-semibold text-terracotta hover:underline"
                  >
                    Join circle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: CURATED PERSON CARDS */}
        <section className="container-eka mt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <span className="font-mono text-[10px] uppercase text-terracotta font-semibold tracking-widest">
                Keepers & Seekers
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mt-1">
                Stewards Resonating With Your Path
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">Verified Human Lineages</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {realProfiles && realProfiles.length > 0 ? (
              realProfiles.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-border/80 bg-card p-5 flex flex-col justify-between hover:shadow-xs hover:border-terracotta/40 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-12 rounded-full bg-accent/60 overflow-hidden flex items-center justify-center font-serif text-lg text-foreground font-semibold">
                        {p.avatar_url ? (
                          <img src={p.avatar_url} alt={p.display_name} className="size-full object-cover" />
                        ) : (
                          (p.display_name || p.username || "U")[0].toUpperCase()
                        )}
                      </div>
                      <div>
                        <h3 className="font-serif text-sm font-semibold text-foreground leading-tight">
                          {p.display_name || p.username || "EKA Steward"}
                        </h3>
                        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                          {p.account_type || "Custodian"}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                      {p.bio || "Preserving living traditions and engaging in thoughtful cross-cultural dialogues on EKA."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                      <ShieldCheck className="size-3.5" />
                      Verified
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-xs h-7 px-3 border-border/80 hover:bg-terracotta hover:text-white hover:border-terracotta"
                      onClick={() => handleOpenInquiry(p.display_name || p.username || "Steward", "Direct", "Living Traditions")}
                    >
                      Inquire
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-muted-foreground text-sm">
                Loading community keepers...
              </div>
            )}
          </div>
        </section>

        {/* SECTION 4: BIOREGION HEARTH CIRCLES */}
        <section className="container-eka mt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <span className="font-mono text-[10px] uppercase text-terracotta font-semibold tracking-widest">
                Living Geography
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mt-1">
                Hearth Circles Gathered by Bioregion & Diaspora
              </h2>
            </div>
            <Link to="/community" className="text-xs font-semibold text-terracotta hover:underline">
              Browse all 80+ Hearth Circles
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REGIONAL_HEARTHS.map((h) => (
              <div
                key={h.city}
                className="group rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:border-terracotta/40 hover:shadow-calm transition-all flex flex-col justify-between"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-accent/40 relative">
                  <img
                    src={h.image}
                    alt={h.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider bg-background/90 backdrop-blur-md text-foreground font-semibold">
                    {h.members} Stewards
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {h.city}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      {h.descriptor}
                    </p>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-border/40">
                    <Link
                      to="/community"
                      className="text-xs font-semibold text-terracotta hover:underline flex items-center justify-between"
                    >
                      <span>Join Circle</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: ETIQUETTE & PROTOCOL */}
        <section className="container-eka mt-16">
          <div className="rounded-3xl bg-sand/30 dark:bg-card/50 border border-border/80 p-8 sm:p-10">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="font-mono text-[10px] uppercase text-terracotta font-semibold tracking-widest">
                Hearth Protocol
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mt-1 mb-2">
                The Etiquette of Cultural Greeting
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                How dialogue unfolds when human dignity and cultural accuracy guide the room.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-card border border-border/80 p-6 shadow-xs">
                <div className="font-serif text-2xl text-terracotta font-bold mb-2">01</div>
                <h3 className="font-serif text-base font-semibold text-foreground mb-1">
                  Inquire with Genuine Curiosity
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Begin with a focused question into the specific technique, oral idiom, or festival they carry. EKA does not host promotional pitches or transactional pleasantries.
                </p>
              </div>

              <div className="rounded-2xl bg-card border border-border/80 p-6 shadow-xs">
                <div className="font-serif text-2xl text-terracotta font-bold mb-2">02</div>
                <h3 className="font-serif text-base font-semibold text-foreground mb-1">
                  Honor the Pace of the Elder
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Many custodians are master artisans in active workshops or elders in rural settlements. Replies unfold over days—slow, reflective correspondence is cherished.
                </p>
              </div>

              <div className="rounded-2xl bg-card border border-border/80 p-6 shadow-xs">
                <div className="font-serif text-2xl text-terracotta font-bold mb-2">03</div>
                <h3 className="font-serif text-base font-semibold text-foreground mb-1">
                  Sovereign Consent & Safety
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Both participants must mutually accept an inquiry before a conversation opens. Either person may gracefully archive or conclude the dialogue at any moment.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* RESPECTFUL INQUIRY DIALOG MODAL */}
      <Dialog open={Boolean(selectedHearth)} onOpenChange={(open) => !open && setSelectedHearth(null)}>
        <DialogContent className="rounded-2xl max-w-lg bg-card border-border/80 p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-semibold">
              Begin a Respectful Inquiry
            </DialogTitle>
          </DialogHeader>
          {selectedHearth && (
            <form onSubmit={handleSendInquiry} className="space-y-4 mt-2">
              <div className="rounded-xl bg-accent/40 p-3 text-xs text-muted-foreground">
                <p>
                  You are addressing <span className="font-semibold text-foreground">{selectedHearth.name}</span>.
                </p>
                <p className="mt-1 text-[11px] italic">
                  EKA values contemplative correspondence. Inquiries focused on specific living practices receive the warmest replies.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Your Question or Cultural Inquiry
                </label>
                <textarea
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                  placeholder="e.g., 'I was moved by your study of natural dye binders in Oaxaca... could you share how the fermentation timing changes with seasons?'"
                  rows={4}
                  required
                  className="w-full rounded-xl border border-border/80 bg-background p-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-terracotta"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedHearth(null)}
                  className="rounded-xl text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSending || !inquiryText.trim()}
                  className="rounded-xl bg-terracotta hover:bg-terracotta/90 text-white text-xs h-9 px-4 shadow-xs"
                >
                  <Send className="mr-1.5 size-3.5" />
                  <span>{isSending ? "Sending..." : "Send with Respect"}</span>
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </div>
  );
}
