import { createFileRoute } from "@tanstack/react-router";
import { ShowcaseLayout, ShowcaseGrid, ShowcaseSplit } from "@/components/site/Showcase";
import practiceImage from "@/assets/practice.jpg";
import giveImage from "@/assets/give.jpg";

export const Route = createFileRoute("/ritual-kits")({
  head: () => ({
    meta: [
      { title: "Ritual Kits — The Objects of Practice on EKA" },
      {
        name: "description",
        content:
          "A preview of EKA ritual kits: quiet, well-made objects for daily practice. Not yet for sale.",
      },
      { property: "og:title", content: "Ritual Kits on EKA" },
      { property: "og:description", content: "The objects of daily practice, previewed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RitualKitsPage,
});

const items = [
  {
    meta: "Kit",
    title: "The Morning Kit",
    body: "A clay bowl, a beeswax taper and a linen mat for the first ten minutes of the day.",
  },
  {
    meta: "Kit",
    title: "The Mala Kit",
    body: "One hundred and eight beads, a counting ring and a cloth pouch.",
  },
  {
    meta: "Kit",
    title: "The Fasting Kit",
    body: "A water vessel, a salt dish and a card of the year's fast days.",
  },
] as const;

function RitualKitsPage() {
  return (
    <ShowcaseLayout
      eyebrow="In preview"
      title="The few objects a practice actually needs."
      lede="A practice holds better when something in the room belongs to it. Ritual Kits are a preview of the physical side of EKA — quiet, well-made, and deliberately few."
      image={practiceImage}
      imageAlt="A clay bowl resting on folded linen in soft morning light"
    >
      <ShowcaseGrid items={items} />
      <ShowcaseSplit
        image={giveImage}
        imageAlt="Two open hands holding grains of rice in warm sunlight"
        title="Shown, not sold."
        body="Nothing here is purchasable today and no orders are being taken. EKA's focus stays on the inner life; the objects follow only when they can be made properly."
        points={[
          "Designed around the practices already in the app",
          "Made in small batches with named makers",
          "One kit per practice, never a catalogue",
          "No checkout, no inventory, no shipping at this stage",
        ]}
      />
    </ShowcaseLayout>
  );
}
