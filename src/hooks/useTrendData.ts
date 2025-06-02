
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TrendData {
  id: string;
  content_summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence_score: number;
  mention_count: number;
  source_type: string;
  timestamp_original: string;
  keywords: Array<{
    keyword: string;
    relevance_score: number;
  }>;
}

export const useTrendData = (searchKeyword?: string) => {
  return useQuery({
    queryKey: ['trend-data', searchKeyword],
    queryFn: async () => {
      let query = supabase
        .from('trend_data')
        .select(`
          *,
          trend_keywords!inner(
            relevance_score,
            keywords!inner(keyword)
          )
        `)
        .order('timestamp_original', { ascending: false })
        .limit(20);

      if (searchKeyword) {
        query = query.ilike('trend_keywords.keywords.keyword', `%${searchKeyword}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = data?.map(item => ({
        id: item.id,
        content_summary: item.content_summary || '',
        sentiment: item.sentiment || 'neutral',
        confidence_score: item.confidence_score || 0,
        mention_count: item.mention_count || 0,
        source_type: item.source_type,
        timestamp_original: item.timestamp_original,
        keywords: item.trend_keywords?.map((tk: any) => ({
          keyword: tk.keywords.keyword,
          relevance_score: tk.relevance_score
        })) || []
      })) || [];

      return transformedData as TrendData[];
    },
    enabled: true,
  });
};
