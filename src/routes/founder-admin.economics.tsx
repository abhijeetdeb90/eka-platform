import { createFileRoute } from "@tanstack/react-router";
import { PlatformEconomics } from "@/apps/founder-admin/components/PlatformEconomics";

export const Route = createFileRoute("/founder-admin/economics")({
  head: () => ({
    meta: [
      { title: "EKA Platform Economics — Founder & Admin OS" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PlatformEconomics,
});
