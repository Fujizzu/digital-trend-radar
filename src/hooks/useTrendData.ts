
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TrendData } from '@/types/trend';

export const useTrendData = (searchKeyword?: string) => {
  return useQuery({
    queryKey: ['trend-data', searchKeyword],
    queryFn: async () => {
      console.log('Fetching trend data for keyword:', searchKeyword);
      
      let query = supabase
        .from('trend_data')
        .select(`
          *,
          trend_keywords(
            relevance_score,
            keywords(keyword)
          )
        `)
        .order('timestamp_original', { ascending: false })
        .limit(20);

      // If we have a search keyword, filter by it
      if (searchKeyword) {
        // Get trend data that has associated keywords matching our search
        const { data: keywordData, error: keywordError } = await supabase
          .from('keywords')
          .select('id')
          .ilike('keyword', `%${searchKeyword}%`);

        if (keywordError) {
          console.error('Error fetching keywords:', keywordError);
          throw keywordError;
        }

        if (keywordData && keywordData.length > 0) {
          const keywordIds = keywordData.map(k => k.id);
          
          const { data: trendKeywords, error: trendKeywordError } = await supabase
            .from('trend_keywords')
            .select('trend_data_id')
            .in('keyword_id', keywordIds);

          if (trendKeywordError) {
            console.error('Error fetching trend keywords:', trendKeywordError);
            throw trendKeywordError;
          }

          if (trendKeywords && trendKeywords.length > 0) {
            const trendIds = trendKeywords.map(tk => tk.trend_data_id);
            query = query.in('id', trendIds);
          } else {
            // No matching trends found
            return [];
          }
        } else {
          // No matching keywords found
          return [];
        }
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching trend data:', error);
        throw error;
      }
      
      console.log('Raw trend data:', data);
      
      // Transform the data to match our interface
      const transformedData = data?.map(item => ({
        id: item.id,
        content_summary: item.content_summary || '',
        sentiment: item.sentiment || 'neutral',
        confidence_score: item.confidence_score || 0,
        mention_count: item.mention_count || 0,
        source_type: item.source_type,
        timestamp_original: item.timestamp_original,
        engagement_metrics: item.engagement_metrics as any,
        keywords: item.trend_keywords?.map((tk: any) => ({
          keyword: tk.keywords?.keyword || '',
          relevance_score: tk.relevance_score || 0
        })) || []
      })) || [];

      console.log('Transformed trend data:', transformedData);
      return transformedData as TrendData[];
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
