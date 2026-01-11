'use client';

import React, { useState, useEffect } from 'react';
import { Header, Navigation, StatusBar } from '@/components/layout/Header';
import { ExchangeRateGrid } from '@/components/currency/ExchangeRateCard';
import { ConversionCalculator } from '@/components/currency/ConversionCalculator';
import { RateChart } from '@/components/currency/RateChart';
import { MarketSummary, CurrencyOverview } from '@/components/currency/MarketSummary';
import { CurrencySelector, MultiCurrencySelector } from '@/components/currency/CurrencySelector';
import { useExchangeRates } from '@/hooks/use-exchange-rates';
import { useHistoricalData } from '@/hooks/use-historical-data';
import { Currency, TimeRange, ChartType, POPULAR_CURRENCIES, DEFAULT_TARGET_CURRENCIES } from '@/types/currency';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CurrencyExchangePage() {
  // State management
  const [activeSection, setActiveSection] = useState('dashboard');
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrencies, setTargetCurrencies] = useState(DEFAULT_TARGET_CURRENCIES);
  const [selectedPair, setSelectedPair] = useState({ base: 'USD', target: 'EUR' });
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [currencies, setCurrencies] = useState<Currency[]>(POPULAR_CURRENCIES);
  
  // Fetch exchange rates
  const {
    rates,
    loading: ratesLoading,
    error: ratesError,
    lastUpdated,
    refreshRates,
    isConnected
  } = useExchangeRates({
    baseCurrency,
    targetCurrencies,
    autoRefresh: true,
    refreshInterval: 30000
  });

  // Fetch historical data for chart
  const {
    chartData,
    loading: chartLoading,
    error: chartError,
    refetch: refetchChart
  } = useHistoricalData({
    baseCurrency: selectedPair.base,
    targetCurrency: selectedPair.target,
    timeRange
  });

  // Load supported currencies
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const response = await fetch('/api/currencies');
        const result = await response.json();
        if (result.success) {
          setCurrencies(result.data.all || POPULAR_CURRENCIES);
        }
      } catch (error) {
        console.error('Failed to load currencies:', error);
        setCurrencies(POPULAR_CURRENCIES);
      }
    };

    loadCurrencies();
  }, []);

  // Calculate market statistics
  const ratesWithChanges = rates.filter(rate => rate.changePercent24h !== undefined);
  const gainers = ratesWithChanges.filter(rate => rate.changePercent24h! > 0).length;
  const losers = ratesWithChanges.filter(rate => rate.changePercent24h! < 0).length;

  // Handlers
  const handleRateClick = (rate: { base: string; target: string }) => {
    setSelectedPair({ base: rate.base, target: rate.target });
    setActiveSection('charts');
  };

  const handleRefresh = async () => {
    await Promise.all([
      refreshRates(),
      refetchChart()
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        lastUpdated={lastUpdated}
        isConnected={isConnected}
        onRefresh={handleRefresh}
        refreshing={ratesLoading}
      />

      {/* Navigation */}
      <Navigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Status Bar */}
      <StatusBar
        totalRates={rates.length}
        gainers={gainers}
        losers={losers}
        lastUpdate={lastUpdated ?? undefined}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <>
              {/* Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>Exchange Rate Monitor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Base Currency:</label>
                      <CurrencySelector
                        currencies={currencies}
                        selectedCurrency={baseCurrency}
                        onCurrencySelect={setBaseCurrency}
                        className="min-w-[180px]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Target Currencies:</label>
                      <MultiCurrencySelector
                        currencies={currencies}
                        selectedCurrencies={targetCurrencies}
                        onCurrenciesChange={setTargetCurrencies}
                        maxSelection={8}
                        className="min-w-[250px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Error Display */}
              {ratesError && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="text-red-700">
                      <div className="font-medium">Error Loading Rates</div>
                      <div className="text-sm">{ratesError}</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Market Summary Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <MarketSummary rates={rates} loading={ratesLoading} />
                <CurrencyOverview baseCurrency={baseCurrency} rates={rates} />
              </div>

              {/* Exchange Rates Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Live Exchange Rates</h2>
                  {!isConnected && (
                    <Badge variant="destructive">
                      Offline Mode
                    </Badge>
                  )}
                </div>
                <ExchangeRateGrid
                  rates={rates}
                  loading={ratesLoading}
                  onRateClick={handleRateClick}
                />
              </div>
            </>
          )}

          {/* Converter Section */}
          {activeSection === 'converter' && (
            <div className="max-w-4xl mx-auto">
              <ConversionCalculator
                currencies={currencies}
                defaultFrom={baseCurrency}
                defaultTo={targetCurrencies[0] || 'EUR'}
              />
            </div>
          )}

          {/* Charts Section */}
          {activeSection === 'charts' && (
            <>
              {/* Chart Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>Historical Charts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Base:</label>
                      <CurrencySelector
                        currencies={currencies}
                        selectedCurrency={selectedPair.base}
                        onCurrencySelect={(code) => setSelectedPair(prev => ({ ...prev, base: code }))}
                        className="min-w-[150px]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Target:</label>
                      <CurrencySelector
                        currencies={currencies}
                        selectedCurrency={selectedPair.target}
                        onCurrencySelect={(code) => setSelectedPair(prev => ({ ...prev, target: code }))}
                        className="min-w-[150px]"
                      />
                    </div>
                    <Button variant="outline" onClick={refetchChart}>
                      Update Chart
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Chart Display */}
              <RateChart
                data={chartData}
                baseCurrency={selectedPair.base}
                targetCurrency={selectedPair.target}
                timeRange={timeRange}
                chartType={chartType}
                loading={chartLoading}
                error={chartError}
                onTimeRangeChange={setTimeRange}
                onChartTypeChange={setChartType}
              />
            </>
          )}

          {/* Watchlist Section */}
          {activeSection === 'watchlist' && (
            <Card>
              <CardHeader>
                <CardTitle>Currency Watchlist</CardTitle>
                <p className="text-sm text-gray-600">
                  Coming soon - Save your favorite currency pairs for quick monitoring
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">⭐</div>
                  <p>Watchlist feature will be available in the next update</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <div className="flex items-center justify-center gap-4">
              <span>💱 CurrencyX - Real-time Exchange Monitor</span>
              <span>•</span>
              <span>Data updates every 30 seconds</span>
              <span>•</span>
              <span>Professional trading insights</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Exchange rates are for informational purposes only. Please consult professional financial services for trading decisions.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}