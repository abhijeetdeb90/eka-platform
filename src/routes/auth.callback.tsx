import { useEffect, useState, useRef } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { EkaLogo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { applyJoinAnswers } from "@/lib/join";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): {
    code?: string;
    next?: string;
    error?: string;
    error_description?: string;
  } => {
    const rawNext = typeof search["next"] === "string" ? search["next"] : "";
    const safeNext =
      rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.includes("\\")
        ? rawNext
        : undefined;

    return {
      code: typeof search["code"] === "string" ? search["code"] : undefined,
      next: safeNext,
      error: typeof search["error"] === "string" ? search["error"] : undefined,
      error_description:
        typeof search["error_description"] === "string" ? search["error_description"] : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Authenticating — EKA" },
      { name: "description", content: "Completing authentication to EKA Sanctuary." },
    ],
  }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("Connecting your sanctuary session...");
  const processedRef = useRef(false);
  const navigatedRef = useRef(false);

  useEffect(() => {
    // Safety listener: if auth state fires a valid session, navigate immediately
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && !navigatedRef.current) {
        navigatedRef.current = true;
        setStatusText("Session verified. Opening EKA...");
        await applyJoinAnswers();
        const destination = search.next || "/app";
        navigate({ to: destination });
      }
    });

    if (processedRef.current) return;
    processedRef.current = true;

    async function handleCallback() {
      let errorParam = search.error;
      let errorDescParam = search.error_description;
      let codeParam = search.code;

      if (typeof window !== "undefined" && window.location.hash) {
        try {
          const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
          if (!errorParam && hashParams.get("error")) {
            errorParam = hashParams.get("error") || undefined;
          }
          if (!errorDescParam && hashParams.get("error_description")) {
            errorDescParam = hashParams.get("error_description") || undefined;
          }
          if (!codeParam && hashParams.get("code")) {
            codeParam = hashParams.get("code") || undefined;
          }
        } catch {}
      }

      // 1. Check if OAuth provider returned an error
      if (errorParam || errorDescParam) {
        console.warn("[AuthCallback] OAuth error received:", errorParam, errorDescParam);
        const desc =
          errorDescParam ||
          errorParam ||
          "Authentication was canceled or denied by the provider.";
        setErrorMessage(desc);
        return;
      }

      try {
        // 2. Check if a valid session is already active (proactive check)
        const { data: initialSession } = await supabase.auth.getSession();
        if (initialSession?.session && !navigatedRef.current) {
          navigatedRef.current = true;
          setStatusText("Session active. Preparing your sanctuary space...");
          await applyJoinAnswers();
          const destination = search.next || "/app";
          navigate({ to: destination });
          return;
        }

        // 3. PKCE Authorization Code Exchange
        if (codeParam) {
          setStatusText("Exchanging security tokens with EKA...");
          const { data, error } = await supabase.auth.exchangeCodeForSession(codeParam);

          // Even if exchange returned an error (e.g. code was processed concurrently), check session again
          if (error) {
            const { data: retrySession } = await supabase.auth.getSession();
            if (retrySession?.session && !navigatedRef.current) {
              navigatedRef.current = true;
              setStatusText("Welcome to EKA...");
              await applyJoinAnswers();
              const destination = search.next || "/app";
              navigate({ to: destination });
              return;
            }

            console.error("[AuthCallback] Code exchange failed:", error);
            setErrorMessage(
              error.message ||
                "Could not establish session. The authorization code may have expired or was already used.",
            );
            return;
          }

          if (data?.session && !navigatedRef.current) {
            navigatedRef.current = true;
            setStatusText("Preparing your sanctuary space...");
            await applyJoinAnswers();
            const destination = search.next || "/app";
            navigate({ to: destination });
            return;
          }
        }

        // 4. Fallback check for session
        setStatusText("Verifying session status...");
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("[AuthCallback] Session check error:", sessionError);
          setErrorMessage(sessionError.message);
          return;
        }

        if (sessionData?.session && !navigatedRef.current) {
          navigatedRef.current = true;
          await applyJoinAnswers();
          const destination = search.next || "/app";
          navigate({ to: destination });
          return;
        }

        // If neither code nor session was found
        if (!navigatedRef.current) {
          setErrorMessage("No authentication credentials found in the callback request.");
        }
      } catch (err) {
        console.error("[AuthCallback] Unexpected error:", err);
        if (!navigatedRef.current) {
          setErrorMessage(
            err instanceof Error ? err.message : "An unexpected error occurred during authentication.",
          );
        }
      }
    }

    void handleCallback();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, search]);

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16 bg-background">
      <div className="w-full max-w-sm text-center animate-rise space-y-6">
        <div className="flex justify-center">
          <Link to="/">
            <EkaLogo />
          </Link>
        </div>

        {errorMessage ? (
          <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
            <h1 className="font-display text-xl text-foreground">Authentication Incomplete</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">{errorMessage}</p>
            <div className="pt-2">
              <Button asChild className="w-full">
                <Link to="/auth">Return to Sign In</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
            <div className="mx-auto size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <h1 className="font-display text-lg text-foreground">Welcome to EKA</h1>
            <p className="text-sm text-muted-foreground">{statusText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
