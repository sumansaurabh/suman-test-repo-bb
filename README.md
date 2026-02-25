# CurrencyX - 实时汇率监测系统

这是一个基于 [Next.js](https://nextjs.org) 开发的实时汇率监测和货币转换应用程序。

## 主要功能

- **实时汇率监控**：监控多种货币对的实时汇率，数据每 30 秒更新一次。
- **货币转换计算器**：支持全球主流货币的即时转换，操作简便。
- **历史数据图表**：通过折线图或面积图查看不同时间范围（如 1 天、1 周、1 个月、1 年）内的汇率趋势。
- **市场摘要**：提供 24 小时涨跌幅、涨跌比例以及市场整体表现的直观展示。
- **多币种支持**：内置全球主流货币，支持自定义关注列表（即将推出）。

## 技术栈

- **框架**: [Next.js](https://nextjs.org/) (App Router)
- **UI 组件**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **图表库**: [Recharts](https://recharts.org/)
- **状态管理**: React Hooks
- **样式**: CSS Modules & Tailwind CSS

## 入门指南

首先，安装项目依赖：

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

然后，运行开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 即可查看实时汇率看板。

## 了解更多

要了解有关 Next.js 的更多信息，请查看以下资源：

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 功能和 API。
- [学习 Next.js](https://nextjs.org/learn) - 交互式 Next.js 教程。

## 部署

部署 Next.js 应用程序最简单的方法是使用 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)。

查看我们的 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多详情。

---

**免责声明**：本应用提供的汇率数据仅供参考，不构成任何投资建议。在进行外汇交易或做出财务决策前，请务必咨询专业的金融机构。
