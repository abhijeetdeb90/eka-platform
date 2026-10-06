import { createFileRoute, redirect } from "@tanstack/react-router";
import { verifyBrandEnterpriseAccess } from "@/lib/auth/access-control";

export const Route = createFileRoute("/ads")({
  beforeLoad: async () => {
    // Zero consumer access: if unauthorized, silently redirect to consumer root
    await verifyBrandEnterpriseAccess("/");
    throw redirect({ to: "/brands-enterprise/campaigns" });
  },
  component: () => null,
});
