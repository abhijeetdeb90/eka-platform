import { createFileRoute } from "@tanstack/react-router";
import { assertServerRole } from "@/lib/auth/access-control";
import { createPresignedUploadUrl } from "@/lib/storage/r2";

export const Route = createFileRoute("/api/storage/upload-url")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Authenticate user
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
            fileName: string;
            mimeType: string;
            fileSizeBytes: number;
            namespace?: "USERS" | "CONTENT" | "CULTURAL_KNOWLEDGE" | "CREATOR_CONTENT" | "VERIFICATION";
            entityType?: "post" | "cultural_item" | "knowledge_object" | "creator_portfolio" | "avatar";
            isPublic?: boolean;
          };

          if (!body.fileName || !body.mimeType || !body.fileSizeBytes) {
            return new Response(
              JSON.stringify({ error: "Missing required fields: fileName, mimeType, fileSizeBytes" }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const result = await createPresignedUploadUrl({
            fileName: body.fileName,
            mimeType: body.mimeType,
            fileSizeBytes: body.fileSizeBytes,
            namespace: body.namespace,
            entityType: body.entityType,
            isPublic: body.isPublic !== false,
            userId: auth.userId,
          });

          return new Response(JSON.stringify({ success: true, ...result }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return new Response(JSON.stringify({ error: msg }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
