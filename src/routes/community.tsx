import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/community")({
  beforeLoad: () => {
    throw redirect({ to: "/app/sanghas" });
  },
  component: () => null,
});
