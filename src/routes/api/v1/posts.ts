import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const MAX_IMAGES = 4;
const MAX_BODY_LENGTH = 5000;

const createPostSchema = z
  .object({
    body: z.string().trim().max(MAX_BODY_LENGTH).default(""),
    visibility: z.enum(["public", "followers"]).default("public"),
    topic: z.string().trim().max(100).default("Cultural Heritage"),
    tradition: z.string().trim().max(100).optional(),
    media: z
      .array(
        z
          .object({
            path: z.string().min(1).max(500),
            mediaType: z.enum(["image", "video"]),
            altText: z.string().trim().max(1000).default(""),
          })
          .strict(),
      )
      .max(MAX_IMAGES)
      .default([]),
  })
  .strict()
  .refine(
    (value) => value.body.length > 0 || value.media.length > 0,
    { message: "Add text or at least one media item." },
  )
  .refine(
    (value) => new Set(value.media.map((item) => item.path)).size === value.media.length,
    { message: "Duplicate media paths are not allowed." },
  );

export const Route = createFileRoute("/api/v1/posts")({
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

        const parsed = createPostSchema.safeParse(input);
        if (!parsed.success) {
          return new Response(
            JSON.stringify({ error: "Invalid post", details: parsed.error.flatten() }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        const postInput = parsed.data;

        // Ensure each media path is in the authenticated user's folder and exists in storage
        for (const item of postInput.media) {
          if (!item.path.startsWith(`${user.id}/`)) {
            return new Response(
              JSON.stringify({ error: "Invalid media path: must reside in user directory" }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const slashIndex = item.path.lastIndexOf("/");
          const folder = item.path.slice(0, slashIndex);
          const filename = item.path.slice(slashIndex + 1);

          if (!filename) {
            return new Response(
              JSON.stringify({ error: "Invalid media filename" }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const { data: files, error: listError } = await supabase.storage
            .from("post-media")
            .list(folder, {
              limit: 100,
              search: filename,
            });

          if (listError) {
            console.error("post_media_check_failed", listError.message);
            return new Response(
              JSON.stringify({ error: "Could not verify uploaded media" }),
              { status: 500, headers: { "Content-Type": "application/json" } },
            );
          }

          const exists = files?.some((file) => file.name === filename);
          if (!exists) {
            return new Response(
              JSON.stringify({
                error: `Uploaded file not found in storage: ${filename}. Please upload before creating the post.`,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }
        }

        // Atomic Postgres RPC inserts the post and all media rows transactionally
        const { data: postId, error: createError } = await supabase.rpc(
          "create_post_with_media",
          {
            p_body: postInput.body,
            p_visibility: postInput.visibility,
            p_media: postInput.media.map((item) => ({
              path: item.path,
              media_type: item.mediaType,
              alt_text: item.altText,
            })),
            p_topic: postInput.topic,
            p_tradition: postInput.tradition || null,
          },
        );

        if (createError) {
          console.error("post_create_failed", {
            code: createError.code,
            message: createError.message,
          });

          // Fallback direct insert if RPC function is not yet migrated to the remote Supabase instance
          const fallbackMediaUrl = postInput.media[0]?.path
            ? `${SUPABASE_URL}/storage/v1/object/public/post-media/${postInput.media[0].path}`
            : null;

          const { data: fallbackPost, error: fallbackError } = await supabase
            .from("posts")
            .insert({
              author_id: user.id,
              content: postInput.body,
              topic: postInput.topic,
              tradition: postInput.tradition || null,
              visibility: postInput.visibility,
              type: postInput.media.length > 1 ? "carousel" : postInput.media[0]?.mediaType === "video" ? "video" : "post",
              status: "visible",
              media_url: fallbackMediaUrl,
            })
            .select("id")
            .single();

          if (fallbackError) {
            return new Response(
              JSON.stringify({ error: "Could not create post", details: fallbackError.message }),
              { status: 500, headers: { "Content-Type": "application/json" } },
            );
          }

          return new Response(
            JSON.stringify({
              post: {
                id: fallbackPost.id,
                body: postInput.body,
                visibility: postInput.visibility,
                topic: postInput.topic,
                media: postInput.media,
              },
            }),
            { status: 201, headers: { "Content-Type": "application/json" } },
          );
        }

        return new Response(
          JSON.stringify({
            post: {
              id: postId,
              body: postInput.body,
              visibility: postInput.visibility,
              topic: postInput.topic,
              media: postInput.media,
            },
          }),
          { status: 201, headers: { "Content-Type": "application/json" } },
        );
      },
    },
  },
});
