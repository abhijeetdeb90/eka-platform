import { createFileRoute } from "@tanstack/react-router";

/**
 * EMERGENCY LOCK: /api/payouts is closed until the production bundle is
 * confirmed to serve this file. Any 201 response means a stale/other handler
 * is still active outside this source path.
 */
export const Route = createFileRoute("/api/payouts")({
  server: {
    handlers: {
      GET: async () =>
        new Response(
          JSON.stringify({
            error: "Unauthorized: Missing Authorization header",
            guard: "v1-money-route-auth-HARD-CLOSE",
            method: "GET",
          }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              "X-EKA-Auth-Guard": "v1-money-route-auth-HARD-CLOSE",
              "Cache-Control": "no-store",
            },
          }
        ),
      POST: async () =>
        new Response(
          JSON.stringify({
            error: "Unauthorized: Missing Authorization header",
            guard: "v1-money-route-auth-HARD-CLOSE",
            method: "POST",
          }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              "X-EKA-Auth-Guard": "v1-money-route-auth-HARD-CLOSE",
              "Cache-Control": "no-store",
            },
          }
        ),
      PUT: async () =>
        new Response(JSON.stringify({ error: "Method not allowed", guard: "v1-money-route-auth-HARD-CLOSE" }), {
          status: 405,
          headers: { "Content-Type": "application/json", "X-EKA-Auth-Guard": "v1-money-route-auth-HARD-CLOSE" },
        }),
      DELETE: async () =>
        new Response(JSON.stringify({ error: "Method not allowed", guard: "v1-money-route-auth-HARD-CLOSE" }), {
          status: 405,
          headers: { "Content-Type": "application/json", "X-EKA-Auth-Guard": "v1-money-route-auth-HARD-CLOSE" },
        }),
    },
  },
});
