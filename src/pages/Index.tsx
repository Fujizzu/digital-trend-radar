
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Eye, Users, BarChart3, AlertTriangle, Search, Bell } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Navigation from '@/components/Navigation';
import TrendAnalyzer from '@/components/TrendAnalyzer';
import BrandMonitor from '@/components/BrandMonitor';
import KeywordGenerator from '@/components/KeywordGenerator';
import CompetitorAnalysis from '@/components/CompetitorAnalysis';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for demonstration
  const trendData = [
    { time: '00:00', mentions: 45, sentiment: 0.7 },
    { time: '04:00', mentions: 52, sentiment: 0.8 },
    { time: '08:00', mentions: 78, sentiment: 0.6 },
    { time: '12:00', mentions: 95, sentiment: 0.4 },
    { time: '16:00', mentions: 120, sentiment: 0.5 },
    { time: '20:00', mentions: 89, sentiment: 0.8 },
  ];

  const emergingTrends = [
    { keyword: 'sustainable packaging', growth: '+245%', sentiment: 'positive', confidence: 89 },
    { keyword: 'AI customer service', growth: '+189%', sentiment: 'mixed', confidence: 76 },
    { keyword: 'remote work tools', growth: '+156%', sentiment: 'positive', confidence: 92 },
    { keyword: 'plant-based alternatives', growth: '+134%', sentiment: 'positive', confidence: 85 },
  ];

  const brandAlerts = [
    { brand: 'Your Brand', type: 'sentiment_drop', severity: 'medium', time: '2h ago' },
    { brand: 'Competitor A', type: 'viral_mention', severity: 'low', time: '4h ago' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent trendData={trendData} emergingTrends={emergingTrends} brandAlerts={brandAlerts} />;
      case 'trends':
        return <TrendAnalyzer />;
      case 'brands':
        return <BrandMonitor />;
      case 'keywords':
        return <KeywordGenerator />;
      case 'competitors':
        return <CompetitorAnalysis />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent trendData={trendData} emergingTrends={emergingTrends} brandAlerts={brandAlerts} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  MarkkinaPulssi
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search Trends
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

const DashboardContent = ({ trendData, emergingTrends, brandAlerts }: any) => (
  <div className="space-y-6">
    {/* Key Metrics Row */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-100">Active Trends</CardTitle>
          <div className="text-2xl font-bold">1,247</div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-blue-200">
            <TrendingUp className="inline h-3 w-3 mr-1" />
            +12% from yesterday
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-emerald-100">Brand Mentions</CardTitle>
          <div className="text-2xl font-bold">8,934</div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-emerald-200">
            <Eye className="inline h-3 w-3 mr-1" />
            +8% increase
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-100">Sentiment Score</CardTitle>
          <div className="text-2xl font-bold">7.8/10</div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-purple-200">
            <Users className="inline h-3 w-3 mr-1" />
            Positive trending
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-100">Opportunities</CardTitle>
          <div className="text-2xl font-bold">23</div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-orange-200">
            <BarChart3 className="inline h-3 w-3 mr-1" />
            5 high priority
          </p>
        </CardContent>
      </Card>
    </div>

    {/* Charts Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Real-time Trend Analysis</CardTitle>
          <CardDescription>
            Mentions and sentiment over the last 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="mentions" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment Trends</CardTitle>
          <CardDescription>
            Brand sentiment analysis across all monitored channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Line type="monotone" dataKey="sentiment" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>

    {/* Emerging Trends and Alerts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Emerging Trends</CardTitle>
          <CardDescription>
            AI-identified trending topics with growth potential
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emergingTrends.map((trend: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex-1">
                  <div className="font-medium">{trend.keyword}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={trend.sentiment === 'positive' ? 'default' : 'secondary'}>
                      {trend.sentiment}
                    </Badge>
                    <span className="text-sm text-slate-600">Confidence: {trend.confidence}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-emerald-600">{trend.growth}</div>
                  <div className="text-xs text-slate-500">24h growth</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand Alerts</CardTitle>
          <CardDescription>
            Real-time notifications about brand mentions and sentiment changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {brandAlerts.map((alert: any, index: number) => (
              <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                <AlertTriangle className={`h-5 w-5 ${alert.severity === 'medium' ? 'text-orange-500' : 'text-blue-500'}`} />
                <div className="flex-1">
                  <div className="font-medium">{alert.brand}</div>
                  <div className="text-sm text-slate-600">
                    {alert.type === 'sentiment_drop' ? 'Sentiment decrease detected' : 'Viral mention detected'}
                  </div>
                </div>
                <div className="text-xs text-slate-500">{alert.time}</div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4" variant="outline">
            View All Alerts
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
);

const SettingsContent = () => (
  <Card>
    <CardHeader>
      <CardTitle>Settings</CardTitle>
      <CardDescription>Configure your MarkkinaPulssi preferences and integrations</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">Account Settings</h3>
          <p className="text-sm text-slate-600">Manage your account preferences and subscription</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">API Integrations</h3>
          <p className="text-sm text-slate-600">Connect external platforms and data sources</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">Alert Preferences</h3>
          <p className="text-sm text-slate-600">Configure when and how you receive notifications</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default Index;
