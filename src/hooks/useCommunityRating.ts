import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
export function useCommunityRating(slug: string) {
  return useQuery({ queryKey: ['community-rating', slug], queryFn: async () => {
    const { data, error } = await supabase.rpc('get_tool_review_summary', { _tool_slug: slug });
    if (error) throw error;
    const row = data?.[0];
    return { rating: Number(row?.average_rating || 0), count: Number(row?.review_count || 0) };
  }, staleTime: 30000, retry: 1 });
}