'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService } from '@/services/api';
import { BarChart3, TrendingUp, DollarSign, Percent } from 'lucide-react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [summaryRes, statsRes] = await Promise.all([
        apiService.getSummary(),
        apiService.getStatistics('day'),
      ]);
      setStats({
        summary: summaryRes.data,
        statistics: statsRes.data,
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Detailed insights and performance metrics
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Opportunities
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.statistics?.totalOpportunities || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Spread
              </CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats?.statistics?.avgSpread || 0).toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Average across all opportunities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Profit
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(stats?.statistics?.avgProfit || 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Per opportunity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Top Pairs
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.statistics?.topPairs?.[0]?.symbol || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Most profitable
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Top Pairs */}
        <Card>
          <CardHeader>
            <CardTitle>Top Trading Pairs</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.statistics?.topPairs?.length > 0 ? (
              <div className="space-y-4">
                {stats.statistics.topPairs.map((pair: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{pair.symbol}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {pair.count} opportunities
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No data available yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top Exchanges */}
        <Card>
          <CardHeader>
            <CardTitle>Top Exchanges</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.statistics?.topExchanges?.length > 0 ? (
              <div className="space-y-4">
                {stats.statistics.topExchanges.map((exchange: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{exchange.name}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {exchange.count} opportunities
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No data available yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
