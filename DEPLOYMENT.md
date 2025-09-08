# 🚀 部署说明

## 📦 项目已成功上传到GitHub

**仓库地址：** https://github.com/XUXIKAI886/dianpushujukeshihua.git

## 🔧 本地开发

### 环境要求
- Node.js 18.0+
- npm/yarn/pnpm

### 安装和运行
```bash
# 克隆仓库
git clone https://github.com/XUXIKAI886/dianpushujukeshihua.git
cd dianpushujukeshihua

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## 🌐 在线部署选项

### 1. Vercel部署（推荐）
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/XUXIKAI886/dianpushujukeshihua.git)

**步骤：**
1. 访问 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入GitHub仓库：`XUXIKAI886/dianpushujukeshihua`
4. 自动部署完成

**优势：**
- 自动CI/CD
- 全球CDN加速
- 免费SSL证书
- 零配置部署

### 2. Netlify部署
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/XUXIKAI886/dianpushujukeshihua)

**步骤：**
1. 访问 [Netlify](https://netlify.com)
2. 连接GitHub账户
3. 选择仓库并部署

### 3. Railway部署
```bash
# 安装Railway CLI
npm install -g @railway/cli

# 登录并部署
railway login
railway init
railway up
```

### 4. 自建服务器部署
```bash
# 在服务器上克隆项目
git clone https://github.com/XUXIKAI886/dianpushujukeshihua.git
cd dianpushujukeshihua

# 安装依赖并构建
npm install
npm run build

# 使用PM2管理进程
npm install -g pm2
pm2 start npm --name "chengshang-data-viz" -- start
pm2 save
pm2 startup
```

## 🔄 持续集成

### GitHub Actions（可选）
创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Production

on:
  push:
    branches: [ master ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📊 项目特性

### 技术栈
- **前端框架**：Next.js 15.5 (App Router)
- **UI库**：React 19.1
- **类型系统**：TypeScript 5
- **样式框架**：Tailwind CSS v4
- **图表库**：Recharts 3.1.2
- **文件处理**：xlsx 0.18.5

### 核心功能
- ✅ Excel文件上传和解析
- ✅ 6种专业数据可视化图表
- ✅ 响应式设计
- ✅ 实时数据统计
- ✅ 本地化数据处理

### 性能优化
- 代码分割和懒加载
- 图片优化和WebP支持
- 静态资源缓存
- 包大小优化

## 🔒 安全特性

- 本地数据处理，不上传服务器
- 严格的文件格式验证
- HTTPS强制重定向
- 安全头部配置

## 📱 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge
- 移动端浏览器

## 📞 技术支持

如有部署问题，请：
1. 检查Node.js版本是否符合要求
2. 确认所有依赖正确安装
3. 查看构建日志排查错误
4. 联系技术支持

---

🎉 **部署完成后，您的呈尚策划店铺数据可视化系统就可以在线访问了！**
