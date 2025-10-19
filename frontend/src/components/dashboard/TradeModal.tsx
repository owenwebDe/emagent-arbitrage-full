'use client';

import { useState } from 'react';
import { ArbitrageOpportunity } from '@/types';
import { Button } from '@/components/ui/button';
import { apiService } from '@/services/api';
import { toast } from 'react-toastify';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { X } from 'lucide-react';

interface TradeModalProps {
  opportunity: ArbitrageOpportunity | null;
  onClose: () => void;
}

export function TradeModal({ opportunity, onClose }: TradeModalProps) {
  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(false);

  if (!opportunity) return null;

  const handleTrade = async () => {
    setLoading(true);
    try {
      await apiService.executeTrade(opportunity.id, parseFloat(amount));
      toast.success('Trade executed successfully!');
      onClose();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Trade execution failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const estimatedProfit = (parseFloat(opportunity.profitAfterFees) * parseFloat(amount)) / 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4">Execute Trade</h2>

        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trading Pair:</span>
              <span className="font-medium">{opportunity.tradingPair.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Buy Exchange:</span>
              <span className="font-medium">{opportunity.buyExchange.displayName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sell Exchange:</span>
              <span className="font-medium">{opportunity.sellExchange.displayName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Spread:</span>
              <span className="font-medium text-green-500">
                {formatPercentage(parseFloat(opportunity.spreadPercentage))}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount (USDT)
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="100"
              min="1"
            />
          </div>

          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Buy Price:</span>
              <span>{formatCurrency(parseFloat(opportunity.buyPrice), 4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sell Price:</span>
              <span>{formatCurrency(parseFloat(opportunity.sellPrice), 4)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Estimated Profit:</span>
              <span className="text-green-500">{formatCurrency(estimatedProfit, 2)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleTrade} disabled={loading} className="flex-1">
              {loading ? 'Executing...' : 'Execute Trade'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
