'use client';

import { useState, useEffect, useCallback } from 'react';
import { HistoricalRate, TimeRange, ChartData } from '@/types/currency';
import { getDateRange, formatDateForAPI } from '@/lib/currency-utils';

interface UseHistoricalDataOptions {
  baseCurrency: string;
  targetCurrency: string;
  timeRange: TimeRange;
  autoRefresh?: boolean;
}

interface UseHistoricalDataReturn {
  data: HistoricalRate[];
  chartData: ChartData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useHistoricalData({
  baseCurrency,
  targetCurrency,
  timeRange,
  autoRefresh = false
}: UseHistoricalDataOptions): UseHistoricalDataReturn {
  const [data, setData] = useState<HistoricalRate[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateDemoData = useCallback((_baseCurrency: string, _targetCurrency: string, timeRange: TimeRange): HistoricalRate[] => {
    const { start, end } = getDateRange(timeRange);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const baseRate = 0.85; // Demo base rate for EUR/USD
    const demoData: HistoricalRate[] = [];

    for (let i = 0; i <= days; i++) {
      const currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = formatDateForAPI(currentDate);
      
      // Generate realistic-looking rate with some volatility
      const volatility = 0.02; // 2% volatility
      const trendFactor = Math.sin(i * 0.1) * 0.01; // Small trend component
      const randomFactor = (Math.random() - 0.5) * volatility;
      const rate = baseRate + trendFactor + randomFactor;

      demoData.push({
        date: dateStr,
        rate: Math.max(0.01, rate), // Ensure positive rate
        high: rate * 1.005,
        low: rate * 0.995,
        open: rate * (1 + (Math.random() - 0.5) * 0.002),
        close: rate
      });
    }

    return demoData;
  }, []);

  const fetchHistoricalData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { start, end } = getDateRange(timeRange);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      // For demo purposes, we'll generate realistic sample data
      // In production, you would fetch from multiple API calls for historical data
      const historicalRates: HistoricalRate[] = [];

      if (days <= 30) {
        // For shorter periods, we could make individual API calls
        // But for demo, we'll use generated data
        const demoData = generateDemoData(baseCurrency, targetCurrency, timeRange);
        historicalRates.push(...demoData);
      } else {
        // For longer periods, use generated data with different patterns
        const demoData = generateDemoData(baseCurrency, targetCurrency, timeRange);
        historicalRates.push(...demoData);
      }

      // Transform to chart data
      const transformedChartData: ChartData[] = historicalRates.map(rate => ({
        date: rate.date,
        rate: rate.rate,
        label: new Date(rate.date).toLocaleDateString()
      }));

      setData(historicalRates);
      setChartData(transformedChartData);

    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch historical data');
      
      // Fallback to demo data on error
      const fallbackData = generateDemoData(baseCurrency, targetCurrency, timeRange);
      setData(fallbackData);
      setChartData(fallbackData.map(rate => ({
        date: rate.date,
        rate: rate.rate,
        label: new Date(rate.date).toLocaleDateString()
      })));
    } finally {
      setLoading(false);
    }
  }, [baseCurrency, targetCurrency, timeRange, generateDemoData]);

  const refetch = useCallback(async () => {
    await fetchHistoricalData();
  }, [fetchHistoricalData]);

  // Initial fetch
  useEffect(() => {
    fetchHistoricalData();
  }, [fetchHistoricalData]);

  // Auto refresh (mainly for shorter time periods)
  useEffect(() => {
    if (!autoRefresh || timeRange === '1Y' || timeRange === '6M') return;

    const interval = setInterval(() => {
      fetchHistoricalData();
    }, 60000); // Refresh every minute for shorter periods

    return () => clearInterval(interval);
  }, [autoRefresh, timeRange, fetchHistoricalData]);

  return {
    data,
    chartData,
    loading,
    error,
    refetch
  };
}

// Hook for multiple currency pairs comparison
interface UseMultiCurrencyHistoricalOptions {
  baseCurrency: string;
  targetCurrencies: string[];
  timeRange: TimeRange;
}

interface MultiCurrencyHistoricalData {
  currency: string;
  data: ChartData[];
}

export function useMultiCurrencyHistorical({
  baseCurrency,
  targetCurrencies,
  timeRange
}: UseMultiCurrencyHistoricalOptions): {
  data: MultiCurrencyHistoricalData[];
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<MultiCurrencyHistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        const allData: MultiCurrencyHistoricalData[] = [];

        // For demo, generate data for each currency
        for (const targetCurrency of targetCurrencies) {
          const { start, end } = getDateRange(timeRange);
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          const baseRate = Math.random() * 2 + 0.5; // Random base rate between 0.5 and 2.5
          const currencyData: ChartData[] = [];

          for (let i = 0; i <= days; i++) {
            const currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
            const dateStr = formatDateForAPI(currentDate);
            
            const volatility = 0.02;
            const trendFactor = Math.sin(i * 0.1) * 0.01;
            const randomFactor = (Math.random() - 0.5) * volatility;
            const rate = baseRate + trendFactor + randomFactor;

            currencyData.push({
              date: dateStr,
              rate: Math.max(0.01, rate),
              label: new Date(dateStr).toLocaleDateString()
            });
          }

          allData.push({
            currency: targetCurrency,
            data: currencyData
          });
        }

        setData(allData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [baseCurrency, targetCurrencies, timeRange]);

  return { data, loading, error };
}