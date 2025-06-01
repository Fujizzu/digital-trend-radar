
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, TrendingUp, TrendingDown, AlertCircle, Plus } from 'lucide-react';

interface BrandData {
  name: string;
  mentions: number;
  sentiment: number;
  change: number;
  alerts: number;
  platforms: { name: string; mentions: number }[];
}

const BrandMonitor = () => {
  const [newBrand, setNewBrand] = useState('');
  
  const monitoredBrands: BrandData[] = [
    {
      name: 'Your Brand',
      mentions: 1247,
      sentiment: 78,
      change: 12,
      alerts: 2,
      platforms: [
        { name: 'Twitter', mentions: 567 },
        { name: 'Instagram', mentions: 340 },
        { name: 'LinkedIn', mentions: 240 },
        { name: 'News', mentions: 100 }
      ]
    },
    {
      name: 'Competitor A',
      mentions: 892,
      sentiment: 65,
      change: -5,
      alerts: 0,
      platforms: [
        { name: 'Twitter', mentions: 445 },
        { name: 'Instagram', mentions: 267 },
        { name: 'LinkedIn', mentions: 180 }
      ]
    },
    {
      name: 'Competitor B',
      mentions: 634,
      sentiment: 72,
      change: 8,
      alerts: 1,
      platforms: [
        { name: 'Twitter', mentions: 289 },
        { name: 'Instagram', mentions: 201 },
        { name: 'LinkedIn', mentions: 144 }
      ]
    }
  ];

  const addBrand = () => {
    if (newBrand.trim()) {
      // In a real app, this would make an API call
      console.log('Adding brand to monitor:', newBrand);
      setNewBrand('');
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
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Add brand or competitor to monitor..."
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addBrand}>
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {monitoredBrands.map((brand, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{brand.name}</CardTitle>
                  <CardDescription>
                    {brand.mentions.toLocaleString()} mentions in the last 24 hours
                  </CardDescription>
                </div>
                {brand.alerts > 0 && (
                  <Badge variant="destructive" className="flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {brand.alerts} alert{brand.alerts > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sentiment Score */}
                <div className={`p-4 rounded-lg ${getSentimentBg(brand.sentiment)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Sentiment Score</span>
                    <span className={`text-2xl font-bold ${getSentimentColor(brand.sentiment)}`}>
                      {brand.sentiment}%
                    </span>
                  </div>
                  <Progress value={brand.sentiment} className="h-2" />
                </div>

                {/* Mention Change */}
                <div className="p-4 rounded-lg bg-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">24h Change</span>
                    <div className="flex items-center">
                      {brand.change > 0 ? (
                        <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span className={`font-bold ${brand.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {brand.change > 0 ? '+' : ''}{brand.change}%
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600">
                    Volume increase/decrease
                  </div>
                </div>

                {/* Platform Breakdown */}
                <div className="p-4 rounded-lg bg-blue-50">
                  <div className="text-sm font-medium mb-3">Platform Breakdown</div>
                  <div className="space-y-2">
                    {brand.platforms.map((platform, platformIndex) => (
                      <div key={platformIndex} className="flex justify-between items-center">
                        <span className="text-sm">{platform.name}</span>
                        <span className="text-sm font-medium">{platform.mentions}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BrandMonitor;
