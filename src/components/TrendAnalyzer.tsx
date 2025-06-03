
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, Activity } from 'lucide-react';
import { useTrendData } from '@/hooks/useTrendData';
import { useTrendSearch } from '@/hooks/useTrendSearch';
import TrendSearchForm from './TrendSearchForm';
import TrendSearchStatus from './TrendSearchStatus';
import TrendCard from './TrendCard';
import TrendEmptyState from './TrendEmptyState';

const TrendAnalyzer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  
  const { data: trendResults, isLoading: isLoadingData, error, refetch } = useTrendData(activeSearch);
  const searchMutation = useTrendSearch();

  const handleAnalyze = async () => {
    if (!searchQuery.trim()) return;
    
    console.log('Starting analysis for:', searchQuery);
    setActiveSearch(searchQuery);
    
    // First, try to get existing data
    await refetch();
    
    // Then trigger a new search to fetch fresh data from the internet
    searchMutation.mutate(searchQuery);
  };

  const isLoading = isLoadingData || searchMutation.isPending;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            AI-Powered Trend Analysis
          </CardTitle>
          <CardDescription>
            Real-time intelligence across news, social media, and forums. Advanced sentiment analysis with emotion detection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrendSearchForm
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAnalyze={handleAnalyze}
            onRefresh={() => refetch()}
            isLoading={isLoading}
            isSearching={searchMutation.isPending}
            activeSearch={activeSearch}
          />
          
          <TrendSearchStatus
            isSearching={searchMutation.isPending}
            searchError={searchMutation.error}
          />
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Error loading trend data</p>
              <p className="text-sm">{error.message}</p>
              <Button 
                variant="outline" 
                onClick={() => refetch()} 
                className="mt-2"
                disabled={isLoading}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {trendResults && trendResults.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">
                Found {trendResults.length} trend{trendResults.length !== 1 ? 's' : ''} for "{activeSearch}"
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" />
                <span>Real-time analysis</span>
              </div>
            </div>
            {trendResults.map((trend) => (
              <TrendCard key={trend.id} trend={trend} />
            ))}
          </>
        ) : (
          <TrendEmptyState
            activeSearch={activeSearch}
            isLoading={isLoading}
            onAnalyze={handleAnalyze}
            hasNoResults={activeSearch && !isLoading && (!trendResults || trendResults.length === 0)}
          />
        )}
      </div>
    </div>
  );
};

export default TrendAnalyzer;
