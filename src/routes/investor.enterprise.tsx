import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/investor/enterprise")({
  beforeLoad: () => {
    throw redirect({ to: "/brands-enterprise" });
  },
  component: () => null,
});
