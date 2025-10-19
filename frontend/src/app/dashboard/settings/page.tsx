'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiService } from '@/services/api';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    minSpreadPercentage: 0.5,
    minProfit: 10,
    exchangeFilter: [] as string[],
    pairFilter: [] as string[],
    marketTypeFilter: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const response = await apiService.getUserFilters();
      if (response.data) {
        setFilters(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch filters:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiService.updateUserFilters(filters);
      toast.success('Settings saved successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save settings';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Configure your preferences and filters
          </p>
        </div>

        {/* User Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Username</label>
                <p className="text-sm text-muted-foreground">{user?.username}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Opportunity Filters</CardTitle>
            <CardDescription>
              Set minimum thresholds for opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="minSpread" className="text-sm font-medium">
                Minimum Spread Percentage (%)
              </label>
              <input
                id="minSpread"
                type="number"
                step="0.1"
                value={filters.minSpreadPercentage}
                onChange={(e) =>
                  setFilters({ ...filters, minSpreadPercentage: parseFloat(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="minProfit" className="text-sm font-medium">
                Minimum Profit (USDT)
              </label>
              <input
                id="minProfit"
                type="number"
                value={filters.minProfit || ''}
                onChange={(e) =>
                  setFilters({ ...filters, minProfit: parseFloat(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Keys Management */}
        <Card>
          <CardHeader>
            <CardTitle>Exchange API Keys</CardTitle>
            <CardDescription>
              Manage your exchange API keys for automated trading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              API key management coming soon. You'll be able to add and manage your exchange API keys here.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
