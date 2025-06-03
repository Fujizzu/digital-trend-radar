
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Activity, Heart, Clock } from 'lucide-react';

interface TrendEmptyStateProps {
  activeSearch: string;
  isLoading: boolean;
  onAnalyze: () => void;
  hasNoResults?: boolean;
}

const TrendEmptyState: React.FC<TrendEmptyStateProps> = ({
  activeSearch,
  isLoading,
  onAnalyze,
  hasNoResults = false
}) => {
  if (hasNoResults && activeSearch && !isLoading) {
    return (
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
            onClick={onAnalyze} 
            disabled={isLoading}
            variant="outline"
          >
            <Search className="h-4 w-4 mr-2" />
            Search Internet for "{activeSearch}"
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!activeSearch) {
    return (
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
    );
  }

  return null;
};

export default TrendEmptyState;
