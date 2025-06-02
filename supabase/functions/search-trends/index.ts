
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
  author?: string;
  location?: string;
}

// Enhanced news search with better error handling
async function searchNews(keyword: string): Promise<SearchResult[]> {
  const newsApiKey = Deno.env.get('NEWS_API_KEY');
  if (!newsApiKey) {
    console.log('News API key not found, skipping news search');
    return [];
  }

  try {
    // Search everything endpoint for broader coverage
    const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&sortBy=publishedAt&pageSize=20&language=en&from=${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`, {
      headers: {
        'X-API-Key': newsApiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('News API error:', response.status, errorText);
      return [];
    }

    const data = await response.json();
    
    return data.articles?.filter((article: any) => 
      article.title && 
      article.description && 
      article.title !== '[Removed]' &&
      article.description !== '[Removed]'
    ).map((article: any) => ({
      title: article.title,
      content: article.description || article.content?.substring(0, 500) || '',
      url: article.url,
      source: 'news',
      publishedAt: article.publishedAt,
      author: article.author,
    })) || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

// Enhanced Reddit search with multiple subreddits and better filtering
async function searchReddit(keyword: string): Promise<SearchResult[]> {
  try {
    const results: SearchResult[] = [];
    
    // Search multiple subreddits for broader coverage
    const subreddits = ['all', 'technology', 'business', 'marketing', 'AskReddit', 'worldnews'];
    
    for (const subreddit of subreddits.slice(0, 3)) { // Limit to avoid rate limits
      try {
        const response = await fetch(`https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(keyword)}&sort=hot&limit=10&t=week`, {
          headers: {
            'User-Agent': 'TrendAnalyzer/1.0'
          }
        });
        
        if (!response.ok) {
          console.error(`Reddit API error for r/${subreddit}:`, response.status);
          continue;
        }

        const data = await response.json();
        
        const subredditResults = data.data?.children?.filter((post: any) => 
          post.data.title && 
          post.data.selftext !== '[removed]' &&
          post.data.title !== '[removed]' &&
          post.data.score > 5 // Filter for quality posts
        ).map((post: any) => ({
          title: post.data.title,
          content: post.data.selftext || post.data.title,
          url: `https://reddit.com${post.data.permalink}`,
          source: 'reddit',
          publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
          engagement: {
            score: post.data.score,
            comments: post.data.num_comments,
            upvote_ratio: post.data.upvote_ratio,
          },
          author: post.data.author,
        })) || [];
        
        results.push(...subredditResults);
      } catch (subError) {
        console.error(`Error fetching from r/${subreddit}:`, subError);
      }
    }
    
    return results.slice(0, 15); // Limit total Reddit results
  } catch (error) {
    console.error('Error fetching Reddit data:', error);
    return [];
  }
}

// Search Hacker News for tech trends
async function searchHackerNews(keyword: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(keyword)}&tags=story&hitsPerPage=10`);
    
    if (!response.ok) {
      console.error('Hacker News API error:', response.status);
      return [];
    }

    const data = await response.json();
    
    return data.hits?.filter((hit: any) => 
      hit.title && 
      hit.url &&
      hit.points > 10 // Filter for quality posts
    ).map((hit: any) => ({
      title: hit.title,
      content: hit.title, // HN doesn't have content descriptions
      url: hit.url,
      source: 'hackernews',
      publishedAt: new Date(hit.created_at).toISOString(),
      engagement: {
        points: hit.points,
        comments: hit.num_comments,
      },
      author: hit.author,
    })) || [];
  } catch (error) {
    console.error('Error fetching Hacker News data:', error);
    return [];
  }
}

// Enhanced sentiment analysis with emotion detection
async function analyzeSentiment(text: string): Promise<{ sentiment: 'positive' | 'negative' | 'neutral', confidence: number, emotions: string[] }> {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'awesome', 'love', 'best', 'fantastic', 'wonderful', 'outstanding', 'brilliant', 'perfect', 'impressive', 'remarkable', 'superb'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointing', 'failed', 'problem', 'issue', 'disaster', 'nightmare', 'frustrating', 'annoying', 'broken'];
  const emotionWords = {
    joy: ['happy', 'excited', 'thrilled', 'delighted', 'cheerful'],
    anger: ['angry', 'furious', 'mad', 'irritated', 'outraged'],
    fear: ['scared', 'afraid', 'worried', 'anxious', 'concerned'],
    surprise: ['surprised', 'shocked', 'amazed', 'astonished', 'unexpected'],
  };
  
  const lowercaseText = text.toLowerCase();
  const words = lowercaseText.split(/\s+/);
  
  const positiveCount = positiveWords.filter(word => lowercaseText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowercaseText.includes(word)).length;
  
  // Detect emotions
  const emotions: string[] = [];
  Object.entries(emotionWords).forEach(([emotion, emotionWordList]) => {
    if (emotionWordList.some(word => lowercaseText.includes(word))) {
      emotions.push(emotion);
    }
  });
  
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  let confidence = 0.5;
  
  if (positiveCount > negativeCount) {
    sentiment = 'positive';
    confidence = Math.min(0.9, 0.5 + (positiveCount - negativeCount) * 0.1);
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    confidence = Math.min(0.9, 0.5 + (negativeCount - positiveCount) * 0.1);
  }
  
  return { sentiment, confidence, emotions };
}

// Enhanced keyword extraction with relevance scoring
async function extractKeywords(text: string, originalKeyword: string): Promise<Array<{keyword: string, relevance: number}>> {
  const stopWords = ['that', 'with', 'this', 'from', 'they', 'have', 'been', 'their', 'said', 'each', 'which', 'what', 'were', 'when', 'where', 'would', 'there', 'could', 'other', 'will', 'more', 'than', 'only', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'man', 'men', 'oil', 'sit', 'use', 'way', 'who', 'you', 'and', 'are', 'but', 'not', 'for', 'the'];
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));
  
  // Get word frequency
  const wordCount: { [key: string]: number } = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Calculate relevance based on frequency and proximity to original keyword
  const keywordResults = Object.entries(wordCount)
    .map(([word, count]) => {
      let relevance = count / words.length;
      
      // Boost relevance if word is related to original keyword
      if (word.includes(originalKeyword.toLowerCase()) || originalKeyword.toLowerCase().includes(word)) {
        relevance *= 2;
      }
      
      return { keyword: word, relevance };
    })
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 10);
  
  return keywordResults;
}

// Store ingestion metrics for monitoring
async function storeIngestionMetrics(sourceType: string, processed: number, failed: number, duration: number, errors?: any[]) {
  try {
    await supabase.from('ingestion_metrics').insert({
      source_type: sourceType,
      records_processed: processed,
      records_failed: failed,
      processing_duration_ms: duration,
      error_details: errors || [],
    });
  } catch (error) {
    console.error('Failed to store ingestion metrics:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  let totalProcessed = 0;
  let totalFailed = 0;

  try {
    const { keyword } = await req.json();
    
    if (!keyword) {
      return new Response(JSON.stringify({ error: 'Keyword is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Starting comprehensive search for keyword: ${keyword}`);

    // Perform searches across multiple platforms
    const [newsResults, redditResults, hackerNewsResults] = await Promise.all([
      searchNews(keyword),
      searchReddit(keyword),
      searchHackerNews(keyword),
    ]);

    const allResults = [...newsResults, ...redditResults, ...hackerNewsResults];
    console.log(`Found ${allResults.length} total results across all platforms`);

    // Store and process results
    const processedData = [];
    const errors: any[] = [];

    for (const result of allResults) {
      try {
        // Store raw data
        const { data: rawData, error: rawError } = await supabase
          .from('raw_data_ingestion')
          .insert({
            source_type: result.source as any,
            source_url: result.url,
            raw_content: result,
            metadata: { 
              keyword, 
              search_timestamp: new Date().toISOString(),
              author: result.author,
              engagement: result.engagement 
            },
            processing_status: 'pending',
          })
          .select()
          .single();

        if (rawError) {
          console.error('Error storing raw data:', rawError);
          errors.push({ type: 'raw_storage', error: rawError.message, result: result.title });
          totalFailed++;
          continue;
        }

        // Enhanced analysis
        const sentimentAnalysis = await analyzeSentiment(result.content || result.title);
        const keywords = await extractKeywords(`${result.title} ${result.content || ''}`, keyword);
        
        // Store processed trend data
        const { data: trendData, error: trendError } = await supabase
          .from('trend_data')
          .insert({
            raw_data_id: rawData.id,
            content_summary: result.title,
            sentiment: sentimentAnalysis.sentiment,
            confidence_score: sentimentAnalysis.confidence,
            mention_count: result.engagement?.score || result.engagement?.points || 1,
            engagement_metrics: {
              ...result.engagement,
              emotions: sentimentAnalysis.emotions,
            },
            source_type: result.source as any,
            timestamp_original: result.publishedAt,
            location_data: result.location ? { location: result.location } : {},
          })
          .select()
          .single();

        if (trendError) {
          console.error('Error storing trend data:', trendError);
          errors.push({ type: 'trend_storage', error: trendError.message, result: result.title });
          totalFailed++;
          continue;
        }

        // Add keywords with relevance scores
        if (keywords.length > 0) {
          const allKeywords = [{ keyword, relevance: 1.0 }, ...keywords];
          const { error: keywordError } = await supabase.rpc('add_trend_keywords', {
            trend_id: trendData.id,
            keyword_list: allKeywords.map(k => k.keyword),
            relevance_scores: allKeywords.map(k => k.relevance),
          });

          if (keywordError) {
            console.error('Error adding keywords:', keywordError);
            errors.push({ type: 'keyword_storage', error: keywordError.message, result: result.title });
          }
        }

        // Update processing status
        await supabase
          .from('raw_data_ingestion')
          .update({ 
            processing_status: 'completed',
            processed_at: new Date().toISOString() 
          })
          .eq('id', rawData.id);

        processedData.push({
          id: trendData.id,
          content_summary: trendData.content_summary,
          sentiment: trendData.sentiment,
          confidence_score: trendData.confidence_score,
          mention_count: trendData.mention_count,
          source_type: trendData.source_type,
          timestamp_original: trendData.timestamp_original,
          keywords: allKeywords,
          emotions: sentimentAnalysis.emotions,
        });

        totalProcessed++;

      } catch (error) {
        console.error('Error processing result:', error);
        errors.push({ type: 'processing', error: error.message, result: result.title });
        totalFailed++;
      }
    }

    const processingTime = Date.now() - startTime;
    
    // Store metrics for each source type
    const sourceTypes = ['news', 'reddit', 'hackernews'];
    for (const sourceType of sourceTypes) {
      const sourceResults = allResults.filter(r => r.source === sourceType);
      const sourceProcessed = processedData.filter(p => p.source_type === sourceType).length;
      const sourceFailed = sourceResults.length - sourceProcessed;
      const sourceErrors = errors.filter(e => allResults.find(r => r.title === e.result && r.source === sourceType));
      
      if (sourceResults.length > 0) {
        await storeIngestionMetrics(sourceType, sourceProcessed, sourceFailed, processingTime, sourceErrors);
      }
    }

    console.log(`Successfully processed ${totalProcessed} results, ${totalFailed} failed, in ${processingTime}ms`);

    return new Response(JSON.stringify({ 
      success: true, 
      results: processedData,
      total_found: allResults.length,
      total_processed: totalProcessed,
      total_failed: totalFailed,
      processing_time_ms: processingTime,
      sources_searched: ['news', 'reddit', 'hackernews'],
      errors: errors.length > 0 ? errors : undefined,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    await storeIngestionMetrics('general', totalProcessed, totalFailed + 1, processingTime, [{ type: 'general', error: error.message }]);
    
    console.error('Error in search-trends function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message,
      total_processed: totalProcessed,
      total_failed: totalFailed + 1,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
