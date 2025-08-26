import { NextRequest, NextResponse } from 'next/server';
import { currencyAPI, transformToExchangeRates, getFallbackRates } from '@/lib/currency-api';
import { DEFAULT_BASE_CURRENCY, DEFAULT_TARGET_CURRENCIES } from '@/types/currency';

/**
 * Fetch the latest exchange rates for specified currencies.
 *
 * This function retrieves the latest exchange rates based on the provided base currency and target currencies. It validates the currency codes, attempts to fetch live data from the currency API, and falls back to predefined rates if the live data is unavailable or if the API request fails. The response includes the rates, a timestamp, and the source of the data.
 *
 * @param request - The NextRequest object containing the request details, including search parameters for base currency, target currencies, and fallback option.
 * @returns A JSON response containing the success status, exchange rates, and additional metadata.
 * @throws Error If there is an internal server error or if the base currency code is invalid.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const baseCurrency = searchParams.get('base') || DEFAULT_BASE_CURRENCY;
    const targetCurrencies = searchParams.get('targets')?.split(',') || DEFAULT_TARGET_CURRENCIES;
    const includeFallback = searchParams.get('fallback') === 'true';

    // Validate currency codes
    const validCurrencyCode = /^[A-Z]{3}$/;
    if (!validCurrencyCode.test(baseCurrency)) {
      return NextResponse.json(
        { error: 'Invalid base currency code', success: false },
        { status: 400 }
      );
    }

    for (const currency of targetCurrencies) {
      if (!validCurrencyCode.test(currency)) {
        return NextResponse.json(
          { error: `Invalid target currency code: ${currency}`, success: false },
          { status: 400 }
        );
      }
    }

    try {
      // Attempt to fetch live data
      const response = await currencyAPI.getLatestRates(baseCurrency);
      
      if (response.success && response.data) {
        const rates = transformToExchangeRates(response.data, targetCurrencies);
        
        return NextResponse.json({
          success: true,
          data: {
            base: baseCurrency,
            rates,
            timestamp: response.timestamp,
            source: 'live'
          }
        });
      } else {
        throw new Error(response.error || 'API request failed');
      }
    } catch (error) {
      console.warn('Live API failed, using fallback data:', error);
      
      if (includeFallback) {
        // Return fallback data
        const fallbackRates = getFallbackRates(baseCurrency)
          .filter(rate => targetCurrencies.includes(rate.target));
        
        return NextResponse.json({
          success: true,
          data: {
            base: baseCurrency,
            rates: fallbackRates,
            timestamp: Date.now(),
            source: 'fallback'
          },
          warning: 'Using fallback data - live rates unavailable'
        });
      } else {
        return NextResponse.json(
          { 
            error: error instanceof Error ? error.message : 'Failed to fetch exchange rates',
            success: false 
          },
          { status: 503 }
        );
      }
    }
  } catch (error) {
    console.error('Exchange rates API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        success: false 
      },
      { status: 500 }
    );
  }
}

/**
 * Handles the POST request to fetch the latest currency exchange rates.
 *
 * The function extracts the base currency and target currencies from the request body, validates the input,
 * and retrieves the latest exchange rates using the currencyAPI. If requested, it also calculates random
 * changes to the rates. The response is returned in JSON format, indicating success or failure based on
 * the API call results.
 *
 * @param request - The NextRequest object containing the request data.
 * @returns A JSON response containing the success status, exchange rates, and additional information.
 * @throws Error If an internal server error occurs during processing.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { base, targets, includeChanges = false } = body;

    if (!base || !targets || !Array.isArray(targets)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected: { base: string, targets: string[] }', success: false },
        { status: 400 }
      );
    }

    const response = await currencyAPI.getLatestRates(base);
    
    if (response.success && response.data) {
      let rates = transformToExchangeRates(response.data, targets);
      
      // If changes are requested, calculate them (this would require historical data)
      if (includeChanges) {
        // For demo purposes, add random changes
        rates = rates.map(rate => ({
          ...rate,
          change24h: (Math.random() - 0.5) * 0.02, // ±1% random change
          changePercent24h: (Math.random() - 0.5) * 2 // ±1% random percentage change
        }));
      }
      
      return NextResponse.json({
        success: true,
        data: {
          base,
          rates,
          timestamp: response.timestamp,
          includeChanges
        }
      });
    } else {
      return NextResponse.json(
        { 
          error: response.error || 'Failed to fetch exchange rates',
          success: false 
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Exchange rates POST API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        success: false 
      },
      { status: 500 }
    );
  }
}