import { next } from "@vercel/edge";

/**
 * Platform edge gate: money APIs require Authorization Bearer.
 * Runs before Nitro/TanStack route handlers on Vercel.
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

function isMoneyPath(pathname: string): boolean {
  return MONEY_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function isPublicGet(pathname: string, method: string): boolean {
  if (method !== "GET") return false;
  return pathname === "/api/subscriptions" || pathname.startsWith("/api/subscriptions/");
}

export const config = {
  matcher: ["/api/:path*"],
};

export default function middleware(request: Request): Response | ReturnType<typeof next> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method.toUpperCase();

  // Subscriptions plan listing stays public (GET only)
  if (pathname === "/api/subscriptions" || pathname.startsWith("/api/subscriptions/")) {
    if (method === "GET") return next();
    // POST and others require auth
  }

  if (isMoneyPath(pathname) || pathname === "/api/subscriptions") {
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

  return next();
}
