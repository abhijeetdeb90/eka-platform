import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
    // Only same-origin relative paths are safe to return to
    return {
      next: raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("\\") ? raw : undefined,
    };
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
  const [joinAnswers, setJoinAnswers] = useState(() => loadAnswers());
  const [mode, setMode] = useState<"signin" | "signup">(() =>
    joinAnswers.standardsAccepted ? "signup" : "signin",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState<string | null>(null);

  // Synchronize previously gathered join questionnaire answers
  useEffect(() => {
    const saved = loadAnswers();
    setJoinAnswers(saved);
    if (saved.name) setName(saved.name);
    if (saved.standardsAccepted) setMode("signup");
  }, []);

  // Check if session already exists and redirect
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        navigate({ to: next || "/app" });
      }
    });
  }, [navigate, next]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      toast.error("Please enter both email and password.");
      setBusy(false);
      return;
    }

    try {
      if (mode === "signup") {
        if (!joinAnswers.standardsAccepted) {
          navigate({ to: "/join" });
          return;
        }

        const callbackUrl = `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`;

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: callbackUrl,
            data: { display_name: name.trim() || cleanEmail.split("@")[0] },
          },
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            throw new Error("An account with this email already exists. Please sign in instead.");
          } else if (error.message.includes("Password should be")) {
            throw new Error("Password must be at least 6 characters long.");
          }
          throw error;
        }

        track("signup");
        void applyJoinAnswers();

        if (data?.session) {
          toast.success("Welcome to EKA.");
          navigate({ to: next || "/app" });
        } else {
          // Email confirmation is required by Supabase Auth configuration
          setPendingConfirmationEmail(cleanEmail);
          toast.info("Account created. Please check your email to verify your account.");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Invalid email or password. Please verify your credentials.");
          } else if (error.message.includes("Email not confirmed")) {
            throw new Error(
              "Your email has not been confirmed yet. Please check your inbox for the activation link.",
            );
          }
          throw error;
        }

        if (data?.session) {
          toast.success("Welcome back to EKA.");
          navigate({ to: next || "/app" });
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication error.");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    try {
      const redirectTo = `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) {
        if (
          error.message.includes("not enabled") ||
          error.message.includes("validation_failed") ||
          error.message.includes("Unsupported provider")
        ) {
          toast.error(
            "Google Login is pending configuration in the Supabase Dashboard (Authentication → Providers → Google). Please use email sign-in or enable Google OAuth.",
          );
          return;
        }
        throw error;
      }

      if (data?.url) {
        track(mode === "signup" ? "signup" : "login");
        void applyJoinAnswers();
        // Browser redirects to Google OAuth
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("[Google OAuth] Error:", error);
      toast.error(error instanceof Error ? error.message : "Google sign-in could not be initiated.");
    } finally {
      setBusy(false);
    }
  };

  // If user signed up with email confirmation required
  if (pendingConfirmationEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5 py-16 bg-background">
        <div className="w-full max-w-sm animate-rise space-y-6 text-center">
          <Link to="/">
            <EkaLogo />
          </Link>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MailCheck className="size-6" />
            </div>
            <h1 className="font-display text-2xl text-foreground">Confirm your email</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We've sent a verification link to{" "}
              <strong className="text-foreground">{pendingConfirmationEmail}</strong>. Please check your
              inbox (or spam folder) and click the link to activate your sanctuary account.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setPendingConfirmationEmail(null);
                  setMode("signin");
                }}
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16 bg-background">
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

        <Button variant="outline" className="mt-3 w-full" onClick={google} disabled={busy}>
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
