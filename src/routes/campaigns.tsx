import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/campaigns")({
  beforeLoad: () => {
    throw redirect({ to: "/brands", search: { tab: "campaigns" } });
  },
  component: () => null,
});
