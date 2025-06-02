
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Users, Calendar, Globe, Loader2 } from 'lucide-react';
import { useTrendData } from '@/hooks/useTrendData';

const TrendAnalyzer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  
  const { data: trendResults, isLoading, error } = useTrendData(activeSearch);

  const handleAnalyze = () => {
    setActiveSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

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
            />
            <Button onClick={handleAnalyze} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error loading trend data: {error.message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {trendResults && trendResults.length > 0 ? (
          trendResults.map((trend) => (
            <Card key={trend.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {trend.content_summary || 'Trend Analysis'}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
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
                        Confidence: {Math.round(trend.confidence_score * 100)}%
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
                  >
                    {trend.sentiment}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {trend.keywords.map((keyword, keywordIndex) => (
                    <Badge key={keywordIndex} variant="outline">
                      {keyword.keyword}
                      {keyword.relevance_score < 1 && (
                        <span className="ml-1 text-xs opacity-60">
                          ({Math.round(keyword.relevance_score * 100)}%)
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${trend.confidence_score * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : activeSearch && !isLoading ? (
          <Card>
            <CardContent className="text-center py-8">
              <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">
                No trend data found for "{activeSearch}"
              </p>
              <p className="text-sm text-muted-foreground">
                Try searching for a different keyword or topic
              </p>
            </CardContent>
          </Card>
        ) : !activeSearch ? (
          <Card>
            <CardContent className="text-center py-8">
              <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">
                Enter a keyword above to start analyzing trends
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default TrendAnalyzer;
