import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/promote")({
  beforeLoad: () => {
    throw redirect({ to: "/brands", search: { tab: "promote" } });
  },
  component: () => null,
});
