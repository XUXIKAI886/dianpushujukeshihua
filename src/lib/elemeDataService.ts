/**
 * 饿了么数据服务 - 统一的数据处理接口
 */

import { ElemeExcelDataRow, ElemeProcessedData, ElemeAppState, ElemeStatsData, ElemeStoreInfo } from '@/types/eleme';

export class ElemeDataService {
  /**
   * 验证数据行
   */
  private static validateDataRow(row: unknown): row is ElemeExcelDataRow {
    return (
      row !== null &&
      typeof row === 'object' &&
      typeof (row as Record<string, unknown>).日期 === 'string' &&
      typeof (row as Record<string, unknown>).门店名称 === 'string' &&
      typeof (row as Record<string, unknown>).门店编号 === 'string' &&
      typeof (row as Record<string, unknown>).收入 === 'number' &&
      typeof (row as Record<string, unknown>).进店转化率 === 'number' &&
      typeof (row as Record<string, unknown>).下单转化率 === 'number'
    );
  }

  /**
   * 处理Excel数据
   */
  private static processExcelData(data: ElemeExcelDataRow[]): ElemeProcessedData[] {
    return data.map(row => {
      // 解析日期 "2025-10-08" -> "10-08"
      const dateParts = row.日期.split('-');
      const formattedDate = `${dateParts[1]}-${dateParts[2]}`;

      // 处理可能是字符串的数字字段
      const exposure = typeof row.曝光人数 === 'string'
        ? parseInt(row.曝光人数.replace(/,/g, ''))
        : row.曝光人数;

      const visits = typeof row.进店人数 === 'string'
        ? parseInt(row.进店人数.replace(/,/g, ''))
        : row.进店人数;

      const orders = typeof row.下单人数 === 'string'
        ? parseInt(row.下单人数.replace(/,/g, ''))
        : row.下单人数;

      return {
        date: formattedDate,
        revenue: row.收入,
        exposure: exposure,
        visits: visits,
        orders: orders,
        visitConversionRate: row.进店转化率,
        orderConversionRate: row.下单转化率,
        originalDate: row.日期
      };
    });
  }

  /**
   * 计算统计数据
   */
  private static calculateStats(data: ElemeProcessedData[]): ElemeStatsData {
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalExposure = data.reduce((sum, item) => sum + item.exposure, 0);
    const totalVisits = data.reduce((sum, item) => sum + item.visits, 0);
    const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);

    const dataCount = data.length;
    const avgDailyRevenue = totalRevenue / dataCount;
    const avgDailyExposure = totalExposure / dataCount;

    // 计算平均转化率
    const avgVisitConversionRate = data.reduce((sum, item) => sum + item.visitConversionRate, 0) / dataCount;
    const avgOrderConversionRate = data.reduce((sum, item) => sum + item.orderConversionRate, 0) / dataCount;

    return {
      totalRevenue,
      totalExposure,
      totalVisits,
      totalOrders,
      avgDailyRevenue,
      avgDailyExposure,
      avgVisitConversionRate,
      avgOrderConversionRate,
      dataCount
    };
  }

  /**
   * 提取门店信息
   */
  private static extractStoreInfo(data: ElemeExcelDataRow[]): ElemeStoreInfo {
    const firstRow = data[0];
    return {
      name: firstRow.门店名称,
      code: firstRow.门店编号
    };
  }

  /**
   * 处理Excel数据并返回完整的应用状态
   */
  static async processData(rawData: ElemeExcelDataRow[], fileName: string): Promise<Partial<ElemeAppState>> {
    try {
      // 验证数据
      const validData = rawData.filter(row => {
        if (!this.validateDataRow(row)) {
          console.warn('Invalid data row:', row);
          return false;
        }
        return true;
      });

      if (validData.length === 0) {
        throw new Error('没有找到有效的数据行');
      }

      // 处理数据
      const processedData = this.processExcelData(validData);

      // 计算统计数据
      const stats = this.calculateStats(processedData);

      // 提取门店信息
      const storeInfo = this.extractStoreInfo(validData);

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
  static validateDataIntegrity(data: ElemeExcelDataRow[]): {
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
      row.门店编号 !== firstRow.门店编号
    );

    if (inconsistentStores.length > 0) {
      warnings.push(`发现${inconsistentStores.length}行数据的门店信息不一致`);
    }

    // 检查异常数值
    const revenueValues = data.map(row => row.收入);
    const avgRevenue = revenueValues.reduce((a, b) => a + b, 0) / revenueValues.length;
    const outliers = data.filter(row =>
      row.收入 > avgRevenue * 3 || row.收入 < avgRevenue * 0.1
    );

    if (outliers.length > 0) {
      warnings.push(`发现${outliers.length}行收入数据异常`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
