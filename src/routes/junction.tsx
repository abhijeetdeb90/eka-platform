import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/junction")({
  beforeLoad: () => {
    throw redirect({ to: "/discover" });
  },
  component: () => null,
});
