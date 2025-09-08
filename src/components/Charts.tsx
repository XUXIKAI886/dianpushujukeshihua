'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ProcessedData } from '@/types';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/dataProcessor';

interface ChartsProps {
  data: ProcessedData[];
}

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
}

function ChartContainer({ title, children }: ChartContainerProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-80">
        {children}
      </div>
    </div>
  );
}

// 自定义Tooltip组件
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
  formatter?: (value: number) => string;
}

const CustomTooltip = ({ active, payload, label, formatter }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 mb-2">{`日期: ${label}`}</p>
        {payload.map((entry, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${formatter ? formatter(entry.value) : entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Charts({ data }: ChartsProps) {
  // 图表配置
  const chartConfig = {
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#06B6D4'
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">数据可视化</h2>
        <p className="text-gray-600">
          多维度数据分析图表，帮助您深入了解业务趋势
        </p>
      </div>

      {/* 第一行：营业收入和曝光人数 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 营业收入趋势图 */}
        <ChartContainer title="营业收入趋势">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig.colors.primary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={chartConfig.colors.primary} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                content={<CustomTooltip formatter={formatCurrency} />}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={chartConfig.colors.primary}
                fillOpacity={1}
                fill="url(#revenueGradient)"
                strokeWidth={2}
                name="营业收入"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* 曝光人数趋势图 */}
        <ChartContainer title="曝光人数趋势">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                content={<CustomTooltip formatter={formatNumber} />}
              />
              <Line
                type="monotone"
                dataKey="exposure"
                stroke={chartConfig.colors.secondary}
                strokeWidth={3}
                dot={{ fill: chartConfig.colors.secondary, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: chartConfig.colors.secondary, strokeWidth: 2 }}
                name="曝光人数"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* 第二行：入店人数和入店转化率 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 入店人数分析图 */}
        <ChartContainer title="入店人数分析">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <defs>
                <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig.colors.success} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={chartConfig.colors.success} stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                tickFormatter={formatNumber}
              />
              <Tooltip 
                content={<CustomTooltip formatter={formatNumber} />}
              />
              <Bar
                dataKey="visits"
                fill="url(#visitsGradient)"
                radius={[4, 4, 0, 0]}
                name="入店人数"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* 入店转化率趋势图 */}
        <ChartContainer title="入店转化率趋势">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                domain={['dataMin', 'dataMax']}
              />
              <Tooltip 
                content={<CustomTooltip formatter={(value: number) => formatPercentage(value)} />}
              />
              <Line
                type="monotone"
                dataKey="visitConversionRate"
                stroke={chartConfig.colors.warning}
                strokeWidth={3}
                dot={{ fill: chartConfig.colors.warning, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: chartConfig.colors.warning, strokeWidth: 2 }}
                name="入店转化率"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* 第三行：下单转化率和下单人数 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 下单转化率分析图 */}
        <ChartContainer title="下单转化率分析">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="orderConversionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig.colors.danger} stopOpacity={0.6}/>
                  <stop offset="95%" stopColor={chartConfig.colors.danger} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                domain={['dataMin', 'dataMax']}
              />
              <Tooltip 
                content={<CustomTooltip formatter={(value: number) => formatPercentage(value)} />}
              />
              <Area
                type="monotone"
                dataKey="orderConversionRate"
                stroke={chartConfig.colors.danger}
                fillOpacity={1}
                fill="url(#orderConversionGradient)"
                strokeWidth={2}
                name="下单转化率"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* 下单人数统计图 */}
        <ChartContainer title="下单人数统计">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig.colors.info} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={chartConfig.colors.info} stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                tickFormatter={formatNumber}
              />
              <Tooltip 
                content={<CustomTooltip formatter={formatNumber} />}
              />
              <Bar
                dataKey="orders"
                fill="url(#ordersGradient)"
                radius={[4, 4, 0, 0]}
                name="下单人数"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
