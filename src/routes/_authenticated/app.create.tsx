import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppScreen } from "@/components/app/AppScreen";
import { Composer } from "@/components/app/Composer";
import { KnowledgeComposer } from "@/components/app/KnowledgeComposer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/create")({
  component: CreatePage,
});

function CreatePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"share" | "knowledge">("share");

  return (
    <AppScreen eyebrow="Create" title="What is on your mind?">
      <div role="tablist" aria-label="What to create" className="flex gap-1.5">
        {(
          [
            { id: "share", label: "Share a reflection" },
            { id: "knowledge", label: "Contribute knowledge" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={mode === t.id}
            onClick={() => setMode(t.id)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs transition-colors",
              mode === t.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-accent",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {mode === "share" ? (
        <Composer onPosted={() => navigate({ to: "/app" })} />
      ) : (
        <KnowledgeComposer
          onPublished={(id) => navigate({ to: "/app/p/$postId", params: { postId: id } })}
        />
      )}

      <p className="text-xs text-muted-foreground">
        Reflections, questions, practices, wisdom and experiences are all welcome. Keep it kind:
        harassment, hate and fraudulent claims are removed.
      </p>
    </AppScreen>
  );
}
