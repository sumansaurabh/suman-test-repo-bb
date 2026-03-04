# CurrencyX - Real-time Exchange Monitor

CurrencyX is a modern, real-time currency exchange monitoring application built with Next.js. It provides users with live exchange rates, historical data charts, and conversion tools in a professional dashboard interface.

## Features

- **Real-time Dashboard**: Monitor live exchange rates with automatic updates every 30 seconds.
- **Market Summary**: View top gainers, losers, and overall market statistics at a glance.
- **Interactive Charts**: Visualize historical currency data with customizable time ranges and chart types.
- **Conversion Calculator**: Quickly convert between different currencies using real-time rates.
- **Multi-Currency Support**: Select a base currency and monitor multiple target currencies simultaneously.
- **Responsive Design**: Fully responsive interface optimized for both desktop and mobile devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: React Hooks (useState, useEffect)

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sumansaurabh/suman-test-repo-bb.git
   cd suman-test-repo-bb
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
/src
  /app           # Next.js App Router pages and API routes
  /components    # Reusable UI components
    /currency    # Currency-specific components (Calculator, Charts, etc.)
    /layout      # Layout components (Header, etc.)
    /ui          # Shadcn UI primitive components
  /hooks         # Custom React hooks for data fetching
  /lib           # Utility functions and API helpers
  /types         # TypeScript type definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
