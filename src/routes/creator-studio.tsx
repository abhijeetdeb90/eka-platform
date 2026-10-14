import { createFileRoute, redirect } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import { CreatorStudioWorkspace } from "@/components/creator-studio/CreatorStudioWorkspace";

export const Route = createFileRoute("/creator-studio")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Creator Studio & Intelligence Workspace | EKA" },
      {
        name: "description",
        content:
          "Professional cultural creator workspace. Track real audience metrics, manage multi-format archives, and research with Ask EKA AI.",
      },
    ],
  }),
  component: CreatorStudioPage,
});

function CreatorStudioPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <SiteHeader />
      <main className="flex-1">
        <CreatorStudioWorkspace />
      </main>
      <SiteFooter />
    </div>
  );
}
