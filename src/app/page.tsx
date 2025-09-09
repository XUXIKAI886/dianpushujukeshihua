'use client';

import React, { useState, useCallback } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import StatsCards from '@/components/StatsCards';
import Charts from '@/components/Charts';
import AIAnalysisReport from '@/components/AIAnalysisReport';
import { AppState, ExcelDataRow, UploadStatus } from '@/types';
import { DataService } from '@/lib/dataService';

export default function Home() {
  const [appState, setAppState] = useState<AppState>({
    data: [],
    stats: null,
    storeInfo: null,
    uploadStatus: 'idle',
    error: null,
    fileName: null
  });

  const handleFileProcessed = useCallback(async (rawData: ExcelDataRow[], fileName: string) => {
    try {
      const processedState = await DataService.processData(rawData, fileName);
      setAppState(prev => ({
        ...prev,
        ...processedState
      }));
    } catch (error) {
      setAppState(prev => ({
        ...prev,
        uploadStatus: 'error',
        error: {
          message: error instanceof Error ? error.message : '数据处理失败'
        }
      }));
    }
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setAppState(prev => ({
      ...prev,
      error: { message: errorMessage }
    }));
  }, []);

  const handleStatusChange = useCallback((status: UploadStatus) => {
    setAppState(prev => ({
      ...prev,
      uploadStatus: status,
      error: status === 'error' ? prev.error : null
    }));
  }, []);

  const handleReset = useCallback(() => {
    setAppState({
      data: [],
      stats: null,
      storeInfo: null,
      uploadStatus: 'idle',
      error: null,
      fileName: null
    });
  }, []);



  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className={`bg-white shadow-sm border-b border-gray-200 ${
        appState.uploadStatus === 'success' ? '' : 'sticky top-0 z-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">呈尚策划 店铺数据可视化</h1>
                <p className="text-sm text-gray-500">美团外卖数据可视化分析系统</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">呈尚策划</h1>
                <p className="text-xs text-gray-500">店铺数据可视化</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-6">
              {appState.uploadStatus === 'success' && (
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">重新上传</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {appState.uploadStatus === 'idle' && (
          <div className="text-center py-8 sm:py-12 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                欢迎使用呈尚策划店铺数据分析系统
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 px-4 sm:px-0">
                上传您的Excel营业数据文件，即可获得专业的数据分析和可视化图表
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 px-4 sm:px-0">
                <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl">📊</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">智能分析</h3>
                  <p className="text-sm sm:text-base text-gray-600">自动解析数据并生成6种专业图表</p>
                </div>

                <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl">🔒</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">安全可靠</h3>
                  <p className="text-sm sm:text-base text-gray-600">本地化数据处理，保护商业机密</p>
                </div>

                <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl">⚡</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">实时洞察</h3>
                  <p className="text-sm sm:text-base text-gray-600">即时计算关键业务指标和趋势</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 文件上传组件 */}
        {(appState.uploadStatus === 'idle' || appState.uploadStatus === 'uploading' ||
          appState.uploadStatus === 'processing' || appState.uploadStatus === 'error') && (
          <div className="mb-8">
            <FileUpload
              onFileProcessed={handleFileProcessed}
              onError={handleError}
              uploadStatus={appState.uploadStatus}
              onStatusChange={handleStatusChange}
            />

            {appState.error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-red-600 font-medium">错误：</span>
                  <span className="text-red-800">{appState.error.message}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 数据分析结果 */}
        {appState.uploadStatus === 'success' && appState.stats && appState.data.length > 0 && (
          <div className="space-y-6 sm:space-y-8 animate-slide-up">
            {/* 统计卡片 */}
            <div className="animate-scale-in">
              <StatsCards stats={appState.stats} storeInfo={appState.storeInfo} />
            </div>

            {/* 图表展示 */}
            <div className="animate-fade-in">
              <Charts data={appState.data} />
            </div>

            {/* AI智能分析报告 */}
            <div className="animate-fade-in">
              <AIAnalysisReport data={appState.data} storeInfo={appState.storeInfo} />
            </div>
          </div>
        )}
      </main>


    </div>
  );
}
