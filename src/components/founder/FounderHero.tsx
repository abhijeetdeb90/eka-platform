import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Compass,
  Sparkles,
  ShieldCheck,
  Users,
  BookOpen,
  ArrowRight,
  Share2,
  Check,
  MessageSquare,
  Building,
  Layers,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FOUNDER_PROFILE } from "@/lib/founder-data";
import { EkaLogo } from "@/components/brand/Logo";

export function FounderHero({ onOpenStudio }: { onOpenStudio: () => void }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [activeStoryTab, setActiveStoryTab] = useState<
    "vision" | "story" | "why" | "building" | "mission"
  >("vision");

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
    toast.success(
      !isFollowing
        ? "You are now following AD & EKA dispatches."
        : "Unfollowed founder dispatches.",
    );
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      toast.error("Please fill in all fields.");
      return;
    }
    toast.success("Message dispatched to AD's office. Thank you for reaching out.");
    setIsContactOpen(false);
    setContactName("");
    setContactEmail("");
    setContactMessage("");
  };

  const handleShareProfile = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "https://eka.app/founder/ad";
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AD — Founder of EKA",
          text: "Building the trusted intelligence layer for the world's cultures, communities and local knowledge.",
          url,
        });
      } catch {
        // Ignored
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      toast.success("Founder profile link copied to clipboard.");
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-gradient-to-b from-card/80 via-sand/20 to-background pt-4 pb-12 sm:pt-10 sm:pb-16 lg:pt-16 lg:pb-24">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-saffron/15 via-terracotta/10 to-transparent blur-3xl"
      />

      <div className="container-eka">
        {/* Top Breadcrumb & Brand alignment */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3 sm:pb-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="transition-opacity hover:opacity-80">
              <EkaLogo withTagline={false} />
            </Link>
            <span className="text-muted-foreground/60">/</span>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              Founder Profile
            </span>
            <Badge
              variant="outline"
              className="border-forest/40 bg-forest/5 text-forest text-[11px]"
            >
              Verified Founder
            </Badge>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareProfile}
              className="rounded-xl border-border/80 bg-card/60 text-xs min-h-[38px] sm:min-h-[44px]"
            >
              <Share2 className="mr-1.5 size-3.5" />
              <span>Share Profile</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              data-testid="founder-studio-btn"
              onClick={onOpenStudio}
              className="rounded-xl border-terracotta/40 bg-terracotta/5 text-terracotta hover:bg-terracotta/10 text-xs min-h-[38px] sm:min-h-[44px]"
            >
              <Sparkles className="mr-1.5 size-3.5" />
              <span>Founder Studio</span>
            </Button>
          </div>
        </div>

        {/* Main Founder Header Grid */}
        <div className="mt-4 sm:mt-8 lg:mt-10 grid gap-6 lg:gap-14 items-start lg:grid-cols-[320px_1fr]">
          {/* Portrait Column (Desktop: left sidebar; Mobile: compact avatar under header) */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-2 lg:order-1">
            <div className="relative group">
              <div
                aria-hidden="true"
                className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-saffron/30 via-terracotta/20 to-primary-soft/40 blur-xl opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="relative size-36 overflow-hidden rounded-3xl border-2 border-border/90 bg-card p-1.5 shadow-lift sm:size-48 lg:size-72">
                <img
                  src={FOUNDER_PROFILE.avatar}
                  alt="AD — Founder of EKA holding a field notebook in a heritage courtyard"
                  className="size-full rounded-2xl object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 lg:left-8 lg:translate-x-0 rounded-full border border-border/80 bg-background/95 px-3.5 py-1 text-[11px] font-medium tracking-wider uppercase text-foreground shadow-calm backdrop-blur-md whitespace-nowrap">
                AD · Founder, EKA
              </div>
            </div>

            {/* Desktop-only Follow and Connect buttons */}
            <div className="mt-8 hidden lg:block w-full space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={handleFollowToggle}
                  size="sm"
                  className={`min-h-[44px] rounded-xl px-5 transition-all ${
                    isFollowing
                      ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-calm"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <Check className="mr-1.5 size-3.5 text-forest" />
                      <span>Following Dispatches</span>
                    </>
                  ) : (
                    <>
                      <Heart className="mr-1.5 size-3.5" />
                      <span>Follow AD</span>
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setIsContactOpen(true)}
                  variant="outline"
                  size="sm"
                  className="min-h-[44px] rounded-xl border-border/80 bg-card/70"
                >
                  <MessageSquare className="mr-1.5 size-3.5" />
                  <span>Connect / Message</span>
                </Button>
              </div>
            </div>

            {/* Desktop-only Stats Matrix */}
            <div className="mt-6 hidden lg:grid grid-cols-2 gap-3 pt-3 w-full">
              <div className="rounded-xl border border-border/70 bg-card/60 p-3 text-center">
                <div className="font-display text-xl font-semibold text-foreground">
                  {FOUNDER_PROFILE.stats.contributionsValidated.toLocaleString()}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">
                  Records Validated
                </div>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/60 p-3 text-center">
                <div className="font-display text-xl font-semibold text-foreground">
                  {FOUNDER_PROFILE.stats.communitiesConnected}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">
                  Partner Guilds
                </div>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/60 p-3 text-center">
                <div className="font-display text-xl font-semibold text-foreground">
                  {FOUNDER_PROFILE.stats.lineagesRecorded}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">
                  Living Lineages
                </div>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/60 p-3 text-center">
                <div className="font-display text-xl font-semibold text-foreground">
                  {FOUNDER_PROFILE.stats.openInquiries}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">
                  Open Inquiries
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Positioning & Story Matrix (order-1 on mobile for first viewport) */}
          <div className="space-y-6 order-1 lg:order-2 text-center lg:text-left">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-3.5 py-1 text-xs tracking-[0.2em] text-terracotta uppercase">
                <span className="size-1.5 rounded-full bg-terracotta" />
                <span>Founder Narrative & Architecture</span>
              </div>
              <h1 className="mt-3 font-display text-3xl leading-tight sm:text-5xl lg:text-6xl text-foreground">
                AD
                <span className="block font-display text-xl font-light text-muted-foreground sm:text-3xl mt-1">
                  Founder, EKA
                </span>
              </h1>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base font-light leading-relaxed text-foreground/90 max-w-2xl sm:text-xl mx-auto lg:mx-0">
                {FOUNDER_PROFILE.positioning}
              </p>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-2xl mx-auto lg:mx-0 hidden sm:block">
                {FOUNDER_PROFILE.shortBio}
              </p>
            </div>

            {/* First Viewport Primary CTAs (Mobile & Desktop) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
              <Button
                asChild
                size="default"
                className="min-h-[44px] rounded-xl px-5 text-sm shadow-calm"
              >
                <Link to="/join">
                  <span>Explore EKA</span>
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button
                onClick={() => {
                  setActiveStoryTab("vision");
                  const el = document.getElementById("narrative-tabs");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                variant="outline"
                size="default"
                className="min-h-[44px] rounded-xl border-border/80 bg-card/70 px-4 text-sm"
              >
                <span>Read the Vision</span>
              </Button>

              {/* Mobile-only quick Follow & Message actions */}
              <div className="flex lg:hidden items-center gap-1.5">
                <Button
                  onClick={handleFollowToggle}
                  size="sm"
                  variant="ghost"
                  className="min-h-[44px] rounded-xl px-3 text-xs"
                >
                  <Heart
                    className={`mr-1.5 size-3.5 ${isFollowing ? "fill-terracotta text-terracotta" : ""}`}
                  />
                  <span>{isFollowing ? "Following" : "Follow"}</span>
                </Button>
                <Button
                  onClick={() => setIsContactOpen(true)}
                  size="sm"
                  variant="ghost"
                  className="min-h-[44px] rounded-xl px-3 text-xs"
                >
                  <MessageSquare className="mr-1.5 size-3.5" />
                  <span>Connect</span>
                </Button>
              </div>
            </div>

            {/* Interactive Narrative Tabs */}
            <div
              id="narrative-tabs"
              className="rounded-2xl border border-border/80 bg-card/80 p-4 sm:p-5 shadow-calm backdrop-blur-xs text-left"
            >
              <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
                <button
                  type="button"
                  data-testid="tab-vision"
                  onClick={() => setActiveStoryTab("vision")}
                  className={`min-h-[44px] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium transition-all ${
                    activeStoryTab === "vision"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  The Vision
                </button>
                <button
                  type="button"
                  data-testid="tab-story"
                  onClick={() => setActiveStoryTab("story")}
                  className={`min-h-[44px] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium transition-all ${
                    activeStoryTab === "story"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  Founder Story
                </button>
                <button
                  type="button"
                  data-testid="tab-why"
                  onClick={() => setActiveStoryTab("why")}
                  className={`min-h-[44px] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium transition-all ${
                    activeStoryTab === "why"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  Why EKA Exists
                </button>
                <button
                  type="button"
                  data-testid="tab-building"
                  onClick={() => setActiveStoryTab("building")}
                  className={`min-h-[44px] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium transition-all ${
                    activeStoryTab === "building"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  What I Am Building
                </button>
                <button
                  type="button"
                  data-testid="tab-mission"
                  onClick={() => setActiveStoryTab("mission")}
                  className={`min-h-[44px] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium transition-all ${
                    activeStoryTab === "mission"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  Long-Term Mission
                </button>
              </div>

              <div className="mt-4 min-h-[110px] text-sm leading-relaxed text-muted-foreground">
                {activeStoryTab === "vision" && (
                  <div className="space-y-2">
                    <p className="font-display text-base text-foreground font-normal">
                      The Living Civilizational Substrate
                    </p>
                    <p>{FOUNDER_PROFILE.vision}</p>
                  </div>
                )}
                {activeStoryTab === "story" && (
                  <div className="space-y-2">
                    <p className="font-display text-base text-foreground font-normal">
                      From Temple Archives to Frontier AI
                    </p>
                    <p>{FOUNDER_PROFILE.founderStory}</p>
                  </div>
                )}
                {activeStoryTab === "why" && (
                  <div className="space-y-2">
                    <p className="font-display text-base text-foreground font-normal">
                      Beyond the Outrage Algorithm
                    </p>
                    <p>{FOUNDER_PROFILE.whyEkaExists}</p>
                  </div>
                )}
                {activeStoryTab === "building" && (
                  <div className="space-y-2">
                    <p className="font-display text-base text-foreground font-normal">
                      The 5-Layer Technology Architecture
                    </p>
                    <p>{FOUNDER_PROFILE.whatAdIsBuilding}</p>
                  </div>
                )}
                {activeStoryTab === "mission" && (
                  <div className="space-y-2">
                    <p className="font-display text-base text-foreground font-normal">
                      Anchoring Artificial Intelligence to Human Heritage
                    </p>
                    <p>{FOUNDER_PROFILE.longTermMission}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Featured Strategic Initiatives */}
            <div className="text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-3">
                Featured Strategic Initiatives Directed by AD
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {FOUNDER_PROFILE.initiatives.map((init) => (
                  <div
                    key={init.title}
                    className="rounded-xl border border-border/70 bg-card/60 p-4 transition-all hover:border-primary/40 hover:shadow-calm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-terracotta uppercase tracking-wider">
                        {init.status}
                      </span>
                      <span className="rounded-full bg-sand/60 px-2 py-0.5 text-[10px] font-semibold text-foreground">
                        {init.metric}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-sm font-medium text-foreground">
                      {init.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground font-light">
                      {init.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile-only Stats Matrix placed after initiatives */}
            <div className="grid lg:hidden grid-cols-2 gap-3 pt-2 w-full text-left">
              <div className="rounded-xl border border-border/70 bg-card/60 p-3 text-center">
                <div className="font-display text-lg sm:text-xl font-semibold text-foreground">
                  {FOUNDER_PROFILE.stats.contributionsValidated.toLocaleString()}
                </div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">
                  Records Validated
                </div>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/60 p-3 text-center">
                <div className="font-display text-lg sm:text-xl font-semibold text-foreground">
                  {FOUNDER_PROFILE.stats.communitiesConnected}
                </div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">
                  Partner Guilds
                </div>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/60 p-3 text-center">
                <div className="font-display text-lg sm:text-xl font-semibold text-foreground">
                  {FOUNDER_PROFILE.stats.lineagesRecorded}
                </div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">
                  Living Lineages
                </div>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/60 p-3 text-center">
                <div className="font-display text-lg sm:text-xl font-semibold text-foreground">
                  {FOUNDER_PROFILE.stats.openInquiries}
                </div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">
                  Open Inquiries
                </div>
              </div>
            </div>

            {/* Prominent CTA */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-xl px-7 py-6 text-base shadow-calm hover:shadow-lift"
              >
                <Link to="/join">
                  <span>Explore EKA</span>
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl border-border/80 bg-card/60 px-6 py-6 text-sm"
              >
                <Link to="/membership">
                  <span>EKA Membership (₹299/mo)</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Connect / Message Dialog */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border-border bg-card p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Connect with AD's Office</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              For research inquiries, lineage preservation proposals, institutional mutt
              partnerships, or technical collaborations.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleContactSubmit} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact-name">Your Full Name</Label>
              <Input
                id="contact-name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Dr. Raghav Sharma / Smt. Ananya Sen"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-email">Email Address</Label>
              <Input
                id="contact-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="name@institution.org"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-message">Message or Ingestion Proposal</Label>
              <Textarea
                id="contact-message"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Describe your research, living lineage records, or partnership idea..."
                rows={4}
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsContactOpen(false)}
                className="min-h-[44px]"
              >
                Cancel
              </Button>
              <Button type="submit" className="min-h-[44px]">
                Submit Dispatches
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
