import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "my_profile",
  title: "My EKA profile",
  description: "Read the signed-in member's own EKA profile.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, display_name, username, bio, account_type, intentions, interests, practices, religion, community_background, purposes, reflection_tone, onboarded, created_at",
      )
      .eq("id", ctx.getUserId())
      .maybeSingle();
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : {
          content: [{ type: "text", text: JSON.stringify(data) }],
          structuredContent: { profile: data },
        };
  },
});
