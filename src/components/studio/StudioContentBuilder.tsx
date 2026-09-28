// ==============================================================================
// EKA STUDIO — STRUCTURED CONTENT & PAGE BUILDER MODULE
// ==============================================================================

import { useState } from "react";
import {
  FileText,
  Plus,
  Copy,
  Archive,
  RotateCcw,
  Send,
  Eye,
  Calendar,
  Search,
  ExternalLink,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  archiveContentItem,
  duplicateContentItem,
  fetchContentItems,
  publishContentItem,
  saveContentItem,
  scheduleContentItem,
  unpublishContentItem,
  SEED_CONTENT_ITEMS,
} from "@/lib/studio/content-service";
import type { ContentItem, StudioRole } from "@/lib/studio/types";

interface StudioContentBuilderProps {
  currentRole: StudioRole;
}

export function StudioContentBuilder({ currentRole }: StudioContentBuilderProps) {
  const [items, setItems] = useState<ContentItem[]>(SEED_CONTENT_ITEMS);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const refreshList = async () => {
    const data = await fetchContentItems({
      type: filterType,
      status: filterStatus,
      query: searchQuery,
    });
    setItems(data);
  };

  const handleCreateNew = () => {
    const newItem: ContentItem = {
      id: "",
      title: "Untitled Content Item",
      slug: `content-${Date.now().toString(36)}`,
      type: "article",
      description: "",
      body: "",
      media: [],
      creator_name: "EKA Editorial",
      category: "Contemplative Devotion",
      tags: ["Devotion"],
      location: "",
      language: "en",
      tradition: "",
      community: "",
      sources: [],
      related_objects: [],
      seo_metadata: { meta_title: "", meta_description: "" },
      visibility: "public",
      status: "draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setSelectedItem(newItem);
    setIsEditing(true);
    setIsPreview(false);
  };

  const handleSave = async () => {
    if (!selectedItem || !selectedItem.title) {
      toast.error("Please enter a title.");
      return;
    }
    const saved = await saveContentItem(selectedItem, currentRole);
    setSelectedItem(saved);
    await refreshList();
    setIsEditing(false);
    toast.success("Content item saved successfully.");
  };

  const handleDuplicate = async (id: string) => {
    const dup = await duplicateContentItem(id, currentRole);
    await refreshList();
    setSelectedItem(dup);
    setIsEditing(true);
    toast.success(`Duplicated: ${dup.title}`);
  };

  const handlePublish = async (id: string) => {
    await publishContentItem(id, currentRole);
    await refreshList();
    toast.success("Content item published live.");
  };

  const handleUnpublish = async (id: string) => {
    await unpublishContentItem(id, currentRole);
    await refreshList();
    toast.info("Content reverted to draft.");
  };

  const handleArchive = async (id: string) => {
    await archiveContentItem(id, currentRole);
    await refreshList();
    if (selectedItem?.id === id) setIsEditing(false);
    toast.warning("Content item archived.");
  };

  const handleSchedule = async (id: string) => {
    const publishDate = new Date(Date.now() + 86400000 * 2).toISOString();
    await scheduleContentItem(id, publishDate, currentRole);
    await refreshList();
    toast.success(`Scheduled to publish on ${new Date(publishDate).toLocaleDateString()}`);
  };

  const filteredItems = items.filter((item) => {
    if (filterType !== "all" && item.type !== filterType) return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-normal tracking-tight">Structured Content Builder</h2>
          <p className="text-xs text-muted-foreground">
            Author, edit, schedule, duplicate, and manage multi-faith articles, pages, and collections.
          </p>
        </div>
        <Button onClick={handleCreateNew} size="sm">
          <Plus className="mr-1.5 size-4" /> Create Content
        </Button>
      </div>

      {isEditing && selectedItem ? (
        /* Edit / Author View */
        <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-border pb-4 gap-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {selectedItem.status.toUpperCase()}
              </span>
              <span className="text-xs text-muted-foreground">Type: {selectedItem.type}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsPreview(!isPreview)}>
                <Eye className="mr-1.5 size-4" /> {isPreview ? "Edit Mode" : "Live Preview"}
              </Button>
              {selectedItem.id && selectedItem.status !== "published" && (
                <Button size="sm" variant="default" onClick={() => handlePublish(selectedItem.id)}>
                  <Send className="mr-1.5 size-4" /> Publish Now
                </Button>
              )}
              {selectedItem.id && selectedItem.status === "published" && (
                <Button size="sm" variant="outline" onClick={() => handleUnpublish(selectedItem.id)}>
                  Unpublish to Draft
                </Button>
              )}
              {selectedItem.id && (
                <Button size="sm" variant="outline" onClick={() => handleSchedule(selectedItem.id)}>
                  <Calendar className="mr-1.5 size-4" /> Schedule (48h)
                </Button>
              )}
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                Close
              </Button>
            </div>
          </div>

          {isPreview ? (
            /* Live Preview Canvas */
            <div className="rounded-xl border border-dashed border-border bg-background p-8 max-w-3xl mx-auto space-y-4">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                  {selectedItem.category || "General"} · {selectedItem.tradition || "Universal"}
                </span>
                <h1 className="font-display text-3xl font-medium">{selectedItem.title}</h1>
                <p className="text-sm text-muted-foreground italic">{selectedItem.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <span>By {selectedItem.creator_name || "EKA"}</span>
                  <span>·</span>
                  <span>Language: {selectedItem.language}</span>
                  {selectedItem.location && <span>· Location: {selectedItem.location}</span>}
                </div>
              </div>
              <hr className="border-border/60" />
              <div className="prose dark:prose-invert text-sm leading-relaxed whitespace-pre-line">
                {selectedItem.body || "(No body text entered yet)"}
              </div>
              {selectedItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-4">
                  {selectedItem.tags.map((t) => (
                    <span key={t} className="rounded-full bg-accent px-2 py-0.5 text-xs text-muted-foreground">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Full Structured Form */
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4 md:col-span-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Title
                </label>
                <Input
                  value={selectedItem.title}
                  onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })}
                  placeholder="Enter canonical title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">URL Slug</label>
                <Input
                  value={selectedItem.slug}
                  onChange={(e) => setSelectedItem({ ...selectedItem, slug: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Content Type</label>
                <select
                  value={selectedItem.type}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      type: e.target.value as ContentItem["type"],
                    })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="article">Article</option>
                  <option value="post">Editorial Post</option>
                  <option value="collection">Curated Collection</option>
                  <option value="page">Platform Page</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Description / Summary</label>
                <Textarea
                  value={selectedItem.description}
                  onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
                  rows={2}
                  placeholder="Editorial subtitle or overview"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Body Content (Markdown)</label>
                <Textarea
                  value={selectedItem.body}
                  onChange={(e) => setSelectedItem({ ...selectedItem, body: e.target.value })}
                  rows={8}
                  placeholder="Full markdown article text..."
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Author / Creator</label>
                <Input
                  value={selectedItem.creator_name || ""}
                  onChange={(e) => setSelectedItem({ ...selectedItem, creator_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <Input
                  value={selectedItem.category || ""}
                  onChange={(e) => setSelectedItem({ ...selectedItem, category: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Tradition</label>
                <Input
                  value={selectedItem.tradition || ""}
                  onChange={(e) => setSelectedItem({ ...selectedItem, tradition: e.target.value })}
                  placeholder="e.g. Advaita Vedanta, Theravada, Sufism"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Community</label>
                <Input
                  value={selectedItem.community || ""}
                  onChange={(e) => setSelectedItem({ ...selectedItem, community: e.target.value })}
                  placeholder="e.g. Smartha, Chishti, Global Seekers"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Tags (comma-separated)</label>
                <Input
                  value={selectedItem.tags.join(", ")}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      tags: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Location</label>
                <Input
                  value={selectedItem.location || ""}
                  onChange={(e) => setSelectedItem({ ...selectedItem, location: e.target.value })}
                  placeholder="e.g. Varanasi, Rishikesh"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Visibility</label>
                <select
                  value={selectedItem.visibility}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      visibility: e.target.value as ContentItem["visibility"],
                    })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="public">Public</option>
                  <option value="members_only">Members Only</option>
                  <option value="private">Private</option>
                  <option value="unlisted">Unlisted</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">SEO Meta Title</label>
                <Input
                  value={selectedItem.seo_metadata?.meta_title || ""}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      seo_metadata: { ...selectedItem.seo_metadata, meta_title: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Content Items Table */
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search articles, collections, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-xs"
            >
              <option value="all">All Types</option>
              <option value="article">Articles</option>
              <option value="post">Posts</option>
              <option value="collection">Collections</option>
              <option value="page">Pages</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-calm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3.5">Title & Type</th>
                  <th className="p-3.5">Tradition / Category</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Updated</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-accent/20">
                    <td className="p-3.5">
                      <div className="font-medium text-foreground">{item.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.type} · /{item.slug}
                      </div>
                    </td>
                    <td className="p-3.5 text-xs text-muted-foreground">
                      <div>{item.tradition || "Universal"}</div>
                      <div className="text-[11px] opacity-75">{item.category}</div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          item.status === "published"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : item.status === "scheduled"
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-xs text-muted-foreground">
                      {new Date(item.updated_at).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsEditing(true);
                            setIsPreview(false);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDuplicate(item.id)}
                          title="Duplicate item"
                        >
                          <Copy className="size-3.5" />
                        </Button>
                        {item.status === "published" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUnpublish(item.id)}
                            title="Unpublish"
                          >
                            Unpublish
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePublish(item.id)}
                            title="Publish"
                          >
                            <Send className="size-3.5" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleArchive(item.id)}
                          className="text-destructive hover:bg-destructive/10"
                          title="Archive"
                        >
                          <Archive className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
