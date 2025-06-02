
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SearchTrendsResponse {
  success: boolean;
  results: any[];
  total_found: number;
  total_processed: number;
  total_failed?: number;
  processing_time_ms?: number;
  sources_searched?: string[];
  errors?: any[];
}

export const useTrendSearch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (keyword: string): Promise<SearchTrendsResponse> => {
      console.log('Starting comprehensive trend search for:', keyword);
      
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
      
      const successMessage = data.sources_searched 
        ? `Searched ${data.sources_searched.join(', ')} and found ${data.total_found} results`
        : `Found ${data.total_found} results`;
      
      const processingDetails = data.total_failed && data.total_failed > 0
        ? `, processed ${data.total_processed} successfully (${data.total_failed} failed)`
        : `, processed ${data.total_processed} successfully`;

      toast({
        title: "Search Completed",
        description: `${successMessage}${processingDetails}.`,
        duration: data.errors && data.errors.length > 0 ? 6000 : 4000,
      });

      // Show warning if there were errors
      if (data.errors && data.errors.length > 0) {
        console.warn('Search completed with errors:', data.errors);
        setTimeout(() => {
          toast({
            title: "Some Issues Encountered",
            description: `${data.errors.length} items couldn't be processed. Check console for details.`,
            variant: "destructive",
            duration: 5000,
          });
        }, 1000);
      }
    },
    onError: (error: any) => {
      console.error('Search failed:', error);
      toast({
        title: "Search Failed",
        description: error.message || "Failed to search for trends. Please check your internet connection and try again.",
        variant: "destructive",
        duration: 6000,
      });
    },
  });
};
