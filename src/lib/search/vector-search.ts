/**
 * EKA Hybrid Search & Vector Infrastructure
 *
 * Combines Lexical Full-Text Search (PostgreSQL GIN / tsvector) with
 * Dense Semantic Embeddings (pgvector cosine similarity).
 */

import { supabase } from "@/integrations/supabase/client";

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  source?: string | undefined;
  tradition?: string | undefined;
  epistemicTier: string;
  similarity: number;
}

/**
 * Generate embedding vector using Gemini or OpenAI embedding API
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  const EMBEDDING_API_KEY =
    process.env["EMBEDDING_API_KEY"] || process.env["VITE_EMBEDDING_API_KEY"];
  if (!EMBEDDING_API_KEY) {
    return null;
  }

  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${EMBEDDING_API_KEY}`,
      },
      body: JSON.stringify({
        input: text,
        model: "text-embedding-3-small",
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data: Array<{ embedding: number[] }> };
    return json.data[0]?.embedding ?? null;
  } catch {
    return null;
  }
}

/**
 * Perform Hybrid Search across canonical knowledge base and community posts
 */
export async function hybridSearch(query: string, limit = 10): Promise<SearchResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const embedding = await generateEmbedding(cleanQuery);

  // If vector embedding is available and Supabase RPC function `match_knowledge` exists
  if (embedding) {
    try {
      const response = await supabase.rpc(
        "match_knowledge" as never,
        {
          query_embedding: embedding,
          match_threshold: 0.75,
          match_count: limit,
        } as never,
      );

      const items = response.data as unknown as Array<Record<string, unknown>> | null;

      if (!response.error && Array.isArray(items) && items.length > 0) {
        return items.map((item) => ({
          id: String(item["id"] ?? ""),
          title: String(item["title"] || "Sacred Teaching"),
          snippet: String(item["content"] || item["snippet"] || item["body"] || ""),
          source: item["source"] ? String(item["source"]) : undefined,
          tradition: item["tradition"] ? String(item["tradition"]) : undefined,
          epistemicTier: String(item["epistemic_tier"] || "DOCUMENTED_TRADITION"),
          similarity: Number(item["similarity"] || 0.9),
        }));
      }
    } catch {
      // Fallback to lexical search below
    }
  }

  // Lexical Full-Text Search fallback via Supabase
  try {
    const { data } = await supabase
      .from("posts")
      .select("id, content, topic, created_at")
      .textSearch("content", cleanQuery, { type: "websearch" })
      .limit(limit);

    if (data && data.length > 0) {
      return data.map((p) => ({
        id: p.id,
        title: p.topic || "Community Reflection",
        snippet: p.content.substring(0, 200) + "...",
        source: undefined,
        tradition: undefined,
        epistemicTier: "OPINION",
        similarity: 0.8,
      }));
    }
  } catch {
    /* fallback to simple query */
  }

  return [];
}
