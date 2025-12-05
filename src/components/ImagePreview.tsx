'use client';

import React, { useState } from 'react';
import { Copy, Download, Check, Loader2, ImageIcon } from 'lucide-react';
import { downloadImage, copyImageToClipboard, isTauriEnvironment } from '@/utils/tauriUtils';

interface ImagePreviewProps {
  imageUrl: string | null;
  storeName: string;
  isLoading?: boolean;
}

export default function ImagePreview({
  imageUrl,
  storeName,
  isLoading = false,
}: ImagePreviewProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copying, setCopying] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // 复制图片到剪贴板
  const handleCopyImage = async () => {
    if (!imageUrl || copying) return;

    setCopying(true);
    try {
      const success = await copyImageToClipboard(imageUrl);
      if (success) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        // 在 Tauri 环境中，如果复制失败，提示用户使用下载功能
        if (isTauriEnvironment()) {
          alert('桌面应用暂不支持直接复制图片，请使用「下载图片」功能保存后再复制');
        } else {
          alert('复制失败，请尝试下载图片后手动复制');
        }
      }
    } catch (error) {
      console.error('复制图片失败:', error);
      alert('复制失败，请尝试下载图片后手动复制');
    } finally {
      setCopying(false);
    }
  };

  // 下载图片
  const handleDownload = async () => {
    if (!imageUrl || downloading) return;

    setDownloading(true);
    try {
      const filename = `${storeName}_数据分析图_${new Date().toISOString().split('T')[0]}.png`;
      const success = await downloadImage(imageUrl, filename);
      if (success) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 2000);
      }
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请重试');
    } finally {
      setDownloading(false);
    }
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
            <Loader2 className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">AI 正在生成分析图...</p>
          <p className="mt-2 text-sm text-gray-500">这可能需要 30-60 秒，请耐心等待</p>
          <div className="mt-6 flex items-center space-x-2 text-xs text-gray-400">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            <span>正在分析店铺数据并生成专业图表</span>
          </div>
        </div>
      </div>
    );
  }

  // 未生成状态
  if (!imageUrl) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-10 h-10" />
          </div>
          <p className="text-lg font-medium">等待生成分析图</p>
          <p className="mt-2 text-sm">上传截图并点击开始生成按钮</p>
        </div>
      </div>
    );
  }

  // 已生成状态
  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* 标题栏 */}
      <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600">
        <h3 className="text-lg font-semibold text-white">生成结果</h3>
        <p className="text-sm text-purple-200">{storeName} - 数据分析图</p>
      </div>

      {/* 图片预览区 */}
      <div className="p-4 sm:p-6 bg-gray-50">
        <div className="relative bg-white rounded-lg shadow-inner overflow-hidden">
          <img
            src={imageUrl}
            alt={`${storeName} 数据分析图`}
            className="w-full h-auto"
            style={{ maxHeight: '600px', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="px-6 py-4 bg-white border-t border-gray-100 flex flex-wrap gap-3 justify-center sm:justify-end">
        <button
          onClick={handleCopyImage}
          disabled={copying}
          className={`
            flex items-center space-x-2 px-5 py-2.5 rounded-lg font-medium
            transition-all duration-200
            ${
              copySuccess
                ? 'bg-green-500 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {copying ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : copySuccess ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>{copySuccess ? '已复制' : '复制图片'}</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className={`
            flex items-center space-x-2 px-5 py-2.5 rounded-lg font-medium
            transition-all duration-200
            ${
              downloadSuccess
                ? 'bg-green-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {downloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : downloadSuccess ? (
            <Check className="w-4 h-4" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{downloadSuccess ? '已下载' : '下载图片'}</span>
        </button>
      </div>
    </div>
  );
}
