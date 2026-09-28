# Spiritual Rhythm — consistency, reminders and intentions

The Marketplace described in this message is already live in EKA: categories, practitioner cards with Eka Verified / Credential Verified / Top Rated / Eka Recommended badges, authenticity checks, transparent packages with the practitioner-payout-first pricing model (they set payout, EKA adds 10%), filters and sort, booking → slot → confirmation → verified-review-only flow, and the practitioner dashboard with monthly gross / EKA fee / net earnings. Two small gaps remain and are folded in below.

The new work is Rhythm: the consistency layer that sits inside Your Path.

## What gets built

### Your Rhythm (inside /app/path, and its own screen at /app/rhythm)

A daily table of sacred moments, each tied to a real EKA surface:

```text
🌅  6:30 AM   Morning practice      ○   → /app/practice
☀️  12:30 PM  Pause & Observe       ○   → /app/observe
🌆  6:30 PM   Evening reflection    ○   → /app/daily
🌙  9:30 PM   Journal               ○   → /app/journal
```

Tapping a row opens the real activity. Completing it there marks the moment done and awards Path Tokens through the existing token economy — no separate scoring.

### Consistency, not perfection

- Week strip: `M T W T F S S` with filled/open dots and "5 / 7 days".
- Consistency Ring — a signature EKA element: an arc showing days practiced out of the last 25, with the plain line "You've maintained your rhythm for 18 of the last 25 days."
- Two numbers side by side: **Current rhythm** (days) and **Lifetime practice** (total days ever). A missed day never zeroes lifetime, and the current rhythm reads "Yesterday was a pause. Today is another beginning." instead of a broken-streak warning.
- Summary block: practices, observations, journal entries, total tokens, current journey, and "Next unlock: N tokens".

### Reminders (never called alarms)

Users create their own Sacred Moments: glyph, name, time, days of the week, a line of guidance, and the linked pillar (practice / observe / journal / journey). Four sensible defaults are offered on first visit and can be edited or removed.

Delivery: browser notifications when the user grants permission, plus an always-present in-app cue — the next upcoming moment is pinned at the top of Your Path and Rhythm, and overdue moments stay gently visible for the rest of the day. No sound, no badges, no nagging.

### Intentions

When creating a reminder, EKA asks "Why do you want to practice?" — Peace, Discipline, Devotion, Awareness, Healing, Gratitude, Learning. Occasionally (roughly weekly, at most once a week per reminder) the moment resurfaces it: "You began this practice with the intention of cultivating awareness. Take a moment today to notice whether you've experienced it."

### Smart, not naggy

Two adaptations, both suggestions the user can decline:

- Repeatedly missed at a set time (5+ skips, few completions) → "6:30 AM seems difficult for you. Move your morning practice?" with **Change time** / **Keep 6:30**.
- A settled real pattern (8+ completions clustered in a window) → "You usually practice between 6:45–7:15 AM. Set your reminder around this time?" Accepting shifts the time; declining silences that suggestion for that reminder.

### Weekly rhythm review

At the end of the week, a "Your Week in Reflection" card: practices, observations, journal entries, day-rhythm, tokens earned, and how far the next stage is — ending in **Continue Your Path →**. This reuses the existing weekly challenge reward rather than inventing a second economy.

### Marketplace gaps closed

- A **Popular services** row on the marketplace home (Yoga · Astrology · Meditation · Puja), between Curated by EKA and New & rising.
- **Availability** and **Tradition / School** filters added to the existing filter panel.

## Technical notes

- Migration: `rhythm_reminders` (user_id, glyph, label, time_of_day, days_of_week int[], guidance, pillar kind, intention, active, suggested_change dismissal fields) and `rhythm_completions` (user_id, reminder_id, done_on date, completed_at time, unique per reminder per day). Both RLS-scoped to `auth.uid()` with GRANTs to `authenticated` and `service_role`. No new token table — completions call the existing `award_path_tokens` RPC, so daily tapering still applies and Rhythm cannot be farmed.
- `src/lib/rhythm.ts`: reminder CRUD, today's moments with status, week strip, current/lifetime rhythm, consistency ring math over a 25-day window, next-moment selection, missed-time and preferred-window detection, weekly review figures, intention resurfacing.
- New components: `ConsistencyRing`, `RhythmToday`, `ReminderForm`, `WeekStrip`, `WeeklyReview`; a compact Rhythm block embedded in `/app/path` links through to `/app/rhythm`.
- Notifications use the Notification API behind an explicit permission prompt, scheduled client-side while the tab is open; the in-app cue is the reliable path and works without permission.
- Nav: "Rhythm" added to the Your Path group.
