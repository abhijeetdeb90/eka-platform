import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Film, Image as ImageIcon, Loader2, Plus, Save, Trash2, UploadCloud, Wallet, Eye, CircleAlert } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/creator-studio" as never)({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) throw redirect({ to: "/auth", search: { next: "/creator-studio" } });
  },
  head: () => ({ meta: [{ title: "Creator Studio | EKA" }, { name: "description", content: "Publish cultural videos and manage your EKA creator content." }] }),
  component: CreatorStudioPage,
});

type CreatorPost = {
  id: string; author_id: string; content: string; topic: string | null; tradition: string | null;
  type: string; status: string; media_url: string | null; created_at: string; like_count: number;
  comment_count: number; media_kind?: string; thumbnail_url?: string | null; caption_text?: string | null;
  subtitle_url?: string | null; language?: string | null; location_label?: string | null;
  state_region?: string | null; country?: string | null; community_tag?: string | null;
  format?: string; is_premium?: boolean; premium_price_paise?: number | null; sponsored_disclosure?: string | null;
};

const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const CATEGORIES = ["Festivals", "Traditions", "Rituals", "Food", "Crafts", "Languages", "History", "Communities", "Travel"];

function CreatorStudioPage() {
  const { data: profile } = useProfile();
  const [items, setItems] = useState<CreatorPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Traditions");
  const [kind, setKind] = useState<"video" | "image" | "carousel">("video");
  const [format, setFormat] = useState<"short" | "long" | "guide" | "course" | "collection">("short");
  const [language, setLanguage] = useState("");
  const [location, setLocation] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [country, setCountry] = useState("India");
  const [community, setCommunity] = useState("");
  const [premium, setPremium] = useState(false);
  const [price, setPrice] = useState("299");
  const [sponsor, setSponsor] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [subtitles, setSubtitles] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);

  async function loadPosts() {
    setLoading(true); setError(null);
    try {
      const { data, error: loadError } = await supabase.from("posts").select("*").eq("author_id", profile?.id ?? "").order("created_at", { ascending: false });
      if (loadError) throw loadError;
      setItems((data ?? []) as CreatorPost[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your content.");
    } finally { setLoading(false); }
  }

  useEffect(() => { if (profile?.id) void loadPosts(); }, [profile?.id]);

  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function resetForm() {
    setSelectedId(null); setTitle(""); setDescription(""); setCategory("Traditions"); setKind("video");
    setFormat("short"); setLanguage(""); setLocation(""); setStateRegion(""); setCountry("India");
    setCommunity(""); setPremium(false); setPrice("299"); setSponsor(""); setFile(null); setThumbnail(null); setSubtitles(null);
  }

  function selectItem(item: CreatorPost) {
    setSelectedId(item.id); setTitle(item.content); setDescription(item.caption_text ?? item.content);
    setCategory(item.topic ?? "Traditions"); setKind((item.media_kind as "video" | "image" | "carousel") ?? (item.type === "video" ? "video" : "image"));
    setFormat((item.format as typeof format) ?? "short"); setLanguage(item.language ?? ""); setLocation(item.location_label ?? "");
    setStateRegion(item.state_region ?? ""); setCountry(item.country ?? "India"); setCommunity(item.community_tag ?? "");
    setPremium(Boolean(item.is_premium)); setPrice(String((item.premium_price_paise ?? 29900) / 100)); setSponsor(item.sponsored_disclosure ?? ""); setFile(null);
  }

  async function handleMediaChange(e: ChangeEvent<HTMLInputElement>, which: "media" | "thumbnail" | "subtitles") {
    const picked = e.target.files?.[0] ?? null;
    if (!picked) return;
    if (which === "media") {
      const allowed = kind === "video" ? VIDEO_TYPES : IMAGE_TYPES;
      const max = kind === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
      if (!allowed.includes(picked.type)) { toast.error("Unsupported media format."); e.target.value = ""; return; }
      if (picked.size > max) { toast.error(`File exceeds the ${kind === "video" ? "50 MB" : "10 MB"} limit.`); e.target.value = ""; return; }
      setFile(picked);
    } else if (which === "thumbnail") {
      if (!IMAGE_TYPES.includes(picked.type) || picked.size > MAX_IMAGE_BYTES) { toast.error("Thumbnail must be a supported image under 10 MB."); e.target.value = ""; return; }
      setThumbnail(picked);
    } else {
      if (picked.size > 2 * 1024 * 1024 || !["text/vtt", "text/plain", "application/x-subrip"].includes(picked.type)) { toast.error("Subtitles must be a VTT/SRT text file under 2 MB."); e.target.value = ""; return; }
      setSubtitles(picked);
    }
  }

  async function uploadAsset(asset: File, prefix: string) {
    if (!profile?.id) throw new Error("Sign in before uploading.");
    const safeName = asset.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${profile.id}/creator-studio/${crypto.randomUUID()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from("post-media").upload(path, asset, { upsert: false, contentType: asset.type });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from("post-media").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSave(event: FormEvent, publish: boolean) {
    event.preventDefault();
    if (!profile?.id) { toast.error("Sign in to use Creator Studio."); return; }
    if (!title.trim()) { toast.error("Add a title or caption first."); return; }
    if (!selectedId && !file) { toast.error("Choose a video or image to publish."); return; }
    if (kind === "video" && file && !VIDEO_TYPES.includes(file.type)) { toast.error("Choose an MP4, WebM or MOV video."); return; }
    setSaving(true); setUploading(Boolean(file)); setError(null);
    let uploadedPaths: string[] = [];
    try {
      let mediaUrl = selected?.media_url ?? null;
      let thumbnailUrl = selected?.thumbnail_url ?? null;
      let subtitleUrl = selected?.subtitle_url ?? null;
      if (file) mediaUrl = await uploadAsset(file, "media");
      if (thumbnail) thumbnailUrl = await uploadAsset(thumbnail, "thumbnail");
      if (subtitles) subtitleUrl = await uploadAsset(subtitles, "subtitles");
      const row = {
        author_id: profile.id, content: title.trim(), topic: category, tradition: community.trim() || null,
        type: kind === "video" ? "video" : kind, status: publish ? "visible" : "draft", media_url: mediaUrl,
        media_kind: kind, thumbnail_url: thumbnailUrl, caption_text: description.trim() || title.trim(),
        subtitle_url: subtitleUrl, language: language.trim() || null, location_label: location.trim() || null,
        state_region: stateRegion.trim() || null, country: country.trim() || null, community_tag: community.trim() || null,
        format, is_premium: premium, premium_price_paise: premium ? Math.round(Number(price || 0) * 100) : null,
        sponsored_disclosure: sponsor.trim() || null, published_at: publish ? new Date().toISOString() : null,
      };
      const client = supabase as any;
      const query = selectedId
        ? client.from("posts").update(row).eq("id", selectedId).eq("author_id", profile.id).select().single()
        : client.from("posts").insert(row).select().single();
      const { data, error: saveError } = await query;
      if (saveError) throw saveError;
      setItems((old) => selectedId ? old.map((item) => item.id === selectedId ? data : item) : [data, ...old]);
      setSelectedId(data.id); toast.success(publish ? "Published to EKA." : "Draft saved.");
      setFile(null); setThumbnail(null); setSubtitles(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not save this content.";
      setError(message); toast.error(message);
    } finally { setSaving(false); setUploading(false); }
  }

  async function removeItem(item: CreatorPost) {
    if (!window.confirm("Delete this content permanently? This cannot be undone.")) return;
    const { error: deleteError } = await supabase.from("posts").delete().eq("id", item.id).eq("author_id", profile?.id ?? "");
    if (deleteError) { toast.error(deleteError.message); return; }
    setItems((old) => old.filter((entry) => entry.id !== item.id));
    if (selectedId === item.id) resetForm();
    toast.success("Content deleted.");
  }

  const paymentsConfigured = Boolean(import.meta.env.VITE_CREATOR_PAYMENTS_ENABLED === "true");
  const rupees = (paise: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(paise / 100);

  return <div className="min-h-screen bg-background text-foreground flex flex-col"><SiteHeader />
    <main className="container-eka flex-1 py-8 sm:py-12 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div><Badge variant="outline">EKA Creator Studio</Badge><h1 className="mt-3 font-serif text-3xl sm:text-5xl font-bold">Your stories. Your audience. Your work.</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Publish culture-first videos, guides and collections. Your content and any earnings data are tied to your account—never estimated or fabricated.</p></div>
        <Button onClick={resetForm}><Plus className="mr-2 size-4" />Create content</Button>
      </header>
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border p-5"><p className="text-sm text-muted-foreground">Published content</p><p className="mt-2 text-3xl font-semibold">{items.filter((x) => x.status === "visible").length}</p></div>
        <div className="rounded-2xl border p-5"><p className="text-sm text-muted-foreground">Likes recorded</p><p className="mt-2 text-3xl font-semibold">{items.reduce((n, x) => n + (x.like_count || 0), 0)}</p><p className="text-xs text-muted-foreground mt-1">From current post counters; views and watch time are not currently available here.</p></div>
        <div className="rounded-2xl border p-5"><p className="text-sm text-muted-foreground">Creator earnings</p><p className="mt-2 text-2xl font-semibold">Not connected</p><p className="text-xs text-muted-foreground mt-1">No payment has been recorded by this screen.</p></div>
      </section>
      <section className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="rounded-2xl border p-4 space-y-3">
          <h2 className="font-semibold">Your media library</h2>
          {loading ? <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="size-4 animate-spin" />Loading your content…</p>
            : error && items.length === 0 ? <p className="text-sm text-destructive">{error}</p>
            : items.length === 0 ? <p className="text-sm text-muted-foreground">No content yet. Create your first cultural video or guide.</p>
            : items.map((item) => <div key={item.id} className={`flex items-center gap-3 rounded-xl border p-3 ${selectedId === item.id ? "border-primary bg-primary/5" : ""}`}>
                {item.media_kind === "video" || item.type === "video" ? <Film className="size-5 shrink-0" /> : <ImageIcon className="size-5 shrink-0" />}
                <button className="min-w-0 flex-1 text-left" onClick={() => selectItem(item)}><span className="block truncate text-sm font-medium">{item.content}</span><span className="text-xs text-muted-foreground">{item.status} · {item.topic ?? "Culture"}</span></button>
                <button aria-label="Delete content" className="text-muted-foreground hover:text-destructive" onClick={() => void removeItem(item)}><Trash2 className="size-4" /></button>
              </div>)}
          <Link to="/stories" className="block text-sm text-primary hover:underline pt-2">View Stories →</Link>
        </aside>
        <section className="rounded-2xl border p-5 sm:p-7">
          <form onSubmit={(e) => void handleSave(e, true)} className="space-y-5">
            <div className="flex flex-wrap gap-2">{(["video","image","carousel"] as const).map((x) => <Button key={x} type="button" variant={kind === x ? "default" : "outline"} onClick={() => setKind(x)}>{x === "video" ? <Film className="mr-2 size-4" /> : <ImageIcon className="mr-2 size-4" />}{x}</Button>)}</div>
            <div className="grid gap-4 sm:grid-cols-2"><div><label className="mb-1 block text-sm font-medium">Title / caption *</label><Input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={180} placeholder="A story from your community" /></div>
              <div><label className="mb-1 block text-sm font-medium">Cultural category</label><select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((x) => <option key={x}>{x}</option>)}</select></div></div>
            <div><label className="mb-1 block text-sm font-medium">Description</label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={5000} placeholder="Add context, attribution and what viewers should understand." /></div>
            <div className="grid gap-4 sm:grid-cols-2"><div><label className="mb-1 block text-sm font-medium">Video or images {selectedId ? "(optional replacement)" : "*"}</label><Input type="file" accept={kind === "video" ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/webp,image/avif"} onChange={(e) => void handleMediaChange(e, "media")} required={!selectedId} /></div>
              <div><label className="mb-1 block text-sm font-medium">Custom thumbnail (optional)</label><Input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => void handleMediaChange(e, "thumbnail")} /></div></div>
            {previewUrl && <div className="max-w-xs">{kind === "video" ? <video src={previewUrl} controls playsInline className="aspect-[9/16] max-h-[420px] w-full rounded-xl bg-black object-contain" /> : <img src={previewUrl} alt="Selected media preview" className="max-h-72 rounded-xl object-contain" />}</div>}
            {selected?.media_url && !file && <div className="max-w-xs">{selected.media_kind === "video" || selected.type === "video" ? <video src={selected.media_url} controls playsInline className="aspect-[9/16] max-h-[320px] w-full rounded-xl bg-black object-contain" /> : <img src={selected.thumbnail_url || selected.media_url} alt={selected.content} className="max-h-64 rounded-xl object-contain" />}</div>}
            <div><label className="mb-1 block text-sm font-medium">Captions / subtitles (.vtt or .srt)</label><Input type="file" accept=".vtt,.srt,text/vtt,text/plain" onChange={(e) => void handleMediaChange(e, "subtitles")} /><p className="mt-1 text-xs text-muted-foreground">Subtitles are stored as an uploaded asset; playback subtitle tracks require the URL to be served with a compatible MIME type.</p></div>
            <div className="grid gap-4 sm:grid-cols-3"><div><label className="mb-1 block text-sm font-medium">Language</label><Input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Assamese, Hindi…" /></div><div><label className="mb-1 block text-sm font-medium">State / region</label><Input value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} placeholder="Assam" /></div><div><label className="mb-1 block text-sm font-medium">Country</label><Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="India" /></div></div>
            <div className="grid gap-4 sm:grid-cols-2"><div><label className="mb-1 block text-sm font-medium">Location</label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Town, district or place" /></div><div><label className="mb-1 block text-sm font-medium">Community tag</label><Input value={community} onChange={(e) => setCommunity(e.target.value)} placeholder="Community or lineage (optional)" /></div></div>
            <div className="grid gap-4 sm:grid-cols-2"><div><label className="mb-1 block text-sm font-medium">Content format</label><select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={format} onChange={(e) => setFormat(e.target.value as typeof format)}>{(["short","long","guide","course","collection"] as const).map((x) => <option key={x} value={x}>{x}</option>)}</select></div>
              <div className="flex items-center gap-3 rounded-xl border p-3"><input id="premium" type="checkbox" checked={premium} onChange={(e) => setPremium(e.target.checked)} /><label htmlFor="premium" className="text-sm">Mark as premium (access control requires payment integration)</label></div></div>
            {premium && <div className="max-w-xs"><label className="mb-1 block text-sm font-medium">Price (INR)</label><Input type="number" min="1" max="100000" step="1" value={price} onChange={(e) => setPrice(e.target.value)} /></div>}
            <div><label className="mb-1 block text-sm font-medium">Brand sponsorship disclosure</label><Input value={sponsor} onChange={(e) => setSponsor(e.target.value)} placeholder="e.g., Paid partnership with [brand] (leave blank if none)" /></div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm"><p className="font-medium flex items-center gap-2"><CircleAlert className="size-4" />Monetisation status</p><p className="mt-1 text-muted-foreground">Creator subscription reference price: ₹299/month. Proposed EKA commission: 5–10% (default estimate 7.5%). These are configuration defaults, not active billing. Checkout, verified webhooks, refunds and payouts remain disabled until server credentials and handlers are deployed.</p></div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <div className="flex flex-wrap gap-3 border-t pt-4"><Button type="button" variant="outline" disabled={saving} onClick={(e) => void handleSave(e as unknown as FormEvent, false)}><Save className="mr-2 size-4" />Save draft</Button><Button type="submit" disabled={saving}>{saving ? <><Loader2 className="mr-2 size-4 animate-spin" />{uploading ? "Uploading…" : "Saving…"}</> : "Publish content"}</Button></div>
          </form>
        </section>
      </section>
      <section className="rounded-2xl border p-5 sm:p-7"><h2 className="text-xl font-semibold flex items-center gap-2"><Wallet className="size-5" />Earnings & payout status</h2><p className="mt-2 text-sm text-muted-foreground">Earnings and watch-time analytics appear only after verified events exist. No ledger entries or payment success are created by this UI.</p><div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-muted/40 p-4"><p className="text-sm text-muted-foreground">Views / watch time</p><p className="mt-1 font-semibold">Not tracked by current schema</p></div><div className="rounded-xl bg-muted/40 p-4"><p className="text-sm text-muted-foreground">Creator subscription</p><p className="mt-1 font-semibold">₹299 / month · not active</p></div><div className="rounded-xl bg-muted/40 p-4"><p className="text-sm text-muted-foreground">Payments</p><p className="mt-1 font-semibold">{paymentsConfigured ? "Feature flag enabled; verify server setup" : "Disabled — no payment provider configured"}</p></div></div></section>
    </main><SiteFooter /></div>;
}
