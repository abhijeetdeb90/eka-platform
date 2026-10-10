import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  Video,
  Image as ImageIcon,
  Edit,
  Trash2,
  Lock,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useMonetizationTier } from "@/lib/monetization";
import { AppScreen } from "@/components/app/AppScreen";

export const Route = createFileRoute("/_authenticated/app/creator/dashboard")({
  component: CreatorDashboardPage,
});

export function CreatorDashboardPage() {
  const { canUseCreatorStudio, setTier } = useMonetizationTier();
  
  const [contentList, setContentList] = useState([
    { id: 1, title: "The Art of Handloom", type: "Post", status: "Published", date: "2026-10-01" },
    { id: 2, title: "Folk Songs of Majuli", type: "Video", status: "Draft", date: "2026-10-05" },
    { id: 3, title: "Cultural Heritage Sites", type: "Carousel", status: "Published", date: "2026-09-28" },
  ]);

  if (!canUseCreatorStudio) {
    return (
      <AppScreen eyebrow="Creator Studio" title="Professional Workspace">
        <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-calm space-y-6 text-center">
          <Badge variant="outline" className="border-terracotta/40 text-terracotta text-xs font-mono uppercase gap-1.5">
            <Lock className="size-3" /> Paid Workspace · Creator Tier
          </Badge>

          <div className="space-y-2 max-w-2xl mx-auto">
            <h1 className="font-serif text-3xl sm:text-4xl text-foreground font-normal">
              Creator Studio — Professional Workspace
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed pt-2">
              Creator Studio is a dedicated workspace for cultural storytellers to manage their content, track analytics, and manage monetization.
            </p>
          </div>

          <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-primary text-primary-foreground">
              <Link to="/membership">
                <span>Unlock Creator Studio (₹799/month)</span>
                <ArrowUpRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setTier("creator");
                toast.success("Creator Studio preview mode activated!");
              }}
              className="w-full sm:w-auto rounded-full"
            >
              <span>Instant Workspace Demo Preview</span>
            </Button>
          </div>
        </div>
      </AppScreen>
    );
  }

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this content? This action cannot be undone.")) {
      setContentList(contentList.filter(c => c.id !== id));
      toast.success("Content deleted successfully.");
    }
  };

  const draftsCount = contentList.filter(c => c.status === "Draft").length;
  const publishedCount = contentList.filter(c => c.status === "Published").length;

  return (
    <AppScreen eyebrow="Creator Studio" title="Workspace Dashboard">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your cultural stories, track publishing workflows, and create new content.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/membership">Account & Plan</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/app/creator/earnings">View Earnings</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Content</CardDescription>
            <CardTitle className="text-3xl">{contentList.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Published</CardDescription>
            <CardTitle className="text-3xl text-primary">{publishedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Drafts</CardDescription>
            <CardTitle className="text-3xl text-amber-500">{draftsCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold">Content Management</h2>
          </div>
          <Card>
            <div className="divide-y divide-border">
              {contentList.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">No content found.</div>
              ) : (
                contentList.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.title}</span>
                        <Badge variant={item.status === "Published" ? "default" : "secondary"} className="text-[10px]">
                          {item.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {item.type === "Post" && <FileText className="size-3" />}
                          {item.type === "Video" && <Video className="size-3" />}
                          {item.type === "Carousel" && <ImageIcon className="size-3" />}
                          {item.type}
                        </span>
                        <span>•</span>
                        <span>Updated: {item.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" disabled title="Edit functionality coming soon.">
                        <Edit className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive" title="Delete Content">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-display font-semibold">Create New</h2>
          <div className="grid gap-3">
            <Button asChild className="w-full justify-start gap-3 h-12" variant="outline">
              <Link to="/app/create">
                <FileText className="size-4 text-primary" />
                Write a Post
              </Link>
            </Button>
            <Button asChild className="w-full justify-start gap-3 h-12" variant="outline">
              <Link to="/app/create">
                <Video className="size-4 text-primary" />
                Upload Video
              </Link>
            </Button>
            <Button asChild className="w-full justify-start gap-3 h-12" variant="outline">
              <Link to="/app/create">
                <ImageIcon className="size-4 text-primary" />
                Create Carousel
              </Link>
            </Button>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 mt-6">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="size-4 text-primary" />
              <h3 className="font-medium text-sm">Publishing Workflow</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All content undergoes automated QCS checks prior to publication. High-quality citations will automatically elevate your Trust Tier.
            </p>
          </div>
        </div>
      </div>
    </AppScreen>
  );
}
