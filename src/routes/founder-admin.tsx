import { createFileRoute } from "@tanstack/react-router";
import { FounderAdminShell } from "@/apps/founder-admin/components/FounderAdminShell";
import { founderAdminBeforeLoad } from "@/apps/founder-admin/guards/auth-guard";

export const Route = createFileRoute("/founder-admin")({
  beforeLoad: async () => {
    return await founderAdminBeforeLoad();
  },
  head: () => ({
    meta: [
      { title: "EKA Founder Cockpit & Admin OS" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: FounderAdminShell,
});
