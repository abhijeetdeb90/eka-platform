import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { timeAgo } from "@/lib/eka";
import {
  VERIFICATION_COPY,
  fetchVerificationQueue,
  reviewPractitioner,
  type ReviewRow,
} from "@/lib/verification";

/** Identity, credentials and experience are judged one by one, by a person. */
export function VerificationQueue() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["admin-verification"],
    queryFn: fetchVerificationQueue,
  });
  const waiting = rows.filter(
    (r) => r.verification_status !== "approved" && r.verification_status !== "rejected",
  );
  const decided = rows.filter(
    (r) => r.verification_status === "approved" || r.verification_status === "rejected",
  );

  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-display text-lg">Practitioner verification</h2>
        <p className="text-xs text-muted-foreground">
          Nothing is granted automatically. EKA Verified follows identity, credentials and
          experience all being met.
        </p>
      </div>
      {waiting.length === 0 && (
        <p className="text-sm text-muted-foreground">No one is waiting for review.</p>
      )}
      {waiting.map((r) => (
        <ReviewCard
          key={r.id}
          row={r}
          onDone={() => void qc.invalidateQueries({ queryKey: ["admin-verification"] })}
        />
      ))}
      {decided.length > 0 && (
        <details className="rounded-2xl border border-border/70 bg-card p-4">
          <summary className="cursor-pointer text-sm">Already decided ({decided.length})</summary>
          <ul className="mt-3 space-y-1.5">
            {decided.map((r) => (
              <li key={r.id} className="text-xs text-muted-foreground">
                {r.display_name} · {VERIFICATION_COPY[r.verification_status]}
                {r.reviewed_at ? ` · ${timeAgo(r.reviewed_at)}` : ""}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

function ReviewCard({ row, onDone }: { row: ReviewRow; onDone: () => void }) {
  const [identity, setIdentity] = useState(row.identity_verified);
  const [credentials, setCredentials] = useState(row.credentials_verified);
  const [experience, setExperience] = useState(row.experience_verified);
  const [note, setNote] = useState(row.verification_note ?? "");
  const [busy, setBusy] = useState(false);

  const decide = async (status: "in_review" | "approved" | "rejected") => {
    setBusy(true);
    const { error } = await reviewPractitioner({
      id: row.id,
      status,
      identity,
      credentials,
      experience,
      note,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    onDone();
    toast.success(
      status === "approved"
        ? "Verified."
        : status === "rejected"
          ? "Not verified — recorded."
          : "Marked as being reviewed.",
    );
  };

  const checks: [string, boolean, (v: boolean) => void][] = [
    ["Identity", identity, setIdentity],
    ["Credentials", credentials, setCredentials],
    ["Experience", experience, setExperience],
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium">{row.display_name}</p>
        <span className="text-[11px] text-muted-foreground">
          {VERIFICATION_COPY[row.verification_status]} · joined {timeAgo(row.created_at)}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{row.headline}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{row.about}</p>
      <p className="mt-2 text-[11px] text-muted-foreground">
        {row.traditions.join(" · ")} — {row.years_experience} years
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {checks.map(([label, value, set]) => (
          <button
            key={label}
            type="button"
            onClick={() => set(!value)}
            className={
              value
                ? "rounded-full bg-foreground px-3 py-1 text-[11px] text-background"
                : "rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground"
            }
          >
            {label} {value ? "verified" : "not verified"}
          </button>
        ))}
      </div>

      <Input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note for the record"
        className="mt-3"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" disabled={busy} onClick={() => decide("approved")}>
          Approve
        </Button>
        <Button size="sm" variant="outline" disabled={busy} onClick={() => decide("in_review")}>
          Mark in review
        </Button>
        <Button size="sm" variant="ghost" disabled={busy} onClick={() => decide("rejected")}>
          Not verified
        </Button>
      </div>
    </div>
  );
}
