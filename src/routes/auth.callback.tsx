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

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    async function handleCallback() {
      // 1. Check if OAuth provider returned an error
      if (search.error || search.error_description) {
        console.warn("[AuthCallback] OAuth error received:", search.error, search.error_description);
        const desc =
          search.error_description ||
          search.error ||
          "Authentication was canceled or denied by the provider.";
        setErrorMessage(desc);
        return;
      }

      try {
        // 2. PKCE Authorization Code Exchange
        if (search.code) {
          setStatusText("Exchanging security tokens with EKA...");
          const { data, error } = await supabase.auth.exchangeCodeForSession(search.code);
          if (error) {
            console.error("[AuthCallback] Code exchange failed:", error);
            setErrorMessage(
              error.message ||
                "Could not establish session. The authorization code may have expired or was already used.",
            );
            return;
          }

          if (data?.session) {
            setStatusText("Preparing your sanctuary space...");
            await applyJoinAnswers();
            const destination = search.next || "/app";
            navigate({ to: destination });
            return;
          }
        }

        // 3. Fallback: Check if session is already active (e.g. implicit flow, auto-detection)
        setStatusText("Verifying session status...");
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("[AuthCallback] Session check error:", sessionError);
          setErrorMessage(sessionError.message);
          return;
        }

        if (sessionData?.session) {
          await applyJoinAnswers();
          const destination = search.next || "/app";
          navigate({ to: destination });
          return;
        }

        // If neither code nor session was found
        setErrorMessage("No authentication credentials found in the callback request.");
      } catch (err) {
        console.error("[AuthCallback] Unexpected error:", err);
        setErrorMessage(
          err instanceof Error ? err.message : "An unexpected error occurred during authentication.",
        );
      }
    }

    void handleCallback();
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
