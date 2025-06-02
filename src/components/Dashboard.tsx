
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, AlertTriangle, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useBrandMonitoring } from '@/hooks/useBrandMonitoring';
import { useTrendData } from '@/hooks/useTrendData';

const Dashboard = () => {
  const { data: userProfile } = useUserProfile();
  const { data: brandMonitoring } = useBrandMonitoring();
  const { data: trendData } = useTrendData();

  // Mock data for charts - in a real app, this would come from your analytics
  const weeklyTrends = [
    { name: 'Mon', mentions: 240, sentiment: 78 },
    { name: 'Tue', mentions: 180, sentiment: 65 },
    { name: 'Wed', mentions: 320, sentiment: 82 },
    { name: 'Thu', mentions: 290, sentiment: 75 },
    { name: 'Fri', mentions: 410, sentiment: 88 },
    { name: 'Sat', mentions: 180, sentiment: 70 },
    { name: 'Sun', mentions: 120, sentiment: 72 },
  ];

  const sentimentData = [
    { name: 'Positive', value: 65, color: '#10b981' },
    { name: 'Neutral', value: 25, color: '#6b7280' },
    { name: 'Negative', value: 10, color: '#ef4444' },
  ];

  const totalMentions = trendData?.reduce((sum, trend) => sum + trend.mention_count, 0) || 0;
  const avgSentiment = trendData?.reduce((sum, trend) => sum + (trend.confidence_score * 100), 0) / (trendData?.length || 1) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back{userProfile?.company_name ? `, ${userProfile.company_name}` : ''}! Here's your brand intelligence overview.
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {userProfile?.subscription_tier || 'basic'} plan
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mentions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMentions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-600">+12%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sentiment</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgSentiment)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-600">+5%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitored Brands</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brandMonitoring?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active monitoring
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Quota</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProfile?.api_quota_remaining || 0}</div>
            <p className="text-xs text-muted-foreground">
              Requests remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Trend Analysis</CardTitle>
            <CardDescription>
              Mentions and sentiment over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="mentions" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Mentions"
                />
                <Line 
                  type="monotone" 
                  dataKey="sentiment" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Sentiment %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
            <CardDescription>
              Overall sentiment breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Brand Mentions</CardTitle>
          <CardDescription>
            Latest mentions across all monitored brands
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trendData && trendData.length > 0 ? (
            <div className="space-y-4">
              {trendData.slice(0, 5).map((trend) => (
                <div key={trend.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">
                      {trend.content_summary || 'No summary available'}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{trend.source_type}</span>
                      <span>•</span>
                      <span>{new Date(trend.timestamp_original).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{trend.mention_count} mentions</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {trend.keywords.slice(0, 3).map((kw, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {kw.keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge 
                    variant={trend.sentiment === 'positive' ? 'default' : trend.sentiment === 'negative' ? 'destructive' : 'secondary'}
                  >
                    {trend.sentiment}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>No trend data available yet</p>
              <p className="text-sm">Start monitoring brands to see mentions here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
