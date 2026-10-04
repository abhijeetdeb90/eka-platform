import { createFileRoute, redirect } from "@tanstack/react-router";
import { verifyBrandEnterpriseAccess } from "@/lib/auth/access-control";

export const Route = createFileRoute("/_authenticated/app/brand/finance")({
  beforeLoad: async () => {
    await verifyBrandEnterpriseAccess("/app");
    throw redirect({ to: "/brands-enterprise/finance" });
  },
  component: () => null,
});
