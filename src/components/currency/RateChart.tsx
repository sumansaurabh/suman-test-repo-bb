'use client';

import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartData, TimeRange, ChartType } from '@/types/currency';
import { formatRate, formatDateForDisplay } from '@/lib/currency-utils';

interface RateChartProps {
  data: ChartData[];
  baseCurrency: string;
  targetCurrency: string;
  timeRange: TimeRange;
  chartType?: ChartType;
  loading?: boolean;
  error?: string | null;
  onTimeRangeChange?: (range: TimeRange) => void;
  onChartTypeChange?: (type: ChartType) => void;
  className?: string;
}

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '1D', label: '1D' },
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' }
];

const CHART_TYPE_OPTIONS: { value: ChartType; label: string }[] = [
  { value: 'line', label: 'Line' },
  { value: 'area', label: 'Area' }
];

export function RateChart({
  data,
  baseCurrency,
  targetCurrency,
  timeRange,
  chartType = 'line',
  loading = false,
  error = null,
  onTimeRangeChange,
  onChartTypeChange,
  className = ''
}: RateChartProps) {
  const pairName = `${baseCurrency}/${targetCurrency}`;
  
  // Calculate price change
  const currentRate = data.length > 0 ? data[data.length - 1].rate : 0;
  const previousRate = data.length > 0 ? data[0].rate : 0;
  const priceChange = currentRate - previousRate;
  const priceChangePercent = previousRate !== 0 ? (priceChange / previousRate) * 100 : 0;
  
  const isPositive = priceChange >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const chartColor = isPositive ? '#16a34a' : '#dc2626';

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: { value: number }[], label?: string }) => {
    if (active && payload && payload.length) {
      const rate = payload[0].value;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{pairName}</p>
          <p className="text-sm text-gray-600">
            {label ? formatDateForDisplay(label) : ''}
          </p>
          <p className="text-lg font-mono font-semibold">
            {formatRate(rate)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="flex gap-2">
              {TIME_RANGE_OPTIONS.map((option) => (
                <div key={option.value} className="h-8 w-10 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{pairName} Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-80 text-center">
            <div className="text-red-600 mb-4">
              <div className="text-4xl mb-2">📊</div>
              <p className="font-medium">Chart Error</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{pairName} Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-80 text-center text-gray-500">
            <div className="text-4xl mb-2">📈</div>
            <p>No chart data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col gap-4">
          {/* Title and Current Price */}
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">{pairName}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-mono font-bold">
                  {formatRate(currentRate)}
                </span>
                <Badge variant={isPositive ? "default" : "destructive"}>
                  <span className={changeColor}>
                    {isPositive ? '+' : ''}{formatRate(priceChange, 4)} ({priceChangePercent > 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
                  </span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Time Range Selector */}
            <div className="flex gap-1">
              {TIME_RANGE_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={timeRange === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onTimeRangeChange?.(option.value)}
                  className="px-3 py-1"
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {/* Chart Type Selector */}
            <div className="flex gap-1">
              {CHART_TYPE_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={chartType === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onChartTypeChange?.(option.value)}
                  className="px-3 py-1"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    if (timeRange === '1D') {
                      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    }
                    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis
                  domain={['dataMin - 0.001', 'dataMax + 0.001']}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatRate(value, 4)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke={chartColor}
                  fill={chartColor}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <ReferenceLine y={previousRate} stroke="#999" strokeDasharray="5 5" />
              </AreaChart>
            ) : (
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    if (timeRange === '1D') {
                      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    }
                    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis
                  domain={['dataMin - 0.001', 'dataMax + 0.001']}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatRate(value, 4)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke={chartColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: chartColor }}
                />
                <ReferenceLine y={previousRate} stroke="#999" strokeDasharray="5 5" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Chart Stats */}
        <div className="mt-4 grid grid-cols-4 gap-4 text-center border-t pt-4">
          <div>
            <div className="text-xs text-gray-500">High</div>
            <div className="font-mono font-semibold">
              {formatRate(Math.max(...data.map(d => d.rate)))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Low</div>
            <div className="font-mono font-semibold">
              {formatRate(Math.min(...data.map(d => d.rate)))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Change</div>
            <div className={`font-mono font-semibold ${changeColor}`}>
              {formatRate(priceChange, 4)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Change %</div>
            <div className={`font-mono font-semibold ${changeColor}`}>
              {priceChangePercent.toFixed(2)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MultiCurrencyChartProps {
  currencies: string[];
  baseCurrency: string;
  timeRange: TimeRange;
  data: { [currency: string]: ChartData[] };
  loading?: boolean;
  className?: string;
}

export function MultiCurrencyChart({
  currencies,
  baseCurrency,
  data,
  loading = false,
  className = ''
}: MultiCurrencyChartProps) {
  const colors = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea', '#c2410c'];

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  // Prepare combined data for multi-line chart
  const combinedData: Record<string, string | number | null>[] = [];
  const allDates = new Set<string>();

  // Collect all unique dates
  Object.values(data).forEach(currencyData => {
    currencyData.forEach(point => allDates.add(point.date));
  });

  // Create combined data points
  Array.from(allDates).sort().forEach(date => {
    const dataPoint: Record<string, string | number | null> = { date };
    currencies.forEach(currency => {
      const currencyData = data[currency];
      const point = currencyData?.find(p => p.date === date);
      dataPoint[currency] = point?.rate || null;
    });
    combinedData.push(dataPoint);
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Currency Comparison - {baseCurrency} Base</CardTitle>
        <div className="flex flex-wrap gap-2">
          {currencies.map((currency, index) => (
            <Badge
              key={currency}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              {baseCurrency}/{currency}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatRate(value, 4)}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatRate(value, 4),
                  `${baseCurrency}/${name}`
                ]}
                labelFormatter={(value) => formatDateForDisplay(value)}
              />
              {currencies.map((currency, index) => (
                <Line
                  key={currency}
                  type="monotone"
                  dataKey={currency}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}