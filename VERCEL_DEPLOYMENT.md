# 🚀 Vercel 部署指南

## 快速部署步骤

### 方法一：一键部署（推荐）

1. **点击部署按钮**

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/XUXIKAI886/dianpushujukeshihua)

2. **配置项目**
   - 登录或注册 Vercel 账号
   - 授权访问 GitHub 仓库
   - 项目会自动检测为 Next.js 应用

3. **完成部署**
   - 点击 "Deploy" 按钮
   - 等待构建完成（约 1-2 分钟）
   - 访问自动生成的域名

### 方法二：从 Vercel Dashboard 部署

1. **登录 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

3. **配置构建设置**（通常自动检测，无需修改）
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: (默认)
   Install Command: npm install
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成

## 环境变量配置（必需 - AI 分析功能）

⚠️ **重要**：AI 分析功能需要配置 API Key，否则功能将无法使用。

### 在 Vercel 中配置环境变量

1. **进入项目设置**
   - 部署成功后，进入项目 Dashboard
   - 点击 Settings → Environment Variables

2. **添加必需的环境变量**

   **变量 1：AI API Key（必需）**
   ```
   Name: NEXT_PUBLIC_AI_API_KEY
   Value: sk-AHP64E0ntf5VEltYLSV17wTLYeV4WZ3ucJzf72u0UHXf0Hos
   ```

   **变量 2：AI API URL（可选）**
   ```
   Name: NEXT_PUBLIC_AI_API_URL
   Value: https://jeniya.top/v1/chat/completions
   ```

3. **选择环境**
   - ✅ Production（生产环境）
   - ✅ Preview（预览环境）
   - ✅ Development（开发环境）
   - 建议全部选中

4. **保存并重新部署**
   - 点击 "Save" 保存变量
   - 进入 Deployments 页面
   - 点击最新部署的 "..." → "Redeploy"
   - 或者推送新代码触发自动部署

### 验证环境变量

部署完成后，访问你的应用：
1. 上传数据文件
2. 点击 "生成 AI 分析报告" 按钮
3. 如果配置正确，应该能看到 AI 生成的分析报告
4. 如果看到 "API Key 未配置" 错误，说明环境变量未生效，需要检查配置

## 自定义域名（可选）

1. 进入项目设置：Settings → Domains
2. 添加你的域名
3. 按照提示配置 DNS 记录
4. 等待 SSL 证书自动生成

## 自动部署设置

项目已配置自动部署：

- **推送到主分支**：每次推送到 `master` 或 `main` 分支时自动部署到生产环境
- **Pull Request**：每个 PR 都会生成预览部署链接
- **分支部署**：可以为不同分支配置不同的部署环境

## 性能优化配置

项目已针对 Vercel 进行优化：

### 1. 自动检测配置
- ✅ 在 Vercel 上使用服务端渲染（最佳性能）
- ✅ 在其他平台自动切换到静态导出
- ✅ 图片优化在 Vercel 上自动启用

### 2. 区域设置
- 默认区域：香港 (`hkg1`)
- 适合中国大陆及亚太地区访问
- 可在 `vercel.json` 中修改区域

### 3. 缓存策略
- 静态资源：1 年缓存
- Next.js 静态资源：永久缓存
- HTML 页面：无缓存，即时更新

### 4. 安全头部
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## 常见问题

### Q1: 构建失败怎么办？
**A:** 检查构建日志：
1. 进入部署详情页面
2. 查看 "Building" 步骤的日志
3. 常见问题：
   - TypeScript 类型错误
   - 依赖安装失败
   - 环境变量缺失

### Q2: 如何查看部署日志？
**A:**
1. 进入项目 Dashboard
2. 点击具体的部署记录
3. 查看详细的构建和运行日志

### Q3: 如何回滚到之前的版本？
**A:**
1. 进入 Deployments 页面
2. 找到想要回滚的版本
3. 点击 "..." → "Promote to Production"

### Q4: 部署后访问速度慢？
**A:**
1. 检查 `vercel.json` 中的 `regions` 设置
2. 可以添加多个区域：
   ```json
   "regions": ["hkg1", "sin1", "icn1"]
   ```
3. 亚太地区推荐：
   - `hkg1`: 香港
   - `sin1`: 新加坡
   - `icn1`: 首尔

### Q5: 如何启用自定义错误页面？
**A:**
项目使用 Next.js App Router，错误页面已自动处理。
如需自定义，可以在 `src/app/` 下添加：
- `error.tsx` - 错误页面
- `not-found.tsx` - 404 页面
- `loading.tsx` - 加载页面

## 监控和分析

### Vercel Analytics（推荐）

1. **启用 Analytics**
   - 进入项目 Settings → Analytics
   - 启用 Web Analytics
   - 查看访问统计、性能指标

2. **Speed Insights**
   - 自动启用
   - 查看 Core Web Vitals 指标
   - 优化页面性能

### 自定义监控

可以集成第三方监控服务：
- Google Analytics
- Sentry（错误追踪）
- Vercel Web Analytics

## 成本说明

### 免费计划
- ✅ 无限部署
- ✅ 100GB 带宽/月
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 预览部署

### 超出免费额度
- 带宽超出：$40/100GB
- 可升级到 Pro 计划（$20/月）

## 技术支持

- 📖 [Vercel 官方文档](https://vercel.com/docs)
- 💬 [Vercel 社区](https://github.com/vercel/vercel/discussions)
- 🐛 [问题反馈](https://github.com/XUXIKAI886/dianpushujukeshihua/issues)

## 最佳实践

1. **环境分离**
   - Production: 生产环境
   - Preview: PR 预览
   - Development: 本地开发

2. **性能监控**
   - 定期检查 Speed Insights
   - 关注 Core Web Vitals 指标
   - 优化大型依赖包

3. **安全更新**
   - 启用 Vercel 的依赖更新提醒
   - 定期更新 Next.js 和依赖包
   - 检查安全漏洞

4. **备份策略**
   - 所有代码托管在 GitHub
   - Vercel 自动保留历史部署
   - 可随时回滚到任意版本

---

**部署成功后，你的应用将获得：**
- ⚡ 全球 CDN 加速
- 🔒 自动 HTTPS 证书
- 🚀 零配置部署
- 📊 性能分析工具
- 🔄 自动持续部署
