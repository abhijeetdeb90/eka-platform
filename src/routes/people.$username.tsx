import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/people/$username")({
  beforeLoad: ({ params }) => {
    if (params.username.toLowerCase() === "ad") {
      throw redirect({
        to: "/founder/ad",
      });
    }
  },
  head: () => ({
    meta: [{ title: "Person on EKA" }, { name: "robots", content: "noindex" }],
  }),
  component: PeoplePage,
});

function PeoplePage() {
  const { username } = Route.useParams();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <h1 className="font-display text-2xl">Profile: @{username}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Community member profile. To explore EKA's founder profile, visit{" "}
          <a href="/founder/ad" className="text-primary underline">
            /founder/ad
          </a>
          .
        </p>
      </div>
    </div>
  );
}
