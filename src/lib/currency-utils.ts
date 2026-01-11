import { Currency, ExchangeRate, TimeRange } from '@/types/currency';

// Currency formatting utilities
export function formatCurrency(
  amount: number, 
  currencyCode: string, 
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount);
  } catch {
    // Fallback if currency code is not supported
    return `${amount.toFixed(4)} ${currencyCode}`;
  }
}

export function formatRate(rate: number, precision: number = 4): string {
  if (rate >= 1) {
    return rate.toFixed(Math.min(precision, 4));
  } else {
    // For very small rates, show more decimal places
    const decimalPlaces = Math.max(precision, Math.ceil(-Math.log10(rate)) + 2);
    return rate.toFixed(Math.min(decimalPlaces, 8));
  }
}

export function formatPercentage(value: number, showSign: boolean = true): string {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value: number, precision: number = 2): string {
  if (Math.abs(value) >= 1e9) {
    return (value / 1e9).toFixed(1) + 'B';
  } else if (Math.abs(value) >= 1e6) {
    return (value / 1e6).toFixed(1) + 'M';
  } else if (Math.abs(value) >= 1e3) {
    return (value / 1e3).toFixed(1) + 'K';
  }
  return value.toFixed(precision);
}

// Currency conversion utilities
export function convertCurrency(
  amount: number,
  fromRate: number,
  toRate: number
): number {
  // Convert from base currency to target currency
  return (amount / fromRate) * toRate;
}

export function calculateCrossRate(
  baseToFirst: number,
  baseToSecond: number
): number {
  // Calculate rate between two non-base currencies
  return baseToSecond / baseToFirst;
}

// Rate change calculations
export function calculateChange(currentRate: number, previousRate: number): {
  absoluteChange: number;
  percentageChange: number;
} {
  const absoluteChange = currentRate - previousRate;
  const percentageChange = previousRate !== 0 
    ? (absoluteChange / previousRate) * 100 
    : 0;

  return { absoluteChange, percentageChange };
}

export function getChangeColor(change: number): string {
  if (change > 0) return 'text-green-600';
  if (change < 0) return 'text-red-600';
  return 'text-gray-600';
}

export function getChangeIcon(change: number): string {
  if (change > 0) return '↗';
  if (change < 0) return '↘';
  return '→';
}

// Time and date utilities
export function getDateRange(timeRange: TimeRange): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  switch (timeRange) {
    case '1D':
      start.setDate(start.getDate() - 1);
      break;
    case '1W':
      start.setDate(start.getDate() - 7);
      break;
    case '1M':
      start.setMonth(start.getMonth() - 1);
      break;
    case '3M':
      start.setMonth(start.getMonth() - 3);
      break;
    case '6M':
      start.setMonth(start.getMonth() - 6);
      break;
    case '1Y':
      start.setFullYear(start.getFullYear() - 1);
      break;
    default:
      start.setDate(start.getDate() - 7);
  }

  return { start, end };
}

export function formatDateForAPI(date: Date): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

export function formatDateForDisplay(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getTimeFromTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit'
  });
}

// Currency search and filtering
export function searchCurrencies(
  currencies: Currency[],
  searchTerm: string
): Currency[] {
  if (!searchTerm.trim()) return currencies;

  const term = searchTerm.toLowerCase().trim();
  return currencies.filter(currency =>
    currency.code.toLowerCase().includes(term) ||
    currency.name.toLowerCase().includes(term)
  );
}

export function sortCurrencies(
  currencies: Currency[],
  sortBy: 'code' | 'name' = 'code'
): Currency[] {
  return [...currencies].sort((a, b) => {
    if (sortBy === 'code') {
      return a.code.localeCompare(b.code);
    }
    return a.name.localeCompare(b.name);
  });
}

// Rate comparison utilities
export function findBestRate(rates: ExchangeRate[], targetCurrency: string): ExchangeRate | null {
  const targetRates = rates.filter(rate => rate.target === targetCurrency);
  if (targetRates.length === 0) return null;

  return targetRates.reduce((best, current) => 
    current.rate > best.rate ? current : best
  );
}

export function findWorstRate(rates: ExchangeRate[], targetCurrency: string): ExchangeRate | null {
  const targetRates = rates.filter(rate => rate.target === targetCurrency);
  if (targetRates.length === 0) return null;

  return targetRates.reduce((worst, current) => 
    current.rate < worst.rate ? current : worst
  );
}

// Validation utilities
export function isValidCurrencyCode(code: string): boolean {
  return /^[A-Z]{3}$/.test(code);
}

export function isValidAmount(amount: string | number): boolean {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(num) && num >= 0 && isFinite(num);
}

// Local storage utilities for user preferences
export function saveToLocalStorage(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.warn('Failed to save to localStorage');
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    console.warn('Failed to load from localStorage');
    return defaultValue;
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    console.warn('Failed to remove from localStorage');
  }
}

// Currency pair utilities
export function createPairId(baseCurrency: string, targetCurrency: string): string {
  return `${baseCurrency}/${targetCurrency}`;
}

export function parsePairId(pairId: string): { base: string; target: string } | null {
  const parts = pairId.split('/');
  if (parts.length !== 2) return null;
  
  return {
    base: parts[0],
    target: parts[1]
  };
}

export function getPopularPairs(baseCurrency: string = 'USD'): string[] {
  const popular = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'];
  return popular
    .filter(currency => currency !== baseCurrency)
    .map(currency => createPairId(baseCurrency, currency));
}