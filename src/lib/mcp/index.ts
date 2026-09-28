import { auth, defineMcp } from "@lovable.dev/mcp-js";
import myProfileTool from "./tools/my-profile";
import myRecentReflectionsTool from "./tools/my-recent-reflections";
import mySummaryTool from "./tools/my-summary";

// The OAuth issuer MUST be the direct Supabase host (never the published
// proxy). The project ref is inlined at build time by Vite.
const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "eka",
  title: "EKA",
  version: "0.1.0",
  instructions:
    "EKA — the social network for your inner life. Connect as an EKA member and read your own profile, practice summary and recent journal reflections. All tools act only as the signed-in member and are read-only.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [myProfileTool, mySummaryTool, myRecentReflectionsTool],
});
