// ==============================================================================
// MY EKA — USER'S PERSONAL SANCTUARY LAYER
// ==============================================================================
// Personal archive & management:
// Profile · Saved Stories · Saved Knowledge · Saved Places · Communities ·
// Messages · Creator Dashboard · Preferences · Privacy (DPDP)
// ==============================================================================

import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Bookmark,
  BookOpen,
  Film,
  MapPin,
  Users,
  MessageSquare,
  Settings,
  ShieldCheck,
  Sparkles,
  LogOut,
  LogIn,
  ChevronRight,
  Clock,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { track } from "@/lib/analytics";
import { MetaTags } from "@/components/seo";

export const Route = createFileRoute("/my-eka")({
  head: () => ({
    meta: [
      { title: "My EKA — Personal Sanctuary & Archive | EKA" },
      {
        name: "description",
        content:
          "Manage your personalized cultural archive, saved stories, sacred place bookmarks, wisdom passport, and community connections.",
      },
    ],
  }),
  component: MyEkaPage,
});

function MyEkaPage() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const [activeTab, setActiveTab] = useState("overview");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    void navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-sand/20 dark:bg-stone-950 text-foreground flex flex-col selection:bg-terracotta/20">
      <MetaTags
        title="My EKA — Personal Cultural Sanctuary"
        description="Manage your personalized cultural archive, saved stories, sacred place bookmarks, wisdom passport, and community connections."
        ogTitle="My EKA — Personal Sanctuary"
        ogDescription="Your personal cultural archive and wisdom passport."
        canonicalUrl="/my-eka"
        noIndex={true}
      />
      <SiteHeader />

      <main id="main-content" className="flex-1 py-8 sm:py-14 space-y-8">
        <div className="container-eka max-w-5xl space-y-8">
          {/* Profile Sanctuary Card */}
          <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-calm">
            {profile ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="size-16 sm:size-20 rounded-full border-2 border-primary/30 overflow-hidden bg-accent flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.display_name || "Profile"}
                        className="size-full object-cover"
                      />
                    ) : (
                      <User className="size-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                        {profile.display_name || profile.username || "Seeker"}
                      </h1>
                      <Badge variant="secondary" className="text-[10px]">
                        Sanctuary Member
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm font-mono text-muted-foreground">
                      @{profile.username || "sanctuary_seeker"}
                    </p>
                    {profile.interests && profile.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {profile.interests.map((int: string) => (
                          <span
                            key={int}
                            className="rounded-full bg-sand/40 border border-border/60 px-2.5 py-0.5 text-[10px] font-mono text-muted-foreground"
                          >
                            {int}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-xl text-xs"
                  >
                    <Link to="/app/settings">
                      <Settings className="size-3.5 mr-1.5" />
                      <span>Settings</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="rounded-xl text-xs text-destructive hover:text-destructive"
                  >
                    <LogOut className="size-3.5 mr-1" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4 max-w-md mx-auto">
                <div className="size-14 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                  <User className="size-7" />
                </div>
                <div className="space-y-1">
                  <h1 className="font-serif text-2xl font-bold text-foreground">
                    Welcome to My EKA
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground font-light">
                    Sign in to personalize your cultural journey, save stories, bookmark sacred places, and join living Sanghas.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button asChild className="rounded-xl px-5 bg-primary">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-xl px-5">
                    <Link to="/join">Join Archive</Link>
                  </Button>
                </div>
              </div>
            )}
          </section>

          {/* Personal Sanctuary Tabs */}
          <section className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-card border border-border/70 p-1 rounded-2xl flex-wrap h-auto gap-1">
                <TabsTrigger value="overview" className="rounded-xl text-xs">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="stories" className="rounded-xl text-xs">
                  Saved Stories
                </TabsTrigger>
                <TabsTrigger value="knowledge" className="rounded-xl text-xs">
                  Wisdom Passport
                </TabsTrigger>
                <TabsTrigger value="places" className="rounded-xl text-xs">
                  Saved Places
                </TabsTrigger>
                <TabsTrigger value="communities" className="rounded-xl text-xs">
                  Communities
                </TabsTrigger>
                <TabsTrigger value="messages" className="rounded-xl text-xs">
                  Messages
                </TabsTrigger>
                <TabsTrigger value="privacy" className="rounded-xl text-xs">
                  Privacy & Language
                </TabsTrigger>
              </TabsList>

              {/* 1. Overview */}
              <TabsContent value="overview" className="space-y-6 pt-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: "Cultural Lineages", val: "14 Explored" },
                    { label: "Saved Reels", val: "8 Stories" },
                    { label: "Active Sanghas", val: "3 Circles" },
                    { label: "Inquiries Asked", val: "6 Answered" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-4 rounded-2xl border border-border/70 bg-card shadow-xs text-center space-y-1"
                    >
                      <p className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                        {stat.val.split(" ")[0]}
                      </p>
                      <p className="text-[11px] font-mono text-muted-foreground uppercase">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link
                    to="/stories"
                    className="p-5 rounded-2xl border border-border/70 bg-card hover:border-terracotta/50 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <Film className="size-5 text-terracotta" />
                      <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <h3 className="font-serif font-bold text-sm text-foreground">
                      Watch Cultural Reels
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Experience living traditions in 9:16 vertical storytelling.
                    </p>
                  </Link>

                  <Link
                    to="/ask"
                    search={{ q: "" } as any}
                    className="p-5 rounded-2xl border border-border/70 bg-card hover:border-primary/50 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <Sparkles className="size-5 text-saffron" />
                      <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <h3 className="font-serif font-bold text-sm text-foreground">
                      Ask EKA Intelligence
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Query traditions and verified primary sources in any language.
                    </p>
                  </Link>

                  <Link
                    to="/discover"
                    className="p-5 rounded-2xl border border-border/70 bg-card hover:border-blue-400/50 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <Compass className="size-5 text-blue-400" />
                      <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <h3 className="font-serif font-bold text-sm text-foreground">
                      Cultural Map of Earth
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Explore holy confluences, artisan villages, and sacred places.
                    </p>
                  </Link>
                </div>
              </TabsContent>

              {/* 2. Saved Stories */}
              <TabsContent value="stories" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold">Bookmarked Cultural Reels</h3>
                  <Link to="/stories" className="text-xs text-primary hover:underline">
                    Browse Stories →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      title: "The Twilight Fire Offering of Dashashwamedh",
                      place: "Varanasi, India",
                      image: "/places/varanasi.jpg",
                    },
                    {
                      title: "Chado: Silence Whispered into Matcha",
                      place: "Kyoto, Japan",
                      image: "/places/kyoto.jpg",
                    },
                    {
                      title: "Aranmula Kannadi: Sacred Metal Mirrors",
                      place: "Kerala, India",
                      image: "/content/monastery-corridor.jpg",
                    },
                  ].map((s) => (
                    <div
                      key={s.title}
                      className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs"
                    >
                      <img src={s.image} alt={s.title} className="h-40 w-full object-cover" />
                      <div className="p-4 space-y-1">
                        <span className="text-[10px] font-mono text-terracotta">{s.place}</span>
                        <h4 className="font-serif font-bold text-sm line-clamp-1">{s.title}</h4>
                        <Link
                          to="/stories"
                          className="inline-block pt-1 text-xs text-primary hover:underline font-medium"
                        >
                          Watch Story →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* 3. Wisdom Passport */}
              <TabsContent value="knowledge" className="space-y-4 pt-4">
                <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5 space-y-2">
                  <h3 className="font-serif text-base font-bold text-foreground">
                    Your Wisdom Passport
                  </h3>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    A private sanctuary storing your inquiries, philosophical notes, and primary citations without data monetization.
                  </p>
                  <Button asChild size="sm" className="rounded-xl text-xs mt-2">
                    <Link to="/app/passport">Open Full Passport</Link>
                  </Button>
                </div>
              </TabsContent>

              {/* 4. Saved Places */}
              <TabsContent value="places" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold">Saved Cultural Places</h3>
                  <Link to="/discover" className="text-xs text-primary hover:underline">
                    Explore Map →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Kashi (Varanasi)",
                      desc: "The city of light along the sacred crescent of the Ganges.",
                      badge: "Sacred Geography",
                    },
                    {
                      name: "Majuli Island",
                      desc: "The world's largest river island preserving unbroken Sattriya monastic arts.",
                      badge: "Living Heritage",
                    },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="p-4 rounded-2xl border border-border/70 bg-card space-y-2"
                    >
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {p.badge}
                      </Badge>
                      <h4 className="font-serif font-bold text-base">{p.name}</h4>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                      <Link
                        to="/discover"
                        className="text-xs text-primary hover:underline font-medium block pt-1"
                      >
                        View on Map →
                      </Link>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* 5. Communities */}
              <TabsContent value="communities" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold">Your Sanghas</h3>
                  <Link to="/community" className="text-xs text-primary hover:underline">
                    Discover More Circles →
                  </Link>
                </div>
                <div className="p-6 rounded-2xl border border-dashed border-border text-center space-y-2">
                  <Users className="size-6 text-muted-foreground mx-auto" />
                  <p className="text-xs text-muted-foreground">
                    Connect with fellow seekers and practitioners in dedicated community circles.
                  </p>
                  <Button asChild size="sm" variant="outline" className="rounded-xl text-xs">
                    <Link to="/community">Explore Communities</Link>
                  </Button>
                </div>
              </TabsContent>

              {/* 6. Messages */}
              <TabsContent value="messages" className="space-y-4 pt-4">
                <div className="p-6 rounded-2xl border border-border/70 bg-card text-center space-y-3">
                  <MessageSquare className="size-6 text-primary mx-auto" />
                  <h4 className="font-serif font-bold text-base">Direct Messages & Inquiries</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Manage direct conversations with elders, master artisans, and community stewards.
                  </p>
                  <Button asChild size="sm" className="rounded-xl text-xs">
                    <Link to={"/messages" as any}>Open Messaging Console</Link>
                  </Button>
                </div>
              </TabsContent>

              {/* 7. Privacy & Language */}
              <TabsContent value="privacy" className="space-y-4 pt-4">
                <div className="rounded-2xl border border-border/70 bg-card p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div>
                      <h4 className="font-display font-semibold text-sm">Interface Language</h4>
                      <p className="text-xs text-muted-foreground">
                        Change your preferred reading and discovery script.
                      </p>
                    </div>
                    <LanguageSelector variant="pill" />
                  </div>

                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div>
                      <h4 className="font-display font-semibold text-sm">DPDP Privacy Rights</h4>
                      <p className="text-xs text-muted-foreground">
                        EKA does not sell cultural inquiries or personal data to ad brokers.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild className="rounded-xl text-xs">
                      <Link to="/privacy">Review Consent</Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
