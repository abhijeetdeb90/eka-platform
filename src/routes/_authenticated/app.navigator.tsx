import { createFileRoute } from "@tanstack/react-router";
import { AppScreen } from "@/components/app/AppScreen";
import { AiNavigator } from "@/components/app/AiNavigator";

export const Route = createFileRoute("/_authenticated/app/navigator")({
  head: () => ({
    meta: [
      { title: "Wisdom Navigator | EKA" },
      {
        name: "description",
        content:
          "A quiet guide to what you might explore next on EKA, drawn only from your own Wisdom Passport, with a person always one tap away.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Wisdom Navigator | EKA" },
      { property: "og:description", content: "What to explore next, grounded in your own record." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NavigatorPage,
});

function NavigatorPage() {
  return (
    <AppScreen eyebrow="Guidance, not instruction" title="Wisdom Navigator">
      <p className="text-sm text-muted-foreground">
        Every suggestion comes with a reason drawn from your own record. Nothing here is a ranking,
        and you can always ask a person instead.
      </p>
      <AiNavigator />
    </AppScreen>
  );
}
