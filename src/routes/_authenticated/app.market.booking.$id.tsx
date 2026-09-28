import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchBooking,
  fetchReviewForBooking,
  formatINR,
  formatSlot,
  leaveReview,
  markBookingComplete,
} from "@/lib/marketplace";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/market/booking/$id")({
  head: () => ({
    meta: [
      { title: "Your session is confirmed | EKA Marketplace" },
      {
        name: "description",
        content:
          "Booking details for your EKA session, with the practitioner payout and platform fee shown in full.",
      },
      { property: "og:title", content: "Session confirmed | EKA" },
      {
        property: "og:description",
        content: "Your session with an EKA practitioner is confirmed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Session confirmed | EKA" },
      {
        name: "twitter:description",
        content: "Your session with an EKA practitioner is confirmed.",
      },
    ],
  }),
  component: BookingConfirmation,
});

function BookingConfirmation() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => fetchBooking(id),
  });
  const { data: review } = useQuery({
    queryKey: ["booking-review", id],
    queryFn: () => fetchReviewForBooking(id),
  });

  if (isLoading) return <p className="p-8 text-sm text-muted-foreground">Loading your booking…</p>;
  if (!booking)
    return (
      <div className="mx-auto max-w-2xl px-5 py-12">
        <p className="text-sm text-muted-foreground">That booking could not be found.</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link to="/app/market">Back to the marketplace</Link>
        </Button>
      </div>
    );

  return (
    <div className="mx-auto w-full max-w-2xl px-5 pb-12 pt-6 lg:pt-10">
      <header className="animate-rise rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
          {booking.status === "completed" ? "Session complete" : "Confirmed"}
        </p>
        <h1 className="mt-3 font-display text-3xl leading-tight">Your session is confirmed ✨</h1>
        <p className="mt-3 text-sm leading-relaxed">
          {booking.package_title} — {booking.duration_minutes} min
        </p>
        {booking.starts_at && (
          <p className="mt-1 text-sm text-muted-foreground">{formatSlot(booking.starts_at)}</p>
        )}
        {!booking.starts_at && (
          <p className="mt-1 text-sm text-muted-foreground">
            The practitioner will write to you to agree a time.
          </p>
        )}
        {booking.join_url && booking.status !== "completed" && (
          <Button asChild className="mt-5">
            <a href={booking.join_url} target="_blank" rel="noreferrer">
              Join session →
            </a>
          </Button>
        )}
      </header>

      <section className="mt-6 rounded-2xl border border-border/70 bg-parchment/40 p-5">
        <h2 className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
          Where your payment went
        </h2>
        <table className="mt-3 w-full text-sm">
          <tbody>
            <tr className="border-b border-border/60">
              <th scope="row" className="py-2 text-left font-normal">
                You paid
              </th>
              <td className="py-2 text-right">{formatINR(booking.price_cents)}</td>
            </tr>
            <tr className="border-b border-border/60">
              <th scope="row" className="py-2 text-left font-normal text-muted-foreground">
                EKA platform fee
              </th>
              <td className="py-2 text-right text-muted-foreground">
                {formatINR(booking.fee_cents)}
              </td>
            </tr>
            <tr>
              <th scope="row" className="py-2 text-left font-normal">
                Practitioner receives
              </th>
              <td className="py-2 text-right font-medium">{formatINR(booking.payout_cents)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {booking.status !== "completed" && (
        <Button
          variant="outline"
          size="sm"
          className="mt-6"
          onClick={async () => {
            await markBookingComplete(booking.id);
            await qc.invalidateQueries({ queryKey: ["booking", id] });
            toast.success("Marked as complete. You can leave a review now.");
          }}
        >
          Mark this session complete
        </Button>
      )}

      {booking.status === "completed" && !review && <ReviewForm bookingId={id} booking={booking} />}

      {review && (
        <section className="mt-8 rounded-2xl border border-border/70 bg-card p-5">
          <h2 className="font-display text-lg">Your review</h2>
          <p
            className="mt-1 flex items-center gap-1"
            aria-label={`You rated ${review.rating} out of 5`}
          >
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} aria-hidden="true" className="size-4 fill-current" />
            ))}
          </p>
          {review.body && <p className="mt-2 text-sm leading-relaxed">{review.body}</p>}
        </section>
      )}
    </div>
  );
}

function ReviewForm({
  bookingId,
  booking,
}: {
  bookingId: string;
  booking: Awaited<ReturnType<typeof fetchBooking>>;
}) {
  const qc = useQueryClient();
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <section className="mt-8 rounded-2xl border border-border bg-card p-5">
      <h2 className="font-display text-lg">How was your experience?</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Only people who completed a session can review, which is what makes these reviews worth
        reading.
      </p>

      <div className="mt-4 flex gap-1" role="radiogroup" aria-label="Rating out of five">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => setRating(n)}
            className={cn(
              "rounded-full p-1",
              rating >= n ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Star aria-hidden="true" className={cn("size-6", rating >= n && "fill-current")} />
          </button>
        ))}
      </div>

      <label
        htmlFor="review-body"
        className="mt-4 block text-xs uppercase tracking-[0.16em] text-muted-foreground"
      >
        A few words (optional)
      </label>
      <Textarea
        id="review-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="What was useful, and for whom would this be right?"
        className="mt-2"
      />

      <Button
        className="mt-4"
        disabled={!rating || saving || !booking}
        onClick={async () => {
          if (!booking || !rating) return;
          setSaving(true);
          const { error } = await leaveReview(booking, rating, body.trim());
          setSaving(false);
          if (error) {
            toast.error(error);
            return;
          }
          await qc.invalidateQueries({ queryKey: ["booking-review", bookingId] });
          toast.success("Thank you — your verified review is published.");
        }}
      >
        {saving ? "Saving…" : "Leave a verified review"}
      </Button>
    </section>
  );
}
