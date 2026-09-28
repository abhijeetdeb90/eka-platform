import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "my_recent_reflections",
  title: "My recent reflections",
  description:
    "Read the signed-in member's most recent private journal reflections, newest first. Private to them.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(20)
      .optional()
      .describe("How many reflections to return (1–20, default 5)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const take = Math.min(Math.max(limit ?? 5, 1), 20);
    const { data, error } = await supabase
      .from("journal_entries")
      .select("content, mood, tags, created_at")
      .eq("user_id", ctx.getUserId())
      .order("created_at", { ascending: false })
      .limit(take);
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : {
          content: [{ type: "text", text: JSON.stringify(data) }],
          structuredContent: { reflections: data },
        };
  },
});
