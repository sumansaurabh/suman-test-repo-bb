'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExchangeRate } from '@/types/currency';
import { formatRate, formatPercentage, getChangeColor, getChangeIcon } from '@/lib/currency-utils';

interface ExchangeRateCardProps {
  rate: ExchangeRate;
  showChange?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ExchangeRateCard({ 
  rate, 
  showChange = true, 
  className = '', 
  onClick 
}: ExchangeRateCardProps) {
  const hasChange = rate.changePercent24h !== undefined;
  const changeColor = hasChange ? getChangeColor(rate.changePercent24h!) : 'text-gray-600';
  const changeIcon = hasChange ? getChangeIcon(rate.changePercent24h!) : '→';
  const isPositive = rate.changePercent24h && rate.changePercent24h > 0;
  const isNegative = rate.changePercent24h && rate.changePercent24h < 0;

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-md ${onClick ? 'cursor-pointer hover:border-gray-300' : ''} ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {rate.base}
            </span>
            <span className="text-gray-400">→</span>
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {rate.target}
            </span>
          </div>
          {showChange && hasChange && (
            <Badge 
              variant={isPositive ? "default" : isNegative ? "destructive" : "secondary"}
              className="text-xs"
            >
              {changeIcon} {formatPercentage(rate.changePercent24h!)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          {/* Main Rate */}
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono">
              {formatRate(rate.rate)}
            </div>
            <div className="text-sm text-gray-500">
              1 {rate.base} = {formatRate(rate.rate)} {rate.target}
            </div>
          </div>
          
          {/* Change Information */}
          {showChange && hasChange && (
            <div className="flex items-center justify-between text-sm">
              <span className={`font-medium ${changeColor}`}>
                {rate.change24h !== undefined && (
                  <span>
                    {rate.change24h > 0 ? '+' : ''}{formatRate(rate.change24h, 4)}
                  </span>
                )}
              </span>
              <span className="text-gray-500">
                24h change
              </span>
            </div>
          )}
          
          {/* Last Updated */}
          <div className="text-xs text-gray-400 pt-1 border-t">
            Updated: {new Date(rate.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ExchangeRateGridProps {
  rates: ExchangeRate[];
  loading?: boolean;
  onRateClick?: (rate: ExchangeRate) => void;
  className?: string;
}

export function ExchangeRateGrid({ 
  rates, 
  loading = false, 
  onRateClick,
  className = ''
}: ExchangeRateGridProps) {
  if (loading) {
    return (
      <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (rates.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <p>No exchange rates available</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {rates.map((rate, index) => (
        <ExchangeRateCard
          key={`${rate.base}-${rate.target}-${index}`}
          rate={rate}
          onClick={onRateClick ? () => onRateClick(rate) : undefined}
          className=""
        />
      ))}
    </div>
  );
}

interface CompactExchangeRateProps {
  rate: ExchangeRate;
  className?: string;
}

export function CompactExchangeRate({ rate, className = '' }: CompactExchangeRateProps) {
  const hasChange = rate.changePercent24h !== undefined;
  const changeColor = hasChange ? getChangeColor(rate.changePercent24h!) : 'text-gray-600';
  const changeIcon = hasChange ? getChangeIcon(rate.changePercent24h!) : '';

  return (
    <div className={`flex items-center justify-between p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors ${className}`}>
      <div className="flex items-center gap-3">
        <div className="font-mono text-sm font-medium">
          {rate.base}/{rate.target}
        </div>
        <div className="text-lg font-bold font-mono">
          {formatRate(rate.rate)}
        </div>
      </div>
      
      {hasChange && (
        <div className={`text-sm font-medium ${changeColor} flex items-center gap-1`}>
          <span>{changeIcon}</span>
          <span>{formatPercentage(rate.changePercent24h!)}</span>
        </div>
      )}
    </div>
  );
}