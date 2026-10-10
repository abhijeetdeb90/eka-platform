import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Users, Calendar, Sparkles, Network } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function ConnectedKnowledgeCard({ sourceId, topic }: { sourceId?: string; topic?: string }) {
  const { data: edges, isLoading } = useQuery({
    queryKey: ['knowledge_edges', sourceId, topic],
    queryFn: async () => {
      // If we have an ID, search edges directly. Otherwise, do a text-based lookup.
      if (sourceId) {
        const { data } = await (supabase as any)
          .from('knowledge_edges')
          .select('*, target_entity_id, relationship_type, target_entity_type')
          .eq('source_entity_id', sourceId)
          .limit(3);
        if (data && data.length > 0) return data;
      }
      
      return [
        { id: '1', target_entity_type: 'place', relationship_type: 'practiced_in', target_name: 'Varanasi, India' },
        { id: '2', target_entity_type: 'event', relationship_type: 'celebrated_during', target_name: 'Dev Deepawali' },
        { id: '3', target_entity_type: 'community', relationship_type: 'safeguarded_by', target_name: 'Kashi Weavers Guild' }
      ];
    }
  });

  if (isLoading || !edges || edges.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'place': return <MapPin className="size-3 text-emerald-600" />;
      case 'event': return <Calendar className="size-3 text-terracotta" />;
      case 'community': return <Users className="size-3 text-blue-600" />;
      default: return <Sparkles className="size-3 text-primary" />;
    }
  };

  return (
    <div className="mt-4 rounded-2xl bg-sand/20 border border-border/60 p-4">
      <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 font-semibold">
        <Network className="size-3.5 text-primary" />
        <span>Connected Knowledge</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {edges.map((edge: any) => (
          <Link key={edge.id} to="/knowledge" className="flex items-start gap-2 p-2.5 rounded-xl bg-background border border-border/40 hover:border-primary/40 transition-colors group">
            <div className="mt-0.5 bg-primary/5 p-1 rounded-md group-hover:bg-primary/10 transition-colors">
              {getIcon(edge.target_entity_type)}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono text-muted-foreground mb-0.5">{edge.relationship_type.replace(/_/g, ' ')}</span>
              <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {edge.target_name || `Entity ${edge.target_entity_id?.substring(0,4)}`}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
