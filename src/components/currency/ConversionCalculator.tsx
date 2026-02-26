'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CurrencySelector } from './CurrencySelector';
import { useCurrencyConverter } from '@/hooks/use-currency-converter';
import { Currency } from '@/types/currency';
import { formatCurrency, formatRate, isValidAmount } from '@/lib/currency-utils';

interface ConversionCalculatorProps {
  currencies: Currency[];
  defaultFrom?: string;
  defaultTo?: string;
  className?: string;
}

export function ConversionCalculator({
  currencies,
  defaultFrom = 'USD',
  defaultTo = 'EUR',
  className = ''
}: ConversionCalculatorProps) {
  const {
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
  } = useCurrencyConverter({
    defaultFromCurrency: defaultFrom,
    defaultToCurrency: defaultTo,
    defaultAmount: 1
  });

  const [manualMode, setManualMode] = useState(false);

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = cleanValue.split('.');
    const finalValue = parts.length > 2 ? parts[0] + '.' + parts[1] : cleanValue;
    setAmount(finalValue);
  };

  const handleConvert = () => {
    setManualMode(true);
    convert();
  };

  const handleReset = () => {
    setManualMode(false);
    reset();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Currency Converter</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
            {loading && (
              <Badge variant="secondary">Converting...</Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* From Currency */}
        <div className="space-y-2">
          <Label htmlFor="from-amount">From</Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                id="from-amount"
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="Enter amount"
                className="text-lg font-mono"
              />
            </div>
            <CurrencySelector
              currencies={currencies}
              selectedCurrency={fromCurrency}
              onCurrencySelect={setFromCurrency}
              className="min-w-[200px]"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={swapCurrencies}
            className="rounded-full p-2 h-8 w-8"
            title="Swap currencies"
          >
            ⇅
          </Button>
        </div>

        {/* To Currency */}
        <div className="space-y-2">
          <Label htmlFor="to-amount">To</Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                id="to-amount"
                type="text"
                value={result ? formatRate(result.toAmount, 4) : ''}
                readOnly
                placeholder="Conversion result"
                className="text-lg font-mono bg-gray-50 border-gray-200"
              />
            </div>
            <CurrencySelector
              currencies={currencies}
              selectedCurrency={toCurrency}
              onCurrencySelect={setToCurrency}
              className="min-w-[200px]"
            />
          </div>
        </div>

        {/* Conversion Actions */}
        <div className="flex gap-3">
          <Button 
            onClick={handleConvert}
            disabled={loading || !amount || !isValidAmount(amount)}
            className="flex-1"
          >
            {loading ? 'Converting...' : 'Convert'}
          </Button>
        </div>

        {/* Result Display */}
        {result && !error && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="space-y-3">
              {/* Main Result */}
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {formatCurrency(result.toAmount, result.toCurrency)}
                </div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(result.fromAmount, result.fromCurrency)} = {formatCurrency(result.toAmount, result.toCurrency)}
                </div>
              </div>

              {/* Exchange Rate */}
              <div className="text-center border-t pt-3">
                <div className="text-sm text-gray-600">Exchange Rate</div>
                <div className="font-mono font-semibold">
                  1 {result.fromCurrency} = {formatRate(result.rate)} {result.toCurrency}
                </div>
                <div className="text-xs text-gray-500">
                  Last updated: {new Date(result.timestamp).toLocaleString()}
                </div>
              </div>

              {/* Quick Amounts */}
              <div className="grid grid-cols-4 gap-2 pt-3 border-t">
                {[1, 10, 100, 1000].map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(quickAmount.toString())}
                    className="text-xs"
                  >
                    {quickAmount}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <div className="text-red-700 text-sm">
              <div className="font-medium">Conversion Error</div>
              <div>{error}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleConvert}
              className="mt-3"
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface QuickConverterProps {
  currencies: Currency[];
  className?: string;
}

export function QuickConverter({ currencies, className = '' }: QuickConverterProps) {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<number | null>(null);

  const handleConvert = async () => {
    // Simple conversion logic for quick converter
    const numAmount = parseFloat(amount);
    if (!isValidAmount(numAmount)) return;

    // Demo conversion rates
    const rates: Record<string, number> = {
      'USD/EUR': 0.85,
      'EUR/USD': 1.18,
      'USD/GBP': 0.73,
      'GBP/USD': 1.37
    };

    const pairKey = `${fromCurrency}/${toCurrency}`;
    const rate = rates[pairKey] || 1;
    setResult(numAmount * rate);
  };

  return (
    <div className={`border rounded-lg p-4 bg-white ${className}`}>
      <div className="flex items-center gap-3">
        <Input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-24 font-mono"
          placeholder="100"
        />
        
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border rounded px-3 py-2 font-mono"
        >
          {currencies.slice(0, 10).map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code}
            </option>
          ))}
        </select>

        <span className="text-gray-400">→</span>

        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border rounded px-3 py-2 font-mono"
        >
          {currencies.slice(0, 10).map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code}
            </option>
          ))}
        </select>

        <Button onClick={handleConvert} size="sm">
          =
        </Button>

        {result !== null && (
          <div className="font-mono font-semibold">
            {formatRate(result, 2)} {toCurrency}
          </div>
        )}
      </div>
    </div>
  );
}