import { createFileRoute, redirect } from "@tanstack/react-router";
import { verifyFounderAdminAccess } from "@/lib/auth/access-control";

export const Route = createFileRoute("/_authenticated/admin/economics")({
  beforeLoad: async () => {
    await verifyFounderAdminAccess("/app");
    throw redirect({ to: "/founder-admin/economics" });
  },
  component: () => null,
});
