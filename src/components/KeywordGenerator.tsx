
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, Search, Copy, Star } from 'lucide-react';

interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  trend: 'Rising' | 'Stable' | 'Declining';
  intent: 'Commercial' | 'Informational' | 'Navigational';
}

interface ContentIdea {
  title: string;
  type: 'Blog Post' | 'Social Media' | 'Video' | 'Infographic';
  description: string;
  targetKeywords: string[];
}

const KeywordGenerator = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const keywordSuggestions: KeywordSuggestion[] = [
    {
      keyword: 'sustainable marketing strategies',
      volume: 8900,
      difficulty: 'Medium',
      trend: 'Rising',
      intent: 'Informational'
    },
    {
      keyword: 'eco-friendly brand positioning',
      volume: 5400,
      difficulty: 'Easy',
      trend: 'Rising',
      intent: 'Commercial'
    },
    {
      keyword: 'green consumer behavior trends',
      volume: 3200,
      difficulty: 'Hard',
      trend: 'Stable',
      intent: 'Informational'
    },
    {
      keyword: 'sustainable packaging solutions',
      volume: 12000,
      difficulty: 'Medium',
      trend: 'Rising',
      intent: 'Commercial'
    }
  ];

  const contentIdeas: ContentIdea[] = [
    {
      title: 'The Ultimate Guide to Sustainable Marketing in 2024',
      type: 'Blog Post',
      description: 'Comprehensive guide covering eco-friendly marketing strategies and consumer trends.',
      targetKeywords: ['sustainable marketing', 'eco-friendly branding', 'green marketing trends']
    },
    {
      title: '5 Brands Leading the Sustainability Revolution',
      type: 'Social Media',
      description: 'Showcase successful sustainable brands and their marketing approaches.',
      targetKeywords: ['sustainable brands', 'eco-friendly companies', 'green business']
    },
    {
      title: 'Consumer Psychology: Why Sustainability Sells',
      type: 'Video',
      description: 'Video content exploring the psychological drivers behind sustainable purchasing decisions.',
      targetKeywords: ['sustainable consumer behavior', 'green psychology', 'eco purchasing']
    }
  ];

  const generateKeywords = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-100 text-emerald-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'Rising': return 'bg-emerald-100 text-emerald-800';
      case 'Stable': return 'bg-blue-100 text-blue-800';
      case 'Declining': return 'bg-orange-100 text-orange-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            AI Keyword & Content Generator
          </CardTitle>
          <CardDescription>
            Generate trending keywords and content ideas based on market intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter your niche, product, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={generateKeywords} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Ideas'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="keywords" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="keywords">Keyword Suggestions</TabsTrigger>
          <TabsTrigger value="content">Content Ideas</TabsTrigger>
        </TabsList>

        <TabsContent value="keywords" className="space-y-4">
          {keywordSuggestions.map((keyword, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{keyword.keyword}</h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center">
                        <Search className="h-4 w-4 mr-1" />
                        {keyword.volume.toLocaleString()} searches/month
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge className={getDifficultyColor(keyword.difficulty)}>
                    {keyword.difficulty} Difficulty
                  </Badge>
                  <Badge className={getTrendColor(keyword.trend)}>
                    {keyword.trend}
                  </Badge>
                  <Badge variant="outline">
                    {keyword.intent}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          {contentIdeas.map((idea, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold mr-3">{idea.title}</h3>
                      <Badge variant="secondary">{idea.type}</Badge>
                    </div>
                    <p className="text-slate-600 mb-3">{idea.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Star className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-slate-700 mb-2 block">Target Keywords:</span>
                  <div className="flex flex-wrap gap-2">
                    {idea.targetKeywords.map((kw, kwIndex) => (
                      <Badge key={kwIndex} variant="outline">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KeywordGenerator;
