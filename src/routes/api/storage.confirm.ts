import { createFileRoute } from "@tanstack/react-router";
import { assertServerRole } from "@/lib/auth/access-control";
import { auditService } from "@/lib/payments/audit.service";
import { getPublicMediaUrl } from "@/lib/storage/r2";

export const Route = createFileRoute("/api/storage/confirm")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await assertServerRole(request, [
          "consumer",
          "creator",
          "brand",
          "enterprise",
          "moderator",
          "admin",
          "super_admin",
          "founder",
        ]);

        if (!auth.ok) {
          return new Response(JSON.stringify({ error: auth.error || "Authentication required" }), {
            status: auth.status,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const body = (await request.json()) as {
            fileKey: string;
            ekaId: string;
            fileName: string;
            mimeType: string;
            fileSizeBytes: number;
            entityType?: string;
            entityId?: string;
            isPublic?: boolean;
          };

          if (!body.fileKey || !body.ekaId) {
            return new Response(
              JSON.stringify({ error: "Missing required fields: fileKey and ekaId" }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const publicUrl = body.isPublic !== false ? getPublicMediaUrl(body.fileKey) : null;

          // Record asset upload event in audit log
          await auditService.recordEvent({
            actor_id: auth.userId || "anonymous",
            action: "media_asset_uploaded",
            entity_type: body.entityType || "media_asset",
            entity_id: body.ekaId,
            metadata: {
              file_key: body.fileKey,
              file_name: body.fileName,
              mime_type: body.mimeType,
              size_bytes: body.fileSizeBytes,
              public_url: publicUrl,
              storage_provider: "cloudflare_r2",
            },
          });

          return new Response(
            JSON.stringify({
              success: true,
              ekaId: body.ekaId,
              fileKey: body.fileKey,
              publicUrl,
              status: "confirmed",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
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
