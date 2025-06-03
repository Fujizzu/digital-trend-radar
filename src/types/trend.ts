
export interface EngagementMetrics {
  score?: number;
  emotions?: string[];
  points?: number;
  comments?: number;
  upvote_ratio?: number;
  shares?: number;
  likes?: number;
  reactions?: { [key: string]: number };
  reach?: number;
  impressions?: number;
}

export interface TrendKeyword {
  keyword: string;
  relevance_score: number;
}

export interface TrendData {
  id: string;
  content_summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence_score: number;
  mention_count: number;
  source_type: 'yle' | 'hs' | 'iltalehti' | 'is' | 'mtv' | 'suomi24' | 'vauva' | 'ylilauta' | 'murobbs' | 'facebook' | 'linkedin' | 'twitter' | 'kauppalehti' | 'tekniikka_talous';
  timestamp_original: string;
  engagement_metrics?: EngagementMetrics;
  keywords: TrendKeyword[];
  language?: 'fi' | 'sv' | 'en';
  region?: string;
  city?: string;
  prediction?: {
    forecast: number[];
    confidence: number;
    timeframe: string;
  };
}
