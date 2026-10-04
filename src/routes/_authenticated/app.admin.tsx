import { createFileRoute, redirect } from "@tanstack/react-router";
import { verifyFounderAdminAccess } from "@/lib/auth/access-control";

export const Route = createFileRoute("/_authenticated/app/admin")({
  beforeLoad: async () => {
    // Only authorized founder/admin can access.
    // Consumers are redirected back to /app without leaking admin UI.
    await verifyFounderAdminAccess("/app");
    throw redirect({ to: "/founder-admin" });
  },
  component: () => null,
});
