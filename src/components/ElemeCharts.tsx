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
  ResponsiveContainer,
  Legend
} from 'recharts';
import { ElemeProcessedData } from '@/types/eleme';

interface ElemeChartsProps {
  data: ElemeProcessedData[];
}

// 格式化百分比
const formatPercent = (value: number) => {
  return `${(value * 100).toFixed(2)}%`;
};

// 格式化货币
const formatCurrency = (value: number) => {
  return `¥${value.toFixed(2)}`;
};

// 格式化数字
const formatNumber = (value: number) => {
  return value.toLocaleString();
};

export default function ElemeCharts({ data }: ElemeChartsProps) {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">数据趋势分析</h2>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* 收入趋势 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            收入趋势
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                name="收入"
                stroke="#3B82F6"
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 曝光人数趋势 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            曝光人数趋势
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatNumber} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => formatNumber(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="exposure"
                name="曝光人数"
                stroke="#A855F7"
                strokeWidth={2}
                dot={{ fill: '#A855F7', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 进店人数分析 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            进店人数分析
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatNumber} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => formatNumber(value)} />
              <Legend />
              <Bar
                dataKey="visits"
                name="进店人数"
                fill="url(#colorVisits)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 进店转化率趋势 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            进店转化率趋势
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatPercent} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => formatPercent(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="visitConversionRate"
                name="进店转化率"
                stroke="#F97316"
                strokeWidth={2}
                dot={{ fill: '#F97316', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 下单转化率分析 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
            下单转化率分析
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorOrderRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatPercent} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => formatPercent(value)} />
              <Legend />
              <Area
                type="monotone"
                dataKey="orderConversionRate"
                name="下单转化率"
                stroke="#EC4899"
                fill="url(#colorOrderRate)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 下单人数统计 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            下单人数统计
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatNumber} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => formatNumber(value)} />
              <Legend />
              <Bar
                dataKey="orders"
                name="下单人数"
                fill="url(#colorOrders)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
