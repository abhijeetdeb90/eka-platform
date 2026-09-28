import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/strategy")({
  beforeLoad: () => {
    throw redirect({ to: "/brands", search: { tab: "strategy" } });
  },
  component: () => null,
});
