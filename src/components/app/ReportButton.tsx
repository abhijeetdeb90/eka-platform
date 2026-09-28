import { useState } from "react";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import { REPORT_REASONS, reportContent } from "@/lib/discover";

/** Every piece of Discover content can be reported by anyone who sees it. */
export function ReportButton({ targetKind, targetId }: { targetKind: string; targetId: string }) {
  const [open, setOpen] = useState(false);

  const send = async (reason: string) => {
    await reportContent(targetKind, targetId, reason, "");
    setOpen(false);
    toast.success("Reported. A person reviews this, not a machine.");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Report this"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <Flag className="size-4" aria-hidden />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-64 space-y-1 rounded-xl border border-border bg-card p-2 shadow-lift">
          {REPORT_REASONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => send(r)}
              className="block w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-accent"
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
