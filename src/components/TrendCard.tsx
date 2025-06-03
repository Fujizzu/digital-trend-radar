
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Globe, Calendar, Heart, Zap } from 'lucide-react';
import type { TrendData } from '@/types/trend';

interface TrendCardProps {
  trend: TrendData;
}

const TrendCard: React.FC<TrendCardProps> = ({ trend }) => {
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
    <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
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
  );
};

export default TrendCard;
