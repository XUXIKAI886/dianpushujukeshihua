# 🚀 GitHub部署完整指南

## 方式一：GitHub Pages + GitHub Actions（推荐）

### 1. 配置GitHub Actions自动部署

创建GitHub Actions工作流文件：

```bash
# 在项目根目录创建
mkdir -p .github/workflows
```

创建部署配置文件：`.github/workflows/deploy.yml`

```yaml
name: Deploy Next.js to GitHub Pages

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        NODE_ENV: production
        
    - name: Export static files
      run: npm run export
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/master'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

### 2. 修改Next.js配置支持静态导出

更新 `next.config.js`：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 如果部署到子路径，需要设置basePath
  // basePath: '/dianpushujukeshihua',
  // assetPrefix: '/dianpushujukeshihua/',
}

module.exports = nextConfig
```

### 3. 添加导出脚本到package.json

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next export"
  }
}
```

### 4. 在GitHub仓库中启用Pages

1. 进入仓库设置：`Settings` → `Pages`
2. Source选择：`GitHub Actions`
3. 保存设置

### 5. 推送代码触发部署

```bash
git add .
git commit -m "feat: 配置GitHub Pages自动部署"
git push origin master
```

---

## 方式二：Vercel + GitHub集成（推荐）

### 1. 连接Vercel和GitHub

1. 访问 [Vercel](https://vercel.com)
2. 使用GitHub账号登录
3. 点击 "New Project"
4. 选择您的仓库：`XUXIKAI886/dianpushujukeshihua`

### 2. 配置部署设置

- **Framework Preset**: Next.js
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 3. 环境变量（如需要）

在Vercel项目设置中添加环境变量：
- `NODE_ENV=production`

### 4. 自动部署

- 每次推送到master分支自动部署
- 预览部署：PR会自动生成预览链接
- 生产部署：合并到master后自动部署到生产环境

---

## 方式三：Netlify + GitHub集成

### 1. 连接Netlify和GitHub

1. 访问 [Netlify](https://netlify.com)
2. 点击 "New site from Git"
3. 选择GitHub并授权
4. 选择仓库：`XUXIKAI886/dianpushujukeshihua`

### 2. 构建设置

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18

### 3. 部署配置文件

创建 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 方式四：Railway + GitHub集成

### 1. 连接Railway

1. 访问 [Railway](https://railway.app)
2. 使用GitHub登录
3. 点击 "New Project"
4. 选择 "Deploy from GitHub repo"

### 2. 配置设置

Railway会自动检测Next.js项目并配置：
- 自动安装依赖
- 自动构建和部署
- 提供HTTPS域名

---

## 🔧 部署前的准备工作

### 1. 检查项目配置

确保以下文件配置正确：

**package.json**:
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**next.config.js** (如果使用GitHub Pages):
```javascript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}
```

### 2. 环境变量管理

如果项目需要环境变量，在部署平台中设置：
- `NODE_ENV=production`
- 其他API密钥等敏感信息

### 3. 域名配置（可选）

在部署平台中可以配置自定义域名：
- Vercel: Project Settings → Domains
- Netlify: Site Settings → Domain management
- GitHub Pages: Repository Settings → Pages → Custom domain

---

## 📊 部署状态监控

### 1. 部署日志查看

- **Vercel**: 项目面板 → Deployments
- **Netlify**: Site overview → Deploys
- **GitHub Actions**: Repository → Actions tab

### 2. 性能监控

部署后可以使用以下工具监控：
- Vercel Analytics
- Google PageSpeed Insights
- GTmetrix

---

## 🚨 常见问题解决

### 1. 构建失败

```bash
# 本地测试构建
npm run build

# 检查依赖
npm audit
npm update
```

### 2. 静态资源路径问题

如果部署到子路径，需要配置basePath：

```javascript
// next.config.js
const nextConfig = {
  basePath: '/your-repo-name',
  assetPrefix: '/your-repo-name/',
}
```

### 3. 图片优化问题

GitHub Pages不支持Next.js图片优化：

```javascript
// next.config.js
const nextConfig = {
  images: {
    unoptimized: true
  }
}
```

---

## 🎯 推荐部署方案

**对于您的项目，推荐使用Vercel**：

1. ✅ 零配置部署
2. ✅ 自动HTTPS
3. ✅ 全球CDN
4. ✅ 自动预览部署
5. ✅ 完美支持Next.js
6. ✅ 免费额度充足

**部署步骤**：
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub登录
3. 导入仓库 `XUXIKAI886/dianpushujukeshihua`
4. 点击Deploy
5. 几分钟后获得在线地址

部署完成后，您将获得：
- 生产环境URL：`https://your-project.vercel.app`
- 自动SSL证书
- 全球CDN加速
- 自动部署更新
