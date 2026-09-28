import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export type WeeklyReviewData = {
  practices: number;
  observations: number;
  journals: number;
  rhythmDays: number;
  tokens: number;
  nextStageName: string | null;
  nextStageGap: number;
};

/** The week, said back plainly, and then pointed at the path again. */
export function WeeklyReview({ data }: { data: WeeklyReviewData }) {
  return (
    <section className="rounded-2xl border border-border bg-parchment/40 p-5">
      <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
        Your week in reflection
      </p>
      <ul className="mt-3 space-y-1.5 text-sm">
        <li>🧘 {data.practices} practices</li>
        <li>👁️ {data.observations} observations</li>
        <li>📖 {data.journals} journal entries</li>
        <li>🔥 {data.rhythmDays}-day rhythm</li>
        <li>🪙 +{data.tokens} Path Tokens</li>
      </ul>
      {data.nextStageName && (
        <p className="mt-3 text-sm text-muted-foreground">
          You are {data.nextStageGap} tokens away from {data.nextStageName}.
        </p>
      )}
      <Button asChild size="sm" variant="outline" className="mt-4">
        <Link to="/app/path">Continue your path →</Link>
      </Button>
    </section>
  );
}
