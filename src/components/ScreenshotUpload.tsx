'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, X, AlertCircle, Clipboard } from 'lucide-react';
import { ScreenshotInfo } from '@/types/screenshot';
import { validateImageFile } from '@/lib/geminiImageService';

interface ScreenshotUploadProps {
  screenshot: ScreenshotInfo | null;
  onScreenshotChange: (screenshot: ScreenshotInfo | null) => void;
  disabled?: boolean;
}

export default function ScreenshotUpload({
  screenshot,
  onScreenshotChange,
  disabled = false,
}: ScreenshotUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasting, setIsPasting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      // 验证文件
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || '文件验证失败');
        return;
      }

      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        onScreenshotChange({
          file,
          preview,
          name: file.name,
        });
      };
      reader.onerror = () => {
        setError('读取文件失败，请重试');
      };
      reader.readAsDataURL(file);
    },
    [onScreenshotChange]
  );

  // 处理粘贴事件
  const handlePaste = useCallback(
    async (e: ClipboardEvent) => {
      if (disabled) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          setIsPasting(true);

          const file = item.getAsFile();
          if (file) {
            // 为粘贴的图片生成一个文件名
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const extension = file.type.split('/')[1] || 'png';
            const namedFile = new File([file], `粘贴的截图_${timestamp}.${extension}`, {
              type: file.type,
            });
            await handleFile(namedFile);
          }

          setIsPasting(false);
          return;
        }
      }
    },
    [handleFile, disabled]
  );

  // 监听全局粘贴事件
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // 检查是否在输入框中，如果是则不处理
      const activeElement = document.activeElement;
      if (
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }
      handlePaste(e);
    };

    document.addEventListener('paste', handleGlobalPaste);
    return () => {
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, [handlePaste]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile, disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onScreenshotChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        上传店铺数据截图 <span className="text-red-500">*</span>
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-xl p-6 sm:p-8
          transition-all duration-300
          ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
          ${
            isDragging || isPasting
              ? 'border-purple-500 bg-purple-50 scale-[1.02]'
              : screenshot
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-purple-400 bg-white hover:bg-gray-50'
          }
          ${error ? 'border-red-400 bg-red-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        {isPasting ? (
          // 粘贴中状态
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-full bg-purple-100 animate-pulse">
              <Clipboard className="w-10 h-10 text-purple-500" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-purple-600">正在处理粘贴的图片...</p>
            </div>
          </div>
        ) : screenshot ? (
          // 已上传状态
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md">
              <img
                src={screenshot.preview}
                alt="预览"
                className="w-full h-auto rounded-lg shadow-md"
              />
              {!disabled && (
                <button
                  onClick={handleRemove}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="mt-3 text-sm text-green-600 font-medium">{screenshot.name}</p>
            {!disabled && (
              <p className="mt-1 text-xs text-gray-500">点击、拖拽或 Ctrl+V 粘贴新图片以替换</p>
            )}
          </div>
        ) : (
          // 未上传状态
          <div className="flex flex-col items-center justify-center space-y-4">
            <div
              className={`
              p-4 rounded-full transition-all duration-300
              ${isDragging ? 'bg-purple-100 scale-110' : 'bg-gray-100'}
              ${error ? 'bg-red-100' : ''}
            `}
            >
              {error ? (
                <AlertCircle className="w-10 h-10 text-red-500" />
              ) : (
                <Upload className="w-10 h-10 text-gray-400" />
              )}
            </div>

            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">
                {error ? '上传失败' : '拖拽截图到这里'}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {error || '或点击选择文件上传'}
              </p>
              <p className="mt-2 text-xs text-gray-400">
                支持 JPG、PNG、WebP 格式，最大 10MB
              </p>
            </div>

            {/* Ctrl+V 粘贴提示 */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <Clipboard className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-700">
                支持 <kbd className="px-1.5 py-0.5 bg-blue-100 rounded text-xs font-mono">Ctrl+V</kbd> 直接粘贴截图
              </span>
            </div>

            {/* 示例说明 */}
            <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start space-x-2">
                <ImageIcon className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-purple-700">
                  <p className="font-medium">建议上传内容：</p>
                  <p className="mt-1">外卖平台后台的30天流量数据截图</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}
