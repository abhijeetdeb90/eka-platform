import { createFileRoute } from "@tanstack/react-router";
import { creatorEarningsEngine } from "@/lib/payments/earnings.service";
import { requireServerAuth, assertServerRole, resolveActingUserId } from "@/lib/auth/access-control";

/**
 * EKA Creator Earnings API: Independent calculation and distribution service
 * process_earning is admin-only (writes ledger). Read paths bind creator_id
 * to the authenticated principal unless admin.
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
              const admin = await assertServerRole(request, ["admin", "super_admin", "founder"]);
              if (!admin.ok) {
                return new Response(JSON.stringify({ error: admin.error ?? "Unauthorized" }), {
                  status: admin.status,
                  headers: { "Content-Type": "application/json" },
                });
              }

              const creatorId = body["creator_id"] as string;
              if (!creatorId) {
                return new Response(JSON.stringify({ error: "creator_id is required" }), {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                });
              }
              const campaignId = body["campaign_id"] as string | undefined;
              const deliverableId = body["deliverable_id"] as string | undefined;
              const contractId = body["contract_id"] as string | undefined;
              const campaignAmountMinor = Number(body["campaign_amount_minor"]);
              if (!campaignAmountMinor || campaignAmountMinor <= 0) {
                return new Response(JSON.stringify({ error: "campaign_amount_minor must be positive" }), {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                });
              }
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
              const auth = await requireServerAuth(request);
              if (!auth.ok) {
                return new Response(JSON.stringify({ error: auth.error }), {
                  status: auth.status,
                  headers: { "Content-Type": "application/json" },
                });
              }
              const target = resolveActingUserId(
                auth.userId,
                auth.roles,
                body["creator_id"] as string | undefined
              );
              if (!target.ok) {
                return new Response(JSON.stringify({ error: target.error }), {
                  status: target.status,
                  headers: { "Content-Type": "application/json" },
                });
              }
              const earnings = await creatorEarningsEngine.getEarningsByCreator(target.userId);
              return new Response(JSON.stringify({ success: true, earnings }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            case "get_earning": {
              const auth = await requireServerAuth(request);
              if (!auth.ok) {
                return new Response(JSON.stringify({ error: auth.error }), {
                  status: auth.status,
                  headers: { "Content-Type": "application/json" },
                });
              }
              const earningId = body["earning_id"] as string;
              if (!earningId) {
                return new Response(JSON.stringify({ error: "earning_id is required" }), {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                });
              }
              const earning = await creatorEarningsEngine.getEarningById(earningId);
              if (!earning) {
                return new Response(JSON.stringify({ error: "Earning not found" }), {
                  status: 404,
                  headers: { "Content-Type": "application/json" },
                });
              }
              const earningCreatorId = (earning as any).creator_id as string | undefined;
              if (
                earningCreatorId &&
                earningCreatorId !== auth.userId &&
                !auth.roles.some((r) => ["admin", "super_admin", "founder"].includes(r))
              ) {
                return new Response(JSON.stringify({ error: "Forbidden" }), {
                  status: 403,
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
