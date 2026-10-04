import { createFileRoute, redirect } from "@tanstack/react-router";
import { verifyBrandEnterpriseAccess } from "@/lib/auth/access-control";

export const Route = createFileRoute("/insights")({
  beforeLoad: async () => {
    await verifyBrandEnterpriseAccess("/");
    throw redirect({ to: "/brands-enterprise" });
  },
  component: () => null,
});
