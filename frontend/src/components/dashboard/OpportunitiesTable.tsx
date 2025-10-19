'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { ArbitrageOpportunity } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingUp, ExternalLink } from 'lucide-react';

interface OpportunitiesTableProps {
  onTradeClick: (opportunity: ArbitrageOpportunity) => void;
}

export function OpportunitiesTable({ onTradeClick }: OpportunitiesTableProps) {
  const { opportunities, subscribeToOpportunities, connected } = useSocket();
  const [localOpps, setLocalOpps] = useState<ArbitrageOpportunity[]>([]);
  const [flashingRows, setFlashingRows] = useState<Record<string, 'green' | 'red'>>({});

  useEffect(() => {
    if (connected) {
      subscribeToOpportunities();
    }
  }, [connected, subscribeToOpportunities]);

  useEffect(() => {
    // Detect changes and trigger flash animation
    if (opportunities.length > 0) {
      const newFlashing: Record<string, 'green' | 'red'> = {};
      
      opportunities.forEach((opp) => {
        const prevOpp = localOpps.find((o) => o.id === opp.id);
        if (prevOpp) {
          const prevSpread = parseFloat(prevOpp.spreadPercentage);
          const newSpread = parseFloat(opp.spreadPercentage);
          
          if (newSpread > prevSpread) {
            newFlashing[opp.id] = 'green';
          } else if (newSpread < prevSpread) {
            newFlashing[opp.id] = 'red';
          }
        }
      });

      setFlashingRows(newFlashing);
      setTimeout(() => setFlashingRows({}), 500);
      setLocalOpps(opportunities);
    }
  }, [opportunities]);

  if (!connected) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Connecting to server...</p>
      </div>
    );
  }

  if (localOpps.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No opportunities found. The scanner is running...</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Currency Pair</TableHead>
            <TableHead>Buy Exchange</TableHead>
            <TableHead>Sell Exchange</TableHead>
            <TableHead>Buy Price</TableHead>
            <TableHead>Sell Price</TableHead>
            <TableHead>Spread %</TableHead>
            <TableHead>Est. Profit</TableHead>
            <TableHead>Market Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localOpps.map((opp) => {
            const spread = parseFloat(opp.spreadPercentage);
            const flashClass = flashingRows[opp.id] === 'green' ? 'flash-green' : flashingRows[opp.id] === 'red' ? 'flash-red' : '';
            
            return (
              <TableRow key={opp.id} className={flashClass}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    {opp.tradingPair.symbol}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{opp.buyExchange.displayName}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(parseFloat(opp.buyPrice), 4)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{opp.sellExchange.displayName}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(parseFloat(opp.sellPrice), 4)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(parseFloat(opp.buyPrice), 4)}</TableCell>
                <TableCell>{formatCurrency(parseFloat(opp.sellPrice), 4)}</TableCell>
                <TableCell>
                  <Badge variant={spread > 0 ? 'success' : 'destructive'}>
                    {formatPercentage(spread)}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-green-500">
                  {formatCurrency(parseFloat(opp.profitAfterFees), 2)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{opp.marketType}</Badge>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => onTradeClick(opp)}
                    className="gap-2"
                  >
                    Trade Now
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
