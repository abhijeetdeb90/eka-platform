import { createFileRoute } from "@tanstack/react-router";
import { ShowcaseLayout, ShowcaseGrid, ShowcaseSplit } from "@/components/site/Showcase";
import giveImage from "@/assets/give.jpg";
import journeyImage from "@/assets/journey.jpg";

export const Route = createFileRoute("/give")({
  head: () => ({
    meta: [
      { title: "Give — Transparent Generosity on EKA" },
      {
        name: "description",
        content:
          "A preview of transparent giving on EKA: verified institutions, published use of funds and honest receipts.",
      },
      { property: "og:title", content: "Give on EKA" },
      { property: "og:description", content: "Transparent generosity, coming to EKA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GivePage,
});

const items = [
  {
    meta: "Principle",
    title: "Verified only",
    body: "Institutions are reviewed before they can ever receive a rupee or a dollar.",
  },
  {
    meta: "Principle",
    title: "Published use",
    body: "Where the money went, stated plainly, in the same place you gave it.",
  },
  {
    meta: "Principle",
    title: "Honest receipts",
    body: "Every contribution returns a receipt and a permanent line in your history.",
  },
] as const;

function GivePage() {
  return (
    <ShowcaseLayout
      eyebrow="In preview"
      title="Generosity you can actually follow."
      lede="Giving is the oldest practice there is, and the least transparent. EKA is building a marketplace where the institution is verified, the spending is published, and the receipt arrives without asking."
      image={giveImage}
      imageAlt="Two open hands cupped together holding grains of rice in warm sunlight"
    >
      <ShowcaseGrid items={items} />
      <ShowcaseSplit
        image={journeyImage}
        imageAlt="A stone pilgrimage path winding through misty hills at dawn"
        title="Not yet open."
        body="Give is a preview of what comes after the social core. No contributions are being taken today — when it opens, it opens with verification and published accounts from the first day."
        points={[
          "Browse verified temples, sanghas, churches, mosques and trusts",
          "See published expenses before you decide",
          "Receipts and a full contribution history",
          "No commerce, no inventory, no shipping — only giving",
        ]}
      />
    </ShowcaseLayout>
  );
}
