import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppScreen } from "@/components/app/AppScreen";
import { AiCompanion } from "@/components/app/AiCompanion";
import { CampaignBoard } from "@/components/app/CampaignBoard";
import { useProfile } from "@/hooks/useProfile";
import { entitlementFor, fetchSubscription } from "@/lib/billing";
import { CAMPAIGN_SLUG, fetchCampaign, fetchCampaignProgress } from "@/lib/campaigns";

export const Route = createFileRoute("/_authenticated/app/welcome")({
  component: FirstWeek,
});

function FirstWeek() {
  const { data: profile } = useProfile();
  const { data: sub } = useQuery({ queryKey: ["subscription-row"], queryFn: fetchSubscription });
  const { data: campaign } = useQuery({
    queryKey: ["campaign", CAMPAIGN_SLUG],
    queryFn: () => fetchCampaign(),
  });
  const { data: steps } = useQuery({
    queryKey: ["campaign-progress", campaign?.id],
    queryFn: () => fetchCampaignProgress(campaign!.id),
    enabled: Boolean(campaign?.id),
  });

  const entitlement = entitlementFor(sub);

  return (
    <AppScreen
      eyebrow="Your first seven days"
      title={`Welcome${profile?.display_name ? `, ${profile.display_name}` : ""}.`}
    >
      <CampaignBoard />

      {entitlement.renewsOn && (
        <p className="text-xs text-muted-foreground">
          First renewal {entitlement.renewsOn.toLocaleDateString()} · cancel or pause any time from
          Billing.
        </p>
      )}

      {(steps?.length ?? 0) >= 3 && (
        <AiCompanion
          mode="summary"
          title="Your week, read back"
          hint="A quiet summary of what has actually shifted since Day 0."
        />
      )}
    </AppScreen>
  );
}
