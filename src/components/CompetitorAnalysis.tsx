
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp, Share2, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CompetitorAnalysis = () => {
  const competitorData = [
    { name: 'Jan', yourBrand: 4000, competitorA: 2400, competitorB: 3200 },
    { name: 'Feb', yourBrand: 3000, competitorA: 1398, competitorB: 2800 },
    { name: 'Mar', yourBrand: 2000, competitorA: 9800, competitorB: 3900 },
    { name: 'Apr', yourBrand: 2780, competitorA: 3908, competitorB: 4800 },
    { name: 'May', yourBrand: 1890, competitorA: 4800, competitorB: 3800 },
    { name: 'Jun', yourBrand: 2390, competitorA: 3800, competitorB: 4300 },
  ];

  const competitors = [
    {
      name: 'Competitor A',
      shareOfVoice: 35,
      sentiment: 72,
      trendingTopics: ['AI innovation', 'sustainability', 'customer service'],
      strengths: ['Strong social presence', 'High engagement rates'],
      weaknesses: ['Limited content variety', 'Slow trend adoption']
    },
    {
      name: 'Competitor B',
      shareOfVoice: 28,
      sentiment: 68,
      trendingTopics: ['product launches', 'industry events', 'partnerships'],
      strengths: ['Consistent messaging', 'Good crisis management'],
      weaknesses: ['Lower sentiment scores', 'Limited influencer network']
    },
    {
      name: 'Your Brand',
      shareOfVoice: 42,
      sentiment: 78,
      trendingTopics: ['innovation', 'customer success', 'thought leadership'],
      strengths: ['High sentiment scores', 'Strong brand loyalty'],
      weaknesses: ['Could increase mention volume', 'Explore new platforms']
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Competitor Analysis Dashboard
          </CardTitle>
          <CardDescription>
            Compare your brand performance against key competitors across all channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={competitorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="yourBrand" fill="#3b82f6" name="Your Brand" />
              <Bar dataKey="competitorA" fill="#ef4444" name="Competitor A" />
              <Bar dataKey="competitorB" fill="#f59e0b" name="Competitor B" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {competitors.map((competitor, index) => (
          <Card key={index} className={`${competitor.name === 'Your Brand' ? 'ring-2 ring-blue-500' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center">
                  {competitor.name}
                  {competitor.name === 'Your Brand' && (
                    <Badge className="ml-2">Your Brand</Badge>
                  )}
                </CardTitle>
                <div className="text-right">
                  <div className="text-2xl font-bold">{competitor.shareOfVoice}%</div>
                  <div className="text-sm text-slate-600">Share of Voice</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Sentiment Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sentiment</span>
                    <span className="text-lg font-semibold">{competitor.sentiment}%</span>
                  </div>
                  <Progress value={competitor.sentiment} className="h-2" />
                </div>

                {/* Trending Topics */}
                <div className="space-y-2">
                  <span className="text-sm font-medium flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Trending Topics
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {competitor.trendingTopics.map((topic, topicIndex) => (
                      <Badge key={topicIndex} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                <div className="space-y-2">
                  <span className="text-sm font-medium flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    Strengths
                  </span>
                  <ul className="text-xs space-y-1">
                    {competitor.strengths.map((strength, strengthIndex) => (
                      <li key={strengthIndex} className="text-emerald-600">• {strength}</li>
                    ))}
                  </ul>
                </div>

                {/* Opportunities */}
                <div className="space-y-2">
                  <span className="text-sm font-medium flex items-center">
                    <Share2 className="h-4 w-4 mr-1" />
                    Opportunities
                  </span>
                  <ul className="text-xs space-y-1">
                    {competitor.weaknesses.map((weakness, weaknessIndex) => (
                      <li key={weaknessIndex} className="text-orange-600">• {weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompetitorAnalysis;
