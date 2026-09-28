// ==============================================================================
// EKA STUDIO — COMMUNITY CCRM & SACRED ENGAGEMENT MODULE
// ==============================================================================

import { useState } from "react";
import {
  Calendar,
  MessageSquare,
  Users,
  Sparkles,
  HeartHandshake,
  CheckCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { StudioRole } from "@/lib/studio/types";

interface StudioEngagementCCRMProps {
  currentRole: StudioRole;
}

const SEED_INTERACTIONS = [
  {
    id: "int_01",
    creator: "Aditya Verma",
    type: "Scholar Outreach",
    notes: "Approved proposal for 5-part Rigveda solar hymns audio series.",
    status: "Completed",
    date: "2026-09-22",
  },
  {
    id: "int_02",
    creator: "Tenzin Palmo",
    type: "Vipassana Retreat Ingestion",
    notes: "Assisting with Bodh Gaya meditation audio series rights clearances.",
    status: "In Progress",
    date: "2026-09-25",
  },
];

const SEED_EVENTS = [
  {
    id: "evt_01",
    title: "Global Chhath Puja Sunset Observance",
    tradition: "Vedic Solar Folkways",
    registered_count: 1450,
    date: "2026-11-14",
    status: "Scheduled",
  },
  {
    id: "evt_02",
    title: "Advaita Vedanta & Non-Dual Contemplation Colloquium",
    tradition: "Advaita Vedanta",
    registered_count: 620,
    date: "2026-10-05",
    status: "Live Registration",
  },
];

export function StudioEngagementCCRM({ currentRole }: StudioEngagementCCRMProps) {
  const [interactions, setInteractions] = useState(SEED_INTERACTIONS);
  const [events, setEvents] = useState(SEED_EVENTS);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("2026-10-15");

  const handleCreateEvent = () => {
    if (!eventTitle.trim()) {
      toast.error("Event title required.");
      return;
    }
    const newEvt = {
      id: `evt_${Date.now()}`,
      title: eventTitle.trim(),
      tradition: "Pan-Dharmic",
      registered_count: 0,
      date: eventDate,
      status: "Scheduled",
    };
    setEvents([...events, newEvt]);
    setIsAddingEvent(false);
    setEventTitle("");
    toast.success("Sacred event created and published to calendar.");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-normal tracking-tight">
            Community CRM & Sacred Engagement
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage creator partnerships, contemplative colloquiums, and living community milestones.
          </p>
        </div>
        <Button size="sm" onClick={() => setIsAddingEvent(true)}>
          <Plus className="mr-1.5 size-4" /> Schedule Sacred Event
        </Button>
      </div>

      {isAddingEvent && (
        <div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-calm space-y-4">
          <h3 className="font-display text-base font-medium">Schedule Sacred Event / Colloquium</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Event Title</label>
              <Input
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g. Dawn Chanting Global Circle"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Date</label>
              <Input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setIsAddingEvent(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateEvent}>
              Publish Event
            </Button>
          </div>
        </div>
      )}

      {/* Grid: Events & Interactions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Events Panel */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-medium">Sacred Calendar Events</h3>
            <Calendar className="size-4 text-primary" />
          </div>

          <div className="space-y-3">
            {events.map((evt) => (
              <div key={evt.id} className="rounded-xl border border-border p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-primary">{evt.tradition}</span>
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-muted-foreground">
                    {evt.status}
                  </span>
                </div>
                <h4 className="font-display text-base font-medium">{evt.title}</h4>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                  <span>Date: {evt.date}</span>
                  <span>{evt.registered_count} RSVP Seekers</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Creator CCRM Interactions */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-medium">Creator Pipeline & CCRM Logs</h3>
            <HeartHandshake className="size-4 text-primary" />
          </div>

          <div className="space-y-3">
            {interactions.map((int) => (
              <div key={int.id} className="rounded-xl border border-border p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{int.creator}</span>
                  <span className="text-[10px] text-muted-foreground">{int.date}</span>
                </div>
                <p className="text-xs text-muted-foreground">{int.notes}</p>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/50">
                  <span className="text-primary font-medium">{int.type}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{int.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
