# 货币汇率监控平台

一个基于 Next.js 15 构建的实时货币汇率监控与转换应用，支持 55+ 种货币的实时汇率查询、历史走势图表和货币转换计算。

## 功能特性

- **实时汇率监控** — 支持 55+ 种全球货币，每 30 秒自动更新
- **货币转换计算器** — 快速准确的货币兑换计算
- **历史走势图表** — 支持多种时间范围（1天、1周、1月、3月、6月、1年）
- **市场概览** — 汇率摘要与市场分析
- **响应式设计** — 完美适配桌面端与移动端

## 技术栈

- **框架**: [Next.js](https://nextjs.org) 15.3.2（App Router）
- **语言**: TypeScript
- **UI 组件**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **图表**: [Recharts](https://recharts.org/) 2.15
- **样式**: [Tailwind CSS](https://tailwindcss.com/) 4.1
- **表单**: React Hook Form + Zod 校验
- **数据源**: ExchangeRate-API

## 项目结构

```
src/
├── app/                    # Next.js 应用目录
│   ├── api/                # API 路由
│   │   ├── currencies/     # 货币列表接口
│   │   ├── exchange-rates/ # 实时汇率接口
│   │   └── historical/     # 历史数据接口
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 主仪表盘页面
├── components/
│   ├── currency/           # 货币相关组件
│   │   ├── ConversionCalculator.tsx  # 转换计算器
│   │   ├── CurrencySelector.tsx      # 货币选择器
│   │   ├── ExchangeRateCard.tsx      # 汇率卡片
│   │   ├── MarketSummary.tsx         # 市场概览
│   │   └── RateChart.tsx             # 汇率图表
│   ├── layout/             # 布局组件
│   └── ui/                 # shadcn/ui 基础组件
├── hooks/                  # 自定义 React Hooks
│   ├── use-currency-converter.ts  # 货币转换逻辑
│   ├── use-exchange-rates.ts      # 汇率数据获取
│   └── use-historical-data.ts     # 历史数据获取
├── lib/                    # 工具函数
│   ├── currency-api.ts     # API 客户端（含缓存）
│   └── currency-utils.ts   # 货币相关工具函数
└── types/
    └── currency.ts         # TypeScript 类型定义
```

## 快速开始

### 环境要求

- Node.js 18+
- npm / yarn / pnpm / bun

### 安装与运行

1. 安装依赖：

```bash
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

3. 在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm run start
```

## API 接口

| 接口路径 | 说明 |
|---------|------|
| `GET /api/currencies` | 获取支持的货币列表 |
| `GET /api/exchange-rates` | 获取实时汇率数据 |
| `GET /api/historical` | 获取历史汇率数据 |

## 了解更多

- [Next.js 文档](https://nextjs.org/docs) — 了解 Next.js 的功能与 API
- [Next.js 交互式教程](https://nextjs.org/learn) — 通过实践学习 Next.js
- [Recharts 文档](https://recharts.org/) — 图表库使用指南
- [shadcn/ui 文档](https://ui.shadcn.com/) — UI 组件库参考

## 部署

推荐使用 [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) 部署 Next.js 应用。

详情请参阅 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying)。
