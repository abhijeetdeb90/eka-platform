import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LogIn,
  ArrowRight,
  Sparkles,
  Compass,
  PlusCircle,
  User,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Mail,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EkaLogo } from "@/components/brand/Logo";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

interface EKAHomeAuthPanelProps {
  className?: string;
}

export function EKAHomeAuthPanel({ className = "" }: EKAHomeAuthPanelProps) {
  const navigate = useNavigate();
  const { data: profile, isLoading: isProfileLoading, refetch } = useProfile();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Monitor Supabase auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessionUser(data.session?.user ?? null);
      setCheckingSession(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user ?? null);
      setCheckingSession(false);
      refetch();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [refetch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      toast.error("Please enter your email or username, and password.");
      return;
    }

    setBusy(true);
    try {
      let emailToUse = identifier.trim();

      // If user provided a username without '@', look up corresponding email if available
      if (!emailToUse.includes("@")) {
        const { data: profileMatch } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", emailToUse.toLowerCase())
          .maybeSingle();

        // In standard Supabase auth, signIn requires email, but if profile found we use entered text as email fallback or inform user
        if (!profileMatch) {
          // If not found as username, try as email directly in case
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Welcome back to EKA.");
      navigate({ to: "/app" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to sign in. Please check your credentials.";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleLogin = async () => {
    setBusy(true);
    try {
      const redirectTo = `${window.location.origin}/app`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign in was interrupted.");
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSessionUser(null);
    toast.info("Signed out of EKA.");
  };

  const isAuthenticated = Boolean(sessionUser || profile);

  return (
    <div
      className={`relative rounded-3xl border border-border/80 bg-card/95 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between shadow-calm ${className}`}
    >
      {/* Decorative calm background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-sand/30 rounded-bl-full pointer-events-none -z-10" />

      {checkingSession ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3 text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-terracotta" />
          <p className="text-xs font-mono">Connecting to sanctuary...</p>
        </div>
      ) : isAuthenticated ? (
        /* ==================================================================== */
        /* AUTHENTICATED STATE */
        /* ==================================================================== */
        <div className="space-y-6 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-widest text-terracotta font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" />
                Sanctuary Member
              </span>
              <button
                onClick={handleSignOut}
                aria-label="Sign out"
                className="text-xs font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
              >
                <LogOut className="size-3" />
                <span>Sign out</span>
              </button>
            </div>

            <h2 className="font-display font-serif text-2xl font-normal text-foreground">
              Welcome back,{" "}
              <span className="italic text-terracotta">
                {profile?.display_name || sessionUser?.user_metadata?.display_name || "Seeker"}
              </span>
            </h2>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Your reflective space, saved stories, and cultural inquiries are ready.
            </p>
          </div>

          <div className="space-y-2.5 my-auto py-2">
            <Link to="/app" className="block">
              <Button
                variant="default"
                className="w-full justify-between rounded-xl py-5 bg-terracotta hover:bg-terracotta/90 text-white font-medium text-xs font-mono tracking-wider uppercase shadow-xs group"
              >
                <span className="flex items-center gap-2">
                  <Compass className="size-4" />
                  Continue Exploring
                </span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link to="/create" className="block">
              <Button
                variant="outline"
                className="w-full justify-between rounded-xl py-5 text-xs font-mono tracking-wider uppercase border-border/80 hover:bg-accent/40 group"
              >
                <span className="flex items-center gap-2">
                  <PlusCircle className="size-4 text-saffron" />
                  Create on EKA
                </span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link to="/discover" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start rounded-xl py-5 text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-foreground"
              >
                <Sparkles className="size-4 text-amber-500 mr-2" />
                Discover World Cultures
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>EKA Sanctuary</span>
            <span className="text-terracotta">One With All</span>
          </div>
        </div>
      ) : (
        /* ==================================================================== */
        /* NON-AUTHENTICATED LOGIN PANEL */
        /* ==================================================================== */
        <div className="space-y-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-display font-serif text-2xl font-normal text-foreground">
                Log into EKA
              </h2>
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Sign In
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Step into your sanctuary of world cultures and living stories.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="home-identifier" className="text-xs font-medium text-foreground">
                Mobile number, username or email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  id="home-identifier"
                  type="text"
                  placeholder="name@domain.com or @handle"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={busy}
                  required
                  autoComplete="username email"
                  className="pl-9 rounded-xl bg-background border-border/80 text-sm focus-visible:ring-1 focus-visible:ring-terracotta h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="home-password" className="text-xs font-medium text-foreground">
                  Password
                </Label>
                <Link
                  to="/auth"
                  className="text-[11px] font-mono text-terracotta hover:underline"
                >
                  Need help?
                </Link>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  id="home-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={busy}
                  required
                  autoComplete="current-password"
                  className="pl-9 rounded-xl bg-background border-border/80 text-sm focus-visible:ring-1 focus-visible:ring-terracotta h-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl py-5 bg-terracotta hover:bg-terracotta/90 text-white font-medium text-xs font-mono tracking-wider uppercase gap-2 shadow-xs transition-all mt-1"
            >
              {busy ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="size-3.5" />
                  <span>Log in</span>
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/70" />
            </div>
            <span className="relative px-3 bg-card text-[11px] font-mono text-muted-foreground uppercase">
              or
            </span>
          </div>

          {/* Continue with Google */}
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={handleGoogleLogin}
            className="w-full rounded-xl py-5 border-border/80 bg-background/80 hover:bg-sand/30 text-foreground font-medium text-xs font-mono tracking-wider uppercase gap-2.5 transition-colors"
          >
            <svg className="size-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>

          {/* Join Link */}
          <div className="pt-2 text-center text-xs text-muted-foreground">
            <span>New to EKA? </span>
            <Link
              to="/join"
              className="font-semibold text-terracotta hover:underline ml-1"
            >
              Join EKA →
            </Link>
          </div>

          {/* Footer Logo & Tagline */}
          <div className="pt-3 border-t border-border/50 flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground/80">
              One Within. One With All.
            </span>
            <span className="size-1.5 rounded-full bg-terracotta/60" />
          </div>
        </div>
      )}
    </div>
  );
}
