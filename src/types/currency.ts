// Core currency types and interfaces

export interface Currency {
  code: string;
  name: string;
  symbol?: string;
  flag?: string;
}

export interface ExchangeRate {
  base: string;
  target: string;
  rate: number;
  timestamp: number;
  change24h?: number;
  changePercent24h?: number;
}

export interface CurrencyPair {
  id: string;
  base: Currency;
  target: Currency;
  rate: ExchangeRate;
  isWatched?: boolean;
}

export interface HistoricalRate {
  date: string;
  rate: number;
  high?: number;
  low?: number;
  open?: number;
  close?: number;
}

export interface ChartData {
  date: string;
  rate: number;
  label?: string;
}

export interface MarketSummary {
  currencyPair: string;
  currentRate: number;
  dailyHigh: number;
  dailyLow: number;
  openRate: number;
  change24h: number;
  changePercent24h: number;
  volume24h?: number;
  lastUpdated: number;
}

export interface ConversionResult {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  timestamp: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
  rateLimit?: {
    remaining: number;
    reset: number;
  };
}

export interface CurrencyAPIData {
  base_code: string;
  conversion_rates: Record<string, number>;
  time_last_update_unix: number;
  time_next_update_unix: number;
}

export interface HistoricalAPIData {
  base_code: string;
  date: string;
  conversion_rates: Record<string, number>;
}

export type TimeRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

export type ChartType = 'line' | 'area' | 'candlestick';

export type SortOrder = 'asc' | 'desc';

export interface CurrencyFilters {
  search?: string;
  favorites?: boolean;
  sortBy?: 'name' | 'code' | 'change';
  sortOrder?: SortOrder;
}

export interface UserPreferences {
  baseCurrency: string;
  watchlist: string[];
  theme: 'light' | 'dark' | 'system';
  autoRefresh: boolean;
  refreshInterval: number;
  chartType: ChartType;
  defaultTimeRange: TimeRange;
}

// Popular currency pairs
export const POPULAR_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
];

export const DEFAULT_BASE_CURRENCY = 'USD';
export const DEFAULT_TARGET_CURRENCIES = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD'];