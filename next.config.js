/** @type {import('next').NextConfig} */
const nextConfig = {
  // 部署平台自动检测
  // Vercel: 使用服务端渲染 (默认)
  // 其他: 使用静态导出
  output: process.env.VERCEL ? undefined : 'export',
  trailingSlash: true,
  
  // 启用实验性功能
  experimental: {
    // 优化包大小
    optimizePackageImports: ['recharts', 'lucide-react'],
  },
  
  // 编译器优化
  compiler: {
    // 移除console.log (仅在生产环境)
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  // 图片优化
  images: {
    // Vercel 支持图片优化，其他平台使用 unoptimized
    unoptimized: !process.env.VERCEL,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // 压缩配置
  compress: true,
  
  // 性能优化
  poweredByHeader: false,
  
  // 静态文件优化
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // Webpack配置优化
  webpack: (config, { dev, isServer }) => {
    // 生产环境优化
    if (!dev && !isServer) {
      // 代码分割优化
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          recharts: {
            test: /[\\/]node_modules[\\/]recharts[\\/]/,
            name: 'recharts',
            chunks: 'all',
            priority: 10,
          },
          xlsx: {
            test: /[\\/]node_modules[\\/]xlsx[\\/]/,
            name: 'xlsx',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }
    
    return config;
  },
  
  // 头部优化
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // 注释：允许在 iframe/webview 中显示（用于 Tauri 应用）
          // SAMEORIGIN: 允许同源页面嵌入
          // 如需完全禁止嵌入，改为 'DENY'
          // {
          //   key: 'X-Frame-Options',
          //   value: 'SAMEORIGIN',
          // },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
