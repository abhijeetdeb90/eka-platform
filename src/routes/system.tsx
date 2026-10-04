import { createFileRoute, redirect } from "@tanstack/react-router";
import { verifyFounderAdminAccess } from "@/lib/auth/access-control";

export const Route = createFileRoute("/system")({
  beforeLoad: async () => {
    // Zero consumer access: if unauthorized, silently redirect to consumer root
    await verifyFounderAdminAccess("/");
    throw redirect({ to: "/founder-admin/system" });
  },
  component: () => null,
});
