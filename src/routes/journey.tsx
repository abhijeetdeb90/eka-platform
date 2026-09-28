import { createFileRoute } from "@tanstack/react-router";
import { ShowcaseLayout, ShowcaseGrid, ShowcaseSplit } from "@/components/site/Showcase";
import journeyImage from "@/assets/journey.jpg";
import observeImage from "@/assets/observe.jpg";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Journey — Pilgrimage and the Long Road on EKA" },
      {
        name: "description",
        content:
          "A preview of pilgrimage planning on EKA: sacred routes, seasons, companions and the practice of walking.",
      },
      { property: "og:title", content: "Journey on EKA" },
      { property: "og:description", content: "Pilgrimage planning, coming to EKA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JourneyPage,
});

const items = [
  {
    meta: "Route",
    title: "Char Dham",
    body: "Four Himalayan shrines, walked in a single season.",
  },
  {
    meta: "Route",
    title: "Camino de Santiago",
    body: "Eight hundred kilometres to the cathedral.",
  },
  { meta: "Route", title: "Kumano Kodo", body: "Cedar-shadowed paths through the Kii mountains." },
] as const;

function JourneyPage() {
  return (
    <ShowcaseLayout
      eyebrow="In preview"
      title="Some practices only happen on foot."
      lede="Journey will help you plan the pilgrimage you keep postponing — the right season, the honest distance, and the people from your Sanghas already walking it."
      image={journeyImage}
      imageAlt="A pilgrim walking a stone path through misty hills at dawn"
    >
      <ShowcaseGrid items={items} />
      <ShowcaseSplit
        image={observeImage}
        imageAlt="A crescent moon over still water at dusk"
        title="Planned around the calendar you already keep."
        body="Pilgrimage is tied to season and observance. Journey will read from the same sacred calendar that already lives in your app."
        points={[
          "Routes tied to traditions and observance dates",
          "Realistic stages, distances and seasons",
          "Companions found through your Sanghas",
          "Reflections posted from the road",
        ]}
      />
    </ShowcaseLayout>
  );
}
