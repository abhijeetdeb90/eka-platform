import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { track } from "@/lib/analytics";
import { BookOpen, MapPin, Users } from "lucide-react";

interface CommunityVariationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentTopic?: string;
  parentPostId?: string;
  onSuccess?: () => void;
}

export function CommunityVariationModal({
  open,
  onOpenChange,
  parentTopic = "EKA: 1 Billion Stories Initiative",
  parentPostId,
  onSuccess,
}: CommunityVariationModalProps) {
  const [community, setCommunity] = useState("");
  const [source, setSource] = useState("");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!community.trim() || !details.trim()) {
      toast.error("Please specify your community/culture and the story or tradition details.");
      return;
    }

    setBusy(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        toast.error("Please sign in to document your story for the global archive.");
        return;
      }

      const formattedContent = `[Living Story: ${community.trim()}]\n\n${details.trim()}${
        source.trim() ? `\n\nAttributed to: ${source.trim()}` : ""
      }`;

      const { error } = await supabase.from("posts").insert({
        author_id: auth.user.id,
        content: formattedContent,
        topic: parentTopic,
        type: "practice",
      });

      if (error) throw error;

      toast.success("Thank you! Your story has been preserved in the living EKA archive.");
      track("post_create", { type: "cultural_story", topic: parentTopic });
      setCommunity("");
      setSource("");
      setDetails("");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to record contribution.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl border border-border/80 bg-background/95 p-6 shadow-lift backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-terracotta">
            <Users className="size-4" />
            <span>Living Cultural Memory</span>
          </div>
          <DialogTitle className="mt-1 font-display text-2xl text-foreground">
            Document a Living Story
          </DialogTitle>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Across communities and landscapes, cultural traditions, rituals, family customs, and oral histories carry unique nuance. Document how{" "}
            <strong className="text-foreground">{parentTopic || "this tradition"}</strong> is
            lived in your community or family before it is forgotten.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="community-name">Your Community, Culture, or Region</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                id="community-name"
                required
                placeholder="e.g. Kyoto, Oaxaca, Mithila, Yoruba, Brittany, Andes, Māori, Garhwal..."
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="pl-9 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lineage-source">Lineage, Family, or Source (Optional)</Label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                id="lineage-source"
                placeholder="e.g. Grandparent's oral memory, village elder, seasonal ritual practice..."
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="pl-9 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="variation-details">
              Describe the tradition, ritual, language nuance, or lived story
            </Label>
            <Textarea
              id="variation-details"
              required
              rows={4}
              placeholder="Describe the unique ingredients, chants, timing, folklore, or steps that distinguish your community's practice..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="resize-none rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={busy} className="rounded-xl shadow-xs">
              {busy ? "Preserving..." : "Add to Living Archive"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
