
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SearchTrendsResponse {
  success: boolean;
  results: any[];
  total_found: number;
  total_processed: number;
}

export const useTrendSearch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (keyword: string): Promise<SearchTrendsResponse> => {
      console.log('Starting trend search for:', keyword);
      
      const { data, error } = await supabase.functions.invoke('search-trends', {
        body: { keyword },
      });

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      console.log('Search completed successfully:', data);
      return data;
    },
    onSuccess: (data, keyword) => {
      console.log('Search mutation successful:', data);
      
      // Invalidate and refetch trend data
      queryClient.invalidateQueries({ queryKey: ['trend-data'] });
      queryClient.invalidateQueries({ queryKey: ['trend-data', keyword] });
      
      toast({
        title: "Search Completed",
        description: `Found ${data.total_found} results, processed ${data.total_processed} successfully.`,
      });
    },
    onError: (error: any) => {
      console.error('Search failed:', error);
      toast({
        title: "Search Failed",
        description: error.message || "Failed to search for trends. Please try again.",
        variant: "destructive",
      });
    },
  });
};
