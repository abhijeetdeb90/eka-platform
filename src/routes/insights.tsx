import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowRight, User, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/insights")({
  component: InsightsPage,
});

function InsightsPage() {
  const { data: insights, isLoading, error } = useQuery({
    queryKey: ["public-insights"],
    queryFn: async () => {
      // Fetch from knowledge_objects first
      const { data, error } = await (supabase as any)
        .from("knowledge_objects")
        .select(`*`)
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      
      // If none, fallback to posts to fetch cultural/editorial posts
      if (!data || data.length === 0) {
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select(`*`)
          .eq("status", "published")
          .order("created_at", { ascending: false });
          
        if (postsError) throw postsError;
        return postsData || [];
      }
      
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-terracotta/20">
      <SiteHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Stitch Editorial Insights Hero Header */}
        <div className="border-b border-border/60 pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/70 text-terracotta font-mono text-[10px] uppercase tracking-wider font-semibold mb-3">
            <BookOpen className="size-3.5" />
            Founding Philosophy & Living Lore
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif text-foreground tracking-tight leading-[1.15] mb-3">
            EKA Insights & Cultural Perspectives
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
            Founding essays, philosophical treatises, and field contemplations on human connection, living heritage, and the ethics of memory in an algorithmic age.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-red-500 py-10">Failed to load insights.</div>
        ) : !insights || insights.length === 0 ? (
          <div className="text-neutral-500 py-10">No insights published yet. Check back soon.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insights.map((item: any) => (
              <InsightCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function InsightCard({ item }: { item: any }) {
  // Extracting real data from db fields
  const authorName = item.created_by || item.author_id || "EKA Editorial";
  const category = item.category || item.type || item.topic || "Perspective";
  
  // Provenance metadata rendering
  const provenance = item.provenance;
  const references = provenance?.citation || item.source_name || item.references || null;

  // Determine the link destination
  const linkTo = item.slug ? "/knowledge/$slug" : "#";
  const linkParams = item.slug ? { slug: item.slug } : undefined;

  return (
    <article className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {item.cover_image || item.media_url ? (
        <div className="aspect-video w-full overflow-hidden bg-neutral-100">
          <img 
            src={item.cover_image || item.media_url} 
            alt={item.title || "Insight image"} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-primary/5 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-primary/40" />
        </div>
      )}
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs font-medium">
            {category}
          </Badge>
        </div>
        
        <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-2">
          {item.title || "Cultural Insight"}
        </h3>
        
        <p className="text-neutral-600 mb-4 line-clamp-3 text-sm flex-1">
          {item.summary || item.description || item.content}
        </p>

        <div className="mt-auto pt-4 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                <User className="h-3 w-3 text-primary" />
              </div>
              <span className="text-xs font-medium text-neutral-700 truncate max-w-[120px]" title={authorName}>
                {authorName}
              </span>
            </div>
            
            {item.slug ? (
              <Link 
                to="/knowledge/$slug" 
                params={{ slug: item.slug }}
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm font-medium"
              >
                Read <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <button className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm font-medium">
                Read <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {references && (
            <div className="mt-3 text-xs text-neutral-500 bg-neutral-50 p-2 rounded border border-neutral-100 break-words">
              <span className="font-semibold text-neutral-700">Source: </span> 
              {typeof references === 'string' ? references : JSON.stringify(references)}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
