import { generateText } from "ai";

async function main() {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    console.warn("[AI Gateway] Note: AI_GATEWAY_API_KEY is not set or empty in your environment.");
  }

  const { text } = await generateText({
    model: "moonshotai/kimi-k3" as any,
    prompt:
      "Invent a new holiday. Describe its meaning, traditions, food, activities, and how people celebrate it around the world.",
  });

  console.log(text);
}

main().catch((error) => {
  console.error("AI Gateway example failed:", error.message || error);
  process.exitCode = 1;
});
