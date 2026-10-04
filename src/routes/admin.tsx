import { createFileRoute, redirect } from "@tanstack/react-router";
import { verifyFounderAdminAccess } from "@/lib/auth/access-control";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    // Only authorized founder/admin can be redirected to /founder-admin.
    // Consumers are silently redirected to "/" with zero internal exposure.
    await verifyFounderAdminAccess("/");
    throw redirect({ to: "/founder-admin" });
  },
  component: () => null,
});
