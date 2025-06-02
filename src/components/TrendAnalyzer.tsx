
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Users, Calendar, Globe, Loader2, RefreshCw } from 'lucide-react';
import { useTrendData } from '@/hooks/useTrendData';
import { useTrendSearch } from '@/hooks/useTrendSearch';

const TrendAnalyzer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  
  const { data: trendResults, isLoading: isLoadingData, error, refetch } = useTrendData(activeSearch);
  const searchMutation = useTrendSearch();

  const handleAnalyze = async () => {
    if (!searchQuery.trim()) return;
    
    setActiveSearch(searchQuery);
    
    // First, try to get existing data
    await refetch();
    
    // Then trigger a new search to fetch fresh data from the internet
    searchMutation.mutate(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const isLoading = isLoadingData || searchMutation.isPending;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Trend Analysis
          </CardTitle>
          <CardDescription>
            Analyze real-time trends across social media, search, and news platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter keyword, brand, or topic to analyze..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={handleAnalyze} disabled={isLoading || !searchQuery.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {searchMutation.isPending ? 'Searching...' : 'Loading...'}
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
            {activeSearch && (
              <Button 
                variant="outline" 
                onClick={() => refetch()} 
                disabled={isLoading}
                title="Refresh existing data"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {searchMutation.isPending && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-blue-600" />
                <span className="text-blue-800 font-medium">Searching the internet for latest trends...</span>
              </div>
              <p className="text-blue-600 text-sm mt-1">
                This may take a moment as we fetch data from news sources, Reddit, and other platforms.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error loading trend data: {error.message}</p>
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
            <div className="text-sm text-muted-foreground mb-2">
              Found {trendResults.length} trend{trendResults.length !== 1 ? 's' : ''} for "{activeSearch}"
            </div>
            {trendResults.map((trend) => (
              <Card key={trend.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 mr-4">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        {trend.content_summary || 'Trend Analysis'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {trend.mention_count.toLocaleString()} mentions
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {trend.source_type}
                        </div>
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-1" />
                          {Math.round(trend.confidence_score * 100)}% confidence
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(trend.timestamp_original).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        trend.sentiment === 'positive' 
                          ? 'default' 
                          : trend.sentiment === 'negative' 
                          ? 'destructive' 
                          : 'secondary'
                      }
                      className="shrink-0"
                    >
                      {trend.sentiment}
                    </Badge>
                  </div>
                  
                  {trend.keywords && trend.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {trend.keywords.slice(0, 8).map((keyword, keywordIndex) => (
                        <Badge key={keywordIndex} variant="outline" className="text-xs">
                          {keyword.keyword}
                          {keyword.relevance_score < 1 && (
                            <span className="ml-1 opacity-60">
                              ({Math.round(keyword.relevance_score * 100)}%)
                            </span>
                          )}
                        </Badge>
                      ))}
                      {trend.keywords.length > 8 && (
                        <Badge variant="outline" className="text-xs opacity-60">
                          +{trend.keywords.length - 8} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${trend.confidence_score * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : activeSearch && !isLoading ? (
          <Card>
            <CardContent className="text-center py-8">
              <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">
                No trend data found for "{activeSearch}"
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Try searching for a different keyword or click "Analyze" to fetch fresh data from the internet
              </p>
              <Button 
                onClick={handleAnalyze} 
                disabled={isLoading}
                variant="outline"
              >
                <Search className="h-4 w-4 mr-2" />
                Search Internet for "{activeSearch}"
              </Button>
            </CardContent>
          </Card>
        ) : !activeSearch ? (
          <Card>
            <CardContent className="text-center py-8">
              <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">
                Enter a keyword above to start analyzing trends
              </p>
              <p className="text-sm text-muted-foreground">
                We'll search across news, social media, and other sources to find the latest trends
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default TrendAnalyzer;
