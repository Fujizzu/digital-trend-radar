
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Eye, Lightbulb, Search, Settings, Users } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'trends', label: 'Trend Analysis', icon: Search },
    { id: 'brands', label: 'Brand Monitor', icon: Eye },
    { id: 'keywords', label: 'Keyword Generator', icon: Lightbulb },
    { id: 'competitors', label: 'Competitor Analysis', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <Card className="h-fit">
      <CardContent className="p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
};

export default Navigation;
