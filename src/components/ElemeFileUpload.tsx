'use client';

import React, { useCallback, useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { ElemeExcelDataRow } from '@/types/eleme';

interface ElemeFileUploadProps {
  onFileProcessed: (data: ElemeExcelDataRow[], fileName: string) => void;
  onError: (error: string) => void;
  uploadStatus: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  onStatusChange: (status: 'idle' | 'uploading' | 'processing' | 'success' | 'error') => void;
}

export default function ElemeFileUpload({ onFileProcessed, onError, uploadStatus, onStatusChange }: ElemeFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      onError('请上传Excel文件 (.xlsx 或 .xls)');
      onStatusChange('error');
      return;
    }

    setFileName(file.name);
    onStatusChange('uploading');

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          onStatusChange('processing');
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData: ElemeExcelDataRow[] = XLSX.utils.sheet_to_json(worksheet);

          if (jsonData.length === 0) {
            onError('Excel文件中没有数据');
            onStatusChange('error');
            return;
          }

          // 验证数据格式
          const firstRow = jsonData[0];
          const requiredFields = ['日期', '门店名称', '门店编号', '收入', '曝光人数', '进店人数', '下单人数', '进店转化率', '下单转化率'];
          const missingFields = requiredFields.filter(field => !(field in firstRow));

          if (missingFields.length > 0) {
            onError(`Excel文件缺少必需的字段: ${missingFields.join(', ')}`);
            onStatusChange('error');
            return;
          }

          onFileProcessed(jsonData, file.name);
        } catch (error) {
          console.error('Excel parsing error:', error);
          onError('Excel文件解析失败，请检查文件格式');
          onStatusChange('error');
        }
      };

      reader.onerror = () => {
        onError('文件读取失败，请重试');
        onStatusChange('error');
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('File handling error:', error);
      onError('文件处理失败，请重试');
      onStatusChange('error');
    }
  }, [onFileProcessed, onError, onStatusChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleClick = () => {
    if (uploadStatus === 'idle' || uploadStatus === 'error') {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-xl p-8 sm:p-12
          transition-all duration-300 cursor-pointer
          ${isDragging
            ? 'border-blue-500 bg-blue-50 scale-[1.02]'
            : 'border-gray-300 hover:border-blue-400 bg-white hover:bg-gray-50'
          }
          ${uploadStatus === 'uploading' || uploadStatus === 'processing' ? 'pointer-events-none opacity-60' : ''}
          ${uploadStatus === 'success' ? 'border-green-500 bg-green-50' : ''}
          ${uploadStatus === 'error' ? 'border-red-500 bg-red-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileInput}
          className="hidden"
          disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {/* 图标 */}
          <div className={`
            p-4 rounded-full transition-all duration-300
            ${isDragging ? 'bg-blue-100 scale-110' : 'bg-gray-100'}
            ${uploadStatus === 'success' ? 'bg-green-100' : ''}
            ${uploadStatus === 'error' ? 'bg-red-100' : ''}
          `}>
            {uploadStatus === 'uploading' || uploadStatus === 'processing' ? (
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            ) : uploadStatus === 'success' ? (
              <CheckCircle className="w-12 h-12 text-green-600" />
            ) : uploadStatus === 'error' ? (
              <AlertCircle className="w-12 h-12 text-red-600" />
            ) : fileName ? (
              <FileSpreadsheet className="w-12 h-12 text-blue-600" />
            ) : (
              <Upload className="w-12 h-12 text-gray-500" />
            )}
          </div>

          {/* 文本 */}
          <div className="text-center space-y-2">
            {uploadStatus === 'uploading' ? (
              <>
                <p className="text-lg font-medium text-blue-600">正在上传文件...</p>
                <p className="text-sm text-gray-500">请稍候</p>
              </>
            ) : uploadStatus === 'processing' ? (
              <>
                <p className="text-lg font-medium text-blue-600">正在解析数据...</p>
                <p className="text-sm text-gray-500">正在处理您的饿了么数据</p>
              </>
            ) : uploadStatus === 'success' ? (
              <>
                <p className="text-lg font-medium text-green-600">✅ 文件上传成功</p>
                <p className="text-sm text-gray-600 bg-green-100 px-4 py-2 rounded-full border border-green-200">
                  {fileName}
                </p>
              </>
            ) : uploadStatus === 'error' ? (
              <>
                <p className="text-lg font-medium text-red-600">上传失败</p>
                <p className="text-sm text-gray-500">请点击重试</p>
              </>
            ) : (
              <>
                <p className="text-xl font-bold text-gray-900">
                  拖拽饿了么Excel文件到这里
                </p>
                <p className="text-gray-600 max-w-md mx-auto">
                  或点击选择文件上传
                </p>
                <p className="text-sm text-gray-500">
                  支持 .xlsx 和 .xls 格式
                </p>
              </>
            )}
          </div>

          {/* 支持的字段说明 */}
          {uploadStatus === 'idle' && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-2">需要包含的字段：</p>
              <div className="text-xs text-blue-700 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>日期、门店名称、门店编号</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>收入、曝光人数、进店人数、下单人数</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>进店转化率、下单转化率</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
