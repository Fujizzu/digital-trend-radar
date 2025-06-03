
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, Activity, Globe, MapPin } from 'lucide-react';
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

  // Helper function to get language flag
  const getLanguageFlag = (language?: string) => {
    switch (language) {
      case 'fi': return '🇫🇮';
      case 'sv': return '🇸🇪';
      case 'en': return '🇬🇧';
      default: return '🌐';
    }
  };

  // Helper function to get source-specific styling
  const getSourceStyling = (sourceType: string) => {
    const sourceStyles: { [key: string]: string } = {
      'yle': 'bg-blue-50 border-blue-200',
      'hs': 'bg-gray-50 border-gray-200',
      'iltalehti': 'bg-red-50 border-red-200',
      'is': 'bg-yellow-50 border-yellow-200',
      'mtv': 'bg-purple-50 border-purple-200',
      'suomi24': 'bg-green-50 border-green-200',
      'vauva': 'bg-pink-50 border-pink-200',
      'ylilauta': 'bg-orange-50 border-orange-200',
      'facebook': 'bg-blue-50 border-blue-200',
      'linkedin': 'bg-blue-50 border-blue-200',
      'twitter': 'bg-sky-50 border-sky-200'
    };
    return sourceStyles[sourceType] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Finnish AI-Powered Trend Analysis
          </CardTitle>
          <CardDescription className="flex items-center space-x-4">
            <span>Real-time intelligence across Finnish news, social media, and forums. Advanced sentiment analysis with emotion detection.</span>
            <div className="flex items-center space-x-2 text-sm">
              <Globe className="h-4 w-4" />
              <span>🇫🇮 Finnish 🇸🇪 Swedish 🇬🇧 English</span>
            </div>
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
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Activity className="h-3 w-3" />
                  <span>Real-time analysis</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>Regional detection</span>
                </div>
              </div>
            </div>
            {trendResults.map((trend) => (
              <div key={trend.id} className={`${getSourceStyling(trend.source_type)} rounded-lg p-1`}>
                <div className="bg-white rounded-md">
                  <TrendCard trend={trend} />
                  <div className="px-4 pb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <span>{getLanguageFlag(trend.language)} {trend.language?.toUpperCase()}</span>
                      {trend.city && (
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {trend.city}
                        </span>
                      )}
                      {trend.region && (
                        <span className="text-gray-500">({trend.region})</span>
                      )}
                    </div>
                    <span className="capitalize font-medium">{trend.source_type.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
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
