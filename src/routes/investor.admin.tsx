import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/investor/admin")({
  beforeLoad: () => {
    throw redirect({ to: "/founder-admin" });
  },
  component: () => null,
});
