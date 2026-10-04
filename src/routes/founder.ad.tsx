import { createFileRoute, redirect } from "@tanstack/react-router";
import { verifyFounderAdminAccess } from "@/lib/auth/access-control";

export const Route = createFileRoute("/founder/ad")({
  beforeLoad: async () => {
    // If unauthorized/consumer: deny access and redirect to stories
    await verifyFounderAdminAccess("/stories");
    throw redirect({ to: "/founder-admin" });
  },
  component: () => null,
});
