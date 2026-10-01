import { createFileRoute } from "@tanstack/react-router";
import { creatorEarningsEngine } from "@/lib/payments/earnings.service";

/**
 * EKA Creator Earnings API: Independent calculation and distribution service
 */
export const Route = createFileRoute("/api/creator-earnings")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as Record<string, unknown>;
          const action = (body["action"] as string) ?? "process_earning";

          switch (action) {
            case "process_earning": {
              const creatorId = body["creator_id"] as string;
              const campaignId = body["campaign_id"] as string | undefined;
              const deliverableId = body["deliverable_id"] as string | undefined;
              const contractId = body["contract_id"] as string | undefined;
              const campaignAmountMinor = Number(body["campaign_amount_minor"]);
              const commissionPercent = body["commission_percent"]
                ? Number(body["commission_percent"])
                : undefined;
              const taxRules = body["tax_rules"] as any;

              const earning = await creatorEarningsEngine.processEarning({
                creator_id: creatorId,
                campaign_amount_minor: campaignAmountMinor,
                tax_rules: taxRules,
                ...(campaignId ? { campaign_id: campaignId } : {}),
                ...(deliverableId ? { deliverable_id: deliverableId } : {}),
                ...(contractId ? { contract_id: contractId } : {}),
                ...(commissionPercent !== undefined ? { commission_percent: commissionPercent } : {}),
              });

              return new Response(JSON.stringify({ success: true, earning }), {
                status: 201,
                headers: { "Content-Type": "application/json" },
              });
            }

            case "get_creator_earnings": {
              const creatorId = body["creator_id"] as string;
              const earnings = await creatorEarningsEngine.getEarningsByCreator(creatorId);

              return new Response(JSON.stringify({ success: true, earnings }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            case "get_earning": {
              const earningId = body["earning_id"] as string;
              const earning = await creatorEarningsEngine.getEarningById(earningId);
              if (!earning) {
                return new Response(JSON.stringify({ error: "Earning not found" }), {
                  status: 404,
                  headers: { "Content-Type": "application/json" },
                });
              }

              return new Response(JSON.stringify({ success: true, earning }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            default:
              return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
          }
        } catch (error) {
          return new Response(JSON.stringify({ error: String(error) }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
