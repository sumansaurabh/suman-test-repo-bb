import { NextRequest, NextResponse } from 'next/server';
import { TimeRange, HistoricalDataPoint } from '@/types/currency';
import { getDateRange, formatDateForAPI } from '@/lib/currency-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const baseCurrency = searchParams.get('base') || 'USD';
    const targetCurrency = searchParams.get('target') || 'EUR';
    const timeRange = (searchParams.get('range') as TimeRange) || '1M';
    const includeOHLC = searchParams.get('ohlc') === 'true';

    // Validate currency codes
    const validCurrencyCode = /^[A-Z]{3}$/;
    if (!validCurrencyCode.test(baseCurrency) || !validCurrencyCode.test(targetCurrency)) {
      return NextResponse.json(
        { error: 'Invalid currency codes', success: false },
        { status: 400 }
      );
    }

    // Validate time range
    const validTimeRanges: TimeRange[] = ['1D', '1W', '1M', '3M', '6M', '1Y'];
    if (!validTimeRanges.includes(timeRange)) {
      return NextResponse.json(
        { error: 'Invalid time range', success: false },
        { status: 400 }
      );
    }

    // Generate historical data (demo implementation)
    const { start, end } = getDateRange(timeRange);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    // Base rate for different currency pairs (demo values)
    const baseRates: Record<string, number> = {
      'USD/EUR': 0.85,
      'USD/GBP': 0.73,
      'USD/JPY': 110.0,
      'USD/CAD': 1.25,
      'USD/AUD': 1.35,
      'EUR/USD': 1.18,
      'EUR/GBP': 0.86,
      'GBP/USD': 1.37,
      'GBP/EUR': 1.16
    };

    const pairKey = `${baseCurrency}/${targetCurrency}`;
    const baseRate = baseRates[pairKey] || 1.0;
    
    const historicalData = [];
    
    for (let i = 0; i <= days; i++) {
      const currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = formatDateForAPI(currentDate);
      
      // Generate realistic rate variations
      const volatility = 0.02; // 2% daily volatility
      const trendFactor = Math.sin(i * 0.05) * 0.01; // Long-term trend
      const randomFactor = (Math.random() - 0.5) * volatility;
      const seasonalFactor = Math.sin((i / days) * 2 * Math.PI) * 0.005; // Seasonal variation
      
      const rate = baseRate + trendFactor + randomFactor + seasonalFactor;
      const adjustedRate = Math.max(0.001, rate); // Ensure positive rate
      
      const dataPoint: HistoricalDataPoint = {
        date: dateStr,
        rate: Number(adjustedRate.toFixed(6)),
        timestamp: currentDate.getTime()
      };
      
      if (includeOHLC) {
        // Generate OHLC data for more detailed charts
        const dailyVariation = adjustedRate * 0.01; // 1% daily variation
        dataPoint.open = Number((adjustedRate + (Math.random() - 0.5) * dailyVariation).toFixed(6));
        dataPoint.high = Number((adjustedRate + Math.random() * dailyVariation).toFixed(6));
        dataPoint.low = Number((adjustedRate - Math.random() * dailyVariation).toFixed(6));
        dataPoint.close = dataPoint.rate;
        dataPoint.volume = Math.floor(Math.random() * 1000000) + 500000; // Demo volume
      }
      
      historicalData.push(dataPoint);
    }

    // Calculate summary statistics
    const rates = historicalData.map(d => d.rate);
    const summary = {
      current: rates[rates.length - 1],
      previous: rates[0],
      high: Math.max(...rates),
      low: Math.min(...rates),
      average: rates.reduce((a, b) => a + b, 0) / rates.length,
      change: rates[rates.length - 1] - rates[0],
      changePercent: ((rates[rates.length - 1] - rates[0]) / rates[0]) * 100,
      volatility: Math.sqrt(rates.reduce((sum, rate) => {
        const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
        return sum + Math.pow(rate - avg, 2);
      }, 0) / rates.length)
    };

    return NextResponse.json({
      success: true,
      data: {
        pair: pairKey,
        baseCurrency,
        targetCurrency,
        timeRange,
        data: historicalData,
        summary,
        dataPoints: historicalData.length,
        includeOHLC,
        source: 'generated' // In production, this would be 'api' or similar
      }
    });

  } catch (error) {
    console.error('Historical data API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch historical data',
        success: false 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { base, targets, range = '1M', includeOHLC = false } = body;

    if (!base || !targets || !Array.isArray(targets)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected: { base: string, targets: string[], range?: string }', success: false },
        { status: 400 }
      );
    }

    const results = [];

    for (const target of targets) {
      // Get historical data for each target currency
      const response = await fetch(
        `${request.nextUrl.origin}/api/historical?base=${base}&target=${target}&range=${range}&ohlc=${includeOHLC}`,
        { method: 'GET' }
      );

      if (response.ok) {
        const data = await response.json();
        results.push({
          currency: target,
          ...data.data
        });
      } else {
        results.push({
          currency: target,
          error: 'Failed to fetch data'
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        base,
        results,
        range,
        includeOHLC
      }
    });

  } catch (error) {
    console.error('Historical data POST API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch historical data',
        success: false 
      },
      { status: 500 }
    );
  }
}