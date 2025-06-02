
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BrandMonitoring {
  id: string;
  brand_name: string;
  keywords: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useBrandMonitoring = () => {
  return useQuery({
    queryKey: ['brand-monitoring'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brand_monitoring')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BrandMonitoring[];
    },
  });
};

export const useAddBrandMonitoring = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ brandName, keywords }: { brandName: string; keywords: string[] }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('brand_monitoring')
        .insert({
          brand_name: brandName,
          keywords,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand-monitoring'] });
    },
  });
};
