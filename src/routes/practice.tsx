import { createFileRoute } from "@tanstack/react-router";
import { ShowcaseLayout, ShowcaseGrid, ShowcaseSplit } from "@/components/site/Showcase";
import practiceImage from "@/assets/practice.jpg";
import journeyImage from "@/assets/journey.jpg";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice — A Faith-Aware Library on EKA" },
      {
        name: "description",
        content:
          "Guided breathwork, meditation, mantra and reflection across six traditions, with daily completions and streaks.",
      },
      { property: "og:title", content: "Practice on EKA" },
      {
        property: "og:description",
        content: "A faith-aware practice library with completions and streaks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PracticePage,
});

const items = [
  {
    meta: "Hindu",
    title: "So-Hum Breath",
    body: "Ride the natural sound of the breath — So on the inhale, Hum on the exhale.",
  },
  {
    meta: "Buddhist",
    title: "Anapanasati",
    body: "Mindfulness of breathing, the foundational practice taught by the Buddha.",
  },
  {
    meta: "Sikh",
    title: "Naam Simran",
    body: "Remembrance of the divine name, repeated quietly with the breath.",
  },
  {
    meta: "Christian",
    title: "Lectio Divina",
    body: "A slow, prayerful reading of scripture in four unhurried movements.",
  },
  {
    meta: "Islamic",
    title: "Dhikr",
    body: "Rhythmic remembrance until the tongue slows and the heart follows.",
  },
  {
    meta: "Jain",
    title: "Samayika",
    body: "Forty-eight minutes of equanimity, free from harm in thought and deed.",
  },
] as const;

function PracticePage() {
  return (
    <ShowcaseLayout
      eyebrow="Phase 1 is live"
      title="A practice library that knows your tradition."
      lede="Twelve guided practices across six traditions — breathwork, movement, mantra, scripture and reflection. Mark a practice complete and your streak keeps its own quiet count."
      image={practiceImage}
      imageAlt="Morning light across folded linen and a single clay bowl"
    >
      <ShowcaseGrid items={items} />
      <ShowcaseSplit
        image={journeyImage}
        imageAlt="A stone pilgrimage path winding through misty hills at dawn"
        title="Small, repeatable, yours."
        body="Practice on EKA is not a leaderboard. It is a record of returning — five minutes or fifty, whichever the day allows."
        points={[
          "Filter by tradition, category and length",
          "One-tap completion, once per practice per day",
          "Streaks that count returns, not perfection",
          "Sacred readings paired to each tradition",
        ]}
      />
    </ShowcaseLayout>
  );
}
