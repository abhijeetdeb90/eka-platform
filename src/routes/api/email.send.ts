import { createFileRoute } from "@tanstack/react-router";
import { assertServerRole } from "@/lib/auth/access-control";
import {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendSubscriptionReceiptEmail,
  sendSecurityAlertEmail,
} from "@/lib/email/resend";

export const Route = createFileRoute("/api/email/send")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Authenticate via Internal Secret or Founder/Admin role
        const internalSecret = request.headers.get("x-internal-secret");
        const queueSecret = process.env["QUEUE_WORKER_SECRET"];

        let isAuthorized = false;
        if (queueSecret && internalSecret === queueSecret) {
          isAuthorized = true;
        } else {
          const auth = await assertServerRole(request, ["admin", "super_admin", "founder"]);
          if (auth.ok) {
            isAuthorized = true;
          }
        }

        if (!isAuthorized) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const body = (await request.json()) as {
            template: "welcome" | "verification" | "receipt" | "security_alert";
            email: string;
            name?: string;
            verificationUrl?: string;
            creatorName?: string;
            planName?: string;
            amount?: number;
            currency?: string;
            invoiceNumber?: string;
            eventType?: string;
            ipAddress?: string;
            location?: string;
          };

          if (!body.email || !body.template) {
            return new Response(
              JSON.stringify({ error: "Missing required fields: email and template" }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          let result;
          switch (body.template) {
            case "welcome":
              result = await sendWelcomeEmail({ email: body.email, name: body.name });
              break;
            case "verification":
              result = await sendVerificationEmail({
                email: body.email,
                name: body.name,
                verificationUrl: body.verificationUrl || "https://eka.earth/auth",
              });
              break;
            case "receipt":
              result = await sendSubscriptionReceiptEmail({
                email: body.email,
                name: body.name,
                creatorName: body.creatorName || "Traditional Lineage Master",
                planName: body.planName || "Patron Tier",
                amount: body.amount || 499,
                currency: body.currency || "INR",
                invoiceNumber: body.invoiceNumber || `EKA-${Date.now()}`,
                date: new Date().toLocaleDateString("en-IN"),
              });
              break;
            case "security_alert":
              result = await sendSecurityAlertEmail({
                email: body.email,
                name: body.name,
                eventType: body.eventType || "New Device Sign-in",
                ipAddress: body.ipAddress,
                location: body.location,
                timestamp: new Date().toUTCString(),
              });
              break;
            default:
              return new Response(JSON.stringify({ error: "Invalid template type" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
          }

          return new Response(JSON.stringify(result), {
            status: result.success ? 200 : 500,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          return new Response(JSON.stringify({ error: String(err) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
