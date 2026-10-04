import { createFileRoute, redirect } from "@tanstack/react-router";
import { verifyFounderAdminAccess } from "@/lib/auth/access-control";

export const Route = createFileRoute("/founder")({
  beforeLoad: async () => {
    await verifyFounderAdminAccess("/");
    throw redirect({ to: "/founder-admin" });
  },
  component: () => null,
});
