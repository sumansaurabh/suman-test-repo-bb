'use client';

import { useState, useCallback, useEffect } from 'react';
import { ConversionResult } from '@/types/currency';
import { currencyAPI } from '@/lib/currency-api';
import { isValidAmount } from '@/lib/currency-utils';

interface UseCurrencyConverterOptions {
  defaultFromCurrency?: string;
  defaultToCurrency?: string;
  defaultAmount?: number;
}

interface UseCurrencyConverterReturn {
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  result: ConversionResult | null;
  loading: boolean;
  error: string | null;
  setFromCurrency: (currency: string) => void;
  setToCurrency: (currency: string) => void;
  setAmount: (amount: string) => void;
  convert: () => Promise<void>;
  swapCurrencies: () => void;
  reset: () => void;
}

export function useCurrencyConverter({
  defaultFromCurrency = 'USD',
  defaultToCurrency = 'EUR',
  defaultAmount = 1
}: UseCurrencyConverterOptions = {}): UseCurrencyConverterReturn {
  const [fromCurrency, setFromCurrency] = useState(defaultFromCurrency);
  const [toCurrency, setToCurrency] = useState(defaultToCurrency);
  const [amount, setAmount] = useState(defaultAmount.toString());
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convert = useCallback(async () => {
    if (!isValidAmount(amount)) {
      setError('Please enter a valid amount');
      return;
    }

    if (fromCurrency === toCurrency) {
      const numAmount = parseFloat(amount);
      setResult({
        fromCurrency,
        toCurrency,
        fromAmount: numAmount,
        toAmount: numAmount,
        rate: 1,
        timestamp: Date.now()
      });
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await currencyAPI.getSpecificRate(fromCurrency, toCurrency);
      
      if (response.success && response.data) {
        const numAmount = parseFloat(amount);
        const convertedAmount = numAmount * response.data.rate;
        
        setResult({
          fromCurrency,
          toCurrency,
          fromAmount: numAmount,
          toAmount: convertedAmount,
          rate: response.data.rate,
          timestamp: response.timestamp
        });
      } else {
        // Fallback calculation using demo rates
        const demoRates: Record<string, Record<string, number>> = {
          USD: { EUR: 0.85, GBP: 0.73, JPY: 110.0, CAD: 1.25, AUD: 1.35 },
          EUR: { USD: 1.18, GBP: 0.86, JPY: 129.4, CAD: 1.47, AUD: 1.59 },
          GBP: { USD: 1.37, EUR: 1.16, JPY: 150.7, CAD: 1.71, AUD: 1.85 }
        };

        const rate = demoRates[fromCurrency]?.[toCurrency] || 1;
        const numAmount = parseFloat(amount);
        const convertedAmount = numAmount * rate;
        
        setResult({
          fromCurrency,
          toCurrency,
          fromAmount: numAmount,
          toAmount: convertedAmount,
          rate,
          timestamp: Date.now()
        });
      }
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency, amount]);

  const swapCurrencies = useCallback(() => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    
    // Also swap the result if it exists
    if (result) {
      setResult({
        ...result,
        fromCurrency: result.toCurrency,
        toCurrency: result.fromCurrency,
        fromAmount: result.toAmount,
        toAmount: result.fromAmount,
        rate: 1 / result.rate
      });
    }
  }, [fromCurrency, toCurrency, result]);

  const reset = useCallback(() => {
    setFromCurrency(defaultFromCurrency);
    setToCurrency(defaultToCurrency);
    setAmount(defaultAmount.toString());
    setResult(null);
    setError(null);
  }, [defaultFromCurrency, defaultToCurrency, defaultAmount]);

  // Auto-convert when currencies or amount change
  useEffect(() => {
    if (amount && isValidAmount(amount) && fromCurrency && toCurrency) {
      const timeoutId = setTimeout(() => {
        convert();
      }, 500); // Debounce conversion

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [fromCurrency, toCurrency, amount, convert]);

  return {
    fromCurrency,
    toCurrency,
    amount,
    result,
    loading,
    error,
    setFromCurrency,
    setToCurrency,
    setAmount,
    convert,
    swapCurrencies,
    reset
  };
}

// Hook for quick conversions (without state management)
export function useQuickConversion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickConvert = useCallback(async (
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<ConversionResult | null> => {
    try {
      setLoading(true);
      setError(null);

      if (fromCurrency === toCurrency) {
        return {
          fromCurrency,
          toCurrency,
          fromAmount: amount,
          toAmount: amount,
          rate: 1,
          timestamp: Date.now()
        };
      }

      const response = await currencyAPI.getSpecificRate(fromCurrency, toCurrency);
      
      if (response.success && response.data) {
        return {
          fromCurrency,
          toCurrency,
          fromAmount: amount,
          toAmount: amount * response.data.rate,
          rate: response.data.rate,
          timestamp: response.timestamp
        };
      }

      throw new Error(response.error || 'Conversion failed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { quickConvert, loading, error };
}