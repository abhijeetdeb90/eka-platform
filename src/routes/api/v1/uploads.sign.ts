import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const inputSchema = z
  .object({
    contentType: z.enum(["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"]),
  })
  .strict();

export const Route = createFileRoute("/api/v1/uploads/sign")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const token = authHeader.replace(/^Bearer\s+/i, "").trim();

        const SUPABASE_URL =
          process.env["SUPABASE_URL"] ||
          process.env["VITE_SUPABASE_URL"] ||
          process.env["NEXT_PUBLIC_SUPABASE_URL"] ||
          "https://kbiutqzhcbyuseygcspe.supabase.co";

        const SUPABASE_KEY =
          process.env["SUPABASE_SECRET_KEY"] ||
          process.env["SUPABASE_SERVICE_ROLE_KEY"] ||
          process.env["SUPABASE_PUBLISHABLE_KEY"] ||
          process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
          "sb_publishable_DKdNOtbppccL297o2_Ixkw_f2j0Rf7-";

        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
          auth: { persistSession: false },
          global: { headers: { Authorization: `Bearer ${token}` } },
        });

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !user) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        let input: unknown;
        try {
          input = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const parsed = inputSchema.safeParse(input);
        if (!parsed.success) {
          return new Response(JSON.stringify({ error: "Unsupported media type" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const extensionByType: Record<string, string> = {
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
          "video/mp4": "mp4",
          "video/webm": "webm",
        };

        const ext = extensionByType[parsed.data.contentType] || "bin";
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

        const { data, error } = await supabase.storage
          .from("post-media")
          .createSignedUploadUrl(path);

        if (error) {
          console.error("signed_upload_url_failed", error.message);
          return new Response(JSON.stringify({ error: "Could not prepare upload" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(
          JSON.stringify({
            path,
            token: data.token,
            signedUrl: data.signedUrl,
            bucket: "post-media",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      },
    },
  },
});
