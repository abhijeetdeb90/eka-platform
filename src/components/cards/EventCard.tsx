// ==============================================================================
// EKA CARD PRIMITIVE: EventCard
// ==============================================================================
import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Calendar, Clock, MapPin, Users, Check, ArrowUpRight } from "lucide-react";
import { AnimatedCard } from "@/components/motion/AnimatedCard";
import { Pressable } from "@/components/motion/Pressable";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface EventCardProps {
  id: string;
  title: string;
  host: string;
  date: string;
  time: string;
  location: string;
  type: "SATSANG" | "RETREAT" | "WORKSHOP" | "CONCERT" | "SOLSTICE";
  attendeesCount?: number;
  imageUrl?: string;
  actionTo?: string;
  className?: string;
  onRsvp?: () => void;
}

export function EventCard({
  id,
  title,
  host,
  date,
  time,
  location,
  type = "SATSANG",
  attendeesCount,
  imageUrl,
  actionTo,
  className,
  onRsvp,
}: EventCardProps) {
  const [rsvpd, setRsvpd] = useState(false);

  const handleRsvp = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRsvpd(!rsvpd);
    toast.success(rsvpd ? "RSVP cancelled." : "You are registered for this sacred gathering.");
    if (onRsvp) onRsvp();
  };

  const content = (
    <div
      className={cn(
        "flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl md:rounded-3xl border border-border/70 bg-card/90 backdrop-blur-md shadow-calm hover:border-saffron/40 transition-colors",
        className
      )}
    >
      <div>
        {imageUrl && (
          <div className="w-full h-32 rounded-xl overflow-hidden mb-4 relative">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-2 left-2 text-[10px] font-mono uppercase tracking-wider text-white bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/20">
              {type}
            </span>
          </div>
        )}

        {!imageUrl && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-saffron bg-saffron/10 px-2.5 py-1 rounded-full border border-saffron/20">
              {type}
            </span>
            {attendeesCount && (
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                <Users className="size-3" />
                {attendeesCount} gathered
              </span>
            )}
          </div>
        )}

        <h3 className="font-serif text-lg sm:text-xl font-normal leading-tight text-foreground group-hover:text-saffron transition-colors">
          {title}
        </h3>

        <p className="text-xs font-mono text-terracotta mt-1">Hosted by {host}</p>

        {/* Date and Time Details */}
        <div className="mt-3.5 space-y-1.5 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <Calendar className="size-3.5 text-saffron" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-3.5 text-saffron" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-3.5 text-saffron" />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between gap-3">
        <Pressable
          onClick={handleRsvp}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5",
            rsvpd
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
              : "bg-saffron hover:bg-saffron-dark text-white shadow-xs font-medium"
          )}
        >
          {rsvpd ? (
            <>
              <Check className="size-3" /> Attending
            </>
          ) : (
            "RSVP Gathering"
          )}
        </Pressable>

        {actionTo && (
          <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground flex items-center gap-0.5">
            Details <ArrowUpRight className="size-3" />
          </span>
        )}
      </div>
    </div>
  );

  return (
    <AnimatedCard className="h-full">
      {actionTo ? (
        <Link to={actionTo} className="block h-full">
          {content}
        </Link>
      ) : (
        content
      )}
    </AnimatedCard>
  );
}
