import type { GroundedSearchResult } from "@/routes/api/public/search.grounded";

export async function fetchGroundedCulturalSearch(
  query: string,
  topic?: string,
): Promise<GroundedSearchResult> {
  const response = await fetch("/api/public/search/grounded", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, topic }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(
      errorBody?.error?.message ||
        `Search failed with status ${response.status}`,
    );
  }

  const json = await response.json();
  return json.data as GroundedSearchResult;
}
