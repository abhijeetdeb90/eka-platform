// ==============================================================================
// EKA BETA ROOT HOMEPAGE ROUTE
// ==============================================================================

import { createFileRoute } from "@tanstack/react-router";
import { EkaHomePage } from "@/components/home/EkaHomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EKA — Understand the world" },
      {
        name: "description",
        content: "Don't just scroll the world. Understand it. Curated cultural learning and discovery.",
      },
    ],
  }),
  component: EkaHomePage,
});
