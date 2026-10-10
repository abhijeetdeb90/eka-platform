import React from "react";
import { Heart, MessageCircle, Share2, Bookmark, UserPlus, MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FeedPostProps {
  id: string;
  avatar: string;
  name: string;
  identity: string;
  time: string;
  location?: string;
  content: React.ReactNode;
  verifiedHuman?: boolean;
}

export function FeedPost({ avatar, name, identity, time, location, content, verifiedHuman }: FeedPostProps) {
  return (
    <article className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-calm space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-12 rounded-full overflow-hidden bg-accent/60 border border-border">
              {avatar ? (
                <img src={avatar} alt={name} className="size-full object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                  {name.charAt(0)}
                </div>
              )}
            </div>
            {verifiedHuman && (
              <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                <CheckCircle2 className="size-4 text-green-600 fill-green-50" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">{name}</h3>
              {verifiedHuman && (
                <span className="inline-flex items-center gap-1 rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  <ShieldCheck className="size-3" />
                  Human
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="font-medium text-terracotta">{identity}</span>
              <span>•</span>
              <span>{time}</span>
              {location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="size-3" />
                    {location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-full hover:bg-accent">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </Button>
      </div>

      {/* Content */}
      <div className="text-sm text-foreground/90 font-sans leading-relaxed">
        {content}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-terracotta rounded-full">
            <Heart className="size-4" />
            <span className="text-xs">Like</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-primary rounded-full">
            <MessageCircle className="size-4" />
            <span className="text-xs">Comment</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-primary rounded-full">
            <Share2 className="size-4" />
            <span className="text-xs">Share</span>
          </Button>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-primary rounded-full">
            <Bookmark className="size-4" />
            <span className="text-xs hidden sm:inline">Save</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs rounded-full">
            <UserPlus className="size-3.5" />
            <span>Follow</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
