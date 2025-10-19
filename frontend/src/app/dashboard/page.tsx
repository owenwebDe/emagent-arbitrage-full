'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { OpportunitiesTable } from '@/components/dashboard/OpportunitiesTable';
import { TradeModal } from '@/components/dashboard/TradeModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArbitrageOpportunity } from '@/types';
import { apiService } from '@/services/api';
import { useSocket } from '@/contexts/SocketContext';
import { TrendingUp, DollarSign, Activity, Zap } from 'lucide-react';

export default function DashboardPage() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<ArbitrageOpportunity | null>(null);
  const [stats, setStats] = useState<any>(null);
  const { opportunities, connected } = useSocket();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiService.getSummary();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const activeOpps = opportunities.filter((opp) => opp.isActive);
  const avgSpread = activeOpps.length > 0
    ? activeOpps.reduce((sum, opp) => sum + parseFloat(opp.spreadPercentage), 0) / activeOpps.length
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time arbitrage opportunities across multiple exchanges
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Opportunities
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOpps.length}</div>
              <p className="text-xs text-muted-foreground">
                Currently profitable
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Spread
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgSpread.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">
                Across all pairs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Connection Status
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {connected ? (
                  <span className="text-green-500">Live</span>
                ) : (
                  <span className="text-red-500">Offline</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                WebSocket connection
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Best Spread
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeOpps.length > 0
                  ? Math.max(...activeOpps.map((o) => parseFloat(o.spreadPercentage))).toFixed(2)
                  : '0.00'}%
              </div>
              <p className="text-xs text-muted-foreground">
                Highest opportunity
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Opportunities Table */}
        <Card>
          <CardHeader>
            <CardTitle>Live Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <OpportunitiesTable onTradeClick={setSelectedOpportunity} />
          </CardContent>
        </Card>

        {/* Trade Modal */}
        <TradeModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
        />
      </div>
    </DashboardLayout>
  );
}
