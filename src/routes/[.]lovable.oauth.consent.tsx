import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EkaLogo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/.lovable/oauth/consent")({
  // Browser-only: the Supabase client reads its session from localStorage,
  // absent on the SSR pass.
  ssr: false,
  validateSearch: (search: {
    authorization_id?: unknown;
  }): {
    authorization_id: string;
  } => ({
    authorization_id: typeof search.authorization_id === "string" ? search.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    const next = location.pathname + location.searchStr;
    if (!data.session) throw redirect({ to: "/auth", search: { next } });
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId);
    if (error) throw error;
    // Already-approved client: the provider resolves immediately — bounce to it.
    const immediate = data && "redirect_url" in data ? data.redirect_url : undefined;
    const hasClient = data && "client" in data;
    if (immediate && !hasClient) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="max-w-md text-center">
        <p className="text-sm text-muted-foreground">
          Could not load this authorization request: {String((error as Error)?.message ?? error)}
        </p>
      </div>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const clientName = details && "client" in details ? details.client.name : "an app";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Event-handler errors are not caught by errorComponent — surface in state.
  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error } = approve
      ? await supabase.auth.oauth.approveAuthorization(authorization_id)
      : await supabase.auth.oauth.denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data && "redirect_url" in data ? data.redirect_url : undefined;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm animate-rise">
        <EkaLogo />
        <h1 className="mt-8 text-2xl leading-snug">Connect {clientName} to your EKA account</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This lets {clientName} read your EKA profile, practice summary and private reflections —
          as you, and only what you can see.
        </p>
        {error && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="mt-7 flex gap-3">
          <Button disabled={busy} onClick={() => decide(true)}>
            Approve
          </Button>
          <Button disabled={busy} variant="outline" onClick={() => decide(false)}>
            Deny
          </Button>
        </div>
      </div>
    </main>
  );
}
