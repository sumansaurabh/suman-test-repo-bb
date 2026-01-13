import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import Header from '../components/layout/Header';

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CurrencyX - Real-time Exchange Rate Monitor",
  description: "Professional currency exchange monitoring with real-time rates, historical charts, and conversion tools. Track popular currency pairs including USD, EUR, GBP, JPY, and more.",
  keywords: [
    "currency exchange",
    "forex rates",
    "exchange rates",
    "currency converter",
    "real-time rates",
    "currency charts",
    "financial data",
    "USD",
    "EUR", 
    "GBP",
    "JPY"
  ],
  authors: [{ name: "CurrencyX" }],
  creator: "CurrencyX",
  publisher: "CurrencyX",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://currencyx.vercel.app',
    title: 'CurrencyX - Real-time Exchange Rate Monitor',
    description: 'Professional currency exchange monitoring with real-time rates, historical charts, and conversion tools.',
    siteName: 'CurrencyX',
    images: [
      {
        url: 'https://placehold.co/1200x630?text=CurrencyX+Real-time+Exchange+Rate+Monitor+Dashboard',
        width: 1200,
        height: 630,
        alt: 'CurrencyX - Professional currency exchange dashboard with real-time rates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CurrencyX - Real-time Exchange Rate Monitor',
    description: 'Professional currency exchange monitoring with real-time rates, historical charts, and conversion tools.',
    images: ['https://placehold.co/1200x630?text=CurrencyX+Real-time+Exchange+Rate+Monitor+Dashboard'],
    creator: '@currencyx',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: 'https://currencyx.vercel.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* Structured Data for Financial Services */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              "name": "CurrencyX",
              "description": "Real-time currency exchange rate monitoring and conversion service",
              "url": "https://currencyx.vercel.app",
              "logo": "https://placehold.co/300x300?text=CurrencyX+Logo",
              "sameAs": [
                "https://twitter.com/currencyx"
              ],
              "serviceType": "Currency Exchange Information",
              "areaServed": "Worldwide",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Currency Exchange Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Real-time Exchange Rates",
                      "description": "Live currency exchange rates updated every 30 seconds"
                    }
                  },
                  {
                    "@type": "Offer", 
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Currency Conversion",
                      "description": "Instant currency conversion calculator"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service", 
                      "name": "Historical Charts",
                      "description": "Interactive currency rate charts and analytics"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <div id="app-root">
          <Header />
          {children}
        </div>
        
        {/* Analytics placeholder */}
        <noscript>
          <div style={{ display: 'none' }}>
            <img src="https://placehold.co/1x1?text=Analytics+Pixel" alt="" />
          </div>
        </noscript>
      </body>
    </html>
  );
}