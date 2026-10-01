import { createFileRoute } from "@tanstack/react-router";
import { creatorPayoutsEngine } from "@/lib/payments/payouts.service";

/**
 * EKA Creator Payouts API: Onboarding, Eligibility Verification & State Machine Payouts
 */
export const Route = createFileRoute("/api/payouts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as Record<string, unknown>;
          const action = (body["action"] as string) ?? "request_payout";

          switch (action) {
            case "onboard_creator": {
              const userId = body["user_id"] as string;
              const legalName = body["legal_name"] as string;
              const displayName = body["display_name"] as string;
              const email = body["email"] as string;
              const phone = body["phone"] as string | undefined;
              const panNumber = body["pan_number"] as string | undefined;
              const bankAccountNumber = body["bank_account_number"] as string | undefined;
              const bankIfsc = body["bank_ifsc"] as string | undefined;
              const upiId = body["upi_id"] as string | undefined;
              const payoutMethod = body["payout_method"] as any;
              const tdsRate = body["tds_rate_percent"] ? Number(body["tds_rate_percent"]) : undefined;
              const gstin = body["gstin"] as string | undefined;

              const profile = await creatorPayoutsEngine.onboardCreator({
                user_id: userId,
                legal_name: legalName,
                display_name: displayName,
                email,
                payout_method: payoutMethod,
                ...(phone ? { phone } : {}),
                ...(panNumber ? { pan_number: panNumber } : {}),
                ...(bankAccountNumber ? { bank_account_number: bankAccountNumber } : {}),
                ...(bankIfsc ? { bank_ifsc: bankIfsc } : {}),
                ...(upiId ? { upi_id: upiId } : {}),
                ...(tdsRate !== undefined ? { tds_rate_percent: tdsRate } : {}),
                ...(gstin ? { gstin } : {}),
              });

              return new Response(JSON.stringify({ success: true, profile }), {
                status: 201,
                headers: { "Content-Type": "application/json" },
              });
            }

            case "check_eligibility": {
              const creatorId = body["creator_id"] as string;
              const eligibility = await creatorPayoutsEngine.checkEligibility(creatorId);

              return new Response(JSON.stringify({ success: true, eligibility }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            case "request_payout": {
              const creatorId = body["creator_id"] as string;
              const amountMinor = body["amount_minor"] ? Number(body["amount_minor"]) : undefined;
              const method = body["method"] as any;

              const payout = await creatorPayoutsEngine.requestPayout({
                creator_id: creatorId,
                method,
                ...(amountMinor !== undefined ? { amount_minor: amountMinor } : {}),
              });

              return new Response(JSON.stringify({ success: true, payout }), {
                status: 201,
                headers: { "Content-Type": "application/json" },
              });
            }

            case "retry_payout": {
              const payoutId = body["payout_id"] as string;
              const payout = await creatorPayoutsEngine.retryFailedPayout(payoutId);

              return new Response(JSON.stringify({ success: true, payout }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            case "hold_payout": {
              const payoutId = body["payout_id"] as string;
              const reason = (body["reason"] as string) ?? "Manual administrative review hold";
              const payout = await creatorPayoutsEngine.holdPayout(payoutId, reason);

              return new Response(JSON.stringify({ success: true, payout }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            case "get_creator_payouts": {
              const creatorId = body["creator_id"] as string;
              const payouts = await creatorPayoutsEngine.getPayoutsByCreator(creatorId);

              return new Response(JSON.stringify({ success: true, payouts }), {
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
