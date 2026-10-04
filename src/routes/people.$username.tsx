import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/people/$username")({
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
        <h1 className="font-display text-2xl">Member Profile: @{username}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Community member profile on EKA. Reflecting, curating, and contributing to living cultural traditions.
        </p>
      </div>
    </div>
  );
}
