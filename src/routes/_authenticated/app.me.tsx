import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/me")({
  beforeLoad: () => {
    throw redirect({ to: "/my-eka" });
  },
  component: () => null,
});
