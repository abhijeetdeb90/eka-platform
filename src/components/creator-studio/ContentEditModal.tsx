import React, { useState, useEffect } from "react";
import { X, Save, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { CreatorPostItem } from "./CreatorOverview";

interface ContentEditModalProps {
  post: CreatorPostItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updated: CreatorPostItem) => void;
}

const CATEGORIES = [
  "Traditions",
  "Festivals",
  "Rituals",
  "Crafts",
  "Sacred Places",
  "Foodways",
  "Languages",
  "History",
  "Music & Dance",
  "Communities",
  "Philosophy",
];

export function ContentEditModal({ post, isOpen, onClose, onUpdated }: ContentEditModalProps) {
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("Traditions");
  const [tradition, setTradition] = useState("");
  const [status, setStatus] = useState<"visible" | "draft">("visible");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setContent(post.content || "");
      setTopic(post.topic || "Traditions");
      setTradition(post.tradition || "");
      setStatus((post.status === "visible" ? "visible" : "draft") as "visible" | "draft");
      setLocation(post.location_label || "");
      setLanguage(post.language || "");
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Content caption cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const updates = {
        content: content.trim(),
        topic: topic.trim() || null,
        tradition: tradition.trim() || null,
        status,
        location_label: location.trim() || null,
        language: language.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("posts")
        .update(updates)
        .eq("id", post.id)
        .eq("author_id", post.author_id)
        .select()
        .single();

      if (error) throw error;

      toast.success("Content metadata updated successfully.");
      onUpdated({
        ...post,
        ...updates,
      });
      onClose();
    } catch (err: any) {
      toast.error(`Update failed: ${err.message || "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-lift overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/60">
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">Edit Content Metadata</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update captions, cultural attribution, and publishing visibility.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full size-8">
            <X className="size-4" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold uppercase tracking-wider text-muted-foreground">
              Caption / Cultural Narrative *
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
              className="text-xs rounded-xl"
              placeholder="Reflections, context, or story narrative..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-muted-foreground">
                Cultural Category
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-muted-foreground">
                Tradition / Lineage
              </label>
              <Input
                value={tradition}
                onChange={(e) => setTradition(e.target.value)}
                placeholder="e.g., Baul, Vedic, Buddhist, Zen"
                className="h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-muted-foreground">
                Location Label
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Majuli, Assam"
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-muted-foreground">
                Primary Language
              </label>
              <Input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g., Assamese, Bengali, Sanskrit"
                className="h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="font-semibold uppercase tracking-wider text-muted-foreground">
              Publishing Status
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={status === "visible" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatus("visible")}
                className="rounded-full text-xs flex-1"
              >
                Live (Visible to all)
              </Button>
              <Button
                type="button"
                variant={status === "draft" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatus("draft")}
                className="rounded-full text-xs flex-1"
              >
                Draft (Private to creator)
              </Button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border/60 flex items-center justify-end gap-2.5">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} className="rounded-full text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              size="sm"
              className="rounded-full text-xs gap-1.5 bg-primary text-primary-foreground"
            >
              {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              <span>{saving ? "Saving…" : "Save Metadata"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
