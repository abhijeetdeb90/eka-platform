import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/integrations/supabase/client";

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server");
  }
  return new GoogleGenAI({ apiKey });
}

export const askEkaIntelligence = createServerFn({ method: "POST" })
  .validator((d: { query: string }) => d)
  .handler(async ({ data }) => {
    // 1. First, search Supabase for context to ground the AI response
    let contextData = "";
    try {
      const { data: searchData } = await supabase
        .from("posts")
        .select("topic, tradition, content")
        .limit(5);

      if (searchData && searchData.length > 0) {
        contextData = searchData
          .map((p) => `Topic: ${p.topic}\nTradition: ${p.tradition}\nContent: ${p.content}`)
          .join("\n\n");
      }
    } catch (e) {
      console.error("Failed to fetch context", e);
    }

    const systemPrompt = `You are the core intelligence of EKA, a cultural preservation platform.
Your task is to answer the user's cultural question accurately, deeply, and neutrally.
Rules:
1. Provide a direct, culturally accurate answer.
2. Highlight who practices it and where.
3. If relevant, mention cultural variations.
4. Keep it structured and easy to read.
5. If there is context provided below, use it to ground your response. If the context doesn't answer it, rely on your deep cultural knowledge but clarify it's a general synthesis.

Context from EKA Database:
${contextData || "No direct local context found."}`;

    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: systemPrompt }, { text: `User Query: ${data.query}` }] },
        ],
      });

      return {
        success: true,
        text: response.text,
      };
    } catch (error: any) {
      console.error("Gemini AI generation failed:", error);
      return {
        success: false,
        text: "The cultural intelligence layer is currently calibrating. Please try again later.",
      };
    }
  });
