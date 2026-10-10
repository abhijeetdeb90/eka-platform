import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useKnowledgeEdges(entityId: string) {
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEdges() {
      if (!entityId) return;
      const { data } = await supabase
        .from('knowledge_edges')
        .select('*')
        .eq('source_entity_id', entityId)
        .limit(5);
      
      setEdges(data || []);
      setLoading(false);
    }
    fetchEdges();
  }, [entityId]);

  return { edges, loading };
}
