# CurrencyX - 实时汇率监测系统

这是一个使用 [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) 引导的 [Next.js](https://nextjs.org) 项目。CurrencyX 提供实时汇率监控、货币转换计算和历史趋势图表。

## 功能特点

- **实时汇率监控**: 每 30 秒更新一次全球主流货币汇率。
- **货币转换器**: 快速计算不同货币之间的兑换金额。
- **历史数据图表**: 可视化查看货币对的历史汇率走势（支持 1天、1周、1个月等多种时间范围）。
- **市场概览**: 快速查看市场的涨跌分布和关键货币动态。

## 入门指南

首先，运行开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

使用浏览器打开 [http://localhost:3000](http://localhost:3000) 查看结果。

你可以通过修改 `app/page.tsx` 开始编辑页面。当你修改文件时，页面会自动更新。

本项目使用 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) 来自动优化并加载 [Geist](https://vercel.com/font)（Vercel 推出的一款新字体系列）。

## 了解更多

欲了解更多关于 Next.js 的信息，请查看以下资源：

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 的功能和 API。
- [学习 Next.js](https://nextjs.org/learn) - 交互式 Next.js 教程。

你可以查看 [Next.js GitHub 仓库](https://github.com/vercel/next.js) - 欢迎提供反馈和贡献！

## 在 Vercel 上部署

部署 Next.js 应用最简单的方法是使用 Next.js 开发者提供的 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)。

查看我们的 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多细节。
