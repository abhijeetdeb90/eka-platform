import { createFileRoute } from "@tanstack/react-router";
import { StudioEnterprise } from "@/components/studio/StudioEnterprise";

export const Route = createFileRoute("/brands-enterprise/enterprise")({
  head: () => ({
    meta: [
      { title: "EKA Enterprise — Dedicated Workspaces & High-Throughput APIs" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EnterpriseSolutionsPage,
});

function EnterpriseSolutionsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-semibold">
          Institutional Infrastructure
        </span>
        <h1 className="mt-1 font-display text-3xl font-normal sm:text-4xl">EKA Enterprise Solutions</h1>
        <p className="mt-2 text-sm text-muted-foreground font-light max-w-2xl">
          Institutional workspaces, dedicated namespace access, high-concurrency API credentials,
          and organizational governance for universities, cultural foundations, and museums.
        </p>
      </div>
      <StudioEnterprise currentRole="Founder" />
    </div>
  );
}
