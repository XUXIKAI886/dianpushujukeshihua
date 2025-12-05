'use client';

import React from 'react';
import { BarChart3, ArrowRight, Zap, Shield, Brain, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface PlatformCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  href?: string;
  available: boolean;
  features: string[];
}

function PlatformCard({ title, description, icon, gradient, iconBg, href, available, features }: PlatformCardProps) {
  const CardContent = (
    <div className={`relative overflow-hidden rounded-xl p-6 sm:p-8 ${gradient} shadow-lg hover:shadow-xl transition-all duration-300 ${available ? 'hover:scale-105 cursor-pointer' : 'opacity-75'} group`}>
      {/* 状态标签 */}
      <div className="absolute top-4 right-4">
        {available ? (
          <span className="px-2 py-1 text-xs font-medium bg-white/20 text-white rounded-full">
            可用
          </span>
        ) : (
          <span className="px-2 py-1 text-xs font-medium bg-white/20 text-white rounded-full">
            即将上线
          </span>
        )}
      </div>

      {/* 主要内容 */}
      <div className="flex flex-col h-full">
        <div className="flex items-center space-x-4 mb-4">
          <div className={`${iconBg} p-3 rounded-lg flex-shrink-0`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-white/80 text-sm sm:text-base">{description}</p>
          </div>
        </div>

        {/* 功能特性 */}
        <div className="flex-1 mb-6">
          <h4 className="text-white/90 text-sm font-medium mb-3">核心功能：</h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 text-white/80 text-sm">
                <span className="w-1.5 h-1.5 bg-white/60 rounded-full flex-shrink-0"></span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-between">
          <div className="text-white/60 text-xs">
            {available ? '立即开始分析' : '敬请期待'}
          </div>
          {available && (
            <div className="flex items-center space-x-2 text-white group-hover:translate-x-1 transition-transform">
              <span className="text-sm font-medium">进入系统</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>

      {/* 装饰性背景图案 */}
      <div className="absolute -top-8 -right-8 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-4 -left-4 w-16 sm:w-20 h-16 sm:h-20 bg-white/5 rounded-full"></div>
      
      {!available && (
        <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-[1px] rounded-xl"></div>
      )}
    </div>
  );

  return available && href ? (
    <Link href={href} className="block">
      {CardContent}
    </Link>
  ) : (
    CardContent
  );
}

export default function Home() {
  const platforms = [
    {
      title: '美团外卖数据分析',
      description: '专业的美团外卖店铺数据可视化分析系统',
      icon: <BarChart3 className="h-8 w-8 text-white" />,
      gradient: 'bg-gradient-to-br from-yellow-500 to-orange-500',
      iconBg: 'bg-white/20',
      href: '/meituan',
      available: true,
      features: [
        '6种专业可视化图表',
        'AI智能分析报告',
        '实时数据统计',
        '本地化数据处理',
        'Excel文件一键解析'
      ]
    },
    {
      title: '饿了么数据分析',
      description: '专业的饿了么店铺数据可视化分析系统',
      icon: <BarChart3 className="h-8 w-8 text-white" />,
      gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      iconBg: 'bg-white/20',
      href: '/eleme',
      available: true,
      features: [
        '6种专业可视化图表',
        'AI智能分析报告',
        '实时数据统计',
        '本地化数据处理',
        'Excel文件一键解析'
      ]
    },
    {
      title: '截图生成数据分析图',
      description: '上传店铺数据截图，AI生成专业分析图片',
      icon: <Sparkles className="h-8 w-8 text-white" />,
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
      iconBg: 'bg-white/20',
      href: '/screenshot-analysis',
      available: true,
      features: [
        'AI智能识别数据',
        '生成专业分析图',
        '一键复制/下载图片',
        '配套挽留话术',
        '提升专业形象'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* 顶部导航栏 */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">呈尚策划 数据分析平台</h1>
                <p className="text-sm text-gray-500">外卖平台数据可视化分析系统</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">呈尚策划</h1>
                <p className="text-xs text-gray-500">数据分析平台</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>系统运行正常</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 头部介绍 */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              选择您的
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                数据分析平台
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              专业的外卖平台数据可视化分析系统，帮助商家深入了解运营数据，优化经营策略
            </p>

            {/* 核心特性 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">智能分析</h3>
                <p className="text-gray-600 text-sm">AI驱动的数据分析，自动生成专业报告</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">安全可靠</h3>
                <p className="text-gray-600 text-sm">本地化数据处理，保护您的商业机密</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">专业洞察</h3>
                <p className="text-gray-600 text-sm">深度挖掘数据价值，提供运营优化建议</p>
              </div>
            </div>
          </div>
        </div>

        {/* 平台选择卡片 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {platforms.map((platform, index) => (
            <PlatformCard
              key={index}
              title={platform.title}
              description={platform.description}
              icon={platform.icon}
              gradient={platform.gradient}
              iconBg={platform.iconBg}
              href={platform.href}
              available={platform.available}
              features={platform.features}
            />
          ))}
        </div>

        {/* 底部说明 */}
        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              为什么选择呈尚策划数据分析平台？
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>专业的数据可视化图表</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>AI智能分析报告生成</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>本地化数据处理保障安全</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>一键上传Excel快速分析</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © 2025 呈尚策划. 保留所有权利. | 
              <span className="ml-2">专业的外卖平台数据分析解决方案</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
