import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "my_summary",
  title: "My EKA summary",
  description:
    "A short overview of the signed-in member's practice: reflections, offerings, circles, practice days and the journey they are on.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const uid = ctx.getUserId();
    const [journal, posts, circles, practice, enrollment] = await Promise.all([
      supabase
        .from("journal_entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", uid),
      supabase.from("posts").select("id", { count: "exact", head: true }).eq("author_id", uid),
      supabase
        .from("community_members")
        .select("id", { count: "exact", head: true })
        .eq("user_id", uid),
      supabase
        .from("practice_completions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", uid),
      supabase
        .from("journey_enrollments")
        .select("id, started_at, completed_at, journey_id, journeys(title, duration_days, promise)")
        .eq("user_id", uid)
        .is("completed_at", null)
        .limit(1)
        .maybeSingle(),
    ]);
    const summary = {
      reflections: journal.count ?? 0,
      offerings: posts.count ?? 0,
      circles: circles.count ?? 0,
      practice_days: practice.count ?? 0,
      current_journey: enrollment.data ?? null,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(summary) }],
      structuredContent: { summary },
    };
  },
});
