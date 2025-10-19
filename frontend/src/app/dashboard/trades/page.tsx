'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import { Trade } from '@/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { format } from 'date-fns';

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const response = await apiService.getTrades();
      setTrades(response.data);
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'FAILED':
      case 'CANCELLED':
        return 'destructive';
      case 'PENDING':
      case 'BUY_PLACED':
      case 'SELL_PLACED':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Trade History</h2>
          <p className="text-muted-foreground">
            View all your executed trades and their status
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : trades.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No trades yet. Execute your first trade from the dashboard!
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Pair</TableHead>
                      <TableHead>Buy Exchange</TableHead>
                      <TableHead>Sell Exchange</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Spread</TableHead>
                      <TableHead>Net Profit</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>
                          {format(new Date(trade.executedAt), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                        <TableCell className="font-medium">
                          {trade.tradingPair}
                        </TableCell>
                        <TableCell>{trade.buyExchange}</TableCell>
                        <TableCell>{trade.sellExchange}</TableCell>
                        <TableCell>{formatCurrency(parseFloat(trade.amount), 2)}</TableCell>
                        <TableCell>
                          <Badge variant="success">
                            {formatPercentage(parseFloat(trade.spreadPercentage))}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-green-500">
                          {formatCurrency(parseFloat(trade.netProfit), 2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(trade.status) as any}>
                            {trade.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
