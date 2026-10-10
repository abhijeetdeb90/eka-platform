import React from "react";
import { Link } from "@tanstack/react-router";
import { Share2, ArrowRight, Network, Sparkles, MapPin, Hammer, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLiveKnowledgeEdges } from "@/hooks/useLiveKnowledgeEdges";
import type { LinkedGraphNode } from "@/lib/knowledge/knowledge-object";

interface KnowledgeGraphVisualizerProps {
  sourceEntityId?: string;
  nodes: LinkedGraphNode[];
  currentEntityName: string;
  className?: string;
}

export function KnowledgeGraphVisualizer({
  sourceEntityId,
  nodes,
  currentEntityName,
  className = "",
}: KnowledgeGraphVisualizerProps) {
  const { data: liveEdges } = useLiveKnowledgeEdges(sourceEntityId);

  const hasLocalNodes = nodes && nodes.length > 0;
  const hasLiveEdges = liveEdges && liveEdges.length > 0;
  if (!hasLocalNodes && !hasLiveEdges) return null;

  const getNodeIcon = (type: LinkedGraphNode["targetType"]) => {
    switch (type) {
      case "place":
        return <MapPin className="h-4 w-4 text-emerald-600" />;
      case "craft":
        return <Hammer className="h-4 w-4 text-amber-600" />;
      case "community":
        return <Users className="h-4 w-4 text-blue-600" />;
      default:
        return <Sparkles className="h-4 w-4 text-primary" />;
    }
  };

  const formatRelation = (relation: string) => {
    return relation.replace(/_/g, " ").toUpperCase();
  };

  return (
    <div
      data-testid="eka-knowledge-graph-section"
      className={`rounded-3xl border border-border/80 bg-card p-6 shadow-calm sm:p-8 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Network className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Cultural Knowledge Graph Connections
            </h3>
            <Badge variant="outline" className="text-xs">
              {nodes?.length || 0} Connected Nodes
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentEntityName} is not an isolated silo. Explore how this tradition interconnects with
            sacred geography, artisan guilds, and sister cultures.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(nodes || []).map((node, idx) => (
          <Link
            key={node.targetId || idx}
            to={`/knowledge/${node.targetSlug}` as any}
            data-testid={`graph-node-${node.targetSlug}`}
            className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-sand/15 p-4 transition-all hover:border-primary/50 hover:bg-sand/30 hover:shadow-calm"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant="outline"
                  className="border-primary/30 text-[10px] uppercase tracking-wider text-primary font-mono"
                >
                  {formatRelation(node.relation)}
                </Badge>
                <div className="flex items-center gap-1">
                  {getNodeIcon(node.targetType)}
                  <span className="text-[11px] font-medium text-muted-foreground capitalize">
                    {node.targetType}
                  </span>
                </div>
              </div>

              <h4 className="mt-3 font-serif text-base font-bold text-foreground group-hover:text-primary transition-colors">
                {node.targetName}
              </h4>

              <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {node.description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-2 text-xs font-medium text-primary">
              <span>Explore Connection</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
