import React from "react";
import { Heart, MessageCircle, Share2, Bookmark, UserPlus, MapPin, ShieldCheck, CheckCircle2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectedKnowledgeCard } from "@/components/knowledge/ConnectedKnowledgeCard";

export interface FeedPostProps {
  id: string;
  avatar: string;
  name: string;
  identity: string;
  time: string;
  location?: string;
  content: React.ReactNode;
  verifiedHuman?: boolean;
  trustTier?: "verified_custodian" | "cultural_expert" | "contributor" | "none";
  topic?: string;
}

export function FeedPost({ avatar, name, identity, time, location, content, verifiedHuman, trustTier = "none", topic }: FeedPostProps) {
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
              <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5" title="Verified Human">
                <ShieldCheck className="size-4 text-emerald-600 fill-emerald-50" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-medium text-foreground">{name}</h3>
              {trustTier === "verified_custodian" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200/50" title="Verified Cultural Custodian">
                  <Award className="size-3 fill-amber-500 text-amber-600" />
                  Custodian
                </span>
              )}
              {trustTier === "cultural_expert" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/50 px-2 py-0.5 text-[10px] font-semibold text-blue-800 border border-blue-200/50" title="Verified Cultural Expert">
                  <CheckCircle2 className="size-3 fill-blue-500 text-blue-600" />
                  Expert
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span>{identity}</span>
              <span>•</span>
              <span>{time}</span>
            </div>
            {location && (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                <MapPin className="size-3" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <span className="sr-only">More options</span>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.12132 8.625 12.5 8.625C11.87868 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.87868 6.375 12.5 6.375C13.12132 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </Button>
      </div>

      {/* Content */}
      <div className="text-sm leading-relaxed text-foreground/90 font-serif">
        {content}
      </div>

      {topic && <ConnectedKnowledgeCard topic={topic} />}

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-rose-600 hover:bg-rose-50 h-8 px-2 sm:px-3">
            <Heart className="size-4 mr-1.5" />
            <span className="text-xs">Like</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/5 h-8 px-2 sm:px-3">
            <MessageCircle className="size-4 mr-1.5" />
            <span className="text-xs">Comment</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/5 h-8 px-2 sm:px-3">
            <Share2 className="size-4 mr-1.5" />
            <span className="text-xs hidden sm:inline">Share</span>
          </Button>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/5 h-8 px-2 sm:px-3">
            <Bookmark className="size-4 mr-1.5" />
            <span className="text-xs hidden sm:inline">Save</span>
          </Button>
        </div>
      </div>
    </article>
  );
}


