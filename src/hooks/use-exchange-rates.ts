'use client';

import { useState, useEffect, useCallback } from 'react';
import { ExchangeRate } from '@/types/currency';
import { currencyAPI, transformToExchangeRates, getFallbackRates } from '@/lib/currency-api';
import { calculateChange } from '@/lib/currency-utils';

interface UseExchangeRatesOptions {
  baseCurrency?: string;
  targetCurrencies?: string[];
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseExchangeRatesReturn {
  rates: ExchangeRate[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  refreshRates: () => Promise<void>;
  isConnected: boolean;
}

export function useExchangeRates({
  baseCurrency = 'USD',
  targetCurrencies,
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}: UseExchangeRatesOptions = {}): UseExchangeRatesReturn {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [previousRates, setPreviousRates] = useState<Map<string, number>>(new Map());

  const fetchRates = useCallback(async () => {
    try {
      setError(null);
      
      const response = await currencyAPI.getLatestRates(baseCurrency);
      
      if (response.success && response.data) {
        const newRates = transformToExchangeRates(response.data, targetCurrencies);
        
        // Calculate changes from previous rates
        const ratesWithChanges = newRates.map(rate => {
          const pairId = `${rate.base}/${rate.target}`;
          const previousRate = previousRates.get(pairId);
          
          if (previousRate) {
            const { absoluteChange, percentageChange } = calculateChange(rate.rate, previousRate);
            return {
              ...rate,
              change24h: absoluteChange,
              changePercent24h: percentageChange
            };
          }
          
          return rate;
        });
        
        setRates(ratesWithChanges);
        setLastUpdated(response.timestamp);
        setIsConnected(true);
        
        // Update previous rates for next comparison
        const newPreviousRates = new Map();
        ratesWithChanges.forEach(rate => {
          newPreviousRates.set(`${rate.base}/${rate.target}`, rate.rate);
        });
        setPreviousRates(newPreviousRates);
        
      } else {
        throw new Error(response.error || 'Failed to fetch exchange rates');
      }
    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsConnected(false);
      
      // Use fallback data if available
      if (rates.length === 0) {
        const fallbackRates = getFallbackRates(baseCurrency);
        if (targetCurrencies) {
          setRates(fallbackRates.filter(rate => targetCurrencies.includes(rate.target)));
        } else {
          setRates(fallbackRates);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [baseCurrency, targetCurrencies, previousRates, rates.length]);

  const refreshRates = useCallback(async () => {
    setLoading(true);
    await fetchRates();
  }, [fetchRates]);

  // Initial fetch
  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchRates();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchRates]);

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && autoRefresh) {
        // Refresh rates when page becomes visible
        fetchRates();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [autoRefresh, fetchRates]);

  return {
    rates,
    loading,
    error,
    lastUpdated,
    refreshRates,
    isConnected
  };
}