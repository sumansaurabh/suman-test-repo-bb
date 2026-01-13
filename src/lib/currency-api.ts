import { 
  APIResponse, 
  CurrencyAPIData, 
  HistoricalAPIData, 
  ExchangeRate, 
  HistoricalRate,
  Currency 
} from '@/types/currency';

// ExchangeRate-API configuration
const API_BASE_URL = 'https://v6.exchangerate-api.com/v6';
const API_KEY = 'your_api_key_here'; // In production, this would be from env variables

// Cache configuration
const CACHE_DURATION = 30000; // 30 seconds
const cache = new Map<string, { data: unknown; timestamp: number }>();

class CurrencyAPIClient {
  private async fetchWithCache<T>(url: string, cacheKey: string): Promise<APIResponse<T>> {
    try {
      // Check cache first
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return {
          success: true,
          data: cached.data as T,
          timestamp: Date.now()
        };
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      // Cache the successful response
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return {
        success: true,
        data,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  async getLatestRates(baseCurrency: string = 'USD'): Promise<APIResponse<CurrencyAPIData>> {
    const url = `${API_BASE_URL}/${API_KEY}/latest/${baseCurrency}`;
    const cacheKey = `latest_${baseCurrency}`;
    return this.fetchWithCache<CurrencyAPIData>(url, cacheKey);
  }

  async getSpecificRate(baseCurrency: string, targetCurrency: string): Promise<APIResponse<{ rate: number }>> {
    const url = `${API_BASE_URL}/${API_KEY}/pair/${baseCurrency}/${targetCurrency}`;
    const cacheKey = `pair_${baseCurrency}_${targetCurrency}`;
    
    try {
      const response = await this.fetchWithCache<{ conversion_rate: number }>(url, cacheKey);
      if (response.success && response.data) {
        return {
          success: true,
          data: { rate: response.data.conversion_rate },
          timestamp: response.timestamp
        };
      }
      // If not successful, return an error response matching the expected type
      return {
        success: false,
        error: response.error || 'Failed to retrieve specific rate',
        timestamp: response.timestamp
      } as APIResponse<{ rate: number }>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  async getHistoricalRates(baseCurrency: string, date: string): Promise<APIResponse<HistoricalAPIData>> {
    const url = `${API_BASE_URL}/${API_KEY}/history/${baseCurrency}/${date}`;
    const cacheKey = `history_${baseCurrency}_${date}`;
    return this.fetchWithCache<HistoricalAPIData>(url, cacheKey);
  }

  async getSupportedCurrencies(): Promise<APIResponse<{ supported_codes: [string, string][] }>> {
    const url = `${API_BASE_URL}/${API_KEY}/codes`;
    const cacheKey = 'supported_currencies';
    return this.fetchWithCache<{ supported_codes: [string, string][] }>(url, cacheKey);
  }
}

// Utility functions for data transformation
export function transformToExchangeRates(
  apiData: CurrencyAPIData, 
  targetCurrencies?: string[]
): ExchangeRate[] {
  const rates: ExchangeRate[] = [];
  const currencies = targetCurrencies || Object.keys(apiData.conversion_rates);

  currencies.forEach(targetCode => {
    const rate = apiData.conversion_rates[targetCode];
    if (rate) {
      rates.push({
        base: apiData.base_code,
        target: targetCode,
        rate,
        timestamp: apiData.time_last_update_unix * 1000
      });
    }
  });

  return rates;
}

export function transformToHistoricalRates(
  historicalData: HistoricalAPIData[],
  targetCurrency: string
): HistoricalRate[] {
  return historicalData.map(data => ({
    date: data.date,
    rate: data.conversion_rates[targetCurrency] || 0,
    // Note: Free API doesn't provide OHLC data
    // In production, you might use a different API for this
  })).filter(rate => rate.rate > 0);
}

export function transformToSupportedCurrencies(
  apiData: { supported_codes: [string, string][] }
): Currency[] {
  return apiData.supported_codes.map(([code, name]) => ({
    code,
    name
  }));
}

// Fallback data for demo/offline mode
export const FALLBACK_RATES: Record<string, number> = {
  'EUR': 0.85,
  'GBP': 0.73,
  'JPY': 110.0,
  'CAD': 1.25,
  'AUD': 1.35,
  'CHF': 0.92,
  'CNY': 6.45,
  'INR': 74.5,
  'BRL': 5.2,
  'KRW': 1180.0,
  'MXN': 20.1,
  'SGD': 1.35,
  'HKD': 7.8,
  'NOK': 8.6,
  'SEK': 8.9,
  'DKK': 6.3,
  'PLN': 3.9,
  'CZK': 21.5,
  'HUF': 295.0,
  'RUB': 73.5
};

export function getFallbackRates(baseCurrency: string = 'USD'): ExchangeRate[] {
  const timestamp = Date.now();
  return Object.entries(FALLBACK_RATES).map(([target, rate]) => ({
    base: baseCurrency,
    target,
    rate,
    timestamp,
    // Add some random variation for demo purposes
    change24h: (Math.random() - 0.5) * 0.02,
    changePercent24h: (Math.random() - 0.5) * 2
  }));
}

// Create singleton instance
export const currencyAPI = new CurrencyAPIClient();