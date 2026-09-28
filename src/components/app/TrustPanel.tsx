import { useQuery } from "@tanstack/react-query";
import { Check, Minus, ShieldCheck } from "lucide-react";
import { fetchTrustProfile } from "@/lib/trust";
import { useFeatureFlag } from "@/hooks/useFlags";

function Fact({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      {ok ? (
        <Check
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-primary"
          strokeWidth={1.8}
        />
      ) : (
        <Minus
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
          strokeWidth={1.8}
        />
      )}
      <span className={ok ? "" : "text-muted-foreground"}>{children}</span>
    </li>
  );
}

/** Observable facts only. EKA verifies people, not spiritual authority. */
export function TrustPanel({ practitionerId }: { practitionerId: string }) {
  const enabled = useFeatureFlag("trust_profile_enabled");
  const { data: t } = useQuery({
    queryKey: ["trust-profile", practitionerId],
    queryFn: () => fetchTrustProfile(practitionerId),
    enabled,
  });

  if (!enabled || !t) return null;

  const completion = t.sessions_booked
    ? Math.round((t.sessions_completed / t.sessions_booked) * 100)
    : null;

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
      <div className="flex items-center gap-2">
        <ShieldCheck aria-hidden="true" className="size-4 text-primary" strokeWidth={1.6} />
        <h2 className="font-display text-lg">Trust profile</h2>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        What EKA can observe. Verification covers identity and credentials — never spiritual
        authority.
      </p>

      <ul className="mt-4 space-y-1.5">
        <Fact ok={t.identity_verified}>Identity verified</Fact>
        <Fact ok={t.credentials_verified}>Credentials and training reviewed</Fact>
        <Fact ok={t.experience_verified}>Experience confirmed</Fact>
        <Fact ok={t.standards_accepted}>Community standards accepted</Fact>
        <Fact ok={t.upheld_complaints === 0}>
          {t.upheld_complaints === 0
            ? "No upheld complaints"
            : `${t.upheld_complaints} upheld moderation action(s)`}
        </Fact>
      </ul>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        {[
          ["Practising since", t.years_experience ? `${t.years_experience} years` : "—"],
          ["On EKA since", new Date(t.member_since).getFullYear().toString()],
          ["Sessions completed", t.sessions_completed.toString()],
          ["Completion rate", completion === null ? "—" : `${completion}%`],
          ["People who returned", t.repeat_participants.toString()],
          [
            "Reviews",
            t.review_count ? `${t.rating.toFixed(1)} from ${t.review_count}` : "None yet",
          ],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border/60 p-3">
            <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {label}
            </dt>
            <dd className="mt-1">{value}</dd>
          </div>
        ))}
      </dl>

      {(t.traditions.length > 0 || t.languages.length > 0) && (
        <p className="mt-4 text-xs text-muted-foreground">
          {t.traditions.length > 0 && <>Traditions: {t.traditions.join(", ")}. </>}
          {t.languages.length > 0 && <>Languages: {t.languages.join(", ")}.</>}
        </p>
      )}
      <p className="mt-3 text-xs text-muted-foreground">
        Nothing on this panel can be bought, and payment volume does not affect it.
      </p>
    </section>
  );
}
