import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EkaLogo } from "@/components/brand/Logo";
import { track } from "@/lib/analytics";
import { applyJoinAnswers, loadAnswers } from "@/lib/join";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (search: { next?: unknown }): { next?: string | undefined } => {
    const raw = typeof search.next === "string" ? search.next : "";
    // Only same-origin relative paths are safe to return to.
    return { next: raw.startsWith("/") && !raw.startsWith("//") ? raw : undefined };
  },
  head: () => ({
    meta: [
      { title: "Join EKA — The Social Network for Your Inner Life" },
      {
        name: "description",
        content: "Sign in or create your EKA account to connect, explore, practice and belong.",
      },
      { property: "og:title", content: "Join EKA" },
      { property: "og:description", content: "The social network for your inner life." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [joinAnswers, setJoinAnswers] = useState(() => loadAnswers());

  // Anything gathered in the questionnaire carries over, so nothing is retyped.
  useEffect(() => {
    const saved = loadAnswers();
    setJoinAnswers(saved);
    if (saved.name) setName(saved.name);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: next || "/app" });
    });
  }, [navigate, next]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        if (!joinAnswers.standardsAccepted) {
          navigate({ to: "/join" });
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${next || "/app"}`,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Welcome to EKA.");
        track("signup");
        void applyJoinAnswers();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: next || "/app" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    if (mode === "signup" && !joinAnswers.standardsAccepted) {
      navigate({ to: "/join" });
      return;
    }
    setBusy(true);
    try {
      const redirectTo = `${window.location.origin}${next || "/app"}`;
      // Direct Supabase OAuth with Google Provider & PKCE flow
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

      if (error) {
        // Graceful fallback for Lovable hosted preview broker if native keys are unset
        console.warn("Direct Supabase OAuth notice:", error.message);
        const result = await lovable.auth.signInWithOAuth("google", {
          redirect_uri: redirectTo,
        });
        if (result.error) throw result.error;
        if (result.redirected) return;
      }
      track(mode === "signup" ? "signup" : "login");
      void applyJoinAnswers();
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error(error instanceof Error ? error.message : "Google sign-in did not complete.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm animate-rise">
        <Link to="/">
          <EkaLogo />
        </Link>
        <h1 className="mt-8 text-3xl leading-snug">
          {mode === "signup" ? "Join EKA" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">One Within. One With All.</p>

        {mode === "signup" &&
          (joinAnswers.standardsAccepted ? (
            <p className="mt-5 rounded-2xl border border-border bg-card p-4 text-sm">
              Signing up as <span className="font-medium">{joinAnswers.name || "you"}</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Community Standards agreed.{" "}
                <Link to="/join" className="underline underline-offset-4">
                  Change your answers
                </Link>
              </span>
            </p>
          ) : (
            <p className="mt-5 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
              New here? A few short questions and the{" "}
              <Link to="/standards" className="underline underline-offset-4">
                Community Standards
              </Link>{" "}
              come first.{" "}
              <Link to="/join" className="underline underline-offset-4 text-foreground">
                Start there
              </Link>
              .
            </p>
          ))}

        <form onSubmit={submit} className="mt-8 space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {mode === "signup" ? "Create account" : "Sign in"}
          </Button>
        </form>

        <Button variant="outline" className="mt-3 w-full" onClick={google}>
          Continue with Google
        </Button>

        <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
          By continuing, you agree to EKA's{" "}
          <Link
            to="/terms"
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            Terms & Conditions
          </Link>{" "}
          and acknowledge our{" "}
          <Link
            to="/privacy"
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          . Under the DPDP Act, 2023, we collect only necessary data to secure and operate your
          sanctuary account.
        </p>

        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="mt-6 w-full text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {mode === "signup" ? "Already have an account? Sign in" : "New to EKA? Create an account"}
        </button>
      </div>
    </div>
  );
}
