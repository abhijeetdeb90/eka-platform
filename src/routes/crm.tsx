import { createFileRoute, redirect } from "@tanstack/react-router";
import { verifyFounderAdminAccess } from "@/lib/auth/access-control";

export const Route = createFileRoute("/crm")({
  beforeLoad: async () => {
    // Zero consumer access: if unauthorized, silently redirect to consumer root
    await verifyFounderAdminAccess("/");
    throw redirect({ to: "/founder-admin/crm" });
  },
  component: () => null,
});
