import { createFileRoute } from "@tanstack/react-router";
import { AppScreen } from "@/components/app/AppScreen";
import { CreatorStudioWorkspace } from "@/components/creator-studio/CreatorStudioWorkspace";

export const Route = createFileRoute("/_authenticated/app/creator/dashboard")({
  head: () => ({
    meta: [
      { title: "Creator & Contributor Studio | EKA" },
      {
        name: "description",
        content:
          "Professional cultural creator workspace. Track real audience metrics, manage multi-format archives, and research with Ask EKA AI.",
      },
    ],
  }),
  component: CreatorDashboardPage,
});

export function CreatorDashboardPage() {
  return (
    <AppScreen eyebrow="Creator Studio" title="Workspace Dashboard">
      <CreatorStudioWorkspace inAppLayout={true} />
    </AppScreen>
  );
}
