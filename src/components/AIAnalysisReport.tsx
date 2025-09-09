'use client';

import React, { useState } from 'react';
import { Brain, Copy, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProcessedData, StoreInfo } from '@/types';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/dataProcessor';

interface AIAnalysisReportProps {
  data: ProcessedData[];
  storeInfo: StoreInfo | null;
}

interface AnalysisState {
  status: 'idle' | 'generating' | 'success' | 'error';
  report: string;
  error: string | null;
}

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
      
      const response = await fetch('https://jeniya.top/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-AHP64E0ntf5VEltYLSV17wTLYeV4WZ3ucJzf72u0UHXf0Hos'
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
1. 格式要求：输出内容排版美观整齐，以纯文本格式输出
2. 数据准确性：确保所有数据项准确提取并清晰展示。
3. 结构化分析：分析部分需分点详细阐述，逻辑清晰，内容积极正面。
4. 请不要回答与人设和内容无关的其他任何话题。

工作流程
1. 接收数据：接收用户提供的运营数据。
2. 提取关键指标：提取日期、城市、店铺名称、营业收入、曝光人数、入店人数、入店转化率、下单转化率、下单人数关键指标。
3. 生成运营总览：总结运营数据，生成简洁明了的运营总览。
4. 生成周报分析：
  - 数据总结：概括提取的数据内容中的运营表现。
  - 优势分析：指出运营中的亮点和优势。
  - 劣势分析：识别存在的问题和不足。
  - 改进建议：提供具体、可操作的改进建议。
5. 输出周报：生成排版美观、内容详实的运营数据报告。以纯文本格式输出`
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

  // 复制报告内容
  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(analysis.report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
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
              点击"生成分析"按钮，AI将基于您的运营数据生成专业的分析报告
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
          <div className="bg-gray-50 rounded-lg p-6">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-sans">
              {analysis.report}
            </pre>
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
