import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  lastUpdated?: number | null;
  isConnected?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function Header({
  lastUpdated,
  isConnected = true,
  onRefresh,
  refreshing = false
}: HeaderProps) {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              💱 CurrencyX
            </Link>
            <Badge variant="secondary" className="hidden md:inline-flex">
              Real-time Exchange Monitor
            </Badge>
          </div>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/portfolio" className="text-gray-600 hover:text-gray-900 font-medium">
              Portfolio
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 font-medium">
              Contact
            </Link>
          </nav>

          {/* Status and Actions */}
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={isConnected ? 'Connected' : 'Disconnected'}
              />
              <span className="text-sm text-gray-600 hidden sm:inline">
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>

            {/* Last Updated */}
            {lastUpdated && (
              <div className="text-xs text-gray-500 hidden md:block">
                Updated: {new Date(lastUpdated).toLocaleTimeString()}
              </div>
            )}

            {/* Refresh Button */}
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <span className={`transition-transform ${refreshing ? 'animate-spin' : ''}`}>
                  ↻
                </span>
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            )}
          </div>
        </div>

        {/* Navigation/Breadcrumb - This might be removed or repurposed if main nav is sufficient */}
        {/* <nav className="mt-4">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">Dashboard</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-900 font-medium">Exchange Rates</span>
          </div>
        </nav> */}
      </div>
    </header>
  );
}

interface NavigationProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function Navigation({ activeSection = 'dashboard', onSectionChange }: NavigationProps) {
  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'converter', label: 'Converter', icon: '🔄' },
    { id: 'charts', label: 'Charts', icon: '📈' },
    { id: 'watchlist', label: 'Watchlist', icon: '⭐' }
  ];

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onSectionChange?.(section.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <span className="text-sm">{section.icon}</span>
              <span>{section.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}

interface StatusBarProps {
  totalRates?: number;
  gainers?: number;
  losers?: number;
  lastUpdate?: number | null;
  className?: string;
}

export function StatusBar({
  totalRates = 0,
  gainers = 0,
  losers = 0,
  lastUpdate,
  className = ''
}: StatusBarProps) {
  return (
    <div className={`bg-gray-50 border-b py-2 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <span className="text-gray-600">Markets:</span>
              <span className="font-semibold">{totalRates}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-600">↗</span>
              <span className="font-semibold text-green-600">{gainers}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-red-600">↘</span>
              <span className="font-semibold text-red-600">{losers}</span>
            </div>
          </div>

          {lastUpdate && (
            <div className="text-gray-500">
              {new Date(lastUpdate).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}