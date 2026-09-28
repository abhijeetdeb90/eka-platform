import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/my-eka")({
  beforeLoad: () => {
    throw redirect({ to: "/app/dashboard" });
  },
  component: () => null,
});
