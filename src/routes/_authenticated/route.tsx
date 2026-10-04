import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    // 1. Guard against SSR running prematurely on server without client storage/cookies
    if (typeof window === "undefined") {
      return { user: null };
    }

    // 2. Check local Supabase session first (instant, synchronous cache lookup)
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;

    if (session?.user) {
      return { user: session.user };
    }

    // 3. Fallback: attempt network verification or token refresh
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userData?.user && !userError) {
        return { user: userData.user };
      }
    } catch (err) {
      console.warn("[_authenticated beforeLoad] getUser warning:", err);
    }

    // 4. Truly unauthenticated: redirect to /auth while preserving destination
    const targetPath = location.pathname + (location.searchStr || "");
    const safeNext =
      targetPath && targetPath !== "/app" && targetPath !== "/" ? targetPath : undefined;

    throw redirect({
      to: "/auth",
      search: safeNext ? { next: safeNext } : undefined,
    });
  },
  component: () => <Outlet />,
});
