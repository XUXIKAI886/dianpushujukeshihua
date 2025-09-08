/**
 * 数据服务 - 统一的数据处理接口
 */

import { ExcelDataRow, ProcessedData, AppState } from '@/types';
import { 
  processExcelData, 
  calculateStats, 
  extractStoreInfo, 
  validateDataRow 
} from '@/utils/dataProcessor';

export class DataService {
  /**
   * 处理Excel数据并返回完整的应用状态
   */
  static async processData(rawData: ExcelDataRow[], fileName: string): Promise<Partial<AppState>> {
    try {
      // 验证数据
      const validData = rawData.filter(row => {
        if (!validateDataRow(row)) {
          console.warn('Invalid data row:', row);
          return false;
        }
        return true;
      });

      if (validData.length === 0) {
        throw new Error('没有找到有效的数据行');
      }

      // 处理数据
      const processedData = processExcelData(validData);
      
      // 计算统计数据
      const stats = calculateStats(processedData);
      
      // 提取门店信息
      const storeInfo = extractStoreInfo(validData);

      return {
        data: processedData,
        stats,
        storeInfo,
        fileName,
        uploadStatus: 'success',
        error: null
      };
    } catch (error) {
      console.error('Data processing error:', error);
      throw error;
    }
  }

  /**
   * 验证数据完整性
   */
  static validateDataIntegrity(data: ExcelDataRow[]): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (data.length === 0) {
      errors.push('数据为空');
      return { isValid: false, errors, warnings };
    }

    // 检查门店信息一致性
    const firstRow = data[0];
    const inconsistentStores = data.filter(row => 
      row.门店名称 !== firstRow.门店名称 || 
      row.门店id !== firstRow.门店id
    );

    if (inconsistentStores.length > 0) {
      warnings.push(`发现${inconsistentStores.length}行数据的门店信息不一致`);
    }

    // 检查日期连续性
    const dates = data.map(row => row.日期).sort((a, b) => a - b);
    const dateGaps: number[] = [];
    
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(
        Math.floor(dates[i - 1] / 10000),
        Math.floor((dates[i - 1] % 10000) / 100) - 1,
        dates[i - 1] % 100
      );
      const currentDate = new Date(
        Math.floor(dates[i] / 10000),
        Math.floor((dates[i] % 10000) / 100) - 1,
        dates[i] % 100
      );
      
      const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff > 1) {
        dateGaps.push(dayDiff - 1);
      }
    }

    if (dateGaps.length > 0) {
      warnings.push(`数据中存在${dateGaps.length}个日期间隔`);
    }

    // 检查异常数值
    const revenueValues = data.map(row => row.营业收入);
    const avgRevenue = revenueValues.reduce((a, b) => a + b, 0) / revenueValues.length;
    const outliers = data.filter(row => 
      row.营业收入 > avgRevenue * 3 || row.营业收入 < avgRevenue * 0.1
    );

    if (outliers.length > 0) {
      warnings.push(`发现${outliers.length}行营业收入数据异常`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 获取数据摘要信息
   */
  static getDataSummary(data: ProcessedData[]): {
    dateRange: { start: string; end: string };
    totalDays: number;
    avgMetrics: {
      revenue: number;
      exposure: number;
      visits: number;
      orders: number;
    };
  } {
    if (data.length === 0) {
      return {
        dateRange: { start: '', end: '' },
        totalDays: 0,
        avgMetrics: { revenue: 0, exposure: 0, visits: 0, orders: 0 }
      };
    }

    const sortedData = [...data].sort((a, b) => a.originalDate - b.originalDate);
    
    return {
      dateRange: {
        start: sortedData[0].date,
        end: sortedData[sortedData.length - 1].date
      },
      totalDays: data.length,
      avgMetrics: {
        revenue: data.reduce((sum, item) => sum + item.revenue, 0) / data.length,
        exposure: data.reduce((sum, item) => sum + item.exposure, 0) / data.length,
        visits: data.reduce((sum, item) => sum + item.visits, 0) / data.length,
        orders: data.reduce((sum, item) => sum + item.orders, 0) / data.length
      }
    };
  }

  /**
   * 导出处理后的数据
   */
  static exportProcessedData(data: ProcessedData[], format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['日期', '营业收入', '曝光人数', '入店人数', '入店转化率', '下单转化率', '下单人数'];
      const csvRows = [
        headers.join(','),
        ...data.map(row => [
          row.date,
          row.revenue,
          row.exposure,
          row.visits,
          (row.visitConversionRate * 100).toFixed(2) + '%',
          (row.orderConversionRate * 100).toFixed(2) + '%',
          row.orders
        ].join(','))
      ];
      return csvRows.join('\n');
    }
    
    return JSON.stringify(data, null, 2);
  }
}
