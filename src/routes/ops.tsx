import { createFileRoute, redirect } from "@tanstack/react-router";
import { verifyFounderAdminAccess } from "@/lib/auth/access-control";

export const Route = createFileRoute("/ops")({
  beforeLoad: async ({ search }) => {
    // Zero consumer access: if unauthorized, silently redirect to consumer root
    await verifyFounderAdminAccess("/");
    const tab = (search as Record<string, unknown>)?.["tab"];
    throw redirect({
      to: "/founder-admin/ops",
      search: tab ? ({ tab } as any) : undefined,
    });
  },
  component: () => null,
});
