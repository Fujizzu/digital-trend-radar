
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface SearchResult {
  title: string;
  content: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  engagement?: any;
}

async function searchNews(keyword: string): Promise<SearchResult[]> {
  const newsApiKey = Deno.env.get('NEWS_API_KEY');
  if (!newsApiKey) {
    console.log('News API key not found, skipping news search');
    return [];
  }

  try {
    const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&sortBy=relevancy&pageSize=10&language=en`, {
      headers: {
        'X-API-Key': newsApiKey,
      },
    });

    if (!response.ok) {
      console.error('News API error:', response.status, await response.text());
      return [];
    }

    const data = await response.json();
    
    return data.articles?.map((article: any) => ({
      title: article.title,
      content: article.description || article.content,
      url: article.url,
      source: 'news',
      publishedAt: article.publishedAt,
    })) || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

async function searchReddit(keyword: string): Promise<SearchResult[]> {
  try {
    // Using Reddit's JSON API (no auth required for public posts)
    const response = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=hot&limit=10`);
    
    if (!response.ok) {
      console.error('Reddit API error:', response.status);
      return [];
    }

    const data = await response.json();
    
    return data.data?.children?.map((post: any) => ({
      title: post.data.title,
      content: post.data.selftext || post.data.title,
      url: `https://reddit.com${post.data.permalink}`,
      source: 'reddit',
      publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
      engagement: {
        score: post.data.score,
        comments: post.data.num_comments,
      }
    })) || [];
  } catch (error) {
    console.error('Error fetching Reddit data:', error);
    return [];
  }
}

async function analyzeSentiment(text: string): Promise<'positive' | 'negative' | 'neutral'> {
  // Simple sentiment analysis based on keywords
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'awesome', 'love', 'best', 'fantastic', 'wonderful', 'outstanding'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointing', 'failed', 'problem', 'issue'];
  
  const lowercaseText = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowercaseText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowercaseText.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

async function extractKeywords(text: string): Promise<string[]> {
  // Simple keyword extraction
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['that', 'with', 'this', 'from', 'they', 'have', 'been', 'their', 'said', 'each', 'which', 'what', 'were', 'when', 'where', 'would', 'there', 'could', 'other'].includes(word));
  
  // Get word frequency
  const wordCount: { [key: string]: number } = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Return top 5 most frequent words
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keyword } = await req.json();
    
    if (!keyword) {
      return new Response(JSON.stringify({ error: 'Keyword is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Searching for keyword: ${keyword}`);

    // Perform searches across different platforms
    const [newsResults, redditResults] = await Promise.all([
      searchNews(keyword),
      searchReddit(keyword),
    ]);

    const allResults = [...newsResults, ...redditResults];
    console.log(`Found ${allResults.length} total results`);

    // Store raw data and process it
    const processedData = [];

    for (const result of allResults) {
      try {
        // Store raw data
        const { data: rawData, error: rawError } = await supabase
          .from('raw_data_ingestion')
          .insert({
            source_type: result.source as any,
            source_url: result.url,
            raw_content: result,
            metadata: { keyword, search_timestamp: new Date().toISOString() },
          })
          .select()
          .single();

        if (rawError) {
          console.error('Error storing raw data:', rawError);
          continue;
        }

        // Analyze sentiment and extract keywords
        const sentiment = await analyzeSentiment(result.content || result.title);
        const keywords = await extractKeywords(`${result.title} ${result.content || ''}`);
        
        // Store processed trend data
        const { data: trendData, error: trendError } = await supabase
          .from('trend_data')
          .insert({
            raw_data_id: rawData.id,
            content_summary: result.title,
            sentiment,
            confidence_score: 0.75, // Default confidence score
            mention_count: result.engagement?.score || 1,
            engagement_metrics: result.engagement || {},
            source_type: result.source as any,
            timestamp_original: result.publishedAt,
          })
          .select()
          .single();

        if (trendError) {
          console.error('Error storing trend data:', trendError);
          continue;
        }

        // Add keywords using the helper function
        if (keywords.length > 0) {
          const { error: keywordError } = await supabase.rpc('add_trend_keywords', {
            trend_id: trendData.id,
            keyword_list: [keyword, ...keywords],
            relevance_scores: [1.0, ...keywords.map(() => 0.5)],
          });

          if (keywordError) {
            console.error('Error adding keywords:', keywordError);
          }
        }

        processedData.push({
          id: trendData.id,
          content_summary: trendData.content_summary,
          sentiment: trendData.sentiment,
          confidence_score: trendData.confidence_score,
          mention_count: trendData.mention_count,
          source_type: trendData.source_type,
          timestamp_original: trendData.timestamp_original,
          keywords: [{ keyword, relevance_score: 1.0 }, ...keywords.map(kw => ({ keyword: kw, relevance_score: 0.5 }))],
        });

      } catch (error) {
        console.error('Error processing result:', error);
      }
    }

    console.log(`Successfully processed ${processedData.length} results`);

    return new Response(JSON.stringify({ 
      success: true, 
      results: processedData,
      total_found: allResults.length,
      total_processed: processedData.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in search-trends function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
