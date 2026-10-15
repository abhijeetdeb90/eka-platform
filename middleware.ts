/**
 * Vercel Edge Middleware — money API auth gate.
 * No framework dependency; returns 401 or continues (undefined).
 */
const MONEY_PATHS = [
  "/api/payouts",
  "/api/payments",
  "/api/create-order",
  "/api/refunds",
  "/api/creator-earnings",
  "/api/verify-payment",
  "/api/finance",
  "/api/reconciliation",
];

export const config = {
  matcher: ["/api/:path*"],
};

export default function middleware(request: Request): Response | void {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method.toUpperCase();

  // Public: list subscription plans
  if (method === "GET" && (pathname === "/api/subscriptions" || pathname.startsWith("/api/subscriptions/"))) {
    return;
  }

  const needsAuth =
    MONEY_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname === "/api/subscriptions" ||
    pathname.startsWith("/api/subscriptions/");

  if (!needsAuth) return;

  const auth = request.headers.get("authorization");
  if (!auth || !/^Bearer\s+\S+/i.test(auth)) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized: Missing Authorization header",
        guard: "v1-vercel-edge-middleware",
      }),
      {
        status: 401,
        headers: {
          "content-type": "application/json",
          "cache-control": "no-store",
          "x-eka-auth-guard": "v1-vercel-edge-middleware",
        },
      },
    );
  }
}
