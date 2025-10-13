'use client';

import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { validateFileType, validateFileSize, parseExcelFile } from '@/utils/excelParser';
import { ExcelDataRow, UploadStatus } from '@/types';

interface FileUploadProps {
  onFileProcessed: (data: ExcelDataRow[], fileName: string) => void;
  onError: (error: string) => void;
  uploadStatus: UploadStatus;
  onStatusChange: (status: UploadStatus) => void;
}

export default function FileUpload({ 
  onFileProcessed, 
  onError, 
  uploadStatus, 
  onStatusChange 
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    try {
      onStatusChange('uploading');

      // 验证文件类型
      const typeValidation = validateFileType(file);
      if (!typeValidation.isValid) {
        throw new Error(typeValidation.error || '文件类型验证失败');
      }

      // 验证文件大小
      const sizeValidation = validateFileSize(file, 10);
      if (!sizeValidation.isValid) {
        throw new Error(sizeValidation.error || '文件大小验证失败');
      }

      onStatusChange('processing');
      setFileName(file.name);

      // 解析Excel文件
      const data = await parseExcelFile(file);

      if (data.length === 0) {
        throw new Error('Excel文件中没有找到有效数据，请检查文件内容和格式');
      }

      onStatusChange('success');
      onFileProcessed(data, file.name);

    } catch (error) {
      onStatusChange('error');
      const errorMessage = error instanceof Error ? error.message : '文件处理失败，请重试';
      onError(errorMessage);
      setFileName(null);
      console.error('File processing error:', error);
    }
  }, [onFileProcessed, onError, onStatusChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (uploadStatus === 'uploading' || uploadStatus === 'processing') {
      return;
    }
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  }, [processFile, uploadStatus]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploadStatus === 'uploading' || uploadStatus === 'processing') {
      return;
    }
    
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  }, [processFile, uploadStatus]);

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
      case 'processing':
        return (
          <div className="relative">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 opacity-30"></div>
          </div>
        );
      case 'success':
        return <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 animate-scale-in" />;
      case 'error':
        return <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-red-600 animate-scale-in" />;
      default:
        return <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 transition-transform hover:scale-110" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return '正在上传文件...';
      case 'processing':
        return '正在解析数据...';
      case 'success':
        return `文件上传成功: ${fileName}`;
      case 'error':
        return '上传失败，请重试';
      default:
        return '拖拽Excel文件到此处，或点击选择文件';
    }
  };

  const isDisabled = uploadStatus === 'uploading' || uploadStatus === 'processing';

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all duration-300 ease-in-out
          ${dragActive ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg' : 'border-gray-300'}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-gray-50 hover:shadow-md cursor-pointer'}
          ${uploadStatus === 'success' ? 'border-green-400 bg-green-50 shadow-green-100 shadow-lg' : ''}
          ${uploadStatus === 'error' ? 'border-red-400 bg-red-50 shadow-red-100 shadow-lg' : ''}
          animate-fade-in
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isDisabled && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileInput}
          className="hidden"
          disabled={isDisabled}
        />
        
        <div className="flex flex-col items-center space-y-4">
          {getStatusIcon()}
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">
              {getStatusText()}
            </p>
            
            {uploadStatus === 'idle' && (
              <>
                <p className="text-sm text-gray-500">
                  支持 .xlsx、.xls 和 .csv 格式，文件大小不超过 10MB
                </p>
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Excel / CSV 文件</span>
                </div>
              </>
            )}
            
            {uploadStatus === 'processing' && (
              <p className="text-sm text-gray-500">
                正在解析Excel数据，请稍候...
              </p>
            )}
          </div>
        </div>

        {/* 支持的字段说明 */}
        {uploadStatus === 'idle' && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-2">需要包含的字段：</p>
            <div className="text-xs text-blue-700 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>日期、门店名称、门店id、省份、门店所在城市、区县市</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>营业收入、曝光人数、入店人数、下单人数</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>入店转化率、下单转化率</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {uploadStatus === 'success' && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg animate-slide-up">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 animate-scale-in" />
            <span className="text-green-800 font-medium">文件解析成功！</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            数据已准备就绪，正在生成可视化图表...
          </p>
        </div>
      )}
    </div>
  );
}
