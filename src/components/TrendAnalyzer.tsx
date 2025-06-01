
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Users, Calendar, Globe } from 'lucide-react';

interface TrendData {
  keyword: string;
  volume: number;
  growth: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  platforms: string[];
  confidence: number;
}

const TrendAnalyzer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock trend data
  const trendResults: TrendData[] = [
    {
      keyword: 'sustainable technology',
      volume: 15600,
      growth: '+324%',
      sentiment: 'positive',
      platforms: ['Twitter', 'LinkedIn', 'Reddit'],
      confidence: 94
    },
    {
      keyword: 'remote collaboration tools',
      volume: 12300,
      growth: '+186%',
      sentiment: 'positive',
      platforms: ['Twitter', 'YouTube', 'News'],
      confidence: 87
    },
    {
      keyword: 'AI ethics discussion',
      volume: 8900,
      growth: '+145%',
      sentiment: 'neutral',
      platforms: ['LinkedIn', 'News', 'Reddit'],
      confidence: 79
    }
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
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
              className="flex-1"
            />
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {trendResults.map((trend, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{trend.keyword}</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {trend.volume.toLocaleString()} mentions
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {trend.growth} growth
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      Confidence: {trend.confidence}%
                    </div>
                  </div>
                </div>
                <Badge variant={trend.sentiment === 'positive' ? 'default' : trend.sentiment === 'negative' ? 'destructive' : 'secondary'}>
                  {trend.sentiment}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {trend.platforms.map((platform, platformIndex) => (
                  <Badge key={platformIndex} variant="outline">
                    {platform}
                  </Badge>
                ))}
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${trend.confidence}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrendAnalyzer;
