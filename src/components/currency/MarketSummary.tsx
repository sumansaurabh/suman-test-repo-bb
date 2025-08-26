'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExchangeRate } from '@/types/currency';
import { formatRate, formatPercentage, getChangeColor, getChangeIcon, formatNumber } from '@/lib/currency-utils';

interface MarketSummaryProps {
  rates: ExchangeRate[];
  loading?: boolean;
  className?: string;
}

export function MarketSummary({ rates, loading = false, className = '' }: MarketSummaryProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (rates.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Market Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No market data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate market statistics
  const ratesWithChanges = rates.filter(rate => rate.changePercent24h !== undefined);
  const gainers = ratesWithChanges.filter(rate => rate.changePercent24h! > 0).length;
  const losers = ratesWithChanges.filter(rate => rate.changePercent24h! < 0).length;
  const unchanged = ratesWithChanges.filter(rate => rate.changePercent24h === 0).length;

  const topGainer = ratesWithChanges.reduce((max, rate) => 
    (rate.changePercent24h! > (max.changePercent24h || -Infinity)) ? rate : max
  , ratesWithChanges[0]);

  const topLoser = ratesWithChanges.reduce((min, rate) => 
    (rate.changePercent24h! < (min.changePercent24h || Infinity)) ? rate : min
  , ratesWithChanges[0]);

  const avgChange = ratesWithChanges.length > 0 
    ? ratesWithChanges.reduce((sum, rate) => sum + rate.changePercent24h!, 0) / ratesWithChanges.length
    : 0;

  const totalVolume = formatNumber(Math.random() * 1000000000, 0); // Demo volume
  const lastUpdate = rates[0]?.timestamp ? new Date(rates[0].timestamp) : new Date();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Market Summary</CardTitle>
        <div className="text-sm text-gray-500">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Market Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{gainers}</div>
            <div className="text-sm text-gray-500">Gainers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{losers}</div>
            <div className="text-sm text-gray-500">Losers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{unchanged}</div>
            <div className="text-sm text-gray-500">Unchanged</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{rates.length}</div>
            <div className="text-sm text-gray-500">Total Pairs</div>
          </div>
        </div>

        {/* Average Change */}
        <div className="text-center border-t pt-4">
          <div className="text-sm text-gray-500">Average Change (24h)</div>
          <div className={`text-xl font-bold ${getChangeColor(avgChange)}`}>
            {getChangeIcon(avgChange)} {formatPercentage(avgChange)}
          </div>
        </div>

        {/* Top Performers */}
        {topGainer && topLoser && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-semibold text-sm">Top Performers (24h)</h4>
            
            {/* Top Gainer */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-semibold text-green-800">Top Gainer</div>
                <div className="font-mono text-sm">{topGainer.base}/{topGainer.target}</div>
                <div className="text-sm text-gray-600">{formatRate(topGainer.rate)}</div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-600 text-white">
                  {getChangeIcon(topGainer.changePercent24h!)} {formatPercentage(topGainer.changePercent24h!)}
                </Badge>
              </div>
            </div>

            {/* Top Loser */}
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <div className="font-semibold text-red-800">Top Loser</div>
                <div className="font-mono text-sm">{topLoser.base}/{topLoser.target}</div>
                <div className="text-sm text-gray-600">{formatRate(topLoser.rate)}</div>
              </div>
              <div className="text-right">
                <Badge variant="destructive">
                  {getChangeIcon(topLoser.changePercent24h!)} {formatPercentage(topLoser.changePercent24h!)}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Market Info */}
        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div>
            <div className="text-sm text-gray-500">24h Volume</div>
            <div className="font-bold">$${totalVolume}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Active Markets</div>
            <div className="font-bold">{rates.length}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CurrencyOverviewProps {
  baseCurrency: string;
  rates: ExchangeRate[];
  className?: string;
}

export function CurrencyOverview({ baseCurrency, rates, className = '' }: CurrencyOverviewProps) {
  const ratesWithChanges = rates.filter(rate => rate.changePercent24h !== undefined);
  
  // Calculate base currency strength index (simplified)
  const avgChange = ratesWithChanges.length > 0 
    ? ratesWithChanges.reduce((sum, rate) => sum + rate.changePercent24h!, 0) / ratesWithChanges.length
    : 0;

  const strengthColor = avgChange > 1 ? 'text-green-600' : avgChange < -1 ? 'text-red-600' : 'text-yellow-600';
  const strengthLabel = avgChange > 1 ? 'Strong' : avgChange < -1 ? 'Weak' : 'Neutral';

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{baseCurrency} Overview</span>
          <Badge 
            variant={avgChange > 1 ? 'default' : avgChange < -1 ? 'destructive' : 'secondary'}
          >
            {strengthLabel}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Currency Strength */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Currency Strength</span>
              <span className={`font-bold ${strengthColor}`}>
                {formatPercentage(avgChange)} avg
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  avgChange > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(Math.abs(avgChange) * 10 + 50, 100)}%` }}
              />
            </div>
          </div>

          {/* Top Pairs by Volume */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Most Active Pairs</h4>
            <div className="space-y-2">
              {rates.slice(0, 5).map((rate, index) => (
                <div key={`${rate.base}-${rate.target}`} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">#{index + 1}</span>
                    <span className="font-mono">{rate.base}/{rate.target}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{formatRate(rate.rate)}</span>
                    {rate.changePercent24h !== undefined && (
                      <span className={`text-xs ${getChangeColor(rate.changePercent24h)}`}>
                        {formatPercentage(rate.changePercent24h)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}