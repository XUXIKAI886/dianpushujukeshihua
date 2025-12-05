'use client';

import React, { useState, useCallback } from 'react';
import { ArrowLeft, Sparkles, AlertTriangle, Store } from 'lucide-react';
import Link from 'next/link';
import ScreenshotUpload from '@/components/ScreenshotUpload';
import ImagePreview from '@/components/ImagePreview';
import AnalysisCopyText from '@/components/AnalysisCopyText';
import { ScreenshotInfo, GenerateStatus } from '@/types/screenshot';
import { generateAnalysisImage } from '@/lib/geminiImageService';

export default function ScreenshotAnalysisPage() {
  const [storeName, setStoreName] = useState('');
  const [screenshot, setScreenshot] = useState<ScreenshotInfo | null>(null);
  const [status, setStatus] = useState<GenerateStatus>('idle');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 处理生成
  const handleGenerate = useCallback(async () => {
    // 验证输入
    if (!storeName.trim()) {
      setError('请输入店铺名称');
      return;
    }
    if (!screenshot) {
      setError('请上传店铺数据截图');
      return;
    }

    setError(null);
    setStatus('generating');

    try {
      const imageUrl = await generateAnalysisImage(screenshot.file, storeName.trim());
      setGeneratedImage(imageUrl);
      setStatus('success');
    } catch (err) {
      console.error('生成失败:', err);
      setError(err instanceof Error ? err.message : '生成失败，请重试');
      setStatus('error');
    }
  }, [storeName, screenshot]);

  // 重置状态
  const handleReset = () => {
    setStoreName('');
    setScreenshot(null);
    setStatus('idle');
    setGeneratedImage(null);
    setError(null);
  };

  const isGenerating = status === 'generating';
  const canGenerate = storeName.trim() && screenshot && !isGenerating;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* 顶部导航栏 */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">返回首页</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">截图生成数据分析图</h1>
                </div>
              </div>
            </div>

            {status === 'success' && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                重新生成
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 功能说明 */}
        <div className="mb-8 p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl border border-purple-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-purple-900">AI 智能生成数据分析图</h2>
              <p className="mt-1 text-sm text-purple-700">
                上传外卖店铺30天的流量数据截图，AI 将自动分析数据并生成专业的可视化分析图，
                用于提升数据分析专业度，挽留商家解约。
              </p>
            </div>
          </div>
        </div>

        {/* 输入区域 */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Store className="w-5 h-5 mr-2 text-purple-600" />
            填写店铺信息
          </h3>

          <div className="space-y-6">
            {/* 店铺名称输入 */}
            <div>
              <label
                htmlFor="storeName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                店铺名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="请输入店铺名称，例如：山饺下(饿了么)"
                disabled={isGenerating}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* 截图上传 */}
            <ScreenshotUpload
              screenshot={screenshot}
              onScreenshotChange={setScreenshot}
              disabled={isGenerating}
            />

            {/* 错误提示 */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">生成失败</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* 生成按钮 */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`
                w-full py-4 rounded-xl font-semibold text-lg
                transition-all duration-300 flex items-center justify-center space-x-2
                ${
                  canGenerate
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <Sparkles className="w-5 h-5" />
              <span>{isGenerating ? '正在生成中...' : '开始生成分析图'}</span>
            </button>
          </div>
        </div>

        {/* 输出区域 */}
        <div className="space-y-8">
          {/* 图片预览 */}
          <ImagePreview
            imageUrl={generatedImage}
            storeName={storeName}
            isLoading={isGenerating}
          />

          {/* 话术文案 - 只在生成成功后显示 */}
          {status === 'success' && <AnalysisCopyText />}
        </div>

        {/* 使用说明 */}
        {status === 'idle' && (
          <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="text-base font-semibold text-gray-900 mb-4">使用说明</h4>
            <ol className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span>在输入框中填写店铺名称（将显示在生成图片的标题中）</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span>上传外卖平台后台的30天流量数据截图</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <span>点击「开始生成」按钮，AI 将自动分析并生成专业的数据分析图</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <span>生成完成后，可一键复制图片和话术文案</span>
              </li>
            </ol>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © 2025 呈尚策划. 保留所有权利. |
              <span className="ml-2">AI 数据分析图生成工具</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
