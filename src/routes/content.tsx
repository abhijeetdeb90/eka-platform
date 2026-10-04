import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/content")({
  beforeLoad: () => {
    // Redirect to public stories archive instead of brands
    throw redirect({ to: "/stories" });
  },
  component: () => null,
});
