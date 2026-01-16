'use client';

import React, { useState } from 'react';
import { Brain, Copy, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProcessedData, StoreInfo } from '@/types';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/dataProcessor';
import { copyToClipboard } from '@/lib/tauriClipboard';

interface AIAnalysisReportProps {
  data: ProcessedData[];
  storeInfo: StoreInfo | null;
}

interface AnalysisState {
  status: 'idle' | 'generating' | 'success' | 'error';
  report: string;
  error: string | null;
}

// 格式化报告文本为美观的JSX
const formatReportText = (text: string) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const elements: React.ReactElement[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 跳过空行
    if (!line) continue;

    // 主标题（包含【】的行）
    if (line.includes('【') && line.includes('】')) {
      elements.push(
        <div key={key++} className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {line}
          </h2>
        </div>
      );
    }
    // 一级标题（一、二、三、四、五）
    else if (/^[一二三四五六七八九十]、/.test(line)) {
      elements.push(
        <div key={key++} className="mt-6 mb-3">
          <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-500 pl-3 bg-blue-50 py-2 rounded-r">
            {line}
          </h3>
        </div>
      );
    }
    // 店铺信息行
    else if (line.includes('店铺：') || line.includes('周期：') || line.includes('城市：')) {
      elements.push(
        <div key={key++} className="mb-2">
          <p className="text-gray-700 bg-gray-50 px-3 py-2 rounded inline-block">
            <span className="font-medium text-gray-900">{line}</span>
          </p>
        </div>
      );
    }
    // 项目符号行（• 开头）
    else if (line.startsWith('•') || line.startsWith('·')) {
      elements.push(
        <div key={key++} className="mb-2 ml-4">
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 font-bold mt-1">•</span>
            <p className="text-gray-700 leading-relaxed">{line.substring(1).trim()}</p>
          </div>
        </div>
      );
    }
    // 数字序号行（1. 2. 3.）
    else if (/^\d+\./.test(line)) {
      elements.push(
        <div key={key++} className="mb-2 ml-2">
          <p className="text-gray-700 leading-relaxed">
            <span className="font-medium text-blue-600">{line.match(/^\d+\./)?.[0]}</span>
            <span className="ml-2">{line.replace(/^\d+\./, '').trim()}</span>
          </p>
        </div>
      );
    }
    // 普通段落
    else {
      elements.push(
        <div key={key++} className="mb-3">
          <p className="text-gray-700 leading-relaxed">{line}</p>
        </div>
      );
    }
  }

  return <div className="space-y-1">{elements}</div>;
};

export default function AIAnalysisReport({ data, storeInfo }: AIAnalysisReportProps) {
  const [analysis, setAnalysis] = useState<AnalysisState>({
    status: 'idle',
    report: '',
    error: null
  });
  const [copied, setCopied] = useState(false);

  // 准备发送给AI的数据
  const prepareDataForAI = () => {
    if (!data.length || !storeInfo) return '';

    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalExposure = data.reduce((sum, item) => sum + item.exposure, 0);
    const totalVisits = data.reduce((sum, item) => sum + item.visits, 0);
    const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
    const avgVisitConversionRate = data.reduce((sum, item) => sum + item.visitConversionRate, 0) / data.length;
    const avgOrderConversionRate = data.reduce((sum, item) => sum + item.orderConversionRate, 0) / data.length;

    const sortedData = [...data].sort((a, b) => a.originalDate - b.originalDate);
    const startDate = sortedData[0].date;
    const endDate = sortedData[sortedData.length - 1].date;

    return `运营数据分析请求：

店铺信息：
- 店铺名称：${storeInfo.name}
- 所在城市：${storeInfo.city} ${storeInfo.district}
- 分析周期：${startDate} 至 ${endDate}（共${data.length}天）

核心运营数据：
- 总营业收入：${formatCurrency(totalRevenue)}
- 日均营业收入：${formatCurrency(totalRevenue / data.length)}
- 总曝光人数：${formatNumber(totalExposure)}
- 日均曝光人数：${formatNumber(totalExposure / data.length)}
- 总入店人数：${formatNumber(totalVisits)}
- 日均入店人数：${formatNumber(totalVisits / data.length)}
- 平均入店转化率：${formatPercentage(avgVisitConversionRate)}
- 总下单人数：${formatNumber(totalOrders)}
- 日均下单人数：${formatNumber(totalOrders / data.length)}
- 平均下单转化率：${formatPercentage(avgOrderConversionRate)}

请根据以上数据生成专业的运营分析报告。`;
  };

  // 调用AI API生成分析报告
  const generateAnalysis = async () => {
    setAnalysis({ status: 'generating', report: '', error: null });

    try {
      const dataForAI = prepareDataForAI();

      // 从环境变量获取 API Key
      const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY || '';
      const apiUrl = process.env.NEXT_PUBLIC_AI_API_URL || 'https://jeniya.top/v1/chat/completions';

      if (!apiKey) {
        throw new Error('API Key 未配置，请在 Vercel 环境变量中设置 NEXT_PUBLIC_AI_API_KEY');
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gemini-2.5-flash-lite',
          messages: [
            {
              role: 'system',
              content: `定位
您是一位专业的运营数据分析助手，专注于为美团外卖店铺生成结构清晰、内容详实的运营数据报告，帮助商家优化运营策略。

能力
1. 数据提取与总结：自动提取用户提供的运营数据，并总结关键指标。
2. 结构化分析：生成结构化的数据内容，包括运营总览、数据总结、优势分析、劣势分析及改进建议。
3. 积极正向反馈：使用积极正面的语言激励商家，提供切实可行的改进建议。

规则
1. 格式要求：输出内容排版美观整齐，使用纯文本格式，不要使用markdown语法（如#、*、-等符号）
2. 数据准确性：确保所有数据项准确提取并清晰展示。
3. 结构化分析：分析部分需分点详细阐述，逻辑清晰，内容积极正面。
4. 文本格式：使用中文标点符号，用空行分隔段落，用数字序号和项目符号组织内容
5. 请不要回答与人设和内容无关的其他任何话题。

工作流程
1. 接收数据：接收用户提供的运营数据。
2. 提取关键指标：提取日期、城市、店铺名称、营业收入、曝光人数、入店人数、入店转化率、下单转化率、下单人数关键指标。
3. 生成运营总览：总结运营数据，生成简洁明了的运营总览。
4. 生成周报分析：
  - 数据总结：概括提取的数据内容中的运营表现。
  - 优势分析：指出运营中的亮点和优势。
  - 劣势分析：识别存在的问题和不足。
  - 改进建议：提供具体、可操作的改进建议。
5. 输出周报：生成排版美观、内容详实的运营数据报告。

输出格式要求：
- 使用【】包围主标题
- 使用"一、二、三、四、五"作为章节标题
- 使用"•"作为项目符号
- 使用数字序号"1. 2. 3."列举要点
- 不要使用markdown语法（#、*、-等）
- 用空行分隔不同段落
- 内容要专业、简洁、积极正面`
            },
            {
              role: 'user',
              content: dataForAI
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.choices && result.choices[0] && result.choices[0].message) {
        const report = result.choices[0].message.content.trim();
        setAnalysis({ status: 'success', report, error: null });
      } else {
        throw new Error('API返回格式异常');
      }
    } catch (error) {
      console.error('AI分析生成失败:', error);
      setAnalysis({
        status: 'error',
        report: '',
        error: error instanceof Error ? error.message : '生成分析报告失败，请重试'
      });
    }
  };

  // 复制报告内容 - 支持浏览器和 Tauri 环境
  const copyReport = async () => {
    try {
      const success = await copyToClipboard(analysis.report);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        alert('复制失败，请重试');
      }
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败: ' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* 标题栏 */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI智能分析报告</h3>
            <p className="text-sm text-gray-500">基于运营数据的专业分析与建议</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {analysis.status === 'success' && (
            <button
              onClick={copyReport}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">已复制</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>复制报告</span>
                </>
              )}
            </button>
          )}
          
          <button
            onClick={generateAnalysis}
            disabled={analysis.status === 'generating'}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
          >
            <RefreshCw className={`h-4 w-4 ${analysis.status === 'generating' ? 'animate-spin' : ''}`} />
            <span>
              {analysis.status === 'generating' ? '生成中...' : '生成分析'}
            </span>
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        {analysis.status === 'idle' && (
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">AI智能分析</h4>
            <p className="text-gray-500 mb-6">
              点击&ldquo;生成分析&rdquo;按钮，AI将基于您的运营数据生成专业的分析报告
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>运营总览分析</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>优势劣势识别</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>改进建议提供</span>
              </div>
            </div>
          </div>
        )}

        {analysis.status === 'generating' && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-500 mx-auto mb-4"></div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">AI正在分析中...</h4>
            <p className="text-gray-500">
              正在基于您的运营数据生成专业分析报告，请稍候
            </p>
          </div>
        )}

        {analysis.status === 'success' && analysis.report && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
            <div className="prose prose-sm max-w-none">
              {formatReportText(analysis.report)}
            </div>
          </div>
        )}

        {analysis.status === 'error' && (
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">生成失败</h4>
            <p className="text-red-600 mb-4">{analysis.error}</p>
            <button
              onClick={generateAnalysis}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              重试
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
