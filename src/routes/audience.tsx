import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/audience")({
  beforeLoad: () => {
    throw redirect({ to: "/brands", search: { tab: "audience" } });
  },
  component: () => null,
});
