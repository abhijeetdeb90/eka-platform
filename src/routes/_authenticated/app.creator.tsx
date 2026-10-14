import { createFileRoute } from "@tanstack/react-router";
import { AppScreen } from "@/components/app/AppScreen";
import { CreatorStudioWorkspace } from "@/components/creator-studio/CreatorStudioWorkspace";

export const Route = createFileRoute("/_authenticated/app/creator")({
  head: () => ({
    meta: [
      { title: "Creator & Contributor Studio | EKA" },
      {
        name: "description",
        content:
          "Tri-Partite Creator Economy: Attention, Knowledge and Trust economies, Qualified Contribution Score, and transparent multi-contributor splits.",
      },
      { property: "og:title", content: "Creator & Contributor Studio | EKA" },
      {
        property: "og:description",
        content: "Transparent attribution across Attention, Knowledge, and Trust economies.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AppCreatorPage,
});

function AppCreatorPage() {
  return (
    <AppScreen eyebrow="Creator Studio" title="Workspace Dashboard">
      <CreatorStudioWorkspace inAppLayout={true} />
    </AppScreen>
  );
}
