import { createFileRoute } from "@tanstack/react-router";
import { StudioEnterprise } from "@/components/studio/StudioEnterprise";

export const Route = createFileRoute("/enterprise")({
  head: () => ({
    meta: [
      { title: "EKA Enterprise — Workspaces & High-Throughput API" },
      {
        name: "description",
        content: "Dedicated tenant isolation, API provisioning, and rate limiting for institutional partners.",
      },
    ],
  }),
  component: EnterprisePage,
});

function EnterprisePage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-12">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-semibold">
            Institutional Infrastructure
          </span>
          <h1 className="mt-1 font-display text-3xl font-normal sm:text-4xl">EKA Enterprise</h1>
          <p className="mt-2 text-sm text-muted-foreground font-light max-w-2xl">
            Institutional workspaces, dedicated namespace access, high-concurrency API credentials,
            and organizational governance.
          </p>
        </div>
        <StudioEnterprise />
      </div>
    </div>
  );
}
