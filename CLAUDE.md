# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

呈尚策划店铺数据可视化系统 - 专业的外卖平台（美团外卖 & 饿了么）数据可视化分析系统，支持 Excel/CSV 文件上传、智能数据分析和 AI 驱动的运营报告生成。

## 技术栈

- **框架**: Next.js 15.5.2 (App Router)
- **UI**: React 19.1 + TypeScript 5 + Tailwind CSS v4
- **图表**: Recharts 3.1.2
- **文件处理**: xlsx 0.18.5 + iconv-lite 0.7.0 (GBK编码支持)
- **构建工具**: Turbopack
- **部署**: Vercel (推荐) / GitHub Pages (静态导出)

## 常用命令

```bash
npm run dev          # 启动开发服务器 (Turbopack)
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # ESLint 检查
```

## 环境变量

```bash
# .env.local
NEXT_PUBLIC_AI_API_KEY=your-api-key    # AI 分析功能必需
NEXT_PUBLIC_AI_API_URL=https://...     # AI API 端点 (可选)
```

## 核心架构

### 双平台独立设计

美团外卖和饿了么各自拥有完全独立的代码路径：

| 模块 | 美团外卖 | 饿了么 |
|------|---------|--------|
| 页面 | `app/meituan/page.tsx` | `app/eleme/page.tsx` |
| 类型 | `types/index.ts` | `types/eleme.ts` |
| 数据服务 | `lib/dataService.ts` | `lib/elemeDataService.ts` |
| 文件上传 | `components/FileUpload.tsx` | `components/ElemeFileUpload.tsx` |
| 图表 | `components/Charts.tsx` | `components/ElemeCharts.tsx` |
| 统计卡片 | `components/StatsCards.tsx` | `components/ElemeStatsCards.tsx` |
| AI分析 | `components/AIAnalysisReport.tsx` | `components/ElemeAIAnalysisReport.tsx` |

### 数据流

```
文件上传 → 格式验证 → 解析处理 → 数据服务 → 状态更新 → 图表/AI分析
```

**美团数据处理链路**:
- `FileUpload.tsx` → `utils/excelParser.ts` → `lib/dataService.ts` → `utils/dataProcessor.ts`

**饿了么数据处理链路**:
- `ElemeFileUpload.tsx` (内嵌解析逻辑) → `lib/elemeDataService.ts`

### 关键差异

| 特性 | 美团外卖 | 饿了么 |
|------|---------|--------|
| 日期格式 | `YYYYMMDD` (Number) | `YYYY-MM-DD` (String) |
| 文件支持 | Excel + CSV (GBK) | 仅 Excel |
| 门店ID字段 | `门店id` (Number) | `门店编号` (String) |
| 收入字段 | `营业收入` | `收入` |
| 转化字段 | `入店人数/入店转化率` | `进店人数/进店转化率` |

## 数据格式要求

### 美团外卖 (12字段)
```
日期(YYYYMMDD), 门店名称, 门店id, 省份, 门店所在城市, 区县市,
营业收入, 曝光人数, 入店人数, 入店转化率(0-1), 下单转化率(0-1), 下单人数
```

### 饿了么 (9字段)
```
日期(YYYY-MM-DD), 门店名称, 门店编号,
收入, 曝光人数, 进店人数, 进店转化率(0-1), 下单转化率(0-1), 下单人数
```

## 开发注意事项

### 类型安全
- 禁止使用 `any` 类型，使用 `unknown` + 类型守卫
- 路径别名: `@/*` → `./src/*`

### CSV 编码处理 (仅美团)
```typescript
// utils/excelParser.ts
import iconv from 'iconv-lite';
const text = iconv.decode(buffer, 'gbk');
```

### 添加新平台
1. 创建类型定义 `types/newplatform.ts`
2. 创建数据服务 `lib/newplatformDataService.ts`
3. 创建组件集 (FileUpload, Charts, StatsCards, AIAnalysisReport)
4. 创建页面 `app/newplatform/page.tsx`
5. 更新主页 `app/page.tsx` 添加入口

### 构建配置
- Vercel: 自动检测，使用 SSR 模式
- 其他环境: 静态导出到 `out/` 目录
- 大型依赖 (recharts, xlsx) 独立分包

## 部署

### Vercel (推荐)
自动检测 `VERCEL` 环境变量，启用 SSR 和图片优化。

### GitHub Pages
推送到 `master` 分支自动触发 `.github/workflows/deploy.yml` 部署。
