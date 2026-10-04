import { createFileRoute } from "@tanstack/react-router";
import { reconciliationService, type ProviderTransactionItem } from "@/lib/payments/reconciliation.service";
import { assertServerRole } from "@/lib/auth/access-control";

/**
 * EKA Reconciliation API: Gateway vs Financial Ledger Parity Checks
 * Restricted to Founder / Admin roles only.
 */
export const Route = createFileRoute("/api/reconciliation")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await assertServerRole(request, ["admin", "super_admin", "founder"]);
        if (!auth.ok) {
          return new Response(JSON.stringify({ error: auth.error ?? "Unauthorized" }), {
            status: auth.status,
            headers: { "Content-Type": "application/json" },
          });
        }

        const report = reconciliationService.getLatestReport();
        return new Response(JSON.stringify({ success: true, report: report ?? null }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },

      POST: async ({ request }) => {
        const auth = await assertServerRole(request, ["admin", "super_admin", "founder"]);
        if (!auth.ok) {
          return new Response(JSON.stringify({ error: auth.error ?? "Unauthorized" }), {
            status: auth.status,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const body = (await request.json()) as Record<string, unknown>;
          const periodStart = body["period_start"] ? new Date(body["period_start"] as string) : new Date(Date.now() - 30 * 86400 * 1000);
          const periodEnd = body["period_end"] ? new Date(body["period_end"] as string) : new Date();
          const providerTransactions = (body["provider_transactions"] as ProviderTransactionItem[]) ?? [];

          const report = await reconciliationService.reconcilePeriod(
            periodStart,
            periodEnd,
            providerTransactions,
          );

          return new Response(JSON.stringify({ success: true, report }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
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
