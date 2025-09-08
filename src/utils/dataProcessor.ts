/**
 * 数据处理工具函数
 */

import { ExcelDataRow, ProcessedData, StatsData, StoreInfo } from '@/types';

/**
 * 格式化日期为 MM-DD 格式
 */
export function formatDate(dateNumber: number): string {
  const dateStr = dateNumber.toString();
  if (dateStr.length !== 8) {
    throw new Error(`Invalid date format: ${dateNumber}`);
  }

  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  return `${month}-${day}`;
}

/**
 * 验证Excel数据行
 */
export function validateDataRow(row: unknown): row is ExcelDataRow {
  if (!row || typeof row !== 'object') {
    return false;
  }

  const rowObj = row as Record<string, unknown>;

  const requiredFields = [
    '日期', '门店名称', '门店id', '省份', '门店所在城市', '区县市',
    '营业收入', '曝光人数', '入店人数', '入店转化率', '下单转化率', '下单人数'
  ];

  for (const field of requiredFields) {
    if (!(field in rowObj) || rowObj[field] === null || rowObj[field] === undefined) {
      return false;
    }
  }

  // 验证数值字段
  const numericFields = ['日期', '门店id', '营业收入', '曝光人数', '入店人数', '入店转化率', '下单转化率', '下单人数'];
  for (const field of numericFields) {
    if (typeof rowObj[field] !== 'number' || isNaN(rowObj[field] as number)) {
      return false;
    }
  }

  // 验证转化率范围
  const visitConversionRate = rowObj['入店转化率'] as number;
  const orderConversionRate = rowObj['下单转化率'] as number;

  if (visitConversionRate < 0 || visitConversionRate > 1) {
    return false;
  }
  if (orderConversionRate < 0 || orderConversionRate > 1) {
    return false;
  }

  return true;
}

/**
 * 处理Excel数据
 */
export function processExcelData(rawData: ExcelDataRow[]): ProcessedData[] {
  return rawData.map(row => ({
    date: formatDate(row.日期),
    revenue: row.营业收入,
    exposure: row.曝光人数,
    visits: row.入店人数,
    visitConversionRate: row.入店转化率,
    orderConversionRate: row.下单转化率,
    orders: row.下单人数,
    originalDate: row.日期
  })).sort((a, b) => a.originalDate - b.originalDate);
}

/**
 * 计算统计数据
 */
export function calculateStats(data: ProcessedData[]): StatsData {
  if (data.length === 0) {
    return {
      totalRevenue: 0,
      totalExposure: 0,
      totalVisits: 0,
      totalOrders: 0,
      avgDailyRevenue: 0,
      avgDailyExposure: 0,
      avgVisitConversionRate: 0,
      avgOrderConversionRate: 0,
      dataCount: 0
    };
  }
  
  const totals = data.reduce((acc, item) => ({
    revenue: acc.revenue + item.revenue,
    exposure: acc.exposure + item.exposure,
    visits: acc.visits + item.visits,
    orders: acc.orders + item.orders,
    visitConversionRate: acc.visitConversionRate + item.visitConversionRate,
    orderConversionRate: acc.orderConversionRate + item.orderConversionRate
  }), {
    revenue: 0,
    exposure: 0,
    visits: 0,
    orders: 0,
    visitConversionRate: 0,
    orderConversionRate: 0
  });
  
  return {
    totalRevenue: totals.revenue,
    totalExposure: totals.exposure,
    totalVisits: totals.visits,
    totalOrders: totals.orders,
    avgDailyRevenue: totals.revenue / data.length,
    avgDailyExposure: totals.exposure / data.length,
    avgVisitConversionRate: totals.visitConversionRate / data.length,
    avgOrderConversionRate: totals.orderConversionRate / data.length,
    dataCount: data.length
  };
}

/**
 * 提取门店信息
 */
export function extractStoreInfo(rawData: ExcelDataRow[]): StoreInfo | null {
  if (rawData.length === 0) return null;
  
  const firstRow = rawData[0];
  return {
    name: firstRow.门店名称,
    id: firstRow.门店id,
    province: firstRow.省份,
    city: firstRow.门店所在城市,
    district: firstRow.区县市
  };
}

/**
 * 格式化货币
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * 格式化数字（千分位）
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('zh-CN').format(Math.round(num));
}

/**
 * 格式化百分比
 */
export function formatPercentage(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}
