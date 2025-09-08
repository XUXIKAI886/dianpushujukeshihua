# 📊 呈尚策划 店铺数据可视化系统

一个专门针对美团外卖等平台营业数据的智能可视化分析系统，为餐饮商家提供专业的数据洞察和决策支持。

## ✨ 核心特性

- **🚀 一键上传**：支持Excel文件拖拽上传，操作简单便捷
- **📈 智能分析**：自动解析数据并生成6种专业图表
- **⚡ 实时洞察**：即时计算关键业务指标和趋势分析
- **🔒 安全可靠**：本地化数据处理，保护商业机密
- **📱 响应式设计**：完美适配桌面端、平板和移动端

## 🛠️ 技术栈

### 前端技术
- **框架**：Next.js 15.5 (App Router)
- **UI库**：React 19.1
- **类型系统**：TypeScript 5
- **样式框架**：Tailwind CSS v4
- **图标库**：Lucide React
- **构建工具**：Turbopack

### 数据处理
- **图表库**：Recharts 3.1.2
- **Excel解析**：xlsx 0.18.5
- **数据处理**：原生JavaScript

## 🚀 快速开始

### 环境要求
- Node.js 18.0+
- npm/yarn/pnpm

### 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发模式
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本
```bash
npm run build
npm run start
```

## 📋 数据格式要求

### Excel文件结构
系统支持包含以下字段的Excel文件：

| 字段名称 | 数据类型 | 格式要求 | 示例 |
|---------|---------|---------|------|
| 日期 | Number | YYYYMMDD | 20240101 |
| 门店名称 | String | 文本 | "XX餐厅" |
| 门店id | Number | 数字 | 12345 |
| 省份 | String | 文本 | "北京市" |
| 门店所在城市 | String | 文本 | "北京市" |
| 区县市 | String | 文本 | "朝阳区" |
| 营业收入 | Number | 数字 | 1500.50 |
| 曝光人数 | Number | 整数 | 1000 |
| 入店人数 | Number | 整数 | 150 |
| 入店转化率 | Number | 小数 | 0.15 |
| 下单转化率 | Number | 小数 | 0.80 |
| 下单人数 | Number | 整数 | 120 |

### 文件要求
- **格式**：支持 .xlsx 和 .xls 格式
- **大小**：最大 10MB
- **编码**：UTF-8

## 📊 功能模块

### 1. 文件上传
- 拖拽上传支持
- 实时文件验证
- 上传进度显示
- 错误提示反馈

### 2. 数据统计
- 总营业收入统计
- 总曝光人数统计
- 总入店人数统计
- 总下单人数统计
- 平均转化率计算

### 3. 可视化图表
- 营业收入趋势图（面积图）
- 曝光人数趋势图（折线图）
- 入店人数分析图（柱状图）
- 入店转化率趋势图（折线图）
- 下单转化率分析图（面积图）
- 下单人数统计图（柱状图）

## 🎨 设计规范

### 色彩系统
- **主色调**：蓝色系 (#3B82F6 - #1E40AF)
- **成功色**：绿色 (#10B981)
- **警告色**：橙色 (#F59E0B)
- **错误色**：红色 (#EF4444)
- **信息色**：紫色 (#8B5CF6)

### 响应式断点
- **移动端**：< 640px
- **平板端**：640px - 1024px
- **桌面端**：> 1024px

## 🔧 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React组件
│   ├── Charts.tsx         # 图表组件
│   ├── FileUpload.tsx     # 文件上传组件
│   ├── StatsCards.tsx     # 统计卡片组件
│   └── Notification.tsx   # 通知组件
├── lib/                   # 业务逻辑
│   └── dataService.ts     # 数据服务
├── types/                 # TypeScript类型定义
│   └── index.ts
└── utils/                 # 工具函数
    ├── dataProcessor.ts   # 数据处理
    └── excelParser.ts     # Excel解析
```

## 🚀 部署

### Vercel部署（推荐）
1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 自动部署完成

### 其他平台
- Netlify
- Railway
- 自建服务器

## 📈 性能优化

- **代码分割**：动态导入大型库
- **图片优化**：WebP格式支持
- **缓存策略**：静态资源缓存
- **包大小优化**：Tree-shaking和压缩

## 🔒 安全特性

- **本地处理**：数据不上传服务器
- **文件验证**：严格的文件格式检查
- **内存清理**：及时清理敏感数据
- **HTTPS支持**：生产环境强制HTTPS

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

- 项目主页：[GitHub Repository](https://github.com/your-username/meituan-data-viz)
- 问题反馈：[Issues](https://github.com/your-username/meituan-data-viz/issues)
- 邮箱：your-email@example.com

---

© 2025 呈尚策划. 保留所有权利.
