# CurrencyX - 实时汇率监控器

CurrencyX 是一个基于 Next.js 构建的现代实时汇率监控和转换应用。它提供实时的汇率数据、历史趋势图表以及强大的货币转换工具，旨在为用户提供专业级的交易洞察。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## ✨ 功能特点

*   **实时仪表盘**: 
    *   监控自定义的基础货币和多个目标货币。
    *   实时更新汇率数据（每 30 秒自动刷新）。
    *   市场概览，包括涨跌幅统计（上涨/下跌家数）。
*   **货币转换器**: 
    *   直观的货币转换计算器，支持多种货币。
*   **历史趋势图表**: 
    *   交互式折线图，展示货币对的历史汇率走势。
    *   支持多种时间范围选择（如 1个月等）。
*   **用户体验**: 
    *   **离线模式**: 网络断开时自动切换到演示/离线数据，保证应用可用性。
    *   **响应式设计**: 完美适配桌面和移动设备。
    *   **现代化 UI**: 基于 Radix UI 和 Tailwind CSS 构建的美观界面。

## 🛠️ 技术栈

*   **框架**: [Next.js 15](https://nextjs.org/) (App Router)
*   **语言**: [TypeScript](https://www.typescriptlang.org/)
*   **样式**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI 组件库**: [Radix UI](https://www.radix-ui.com/) / [shadcn/ui](https://ui.shadcn.com/)
*   **图表**: [Recharts](https://recharts.org/)
*   **图标**: [Lucide React](https://lucide.dev/)
*   **状态管理**: React Hooks (useExchangeRates, useHistoricalData)

## 🚀 快速开始

### 环境要求

*   Node.js 18+ 
*   npm 或 yarn / pnpm

### 安装步骤

1.  克隆仓库:
    ```bash
    git clone https://github.com/sumansaurabh/suman-test-repo-bb.git
    cd suman-test-repo-bb
    ```

2.  安装依赖:
    ```bash
    npm install
    # 或者
    yarn install
    # 或者
    pnpm install
    ```

3.  启动开发服务器:
    ```bash
    npm run dev
    ```

4.  在浏览器中访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## ⚙️ 配置

本项目默认使用演示数据或公共 API。如果您需要生产环境数据，请在 `src/lib/currency-api.ts` 中配置您的 API 密钥：

```typescript
// src/lib/currency-api.ts
const API_KEY = 'your_api_key_here'; // 替换为您的 ExchangeRate-API 密钥
```

推荐使用环境变量来管理 API 密钥。

## 📜 许可证

本项目采用 MIT 许可证。