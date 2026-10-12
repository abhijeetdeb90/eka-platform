import { generateText } from "ai";

async function main() {
  if (!process.env.AI_GATEWAY_API_KEY) {
    throw new Error(
      "AI_GATEWAY_API_KEY is missing. Set it in your local environment before running this example.",
    );
  }

  const { text } = await generateText({
    model: "moonshotai/kimi-k3",
    prompt:
      "Invent a new holiday. Describe its meaning, traditions, food, activities, and how people celebrate it around the world.",
  });

  console.log(text);
}

main().catch((error) => {
  console.error("AI Gateway example failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
