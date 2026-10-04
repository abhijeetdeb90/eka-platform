import { createFileRoute } from "@tanstack/react-router";
import { StudioLayout } from "@/components/studio/StudioLayout";

export const Route = createFileRoute("/founder-admin/studio")({
  head: () => ({
    meta: [
      { title: "EKA Studio — Master Control Plane" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: StudioLayout,
});
