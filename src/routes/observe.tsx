import { createFileRoute } from "@tanstack/react-router";
import { ShowcaseLayout, ShowcaseGrid, ShowcaseSplit } from "@/components/site/Showcase";
import observeImage from "@/assets/observe.jpg";
import practiceImage from "@/assets/practice.jpg";

export const Route = createFileRoute("/observe")({
  head: () => ({
    meta: [
      { title: "Observe — The Multi-Faith Sacred Calendar on EKA" },
      {
        name: "description",
        content:
          "2026 observances across six traditions, with fasting start and end tracking held privately.",
      },
      { property: "og:title", content: "Observe on EKA" },
      {
        property: "og:description",
        content: "A multi-faith sacred calendar with private fasting tracking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ObservePage,
});

const items = [
  { meta: "Hindu", title: "Maha Shivaratri", body: "A night of vigil, mantra and fasting." },
  { meta: "Buddhist", title: "Vesak", body: "The birth, awakening and passing of the Buddha." },
  { meta: "Sikh", title: "Vaisakhi", body: "The founding of the Khalsa." },
  { meta: "Christian", title: "Ash Wednesday", body: "The beginning of Lent, marked by fasting." },
  { meta: "Islamic", title: "Ramadan", body: "A month of fasting, prayer and reflection." },
  { meta: "Jain", title: "Paryushana", body: "Eight days of fasting, reflection and forgiveness." },
] as const;

function ObservePage() {
  return (
    <ShowcaseLayout
      eyebrow="Phase 1 is live"
      title="Twenty-six sacred days. Six traditions. One calendar."
      lede="The 2026 observance calendar sits inside EKA — festivals, vigils and fast days from Hindu, Buddhist, Sikh, Christian, Islamic and Jain traditions, side by side."
      image={observeImage}
      imageAlt="A crescent moon over still water at dusk with a single lantern"
    >
      <ShowcaseGrid items={items} />
      <ShowcaseSplit
        image={practiceImage}
        imageAlt="Soft morning light across folded linen and a clay bowl"
        title="Start a fast. End a fast. Nothing announced."
        body="Fast days are flagged on the calendar. Begin one with a tap and close it when you break — the record stays private to you."
        points={[
          "Upcoming observances ordered by date",
          "Fasting days clearly marked",
          "Start and end times kept to your account alone",
          "A running history of every fast you have held",
        ]}
      />
    </ShowcaseLayout>
  );
}
