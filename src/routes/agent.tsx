import { createFileRoute, redirect } from "@tanstack/react-router";
import { verifyBrandEnterpriseAccess } from "@/lib/auth/access-control";

export const Route = createFileRoute("/agent")({
  beforeLoad: async () => {
    await verifyBrandEnterpriseAccess("/");
    throw redirect({ to: "/brands-enterprise/agent" });
  },
  component: () => null,
});
