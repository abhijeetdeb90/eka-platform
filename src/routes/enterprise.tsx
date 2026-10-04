import { createFileRoute, redirect } from "@tanstack/react-router";
import { verifyBrandEnterpriseAccess } from "@/lib/auth/access-control";

export const Route = createFileRoute("/enterprise")({
  beforeLoad: async () => {
    // Zero consumer access: if unauthorized, silently redirect to consumer root
    await verifyBrandEnterpriseAccess("/");
    throw redirect({ to: "/brands-enterprise/enterprise" });
  },
  component: () => null,
});
