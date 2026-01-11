'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Currency, POPULAR_CURRENCIES } from '@/types/currency';
import { searchCurrencies, sortCurrencies } from '@/lib/currency-utils';

interface CurrencySelectorProps {
  currencies: Currency[];
  selectedCurrency: string;
  onCurrencySelect: (currencyCode: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CurrencySelector({
  currencies,
  selectedCurrency,
  onCurrencySelect,
  placeholder = 'Select currency...',
  disabled = false,
  className = ''
}: CurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);

  const filteredCurrencies = useMemo(() => {
    const filtered = searchTerm 
      ? searchCurrencies(currencies, searchTerm)
      : currencies;
    
    return sortCurrencies(filtered, 'code');
  }, [currencies, searchTerm]);

  const popularCurrencies = useMemo(() => 
    POPULAR_CURRENCIES.filter(popular => 
      currencies.some(currency => currency.code === popular.code)
    ), [currencies]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={`justify-between min-w-[200px] ${className}`}
        >
          {selectedCurrencyData ? (
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold">
                {selectedCurrencyData.code}
              </span>
              <span className="text-gray-500 truncate">
                {selectedCurrencyData.name}
              </span>
              {selectedCurrencyData.symbol && (
                <span className="text-sm text-gray-400">
                  {selectedCurrencyData.symbol}
                </span>
              )}
            </div>
          ) : (
            placeholder
          )}
          <svg
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <div className="mr-2 h-4 w-4 shrink-0 opacity-50">🔍</div>
            <CommandInput
              placeholder="Search currencies..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>No currency found.</CommandEmpty>
            
            {/* Popular Currencies */}
            {popularCurrencies.length > 0 && !searchTerm && (
              <CommandGroup heading="Popular">
                {popularCurrencies.map((currency) => (
                  <CommandItem
                    key={currency.code}
                    value={currency.code}
                    onSelect={() => {
                      onCurrencySelect(currency.code);
                      setOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <div
                      className={`mr-2 h-4 w-4 ${
                        selectedCurrency === currency.code ? 'opacity-100' : 'opacity-0'
                      }`}
                    >✓</div>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold">
                            {currency.code}
                          </span>
                          {currency.symbol && (
                            <Badge variant="secondary" className="text-xs">
                              {currency.symbol}
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {currency.name}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            
            {/* All Currencies */}
            <CommandGroup heading={!searchTerm ? "All Currencies" : "Search Results"}>
              {filteredCurrencies.map((currency) => (
                <CommandItem
                  key={currency.code}
                  value={currency.code}
                  onSelect={() => {
                    onCurrencySelect(currency.code);
                    setOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <div
                    className={`mr-2 h-4 w-4 ${
                      selectedCurrency === currency.code ? 'opacity-100' : 'opacity-0'
                    }`}
                  >✓</div>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">
                          {currency.code}
                        </span>
                        {currency.symbol && (
                          <Badge variant="secondary" className="text-xs">
                            {currency.symbol}
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {currency.name}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface MultiCurrencySelectorProps {
  currencies: Currency[];
  selectedCurrencies: string[];
  onCurrenciesChange: (currencyCodes: string[]) => void;
  maxSelection?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiCurrencySelector({
  currencies,
  selectedCurrencies,
  onCurrenciesChange,
  maxSelection = 10,
  placeholder = 'Select currencies...',
  disabled = false,
  className = ''
}: MultiCurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCurrencies = useMemo(() => {
    const filtered = searchTerm 
      ? searchCurrencies(currencies, searchTerm)
      : currencies;
    
    return sortCurrencies(filtered, 'code');
  }, [currencies, searchTerm]);

  const handleCurrencyToggle = (currencyCode: string) => {
    const isSelected = selectedCurrencies.includes(currencyCode);
    
    if (isSelected) {
      onCurrenciesChange(selectedCurrencies.filter(code => code !== currencyCode));
    } else if (selectedCurrencies.length < maxSelection) {
      onCurrenciesChange([...selectedCurrencies, currencyCode]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={`justify-between min-w-[250px] ${className}`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedCurrencies.length > 0 ? (
              <div className="flex items-center gap-1 flex-wrap">
                {selectedCurrencies.slice(0, 3).map((code) => (
                  <Badge key={code} variant="secondary" className="text-xs">
                    {code}
                  </Badge>
                ))}
                {selectedCurrencies.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{selectedCurrencies.length - 3} more
                  </Badge>
                )}
              </div>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <svg
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <div className="mr-2 h-4 w-4 shrink-0 opacity-50">🔍</div>
            <CommandInput
              placeholder="Search currencies..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>No currency found.</CommandEmpty>
            
            <CommandGroup heading={`Selected (${selectedCurrencies.length}/${maxSelection})`}>
              {filteredCurrencies.map((currency) => {
                const isSelected = selectedCurrencies.includes(currency.code);
                const isDisabled = !isSelected && selectedCurrencies.length >= maxSelection;
                
                return (
                  <CommandItem
                    key={currency.code}
                    value={currency.code}
                    disabled={isDisabled}
                    onSelect={() => handleCurrencyToggle(currency.code)}
                  >
                    <div
                      className={`mr-2 h-4 w-4 ${
                        isSelected ? 'opacity-100' : 'opacity-0'
                      }`}
                    >✓</div>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold">
                            {currency.code}
                          </span>
                          {currency.symbol && (
                            <Badge variant="secondary" className="text-xs">
                              {currency.symbol}
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {currency.name}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}