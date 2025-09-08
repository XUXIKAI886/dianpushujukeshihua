/**
 * Excel文件解析工具
 */

import { ExcelDataRow } from '@/types';

/**
 * 验证文件类型
 */
export function validateFileType(file: File): { isValid: boolean; error?: string } {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
  ];

  const validExtensions = ['.xlsx', '.xls'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

  if (!fileExtension) {
    return { isValid: false, error: '文件缺少扩展名，请确保文件是Excel格式' };
  }

  if (!validExtensions.includes(fileExtension)) {
    return { isValid: false, error: `不支持的文件格式 "${fileExtension}"，请上传 .xlsx 或 .xls 文件` };
  }

  if (file.type && !validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
    return { isValid: false, error: '文件类型不匹配，请确保文件是有效的Excel文件' };
  }

  return { isValid: true };
}

/**
 * 验证文件大小
 */
export function validateFileSize(file: File, maxSizeMB: number = 10): { isValid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size === 0) {
    return { isValid: false, error: '文件为空，请选择有效的Excel文件' };
  }

  if (file.size > maxSizeBytes) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `文件大小 ${fileSizeMB}MB 超过限制，最大支持 ${maxSizeMB}MB`
    };
  }

  return { isValid: true };
}

/**
 * 解析Excel文件
 */
export async function parseExcelFile(file: File): Promise<ExcelDataRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error('Failed to read file');
        }
        
        // 动态导入xlsx库以减少初始包大小
        const XLSX = await import('xlsx');
        
        // 解析工作簿
        const workbook = XLSX.read(data, { type: 'array' });
        
        // 获取第一个工作表
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          throw new Error('Excel file contains no worksheets');
        }
        
        const worksheet = workbook.Sheets[firstSheetName];
        
        // 转换为JSON格式
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1, // 使用数组格式
          defval: null // 空单元格默认值
        });
        
        if (jsonData.length < 2) {
          throw new Error('Excel file must contain at least a header row and one data row');
        }
        
        // 获取表头
        const headers = jsonData[0] as string[];
        
        // 验证必需的列
        const requiredColumns = [
          '日期', '门店名称', '门店id', '省份', '门店所在城市', '区县市',
          '营业收入', '曝光人数', '入店人数', '入店转化率', '下单转化率', '下单人数'
        ];
        
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        if (missingColumns.length > 0) {
          throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
        }
        
        // 转换数据行
        const dataRows: ExcelDataRow[] = [];
        
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as unknown[];
          if (!row || row.length === 0) continue;

          const dataRow: Record<string, unknown> = {};
          headers.forEach((header, index) => {
            dataRow[header] = row[index];
          });
          
          // 跳过空行
          if (Object.values(dataRow).every(val => val === null || val === undefined || val === '')) {
            continue;
          }
          
          // 数据类型转换
          try {
            const convertedRow = {
              日期: Number(dataRow.日期),
              门店id: Number(dataRow.门店id),
              营业收入: Number(dataRow.营业收入),
              曝光人数: Number(dataRow.曝光人数),
              入店人数: Number(dataRow.入店人数),
              入店转化率: Number(dataRow.入店转化率),
              下单转化率: Number(dataRow.下单转化率),
              下单人数: Number(dataRow.下单人数),
              门店名称: dataRow.门店名称 as string,
              省份: dataRow.省份 as string,
              门店所在城市: dataRow.门店所在城市 as string,
              区县市: dataRow.区县市 as string
            };

            // 验证数据
            if (isNaN(convertedRow.日期) || isNaN(convertedRow.门店id) || isNaN(convertedRow.营业收入) ||
                isNaN(convertedRow.曝光人数) || isNaN(convertedRow.入店人数) || isNaN(convertedRow.入店转化率) ||
                isNaN(convertedRow.下单转化率) || isNaN(convertedRow.下单人数)) {
              console.warn(`Skipping row ${i + 1} due to invalid numeric data`);
              continue;
            }
            
            // 验证日期格式
            const dateStr = convertedRow.日期.toString();
            if (dateStr.length !== 8) {
              console.warn(`Skipping row ${i + 1} due to invalid date format: ${convertedRow.日期}`);
              continue;
            }

            // 验证转化率范围
            if (convertedRow.入店转化率 < 0 || convertedRow.入店转化率 > 1 ||
                convertedRow.下单转化率 < 0 || convertedRow.下单转化率 > 1) {
              console.warn(`Skipping row ${i + 1} due to invalid conversion rate`);
              continue;
            }

            dataRows.push(convertedRow as ExcelDataRow);
          } catch (error) {
            console.warn(`Skipping row ${i + 1} due to data conversion error:`, error);
            continue;
          }
        }
        
        if (dataRows.length === 0) {
          throw new Error('No valid data rows found in Excel file');
        }
        
        resolve(dataRows);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 获取文件信息
 */
export function getFileInfo(file: File) {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified)
  };
}
