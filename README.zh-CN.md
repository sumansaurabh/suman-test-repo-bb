# 货币汇率监控应用

这是一个使用 [Next.js](https://nextjs.org) 构建的货币汇率监控应用程序。

## 功能特点

- **实时汇率查询** - 查看多种货币的实时汇率
- **货币转换计算器** - 快速进行货币金额转换
- **历史数据图表** - 查看货币汇率的历史走势
- **市场摘要** - 了解当前市场概况
- **自选货币列表** - 添加关注的货币到自选列表

## 快速开始

首先，启动开发服务器：

```bash
npm run dev
# 或者
yarn dev
# 或者
pnpm dev
# 或者
bun dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

您可以通过修改 `app/page.tsx` 文件来编辑页面。页面会自动更新。

本项目使用 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) 自动优化和加载 [Geist](https://vercel.com/font) 字体，这是 Vercel 的新字体系列。

## 了解更多

要了解更多关于 Next.js 的信息，请查看以下资源：

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 的功能和 API
- [学习 Next.js](https://nextjs.org/learn) - 交互式 Next.js 教程

您可以查看 [Next.js GitHub 仓库](https://github.com/vercel/next.js) - 欢迎您的反馈和贡献！

## 在 Vercel 上部署

部署 Next.js 应用最简单的方式是使用 Vercel 平台，这是 Next.js 创建者提供的服务。

查看我们的 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多详情。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **编程语言**: TypeScript
- **样式方案**: Tailwind CSS
- **图表库**: Recharts
- **API**: 货币汇率数据 API