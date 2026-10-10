import { createServerFn } from "@tanstack/react-start";
import { askEkaTokenOptimized } from "./token-optimized-ai";

export const getAiAnswerServer = createServerFn({ method: "POST" })
  .validator((d: { query: string }) => d)
  .handler(async ({ data }) => {
    return await askEkaTokenOptimized(data.query);
  });