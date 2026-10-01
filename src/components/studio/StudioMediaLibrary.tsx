// ==============================================================================
// EKA STUDIO — CENTRALIZED MEDIA ASSETS & RIGHTS MANAGEMENT MODULE
// ==============================================================================

import { useState } from "react";
import {
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  deleteMediaAsset,
  fetchMediaAssets,
  saveMediaAsset,
  SEED_MEDIA_ASSETS,
} from "@/lib/studio/media-service";
import type { MediaAsset, StudioRole } from "@/lib/studio/types";

interface StudioMediaLibraryProps {
  currentRole: StudioRole;
}

export function StudioMediaLibrary({ currentRole }: StudioMediaLibraryProps) {
  const [assets, setAssets] = useState<MediaAsset[]>(SEED_MEDIA_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Upload Form State
  const [title, setTitle] = useState("");
  const [fileType, setFileType] = useState<MediaAsset["file_type"]>("image");
  const [url, setUrl] = useState("");
  const [creator, setCreator] = useState("");
  const [license, setLicense] = useState("Creative Commons BY-NC 4.0");
  const [copyrightStatus, setCopyrightStatus] = useState<MediaAsset["copyright_status"]>("licensed");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [usageRights, setUsageRights] = useState("Editorial & Educational use across EKA platform");

  const refreshAssets = async () => {
    const data = await fetchMediaAssets({
      file_type: typeFilter,
      query: searchQuery,
    });
    setAssets(data);
  };

  const handleUpload = async () => {
    if (!title.trim() || !url.trim()) {
      toast.error("Title and Asset URL are required.");
      return;
    }

    const saved = await saveMediaAsset(
      {
        title: title.trim(),
        filename: title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".jpg",
        file_type: fileType,
        url: url.trim(),
        creator: creator.trim() || "EKA Archive",
        license,
        copyright_status: copyrightStatus,
        alt_text: altText.trim() || title.trim(),
        caption: caption.trim(),
        usage_rights: usageRights.trim(),
        tags: [fileType, "Heritage"],
      },
      currentRole,
    );

    await refreshAssets();
    setIsUploading(false);
    setTitle("");
    setUrl("");
    setAltText("");
    setCaption("");
    toast.success("Media asset registered in archive.");
  };

  const handleDelete = async (id: string) => {
    await deleteMediaAsset(id, currentRole);
    await refreshAssets();
    if (selectedAsset?.id === id) setSelectedAsset(null);
    toast.warning("Media asset removed from library.");
  };

  const filteredAssets = assets.filter((a) => {
    if (typeFilter !== "all" && a.file_type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.creator?.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-normal tracking-tight">Centralized Media Library</h2>
          <p className="text-xs text-muted-foreground">
            Sacred imagery, field audio, manuscript facsimiles, and strict copyright licensing governance.
          </p>
        </div>
        <Button size="sm" onClick={() => setIsUploading(true)}>
          <Plus className="mr-1.5 size-4" /> Register Media Asset
        </Button>
      </div>

      {isUploading && (
        <div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-calm space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h3 className="font-display text-base font-medium">Register Media with Rights Clearance</h3>
            <Button size="sm" variant="ghost" onClick={() => setIsUploading(false)}>
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground">Asset Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mahabodhi Temple Vajrasana Inscription"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Media Type</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as MediaAsset["file_type"])}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
              >
                <option value="image">Image (High-Res)</option>
                <option value="audio">Audio (Field Recording)</option>
                <option value="video">Video (Documentary)</option>
                <option value="document">Document (Facsimile / PDF)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground">Asset URL (Cloudflare R2 / Storage)</label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://media.eka.earth/..."
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Copyright Status</label>
              <select
                value={copyrightStatus}
                onChange={(e) => setCopyrightStatus(e.target.value as MediaAsset["copyright_status"])}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
              >
                <option value="licensed">Licensed</option>
                <option value="public_domain">Public Domain</option>
                <option value="creative_commons">Creative Commons</option>
                <option value="owned">Owned by EKA</option>
                <option value="fair_use">Fair Use (Educational)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Photographer / Creator</label>
              <Input
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                placeholder="e.g. Aditya Verma"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">License Terms</label>
              <Input
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                placeholder="e.g. CC BY-NC 4.0"
                className="mt-1"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-xs text-muted-foreground">Alt Text (Accessibility & Semantics)</label>
              <Input
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Descriptive visual elements for screen readers and AI grounding..."
                className="mt-1"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-xs text-muted-foreground">Usage Rights Agreement</label>
              <Textarea
                value={usageRights}
                onChange={(e) => setUsageRights(e.target.value)}
                rows={2}
                className="mt-1 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setIsUploading(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleUpload}>
              Register Media Asset
            </Button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search assets by title, photographer, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-xs"
        >
          <option value="all">All File Types</option>
          <option value="image">Images</option>
          <option value="audio">Audio</option>
          <option value="video">Video</option>
          <option value="document">Documents</option>
        </select>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            onClick={() => setSelectedAsset(asset)}
            className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden shadow-calm transition-all hover:border-primary/50"
          >
            {/* Visual Thumbnail */}
            <div className="relative h-44 w-full bg-accent/30 flex items-center justify-center overflow-hidden">
              {asset.file_type === "image" ? (
                <img
                  src={asset.url}
                  alt={asset.alt_text || asset.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    // fallback if local path
                    (e.target as HTMLImageElement).src = "/hero.jpg";
                  }}
                />
              ) : asset.file_type === "audio" ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Music className="size-12 text-primary" />
                  <span className="text-[11px] font-mono">Audio Stream</span>
                </div>
              ) : asset.file_type === "document" ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <FileText className="size-12 text-amber-500" />
                  <span className="text-[11px] font-mono">Manuscript PDF</span>
                </div>
              ) : (
                <Video className="size-12 text-purple-500" />
              )}

              <span className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[9px] uppercase font-semibold text-white backdrop-blur">
                {asset.file_type}
              </span>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{asset.copyright_status.replace(/_/g, " ")}</span>
                <span className="font-mono">{(asset.size_bytes / 1024 / 1024).toFixed(1)} MB</span>
              </div>
              <h4 className="font-display text-sm font-medium line-clamp-1">{asset.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-1">Creator: {asset.creator}</p>
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border/60">
                <span className="truncate text-muted-foreground">{asset.license}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(asset.id);
                  }}
                  className="size-6 p-0 text-destructive"
                  title="Remove asset"
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Asset Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="max-w-xl w-full rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-border pb-3">
              <div>
                <h3 className="font-display text-lg font-medium">{selectedAsset.title}</h3>
                <p className="text-xs text-muted-foreground">Filename: {selectedAsset.filename}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelectedAsset(null)}>
                Close
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-border bg-accent/20 p-3 space-y-1">
                <div><strong>Creator:</strong> {selectedAsset.creator}</div>
                <div><strong>Copyright Status:</strong> {selectedAsset.copyright_status}</div>
                <div><strong>License:</strong> {selectedAsset.license}</div>
                <div><strong>Usage Rights:</strong> {selectedAsset.usage_rights}</div>
              </div>

              <div>
                <strong>Alt Text:</strong>
                <p className="mt-1 text-muted-foreground">{selectedAsset.alt_text}</p>
              </div>

              {selectedAsset.caption && (
                <div>
                  <strong>Caption:</strong>
                  <p className="mt-1 text-muted-foreground">{selectedAsset.caption}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedAsset(null)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
