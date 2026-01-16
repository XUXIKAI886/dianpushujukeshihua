'use client';

import React, { useState } from 'react';
import { Copy, Check, MessageSquareText, Sparkles, TrendingUp, Target, Lightbulb } from 'lucide-react';
import { ANALYSIS_COPY_TEXT } from '@/types/screenshot';
import { copyToClipboard } from '@/lib/tauriClipboard';

export default function AnalysisCopyText() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(ANALYSIS_COPY_TEXT);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert('复制失败，请手动复制');
    }
  };

  // 话术要点提炼
  const keyPoints = [
    { icon: TrendingUp, text: '整体走势符合预期', color: 'text-blue-500' },
    { icon: Target, text: '平台算法正在识别定位', color: 'text-purple-500' },
    { icon: Sparkles, text: '权重正在稳步积累', color: 'text-amber-500' },
    { icon: Lightbulb, text: '即将进入增长阶段', color: 'text-emerald-500' },
  ];

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* 标题栏 - 更丰富的渐变 */}
      <div className="relative px-6 py-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
        {/* 装饰图案 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-20 w-20 h-20 bg-white/5 rounded-full translate-y-1/2"></div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <MessageSquareText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">数据分析话术</h3>
              <p className="text-sm text-emerald-100 mt-0.5">专业挽留商家文案 · 一键复制使用</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className={`
              flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold
              transition-all duration-300 transform
              ${
                copied
                  ? 'bg-white text-emerald-600 scale-105 shadow-lg'
                  : 'bg-white/20 hover:bg-white/30 text-white hover:scale-105 backdrop-blur-sm'
              }
            `}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                <span>已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>复制文案</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 话术要点卡片 */}
      <div className="px-6 py-4 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">核心要点</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {keyPoints.map((point, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <point.icon className={`w-4 h-4 ${point.color} flex-shrink-0`} />
              <span className="text-xs font-medium text-gray-700 truncate">{point.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 文案内容 */}
      <div className="p-6">
        <div className="relative">
          {/* 左侧装饰条 */}
          <div className="absolute left-0 top-4 bottom-4 w-1.5 bg-gradient-to-b from-emerald-400 via-teal-400 to-cyan-400 rounded-full"></div>

          {/* 文案卡片 */}
          <div className="ml-6 relative">
            {/* 引号装饰 */}
            <div className="absolute -top-2 -left-2 text-4xl text-emerald-200 font-serif leading-none">&ldquo;</div>

            <div className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 shadow-inner">
              <p className="text-gray-700 leading-loose text-base whitespace-pre-wrap relative z-10 indent-8">
                {ANALYSIS_COPY_TEXT}
              </p>
            </div>

            {/* 引号结尾 */}
            <div className="absolute -bottom-4 right-4 text-4xl text-emerald-200 font-serif leading-none">&rdquo;</div>
          </div>
        </div>

        {/* 使用场景提示 */}
        <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/50">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800">使用场景</p>
              <p className="text-sm text-amber-700 mt-1">
                当商家对运营效果产生疑虑、考虑解约时，配合上方生成的数据分析图一起展示，
                用专业数据和话术增强商家信心，提高续约率。
              </p>
            </div>
          </div>
        </div>

        {/* 底部操作提示 */}
        <div className="mt-4 flex items-center justify-center">
          <button
            onClick={handleCopy}
            className="group flex items-center space-x-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>点击复制完整话术到剪贴板</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
