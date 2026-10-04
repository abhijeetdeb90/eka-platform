import { createFileRoute } from "@tanstack/react-router";
import { financeService } from "@/lib/payments/finance.service";
import { assertServerRole } from "@/lib/auth/access-control";

/**
 * EKA Finance Telemetry API: Admin, Creator, and Brand Financial Aggregates
 * Protected by strict server-side RBAC token verification.
 */
export const Route = createFileRoute("/api/finance")({
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

        const summary = await financeService.getAdminFinanceSummary();
        return new Response(JSON.stringify({ success: true, summary }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },

      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as Record<string, unknown>;
          const view = (body["view"] as string) ?? "admin";

          switch (view) {
            case "admin": {
              const auth = await assertServerRole(request, ["admin", "super_admin", "founder"]);
              if (!auth.ok) {
                return new Response(JSON.stringify({ error: auth.error ?? "Unauthorized" }), {
                  status: auth.status,
                  headers: { "Content-Type": "application/json" },
                });
              }

              const summary = await financeService.getAdminFinanceSummary();
              return new Response(JSON.stringify({ success: true, summary }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            case "creator": {
              const auth = await assertServerRole(request, ["creator", "admin", "super_admin", "founder"]);
              if (!auth.ok) {
                return new Response(JSON.stringify({ error: auth.error ?? "Unauthorized" }), {
                  status: auth.status,
                  headers: { "Content-Type": "application/json" },
                });
              }

              const creatorId = (body["creator_id"] as string) || auth.userId;
              if (!creatorId) {
                return new Response(JSON.stringify({ error: "Missing creator_id" }), {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                });
              }

              const summary = await financeService.getCreatorEarningsSummary(creatorId);
              return new Response(JSON.stringify({ success: true, summary }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            case "brand": {
              const auth = await assertServerRole(request, ["brand", "enterprise", "admin", "super_admin", "founder"]);
              if (!auth.ok) {
                return new Response(JSON.stringify({ error: auth.error ?? "Unauthorized" }), {
                  status: auth.status,
                  headers: { "Content-Type": "application/json" },
                });
              }

              const brandId = body["brand_id"] as string;
              if (!brandId) {
                return new Response(JSON.stringify({ error: "Missing brand_id" }), {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                });
              }

              const summary = await financeService.getBrandSpendSummary(brandId);
              return new Response(JSON.stringify({ success: true, summary }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            default:
              return new Response(JSON.stringify({ error: `Unknown view: ${view}` }), {
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
