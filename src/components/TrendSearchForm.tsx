
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, RefreshCw } from 'lucide-react';

interface TrendSearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAnalyze: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  isSearching: boolean;
  activeSearch: string;
}

const TrendSearchForm: React.FC<TrendSearchFormProps> = ({
  searchQuery,
  setSearchQuery,
  onAnalyze,
  onRefresh,
  isLoading,
  isSearching,
  activeSearch
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onAnalyze();
    }
  };

  return (
    <div className="flex space-x-2">
      <Input
        placeholder="Enter keyword, brand, or topic to analyze..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1"
        disabled={isLoading}
      />
      <Button onClick={onAnalyze} disabled={isLoading || !searchQuery.trim()}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {isSearching ? 'Analyzing...' : 'Loading...'}
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
          onClick={onRefresh} 
          disabled={isLoading}
          title="Refresh existing data"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default TrendSearchForm;
