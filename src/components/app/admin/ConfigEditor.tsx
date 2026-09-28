import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { timeAgo } from "@/lib/eka";
import {
  fetchConfigChanges,
  fetchConfigRows,
  saveConfig,
  type Bucket,
  type ConfigRow,
  type Weight,
} from "@/lib/config";

/** The economics of EKA, editable by a person rather than a deploy. */
export function ConfigEditor() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({ queryKey: ["admin-config"], queryFn: fetchConfigRows });
  const { data: changes = [] } = useQuery({
    queryKey: ["admin-config-changes"],
    queryFn: fetchConfigChanges,
  });

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["admin-config"] });
    void qc.invalidateQueries({ queryKey: ["admin-config-changes"] });
    void qc.invalidateQueries({ queryKey: ["platform-config"] });
  };

  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-display text-lg">Economics</h2>
        <p className="text-xs text-muted-foreground">
          Every screen that shows a percentage reads these values. Changes are recorded with who
          made them.
        </p>
      </div>
      {rows.map((row) =>
        Array.isArray(row.value) ? (
          <PercentListRow key={row.key} row={row} onSaved={refresh} />
        ) : (
          <NumberRow key={row.key} row={row} onSaved={refresh} />
        ),
      )}

      {changes.length > 0 && (
        <details className="rounded-2xl border border-border/70 bg-card p-4">
          <summary className="cursor-pointer text-sm">Change history ({changes.length})</summary>
          <ul className="mt-3 space-y-1.5">
            {changes.map((c) => (
              <li key={c.id} className="text-xs text-muted-foreground">
                {c.key} · {timeAgo(c.created_at)}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

function NumberRow({ row, onSaved }: { row: ConfigRow; onSaved: () => void }) {
  const [value, setValue] = useState(String(row.value ?? ""));
  const [busy, setBusy] = useState(false);
  useEffect(() => setValue(String(row.value ?? "")), [row.value]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-sm font-medium">{row.label}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{row.description}</p>
      <div className="mt-3 flex items-end gap-2">
        <Input
          value={value}
          inputMode="numeric"
          onChange={(e) => setValue(e.target.value.replace(/[^\d]/g, ""))}
          className="max-w-[160px]"
        />
        <Button
          size="sm"
          disabled={busy || value === String(row.value)}
          onClick={async () => {
            setBusy(true);
            const { error } = await saveConfig(row.key, Number(value));
            setBusy(false);
            if (error) {
              toast.error(error.message);
              return;
            }
            onSaved();
            toast.success("Saved.");
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

type Item = Bucket | Weight;
const nameOf = (i: Item) => ("label" in i && i.label ? i.label : i.key);

function PercentListRow({ row, onSaved }: { row: ConfigRow; onSaved: () => void }) {
  const [items, setItems] = useState<Item[]>(row.value as Item[]);
  const [busy, setBusy] = useState(false);
  useEffect(() => setItems(row.value as Item[]), [row.value]);

  const total = items.reduce((n, i) => n + Number(i.percent || 0), 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-sm font-medium">{row.label}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{row.description}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item, index) => (
          <li key={item.key} className="flex items-center gap-3">
            <span className="min-w-0 grow truncate text-sm">{nameOf(item)}</span>
            <Input
              value={String(item.percent)}
              inputMode="numeric"
              onChange={(e) => {
                const next = [...items];
                next[index] = {
                  ...item,
                  percent: Number(e.target.value.replace(/[^\d]/g, "") || 0),
                } as Item;
                setItems(next);
              }}
              className="w-20 text-right"
            />
            <span className="text-xs text-muted-foreground">%</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-3">
        <Button
          size="sm"
          disabled={busy || total !== 100}
          onClick={async () => {
            setBusy(true);
            const { error } = await saveConfig(row.key, items);
            setBusy(false);
            if (error) {
              toast.error(error.message);
              return;
            }
            onSaved();
            toast.success("Saved.");
          }}
        >
          Save
        </Button>
        <span
          className={total === 100 ? "text-xs text-muted-foreground" : "text-xs text-destructive"}
        >
          {total}% of 100
        </span>
      </div>
    </div>
  );
}
