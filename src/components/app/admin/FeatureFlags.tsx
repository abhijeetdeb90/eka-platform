import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { FLAG_LABEL, fetchFlags, saveFlags, type FeatureFlag } from "@/lib/flags";

/** New systems ship dark; an administrator opens each one deliberately. */
export function FeatureFlags() {
  const queryClient = useQueryClient();
  const { data: flags } = useQuery({ queryKey: ["feature-flags"], queryFn: fetchFlags });

  if (!flags) return null;

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
      <h2 className="font-display text-lg">Feature flags</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Nothing here changes past data. Turning a flag off simply hides the surface.
      </p>
      <div className="mt-4 space-y-2">
        {(Object.keys(FLAG_LABEL) as FeatureFlag[]).map((key) => (
          <label key={key} className="flex items-center justify-between gap-4 text-sm">
            <span>{FLAG_LABEL[key]}</span>
            <Switch
              checked={flags[key]}
              onCheckedChange={async (on) => {
                const { error } = await saveFlags({ ...flags, [key]: on });
                if (error) {
                  toast.error(error.message);
                  return;
                }
                await queryClient.invalidateQueries({ queryKey: ["feature-flags"] });
                toast.success(`${FLAG_LABEL[key]} ${on ? "on" : "off"}`);
              }}
              aria-label={FLAG_LABEL[key]}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
