import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    console.log("[_authenticated beforeLoad] Running...");
    if (typeof window !== "undefined") {
      const tokenStr =
        localStorage.getItem("sb-auth-token") ||
        localStorage.getItem("sb-kbiutqzhcbyuseygcspe-auth-token") ||
        localStorage.getItem("sb-woflebpvqiwwzhggwwxv-auth-token");
      if (tokenStr) {
        try {
          const parsed = JSON.parse(tokenStr);
          if (parsed?.user) {
            console.log("[_authenticated beforeLoad] Found local session user:", parsed.user.email);
            return { user: parsed.user };
          }
        } catch {}
      }
    }
    const { data, error } = await supabase.auth.getUser();
    console.log("[_authenticated beforeLoad] Supabase getUser:", data?.user?.id, error?.message);
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: () => <Outlet />,
});
