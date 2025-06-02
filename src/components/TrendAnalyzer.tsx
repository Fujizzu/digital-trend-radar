
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Users, Calendar, Globe, Loader2, RefreshCw, AlertCircle, Activity, Heart, Zap, Clock } from 'lucide-react';
import { useTrendData } from '@/hooks/useTrendData';
import { useTrendSearch } from '@/hooks/useTrendSearch';

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const isLoading = isLoadingData || searchMutation.isPending;

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'news': return '📰';
      case 'reddit': return '🔴';
      case 'hackernews': return '🟠';
      default: return '🌐';
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'joy': return '😊';
      case 'anger': return '😠';
      case 'fear': return '😰';
      case 'surprise': return '😮';
      default: return '🤔';
    }
  };

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
                  {searchMutation.isPending ? 'Analyzing...' : 'Loading...'}
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
                <span className="text-blue-800 font-medium">Searching across multiple platforms...</span>
              </div>
              <p className="text-blue-600 text-sm mt-1">
                Analyzing data from news sources, Reddit, Hacker News with AI-powered sentiment analysis and keyword extraction.
              </p>
              <div className="flex space-x-4 mt-2 text-xs text-blue-500">
                <span>📰 News Articles</span>
                <span>🔴 Reddit Discussions</span>
                <span>🟠 Hacker News</span>
              </div>
            </div>
          )}

          {searchMutation.isError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                <span className="text-red-800 font-medium">Search Error</span>
              </div>
              <p className="text-red-600 text-sm mt-1">
                {searchMutation.error?.message || 'Failed to search for trends. Please try again.'}
              </p>
            </div>
          )}
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
              <Card key={trend.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 mr-4">
                      <div className="flex items-center mb-2">
                        <span className="text-lg mr-2">{getSourceIcon(trend.source_type)}</span>
                        <h3 className="text-lg font-semibold line-clamp-2">
                          {trend.content_summary || 'Trend Analysis'}
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
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

                      {/* Emotion indicators */}
                      {trend.engagement_metrics?.emotions && trend.engagement_metrics.emotions.length > 0 && (
                        <div className="flex items-center space-x-2 mb-3">
                          <Heart className="h-4 w-4 text-pink-500" />
                          <span className="text-sm text-muted-foreground mr-2">Emotions:</span>
                          {trend.engagement_metrics.emotions.map((emotion: string, index: number) => (
                            <span key={index} className="text-sm">
                              {getEmotionIcon(emotion)} {emotion}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
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
                        {trend.sentiment === 'positive' ? '😊' : trend.sentiment === 'negative' ? '😞' : '😐'} {trend.sentiment}
                      </Badge>
                      {trend.engagement_metrics?.score && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Zap className="h-3 w-3 mr-1" />
                          {trend.engagement_metrics.score} score
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {trend.keywords && trend.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {trend.keywords.slice(0, 10).map((keyword, keywordIndex) => (
                        <Badge key={keywordIndex} variant="outline" className="text-xs">
                          {keyword.keyword}
                          {keyword.relevance_score < 1 && (
                            <span className="ml-1 opacity-60">
                              ({Math.round(keyword.relevance_score * 100)}%)
                            </span>
                          )}
                        </Badge>
                      ))}
                      {trend.keywords.length > 10 && (
                        <Badge variant="outline" className="text-xs opacity-60">
                          +{trend.keywords.length - 10} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        trend.sentiment === 'positive' ? 'bg-green-500' :
                        trend.sentiment === 'negative' ? 'bg-red-500' : 'bg-blue-500'
                      }`}
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
              <p className="text-muted-foreground mb-2">
                No trend data found for "{activeSearch}"
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Try searching for a different keyword or click "Analyze" to fetch fresh data from multiple sources
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
              <p className="text-muted-foreground mb-2">
                Enter a keyword above to start analyzing trends
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Our AI will search across news, social media, and forums to find the latest trends and insights
              </p>
              <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Real-time data
                </span>
                <span className="flex items-center">
                  <Activity className="h-3 w-3 mr-1" />
                  AI analysis
                </span>
                <span className="flex items-center">
                  <Heart className="h-3 w-3 mr-1" />
                  Emotion detection
                </span>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default TrendAnalyzer;
