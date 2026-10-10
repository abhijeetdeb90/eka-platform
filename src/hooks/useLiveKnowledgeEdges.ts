import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useLiveKnowledgeEdges(sourceEntityId: string | undefined) {
  return useQuery({
    queryKey: ['knowledge_edges', sourceEntityId],
    queryFn: async () => {
      if (!sourceEntityId) return [];
      
      const { data, error } = await supabase
        .from('knowledge_edges')
        .select('*')
        .eq('source_entity_id', sourceEntityId);
        
      if (error) {
        console.error('Error fetching knowledge edges:', error);
        return [];
      }
      
      // In a real scenario, you'd join with the target entities.
      // Since this is a new table, we just return the edges directly.
      return data || [];
    },
    enabled: !!sourceEntityId
  });
}
