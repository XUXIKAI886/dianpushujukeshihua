'use client';

import React from 'react';
import { DollarSign, Eye, Users, ShoppingCart, Store, Calendar } from 'lucide-react';
import { ElemeStatsData, ElemeStoreInfo } from '@/types/eleme';

interface ElemeStatsCardsProps {
  stats: ElemeStatsData;
  storeInfo?: ElemeStoreInfo | null;
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
}

// 格式化货币
const formatCurrency = (value: number) => {
  return `¥${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

// 格式化数字
const formatNumber = (value: number) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 格式化百分比
const formatPercentage = (value: number) => {
  return `${(value * 100).toFixed(2)}%`;
};

function StatCard({ title, value, subtitle, icon, gradient, iconBg }: StatCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl p-4 sm:p-6 ${gradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-xs sm:text-sm font-medium mb-1 truncate">{title}</p>
          <p className="text-white text-lg sm:text-2xl font-bold mb-1 sm:mb-2 break-words">{value}</p>
          <p className="text-white/70 text-xs truncate">{subtitle}</p>
        </div>
        <div className={`${iconBg} p-2 sm:p-3 rounded-lg flex-shrink-0 ml-2`}>
          {icon}
        </div>
      </div>

      {/* 装饰性背景图案 */}
      <div className="absolute -top-4 -right-4 w-16 sm:w-24 h-16 sm:h-24 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-2 -left-2 w-12 sm:w-16 h-12 sm:h-16 bg-white/5 rounded-full"></div>
    </div>
  );
}

export default function ElemeStatsCards({ stats, storeInfo }: ElemeStatsCardsProps) {
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const statsConfig = [
    {
      title: '总收入',
      value: formatCurrency(stats.totalRevenue),
      subtitle: `日均 ${formatCurrency(stats.avgDailyRevenue)}`,
      icon: <DollarSign className="h-6 w-6 text-white" />,
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      iconBg: 'bg-white/20'
    },
    {
      title: '总曝光人数',
      value: formatNumber(stats.totalExposure),
      subtitle: `日均 ${formatNumber(stats.avgDailyExposure)}`,
      icon: <Eye className="h-6 w-6 text-white" />,
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
      iconBg: 'bg-white/20'
    },
    {
      title: '总进店人数',
      value: formatNumber(stats.totalVisits),
      subtitle: `平均转化率 ${formatPercentage(stats.avgVisitConversionRate)}`,
      icon: <Users className="h-6 w-6 text-white" />,
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
      iconBg: 'bg-white/20'
    },
    {
      title: '总下单人数',
      value: formatNumber(stats.totalOrders),
      subtitle: `平均转化率 ${formatPercentage(stats.avgOrderConversionRate)}`,
      icon: <ShoppingCart className="h-6 w-6 text-white" />,
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
      iconBg: 'bg-white/20'
    }
  ];

  return (
    <div className="w-full">
      {/* 店铺信息和数据概览标题 */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">数据概览</h2>
            <p className="text-gray-600">
              基于 {stats.dataCount} 天的营业数据统计
            </p>
          </div>

          {/* 店铺信息卡片 */}
          {storeInfo && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 lg:p-6 shadow-sm min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* 店铺名称 */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg flex-shrink-0">
                    <Store className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-1">店铺名称</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{storeInfo.name}</p>
                  </div>
                </div>

                {/* 分析日期 */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-lg flex-shrink-0">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-1">分析日期</p>
                    <p className="text-sm font-semibold text-gray-900">{getCurrentDate()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsConfig.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            gradient={stat.gradient}
            iconBg={stat.iconBg}
          />
        ))}
      </div>

      {/* 额外的洞察信息 */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">转化漏斗</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">曝光人数</span>
              <span className="font-medium">{formatNumber(stats.totalExposure)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">进店人数</span>
              <span className="font-medium">{formatNumber(stats.totalVisits)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">下单人数</span>
              <span className="font-medium">{formatNumber(stats.totalOrders)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">平均指标</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">日均收入</span>
              <span className="font-medium">{formatCurrency(stats.avgDailyRevenue)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">进店转化率</span>
              <span className="font-medium">{formatPercentage(stats.avgVisitConversionRate)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">下单转化率</span>
              <span className="font-medium">{formatPercentage(stats.avgOrderConversionRate)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">数据质量</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">数据天数</span>
              <span className="font-medium">{stats.dataCount} 天</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">数据完整性</span>
              <span className="font-medium text-green-600">100%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">状态</span>
              <span className="font-medium text-green-600">正常</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
