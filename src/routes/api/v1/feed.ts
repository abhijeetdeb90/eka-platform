import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/v1/feed")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const cursor = url.searchParams.get("cursor");
        const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "20", 10), 1), 50);

        const authHeader = request.headers.get("authorization");
        let currentUserId: string | null = null;
        let token: string | null = null;

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

        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.replace(/^Bearer\s+/i, "").trim();
          const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_KEY, {
            auth: { persistSession: false },
            global: { headers: { Authorization: `Bearer ${token}` } },
          });
          const { data } = await supabaseAuth.auth.getUser(token);
          if (data?.user) {
            currentUserId = data.user.id;
          }
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
          auth: { persistSession: false },
          ...(token ? { global: { headers: { Authorization: `Bearer ${token}` } } } : {}),
        });

        if (!currentUserId) {
          return new Response(JSON.stringify({ error: "Sign in to load your community feed." }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        // The live schema uses following_id and has no follow-status column.
        const { data: followRows, error: followsError } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", currentUserId);
        if (followsError) {
          return new Response(JSON.stringify({ error: "Could not load followed accounts." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
        const followedIds = (followRows || []).map((f: any) => f.following_id);
        const authorIds = [currentUserId, ...followedIds];

        // 2. Query posts
        let query = supabase
          .from("posts")
          .select(`
            id,
            author_id,
            content,
            topic,
            tradition,
            type,
            visibility,
            status,
            media_url,
            created_at,
            author:profiles(id, display_name, username, avatar_url)
          `)
          .eq("status", "visible")
          .order("created_at", { ascending: false })
          .limit(limit);

        if (cursor) {
          query = query.lt("created_at", cursor);
        }

        query = query.in("author_id", authorIds);

        const { data: posts, error } = await query;

        if (error) {
          console.error("feed_fetch_error", error.message);
          return new Response(JSON.stringify({ error: "Could not fetch feed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        const nextCursor = posts && posts.length === limit ? posts[posts.length - 1]?.created_at : null;

        return new Response(
          JSON.stringify({
            posts: posts || [],
            nextCursor,
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
