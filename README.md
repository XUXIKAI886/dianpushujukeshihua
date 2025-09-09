# 🏪 呈尚策划 店铺数据可视化系统

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)

**专业的美团外卖店铺数据可视化分析系统**

[🚀 在线演示](https://xuxikai886.github.io/dianpushujukeshihua/) | [📖 使用文档](#使用说明) | [🛠️ 部署指南](#部署方式)

</div>

---

## ✨ 功能特性

### 🎯 核心功能
- 📊 **专业数据可视化**: 6种图表类型，全面展示运营数据
- 🤖 **AI智能分析**: 基于大模型的专业运营分析报告
- � **智能文件处理**: 支持Excel文件上传、验证和解析
- 📱 **完美响应式**: 适配桌面、平板、移动设备
- 🎨 **现代化设计**: 美观的渐变UI和流畅动画

### � 亮点功能
- **🧠 AI分析报告**: 一键生成专业运营分析和改进建议
- **📈 实时统计**: 动态计算关键业务指标
- **🎯 数据洞察**: 深度挖掘运营数据价值
- **💼 商业级体验**: 专业的数据展示和用户体验
- **� 数据安全**: 本地处理，数据不上传服务器

## 🛠️ 技术栈

### 前端技术
| 技术 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 15.5.2 | 全栈React框架，App Router |
| **React** | 19.1 | 用户界面库 |
| **TypeScript** | 5.0 | 类型安全的JavaScript |
| **Tailwind CSS** | v4 | 原子化CSS框架 |

### 数据处理
| 技术 | 版本 | 用途 |
|------|------|------|
| **Recharts** | 3.1.2 | 数据可视化图表库 |
| **xlsx** | 0.18.5 | Excel文件解析 |
| **Lucide React** | latest | 现代化图标库 |

### AI集成
| 服务 | 模型 | 用途 |
|------|------|------|
| **Gemini API** | 2.5-flash-lite | 智能数据分析 |

## 🚀 快速开始

### 📋 环境要求
- **Node.js**: 18.0+
- **包管理器**: npm / yarn / pnpm
- **浏览器**: Chrome 90+ / Firefox 88+ / Safari 14+

### 🔧 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/XUXIKAI886/dianpushujukeshihua.git
cd dianpushujukeshihua
```

2. **安装依赖**
```bash
npm install
# 或使用其他包管理器
yarn install
pnpm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 🏗️ 构建部署
```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## � 使用说明

### 🎯 基础使用流程

1. **📤 上传数据**
   - 点击上传区域或直接拖拽Excel文件
   - 支持 `.xlsx` 和 `.xls` 格式
   - 文件大小限制：10MB

2. **🔍 数据验证**
   - 自动验证文件格式和数据完整性
   - 检查必需字段和数据类型
   - 显示详细的错误提示

3. **📊 查看图表**
   - 自动生成6种专业可视化图表
   - 实时计算关键业务指标
   - 响应式图表适配不同屏幕

4. **🤖 AI分析**
   - 点击"生成分析"获取AI报告
   - 专业的运营分析和改进建议
   - 一键复制报告内容

### 📋 数据格式要求

Excel文件必须包含以下字段：

| 字段名称 | 数据类型 | 说明 |
|----------|----------|------|
| 日期 | 日期格式 | YYYY-MM-DD |
| 城市 | 文本 | 店铺所在城市 |
| 区县 | 文本 | 店铺所在区县 |
| 店铺名称 | 文本 | 店铺完整名称 |
| 营业收入 | 数字 | 当日营业收入（元） |
| 曝光人数 | 整数 | 店铺曝光人数 |
| 入店人数 | 整数 | 实际入店人数 |
| 入店转化率 | 百分比 | 入店转化率 |
| 下单转化率 | 百分比 | 下单转化率 |
| 下单人数 | 整数 | 下单人数 |
| 客单价 | 数字 | 平均客单价（元） |
| 订单数 | 整数 | 订单总数 |

### 📊 图表类型

1. **📈 营业收入趋势图** - 面积图展示收入变化
2. **👥 曝光人数趋势图** - 折线图显示曝光趋势
3. **🚪 入店人数分析图** - 柱状图分析入店情况
4. **🔄 入店转化率图** - 折线图展示转化趋势
5. **💰 下单转化率图** - 面积图显示下单转化
6. **📦 下单人数统计图** - 柱状图统计下单情况

## 🤖 AI智能分析

### 🧠 分析能力
- **运营总览**: 自动提取关键指标和时间周期
- **数据总结**: 智能汇总营业收入、曝光转化等核心数据
- **优势分析**: 识别运营亮点和竞争优势
- **劣势分析**: 发现问题和改进空间
- **改进建议**: 提供具体可操作的优化方案

### 🎨 报告格式
- **美观排版**: 现代化的视觉设计
- **清晰层次**: 结构化的信息展示
- **专业内容**: 基于运营分析框架
- **积极语调**: 鼓励性的分析语言

## 🌐 部署方式

### 🚀 一键部署

#### Vercel（推荐）
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/XUXIKAI886/dianpushujukeshihua)

#### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/XUXIKAI886/dianpushujukeshihua)

### 📦 GitHub Pages
项目已配置自动部署，推送到 `master` 分支后自动部署到 GitHub Pages。

### 🔧 手动部署
详细部署指南请参考：[DEPLOYMENT.md](./DEPLOYMENT.md)

## 🏗️ 项目结构

```
📦 dianpushujukeshihua
├── 📁 src/
│   ├── 📁 app/                 # Next.js App Router 页面
│   │   ├── 📄 page.tsx         # 主页面
│   │   ├── 📄 layout.tsx       # 布局组件
│   │   └── 📄 globals.css      # 全局样式
│   ├── 📁 components/          # React 组件
│   │   ├── 📄 FileUpload.tsx   # 文件上传组件
│   │   ├── 📄 Charts.tsx       # 图表组件
│   │   ├── 📄 StatsCards.tsx   # 统计卡片
│   │   └── 📄 AIAnalysisReport.tsx # AI分析报告
│   ├── 📁 types/               # TypeScript 类型定义
│   ├── 📁 utils/               # 工具函数
│   │   ├── 📄 excelParser.ts   # Excel解析
│   │   └── 📄 dataProcessor.ts # 数据处理
│   └── 📁 lib/                 # 库文件
├── 📁 .github/workflows/       # GitHub Actions
├── 📄 next.config.js           # Next.js 配置
├── 📄 tailwind.config.ts       # Tailwind 配置
├── 📄 package.json             # 项目依赖
└── 📄 README.md                # 项目文档
```

## � 开发指南

### 📝 开发规范
- ✅ **TypeScript**: 强类型检查，提高代码质量
- ✅ **ESLint**: 代码规范检查，统一编码风格
- ✅ **Prettier**: 代码格式化，保持一致性
- ✅ **组件化**: 模块化开发，提高复用性

### 🧪 代码质量
```bash
# 类型检查
npm run type-check

# 代码规范检查
npm run lint

# 代码格式化
npm run format
```

### � 性能优化
- **代码分割**: 自动分离第三方库
- **懒加载**: 按需加载组件
- **图片优化**: 自动WebP转换
- **缓存策略**: 静态资源缓存

## 📊 项目统计

### 📈 构建信息
- **主页面大小**: 67.7 kB
- **首次加载JS**: 317 kB
- **编译时间**: ~3.2s
- **静态页面**: 5个

### 🎯 功能覆盖
- ✅ 数据上传和验证
- ✅ 6种可视化图表
- ✅ AI智能分析报告
- ✅ 响应式设计
- ✅ 错误处理机制

## 🤝 贡献指南

### 🐛 问题反馈
遇到问题？请通过以下方式反馈：
1. [GitHub Issues](https://github.com/XUXIKAI886/dianpushujukeshihua/issues)
2. 详细描述问题和复现步骤
3. 提供错误截图或日志

### 💡 功能建议
有好的想法？欢迎提交：
1. Feature Request
2. Pull Request
3. 讨论区交流

### 🔧 开发贡献
1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 发起 Pull Request

## 📄 许可证

本项目采用 [MIT License](./LICENSE) 开源协议。

## � 致谢

感谢以下开源项目：
- [Next.js](https://nextjs.org/) - React 全栈框架
- [Recharts](https://recharts.org/) - React 图表库
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Lucide](https://lucide.dev/) - 图标库

---

<div align="center">

**🎉 如果这个项目对您有帮助，请给个 ⭐ Star 支持一下！**

© 2025 呈尚策划. 保留所有权利.

[🏠 首页](https://github.com/XUXIKAI886/dianpushujukeshihua) | [📖 文档](./docs) | [🐛 反馈](https://github.com/XUXIKAI886/dianpushujukeshihua/issues) | [💬 讨论](https://github.com/XUXIKAI886/dianpushujukeshihua/discussions)

</div>
