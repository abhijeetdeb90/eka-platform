import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  ShieldCheck,
  Eye,
  AlertCircle,
  MapPin,
  ExternalLink,
  BookOpen,
  Camera,
  Play,
  Pause,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "@tanstack/react-router";
import type { VisualStory, VisualStoryStep } from "@/lib/knowledge/knowledge-object";
import { getTrustVerificationMeta } from "@/lib/knowledge/knowledge-object";

interface VisualStoryViewerProps {
  story: VisualStory;
  onAskEka?: (prompt: string) => void;
  className?: string;
}

export function VisualStoryViewer({
  story,
  onAskEka,
  className = "",
}: VisualStoryViewerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showMetadata, setShowMetadata] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const totalSteps = story.steps.length;
  const currentStep: VisualStoryStep = story.steps[currentStepIndex] || story.steps[0]!;

  const handleNext = () => {
    setCurrentStepIndex((prev) => (prev + 1) % totalSteps);
  };

  const handlePrev = () => {
    setCurrentStepIndex((prev) => (prev - 1 + totalSteps) % totalSteps);
  };

  const handleAsk = (prompt?: string) => {
    const text = prompt || currentStep.askEkaPrompt || `Why is ${currentStep.name} celebrated in ${story.title}?`;
    if (onAskEka) {
      onAskEka(text);
    } else {
      navigate({ to: "/ask", search: { q: text } as any });
    }
  };

  const trustMeta = getTrustVerificationMeta(story.provenance.verificationLevel);

  const getTemplateLabel = (template: VisualStory["template"]) => {
    switch (template) {
      case "INSIDE_TRADITION":
        return "Inside the Tradition";
      case "BEHIND_THE_TRADITION":
        return "Behind the Tradition";
      case "60_SECONDS_TO_UNDERSTAND":
        return "60 Seconds to Understand";
      case "MEET_THE_KEEPER":
        return "Meet the Keeper";
      case "THEN_NOW":
        return "Then → Now";
      case "CULTURE_X_CULTURE":
        return "Culture × Culture";
      case "WHY":
        return "Why?";
      default:
        return "Visual Story";
    }
  };

  return (
    <div
      data-testid="visual-story-viewer"
      className={`rounded-3xl border border-border/80 bg-card overflow-hidden shadow-calm ${
        isExpanded ? "fixed inset-4 z-50 overflow-y-auto bg-background/98 p-6" : "p-6 sm:p-8"
      } ${className}`}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-terracotta/40 text-terracotta text-xs font-mono uppercase tracking-wider"
            >
              <Sparkles className="size-3 mr-1 text-saffron inline" />
              {getTemplateLabel(story.template)}
            </Badge>
            <Badge variant="outline" className={`text-xs ${trustMeta.colorClass} ${trustMeta.badgeBg} ${trustMeta.badgeBorder}`}>
              <ShieldCheck className="size-3 mr-1 inline" />
              {trustMeta.label}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="size-3 text-primary" />
              {story.location}
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            {story.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{story.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-full text-xs gap-1"
            title={isExpanded ? "Collapse" : "Expand Full View"}
          >
            {isExpanded ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            <span className="hidden sm:inline">{isExpanded ? "Exit Full" : "Expand"}</span>
          </Button>
        </div>
      </div>

      {/* Step Stepper Tabs */}
      <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {story.steps.map((step, idx) => (
          <button
            key={step.stepNumber}
            type="button"
            onClick={() => setCurrentStepIndex(idx)}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all shrink-0 flex items-center gap-2 ${
              currentStepIndex === idx
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "border border-border/80 bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <span className="font-mono text-[11px] opacity-75">{step.stepNumber}</span>
            <span>{step.name}</span>
          </button>
        ))}
      </div>

      {/* Main Step Canvas */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Media with Knowledge Overlay */}
        <div className="lg:col-span-7 space-y-3">
          <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-black aspect-[16/10] shadow-lift">
            <img
              src={currentStep.imageUrl}
              alt={currentStep.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            {/* Step Counter Overlay */}
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-black/60 backdrop-blur-md text-white border-white/20 font-mono text-xs">
                {currentStep.stepNumber} / {String(totalSteps).padStart(2, "0")}
              </Badge>
            </div>

            {/* Media Metadata Toggle Button */}
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowMetadata(!showMetadata)}
                className="h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 text-[11px] gap-1 px-2.5"
              >
                <Camera className="size-3" />
                <span>{showMetadata ? "Hide Meta" : "Image Knowledge"}</span>
              </Button>
            </div>

            {/* Metadata Drawer Overlay */}
            {showMetadata && currentStep.mediaMetadata && (
              <div className="absolute inset-x-0 bottom-0 z-20 bg-black/90 backdrop-blur-md p-4 text-white text-xs space-y-2 border-t border-white/20 animate-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center justify-between">
                  <span className="font-mono uppercase tracking-wider text-terracotta text-[10px] font-semibold">
                    Visual Evidence Metadata
                  </span>
                  <span className="text-[10px] text-white/60">
                    License: {currentStep.mediaMetadata.license || "CC BY-SA 4.0"}
                  </span>
                </div>
                <p className="font-medium text-white/95">{currentStep.mediaMetadata.whatYouSee}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/70">
                  <span>📍 {currentStep.mediaMetadata.location}</span>
                  <span>🏛️ {currentStep.mediaMetadata.culturalContext}</span>
                  <span>📷 {currentStep.mediaMetadata.creatorOrPhotographer || "EKA Archive"}</span>
                </div>
              </div>
            )}

            {/* Bottom Caption */}
            {!showMetadata && (
              <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                <p className="font-serif text-lg sm:text-xl font-medium drop-shadow-sm">
                  {currentStep.name}
                </p>
                <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                  {currentStep.oneSentenceExplanation}
                </p>
              </div>
            )}
          </div>

          {/* Stepper Controls Bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                className="rounded-full size-9 p-0"
                title="Previous Step"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                className="rounded-full size-9 p-0"
                title="Next Step"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>

            <div className="text-xs font-mono text-muted-foreground">
              Step {currentStepIndex + 1} of {totalSteps}
            </div>

            {currentStep.relatedKnowledgeSlug && (
              <Link
                to="/knowledge/$slug"
                params={{ slug: currentStep.relatedKnowledgeSlug }}
                className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
              >
                <span>Full Knowledge Object</span>
                <ExternalLink className="size-3" />
              </Link>
            )}
          </div>
        </div>

        {/* Right Column: Rich Cultural Knowledge Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. One-Sentence Essence */}
          <div className="rounded-2xl border border-terracotta/20 bg-terracotta/5 p-4 sm:p-5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-terracotta font-semibold">
              The Living Practice
            </span>
            <p className="mt-1 font-serif text-base sm:text-lg text-foreground font-medium italic leading-relaxed">
              "{currentStep.oneSentenceExplanation}"
            </p>
          </div>

          {/* 2. Cultural Meaning & Metaphysics */}
          <div className="rounded-2xl border border-border/80 bg-background/90 p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-primary">
              <BookOpen className="size-4" />
              <h4 className="text-xs font-mono uppercase tracking-wider font-semibold">
                Sacred & Cultural Meaning
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
              {currentStep.culturalMeaning}
            </p>
          </div>

          {/* 3. What to Look For (Sensory / Visual Cues) */}
          {currentStep.whatToLookFor && (
            <div className="rounded-2xl border border-border/80 bg-sand/15 p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-terracotta">
                <Eye className="size-4" />
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold">
                  What to Look For (Visual Cues)
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentStep.whatToLookFor}
              </p>
            </div>
          )}

          {/* 4. Common Misconception Debunked */}
          {currentStep.commonMisconception && (
            <div className="rounded-2xl border border-amber-600/30 bg-amber-500/10 p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                <AlertCircle className="size-4" />
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold">
                  Common Misconception
                </h4>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                {currentStep.commonMisconception}
              </p>
            </div>
          )}

          {/* 5. Where to Experience Respectfully */}
          {currentStep.whereToExperienceRespectfully && (
            <div className="rounded-2xl border border-border/70 bg-card p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-4" />
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold">
                  How to Experience Respectfully
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentStep.whereToExperienceRespectfully}
              </p>
            </div>
          )}

          {/* 6. Ask EKA Deepening Prompt */}
          <div className="rounded-2xl border border-primary/30 bg-sand/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-semibold">
                Understand Deeper with AI
              </span>
              <p className="text-xs text-foreground font-medium line-clamp-1">
                "{currentStep.askEkaPrompt || `Why is ${currentStep.name} celebrated?`}"
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => handleAsk(currentStep.askEkaPrompt)}
              className="rounded-full text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            >
              <Sparkles className="size-3 text-saffron" />
              <span>Ask EKA</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
