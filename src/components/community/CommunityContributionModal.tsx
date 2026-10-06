import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  HeartHandshake,
  ShieldAlert,
  Sparkles,
  MapPin,
  CheckCircle2,
  FileText,
  UserCheck,
  Send,
} from "lucide-react";
import { toast } from "sonner";

interface CommunityContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEntitySlug?: string;
  defaultEntityName?: string;
}

export function CommunityContributionModal({
  isOpen,
  onClose,
  defaultEntitySlug,
  defaultEntityName,
}: CommunityContributionModalProps) {
  const [contributionType, setContributionType] = useState<
    | "oral_history"
    | "family_tradition"
    | "traditional_recipe"
    | "local_festival"
    | "craft_technique"
  >("oral_history");

  const [title, setTitle] = useState(
    defaultEntityName ? `Living memory of ${defaultEntityName}` : ""
  );
  const [contributorName, setContributorName] = useState("");
  const [contributorRole, setContributorRole] = useState<
    "practitioner" | "elder" | "researcher" | "descendant" | "community_member"
  >("community_member");
  const [community, setCommunity] = useState("");
  const [country, setCountry] = useState("India");
  const [stateRegion, setStateRegion] = useState("");
  const [cityOrVillage, setCityOrVillage] = useState("");
  const [narrative, setNarrative] = useState("");
  const [culturalSignificance, setCulturalSignificance] = useState("");
  const [evidenceLinks, setEvidenceLinks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !narrative.trim() || !contributorName.trim()) {
      toast.error("Please fill in the title, contributor name, and narrative.");
      return;
    }

    setIsSubmitting(true);
    // Simulate submission to EKA Provenance Queue
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Community contribution submitted for editorial review.");
    }, 700);
  };

  const resetForm = () => {
    setIsSuccess(false);
    setTitle("");
    setNarrative("");
    setCulturalSignificance("");
    setEvidenceLinks("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? resetForm() : undefined)}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border/80 bg-background/98 p-6 sm:p-8">
        <DialogHeader className="space-y-2 border-b border-border/60 pb-4 text-left">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-terracotta/40 text-terracotta text-xs font-mono uppercase tracking-wider"
            >
              <HeartHandshake className="size-3 mr-1 inline" />
              Living Cultural Intelligence · Contribute
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Community Submission
            </Badge>
          </div>
          <DialogTitle className="font-serif text-2xl font-bold text-foreground">
            Contribute Living Culture to EKA
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Help document oral lineages, family traditions, culinary knowledge, and local festivals that conventional encyclopedias miss.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-in fade-in duration-300">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-600 border border-emerald-600/20">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Memory Received with Gratitude
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Your submission has been cataloged under <strong>Community Submission - Pending Review</strong>. Our cultural editors and guild elders verify all contributions before canonical publication.
            </p>
            <div className="pt-2">
              <Button onClick={resetForm} className="rounded-full px-6">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            {/* Epistemic Transparency Notice */}
            <div className="rounded-2xl border border-amber-600/30 bg-amber-500/10 p-4 flex items-start gap-3">
              <ShieldAlert className="size-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-amber-800 dark:text-amber-300">
                  EKA Trust Standard: Honest Epistemic Labeling
                </span>
                <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
                  Every community submission enters as <em>Community Submission - Pending Review</em>. EKA never marks uncorroborated submissions as established historical facts without peer or elder validation.
                </p>
              </div>
            </div>

            {/* Contribution Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Type of Living Cultural Memory
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: "oral_history", label: "Oral History / Song" },
                  { id: "family_tradition", label: "Family Ritual" },
                  { id: "traditional_recipe", label: "Culinary Heritage" },
                  { id: "local_festival", label: "Local Festival" },
                  { id: "craft_technique", label: "Artisan Craft Method" },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setContributionType(type.id as any)}
                    className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                      contributionType === type.id
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border/80 bg-sand/20 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Contributor Lineage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-foreground">
                  Title or Name of the Tradition *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Grandmother's Shukto Bori Recipe or Kati Bihu Cattle Song"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Your Name / Lineage Custodian *
                </label>
                <Input
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                  placeholder="e.g. Arpita Sen or Malakar Family Elder"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Your Cultural Relationship
                </label>
                <select
                  value={contributorRole}
                  onChange={(e) => setContributorRole(e.target.value as any)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  <option value="practitioner">Active Practitioner / Artisan</option>
                  <option value="elder">Community Elder / Lineage Custodian</option>
                  <option value="descendant">Family Descendant</option>
                  <option value="researcher">Ethnographer / Researcher</option>
                  <option value="community_member">Community Member / Resident</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-foreground">
                  Community / Cultural Background
                </label>
                <Input
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  placeholder="e.g. Rarh Bengal agricultural community, Ahom weavers guild..."
                />
              </div>
            </div>

            {/* Geography Specificity */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                <MapPin className="size-3.5 text-primary" />
                Precise Cultural Geography
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country (e.g. India)"
                />
                <Input
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  placeholder="State / District (e.g. Birbhum)"
                />
                <Input
                  value={cityOrVillage}
                  onChange={(e) => setCityOrVillage(e.target.value)}
                  placeholder="Village / Town (e.g. Santiniketan)"
                />
              </div>
            </div>

            {/* Narrative & Meaning */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  The Living Narrative & Practice *
                </label>
                <Textarea
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value)}
                  rows={4}
                  placeholder="Describe the practice in detail: how it is performed, what materials are used, who gathers, what songs or words are spoken..."
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Cultural & Sacred Meaning (As taught by elders)
                </label>
                <Textarea
                  value={culturalSignificance}
                  onChange={(e) => setCulturalSignificance(e.target.value)}
                  rows={2}
                  placeholder="What is the deeper reason behind this? Why did ancestors say it must be done this way?"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  References, Media or Audio Links (Optional)
                </label>
                <Input
                  value={evidenceLinks}
                  onChange={(e) => setEvidenceLinks(e.target.value)}
                  placeholder="Links to family recordings, archival photographs, or community publications"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-full text-xs">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="size-3.5" />
                    <span>Submit Living Culture</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
