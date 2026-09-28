import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import {
  CAMPAIGN_SLUG,
  campaignPercent,
  completeCampaignDay,
  fetchCampaign,
  fetchCampaignDays,
  fetchCampaignProgress,
  nextCampaignDay,
} from "@/lib/campaigns";

/* --------------------------------------------------------- campaign board ---
 * Renders any campaign, not just the first week. The days, promises and
 * destinations all come from the database, so a new arc needs no deploy.
 * -------------------------------------------------------------------------- */

export function CampaignBoard({ slug = CAMPAIGN_SLUG }: { slug?: string }) {
  const qc = useQueryClient();
  const { data: campaign } = useQuery({
    queryKey: ["campaign", slug],
    queryFn: () => fetchCampaign(slug),
  });
  const campaignId = campaign?.id;

  const { data: days } = useQuery({
    queryKey: ["campaign-days", campaignId],
    queryFn: () => fetchCampaignDays(campaignId!),
    enabled: Boolean(campaignId),
  });
  const { data: steps } = useQuery({
    queryKey: ["campaign-progress", campaignId],
    queryFn: () => fetchCampaignProgress(campaignId!),
    enabled: Boolean(campaignId),
  });

  const list = days ?? [];
  const done = new Set((steps ?? []).map((s) => s.day_number));
  const next = nextCampaignDay(list, steps ?? []);
  const percent = campaignPercent(list, steps ?? []);

  if (!campaign) return null;

  const complete = async (dayNumber: number) => {
    await completeCampaignDay(campaign.id, dayNumber);
    track("onboarding_day", { day: dayNumber, campaign: campaign.slug });
    await qc.invalidateQueries({ queryKey: ["campaign-progress", campaign.id] });
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-primary/30 bg-primary-soft/40 p-6 shadow-calm">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          {campaign.tagline}
        </p>
        <h2 className="mt-2 font-display text-2xl">{campaign.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{campaign.promise}</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">{percent}%</span>
        </div>
      </section>

      {next && (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-calm">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Day {next.day_number} · about {next.minutes} minutes
          </p>
          <h3 className="mt-2 font-display text-xl">{next.title}</h3>
          <p className="mt-1 text-sm text-primary">{next.promise}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{next.action}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <Link to={next.route}>{next.cta}</Link>
            </Button>
            <Button variant="outline" onClick={() => complete(next.day_number)}>
              Mark as done
            </Button>
          </div>
        </section>
      )}

      <div className="space-y-2">
        {list.map((d) => {
          const isDone = done.has(d.day_number);
          return (
            <div
              key={d.id}
              className={`flex items-center gap-4 rounded-2xl border p-4 ${
                isDone ? "border-primary/40 bg-primary-soft/30" : "border-border bg-card"
              }`}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-xs">
                {isDone ? <Check className="size-4 text-primary" aria-hidden /> : d.day_number}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{d.title}</p>
                <p className="truncate text-xs text-muted-foreground">{d.promise}</p>
              </div>
              <Button size="sm" variant="ghost" asChild>
                <Link to={d.route}>Open</Link>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
