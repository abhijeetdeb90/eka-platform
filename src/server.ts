import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import {
  getStandardSecurityHeaders,
  resolveRequestId,
  checkRateLimit,
  detectApplicationAttacks,
  isEntityQuarantined,
  trackSecurityEvent,
} from "./lib/security";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// Attach platform-wide enterprise security headers and request correlation ID
function applySecurityHeaders(response: Response, requestId: string): Response {
  const headers = new Headers(response.headers);
  const secHeaders = getStandardSecurityHeaders();

  for (const [key, value] of Object.entries(secHeaders)) {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  }
  headers.set("x-request-id", requestId);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response, requestId: string): Promise<Response> {
  if (response.status < 500) return applySecurityHeaders(response, requestId);
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return applySecurityHeaders(response, requestId);

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return applySecurityHeaders(response, requestId);

  console.error(`[SSR Error][${requestId}]`, consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  const headers = new Headers(getStandardSecurityHeaders());
  headers.set("content-type", "text/html; charset=utf-8");
  headers.set("x-request-id", requestId);

  return new Response(renderErrorPage(), {
    status: 500,
    headers,
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
    const requestId = resolveRequestId(request.headers);
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    try {
      // 1. Check if IP is in Security Quarantine
      const quarantineStatus = isEntityQuarantined({ ipAddress: clientIp });
      if (quarantineStatus.quarantined) {
        const headers = new Headers(getStandardSecurityHeaders());
        headers.set("content-type", "application/json");
        headers.set("x-request-id", requestId);
        return new Response(
          JSON.stringify({
            error: {
              code: "ACCESS_QUARANTINED",
              message: "Access has been temporarily restricted due to anomalous activity.",
              requestId,
            },
          }),
          { status: 403, headers },
        );
      }

      // 2. Global IP Rate Limiting Check
      const rateLimit = checkRateLimit(`ip:${clientIp}`, "api_standard");
      if (!rateLimit.allowed) {
        await trackSecurityEvent({
          severity: "MEDIUM",
          category: "rate_limit_breach",
          eventType: "global_rate_limit_exceeded",
          ipAddress: clientIp,
          userAgent: request.headers.get("user-agent"),
          details: { retryAfterSeconds: rateLimit.retryAfterSeconds },
        });

        const headers = new Headers(getStandardSecurityHeaders());
        headers.set("content-type", "application/json");
        headers.set("x-request-id", requestId);
        headers.set("retry-after", String(rateLimit.retryAfterSeconds || 60));

        return new Response(
          JSON.stringify({
            error: {
              code: "RATE_LIMIT_EXCEEDED",
              message: "Too many requests. Please slow down.",
              retryAfterSeconds: rateLimit.retryAfterSeconds,
              requestId,
            },
          }),
          { status: 429, headers },
        );
      }

      // 3. Attack Signature Detection on URL & Query parameters
      const url = new URL(request.url);
      const queryString = url.search;
      if (queryString) {
        const attackCheck = await detectApplicationAttacks({
          input: decodeURIComponent(queryString),
          source: "url_query_params",
          ipAddress: clientIp,
        });

        if (!attackCheck.isClean) {
          const headers = new Headers(getStandardSecurityHeaders());
          headers.set("content-type", "application/json");
          headers.set("x-request-id", requestId);
          return new Response(
            JSON.stringify({
              error: {
                code: "MALICIOUS_PAYLOAD_REJECTED",
                message: "Request blocked by EKA Security Shield.",
                requestId,
              },
            }),
            { status: 403, headers },
          );
        }
      }

      // 4. Delegate to TanStack Start server handler
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response, requestId);
    } catch (error) {
      console.error(`[Server Fatal][${requestId}]`, error);
      const headers = new Headers(getStandardSecurityHeaders());
      headers.set("content-type", "text/html; charset=utf-8");
      headers.set("x-request-id", requestId);

      return new Response(renderErrorPage(), {
        status: 500,
        headers,
      });
    }
  },
};
