import { createFileRoute } from "@tanstack/react-router";
import { StudioLayout } from "@/components/studio/StudioLayout";

export const Route = createFileRoute("/_authenticated/studio")({
  component: StudioRoute,
});

function StudioRoute() {
  return <StudioLayout />;
}
