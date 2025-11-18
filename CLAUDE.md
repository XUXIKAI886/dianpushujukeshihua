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
- **部署**: 静态导出 (GitHub Pages)

## 常用命令

### 开发
```bash
npm run dev              # 启动开发服务器 (使用 Turbopack)
```

### 构建和部署
```bash
npm run build            # 构建生产版本 (静态导出到 out/ 目录)
npm run start            # 启动生产服务器
```

### 代码质量
```bash
npm run lint             # 运行 ESLint 检查
```

## 核心架构

### 双平台架构设计
项目采用双平台独立设计，美团外卖和饿了么各自拥有独立的：
- **页面路由**: `/meituan/page.tsx` 和 `/eleme/page.tsx`
- **组件**: `FileUpload.tsx` vs `ElemeFileUpload.tsx`
- **类型定义**: `types/index.ts` vs `types/eleme.ts`
- **数据服务**: `lib/dataService.ts` vs `lib/elemeDataService.ts`
- **解析器**: `utils/excelParser.ts` vs `utils/elemeExcelParser.ts`

### 数据流架构
```
用户上传文件 (Excel/CSV)
    ↓
文件验证 (validateFileType, validateFileSize)
    ↓
文件解析 (parseExcelFile / CSV特殊处理)
    ↓
数据处理服务 (DataService.processData)
    ↓
├─ processExcelData (数据转换)
├─ calculateStats (统计计算)
└─ extractStoreInfo (门店信息提取)
    ↓
状态更新 → 图表渲染 → AI分析
```

### 关键模块说明

#### 1. 文件解析 (`utils/excelParser.ts` & `utils/elemeExcelParser.ts`)
- **Excel解析**: 使用 `xlsx` 库的 `sheet_to_json` 方法
- **CSV解析**: 特殊处理 GBK 编码，使用 `iconv-lite` 转换
- **数据验证**:
  - 日期格式：美团使用 YYYYMMDD (数字)，饿了么使用 YYYY-MM-DD (文本)
  - 转化率范围：0-1 之间的小数
  - 必需字段检查：12个字段完整性验证
- **数据排序**: 自动按日期排序

#### 2. 数据服务层 (`lib/dataService.ts` & `lib/elemeDataService.ts`)
- **processData**: 主数据处理流程，返回 AppState
- **validateDataIntegrity**: 数据完整性验证，检查门店一致性、日期连续性、异常值
- **getDataSummary**: 提取数据摘要（日期范围、平均指标）
- **exportProcessedData**: 支持导出 JSON/CSV 格式

#### 3. 图表渲染 (`components/Charts.tsx` & `components/ElemeCharts.tsx`)
6种图表类型：
- 营业收入趋势图 (AreaChart)
- 曝光人数趋势图 (LineChart)
- 入店人数分析图 (BarChart)
- 入店转化率图 (LineChart)
- 下单转化率图 (AreaChart)
- 下单人数统计图 (BarChart)

所有图表使用 `ResponsiveContainer` 实现自适应布局。

#### 4. AI分析 (`components/AIAnalysisReport.tsx` & `components/ElemeAIAnalysisReport.tsx`)
- **API**: Google Gemini 2.5-flash-lite
- **分析维度**: 运营总览、数据总结、优势分析、劣势分析、改进建议
- **平台定制**: 针对美团和饿了么的不同特点提供专业分析

## 数据格式要求

### 美团外卖数据格式
必需字段（Excel/CSV）:
- `日期` (Number, YYYYMMDD格式，如 20250831)
- `门店名称` (String)
- `门店id` (Number)
- `省份` (String)
- `门店所在城市` (String)
- `区县市` (String)
- `营业收入` (Number)
- `曝光人数` (Number)
- `入店人数` (Number)
- `入店转化率` (Number, 0-1)
- `下单转化率` (Number, 0-1)
- `下单人数` (Number)

### 饿了么数据格式
必需字段（Excel）:
- `日期` (String, YYYY-MM-DD格式)
- `门店名称` (String)
- `门店编号` (String)
- `收入` (Number)
- `曝光人数` (Number)
- `进店人数` (Number)
- `进店转化率` (Number, 0-1)
- `下单转化率` (Number, 0-1)
- `下单人数` (Number)

## 重要配置

### Next.js 配置 (`next.config.js`)
- **静态导出**: `output: 'export'` 用于 GitHub Pages 部署
- **代码分割**: 针对 `recharts` 和 `xlsx` 进行独立分包优化
- **性能优化**:
  - 生产环境移除 console.log (保留 error/warn)
  - 包优化 `optimizePackageImports: ['recharts', 'lucide-react']`
  - 图片优化 WebP/AVIF 格式
- **安全头部**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`

### TypeScript 配置
- 严格模式启用
- 路径别名: `@/*` → `./src/*`
- ESLint 规则: 禁止使用 `any` 类型 (使用 `unknown` + 类型守卫)

## 开发注意事项

### 添加新平台支持
如需添加新的外卖平台（如抖音外卖）：
1. 创建独立类型定义 `src/types/newplatform.ts`
2. 创建解析器 `src/utils/newplatformExcelParser.ts`
3. 创建数据服务 `src/lib/newplatformDataService.ts`
4. 创建组件集：
   - `components/NewPlatformFileUpload.tsx`
   - `components/NewPlatformCharts.tsx`
   - `components/NewPlatformStatsCards.tsx`
   - `components/NewPlatformAIAnalysisReport.tsx`
5. 创建页面路由 `src/app/newplatform/page.tsx`
6. 更新主页 `src/app/page.tsx` 添加平台卡片

### CSV 编码处理
- 美团外卖 CSV 文件通常使用 GBK 编码
- 使用 `iconv-lite` 库进行编码转换：`iconv.decode(buffer, 'gbk')`
- 解析后数据必须按日期排序：`data.sort((a, b) => a.日期 - b.日期)`

### 性能优化原则
1. **动态导入**: `xlsx` 库使用动态导入减少初始包大小
2. **数据验证**: 在解析过程中过滤无效行，避免后续处理错误
3. **图表优化**: 使用 `ResponsiveContainer` 避免重复渲染
4. **代码分割**: 大型依赖（recharts, xlsx）独立分包

### 类型安全
- 禁止使用 `any` 类型
- 使用 `unknown` 类型 + 类型守卫进行安全的类型转换
- 所有组件必须定义完整的 Props 接口

### AI 分析功能
- API Key 应通过环境变量 `GEMINI_API_KEY` 配置
- 目前使用 Gemini 2.5-flash-lite 模型
- 分析提示词针对平台特点定制（参考 `AIAnalysisReport.tsx`）

## 部署说明

项目支持多平台部署，配置会自动适配：

### Vercel 部署（推荐）
Vercel 提供最佳性能和开发体验：

1. **一键部署**：
   - 访问 [Vercel Dashboard](https://vercel.com/new)
   - 导入 GitHub 仓库
   - 自动检测 Next.js 并部署

2. **环境变量配置**（如需 AI 分析功能）：
   - 在 Vercel 项目设置中添加 `GEMINI_API_KEY`

3. **自动检测**：
   - 配置会自动检测 `VERCEL` 环境变量
   - Vercel 上使用服务端渲染模式
   - 启用图片优化功能
   - 区域设置为香港（`hkg1`）以获得更快的访问速度

### GitHub Pages 部署
项目配置了自动部署工作流 (`.github/workflows/deploy.yml`):
- 推送到 `master` 分支自动触发
- 构建静态文件到 `out/` 目录
- 部署到 GitHub Pages
- 自动使用静态导出模式

### 手动构建部署
```bash
npm run build            # 自动检测环境并构建
# Vercel 环境: 服务端渲染构建
# 其他环境: 生成静态文件到 out/ 目录
```

## 故障排查

### Excel/CSV 文件解析失败
1. 检查文件编码（CSV 文件应为 GBK 或 UTF-8）
2. 验证必需字段是否完整
3. 检查日期格式是否符合规范
4. 查看控制台日志中的具体错误行号

### 图表不显示
1. 确认数据格式正确（参考 `ProcessedData` 接口）
2. 检查数据是否为空数组
3. 验证日期字段格式（应为 MM-DD 格式字符串）

### 构建失败
1. 检查 TypeScript 类型错误
2. 确认所有导入路径正确（使用 `@/` 别名）
3. 验证 ESLint 规则合规性（禁止 `any` 类型）
