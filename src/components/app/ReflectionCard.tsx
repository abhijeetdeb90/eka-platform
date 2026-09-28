import { useRef, useState } from "react";
import { toast } from "sonner";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ReflectionCardData = {
  weekLabel: string;
  keptDays: number;
  ringPercent: number;
  tokens: number;
  practices: number;
  observations: number;
  journals: number;
  stageName: string;
  intention: string | null;
};

/* ---------------------------------------------------------------------------
 * A card anyone of any faith can hold: no deity, no doctrine, no ranking
 * against other people. Only your own week, said quietly.
 * ------------------------------------------------------------------------- */

function line(data: ReflectionCardData) {
  if (data.keptDays >= 6) return "A week that held.";
  if (data.keptDays >= 3) return "Enough returning to call it a rhythm.";
  if (data.keptDays >= 1) return "You began again. That counts.";
  return "A quiet week. The path is still here.";
}

export function ReflectionCard({ data }: { data: ReflectionCardData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const draw = async () => {
    const w = 1080;
    const h = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#f7f2e8";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#c8a26a";
    ctx.lineWidth = 3;
    ctx.strokeRect(48, 48, w - 96, h - 96);

    ctx.fillStyle = "#8a6a3b";
    ctx.font = "500 30px Georgia, serif";
    ctx.fillText("E K A   ·   Y O U R   W E E K", 110, 170);

    ctx.fillStyle = "#2b2723";
    ctx.font = "400 76px Georgia, serif";
    ctx.fillText(line(data), 110, 300);

    ctx.font = "400 34px Georgia, serif";
    ctx.fillStyle = "#5b544c";
    ctx.fillText(data.weekLabel, 110, 360);

    // Consistency ring
    const cx = w / 2;
    const cy = 660;
    const r = 170;
    ctx.lineWidth = 26;
    ctx.strokeStyle = "#e4d9c4";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "#c8a26a";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * data.ringPercent) / 100);
    ctx.stroke();
    ctx.fillStyle = "#2b2723";
    ctx.textAlign = "center";
    ctx.font = "400 96px Georgia, serif";
    ctx.fillText(`${data.keptDays}/7`, cx, cy + 18);
    ctx.font = "400 30px Georgia, serif";
    ctx.fillStyle = "#5b544c";
    ctx.fillText("days kept", cx, cy + 70);
    ctx.textAlign = "left";

    const rows = [
      ["Practice", `${data.practices}`],
      ["Observation", `${data.observations}`],
      ["Journal", `${data.journals}`],
      ["Path Tokens", `${data.tokens}`],
      ["Stage", data.stageName],
    ];
    let y = 940;
    for (const [label, value] of rows) {
      ctx.fillStyle = "#5b544c";
      ctx.font = "400 34px Georgia, serif";
      ctx.fillText(label!, 110, y);
      ctx.fillStyle = "#2b2723";
      ctx.textAlign = "right";
      ctx.fillText(value!, w - 110, y);
      ctx.textAlign = "left";
      ctx.strokeStyle = "#e4d9c4";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(110, y + 20);
      ctx.lineTo(w - 110, y + 20);
      ctx.stroke();
      y += 70;
    }

    ctx.fillStyle = "#8a6a3b";
    ctx.font = "italic 34px Georgia, serif";
    ctx.fillText(
      data.intention ? `Held with: ${data.intention}` : "Small moments, practiced consistently.",
      110,
      h - 130,
    );

    return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  };

  const download = async () => {
    setBusy(true);
    const blob = await draw();
    setBusy(false);
    if (!blob) {
      toast.error("Could not make the card just now.");
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eka-week-${data.weekLabel.replace(/\s+/g, "-").toLowerCase()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const share = async () => {
    setBusy(true);
    const blob = await draw();
    setBusy(false);
    if (!blob) return;
    const file = new File([blob], "eka-week.png", { type: "image/png" });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.share && nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({
          files: [file],
          text: `${line(data)} — ${data.keptDays}/7 days kept on EKA.`,
        });
        return;
      } catch {
        return; // a cancelled share is not an error
      }
    }
    await download();
    toast.success("Saved the card — share it wherever you like.");
  };

  return (
    <div>
      <div
        ref={ref}
        className="rounded-2xl border border-primary/25 bg-parchment/60 p-6"
        aria-label="Your week in reflection card"
      >
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          EKA · your week
        </p>
        <p className="mt-3 font-display text-2xl leading-snug">{line(data)}</p>
        <p className="mt-1 text-sm text-muted-foreground">{data.weekLabel}</p>

        <div className="mt-5 flex items-center gap-5">
          <div className="relative grid size-24 shrink-0 place-items-center">
            <svg viewBox="0 0 100 100" className="size-24 -rotate-90" aria-hidden="true">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-border"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className="text-primary"
                strokeDasharray={`${(2 * Math.PI * 42 * data.ringPercent) / 100} 999`}
              />
            </svg>
            <span className="absolute font-display text-lg">{data.keptDays}/7</span>
          </div>
          <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <dt className="text-muted-foreground">Practice</dt>
            <dd className="text-right">{data.practices}</dd>
            <dt className="text-muted-foreground">Observation</dt>
            <dd className="text-right">{data.observations}</dd>
            <dt className="text-muted-foreground">Journal</dt>
            <dd className="text-right">{data.journals}</dd>
            <dt className="text-muted-foreground">Tokens</dt>
            <dd className="text-right">{data.tokens}</dd>
            <dt className="text-muted-foreground">Stage</dt>
            <dd className="text-right">{data.stageName}</dd>
          </dl>
        </div>

        {data.intention && (
          <p className="mt-4 text-sm italic text-muted-foreground">Held with: {data.intention}</p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={download} disabled={busy}>
          <Download className="mr-1.5 size-4" aria-hidden="true" />
          Save as image
        </Button>
        <Button size="sm" variant="ghost" onClick={share} disabled={busy}>
          <Share2 className="mr-1.5 size-4" aria-hidden="true" />
          Share
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Nothing is posted anywhere unless you choose to share it. No names, no comparisons.
      </p>
    </div>
  );
}
