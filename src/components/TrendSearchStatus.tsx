
import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface TrendSearchStatusProps {
  isSearching: boolean;
  searchError: any;
}

const TrendSearchStatus: React.FC<TrendSearchStatusProps> = ({
  isSearching,
  searchError
}) => {
  if (isSearching) {
    return (
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
    );
  }

  if (searchError) {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
          <span className="text-red-800 font-medium">Search Error</span>
        </div>
        <p className="text-red-600 text-sm mt-1">
          {searchError?.message || 'Failed to search for trends. Please try again.'}
        </p>
      </div>
    );
  }

  return null;
};

export default TrendSearchStatus;
