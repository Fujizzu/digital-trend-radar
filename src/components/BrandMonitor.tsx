
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, TrendingUp, TrendingDown, AlertCircle, Plus, Loader2 } from 'lucide-react';
import { useBrandMonitoring, useAddBrandMonitoring } from '@/hooks/useBrandMonitoring';
import { useToast } from '@/hooks/use-toast';

const BrandMonitor = () => {
  const [newBrand, setNewBrand] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  
  const { data: monitoredBrands, isLoading } = useBrandMonitoring();
  const addBrandMutation = useAddBrandMonitoring();
  const { toast } = useToast();

  const addBrand = async () => {
    if (!newBrand.trim()) {
      toast({
        title: "Error",
        description: "Please enter a brand name",
        variant: "destructive",
      });
      return;
    }

    const keywords = newKeywords.split(',').map(k => k.trim()).filter(k => k);
    if (keywords.length === 0) {
      keywords.push(newBrand.trim());
    }

    try {
      await addBrandMutation.mutateAsync({
        brandName: newBrand.trim(),
        keywords,
      });
      
      setNewBrand('');
      setNewKeywords('');
      
      toast({
        title: "Success",
        description: "Brand monitoring added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add brand monitoring",
        variant: "destructive",
      });
    }
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return 'text-emerald-600';
    if (sentiment >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentBg = (sentiment: number) => {
    if (sentiment >= 70) return 'bg-emerald-100';
    if (sentiment >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Brand Monitoring
          </CardTitle>
          <CardDescription>
            Track mentions, sentiment, and reputation across all digital channels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Brand name to monitor..."
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={addBrand} 
              disabled={addBrandMutation.isPending}
            >
              {addBrandMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add Brand
            </Button>
          </div>
          <div>
            <Input
              placeholder="Keywords (comma-separated, optional)"
              value={newKeywords}
              onChange={(e) => setNewKeywords(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              If no keywords provided, the brand name will be used as the primary keyword
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {monitoredBrands && monitoredBrands.length > 0 ? (
          monitoredBrands.map((brand) => (
            <Card key={brand.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{brand.brand_name}</CardTitle>
                    <CardDescription>
                      Monitoring since {new Date(brand.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant={brand.is_active ? "default" : "secondary"}>
                    {brand.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Keywords */}
                  <div className="p-4 rounded-lg bg-blue-50">
                    <div className="text-sm font-medium mb-3">Monitored Keywords</div>
                    <div className="space-y-1">
                      {brand.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="mr-1 mb-1">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="p-4 rounded-lg bg-green-50">
                    <div className="text-sm font-medium mb-2">Status</div>
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${brand.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-sm">
                        {brand.is_active ? 'Actively monitoring' : 'Monitoring paused'}
                      </span>
                    </div>
                  </div>

                  {/* Last Update */}
                  <div className="p-4 rounded-lg bg-slate-100">
                    <div className="text-sm font-medium mb-2">Last Updated</div>
                    <div className="text-sm text-slate-600">
                      {new Date(brand.updated_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">No brands being monitored yet</p>
              <p className="text-sm text-muted-foreground">Add a brand above to start monitoring</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BrandMonitor;
