# CurrencyX - Real-time Exchange Monitor

CurrencyX is a modern, high-performance currency exchange rate monitor and conversion platform built with Next.js 15. It provides real-time data, historical trends, and professional trading insights.

## 🚀 Features

- **Live Exchange Rates**: Monitor global currency pairs with automatic updates every 30 seconds.
- **Conversion Calculator**: Professional-grade calculator for instant currency conversions.
- **Historical Charts**: Interactive charts to visualize currency performance over different time ranges (1D, 1W, 1M, 1Y, 5Y).
- **Market Summary**: Comprehensive overview of gainers, losers, and general market sentiment.
- **Multi-Currency Support**: Access to hundreds of global currencies via reliable API integration.
- **Responsive Design**: Fully optimized for desktop and mobile experiences.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Fetching**: Custom hooks with built-in caching mechanism.

## 🏁 Getting Started

### Prerequisites

- Node.js 20+ 
- npm / pnpm / yarn / bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sumansaurabh/suman-test-repo-bb.git
   cd suman-test-repo-bb
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your ExchangeRate-API key:
   ```env
   NEXT_PUBLIC_EXCHANGE_RATE_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🔑 API Configuration

This project uses [ExchangeRate-API](https://www.exchangerate-api.com/) for currency data. 

**Note on Security**: Never hardcode your API keys in the source code. Ensure the `NEXT_PUBLIC_EXCHANGE_RATE_API_KEY` is set in your environment variables.

## 📝 License

This project is private and for internal use.

---
Built with ❤️ for the Currency Trading Community.
