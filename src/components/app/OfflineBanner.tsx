import { CloudOff } from "lucide-react";
import { useOnline } from "@/lib/offline";

/** Shown only when the device is genuinely offline. Calm, not alarming. */
export function OfflineBanner({ note }: { note: string }) {
  const online = useOnline();
  if (online) return null;
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary-soft/25 p-4">
      <CloudOff className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <p className="text-xs leading-relaxed text-muted-foreground">
        <span className="text-foreground">You're offline.</span> {note}
      </p>
    </div>
  );
}
